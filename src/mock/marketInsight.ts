// 新品灵感洞察器（洞察期/市场分析）Mock数据

// 顶层状态
export let hasData = true // 可通过函数修改，用于切换空态/有数据态

export const setHasData = (value: boolean) => {
  hasData = value
}

// KPI卡片（4项）
export interface KPICard {
  label: string
  value: number | string
  unit?: string
  trend?: 'up' | 'down' | 'stable'
}

export const kpiCards: KPICard[] = [
  {
    label: '品类新品总GMV',
    value: 3000000,
    unit: '元',
    trend: 'up'
  },
  {
    label: 'CR3',
    value: 7.8,
    unit: '%',
    trend: 'up'
  },
  {
    label: 'CR5',
    value: 12.4,
    unit: '%',
    trend: 'down'
  },
  {
    label: '长尾指数',
    value: 76.4,
    unit: '%',
    trend: 'stable'
  }
]

// 灵感卡片
export interface IdeaCard {
  id: string
  title: string
  tags: string[]
  bullets: string[]
  metrics: {
    score: number // 综合分/机会分
    gmvShare: number // GMV份额
    spuShare: number // SPU占比
    gapIndex?: number // gap指数
  }
  actions: string[]
}

export const ideaCards: IdeaCard[] = [
  {
    id: 'idea-1',
    title: '亲子家庭 × 39–69元 × 优酸乳 250mL×12（乳酸菌饮品）',
    tags: ['亲子家庭', '39–69元', '250mL×12'],
    bullets: [
      '该组合GMV份额达12.5%，SPU占比仅8.2%，存在明显机会',
      '综合分85.6，机会分较高，建议优先考虑',
      '该组合GMV份额稳定，适合做"家庭囤货"与"佐餐"场景主推',
      '口味接受度高（原味/草莓等），适合做多口味矩阵扩量',
      '规格偏大众，建议优先铺"12盒装"作为主力引流规格',
      '价格带内仍有空间，可通过组合装/加赠提升转化'
    ],
    metrics: {
      score: 85.6,
      gmvShare: 12.5,
      spuShare: 8.2,
      gapIndex: 4.3
    },
    actions: ['查看详情', '加入备选', '生成行动卡']
  },
  {
    id: 'idea-2',
    title: '白领早餐 × 49–89元 × 金典有机 250mL×12（常温纯牛奶）',
    tags: ['白领早餐', '49–89元', '250mL×12'],
    bullets: [
      '该组合GMV份额达9.8%，SPU占比仅6.5%，存在明显机会',
      '综合分78.3，机会分较高，建议优先考虑',
      '有机/高品质认知强，适合作为"高端早餐奶"心智款',
      '建议突出"有机奶源/醇厚口感/乳蛋白营养"卖点',
      '该价格带竞品密集，需用内容种草与权益拉升点击',
      '优先打造12/16盒装梯度，兼顾首单与复购'
    ],
    metrics: {
      score: 78.3,
      gmvShare: 9.8,
      spuShare: 6.5,
      gapIndex: 3.3
    },
    actions: ['查看详情', '加入备选', '生成行动卡']
  },
  {
    id: 'idea-3',
    title: '健身控糖 × 59–99元 × 安慕希 205g×12（希腊风味酸奶）',
    tags: ['健身控糖', '59–99元', '205g×12'],
    bullets: [
      '该组合GMV份额达8.2%，SPU占比仅5.8%，存在明显机会',
      '综合分72.3，机会分较高，建议优先考虑',
      '以"浓醇口感/蛋白营养/饱腹感"强化运动后场景',
      '建议做口味矩阵（原味/蓝莓/草莓），用组合装提升客单',
      '该规格适合做周期复购，需突出"囤货性价比"',
      '价格带内可通过直播间权益提升转化'
    ],
    metrics: {
      score: 72.3,
      gmvShare: 8.2,
      spuShare: 5.8,
      gapIndex: 2.4
    },
    actions: ['查看详情', '加入备选', '生成行动卡']
  },
  {
    id: 'idea-4',
    title: '学生党 × 29–59元 × 优酸乳 小规格（便携/多口味）',
    tags: ['学生党', '29–59元', '便携装'],
    bullets: [
      '该组合GMV份额达6.5%，SPU占比仅4.2%，存在明显机会',
      '综合分68.5，机会分较高，建议优先考虑',
      '适合"课间/宿舍"便携场景，主打清爽酸甜',
      '可用"多口味混合装"提高点击与加购',
      '低价带更依赖曝光与素材效率，建议强化场景短视频',
      '规格策略：便携小规格做引流，大规格承接复购'
    ],
    metrics: {
      score: 68.5,
      gmvShare: 6.5,
      spuShare: 4.2,
      gapIndex: 2.3
    },
    actions: ['查看详情', '加入备选', '生成行动卡']
  },
  {
    id: 'idea-5',
    title: '家庭囤货 × 69–109元 × 金典 200mL×24（量贩装）',
    tags: ['家庭囤货', '69–109元', '200mL×24'],
    bullets: [
      '该组合GMV份额达10.2%，SPU占比仅7.5%，存在明显机会',
      '综合分82.1，机会分较高，建议优先考虑',
      '量贩装天然具备"囤货"心智，适合做大促主推',
      '建议在详情页与内容里强化"日常早餐/全家共享"场景',
      '用"24盒装"承接转化，配合12盒装做引流梯度',
      '可通过加赠杯/保温袋等提升转化（仅文案演示）'
    ],
    metrics: {
      score: 82.1,
      gmvShare: 10.2,
      spuShare: 7.5,
      gapIndex: 2.7
    },
    actions: ['查看详情', '加入备选', '生成行动卡']
  },
  {
    id: 'idea-6',
    title: '下午茶解馋 × 59–99元 × 安慕希 多口味组合（205g×12）',
    tags: ['下午茶', '59–99元', '多口味组合'],
    bullets: [
      '该组合GMV份额达7.8%，SPU占比仅5.5%，存在明显机会',
      '综合分75.2，机会分较高，建议优先考虑',
      '以"口味多样/浓醇"驱动冲动消费，适合内容种草',
      '组合装利于提升客单与转化，适合直播间讲解',
      '建议做"原味打底+水果味补充"的口味结构',
      '价格带内竞争强，需在素材强调差异化卖点'
    ],
    metrics: {
      score: 75.2,
      gmvShare: 7.8,
      spuShare: 5.5,
      gapIndex: 2.3
    },
    actions: ['查看详情', '加入备选', '生成行动卡']
  }
]

// Top机会（价格带）
export interface TopOpportunity {
  range: string // 价格带/规格段
  gmvShare: number // GMV份额
  spuShare: number // SPU占比
  score: number // 综合分/机会分
}

export const topOpportunities = {
  priceBandTop: [
    { range: '200-499元', gmvShare: 35.2, spuShare: 28.5, score: 85.6 },
    { range: '100-199元', gmvShare: 28.5, spuShare: 32.2, score: 78.3 },
    { range: '500-999元', gmvShare: 22.3, spuShare: 18.5, score: 82.1 },
    { range: '50-99元', gmvShare: 8.5, spuShare: 12.2, score: 68.5 },
    { range: '300-499元', gmvShare: 5.5, spuShare: 8.2, score: 75.2 }
  ] as TopOpportunity[],
  specTop: [
    { range: '250mL×12', gmvShare: 32.5, spuShare: 28.2, score: 85.6 },
    { range: '205g×12', gmvShare: 28.2, spuShare: 25.5, score: 78.3 },
    { range: '200mL×24', gmvShare: 22.8, spuShare: 20.2, score: 72.3 },
    { range: '便携装', gmvShare: 8.5, spuShare: 12.2, score: 68.5 },
    { range: '多口味组合', gmvShare: 8.0, spuShare: 13.9, score: 82.1 }
  ] as TopOpportunity[]
}

// Top机会明细（弹窗用，更多行）
export const topOpportunityDetails = {
  priceBand: [
    ...topOpportunities.priceBandTop,
    { range: '1000-1999元', gmvShare: 3.2, spuShare: 2.5, score: 65.2 },
    { range: '150-299元', gmvShare: 2.8, spuShare: 4.2, score: 72.3 },
    { range: '2000-2999元', gmvShare: 1.5, spuShare: 1.2, score: 58.5 },
    { range: '80-149元', gmvShare: 1.2, spuShare: 2.1, score: 62.3 },
    { range: '3000+元', gmvShare: 0.8, spuShare: 0.5, score: 52.1 },
    { range: '30-49元', gmvShare: 0.5, spuShare: 1.2, score: 48.5 }
  ] as TopOpportunity[],
  spec: [
    ...topOpportunities.specTop,
    { range: '250mL×16', gmvShare: 5.2, spuShare: 4.5, score: 75.2 },
    { range: '低糖/控糖', gmvShare: 4.8, spuShare: 5.2, score: 68.5 },
    { range: '有机奶源', gmvShare: 3.5, spuShare: 4.2, score: 65.2 },
    { range: '乳蛋白营养', gmvShare: 2.8, spuShare: 3.5, score: 62.3 },
    { range: '囤货性价比', gmvShare: 2.2, spuShare: 2.8, score: 58.5 }
  ] as TopOpportunity[]
}

// 价格带机会表
export interface PriceBandOpportunity {
  priceBand: string
  gmvShare: number
  spuShare: number
  gapIndex: number
  score: number
  gmv?: number
  spuCount?: number
}

export const priceBandOpportunityTable: PriceBandOpportunity[] = [
  { priceBand: '200-499元', gmvShare: 35.2, spuShare: 28.5, gapIndex: 6.7, score: 85.6, gmv: 1056000, spuCount: 285 },
  { priceBand: '100-199元', gmvShare: 28.5, spuShare: 32.2, gapIndex: -3.7, score: 78.3, gmv: 855000, spuCount: 322 },
  { priceBand: '500-999元', gmvShare: 22.3, spuShare: 18.5, gapIndex: 3.8, score: 82.1, gmv: 669000, spuCount: 185 },
  { priceBand: '50-99元', gmvShare: 8.5, spuShare: 12.2, gapIndex: -3.7, score: 68.5, gmv: 255000, spuCount: 122 },
  { priceBand: '300-499元', gmvShare: 5.5, spuShare: 8.2, gapIndex: -2.7, score: 75.2, gmv: 165000, spuCount: 82 },
  { priceBand: '1000-1999元', gmvShare: 3.2, spuShare: 2.5, gapIndex: 0.7, score: 65.2, gmv: 96000, spuCount: 25 },
  { priceBand: '150-299元', gmvShare: 2.8, spuShare: 4.2, gapIndex: -1.4, score: 72.3, gmv: 84000, spuCount: 42 },
  { priceBand: '2000-2999元', gmvShare: 1.5, spuShare: 1.2, gapIndex: 0.3, score: 58.5, gmv: 45000, spuCount: 12 },
  { priceBand: '80-149元', gmvShare: 1.2, spuShare: 2.1, gapIndex: -0.9, score: 62.3, gmv: 36000, spuCount: 21 },
  { priceBand: '3000+元', gmvShare: 0.8, spuShare: 0.5, gapIndex: 0.3, score: 52.1, gmv: 24000, spuCount: 5 },
  { priceBand: '30-49元', gmvShare: 0.5, spuShare: 1.2, gapIndex: -0.7, score: 48.5, gmv: 15000, spuCount: 12 },
  { priceBand: '20-29元', gmvShare: 0.3, spuShare: 0.8, gapIndex: -0.5, score: 45.2, gmv: 9000, spuCount: 8 },
  { priceBand: '10-19元', gmvShare: 0.2, spuShare: 0.5, gapIndex: -0.3, score: 42.1, gmv: 6000, spuCount: 5 },
  { priceBand: '5-9元', gmvShare: 0.1, spuShare: 0.3, gapIndex: -0.2, score: 38.5, gmv: 3000, spuCount: 3 },
  { priceBand: '1-4元', gmvShare: 0.05, spuShare: 0.2, gapIndex: -0.15, score: 35.2, gmv: 1500, spuCount: 2 }
]

// 规格机会表
export interface SpecOpportunity {
  spec: string
  gmvShare: number
  spuShare: number
  gapIndex: number
  score: number
  gmv?: number
  spuCount?: number
}

export const specOpportunityTable: SpecOpportunity[] = [
  { spec: '250mL×12', gmvShare: 32.5, spuShare: 28.2, gapIndex: 4.3, score: 85.6, gmv: 975000, spuCount: 282 },
  { spec: '205g×12', gmvShare: 28.2, spuShare: 25.5, gapIndex: 2.7, score: 78.3, gmv: 846000, spuCount: 255 },
  { spec: '200mL×24', gmvShare: 22.8, spuShare: 20.2, gapIndex: 2.6, score: 72.3, gmv: 684000, spuCount: 202 },
  { spec: '便携装', gmvShare: 8.5, spuShare: 12.2, gapIndex: -3.7, score: 68.5, gmv: 255000, spuCount: 122 },
  { spec: '多口味组合', gmvShare: 8.0, spuShare: 13.9, gapIndex: -5.9, score: 82.1, gmv: 240000, spuCount: 139 },
  { spec: '250mL×16', gmvShare: 5.2, spuShare: 4.5, gapIndex: 0.7, score: 75.2, gmv: 156000, spuCount: 45 },
  { spec: '低糖/控糖', gmvShare: 4.8, spuShare: 5.2, gapIndex: -0.4, score: 68.5, gmv: 144000, spuCount: 52 },
  { spec: '有机奶源', gmvShare: 3.5, spuShare: 4.2, gapIndex: -0.7, score: 65.2, gmv: 105000, spuCount: 42 },
  { spec: '乳蛋白营养', gmvShare: 2.8, spuShare: 3.5, gapIndex: -0.7, score: 62.3, gmv: 84000, spuCount: 35 },
  { spec: '囤货性价比', gmvShare: 2.2, spuShare: 2.8, gapIndex: -0.6, score: 58.5, gmv: 66000, spuCount: 28 },
  { spec: '浓醇口感', gmvShare: 1.8, spuShare: 2.2, gapIndex: -0.4, score: 55.2, gmv: 54000, spuCount: 22 },
  { spec: '清爽酸甜', gmvShare: 1.5, spuShare: 1.8, gapIndex: -0.3, score: 52.1, gmv: 45000, spuCount: 18 },
  { spec: '乳酸菌发酵', gmvShare: 1.2, spuShare: 1.5, gapIndex: -0.3, score: 48.5, gmv: 36000, spuCount: 15 },
  { spec: '口感醇厚', gmvShare: 0.8, spuShare: 1.2, gapIndex: -0.4, score: 45.2, gmv: 24000, spuCount: 12 },
  { spec: '组合装', gmvShare: 0.5, spuShare: 0.8, gapIndex: -0.3, score: 42.1, gmv: 15000, spuCount: 8 }
]

// 卖点 × 价格带表
export interface SellingPointPriceBand {
  sellingPoint: string
  priceBand: string
  spec: string
  gmvShare: number
  spuShare: number
  score: number
  note?: string
}

export const sellingPointPriceBandTable: SellingPointPriceBand[] = [
  { sellingPoint: '亲子家庭', priceBand: '39–69元', spec: '250mL×12', gmvShare: 12.5, spuShare: 8.2, score: 85.6, note: '高机会' },
  { sellingPoint: '白领早餐', priceBand: '49–89元', spec: '250mL×12', gmvShare: 9.8, spuShare: 6.5, score: 78.3, note: '中机会' },
  { sellingPoint: '健身控糖', priceBand: '59–99元', spec: '205g×12', gmvShare: 8.2, spuShare: 5.8, score: 72.3, note: '中机会' },
  { sellingPoint: '学生党', priceBand: '29–59元', spec: '便携装', gmvShare: 6.5, spuShare: 4.2, score: 68.5, note: '中机会' },
  { sellingPoint: '家庭囤货', priceBand: '69–109元', spec: '200mL×24', gmvShare: 10.2, spuShare: 7.5, score: 82.1, note: '高机会' },
  { sellingPoint: '下午茶', priceBand: '59–99元', spec: '多口味组合', gmvShare: 7.8, spuShare: 5.5, score: 75.2, note: '中机会' },
  { sellingPoint: '上班族', priceBand: '49–89元', spec: '250mL×12', gmvShare: 8.5, spuShare: 6.2, score: 78.5, note: '中机会' },
  { sellingPoint: '运动人群', priceBand: '59–99元', spec: '205g×12', gmvShare: 6.8, spuShare: 5.2, score: 70.2, note: '中机会' },
  { sellingPoint: '通勤族', priceBand: '39–69元', spec: '便携装', gmvShare: 5.5, spuShare: 4.5, score: 65.8, note: '低机会' },
  { sellingPoint: '老年人', priceBand: '49–89元', spec: '250mL×12', gmvShare: 4.2, spuShare: 3.5, score: 62.3, note: '低机会' },
  { sellingPoint: '儿童', priceBand: '29–59元', spec: '便携装', gmvShare: 3.5, spuShare: 3.2, score: 58.5, note: '低机会' },
  { sellingPoint: '女性用户', priceBand: '49–99元', spec: '多口味组合', gmvShare: 5.8, spuShare: 4.8, score: 68.2, note: '中机会' },
  { sellingPoint: '男性用户', priceBand: '69–109元', spec: '200mL×24', gmvShare: 7.2, spuShare: 5.8, score: 72.5, note: '中机会' },
  { sellingPoint: '健康追求者', priceBand: '59–99元', spec: '有机奶源', gmvShare: 8.5, spuShare: 6.2, score: 80.2, note: '高机会' },
  { sellingPoint: '入门用户', priceBand: '29–59元', spec: '便携装', gmvShare: 4.8, spuShare: 4.2, score: 60.5, note: '低机会' },
  { sellingPoint: '高端用户', priceBand: '69–109元', spec: '有机奶源', gmvShare: 6.2, spuShare: 4.5, score: 75.8, note: '中机会' },
  { sellingPoint: '性价比用户', priceBand: '39–69元', spec: '250mL×12', gmvShare: 5.5, spuShare: 5.2, score: 65.2, note: '低机会' },
  { sellingPoint: '品牌忠诚用户', priceBand: '49–89元', spec: '250mL×12', gmvShare: 6.8, spuShare: 5.5, score: 70.5, note: '中机会' },
  { sellingPoint: '创新追求者', priceBand: '59–99元', spec: '多口味组合', gmvShare: 7.5, spuShare: 5.8, score: 73.2, note: '中机会' },
  { sellingPoint: '实用主义者', priceBand: '39–69元', spec: '250mL×12', gmvShare: 5.2, spuShare: 4.8, score: 63.5, note: '低机会' }
]

