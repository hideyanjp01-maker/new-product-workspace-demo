import { useState } from 'react'
import { Card, Tabs, Modal } from '../ui'
import {
  aiInsightsByTab,
  diagnosticsByTab,
  actionBoardData,
  chartsByTab,
  type InsightTab,
  type ActionCard
} from '../../mock/brandOwnerColdStartData'
import './BrandOwnerAIInsightExtended.css'

interface Props {
  dateA: string
  dateB: string
}


// 行动卡详情抽屉
const ActionCardDrawer = ({
  card,
  onClose
}: {
  card: ActionCard | null
  onClose: () => void
}) => {
  if (!card) return null

  return (
    <div className="action-card-drawer-overlay" onClick={onClose}>
      <div className="action-card-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <h3>{card.title}</h3>
          <button className="drawer-close" onClick={onClose}>×</button>
        </div>
        <div className="drawer-content">
          <div className="action-card-detail">
            <div className="detail-item">
              <label>目标/说明：</label>
              <span>{card.description}</span>
            </div>
            {card.assignee && (
              <div className="detail-item">
                <label>负责人：</label>
                <span>{card.assignee}</span>
              </div>
            )}
            {card.deadline && (
              <div className="detail-item">
                <label>预计完成时间：</label>
                <span>{card.deadline}</span>
              </div>
            )}
            {card.relatedPlatform && (
              <div className="detail-item">
                <label>关联平台：</label>
                <span>{card.relatedPlatform}</span>
              </div>
            )}
            {card.relatedSPU && (
              <div className="detail-item">
                <label>关联SPU：</label>
                <span>{card.relatedSPU}</span>
              </div>
            )}
            {card.relatedMetric && (
              <div className="detail-item">
                <label>影响指标：</label>
                <span>{card.relatedMetric}</span>
              </div>
            )}
            <div className="detail-item">
              <label>状态：</label>
              <span className={`status-badge status-badge--${card.status === '待办' ? 'todo' : card.status === '进行中' ? 'doing' : 'done'}`}>
                {card.status}
              </span>
            </div>
            <div className="detail-section">
              <h4>建议动作</h4>
              <p>根据当前数据分析，建议优先处理该任务，预期可提升整体效率。</p>
            </div>
            <div className="detail-section">
              <h4>操作记录</h4>
              <ul className="operation-log-list">
                <li>2025-02-28 10:30 - 创建任务 - 品牌负责人</li>
                <li>2025-02-28 14:20 - 更新进度 - {card.assignee}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BrandOwnerAIInsightExtended({ dateA, dateB }: Props) {
  const [activeTab, setActiveTab] = useState<InsightTab>('产品')
  const [selectedActionCard, setSelectedActionCard] = useState<ActionCard | null>(null)
  const [diagnosticModal, setDiagnosticModal] = useState<{ title: string; content: string } | null>(null)
  const [actionFilterTab, setActionFilterTab] = useState<InsightTab | '全部'>(activeTab)
  
  // 当activeTab变化时，同步更新actionFilterTab
  const handleTabChange = (key: string) => {
    setActiveTab(key as InsightTab)
    setActionFilterTab(key as InsightTab)
  }

  const tabItems = [
    { key: '产品', label: '产品' },
    { key: '人群', label: '人群' },
    { key: '经营', label: '经营' },
    { key: '评价', label: '评价' },
    { key: '费比', label: '费比' }
  ]

  const insights = aiInsightsByTab[activeTab]
  const diagnostics = diagnosticsByTab[activeTab]
  const charts = chartsByTab[activeTab]

  // 渲染图表
  const renderChart = (chart: typeof charts[0]) => {
    if (chart.type === 'table') {
      return (
        <Card key={chart.label} padding="medium">
          <h3 className="chart-title">{chart.label}</h3>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  {chart.data.headers.map((h: string, i: number) => (
                    <th key={i}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {chart.data.rows.map((row: any[], i: number) => (
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
      )
    }
    if (chart.type === 'trend') {
      return (
        <Card key={chart.label} padding="medium">
          <h3 className="chart-title">{chart.label}</h3>
          <div className="trend-chart-placeholder">
            <div className="trend-line">
              {chart.data.map((d: any, i: number) => (
                <div key={i} className="trend-point" style={{ left: `${i * 50}%` }}>
                  <div className="trend-value">{d.value.toLocaleString('zh-CN')}</div>
                  <div className="trend-date">{d.date}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )
    }
    if (chart.type === 'bar') {
      return (
        <Card key={chart.label} padding="medium">
          <h3 className="chart-title">{chart.label}</h3>
          <div className="bar-chart-placeholder">
            {chart.data.labels.map((label: string, i: number) => {
              const maxValue = Math.max(...chart.data.values)
              const width = maxValue > 0 ? (chart.data.values[i] / maxValue) * 100 : 0
              return (
                <div key={i} className="bar-item">
                  <div className="bar-label">{label}</div>
                  <div className="bar-container">
                    <div className="bar-fill" style={{ width: `${width}%` }}>
                      <span className="bar-value">{chart.data.values[i]}%</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )
    }
    if (chart.type === 'pie') {
      return (
        <Card key={chart.label} padding="medium">
          <h3 className="chart-title">{chart.label}</h3>
          <div className="pie-chart-placeholder">
            {chart.data.labels.map((label: string, i: number) => (
              <div key={i} className="pie-item">
                <span className="pie-label">{label}</span>
                <span className="pie-value">{chart.data.values[i]}%</span>
              </div>
            ))}
          </div>
        </Card>
      )
    }
    return null
  }

  return (
    <div className="brand-owner-ai-insight-extended">
      {/* 二级Tab */}
      <div className="secondary-tabs-container">
        <Tabs 
          items={tabItems} 
          activeKey={activeTab} 
          onChange={handleTabChange} 
        />
      </div>

      {/* (1) AI洞察内容 */}
      <div className="ai-insight-content-section">
        <Card padding="large" className="ai-insight-summary-card">
          <div className="insight-list">
            {insights.map((insight, idx) => (
              <div key={idx} className="insight-item">{insight}</div>
            ))}
          </div>
        </Card>
      </div>

      {/* (2) 关键图表区 */}
      <div className="charts-section">
        <h2 className="section-title">关键图表</h2>
        <div className="charts-grid">
          {charts.map(chart => renderChart(chart))}
        </div>
      </div>


      {/* (3) 问题诊断 */}
      <div className="diagnosis-section">
        <div className="diagnosis-header">
          <h2 className="section-title">问题诊断</h2>
          <Tabs 
            items={tabItems} 
            activeKey={activeTab} 
            onChange={handleTabChange}
            size="small"
          />
        </div>
        <div className="diagnosis-cards-grid">
          {diagnostics.map((card, idx) => (
            <Card 
              key={idx} 
              padding="medium" 
              className={`diagnosis-card diagnosis-card--${card.status}`}
              hoverable
            >
              <div className="diagnosis-card-content">
                <div className="diagnosis-card-header">
                  <div className={`diagnosis-status-dot diagnosis-status-dot--${card.status}`} />
                  <h3 className="diagnosis-card-title">{card.title}</h3>
                </div>
                <p className="diagnosis-card-desc">{card.description}</p>
                {card.affectedMetrics && card.affectedMetrics.length > 0 && (
                  <div className="diagnosis-metrics">
                    {card.affectedMetrics.map((metric, mIdx) => (
                      <span key={mIdx} className="metric-tag">{metric}</span>
                    ))}
                  </div>
                )}
                <button 
                  className="diagnosis-action-btn"
                  onClick={() => setDiagnosticModal({ 
                    title: card.title, 
                    content: `${card.description}\n\n详细分析：\n根据${dateA}至${dateB}数据分析，${card.title}问题需要重点关注。建议采取以下措施：\n1. 分析具体原因\n2. 制定优化策略\n3. 持续监控效果` 
                  })}
                >
                  {card.actionText}
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* (4) 行动卡看板 */}
      <div className="action-board-section">
        <div className="action-board-header">
          <h2 className="section-title">行动卡</h2>
          <div className="action-filter-tabs">
            <Tabs
              items={[
                ...tabItems,
                { key: '全部', label: '全部' }
              ]}
              activeKey={actionFilterTab}
              onChange={(key) => setActionFilterTab(key as InsightTab | '全部')}
              size="small"
            />
          </div>
        </div>
        <div className="kanban-board-container">
          {(['todo', 'doing', 'done'] as const).map((status) => {
            const statusLabel = status === 'todo' ? '待办' : status === 'doing' ? '进行中' : '已完成'
            const cards = actionBoardData[actionFilterTab]?.[status] || []
            return (
              <div key={status} className="kanban-column">
                <div className="kanban-column-header">
                  <h3 className="kanban-column-title">{statusLabel}</h3>
                  <span className="kanban-column-count">{cards.length}</span>
                </div>
                <div className="kanban-cards">
                  {cards.map(card => (
                    <Card 
                      key={card.id} 
                      padding="medium" 
                      className="kanban-card"
                      hoverable
                      onClick={() => setSelectedActionCard(card)}
                    >
                      <div className="kanban-card-title">{card.title}</div>
                      <div className="kanban-card-desc">{card.description}</div>
                      <div className="kanban-card-status">
                        <span className={`status-badge status-badge--${status}`}>{card.status}</span>
                      </div>
                      <div className="kanban-card-actions">
                        {status === 'todo' && (
                          <button onClick={(e) => { e.stopPropagation(); /* 移动到进行中 */ }}>
                            开始
                          </button>
                        )}
                        {status === 'doing' && (
                          <>
                            <button onClick={(e) => { e.stopPropagation(); /* 移动到待办 */ }}>
                              回退
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); /* 移动到已完成 */ }}>
                              完成
                            </button>
                          </>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 行动卡详情抽屉 */}
      {selectedActionCard && (
        <ActionCardDrawer 
          card={selectedActionCard} 
          onClose={() => setSelectedActionCard(null)} 
        />
      )}

      {/* 诊断详情弹窗 */}
      {diagnosticModal && (
        <Modal
          open={!!diagnosticModal}
          title={diagnosticModal.title}
          onClose={() => setDiagnosticModal(null)}
        >
          <div className="diagnostic-modal-content">
            <pre style={{ whiteSpace: 'pre-wrap' }}>{diagnosticModal.content}</pre>
          </div>
        </Modal>
      )}
    </div>
  )
}

