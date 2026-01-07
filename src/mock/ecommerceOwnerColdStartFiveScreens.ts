// 电商负责人冷启动期5屏结构Mock数据（伊利液体奶语境）

// ==================== 屏1：冷启动目标 + 洞察日志 ====================
export interface ColdStartTarget {
  label: string
  current: number
  target: number
  unit: string
  percent: number
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
  { label: '购买人数', current: 10000, target: 20000, unit: '人', percent: 50 },
  { label: 'GMV', current: 2700000, target: 3500000, unit: '元', percent: 77 },
  { label: 'ROI', current: 2.6, target: 3.0, unit: '', percent: 87 }
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
  }
]

// ==================== 屏1：AIPL人群流转 + 其他指标(流量) ====================
export interface AIPLItem {
  stage: string
  label: string
  value: number
  color: string
}

export interface FlowInItem {
  label: string
  percent: number
}

export const aiplData: AIPLItem[] = [
  { stage: 'A', label: '认知', value: 30000, color: '#52c41a' },
  { stage: 'I', label: '兴趣', value: 7500, color: '#1890ff' },
  { stage: 'P', label: '购买', value: 1580, color: '#faad14' },
  { stage: 'L', label: '忠诚', value: 300, color: '#722ed1' }
]

export const flowInData: FlowInItem[] = [
  { label: '流入A', percent: 25.0 },
  { label: '流入I', percent: 21.1 },
  { label: '流入P', percent: 19.0 },
  { label: '流入L', percent: 5.3 }
]

export interface TrafficMetric {
  label: string
  value: number
  delta: number
  deltaPercent: number
  trend: 'up' | 'down'
}

export const trafficMetrics: TrafficMetric[] = [
  { label: '曝光', value: 3000000, delta: 1000, deltaPercent: 10, trend: 'up' },
  { label: '点击', value: 303000, delta: -1020, deltaPercent: 10, trend: 'down' },
  { label: '流量成本', value: 303000, delta: 1000, deltaPercent: 10, trend: 'up' }
]

// 流量趋势折线图数据
export interface TrendDataPoint {
  date: string
  douyin: number
  tmall: number
  jd: number
}

export const trafficTrendData: TrendDataPoint[] = [
  { date: '12-01', douyin: 120000, tmall: 95000, jd: 68000 },
  { date: '12-02', douyin: 135000, tmall: 102000, jd: 72000 },
  { date: '12-03', douyin: 128000, tmall: 98000, jd: 75000 },
  { date: '12-04', douyin: 142000, tmall: 108000, jd: 78000 },
  { date: '12-05', douyin: 155000, tmall: 115000, jd: 82000 }
]

// ==================== 屏2：成交指标 ====================
export interface PlatformMetric {
  platform: string
  value: number
  delta: number
  deltaPercent: number
  trend: 'up' | 'down'
}

export interface MetricSection {
  title: string
  metrics: PlatformMetric[]
}

export const gmvMetrics: PlatformMetric[] = [
  { platform: '抖音', value: 1250000, delta: 125000, deltaPercent: 11, trend: 'up' },
  { platform: '天猫', value: 980000, delta: -58000, deltaPercent: 6, trend: 'down' },
  { platform: '京东', value: 520000, delta: -32000, deltaPercent: 6, trend: 'down' }
]

export const roiMetrics: PlatformMetric[] = [
  { platform: '抖音', value: 2.8, delta: 0.3, deltaPercent: 12, trend: 'up' },
  { platform: '天猫', value: 2.2, delta: -0.2, deltaPercent: 8, trend: 'down' },
  { platform: '京东', value: 1.9, delta: -0.1, deltaPercent: 5, trend: 'down' }
]

export const adSpendMetrics: PlatformMetric[] = [
  { platform: '抖音', value: 446000, delta: 22000, deltaPercent: 5, trend: 'up' },
  { platform: '天猫', value: 445000, delta: -18000, deltaPercent: 4, trend: 'down' },
  { platform: '京东', value: 274000, delta: -12000, deltaPercent: 4, trend: 'down' }
]

// 效率指标
export interface EfficiencyMetric {
  label: string
  value: number | string
  unit: string
  delta: number
  deltaPercent: number
  trend: 'up' | 'down'
}

export const efficiencyMetrics: EfficiencyMetric[] = [
  { label: 'CTR', value: 3.2, unit: '%', delta: 0.3, deltaPercent: 10, trend: 'up' },
  { label: 'CVR', value: 2.8, unit: '%', delta: -0.2, deltaPercent: 7, trend: 'down' },
  { label: 'CPC', value: 1.5, unit: '元', delta: 0.1, deltaPercent: 7, trend: 'up' }
]

// 近30天差评率
export const badReviewMetrics: PlatformMetric[] = [
  { platform: '抖音', value: 2.1, delta: -0.3, deltaPercent: 12, trend: 'down' },
  { platform: '天猫', value: 1.8, delta: 0.2, deltaPercent: 12, trend: 'up' },
  { platform: '京东', value: 2.5, delta: 0.4, deltaPercent: 19, trend: 'up' }
]

// ==================== 屏3：货盘模块 ====================
export interface ProductRow {
  id: string
  title: string
  sales: number
  share: number
  avgPrice: number
}

export const productsByPlatform: Record<string, ProductRow[]> = {
  抖音: [
    { id: 'dy-1', title: '金典有机纯牛奶 250ml*16盒', sales: 580000, share: 32.5, avgPrice: 89 },
    { id: 'dy-2', title: '安慕希原味酸奶 205g*12瓶', sales: 420000, share: 23.5, avgPrice: 68 },
    { id: 'dy-3', title: '优酸乳草莓味 250ml*24盒', sales: 350000, share: 19.6, avgPrice: 52 },
    { id: 'dy-4', title: '金典娟姗纯牛奶 200ml*10盒', sales: 280000, share: 15.7, avgPrice: 75 },
    { id: 'dy-5', title: '安慕希蓝莓酸奶 205g*8瓶', sales: 156000, share: 8.7, avgPrice: 58 }
  ],
  天猫: [
    { id: 'tm-1', title: '金典有机纯牛奶 250ml*24盒', sales: 620000, share: 35.2, avgPrice: 118 },
    { id: 'tm-2', title: '安慕希希腊风味酸奶 205g*16瓶', sales: 380000, share: 21.6, avgPrice: 85 },
    { id: 'tm-3', title: '优酸乳原味 250ml*24盒', sales: 320000, share: 18.2, avgPrice: 48 },
    { id: 'tm-4', title: '金典纯牛奶 250ml*12盒', sales: 260000, share: 14.8, avgPrice: 65 },
    { id: 'tm-5', title: '安慕希AMX 0蔗糖 205g*10瓶', sales: 180000, share: 10.2, avgPrice: 72 }
  ],
  京东: [
    { id: 'jd-1', title: '金典有机纯牛奶 250ml*20盒', sales: 480000, share: 38.1, avgPrice: 98 },
    { id: 'jd-2', title: '安慕希原味酸奶 205g*12瓶', sales: 320000, share: 25.4, avgPrice: 68 },
    { id: 'jd-3', title: '优酸乳芒果味 250ml*24盒', sales: 220000, share: 17.5, avgPrice: 55 },
    { id: 'jd-4', title: '金典低脂纯牛奶 250ml*16盒', sales: 150000, share: 11.9, avgPrice: 82 },
    { id: 'jd-5', title: '安慕希草莓酸奶 205g*8瓶', sales: 90000, share: 7.1, avgPrice: 56 }
  ]
}

// 营销力对比
export interface CompareItem {
  label: string
  score: number
  benchmark: number
}

export const marketingPowerItems: CompareItem[] = [
  { label: '卖点命中', score: 85, benchmark: 75 },
  { label: '流量质量', score: 72, benchmark: 80 },
  { label: '渠道效率', score: 88, benchmark: 78 },
  { label: '人群效率', score: 65, benchmark: 70 },
  { label: '曝光成本', score: 78, benchmark: 72 }
]

export const productPowerItems: CompareItem[] = [
  { label: '价格力', score: 82, benchmark: 78 },
  { label: '复购健康', score: 75, benchmark: 72 },
  { label: '退款健康', score: 68, benchmark: 75 },
  { label: '商品好评率', score: 92, benchmark: 85 },
  { label: '价格结构', score: 70, benchmark: 68 }
]

// ==================== 屏4：诊断归因模块 ====================
export type DiagnosisTab = '平台' | '流量' | '转化' | '货组' | '费比'
export type SeverityLevel = 'success' | 'warning' | 'error'

export interface DiagnosisCard {
  id: string
  title: string
  tag: string
  severity: SeverityLevel
  description: string
  pills: string[]
  suggestions: string[]
}

export const diagnosisCardsByTab: Record<DiagnosisTab, DiagnosisCard[]> = {
  '平台': [
    {
      id: 'p1',
      title: '天猫曝光三连降',
      tag: '流量',
      severity: 'error',
      description: 'GMV 存在继续回落风险，初判站内推荐/搜索份额下滑。',
      pills: ['曝光', '趋势风险'],
      suggestions: ['锁坑位/加推荐资源', '扩充场景词包']
    },
    {
      id: 'p2',
      title: '抖音ROI持续走低',
      tag: '效率',
      severity: 'warning',
      description: 'CPM成本上升，流量质量下降，需优化投放策略。',
      pills: ['ROI', '成本'],
      suggestions: ['优化人群定向', '调整出价策略']
    },
    {
      id: 'p3',
      title: '京东转化率达标',
      tag: '转化',
      severity: 'success',
      description: '转化率保持在目标区间，继续保持当前策略。',
      pills: ['CVR', '正常'],
      suggestions: ['维持现有策略', '关注竞品动态']
    },
    {
      id: 'p4',
      title: '天猫退款率偏高',
      tag: '售后',
      severity: 'warning',
      description: '近7天退款率上升0.5pp，需关注商品质量反馈。',
      pills: ['退款', '品质'],
      suggestions: ['分析退款原因', '加强品控']
    },
    {
      id: 'p5',
      title: '抖音直播转化优秀',
      tag: '直播',
      severity: 'success',
      description: '直播间转化率超目标15%，建议加大直播场次。',
      pills: ['直播', '转化'],
      suggestions: ['增加直播时长', '扩大主播矩阵']
    },
    {
      id: 'p6',
      title: '京东搜索词覆盖不足',
      tag: '流量',
      severity: 'error',
      description: '核心词覆盖率仅60%，导致曝光规模受限。',
      pills: ['搜索', '覆盖'],
      suggestions: ['扩充关键词包', '优化标题SEO']
    }
  ],
  '流量': [
    {
      id: 'f1',
      title: '付费流量占比过高',
      tag: '结构',
      severity: 'warning',
      description: '付费流量占比达65%，自然流量获取能力需提升。',
      pills: ['流量结构', '成本'],
      suggestions: ['优化内容种草', '提升搜索排名']
    },
    {
      id: 'f2',
      title: '短视频引流效果下降',
      tag: '内容',
      severity: 'error',
      description: '短视频CTR下降20%，内容吸引力不足。',
      pills: ['短视频', 'CTR'],
      suggestions: ['更新创意素材', '优化封面标题']
    },
    {
      id: 'f3',
      title: '搜索流量稳定',
      tag: '搜索',
      severity: 'success',
      description: '搜索流量保持稳定增长，关键词排名靠前。',
      pills: ['搜索', '稳定'],
      suggestions: ['持续优化', '关注竞品']
    },
    {
      id: 'f4',
      title: '推荐流量波动大',
      tag: '推荐',
      severity: 'warning',
      description: '推荐流量日均波动超30%，稳定性需提升。',
      pills: ['推荐', '波动'],
      suggestions: ['提升内容质量', '增加发布频次']
    },
    {
      id: 'f5',
      title: '直播间流量增长',
      tag: '直播',
      severity: 'success',
      description: '直播间UV周环比增长25%，表现优异。',
      pills: ['直播', '增长'],
      suggestions: ['保持直播节奏', '优化直播内容']
    },
    {
      id: 'f6',
      title: '私域引流不足',
      tag: '私域',
      severity: 'error',
      description: '私域渠道引流占比仅5%，需加强会员运营。',
      pills: ['私域', '会员'],
      suggestions: ['完善会员体系', '增加触达频次']
    }
  ],
  '转化': [
    {
      id: 't1',
      title: '详情页跳出率高',
      tag: '页面',
      severity: 'error',
      description: '详情页跳出率达45%，页面吸引力不足。',
      pills: ['跳出率', '页面'],
      suggestions: ['优化详情页', '增加卖点展示']
    },
    {
      id: 't2',
      title: '加购转化正常',
      tag: '加购',
      severity: 'success',
      description: '加购转化率保持在行业平均水平以上。',
      pills: ['加购', '正常'],
      suggestions: ['维持现状', '关注竞品']
    },
    {
      id: 't3',
      title: '支付转化需提升',
      tag: '支付',
      severity: 'warning',
      description: '支付转化率较目标低0.8pp，需优化支付流程。',
      pills: ['支付', '转化'],
      suggestions: ['简化支付流程', '增加支付方式']
    },
    {
      id: 't4',
      title: '优惠券使用率低',
      tag: '促销',
      severity: 'warning',
      description: '优惠券核销率仅35%，促销效果不佳。',
      pills: ['优惠券', '核销'],
      suggestions: ['优化券面设计', '调整发放策略']
    },
    {
      id: 't5',
      title: '复购率稳定',
      tag: '复购',
      severity: 'success',
      description: '30天复购率保持在18%，会员粘性良好。',
      pills: ['复购', '会员'],
      suggestions: ['持续会员运营', '推出复购优惠']
    },
    {
      id: 't6',
      title: '客单价偏低',
      tag: '客单',
      severity: 'warning',
      description: '客单价较目标低12%，需优化商品组合。',
      pills: ['客单价', '组合'],
      suggestions: ['推荐关联商品', '设置满减门槛']
    }
  ],
  '货组': [
    {
      id: 'g1',
      title: '爆款集中度高',
      tag: '结构',
      severity: 'warning',
      description: 'TOP3商品占比达70%，长尾商品动销不足。',
      pills: ['爆款', '集中'],
      suggestions: ['扶持潜力款', '优化商品结构']
    },
    {
      id: 'g2',
      title: '新品表现优异',
      tag: '新品',
      severity: 'success',
      description: '新品首周销量超预期30%，市场接受度高。',
      pills: ['新品', '销量'],
      suggestions: ['加大推广力度', '扩大备货']
    },
    {
      id: 'g3',
      title: '滞销款需清理',
      tag: '滞销',
      severity: 'error',
      description: '滞销款占库存25%，资金占用严重。',
      pills: ['滞销', '库存'],
      suggestions: ['促销清仓', '优化采购计划']
    },
    {
      id: 'g4',
      title: '组合装销量增长',
      tag: '组合',
      severity: 'success',
      description: '组合装销量周环比增长40%，策略有效。',
      pills: ['组合装', '增长'],
      suggestions: ['扩大组合SKU', '优化定价']
    },
    {
      id: 'g5',
      title: '规格覆盖不全',
      tag: '规格',
      severity: 'warning',
      description: '小规格SKU缺失，无法满足尝鲜需求。',
      pills: ['规格', '覆盖'],
      suggestions: ['补充小规格', '测试市场反应']
    },
    {
      id: 'g6',
      title: '季节款备货不足',
      tag: '备货',
      severity: 'error',
      description: '春节礼盒备货仅达目标60%，存在断货风险。',
      pills: ['备货', '风险'],
      suggestions: ['紧急补货', '协调供应链']
    }
  ],
  '费比': [
    {
      id: 'b1',
      title: '整体费比超标',
      tag: '费比',
      severity: 'error',
      description: '综合费比达28%，超目标5pp，需严控成本。',
      pills: ['费比', '超标'],
      suggestions: ['优化投放ROI', '降低无效消耗']
    },
    {
      id: 'b2',
      title: '抖音费比可控',
      tag: '抖音',
      severity: 'success',
      description: '抖音渠道费比22%，在目标区间内。',
      pills: ['抖音', '达标'],
      suggestions: ['保持现有策略', '持续优化']
    },
    {
      id: 'b3',
      title: '天猫费比偏高',
      tag: '天猫',
      severity: 'warning',
      description: '天猫费比达32%，超目标7pp，需优化。',
      pills: ['天猫', '偏高'],
      suggestions: ['降低推广费用', '提升转化效率']
    },
    {
      id: 'b4',
      title: '京东费比正常',
      tag: '京东',
      severity: 'success',
      description: '京东费比24%，略低于目标，表现良好。',
      pills: ['京东', '正常'],
      suggestions: ['维持现状', '关注竞争态势']
    },
    {
      id: 'b5',
      title: '物流成本上升',
      tag: '物流',
      severity: 'warning',
      description: '物流成本占比上升1.2pp，需优化配送方案。',
      pills: ['物流', '成本'],
      suggestions: ['优化仓配', '谈判运费']
    },
    {
      id: 'b6',
      title: '促销费用占比高',
      tag: '促销',
      severity: 'warning',
      description: '促销费用占销售额15%，ROI需提升。',
      pills: ['促销', 'ROI'],
      suggestions: ['精准发券', '优化促销策略']
    }
  ]
}

// 角色归因详情
export type RoleKey = '京东运营' | '抖音投放' | '内容制作' | '抖音店播' | '天猫运营' | '天猫流量运营' | '电商商务' | '京东流量运营'

export const roleAttributionDetails: Record<RoleKey, string[]> = {
  '京东运营': [
    '矩阵产能完成度 40%（低于阈值 70%）',
    '低效计划清理完成 65%',
    '支付 CVR 完成 55%',
    '承接页改造延误，CVR 提升不足',
    '词包 CTR 1.3% < 1.6%',
    'ROI 2.7 < 3.0',
    '建联达人 36/50'
  ],
  '抖音投放': [
    '千川ROI 2.8（目标3.2）',
    '素材点击率 2.1%（目标2.5%）',
    '人群包覆盖率 85%',
    '出价策略调整完成 80%',
    '新素材测试进度 60%',
    '直播间引流效率提升 15%'
  ],
  '内容制作': [
    '短视频产出 45/60 条',
    '爆款率 12%（目标15%）',
    '平均播放量 5.2万',
    '种草笔记完成 80%',
    '达人合作内容 35/50',
    '直播切片产出 90%'
  ],
  '抖音店播': [
    '直播时长完成 85%',
    '场均GMV 12万（目标15万）',
    '转化率 3.2%（目标3.8%）',
    '在线人数峰值 2800',
    '互动率 8.5%',
    '商品讲解覆盖率 95%'
  ],
  '天猫运营': [
    '搜索排名 TOP5 占比 60%',
    '详情页转化率 2.8%',
    '加购率 12%（目标15%）',
    '会员招募完成 75%',
    '评价维护及时率 92%',
    '活动报名完成 100%'
  ],
  '天猫流量运营': [
    '直通车ROI 2.5（目标2.8）',
    '引力魔方点击率 1.8%',
    '万相台消耗达成 90%',
    '关键词覆盖率 78%',
    '人群包更新完成 85%',
    '流量结构优化进度 70%'
  ],
  '电商商务': [
    '达人建联 120/150',
    '合作转化率 35%',
    '头部达人签约 8/12',
    '腰部达人储备 200+',
    '合作费用控制 95%',
    '内容产出及时率 88%'
  ],
  '京东流量运营': [
    '快车ROI 2.4（目标2.6）',
    '海投消耗达成 85%',
    '搜索词覆盖 320/400',
    '店铺关注增长 12%',
    '首页资源位获取 3/5',
    '大促预热流量储备 75%'
  ]
}

// ==================== 屏5：任务模块 ====================
export type TaskStatus = 'todo' | 'doing' | 'done'

export interface Task {
  id: string
  title: string
  description: string
  dueDate: string
  isOverdue: boolean
  status: TaskStatus
  assignee: string
}

export const tasks: Task[] = [
  // 待处理
  { id: 't1', title: '预算校准', description: '电商负责人—偏差≤±10%', dueDate: '2025-12-05', isOverdue: false, status: 'todo', assignee: '电商负责人' },
  { id: 't2', title: '素材审核', description: '电商负责人—审核新品素材', dueDate: '2025-10-20', isOverdue: true, status: 'todo', assignee: '电商负责人' },
  { id: 't3', title: '达人对接', description: '电商负责人—完成达人签约', dueDate: '2025-12-08', isOverdue: false, status: 'todo', assignee: '电商负责人' },
  // 进行中
  { id: 't4', title: '投放优化', description: '电商负责人—优化ROI', dueDate: '2025-12-06', isOverdue: false, status: 'doing', assignee: '电商负责人' },
  { id: 't5', title: '库存盘点', description: '电商负责人—核对库存数据', dueDate: '2025-10-05', isOverdue: true, status: 'doing', assignee: '电商负责人' },
  { id: 't6', title: '活动策划', description: '电商负责人—双12活动方案', dueDate: '2025-12-10', isOverdue: false, status: 'doing', assignee: '电商负责人' },
  // 已完成
  { id: 't7', title: '数据复盘', description: '电商负责人—周度数据分析', dueDate: '2025-12-04', isOverdue: false, status: 'done', assignee: '电商负责人' }
]

export const taskStats = {
  total: 7,
  completed: 1,
  overdue: 2
}

// 操作记录
export interface OperationLog {
  time: string
  action: string
  operator: string
}

export const operationLogs: OperationLog[] = [
  { time: '2025-12-05 14:30', action: '调整预算：天猫渠道预算上调10%', operator: '张三' },
  { time: '2025-12-05 11:20', action: '完成任务：数据复盘', operator: '李四' },
  { time: '2025-12-04 16:45', action: '新建任务：预算校准', operator: '张三' },
  { time: '2025-12-04 10:30', action: '更新诊断：天猫曝光预警', operator: '系统' },
  { time: '2025-12-03 15:20', action: '调整目标：GMV目标上调至350万', operator: '王五' }
]

// 启动天数
export const coldStartDays = 12
