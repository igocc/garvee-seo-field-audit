# GARVEE 三站 SEO / SSR / 结构化数据 / AI 搜索就绪 审计

对 GARVEE 美国站、英国站、加拿大站测试环境的**字段级**审计。
**8 个维度、80 个字段、574 页**，每个问题给出可落地的修复值和示例。

## 诊断依据

结构化数据以 **Schema.org 官方定义**为准，不以某家搜索引擎的富结果取舍为准。
只要 Schema.org 定义了该类型、且页面确实包含该内容，就纳入检查。

已核对的类型层级（schema.org，2026-10-21）：

| 类型 | 层级 |
|---|---|
| `OnlineStore` | Thing > Organization > OnlineBusiness > OnlineStore |
| `CollectionPage` | Thing > CreativeWork > WebPage > CollectionPage |
| `ItemPage` | Thing > CreativeWork > WebPage > ItemPage |
| `SearchResultsPage` | Thing > CreativeWork > WebPage > SearchResultsPage |
| `Blog` | Thing > CreativeWork > Blog |
| `BlogPosting` | Thing > CreativeWork > Article > SocialMediaPosting > BlogPosting |
| `Article` | Thing > CreativeWork > Article |
| `Product` | Thing > Product |
| `Offer` | Thing > Intangible > Offer |

## URL 规则（强制）

**所有 URL 属性必须使用绝对路径。** 相对路径一律判为「值错误」，并给出绝对路径示例。

例：

| 字段 | 当前值（错误） | 应改为 |
|---|---|---|
| `BreadcrumbList[1].item.@id` | `/` | `https://garvee-ca-test-resolve-547493248390.us-east4.run.app/` |
| `BreadcrumbList[2].item.@id` | `/blogs/buying-guides` | `https://garvee-ca-test-resolve-547493248390.us-east4.run.app/blogs/buying-guides` |

覆盖属性：`url`、`@id`、`item`、`image`、`logo`、`sameAs`、`mainEntityOfPage`、`isPartOf`、`breadcrumb`、`primaryImageOfPage`、`contentUrl`、`embedUrl`、`thumbnailUrl`、`publisher`、`author`、`seller`、`itemReviewed`、`about`、`mainEntity`、`potentialAction`、`target`、`shippingDestination`、`blogPost`。

## 页面类型应有的结构化数据

| 页面类型 | 必须有 | 建议有 |
|---|---|---|
| 首页 | `OnlineStore`、`WebSite` | `WebPage` |
| 类目页 | `CollectionPage`、`BreadcrumbList` | `ItemList`、`WebPage` |
| 搜索页 | `SearchResultsPage`、`BreadcrumbList` | `ItemList`、`WebPage` |
| 博客首页/列表 | `Blog`、`BreadcrumbList` | `CollectionPage`、`ItemList`、`WebPage` |
| 博客文章 | `BlogPosting`、`BreadcrumbList` | `WebPage`、`OnlineStore`、`Person` |
| 商品详情 | `Product`、`Offer`、`BreadcrumbList` | `ItemPage`、`AggregateRating`、`Review`、`OnlineStore`、`OfferShippingDetails`、`MerchantReturnPolicy` |
| 活动页 | `WebPage`、`BreadcrumbList` | `OnlineStore` |
| 底部页/购物车 | `WebPage` | `BreadcrumbList`、`OnlineStore` |

## 八个维度

1. **基础 Head** — charset、html lang、html dir、viewport、theme-color、favicon、web manifest
2. **TDK** — title（长度+唯一性）、description、keywords
3. **Canonical / Robots**
4. **Hreflang**
5. **社会化分享** — og:* / twitter:* 全部字段
6. **结构化数据** — 22 种类型逐节点逐字段，含绝对 URL 强制校验
7. **AI 搜索就绪** — llms.txt、实体节点、机器可读事实、正文可提取性、语义标签、问答结构、speakable、商品标识符、退换政策
8. **SSR 模块** — 33 个模块四态判定

## 主要发现

### P0 阻断项（5,573 条）

| 问题 | 条数/页数 | 维度 |
|---|---|---|
| **结构化数据 URL 使用相对路径** | **3,268 处** | 结构化数据 |
| `html lang` 三站统一 `en` | 574 | 基础 Head |
| **主区 `<main>` 源码为空** | 452 | AI 搜索就绪 |
| `og:locale` 统一 `en` | 366 | 社会化分享 |
| 加参页 robots 非 `noindex,follow` | 306 | Canonical/Robots |
| 标题跨页重复 | 263 | TDK |
| `og:type` 不符 | 118 | 社会化分享 |
| 结果数未直出 | 108 | SSR 模块 |

### 相对路径错误明细

| 字段 | 次数 |
|---|---|
| `ListItem.item.@id` | 1,634 |
| `BreadcrumbList[1].item.@id` | 620 |
| `BreadcrumbList[2].item.@id` | 620 |
| `BreadcrumbList[3].item.@id` | 274 |
| `BreadcrumbList[4].item.@id` | 120 |

### 结构化数据缺失

| 类型 | 页数 | 严重度 |
|---|---|---|
| `OnlineStore` | 6（首页） | 未处理 |
| `WebSite` | 6（首页） | 未处理 |
| `Blog` | 18（博客页） | 未处理 |
| `BlogPosting` | 28（文章页） | 未处理 |
| `SearchResultsPage` | 72（搜索页） | 未处理 |
| `CollectionPage` | 276（类目页） | 建议补充 |
| `ItemList` | 276 | 建议补充 |
| `WebPage` | 556 | 建议补充/未处理 |

### SSR 缺陷

| 模块 | 问题 |
|---|---|
| 全局导航 | 530 页部分直出（源码仅 8 个链接） |
| 主区正文 | 452 页源码为空（类目页 `<main>` 0 字符，渲染后 30,342 字符） |
| 结果数 | 108 页未直出 |
| 子类目横条 | 36 页未直出 |
| 商品卡列表 | 40 页部分直出 |

## 文件

| 文件 | 说明 |
|---|---|
| `index.html` | 交互看板，8 维度筛选 |
| **`整改清单.xlsx`** | **完整问题明细 + 逐页汇总，带筛选与优先级配色（推荐）** |
| `page-issues.csv` | 完整问题明细，**18,879 行** |
| `page-summary.csv` | 逐页汇总，574 行 |
| `audit-data.json` | 完整结构化数据 |

## 优先级

| 优先级 | 含义 | 数量 |
|---|---|---|
| **P0** | 值错误 / 未直出 | 5,573 |
| **P1** | 未处理 / 部分直出 | 5,810 |
| **P2** | 建议补充 | 7,496 |

## 方法

- 每页采集原始 HTTP 源码 + 无头浏览器完整渲染 DOM（含滚动）
- 预期值来自 Schema.org 官方定义与项目规则，不取自页面自身观测值
- Canonical：搜索页保留 `q`，其余页面剥离全部查询参数
- 数据缺失标为「内容为空」，不误判为技术屏蔽

## 已知边界

- 测试环境结果，不等同生产现状
- 44 页返回 4xx，为站点自身路由问题
- `llms.txt` 为站点级文件，需单独 GET 验证
- 未覆盖：hreflang 三站互返验证、JSON-LD 值与页面实际内容逐项比对、Core Web Vitals
