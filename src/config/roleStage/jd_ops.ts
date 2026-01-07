// 京东运营角色阶段配置
// 所有指标字段必须来自现有 mockData/metrics，不能新增字段

export type JdOperatorSectionType = 
  | 'kpi-cards'              // KPI卡片组（8张）
  | 'channel-composition-table' // 渠道构成表格
  | 'consumer-profile-donuts'   // 消费者画像/结构分布（4个环形图）
  | 'funnel-chart'           // 转化漏斗
  | 'target-progress'        // 目标与进度
  | 'ai-insight-summary'     // AI洞察摘要卡（绿色）
  | 'key-metrics-overview'   // 关键指标/效率概览
  | 'channel-efficiency-table' // 渠道效率表
  | 'sku-efficiency-table'   // SKU维度效率表
  | 'diagnosis-insights'     // 诊断洞察卡片
  | 'kanban-board'           // 任务看板
  | 'operation-logs'         // 操作记录

export interface KPICardConfig {
  type: 'kpi-cards'
  title?: string
  cards: Array<{
    label: string
    metricKey: string
    fallbackMetricKey?: string
    unit?: string
    aggregate?: boolean
    trend?: 'up' | 'down' | 'stable'
    compareValue?: string  // 环比/同比
  }>
}

export interface ChannelCompositionTableConfig {
  type: 'channel-composition-table'
  title?: string
  channels: Array<{
    channel: string
    pageViews?: number
    ctr?: number
    visitorUV?: number
    gmv?: number
    paymentConversionRate?: number
  }>
}

export interface ConsumerProfileDonutsConfig {
  type: 'consumer-profile-donuts'
  title?: string
  donuts: Array<{
    title: string
    data: Array<{ label: string; value: number; color?: string }>
  }>
}

export interface FunnelChartConfig {
  type: 'funnel-chart'
  title?: string
  steps: Array<{ label: string; value: number }>
}

export interface TargetProgressConfig {
  type: 'target-progress'
  title?: string
  metrics: Array<{
    label: string
    targetKey: string
    currentKey: string
  }>
}

export interface AIInsightSummaryConfig {
  type: 'ai-insight-summary'
  title?: string
  date?: string
  insights: string[]
  actionText?: string
}

export interface KeyMetricsOverviewConfig {
  type: 'key-metrics-overview'
  title?: string
  metrics: Array<{
    label: string
    value: number | string
    unit?: string
    trend?: 'up' | 'down' | 'stable'
  }>
}

export interface ChannelEfficiencyTableConfig {
  type: 'channel-efficiency-table'
  title?: string
  channels: Array<{
    rank: number
    channel: string
    pageViews?: number
    clicks?: number
    ctr?: number
    uv?: number
    payments?: number
    paymentConversionRate?: number
    aov?: number
    refundAmount?: number
    refundRate?: number
  }>
}

export interface SkuEfficiencyTableConfig {
  type: 'sku-efficiency-table'
  title?: string
  skus: Array<{
    rank: number
    skuId: string
    skuName: string
    visitorUV?: number
    paymentConversionRate?: number
    aov?: number
    gmv?: number
  }>
}

export interface DiagnosisInsightsConfig {
  type: 'diagnosis-insights'
  title?: string
  cards: Array<{
    title: string
    points: string[]
    severity: 'high' | 'medium' | 'low' | 'success'
  }>
}

export interface KanbanBoardConfig {
  type: 'kanban-board'
  title?: string
  columns: Array<{
    id: string
    title: string
    cards: Array<{
      id: string
      title: string
      assignee?: string
      deadline?: string
    }>
  }>
}

export interface OperationLogsConfig {
  type: 'operation-logs'
  title?: string
  logs: Array<{
    time: string
    action: string
  }>
}

export type JdOperatorStageSectionConfig = 
  | KPICardConfig
  | ChannelCompositionTableConfig
  | ConsumerProfileDonutsConfig
  | FunnelChartConfig
  | TargetProgressConfig
  | AIInsightSummaryConfig
  | KeyMetricsOverviewConfig
  | ChannelEfficiencyTableConfig
  | SkuEfficiencyTableConfig
  | DiagnosisInsightsConfig
  | KanbanBoardConfig
  | OperationLogsConfig

export interface JdOperatorStageConfig {
  sections: JdOperatorStageSectionConfig[]
}

// Mock数据：渠道构成
const mockChannelComposition = [
  { channel: '站外导入', pageViews: 1200000, ctr: 3.5, visitorUV: 42000, gmv: 840000, paymentConversionRate: 8.5 },
  { channel: '推荐/猜你喜欢', pageViews: 980000, ctr: 4.2, visitorUV: 41160, gmv: 720000, paymentConversionRate: 7.8 },
  { channel: '搜索流量', pageViews: 1500000, ctr: 5.0, visitorUV: 75000, gmv: 1200000, paymentConversionRate: 9.2 },
  { channel: '逛逛会场', pageViews: 650000, ctr: 3.0, visitorUV: 19500, gmv: 390000, paymentConversionRate: 6.5 }
]

// Mock数据：消费者画像（性别占比）
const mockGenderData = [
  { label: '男', value: 45, color: '#1890ff' },
  { label: '女', value: 55, color: '#ff4d9a' }
]

// Mock数据：消费者画像（年龄占比）
const mockAgeData = [
  { label: '18-25', value: 25, color: '#52c41a' },
  { label: '26-35', value: 40, color: '#1890ff' },
  { label: '36-45', value: 25, color: '#faad14' },
  { label: '46+', value: 10, color: '#ff4d4f' }
]

// Mock数据：评价维度
const mockReviewData = [
  { label: '好评', value: 75, color: '#52c41a' },
  { label: '中评', value: 20, color: '#faad14' },
  { label: '差评', value: 5, color: '#ff4d4f' }
]

// Mock数据：热销Top商品
const mockTopProductsData = [
  { label: '商品A', value: 35, color: '#1890ff' },
  { label: '商品B', value: 28, color: '#52c41a' },
  { label: '商品C', value: 22, color: '#faad14' },
  { label: '其他', value: 15, color: '#d9d9d9' }
]

// Mock数据：渠道效率
const mockChannelEfficiency = [
  { rank: 1, channel: '站外导入', pageViews: 1200000, clicks: 42000, ctr: 3.5, uv: 42000, payments: 3570, paymentConversionRate: 8.5, aov: 235, refundAmount: 17850, refundRate: 2.1 },
  { rank: 2, channel: '推荐/猜你喜欢', pageViews: 980000, clicks: 41160, ctr: 4.2, uv: 41160, payments: 3210, paymentConversionRate: 7.8, aov: 224, refundAmount: 16050, refundRate: 2.2 },
  { rank: 3, channel: '搜索流量', pageViews: 1500000, clicks: 75000, ctr: 5.0, uv: 75000, payments: 6900, paymentConversionRate: 9.2, aov: 174, refundAmount: 34500, refundRate: 2.5 },
  { rank: 4, channel: '逛逛会场', pageViews: 650000, clicks: 19500, ctr: 3.0, uv: 19500, payments: 1268, paymentConversionRate: 6.5, aov: 308, refundAmount: 6340, refundRate: 1.6 },
  { rank: 5, channel: '活动页', pageViews: 450000, clicks: 15750, ctr: 3.5, uv: 15750, payments: 1103, paymentConversionRate: 7.0, aov: 272, refundAmount: 5515, refundRate: 2.0 }
]

// Mock数据：SKU效率
const mockSkuEfficiency = [
  { rank: 1, skuId: 'SKU001', skuName: '金典有机纯牛奶 250mL×12盒', visitorUV: 35000, paymentConversionRate: 8.5, aov: 235, gmv: 822500 },
  { rank: 2, skuId: 'SKU002', skuName: '安慕希原味 205g×12瓶', visitorUV: 28000, paymentConversionRate: 7.8, aov: 224, gmv: 627200 },
  { rank: 3, skuId: 'SKU003', skuName: '优酸乳 原味 250mL×12盒', visitorUV: 22000, paymentConversionRate: 9.2, aov: 174, gmv: 382800 },
  { rank: 4, skuId: 'SKU004', skuName: '金典有机纯牛奶 250mL×16盒', visitorUV: 18000, paymentConversionRate: 6.5, aov: 308, gmv: 554400 },
  { rank: 5, skuId: 'SKU005', skuName: '安慕希蓝莓味 205g×12瓶', visitorUV: 15000, paymentConversionRate: 7.0, aov: 272, gmv: 408000 }
]

// Mock数据：诊断洞察
const mockDiagnosisInsights = [
  {
    title: '转化率持续下降',
    points: ['整体转化率较上周下降0.3%', '搜索流量转化率下降明显', '建议优化落地页质量'],
    severity: 'high' as const
  },
  {
    title: 'GMV表现稳定',
    points: ['整体GMV保持在目标以上', '站外导入渠道表现优异', '建议保持当前策略'],
    severity: 'success' as const
  },
  {
    title: '客单价波动',
    points: ['平均客单价较上周下降5元', '逛逛会场客单价上升明显', '建议优化商品组合'],
    severity: 'medium' as const
  },
  {
    title: '退款率偏高',
    points: ['整体退款率较上周上升0.2%', '搜索流量退款率上升明显', '建议优化商品描述'],
    severity: 'medium' as const
  },
  {
    title: '渠道结构优化',
    points: ['推荐渠道表现稳定', '搜索渠道需要优化', '建议继续优化渠道结构'],
    severity: 'low' as const
  },
  {
    title: 'SKU表现分化',
    points: ['头部SKU表现优异', '长尾SKU需要优化', '建议暂停低效SKU'],
    severity: 'low' as const
  }
]

// Mock数据：任务看板
const mockKanbanColumns = [
  {
    id: 'todo',
    title: '待处理',
    cards: [
      { id: 'todo-1', title: '预算校准', assignee: '运营团队', deadline: '2024-01-26' },
      { id: 'todo-2', title: '商品优化', assignee: '运营团队', deadline: '2024-01-27' },
      { id: 'todo-3', title: '渠道扩展', assignee: '运营团队', deadline: '2024-01-28' }
    ]
  },
  {
    id: 'doing',
    title: '进行中',
    cards: [
      { id: 'doing-1', title: '计划调整', assignee: '电商负责人', deadline: '2024-01-25' },
      { id: 'doing-2', title: '出价优化', assignee: '运营团队', deadline: '2024-01-26' },
      { id: 'doing-3', title: '素材测试', assignee: '运营团队', deadline: '2024-01-27' }
    ]
  },
  {
    id: 'done',
    title: '已完成',
    cards: [
      { id: 'done-1', title: '计划创建', assignee: '运营团队', deadline: '2024-01-24' }
    ]
  }
]

// Mock数据：操作记录
const mockOperationLogs = [
  { time: '2024-01-25 14:30', action: '创建运营计划 P007' },
  { time: '2024-01-25 13:20', action: '调整计划 P001 预算至 150,000元' },
  { time: '2024-01-25 12:15', action: '暂停SKU SKU005 投放' },
  { time: '2024-01-25 11:00', action: '优化计划 P002 渠道定向' },
  { time: '2024-01-25 10:30', action: '上传新商品 SKU006' },
  { time: '2024-01-25 09:45', action: '调整计划 P003 出价至 0.55元' },
  { time: '2024-01-24 18:20', action: '创建运营计划 P006' },
  { time: '2024-01-24 17:10', action: '暂停SKU SKU004 投放' },
  { time: '2024-01-24 16:00', action: '优化计划 P004 商品组合' },
  { time: '2024-01-24 15:30', action: '调整计划 P005 预算至 120,000元' },
  { time: '2024-01-24 14:20', action: '创建运营计划 P005' },
  { time: '2024-01-24 13:15', action: '上传新商品 SKU005' }
]

export const jdOperatorStageConfig = {
  overview: {
    sections: [
      {
        type: 'kpi-cards',
        title: '核心指标',
        cards: [
          { label: 'GMV', metricKey: 'jd-sales', fallbackMetricKey: 'douyin-total-sales', unit: '元', aggregate: true, trend: 'up', compareValue: '↑12%' },
          { label: '总UV', metricKey: 'jd-traffic', fallbackMetricKey: 'jd-conversion', unit: '', aggregate: true, trend: 'up', compareValue: '↑15%' },
          { label: '支付订单数', metricKey: 'jd-sales', fallbackMetricKey: 'jd-conversion', unit: '单', aggregate: true, trend: 'up', compareValue: '↑8%' },
          { label: '转化率', metricKey: 'jd-conversion', fallbackMetricKey: 'tmall-conversion', unit: '%', trend: 'stable', compareValue: '→' },
          { label: '客单价', metricKey: 'jd-sales', fallbackMetricKey: 'jd-conversion', unit: '元', trend: 'down', compareValue: '↓5元' },
          { label: '退款金额', metricKey: 'jd-sales', fallbackMetricKey: 'jd-conversion', unit: '元', trend: 'up', compareValue: '↑3%' },
          { label: '退款率', metricKey: 'jd-conversion', fallbackMetricKey: 'tmall-conversion', unit: '%', trend: 'up', compareValue: '↑0.2%' },
          { label: '商品搜索UV', metricKey: 'jd-traffic', fallbackMetricKey: 'jd-conversion', unit: '', aggregate: true, trend: 'up', compareValue: '↑18%' }
        ]
      } as KPICardConfig,
      {
        type: 'channel-composition-table',
        title: '渠道构成',
        channels: mockChannelComposition
      } as ChannelCompositionTableConfig,
      {
        type: 'consumer-profile-donuts',
        title: '消费者画像',
        donuts: [
          { title: '性别占比', data: mockGenderData },
          { title: '年龄占比', data: mockAgeData },
          { title: '评价维度', data: mockReviewData },
          { title: '热销Top商品', data: mockTopProductsData }
        ]
      } as ConsumerProfileDonutsConfig
    ]
  } as JdOperatorStageConfig,

  coldStart: {
    sections: [
      {
        type: 'target-progress',
        title: '冷启动目标',
        metrics: [
          { label: 'GMV', targetKey: '总成交金额', currentKey: '总成交金额' },
          { label: 'UV', targetKey: '总成交金额', currentKey: '总成交金额' },
          { label: 'ROI', targetKey: '总成交金额', currentKey: '总成交金额' }
        ]
      } as TargetProgressConfig,
      {
        type: 'ai-insight-summary',
        title: 'AI洞察摘要',
        date: '2024-01-25',
        insights: [
          '本周GMV较上周提升12%，表现优异',
          '搜索流量转化率下降0.3%，建议优化落地页',
          '站外导入渠道ROI保持在3.0以上，建议保持',
          '建议调整预算分配，增加搜索渠道预算'
        ],
        actionText: '查看AI洞察'
      } as AIInsightSummaryConfig,
      {
        type: 'funnel-chart',
        title: '转化漏斗',
        steps: [
          { label: '曝光', value: 9800000 },
          { label: '点击', value: 735000 },
          { label: '进店', value: 588000 },
          { label: '加购', value: 47040 },
          { label: '下单', value: 42336 },
          { label: '支付', value: 38000 }
        ]
      } as FunnelChartConfig,
      {
        type: 'key-metrics-overview',
        title: '关键指标',
        metrics: [
          { label: 'GMV', value: 950000, unit: '元', trend: 'up' },
          { label: '总UV', value: 35000, unit: '', trend: 'up' },
          { label: '支付订单数', value: 3800, unit: '单', trend: 'up' },
          { label: '转化率', value: 4.2, unit: '%', trend: 'stable' },
          { label: '客单价', value: 250, unit: '元', trend: 'down' },
          { label: '退款率', value: 2.1, unit: '%', trend: 'up' }
        ]
      } as KeyMetricsOverviewConfig,
      {
        type: 'diagnosis-insights',
        title: 'AI洞察',
        cards: mockDiagnosisInsights
      } as DiagnosisInsightsConfig,
      {
        type: 'kanban-board',
        title: '任务',
        columns: mockKanbanColumns
      } as KanbanBoardConfig,
      {
        type: 'operation-logs',
        title: '操作记录',
        logs: mockOperationLogs
      } as OperationLogsConfig
    ]
  } as JdOperatorStageConfig,

  scaleUp: {
    sections: [
      {
        type: 'target-progress',
        title: '放量期目标',
        metrics: [
          { label: 'GMV', targetKey: '总成交金额', currentKey: '总成交金额' },
          { label: 'UV', targetKey: '总成交金额', currentKey: '总成交金额' },
          { label: 'ROI', targetKey: '总成交金额', currentKey: '总成交金额' }
        ]
      } as TargetProgressConfig,
      {
        type: 'ai-insight-summary',
        title: 'AI洞察摘要',
        date: '2024-01-25',
        insights: [
          '放量期GMV持续增长，建议扩大投放规模',
          '整体ROI保持稳定，建议保持当前策略',
          '搜索渠道表现优异，建议增加预算',
          '建议优化推荐渠道，提升整体效率'
        ],
        actionText: '查看AI洞察'
      } as AIInsightSummaryConfig,
      {
        type: 'funnel-chart',
        title: '转化漏斗',
        steps: [
          { label: '曝光', value: 12000000 },
          { label: '点击', value: 900000 },
          { label: '进店', value: 720000 },
          { label: '加购', value: 57600 },
          { label: '下单', value: 51840 },
          { label: '支付', value: 46500 }
        ]
      } as FunnelChartConfig,
      {
        type: 'channel-efficiency-table',
        title: '渠道效率表',
        channels: mockChannelEfficiency
      } as ChannelEfficiencyTableConfig,
      {
        type: 'sku-efficiency-table',
        title: 'SKU维度效率',
        skus: mockSkuEfficiency
      } as SkuEfficiencyTableConfig,
      {
        type: 'diagnosis-insights',
        title: 'AI洞察',
        cards: mockDiagnosisInsights.slice(0, 5)
      } as DiagnosisInsightsConfig,
      {
        type: 'kanban-board',
        title: '任务',
        columns: mockKanbanColumns
      } as KanbanBoardConfig,
      {
        type: 'operation-logs',
        title: '操作记录',
        logs: mockOperationLogs
      } as OperationLogsConfig
    ]
  } as JdOperatorStageConfig
}

