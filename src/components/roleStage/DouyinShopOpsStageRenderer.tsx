import { useMemo } from 'react'
import { Card } from '../ui'
import { getMetricsByRole, getProducts } from '../../data/mockData'
import type { Metric } from '../../data/mockData'
import type { Product } from '../../data/mockData'
import type {
  DouyinShopOpsStageSectionConfig,
  KPICardConfig,
  ProductReviewTableConfig,
  LiveChannelTableConfig,
  StructureChartsConfig,
  TargetProgressConfig,
  AIInsightConfig,
  LiveEfficiencyTableConfig,
  ProductCardEfficiencyTableConfig,
  DiagnosisChartsConfig,
  ActionSuggestionsConfig,
  KanbanBoardConfig,
  FunnelChartConfig,
  ChannelEfficiencyTableConfig,
  SankeyFlowConfig
} from '../../config/roleStage/douyin_store_live'
import './DouyinShopOpsStageRenderer.css'

interface DouyinShopOpsStageRendererProps {
  sections: DouyinShopOpsStageSectionConfig[]
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
    if (unit === '单') return `${value.toLocaleString('zh-CN')}单`
    if (unit === '%') return `${value.toFixed(1)}%`
    return `${value.toLocaleString('zh-CN')}${unit ? unit : ''}`
  }
  return `${value}${unit ? unit : ''}`
}

// 渲染 KPI 卡片
const renderKPICards = (config: KPICardConfig, products: Product[], metrics: Metric[]) => (
  <div className="stage-section kpi-cards-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <div className="kpi-cards-grid douyin-shop">
      {config.cards.map((card, index) => {
        const value = getMetricValue(card.metricKey, card.fallbackMetricKey, products, metrics, card.aggregate)
        return (
          <Card key={index} padding="large" hoverable className={card.hasAlert ? 'kpi-card-with-alert' : ''}>
            <div className="kpi-card">
              <div className="kpi-card-header">
                <div className="kpi-card-label">{card.label}</div>
                {card.hasAlert && <span className="kpi-alert-badge">!</span>}
                {card.trend && (
                  <span className={`kpi-trend kpi-trend--${card.trend}`}>
                    {card.trend === 'up' ? '↑' : card.trend === 'down' ? '↓' : '→'}
                  </span>
                )}
              </div>
              <div className="kpi-card-value">{formatValue(value, card.unit)}</div>
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

// 渲染商品评价表格
const renderProductReviewTable = (config: ProductReviewTableConfig) => (
  <div className="stage-section product-review-table-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <Card padding="large">
      <div className="table-container">
        <table className="data-table douyin-table">
          <thead>
            <tr>
              <th>商品</th>
              <th>评价数</th>
              <th>评价总评分/均分</th>
              <th>评价差评率</th>
            </tr>
          </thead>
          <tbody>
            {config.products.map((product, idx) => (
              <tr key={idx}>
                <td>{product.name}</td>
                <td>{product.reviewCount}</td>
                <td>{product.avgScore ? `${product.avgScore.toFixed(1)}分` : '—'}</td>
                <td>{product.badReviewRate ? `${product.badReviewRate.toFixed(1)}%` : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
)

// 渲染直播通路表格
const renderLiveChannelTable = (config: LiveChannelTableConfig) => (
  <div className="stage-section live-channel-table-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <Card padding="large">
      <div className="table-container">
        <table className="data-table douyin-table">
          <thead>
            <tr>
              <th>通路</th>
              <th>开播时长</th>
              <th>直播间GMV</th>
              <th>ROI</th>
              <th>流量占比</th>
              <th>单小时GMV</th>
            </tr>
          </thead>
          <tbody>
            {config.channels.map((channel, idx) => (
              <tr key={idx}>
                <td>{channel.name}</td>
                <td>{channel.liveHours ? `${channel.liveHours}小时` : '—'}</td>
                <td>{channel.gmv ? formatValue(channel.gmv, '元') : '—'}</td>
                <td>{channel.roi ? channel.roi.toFixed(1) : '—'}</td>
                <td>{channel.trafficRatio ? `${channel.trafficRatio}%` : '—'}</td>
                <td>{channel.hourlyGmv ? formatValue(channel.hourlyGmv, '元') : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
)

// 渲染结构图表
const renderStructureCharts = (config: StructureChartsConfig) => (
  <div className="stage-section structure-charts-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <div className="charts-grid">
      {config.charts.map((chart, idx) => {
        if (chart.chartType === 'donut') {
          return (
            <Card key={idx} padding="large">
              <h3 className="chart-title">{chart.label}</h3>
              <div className="chart-placeholder donut-placeholder">
                <div className="donut-legend">
                  {chart.data.map((item, i) => (
                    <div key={i} className="legend-item">
                      <span className="legend-color" style={{ backgroundColor: `hsl(${i * 90}, 70%, 50%)` }} />
                      <span className="legend-label">{item.name}</span>
                      <span className="legend-value">{item.value}%</span>
                    </div>
                  ))}
                </div>
                <div className="donut-hint">圆环图占位</div>
              </div>
            </Card>
          )
        }
        if (chart.chartType === 'bar') {
          const maxValue = Math.max(...chart.data.map(d => d.value))
          return (
            <Card key={idx} padding="large">
              <h3 className="chart-title">{chart.label}</h3>
              <div className="bar-chart-horizontal">
                {chart.data.map((item, i) => {
                  const width = maxValue > 0 ? (item.value / maxValue) * 100 : 0
                  return (
                    <div key={i} className="bar-row">
                      <span className="bar-label">{item.name}</span>
                      <div className="bar-container">
                        <div className="bar-fill" style={{ width: `${width}%` }}>
                          <span className="bar-value">{formatValue(item.value, '元')}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          )
        }
        // column chart
        const maxValue = Math.max(...chart.data.map(d => d.value))
        return (
          <Card key={idx} padding="large">
            <h3 className="chart-title">{chart.label}</h3>
            <div className="bar-chart-vertical">
              {chart.data.map((item, i) => {
                const height = maxValue > 0 ? (item.value / maxValue) * 100 : 0
                return (
                  <div key={i} className="bar-column-item">
                    <div className="bar-column" style={{ height: `${height}%` }}>
                      <span className="bar-column-value">{item.value}%</span>
                    </div>
                    <div className="bar-column-label">{item.name}</div>
                  </div>
                )
              })}
            </div>
          </Card>
        )
      })}
    </div>
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

// 渲染 AI 洞察
const renderAIInsight = (config: AIInsightConfig) => (
  <div className="stage-section ai-insight-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <Card padding="large" className="ai-insight-card">
      <div className="ai-insight-list">
        {config.insights.map((insight, idx) => (
          <div key={idx} className="ai-insight-item">{insight}</div>
        ))}
      </div>
      {config.actionText && (
        <div className="ai-insight-action">
          <button className="ai-insight-button">{config.actionText}</button>
        </div>
      )}
    </Card>
  </div>
)

// 渲染直播渠道效率表格
const renderLiveEfficiencyTable = (config: LiveEfficiencyTableConfig) => (
  <div className="stage-section live-efficiency-table-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <Card padding="large">
      <div className="table-container">
        <table className="data-table douyin-table">
          <thead>
            <tr>
              <th>商品名称</th>
              <th>曝光量</th>
              <th>引流点击量</th>
              <th>详情点击率</th>
              <th>成交人数</th>
              <th>点击成交率</th>
              <th>直播间GMV</th>
            </tr>
          </thead>
          <tbody>
            {config.products.map((product, idx) => (
              <tr key={idx}>
                <td>{product.name}</td>
                <td>{product.exposure ? formatValue(product.exposure) : '—'}</td>
                <td>{product.clickCount ? formatValue(product.clickCount) : '—'}</td>
                <td>{product.detailClickRate ? `${product.detailClickRate}%` : '—'}</td>
                <td>{product.buyers ? formatValue(product.buyers) : '—'}</td>
                <td>{product.clickBuyRate ? `${product.clickBuyRate}%` : '—'}</td>
                <td>{product.gmv ? formatValue(product.gmv, '元') : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
)

// 渲染商品卡效率表格
const renderProductCardEfficiencyTable = (config: ProductCardEfficiencyTableConfig) => (
  <div className="stage-section product-card-efficiency-table-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <Card padding="large">
      <div className="table-container">
        <table className="data-table douyin-table">
          <thead>
            <tr>
              <th>商品名称</th>
              <th>曝光量</th>
              <th>点击人数</th>
              <th>成交人数</th>
              <th>点击成交率</th>
              <th>商品卡GMV</th>
            </tr>
          </thead>
          <tbody>
            {config.products.map((product, idx) => (
              <tr key={idx}>
                <td>{product.name}</td>
                <td>{product.exposure ? formatValue(product.exposure) : '—'}</td>
                <td>{product.clickUsers ? formatValue(product.clickUsers) : '—'}</td>
                <td>{product.buyers ? formatValue(product.buyers) : '—'}</td>
                <td>{product.clickBuyRate ? `${product.clickBuyRate}%` : '—'}</td>
                <td>{product.gmv ? formatValue(product.gmv, '元') : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
)

// 渲染诊断图表
const renderDiagnosisCharts = (config: DiagnosisChartsConfig) => (
  <div className="stage-section diagnosis-charts-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <div className="diagnosis-charts-grid">
      {config.charts.map((chart, idx) => {
        if (chart.chartType === 'bar') {
          const maxValue = Math.max(...(chart.data as Array<{ name: string; value: number }>).map(d => d.value))
          return (
            <Card key={idx} padding="large">
              <h3 className="chart-title">{chart.label}</h3>
              <div className="bar-chart-horizontal">
                {(chart.data as Array<{ name: string; value: number }>).map((item, i) => {
                  const width = maxValue > 0 ? (item.value / maxValue) * 100 : 0
                  return (
                    <div key={i} className="bar-row">
                      <span className="bar-label">{item.name}</span>
                      <div className="bar-container">
                        <div className="bar-fill" style={{ width: `${width}%` }}>
                          <span className="bar-value">{item.value}%</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          )
        }
        // progress
        const progressValue = typeof chart.data === 'number' ? chart.data : 0
        return (
          <Card key={idx} padding="large">
            <h3 className="chart-title">{chart.label}</h3>
            <div className="progress-bar-container">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progressValue}%` }}>
                  <span className="progress-value">{progressValue}%</span>
                </div>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  </div>
)

// 渲染行动建议
const renderActionSuggestions = (config: ActionSuggestionsConfig) => (
  <div className="stage-section action-suggestions-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <Card padding="large">
      <div className="action-suggestions-list">
        {config.items.map((item, idx) => (
          <div key={idx} className="action-suggestion-item">
            <div className="action-suggestion-indicator" />
            <div className="action-suggestion-content">
              <h3 className="action-suggestion-title">{item.title}</h3>
              <p className="action-suggestion-desc">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
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
                <Card key={card.id} padding="medium" className="kanban-card">
                  <div className="kanban-card-title">{card.title}</div>
                  {card.tag && <span className="kanban-card-tag">{card.tag}</span>}
                  {card.date && <div className="kanban-card-date">{card.date}</div>}
                  {card.assignee && <div className="kanban-card-assignee">负责人: {card.assignee}</div>}
                </Card>
              ))}
            </div>
          </div>
        ))}
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

// 渲染通路效率表格
const renderChannelEfficiencyTable = (config: ChannelEfficiencyTableConfig) => (
  <div className="stage-section channel-efficiency-table-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <Card padding="large">
      <div className="table-container">
        <table className="data-table douyin-table">
          <thead>
            <tr>
              <th>通路</th>
              <th>开播时长</th>
              <th>GMV</th>
              <th>ROI</th>
              <th>单小时GMV</th>
            </tr>
          </thead>
          <tbody>
            {config.channels.map((channel, idx) => (
              <tr key={idx}>
                <td>{channel.name}</td>
                <td>{channel.liveHours ? `${channel.liveHours}小时` : '—'}</td>
                <td>{channel.gmv ? formatValue(channel.gmv, '元') : '—'}</td>
                <td>{channel.roi ? channel.roi.toFixed(1) : '—'}</td>
                <td>{channel.hourlyGmv ? formatValue(channel.hourlyGmv, '元') : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
)

// 渲染 Sankey 图
const renderSankeyFlow = (config: SankeyFlowConfig) => (
  <div className="stage-section sankey-flow-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <Card padding="large">
      <div className="sankey-placeholder">
        <div className="sankey-columns">
          <div className="sankey-column">
            <div className="sankey-column-title">来源</div>
            {config.nodes.slice(0, 4).map((node, idx) => (
              <div key={idx} className="sankey-node">{node.name}</div>
            ))}
          </div>
          <div className="sankey-column">
            <div className="sankey-column-title">渠道</div>
            {config.nodes.slice(4, 8).map((node, idx) => (
              <div key={idx} className="sankey-node">{node.name}</div>
            ))}
          </div>
          <div className="sankey-column">
            <div className="sankey-column-title">去向</div>
            {config.nodes.slice(8).map((node, idx) => (
              <div key={idx} className="sankey-node">{node.name}</div>
            ))}
          </div>
        </div>
        <div className="sankey-hint">人群流转 Sankey 图占位（链接：{config.links.length} 条）</div>
      </div>
    </Card>
  </div>
)

export default function DouyinShopOpsStageRenderer({
  sections,
  products,
  metrics: metricsProp,
  roleId = 'douyin_store_live',
  stage = 'unknown'
}: DouyinShopOpsStageRendererProps) {
  const metrics = useMemo(() => {
    if (metricsProp) return metricsProp
    return getMetricsByRole(roleId)
  }, [metricsProp, roleId])

  // 调试日志
  const moduleTypes = sections.map(s => s.type)
  console.debug('[DouyinShopOpsStageRenderer]', { roleId, stage, modulesCount: sections.length, moduleTypes })

  // 模块注册表
  const renderModule = (section: DouyinShopOpsStageSectionConfig, index: number) => {
    switch (section.type) {
      case 'kpi-cards':
        return <div key={index}>{renderKPICards(section, products, metrics)}</div>
      case 'product-review-table':
        return <div key={index}>{renderProductReviewTable(section)}</div>
      case 'live-channel-table':
        return <div key={index}>{renderLiveChannelTable(section)}</div>
      case 'structure-charts':
        return <div key={index}>{renderStructureCharts(section)}</div>
      case 'target-progress':
        return <div key={index}>{renderTargetProgress(section, products)}</div>
      case 'ai-insight':
        return <div key={index}>{renderAIInsight(section)}</div>
      case 'live-efficiency-table':
        return <div key={index}>{renderLiveEfficiencyTable(section)}</div>
      case 'product-card-efficiency-table':
        return <div key={index}>{renderProductCardEfficiencyTable(section)}</div>
      case 'diagnosis-charts':
        return <div key={index}>{renderDiagnosisCharts(section)}</div>
      case 'action-suggestions':
        return <div key={index}>{renderActionSuggestions(section)}</div>
      case 'kanban-board':
        return <div key={index}>{renderKanbanBoard(section)}</div>
      case 'funnel-chart':
        return <div key={index}>{renderFunnelChart(section)}</div>
      case 'channel-efficiency-table':
        return <div key={index}>{renderChannelEfficiencyTable(section)}</div>
      case 'sankey-flow':
        return <div key={index}>{renderSankeyFlow(section)}</div>
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
      <div className="douyin-shop-ops-stage-renderer">
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
    <div className="douyin-shop-ops-stage-renderer">
      {sections.map((section, index) => renderModule(section, index))}
    </div>
  )
}



