import { useState, useMemo } from 'react'
import { Card, Tabs } from '../ui'
import {
  coldStartTargets,
  insightLogs,
  keyMetrics,
  operationInsightData,
  marketingPowerVS,
  productPowerVS,
  consumerProfiles,
  diagnosisData,
  tasks,
  taskStats,
  type InsightLog,
  type DiagnosisTab
} from '../../mock/brandOwnerColdStartFiveScreens'
import './BrandOwnerColdStartFiveScreens.css'

interface Props {
  dateA?: string
  dateB?: string
}

export default function BrandOwnerColdStartFiveScreens({ dateA, dateB }: Props) {
  // 屏1：洞察日志日期切换
  const [insightDateIndex, setInsightDateIndex] = useState(0)
  const currentInsightLog = insightLogs[insightDateIndex]

  // 屏2：关键指标展开状态
  const [expandedMetrics, setExpandedMetrics] = useState<Set<string>>(new Set())

  // 屏3：消费者画像平台切换
  const [profilePlatform, setProfilePlatform] = useState<'抖音' | '天猫' | '京东'>('抖音')

  // 屏4：诊断归因Tab
  const [diagnosisTab, setDiagnosisTab] = useState<DiagnosisTab>('产品')

  // 屏5：任务详情hover
  const [hoveredTask, setHoveredTask] = useState<string | null>(null)

  // 计算任务统计
  const taskColumns = useMemo(() => {
    const todo = tasks.filter(t => t.status === 'todo')
    const doing = tasks.filter(t => t.status === 'doing')
    const done = tasks.filter(t => t.status === 'done')
    return { todo, doing, done }
  }, [])

  // 屏1：冷启动目标 + 洞察日志
  const renderScreen1 = () => (
    <div className="screen-1-container">
      <div className="screen-1-left">
        <Card padding="large">
          <h2 className="section-title">冷启动目标</h2>
          <div className="target-progress-list">
            {coldStartTargets.map((target, idx) => {
              const progress = target.target > 0 ? (target.current / target.target) * 100 : 0
              return (
                <div key={idx} className="target-progress-item">
                  <div className="target-progress-header">
                    <span className="target-label">{target.label}</span>
                    <span className="target-value">
                      {target.current.toLocaleString('zh-CN')}{target.unit} / {target.target.toLocaleString('zh-CN')}{target.unit}
                    </span>
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
      <div className="screen-1-right">
        <Card padding="large" className="insight-log-card">
          <div className="insight-log-header">
            <button
              className="insight-date-nav"
              onClick={() => setInsightDateIndex((idx) => (idx + 1) % insightLogs.length)}
            >
              &lt;
            </button>
            <span className="insight-date">{currentInsightLog.date}</span>
            <button
              className="insight-date-nav"
              onClick={() => setInsightDateIndex((idx) => (idx - 1 + insightLogs.length) % insightLogs.length)}
            >
              &gt;
            </button>
          </div>
          <div className="insight-log-content">
            {currentInsightLog.insights.map((insight, idx) => (
              <div key={idx} className="insight-log-item">
                <span className="insight-platform">{insight.platform}</span>
                <span className="insight-metric">{insight.metric}</span>
                <span className={`insight-change ${insight.change.startsWith('-') ? 'negative' : ''}`}>
                  {insight.change}
                </span>
                <span className="insight-reason">，归因：{insight.reason}</span>
              </div>
            ))}
          </div>
          <div className="insight-log-footer">
            <button className="insight-more-btn">查看更多</button>
          </div>
        </Card>
      </div>
    </div>
  )

  // 屏2：关键指标
  const renderScreen2 = () => (
    <div className="screen-2-container">
      <Card padding="large">
        <h2 className="section-title">关键指标</h2>
        {keyMetrics.map((metric, idx) => {
          const isExpanded = expandedMetrics.has(metric.name)
          return (
            <div key={idx} className="key-metric-group">
              <div className="key-metric-header">
                <h3 className="key-metric-name">{metric.name}</h3>
              </div>
              <div className="key-metric-platforms">
                {(['douyin', 'tmall', 'jd'] as const).map((platform) => {
                  const platformData = metric.platforms[platform]
                  const platformName = platform === 'douyin' ? '抖音' : platform === 'tmall' ? '天猫' : '京东'
                  const isPositive = platformData.delta >= 0
                  return (
                    <div key={platform} className="key-metric-platform">
                      <div className="key-metric-value">{platformData.value.toLocaleString('zh-CN')}</div>
                      <div className={`key-metric-delta ${isPositive ? 'positive' : 'negative'}`}>
                        {isPositive ? '↑' : '↓'} {Math.abs(platformData.delta).toLocaleString('zh-CN')} ({isPositive ? '+' : ''}{platformData.deltaPercent.toFixed(1)}%)
                      </div>
                    </div>
                  )
                })}
              </div>
              <div
                className="key-metric-expand"
                onClick={() => {
                  const newExpanded = new Set(expandedMetrics)
                  if (isExpanded) {
                    newExpanded.delete(metric.name)
                  } else {
                    newExpanded.add(metric.name)
                  }
                  setExpandedMetrics(newExpanded)
                }}
              >
                {isExpanded ? '收起平台明细' : '展开平台明细'}
              </div>
              {isExpanded && (
                <div className="key-metric-charts">
                  <div className="key-metric-bar-chart">
                    <h4>平台对比</h4>
                    <div className="bar-chart-container">
                      {(['douyin', 'tmall', 'jd'] as const).map((platform) => {
                        const platformData = metric.platforms[platform]
                        const platformName = platform === 'douyin' ? '抖音' : platform === 'tmall' ? '天猫' : '京东'
                        const maxValue = Math.max(...Object.values(metric.platforms).map(p => p.value))
                        const width = maxValue > 0 ? (platformData.value / maxValue) * 100 : 0
                        return (
                          <div key={platform} className="bar-chart-item">
                            <div className="bar-label">{platformName}</div>
                            <div className="bar-container">
                              <div
                                className={`bar-fill bar-fill-${platform}`}
                                style={{ width: `${width}%` }}
                              >
                                <span className="bar-value">{platformData.value.toLocaleString('zh-CN')}</span>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  {metric.name !== '近30天差评率' && (
                    <div className="key-metric-trend-chart">
                      <h4>趋势图</h4>
                      <div className="trend-chart-container">
                        <div className="trend-legend">
                          <span className="legend-item legend-douyin">抖音</span>
                          <span className="legend-item legend-tmall">天猫</span>
                          <span className="legend-item legend-jd">京东</span>
                        </div>
                        <div className="trend-lines">
                          {metric.trendData.map((point, pIdx) => (
                            <div key={pIdx} className="trend-point">
                              <div className="trend-date">{point.date.slice(5)}</div>
                              <div className="trend-values">
                                <div className="trend-value trend-douyin" style={{ height: `${(point.douyin / Math.max(...metric.trendData.map(p => Math.max(p.douyin, p.tmall, p.jd)))) * 100}%` }}>
                                  {point.douyin.toLocaleString('zh-CN')}
                                </div>
                                <div className="trend-value trend-tmall" style={{ height: `${(point.tmall / Math.max(...metric.trendData.map(p => Math.max(p.douyin, p.tmall, p.jd)))) * 100}%` }}>
                                  {point.tmall.toLocaleString('zh-CN')}
                                </div>
                                <div className="trend-value trend-jd" style={{ height: `${(point.jd / Math.max(...metric.trendData.map(p => Math.max(p.douyin, p.tmall, p.jd)))) * 100}%` }}>
                                  {point.jd.toLocaleString('zh-CN')}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </Card>
    </div>
  )

  // 屏3：经营洞察 + VS卡 + 消费者画像
  const renderScreen3 = () => {
    const currentProfile = consumerProfiles.find(p => p.platform === profilePlatform) || consumerProfiles[0]
    
    return (
      <div className="screen-3-container">
        {/* 经营洞察表格 */}
        <Card padding="large">
          <div className="operation-insight-header">
            <h2 className="section-title">经营洞察</h2>
            <span className="insight-note">CPM=消耗/曝光量*1000</span>
          </div>
          <div className="table-container">
            <table className="operation-insight-table">
              <thead>
                <tr>
                  <th>平台</th>
                  <th>GMV</th>
                  <th>费比</th>
                  <th>退款率</th>
                  <th>转化成本</th>
                  <th>CPM</th>
                  <th>曝光成本</th>
                  <th>说明</th>
                </tr>
              </thead>
              <tbody>
                {operationInsightData.map((row, idx) => (
                  <tr key={idx} className={row.platform === '汇总' ? 'summary-row' : ''}>
                    <td>{row.platform}</td>
                    <td>{row.gmv.toLocaleString('zh-CN')}</td>
                    <td>{row.costRatio.toFixed(1)}%</td>
                    <td>{row.refundRate.toFixed(1)}%</td>
                    <td>{row.conversionCost.toFixed(1)}</td>
                    <td>{row.cpm.toFixed(1)}</td>
                    <td>{row.exposureCost.toFixed(4)}</td>
                    <td>{row.note || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* VS卡 */}
        <div className="vs-cards-container">
          <Card padding="large" className="vs-card">
            <div className="vs-card-header">
              <h3 className="vs-card-title">{marketingPowerVS.title}</h3>
              <div className="vs-card-score">
                {marketingPowerVS.totalScore}/{marketingPowerVS.maxScore}
              </div>
            </div>
            <div className="vs-card-progress">
              <div
                className="vs-card-progress-bar"
                style={{ width: `${(marketingPowerVS.totalScore / marketingPowerVS.maxScore) * 100}%` }}
              />
            </div>
            <div className="vs-card-chart">
              {marketingPowerVS.dimensions.map((dim, idx) => (
                <div key={idx} className="vs-dimension-item">
                  <div className="vs-dimension-label">{dim.name}</div>
                  <div className="vs-dimension-bar">
                    <div
                      className="vs-dimension-fill"
                      style={{ width: `${dim.score}%` }}
                    >
                      <span className="vs-dimension-value">{dim.score}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card padding="large" className="vs-card">
            <div className="vs-card-header">
              <h3 className="vs-card-title">{productPowerVS.title}</h3>
              <div className="vs-card-score">
                {productPowerVS.totalScore}/{productPowerVS.maxScore}
              </div>
            </div>
            <div className="vs-card-progress">
              <div
                className="vs-card-progress-bar"
                style={{ width: `${(productPowerVS.totalScore / productPowerVS.maxScore) * 100}%` }}
              />
            </div>
            <div className="vs-card-chart">
              {productPowerVS.dimensions.map((dim, idx) => (
                <div key={idx} className="vs-dimension-item">
                  <div className="vs-dimension-label">{dim.name}</div>
                  <div className="vs-dimension-bar">
                    <div
                      className="vs-dimension-fill"
                      style={{ width: `${dim.score}%` }}
                    >
                      <span className="vs-dimension-value">{dim.score}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* 消费者画像 */}
        <Card padding="large">
          <div className="consumer-profile-header">
            <h2 className="section-title">消费者画像</h2>
            <Tabs
              items={[
                { key: '抖音', label: '抖音' },
                { key: '天猫', label: '天猫' },
                { key: '京东', label: '京东' }
              ]}
              activeKey={profilePlatform}
              onChange={(key) => setProfilePlatform(key as '抖音' | '天猫' | '京东')}
            />
          </div>
          <div className="consumer-profile-content">
            <div className="profile-gender">
              <h4>性别</h4>
              <div className="gender-chart">
                <div className="gender-item">
                  <div className="gender-label">男</div>
                  <div className="gender-bar">
                    <div
                      className="gender-fill gender-male"
                      style={{ width: `${currentProfile.gender.male}%` }}
                    >
                      {currentProfile.gender.male}%
                    </div>
                  </div>
                </div>
                <div className="gender-item">
                  <div className="gender-label">女</div>
                  <div className="gender-bar">
                    <div
                      className="gender-fill gender-female"
                      style={{ width: `${currentProfile.gender.female}%` }}
                    >
                      {currentProfile.gender.female}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="profile-age">
              <h4>年龄</h4>
              <div className="age-chart">
                {currentProfile.age.map((age, idx) => (
                  <div key={idx} className="age-item">
                    <div className="age-label">{age.range}</div>
                    <div className="age-bar">
                      <div
                        className="age-fill"
                        style={{ width: `${age.percent}%` }}
                      >
                        {age.percent}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="profile-region">
              <h4>地域</h4>
              <div className="region-chart">
                {currentProfile.region.map((region, idx) => {
                  const maxValue = Math.max(...currentProfile.region.map(r => r.value))
                  const width = maxValue > 0 ? (region.value / maxValue) * 100 : 0
                  return (
                    <div key={idx} className="region-item">
                      <div className="region-label">{region.province}</div>
                      <div className="region-bar">
                        <div
                          className="region-fill"
                          style={{ width: `${width}%` }}
                        >
                          <span className="region-value">{region.value.toLocaleString('zh-CN')}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  // 屏4：诊断归因
  const renderScreen4 = () => {
    const currentDiagnosis = diagnosisData[diagnosisTab]
    
    return (
      <div className="screen-4-container">
        <Card padding="large">
          <div className="diagnosis-header">
            <h2 className="section-title">诊断归因</h2>
            <Tabs
              items={[
                { key: '产品', label: '产品' },
                { key: '人群', label: '人群' },
                { key: '评价', label: '评价' },
                { key: '费比', label: '费比' },
                { key: '经营', label: '经营' }
              ]}
              activeKey={diagnosisTab}
              onChange={(key) => setDiagnosisTab(key as DiagnosisTab)}
            />
          </div>
          <div className="diagnosis-cards-grid">
            {currentDiagnosis.map((card, idx) => (
              <Card key={idx} padding="medium" className={`diagnosis-card diagnosis-card--${card.severity}`}>
                <div className="diagnosis-card-content">
                  <div className="diagnosis-card-header">
                    <div className={`diagnosis-severity-dot diagnosis-severity-dot--${card.severity}`} />
                    <h3 className="diagnosis-card-title">{card.title}</h3>
                    <span className="diagnosis-card-tag">{card.tag}</span>
                  </div>
                  <p className="diagnosis-card-desc">{card.desc}</p>
                  <div className="diagnosis-card-chips">
                    {card.chips.map((chip, cIdx) => (
                      <span key={cIdx} className="diagnosis-chip">{chip}</span>
                    ))}
                  </div>
                  <div className="diagnosis-card-actions">
                    {card.actions.map((action, aIdx) => (
                      <div key={aIdx} className="diagnosis-action-item">• {action}</div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="diagnosis-legend">
            <span className="legend-item">
              <span className="legend-dot legend-dot-normal" /> 正常
            </span>
            <span className="legend-item">
              <span className="legend-dot legend-dot-attention" /> 关注
            </span>
            <span className="legend-item">
              <span className="legend-dot legend-dot-high-risk" /> 高风险
            </span>
          </div>
        </Card>
      </div>
    )
  }

  // 屏5：任务看板
  const renderScreen5 = () => {
    const overdueTodo = taskColumns.todo.filter(t => t.overdue).length
    const overdueDoing = taskColumns.doing.filter(t => t.overdue).length
    
    return (
      <div className="screen-5-container">
        <Card padding="large">
          <div className="task-header">
            <h2 className="section-title">任务</h2>
            <div className="task-stats">
              总任务：{taskStats.total}  完成任务：{taskStats.finished}  超时任务：{taskStats.overdue}
            </div>
            <button className="task-export-btn">导出</button>
          </div>
          <div className="task-kanban">
            {(['todo', 'doing', 'done'] as const).map((status) => {
              const statusLabel = status === 'todo' ? '待处理' : status === 'doing' ? '进行中' : '已完成'
              const statusCount = taskColumns[status].length
              const overdueCount = taskColumns[status].filter(t => t.overdue).length
              return (
                <div key={status} className="task-column">
                  <div className="task-column-header">
                    <h3 className="task-column-title">{statusLabel}({statusCount})</h3>
                    {overdueCount > 0 && (
                      <span className="task-overdue-badge">已超时：{overdueCount}</span>
                    )}
                  </div>
                  <div className="task-cards">
                    {taskColumns[status].map((task) => (
                      <Card
                        key={task.id}
                        padding="medium"
                        className="task-card"
                        onMouseEnter={() => setHoveredTask(task.id)}
                        onMouseLeave={() => setHoveredTask(null)}
                      >
                        <div className="task-card-title">{task.title}</div>
                        <div className="task-card-desc">{task.description}</div>
                        <div className={`task-card-date ${task.overdue ? 'overdue' : ''}`}>
                          {task.dueDate}
                        </div>
                        {hoveredTask === task.id && (
                          <div className="task-tooltip">
                            <div className="tooltip-title">{task.title}</div>
                            <div className="tooltip-desc">{task.description}</div>
                            <div className="tooltip-date">到期日期：{task.dueDate}</div>
                          </div>
                        )}
                      </Card>
                    ))}
                    <div className="task-drop-placeholder" />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="brand-owner-cold-start-five-screens">
      {renderScreen1()}
      {renderScreen2()}
      {renderScreen3()}
      {renderScreen4()}
      {renderScreen5()}
    </div>
  )
}


