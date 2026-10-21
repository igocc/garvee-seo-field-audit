# GARVEE 三站 SEO / SSR / 结构化数据审计

对 GARVEE 美国站、英国站、加拿大站测试环境的**字段级**审计。
七个维度逐项校验，每个问题给出可落地的修复值。

## 覆盖

**574 个页面** = 287 基础页 + 287 个 `?12345` 加参探测页

| 页面类型 | 内容 |
|---|---|
| 首页 | 三站根路径 |
| 底部页 | About、Terms、Privacy、Shipping、Refund、Affiliate、Warranty、Wholesale 等全部链接 |
| 短期活动 | 所有 `/pages/activity-*` |
| 常规活动 | new-arrivals、best-sellers、flash-deals、clearance-sale |
| 博客 | 首页 `/pages/diy-ideas`、列表页、真实文章页 |
| 购物车 | `/cart` |
| 搜索 | 3 个关键词 × 默认/排序/翻页/筛选 |
| 类目 | 2 个完整一级体系，L1 → L2 → L3，每级含默认/排序/翻页/筛选 |

## 七个检查维度（64 个字段）

### 1. 基础 Head
`charset` · `html lang` · `html dir` · `viewport` · `theme-color` · `favicon` · `web manifest`

### 2. TDK
`title`（长度/唯一性）· `description`（长度）· `keywords`

### 3. Canonical / Robots
`canonical`（绝对 URL + 规则目标）· `robots`（按页面类型）

### 4. Hreflang
存在性 · 语言代码格式 · 绝对 URL · `x-default`

### 5. 社会化分享
`og:type` · `og:title` · `og:description` · `og:site_name` · `og:locale` · `og:url` ·
`og:image` · `og:image:alt` · 尺寸声明 · `twitter:card` · `twitter:image`

### 6. 结构化数据（逐节点逐字段）
`OnlineStore` · `Organization` · `WebSite` · `WebPage` · `BreadcrumbList` · `ListItem` ·
`Article` · `Product` · `Offer` · `AggregateRating` · `ItemList` · `CollectionPage` · `SearchResultsPage` · `Person`

每个类型检查：必填属性、推荐属性、**URL 是否绝对路径**、值与 canonical/H1 是否一致。

### 7. SSR 模块直出（33 个模块）
| 判定 | 含义 |
|---|---|
| 未直出 | 源码没有、渲染后有 —— 真实缺陷 |
| 部分直出 | 源码有但不完整 |
| 正确 | 源码完整直出 |
| 内容为空 | 源码和渲染后都没有 —— 数据缺失，非技术故障 |

## 主要发现

### 结构化数据
| 问题 | 页数 |
|---|---|
| `BreadcrumbList` 的 `item.@id` 使用相对路径（非绝对 URL） | 620+ |
| 类目/列表页缺 `CollectionPage` | 276 |
| 类目/列表页缺 `ItemList` | 276 |
| 首页缺 `OnlineStore` | 34 |
| 缺 `WebPage` | 208 |
| 缺 `SearchResultsPage`（搜索页） | 72 |

### 社会化分享
| 问题 | 页数 |
|---|---|
| 缺 `og:image` | 540 |
| 缺 `twitter:image` | 540 |
| `og:locale` 三站统一输出 `en`，未按市场区分 | 366 |
| 缺 `og:site_name` | 208 |
| 缺 `og:url` | 214 |
| `og:type` 与页面类型不符 | 118 |

### 基础 Head
| 问题 | 页数 |
|---|---|
| `html lang` 三站统一 `en`，应为 `en-US`/`en-GB`/`en-CA` | 574 |
| favicon 仅一个 `/favicon.ico`，缺 apple-touch-icon / 多尺寸 / manifest | 530 |
| `viewport` 含 `user-scalable=no`（WCAG 问题） | 530 |

### Canonical / Robots
| 问题 | 页数 |
|---|---|
| 缺 canonical | 568 |
| 加参页 robots 非 `noindex,follow` | 306 |

### SSR
| 模块 | 问题 |
|---|---|
| 导航 | 530 页部分直出（源码仅 8 个链接，完整类目树靠 JS） |
| 结果数 | 108 页未直出 |
| 子类目横条 | 36 页未直出 |
| 首页 Banner | 10 页未直出 |

## 文件

- `index.html` — 交互看板，可按维度/市场/类型筛选，点击查看逐字段实际值与修复建议
- `action-plan.csv` — 逐页汇总（248 KB）
- `field-issues.csv` — 字段级明细，12,699 行（3.7 MB）
- `audit-data.json` — 完整结构化数据

## 方法说明

- 每页同时采集原始 HTTP 源码与无头浏览器完整渲染 DOM（含滚动）
- 预期值来自项目确认规则与 Schema.org / Google 规范，不取自页面自身观测值
- Canonical：搜索页保留 `q`，其余页面剥离全部查询参数
- 加参页 robots 必须 `noindex,follow`
- 数据缺失标为「内容为空」，不误判为技术屏蔽

## 已知边界

- 测试环境结果，不等同生产现状
- 44 个页面返回 4xx，为站点自身路由问题
- `BreadcrumbList` 使用相对路径是否为测试站有意设计（避免指向生产域名）尚未确认
- 未覆盖：hreflang 三站互返验证、JSON-LD 值与页面实际内容（价格/评分）的逐项比对、Core Web Vitals
