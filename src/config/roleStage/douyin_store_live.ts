// 抖音店播运营角色阶段配置
// 所有指标字段必须来自现有 mockData/metrics，不能新增字段

export type DouyinShopOpsSectionType = 
  | 'kpi-cards'           // KPI卡片组（带小图）
  | 'product-review-table' // 商品评价&推荐均分表格
  | 'live-channel-table'   // 直播通路监控表格
  | 'structure-charts'     // 结构/效率图表区
  | 'target-progress'      // 目标与进度
  | 'ai-insight'          // AI洞察（绿色卡片）
  | 'live-efficiency-table' // 直播渠道效率表格
  | 'product-card-efficiency-table' // 商品卡销售效率表格
  | 'diagnosis-charts'     // 人群&内容诊断图表
  | 'action-suggestions'   // 行动建议
  | 'kanban-board'         // 任务看板
  | 'funnel-chart'         // 漏斗图
  | 'channel-efficiency-table' // 通路效率表格
  | 'sankey-flow'          // 人群流转桑基图

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
    hasAlert?: boolean  // 是否有红色提示标记
  }>
}

export interface ProductReviewTableConfig {
  type: 'product-review-table'
  title?: string
  products: Array<{
    name: string
    reviewCount: number
    avgScore?: number
    badReviewRate?: number
  }>
}

export interface LiveChannelTableConfig {
  type: 'live-channel-table'
  title?: string
  channels: Array<{
    name: string
    liveHours?: number
    gmv?: number
    roi?: number
    trafficRatio?: number
    hourlyGmv?: number
  }>
}

export interface StructureChartsConfig {
  type: 'structure-charts'
  title?: string
  charts: Array<{
    label: string
    chartType: 'donut' | 'bar' | 'column'
    data: Array<{ name: string; value: number }>
  }>
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

export interface AIInsightConfig {
  type: 'ai-insight'
  title?: string
  insights: string[]
  actionText?: string
}

export interface LiveEfficiencyTableConfig {
  type: 'live-efficiency-table'
  title?: string
  products: Array<{
    name: string
    exposure?: number
    clickCount?: number
    detailClickRate?: number
    buyers?: number
    clickBuyRate?: number
    gmv?: number
  }>
}

export interface ProductCardEfficiencyTableConfig {
  type: 'product-card-efficiency-table'
  title?: string
  products: Array<{
    name: string
    exposure?: number
    clickUsers?: number
    buyers?: number
    clickBuyRate?: number
    gmv?: number
  }>
}

export interface DiagnosisChartsConfig {
  type: 'diagnosis-charts'
  title?: string
  charts: Array<{
    label: string
    chartType: 'bar' | 'progress'
    data: Array<{ name: string; value: number }> | number  // progress 为单个数值
  }>
}

export interface ActionSuggestionsConfig {
  type: 'action-suggestions'
  title?: string
  items: Array<{
    title: string
    description: string
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
      tag?: string
      date?: string
      assignee?: string
    }>
  }>
}

export interface FunnelChartConfig {
  type: 'funnel-chart'
  title?: string
  steps: Array<{ label: string; value: number }>
}

export interface ChannelEfficiencyTableConfig {
  type: 'channel-efficiency-table'
  title?: string
  channels: Array<{
    name: string
    liveHours?: number
    gmv?: number
    roi?: number
    hourlyGmv?: number
  }>
}

export interface SankeyFlowConfig {
  type: 'sankey-flow'
  title?: string
  nodes: Array<{ name: string }>
  links: Array<{ source: number; target: number; value: number }>
}

export type DouyinShopOpsStageSectionConfig = 
  | KPICardConfig
  | ProductReviewTableConfig
  | LiveChannelTableConfig
  | StructureChartsConfig
  | TargetProgressConfig
  | AIInsightConfig
  | LiveEfficiencyTableConfig
  | ProductCardEfficiencyTableConfig
  | DiagnosisChartsConfig
  | ActionSuggestionsConfig
  | KanbanBoardConfig
  | FunnelChartConfig
  | ChannelEfficiencyTableConfig
  | SankeyFlowConfig

export interface DouyinShopOpsStageConfig {
  sections: DouyinShopOpsStageSectionConfig[]
}

// Mock数据：商品评价
const mockProductReviews = [
  { name: '金典有机纯牛奶 250mL×12盒', reviewCount: 1250, avgScore: 4.8, badReviewRate: 2.1 },
  { name: '安慕希原味 205g×12瓶', reviewCount: 890, avgScore: 4.6, badReviewRate: 3.5 },
  { name: '优酸乳 原味 250mL×12盒', reviewCount: 650, avgScore: 4.7, badReviewRate: 2.8 },
  { name: '金典有机纯牛奶 250mL×16盒', reviewCount: 420, avgScore: 4.5, badReviewRate: 4.2 }
]

// Mock数据：直播通路
const mockLiveChannels = [
  { name: '自播A', liveHours: 120, gmv: 300000, roi: 3.2, trafficRatio: 45, hourlyGmv: 2500 },
  { name: '自播B', liveHours: 96, gmv: 240000, roi: 2.8, trafficRatio: 35, hourlyGmv: 2500 },
  { name: '达人A', liveHours: 48, gmv: 180000, roi: 4.5, trafficRatio: 12, hourlyGmv: 3750 },
  { name: '达人B', liveHours: 36, gmv: 120000, roi: 3.8, trafficRatio: 8, hourlyGmv: 3333 }
]

// Mock数据：结构图表
const mockChannelStructure = [
  { name: '直播', value: 45 },
  { name: '短视频', value: 30 },
  { name: '货架', value: 15 },
  { name: '达人', value: 10 }
]

const mockProductStructure = [
  { name: '液体奶', value: 55 },
  { name: '纯牛奶', value: 25 },
  { name: '常温酸奶', value: 20 }
]

// Mock数据：直播渠道效率
const mockLiveEfficiency = [
  { name: '金典有机纯牛奶 250mL×12盒', exposure: 50000, clickCount: 15000, detailClickRate: 30, buyers: 4500, clickBuyRate: 30, gmv: 4500000 },
  { name: '安慕希原味 205g×12瓶', exposure: 35000, clickCount: 10500, detailClickRate: 30, buyers: 3150, clickBuyRate: 30, gmv: 630000 },
  { name: '优酸乳 原味 250mL×12盒', exposure: 28000, clickCount: 8400, detailClickRate: 30, buyers: 2520, clickBuyRate: 30, gmv: 1005000 },
  { name: '金典有机纯牛奶 250mL×16盒', exposure: 20000, clickCount: 6000, detailClickRate: 30, buyers: 1800, clickBuyRate: 30, gmv: 540000 }
]

// Mock数据：商品卡效率
const mockProductCardEfficiency = [
  { name: '金典有机纯牛奶 250mL×12盒', exposure: 80000, clickUsers: 16000, buyers: 4000, clickBuyRate: 25, gmv: 4000000 },
  { name: '安慕希原味 205g×12瓶', exposure: 60000, clickUsers: 12000, buyers: 3000, clickBuyRate: 25, gmv: 597000 },
  { name: '优酸乳 原味 250mL×12盒', exposure: 45000, clickUsers: 9000, buyers: 2250, clickBuyRate: 25, gmv: 897750 },
  { name: '金典有机纯牛奶 250mL×16盒', exposure: 32000, clickUsers: 6400, buyers: 1600, clickBuyRate: 25, gmv: 480000 }
]

// Mock数据：人群诊断
const mockAudienceData = [
  { name: '18-25岁', value: 35 },
  { name: '26-35岁', value: 40 },
  { name: '36-45岁', value: 20 },
  { name: '45+岁', value: 5 }
]

// Mock数据：行动建议
const mockActions = [
  { title: '优化直播时段', description: '建议调整直播时段，提升18-25岁人群观看率' },
  { title: '加强商品卡曝光', description: '当前商品卡点击率偏低，建议优化商品卡展示策略' },
  { title: '提升达人合作效率', description: '达人A ROI表现优异，建议增加合作频次' },
  { title: '优化退款率', description: '部分商品退款率偏高，建议分析退款原因并优化' }
]

// Mock数据：任务看板
const mockKanbanColumns = [
  {
    id: 'todo',
    title: '待处理',
    cards: [
      { id: 'todo-1', title: '优化直播时段策略', tag: '高优先级', date: '2024-01-25' },
      { id: 'todo-2', title: '分析退款原因', tag: '中优先级', date: '2024-01-26' }
    ]
  },
  {
    id: 'doing',
    title: '进行中',
    cards: [
      { id: 'doing-1', title: '商品卡展示优化', tag: '高优先级', date: '2024-01-24', assignee: '张三' },
      { id: 'doing-2', title: '达人合作对接', tag: '中优先级', date: '2024-01-24', assignee: '李四' }
    ]
  },
  {
    id: 'done',
    title: '已完成',
    cards: [
      { id: 'done-1', title: '直播流程优化', tag: '已完成', date: '2024-01-23' },
      { id: 'done-2', title: '数据分析报告', tag: '已完成', date: '2024-01-22' }
    ]
  }
]

// Mock数据：Sankey节点
const mockSankeyNodes = [
  { name: '新客' },
  { name: '老客' },
  { name: '潜在客户' },
  { name: '流失客户' },
  { name: '直播间' },
  { name: '商品页' },
  { name: '短视频' },
  { name: '商品卡' },
  { name: '复购' },
  { name: '下单' },
  { name: '支付' },
  { name: '退货' }
]
const mockSankeyLinks = [
  { source: 0, target: 4, value: 400 },
  { source: 1, target: 5, value: 300 },
  { source: 2, target: 6, value: 200 },
  { source: 4, target: 8, value: 300 },
  { source: 5, target: 9, value: 250 },
  { source: 6, target: 10, value: 180 }
]

export const douyinShopOpsStageConfig = {
  overview: {
    sections: [
      {
        type: 'kpi-cards',
        title: '核心指标',
        cards: [
          { label: '目标GMV', metricKey: 'douyin-total-sales', unit: '元', aggregate: false, hasAlert: false },
          { label: '当前GMV', metricKey: 'douyin-total-sales', unit: '元', aggregate: true, trend: 'up' },
          { label: 'ROI', metricKey: 'douyin-commission', fallbackMetricKey: 'douyin-total-sales', unit: '', trend: 'stable', hasAlert: true },
          { label: '退款率', metricKey: 'douyin-refund-rate', unit: '%', trend: 'down' },
          { label: '订单数', metricKey: 'douyin-total-orders', unit: '单', aggregate: true, trend: 'up' },
          { label: '客单价', metricKey: 'douyin-avg-price', unit: '元', trend: 'stable' }
        ]
      } as KPICardConfig,
      {
        type: 'product-review-table',
        title: '商品评价&推荐均分',
        products: mockProductReviews
      } as ProductReviewTableConfig,
      {
        type: 'live-channel-table',
        title: '直播通路监控',
        channels: mockLiveChannels
      } as LiveChannelTableConfig,
      {
        type: 'structure-charts',
        title: '结构/效率分析',
        charts: [
          { label: '渠道结构占比', chartType: 'donut', data: mockChannelStructure },
          { label: '通路对比', chartType: 'bar', data: mockLiveChannels.slice(0, 4).map(c => ({ name: c.name, value: c.gmv || 0 })) },
          { label: '人群贡献', chartType: 'column', data: mockAudienceData }
        ]
      } as StructureChartsConfig
    ]
  } as DouyinShopOpsStageConfig,

  coldStart: {
    sections: [
      {
        type: 'target-progress',
        title: '冷启动阶段目标与进度',
        metrics: [
          { label: '总成交金额', targetKey: '总成交金额', currentKey: '总成交金额' },
          { label: '总成交订单数', targetKey: '总成交订单数', currentKey: '总成交订单数' },
          { label: '客单价', targetKey: '客单价', currentKey: '客单价' }
        ]
      } as TargetProgressConfig,
      {
        type: 'ai-insight',
        title: 'AI洞察',
        insights: [
          '本阶段关键动作：建议加大推广力度，提升直播曝光量',
          '风险提示：商品卡点击率需要持续监控，建议优化商品卡展示',
          '建议：优化直播时段，提升18-25岁人群观看率',
          '建议：达人A ROI表现优异，建议增加合作频次'
        ],
        actionText: '查看详情'
      } as AIInsightConfig,
      {
        type: 'live-efficiency-table',
        title: '直播渠道效率',
        products: mockLiveEfficiency
      } as LiveEfficiencyTableConfig,
      {
        type: 'product-card-efficiency-table',
        title: '商品卡销售效率',
        products: mockProductCardEfficiency
      } as ProductCardEfficiencyTableConfig,
      {
        type: 'diagnosis-charts',
        title: '人群&内容诊断',
        charts: [
          { label: '人群覆盖', chartType: 'bar', data: mockAudienceData },
          { label: '内容效率', chartType: 'progress', data: 75 }
        ]
      } as DiagnosisChartsConfig,
      {
        type: 'action-suggestions',
        title: '行动建议',
        items: mockActions
      } as ActionSuggestionsConfig,
      {
        type: 'kanban-board',
        title: '任务看板',
        columns: mockKanbanColumns
      } as KanbanBoardConfig
    ]
  } as DouyinShopOpsStageConfig,

  scaleUp: {
    sections: [
      {
        type: 'kpi-cards',
        title: '放量期经营总览',
        cards: [
          { label: 'GMV', metricKey: 'douyin-total-sales', unit: '元', aggregate: true, trend: 'up' },
          { label: 'ROI', metricKey: 'douyin-commission', fallbackMetricKey: 'douyin-total-sales', unit: '', trend: 'stable', hasAlert: true },
          { label: '退款率', metricKey: 'douyin-refund-rate', unit: '%', trend: 'down' },
          { label: '订单数', metricKey: 'douyin-total-orders', unit: '单', aggregate: true, trend: 'up' },
          { label: '客单价', metricKey: 'douyin-avg-price', unit: '元', trend: 'stable' }
        ]
      } as KPICardConfig,
      {
        type: 'target-progress',
        title: '目标节奏/达成进度',
        metrics: [
          { label: '总成交金额', targetKey: '总成交金额', currentKey: '总成交金额' },
          { label: '总成交订单数', targetKey: '总成交订单数', currentKey: '总成交订单数' }
        ]
      } as TargetProgressConfig,
      {
        type: 'ai-insight',
        title: 'AI洞察',
        insights: [
          '放量期表现优异，建议扩大生产规模',
          '当前转化率保持稳定，建议继续优化直播流程',
          '用户反馈整体积极，建议收集并分析用户评价',
          '建议加大推广力度，进一步提升市场份额'
        ],
        actionText: '查看详情'
      } as AIInsightConfig,
      {
        type: 'funnel-chart',
        title: '直播转化漏斗',
        steps: [
          { label: '曝光', value: 10000 },
          { label: '点击', value: 5000 },
          { label: '成交', value: 2000 },
          { label: '支付', value: 1800 }
        ]
      } as FunnelChartConfig,
      {
        type: 'channel-efficiency-table',
        title: '通路/平台效率',
        channels: mockLiveChannels
      } as ChannelEfficiencyTableConfig,
      {
        type: 'live-efficiency-table',
        title: '直播带货效率',
        products: mockLiveEfficiency.slice(0, 3)
      } as LiveEfficiencyTableConfig,
      {
        type: 'sankey-flow',
        title: '人群流转',
        nodes: mockSankeyNodes,
        links: mockSankeyLinks
      } as SankeyFlowConfig,
      {
        type: 'action-suggestions',
        title: '行动建议',
        items: mockActions
      } as ActionSuggestionsConfig,
      {
        type: 'kanban-board',
        title: '任务看板',
        columns: mockKanbanColumns
      } as KanbanBoardConfig
    ]
  } as DouyinShopOpsStageConfig
}

