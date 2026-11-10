# GARVEE 页面类型 JSON-LD 复查版

本版提供 27 页完整代码及 1 个商品保守版，含首页；没有部署到 GARVEE 官网。按官方指南 → 页面模型 → 渲染/交互事实 → 明确缺口 → 验证的顺序复查，不把词汇支持或验证器通过当成真实业务证明。

## 本版核对范围

- 27/27 页有渲染证据；首页一级导航/品牌补充历史实测来源。补齐联系、服务条款、隐私、配送、退货页的证据。原始响应、渲染 DOM 和交互展开证据分别保存。
- 3,133 条已输出属性路径，附字段含义、当前值、来源、证据级别、建议值类型和所需业务值。97 项字段字典、69 条逐页数据要求；见 `逐页字段数值复查与补数要求.xlsx`。
- Schema 全量库为 49 类（含条件类型）、3,454 条继承属性记录；它不是全页必填清单。
- 本地类型/属性所属类型检查无问题；另有 1085 次已解析嵌套/引用实体的建议 range 继承检查，无不匹配。未称完整闭合语义验证；引用实体、字面量、事实、Google 功能资格仍按上下文审查。
- 官方资料 30 入口中 29 个 HTTP200；旧 carousel-beta 地址 404，明确不作为已取得指导正文。有效 carousel 指南另有当前 200 来源。来源完整性核对无 SHA 不一致。

## 共享实体与面包屑

Google Organization 指南不要求每页完整重复组织。WebSite 网站名称定义部署在域/子域首页；support.garvee.com/ 是独立子域首页，可定义自己的 WebSite。主站首页 `code/homepage.html` 已新增10个真实购物轮播VideoObject，以WebPage.hasPart关联；19项ItemList仍为一级分类导航。原始四根节点首页及其回执单独留档，当前代码已变化，不能沿用旧验证结论。视频文件、实际封面和容器时长已核，首次发布日期uploadDate仍须CMS提供，详见 `首页视频字段与补数.md`。导航列表不是商品清单；SearchAction不再对应Google已退役的站点链接搜索框。

介绍/联系页保留完整组织；会员/退货/支付页包含相应所属组织关系；服务和文章页按 provider/publisher 用精简 Organization；其他页使用稳定 @id 关联。完整品牌配置 `shared/site-identity.jsonld` 是配置与首页基准，不是要求逐页粘贴的模块。外部 @id 用于稳定关联，不保证验证器会自动抓取首页补全实体。

类目官网当前未呈现面包屑，但新示例按真实首页→一级Rugs关系提供推荐目标BreadcrumbList；应同步实现可见导航。这是目标示例，不冒称已抽取现有组件，不能借用PDP路径。默认不输出全页商品详情。真实六问FAQ和单独Best Sellers区块列表的可选模块、来源与媒体建议见 `页面类型建议与来源.md`。PDP 的两套响应式路径中按 body.innerText 对应链选择，去掉隐藏版本多出的 Products 层。末级可以是父类目，不强行追加当前商品。联系页按真实 Home → Customer Service 导航取值。

## 本轮修正

1. 会员积分改成 QuantitativeValue：Bronze/Silver/Gold/Diamond 每消费 USD 1 分别 1/2/3/5 积分；400/1200/2400 pts 门槛保留来源，累计周期仍需业务确认。
2. 支付政策按真实正文列 PayPal、Visa、MasterCard、Klarna，并保留 Klarna 的美国居民资格；采用 Organization.acceptedPaymentMethod，不误用仅 LocalBusiness 域的 paymentAccepted。
3. 保修 12 MON；延保计划仅声明额外 6–12 MON 范围及资格/注册/条款限制，不据此推每个 SKU 的实际期限。
4. 隐私政策实际 Last updated 规范为 2026-09-09；配送页 UPDATED 为 2025-06-28。无时间级证据时不造时间/时区。
5. 历史核对曾覆盖类目84/活动204个卡片价格。当前类目默认移除Product/Offer并集，可选ItemList只示范真实Best Sellers区块的URL/名称/位置；活动204和文章卡片36/12仍是加载快照，不是全库或库存。
6. seller 不再按站点品牌一律推为 GARVEE。合同卖方须按商品商家主数据确认；品牌和组织发布方不是 seller 的替代证据。
7. 商品描述改为可见 Key Features；分类对齐本页可见导航；旧元数据中的 NewCondition 缺可见证明，暂省略。32.4 lb 的净重/包装范围及两张表 Tufted/Flat Woven 冲突仍须业务核实。
8. 文章旧元数据有 yang yu，但正文无署名，已省略 author；要求 CMS 提供真实署名和作者页。文章完整正文与渲染文本连续词序核对，内联标签引起的标点空白差异不误判为内容缺失。
9. 嵌入 FAQ 使用 WebPageElement + Question/Answer；独立官方 FAQ 用 FAQPage。这是项目语义建模选择，非 Schema 禁令。Google FAQ 富结果已移除，不能据 Schema 有效承诺展示。
10. 首页10条轮播视频已进入主示例。初始DOM会漏掉延迟组件，已补原始组件配置、滚动后的4个活动播放器和全部预览图、10个文件/封面HTTP及容器时长证据。首次发布日期、独立简介与创作者未猜填，Google视频必填仍有缺口。

## 商品汇总评价必须单独对齐

- `ratingValue`：平均分。`ratingCount`：评分条数，含不含无文评分须按平台口径；不自动是去重人数。`reviewCount`：评论条数；二者不能互填。`bestRating`/`worstRating`：量表上下限。
- 可见 4.77/200 Reviews；原 JSON-LD reviewCount 166；展示比例 69.5/18.5/4/1/7% 对应加权均值 4.425。必须由评价 API 统一商品/商品组/变体、审核/导入、时间及分布口径，不能任选一组。
- `code/product.*` 保留 5 条真实评论样本，未伪造 aggregateRating；这些评论不等于总数。Google 历史完整评论版有无效评价摘要；保守版 `code/product-google-ready.*` 暂移除评论/汇总，不表示评价问题已修复。
- `templates/product-aggregate-rating.mjs` 为实际可运行的完整接入模块。`product-rating-input.json` 与 `product-rating-rendered-input.json` 是待填输入，不是可上线 JSON-LD。未核对/缺值/范围不符/前端与业务值不一致会拒绝输出；不会默认用 200 或 166。
- 接入命令：`node templates/product-aggregate-rating.mjs code/product.jsonld verified.json rendered.json > product-with-verified-ratings.jsonld`。需要真实源系统/记录/快照、范围 ID、与显示一致的平均分/量表，及至少一个可信正计数。真实评价/评分条数分别传入；去重人数是业务指标，不自造 Schema 属性。
- 商品 Q&A=0、独立评论页只有标题，分别按零内容/空页处理，不搬其他页问答或评论。

## 业务数据限制

会员价 115.20 USD、128 积分尚缺实际等级/资格/舍入映射；普通价 127.99 不能被会员价覆盖。运费/处理/运输时间、目的地及排除州须物流源统一；FAQ 2–4、Express3–5、Truck7–10/10–15不能混为同一服务。组织退货链接是 Google Option B，不误报必须补 Option A 全部字段；如果展开细节或 SKU 例外才需要相应政策主数据。总部不是退货点或门店。客服 PST 与无障碍回拨 EST 分别保留。

活动奖励 $30/$35/up to$80、限时条件和活动结束日未证实；不造 Event。B2B 的量级优惠依批准账户/合资格 SKU，不自动生成通用报价。作者、变体、GTIN/MPN、价格失效日等只用实际主数据。文章嵌入视频与首页购物视频轮播均不自动变成专用watch page；首页10条视频缺首次发布日期，不能宣称Google视频富结果已达标。

## 在线验证与历史基准

当前完整 HTML 与回执 SHA256 一致的在线回执 0/56：Google 0/28，Schema 0/28。首页新增视频后原始两份回执也已过期，当前所有版本均待新测。完整清单见 `review/validation-freshness.json`。本轮变更使旧回执过期，不以旧结果装作新代码已通过。在线服务仍受访问限制，未形成新的有效代码模式回执。

旧版 11 页 Schema 0 错误/0 警告、27 份 Google 代码测试保存在 validation/，只是历史。新回执存放在对应 `*-current` 目录。本地检查、来源核对和可访问页面不替代在线代码模式；上线后 URL 模式另行验收。

## 文件与验收

`index.html` 按页可搜索、展开完整代码和本页补数表。`页面实现与验收清单.xlsx` 只有一个工作表、27 行、最终确认列真正留空。详细来源、数值、缺口和字典放在支持工作簿/CSV/JSON。`review/baseline/` 是改前留档，不作为本版通过证据。所有重要数据生产中应与正文同源，在首个完整 SSR HTML 输出并动态同步；静态示例中的价格库存不是长期常量。包内 `package-files.json` 提供文件哈希。


## 2026-11-10 补数区更新

69项补数要求均有现状判定、字段含义、来源和完整中文取值模板。以 `review/gap-guidance.json`、`review/gap-status.csv` 和 `补数状态与完整模板.xlsx` 为本次补数区入口。模板中的【提取：…】说明取什么、从哪里取、输出何种类型；数值占位用字符串承载说明，接入时必须换为真实Number/Integer，未替换不可上线。它们不计入原28份真实代码的在线验证槽位。

本次26页完成当前DOM回读，支付政策返回403；未遍历全部折叠/懒加载内容，未取得后台主数据。完整范围见 `review/gap-live-recheck.json`。商品当前页首、评论区和JSON-LD均为166条/4.77分，历史200/166计数冲突不再作为当前结论；均分口径仍待API核验，编织规格Tufted/Flat Woven冲突仍存在。历史代码、来源工作簿与上文数值保留其2026-11-04至05快照身份。


## GitHub 公开发布

资料入口：https://igocc.github.io/garvee-seo-field-audit/schema-examples/ 。这是文档与示例公开发布，不是向 GARVEE 官网部署。

[下载公开交付包](https://igocc.github.io/garvee-seo-field-audit/schema-examples/downloads/GARVEE_JSONLD_examples_reviewed_20261105_public.zip)。27 页完整代码（含首页）、商品保守版及可选增强模块与本地复查版逐字节一致；工作簿、字段映射、数据要求及官方来源一并提供。

公开取证文件是去除浏览器运行信息、脚本、表单值和跟踪参数后的摘录，不冒称原始响应。原始证据与公开摘录的哈希对照见 public-evidence-provenance.json；原始完整 HTML、截图和运行记录本地归档。来源审查中的原始哈希针对原始文件，公开包文件哈希另见 package-files.json。原验证码入口、浏览器任务信息、本机路径及记忆记录不发布。

历史验证回执只对应历史字节；本版在线双验证尚未完成，评分及业务数据缺口仍然有效。
