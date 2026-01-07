// BU品牌负责人阶段配置
// 所有指标字段必须来自现有 mockData/metrics，不能新增字段

// 复用电商负责人的基础类型，并扩展新类型
export type SectionType = 
  | 'kpi-cards'           // KPI卡片组
  | 'platform-breakdown'  // 平台拆分表格
  | 'word-cloud'          // 口碑热词（双词云）
  | 'score-system'        // 评分体系（柱状+综合评分）
  | 'sankey-flow'         // 用户路径/渠道流（Sankey图）
  | 'risk-alert'          // 风险提示
  | 'target-progress'     // 目标与进度
  | 'ai-insight'          // AI洞察（绿色卡片）
  | 'trend-charts'        // 关键指标趋势（折线图）
  | 'diagnosis-cards'     // 问题诊断（红黄绿卡片）
  | 'kanban-board'        // 行动卡（Kanban看板）
  | 'funnel-group'        // 漏斗组（总+平台拆分）
  | 'efficiency-grid'     // 核心效率面板（多指标网格）

export interface KPICardConfig {
  type: 'kpi-cards'
  title?: string
  cards: Array<{
    label: string
    metricKey: string
    fallbackMetricKey?: string
    unit?: string
    aggregate?: boolean
  }>
}

export interface PlatformBreakdownConfig {
  type: 'platform-breakdown'
  title?: string
  platforms: Array<{
    name: string
    platformKey: string
    metrics: Array<{
      label: string
      metricKey: string
      fallbackMetricKey?: string
      unit?: string
    }>
  }>
}

export interface WordCloudConfig {
  type: 'word-cloud'
  title?: string
  leftTitle?: string  // 好评热词
  rightTitle?: string // 差评热词
  positiveWords: Array<{ word: string; weight: number }>
  negativeWords: Array<{ word: string; weight: number }>
}

export interface ScoreSystemConfig {
  type: 'score-system'
  title?: string
  dimensions: Array<{
    name: string
    score: number  // 0-100
  }>
  overallScore: number  // 综合评分 0-100
}

export interface SankeyFlowConfig {
  type: 'sankey-flow'
  title?: string
  // Sankey数据简化为节点和链接（mock数据）
  nodes: Array<{ name: string }>
  links: Array<{ source: number; target: number; value: number }>
}

export interface RiskAlertConfig {
  type: 'risk-alert'
  title?: string
  items: Array<{
    text: string
    level?: 'high' | 'medium' | 'low'  // 风险级别（影响颜色）
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
  actionText?: string  // 查看更多按钮文本
}

export interface TrendChartsConfig {
  type: 'trend-charts'
  title?: string
  charts: Array<{
    label: string
    metricKey: string
    data: Array<{ date: string; value: number }>  // mock数据
  }>
}

export interface DiagnosisCardsConfig {
  type: 'diagnosis-cards'
  title?: string
  cards: Array<{
    title: string
    description: string
    status: 'error' | 'warning' | 'success'  // 红/黄/绿
    actionText?: string
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
      description?: string
    }>
  }>
}

export interface FunnelGroupConfig {
  type: 'funnel-group'
  title?: string
  mainFunnel: {
    title: string
    steps: Array<{ label: string; value: number }>
  }
  platformFunnels: Array<{
    platform: string
    steps: Array<{ label: string; value: number }>
  }>
}

export interface EfficiencyGridConfig {
  type: 'efficiency-grid'
  title?: string
  metrics: Array<{
    label: string
    metricKey: string
    fallbackMetricKey?: string
    unit?: string
    trend?: 'up' | 'down' | 'stable'
    compareValue?: string  // 环比/同比文本
  }>
}

export type BrandOwnerStageSectionConfig = 
  | KPICardConfig
  | PlatformBreakdownConfig
  | WordCloudConfig
  | ScoreSystemConfig
  | SankeyFlowConfig
  | RiskAlertConfig
  | TargetProgressConfig
  | AIInsightConfig
  | TrendChartsConfig
  | DiagnosisCardsConfig
  | KanbanBoardConfig
  | FunnelGroupConfig
  | EfficiencyGridConfig

export interface BrandOwnerStageConfig {
  sections: BrandOwnerStageSectionConfig[]
}

// Mock数据：口碑热词
const mockPositiveWords = [
  { word: '营养', weight: 85 },
  { word: '蛋白质', weight: 78 },
  { word: '口感', weight: 72 },
  { word: '孩子爱吃', weight: 68 },
  { word: '健康', weight: 65 },
  { word: '新鲜', weight: 60 },
  { word: '包装好', weight: 55 },
  { word: '性价比高', weight: 50 }
]

const mockNegativeWords = [
  { word: '太甜', weight: 45 },
  { word: '包装破损', weight: 40 },
  { word: '味道一般', weight: 35 },
  { word: '价格偏高', weight: 30 },
  { word: '保质期短', weight: 25 }
]

// Mock数据：评分体系
const mockScoreDimensions = [
  { name: '赛道增速', score: 80 },
  { name: '起量周期', score: 85 },
  { name: '新品渗透率', score: 70 },
  { name: '定价合理度', score: 70 },
  { name: '卖点匹配度', score: 50 }
]
const mockOverallScore = 69.8

// Mock数据：Sankey节点和链接（简化版）
const mockSankeyNodes = [
  { name: '曝光' },
  { name: '点击' },
  { name: '下单' },
  { name: '支付' },
  { name: '复购' },
  { name: '退货' }
]
const mockSankeyLinks = [
  { source: 0, target: 1, value: 1000 },
  { source: 1, target: 2, value: 500 },
  { source: 2, target: 3, value: 400 },
  { source: 3, target: 4, value: 100 },
  { source: 3, target: 5, value: 20 }
]

// Mock数据：趋势图数据
const mockTrendData = [
  { date: '2024-01-01', value: 100000 },
  { date: '2024-01-08', value: 120000 },
  { date: '2024-01-15', value: 150000 },
  { date: '2024-01-22', value: 140000 },
  { date: '2024-01-29', value: 160000 }
]

// Mock数据：问题诊断卡片
const mockDiagnosisCards = [
  {
    title: '转化率偏低',
    description: '当前转化率较目标存在一定差距，建议优化产品页面和详情描述',
    status: 'error' as const,
    actionText: '查看原因'
  },
  {
    title: '退款率需要监控',
    description: '退款率较上月有所上升，建议分析退货原因',
    status: 'warning' as const,
    actionText: '查看建议'
  },
  {
    title: '推广力度不足',
    description: '建议加大推广力度，扩大市场份额',
    status: 'warning' as const,
    actionText: '查看建议'
  },
  {
    title: '用户反馈良好',
    description: '用户评价整体积极，产品质量稳定',
    status: 'success' as const,
    actionText: '查看详情'
  },
  {
    title: '库存充足',
    description: '当前库存充足，可支持持续销售',
    status: 'success' as const,
    actionText: '查看详情'
  },
  {
    title: '价格策略需要调整',
    description: '建议分析竞品价格，优化定价策略',
    status: 'warning' as const,
    actionText: '查看建议'
  }
]

// Mock数据：Kanban看板
const mockKanbanColumns = [
  {
    id: 'todo',
    title: '待办',
    cards: [
      { id: 'todo-1', title: '优化产品页面详情', description: '提升转化率' },
      { id: 'todo-2', title: '分析退货原因', description: '降低退款率' },
      { id: 'todo-3', title: '制定推广计划', description: '扩大市场份额' }
    ]
  },
  {
    id: 'in-progress',
    title: '进行中',
    cards: [
      { id: 'progress-1', title: '收集用户反馈', description: '优化产品体验' },
      { id: 'progress-2', title: '价格策略调整', description: '分析竞品价格' }
    ]
  },
  {
    id: 'done',
    title: '已完成',
    cards: [
      { id: 'done-1', title: '产品上架', description: '已完成' },
      { id: 'done-2', title: '初始推广', description: '已完成' }
    ]
  }
]

export const brandOwnerStageConfig = {
  overview: {
    sections: [
      {
        type: 'kpi-cards',
        title: '核心经营总览',
        cards: [
          // 第一排 4 张卡
          {
            label: '总GMV',
            metricKey: '总成交金额',
            aggregate: true,
            unit: '元'
          },
          {
            label: '总ROI',
            metricKey: '佣金',
            fallbackMetricKey: '总成交金额',
            unit: '',
            aggregate: false
          },
          {
            label: '总退款率',
            metricKey: '总退款率',
            unit: '%',
            aggregate: false
          },
          {
            label: '客单价',
            metricKey: '客单价',
            unit: '元',
            aggregate: false
          },
          // 第二排 3 张卡
          {
            label: '抖音GMV',
            metricKey: 'douyin-total-sales',
            unit: '元',
            aggregate: false
          },
          {
            label: '抖音占比',
            // 注意：占比字段不存在，使用固定值或计算
            metricKey: 'douyin-total-sales',
            fallbackMetricKey: '总成交金额',
            unit: '%',
            aggregate: false
          },
          {
            label: '抖音订单数',
            metricKey: 'douyin-total-orders',
            unit: '单',
            aggregate: false
          }
        ]
      } as KPICardConfig,
      {
        type: 'platform-breakdown',
        title: '平台拆分',
        platforms: [
          {
            name: '抖音',
            platformKey: 'douyin',
            metrics: [
              { label: 'GMV', metricKey: 'douyin-total-sales', unit: '元' },
              { label: '退款率', metricKey: 'douyin-refund-rate', unit: '%' },
              { label: 'ROI', metricKey: 'douyin-commission', fallbackMetricKey: 'douyin-total-sales', unit: '' }
            ]
          },
          {
            name: '天猫',
            platformKey: 'tmall',
            metrics: [
              { label: 'GMV', metricKey: 'tmall-sales', unit: '元' },
              { label: '退款率', metricKey: 'tmall-conversion', fallbackMetricKey: '总退款率', unit: '%' },
              { label: 'ROI', metricKey: 'tmall-sales', fallbackMetricKey: 'douyin-commission', unit: '' }
            ]
          },
          {
            name: '京东',
            platformKey: 'jd',
            metrics: [
              { label: 'GMV', metricKey: 'jd-sales', unit: '元' },
              { label: '退款率', metricKey: 'jd-conversion', fallbackMetricKey: '总退款率', unit: '%' },
              { label: 'ROI', metricKey: 'jd-sales', fallbackMetricKey: 'douyin-commission', unit: '' }
            ]
          }
        ]
      } as PlatformBreakdownConfig,
      {
        type: 'word-cloud',
        title: '口碑热词',
        leftTitle: '好评热词',
        rightTitle: '差评热词',
        positiveWords: mockPositiveWords,
        negativeWords: mockNegativeWords
      } as WordCloudConfig,
      {
        type: 'score-system',
        title: '评分体系',
        dimensions: mockScoreDimensions,
        overallScore: mockOverallScore
      } as ScoreSystemConfig,
      {
        type: 'sankey-flow',
        title: '用户路径/渠道流转',
        nodes: mockSankeyNodes,
        links: mockSankeyLinks
      } as SankeyFlowConfig,
      {
        type: 'risk-alert',
        title: '风险提示',
        items: [
          { text: '当前转化率较目标存在一定差距，建议优化产品页面', level: 'high' },
          { text: '退款率需要持续监控，建议分析退货原因', level: 'medium' },
          { text: '建议加大推广力度，扩大市场份额', level: 'low' }
        ]
      } as RiskAlertConfig
    ]
  } as BrandOwnerStageConfig,

  coldStart: {
    sections: [
      {
        type: 'target-progress',
        title: '冷启动阶段目标与进度',
        metrics: [
          {
            label: '总成交金额',
            targetKey: '总成交金额',
            currentKey: '总成交金额'
          },
          {
            label: '总成交订单数',
            targetKey: '总成交订单数',
            currentKey: '总成交订单数'
          },
          {
            label: '客单价',
            targetKey: '客单价',
            currentKey: '客单价'
          }
        ]
      } as TargetProgressConfig,
      {
        type: 'ai-insight',
        title: 'AI洞察',
        insights: [
          '根据数据分析，当前产品表现良好，成交金额较目标提升约15%',
          '产品转化率持续提升，建议继续保持当前推广策略',
          '用户反馈整体积极，建议收集并分析用户评价，优化产品体验',
          '建议考虑扩大投放规模，进一步提升市场份额'
        ],
        actionText: '查看更多'
      } as AIInsightConfig,
      {
        type: 'platform-breakdown',
        title: '分平台冷启动表现',
        platforms: [
          {
            name: '抖音',
            platformKey: 'douyin',
            metrics: [
              { label: 'GMV', metricKey: 'douyin-total-sales', unit: '元' },
              { label: '订单数', metricKey: 'douyin-total-orders', unit: '单' },
              { label: '退款率', metricKey: 'douyin-refund-rate', unit: '%' }
            ]
          },
          {
            name: '天猫',
            platformKey: 'tmall',
            metrics: [
              { label: 'GMV', metricKey: 'tmall-sales', unit: '元' },
              { label: '订单数', metricKey: 'tmall-traffic', fallbackMetricKey: 'douyin-total-orders', unit: '单' },
              { label: '退款率', metricKey: 'tmall-conversion', fallbackMetricKey: '总退款率', unit: '%' }
            ]
          },
          {
            name: '京东',
            platformKey: 'jd',
            metrics: [
              { label: 'GMV', metricKey: 'jd-sales', unit: '元' },
              { label: '订单数', metricKey: 'jd-traffic', fallbackMetricKey: 'douyin-total-orders', unit: '单' },
              { label: '退款率', metricKey: 'jd-conversion', fallbackMetricKey: '总退款率', unit: '%' }
            ]
          }
        ]
      } as PlatformBreakdownConfig,
      {
        type: 'trend-charts',
        title: '关键指标趋势',
        charts: [
          {
            label: 'GMV趋势',
            metricKey: '总成交金额',
            data: mockTrendData
          },
          {
            label: 'ROI趋势',
            metricKey: '佣金',
            data: mockTrendData.map(d => ({ ...d, value: d.value * 0.1 }))
          }
        ]
      } as TrendChartsConfig,
      {
        type: 'diagnosis-cards',
        title: '问题诊断',
        cards: mockDiagnosisCards
      } as DiagnosisCardsConfig,
      {
        type: 'kanban-board',
        title: '行动卡',
        columns: mockKanbanColumns
      } as KanbanBoardConfig
    ]
  } as BrandOwnerStageConfig,

  scaleUp: {
    sections: [
      {
        type: 'target-progress',
        title: '目标节奏/达成进度',
        metrics: [
          {
            label: '总成交金额',
            targetKey: '总成交金额',
            currentKey: '总成交金额'
          },
          {
            label: '总成交订单数',
            targetKey: '总成交订单数',
            currentKey: '总成交订单数'
          },
          {
            label: '客单价',
            targetKey: '客单价',
            currentKey: '客单价'
          }
        ]
      } as TargetProgressConfig,
      {
        type: 'ai-insight',
        title: 'AI洞察',
        insights: [
          '放量期表现优异，建议扩大生产规模',
          '当前转化率保持稳定，建议继续优化产品页面',
          '用户反馈整体积极，建议收集并分析用户评价',
          '建议加大推广力度，进一步提升市场份额'
        ],
        actionText: '查看更多'
      } as AIInsightConfig,
      {
        type: 'efficiency-grid',
        title: '核心效率面板',
        metrics: [
          { label: 'GMV', metricKey: '总成交金额', aggregate: true, unit: '元', trend: 'up', compareValue: '↑12%' },
          { label: 'ROI', metricKey: '佣金', fallbackMetricKey: '总成交金额', unit: '', trend: 'stable' },
          { label: '退款率', metricKey: '总退款率', unit: '%', trend: 'down', compareValue: '↓2%' },
          { label: '订单数', metricKey: '总成交订单数', aggregate: true, unit: '单', trend: 'up', compareValue: '↑8%' },
          { label: '客单价', metricKey: '客单价', unit: '元', trend: 'stable' },
          { label: '转化率', metricKey: 'tmall-conversion', fallbackMetricKey: 'jd-conversion', unit: '%', trend: 'up' },
          { label: '支付率', metricKey: 'douyin-total-orders', fallbackMetricKey: '总成交订单数', unit: '%', trend: 'stable' },
          { label: '复购率', metricKey: 'douyin-total-orders', fallbackMetricKey: '总成交订单数', unit: '%', trend: 'up' }
        ]
      } as EfficiencyGridConfig,
      {
        type: 'funnel-group',
        title: '漏斗分析',
        mainFunnel: {
          title: '总漏斗',
          steps: [
            { label: '曝光', value: 10000 },
            { label: '点击', value: 5000 },
            { label: '下单', value: 2000 },
            { label: '支付', value: 1800 }
          ]
        },
        platformFunnels: [
          {
            platform: '天猫',
            steps: [
              { label: '曝光', value: 5000 },
              { label: '点击', value: 2500 },
              { label: '下单', value: 1000 },
              { label: '支付', value: 900 }
            ]
          },
          {
            platform: '京东',
            steps: [
              { label: '曝光', value: 3000 },
              { label: '点击', value: 1500 },
              { label: '下单', value: 600 },
              { label: '支付', value: 540 }
            ]
          }
        ]
      } as FunnelGroupConfig,
      {
        type: 'sankey-flow',
        title: '用户路径/渠道流转',
        nodes: mockSankeyNodes,
        links: mockSankeyLinks
      } as SankeyFlowConfig,
      {
        type: 'risk-alert',
        title: '风险提示',
        items: [
          { text: '当前转化率较目标存在一定差距，建议优化产品页面', level: 'high' },
          { text: '退款率需要持续监控，建议分析退款原因', level: 'high' },
          { text: '建议加大推广力度，扩大市场份额', level: 'medium' },
          { text: '价格策略需要持续优化', level: 'low' },
          { text: '库存管理需要加强', level: 'low' }
        ]
      } as RiskAlertConfig,
      {
        type: 'kanban-board',
        title: '行动卡',
        columns: mockKanbanColumns
      } as KanbanBoardConfig
    ]
  } as BrandOwnerStageConfig
}

