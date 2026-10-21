# GARVEE 三站 SEO / SSR / 结构化数据字段级审计

对 GARVEE 美国站、英国站、加拿大站测试环境的**字段级**审计。
7 个维度、64 个字段、574 页，每个问题给出可落地的修复值。

## 覆盖

**574 页** = 287 基础页 + 287 个 `?12345` 加参探测页

| 页面类型 | 内容 |
|---|---|
| 首页 | 三站根路径 |
| 底部页 | About、Terms、Privacy、Shipping、Refund、Affiliate、Warranty、Wholesale 等 |
| 短期活动 | 所有 `/pages/activity-*` |
| 常规活动 | new-arrivals、best-sellers、flash-deals、clearance-sale |
| 博客 | 首页 `/pages/diy-ideas`、列表页、真实文章页 |
| 购物车 | `/cart` |
| 搜索 | 3 关键词 × 默认/排序/翻页/筛选 |
| 类目 | 2 个完整一级体系，L1 → L2 → L3，每级含四态 |

## 规则依据（已按官方文档校正）

| 规则 | 来源 | 说明 |
|---|---|---|
| Organization 无必填属性 | Google Organization 文档 | 全部为推荐项 |
| Article 无必填属性 | Google Article 文档 | 当前明确写「no required properties」 |
| Product 必填 name/image/offers | Google Merchant listing | — |
| BreadcrumbList 必填 itemListElement，至少 2 项 | Google Breadcrumb | — |
| ListItem.item 必填且须绝对 URL | Google Breadcrumb | 相对路径会被忽略 |
| **站内搜索框已下线** | Google Search 更新 2024-11-29 | 不再推荐 `SearchAction` |
| **FAQ 富结果已移除** | Google Search 更新 2026-05-07 | 缺 FAQPage 不算缺陷 |
| ItemList / CollectionPage / SearchResultsPage / WebPage | Schema.org | 非 Google 富结果类型，缺失标为「建议补充」 |

## 七个维度

1. **基础 Head** — charset、html lang、html dir、viewport、theme-color、favicon、web manifest
2. **TDK** — title（长度+唯一性）、description（长度）、keywords
3. **Canonical / Robots** — 绝对 URL + 规则目标；robots 按页面类型
4. **Hreflang** — 存在性、语言代码格式、绝对 URL、x-default
5. **社会化分享** — og:type/title/description/site_name/locale/url/image/image:alt/尺寸、twitter:card/image
6. **结构化数据** — 16 种类型逐节点逐字段，含 URL 绝对性、值一致性
7. **SSR 模块** — 33 个模块四态判定

## 主要发现

### 结构化数据
| 问题 | 页数 | 严重度 |
|---|---|---|
| `BreadcrumbList` 的 `item.@id` 使用相对路径 | 620+ | 值错误（Google 会忽略） |
| 首页缺 `OnlineStore` | 6 | 未处理 |
| 缺 `WebPage` | 208 | 建议补充 |
| 缺 `CollectionPage` / `ItemList` | 276 | 建议补充 |
| 缺 `SearchResultsPage` | 72 | 建议补充 |

### 社会化分享
| 问题 | 页数 |
|---|---|
| 缺 `og:image` | 540 |
| 缺 `twitter:image` | 540 |
| `og:locale` 三站统一 `en`，未按市场区分 | 366 |
| 缺 `og:url` | 214 |
| 缺 `og:site_name` | 208 |
| `og:type` 与页面类型不符 | 118 |

### 基础 Head
| 问题 | 页数 |
|---|---|
| `html lang` 三站统一 `en`，应为 `en-US`/`en-GB`/`en-CA` | 574 |
| favicon 仅 `/favicon.ico`，缺 apple-touch-icon / 多尺寸 / manifest | 530 |
| `viewport` 含 `user-scalable=no`（WCAG 1.4.4） | 530 |

### Canonical / Robots
| 问题 | 页数 |
|---|---|
| 缺 canonical | 568 |
| 加参页 robots 非 `noindex,follow` | 306 |

### SSR 模块
| 模块 | 问题 |
|---|---|
| 全局导航 | 530 页部分直出（源码仅 8 个链接，完整类目树靠 JS） |
| 结果数 | 108 页未直出 |
| 子类目横条 | 36 页未直出 |
| 商品卡列表 | 40 页部分直出 |
| 楼层板块 | 36 页部分直出 |
| 首页 Banner | 10 页未直出 |

## 文件

| 文件 | 说明 |
|---|---|
| `index.html` | 交互看板，按维度/市场/类型筛选，点击看逐字段实际值与修复建议 |
| `action-plan.csv` | 逐页汇总（262 KB） |
| `field-issues.csv` | 字段级明细，14,405 行（4.2 MB） |
| `audit-data.json` | 完整结构化数据 |

## 方法说明

- 每页同时采集原始 HTTP 源码与无头浏览器完整渲染 DOM（含滚动）
- 预期值来自官方文档与项目规则，不取自页面自身观测值
- Canonical：搜索页保留 `q`，其余页面剥离全部查询参数
- 加参页 robots 必须 `noindex,follow`
- 数据缺失标为「内容为空」，不误判为技术屏蔽

## 已知边界

- 测试环境结果，不等同生产现状
- 44 页返回 4xx，为站点自身路由问题
- `BreadcrumbList` 用相对路径是否为测试站有意设计（避免指向生产域名）尚未确认
- 未覆盖：hreflang 三站互返验证、JSON-LD 值与页面实际内容（价格/评分）逐项比对、Core Web Vitals
