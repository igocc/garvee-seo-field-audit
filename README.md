# GARVEE 三站 SEO / GEO 整改清单（模块 → 明细）

对 GARVEE 美国站、英国站、加拿大站测试环境的审计，**SEO 与 GEO 分两条赛道**。
报告按「模块 → 明细」两级组织，不再按数组下标把同类问题拆散。

## 组织方式

```
38 个问题模块  →  20,144 条明细
```

例如面包屑的相对路径问题，过去会输出成
`BreadcrumbList[1].item.@id`、`BreadcrumbList[2].item.@id`… 数百行；
现在聚合为**一个模块**「导航 · BreadcrumbList（面包屑）」，展开后才是逐条明细。

## 代码规则（按你的要求）

| 元素状态 | 输出 |
|---|---|
| **未处理**（源码没有） | 给出**可直接复制的示例代码** |
| **值错误**（有值但错） | 只给**校验结果**与正确值，不给示例 |
| **未直出 / 部分直出** | 给出模块名与服务端需补的内容 |

示例：hreflang 缺失时，直接生成该页面对应的六市场互指代码。

## Hreflang：六市场互指

依据站点现有标记与会话确认：

| 代码 | 站点 |
|---|---|
| `en-US` | https://www.garvee.com |
| `en-GB` | https://garvee.co.uk |
| `en-CA` | https://www.garvee.ca |
| `de-DE` | https://www.garvee.de |
| `es-ES` | https://www.garvee.es |
| `it-IT` | https://garvee.it |
| `x-default` | 指向美国站同页 |

规则：当其它站点存在同样的分类页或商品页时，本页必须完整声明全部市场互指。

## 覆盖

**604 页** = 302 基础页 + 302 个 `?12345` 加参探测页

| 页面类型 | 数量 |
|---|---|
| 首页 | 3 |
| 商品详情 | 15 |
| 类目 L1/L2/L3 | 120 |
| 搜索 | 36 |
| 底部页 | 57 |
| 短期活动 | 36 |
| 常规活动 | 9 |
| 博客首页/列表/文章 | 23 |

## 模块级清单（P0 共 18 个）

| 优先级 | 模块 | 影响页数 | 条数 |
|---|---|---|---|
| P0 | 基础Head | 604 | 3,020 |
| P0 | 社会化分享 | 604 | 2,776 |
| P0 | Canonical/Robots | 604 | 925 |
| P0 | Hreflang | 604 | 612 |
| P0 | 导航 · BreadcrumbList（面包屑） | 598 | 5,682 |
| P0 | AI搜索就绪 | 560 | 3,286 |
| P0 | TDK | 510 | 760 |
| P0 | SSR · 结果数 | 108 | 108 |
| P0 | SSR · 商品卡列表 | 46 | 46 |
| P0 | SSR · 带图标的子类目横条 | 36 | 36 |
| P0 | SSR · Description 正文 | 10 | 10 |
| P0 | SSR · 首页轮播 Banner | 10 | 10 |
| P0 | SSR · Compare with Similar Items | 10 | 10 |
| P0 | SSR · Best Sellers in This Category | 10 | 10 |
| P0 | SSR · People Who Bought This Item Also Bought | 10 | 10 |
| P0 | SSR · 类目底部文本描述 | 8 | 8 |
| P0 | SSR · Key Features | 6 | 6 |
| P0 | SSR · 主图与缩略图 | 2 | 2 |

## 结构化数据依据

以 **Schema.org 官方定义**为准，不以某家搜索引擎的富结果取舍为准。

**URL 必须绝对路径**，相对路径一律判错并给出绝对形式：

| 字段 | 当前（错） | 应改为 |
|---|---|---|
| `BreadcrumbList[1].item.@id` | `/` | `https://<域名>/` |
| `BreadcrumbList[2].item.@id` | `/blogs/buying-guides` | `https://<域名>/blogs/buying-guides` |

## 文件

| 文件 | 说明 |
|---|---|
| `index.html` | 交互看板：模块列表 → 点击展开明细，含可复制代码 |
| **`整改清单.xlsx`** | **三个工作表：①模块汇总 38 行 / ②完整明细 20,144 行 / ③逐页汇总 604 行** |
| `module-summary.csv` | 模块汇总 |
| `detail-issues.csv` | 完整明细，含代码列 |
| `page-summary.csv` | 逐页汇总 |
| `modules.json` / `modules.js` | 看板数据 |

## 已知边界

- 测试环境结果，不等同生产现状
- 44 页返回 4xx，为站点自身路由问题；错误页只判标题与 robots
- `llms.txt` 为站点级文件，需单独 GET 验证
- 未覆盖：hreflang 三站互返的**实际抓取验证**（当前按标记判定）、JSON-LD 值与页面实际内容逐项比对、Core Web Vitals
