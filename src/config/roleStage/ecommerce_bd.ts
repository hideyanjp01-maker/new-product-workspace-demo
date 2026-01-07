// 电商商务（达人/资源位）角色阶段配置
// 所有指标字段必须来自现有 mockData/metrics，不能新增字段

export type EcommerceBDSectionType = 
  | 'kpi-cards'              // KPI卡片组
  | 'talent-contribution-table' // 达人贡献榜表格
  | 'target-progress'        // 目标与进度
  | 'ai-insight'             // AI洞察（绿色卡片）
  | 'talent-tier-table'      // 达人分层表现表格
  | 'talent-pool-table'      // 达人资源池表格（带筛选）
  | 'diagnosis-cards'        // 诊断问题卡片
  | 'kanban-board'           // 任务看板
  | 'resource-efficiency-tables' // 投放/资源位效率双表

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
  }>
}

export interface TalentContributionTableConfig {
  type: 'talent-contribution-table'
  title?: string
  talents: Array<{
    name: string
    type: string
    exposure?: number
    ctr?: number
    cvr?: number
    roi?: number
    gmv?: number
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

export interface TalentTierTableConfig {
  type: 'talent-tier-table'
  title?: string
  tiers: Array<{
    level: string
    count: number
    ratio: number
    totalGmv?: number
    avgRoi?: number
    avgRefundRate?: number
  }>
}

export interface TalentPoolTableConfig {
  type: 'talent-pool-table'
  title?: string
  talents: Array<{
    name: string
    type: string
    exposure?: number
    clicks?: number
    ctr?: number
    orders?: number
    cvr?: number
    roi?: number
    gmv?: number
  }>
}

export interface DiagnosisCardsConfig {
  type: 'diagnosis-cards'
  title?: string
  cards: Array<{
    title: string
    description: string
    suggestion: string
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
      tag?: string
      date?: string
      assignee?: string
    }>
  }>
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
      orders?: number
      gmv?: number
      roi?: number
      refundRate?: number
    }>
  }>
}

export type EcommerceBDStageSectionConfig = 
  | KPICardConfig
  | TalentContributionTableConfig
  | TargetProgressConfig
  | AIInsightConfig
  | TalentTierTableConfig
  | TalentPoolTableConfig
  | DiagnosisCardsConfig
  | KanbanBoardConfig
  | ResourceEfficiencyTablesConfig

export interface EcommerceBDStageConfig {
  sections: EcommerceBDStageSectionConfig[]
}

// Mock数据：达人贡献榜
const mockTalents = [
  { name: '达人A', type: '头部达人', exposure: 500000, ctr: 3.5, cvr: 2.8, roi: 4.2, gmv: 2100000 },
  { name: '达人B', type: '腰部达人', exposure: 350000, ctr: 3.0, cvr: 2.5, roi: 3.8, gmv: 1312500 },
  { name: '达人C', type: '头部达人', exposure: 450000, ctr: 3.8, cvr: 3.0, roi: 4.5, gmv: 2025000 },
  { name: '达人D', type: 'A类达人', exposure: 280000, ctr: 2.8, cvr: 2.2, roi: 3.5, gmv: 862400 },
  { name: '达人E', type: '腰部达人', exposure: 320000, ctr: 3.2, cvr: 2.6, roi: 3.9, gmv: 1331200 },
  { name: '达人F', type: 'A类达人', exposure: 250000, ctr: 2.5, cvr: 2.0, roi: 3.2, gmv: 625000 },
  { name: '达人G', type: '头部达人', exposure: 480000, ctr: 4.0, cvr: 3.2, roi: 4.8, gmv: 2457600 },
  { name: '达人H', type: '腰部达人', exposure: 300000, ctr: 3.1, cvr: 2.4, roi: 3.7, gmv: 1116000 },
  { name: '达人I', type: 'A类达人', exposure: 220000, ctr: 2.6, cvr: 2.1, roi: 3.3, gmv: 600600 },
  { name: '达人J', type: '头部达人', exposure: 420000, ctr: 3.6, cvr: 2.9, roi: 4.3, gmv: 1755600 },
  { name: '达人K', type: '腰部达人', exposure: 290000, ctr: 3.0, cvr: 2.3, roi: 3.6, gmv: 1000500 },
  { name: '达人L', type: 'A类达人', exposure: 240000, ctr: 2.7, cvr: 2.1, roi: 3.4, gmv: 685440 },
  { name: '达人M', type: '头部达人', exposure: 460000, ctr: 3.9, cvr: 3.1, roi: 4.6, gmv: 2201100 },
  { name: '达人N', type: '腰部达人', exposure: 310000, ctr: 3.1, cvr: 2.5, roi: 3.8, gmv: 1202800 },
  { name: '达人O', type: 'A类达人', exposure: 230000, ctr: 2.6, cvr: 2.0, roi: 3.3, gmv: 598000 },
  { name: '达人P', type: '头部达人', exposure: 440000, ctr: 3.7, cvr: 2.9, roi: 4.4, gmv: 1883200 },
  { name: '达人Q', type: '腰部达人', exposure: 280000, ctr: 2.9, cvr: 2.4, roi: 3.6, gmv: 974400 },
  { name: '达人R', type: 'A类达人', exposure: 210000, ctr: 2.4, cvr: 1.9, roi: 3.1, gmv: 499800 },
  { name: '达人S', type: '头部达人', exposure: 400000, ctr: 3.5, cvr: 2.8, roi: 4.2, gmv: 1680000 },
  { name: '达人T', type: '腰部达人', exposure: 270000, ctr: 2.8, cvr: 2.3, roi: 3.5, gmv: 869400 }
]

// Mock数据：达人分层
const mockTalentTiers = [
  { level: 'S级', count: 5, ratio: 25, totalGmv: 10500000, avgRoi: 4.5, avgRefundRate: 2.1 },
  { level: 'A级', count: 8, ratio: 40, totalGmv: 8400000, avgRoi: 3.8, avgRefundRate: 2.5 },
  { level: 'B级', count: 5, ratio: 25, totalGmv: 5000000, avgRoi: 3.2, avgRefundRate: 3.0 },
  { level: 'C级', count: 2, ratio: 10, totalGmv: 1200000, avgRoi: 2.8, avgRefundRate: 3.5 }
]

// Mock数据：诊断问题
const mockDiagnosisCards = [
  { title: '头部达人合作不足', description: 'S级达人数量偏少，建议增加头部达人合作', suggestion: '建议：扩大头部达人合作规模', severity: 'high' as const },
  { title: '腰部达人ROI偏低', description: 'B级达人平均ROI较S级存在差距', suggestion: '建议：优化腰部达人合作策略', severity: 'medium' as const },
  { title: 'C级达人退款率偏高', description: 'C级达人平均退款率需要关注', suggestion: '建议：分析C级达人合作质量', severity: 'medium' as const },
  { title: '达人资源池待扩充', description: '当前达人资源池数量充足，但质量可提升', suggestion: '建议：引入更多优质达人', severity: 'low' as const },
  { title: '头部达人表现优异', description: 'S级达人GMV贡献突出，ROI表现良好', suggestion: '建议：继续保持头部达人合作', severity: 'success' as const },
  { title: 'A级达人合作稳定', description: 'A级达人数量最多，合作稳定', suggestion: '建议：维持A级达人合作规模', severity: 'success' as const },
  { title: '达人曝光量需提升', description: '部分达人曝光量偏低，影响GMV', suggestion: '建议：加大达人内容推广力度', severity: 'medium' as const },
  { title: '达人转化率优化', description: '部分达人CTR/CVR有提升空间', suggestion: '建议：优化达人内容质量', severity: 'low' as const },
  { title: '达人费用控制', description: '达人费用在合理范围内', suggestion: '建议：持续监控达人费用', severity: 'low' as const }
]

// Mock数据：任务看板
const mockKanbanColumns = [
  {
    id: 'todo',
    title: '待处理',
    cards: [
      { id: 'todo-1', title: '扩大头部达人合作', tag: '高优先级', date: '2024-01-25' },
      { id: 'todo-2', title: '优化腰部达人策略', tag: '中优先级', date: '2024-01-26' },
      { id: 'todo-3', title: '分析C级达人质量', tag: '中优先级', date: '2024-01-27' }
    ]
  },
  {
    id: 'doing',
    title: '进行中',
    cards: [
      { id: 'doing-1', title: '引入优质达人', tag: '高优先级', date: '2024-01-24', assignee: '张三' },
      { id: 'doing-2', title: '达人内容优化', tag: '中优先级', date: '2024-01-24', assignee: '李四' },
      { id: 'doing-3', title: '达人费用监控', tag: '低优先级', date: '2024-01-23', assignee: '王五' }
    ]
  },
  {
    id: 'done',
    title: '已完成',
    cards: [
      { id: 'done-1', title: '达人合作对接', tag: '已完成', date: '2024-01-23' },
      { id: 'done-2', title: '达人数据分析', tag: '已完成', date: '2024-01-22' },
      { id: 'done-3', title: '达人资源池扩充', tag: '已完成', date: '2024-01-21' }
    ]
  }
]

// Mock数据：资源位效率
const mockLiveResources = [
  { name: '达人A-直播', exposure: 500000, clicks: 17500, orders: 1400, gmv: 2100000, roi: 4.2, refundRate: 2.1 },
  { name: '达人B-直播', exposure: 350000, clicks: 10500, orders: 875, gmv: 1312500, roi: 3.8, refundRate: 2.5 },
  { name: '达人C-直播', exposure: 450000, clicks: 17100, orders: 1350, gmv: 2025000, roi: 4.5, refundRate: 2.0 },
  { name: '达人D-直播', exposure: 280000, clicks: 7840, orders: 616, gmv: 862400, roi: 3.5, refundRate: 2.8 },
  { name: '达人E-直播', exposure: 320000, clicks: 10240, orders: 832, gmv: 1331200, roi: 3.9, refundRate: 2.3 }
]

const mockProductCardResources = [
  { name: '达人A-商品卡', exposure: 800000, clicks: 20000, orders: 1600, gmv: 1600000, roi: 3.8, refundRate: 2.2 },
  { name: '达人B-商品卡', exposure: 600000, clicks: 15000, orders: 1200, gmv: 1200000, roi: 3.5, refundRate: 2.6 },
  { name: '达人C-商品卡', exposure: 700000, clicks: 17500, orders: 1400, gmv: 1400000, roi: 3.9, refundRate: 2.1 },
  { name: '达人D-商品卡', exposure: 500000, clicks: 12500, orders: 1000, gmv: 1000000, roi: 3.2, refundRate: 2.9 },
  { name: '达人E-商品卡', exposure: 550000, clicks: 13750, orders: 1100, gmv: 1100000, roi: 3.6, refundRate: 2.4 }
]

export const ecommerceBDStageConfig = {
  overview: {
    sections: [
      {
        type: 'kpi-cards',
        title: '核心指标',
        cards: [
          { label: 'KOL GMV', metricKey: 'douyin-total-sales', unit: '元', aggregate: true, trend: 'up' },
          { label: 'KOL ROI', metricKey: 'douyin-commission', fallbackMetricKey: 'douyin-total-sales', unit: '', trend: 'stable' },
          { label: '退款金额', metricKey: 'douyin-refund-rate', fallbackMetricKey: 'douyin-total-sales', unit: '元', trend: 'down' },
          { label: '成交金额', metricKey: 'douyin-total-sales', unit: '元', aggregate: true, trend: 'up' },
          { label: '达人费用', metricKey: 'douyin-commission', unit: '元', trend: 'up' },
          { label: '成交人数', metricKey: 'douyin-total-orders', unit: '人', aggregate: true, trend: 'up' },
          { label: '退货率', metricKey: 'douyin-refund-rate', unit: '%', trend: 'down' },
          { label: 'SPU AOV', metricKey: 'douyin-avg-price', unit: '元', trend: 'stable' }
        ]
      } as KPICardConfig,
      {
        type: 'talent-contribution-table',
        title: '达人贡献榜',
        talents: mockTalents
      } as TalentContributionTableConfig
    ]
  } as EcommerceBDStageConfig,

  coldStart: {
    sections: [
      {
        type: 'target-progress',
        title: '冷启动目标与进度',
        metrics: [
          { label: '成交金额', targetKey: '总成交金额', currentKey: '总成交金额' },
          { label: '成交订单数', targetKey: '总成交订单数', currentKey: '总成交订单数' },
          { label: 'ROI 底线达成', targetKey: '总成交金额', currentKey: '总成交金额' }
        ]
      } as TargetProgressConfig,
      {
        type: 'ai-insight',
        title: '洞察日志',
        insights: [
          '本阶段关键动作：建议扩大头部达人合作规模',
          '风险提示：C级达人退款率需要持续监控',
          '建议：优化腰部达人合作策略，提升ROI',
          '建议：引入更多优质达人，扩充资源池'
        ],
        actionText: '查看详情'
      } as AIInsightConfig,
      {
        type: 'talent-tier-table',
        title: '达人分层表现',
        tiers: mockTalentTiers
      } as TalentTierTableConfig,
      {
        type: 'talent-pool-table',
        title: '达人资源池',
        talents: mockTalents.slice(0, 20)
      } as TalentPoolTableConfig,
      {
        type: 'diagnosis-cards',
        title: '诊断问题',
        cards: mockDiagnosisCards.slice(0, 6)
      } as DiagnosisCardsConfig,
      {
        type: 'kanban-board',
        title: '任务看板',
        columns: mockKanbanColumns
      } as KanbanBoardConfig
    ]
  } as EcommerceBDStageConfig,

  scaleUp: {
    sections: [
      {
        type: 'target-progress',
        title: '放量期目标与进度',
        metrics: [
          { label: '成交金额', targetKey: '总成交金额', currentKey: '总成交金额' },
          { label: '成交订单数', targetKey: '总成交订单数', currentKey: '总成交订单数' },
          { label: 'ROI 底线达成', targetKey: '总成交金额', currentKey: '总成交金额' }
        ]
      } as TargetProgressConfig,
      {
        type: 'ai-insight',
        title: '洞察日志',
        insights: [
          '放量期表现优异，建议扩大头部达人合作',
          '当前ROI保持稳定，建议继续优化达人策略',
          '用户反馈整体积极，建议收集并分析达人数据',
          '建议加大推广力度，进一步提升GMV'
        ],
        actionText: '查看详情'
      } as AIInsightConfig,
      {
        type: 'kpi-cards',
        title: '关键指标',
        cards: [
          { label: 'GMV', metricKey: 'douyin-total-sales', unit: '元', aggregate: true, trend: 'up' },
          { label: 'ROI', metricKey: 'douyin-commission', fallbackMetricKey: 'douyin-total-sales', unit: '', trend: 'stable' },
          { label: '成交人数', metricKey: 'douyin-total-orders', unit: '人', aggregate: true, trend: 'up' },
          { label: '客单价', metricKey: 'douyin-avg-price', unit: '元', trend: 'stable' }
        ]
      } as KPICardConfig,
      {
        type: 'talent-tier-table',
        title: '达人分层&资源部署',
        tiers: mockTalentTiers
      } as TalentTierTableConfig,
      {
        type: 'talent-contribution-table',
        title: '达人贡献榜',
        talents: mockTalents.slice(0, 20)
      } as TalentContributionTableConfig,
      {
        type: 'resource-efficiency-tables',
        title: '投放/资源位效率',
        tables: [
          { title: '直播投放效率', resources: mockLiveResources },
          { title: '商品卡投放效率', resources: mockProductCardResources }
        ]
      } as ResourceEfficiencyTablesConfig,
      {
        type: 'diagnosis-cards',
        title: '诊断问题',
        cards: mockDiagnosisCards
      } as DiagnosisCardsConfig,
      {
        type: 'kanban-board',
        title: '任务看板',
        columns: mockKanbanColumns
      } as KanbanBoardConfig
    ]
  } as EcommerceBDStageConfig
}

