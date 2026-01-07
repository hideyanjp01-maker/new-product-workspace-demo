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
  genTargetProgress,
  genKanban,
  genLogs,
  type StageKey
} from '../../mock/tmallOps'

export type TmallOpsSection =
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

export function getTmallOpsStageConfig(
  stage: StageKey,
  dateA: string,
  dateB: string
): { sections: TmallOpsSection[] } {
  if (stage === 'overview') {
    const kpis = genOverviewKPIs(dateA, dateB)
    const channels = genChannels('overview', dateA, dateB)
    const plans = genPlans('overview', dateA, dateB, 15)
    const sections: TmallOpsSection[] = [
      {
        type: 'kpi-cards',
        title: '核心经营总览',
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
        title: '渠道贡献',
        channels
      } as ChannelContributionTableConfig,
      {
        type: 'plan-efficiency-table',
        title: '计划维度明细',
        plans: plans
      } as PlanEfficiencyTableConfig
    ]
    return { sections }
  }

  if (stage === 'coldStart') {
    const progress = genTargetProgress(dateA, dateB)
    const funnel = genFunnel('coldStart', dateA, dateB)
    const channels = genChannels('coldStart', dateA, dateB)
    const plans = genPlans('coldStart', dateA, dateB, 20)
    const rankA = genRank('coldStart', dateA, dateB, 'audience')
    const rankB = genRank('coldStart', dateA, dateB, 'keyword')
    const diag = genDiagnosis('coldStart', dateA, dateB)
    const kanban = genKanban('coldStart', dateA, dateB)
    const logs = genLogs('coldStart', dateA, dateB, 10)
    const sections: TmallOpsSection[] = [
      {
        type: 'target-progress',
        title: '冷启动阶段目标与进度',
        metrics: progress.map(p => ({
          label: p.label,
          targetKey: p.targetKey,
          currentKey: p.currentKey
        }))
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
        title: 'A. 人群贡献（渠道维度SPU）',
        items: rankA
      } as RankBarsConfig,
      {
        type: 'rank-bars',
        title: 'B. 搜索Top（曝光UV）',
        items: rankB
      } as RankBarsConfig,
      {
        type: 'plan-efficiency-table',
        title: '计划/渠道诊断明细',
        plans: plans.map(p => ({
          ...p,
          spu: `SPU-${String(Math.floor(Math.random() * 10) + 1).padStart(3, '0')}`,
          channel: channels[Math.floor(Math.random() * channels.length)].channel
        }))
      } as PlanEfficiencyTableConfig,
      {
        type: 'diagnosis-insights',
        title: 'AI 诊断',
        scenes: diag.scenes, // 传入完整的 scenes 数据（包含8个场景）
        cards: diag.scenes.flatMap(s => s.cards)
      } as any as DiagnosisInsightsConfig,
      {
        type: 'kanban-board',
        title: '任务协同看板',
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
  const progress = genTargetProgress(dateA, dateB)
  const funnel = genFunnel('scaleUp', dateA, dateB)
  const channels = genChannels('scaleUp', dateA, dateB)
  const plans = genPlans('scaleUp', dateA, dateB, 30)
  const rankA = genRank('scaleUp', dateA, dateB, 'audience')
  const rankB = genRank('scaleUp', dateA, dateB, 'keyword')
  const rankC = genRank('scaleUp', dateA, dateB, 'channel')
  const diag = genDiagnosis('scaleUp', dateA, dateB)
  const kanban = genKanban('scaleUp', dateA, dateB)
  const logs = genLogs('scaleUp', dateA, dateB, 10)
  const sections: TmallOpsSection[] = [
    {
      type: 'target-progress',
      title: '放量阶段目标与进度',
      metrics: progress.map(p => ({
        label: p.label,
        targetKey: p.targetKey,
        currentKey: p.currentKey
      }))
    } as TargetProgressConfig,
    {
      type: 'ai-insight-summary',
      title: '洞察总结',
      date: dateB,
      insights: ['放量建议：扩大高ROI计划','预算/消耗分配需优化','渠道结构优化建议','边际效率需监控'],
      actionText: '查看详情'
    } as AIInsightSummaryConfig,
    {
      type: 'funnel-chart',
      title: '转化漏斗',
      steps: funnel
    } as FunnelChartConfig,
    {
      type: 'rank-bars',
      title: '渠道策略分析',
      items: rankC
    } as RankBarsConfig,
    {
      type: 'channel-contribution-table',
      title: '渠道投放效果',
      channels
    } as ChannelContributionTableConfig,
    {
      type: 'plan-efficiency-table',
      title: '计划/资源位明细',
      plans
    } as PlanEfficiencyTableConfig,
    {
      type: 'diagnosis-insights',
      title: 'AI 诊断',
      scenes: diag.scenes, // 传入完整的 scenes 数据（包含8个场景）
      cards: diag.scenes.flatMap(s => s.cards)
    } as any as DiagnosisInsightsConfig,
    {
      type: 'kanban-board',
      title: '任务协同看板',
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


