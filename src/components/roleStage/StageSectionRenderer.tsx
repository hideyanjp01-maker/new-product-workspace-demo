import { useMemo } from 'react'
import { Card } from '../ui'
import { getMetricsByRole } from '../../data/mockData'
import type { Metric } from '../../data/mockData'
import type { Product } from '../../data/mockData'
import type {
  StageSectionConfig,
  KPICardConfig,
  PlatformBreakdownConfig,
  FunnelConfig,
  PlatformFunnelCardsConfig,
  AnomalyAlertConfig,
  TargetProgressConfig,
  AIInsightSummaryConfig,
  EfficiencyPanelConfig,
  ActionSuggestionsConfig,
  PacingConfig,
  DiagnosisConfig,
  AIDiagnosisCardsConfig,
  KanbanBoardConfig,
  OperationLogsConfig
} from '../../config/roleStage/ecommerce_owner'
import './StageSectionRenderer.css'

interface StageSectionRendererProps {
  sections: StageSectionConfig[]
  products: Product[]
  metrics?: Metric[]
  roleId?: string
}

// 获取指标值（从 metrics 或 products 聚合）
const getMetricValue = (
  metricKey: string,
  fallbackKey: string | undefined,
  products: Product[],
  metrics: Metric[],
  aggregate?: boolean
): number | string | null => {
  // 如果 aggregate 为 true，从 products 聚合计算
  if (aggregate) {
    const total = products.reduce((sum, p) => {
      const value = p.currentMetrics?.[metricKey] ?? 0
      return sum + (typeof value === 'number' ? value : 0)
    }, 0)
    return total > 0 ? total : null
  }

  // 从 metrics 中查找
  const metric = metrics.find(m => m.id === metricKey || m.name === metricKey)
  if (metric) {
    return metric.value
  }

  // 尝试 fallback
  if (fallbackKey) {
    const fallbackMetric = metrics.find(m => m.id === fallbackKey || m.name === fallbackKey)
    if (fallbackMetric) {
      return fallbackMetric.value
    }
  }

  return null
}

// 格式化数值显示
const formatValue = (value: number | string | null, unit?: string, formatType?: 'amount' | 'order' | 'percent'): string => {
  if (value === null || value === undefined) return '—'
  if (typeof value === 'number') {
    // 金额格式：xxx,xxx元
    if (formatType === 'amount' || unit === '元') {
      return `${value.toLocaleString('zh-CN')}元`
    }
    // 订单格式：xxx单
    if (formatType === 'order' || unit === '单') {
      return `${value.toLocaleString('zh-CN')}单`
    }
    // 百分比格式：x.x%
    if (formatType === 'percent' || unit === '%') {
      return `${value.toFixed(1)}%`
    }
    return `${value.toLocaleString('zh-CN')}${unit ? unit : ''}`
  }
  return `${value}${unit ? unit : ''}`
}

// 渲染 KPI 卡片组
const renderKPICards = (config: KPICardConfig, products: Product[], metrics: Metric[]) => {
  return (
    <div className="stage-section kpi-cards-section">
      {config.title && <h2 className="section-title">{config.title}</h2>}
      <div className="kpi-cards-grid">
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
}

// 渲染平台拆分表格
const renderPlatformBreakdown = (config: PlatformBreakdownConfig, products: Product[], metrics: Metric[]) => {
  return (
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
                    return (
                      <td key={mIdx}>{formatValue(value, m.unit)}</td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

// 渲染漏斗
const renderFunnel = (config: FunnelConfig, products: Product[], metrics: Metric[]) => {
  return (
    <div className="stage-section funnel-section">
      {config.title && <h2 className="section-title">{config.title}</h2>}
      <Card padding="large">
        <div className="funnel-container">
          {config.steps.map((step, index) => {
            const value = getMetricValue(step.metricKey, step.fallbackMetricKey, products, metrics)
            return (
              <div key={index} className="funnel-step">
                <div className="funnel-step-label">{step.label}</div>
                <div className="funnel-step-value">{formatValue(value)}</div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

// 渲染异动监控
const renderAnomalyAlert = (config: AnomalyAlertConfig, products: Product[], metrics: Metric[]) => {
  return (
    <div className="stage-section anomaly-alert-section">
      {config.title && <h2 className="section-title">{config.title}</h2>}
      <Card padding="large">
        <div className="anomaly-alert-list">
          {config.items.map((item, index) => {
            const value = getMetricValue(item.metricKey, undefined, products, metrics)
            return (
              <div key={index} className="anomaly-alert-item">
                <span className="anomaly-label">{item.label}</span>
                <span className="anomaly-value">{formatValue(value)}</span>
                {item.changeType && <span className="anomaly-change-type">{item.changeType}</span>}
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

// 渲染目标进度
const renderTargetProgress = (config: TargetProgressConfig, products: Product[]) => {
  // 取第一个产品作为示例（实际场景应该根据选中产品）
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
          {config.metrics.map((m, index) => {
            const target = product.targetMetrics?.[m.targetKey] ?? 0
            const current = product.currentMetrics?.[m.currentKey] ?? 0
            const progress = target > 0 ? (current / target) * 100 : 0
            return (
              <div key={index} className="target-progress-item">
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

// 渲染效率面板
const renderEfficiencyPanel = (config: EfficiencyPanelConfig, products: Product[], metrics: Metric[]) => {
  return (
    <div className="stage-section efficiency-panel-section">
      {config.title && <h2 className="section-title">{config.title}</h2>}
      <div className="efficiency-cards-grid">
        {config.metrics.map((m, index) => {
          const value = getMetricValue(m.metricKey, m.fallbackMetricKey, products, metrics, m.aggregate)
          return (
            <Card key={index} padding="medium" hoverable>
              <div className="efficiency-card">
                <div className="efficiency-label">{m.label}</div>
                <div className="efficiency-value">{formatValue(value, m.unit)}</div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

// 渲染行动建议
const renderActionSuggestions = (config: ActionSuggestionsConfig) => {
  return (
    <div className="stage-section action-suggestions-section">
      {config.title && <h2 className="section-title">{config.title}</h2>}
      <Card padding="large">
        <div className="action-suggestions-list">
          {config.suggestions.map((suggestion, index) => (
            <div key={index} className="action-suggestion-item">
              {suggestion}
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// 渲染目标节奏
const renderPacing = (config: PacingConfig, products: Product[]) => {
  const product = products[0]
  if (!product) {
    return (
      <div className="stage-section pacing-section">
        {config.title && <h2 className="section-title">{config.title}</h2>}
        <Card padding="large">
          <div className="empty-state">暂无产品数据</div>
        </Card>
      </div>
    )
  }

  return (
    <div className="stage-section pacing-section">
      {config.title && <h2 className="section-title">{config.title}</h2>}
      <Card padding="large">
        <div className="pacing-list">
          {config.metrics.map((m, index) => {
            const target = product.targetMetrics?.[m.targetKey] ?? 0
            const current = product.currentMetrics?.[m.currentKey] ?? 0
            const progress = target > 0 ? (current / target) * 100 : 0
            return (
              <div key={index} className="pacing-item">
                <div className="pacing-header">
                  <span className="pacing-label">{m.label}</span>
                  <span className="pacing-value">{formatValue(current)} / {formatValue(target)}</span>
                </div>
                <div className="pacing-bar">
                  <div 
                    className="pacing-fill" 
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

// 渲染诊断
const renderDiagnosis = (config: DiagnosisConfig, products: Product[], metrics: Metric[]) => {
  return (
    <div className="stage-section diagnosis-section">
      {config.title && <h2 className="section-title">{config.title}</h2>}
      <Card padding="large">
        <div className="diagnosis-funnel">
          {config.steps.map((step, index) => {
            const value = getMetricValue(step.metricKey, step.fallbackMetricKey, products, metrics)
            return (
              <div key={index} className="diagnosis-step">
                <div className="diagnosis-step-label">{step.label}</div>
                <div className="diagnosis-step-value">{formatValue(value)}</div>
              </div>
            )
          })}
        </div>
        {config.riskTips && config.riskTips.length > 0 && (
          <div className="diagnosis-risks">
            <h3 className="diagnosis-risks-title">风险提示</h3>
            {config.riskTips.map((tip, index) => (
              <div key={index} className="diagnosis-risk-item">{tip}</div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

// 渲染平台漏斗小卡
const renderPlatformFunnelCards = (config: PlatformFunnelCardsConfig) => {
  return (
    <div className="stage-section platform-funnel-cards-section">
      {config.title && <h2 className="section-title">{config.title}</h2>}
      <div className="platform-funnel-cards-grid">
        {config.platforms.map((platform, idx) => (
          <Card key={idx} padding="medium">
            <h3 className="platform-funnel-title">{platform.name}</h3>
            <div className="platform-funnel-steps">
              {platform.steps.map((step, sIdx) => {
                const maxValue = Math.max(...platform.steps.map(s => s.value))
                const width = maxValue > 0 ? (step.value / maxValue) * 100 : 0
                return (
                  <div key={sIdx} className="platform-funnel-step">
                    <div className="platform-funnel-step-label">{step.label}</div>
                    <div className="platform-funnel-step-bar" style={{ width: `${width}%` }}>
                      <span className="platform-funnel-step-value">{formatValue(step.value)}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// 渲染 AI 洞察摘要（绿底卡片）
const renderAIInsightSummary = (config: AIInsightSummaryConfig) => {
  return (
    <div className="stage-section ai-insight-summary-section">
      {config.title && <h2 className="section-title">{config.title}</h2>}
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
            <button className="insight-button" onClick={() => console.log('[Owner] 查看AI洞察')}>
              {config.actionText}
            </button>
          </div>
        )}
      </Card>
    </div>
  )
}

// 渲染 AI 诊断卡片
const renderAIDiagnosisCards = (config: AIDiagnosisCardsConfig) => {
  return (
    <div className="stage-section ai-diagnosis-cards-section">
      {config.title && <h2 className="section-title">{config.title}</h2>}
      <div className="ai-diagnosis-cards-grid">
        {config.cards.map((card, idx) => (
          <Card key={idx} padding="medium" className={`ai-diagnosis-card ai-diagnosis-card--${card.severity}`}>
            <div className="ai-diagnosis-header">
              <div className={`ai-diagnosis-dot ai-diagnosis-dot--${card.severity}`} />
              <h3 className="ai-diagnosis-title">{card.title}</h3>
            </div>
            <div className="ai-diagnosis-conclusion">{card.conclusion}</div>
            <ul className="ai-diagnosis-suggestions">
              {card.suggestions.map((suggestion, sIdx) => (
                <li key={sIdx}>{suggestion}</li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  )
}

// 渲染任务看板
const renderKanbanBoard = (config: KanbanBoardConfig) => {
  return (
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
                    onClick={() => console.log('[Owner] Task clicked:', card.id)}
                  >
                    <div className="kanban-card-title">{card.title}</div>
                    {card.deadline && <div className="kanban-card-deadline">截止: {card.deadline}</div>}
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
}

// 渲染操作记录
const renderOperationLogs = (config: OperationLogsConfig) => {
  return (
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
}

export default function StageSectionRenderer({
  sections,
  products,
  metrics: metricsProp,
  roleId = 'ecommerce_owner'
}: StageSectionRendererProps) {
  // 获取该角色的指标
  const metrics = useMemo(() => {
    if (metricsProp) return metricsProp
    return getMetricsByRole(roleId)
  }, [metricsProp, roleId])

  // 空状态处理
  if (products.length === 0) {
    return (
      <div className="stage-section-renderer">
        <Card padding="large">
          <div className="empty-state">
            <p>暂无产品数据</p>
          </div>
        </Card>
      </div>
    )
  }
  
  // Debug logs
  const sectionTypes = sections.map(s => s.type).join(',')
  if (sectionTypes.includes('kpi-cards') && sectionTypes.includes('platform-breakdown') && sectionTypes.includes('funnel')) {
    console.log('[OwnerOverview] sections mounted', { sectionsCount: sections.length, productsCount: products.length })
  } else if (sectionTypes.includes('target-progress') && sectionTypes.includes('efficiency-panel')) {
    console.log('[OwnerColdStart] sections mounted', { sectionsCount: sections.length, productsCount: products.length })
  } else if (sectionTypes.includes('pacing') && sectionTypes.includes('diagnosis')) {
    console.log('[OwnerScale] sections mounted', { sectionsCount: sections.length, productsCount: products.length })
  }

  // 处理并排布局：target-progress + ai-insight-summary
  const processedIndices = new Set<number>()
  
  const renderModule = (section: StageSectionConfig, index: number) => {
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
          <div key={`combined-${index}`} className="target-progress-with-insight-container">
            <div className="target-progress-wrapper">
              {renderTargetProgress(section, products)}
            </div>
            <div className="ai-insight-wrapper">
              {renderAIInsightSummary(nextSection)}
            </div>
          </div>
        )
      }
    }

    // 检查 pacing + ai-insight-summary 并排布局
    if (section.type === 'pacing' && index + 1 < sections.length) {
      const nextSection = sections[index + 1]
      if (nextSection.type === 'ai-insight-summary') {
        processedIndices.add(index)
        processedIndices.add(index + 1)
        // 合并渲染为并排布局
        return (
          <div key={`combined-${index}`} className="target-progress-with-insight-container">
            <div className="target-progress-wrapper">
              {renderPacing(section, products)}
            </div>
            <div className="ai-insight-wrapper">
              {renderAIInsightSummary(nextSection)}
            </div>
          </div>
        )
      }
    }

    switch (section.type) {
          case 'kpi-cards':
            return <div key={index}>{renderKPICards(section, products, metrics)}</div>
          case 'platform-breakdown':
            return <div key={index}>{renderPlatformBreakdown(section, products, metrics)}</div>
          case 'funnel':
            return <div key={index}>{renderFunnel(section, products, metrics)}</div>
          case 'platform-funnel-cards':
            return <div key={index}>{renderPlatformFunnelCards(section)}</div>
          case 'anomaly-alert':
            return <div key={index}>{renderAnomalyAlert(section, products, metrics)}</div>
          case 'target-progress':
            return <div key={index}>{renderTargetProgress(section, products)}</div>
          case 'ai-insight-summary':
            return <div key={index}>{renderAIInsightSummary(section)}</div>
          case 'efficiency-panel':
            return <div key={index}>{renderEfficiencyPanel(section, products, metrics)}</div>
          case 'action-suggestions':
            return <div key={index}>{renderActionSuggestions(section)}</div>
          case 'pacing':
            return <div key={index}>{renderPacing(section, products)}</div>
          case 'diagnosis':
            return <div key={index}>{renderDiagnosis(section, products, metrics)}</div>
          case 'ai-diagnosis-cards':
            return <div key={index}>{renderAIDiagnosisCards(section)}</div>
          case 'kanban-board':
            return <div key={index}>{renderKanbanBoard(section)}</div>
          case 'operation-logs':
            return <div key={index}>{renderOperationLogs(section)}</div>
          case 'status-bar':
          case 'time-selector':
            // 这些由页面本身处理，不在此渲染
            return null
          default:
            return null
        }
  }

  return (
    <div className="stage-section-renderer">
      {sections.map((section, index) => renderModule(section, index)).filter(Boolean)}
    </div>
  )
}

