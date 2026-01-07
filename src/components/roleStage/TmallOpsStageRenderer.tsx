import { useMemo, useState } from 'react'
import { Card, Tabs } from '../ui'
import { getMetricsByRole } from '../../data/mockData'
import type { Metric, Product } from '../../data/mockData'
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
} from '../../config/roleStage/tmall_traffic'
import './TmallTrafficStageRenderer.css'

interface Props {
  sections: Array<
    KPICardConfig |
    ChannelContributionTableConfig |
    PlanEfficiencyTableConfig |
    FunnelChartConfig |
    TargetProgressConfig |
    AIInsightSummaryConfig |
    RankBarsConfig |
    DiagnosisInsightsConfig |
    KanbanBoardConfig |
    OperationLogsConfig
  >
  products: Product[]
  metrics?: Metric[]
  roleId?: string
  stage?: string
  dateRangeA?: string
  dateRangeB?: string
}

const getMetricValue = (key: string | undefined, products: Product[], metrics: Metric[], aggregate?: boolean): number | string | null => {
  if (!key) return null
  if (aggregate) {
    const total = products.reduce((sum, p) => {
      const v = p.currentMetrics?.[key] ?? 0
      return sum + (typeof v === 'number' ? v : 0)
    }, 0)
    return total || null
  }
  const m = metrics.find(m => m.id === key || m.name === key)
  if (m) return typeof m.value === 'number' ? m.value : null
  return null
}

const fmt = (v: number | string | null, unit?: string) => {
  if (v === null || v === undefined) return '—'
  if (typeof v === 'number') {
    if (unit === '元') return `${v.toLocaleString('zh-CN')}元`
    if (unit === '%') return `${v.toFixed(1)}%`
    if (unit === '单' || unit === 'UV') return `${v.toLocaleString('zh-CN')}${unit}`
    return `${v.toLocaleString('zh-CN')}${unit ? unit : ''}`
  }
  return `${v}${unit ? unit : ''}`
}

const KPI = (cfg: KPICardConfig, products: Product[], metrics: Metric[]) => (
  <div className="stage-section kpi-cards-section">
    {cfg.title && <h2 className="section-title">{cfg.title}</h2>}
    <div className="kpi-cards-grid tmall-traffic">
      {cfg.cards.map((c, i) => {
        const value = getMetricValue(c.metricKey as any, products, metrics, c.aggregate)
        const isMissing = !c.metricKey || (c as any).placeholder
        const displayValue = isMissing && (c as any).value !== undefined ? (c as any).value : value
        return (
          <Card key={i} padding="large" hoverable>
            <div className="kpi-card" title={isMissing ? '字段未配置' : undefined}>
              <div className="kpi-card-header">
                <div className="kpi-card-label">{c.label}</div>
                {c.trend && <span className={`kpi-trend kpi-trend--${c.trend}`}>{c.trend === 'up' ? '↑' : c.trend === 'down' ? '↓' : '→'}</span>}
              </div>
              <div className="kpi-card-value">{fmt(displayValue, c.unit)}</div>
              {c.compareValue && <div className="kpi-card-compare">{c.compareValue}</div>}
              <div className="kpi-card-sparkline"><div className="sparkline-placeholder">📈</div></div>
            </div>
          </Card>
        )
      })}
    </div>
  </div>
)

const ChannelTable = (cfg: ChannelContributionTableConfig) => (
  <div className="stage-section channel-contribution-table-section">
    {cfg.title && <h2 className="section-title">{cfg.title}</h2>}
    <Card padding="large">
      <div className="table-container">
        <table className="data-table tmall-traffic-table">
          <thead><tr><th>渠道</th><th>曝光</th><th>点击</th><th>CTR</th><th>CPC</th><th>GMV</th><th>ROI</th></tr></thead>
          <tbody>
            {cfg.channels.map((r, i) => (
              <tr key={i}>
                <td>{r.channel}</td>
                <td>{r.exposure ?? '—'}</td>
                <td>{r.clicks ?? '—'}</td>
                <td>{r.ctr !== undefined ? `${r.ctr.toFixed(1)}%` : '—'}</td>
                <td>{r.cpc !== undefined ? `${r.cpc.toFixed(2)}元` : '—'}</td>
                <td>{r.gmv !== undefined ? `${r.gmv.toLocaleString('zh-CN')}元` : '—'}</td>
                <td>{r.roi !== undefined ? r.roi.toFixed(2) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
)

const PlanTable = (cfg: PlanEfficiencyTableConfig) => (
  <div className="stage-section plan-efficiency-table-section">
    {cfg.title && <h2 className="section-title">{cfg.title}</h2>}
    <Card padding="large">
      <div className="table-container">
        <table className="data-table tmall-traffic-table">
          <thead>
            <tr>
              <th>计划ID</th>
              <th>计划名称</th>
              {(cfg.plans[0] as any)?.spu && <th>SPU</th>}
              {(cfg.plans[0] as any)?.channel && <th>渠道</th>}
              <th>消耗</th>
              <th>GMV</th>
              <th>ROI</th>
              <th>CTR</th>
              <th>CPC</th>
              <th>CVR</th>
              {(cfg.plans[0] as any)?.suggestion && <th>建议</th>}
            </tr>
          </thead>
          <tbody>
            {cfg.plans.map((p, i) => (
              <tr key={i}>
                <td>{p.planId}</td>
                <td>{p.planName || '—'}</td>
                {(p as any)?.spu && <td>{(p as any).spu}</td>}
                {(p as any)?.channel && <td>{(p as any).channel}</td>}
                <td>{p.cost !== undefined ? `${p.cost.toLocaleString('zh-CN')}元` : '—'}</td>
                <td>{p.gmv !== undefined ? `${p.gmv.toLocaleString('zh-CN')}元` : '—'}</td>
                <td>{p.roi !== undefined ? p.roi.toFixed(2) : '—'}</td>
                <td>{p.ctr !== undefined ? `${p.ctr.toFixed(1)}%` : '—'}</td>
                <td>{p.cpc !== undefined ? `${p.cpc.toFixed(2)}元` : '—'}</td>
                <td>{p.cvr !== undefined ? `${p.cvr.toFixed(1)}%` : '—'}</td>
                {(p as any)?.suggestion && <td>{(p as any).suggestion}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
)

const Funnel = (cfg: FunnelChartConfig) => (
  <div className="stage-section funnel-chart-section">
    {cfg.title && <h2 className="section-title">{cfg.title}</h2>}
    <Card padding="large">
      <div className="funnel-chart-container">
        {cfg.steps.map((s, i) => {
          const max = Math.max(...cfg.steps.map(x => x.value))
          const w = max > 0 ? (s.value / max) * 100 : 0
          const prevValue = i > 0 ? cfg.steps[i - 1].value : s.value
          const rate = prevValue > 0 ? (s.value / prevValue) * 100 : 0
          return (
            <div key={i} className="funnel-step-item">
              <div className="funnel-step-label">{s.label}</div>
              <div className="funnel-step-visual" style={{ width: `${w}%` }}>
                <span className="funnel-step-value">{fmt(s.value)}</span>
              </div>
              {i > 0 && <div className="funnel-step-rate">转化率: {rate.toFixed(1)}%</div>}
            </div>
          )
        })}
      </div>
    </Card>
  </div>
)

const TargetProgress = (cfg: TargetProgressConfig, products: Product[]) => {
  const p = products[0]
  return (
    <div className="stage-section target-progress-section">
      {cfg.title && <h2 className="section-title">{cfg.title}</h2>}
      <Card padding="large">
        <div className="target-progress-list">
          {cfg.metrics.map((m, i) => {
            const target = p?.targetMetrics?.[m.targetKey] ?? (cfg.metrics[i] as any)?.target ?? 1000000
            const current = p?.currentMetrics?.[m.currentKey] ?? (cfg.metrics[i] as any)?.current ?? 500000
            const progress = target > 0 ? (current / target) * 100 : 0
            const unit = (cfg.metrics[i] as any)?.unit || ''
            return (
              <div key={i} className="target-progress-item">
                <div className="target-progress-header">
                  <span className="target-label">{m.label}</span>
                  <span className="target-value">{fmt(current, unit)} / {fmt(target, unit)}</span>
                </div>
                <div className="target-progress-bar"><div className="target-progress-fill" style={{ width: `${Math.min(progress, 100)}%` }} /></div>
                <div className="target-progress-percent">{progress.toFixed(1)}%</div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

const InsightSummary = (cfg: AIInsightSummaryConfig) => {
  const handleViewDetails = () => {
    const section = document.getElementById('tmall-ops-ai-section')
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  }
  return (
    <div className="stage-section ai-insight-summary-section">
      {cfg.title && <h2 className="section-title">{cfg.title}</h2>}
      <Card padding="large" className="ai-insight-summary-card">
        {cfg.date && <div className="insight-date">{cfg.date}</div>}
        <div className="insight-list">{cfg.insights.map((i, idx) => (<div key={idx} className="insight-item">{i}</div>))}</div>
        {cfg.actionText && <div className="insight-action"><button className="insight-button" onClick={handleViewDetails}>{cfg.actionText}</button></div>}
      </Card>
    </div>
  )
}

const RankBars = (cfg: RankBarsConfig) => (
  <div className="stage-section">
    {cfg.title && <h2 className="section-title">{cfg.title}</h2>}
    <Card padding="large">
      <div className="rank-bars">
        {cfg.items.map((it, i) => {
          const max = Math.max(...cfg.items.map(x => x.value))
          const w = max > 0 ? (it.value / max) * 100 : 0
          return (
            <div key={i} className="rank-row">
              <div className="rank-label">{it.name}</div>
              <div className="rank-bar">
                <div className="rank-bar-fill" style={{ width: `${w}%` }} />
                <span className="rank-value">{fmt(it.value, it.unit)}</span>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  </div>
)

// AI 诊断（支持8个场景Tab）
const Diagnosis = (cfg: DiagnosisInsightsConfig) => {
  const scenes = (cfg as any).scenes || []
  const hasScenes = scenes.length > 0
  
  // 如果有 scenes 数据，使用 scenes；否则使用原来的逻辑
  const sceneItems = hasScenes 
    ? scenes.map((s: any) => ({ key: s.key, label: s.label }))
    : ['经营诊断', '渠道诊断', '计划诊断', '漏斗诊断', '人群诊断', '关键词诊断', '创意诊断', '承接诊断'].map(x => ({ key: x, label: x }))
  
  const [active, setActive] = useState(sceneItems[0]?.key || '经营诊断')
  
  const activeScene = hasScenes ? scenes.find((s: any) => s.key === active) : null
  const activeCards = activeScene ? activeScene.cards : []
  const activeTable = activeScene ? activeScene.table : null
  const activeInsights = activeScene ? activeScene.insights : []
  
  return (
    <div className="stage-section diagnosis-insights-section" id="tmall-ops-ai-section">
      {cfg.title && <h2 className="section-title">{cfg.title}</h2>}
      <Tabs items={sceneItems} activeKey={active} onChange={(k) => setActive(k)} />
      
      {/* AI 结论摘要框 */}
      {activeInsights && activeInsights.length > 0 && (
        <Card padding="medium" className="ai-insight-summary-card" style={{ marginTop: 16, marginBottom: 16 }}>
          <div className="insight-list">
            {activeInsights.map((i: string, idx: number) => (
              <div key={idx} className="insight-item">{i}</div>
            ))}
          </div>
        </Card>
      )}
      
      {/* 诊断卡片 */}
      <div className="diagnosis-insights-grid" style={{ marginTop: 12 }}>
        {activeCards.map((c: any, i: number) => (
          <Card key={i} padding="medium" className={`diagnosis-insight-card diagnosis-insight-card--${c.severity}`}>
            <div className="diagnosis-insight-content">
              <div className="diagnosis-insight-header">
                <div className={`diagnosis-severity-dot diagnosis-severity-dot--${c.severity}`} />
                <h3 className="diagnosis-insight-title">{c.title}</h3>
              </div>
              <ul className="diagnosis-insight-points">
                {c.points?.map((p: string, idx: number) => <li key={idx}>{p}</li>)}
              </ul>
              {c.metrics && c.metrics.length > 0 && (
                <div className="diagnosis-trigger-metrics">
                  {c.metrics.map((m: string, idx: number) => (
                    <span key={idx} className="diagnosis-metric-tag">{m}</span>
                  ))}
                </div>
              )}
              {c.suggestions && c.suggestions.length > 0 && (
                <div className="diagnosis-suggestions">
                  <div className="diagnosis-suggestions-title">建议行动：</div>
                  <ul>
                    {c.suggestions.map((s: string, idx: number) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
              <button 
                className="diagnosis-generate-task-btn"
                onClick={() => {
                  // 模拟生成任务（实际项目中可以调用API）
                  console.log('生成任务:', c.title)
                }}
              >
                生成任务
              </button>
            </div>
          </Card>
        ))}
      </div>
      
      {/* 底部表格 */}
      {activeTable && (
        <Card padding="large" style={{ marginTop: 16 }}>
          <div className="table-container">
            <table className="data-table tmall-traffic-table">
              <thead>
                <tr>
                  {activeTable.headers.map((h: string, i: number) => (
                    <th key={i}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activeTable.rows.map((row: any[], i: number) => (
                  <tr key={i}>
                    {row.map((cell: any, j: number) => (
                      <td key={j}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}

const Kanban = (cfg: KanbanBoardConfig) => {
  const [columns, setColumns] = useState(cfg.columns)
  
  const moveTask = (taskId: string, fromCol: string, toCol: string) => {
    setColumns(prev => {
      const newCols = [...prev]
      const from = newCols.find(c => c.id === fromCol)
      const to = newCols.find(c => c.id === toCol)
      if (from && to) {
        const task = from.cards.find(c => c.id === taskId)
        if (task) {
          from.cards = from.cards.filter(c => c.id !== taskId)
          to.cards.push(task)
        }
      }
      return newCols
    })
  }
  
  return (
    <div className="stage-section kanban-board-section">
      {cfg.title && <h2 className="section-title">{cfg.title}</h2>}
      <Card padding="large">
        <div className="kanban-board-container">
          {columns.map(col => (
            <div key={col.id} className="kanban-column">
              <div className="kanban-column-header">
                <h3 className="kanban-column-title">{col.title}</h3>
                <span className="kanban-column-count">{col.cards.length}</span>
              </div>
              <div className="kanban-cards">
                {col.cards.map(card => (
                  <Card key={card.id} padding="medium" className="kanban-card" hoverable>
                    <div className="kanban-card-title">{card.title}</div>
                    {(card as any).assignee && <div className="kanban-card-assignee">负责人: {(card as any).assignee}</div>}
                    {(card as any).deadline && <div className="kanban-card-deadline">截止: {(card as any).deadline}</div>}
                    {(card as any).relatedSPU && <div className="kanban-card-related">关联SPU: {(card as any).relatedSPU}</div>}
                    {(card as any).relatedPlan && <div className="kanban-card-related">关联计划: {(card as any).relatedPlan}</div>}
                    {(card as any).relatedMetric && <div className="kanban-card-related">关联指标: {(card as any).relatedMetric}</div>}
                    <div className="kanban-card-actions">
                      {col.id === 'todo' && (
                        <button onClick={() => moveTask(card.id, 'todo', 'doing')}>开始</button>
                      )}
                      {col.id === 'doing' && (
                        <>
                          <button onClick={() => moveTask(card.id, 'doing', 'todo')}>回退</button>
                          <button onClick={() => moveTask(card.id, 'doing', 'done')}>完成</button>
                        </>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

const Logs = (cfg: OperationLogsConfig) => (
  <div className="stage-section operation-logs-section">
    {cfg.title && <h2 className="section-title">{cfg.title}</h2>}
    <Card padding="large">
      <div className="operation-logs-list">
        {cfg.logs.map((l, i) => (
          <div key={i} className="operation-log-item">
            <span className="log-time">{l.time}</span>
            <span className="log-action">{l.action}</span>
            {(l as any).operator && <span className="log-operator">{(l as any).operator}</span>}
          </div>
        ))}
      </div>
    </Card>
  </div>
)

export default function TmallOpsStageRenderer({
  sections,
  products,
  metrics: metricsProp,
  roleId = 'tmall_ops',
  stage = 'overview',
  dateRangeA,
  dateRangeB
}: Props) {
  const metrics = useMemo(() => metricsProp ?? getMetricsByRole(roleId), [metricsProp, roleId])
  const moduleTypes = sections.map(s => (s as any).type)
  console.debug('[TmallOpsStageRenderer]', { roleId, stage, modulesCount: sections.length, moduleTypes })
  
  const render = (s: any, i: number) => {
    switch (s.type) {
      case 'kpi-cards': return <div key={i}>{KPI(s, products, metrics)}</div>
      case 'channel-contribution-table': return <div key={i}>{ChannelTable(s)}</div>
      case 'plan-efficiency-table': return <div key={i}>{PlanTable(s)}</div>
      case 'funnel-chart': return <div key={i}>{Funnel(s)}</div>
      case 'target-progress': return <div key={i}>{TargetProgress(s, products)}</div>
      case 'ai-insight-summary': return <div key={i}>{InsightSummary(s)}</div>
      case 'rank-bars': return <div key={i}>{RankBars(s)}</div>
      case 'diagnosis-insights': return <div key={i}>{Diagnosis(s)}</div>
      case 'kanban-board': return <div key={i}>{Kanban(s)}</div>
      case 'operation-logs': return <div key={i}>{Logs(s)}</div>
      default:
        return (
          <div key={i} className="stage-section">
            <Card padding="large">
              <div className="unknown-module">
                <p>未知模块类型: {(s as any).type || 'unknown'}</p>
              </div>
            </Card>
          </div>
        )
    }
  }
  
  return <div className="tmall-traffic-stage-renderer">{sections.map(render)}</div>
}

console.log('[TmallOps] pages ready')


