# GARVEE 三站 SEO / SSR / 结构化数据 / AI 搜索就绪 审计

对 GARVEE 美国站、英国站、加拿大站测试环境的**字段级**审计。
**8 个维度、76 个字段、574 页**，每个问题给出可落地的修复值。

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

## 八个维度

1. **基础 Head** — charset、html lang、html dir、viewport、theme-color、favicon、web manifest
2. **TDK** — title（长度+唯一性）、description、keywords
3. **Canonical / Robots** — 绝对 URL + 规则目标；robots 按页面类型
4. **Hreflang** — 存在性、语言代码格式、绝对 URL、x-default
5. **社会化分享** — og:* / twitter:* 全部字段
6. **结构化数据** — 16 种类型逐节点逐字段，含 URL 绝对性、值一致性
7. **AI 搜索就绪** — llms.txt、实体节点、机器可读事实、正文可提取性、语义标签、问答结构、speakable、商品标识符、退换政策
8. **SSR 模块** — 33 个模块四态判定

## 规则依据（已按官方文档校正）

| 规则 | 来源 |
|---|---|
| Organization 无必填属性 | Google Organization 文档 |
| Article 无必填属性 | Google Article 文档（明确写 no required properties） |
| Product 必填 name/image/offers | Google Merchant listing |
| BreadcrumbList 必填 itemListElement（≥2 项） | Google Breadcrumb |
| ListItem.item 必填且须**绝对 URL** | Google Breadcrumb |
| 站内搜索框**已下线** | Google 更新 2024-11-29 |
| FAQ 富结果**已移除** | Google 更新 2026-05-07 |
| llms.txt | llmstxt.org v2（2026-08-10 更新），Chrome Lighthouse agentic browsing 已审计此项 |

**重要区分**：Google 不再奖励的类型，对 AI 回答引擎仍有价值。`FAQPage`、`speakable`、`ItemList`、`OnlineStore` 等标为「建议补充」而非缺陷。

## 主要发现

### P0 阻断项（3,939 条）

| 问题 | 页数 | 维度 |
|---|---|---|
| `BreadcrumbList` 的 `item.@id` 使用**相对路径** | 620+ | 结构化数据 |
| `html lang` 三站统一 `en`，应为 `en-US`/`en-GB`/`en-CA` | 574 | 基础 Head |
| **类目/活动/首页主区 `<main>` 源码为空**，正文全靠 JS | 452 | AI 搜索就绪 |
| `og:locale` 三站统一 `en` | 366 | 社会化分享 |
| 加参页 robots 非 `noindex,follow` | 306 | Canonical/Robots |
| 标题跨页重复 | 263 | TDK |
| `og:type` 与页面类型不符 | 118 | 社会化分享 |
| 结果数未直出 | 108 | SSR 模块 |

### 关键 SSR 缺陷

| 模块 | 问题 |
|---|---|
| 全局导航 | 530 页部分直出（源码仅 8 个链接，完整类目树靠 JS） |
| 主区正文 | 452 页源码为空（如类目页 `<main>` 0 字符，渲染后 30,342 字符） |
| 结果数 | 108 页未直出 |
| 子类目横条 | 36 页未直出 |
| 商品卡列表 | 40 页部分直出 |

### 社会化分享

| 问题 | 页数 |
|---|---|
| 缺 `og:image` / `twitter:image` | 各 540 |
| 缺 `og:url` | 214 |
| 缺 `og:site_name` | 208 |

### 结构化数据

| 问题 | 页数 | 严重度 |
|---|---|---|
| `BreadcrumbList` 相对路径 | 620+ | 值错误 |
| 首页缺 `OnlineStore` | 6 | 未处理 |
| 缺 `WebPage` | 208 | 建议补充 |
| 缺 `CollectionPage` / `ItemList` | 276 | 建议补充 |

## 文件

| 文件 | 说明 |
|---|---|
| `index.html` | 交互看板，8 维度筛选，点击看逐字段实际值、预期值与修复建议 |
| **`整改清单.xlsx`** | **完整问题明细 + 逐页汇总，带筛选、冻结首行、优先级配色（推荐）** |
| `page-issues.csv` | 完整问题明细，**16,407 行**，每行一个具体问题 |
| `page-summary.csv` | 逐页汇总，574 行，含 P0/P1/P2 计数与明细 |
| `audit-data.json` | 完整结构化数据 |

## 优先级定义

| 优先级 | 含义 | 数量 |
|---|---|---|
| **P0** | 值错误 / 未直出 —— 直接影响索引或 AI 抓取 | 3,939 |
| **P1** | 未处理 / 部分直出 —— 功能缺失或不完整 | 5,182 |
| **P2** | 建议补充 —— 非阻断但影响体验或 AI 理解 | 7,286 |

## 方法说明

- 每页同时采集原始 HTTP 源码与无头浏览器完整渲染 DOM（含滚动）
- 预期值来自官方文档与项目规则，不取自页面自身观测值
- Canonical：搜索页保留 `q`，其余页面剥离全部查询参数
- 数据缺失标为「内容为空」，不误判为技术屏蔽

## 已知边界

- 测试环境结果，不等同生产现状
- 44 页返回 4xx，为站点自身路由问题
- `BreadcrumbList` 相对路径是否为测试站有意设计（避免指向生产域名）尚未确认
- `llms.txt` 为站点级文件，需单独 GET 验证
- 未覆盖：hreflang 三站互返验证、JSON-LD 值与页面实际内容逐项比对、Core Web Vitals
