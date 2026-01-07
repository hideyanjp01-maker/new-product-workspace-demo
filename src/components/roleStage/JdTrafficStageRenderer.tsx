import { useMemo } from 'react'
import { Card, Button } from '../ui'
import { getMetricsByRole } from '../../data/mockData'
import type { Metric } from '../../data/mockData'
import type { Product } from '../../data/mockData'
import type {
  JdTrafficStageSectionConfig,
  KPICardConfig,
  ChannelOverviewTableConfig,
  KeywordCrowdTableConfig,
  FunnelChartConfig,
  TargetProgressConfig,
  AIWeeklyReportConfig,
  PlanManagerTableConfig,
  ChannelBudgetDistributionConfig,
  DiagnosisInsightsConfig,
  KanbanBoardConfig,
  OperationLogsConfig
} from '../../config/roleStage/jd_traffic'
import './JdTrafficStageRenderer.css'

interface JdTrafficStageRendererProps {
  sections: JdTrafficStageSectionConfig[]
  products: Product[]
  metrics?: Metric[]
  roleId?: string
  stage?: string
}

// 获取指标值
const getMetricValue = (
  metricKey: string,
  fallbackKey: string | undefined,
  products: Product[],
  metrics: Metric[],
  aggregate?: boolean
): number | string | null => {
  if (aggregate) {
    const total = products.reduce((sum, p) => {
      const value = p.currentMetrics?.[metricKey] ?? 0
      return sum + (typeof value === 'number' ? value : 0)
    }, 0)
    return total > 0 ? total : null
  }

  const metric = metrics.find(m => m.id === metricKey || m.name === metricKey)
  if (metric) return typeof metric.value === 'number' ? metric.value : null

  if (fallbackKey) {
    const fallbackMetric = metrics.find(m => m.id === fallbackKey || m.name === fallbackKey)
    if (fallbackMetric) return typeof fallbackMetric.value === 'number' ? fallbackMetric.value : null
  }

  return null
}

// 格式化数值
const formatValue = (value: number | string | null, unit?: string): string => {
  if (value === null || value === undefined) return '—'
  if (typeof value === 'number') {
    if (unit === '元') return `${value.toLocaleString('zh-CN')}元`
    if (unit === '单' || unit === '人') return `${value.toLocaleString('zh-CN')}${unit}`
    if (unit === '%') return `${value.toFixed(1)}%`
    return `${value.toLocaleString('zh-CN')}${unit ? unit : ''}`
  }
  return `${value}${unit ? unit : ''}`
}

// 渲染 KPI 卡片
const renderKPICards = (config: KPICardConfig, products: Product[], metrics: Metric[]) => (
  <div className="stage-section kpi-cards-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <div className="kpi-cards-grid jd-traffic">
      {config.cards.map((card, index) => {
        const value = getMetricValue(card.metricKey, card.fallbackMetricKey, products, metrics, card.aggregate)
        return (
          <Card key={index} padding="large" hoverable>
            <div className="kpi-card">
              <div className="kpi-card-header">
                <div className="kpi-card-label">{card.label}</div>
                {card.trend && (
                  <span className={`kpi-trend kpi-trend--${card.trend}`}>
                    {card.trend === 'up' ? '↑' : card.trend === 'down' ? '↓' : '→'}
                  </span>
                )}
              </div>
              <div className="kpi-card-value">{formatValue(value, card.unit)}</div>
              {card.compareValue && (
                <div className="kpi-card-compare">{card.compareValue}</div>
              )}
              <div className="kpi-card-sparkline">
                <div className="sparkline-placeholder">📈</div>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  </div>
)

// 渲染渠道概览表格
const renderChannelOverviewTable = (config: ChannelOverviewTableConfig) => (
  <div className="stage-section channel-overview-table-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <Card padding="large">
      <div className="table-container">
        <table className="data-table jd-traffic-table">
          <thead>
            <tr>
              <th>渠道</th>
              <th>点击</th>
              <th>消耗</th>
              <th>CTR</th>
              <th>CPC</th>
              <th>CPM</th>
              <th>GMV</th>
              <th>CVR</th>
              <th>ROI</th>
            </tr>
          </thead>
          <tbody>
            {config.channels.map((channel, idx) => (
              <tr key={idx}>
                <td>{channel.channel}</td>
                <td>{channel.clicks ? formatValue(channel.clicks) : '—'}</td>
                <td>{channel.cost ? formatValue(channel.cost, '元') : '—'}</td>
                <td>{channel.ctr ? `${channel.ctr.toFixed(1)}%` : '—'}</td>
                <td>{channel.cpc ? formatValue(channel.cpc, '元') : '—'}</td>
                <td>{channel.cpm ? formatValue(channel.cpm, '元') : '—'}</td>
                <td>{channel.gmv ? formatValue(channel.gmv, '元') : '—'}</td>
                <td>{channel.cvr ? `${channel.cvr.toFixed(1)}%` : '—'}</td>
                <td>{channel.roi ? channel.roi.toFixed(2) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
)

// 渲染关键词/人群投放表
const renderKeywordCrowdTable = (config: KeywordCrowdTableConfig) => (
  <div className="stage-section keyword-crowd-table-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <Card padding="large">
      <div className="table-container">
        <table className="data-table jd-traffic-table">
          <thead>
            <tr>
              <th>排名</th>
              <th>关键词/人群包</th>
              <th>点击</th>
              <th>消耗</th>
              <th>CTR</th>
              <th>CPC</th>
              <th>GMV</th>
              <th>CVR</th>
              <th>ROI</th>
              <th>建议</th>
            </tr>
          </thead>
          <tbody>
            {config.items.map((item, idx) => (
              <tr key={idx}>
                <td>{item.rank}</td>
                <td>{item.keyword}</td>
                <td>{item.clicks ? formatValue(item.clicks) : '—'}</td>
                <td>{item.cost ? formatValue(item.cost, '元') : '—'}</td>
                <td>{item.ctr ? `${item.ctr.toFixed(1)}%` : '—'}</td>
                <td>{item.cpc ? formatValue(item.cpc, '元') : '—'}</td>
                <td>{item.gmv ? formatValue(item.gmv, '元') : '—'}</td>
                <td>{item.cvr ? `${item.cvr.toFixed(1)}%` : '—'}</td>
                <td>{item.roi ? item.roi.toFixed(2) : '—'}</td>
                <td>{item.suggestion || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
)

// 渲染漏斗图
const renderFunnelChart = (config: FunnelChartConfig) => (
  <div className="stage-section funnel-chart-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <Card padding="large">
      <div className="funnel-chart-container">
        {config.steps.map((step, idx) => {
          const maxValue = Math.max(...config.steps.map(s => s.value))
          const width = maxValue > 0 ? (step.value / maxValue) * 100 : 0
          return (
            <div key={idx} className="funnel-step-item">
              <div className="funnel-step-label">{step.label}</div>
              <div className="funnel-step-visual" style={{ width: `${width}%` }}>
                <span className="funnel-step-value">{formatValue(step.value)}</span>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  </div>
)

// 渲染目标进度
const renderTargetProgress = (config: TargetProgressConfig, products: Product[]) => {
  const product = products[0]
  if (!product) {
    return (
      <div className="stage-section target-progress-section">
        {config.title && <h2 className="section-title">{config.title}</h2>}
        <Card padding="large">
          <div className="empty-state">暂无产品数据</div>
        </Card>
      </div>
    )
  }

  return (
    <div className="stage-section target-progress-section">
      {config.title && <h2 className="section-title">{config.title}</h2>}
      <Card padding="large">
        <div className="target-progress-list">
          {config.metrics.map((m, idx) => {
            const target = product.targetMetrics?.[m.targetKey] ?? 0
            const current = product.currentMetrics?.[m.currentKey] ?? 0
            const progress = target > 0 ? (current / target) * 100 : 0
            return (
              <div key={idx} className="target-progress-item">
                <div className="target-progress-header">
                  <span className="target-label">{m.label}</span>
                  <span className="target-value">{formatValue(current)} / {formatValue(target)}</span>
                </div>
                <div className="target-progress-bar">
                  <div
                    className="target-progress-fill"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <div className="target-progress-percent">{progress.toFixed(1)}%</div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

// 渲染 AI 周报卡
const renderAIWeeklyReport = (config: AIWeeklyReportConfig, showTitle = true) => (
  <div className="stage-section ai-weekly-report-section">
    {showTitle && config.title && <h2 className="section-title">{config.title}</h2>}
    <Card padding="large" className="ai-weekly-report-card">
      {config.date && (
        <div className="report-date">{config.date}</div>
      )}
      <div className="report-insights-list">
        {config.insights.map((insight, idx) => (
          <div key={idx} className="report-insight-item">{insight}</div>
        ))}
      </div>
      {config.actionText && (
        <div className="report-action">
          <button
            className="report-button"
            onClick={() => {
              console.log('[JdTraffic] 查看详情 clicked')
              // 可以添加 toast 提示
            }}
          >
            {config.actionText}
          </button>
        </div>
      )}
    </Card>
  </div>
)

// 渲染计划投放管理器表格
const renderPlanManagerTable = (config: PlanManagerTableConfig) => (
  <div className="stage-section plan-manager-table-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <Card padding="large">
      <div className="table-filters">
        <select className="filter-select">
          <option>全部渠道</option>
          <option>京准通-搜索</option>
          <option>京准通-推荐</option>
          <option>京东快车</option>
          <option>京东展位</option>
        </select>
      </div>
      <div className="table-container">
        <table className="data-table jd-traffic-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>渠道</th>
              <th>目标</th>
              <th>点击</th>
              <th>消耗</th>
              <th>CPC</th>
              <th>GMV</th>
              <th>ROI</th>
            </tr>
          </thead>
          <tbody>
            {config.plans.map((plan, idx) => (
              <tr key={idx}>
                <td>{plan.id}</td>
                <td>{plan.channel}</td>
                <td>{plan.target || '—'}</td>
                <td>{plan.clicks ? formatValue(plan.clicks) : '—'}</td>
                <td>{plan.cost ? formatValue(plan.cost, '元') : '—'}</td>
                <td>{plan.cpc ? formatValue(plan.cpc, '元') : '—'}</td>
                <td>{plan.gmv ? formatValue(plan.gmv, '元') : '—'}</td>
                <td>{plan.roi ? plan.roi.toFixed(2) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
)

// 渲染渠道预算分布
const renderChannelBudgetDistribution = (config: ChannelBudgetDistributionConfig) => (
  <div className="stage-section channel-budget-distribution-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <Card padding="large">
      <div className="channel-budget-list">
        {config.channels.map((channel, idx) => {
          const progress = channel.totalBudget > 0 ? (channel.budget / channel.totalBudget) * 100 : 0
          return (
            <div key={idx} className="channel-budget-item">
              <div className="channel-budget-header">
                <span className="channel-name">{channel.channel}</span>
                <span className="channel-budget-value">{formatValue(channel.budget, '元')} / {formatValue(channel.totalBudget, '元')}</span>
              </div>
              <div className="channel-budget-bar">
                <div
                  className="channel-budget-fill"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              {channel.note && (
                <div className="channel-budget-note">{channel.note}</div>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  </div>
)

// 渲染诊断洞察
const renderDiagnosisInsights = (config: DiagnosisInsightsConfig) => (
  <div className="stage-section diagnosis-insights-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <div className="diagnosis-insights-grid">
      {config.cards.map((card, idx) => (
        <Card key={idx} padding="medium" className={`diagnosis-insight-card diagnosis-insight-card--${card.severity}`}>
          <div className="diagnosis-insight-content">
            <div className="diagnosis-insight-header">
              <div className={`diagnosis-severity-dot diagnosis-severity-dot--${card.severity}`} />
              <h3 className="diagnosis-insight-title">{card.title}</h3>
            </div>
            <ul className="diagnosis-insight-points">
              {card.points.map((point, pIdx) => (
                <li key={pIdx}>{point}</li>
              ))}
            </ul>
            <div className="diagnosis-insight-tag">
              {card.severity === 'high' ? '严重' : card.severity === 'medium' ? '关注' : card.severity === 'low' ? '正常' : '正常'}
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>
)

// 渲染任务看板
const renderKanbanBoard = (config: KanbanBoardConfig) => (
  <div className="stage-section kanban-board-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <Card padding="large">
      <div className="kanban-board-container">
        {config.columns.map((column) => (
          <div key={column.id} className="kanban-column">
            <div className="kanban-column-header">
              <h3 className="kanban-column-title">{column.title}</h3>
              <span className="kanban-column-count">{column.cards.length}</span>
            </div>
            <div className="kanban-cards">
              {column.cards.map((card) => (
                <Card
                  key={card.id}
                  padding="medium"
                  className="kanban-card"
                  onClick={() => {
                    console.log('[JdTraffic] Task clicked:', card.id)
                  }}
                >
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

// 渲染操作记录
const renderOperationLogs = (config: OperationLogsConfig) => (
  <div className="stage-section operation-logs-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <Card padding="large">
      <div className="operation-logs-list">
        {config.logs.map((log, idx) => (
          <div key={idx} className="operation-log-item">
            <span className="log-time">{log.time}</span>
            <span className="log-action">{log.action}</span>
          </div>
        ))}
      </div>
    </Card>
  </div>
)

// 渲染目标进度 + AI周报（并排布局）
const renderTargetProgressWithReport = (
  targetConfig: TargetProgressConfig,
  reportConfig: AIWeeklyReportConfig,
  products: Product[]
) => {
  const product = products[0]
  if (!product) {
    return (
      <div className="stage-section target-progress-with-report-section">
        <div className="empty-state">暂无产品数据</div>
      </div>
    )
  }

  return (
    <div className="stage-section target-progress-with-report-section">
      <div className="target-progress-with-report-container">
        <div className="target-progress-card">
          {targetConfig.title && <h2 className="section-title">{targetConfig.title}</h2>}
          <Card padding="large">
            <div className="target-progress-list">
              {targetConfig.metrics.map((m, idx) => {
                const target = product.targetMetrics?.[m.targetKey] ?? 0
                const current = product.currentMetrics?.[m.currentKey] ?? 0
                const progress = target > 0 ? (current / target) * 100 : 0
                return (
                  <div key={idx} className="target-progress-item">
                    <div className="target-progress-header">
                      <span className="target-label">{m.label}</span>
                      <span className="target-value">{formatValue(current)} / {formatValue(target)}</span>
                    </div>
                    <div className="target-progress-bar">
                      <div
                        className="target-progress-fill"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                    <div className="target-progress-percent">{progress.toFixed(1)}%</div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
        <div className="ai-weekly-report-card-wrapper">
          {renderAIWeeklyReport(reportConfig, false)}
        </div>
      </div>
    </div>
  )
}

export default function JdTrafficStageRenderer({
  sections,
  products,
  metrics: metricsProp,
  roleId = 'jd_traffic',
  stage = 'unknown'
}: JdTrafficStageRendererProps) {
  const metrics = useMemo(() => {
    if (metricsProp) return metricsProp
    return getMetricsByRole(roleId)
  }, [metricsProp, roleId])

  // 调试日志
  const moduleTypes = sections.map(s => s.type)
  console.debug('[JdTrafficStageRenderer]', { roleId, stage, modulesCount: sections.length, moduleTypes })

  // 模块注册表（支持特殊布局：target-progress + ai-weekly-report 并排）
  const processedIndices = new Set<number>()
  
  const renderModule = (section: JdTrafficStageSectionConfig, index: number) => {
    // 如果已被处理，跳过
    if (processedIndices.has(index)) {
      return null
    }

    // 检查是否需要特殊布局（target-progress 和 ai-weekly-report 相邻）
    if (section.type === 'target-progress' && index + 1 < sections.length) {
      const nextSection = sections[index + 1]
      if (nextSection.type === 'ai-weekly-report') {
        processedIndices.add(index)
        processedIndices.add(index + 1)
        // 合并渲染为并排布局
        return (
          <div key={`combined-${index}`}>
            {renderTargetProgressWithReport(section, nextSection, products)}
          </div>
        )
      }
    }

    switch (section.type) {
      case 'kpi-cards':
        return <div key={index}>{renderKPICards(section, products, metrics)}</div>
      case 'channel-overview-table':
        return <div key={index}>{renderChannelOverviewTable(section)}</div>
      case 'keyword-crowd-table':
        return <div key={index}>{renderKeywordCrowdTable(section)}</div>
      case 'funnel-chart':
        return <div key={index}>{renderFunnelChart(section)}</div>
      case 'target-progress':
        return <div key={index}>{renderTargetProgress(section, products)}</div>
      case 'ai-weekly-report':
        return <div key={index}>{renderAIWeeklyReport(section)}</div>
      case 'plan-manager-table':
        return <div key={index}>{renderPlanManagerTable(section)}</div>
      case 'channel-budget-distribution':
        return <div key={index}>{renderChannelBudgetDistribution(section)}</div>
      case 'diagnosis-insights':
        return <div key={index}>{renderDiagnosisInsights(section)}</div>
      case 'kanban-board':
        return <div key={index}>{renderKanbanBoard(section)}</div>
      case 'operation-logs':
        return <div key={index}>{renderOperationLogs(section)}</div>
      default:
        return (
          <div key={index} className="stage-section">
            <Card padding="large">
              <div className="unknown-module">
                <p>未知模块类型: {(section as any).type || 'unknown'}</p>
              </div>
            </Card>
          </div>
        )
    }
  }

  // 空状态处理
  if (sections.length === 0) {
    return (
      <div className="jd-traffic-stage-renderer">
        <Card padding="large">
          <div className="empty-state">
            <p>暂无模块配置</p>
            <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
              roleId: {roleId}, stage: {stage}
            </p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="jd-traffic-stage-renderer">
      {sections.map((section, index) => renderModule(section, index)).filter(Boolean)}
    </div>
  )
}

// 页面就绪日志
console.log('[JdTraffic] pages ready')



