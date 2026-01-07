import { useState, useMemo, useCallback } from 'react'
import { Card } from '../ui'
import {
  coldStartTargets,
  insightLogs,
  aiplData,
  flowInData,
  trafficMetrics,
  trafficTrendData,
  gmvMetrics,
  roiMetrics,
  adSpendMetrics,
  efficiencyMetrics,
  badReviewMetrics,
  productsByPlatform,
  marketingPowerItems,
  productPowerItems,
  diagnosisCardsByTab,
  roleAttributionDetails,
  tasks as initialTasks,
  taskStats,
  operationLogs,
  coldStartDays,
  type DiagnosisTab,
  type RoleKey,
  type Task,
  type TaskStatus
} from '../../mock/ecommerceOwnerColdStartFiveScreens'
import './EcommerceOwnerColdStartFiveScreens.css'

export default function EcommerceOwnerColdStartFiveScreens() {
  // 冷启动完成状态
  const [isCompleted, setIsCompleted] = useState(false)
  
  // 洞察日志日期切换
  const [insightDateIndex, setInsightDateIndex] = useState(0)
  const currentInsightLog = insightLogs[insightDateIndex]
  
  // 流量指标展开状态（完成态默认展开）
  const [isTrafficExpanded, setIsTrafficExpanded] = useState(false)
  
  // 成交指标展开状态
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  
  // 货盘平台Tab
  const [productPlatform, setProductPlatform] = useState<'抖音' | '天猫' | '京东'>('抖音')
  
  // 诊断归因Tab
  const [diagnosisTab, setDiagnosisTab] = useState<DiagnosisTab>('平台')
  const [selectedRole, setSelectedRole] = useState<RoleKey>('京东运营')
  
  // 任务Tab
  const [taskTab, setTaskTab] = useState<'我的' | '下属'>('我的')
  
  // 任务拖拽
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)
  const [hoveredTask, setHoveredTask] = useState<string | null>(null)
  
  // 操作记录展开
  const [isLogsExpanded, setIsLogsExpanded] = useState(false)
  
  // 处理冷启动完成点击
  const handleComplete = useCallback(() => {
    if (!isCompleted) {
      setIsCompleted(true)
      setIsTrafficExpanded(true) // 完成态默认展开流量指标
    }
  }, [isCompleted])
  
  // 任务分组
  const taskColumns = useMemo(() => {
    const todo = tasks.filter(t => t.status === 'todo')
    const doing = tasks.filter(t => t.status === 'doing')
    const done = tasks.filter(t => t.status === 'done')
    const todoOverdue = todo.filter(t => t.isOverdue).length
    const doingOverdue = doing.filter(t => t.isOverdue).length
    return { todo, doing, done, todoOverdue, doingOverdue }
  }, [tasks])
  
  // 拖拽处理
  const handleDragStart = (task: Task) => {
    setDraggedTask(task)
  }
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }
  
  const handleDrop = (newStatus: TaskStatus) => {
    if (draggedTask && draggedTask.status !== newStatus) {
      setTasks(prev => prev.map(t => 
        t.id === draggedTask.id ? { ...t, status: newStatus } : t
      ))
    }
    setDraggedTask(null)
  }
  
  // 格式化数值
  const formatNumber = (num: number) => num.toLocaleString('zh-CN')
  const formatMoney = (num: number) => `¥${formatNumber(num)}`
  const formatPercent = (num: number) => `${num.toFixed(1)}%`

  // ==================== 屏1：冷启动目标 + 洞察日志 ====================
  const renderScreen1 = () => (
    <div className="ecom-cs-screen ecom-cs-screen1">
      {/* 顶部状态栏 */}
      <div className="ecom-cs-status-bar">
        <div className="ecom-cs-status-text">
          {isCompleted ? (
            <>新品试销累计 <span className="highlight">{coldStartDays}</span> 天</>
          ) : (
            <>新品启动第 <span className="highlight">{coldStartDays}</span> 天</>
          )}
        </div>
        <button 
          className={`ecom-cs-complete-btn ${isCompleted ? 'completed' : ''}`}
          onClick={handleComplete}
          disabled={isCompleted}
        >
          冷启动完成
        </button>
      </div>
      
      {/* 第一行两列卡片 */}
      <div className="ecom-cs-row">
        {/* 左卡：冷启动目标 */}
        <Card className="ecom-cs-card ecom-cs-target-card">
          <h3 className="ecom-cs-card-title">冷启动目标</h3>
          <div className="ecom-cs-targets">
            {coldStartTargets.map((target, idx) => (
              <div key={idx} className="ecom-cs-target-item">
                <div className="ecom-cs-target-label">{target.label}</div>
                <div className="ecom-cs-target-progress-wrap">
                  <div className="ecom-cs-target-progress">
                    <div 
                      className="ecom-cs-target-progress-fill"
                      style={{ width: `${target.percent}%` }}
                    />
                  </div>
                  {idx === 0 && (
                    <div className="ecom-cs-target-tooltip">
                      <div className="tooltip-row">
                        <span>购买人数：</span>
                        <span>{formatNumber(target.current)}</span>
                      </div>
                      <div className="tooltip-row">
                        <span>目标人数：</span>
                        <span>{formatNumber(target.target)}</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="ecom-cs-target-values">
                  <span className="current">
                    {target.unit === '元' ? formatMoney(target.current) : 
                     target.unit === '' ? target.current.toFixed(1) : 
                     formatNumber(target.current)}
                  </span>
                  <span className="separator">/</span>
                  <span className="target">
                    {target.unit === '元' ? formatMoney(target.target) : 
                     target.unit === '' ? target.target.toFixed(1) : 
                     formatNumber(target.target)}
                  </span>
                  <span className="percent">{target.percent}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        {/* 右卡：洞察日志 */}
        <Card className="ecom-cs-card ecom-cs-insight-card">
          <div className="ecom-cs-insight-header">
            <button 
              className="ecom-cs-insight-arrow"
              onClick={() => setInsightDateIndex(Math.max(0, insightDateIndex - 1))}
              disabled={insightDateIndex === 0}
            >
              ‹
            </button>
            <span className="ecom-cs-insight-date">{currentInsightLog.date}</span>
            <button 
              className="ecom-cs-insight-arrow"
              onClick={() => setInsightDateIndex(Math.min(insightLogs.length - 1, insightDateIndex + 1))}
              disabled={insightDateIndex === insightLogs.length - 1}
            >
              ›
            </button>
          </div>
          <div className="ecom-cs-insight-content">
            {currentInsightLog.insights.map((insight, idx) => (
              <div key={idx} className="ecom-cs-insight-item">
                <span className="platform">{insight.platform}</span>
                <span className="text">
                  {insight.metric} {insight.change.startsWith('-') || insight.change.includes('不足') ? '落后' : ''}
                  （{insight.change}），归因：{insight.reason}。
                </span>
              </div>
            ))}
          </div>
          <div className="ecom-cs-insight-footer">
            <button className="ecom-cs-insight-more-btn">查看更多</button>
          </div>
        </Card>
      </div>
      
      {/* 第二行两列卡片 */}
      <div className="ecom-cs-row">
        {/* 左卡：AIPL人群流转 */}
        <Card className="ecom-cs-card ecom-cs-aipl-card">
          <h3 className="ecom-cs-card-title">AIPL 人群流转（天猫·按所选 SPU）</h3>
          <div className="ecom-cs-aipl-bars">
            {aiplData.map((item, idx) => (
              <div key={idx} className="ecom-cs-aipl-item">
                <div className="ecom-cs-aipl-label">
                  <span className="stage" style={{ color: item.color }}>{item.stage}</span>
                  <span className="name">{item.label}</span>
                </div>
                <div className="ecom-cs-aipl-bar">
                  <div 
                    className="ecom-cs-aipl-bar-fill"
                    style={{ 
                      width: `${(item.value / aiplData[0].value) * 100}%`,
                      backgroundColor: item.color 
                    }}
                  />
                </div>
                <div className="ecom-cs-aipl-value">{formatNumber(item.value)}</div>
              </div>
            ))}
          </div>
          <div className="ecom-cs-aipl-flows">
            {flowInData.map((flow, idx) => (
              <div key={idx} className="ecom-cs-aipl-flow-pill">
                {flow.label} {formatPercent(flow.percent)}
              </div>
            ))}
          </div>
        </Card>
        
        {/* 右卡：其他指标-流量 */}
        <Card className="ecom-cs-card ecom-cs-traffic-card">
          <h3 className="ecom-cs-card-title">其他指标</h3>
          <h4 className="ecom-cs-card-subtitle">流量</h4>
          <div className="ecom-cs-traffic-metrics">
            {trafficMetrics.map((metric, idx) => (
              <div key={idx} className="ecom-cs-traffic-metric">
                <div className="metric-label">{metric.label}</div>
                <div className="metric-value">{formatNumber(metric.value)}</div>
                <div className={`metric-delta ${metric.trend}`}>
                  <span className="arrow">{metric.trend === 'up' ? '↑' : '↓'}</span>
                  {metric.trend === 'up' ? '+' : ''}{formatNumber(metric.delta)}
                  ({metric.deltaPercent}%)
                </div>
              </div>
            ))}
          </div>
          <div className="ecom-cs-traffic-divider" />
          <button 
            className="ecom-cs-expand-btn"
            onClick={() => setIsTrafficExpanded(!isTrafficExpanded)}
          >
            {isTrafficExpanded ? '收起流量指标' : '展开流量指标'}
          </button>
          {isTrafficExpanded && (
            <div className="ecom-cs-traffic-chart">
              <div className="ecom-cs-chart-legend">
                <span className="legend-item douyin">抖音</span>
                <span className="legend-item tmall">天猫</span>
                <span className="legend-item jd">京东</span>
              </div>
              <div className="ecom-cs-chart-area">
                {/* 简化的折线图SVG */}
                <svg viewBox="0 0 400 120" className="ecom-cs-line-chart">
                  {/* 抖音线 */}
                  <polyline
                    points={trafficTrendData.map((d, i) => 
                      `${i * 100},${120 - (d.douyin / 2000)}`
                    ).join(' ')}
                    fill="none"
                    stroke="#ff4d4f"
                    strokeWidth="2"
                  />
                  {/* 天猫线 */}
                  <polyline
                    points={trafficTrendData.map((d, i) => 
                      `${i * 100},${120 - (d.tmall / 2000)}`
                    ).join(' ')}
                    fill="none"
                    stroke="#ff7a00"
                    strokeWidth="2"
                  />
                  {/* 京东线 */}
                  <polyline
                    points={trafficTrendData.map((d, i) => 
                      `${i * 100},${120 - (d.jd / 2000)}`
                    ).join(' ')}
                    fill="none"
                    stroke="#e4393c"
                    strokeWidth="2"
                  />
                </svg>
                <div className="ecom-cs-chart-xaxis">
                  {trafficTrendData.map((d, i) => (
                    <span key={i}>{d.date}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )

  // ==================== 屏2：成交指标 ====================
  const renderScreen2 = () => (
    <div className="ecom-cs-screen ecom-cs-screen2">
      <h2 className="ecom-cs-section-title">成交指标</h2>
      <div className="ecom-cs-row">
        {/* 左大卡：GMV/ROI/广告消耗 */}
        <Card className="ecom-cs-card ecom-cs-sales-card">
          {/* GMV */}
          <div className="ecom-cs-metric-section">
            <h4 className="section-label">GMV</h4>
            <div className="ecom-cs-platform-metrics">
              {gmvMetrics.map((m, idx) => (
                <div key={idx} className="ecom-cs-platform-metric">
                  <div className="platform-name">{m.platform}</div>
                  <div className="platform-value">{formatMoney(m.value)}</div>
                  <div className={`platform-delta ${m.trend}`}>
                    {m.trend === 'up' ? '+' : ''}{formatMoney(m.delta)}
                    ({m.deltaPercent}%)
                  </div>
                </div>
              ))}
            </div>
            <button 
              className="ecom-cs-expand-detail-btn"
              onClick={() => {
                const newSet = new Set(expandedSections)
                newSet.has('gmv') ? newSet.delete('gmv') : newSet.add('gmv')
                setExpandedSections(newSet)
              }}
            >
              {expandedSections.has('gmv') ? '收起平台明细' : '展开平台明细'}
            </button>
          </div>
          
          {/* ROI */}
          <div className="ecom-cs-metric-section">
            <h4 className="section-label">ROI</h4>
            <div className="ecom-cs-platform-metrics">
              {roiMetrics.map((m, idx) => (
                <div key={idx} className="ecom-cs-platform-metric">
                  <div className="platform-name">{m.platform}</div>
                  <div className="platform-value">{m.value.toFixed(1)}</div>
                  <div className={`platform-delta ${m.trend}`}>
                    {m.trend === 'up' ? '+' : ''}{m.delta.toFixed(1)}
                    ({m.deltaPercent}%)
                  </div>
                </div>
              ))}
            </div>
            <button 
              className="ecom-cs-expand-detail-btn"
              onClick={() => {
                const newSet = new Set(expandedSections)
                newSet.has('roi') ? newSet.delete('roi') : newSet.add('roi')
                setExpandedSections(newSet)
              }}
            >
              {expandedSections.has('roi') ? '收起平台明细' : '展开平台明细'}
            </button>
          </div>
          
          {/* 广告消耗 */}
          <div className="ecom-cs-metric-section">
            <h4 className="section-label">广告消耗</h4>
            <div className="ecom-cs-platform-metrics">
              {adSpendMetrics.map((m, idx) => (
                <div key={idx} className="ecom-cs-platform-metric">
                  <div className="platform-name">{m.platform}</div>
                  <div className="platform-value">{formatMoney(m.value)}</div>
                  <div className={`platform-delta ${m.trend}`}>
                    {m.trend === 'up' ? '+' : ''}{formatMoney(m.delta)}
                    ({m.deltaPercent}%)
                  </div>
                </div>
              ))}
            </div>
            <button 
              className="ecom-cs-expand-detail-btn"
              onClick={() => {
                const newSet = new Set(expandedSections)
                newSet.has('adSpend') ? newSet.delete('adSpend') : newSet.add('adSpend')
                setExpandedSections(newSet)
              }}
            >
              {expandedSections.has('adSpend') ? '收起平台明细' : '展开平台明细'}
            </button>
          </div>
        </Card>
        
        {/* 右大卡：效率 + 近30天差评率 */}
        <Card className="ecom-cs-card ecom-cs-efficiency-card">
          {/* 效率 */}
          <div className="ecom-cs-metric-section">
            <h4 className="section-label">效率</h4>
            <div className="ecom-cs-efficiency-metrics">
              {efficiencyMetrics.map((m, idx) => (
                <div key={idx} className="ecom-cs-efficiency-metric">
                  <div className="metric-label">{m.label}</div>
                  <div className="metric-value">{m.value}{m.unit}</div>
                  <div className={`metric-delta ${m.trend}`}>
                    {m.trend === 'up' ? '+' : ''}{m.delta}{m.unit}
                    ({m.deltaPercent}%)
                  </div>
                </div>
              ))}
            </div>
            <button 
              className="ecom-cs-expand-detail-btn"
              onClick={() => {
                const newSet = new Set(expandedSections)
                newSet.has('efficiency') ? newSet.delete('efficiency') : newSet.add('efficiency')
                setExpandedSections(newSet)
              }}
            >
              {expandedSections.has('efficiency') ? '收起平台明细' : '展开平台明细'}
            </button>
          </div>
          
          {/* 近30天差评率 */}
          <div className="ecom-cs-metric-section">
            <h4 className="section-label">近30天差评率</h4>
            <div className="ecom-cs-platform-metrics">
              {badReviewMetrics.map((m, idx) => (
                <div key={idx} className="ecom-cs-platform-metric">
                  <div className="platform-name">{m.platform}</div>
                  <div className="platform-value">{m.value}%</div>
                  <div className={`platform-delta ${m.trend === 'down' ? 'up' : 'down'}`}>
                    {m.trend === 'down' ? '-' : '+'}{Math.abs(m.delta)}%
                    ({m.deltaPercent}%)
                  </div>
                </div>
              ))}
            </div>
            <button 
              className="ecom-cs-expand-detail-btn"
              onClick={() => {
                const newSet = new Set(expandedSections)
                newSet.has('badReview') ? newSet.delete('badReview') : newSet.add('badReview')
                setExpandedSections(newSet)
              }}
            >
              {expandedSections.has('badReview') ? '收起平台明细' : '展开平台明细'}
            </button>
          </div>
        </Card>
      </div>
    </div>
  )

  // ==================== 屏3：货盘模块 ====================
  const renderScreen3 = () => (
    <div className="ecom-cs-screen ecom-cs-screen3">
      <div className="ecom-cs-section-header">
        <h2 className="ecom-cs-section-title">货盘</h2>
        <div className="ecom-cs-platform-tabs">
          {(['抖音', '天猫', '京东'] as const).map(p => (
            <button
              key={p}
              className={`platform-tab ${productPlatform === p ? 'active' : ''}`}
              onClick={() => setProductPlatform(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      
      {/* 商品表格 */}
      <Card className="ecom-cs-card ecom-cs-product-table-card">
        <table className="ecom-cs-product-table">
          <thead>
            <tr>
              <th>商品标题</th>
              <th>销售额</th>
              <th>占比</th>
              <th>客单价</th>
            </tr>
          </thead>
          <tbody>
            {productsByPlatform[productPlatform].map(product => (
              <tr key={product.id}>
                <td className="product-title">{product.title}</td>
                <td>{formatMoney(product.sales)}</td>
                <td>{formatPercent(product.share)}</td>
                <td>¥{product.avgPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      
      {/* 对比卡片 */}
      <div className="ecom-cs-row ecom-cs-compare-row">
        {/* 营销力对比 */}
        <Card className="ecom-cs-card ecom-cs-compare-card">
          <h4 className="compare-title">事业部新品营销力vs</h4>
          <div className="compare-score">
            <span className="score-label">总分</span>
            <div className="score-bar">
              <div className="score-bar-fill" style={{ width: '80%' }} />
            </div>
            <span className="score-value">80/100</span>
          </div>
          <div className="compare-items">
            {marketingPowerItems.map((item, idx) => (
              <div key={idx} className="compare-item">
                <span className="item-label">{item.label}</span>
                <div className="item-bars">
                  <div className="item-bar mine" style={{ width: `${item.score}%` }} />
                  <div className="item-bar benchmark" style={{ width: `${item.benchmark}%` }} />
                </div>
                <span className="item-score">{item.score}</span>
              </div>
            ))}
          </div>
          <div className="compare-legend">
            <span className="legend-mine">本品</span>
            <span className="legend-benchmark">基准</span>
          </div>
        </Card>
        
        {/* 产品力对比 */}
        <Card className="ecom-cs-card ecom-cs-compare-card">
          <h4 className="compare-title">事业部产品力vs</h4>
          <div className="compare-score">
            <span className="score-label">总分</span>
            <div className="score-bar">
              <div className="score-bar-fill" style={{ width: '77%' }} />
            </div>
            <span className="score-value">77/100</span>
          </div>
          <div className="compare-items">
            {productPowerItems.map((item, idx) => (
              <div key={idx} className="compare-item">
                <span className="item-label">{item.label}</span>
                <div className="item-bars">
                  <div className="item-bar mine" style={{ width: `${item.score}%` }} />
                  <div className="item-bar benchmark" style={{ width: `${item.benchmark}%` }} />
                </div>
                <span className="item-score">{item.score}</span>
              </div>
            ))}
          </div>
          <div className="compare-legend">
            <span className="legend-mine">本品</span>
            <span className="legend-benchmark">基准</span>
          </div>
        </Card>
      </div>
    </div>
  )

  // ==================== 屏4：诊断归因模块 ====================
  const renderScreen4 = () => (
    <div className="ecom-cs-screen ecom-cs-screen4">
      <div className="ecom-cs-section-header">
        <h2 className="ecom-cs-section-title">诊断归因</h2>
        <div className="ecom-cs-diagnosis-tabs">
          {(['平台', '流量', '转化', '货组', '费比'] as DiagnosisTab[]).map(tab => (
            <button
              key={tab}
              className={`diagnosis-tab ${diagnosisTab === tab ? 'active' : ''}`}
              onClick={() => setDiagnosisTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      
      {/* 诊断卡片网格 */}
      <div className="ecom-cs-diagnosis-grid">
        {diagnosisCardsByTab[diagnosisTab].map(card => (
          <Card key={card.id} className={`ecom-cs-diagnosis-card severity-${card.severity}`}>
            <div className="diagnosis-card-header">
              <div className="diagnosis-card-left">
                <span className={`severity-dot ${card.severity}`} />
                <span className="diagnosis-title">{card.title}</span>
              </div>
              <span className="diagnosis-tag">{card.tag}</span>
            </div>
            <p className="diagnosis-desc">{card.description}</p>
            <div className="diagnosis-pills">
              {card.pills.map((pill, idx) => (
                <span key={idx} className="diagnosis-pill">{pill}</span>
              ))}
            </div>
            <ul className="diagnosis-suggestions">
              {card.suggestions.map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ul>
            <button className="diagnosis-action-btn">转为任务卡</button>
          </Card>
        ))}
      </div>
      
      {/* 严重级图例 */}
      <div className="ecom-cs-severity-legend">
        <span className="legend-item success"><span className="dot" />正常</span>
        <span className="legend-item warning"><span className="dot" />关注</span>
        <span className="legend-item error"><span className="dot" />高风险</span>
      </div>
      
      {/* 角色归因详情 */}
      <div className="ecom-cs-role-attribution">
        <div className="role-attribution-header">
          <select className="attribution-select">
            <option>诊断归因</option>
          </select>
          <div className="role-tabs">
            {(Object.keys(roleAttributionDetails) as RoleKey[]).map(role => (
              <button
                key={role}
                className={`role-tab ${selectedRole === role ? 'active' : ''}`}
                onClick={() => setSelectedRole(role)}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
        <Card className="ecom-cs-card ecom-cs-attribution-detail-card">
          <ul className="attribution-bullets">
            {roleAttributionDetails[selectedRole].map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )

  // ==================== 屏5：任务模块 ====================
  const renderScreen5 = () => (
    <div className="ecom-cs-screen ecom-cs-screen5">
      <div className="ecom-cs-section-header">
        <div className="task-header-left">
          <h2 className="ecom-cs-section-title">任务</h2>
          <div className="task-stats">
            <span>总任务：<strong>{taskStats.total}</strong></span>
            <span>完成任务：<strong>{taskStats.completed}</strong></span>
            <span>超时任务：<strong className="overdue">{taskStats.overdue}</strong></span>
          </div>
        </div>
        <div className="task-tabs">
          <button
            className={`task-tab ${taskTab === '我的' ? 'active' : ''}`}
            onClick={() => setTaskTab('我的')}
          >
            我的
          </button>
          <button
            className={`task-tab ${taskTab === '下属' ? 'active' : ''}`}
            onClick={() => setTaskTab('下属')}
          >
            下属
          </button>
        </div>
      </div>
      
      {/* 任务看板 */}
      <div className="ecom-cs-task-kanban">
        {/* 待处理 */}
        <div 
          className="kanban-column"
          onDragOver={handleDragOver}
          onDrop={() => handleDrop('todo')}
        >
          <div className="kanban-column-header">
            <span className="column-title">待处理（{taskColumns.todo.length}）</span>
            {taskColumns.todoOverdue > 0 && (
              <span className="overdue-badge">已超时：{taskColumns.todoOverdue}</span>
            )}
          </div>
          <div className="kanban-cards">
            {taskColumns.todo.map(task => (
              <div
                key={task.id}
                className={`kanban-card ${task.isOverdue ? 'overdue' : ''}`}
                draggable
                onDragStart={() => handleDragStart(task)}
                onMouseEnter={() => setHoveredTask(task.id)}
                onMouseLeave={() => setHoveredTask(null)}
              >
                <div className="card-title">{task.title}</div>
                <div className="card-desc">{task.description}</div>
                <div className={`card-date ${task.isOverdue ? 'overdue' : ''}`}>
                  {task.dueDate}
                </div>
                {hoveredTask === task.id && (
                  <div className="task-tooltip">
                    <div className="tooltip-title">{task.title}</div>
                    <div className="tooltip-desc">{task.description}</div>
                    <div className="tooltip-date">到期日期：{task.dueDate}</div>
                  </div>
                )}
              </div>
            ))}
            {draggedTask && draggedTask.status !== 'todo' && (
              <div className="drop-zone">拖放到此处</div>
            )}
          </div>
        </div>
        
        {/* 进行中 */}
        <div 
          className="kanban-column"
          onDragOver={handleDragOver}
          onDrop={() => handleDrop('doing')}
        >
          <div className="kanban-column-header">
            <span className="column-title">进行中（{taskColumns.doing.length}）</span>
            {taskColumns.doingOverdue > 0 && (
              <span className="overdue-badge">已超时：{taskColumns.doingOverdue}</span>
            )}
          </div>
          <div className="kanban-cards">
            {taskColumns.doing.map(task => (
              <div
                key={task.id}
                className={`kanban-card ${task.isOverdue ? 'overdue' : ''}`}
                draggable
                onDragStart={() => handleDragStart(task)}
                onMouseEnter={() => setHoveredTask(task.id)}
                onMouseLeave={() => setHoveredTask(null)}
              >
                <div className="card-title">{task.title}</div>
                <div className="card-desc">{task.description}</div>
                <div className={`card-date ${task.isOverdue ? 'overdue' : ''}`}>
                  {task.dueDate}
                </div>
                {hoveredTask === task.id && (
                  <div className="task-tooltip">
                    <div className="tooltip-title">{task.title}</div>
                    <div className="tooltip-desc">{task.description}</div>
                    <div className="tooltip-date">到期日期：{task.dueDate}</div>
                  </div>
                )}
              </div>
            ))}
            {draggedTask && draggedTask.status !== 'doing' && (
              <div className="drop-zone">拖放到此处</div>
            )}
          </div>
        </div>
        
        {/* 已完成 */}
        <div 
          className="kanban-column"
          onDragOver={handleDragOver}
          onDrop={() => handleDrop('done')}
        >
          <div className="kanban-column-header">
            <span className="column-title">已完成（{taskColumns.done.length}）</span>
          </div>
          <div className="kanban-cards">
            {taskColumns.done.map(task => (
              <div
                key={task.id}
                className="kanban-card done"
                draggable
                onDragStart={() => handleDragStart(task)}
                onMouseEnter={() => setHoveredTask(task.id)}
                onMouseLeave={() => setHoveredTask(null)}
              >
                <div className="card-title">{task.title}</div>
                <div className="card-desc">{task.description}</div>
                <div className="card-date">{task.dueDate}</div>
                {hoveredTask === task.id && (
                  <div className="task-tooltip">
                    <div className="tooltip-title">{task.title}</div>
                    <div className="tooltip-desc">{task.description}</div>
                    <div className="tooltip-date">到期日期：{task.dueDate}</div>
                  </div>
                )}
              </div>
            ))}
            {draggedTask && draggedTask.status !== 'done' && (
              <div className="drop-zone">拖放到此处</div>
            )}
          </div>
        </div>
      </div>
      
      {/* 操作记录 */}
      <div className="ecom-cs-operation-logs">
        <button 
          className="logs-toggle-btn"
          onClick={() => setIsLogsExpanded(!isLogsExpanded)}
        >
          操作记录 {isLogsExpanded ? '▲' : '▼'}
        </button>
        {isLogsExpanded && (
          <Card className="ecom-cs-card ecom-cs-logs-card">
            <div className="logs-list">
              {operationLogs.map((log, idx) => (
                <div key={idx} className="log-item">
                  <span className="log-time">{log.time}</span>
                  <span className="log-action">{log.action}</span>
                  <span className="log-operator">{log.operator}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  )

  return (
    <div className="ecom-cs-five-screens">
      {renderScreen1()}
      {renderScreen2()}
      {renderScreen3()}
      {renderScreen4()}
      {renderScreen5()}
    </div>
  )
}


