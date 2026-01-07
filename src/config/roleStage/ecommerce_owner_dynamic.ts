// 电商负责人动态配置生成器
import {
  genOverviewKPIs,
  genTrendCharts,
  genStructureAnalysis,
  genSankeyData,
  genDetailTable,
  genTargetProgress,
  genFunnel,
  genDiagnosis,
  genKanban,
  genLogs,
  type StageKey
} from '../../mock/ecommerceOwnerData'

export type EcommerceOwnerSectionType =
  | 'kpi-cards'
  | 'platform-kpi-cards'
  | 'trend-charts'
  | 'structure-analysis'
  | 'sankey'
  | 'detail-table'
  | 'target-progress'
  | 'ai-insight-summary'
  | 'funnel-chart'
  | 'diagnosis-insights'
  | 'kanban-board'
  | 'operation-logs'

export interface EcommerceOwnerSection {
  type: EcommerceOwnerSectionType
  [key: string]: any
}

export function getEcommerceOwnerStageConfig(
  stage: StageKey,
  dateA: string,
  dateB: string,
  expanded: boolean = true
): { sections: EcommerceOwnerSection[] } {
  if (stage === 'overview') {
    const { totalKPIs, platformKPIs } = genOverviewKPIs(dateA, dateB)
    const trendCharts = genTrendCharts(dateA, dateB)
    const structure = genStructureAnalysis(dateA, dateB)
    const sankey = genSankeyData(dateA, dateB)
    const detailTable = genDetailTable(dateA, dateB, expanded ? 20 : 10)
    
    const sections: EcommerceOwnerSection[] = [
      {
        type: 'kpi-cards',
        title: '核心经营总览',
        cards: totalKPIs
      },
      {
        type: 'platform-kpi-cards',
        title: '分平台经营总览',
        platforms: platformKPIs
      }
    ]
    
    if (expanded) {
      sections.push(
        {
          type: 'trend-charts',
          title: '经营趋势分析',
          charts: trendCharts
        },
        {
          type: 'structure-analysis',
          title: '结构分析',
          platformStructure: structure.platformStructure,
          channelStructure: structure.channelStructure,
          topSPUs: structure.topSPUs
        },
        {
          type: 'sankey',
          title: '人群/流向分析',
          nodes: sankey.nodes,
          links: sankey.links
        },
        {
          type: 'detail-table',
          title: '明细表',
          data: detailTable
        }
      )
    }
    
    return { sections }
  }
  
  if (stage === 'coldStart') {
    const progress = genTargetProgress('coldStart', dateA, dateB)
    const funnel = genFunnel('coldStart', dateA, dateB)
    const diag = genDiagnosis('coldStart', dateA, dateB)
    const kanban = genKanban('coldStart', dateA, dateB)
    const logs = genLogs('coldStart', dateA, dateB, 10)
    
    const sections: EcommerceOwnerSection[] = [
      {
        type: 'target-progress',
        title: '冷启动目标与进度',
        metrics: progress
      },
      {
        type: 'ai-insight-summary',
        title: '洞察总结',
        date: dateB,
        insights: ['GMV较对比期有差距','CTR小幅波动','CPC需控制','建议：优先拉升高ROI计划'],
        actionText: '查看详情'
      },
      {
        type: 'funnel-chart',
        title: '转化漏斗',
        steps: funnel
      }
    ]
    
    if (expanded) {
      sections.push(
        {
          type: 'kpi-cards',
          title: '关键指标对比',
          cards: genOverviewKPIs(dateA, dateB).totalKPIs.slice(0, 8)
        },
        {
          type: 'diagnosis-insights',
          title: 'AI 诊断',
          scenes: diag.scenes
        },
        {
          type: 'kanban-board',
          title: '任务协同看板',
          columns: [
            { id: 'todo', title: '待处理', cards: kanban.todo },
            { id: 'doing', title: '进行中', cards: kanban.doing },
            { id: 'done', title: '已完成', cards: kanban.done }
          ]
        },
        {
          type: 'operation-logs',
          title: '操作记录',
          logs
        }
      )
    }
    
    return { sections }
  }
  
  // scaleUp
  const progress = genTargetProgress('scaleUp', dateA, dateB)
  const funnel = genFunnel('scaleUp', dateA, dateB)
  const structure = genStructureAnalysis(dateA, dateB)
  const diag = genDiagnosis('scaleUp', dateA, dateB)
  const kanban = genKanban('scaleUp', dateA, dateB)
  const logs = genLogs('scaleUp', dateA, dateB, 10)
  const detailTable = genDetailTable(dateA, dateB, expanded ? 30 : 15)
  
  const sections: EcommerceOwnerSection[] = [
    {
      type: 'target-progress',
      title: '放量目标与进度',
      metrics: progress
    },
    {
      type: 'ai-insight-summary',
      title: '洞察总结',
      date: dateB,
      insights: ['放量建议：扩大高ROI计划','预算/消耗分配需优化','渠道结构优化建议','边际效率需监控'],
      actionText: '查看详情'
    },
    {
      type: 'funnel-chart',
      title: '转化漏斗',
      steps: funnel
    }
  ]
  
  if (expanded) {
    sections.push(
      {
        type: 'kpi-cards',
        title: '放量关键指标',
        cards: genOverviewKPIs(dateA, dateB).totalKPIs
      },
      {
        type: 'structure-analysis',
        title: '平台/渠道结构分析',
        platformStructure: structure.platformStructure,
        channelStructure: structure.channelStructure
      },
      {
        type: 'detail-table',
        title: '平台×渠道贡献矩阵',
        data: detailTable
      },
      {
        type: 'diagnosis-insights',
        title: 'AI 诊断',
        scenes: diag.scenes
      },
      {
        type: 'kanban-board',
        title: '任务协同看板',
        columns: [
          { id: 'todo', title: '待处理', cards: kanban.todo },
          { id: 'doing', title: '进行中', cards: kanban.doing },
          { id: 'done', title: '已完成', cards: kanban.done }
        ]
      },
      {
        type: 'operation-logs',
        title: '操作记录',
        logs
      }
    )
  }
  
  return { sections }
}

