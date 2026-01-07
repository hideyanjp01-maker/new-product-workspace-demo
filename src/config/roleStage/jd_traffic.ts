// 京东流量运营角色阶段配置
// 所有指标字段必须来自现有 mockData/metrics，不能新增字段

export type JdTrafficSectionType = 
  | 'kpi-cards'              // KPI卡片组（8张）
  | 'channel-overview-table' // 渠道概览表格
  | 'keyword-crowd-table'    // 关键词/人群投放表
  | 'funnel-chart'           // 转化漏斗
  | 'target-progress'        // 目标与进度
  | 'ai-weekly-report'       // AI周报卡（绿色）
  | 'plan-manager-table'     // 计划/渠道投放管理器表格
  | 'channel-budget-distribution' // 渠道预算/贡献分布（放量期特有）
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

export interface ChannelOverviewTableConfig {
  type: 'channel-overview-table'
  title?: string
  channels: Array<{
    channel: string
    clicks?: number
    cost?: number
    ctr?: number
    cpc?: number
    cpm?: number
    gmv?: number
    cvr?: number
    roi?: number
  }>
}

export interface KeywordCrowdTableConfig {
  type: 'keyword-crowd-table'
  title?: string
  items: Array<{
    rank: number
    keyword: string
    clicks?: number
    cost?: number
    ctr?: number
    cpc?: number
    gmv?: number
    cvr?: number
    roi?: number
    suggestion?: string
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

export interface AIWeeklyReportConfig {
  type: 'ai-weekly-report'
  title?: string
  date?: string
  insights: string[]
  actionText?: string
}

export interface PlanManagerTableConfig {
  type: 'plan-manager-table'
  title?: string
  plans: Array<{
    id: string
    channel: string
    target?: string
    clicks?: number
    cost?: number
    cpc?: number
    gmv?: number
    roi?: number
  }>
}

export interface ChannelBudgetDistributionConfig {
  type: 'channel-budget-distribution'
  title?: string
  channels: Array<{
    channel: string
    budget: number
    totalBudget: number
    note?: string
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

export type JdTrafficStageSectionConfig = 
  | KPICardConfig
  | ChannelOverviewTableConfig
  | KeywordCrowdTableConfig
  | FunnelChartConfig
  | TargetProgressConfig
  | AIWeeklyReportConfig
  | PlanManagerTableConfig
  | ChannelBudgetDistributionConfig
  | DiagnosisInsightsConfig
  | KanbanBoardConfig
  | OperationLogsConfig

export interface JdTrafficStageConfig {
  sections: JdTrafficStageSectionConfig[]
}

// Mock数据：渠道概览
const mockChannels = [
  { channel: '京准通-搜索', clicks: 350000, cost: 140000, ctr: 7.5, cpc: 0.40, cpm: 14.29, gmv: 420000, cvr: 8.0, roi: 3.0 },
  { channel: '京准通-推荐', clicks: 250000, cost: 100000, ctr: 6.8, cpc: 0.40, cpm: 13.33, gmv: 300000, cvr: 7.5, roi: 3.0 },
  { channel: '京东快车', clicks: 100000, cost: 50000, ctr: 8.0, cpc: 0.50, cpm: 16.67, gmv: 150000, cvr: 9.0, roi: 3.0 },
  { channel: '京东展位', clicks: 35000, cost: 20000, ctr: 5.5, cpc: 0.57, cpm: 11.43, gmv: 80000, cvr: 6.5, roi: 4.0 }
]

// Mock数据：关键词/人群投放
const mockKeywordCrowd = [
  { rank: 1, keyword: '金典有机纯牛奶', clicks: 85000, cost: 34000, ctr: 8.5, cpc: 0.40, gmv: 102000, cvr: 8.5, roi: 3.0, suggestion: '提升出价' },
  { rank: 2, keyword: '安慕希酸奶', clicks: 72000, cost: 28800, ctr: 7.8, cpc: 0.40, gmv: 86400, cvr: 8.0, roi: 3.0, suggestion: '扩量测试' },
  { rank: 3, keyword: '优酸乳', clicks: 65000, cost: 26000, ctr: 7.2, cpc: 0.40, gmv: 78000, cvr: 7.8, roi: 3.0, suggestion: '优化落地页' },
  { rank: 4, keyword: '人群包-高价值', clicks: 55000, cost: 22000, ctr: 6.5, cpc: 0.40, gmv: 66000, cvr: 7.5, roi: 3.0, suggestion: '提升出价' },
  { rank: 5, keyword: '人群包-新客', clicks: 48000, cost: 19200, ctr: 6.0, cpc: 0.40, gmv: 57600, cvr: 7.0, roi: 3.0, suggestion: '扩量测试' },
  { rank: 6, keyword: '伊利纯牛奶', clicks: 42000, cost: 16800, ctr: 5.8, cpc: 0.40, gmv: 50400, cvr: 6.8, roi: 3.0, suggestion: '优化落地页' },
  { rank: 7, keyword: '人群包-复购', clicks: 38000, cost: 15200, ctr: 5.5, cpc: 0.40, gmv: 45600, cvr: 6.5, roi: 3.0, suggestion: '提升出价' },
  { rank: 8, keyword: '伊利酸奶', clicks: 35000, cost: 14000, ctr: 5.2, cpc: 0.40, gmv: 42000, cvr: 6.2, roi: 3.0, suggestion: '扩量测试' }
]

// Mock数据：计划投放
const mockPlans = [
  { id: 'P001', channel: '京准通-搜索', target: '放量', clicks: 350000, cost: 140000, cpc: 0.40, gmv: 420000, roi: 3.0 },
  { id: 'P002', channel: '京准通-推荐', target: '冷启动', clicks: 250000, cost: 100000, cpc: 0.40, gmv: 300000, roi: 3.0 },
  { id: 'P003', channel: '京东快车', target: '拉新', clicks: 100000, cost: 50000, cpc: 0.50, gmv: 150000, roi: 3.0 },
  { id: 'P004', channel: '京东展位', target: '放量', clicks: 35000, cost: 20000, cpc: 0.57, gmv: 80000, roi: 4.0 },
  { id: 'P005', channel: '京准通-搜索', target: '冷启动', clicks: 280000, cost: 112000, cpc: 0.40, gmv: 336000, roi: 3.0 },
  { id: 'P006', channel: '京准通-推荐', target: '拉新', clicks: 200000, cost: 80000, cpc: 0.40, gmv: 240000, roi: 3.0 }
]

// Mock数据：渠道预算分布
const mockChannelBudget = [
  { channel: '京准通-搜索', budget: 140000, totalBudget: 310000, note: 'CPC 下降，预算可提升' },
  { channel: '京准通-推荐', budget: 100000, totalBudget: 310000, note: 'ROI 偏低，需优化' },
  { channel: '京东快车', budget: 50000, totalBudget: 310000, note: '表现稳定，保持投放' },
  { channel: '京东展位', budget: 20000, totalBudget: 310000, note: 'ROI 优异，可增加预算' }
]

// Mock数据：诊断洞察
const mockDiagnosisInsights = [
  {
    title: 'CTR持续下降',
    points: ['整体CTR较上周下降0.5%', '京准通-推荐CTR下降明显', '建议优化素材质量'],
    severity: 'high' as const
  },
  {
    title: 'ROI表现稳定',
    points: ['整体ROI保持在3.0以上', '搜索渠道ROI表现优异', '建议保持当前策略'],
    severity: 'success' as const
  },
  {
    title: 'CPC成本上升',
    points: ['平均CPC较上周上升0.05元', '推荐渠道CPC上升明显', '建议优化出价策略'],
    severity: 'medium' as const
  },
  {
    title: '关键词表现分化',
    points: ['头部关键词表现优异', '长尾关键词需要优化', '建议暂停低效关键词'],
    severity: 'medium' as const
  },
  {
    title: '人群定向精准',
    points: ['目标人群覆盖准确', '转化率保持稳定', '建议继续优化人群包'],
    severity: 'low' as const
  },
  {
    title: '预算分配不均',
    points: ['搜索渠道预算占比过高', '推荐渠道预算不足', '建议调整预算分配比例'],
    severity: 'low' as const
  }
]

// Mock数据：任务看板
const mockKanbanColumns = [
  {
    id: 'todo',
    title: '待处理',
    cards: [
      { id: 'todo-1', title: '预算校准', assignee: '流量团队', deadline: '2024-01-26' },
      { id: 'todo-2', title: '关键词优化', assignee: '流量团队', deadline: '2024-01-27' },
      { id: 'todo-3', title: '人群扩展', assignee: '流量团队', deadline: '2024-01-28' }
    ]
  },
  {
    id: 'doing',
    title: '进行中',
    cards: [
      { id: 'doing-1', title: '计划调整', assignee: '电商负责人', deadline: '2024-01-25' },
      { id: 'doing-2', title: '出价优化', assignee: '流量团队', deadline: '2024-01-26' },
      { id: 'doing-3', title: '素材测试', assignee: '流量团队', deadline: '2024-01-27' }
    ]
  },
  {
    id: 'done',
    title: '已完成',
    cards: [
      { id: 'done-1', title: '计划创建', assignee: '流量团队', deadline: '2024-01-24' }
    ]
  }
]

// Mock数据：操作记录
const mockOperationLogs = [
  { time: '2024-01-25 14:30', action: '创建投放计划 P007' },
  { time: '2024-01-25 13:20', action: '调整计划 P001 预算至 150,000元' },
  { time: '2024-01-25 12:15', action: '暂停关键词"低效词"投放' },
  { time: '2024-01-25 11:00', action: '优化计划 P002 人群定向' },
  { time: '2024-01-25 10:30', action: '上传新关键词"优酸乳"' },
  { time: '2024-01-25 09:45', action: '调整计划 P003 出价至 0.55元' },
  { time: '2024-01-24 18:20', action: '创建投放计划 P006' },
  { time: '2024-01-24 17:10', action: '暂停关键词"无效词"投放' },
  { time: '2024-01-24 16:00', action: '优化计划 P004 素材组合' },
  { time: '2024-01-24 15:30', action: '调整计划 P005 预算至 120,000元' },
  { time: '2024-01-24 14:20', action: '创建投放计划 P005' },
    { time: '2024-01-24 13:15', action: '上传新关键词"伊利纯牛奶"' }
]

export const jdTrafficStageConfig = {
  overview: {
    sections: [
      {
        type: 'kpi-cards',
        title: '关键指标',
        cards: [
          { label: '曝光量', metricKey: 'jd-traffic', fallbackMetricKey: 'content-views', unit: '', aggregate: true, trend: 'up', compareValue: '↑12%' },
          { label: '点击量', metricKey: 'jd-traffic', fallbackMetricKey: 'jd-conversion', unit: '', aggregate: true, trend: 'up', compareValue: '↑15%' },
          { label: 'CTR', metricKey: 'jd-conversion', fallbackMetricKey: 'tmall-conversion', unit: '%', trend: 'down', compareValue: '↓0.5%' },
          { label: 'ROI', metricKey: 'jd-conversion', fallbackMetricKey: 'tmall-conversion', unit: '', trend: 'stable', compareValue: '→' },
          { label: 'GMV', metricKey: 'jd-traffic', fallbackMetricKey: 'jd-conversion', unit: '元', aggregate: true, trend: 'up', compareValue: '↑8%' },
          { label: 'CVR', metricKey: 'jd-conversion', fallbackMetricKey: 'tmall-conversion', unit: '%', trend: 'stable', compareValue: '→' },
          { label: '消耗', metricKey: 'jd-traffic', fallbackMetricKey: 'jd-conversion', unit: '元', trend: 'up', compareValue: '↑10%' },
          { label: 'UV', metricKey: 'jd-traffic', fallbackMetricKey: 'jd-conversion', unit: '', aggregate: true, trend: 'up', compareValue: '↑18%' }
        ]
      } as KPICardConfig,
      {
        type: 'channel-overview-table',
        title: '渠道概览',
        channels: mockChannels
      } as ChannelOverviewTableConfig,
      {
        type: 'keyword-crowd-table',
        title: '关键词/人群投放表',
        items: mockKeywordCrowd
      } as KeywordCrowdTableConfig
    ]
  } as JdTrafficStageConfig,

  coldStart: {
    sections: [
      {
        type: 'target-progress',
        title: '冷启动目标',
        metrics: [
          { label: 'GMV', targetKey: '总成交金额', currentKey: '总成交金额' },
          { label: 'ROI', targetKey: '总成交金额', currentKey: '总成交金额' }
        ]
      } as TargetProgressConfig,
      {
        type: 'ai-weekly-report',
        title: '周报告',
        date: '2024-01-25',
        insights: [
          '本周GMV较上周提升8%，表现优异',
          '京准通-推荐CTR下降0.5%，建议优化素材',
          '搜索渠道ROI保持在3.0以上，建议保持',
          '建议调整预算分配，增加搜索渠道预算'
        ],
        actionText: '查看详情'
      } as AIWeeklyReportConfig,
      {
        type: 'funnel-chart',
        title: '转化漏斗',
        steps: [
          { label: '曝光', value: 9800000 },
          { label: '点击', value: 735000 },
          { label: '加购', value: 58800 },
          { label: '下单', value: 47040 },
          { label: '支付', value: 42336 }
        ]
      } as FunnelChartConfig,
      {
        type: 'plan-manager-table',
        title: '计划投放管理器',
        plans: mockPlans.filter(p => p.target === '冷启动')
      } as PlanManagerTableConfig,
      {
        type: 'diagnosis-insights',
        title: '诊断洞察',
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
  } as JdTrafficStageConfig,

  scaleUp: {
    sections: [
      {
        type: 'target-progress',
        title: '放量目标',
        metrics: [
          { label: 'GMV', targetKey: '总成交金额', currentKey: '总成交金额' },
          { label: 'ROI', targetKey: '总成交金额', currentKey: '总成交金额' },
          { label: 'CTR', targetKey: '总成交金额', currentKey: '总成交金额' }
        ]
      } as TargetProgressConfig,
      {
        type: 'ai-weekly-report',
        title: '周报告',
        date: '2024-01-25',
        insights: [
          '放量期GMV持续增长，建议扩大投放规模',
          '整体ROI保持稳定，建议保持当前策略',
          '搜索渠道表现优异，建议增加预算',
          '建议优化推荐渠道，提升整体效率'
        ],
        actionText: '查看详情'
      } as AIWeeklyReportConfig,
      {
        type: 'funnel-chart',
        title: '转化漏斗',
        steps: [
          { label: '曝光', value: 12000000 },
          { label: '点击', value: 900000 },
          { label: '加购', value: 72000 },
          { label: '下单', value: 57600 },
          { label: '支付', value: 51840 }
        ]
      } as FunnelChartConfig,
      {
        type: 'channel-budget-distribution',
        title: '渠道预算分布',
        channels: mockChannelBudget
      } as ChannelBudgetDistributionConfig,
      {
        type: 'keyword-crowd-table',
        title: '关键词/人群投放表',
        items: mockKeywordCrowd
      } as KeywordCrowdTableConfig,
      {
        type: 'diagnosis-insights',
        title: '诊断洞察',
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
  } as JdTrafficStageConfig
}

