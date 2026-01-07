import { useMemo } from 'react'
import { Card, Button } from '../ui'
import { getMetricsByRole } from '../../data/mockData'
import type { Metric } from '../../data/mockData'
import type { Product } from '../../data/mockData'
import type {
  JdOperatorStageSectionConfig,
  KPICardConfig,
  ChannelCompositionTableConfig,
  ConsumerProfileDonutsConfig,
  FunnelChartConfig,
  TargetProgressConfig,
  AIInsightSummaryConfig,
  KeyMetricsOverviewConfig,
  ChannelEfficiencyTableConfig,
  SkuEfficiencyTableConfig,
  DiagnosisInsightsConfig,
  KanbanBoardConfig,
  OperationLogsConfig
} from '../../config/roleStage/jd_ops'
import './JdOperatorStageRenderer.css'

interface JdOperatorStageRendererProps {
  sections: JdOperatorStageSectionConfig[]
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
    <div className="kpi-cards-grid jd-operator">
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

// 渲染渠道构成表格
const renderChannelCompositionTable = (config: ChannelCompositionTableConfig) => (
  <div className="stage-section channel-composition-table-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <Card padding="large">
      <div className="table-container">
        <table className="data-table jd-operator-table">
          <thead>
            <tr>
              <th>渠道</th>
              <th>浏览量</th>
              <th>CTR</th>
              <th>访客UV</th>
              <th>GMV</th>
              <th>支付转化率</th>
            </tr>
          </thead>
          <tbody>
            {config.channels.map((channel, idx) => (
              <tr key={idx}>
                <td>{channel.channel}</td>
                <td>{channel.pageViews ? formatValue(channel.pageViews) : '—'}</td>
                <td>{channel.ctr ? `${channel.ctr.toFixed(1)}%` : '—'}</td>
                <td>{channel.visitorUV ? formatValue(channel.visitorUV) : '—'}</td>
                <td>{channel.gmv ? formatValue(channel.gmv, '元') : '—'}</td>
                <td>{channel.paymentConversionRate ? `${channel.paymentConversionRate.toFixed(1)}%` : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
)

// 渲染环形图（简单 SVG 实现）
const renderDonutChart = (title: string, data: Array<{ label: string; value: number; color?: string }>) => {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  const colors = data.map((item, idx) => item.color || ['#1890ff', '#52c41a', '#faad14', '#ff4d4f', '#722ed1', '#eb2f96'][idx % 6])
  
  const radius = 50
  const centerX = 80
  const centerY = 80
  const innerRadius = 30
  
  let currentAngle = -90
  const paths = data.map((item, idx) => {
    const percentage = (item.value / total) * 100
    const angle = (percentage / 100) * 360
    const startAngle = currentAngle
    const endAngle = currentAngle + angle
    currentAngle = endAngle

    const startAngleRad = (startAngle * Math.PI) / 180
    const endAngleRad = (endAngle * Math.PI) / 180
    
    const x1 = centerX + radius * Math.cos(startAngleRad)
    const y1 = centerY + radius * Math.sin(startAngleRad)
    const x2 = centerX + radius * Math.cos(endAngleRad)
    const y2 = centerY + radius * Math.sin(endAngleRad)
    
    const x3 = centerX + innerRadius * Math.cos(endAngleRad)
    const y3 = centerY + innerRadius * Math.sin(endAngleRad)
    const x4 = centerX + innerRadius * Math.cos(startAngleRad)
    const y4 = centerY + innerRadius * Math.sin(startAngleRad)
    
    const largeArcFlag = angle > 180 ? 1 : 0

    return (
      <path
        key={idx}
        d={`M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4} Z`}
        fill={colors[idx]}
        stroke="#fff"
        strokeWidth="2"
      />
    )
  })

  return (
    <div className="donut-chart-card">
      <h3 className="donut-chart-title">{title}</h3>
      <div className="donut-chart-container">
        <svg width="160" height="160" viewBox="0 0 160 160">
          {paths}
        </svg>
        <div className="donut-chart-legend">
          {data.map((item, idx) => (
            <div key={idx} className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: colors[idx] }} />
              <span className="legend-label">{item.label}</span>
              <span className="legend-value">{((item.value / total) * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// 渲染消费者画像环形图
const renderConsumerProfileDonuts = (config: ConsumerProfileDonutsConfig) => (
  <div className="stage-section consumer-profile-donuts-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <div className="donut-charts-grid">
      {config.donuts.map((donut, idx) => (
        <Card key={idx} padding="medium">
          {renderDonutChart(donut.title, donut.data)}
        </Card>
      ))}
    </div>
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
              console.log('[JdOperator] 查看AI洞察 clicked')
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

// 渲染关键指标概览
const renderKeyMetricsOverview = (config: KeyMetricsOverviewConfig) => (
  <div className="stage-section key-metrics-overview-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <div className="key-metrics-grid">
      {config.metrics.map((metric, idx) => (
        <Card key={idx} padding="medium" hoverable>
          <div className="key-metric-card">
            <div className="key-metric-label">{metric.label}</div>
            <div className="key-metric-value">{formatValue(metric.value, metric.unit)}</div>
            {metric.trend && (
              <div className={`key-metric-trend key-metric-trend--${metric.trend}`}>
                {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'}
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  </div>
)

// 渲染渠道效率表
const renderChannelEfficiencyTable = (config: ChannelEfficiencyTableConfig) => (
  <div className="stage-section channel-efficiency-table-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <Card padding="large">
      <div className="table-container">
        <table className="data-table jd-operator-table">
          <thead>
            <tr>
              <th>排名</th>
              <th>渠道</th>
              <th>浏览量</th>
              <th>点击</th>
              <th>CTR</th>
              <th>UV</th>
              <th>支付</th>
              <th>支付转化率</th>
              <th>客单价</th>
              <th>退款金额</th>
              <th>退款率</th>
            </tr>
          </thead>
          <tbody>
            {config.channels.map((channel, idx) => (
              <tr key={idx}>
                <td>{channel.rank}</td>
                <td>{channel.channel}</td>
                <td>{channel.pageViews ? formatValue(channel.pageViews) : '—'}</td>
                <td>{channel.clicks ? formatValue(channel.clicks) : '—'}</td>
                <td>{channel.ctr ? `${channel.ctr.toFixed(1)}%` : '—'}</td>
                <td>{channel.uv ? formatValue(channel.uv) : '—'}</td>
                <td>{channel.payments ? formatValue(channel.payments) : '—'}</td>
                <td>{channel.paymentConversionRate ? `${channel.paymentConversionRate.toFixed(1)}%` : '—'}</td>
                <td>{channel.aov ? formatValue(channel.aov, '元') : '—'}</td>
                <td>{channel.refundAmount ? formatValue(channel.refundAmount, '元') : '—'}</td>
                <td>{channel.refundRate ? `${channel.refundRate.toFixed(1)}%` : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
)

// 渲染 SKU 效率表
const renderSkuEfficiencyTable = (config: SkuEfficiencyTableConfig) => (
  <div className="stage-section sku-efficiency-table-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <Card padding="large">
      <div className="table-container">
        <table className="data-table jd-operator-table">
          <thead>
            <tr>
              <th>排名</th>
              <th>SKU ID</th>
              <th>SKU名称</th>
              <th>访客UV</th>
              <th>支付转化率</th>
              <th>客单价</th>
              <th>GMV</th>
            </tr>
          </thead>
          <tbody>
            {config.skus.map((sku, idx) => (
              <tr key={idx}>
                <td>{sku.rank}</td>
                <td>{sku.skuId}</td>
                <td>{sku.skuName}</td>
                <td>{sku.visitorUV ? formatValue(sku.visitorUV) : '—'}</td>
                <td>{sku.paymentConversionRate ? `${sku.paymentConversionRate.toFixed(1)}%` : '—'}</td>
                <td>{sku.aov ? formatValue(sku.aov, '元') : '—'}</td>
                <td>{sku.gmv ? formatValue(sku.gmv, '元') : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
                    console.log('[JdOperator] Task clicked:', card.id)
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

export default function JdOperatorStageRenderer({
  sections,
  products,
  metrics: metricsProp,
  roleId = 'jd_ops',
  stage = 'unknown'
}: JdOperatorStageRendererProps) {
  const metrics = useMemo(() => {
    if (metricsProp) return metricsProp
    return getMetricsByRole(roleId)
  }, [metricsProp, roleId])

  // 调试日志
  const moduleTypes = sections.map(s => s.type)
  console.debug('[JdOperatorStageRenderer]', { roleId, stage, modulesCount: sections.length, moduleTypes })

  // 模块注册表（支持特殊布局：target-progress + ai-insight-summary 并排）
  const processedIndices = new Set<number>()
  
  const renderModule = (section: JdOperatorStageSectionConfig, index: number) => {
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
      case 'channel-composition-table':
        return <div key={index}>{renderChannelCompositionTable(section)}</div>
      case 'consumer-profile-donuts':
        return <div key={index}>{renderConsumerProfileDonuts(section)}</div>
      case 'funnel-chart':
        return <div key={index}>{renderFunnelChart(section)}</div>
      case 'target-progress':
        return <div key={index}>{renderTargetProgress(section, products)}</div>
      case 'ai-insight-summary':
        return <div key={index}>{renderAIInsightSummary(section)}</div>
      case 'key-metrics-overview':
        return <div key={index}>{renderKeyMetricsOverview(section)}</div>
      case 'channel-efficiency-table':
        return <div key={index}>{renderChannelEfficiencyTable(section)}</div>
      case 'sku-efficiency-table':
        return <div key={index}>{renderSkuEfficiencyTable(section)}</div>
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
      <div className="jd-operator-stage-renderer">
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
    <div className="jd-operator-stage-renderer">
      {sections.map((section, index) => renderModule(section, index)).filter(Boolean)}
    </div>
  )
}

// 页面就绪日志
console.log('[JdOperator] pages ready')

