// 抖音内容制作角色阶段配置
// 所有指标字段必须来自现有 mockData/metrics，不能新增字段

export type DouyinContentSectionType =
  | 'kpi-cards'                    // KPI卡片组（7张：视频数量、曝光、GMV、ROI、CTR、CVR、CPM）
  | 'material-performance-table'   // 素材表现明细表
  | 'audience-sellingpoint-matrix' // 人群×卖点组合矩阵
  | 'talent-video-tracking-table'  // 重点达人&人群视频跟踪表
  | 'target-progress'              // 目标进度条
  | 'insight-summary'              // 洞察总结（绿色卡片）
  | 'material-diagnosis-tables'    // 素材诊断分析（三块Top5表）
  | 'material-analysis'            // 素材分析（素材详情区）
  | 'diagnosis-insights'           // 诊断洞察（AI诊断卡片，支持场景Tab）
  | 'kanban-board'                 // 任务看板
  | 'operation-logs'               // 操作记录

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
    compareValue?: string
  }>
}

export interface MaterialPerformanceTableConfig {
  type: 'material-performance-table'
  title?: string
  materials: Array<{
    materialId: string
    audience: string
    sellingPoint: string
    gmv: number
    roi: number
    ctr: number
    cvr: number
    cpm: number
    interactionRate: number
  }>
}

export interface AudienceSellingPointMatrixConfig {
  type: 'audience-sellingpoint-matrix'
  title?: string
  matrix: Array<{
    audience: string
    sellingPoints: Record<string, { roi: number; gmv: number; videoCount?: number }>
  }>
}

export interface TalentVideoTrackingTableConfig {
  type: 'talent-video-tracking-table'
  title?: string
  videos: Array<{
    rank: number
    spu: string
    talentName: string
    talentId: string
    videoId: string
    publishDate: string
    gmv: number
    orderCount: number
    refundRate: number
  }>
}

export interface TargetProgressConfig {
  type: 'target-progress'
  title?: string
  targets: Array<{
    label: string
    current: number
    target: number
    unit?: string
  }>
}

export interface InsightSummaryConfig {
  type: 'insight-summary'
  title?: string
  date?: string
  bullets: string[]
  buttonText?: string
}

export interface MaterialDiagnosisTablesConfig {
  type: 'material-diagnosis-tables'
  title?: string
  tables: Array<{
    title: string
    sortBy: 'roi' | 'gmv' | 'ctr'
    materials: Array<{
      materialId: string
      spu: string
      strategy: string
      cost: number
      gmv: number
      roi: number
      ctr: number
      cvr: number
      fullStoreSales: number
      audienceInsight: string
    }>
  }>
}

export interface MaterialAnalysisConfig {
  type: 'material-analysis'
  title?: string
  selectedMaterialId?: string
  kpis: Array<{
    label: string
    value: number | string
    unit?: string
  }>
  insights: string[]
}

export interface DiagnosisInsightsConfig {
  type: 'diagnosis-insights'
  title?: string
  scenes: Array<{
    id: string
    title: string
    cards: Array<{
      id: string
      title: string
      severity: 'high' | 'medium' | 'low'
      triggerMetrics: string[]
      conclusion: string
      suggestions: string[]
    }>
  }>
}

export interface KanbanBoardConfig {
  type: 'kanban-board'
  title?: string
  tasks: {
    todo: Array<{
      id: string
      title: string
      priority: 'high' | 'medium' | 'low'
      dueDate: string
      assignee: string
    }>
    doing: Array<{
      id: string
      title: string
      priority: 'high' | 'medium' | 'low'
      dueDate: string
      assignee: string
    }>
    done: Array<{
      id: string
      title: string
      priority: 'high' | 'medium' | 'low'
      dueDate: string
      assignee: string
    }>
  }
}

export interface OperationLogsConfig {
  type: 'operation-logs'
  title?: string
  logs: Array<{
    time: string
    action: string
    content: string
  }>
}

export type DouyinContentStageSectionConfig =
  | KPICardConfig
  | MaterialPerformanceTableConfig
  | AudienceSellingPointMatrixConfig
  | TalentVideoTrackingTableConfig
  | TargetProgressConfig
  | InsightSummaryConfig
  | MaterialDiagnosisTablesConfig
  | MaterialAnalysisConfig
  | DiagnosisInsightsConfig
  | KanbanBoardConfig
  | OperationLogsConfig

export interface DouyinContentStageConfig {
  sections: DouyinContentStageSectionConfig[]
}

export interface DouyinContentRoleConfig {
  overview: DouyinContentStageConfig
  coldStart: DouyinContentStageConfig
  scaleUp: DouyinContentStageConfig
}

// 配置将在StageRenderer中动态生成，基于mock数据
export const douyinContentStageConfig: DouyinContentRoleConfig = {
  overview: {
    sections: []  // 动态生成
  },
  coldStart: {
    sections: []  // 动态生成
  },
  scaleUp: {
    sections: []  // 动态生成
  }
}


