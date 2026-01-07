import type {
  KPICardConfig,
  ChannelContributionTableConfig,
  PlanEfficiencyTableConfig,
  FunnelChartConfig,
  TargetProgressConfig,
  AIInsightSummaryConfig,
  RankBarsConfig,
  DiagnosisInsightsConfig,
  KanbanBoardConfig,
  OperationLogsConfig
} from './tmall_traffic' // 复用已有类型
import {
  genOverviewKPIs,
  genChannels,
  genPlans,
  genFunnel,
  genRank,
  genDiagnosis,
  genKanban,
  genLogs,
  type StageKey
} from '../../mock/tmallTrafficOps'

export type TmallTrafficOpsSection =
  | KPICardConfig
  | ChannelContributionTableConfig
  | PlanEfficiencyTableConfig
  | FunnelChartConfig
  | TargetProgressConfig
  | AIInsightSummaryConfig
  | RankBarsConfig
  | DiagnosisInsightsConfig
  | KanbanBoardConfig
  | OperationLogsConfig

export function getTmallTrafficOpsStageConfig(
  stage: StageKey,
  dateA: string,
  dateB: string
): { sections: TmallTrafficOpsSection[] } {
  if (stage === 'overview') {
    const kpis = genOverviewKPIs(dateA, dateB)
    const channels = genChannels('overview', dateA, dateB)
    const plans = genPlans('overview', dateA, dateB, 15)
    const sections: TmallTrafficOpsSection[] = [
      {
        type: 'kpi-cards',
        title: '关键指标',
        cards: kpis.map(k => ({
          label: k.label,
          metricKey: k.placeholder ? undefined as any : (k.metricKey as string),
          unit: k.unit,
          trend: k.trend as any,
          compareValue: k.compareValue
        }))
      } as KPICardConfig,
      {
        type: 'channel-contribution-table',
        title: '渠道分析',
        channels
      } as ChannelContributionTableConfig,
      {
        type: 'plan-efficiency-table',
        title: '计划维度表现',
        plans: plans
      } as PlanEfficiencyTableConfig
    ]
    return { sections }
  }

  if (stage === 'coldStart') {
    const funnel = genFunnel('coldStart', dateA, dateB)
    const channels = genChannels('coldStart', dateA, dateB)
    const plans = genPlans('coldStart', dateA, dateB, 20)
    const rankA = genRank('coldStart', dateA, dateB, 'audience')
    const rankB = genRank('coldStart', dateA, dateB, 'keyword')
    const diag = genDiagnosis('coldStart', dateA, dateB)
    const kanban = genKanban('coldStart', dateA, dateB)
    const logs = genLogs('coldStart', dateA, dateB, 10)
    const sections: TmallTrafficOpsSection[] = [
      {
        type: 'target-progress',
        title: '冷启动目标',
        metrics: [
          { label: 'GMV目标完成度', targetKey: '总成交金额', currentKey: '总成交金额' },
          { label: 'ROI完成度', targetKey: '总成交金额', currentKey: '总成交金额' },
          { label: '曝光完成度', targetKey: '总成交金额', currentKey: '总成交金额' }
        ]
      } as TargetProgressConfig,
      {
        type: 'ai-insight-summary',
        title: '洞察总结',
        date: dateB,
        insights: ['GMV较对比期有差距','CTR小幅波动','CPC需控制','建议：优先拉升高ROI计划'],
        actionText: '查看详情'
      } as AIInsightSummaryConfig,
      {
        type: 'funnel-chart',
        title: '转化漏斗',
        steps: funnel
      } as FunnelChartConfig,
      {
        type: 'rank-bars',
        title: '人群贡献',
        items: rankA
      } as RankBarsConfig,
      {
        type: 'rank-bars',
        title: '关键词Top',
        items: rankB
      } as RankBarsConfig,
      {
        type: 'plan-efficiency-table',
        title: '计划/资源位明细',
        plans
      } as PlanEfficiencyTableConfig,
      {
        type: 'diagnosis-insights',
        title: 'AI 诊断',
        // 利用 renderer 的 scene tabs 能力：把 cards 合并并由 renderer 分场景展示（若 renderer 支持 scenes 可扩展）
        cards: diag.scenes.flatMap(s => s.cards)
      } as DiagnosisInsightsConfig,
      {
        type: 'kanban-board',
        title: '任务看板',
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
    return { sections }
  }

  // scaleUp
  const funnel = genFunnel('scaleUp', dateA, dateB)
  const channels = genChannels('scaleUp', dateA, dateB)
  const plans = genPlans('scaleUp', dateA, dateB, 30)
  const rankA = genRank('scaleUp', dateA, dateB, 'audience')
  const rankB = genRank('scaleUp', dateA, dateB, 'keyword')
  const diag = genDiagnosis('scaleUp', dateA, dateB)
  const kanban = genKanban('scaleUp', dateA, dateB)
  const logs = genLogs('scaleUp', dateA, dateB, 10)
  const sections: TmallTrafficOpsSection[] = [
    {
      type: 'target-progress',
      title: '放量目标',
      metrics: [
        { label: 'GMV目标完成度', targetKey: '总成交金额', currentKey: '总成交金额' },
        { label: 'ROI完成度', targetKey: '总成交金额', currentKey: '总成交金额' },
        { label: '曝光完成度', targetKey: '总成交金额', currentKey: '总成交金额' }
      ]
    } as TargetProgressConfig,
    {
      type: 'ai-insight-summary',
      title: '洞察总结',
      date: dateB,
      insights: ['放量建议：扩大高ROI计划','边际效率需监控','CPC/CPM稳定性关注'],
      actionText: '查看详情'
    } as AIInsightSummaryConfig,
    {
      type: 'funnel-chart',
      title: '转化漏斗',
      steps: funnel
    } as FunnelChartConfig,
    {
      type: 'rank-bars',
      title: '人群贡献',
      items: rankA
    } as RankBarsConfig,
    {
      type: 'rank-bars',
      title: '关键词Top',
      items: rankB
    } as RankBarsConfig,
    {
      type: 'plan-efficiency-table',
      title: '计划/资源位明细',
      plans
    } as PlanEfficiencyTableConfig,
    {
      type: 'diagnosis-insights',
      title: 'AI 诊断',
      cards: diag.scenes.flatMap(s => s.cards)
    } as DiagnosisInsightsConfig,
    {
      type: 'kanban-board',
      title: '任务看板',
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
  return { sections }
}


