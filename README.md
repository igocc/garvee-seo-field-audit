# GARVEE 三站 SEO / GEO 分轨审计

对 GARVEE 美国站、英国站、加拿大站测试环境的字段级审计。
**SEO 与 GEO 拆成两条独立赛道**，各自有独立的证据和判定标准。

## 为什么拆开

| 赛道 | 回答的问题 | 证据 |
|---|---|---|
| **SEO** | 搜索引擎能否抓取、索引、排名 | meta 标签、canonical、robots、hreflang、结构化数据、服务端直出 HTML |
| **GEO** | 生成式答案引擎能否读懂、信任、引用 | 内容可提取性、事实密度、答案结构、实体清晰度、可引用性、语义结构 |

共有的东西（如 title、结构化数据）**不在两条赛道重复计分**：它们归 SEO，GEO 只在“能否被引用”这个不同的问题上单独判定。

## 覆盖

**604 页** = 302 基础页 + 302 个 `?12345` 加参探测页

| 页面类型 | 数量 | 内容 |
|---|---|---|
| 首页 | 3 | 三站根路径 |
| 商品详情 | 15 | 从商品 sitemap 抽样，覆盖不同品类 |
| 类目 L1/L2/L3 | 120 | 2 个完整体系，每级含默认/排序/翻页/筛选 |
| 搜索 | 36 | 3 关键词 × 4 状态 |
| 底部页 | 57 | About、Terms、Privacy、Shipping、Refund、Affiliate、Warranty、Wholesale 等 |
| 短期活动 | 36 | 所有 `/pages/activity-*` |
| 常规活动 | 9 | new-arrivals、best-sellers、flash-deals、clearance-sale |
| 博客首页/列表/文章 | 23 | `/pages/diy-ideas`、列表页、真实文章 |

## 结构化数据依据：Schema.org 官方

不以某家搜索引擎的富结果取舍为准。已核对类型层级：

| 类型 | 层级 |
|---|---|
| `OnlineStore` | Thing > Organization > OnlineBusiness > OnlineStore |
| `CollectionPage` | Thing > CreativeWork > WebPage > CollectionPage |
| `ItemPage` | Thing > CreativeWork > WebPage > ItemPage |
| `SearchResultsPage` | Thing > CreativeWork > WebPage > SearchResultsPage |
| `Blog` | Thing > CreativeWork > Blog |
| `BlogPosting` | Thing > CreativeWork > Article > SocialMediaPosting > BlogPosting |
| `Product` | Thing > Product |
| `Offer` | Thing > Intangible > Offer |

### URL 必须绝对路径（强制）

所有 URL 属性用相对路径一律判为「值错误」，并给出绝对路径示例：

| 字段 | 当前值（错误） | 应改为 |
|---|---|---|
| `BreadcrumbList[1].item.@id` | `/` | `https://<测试域名>/` |
| `BreadcrumbList[2].item.@id` | `/blogs/buying-guides` | `https://<测试域名>/blogs/buying-guides` |

覆盖属性：`url`、`@id`、`item`、`image`、`logo`、`sameAs`、`mainEntityOfPage`、`isPartOf`、`breadcrumb`、`primaryImageOfPage`、`contentUrl`、`embedUrl`、`thumbnailUrl`、`publisher`、`author`、`seller`、`itemReviewed`、`about`、`mainEntity`、`potentialAction`、`target`、`shippingDestination`、`blogPost`。

## 页面类型应有的结构化数据

| 页面 | 必须有 | 建议有 |
|---|---|---|
| 首页 | `OnlineStore`、`WebSite` | `WebPage` |
| 类目页 | `CollectionPage`、`BreadcrumbList` | `ItemList`、`WebPage` |
| 搜索页 | `SearchResultsPage`、`BreadcrumbList` | `ItemList`、`WebPage` |
| 博客首页/列表 | `Blog`、`BreadcrumbList` | `CollectionPage`、`ItemList`、`WebPage` |
| 博客文章 | `BlogPosting`、`BreadcrumbList` | `WebPage`、`OnlineStore`、`Person` |
| 商品详情 | `Product`、`Offer`、`BreadcrumbList` | `ItemPage`、`AggregateRating`、`Review`、`OnlineStore`、`OfferShippingDetails`、`MerchantReturnPolicy` |

## 主要发现

### SEO（16,982 条）

| 问题 | 条数 | 优先级 |
|---|---|---|
| 结构化数据 URL 使用相对路径 | 3,522 | P0 |
| `html lang` 三站统一 `en` | 604 | P0 |
| `og:locale` 统一 `en` | 366 | P0 |
| 加参页 robots 非 `noindex,follow` | 321 | P0 |
| 标题跨页重复 | 278 | P0 |
| `og:type` 不符 | 118 | P0 |
| 结果数未直出 | 108 | P0 |
| 缺 `og:image` / `twitter:image` | 各 540 | P1 |

### GEO（3,286 条）

| 问题 | 页数 | 优先级 |
|---|---|---|
| **主区 `<main>` 源码为空** | 408 | P0 |
| `llms.txt` 缺失 | 604 | P1 |
| 缺实体节点（Organization/OnlineStore） | 556 | P2 |
| 缺 `speakable` | 604 | P2 |
| 缺问答结构 | 604 | P2 |
| 语义标签不完整 | 304 | P2 |

### 商品详情页（本次新增覆盖）

| 模块 | 判定 |
|---|---|
| 主图与缩略图 | 28/30 正确，2 页未直出 |
| 评分与评论数 | 28/30 正确 |
| 价格区 | 15 正确，15 部分直出（源码价格数量少于渲染后） |
| 库存与送达 | 30/30 正确 |
| 保障方案 | 30/30 正确 |
| 信任保障图标 | 20 正确，10 空 |
| Security & Privacy 弹窗 | 30/30 正确 |
| Key Features | 12 正确，6 未直出，12 空 |
| Description 正文 | 20 正确，10 未直出 |
| **关联推荐（3 个模块）** | **各 10 页未直出** |
| **商品结构化数据 `Product`** | **15 页全部缺失** |

## 文件

| 文件 | 说明 |
|---|---|
| `index.html` | 交互看板，可按赛道/维度/市场/类型筛选 |
| **`整改清单.xlsx`** | **三个工作表：SEO问题、GEO问题、逐页汇总（推荐）** |
| `page-issues.csv` | 完整问题明细，20,268 行，含赛道列 |
| `page-summary.csv` | 逐页汇总，604 行 |
| `audit-data.json` | 完整结构化数据 |

## 优先级

| 优先级 | 含义 | 数量 |
|---|---|---|
| **P0** | 值错误 / 未直出 | 6,081 |
| **P1** | 未处理 / 部分直出 | 6,095 |
| **P2** | 建议补充 | 8,092 |

## 方法

- 每页采集原始 HTTP 源码 + 无头浏览器完整渲染 DOM（含滚动）
- 4xx 页面不做内容评估，只判状态码与 canonical/robots
- 价格用「货币符号+数字」识别，不依赖 class 名
- 数据缺失标为「内容为空」，不误判为技术屏蔽

## 已知边界

- 测试环境结果，不等同生产现状
- 44 页返回 4xx，为站点自身路由问题
- `llms.txt` 为站点级文件，需单独 GET 验证
- 未覆盖：hreflang 三站互返验证、JSON-LD 值与页面实际内容逐项比对、Core Web Vitals
