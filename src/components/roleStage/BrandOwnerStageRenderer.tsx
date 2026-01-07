import { useMemo } from 'react'
import { Card } from '../ui'
import { getMetricsByRole } from '../../data/mockData'
import type { Metric } from '../../data/mockData'
import type { Product } from '../../data/mockData'
import type {
  BrandOwnerStageSectionConfig,
  KPICardConfig,
  PlatformBreakdownConfig,
  WordCloudConfig,
  ScoreSystemConfig,
  SankeyFlowConfig,
  RiskAlertConfig,
  TargetProgressConfig,
  AIInsightConfig,
  TrendChartsConfig,
  DiagnosisCardsConfig,
  KanbanBoardConfig,
  FunnelGroupConfig,
  EfficiencyGridConfig
} from '../../config/roleStage/bu_brand_owner'
import BrandOwnerColdStartFiveScreens from './BrandOwnerColdStartFiveScreens'
import './BrandOwnerStageRenderer.css'

interface BrandOwnerStageRendererProps {
  sections: BrandOwnerStageSectionConfig[]
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
  if (metric) return metric.value

  if (fallbackKey) {
    const fallbackMetric = metrics.find(m => m.id === fallbackKey || m.name === fallbackKey)
    if (fallbackMetric) return fallbackMetric.value
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

// 未知模块占位组件
const UnknownModuleCard = ({ type, title }: { type: string; title?: string }) => (
  <div className="stage-section unknown-module-section">
    {title && <h2 className="section-title">{title}</h2>}
    <Card padding="large">
      <div className="unknown-module-content">
        <p>模块类型: <strong>{type}</strong></p>
        <p>该模块组件尚未实现</p>
      </div>
    </Card>
  </div>
)

// 渲染 KPI 卡片
const renderKPICards = (config: KPICardConfig, products: Product[], metrics: Metric[]) => (
  <div className="stage-section kpi-cards-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <div className="kpi-cards-grid brand-owner">
      {config.cards.map((card, index) => {
        const value = getMetricValue(card.metricKey, card.fallbackMetricKey, products, metrics, card.aggregate)
        return (
          <Card key={index} padding="large" hoverable>
            <div className="kpi-card">
              <div className="kpi-card-label">{card.label}</div>
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

// 渲染词云
const renderWordCloud = (config: WordCloudConfig) => (
  <div className="stage-section word-cloud-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <Card padding="large">
      <div className="word-cloud-container">
        <div className="word-cloud-column">
          <h3 className="word-cloud-title">{config.leftTitle || '好评热词'}</h3>
          <div className="word-cloud-words">
            {config.positiveWords.map((item, idx) => (
              <span
                key={idx}
                className="word-cloud-word"
                style={{ fontSize: `${12 + item.weight * 0.3}px` }}
              >
                {item.word}
              </span>
            ))}
          </div>
        </div>
        <div className="word-cloud-column">
          <h3 className="word-cloud-title">{config.rightTitle || '差评热词'}</h3>
          <div className="word-cloud-words">
            {config.negativeWords.map((item, idx) => (
              <span
                key={idx}
                className="word-cloud-word"
                style={{ fontSize: `${12 + item.weight * 0.3}px` }}
              >
                {item.word}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  </div>
)

// 渲染评分体系
const renderScoreSystem = (config: ScoreSystemConfig) => (
  <div className="stage-section score-system-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <Card padding="large">
      <div className="scoring-bars">
        {config.dimensions.map((dim, idx) => (
          <div key={idx} className="scoring-bar-item">
            <div className="scoring-bar-label">{dim.name}</div>
            <div className="scoring-bar-container">
              <div
                className="scoring-bar scoring-bar--grey"
                style={{ height: `${dim.score}%` }}
              >
                <span className="scoring-bar-value">{dim.score}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="overall-score">
        <div className="overall-score-label">综合评分</div>
        <div className="overall-score-bar-container">
          <div
            className="overall-score-bar"
            style={{ width: `${config.overallScore}%` }}
          >
            <span className="overall-score-value">{config.overallScore.toFixed(1)}/100</span>
          </div>
        </div>
      </div>
    </Card>
  </div>
)

// 渲染 Sankey 图（简化占位）
const renderSankeyFlow = (config: SankeyFlowConfig) => (
  <div className="stage-section sankey-flow-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <Card padding="large">
      <div className="sankey-placeholder">
        <div className="sankey-nodes">
          {config.nodes.map((node, idx) => (
            <div key={idx} className="sankey-node">{node.name}</div>
          ))}
        </div>
        <div className="sankey-hint">Sankey 图表占位（数据：{config.links.length} 条链接）</div>
      </div>
    </Card>
  </div>
)

// 渲染风险提示
const renderRiskAlert = (config: RiskAlertConfig) => (
  <div className="stage-section risk-alert-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <Card padding="large">
      <div className="risk-alert-list">
        {config.items.map((item, idx) => (
          <div key={idx} className={`risk-alert-item risk-alert-item--${item.level || 'low'}`}>
            {item.text}
          </div>
        ))}
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

// 渲染趋势图（占位）
const renderTrendCharts = (config: TrendChartsConfig) => (
  <div className="stage-section trend-charts-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <div className="trend-charts-grid">
      {config.charts.map((chart, idx) => (
        <Card key={idx} padding="large">
          <div className="trend-chart-item">
            <h3 className="trend-chart-label">{chart.label}</h3>
            <div className="trend-chart-placeholder">
              趋势图占位（数据点：{chart.data.length}）
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>
)

// 渲染诊断卡片
const renderDiagnosisCards = (config: DiagnosisCardsConfig) => (
  <div className="stage-section diagnosis-cards-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <div className="diagnosis-cards-grid">
      {config.cards.map((card, idx) => (
        <Card key={idx} padding="medium" className={`diagnosis-card diagnosis-card--${card.status}`}>
          <div className="diagnosis-card-content">
            <h3 className="diagnosis-card-title">{card.title}</h3>
            <p className="diagnosis-card-desc">{card.description}</p>
            {card.actionText && (
              <button className="diagnosis-card-action">{card.actionText}</button>
            )}
          </div>
        </Card>
      ))}
    </div>
  </div>
)

// 渲染 Kanban 看板
const renderKanbanBoard = (config: KanbanBoardConfig) => (
  <div className="stage-section kanban-board-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <Card padding="large">
      <div className="kanban-board-container">
        {config.columns.map((column) => (
          <div key={column.id} className="kanban-column">
            <h3 className="kanban-column-title">{column.title}</h3>
            <div className="kanban-cards">
              {column.cards.map((card) => (
                <Card key={card.id} padding="medium" className="kanban-card">
                  <div className="kanban-card-title">{card.title}</div>
                  {card.description && <div className="kanban-card-desc">{card.description}</div>}
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  </div>
)

// 渲染漏斗组
const renderFunnelGroup = (config: FunnelGroupConfig) => (
  <div className="stage-section funnel-group-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <div className="funnel-group-container">
      <Card padding="large" className="funnel-main">
        <h3 className="funnel-title">{config.mainFunnel.title}</h3>
        <div className="funnel-steps">
          {config.mainFunnel.steps.map((step, idx) => (
            <div key={idx} className="funnel-step">
              <div className="funnel-step-label">{step.label}</div>
              <div className="funnel-step-value">{formatValue(step.value)}</div>
            </div>
          ))}
        </div>
      </Card>
      <div className="funnel-platforms">
        {config.platformFunnels.map((funnel, idx) => (
          <Card key={idx} padding="medium" className="funnel-platform">
            <h3 className="funnel-title">{funnel.platform}</h3>
            <div className="funnel-steps-small">
              {funnel.steps.map((step, sIdx) => (
                <div key={sIdx} className="funnel-step-small">
                  <span className="funnel-step-label">{step.label}</span>
                  <span className="funnel-step-value">{formatValue(step.value)}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  </div>
)

// 渲染效率网格
const renderEfficiencyGrid = (config: EfficiencyGridConfig, products: Product[], metrics: Metric[]) => (
  <div className="stage-section efficiency-grid-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <div className="efficiency-grid">
      {config.metrics.map((m, idx) => {
        const value = getMetricValue(m.metricKey, m.fallbackMetricKey, products, metrics, (m as any).aggregate)
        return (
          <Card key={idx} padding="medium" hoverable>
            <div className="efficiency-card">
              <div className="efficiency-label">{m.label}</div>
              <div className="efficiency-value">{formatValue(value, m.unit)}</div>
              {m.trend && (
                <div className={`efficiency-trend efficiency-trend--${m.trend}`}>
                  {m.compareValue || (m.trend === 'up' ? '↑' : m.trend === 'down' ? '↓' : '→')}
                </div>
              )}
            </div>
          </Card>
        )
      })}
    </div>
  </div>
)

export default function BrandOwnerStageRenderer({
  sections,
  products,
  metrics: metricsProp,
  roleId = 'bu_brand_owner',
  stage = 'unknown'
}: BrandOwnerStageRendererProps) {
  const metrics = useMemo(() => {
    if (metricsProp) return metricsProp
    return getMetricsByRole(roleId)
  }, [metricsProp, roleId])

  // 调试日志
  const moduleTypes = sections.map(s => s.type)
  console.log('[BrandOwnerStageRenderer]', { roleId, stage, modulesCount: sections.length, moduleTypes })

  // 模块注册表
  const renderModule = (section: BrandOwnerStageSectionConfig, index: number) => {
    switch (section.type) {
      case 'kpi-cards':
        return <div key={index}>{renderKPICards(section, products, metrics)}</div>
      case 'platform-breakdown':
        return <div key={index}>{renderPlatformBreakdown(section, products, metrics)}</div>
      case 'word-cloud':
        return <div key={index}>{renderWordCloud(section)}</div>
      case 'score-system':
        return <div key={index}>{renderScoreSystem(section)}</div>
      case 'sankey-flow':
        return <div key={index}>{renderSankeyFlow(section)}</div>
      case 'risk-alert':
        return <div key={index}>{renderRiskAlert(section)}</div>
      case 'target-progress':
        return <div key={index}>{renderTargetProgress(section, products)}</div>
      case 'ai-insight':
        return <div key={index}>{renderAIInsight(section)}</div>
      case 'trend-charts':
        return <div key={index}>{renderTrendCharts(section)}</div>
      case 'diagnosis-cards':
        return <div key={index}>{renderDiagnosisCards(section)}</div>
      case 'kanban-board':
        return <div key={index}>{renderKanbanBoard(section)}</div>
      case 'funnel-group':
        return <div key={index}>{renderFunnelGroup(section)}</div>
      case 'efficiency-grid':
        return <div key={index}>{renderEfficiencyGrid(section, products, metrics)}</div>
      default:
        return (
          <UnknownModuleCard
            key={index}
            type={(section as any).type || 'unknown'}
            title={(section as any).title}
          />
        )
    }
  }

  // 空状态处理
  if (sections.length === 0) {
    return (
      <div className="brand-owner-stage-renderer">
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
    <div className="brand-owner-stage-renderer">
      {sections.map((section, index) => renderModule(section, index))}
      {/* 冷启动期：在现有sections之后追加5屏结构 */}
      {stage === 'cold-start' && (
        <BrandOwnerColdStartFiveScreens />
      )}
    </div>
  )
}


