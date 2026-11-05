import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

// Business reconciliation and the matching rendered snapshot must precede emission.
export function buildAggregateRating(record, rendered) {
  for (const field of ['sourceSystem', 'sourceRecordId', 'snapshotTime', 'scopeType', 'scopeId']) {
    if (typeof record[field] !== 'string' || !record[field].trim()) throw new Error(`Missing ${field}`);
  }
  if (record.reconciled !== true) throw new Error('Rating sources have not been reconciled');
  if (!['sku', 'product', 'productGroup'].includes(record.scopeType)) throw new Error('Unknown aggregation scope');
  if (!Number.isFinite(Date.parse(record.snapshotTime))) throw new Error('Invalid snapshotTime');
  if (rendered.scopeId !== record.scopeId || rendered.scopeType !== record.scopeType) throw new Error('Rendered and business scopes differ');
  const rating = record.ratingValue;
  const low = record.worstRating;
  const high = record.bestRating;
  if (![rating, low, high].every(v => typeof v === 'number' && Number.isFinite(v)) || low >= high || rating < low || rating > high) {
    throw new Error('Invalid rating value or rating scale');
  }
  for (const field of ['ratingValue', 'bestRating', 'worstRating']) {
    if (rendered[field] !== record[field]) throw new Error(`${field}: business and rendered values differ`);
  }
  const aggregate = { '@type': 'AggregateRating', ratingValue: rating, bestRating: high, worstRating: low };
  for (const field of ['ratingCount', 'reviewCount']) {
    const value = record[field];
    if (value == null) continue;
    if (!Number.isSafeInteger(value) || value < 0) throw new Error(`${field} must be a nonnegative integer`);
    if (rendered[field] !== value) throw new Error(`${field}: business and rendered values differ`);
    if (value > 0) aggregate[field] = value;
  }
  if (!aggregate.ratingCount && !aggregate.reviewCount) throw new Error('At least one verified positive count is needed');
  if (record.reviewsRequireRating === true && aggregate.reviewCount > aggregate.ratingCount) {
    throw new Error('Reviews exceed ratings despite a declared mandatory-rating policy');
  }
  // Counts are not converted to people, and ratingCount is never inferred from reviewCount.
  return aggregate;
}

export function applyAggregateRating(graph, record, rendered) {
  const result = structuredClone(graph);
  const product = result['@graph'].find(n => n['@type'] === 'Product');
  if (!product) throw new Error('No Product node');
  if (record.productUrl !== product.url) throw new Error('Product URL differs from the verified record');
  if (record.scopeType === 'sku' && record.scopeId !== product.sku) throw new Error('SKU scope differs from Product.sku');
  if (record.scopeType === 'productGroup' && record.groupMembershipVerified !== true) {
    throw new Error('Product membership in the rating group has not been verified');
  }
  product.aggregateRating = buildAggregateRating(record, rendered);
  return result;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [graphPath, verifiedPath, renderedPath] = process.argv.slice(2);
  if (!graphPath || !verifiedPath || !renderedPath) throw new Error('Usage: node product-aggregate-rating.mjs product.jsonld verified.json rendered.json');
  const load = p => JSON.parse(fs.readFileSync(p, 'utf8'));
  process.stdout.write(JSON.stringify(applyAggregateRating(load(graphPath), load(verifiedPath), load(renderedPath)), null, 2) + '\n');
}
