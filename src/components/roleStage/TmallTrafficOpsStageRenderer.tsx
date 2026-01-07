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
        const isMissing = !c.metricKey
        return (
          <Card key={i} padding="large" hoverable>
            <div className="kpi-card" title={isMissing ? 'TODO: missing_metric_in_pool' : undefined}>
              <div className="kpi-card-header">
                <div className="kpi-card-label">{c.label}</div>
                {c.trend && <span className={`kpi-trend kpi-trend--${c.trend}`}>{c.trend === 'up' ? '↑' : c.trend === 'down' ? '↓' : '→'}</span>}
              </div>
              <div className="kpi-card-value">{fmt(value, c.unit)}</div>
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
          <thead><tr><th>计划ID</th><th>计划名</th><th>消耗</th><th>GMV</th><th>ROI</th><th>CTR</th><th>CPC</th><th>CVR</th></tr></thead>
          <tbody>
            {cfg.plans.map((p, i) => (
              <tr key={i}>
                <td>{p.planId}</td><td>{p.planName || '—'}</td>
                <td>{p.cost !== undefined ? `${p.cost.toLocaleString('zh-CN')}元` : '—'}</td>
                <td>{p.gmv !== undefined ? `${p.gmv.toLocaleString('zh-CN')}元` : '—'}</td>
                <td>{p.roi !== undefined ? p.roi.toFixed(2) : '—'}</td>
                <td>{p.ctr !== undefined ? `${p.ctr.toFixed(1)}%` : '—'}</td>
                <td>{p.cpc !== undefined ? `${p.cpc.toFixed(2)}元` : '—'}</td>
                <td>{p.cvr !== undefined ? `${p.cvr.toFixed(1)}%` : '—'}</td>
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
          return (
            <div key={i} className="funnel-step-item">
              <div className="funnel-step-label">{s.label}</div>
              <div className="funnel-step-visual" style={{ width: `${w}%` }}>
                <span className="funnel-step-value">{fmt(s.value)}</span>
              </div>
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
            const target = p?.targetMetrics?.[m.targetKey] ?? 0
            const current = p?.currentMetrics?.[m.currentKey] ?? 0
            const progress = target > 0 ? (current / target) * 100 : 0
            return (
              <div key={i} className="target-progress-item">
                <div className="target-progress-header">
                  <span className="target-label">{m.label}</span>
                  <span className="target-value">{fmt(current)} / {fmt(target)}</span>
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

const InsightSummary = (cfg: AIInsightSummaryConfig) => (
  <div className="stage-section ai-insight-summary-section">
    {cfg.title && <h2 className="section-title">{cfg.title}</h2>}
    <Card padding="large" className="ai-insight-summary-card">
      {cfg.date && <div className="insight-date">{cfg.date}</div>}
      <div className="insight-list">{cfg.insights.map((i, idx) => (<div key={idx} className="insight-item">{i}</div>))}</div>
      {cfg.actionText && <div className="insight-action"><button className="insight-button">{cfg.actionText}</button></div>}
    </Card>
  </div>
)

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

const Diagnosis = (cfg: DiagnosisInsightsConfig) => {
  const [active, setActive] = useState('经营')
  const items = ['经营', '渠道/资源位', '关键词', '人群'].map(x => ({ key: x, label: x }))
  // 由于 cfg 没有 scenes 字段，采用 cards 合集 + tabs 仅作视觉切换（真实项目可扩展 cfg.scenes）
  const perScene = (scene: string) => {
    const seg = Math.floor(cfg.cards.length / items.length) || 1
    const start = items.findIndex(i => i.key === scene) * seg
    return cfg.cards.slice(start, start + seg)
  }
  const cards = perScene(active)
  return (
    <div className="stage-section diagnosis-insights-section" id="tmall-ops-ai-section">
      {cfg.title && <h2 className="section-title">{cfg.title}</h2>}
      <Tabs items={items} activeKey={active} onChange={(k) => setActive(k)} />
      <div className="diagnosis-insights-grid" style={{ marginTop: 12 }}>
        {cards.map((c, i) => (
          <Card key={i} padding="medium" className={`diagnosis-insight-card diagnosis-insight-card--${c.severity}`}>
            <div className="diagnosis-insight-content">
              <div className="diagnosis-insight-header">
                <div className={`diagnosis-severity-dot diagnosis-severity-dot--${c.severity}`} />
                <h3 className="diagnosis-insight-title">{c.title}</h3>
              </div>
              <ul className="diagnosis-insight-points">{(c as any).points?.map((p: string, idx: number) => <li key={idx}>{p}</li>)}</ul>
              {(c as any).metrics && (c as any).metrics.length > 0 && (
                <div className="diagnosis-trigger-metrics">{(c as any).metrics.map((m: string, idx: number) => <span key={idx} className="diagnosis-metric-tag">{m}</span>)}</div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

const Kanban = (cfg: KanbanBoardConfig) => (
  <div className="stage-section kanban-board-section">
    {cfg.title && <h2 className="section-title">{cfg.title}</h2>}
    <Card padding="large">
      <div className="kanban-board-container">
        {cfg.columns.map(col => (
          <div key={col.id} className="kanban-column">
            <div className="kanban-column-header"><h3 className="kanban-column-title">{col.title}</h3><span className="kanban-column-count">{col.cards.length}</span></div>
            <div className="kanban-cards">
              {col.cards.map(card => (
                <Card key={card.id} padding="medium" className="kanban-card">
                  <div className="kanban-card-title">{card.title}</div>
                  {card.assignee && <div className="kanban-card-assignee">负责人: {card.assignee}</div>}
                  {card.deadline && <div className="kanban-card-deadline">截止: {card.deadline}</div>}
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  </div>
)

const Logs = (cfg: OperationLogsConfig) => (
  <div className="stage-section operation-logs-section">
    {cfg.title && <h2 className="section-title">{cfg.title}</h2>}
    <Card padding="large">
      <div className="operation-logs-list">
        {cfg.logs.map((l, i) => (<div key={i} className="operation-log-item"><span className="log-time">{l.time}</span><span className="log-action">{l.action}</span></div>))}
      </div>
    </Card>
  </div>
)

export default function TmallTrafficOpsStageRenderer({
  sections,
  products,
  metrics: metricsProp,
  roleId = 'tmall_traffic',
  stage = 'overview'
}: Props) {
  const metrics = useMemo(() => metricsProp ?? getMetricsByRole(roleId), [metricsProp, roleId])
  const moduleTypes = sections.map(s => (s as any).type)
  console.debug('[TmallTrafficOpsStageRenderer]', { roleId, stage, modulesCount: sections.length, moduleTypes })
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
            <Card padding="large"><div className="unknown-module"><p>未知模块类型: {(s as any).type || 'unknown'}</p></div></Card>
          </div>
        )
    }
  }
  return <div className="tmall-traffic-stage-renderer">{sections.map(render)}</div>
}

console.log('[TmallTrafficOps] pages ready')


