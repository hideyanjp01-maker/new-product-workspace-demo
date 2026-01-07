import { useMemo } from 'react'
import { Card, Button } from '../ui'
import { getMetricsByRole } from '../../data/mockData'
import type { Metric } from '../../data/mockData'
import type { Product } from '../../data/mockData'
import type {
  EcommerceBDStageSectionConfig,
  KPICardConfig,
  TalentContributionTableConfig,
  TargetProgressConfig,
  AIInsightConfig,
  TalentTierTableConfig,
  TalentPoolTableConfig,
  DiagnosisCardsConfig,
  KanbanBoardConfig,
  ResourceEfficiencyTablesConfig
} from '../../config/roleStage/ecommerce_bd'
import './DouyinBizStageRenderer.css'

interface DouyinBizStageRendererProps {
  sections: EcommerceBDStageSectionConfig[]
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
    <div className="kpi-cards-grid douyin-biz">
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

// 渲染达人贡献榜表格
const renderTalentContributionTable = (config: TalentContributionTableConfig) => (
  <div className="stage-section talent-contribution-table-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <Card padding="large">
      <div className="table-container">
        <table className="data-table douyin-biz-table">
          <thead>
            <tr>
              <th>达人</th>
              <th>达人类型</th>
              <th>曝光量</th>
              <th>CTR</th>
              <th>CVR</th>
              <th>ROI</th>
              <th>SPU GMV</th>
            </tr>
          </thead>
          <tbody>
            {config.talents.map((talent, idx) => (
              <tr key={idx}>
                <td>{talent.name}</td>
                <td>{talent.type}</td>
                <td>{talent.exposure ? formatValue(talent.exposure) : '—'}</td>
                <td>{talent.ctr ? `${talent.ctr.toFixed(1)}%` : '—'}</td>
                <td>{talent.cvr ? `${talent.cvr.toFixed(1)}%` : '—'}</td>
                <td>{talent.roi ? talent.roi.toFixed(1) : '—'}</td>
                <td>{talent.gmv ? formatValue(talent.gmv, '元') : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
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

// 渲染达人分层表格
const renderTalentTierTable = (config: TalentTierTableConfig) => (
  <div className="stage-section talent-tier-table-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <Card padding="large">
      <div className="table-container">
        <table className="data-table douyin-biz-table">
          <thead>
            <tr>
              <th>等级</th>
              <th>数量</th>
              <th>占比</th>
              <th>总GMV</th>
              <th>平均ROI</th>
              <th>平均退货率</th>
            </tr>
          </thead>
          <tbody>
            {config.tiers.map((tier, idx) => (
              <tr key={idx}>
                <td>{tier.level}</td>
                <td>{tier.count}</td>
                <td>{tier.ratio}%</td>
                <td>{tier.totalGmv ? formatValue(tier.totalGmv, '元') : '—'}</td>
                <td>{tier.avgRoi ? tier.avgRoi.toFixed(1) : '—'}</td>
                <td>{tier.avgRefundRate ? `${tier.avgRefundRate.toFixed(1)}%` : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
)

// 渲染达人资源池表格（带筛选）
const renderTalentPoolTable = (config: TalentPoolTableConfig) => (
  <div className="stage-section talent-pool-table-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <Card padding="large">
      <div className="talent-pool-filters">
        <div className="filter-group">
          <input
            type="text"
            placeholder="搜索达人/ID"
            className="filter-input"
          />
          <select className="filter-select">
            <option>全部</option>
            <option>头部达人</option>
            <option>腰部达人</option>
            <option>A类达人</option>
          </select>
          <Button size="small">搜索</Button>
          <Button size="small" variant="outline">重置</Button>
        </div>
        <Button size="small" variant="outline">
          下载Excel
        </Button>
      </div>
      <div className="table-container">
        <table className="data-table douyin-biz-table">
          <thead>
            <tr>
              <th>达人</th>
              <th>类型</th>
              <th>曝光量</th>
              <th>点击量</th>
              <th>CTR</th>
              <th>下单数</th>
              <th>CVR</th>
              <th>ROI</th>
              <th>SPU GMV</th>
            </tr>
          </thead>
          <tbody>
            {config.talents.map((talent, idx) => (
              <tr key={idx}>
                <td>{talent.name}</td>
                <td>{talent.type}</td>
                <td>{talent.exposure ? formatValue(talent.exposure) : '—'}</td>
                <td>{talent.clicks ? formatValue(talent.clicks) : '—'}</td>
                <td>{talent.ctr ? `${talent.ctr.toFixed(1)}%` : '—'}</td>
                <td>{talent.orders ? formatValue(talent.orders) : '—'}</td>
                <td>{talent.cvr ? `${talent.cvr.toFixed(1)}%` : '—'}</td>
                <td>{talent.roi ? talent.roi.toFixed(1) : '—'}</td>
                <td>{talent.gmv ? formatValue(talent.gmv, '元') : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
)

// 渲染诊断问题卡片
const renderDiagnosisCards = (config: DiagnosisCardsConfig) => (
  <div className="stage-section diagnosis-cards-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <div className="diagnosis-cards-grid">
      {config.cards.map((card, idx) => (
        <Card key={idx} padding="medium" className={`diagnosis-card diagnosis-card--${card.severity}`}>
          <div className="diagnosis-card-content">
            <div className="diagnosis-card-header">
              <div className={`diagnosis-severity-dot diagnosis-severity-dot--${card.severity}`} />
              <h3 className="diagnosis-card-title">{card.title}</h3>
            </div>
            <p className="diagnosis-card-desc">{card.description}</p>
            <p className="diagnosis-card-suggestion">{card.suggestion}</p>
          </div>
        </Card>
      ))}
    </div>
    <div className="diagnosis-legend">
      <span className="legend-item">
        <span className="legend-dot legend-dot--high" />高
      </span>
      <span className="legend-item">
        <span className="legend-dot legend-dot--medium" />中
      </span>
      <span className="legend-item">
        <span className="legend-dot legend-dot--low" />低
      </span>
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

// 渲染资源位效率双表
const renderResourceEfficiencyTables = (config: ResourceEfficiencyTablesConfig) => (
  <div className="stage-section resource-efficiency-tables-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <div className="resource-tables-grid">
      {config.tables.map((table, idx) => (
        <Card key={idx} padding="large">
          <h3 className="table-title">{table.title}</h3>
          <div className="table-container">
            <table className="data-table douyin-biz-table">
              <thead>
                <tr>
                  <th>资源位</th>
                  <th>曝光量</th>
                  <th>点击量</th>
                  <th>订单数</th>
                  <th>GMV</th>
                  <th>ROI</th>
                  <th>退货率</th>
                </tr>
              </thead>
              <tbody>
                {table.resources.map((resource, rIdx) => (
                  <tr key={rIdx}>
                    <td>{resource.name}</td>
                    <td>{resource.exposure ? formatValue(resource.exposure) : '—'}</td>
                    <td>{resource.clicks ? formatValue(resource.clicks) : '—'}</td>
                    <td>{resource.orders ? formatValue(resource.orders) : '—'}</td>
                    <td>{resource.gmv ? formatValue(resource.gmv, '元') : '—'}</td>
                    <td>{resource.roi ? resource.roi.toFixed(1) : '—'}</td>
                    <td>{resource.refundRate ? `${resource.refundRate.toFixed(1)}%` : '—'}</td>
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

export default function DouyinBizStageRenderer({
  sections,
  products,
  metrics: metricsProp,
  roleId = 'ecommerce_bd',
  stage = 'unknown'
}: DouyinBizStageRendererProps) {
  const metrics = useMemo(() => {
    if (metricsProp) return metricsProp
    return getMetricsByRole(roleId)
  }, [metricsProp, roleId])

  // 调试日志
  const moduleTypes = sections.map(s => s.type)
  console.debug('[DouyinBizStageRenderer]', { roleId, stage, modulesCount: sections.length, moduleTypes })

  // 模块注册表
  const renderModule = (section: EcommerceBDStageSectionConfig, index: number) => {
    switch (section.type) {
      case 'kpi-cards':
        return <div key={index}>{renderKPICards(section, products, metrics)}</div>
      case 'talent-contribution-table':
        return <div key={index}>{renderTalentContributionTable(section)}</div>
      case 'target-progress':
        return <div key={index}>{renderTargetProgress(section, products)}</div>
      case 'ai-insight':
        return <div key={index}>{renderAIInsight(section)}</div>
      case 'talent-tier-table':
        return <div key={index}>{renderTalentTierTable(section)}</div>
      case 'talent-pool-table':
        return <div key={index}>{renderTalentPoolTable(section)}</div>
      case 'diagnosis-cards':
        return <div key={index}>{renderDiagnosisCards(section)}</div>
      case 'kanban-board':
        return <div key={index}>{renderKanbanBoard(section)}</div>
      case 'resource-efficiency-tables':
        return <div key={index}>{renderResourceEfficiencyTables(section)}</div>
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
      <div className="douyin-biz-stage-renderer">
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
    <div className="douyin-biz-stage-renderer">
      {sections.map((section, index) => renderModule(section, index))}
    </div>
  )
}

