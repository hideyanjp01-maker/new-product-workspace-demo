// 品牌负责人冷启动期5屏结构Mock数据

// 屏1：冷启动目标 + 洞察日志
export interface ColdStartTarget {
  label: string
  current: number
  target: number
  unit: string
}

export interface InsightLog {
  date: string
  insights: Array<{
    platform: string
    metric: string
    change: string
    reason: string
  }>
}

export const coldStartTargets: ColdStartTarget[] = [
  { label: '购买人数', current: 1250, target: 2000, unit: '人' },
  { label: 'GMV', current: 2700000, target: 3500000, unit: '元' },
  { label: 'ROI', current: 2.6, target: 3.0, unit: '' }
]

export const insightLogs: InsightLog[] = [
  {
    date: '2025-12-05',
    insights: [
      { platform: '天猫', metric: 'GMV', change: '-12%', reason: '转化率较目标低 1.0pp' },
      { platform: '抖音', metric: 'ROI', change: '1.8', reason: 'CPM 偏高导致流量成本上升' },
      { platform: '京东', metric: '曝光规模', change: '不足', reason: '搜索词覆盖度低' }
    ]
  },
  {
    date: '2025-12-04',
    insights: [
      { platform: '天猫', metric: 'GMV', change: '-8%', reason: '转化率较目标低 0.8pp' },
      { platform: '抖音', metric: 'ROI', change: '2.0', reason: 'CPM 正常，但点击率偏低' },
      { platform: '京东', metric: '曝光规模', change: '正常', reason: '搜索词覆盖度提升' }
    ]
  },
  {
    date: '2025-12-03',
    insights: [
      { platform: '天猫', metric: 'GMV', change: '-15%', reason: '转化率较目标低 1.2pp' },
      { platform: '抖音', metric: 'ROI', change: '1.9', reason: 'CPM 偏高' },
      { platform: '京东', metric: '曝光规模', change: '不足', reason: '搜索词覆盖度低' }
    ]
  },
  {
    date: '2025-12-02',
    insights: [
      { platform: '天猫', metric: 'GMV', change: '-10%', reason: '转化率较目标低 0.9pp' },
      { platform: '抖音', metric: 'ROI', change: '2.1', reason: 'CPM 正常' },
      { platform: '京东', metric: '曝光规模', change: '正常', reason: '搜索词覆盖度正常' }
    ]
  },
  {
    date: '2025-12-01',
    insights: [
      { platform: '天猫', metric: 'GMV', change: '-5%', reason: '转化率较目标低 0.5pp' },
      { platform: '抖音', metric: 'ROI', change: '2.3', reason: 'CPM 正常，点击率提升' },
      { platform: '京东', metric: '曝光规模', change: '正常', reason: '搜索词覆盖度正常' }
    ]
  }
]

// 屏2：关键指标（GMV/ROI/差评率）
export interface KeyMetric {
  name: string
  platforms: {
    douyin: { value: number; delta: number; deltaPercent: number }
    tmall: { value: number; delta: number; deltaPercent: number }
    jd: { value: number; delta: number; deltaPercent: number }
  }
  trendData: Array<{
    date: string
    douyin: number
    tmall: number
    jd: number
  }>
}

export const keyMetrics: KeyMetric[] = [
  {
    name: 'GMV',
    platforms: {
      douyin: { value: 1200000, delta: 50000, deltaPercent: 4.3 },
      tmall: { value: 850000, delta: -120000, deltaPercent: -12.4 },
      jd: { value: 650000, delta: 30000, deltaPercent: 4.8 }
    },
    trendData: [
      { date: '2025-11-28', douyin: 1150000, tmall: 970000, jd: 620000 },
      { date: '2025-11-29', douyin: 1180000, tmall: 920000, jd: 630000 },
      { date: '2025-11-30', douyin: 1190000, tmall: 900000, jd: 640000 },
      { date: '2025-12-01', douyin: 1200000, tmall: 880000, jd: 645000 },
      { date: '2025-12-02', douyin: 1210000, tmall: 870000, jd: 648000 },
      { date: '2025-12-03', douyin: 1205000, tmall: 860000, jd: 650000 },
      { date: '2025-12-04', douyin: 1200000, tmall: 850000, jd: 650000 }
    ]
  },
  {
    name: 'ROI',
    platforms: {
      douyin: { value: 2.5, delta: 0.1, deltaPercent: 4.2 },
      tmall: { value: 2.8, delta: -0.2, deltaPercent: -6.7 },
      jd: { value: 2.6, delta: 0.05, deltaPercent: 2.0 }
    },
    trendData: [
      { date: '2025-11-28', douyin: 2.4, tmall: 3.0, jd: 2.55 },
      { date: '2025-11-29', douyin: 2.45, tmall: 2.9, jd: 2.56 },
      { date: '2025-11-30', douyin: 2.48, tmall: 2.85, jd: 2.57 },
      { date: '2025-12-01', douyin: 2.5, tmall: 2.8, jd: 2.58 },
      { date: '2025-12-02', douyin: 2.52, tmall: 2.78, jd: 2.59 },
      { date: '2025-12-03', douyin: 2.51, tmall: 2.75, jd: 2.60 },
      { date: '2025-12-04', douyin: 2.5, tmall: 2.8, jd: 2.6 }
    ]
  },
  {
    name: '近30天差评率',
    platforms: {
      douyin: { value: 2.5, delta: -0.3, deltaPercent: -10.7 },
      tmall: { value: 3.2, delta: 0.2, deltaPercent: 6.7 },
      jd: { value: 2.8, delta: -0.1, deltaPercent: -3.4 }
    },
    trendData: [
      { date: '2025-11-28', douyin: 2.8, tmall: 3.0, jd: 2.9 },
      { date: '2025-11-29', douyin: 2.7, tmall: 3.1, jd: 2.85 },
      { date: '2025-11-30', douyin: 2.6, tmall: 3.15, jd: 2.8 },
      { date: '2025-12-01', douyin: 2.55, tmall: 3.2, jd: 2.75 },
      { date: '2025-12-02', douyin: 2.52, tmall: 3.18, jd: 2.82 },
      { date: '2025-12-03', douyin: 2.5, tmall: 3.2, jd: 2.8 },
      { date: '2025-12-04', douyin: 2.5, tmall: 3.2, jd: 2.8 }
    ]
  }
]

// 屏3：经营洞察表格
export interface OperationInsightRow {
  platform: string
  gmv: number
  costRatio: number
  refundRate: number
  conversionCost: number
  cpm: number
  exposureCost: number
  note: string
}

export const operationInsightData: OperationInsightRow[] = [
  {
    platform: '抖音',
    gmv: 1200000,
    costRatio: 35.2,
    refundRate: 2.5,
    conversionCost: 45.5,
    cpm: 12.5,
    exposureCost: 0.0135,
    note: ''
  },
  {
    platform: '天猫',
    gmv: 850000,
    costRatio: 38.5,
    refundRate: 3.2,
    conversionCost: 52.3,
    cpm: 15.2,
    exposureCost: 0.0152,
    note: ''
  },
  {
    platform: '京东',
    gmv: 650000,
    costRatio: 32.8,
    refundRate: 2.8,
    conversionCost: 48.6,
    cpm: 13.8,
    exposureCost: 0.0142,
    note: ''
  },
  {
    platform: '汇总',
    gmv: 2700000,
    costRatio: 35.5,
    refundRate: 2.8,
    conversionCost: 48.8,
    cpm: 13.8,
    exposureCost: 0.0143,
    note: '合计'
  }
]

// VS卡数据
export interface VSCardData {
  title: string
  totalScore: number
  maxScore: number
  dimensions: Array<{
    name: string
    score: number
  }>
}

export const marketingPowerVS: VSCardData = {
  title: '事业部新品营销力VS',
  totalScore: 80,
  maxScore: 100,
  dimensions: [
    { name: '卖点命中', score: 85 },
    { name: '渠道效率', score: 78 },
    { name: '人群效率', score: 82 },
    { name: '曝光成本', score: 75 },
    { name: '曝光规模', score: 80 },
    { name: '搜索热度', score: 88 }
  ]
}

export const productPowerVS: VSCardData = {
  title: '事业部产品力VS',
  totalScore: 80,
  maxScore: 100,
  dimensions: [
    { name: '价格力', score: 82 },
    { name: '复购健康', score: 78 },
    { name: '退款健康', score: 75 },
    { name: '商品好评率', score: 85 },
    { name: '老客购买占比', score: 80 }
  ]
}

// 消费者画像数据
export interface ConsumerProfile {
  platform: string
  gender: {
    male: number
    female: number
  }
  age: Array<{
    range: string
    percent: number
  }>
  region: Array<{
    province: string
    value: number
  }>
}

export const consumerProfiles: ConsumerProfile[] = [
  {
    platform: '抖音',
    gender: { male: 45, female: 55 },
    age: [
      { range: '18-25', percent: 25 },
      { range: '26-30', percent: 35 },
      { range: '31-35', percent: 22 },
      { range: '36-40', percent: 12 },
      { range: '40+', percent: 6 }
    ],
    region: [
      { province: '江苏', value: 125000 },
      { province: '广东', value: 118000 },
      { province: '浙江', value: 98000 },
      { province: '辽宁', value: 85000 },
      { province: '山东', value: 78000 },
      { province: '河北', value: 72000 },
      { province: '北京', value: 68000 },
      { province: '上海', value: 65000 },
      { province: '四川', value: 62000 },
      { province: '河南', value: 58000 }
    ]
  },
  {
    platform: '天猫',
    gender: { male: 48, female: 52 },
    age: [
      { range: '18-25', percent: 22 },
      { range: '26-30', percent: 38 },
      { range: '31-35', percent: 25 },
      { range: '36-40', percent: 10 },
      { range: '40+', percent: 5 }
    ],
    region: [
      { province: '江苏', value: 98000 },
      { province: '广东', value: 92000 },
      { province: '浙江', value: 85000 },
      { province: '辽宁', value: 72000 },
      { province: '山东', value: 68000 },
      { province: '河北', value: 62000 },
      { province: '北京', value: 58000 },
      { province: '上海', value: 55000 },
      { province: '四川', value: 52000 },
      { province: '河南', value: 48000 }
    ]
  },
  {
    platform: '京东',
    gender: { male: 52, female: 48 },
    age: [
      { range: '18-25', percent: 20 },
      { range: '26-30', percent: 32 },
      { range: '31-35', percent: 28 },
      { range: '36-40', percent: 15 },
      { range: '40+', percent: 5 }
    ],
    region: [
      { province: '江苏', value: 72000 },
      { province: '广东', value: 68000 },
      { province: '浙江', value: 62000 },
      { province: '辽宁', value: 58000 },
      { province: '山东', value: 55000 },
      { province: '河北', value: 52000 },
      { province: '北京', value: 48000 },
      { province: '上海', value: 45000 },
      { province: '四川', value: 42000 },
      { province: '河南', value: 40000 }
    ]
  }
]

// 屏4：诊断归因
export type DiagnosisTab = '产品' | '人群' | '评价' | '费比' | '经营'

export interface DiagnosisCard {
  severity: 'normal' | 'attention' | 'high-risk'
  title: string
  tag: string
  desc: string
  chips: string[]
  actions: string[]
}

export const diagnosisData: Record<DiagnosisTab, DiagnosisCard[]> = {
  产品: [
    {
      severity: 'high-risk',
      title: '天猫曝光三连降',
      tag: '流量',
      desc: 'GMV 存在继续回落风险，初判站内推荐/搜索份额下滑。',
      chips: ['曝光', '趋势风险'],
      actions: ['锁坑位/加推荐资源', '扩充场景词包']
    },
    {
      severity: 'attention',
      title: '商品转化率偏低',
      tag: '转化',
      desc: '商品转化率2.5%，低于目标3.0%，建议优化产品页面。',
      chips: ['转化率', '商品'],
      actions: ['优化产品详情页', '提升商品图片质量']
    },
    {
      severity: 'normal',
      title: '商品结构需优化',
      tag: '结构',
      desc: '商品结构需调整，建议加大新品投放力度。',
      chips: ['商品结构', '新品'],
      actions: ['调整商品结构', '加大新品推广']
    },
    {
      severity: 'attention',
      title: '尾部SPU需优化',
      tag: 'SPU',
      desc: 'SPU-005/006转化率低于2%，建议暂停或调整。',
      chips: ['SPU', '转化率'],
      actions: ['暂停低效SPU', '优化SPU策略']
    },
    {
      severity: 'normal',
      title: '商品库存充足',
      tag: '库存',
      desc: '当前库存充足，可支持持续销售。',
      chips: ['库存', '商品'],
      actions: ['保持库存水平', '监控库存变化']
    },
    {
      severity: 'high-risk',
      title: '商品退货率上升',
      tag: '退货',
      desc: '商品退货率上升至3.2%，需关注商品质量问题。',
      chips: ['退货率', '质量'],
      actions: ['分析退货原因', '优化商品质量']
    }
  ],
  人群: [
    {
      severity: 'normal',
      title: '高价值人群可扩',
      tag: '人群',
      desc: '高价值人群ROI达3.5，建议扩大人群包。',
      chips: ['高价值人群', 'ROI'],
      actions: ['扩大高价值人群包', '提升人群精准度']
    },
    {
      severity: 'high-risk',
      title: '新客转化偏低',
      tag: '新客',
      desc: '新客转化率仅2.1%，建议优化新客承接页。',
      chips: ['新客', '转化率'],
      actions: ['优化新客承接页', '提升新客体验']
    },
    {
      severity: 'normal',
      title: '复购稳定',
      tag: '复购',
      desc: '复购人群贡献GMV占比30%，表现良好。',
      chips: ['复购', 'GMV'],
      actions: ['保持复购策略', '提升复购率']
    },
    {
      severity: 'attention',
      title: '人群包表现差异大',
      tag: '人群',
      desc: '人群包表现差异较大，建议优化人群策略。',
      chips: ['人群包', '策略'],
      actions: ['优化人群策略', '调整人群包']
    },
    {
      severity: 'normal',
      title: '相似人群建议',
      tag: '人群',
      desc: '相似人群ROI达2.8，建议扩大相似人群包。',
      chips: ['相似人群', 'ROI'],
      actions: ['扩大相似人群包', '提升人群精准度']
    },
    {
      severity: 'attention',
      title: '人群精准度待提升',
      tag: '人群',
      desc: '部分人群精准度偏低，建议优化人群标签。',
      chips: ['人群精准度', '标签'],
      actions: ['优化人群标签', '提升精准度']
    }
  ],
  评价: [
    {
      severity: 'normal',
      title: '好评率85%',
      tag: '评价',
      desc: '用户评价整体积极，产品质量稳定。',
      chips: ['好评率', '评价'],
      actions: ['保持产品质量', '继续优化服务']
    },
    {
      severity: 'attention',
      title: '差评主要集中在物流',
      tag: '物流',
      desc: '差评主要集中在"物流慢"，建议优化物流。',
      chips: ['差评', '物流'],
      actions: ['优化物流服务', '提升物流速度']
    },
    {
      severity: 'normal',
      title: '评价关键词Top3',
      tag: '关键词',
      desc: '评价关键词Top3：营养、健康、口感，品牌资产沉淀良好。',
      chips: ['关键词', '品牌'],
      actions: ['保持品牌形象', '继续优化产品']
    },
    {
      severity: 'attention',
      title: '包装破损需关注',
      tag: '包装',
      desc: '包装破损差评占比15%，建议优化包装。',
      chips: ['包装', '差评'],
      actions: ['优化包装设计', '提升包装质量']
    },
    {
      severity: 'normal',
      title: '用户满意度较高',
      tag: '满意度',
      desc: '用户满意度较高，建议继续保持。',
      chips: ['满意度', '用户'],
      actions: ['保持服务水平', '继续优化体验']
    },
    {
      severity: 'attention',
      title: '评价回复率待提升',
      tag: '回复',
      desc: '评价回复率仅60%，建议提升回复率。',
      chips: ['回复率', '评价'],
      actions: ['提升回复率', '优化回复质量']
    }
  ],
  费比: [
    {
      severity: 'high-risk',
      title: '推广费比偏高',
      tag: '费比',
      desc: '推广费比18.5%，高于目标15%，建议提升推广效率。',
      chips: ['推广费比', '效率'],
      actions: ['优化推广策略', '提升推广效率']
    },
    {
      severity: 'attention',
      title: '佣金挤压毛利',
      tag: '佣金',
      desc: '佣金费比12.3%，占比较高，建议优化佣金结构。',
      chips: ['佣金', '费比'],
      actions: ['优化佣金结构', '控制佣金成本']
    },
    {
      severity: 'high-risk',
      title: '费用增长快于GMV',
      tag: '费用',
      desc: '费用增长25%，GMV增长18%，建议控制费用增速。',
      chips: ['费用', 'GMV'],
      actions: ['控制费用增速', '优化费用结构']
    },
    {
      severity: 'attention',
      title: '低效费用项占比高',
      tag: '费用',
      desc: '低效费用项占比达35%，建议优化费用结构。',
      chips: ['费用结构', '效率'],
      actions: ['优化费用结构', '减少低效费用']
    },
    {
      severity: 'high-risk',
      title: '总费比需控制',
      tag: '费比',
      desc: '总费比35.2%，较目标32%偏高，建议优化费用结构。',
      chips: ['总费比', '费用'],
      actions: ['优化费用结构', '控制总费比']
    },
    {
      severity: 'attention',
      title: '费用结构需优化',
      tag: '费用',
      desc: '费用结构需优化，建议调整费用分配。',
      chips: ['费用结构', '分配'],
      actions: ['调整费用分配', '优化费用结构']
    }
  ],
  经营: [
    {
      severity: 'high-risk',
      title: '转化率偏低',
      tag: '转化',
      desc: '全平台转化率2.5%，低于目标3.0%，建议优化产品页面和详情。',
      chips: ['转化率', '转化'],
      actions: ['优化产品页面', '提升转化率']
    },
    {
      severity: 'attention',
      title: '退货率需监控',
      tag: '退货',
      desc: '退货率2.8%，接近预警阈值3.0%，建议分析退货原因。',
      chips: ['退货率', '监控'],
      actions: ['分析退货原因', '优化退货策略']
    },
    {
      severity: 'attention',
      title: '推广力度不足',
      tag: '推广',
      desc: '当前推广预算仅完成目标的75%，建议加大推广力度。',
      chips: ['推广', '预算'],
      actions: ['加大推广力度', '提升推广预算']
    },
    {
      severity: 'high-risk',
      title: 'ROI波动需关注',
      tag: 'ROI',
      desc: 'ROI波动较大，部分平台ROI低于2.0，建议优化投放策略。',
      chips: ['ROI', '波动'],
      actions: ['优化投放策略', '稳定ROI']
    },
    {
      severity: 'normal',
      title: '预算效率待提升',
      tag: '预算',
      desc: '预算效率偏低，建议倾斜预算至高ROI渠道。',
      chips: ['预算', '效率'],
      actions: ['优化预算分配', '提升预算效率']
    },
    {
      severity: 'high-risk',
      title: 'GMV达成率偏低',
      tag: 'GMV',
      desc: 'GMV达成率85%，较目标存在15%差距，建议加大推广力度。',
      chips: ['GMV', '达成率'],
      actions: ['加大推广力度', '提升GMV']
    }
  ]
}

// 屏5：任务看板
export interface Task {
  id: string
  title: string
  description: string
  dueDate: string
  status: 'todo' | 'doing' | 'done'
  overdue: boolean
}

export const tasks: Task[] = [
  {
    id: 'task-1',
    title: '预算校准',
    description: '根据当前数据调整推广预算分配，优化费用结构',
    dueDate: '2025-12-05',
    status: 'todo',
    overdue: true
  },
  {
    id: 'task-2',
    title: '优化产品页面',
    description: '提升产品详情页转化率，优化页面布局和内容',
    dueDate: '2025-12-06',
    status: 'todo',
    overdue: false
  },
  {
    id: 'task-3',
    title: '分析退货原因',
    description: '深入分析退货原因，制定优化策略',
    dueDate: '2025-12-07',
    status: 'todo',
    overdue: false
  },
  {
    id: 'task-4',
    title: '渠道优化',
    description: '优化渠道结构，提升渠道效率',
    dueDate: '2025-12-04',
    status: 'doing',
    overdue: true
  },
  {
    id: 'task-5',
    title: '人群策略调整',
    description: '调整人群策略，提升人群精准度',
    dueDate: '2025-12-05',
    status: 'doing',
    overdue: false
  },
  {
    id: 'task-6',
    title: '评价回复优化',
    description: '提升评价回复率，优化回复质量',
    dueDate: '2025-12-06',
    status: 'doing',
    overdue: false
  },
  {
    id: 'task-7',
    title: '产品上架',
    description: '已完成产品上架流程',
    dueDate: '2025-12-01',
    status: 'done',
    overdue: false
  }
]

export const taskStats = {
  total: 7,
  finished: 1,
  overdue: 2
}



