// 天猫流量运营角色阶段配置
// 所有指标字段必须来自现有 mockData/metrics，不能新增字段

// 回退：移除动态生成依赖，保留静态配置

export type TmallTrafficSectionType = 
  | 'kpi-cards'              // KPI卡片组（8-9张）
  | 'channel-contribution-table' // 渠道贡献表
  | 'plan-efficiency-table'  // 计划/单元效率表
  | 'funnel-chart'           // 转化漏斗
  | 'target-progress'        // 目标与进度
  | 'ai-insight-summary'     // AI洞察摘要卡（绿色）
  | 'resource-efficiency-tables' // 素材/资源位效率表（双表）
  | 'channel-overview-table' // 渠道投放总览表
  | 'keyword-crowd-table'    // 关键词/人群包效率表
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

export interface ChannelContributionTableConfig {
  type: 'channel-contribution-table'
  title?: string
  channels: Array<{
    channel: string
    exposure?: number
    clicks?: number
    ctr?: number
    cpc?: number
    gmv?: number
    roi?: number
  }>
}

export interface PlanEfficiencyTableConfig {
  type: 'plan-efficiency-table'
  title?: string
  plans: Array<{
    planId: string
    planName?: string
    type?: string
    cost?: number
    gmv?: number
    roi?: number
    ctr?: number
    cpc?: number
    cvr?: number
    status?: string
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

export interface ResourceEfficiencyTablesConfig {
  type: 'resource-efficiency-tables'
  title?: string
  tables: Array<{
    title: string
    resources: Array<{
      name: string
      exposure?: number
      clicks?: number
      ctr?: number
      cost?: number
      gmv?: number
      roi?: number
      cvr?: number
    }>
  }>
}

export interface ChannelOverviewTableConfig {
  type: 'channel-overview-table'
  title?: string
  channels: Array<{
    channel: string
    exposure?: number
    clicks?: number
    gmv?: number
    roi?: number
    ctr?: number
    cpc?: number
    cvr?: number
  }>
}

export interface KeywordCrowdTableConfig {
  type: 'keyword-crowd-table'
  title?: string
  items: Array<{
    keyword: string
    type?: string
    ctr?: number
    cpc?: number
    gmv?: number
    roi?: number
    cvr?: number
  }>
}

export interface DiagnosisInsightsConfig {
  type: 'diagnosis-insights'
  title?: string
  cards: Array<{
    id?: string
    title: string
    points: string[]
    severity: 'high' | 'medium' | 'low' | 'success'
    triggerMetrics?: string[]
    conclusion?: string
    suggestions?: string[]
  }>
  scenes?: {
    operation?: string[]
    product?: string[]
    traffic?: string[]
  }
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
      assignee?: string
      deadline?: string
      createdAt?: string
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

export type TmallTrafficStageSectionConfig = 
  | KPICardConfig
  | ChannelContributionTableConfig
  | PlanEfficiencyTableConfig
  | FunnelChartConfig
  | TargetProgressConfig
  | AIInsightSummaryConfig
  | ResourceEfficiencyTablesConfig
  | ChannelOverviewTableConfig
  | KeywordCrowdTableConfig
  | DiagnosisInsightsConfig
  | KanbanBoardConfig
  | OperationLogsConfig

export interface TmallTrafficStageConfig {
  sections: TmallTrafficStageSectionConfig[]
}

// Mock数据：渠道贡献
const mockChannelContribution = [
  { channel: '直通车', exposure: 1500000, clicks: 90000, ctr: 6.0, cpc: 0.45, gmv: 405000, roi: 3.0 },
  { channel: '引力魔方', exposure: 1200000, clicks: 72000, ctr: 6.0, cpc: 0.40, gmv: 288000, roi: 3.0 },
  { channel: '万相台-推荐', exposure: 1000000, clicks: 55000, ctr: 5.5, cpc: 0.50, gmv: 275000, roi: 2.5 },
  { channel: '万相台-搜索', exposure: 800000, clicks: 48000, ctr: 6.0, cpc: 0.42, gmv: 201600, roi: 3.0 },
  { channel: '内容', exposure: 600000, clicks: 30000, ctr: 5.0, cpc: 0.35, gmv: 105000, roi: 3.0 }
]

// Mock数据：计划效率
const mockPlanEfficiency = [
  { planId: 'P001', planName: '直通车-搜索计划A', type: '搜索', cost: 40500, gmv: 121500, roi: 3.0, ctr: 6.0, cpc: 0.45, cvr: 8.0 },
  { planId: 'P002', planName: '引力魔方-推荐计划B', type: '推荐', cost: 28800, gmv: 86400, roi: 3.0, ctr: 6.0, cpc: 0.40, cvr: 7.5 },
  { planId: 'P003', planName: '万相台-推荐计划C', type: '推荐', cost: 27500, gmv: 68750, roi: 2.5, ctr: 5.5, cpc: 0.50, cvr: 7.0 },
  { planId: 'P004', planName: '万相台-搜索计划D', type: '搜索', cost: 20160, gmv: 60480, roi: 3.0, ctr: 6.0, cpc: 0.42, cvr: 8.0 },
  { planId: 'P005', planName: '内容-种草计划E', type: '内容', cost: 10500, gmv: 31500, roi: 3.0, ctr: 5.0, cpc: 0.35, cvr: 6.5 },
  { planId: 'P006', planName: '直通车-搜索计划F', type: '搜索', cost: 36000, gmv: 108000, roi: 3.0, ctr: 5.8, cpc: 0.44, cvr: 7.8 },
  { planId: 'P007', planName: '引力魔方-推荐计划G', type: '推荐', cost: 25600, gmv: 76800, roi: 3.0, ctr: 5.9, cpc: 0.41, cvr: 7.6 },
  { planId: 'P008', planName: '万相台-推荐计划H', type: '推荐', cost: 24000, gmv: 60000, roi: 2.5, ctr: 5.4, cpc: 0.48, cvr: 6.9 },
  { planId: 'P009', planName: '万相台-搜索计划I', type: '搜索', cost: 18000, gmv: 54000, roi: 3.0, ctr: 5.9, cpc: 0.43, cvr: 7.9 },
  { planId: 'P010', planName: '内容-种草计划J', type: '内容', cost: 9500, gmv: 28500, roi: 3.0, ctr: 4.9, cpc: 0.36, cvr: 6.4 }
]

// Mock数据：素材/资源位效率（左表）
const mockResourceEfficiencyLeft = [
  { name: '素材A', exposure: 500000, clicks: 30000, ctr: 6.0, cost: 13500, gmv: 40500, roi: 3.0, cvr: 8.0 },
  { name: '素材B', exposure: 450000, clicks: 27000, ctr: 6.0, cost: 12150, gmv: 36450, roi: 3.0, cvr: 7.8 },
  { name: '素材C', exposure: 400000, clicks: 22000, ctr: 5.5, cost: 11000, gmv: 27500, roi: 2.5, cvr: 7.0 },
  { name: '素材D', exposure: 350000, clicks: 21000, ctr: 6.0, cost: 9450, gmv: 28350, roi: 3.0, cvr: 7.9 },
  { name: '素材E', exposure: 300000, clicks: 16500, ctr: 5.5, cost: 8250, gmv: 20625, roi: 2.5, cvr: 6.9 },
  { name: '素材F', exposure: 280000, clicks: 16800, ctr: 6.0, cost: 7560, gmv: 22680, roi: 3.0, cvr: 8.0 }
]

// Mock数据：素材/资源位效率（右表）
const mockResourceEfficiencyRight = [
  { name: '活动位A', exposure: 400000, clicks: 24000, ctr: 6.0, cost: 10800, gmv: 32400, roi: 3.0, cvr: 7.8 },
  { name: '频道位B', exposure: 350000, clicks: 19250, ctr: 5.5, cost: 9625, gmv: 24063, roi: 2.5, cvr: 7.0 },
  { name: '入口位C', exposure: 320000, clicks: 19200, ctr: 6.0, cost: 8640, gmv: 25920, roi: 3.0, cvr: 8.0 },
  { name: '活动位D', exposure: 300000, clicks: 16500, ctr: 5.5, cost: 8250, gmv: 20625, roi: 2.5, cvr: 6.9 },
  { name: '频道位E', exposure: 280000, clicks: 16800, ctr: 6.0, cost: 7560, gmv: 22680, roi: 3.0, cvr: 7.9 },
  { name: '入口位F', exposure: 250000, clicks: 13750, ctr: 5.5, cost: 6875, gmv: 17188, roi: 2.5, cvr: 6.8 }
]

// Mock数据：渠道总览
const mockChannelOverview = [
  { channel: '直通车', exposure: 1500000, clicks: 90000, gmv: 405000, roi: 3.0, ctr: 6.0, cpc: 0.45, cvr: 8.0 },
  { channel: '引力魔方', exposure: 1200000, clicks: 72000, gmv: 288000, roi: 3.0, ctr: 6.0, cpc: 0.40, cvr: 7.5 },
  { channel: '万相台-推荐', exposure: 1000000, clicks: 55000, gmv: 275000, roi: 2.5, ctr: 5.5, cpc: 0.50, cvr: 7.0 },
  { channel: '万相台-搜索', exposure: 800000, clicks: 48000, gmv: 201600, roi: 3.0, ctr: 6.0, cpc: 0.42, cvr: 8.0 }
]

// Mock数据：关键词/人群包
const mockKeywordCrowd = [
  { keyword: '金典有机纯牛奶', type: '关键词', ctr: 6.5, cpc: 0.45, gmv: 121500, roi: 3.0, cvr: 8.0 },
  { keyword: '安慕希酸奶', type: '关键词', ctr: 6.2, cpc: 0.44, gmv: 108000, roi: 3.0, cvr: 7.8 },
  { keyword: '优酸乳', type: '关键词', ctr: 5.8, cpc: 0.50, gmv: 68750, roi: 2.5, cvr: 7.0 },
  { keyword: '人群包-高价值', type: '人群包', ctr: 6.0, cpc: 0.42, gmv: 60480, roi: 3.0, cvr: 8.0 },
  { keyword: '人群包-新客', type: '人群包', ctr: 5.5, cpc: 0.35, gmv: 31500, roi: 3.0, cvr: 6.5 },
  { keyword: '伊利纯牛奶', type: '关键词', ctr: 5.9, cpc: 0.43, gmv: 54000, roi: 3.0, cvr: 7.9 },
  { keyword: '人群包-复购', type: '人群包', ctr: 5.4, cpc: 0.48, gmv: 60000, roi: 2.5, cvr: 6.9 },
  { keyword: '伊利酸奶', type: '关键词', ctr: 4.9, cpc: 0.36, gmv: 28500, roi: 3.0, cvr: 6.4 },
  { keyword: '定向-高消费', type: '定向', ctr: 6.1, cpc: 0.46, gmv: 112500, roi: 3.0, cvr: 8.1 },
  { keyword: '定向-宝妈', type: '定向', ctr: 5.7, cpc: 0.38, gmv: 43200, roi: 3.0, cvr: 7.2 }
]

// Mock数据：诊断洞察
const mockDiagnosisInsights = [
  {
    title: 'CTR持续下降',
    points: ['整体CTR较上周下降0.3%', '万相台-推荐CTR下降明显', '建议优化素材质量'],
    severity: 'high' as const
  },
  {
    title: 'ROI表现稳定',
    points: ['整体ROI保持在3.0以上', '直通车ROI表现优异', '建议保持当前策略'],
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
    points: ['直通车预算占比过高', '内容渠道预算不足', '建议调整预算分配比例'],
    severity: 'low' as const
  },
  {
    title: '素材效率提升',
    points: ['素材A表现优异', '素材C需要优化', '建议增加素材A投放'],
    severity: 'low' as const
  },
  {
    title: '渠道结构优化',
    points: ['搜索渠道表现稳定', '推荐渠道需要优化', '建议继续优化渠道结构'],
    severity: 'low' as const
  }
]

// Mock数据：任务看板
const mockKanbanColumns = [
  {
    id: 'todo',
    title: '待处理',
    cards: [
      { id: 'todo-1', title: '预算校准', description: '调整各渠道预算分配', assignee: '流量团队', deadline: '2024-01-26', createdAt: '2024-01-24' },
      { id: 'todo-2', title: '关键词优化', description: '优化低效关键词出价', assignee: '流量团队', deadline: '2024-01-27', createdAt: '2024-01-24' },
      { id: 'todo-3', title: '人群扩展', description: '扩展高价值人群包', assignee: '流量团队', deadline: '2024-01-28', createdAt: '2024-01-25' },
      { id: 'todo-4', title: '素材测试', description: '测试新素材效果', assignee: '流量团队', deadline: '2024-01-29', createdAt: '2024-01-25' }
    ]
  },
  {
    id: 'doing',
    title: '进行中',
    cards: [
      { id: 'doing-1', title: '计划调整', description: '调整计划P001出价', assignee: '电商负责人', deadline: '2024-01-25', createdAt: '2024-01-23' },
      { id: 'doing-2', title: '出价优化', description: '优化CPC出价策略', assignee: '流量团队', deadline: '2024-01-26', createdAt: '2024-01-24' },
      { id: 'doing-3', title: '素材优化', description: '优化素材C质量', assignee: '流量团队', deadline: '2024-01-27', createdAt: '2024-01-24' }
    ]
  },
  {
    id: 'done',
    title: '已完成',
    cards: [
      { id: 'done-1', title: '计划创建', description: '创建计划P010', assignee: '流量团队', deadline: '2024-01-24', createdAt: '2024-01-22' },
      { id: 'done-2', title: '诊断生成', description: '生成AI诊断报告', assignee: '系统', deadline: '2024-01-24', createdAt: '2024-01-24' }
    ]
  }
]

// Mock数据：操作记录
const mockOperationLogs = [
  { time: '2024-01-25 14:30', action: '创建投放计划 P011' },
  { time: '2024-01-25 13:20', action: '调整计划 P001 预算至 45,000元' },
  { time: '2024-01-25 12:15', action: '暂停关键词"低效词"投放' },
  { time: '2024-01-25 11:00', action: '优化计划 P002 人群定向' },
  { time: '2024-01-25 10:30', action: '上传新素材"素材G"' },
  { time: '2024-01-25 09:45', action: '调整计划 P003 出价至 0.52元' },
  { time: '2024-01-24 18:20', action: '创建投放计划 P010' },
  { time: '2024-01-24 17:10', action: '暂停关键词"无效词"投放' },
  { time: '2024-01-24 16:00', action: '优化计划 P004 素材组合' },
  { time: '2024-01-24 15:30', action: '调整计划 P005 预算至 12,000元' },
  { time: '2024-01-24 14:20', action: '创建投放计划 P009' },
    { time: '2024-01-24 13:15', action: '上传新关键词"伊利纯牛奶"' }
]

// 生成配置的函数（支持日期对比）
/* 回退：移除动态生成函数，以下函数不再导出，仅保留静态配置使用
export function getTmallTrafficStageConfig(
  stage: 'overview' | 'coldStart' | 'scaleUp',
  dateRangeA: string = '2024-01-01',
  dateRangeB: string = '2024-01-31'
): TmallTrafficStageConfig {
  const stageKey = stage === 'overview' ? 'overview' : stage === 'coldStart' ? 'cold_start' : 'scale_up'
  
  if (stage === 'overview') {
    const kpis = generateKPIs('overview', 'current', dateRangeA)
    const channels = generateChannelContribution('overview', 'current', dateRangeA)
    const plans = generatePlanEfficiency('overview', 'current', dateRangeA, 15)
    
    return {
      sections: [
        {
          type: 'kpi-cards',
          title: '关键指标',
          cards: kpis.map(kpi => ({
            label: kpi.label,
            metricKey: 'tmall-traffic',
            fallbackMetricKey: 'tmall-conversion',
            unit: kpi.unit,
            aggregate: kpi.label === 'GMV' || kpi.label === '成交GMV',
            trend: kpi.trend,
            compareValue: kpi.compareValue
          }))
        } as KPICardConfig,
        {
          type: 'channel-contribution-table',
          title: '渠道结构',
          channels
        } as ChannelContributionTableConfig,
        {
          type: 'plan-efficiency-table',
          title: '计划投放监控',
          plans
        } as PlanEfficiencyTableConfig
      ]
    }
  } else if (stage === 'coldStart') {
    const targetProgress = [
      { label: '总GMV', targetKey: '总成交金额', currentKey: '总成交金额' },
      { label: 'ROI', targetKey: '总成交金额', currentKey: '总成交金额' },
      { label: 'CTR', targetKey: '总成交金额', currentKey: '总成交金额' }
    ]
    const funnel = generateFunnel('cold_start', 'current', dateRangeA)
    const materialResources = generateResourceEfficiency('cold_start', 'current', dateRangeA, 'material')
    const channelResources = generateResourceEfficiency('cold_start', 'current', dateRangeA, 'channel')
    const plans = generatePlanEfficiency('cold_start', 'current', dateRangeA, 20)
    const diagnosisOperation = generateDiagnosisCards('cold_start', 'operation', 'current', dateRangeA)
    const diagnosisProduct = generateDiagnosisCards('cold_start', 'product', 'current', dateRangeA)
    const diagnosisTraffic = generateDiagnosisCards('cold_start', 'traffic', 'current', dateRangeA)
    const kanban = generateKanban('cold_start', 'current', dateRangeA)
    const logs = generateOperationLogs('cold_start', 'current', dateRangeA, 12)
    
    return {
      sections: [
        {
          type: 'target-progress',
          title: '冷启动目标',
          metrics: targetProgress
        } as TargetProgressConfig,
        {
          type: 'ai-insight-summary',
          title: 'AI洞察摘要',
          date: dateRangeA,
          insights: [
            '本周GMV较上周提升12%，表现优异',
            'CTR下降0.3%，建议优化素材质量',
            'CPC上升0.05元，建议优化出价策略',
            '建议调整预算分配，增加直通车预算'
          ],
          actionText: '查看详情'
        } as AIInsightSummaryConfig,
        {
          type: 'funnel-chart',
          title: '转化漏斗',
          steps: funnel.map(f => ({ label: f.label, value: f.value }))
        } as FunnelChartConfig,
        {
          type: 'resource-efficiency-tables',
          title: '测试结果',
          tables: [
            { title: '素材投放测试', resources: materialResources },
            { title: '渠道投放测试', resources: channelResources }
          ]
        } as ResourceEfficiencyTablesConfig,
        {
          type: 'plan-efficiency-table',
          title: '计划投放监控',
          plans
        } as PlanEfficiencyTableConfig,
        {
          type: 'diagnosis-insights',
          title: 'AI诊断',
          cards: [
            ...diagnosisOperation,
            ...diagnosisProduct,
            ...diagnosisTraffic
          ],
          scenes: {
            operation: diagnosisOperation.map(c => c.id),
            product: diagnosisProduct.map(c => c.id),
            traffic: diagnosisTraffic.map(c => c.id)
          }
        } as DiagnosisInsightsConfig,
        {
          type: 'kanban-board',
          title: '任务',
          columns: [
            { id: 'todo', title: '待处理', cards: kanban.todo },
            { id: 'doing', title: '进行中', cards: kanban.doing },
            { id: 'done', title: '已完成', cards: kanban.done }
          ]
        } as KanbanBoardConfig,
        {
          type: 'operation-logs',
          title: '操作记录',
          logs
        } as OperationLogsConfig
      ]
    }
  } else {
    // scaleUp
    const targetProgress = [
      { label: '总GMV', targetKey: '总成交金额', currentKey: '总成交金额' },
      { label: 'ROI', targetKey: '总成交金额', currentKey: '总成交金额' },
      { label: 'CTR', targetKey: '总成交金额', currentKey: '总成交金额' }
    ]
    const funnel = generateFunnel('scale_up', 'current', dateRangeA)
    const channels = generateChannelContribution('scale_up', 'current', dateRangeA)
    const plans = generatePlanEfficiency('scale_up', 'current', dateRangeA, 30)
    const keywords = generateKeywordCrowd('scale_up', 'current', dateRangeA, 15)
    const diagnosisOperation = generateDiagnosisCards('scale_up', 'operation', 'current', dateRangeA)
    const diagnosisProduct = generateDiagnosisCards('scale_up', 'product', 'current', dateRangeA)
    const diagnosisTraffic = generateDiagnosisCards('scale_up', 'traffic', 'current', dateRangeA)
    const kanban = generateKanban('scale_up', 'current', dateRangeA)
    const logs = generateOperationLogs('scale_up', 'current', dateRangeA, 12)
    
    return {
      sections: [
        {
          type: 'target-progress',
          title: '放量目标',
          metrics: targetProgress
        } as TargetProgressConfig,
        {
          type: 'ai-insight-summary',
          title: 'AI洞察摘要',
          date: dateRangeA,
          insights: [
            '放量期GMV持续增长，建议扩大投放规模',
            '整体ROI保持稳定，建议保持当前策略',
            '直通车表现优异，建议增加预算',
            '建议优化万相台-推荐，提升整体效率'
          ],
          actionText: '查看详情'
        } as AIInsightSummaryConfig,
        {
          type: 'funnel-chart',
          title: '转化漏斗',
          steps: funnel.map(f => ({ label: f.label, value: f.value }))
        } as FunnelChartConfig,
        {
          type: 'channel-overview-table',
          title: '渠道投放分配',
          channels
        } as ChannelOverviewTableConfig,
        {
          type: 'plan-efficiency-table',
          title: '计划投放监控',
          plans
        } as PlanEfficiencyTableConfig,
        {
          type: 'keyword-crowd-table',
          title: '关键词/人群/资源位效果',
          items: keywords
        } as KeywordCrowdTableConfig,
        {
          type: 'diagnosis-insights',
          title: 'AI诊断',
          cards: [
            ...diagnosisOperation,
            ...diagnosisProduct,
            ...diagnosisTraffic
          ],
          scenes: {
            operation: diagnosisOperation.map(c => c.id),
            product: diagnosisProduct.map(c => c.id),
            traffic: diagnosisTraffic.map(c => c.id)
          }
        } as DiagnosisInsightsConfig,
        {
          type: 'kanban-board',
          title: '任务',
          columns: [
            { id: 'todo', title: '待处理', cards: kanban.todo },
            { id: 'doing', title: '进行中', cards: kanban.doing },
            { id: 'done', title: '已完成', cards: kanban.done }
          ]
        } as KanbanBoardConfig,
        {
          type: 'operation-logs',
          title: '操作记录',
          logs
        } as OperationLogsConfig
      ]
    }
  }
}
*/

// 保留旧的静态配置作为fallback
export const tmallTrafficStageConfig = {
  overview: {
    sections: [
      {
        type: 'kpi-cards',
        title: '关键指标',
        cards: [
          { label: 'GMV', metricKey: 'tmall-traffic', fallbackMetricKey: 'douyin-total-sales', unit: '元', aggregate: true, trend: 'up', compareValue: '↑12%' },
          { label: '消耗', metricKey: 'tmall-traffic', fallbackMetricKey: 'tmall-conversion', unit: '元', trend: 'up', compareValue: '↑8%' },
          { label: 'CTR', metricKey: 'tmall-conversion', fallbackMetricKey: 'jd-conversion', unit: '%', trend: 'down', compareValue: '↓0.3%' },
          { label: 'CPC', metricKey: 'tmall-conversion', fallbackMetricKey: 'jd-conversion', unit: '元', trend: 'up', compareValue: '↑0.05' },
          { label: '成交GMV', metricKey: 'tmall-traffic', fallbackMetricKey: 'douyin-total-sales', unit: '元', aggregate: true, trend: 'up', compareValue: '↑10%' },
          { label: 'ROI', metricKey: 'tmall-conversion', fallbackMetricKey: 'jd-conversion', unit: '', trend: 'stable', compareValue: '→' },
          { label: '退款率', metricKey: 'tmall-conversion', fallbackMetricKey: 'jd-conversion', unit: '%', trend: 'up', compareValue: '↑0.2%' },
          { label: '转化率', metricKey: 'tmall-conversion', fallbackMetricKey: 'jd-conversion', unit: '%', trend: 'stable', compareValue: '→' },
          { label: 'GMV环比', metricKey: 'tmall-traffic', fallbackMetricKey: 'tmall-conversion', unit: '%', trend: 'up', compareValue: '↑12%' }
        ]
      } as KPICardConfig,
      {
        type: 'channel-contribution-table',
        title: '渠道贡献表',
        channels: mockChannelContribution
      } as ChannelContributionTableConfig,
      {
        type: 'plan-efficiency-table',
        title: '计划/单元效率表',
        plans: mockPlanEfficiency
      } as PlanEfficiencyTableConfig
    ]
  } as TmallTrafficStageConfig,

  coldStart: {
    sections: [
      {
        type: 'target-progress',
        title: '冷启动目标',
        metrics: [
          { label: '总GMV', targetKey: '总成交金额', currentKey: '总成交金额' },
          { label: 'CTR', targetKey: '总成交金额', currentKey: '总成交金额' },
          { label: 'ROI', targetKey: '总成交金额', currentKey: '总成交金额' }
        ]
      } as TargetProgressConfig,
      {
        type: 'ai-insight-summary',
        title: 'AI洞察摘要',
        date: '2024-01-25',
        insights: [
          '本周GMV较上周提升12%，表现优异',
          'CTR下降0.3%，建议优化素材质量',
          'CPC上升0.05元，建议优化出价策略',
          '建议调整预算分配，增加直通车预算'
        ],
        actionText: '查看AI洞察'
      } as AIInsightSummaryConfig,
      {
        type: 'funnel-chart',
        title: '转化漏斗',
        steps: [
          { label: '曝光', value: 9800000 },
          { label: '点击', value: 588000 },
          { label: '加购', value: 47040 },
          { label: '下单', value: 42336 },
          { label: '支付', value: 38000 }
        ]
      } as FunnelChartConfig,
      {
        type: 'resource-efficiency-tables',
        title: '素材/资源位效率',
        tables: [
          { title: '投放素材/资源位', resources: mockResourceEfficiencyLeft },
          { title: '活动/频道/入口位', resources: mockResourceEfficiencyRight }
        ]
      } as ResourceEfficiencyTablesConfig,
      {
        type: 'plan-efficiency-table',
        title: '计划/单元明细表',
        plans: mockPlanEfficiency
      } as PlanEfficiencyTableConfig,
      {
        type: 'diagnosis-insights',
        title: 'AI诊断',
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
  } as TmallTrafficStageConfig,

  scaleUp: {
    sections: [
      {
        type: 'target-progress',
        title: '放量目标',
        metrics: [
          { label: '总GMV', targetKey: '总成交金额', currentKey: '总成交金额' },
          { label: 'CTR', targetKey: '总成交金额', currentKey: '总成交金额' },
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
          '直通车表现优异，建议增加预算',
          '建议优化万相台-推荐，提升整体效率'
        ],
        actionText: '查看AI洞察'
      } as AIInsightSummaryConfig,
      {
        type: 'funnel-chart',
        title: '转化漏斗',
        steps: [
          { label: '曝光', value: 12000000 },
          { label: '点击', value: 720000 },
          { label: '加购', value: 57600 },
          { label: '下单', value: 51840 },
          { label: '支付', value: 46500 }
        ]
      } as FunnelChartConfig,
      {
        type: 'channel-overview-table',
        title: '渠道投放总览表',
        channels: mockChannelOverview
      } as ChannelOverviewTableConfig,
      {
        type: 'plan-efficiency-table',
        title: '计划/单元明细表',
        plans: mockPlanEfficiency
      } as PlanEfficiencyTableConfig,
      {
        type: 'keyword-crowd-table',
        title: '关键词/人群包效率表',
        items: mockKeywordCrowd
      } as KeywordCrowdTableConfig,
      {
        type: 'diagnosis-insights',
        title: 'AI诊断',
        cards: mockDiagnosisInsights.slice(0, 6)
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
  } as TmallTrafficStageConfig
}

