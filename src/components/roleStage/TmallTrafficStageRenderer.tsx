import { useMemo, useState } from 'react'
import { Card, Button, Tabs } from '../ui'
import { getMetricsByRole } from '../../data/mockData'
import type { Metric } from '../../data/mockData'
import type { Product } from '../../data/mockData'
import type {
  TmallTrafficStageSectionConfig,
  KPICardConfig,
  ChannelContributionTableConfig,
  PlanEfficiencyTableConfig,
  FunnelChartConfig,
  TargetProgressConfig,
  AIInsightSummaryConfig,
  ResourceEfficiencyTablesConfig,
  ChannelOverviewTableConfig,
  KeywordCrowdTableConfig,
  DiagnosisInsightsConfig,
  KanbanBoardConfig,
  OperationLogsConfig
} from '../../config/roleStage/tmall_traffic'
import './TmallTrafficStageRenderer.css'

interface TmallTrafficStageRendererProps {
  sections: TmallTrafficStageSectionConfig[]
  products: Product[]
  metrics?: Metric[]
  roleId?: string
  stage?: string
  dateRangeA?: string
  dateRangeB?: string
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
    if (unit === '元' && value < 1) return `${value.toFixed(2)}元` // CPC保留2位
    return `${value.toLocaleString('zh-CN')}${unit ? unit : ''}`
  }
  return `${value}${unit ? unit : ''}`
}

// 渲染 KPI 卡片
const renderKPICards = (config: KPICardConfig, products: Product[], metrics: Metric[]) => (
  <div className="stage-section kpi-cards-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <div className="kpi-cards-grid tmall-traffic">
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

// 渲染渠道贡献表
const renderChannelContributionTable = (config: ChannelContributionTableConfig) => (
  <div className="stage-section channel-contribution-table-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <Card padding="large">
      <div className="table-container">
        <table className="data-table tmall-traffic-table">
          <thead>
            <tr>
              <th>渠道</th>
              <th>展现</th>
              <th>点击</th>
              <th>CTR</th>
              <th>CPC</th>
              <th>GMV</th>
              <th>ROI</th>
            </tr>
          </thead>
          <tbody>
            {config.channels.map((channel, idx) => (
              <tr key={idx}>
                <td>{channel.channel}</td>
                <td>{channel.exposure ? formatValue(channel.exposure) : '—'}</td>
                <td>{channel.clicks ? formatValue(channel.clicks) : '—'}</td>
                <td>{channel.ctr ? `${channel.ctr.toFixed(1)}%` : '—'}</td>
                <td>{channel.cpc ? formatValue(channel.cpc, '元') : '—'}</td>
                <td>{channel.gmv ? formatValue(channel.gmv, '元') : '—'}</td>
                <td>{channel.roi ? channel.roi.toFixed(2) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
)

// 渲染计划/单元效率表
const renderPlanEfficiencyTable = (config: PlanEfficiencyTableConfig) => (
  <div className="stage-section plan-efficiency-table-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <Card padding="large">
      <div className="table-filters">
        <select className="filter-select">
          <option>全部类型</option>
          <option>搜索</option>
          <option>推荐</option>
          <option>内容</option>
          <option>重定向</option>
        </select>
      </div>
      <div className="table-container">
        <table className="data-table tmall-traffic-table">
          <thead>
            <tr>
              <th>计划ID</th>
              <th>计划名</th>
              <th>类型</th>
              <th>花费</th>
              <th>GMV</th>
              <th>ROI</th>
              <th>CTR</th>
              <th>CPC</th>
              <th>CVR</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            {config.plans.map((plan, idx) => (
              <tr key={idx}>
                <td>{plan.planId}</td>
                <td>{plan.planName || '—'}</td>
                <td>{plan.type || '—'}</td>
                <td>{plan.cost ? formatValue(plan.cost, '元') : '—'}</td>
                <td>{plan.gmv ? formatValue(plan.gmv, '元') : '—'}</td>
                <td>{plan.roi ? plan.roi.toFixed(2) : '—'}</td>
                <td>{plan.ctr ? `${plan.ctr.toFixed(1)}%` : '—'}</td>
                <td>{plan.cpc ? formatValue(plan.cpc, '元') : '—'}</td>
                <td>{plan.cvr ? `${plan.cvr.toFixed(1)}%` : '—'}</td>
                <td>{plan.status || '—'}</td>
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

// 渲染 AI 洞察摘要卡
const renderAIInsightSummary = (config: AIInsightSummaryConfig, showTitle = true) => (
  <div className="stage-section ai-insight-summary-section">
    {showTitle && config.title && <h2 className="section-title">{config.title}</h2>}
    <Card padding="large" className="ai-insight-summary-card">
      {config.date && (
        <div className="insight-date">{config.date}</div>
      )}
      <div className="insight-list">
        {config.insights.map((insight, idx) => (
          <div key={idx} className="insight-item">{insight}</div>
        ))}
      </div>
      {config.actionText && (
        <div className="insight-action">
          <button
            className="insight-button"
            onClick={() => {
              console.log('[TmallTraffic] 查看AI洞察 clicked')
              // 可以切换到底部"AI洞察"tab
            }}
          >
            {config.actionText}
          </button>
        </div>
      )}
    </Card>
  </div>
)

// 渲染素材/资源位效率表（双表）
const renderResourceEfficiencyTables = (config: ResourceEfficiencyTablesConfig) => (
  <div className="stage-section resource-efficiency-tables-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <div className="resource-tables-grid">
      {config.tables.map((table, idx) => (
        <Card key={idx} padding="large">
          <h3 className="table-title">{table.title}</h3>
          <div className="table-container">
            <table className="data-table tmall-traffic-table">
              <thead>
                <tr>
                  <th>资源位/素材</th>
                  <th>展现</th>
                  <th>点击</th>
                  <th>CTR</th>
                  <th>花费</th>
                  <th>GMV</th>
                  <th>ROI</th>
                  <th>CVR</th>
                </tr>
              </thead>
              <tbody>
                {table.resources.map((resource, rIdx) => (
                  <tr key={rIdx}>
                    <td>{resource.name}</td>
                    <td>{resource.exposure ? formatValue(resource.exposure) : '—'}</td>
                    <td>{resource.clicks ? formatValue(resource.clicks) : '—'}</td>
                    <td>{resource.ctr ? `${resource.ctr.toFixed(1)}%` : '—'}</td>
                    <td>{resource.cost ? formatValue(resource.cost, '元') : '—'}</td>
                    <td>{resource.gmv ? formatValue(resource.gmv, '元') : '—'}</td>
                    <td>{resource.roi ? resource.roi.toFixed(2) : '—'}</td>
                    <td>{resource.cvr ? `${resource.cvr.toFixed(1)}%` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ))}
    </div>
  </div>
)

// 渲染渠道总览表
const renderChannelOverviewTable = (config: ChannelOverviewTableConfig) => (
  <div className="stage-section channel-overview-table-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <Card padding="large">
      <div className="table-container">
        <table className="data-table tmall-traffic-table">
          <thead>
            <tr>
              <th>渠道</th>
              <th>曝光</th>
              <th>点击</th>
              <th>GMV</th>
              <th>ROI</th>
              <th>CTR</th>
              <th>CPC</th>
              <th>CVR</th>
            </tr>
          </thead>
          <tbody>
            {config.channels.map((channel, idx) => (
              <tr key={idx}>
                <td>{channel.channel}</td>
                <td>{channel.exposure ? formatValue(channel.exposure) : '—'}</td>
                <td>{channel.clicks ? formatValue(channel.clicks) : '—'}</td>
                <td>{channel.gmv ? formatValue(channel.gmv, '元') : '—'}</td>
                <td>{channel.roi ? channel.roi.toFixed(2) : '—'}</td>
                <td>{channel.ctr ? `${channel.ctr.toFixed(1)}%` : '—'}</td>
                <td>{channel.cpc ? formatValue(channel.cpc, '元') : '—'}</td>
                <td>{channel.cvr ? `${channel.cvr.toFixed(1)}%` : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
)

// 渲染关键词/人群包效率表
const renderKeywordCrowdTable = (config: KeywordCrowdTableConfig) => (
  <div className="stage-section keyword-crowd-table-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <Card padding="large">
      <div className="table-filters">
        <select className="filter-select">
          <option>全部类型</option>
          <option>关键词</option>
          <option>人群包</option>
          <option>定向</option>
        </select>
      </div>
      <div className="table-container">
        <table className="data-table tmall-traffic-table">
          <thead>
            <tr>
              <th>关键词/人群包</th>
              <th>类型</th>
              <th>CTR</th>
              <th>CPC</th>
              <th>GMV</th>
              <th>ROI</th>
              <th>CVR</th>
            </tr>
          </thead>
          <tbody>
            {config.items.map((item, idx) => (
              <tr key={idx}>
                <td>{item.keyword}</td>
                <td>{item.type || '—'}</td>
                <td>{item.ctr ? `${item.ctr.toFixed(1)}%` : '—'}</td>
                <td>{item.cpc ? formatValue(item.cpc, '元') : '—'}</td>
                <td>{item.gmv ? formatValue(item.gmv, '元') : '—'}</td>
                <td>{item.roi ? item.roi.toFixed(2) : '—'}</td>
                <td>{item.cvr ? `${item.cvr.toFixed(1)}%` : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
)

// 渲染诊断洞察（支持场景Tab切换）
const renderDiagnosisInsights = (
  config: DiagnosisInsightsConfig,
  stage: string,
  dateRangeA?: string,
  dateRangeB?: string
) => {
  const [activeScene, setActiveScene] = useState<'operation' | 'product' | 'traffic'>('operation')
  
  // 场景Tab配置
  const sceneTabs = [
    { key: 'operation', label: '经营' },
    { key: 'product', label: '商品' },
    { key: 'traffic', label: '流量/投放' }
  ]
  
  // 根据场景过滤卡片（如果配置中有场景信息）
  const sceneCards = config.cards.filter(card => {
    if (config.scenes && config.scenes[activeScene]) {
      return config.scenes[activeScene].includes(card.id || '')
    }
    // 如果没有场景配置，显示所有卡片
    return true
  })
  
  return (
    <div className="stage-section diagnosis-insights-section">
      {config.title && <h2 className="section-title">{config.title}</h2>}
      {config.scenes && (
        <div className="diagnosis-scene-tabs">
          <Tabs
            items={sceneTabs}
            activeKey={activeScene}
            onChange={(key) => setActiveScene(key as 'operation' | 'product' | 'traffic')}
          />
        </div>
      )}
      <div className="diagnosis-insights-grid">
        {sceneCards.map((card, idx) => (
          <Card
            key={card.id || idx}
            padding="medium"
            className={`diagnosis-insight-card diagnosis-insight-card--${card.severity}`}
            onClick={() => {
              console.log('[TmallTraffic] Diagnosis card clicked:', card.id || idx)
              // 可以打开详情弹窗
            }}
          >
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
              {card.triggerMetrics && card.triggerMetrics.length > 0 && (
                <div className="diagnosis-trigger-metrics">
                  {card.triggerMetrics.map((metric, mIdx) => (
                    <span key={mIdx} className="diagnosis-metric-tag">{metric}</span>
                  ))}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

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
                    console.log('[TmallTraffic] Task clicked:', card.id)
                  }}
                >
                  <div className="kanban-card-title">{card.title}</div>
                  {card.description && <div className="kanban-card-description">{card.description}</div>}
                  {card.assignee && <div className="kanban-card-assignee">负责人: {card.assignee}</div>}
                  {card.deadline && <div className="kanban-card-deadline">截止: {card.deadline}</div>}
                  {card.createdAt && <div className="kanban-card-created">创建: {card.createdAt}</div>}
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

// 渲染目标进度 + AI洞察摘要（并排布局）
const renderTargetProgressWithSummary = (
  targetConfig: TargetProgressConfig,
  summaryConfig: AIInsightSummaryConfig,
  products: Product[]
) => {
  const product = products[0]
  if (!product) {
    return (
      <div className="stage-section target-progress-with-summary-section">
        <div className="empty-state">暂无产品数据</div>
      </div>
    )
  }

  return (
    <div className="stage-section target-progress-with-summary-section">
      <div className="target-progress-with-summary-container">
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
        <div className="ai-insight-summary-card-wrapper">
          {renderAIInsightSummary(summaryConfig, false)}
        </div>
      </div>
    </div>
  )
}

export default function TmallTrafficStageRenderer({
  sections,
  products,
  metrics: metricsProp,
  roleId = 'tmall_traffic',
  stage = 'unknown',
  dateRangeA,
  dateRangeB
}: TmallTrafficStageRendererProps) {
  const metrics = useMemo(() => {
    if (metricsProp) return metricsProp
    return getMetricsByRole(roleId)
  }, [metricsProp, roleId])

  // 调试日志
  const moduleTypes = sections.map(s => s.type)
  console.debug('[TmallTrafficStageRenderer]', { roleId, stage, modulesCount: sections.length, moduleTypes })

  // 模块注册表（支持特殊布局：target-progress + ai-insight-summary 并排）
  const processedIndices = new Set<number>()
  
  const renderModule = (section: TmallTrafficStageSectionConfig, index: number) => {
    // 如果已被处理，跳过
    if (processedIndices.has(index)) {
      return null
    }

    // 检查是否需要特殊布局（target-progress 和 ai-insight-summary 相邻）
    if (section.type === 'target-progress' && index + 1 < sections.length) {
      const nextSection = sections[index + 1]
      if (nextSection.type === 'ai-insight-summary') {
        processedIndices.add(index)
        processedIndices.add(index + 1)
        // 合并渲染为并排布局
        return (
          <div key={`combined-${index}`}>
            {renderTargetProgressWithSummary(section, nextSection, products)}
          </div>
        )
      }
    }

    switch (section.type) {
      case 'kpi-cards':
        return <div key={index}>{renderKPICards(section, products, metrics)}</div>
      case 'channel-contribution-table':
        return <div key={index}>{renderChannelContributionTable(section)}</div>
      case 'plan-efficiency-table':
        return <div key={index}>{renderPlanEfficiencyTable(section)}</div>
      case 'funnel-chart':
        return <div key={index}>{renderFunnelChart(section)}</div>
      case 'target-progress':
        return <div key={index}>{renderTargetProgress(section, products)}</div>
      case 'ai-insight-summary':
        return <div key={index}>{renderAIInsightSummary(section)}</div>
      case 'resource-efficiency-tables':
        return <div key={index}>{renderResourceEfficiencyTables(section)}</div>
      case 'channel-overview-table':
        return <div key={index}>{renderChannelOverviewTable(section)}</div>
      case 'keyword-crowd-table':
        return <div key={index}>{renderKeywordCrowdTable(section)}</div>
      case 'diagnosis-insights':
        return <div key={index}>{renderDiagnosisInsights(section, stage, dateRangeA, dateRangeB)}</div>
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
      <div className="tmall-traffic-stage-renderer">
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
    <div className="tmall-traffic-stage-renderer">
      {sections.map((section, index) => renderModule(section, index)).filter(Boolean)}
    </div>
  )
}

// 页面就绪日志
console.log('[TmallTraffic] pages ready')

