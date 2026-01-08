import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../../components/layout/MainLayout'
import PageHeader from '../../components/layout/PageHeader'
import { Card, Button, Modal } from '../../components/ui'
import { useAppStore } from '../../store/appStore'
import { useNewProductFlowStore } from '../../store/newProductFlowStore'
import {
  hasData,
  setHasData,
  kpiCards,
  ideaCards,
  topOpportunities,
  topOpportunityDetails,
  priceBandOpportunityTable,
  specOpportunityTable,
  sellingPointPriceBandTable,
  type IdeaCard
} from '../../mock/marketInsight'
import './InsightStagePage.css'

export default function InsightStagePage() {
  const navigate = useNavigate()
  const { setCurrentStage } = useAppStore()
  const pushIdeaToPlanning = useNewProductFlowStore((state) => state.pushIdeaToPlanning)
  const planningIdeas = useNewProductFlowStore((state) => state.planningIdeas)
  const [dataState, setDataState] = useState(hasData)
  const [importModalOpen, setImportModalOpen] = useState(false)
  const [topOpportunityModalOpen, setTopOpportunityModalOpen] = useState(false)
  const [topOpportunityType, setTopOpportunityType] = useState<'priceBand' | 'spec'>('priceBand')
  const [ideaDetailModalOpen, setIdeaDetailModalOpen] = useState(false)
  const [selectedIdea, setSelectedIdea] = useState<IdeaCard | null>(null)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null)
  const [pushToast, setPushToast] = useState<string | null>(null)

  useEffect(() => {
    setCurrentStage('insight')
  }, [setCurrentStage])

  // 处理导入数据
  const handleImportData = () => {
    setHasData(true)
    setDataState(true)
    setImportModalOpen(false)
  }

  // 处理表格排序
  const handleSort = (key: string) => {
    setSortConfig(prev => {
      if (prev?.key === key) {
        return prev.direction === 'asc' ? { key, direction: 'desc' } : null
      }
      return { key, direction: 'asc' }
    })
  }

  // 排序函数
  const sortData = <T extends Record<string, any>>(data: T[], key: string, direction: 'asc' | 'desc'): T[] => {
    return [...data].sort((a, b) => {
      const aVal = a[key]
      const bVal = b[key]
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return direction === 'asc' ? aVal - bVal : bVal - aVal
      }
      return direction === 'asc' 
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal))
    })
  }

  // 渲染筛选栏
  const renderFilterBar = () => (
    <div className="insight-filter-bar">
      <button className="filter-back-btn" onClick={() => navigate('/stages/overview')}>
        &lt; 返回
      </button>
      <div className="filter-controls">
        <select className="filter-select">
          <option>全部品类</option>
          <option>数码3C</option>
          <option>家居用品</option>
          <option>美妆护肤</option>
        </select>
        <input type="text" className="filter-search" placeholder="搜索..." />
        <Button variant="primary" size="small">搜索</Button>
        <Button variant="secondary" size="small">重置</Button>
      </div>
      <Button variant="primary" onClick={() => setImportModalOpen(true)}>
        导入数据
      </Button>
    </div>
  )

  // 渲染灵感卡片（空态/有数据态）
  const renderIdeaCards = () => {
    if (!dataState) {
      return (
        <Card padding="large" className="idea-cards-empty">
          <div className="empty-state">
            <div className="empty-illustration">📊</div>
            <p className="empty-text">数据生成中…</p>
            <p className="empty-subtext">正在努力生成中，请稍后等待…</p>
          </div>
        </Card>
      )
    }

    return (
      <Card padding="large">
        <h2 className="section-title">灵感卡片（卖点×价格×规格）</h2>
        <div className="idea-cards-grid">
          {ideaCards.map((card) => (
            <Card key={card.id} padding="medium" className="idea-card" hoverable>
              <h3 className="idea-card-title">{card.title}</h3>
              <div className="idea-card-tags">
                {card.tags.map((tag, idx) => (
                  <span key={idx} className="idea-tag">{tag}</span>
                ))}
              </div>
              <div className="idea-card-bullets">
                {card.bullets.map((bullet, idx) => (
                  <div key={idx} className="idea-bullet">• {bullet}</div>
                ))}
              </div>
              <div className="idea-card-metrics">
                <div className="idea-metric">
                  <span className="metric-label">综合分</span>
                  <span className="metric-value">{card.metrics.score}</span>
                </div>
                <div className="idea-metric">
                  <span className="metric-label">GMV份额</span>
                  <span className="metric-value">{card.metrics.gmvShare}%</span>
                </div>
                <div className="idea-metric">
                  <span className="metric-label">SPU占比</span>
                  <span className="metric-value">{card.metrics.spuShare}%</span>
                </div>
              </div>
              <div className="idea-card-actions">
                <Button
                  variant="primary"
                  size="small"
                  onClick={() => {
                    setSelectedIdea(card)
                    setIdeaDetailModalOpen(true)
                  }}
                >
                  {card.actions[0]}
                </Button>
                <Button
                  variant="secondary"
                  size="small"
                  disabled={planningIdeas.some(idea => idea.id === card.id)}
                  onClick={() => {
                    // 检查是否已存在，避免重复推送
                    const alreadyPushed = planningIdeas.some(idea => idea.id === card.id)
                    if (!alreadyPushed) {
                      pushIdeaToPlanning({
                        id: card.id,
                        title: card.title,
                        tags: card.tags,
                        summaryBullets: card.bullets,
                        score: card.metrics.score,
                        gmvShare: card.metrics.gmvShare,
                        spuShare: card.metrics.spuShare,
                        opportunityScore: card.metrics.score
                      })
                      setPushToast(card.id)
                      setTimeout(() => setPushToast(null), 2000)
                    }
                  }}
                >
                  {planningIdeas.some(idea => idea.id === card.id) ? '已推送' : '推入新品企划'}
                </Button>
              </div>
            </Card>
          ))}
          <Card padding="medium" className="idea-card-add">
            <div className="add-card-content">
              <div className="add-icon">+</div>
              <p>新增灵感</p>
            </div>
          </Card>
        </div>
      </Card>
    )
  }

  // 渲染KPI卡片
  const renderKPICards = () => (
    <Card padding="large">
      <h2 className="section-title">12月品类大盘（销售额）</h2>
      <div className="kpi-cards-grid">
        {kpiCards.map((kpi, idx) => (
          <Card key={idx} padding="medium" className="kpi-card" hoverable>
            <div className="kpi-label">{kpi.label}</div>
            <div className="kpi-value">
              {typeof kpi.value === 'number' ? kpi.value.toLocaleString('zh-CN') : kpi.value}
              {kpi.unit && <span className="kpi-unit">{kpi.unit}</span>}
            </div>
            <div className="kpi-trend">
              <svg width="60" height="20" viewBox="0 0 60 20" className="trend-sparkline">
                <polyline
                  points="0,15 10,12 20,8 30,10 40,6 50,4 60,2"
                  fill="none"
                  stroke={kpi.trend === 'up' ? '#4caf50' : kpi.trend === 'down' ? '#f44336' : '#999'}
                  strokeWidth="2"
                />
              </svg>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  )

  // 渲染Top机会
  const renderTopOpportunities = () => {
    // Top机会表格暂时不排序，保持原始顺序
    const priceBandData = topOpportunities.priceBandTop
    const specData = topOpportunities.specTop

    return (
      <Card padding="large">
        <h2 className="section-title">Top 机会（综合分）</h2>
        <div className="top-opportunities-container">
          <div className="top-opportunity-block">
            <div className="top-opportunity-header">
              <h3 className="top-opportunity-title">价格带</h3>
              <button
                className="expand-btn"
                onClick={() => {
                  setTopOpportunityType('priceBand')
                  setTopOpportunityModalOpen(true)
                }}
              >
                展开
              </button>
            </div>
            <div className="top-opportunity-table">
              <table>
                <thead>
                  <tr>
                    <th>区间</th>
                    <th>GMV份额</th>
                    <th>SPU占比</th>
                    <th>综合分</th>
                  </tr>
                </thead>
                <tbody>
                  {priceBandData.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.range}</td>
                      <td>
                        <div className="progress-bar-container">
                          <div className="progress-bar" style={{ width: `${item.gmvShare}%` }}>
                            <span className="progress-value">{item.gmvShare}%</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="progress-bar-container">
                          <div className="progress-bar" style={{ width: `${item.spuShare}%` }}>
                            <span className="progress-value">{item.spuShare}%</span>
                          </div>
                        </div>
                      </td>
                      <td>{item.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="top-opportunity-block">
            <div className="top-opportunity-header">
              <h3 className="top-opportunity-title">规格段</h3>
              <button
                className="expand-btn"
                onClick={() => {
                  setTopOpportunityType('spec')
                  setTopOpportunityModalOpen(true)
                }}
              >
                展开
              </button>
            </div>
            <div className="top-opportunity-table">
              <table>
                <thead>
                  <tr>
                    <th>区间</th>
                    <th>GMV份额</th>
                    <th>SPU占比</th>
                    <th>综合分</th>
                  </tr>
                </thead>
                <tbody>
                  {specData.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.range}</td>
                      <td>
                        <div className="progress-bar-container">
                          <div className="progress-bar" style={{ width: `${item.gmvShare}%` }}>
                            <span className="progress-value">{item.gmvShare}%</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="progress-bar-container">
                          <div className="progress-bar" style={{ width: `${item.spuShare}%` }}>
                            <span className="progress-value">{item.spuShare}%</span>
                          </div>
                        </div>
                      </td>
                      <td>{item.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  // 渲染价格带机会表
  const renderPriceBandOpportunity = () => {
    const sortedData = sortConfig?.key && ['priceBand', 'gmvShare', 'spuShare', 'gapIndex', 'score', 'gmv', 'spuCount'].includes(sortConfig.key)
      ? sortData(priceBandOpportunityTable, sortConfig.key, sortConfig.direction)
      : priceBandOpportunityTable

    return (
      <Card padding="large">
        <h2 className="section-title">价格带机会（GMV份额 vs SPU占比）</h2>
        <div className="table-container">
          <table className="opportunity-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('priceBand')}>价格带</th>
                <th onClick={() => handleSort('gmvShare')}>GMV份额</th>
                <th onClick={() => handleSort('spuShare')}>SPU占比</th>
                <th onClick={() => handleSort('gapIndex')}>gapIndex</th>
                <th onClick={() => handleSort('score')}>机会分</th>
                <th onClick={() => handleSort('gmv')}>GMV</th>
                <th onClick={() => handleSort('spuCount')}>SPU数</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.priceBand}</td>
                  <td>
                    <div className="progress-bar-container">
                      <div className="progress-bar" style={{ width: `${row.gmvShare}%` }}>
                        <span className="progress-value">{row.gmvShare}%</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="progress-bar-container">
                      <div className="progress-bar" style={{ width: `${row.spuShare}%` }}>
                        <span className="progress-value">{row.spuShare}%</span>
                      </div>
                    </div>
                  </td>
                  <td>{row.gapIndex > 0 ? `+${row.gapIndex}` : row.gapIndex}</td>
                  <td>{row.score}</td>
                  <td>{row.gmv?.toLocaleString('zh-CN')}</td>
                  <td>{row.spuCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    )
  }

  // 渲染规格机会表
  const renderSpecOpportunity = () => {
    const sortedData = sortConfig?.key && ['spec', 'gmvShare', 'spuShare', 'gapIndex', 'score', 'gmv', 'spuCount'].includes(sortConfig.key)
      ? sortData(specOpportunityTable, sortConfig.key, sortConfig.direction)
      : specOpportunityTable

    return (
      <Card padding="large">
        <h2 className="section-title">规格机会</h2>
        <div className="table-container">
          <table className="opportunity-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('spec')}>规格段</th>
                <th onClick={() => handleSort('gmvShare')}>GMV份额</th>
                <th onClick={() => handleSort('spuShare')}>SPU占比</th>
                <th onClick={() => handleSort('gapIndex')}>gapIndex</th>
                <th onClick={() => handleSort('score')}>机会分</th>
                <th onClick={() => handleSort('gmv')}>GMV</th>
                <th onClick={() => handleSort('spuCount')}>SPU数</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.spec}</td>
                  <td>
                    <div className="progress-bar-container">
                      <div className="progress-bar" style={{ width: `${row.gmvShare}%` }}>
                        <span className="progress-value">{row.gmvShare}%</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="progress-bar-container">
                      <div className="progress-bar" style={{ width: `${row.spuShare}%` }}>
                        <span className="progress-value">{row.spuShare}%</span>
                      </div>
                    </div>
                  </td>
                  <td>{row.gapIndex > 0 ? `+${row.gapIndex}` : row.gapIndex}</td>
                  <td>{row.score}</td>
                  <td>{row.gmv?.toLocaleString('zh-CN')}</td>
                  <td>{row.spuCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    )
  }

  // 渲染卖点×价格带表
  const renderSellingPointPriceBand = () => {
    const sortedData = sortConfig?.key && ['sellingPoint', 'priceBand', 'spec', 'gmvShare', 'spuShare', 'score'].includes(sortConfig.key)
      ? sortData(sellingPointPriceBandTable, sortConfig.key, sortConfig.direction)
      : sellingPointPriceBandTable

    return (
      <Card padding="large">
        <h2 className="section-title">卖点 × 价格带</h2>
        <div className="table-container">
          <table className="opportunity-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('sellingPoint')}>卖点</th>
                <th onClick={() => handleSort('priceBand')}>价格带</th>
                <th onClick={() => handleSort('spec')}>规格段</th>
                <th onClick={() => handleSort('gmvShare')}>GMV份额</th>
                <th onClick={() => handleSort('spuShare')}>SPU占比</th>
                <th onClick={() => handleSort('score')}>机会分</th>
                <th>备注</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.sellingPoint}</td>
                  <td>{row.priceBand}</td>
                  <td>{row.spec}</td>
                  <td>
                    <div className="progress-bar-container">
                      <div className="progress-bar" style={{ width: `${row.gmvShare}%` }}>
                        <span className="progress-value">{row.gmvShare}%</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="progress-bar-container">
                      <div className="progress-bar" style={{ width: `${row.spuShare}%` }}>
                        <span className="progress-value">{row.spuShare}%</span>
                      </div>
                    </div>
                  </td>
                  <td>{row.score}</td>
                  <td>{row.note || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    )
  }

  return (
    <MainLayout>
      <PageHeader
        title="洞察期"
        subtitle="新品灵感洞察器（市场分析）"
        backPath="/stages/overview"
      />
      
      {/* Toast 提示 */}
      {pushToast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#4caf50',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '4px',
          zIndex: 10000,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}>
          已推入新品企划
        </div>
      )}
      
      {/* 筛选栏 */}
      {renderFilterBar()}

      {/* 模块1：灵感卡片 */}
      {renderIdeaCards()}

      {/* 模块2：12月品类大盘 */}
      {dataState && renderKPICards()}

      {/* 模块3：Top 机会 */}
      {dataState && renderTopOpportunities()}

      {/* 模块4：价格带机会 */}
      {dataState && renderPriceBandOpportunity()}

      {/* 模块5：规格机会 */}
      {dataState && renderSpecOpportunity()}

      {/* 模块6：卖点 × 价格带 */}
      {dataState && renderSellingPointPriceBand()}

      {/* 临时开关：用于验收空态（开发时可用） */}
      {import.meta.env.DEV && (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000, padding: '12px', background: 'white', border: '1px solid #ccc', borderRadius: '4px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
            <input
              type="checkbox"
              checked={dataState}
              onChange={(e) => {
                setDataState(e.target.checked)
                setHasData(e.target.checked)
              }}
            />
            有数据态
          </label>
        </div>
      )}

      {/* 弹窗A：导入数据 */}
      <Modal
        open={importModalOpen}
        title="导入数据"
        onClose={() => setImportModalOpen(false)}
      >
        <div className="import-modal-content">
          <div className="upload-area">
            <div className="upload-placeholder">
              <div className="upload-icon">📁</div>
              <p>拖拽文件到此处或点击上传</p>
              <p className="upload-hint">支持 Excel、CSV 格式</p>
            </div>
          </div>
          <div className="import-config">
            <div className="config-item">
              <label>数据类型：</label>
              <select>
                <option>市场数据</option>
                <option>销售数据</option>
                <option>用户数据</option>
              </select>
            </div>
            <div className="config-item">
              <label>平台：</label>
              <select>
                <option>全平台</option>
                <option>抖音</option>
                <option>天猫</option>
                <option>京东</option>
              </select>
            </div>
            <div className="config-item">
              <label>时间窗口：</label>
              <select>
                <option>近30天</option>
                <option>近7天</option>
                <option>近90天</option>
              </select>
            </div>
          </div>
          <div className="import-actions">
            <Button variant="primary" onClick={handleImportData}>确认</Button>
            <Button variant="secondary" onClick={() => setImportModalOpen(false)}>取消</Button>
          </div>
        </div>
      </Modal>

      {/* 弹窗B：Top机会明细 */}
      <Modal
        open={topOpportunityModalOpen}
        title="Top机会明细"
        onClose={() => setTopOpportunityModalOpen(false)}
        width={800}
      >
        <div className="top-opportunity-modal-content">
          <div className="table-container">
            <table className="opportunity-table">
              <thead>
                <tr>
                  <th>区间</th>
                  <th>GMV份额</th>
                  <th>SPU占比</th>
                  <th>综合分</th>
                </tr>
              </thead>
              <tbody>
                {(topOpportunityType === 'priceBand' ? topOpportunityDetails.priceBand : topOpportunityDetails.spec).map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.range}</td>
                    <td>
                      <div className="progress-bar-container">
                        <div className="progress-bar" style={{ width: `${item.gmvShare}%` }}>
                          <span className="progress-value">{item.gmvShare}%</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="progress-bar-container">
                        <div className="progress-bar" style={{ width: `${item.spuShare}%` }}>
                          <span className="progress-value">{item.spuShare}%</span>
                        </div>
                      </div>
                    </td>
                    <td>{item.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>

      {/* 弹窗C：灵感卡详情 */}
      <Modal
        open={ideaDetailModalOpen}
        title="灵感卡详情"
        onClose={() => setIdeaDetailModalOpen(false)}
        width={700}
      >
        {selectedIdea && (
          <div className="idea-detail-modal-content">
            <div className="idea-detail-header">
              <h3>{selectedIdea.title}</h3>
              <div className="idea-detail-tags">
                {selectedIdea.tags.map((tag, idx) => (
                  <span key={idx} className="idea-tag">{tag}</span>
                ))}
              </div>
            </div>
            <div className="idea-detail-bullets">
              <h4>核心要点</h4>
              <ul>
                {selectedIdea.bullets.map((bullet, idx) => (
                  <li key={idx}>{bullet}</li>
                ))}
              </ul>
            </div>
            <div className="idea-detail-metrics">
              <h4>关键指标</h4>
              <table className="idea-metrics-table">
                <thead>
                  <tr>
                    <th>指标</th>
                    <th>数值</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>综合分</td>
                    <td>{selectedIdea.metrics.score}</td>
                  </tr>
                  <tr>
                    <td>GMV份额</td>
                    <td>{selectedIdea.metrics.gmvShare}%</td>
                  </tr>
                  <tr>
                    <td>SPU占比</td>
                    <td>{selectedIdea.metrics.spuShare}%</td>
                  </tr>
                  {selectedIdea.metrics.gapIndex && (
                    <tr>
                      <td>gapIndex</td>
                      <td>{selectedIdea.metrics.gapIndex}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="idea-detail-opportunities">
              <h4>相关机会</h4>
              <table className="idea-opportunities-table">
                <thead>
                  <tr>
                    <th>产品</th>
                    <th>规格</th>
                    <th>价格</th>
                    <th>GMV</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>金典有机纯牛奶 250mL×12盒</td>
                    <td>250mL×12</td>
                    <td>69元</td>
                    <td>125.5万</td>
                  </tr>
                  <tr>
                    <td>安慕希原味 205g×12瓶</td>
                    <td>205g×12</td>
                    <td>59元</td>
                    <td>98.3万</td>
                  </tr>
                  <tr>
                    <td>优酸乳 原味 250mL×12盒</td>
                    <td>250mL×12</td>
                    <td>39元</td>
                    <td>75.6万</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Modal>
    </MainLayout>
  )
}
