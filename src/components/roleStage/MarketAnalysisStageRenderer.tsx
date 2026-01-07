import { useMemo } from 'react'
import { Card } from '../ui'
import { getMetricsByRole } from '../../data/mockData'
import type { Metric } from '../../data/mockData'
import type { Product } from '../../data/mockData'
import type {
  MarketAnalysisStageSectionConfig,
  KPICardConfig,
  PlatformBreakdownConfig,
  FunnelConfig,
  WordCloudConfig,
  StructureChartConfig,
  TrendBarChartsConfig,
  TargetProgressConfig,
  AIInsightConfig,
  MetricCardsConfig,
  TrendLineChartsConfig,
  SankeyFlowConfig,
  PlatformFunnelsConfig,
  ActionSuggestionsConfig,
  DataNotesConfig
} from '../../config/roleStage/market_analysis'
import './MarketAnalysisStageRenderer.css'

interface MarketAnalysisStageRendererProps {
  sections: MarketAnalysisStageSectionConfig[]
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
    <div className="kpi-cards-grid market-analysis">
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
            </div>
          </Card>
        )
      })}
    </div>
  </div>
)

// 渲染平台拆分
const renderPlatformBreakdown = (config: PlatformBreakdownConfig, products: Product[], metrics: Metric[]) => (
  <div className="stage-section platform-breakdown-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <Card padding="large">
      <div className="platform-table-container">
        <table className="platform-table">
          <thead>
            <tr>
              <th>平台</th>
              {config.platforms[0]?.metrics.map((m, idx) => (
                <th key={idx}>{m.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {config.platforms.map((platform, pIdx) => (
              <tr key={pIdx}>
                <td>{platform.name}</td>
                {platform.metrics.map((m, mIdx) => {
                  const value = getMetricValue(m.metricKey, m.fallbackMetricKey, products, metrics)
                  return <td key={mIdx}>{formatValue(value, m.unit)}</td>
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
)

// 渲染漏斗
const renderFunnel = (config: FunnelConfig) => (
  <div className="stage-section funnel-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <Card padding="large">
      <div className="funnel-container">
        {config.steps.map((step, idx) => {
          const maxValue = Math.max(...config.steps.map(s => s.value ?? 0))
          const width = step.value && maxValue > 0 ? (step.value / maxValue) * 100 : 0
          return (
            <div key={idx} className="funnel-step">
              <div className="funnel-step-label">{step.label}</div>
              <div className="funnel-step-bar-container">
                <div className="funnel-step-bar" style={{ width: `${width}%` }} />
                <span className="funnel-step-value">{formatValue(step.value)}</span>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  </div>
)

// 渲染词云
const renderWordCloud = (config: WordCloudConfig) => (
  <div className="stage-section word-cloud-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <Card padding="large">
      <div className="word-cloud-container">
        {config.words.map((item, idx) => (
          <span
            key={idx}
            className="word-cloud-word"
            style={{ fontSize: `${14 + item.weight * 0.3}px` }}
          >
            {item.word}
          </span>
        ))}
      </div>
    </Card>
  </div>
)

// 渲染结构占比（圆环/进度条占位）
const renderStructureChart = (config: StructureChartConfig) => (
  <div className="stage-section structure-chart-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <div className="structure-charts-grid">
      {config.charts.map((chart, idx) => (
        <Card key={idx} padding="large">
          <h3 className="chart-title">{chart.label}</h3>
          <div className="structure-chart-placeholder">
            <div className="structure-chart-legend">
              {chart.data.map((item, i) => (
                <div key={i} className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: `hsl(${i * 60}, 70%, 50%)` }} />
                  <span className="legend-label">{item.name}</span>
                  <span className="legend-value">{item.value}%</span>
                </div>
              ))}
            </div>
            <div className="structure-chart-hint">圆环图占位（数据：{chart.data.length} 项）</div>
          </div>
        </Card>
      ))}
    </div>
  </div>
)

// 渲染趋势柱状图
const renderTrendBarCharts = (config: TrendBarChartsConfig) => (
  <div className="stage-section trend-bar-charts-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <div className="trend-bar-charts-grid">
      {config.charts.map((chart, idx) => {
        const maxValue = Math.max(...chart.data.map(d => d.value))
        return (
          <Card key={idx} padding="large">
            <h3 className="chart-title">{chart.label}</h3>
            <div className="bar-chart-container">
              {chart.data.map((item, i) => {
                const height = maxValue > 0 ? (item.value / maxValue) * 100 : 0
                return (
                  <div key={i} className="bar-chart-item">
                    <div className="bar-chart-bar" style={{ height: `${height}%` }}>
                      <span className="bar-chart-value">{item.value}</span>
                    </div>
                    <div className="bar-chart-label">{item.name}</div>
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
    </Card>
  </div>
)

// 渲染指标卡片矩阵
const renderMetricCards = (config: MetricCardsConfig, products: Product[], metrics: Metric[]) => (
  <div className="stage-section metric-cards-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <div className="metric-cards-grid">
      {config.cards.map((card, idx) => {
        const value = getMetricValue(card.metricKey, card.fallbackMetricKey, products, metrics, card.aggregate)
        return (
          <Card key={idx} padding="medium" hoverable>
            <div className="metric-card">
              <div className="metric-card-label">{card.label}</div>
              <div className="metric-card-value">{formatValue(value, card.unit)}</div>
            </div>
          </Card>
        )
      })}
    </div>
  </div>
)

// 渲染趋势折线图
const renderTrendLineCharts = (config: TrendLineChartsConfig) => (
  <div className="stage-section trend-line-charts-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <div className="trend-line-charts-grid">
      {config.charts.map((chart, idx) => (
        <Card key={idx} padding="large">
          <h3 className="chart-title">{chart.label}</h3>
          <div className="trend-line-chart-placeholder">
            趋势折线图占位（数据点：{chart.data.length}）
          </div>
        </Card>
      ))}
    </div>
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
            <div className="sankey-column-title">人群</div>
            {config.nodes.slice(0, 3).map((node, idx) => (
              <div key={idx} className="sankey-node">{node.name}</div>
            ))}
          </div>
          <div className="sankey-column">
            <div className="sankey-column-title">渠道</div>
            {config.nodes.slice(3, 6).map((node, idx) => (
              <div key={idx} className="sankey-node">{node.name}</div>
            ))}
          </div>
          <div className="sankey-column">
            <div className="sankey-column-title">品类</div>
            {config.nodes.slice(6).map((node, idx) => (
              <div key={idx} className="sankey-node">{node.name}</div>
            ))}
          </div>
        </div>
        <div className="sankey-hint">Sankey 流向图占位（链接：{config.links.length} 条）</div>
      </div>
    </Card>
  </div>
)

// 渲染平台漏斗组
const renderPlatformFunnels = (config: PlatformFunnelsConfig) => (
  <div className="stage-section platform-funnels-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <div className="platform-funnels-grid">
      {config.funnels.map((funnel, idx) => {
        const maxValue = Math.max(...funnel.steps.map(s => s.value))
        return (
          <Card key={idx} padding="medium">
            <h3 className="funnel-platform-title">{funnel.platform}</h3>
            <div className="funnel-steps-small">
              {funnel.steps.map((step, sIdx) => {
                const width = maxValue > 0 ? (step.value / maxValue) * 100 : 0
                return (
                  <div key={sIdx} className="funnel-step-small">
                    <div className="funnel-step-label-small">{step.label}</div>
                    <div className="funnel-step-bar-container-small">
                      <div className="funnel-step-bar-small" style={{ width: `${width}%` }} />
                      <span className="funnel-step-value-small">{formatValue(step.value)}</span>
                    </div>
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

// 渲染行动建议
const renderActionSuggestions = (config: ActionSuggestionsConfig) => (
  <div className="stage-section action-suggestions-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <Card padding="large">
      <div className="action-suggestions-list">
        {config.items.map((item, idx) => (
          <div key={idx} className="action-suggestion-item">
            <div className="action-suggestion-header">
              <h3 className="action-suggestion-title">{item.title}</h3>
              {item.tag && <span className="action-suggestion-tag">{item.tag}</span>}
            </div>
            <p className="action-suggestion-desc">{item.description}</p>
          </div>
        ))}
      </div>
    </Card>
  </div>
)

// 渲染数据说明
const renderDataNotes = (config: DataNotesConfig) => (
  <div className="stage-section data-notes-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <Card padding="large">
      <div className="data-notes-list">
        {config.notes.map((note, idx) => (
          <div key={idx} className="data-note-item">{note}</div>
        ))}
      </div>
    </Card>
  </div>
)

export default function MarketAnalysisStageRenderer({
  sections,
  products,
  metrics: metricsProp,
  roleId = 'market_analysis',
  stage = 'unknown'
}: MarketAnalysisStageRendererProps) {
  const metrics = useMemo(() => {
    if (metricsProp) return metricsProp
    return getMetricsByRole(roleId)
  }, [metricsProp, roleId])

  // 调试日志
  const moduleTypes = sections.map(s => s.type)
  console.log('[MarketAnalysisStageRenderer]', { roleId, stage, modulesCount: sections.length, moduleTypes })

  // 模块注册表
  const renderModule = (section: MarketAnalysisStageSectionConfig, index: number) => {
    switch (section.type) {
      case 'kpi-cards':
        return <div key={index}>{renderKPICards(section, products, metrics)}</div>
      case 'platform-breakdown':
        return <div key={index}>{renderPlatformBreakdown(section, products, metrics)}</div>
      case 'funnel':
        return <div key={index}>{renderFunnel(section)}</div>
      case 'word-cloud':
        return <div key={index}>{renderWordCloud(section)}</div>
      case 'structure-chart':
        return <div key={index}>{renderStructureChart(section)}</div>
      case 'trend-bar-charts':
        return <div key={index}>{renderTrendBarCharts(section)}</div>
      case 'target-progress':
        return <div key={index}>{renderTargetProgress(section, products)}</div>
      case 'ai-insight':
        return <div key={index}>{renderAIInsight(section)}</div>
      case 'metric-cards':
        return <div key={index}>{renderMetricCards(section, products, metrics)}</div>
      case 'trend-line-charts':
        return <div key={index}>{renderTrendLineCharts(section)}</div>
      case 'sankey-flow':
        return <div key={index}>{renderSankeyFlow(section)}</div>
      case 'platform-funnels':
        return <div key={index}>{renderPlatformFunnels(section)}</div>
      case 'action-suggestions':
        return <div key={index}>{renderActionSuggestions(section)}</div>
      case 'data-notes':
        return <div key={index}>{renderDataNotes(section)}</div>
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
      <div className="market-analysis-stage-renderer">
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
    <div className="market-analysis-stage-renderer">
      {sections.map((section, index) => renderModule(section, index))}
    </div>
  )
}



