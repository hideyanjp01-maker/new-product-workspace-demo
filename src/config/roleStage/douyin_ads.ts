// 抖音投放角色阶段配置
// 所有指标字段必须来自现有 mockData/metrics，不能新增字段

export type DouyinAdsSectionType = 
  | 'kpi-cards'              // KPI卡片组（8张）
  | 'funnel-chart'           // 诊断漏斗
  | 'plan-manager-table'     // 投放计划管理器表格
  | 'creative-performance-table' // 素材/计划表现榜表格
  | 'target-progress'        // 目标与进度
  | 'ai-weekly-report'       // AI周报卡（绿色）
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

export interface FunnelChartConfig {
  type: 'funnel-chart'
  title?: string
  steps: Array<{ label: string; value: number }>
}

export interface PlanManagerTableConfig {
  type: 'plan-manager-table'
  title?: string
  plans: Array<{
    planId: string
    target: string
    method: string
    cost?: number
    gmv?: number
    roi?: number
    cpc?: number
    tier?: string
    suggestion?: string
  }>
}

export interface CreativePerformanceTableConfig {
  type: 'creative-performance-table'
  title?: string
  creatives: Array<{
    creativeId: string
    exposure?: number
    cost?: number
    gmv?: number
    ctr?: number
    cvr?: number
    level?: string
    suggestion?: string
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

export interface AIWeeklyReportConfig {
  type: 'ai-weekly-report'
  title?: string
  date?: string
  insights: string[]
  actionText?: string
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

export type DouyinAdsStageSectionConfig = 
  | KPICardConfig
  | FunnelChartConfig
  | PlanManagerTableConfig
  | CreativePerformanceTableConfig
  | TargetProgressConfig
  | AIWeeklyReportConfig
  | DiagnosisInsightsConfig
  | KanbanBoardConfig
  | OperationLogsConfig

export interface DouyinAdsStageConfig {
  sections: DouyinAdsStageSectionConfig[]
}

// Mock数据：投放计划
const mockPlans = [
  { planId: 'P001', target: '放量', method: '搜索', cost: 500000, gmv: 1250000, roi: 2.5, cpc: 0.12, tier: 'A', suggestion: '提高预算' },
  { planId: 'P002', target: '冷启动', method: '信息流', cost: 300000, gmv: 750000, roi: 2.5, cpc: 0.11, tier: 'B', suggestion: '优化人群' },
  { planId: 'P003', target: '拉新', method: '达人随投', cost: 200000, gmv: 600000, roi: 3.0, cpc: 0.10, tier: 'A', suggestion: '更换素材' },
  { planId: 'P004', target: '放量', method: '搜索', cost: 450000, gmv: 1125000, roi: 2.5, cpc: 0.13, tier: 'B', suggestion: '提高预算' },
  { planId: 'P005', target: '冷启动', method: '信息流', cost: 280000, gmv: 700000, roi: 2.5, cpc: 0.11, tier: 'C', suggestion: '优化人群' },
  { planId: 'P006', target: '拉新', method: '达人随投', cost: 180000, gmv: 540000, roi: 3.0, cpc: 0.09, tier: 'A', suggestion: '更换素材' },
  { planId: 'P007', target: '放量', method: '搜索', cost: 520000, gmv: 1300000, roi: 2.5, cpc: 0.12, tier: 'A', suggestion: '提高预算' },
  { planId: 'P008', target: '冷启动', method: '信息流', cost: 320000, gmv: 800000, roi: 2.5, cpc: 0.11, tier: 'B', suggestion: '优化人群' },
  { planId: 'P009', target: '拉新', method: '达人随投', cost: 220000, gmv: 660000, roi: 3.0, cpc: 0.10, tier: 'A', suggestion: '更换素材' },
  { planId: 'P010', target: '放量', method: '搜索', cost: 480000, gmv: 1200000, roi: 2.5, cpc: 0.12, tier: 'B', suggestion: '提高预算' },
  { planId: 'P011', target: '冷启动', method: '信息流', cost: 290000, gmv: 725000, roi: 2.5, cpc: 0.11, tier: 'C', suggestion: '优化人群' },
  { planId: 'P012', target: '拉新', method: '达人随投', cost: 190000, gmv: 570000, roi: 3.0, cpc: 0.09, tier: 'A', suggestion: '更换素材' }
]

// Mock数据：素材表现
const mockCreatives = [
  { creativeId: 'C001', exposure: 5000000, cost: 550000, gmv: 1375000, ctr: 1.8, cvr: 2.9, level: 'A', suggestion: '保持投放' },
  { creativeId: 'C002', exposure: 4500000, cost: 495000, gmv: 1237500, ctr: 1.7, cvr: 2.8, level: 'A', suggestion: '保持投放' },
  { creativeId: 'C003', exposure: 4000000, cost: 440000, gmv: 1100000, ctr: 1.6, cvr: 2.7, level: 'B', suggestion: '优化素材' },
  { creativeId: 'C004', exposure: 3800000, cost: 418000, gmv: 1045000, ctr: 1.5, cvr: 2.6, level: 'B', suggestion: '优化素材' },
  { creativeId: 'C005', exposure: 3500000, cost: 385000, gmv: 962500, ctr: 1.4, cvr: 2.5, level: 'C', suggestion: '暂停投放' },
  { creativeId: 'C006', exposure: 3300000, cost: 363000, gmv: 907500, ctr: 1.3, cvr: 2.4, level: 'C', suggestion: '暂停投放' },
  { creativeId: 'C007', exposure: 3200000, cost: 352000, gmv: 880000, ctr: 1.2, cvr: 2.3, level: 'C', suggestion: '暂停投放' },
  { creativeId: 'C008', exposure: 3100000, cost: 341000, gmv: 852500, ctr: 1.1, cvr: 2.2, level: 'C', suggestion: '暂停投放' },
  { creativeId: 'C009', exposure: 3000000, cost: 330000, gmv: 825000, ctr: 1.0, cvr: 2.1, level: 'C', suggestion: '暂停投放' },
  { creativeId: 'C010', exposure: 2900000, cost: 319000, gmv: 797500, ctr: 0.9, cvr: 2.0, level: 'C', suggestion: '暂停投放' },
  { creativeId: 'C011', exposure: 2800000, cost: 308000, gmv: 770000, ctr: 0.8, cvr: 1.9, level: 'C', suggestion: '暂停投放' },
  { creativeId: 'C012', exposure: 2700000, cost: 297000, gmv: 742500, ctr: 0.7, cvr: 1.8, level: 'C', suggestion: '暂停投放' }
]

// Mock数据：诊断洞察
const mockDiagnosisInsights = [
  {
    title: '预算分配不均',
    points: ['A级计划预算占比过高', 'C级计划预算不足', '建议调整预算分配比例'],
    severity: 'high' as const
  },
  {
    title: 'CTR持续下降',
    points: ['整体CTR较上周下降0.3%', '信息流广告CTR下降明显', '建议优化素材质量'],
    severity: 'high' as const
  },
  {
    title: 'ROI表现稳定',
    points: ['整体ROI保持在2.5以上', '搜索广告ROI表现优异', '建议保持当前策略'],
    severity: 'success' as const
  },
  {
    title: 'CPC成本上升',
    points: ['平均CPC较上周上升0.02元', '信息流广告CPC上升明显', '建议优化出价策略'],
    severity: 'medium' as const
  },
  {
    title: '素材表现分化',
    points: ['A级素材表现优异', 'C级素材需要优化', '建议暂停低效素材'],
    severity: 'medium' as const
  },
  {
    title: '人群定向精准',
    points: ['目标人群覆盖准确', '转化率保持稳定', '建议继续优化人群包'],
    severity: 'low' as const
  }
]

// Mock数据：任务看板
const mockKanbanColumns = [
  {
    id: 'todo',
    title: '待处理',
    cards: [
      { id: 'todo-1', title: '预算校准', assignee: '投放团队', deadline: '2024-01-26' },
      { id: 'todo-2', title: '素材优化', assignee: '投放团队', deadline: '2024-01-27' },
      { id: 'todo-3', title: '人群扩展', assignee: '投放团队', deadline: '2024-01-28' }
    ]
  },
  {
    id: 'doing',
    title: '进行中',
    cards: [
      { id: 'doing-1', title: '计划调整', assignee: '电商负责人', deadline: '2024-01-25' },
      { id: 'doing-2', title: '出价优化', assignee: '投放团队', deadline: '2024-01-26' },
      { id: 'doing-3', title: '素材测试', assignee: '投放团队', deadline: '2024-01-27' }
    ]
  },
  {
    id: 'done',
    title: '已完成',
    cards: [
      { id: 'done-1', title: '计划创建', assignee: '投放团队', deadline: '2024-01-24' }
    ]
  }
]

// Mock数据：操作记录
const mockOperationLogs = [
  { time: '2024-01-25 14:30', action: '创建投放计划 P013' },
  { time: '2024-01-25 13:20', action: '调整计划 P001 预算至 550,000元' },
  { time: '2024-01-25 12:15', action: '暂停素材 C005 投放' },
  { time: '2024-01-25 11:00', action: '优化计划 P002 人群定向' },
  { time: '2024-01-25 10:30', action: '上传新素材 C013' },
  { time: '2024-01-25 09:45', action: '调整计划 P003 出价至 0.11元' },
  { time: '2024-01-24 18:20', action: '创建投放计划 P012' },
  { time: '2024-01-24 17:10', action: '暂停素材 C006 投放' },
  { time: '2024-01-24 16:00', action: '优化计划 P004 素材组合' },
  { time: '2024-01-24 15:30', action: '调整计划 P005 预算至 300,000元' },
  { time: '2024-01-24 14:20', action: '创建投放计划 P011' },
  { time: '2024-01-24 13:15', action: '上传新素材 C012' }
]

export const douyinAdsStageConfig = {
  overview: {
    sections: [
      {
        type: 'kpi-cards',
        title: '关键指标',
        cards: [
          { label: 'GMV', metricKey: 'douyin-total-sales', unit: '元', aggregate: true, trend: 'up', compareValue: '↑12%' },
          { label: 'ROI', metricKey: 'douyin-commission', fallbackMetricKey: 'douyin-total-sales', unit: '', trend: 'stable', compareValue: '→' },
          { label: '消耗', metricKey: 'douyin-commission', unit: '元', trend: 'up', compareValue: '↑8%' },
          { label: '点击', metricKey: 'content-views', fallbackMetricKey: 'douyin-total-orders', unit: '', trend: 'up', compareValue: '↑15%' },
          { label: 'CTR', metricKey: 'tmall-conversion', fallbackMetricKey: 'jd-conversion', unit: '%', trend: 'down', compareValue: '↓0.3%' },
          { label: 'CVR', metricKey: 'tmall-conversion', fallbackMetricKey: 'jd-conversion', unit: '%', trend: 'stable', compareValue: '→' },
          { label: 'CPC', metricKey: 'douyin-commission', fallbackMetricKey: 'douyin-total-sales', unit: '元', trend: 'up', compareValue: '↑0.02' },
          { label: 'CPM', metricKey: 'douyin-commission', fallbackMetricKey: 'douyin-total-sales', unit: '元', trend: 'stable', compareValue: '→' }
        ]
      } as KPICardConfig,
      {
        type: 'funnel-chart',
        title: '诊断漏斗',
        steps: [
          { label: '曝光', value: 10000000 },
          { label: '点击', value: 180000 },
          { label: '下单', value: 5220 },
          { label: '支付', value: 4800 }
        ]
      } as FunnelChartConfig,
      {
        type: 'plan-manager-table',
        title: '投放计划管理器',
        plans: mockPlans
      } as PlanManagerTableConfig,
      {
        type: 'creative-performance-table',
        title: '素材/计划表现榜',
        creatives: mockCreatives
      } as CreativePerformanceTableConfig
    ]
  } as DouyinAdsStageConfig,

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
          '本周GMV较上周提升12%，表现优异',
          '信息流广告CTR下降0.3%，建议优化素材',
          '搜索广告ROI保持在2.5以上，建议保持',
          '建议调整预算分配，增加A级计划预算'
        ],
        actionText: '查看详情'
      } as AIWeeklyReportConfig,
      {
        type: 'funnel-chart',
        title: '转化漏斗',
        steps: [
          { label: '曝光', value: 8000000 },
          { label: '点击', value: 144000 },
          { label: '下单', value: 4176 },
          { label: '支付', value: 3840 }
        ]
      } as FunnelChartConfig,
      {
        type: 'plan-manager-table',
        title: '投放计划管理器',
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
  } as DouyinAdsStageConfig,

  scaleUp: {
    sections: [
      {
        type: 'target-progress',
        title: '放量目标',
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
          '放量期GMV持续增长，建议扩大投放规模',
          '整体ROI保持稳定，建议保持当前策略',
          'A级计划表现优异，建议增加预算',
          '建议优化C级计划，提升整体效率'
        ],
        actionText: '查看详情'
      } as AIWeeklyReportConfig,
      {
        type: 'funnel-chart',
        title: '转化漏斗',
        steps: [
          { label: '曝光', value: 12000000 },
          { label: '点击', value: 216000 },
          { label: '下单', value: 6264 },
          { label: '支付', value: 5760 }
        ]
      } as FunnelChartConfig,
      {
        type: 'plan-manager-table',
        title: '投放计划管理器',
        plans: mockPlans.filter(p => p.target === '放量')
      } as PlanManagerTableConfig,
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
  } as DouyinAdsStageConfig
}

