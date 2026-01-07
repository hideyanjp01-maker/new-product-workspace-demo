// 抖音内容制作角色阶段渲染器
import { useState, useMemo } from 'react'
import { Card, Button } from '../ui'
import type { Product, Metric } from '../../data/mockData'
import type {
  DouyinContentStageSectionConfig,
  KPICardConfig,
  MaterialPerformanceTableConfig,
  AudienceSellingPointMatrixConfig,
  TalentVideoTrackingTableConfig,
  TargetProgressConfig,
  InsightSummaryConfig,
  MaterialDiagnosisTablesConfig,
  MaterialAnalysisConfig,
  DiagnosisInsightsConfig,
  KanbanBoardConfig,
  OperationLogsConfig
} from '../../config/roleStage/douyin_content'
import {
  generateMaterialData,
  generateTalentVideoData,
  generateAudienceSellingPointMatrix,
  generateDiagnosticCards,
  generateTasks,
  generateOperationLogs,
  type MaterialData,
  type TalentVideoData
} from '../../mock/douyinContent'
import './DouyinContentStageRenderer.css'

interface DouyinContentStageRendererProps {
  sections: DouyinContentStageSectionConfig[]
  products: Product[]
  metrics?: Metric[]
  roleId?: string
  stage?: string
  dateRangeA?: string
  dateRangeB?: string
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

// 渲染KPI卡片
const renderKPICards = (config: KPICardConfig) => (
  <div className="stage-section kpi-cards-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <div className="kpi-cards-grid douyin-content">
      {config.cards.map((card, index) => (
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
            <div className="kpi-card-value">{formatValue(card.metricKey as any, card.unit)}</div>
            {card.compareValue && (
              <div className={`kpi-card-compare kpi-card-compare--${card.trend || 'stable'}`}>
                {card.compareValue}
              </div>
            )}
            <div className="kpi-card-sparkline">
              <div className="sparkline-placeholder">📈</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>
)

// 渲染素材表现明细表
const renderMaterialPerformanceTable = (
  config: MaterialPerformanceTableConfig,
  onRowClick?: (materialId: string) => void
) => (
  <div className="stage-section material-performance-table-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <Card padding="large">
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>素材ID</th>
              <th>人群</th>
              <th>卖点</th>
              <th>GMV</th>
              <th>ROI</th>
              <th>CTR</th>
              <th>CVR</th>
              <th>CPM</th>
              <th>互动率</th>
            </tr>
          </thead>
          <tbody>
            {config.materials.map((material, index) => (
              <tr key={index} onClick={() => onRowClick?.(material.materialId)} className="table-row-clickable">
                <td>{material.materialId}</td>
                <td>{material.audience}</td>
                <td>{material.sellingPoint}</td>
                <td>{formatValue(material.gmv, '元')}</td>
                <td>{formatValue(material.roi)}</td>
                <td>{formatValue(material.ctr, '%')}</td>
                <td>{formatValue(material.cvr, '%')}</td>
                <td>{formatValue(material.cpm, '元')}</td>
                <td>{formatValue(material.interactionRate, '%')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
)

// 渲染人群×卖点矩阵
const renderAudienceSellingPointMatrix = (config: AudienceSellingPointMatrixConfig) => (
  <div className="stage-section audience-sellingpoint-matrix-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <Card padding="large">
      <div className="matrix-container">
        <table className="matrix-table">
          <thead>
            <tr>
              <th>人群\卖点</th>
              {Object.keys(config.matrix[0]?.sellingPoints || {}).map(sp => (
                <th key={sp}>{sp}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {config.matrix.map((row, idx) => (
              <tr key={idx}>
                <td className="matrix-audience-label">{row.audience}</td>
                {Object.entries(row.sellingPoints).map(([sp, data], spIdx) => {
                  const intensity = data.roi > 2.5 ? 'high' : data.roi > 1.8 ? 'medium' : 'low'
                  return (
                    <td key={spIdx}>
                      <div className={`matrix-cell matrix-cell--${intensity}`}>
                        <div className="matrix-cell-roi">ROI: {formatValue(data.roi)}</div>
                        <div className="matrix-cell-gmv">GMV: {formatValue(data.gmv, '元')}</div>
                        {data.videoCount && (
                          <div className="matrix-cell-videos">视频: {data.videoCount}个</div>
                        )}
                      </div>
                    </td>
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

// 渲染达人视频跟踪表
const renderTalentVideoTrackingTable = (config: TalentVideoTrackingTableConfig) => (
  <div className="stage-section talent-video-tracking-table-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <Card padding="large">
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>排名</th>
              <th>SPU</th>
              <th>达人昵称</th>
              <th>达人ID</th>
              <th>视频ID</th>
              <th>发布日期</th>
              <th>GMV</th>
              <th>订单量</th>
              <th>退货率</th>
            </tr>
          </thead>
          <tbody>
            {config.videos.map((video, index) => (
              <tr key={index}>
                <td>{video.rank}</td>
                <td>{video.spu}</td>
                <td>{video.talentName}</td>
                <td>{video.talentId}</td>
                <td>{video.videoId}</td>
                <td>{video.publishDate}</td>
                <td>{formatValue(video.gmv, '元')}</td>
                <td>{formatValue(video.orderCount, '单')}</td>
                <td>{formatValue(video.refundRate, '%')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
)

// 渲染目标进度条
const renderTargetProgress = (config: TargetProgressConfig) => (
  <div className="stage-section target-progress-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <Card padding="large">
      <div className="progress-bars-list">
        {config.targets.map((target, idx) => {
          const progress = target.target > 0 ? (target.current / target.target) * 100 : 0
          return (
            <div key={idx} className="progress-bar-item">
              <div className="progress-bar-header">
                <span className="progress-bar-label">{target.label}</span>
                <span className="progress-bar-value">
                  {formatValue(target.current, target.unit)} / {formatValue(target.target, target.unit)}
                </span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
              </div>
              <div className="progress-bar-percent">{progress.toFixed(1)}%</div>
            </div>
          )
        })}
      </div>
    </Card>
  </div>
)

// 渲染洞察总结（绿色卡片）
const renderInsightSummary = (config: InsightSummaryConfig) => (
  <div className="stage-section insight-summary-section">
    <Card padding="large" className="insight-summary-card">
      {config.date && <div className="insight-date">{config.date}</div>}
      <div className="insight-list">
        {config.bullets.map((bullet, idx) => (
          <div key={idx} className="insight-bullet">{bullet}</div>
        ))}
      </div>
      {config.buttonText && (
        <div className="insight-action">
          <Button variant="primary">{config.buttonText}</Button>
        </div>
      )}
    </Card>
  </div>
)

// 渲染素材诊断分析（三块Top5表）
const renderMaterialDiagnosisTables = (config: MaterialDiagnosisTablesConfig) => (
  <div className="stage-section material-diagnosis-tables-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <div className="diagnosis-tables-grid">
      {config.tables.map((table, tableIdx) => (
        <Card key={tableIdx} padding="large">
          <h3 className="diagnosis-table-title">{table.title}</h3>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>SPU</th>
                  <th>组合策略</th>
                  <th>消耗</th>
                  <th>GMV</th>
                  <th>ROI</th>
                  <th>CTR</th>
                  <th>CVR</th>
                  <th>全店销量(s)</th>
                  <th>人群洞察</th>
                </tr>
              </thead>
              <tbody>
                {table.materials.slice(0, 5).map((material, idx) => (
                  <tr key={idx}>
                    <td>{material.materialId}</td>
                    <td>{material.spu}</td>
                    <td className="strategy-cell">{material.strategy}</td>
                    <td>{formatValue(material.cost, '元')}</td>
                    <td>{formatValue(material.gmv, '元')}</td>
                    <td>{formatValue(material.roi)}</td>
                    <td>{formatValue(material.ctr, '%')}</td>
                    <td>{formatValue(material.cvr, '%')}</td>
                    <td>{formatValue(material.fullStoreSales)}</td>
                    <td className="insight-cell">{material.audienceInsight}</td>
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

// 渲染素材分析（素材详情区）
const renderMaterialAnalysis = (config: MaterialAnalysisConfig, onMaterialChange?: (id: string) => void) => (
  <div className="stage-section material-analysis-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <Card padding="large">
      <div className="material-selector">
        <label>选择素材：</label>
        <select 
          value={config.selectedMaterialId || ''} 
          onChange={(e) => onMaterialChange?.(e.target.value)}
          className="material-select"
        >
          <option value="">请选择素材</option>
        </select>
      </div>
      <div className="material-kpis-grid">
        {config.kpis.map((kpi, idx) => (
          <div key={idx} className="material-kpi-card">
            <div className="material-kpi-label">{kpi.label}</div>
            <div className="material-kpi-value">{formatValue(kpi.value as number, kpi.unit)}</div>
          </div>
        ))}
      </div>
      <div className="material-insights">
        {config.insights.map((insight, idx) => (
          <div key={idx} className="material-insight-tag">{insight}</div>
        ))}
      </div>
    </Card>
  </div>
)

// 渲染诊断洞察（AI诊断卡片，支持场景Tab）
const renderDiagnosisInsights = (config: DiagnosisInsightsConfig) => {
  const [activeSceneId, setActiveSceneId] = useState<string>(config.scenes[0]?.id || '')
  const activeScene = config.scenes.find(s => s.id === activeSceneId) || config.scenes[0]

  return (
    <div className="stage-section diagnosis-insights-section">
      {config.title && <h2 className="section-title">{config.title}</h2>}
      <Card padding="large">
        <div className="diagnosis-scenes-tabs">
          {config.scenes.map((scene) => (
            <button
              key={scene.id}
              className={`diagnosis-scene-tab ${activeSceneId === scene.id ? 'diagnosis-scene-tab--active' : ''}`}
              onClick={() => setActiveSceneId(scene.id)}
            >
              {scene.title}
            </button>
          ))}
        </div>
        <div className="diagnosis-cards-grid">
          {activeScene?.cards.map((card) => (
            <Card key={card.id} padding="medium" className={`diagnosis-card diagnosis-card--${card.severity}`}>
              <div className="diagnosis-card-header">
                <h4 className="diagnosis-card-title">{card.title}</h4>
                <span className={`diagnosis-severity-badge diagnosis-severity-badge--${card.severity}`}>
                  {card.severity === 'high' ? '高' : card.severity === 'medium' ? '中' : '低'}
                </span>
              </div>
              <div className="diagnosis-card-triggers">
                触发指标：{card.triggerMetrics.join('、')}
              </div>
              <div className="diagnosis-card-conclusion">{card.conclusion}</div>
              <div className="diagnosis-card-suggestions">
                <div className="suggestions-title">建议：</div>
                <ul>
                  {card.suggestions.map((suggestion, idx) => (
                    <li key={idx}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  )
}

// 渲染任务看板
const renderKanbanBoard = (config: KanbanBoardConfig) => (
  <div className="stage-section kanban-board-section">
    {config.title && <h2 className="section-title">{config.title}</h2>}
    <Card padding="large">
      <div className="kanban-container">
        <div className="kanban-column">
          <div className="kanban-column-header">
            <h4>待处理</h4>
            <span className="kanban-count">{config.tasks.todo.length}</span>
          </div>
          <div className="kanban-cards">
            {config.tasks.todo.map((task) => (
              <Card key={task.id} padding="small" className="kanban-card">
                <div className="kanban-card-title">{task.title}</div>
                <div className="kanban-card-meta">
                  <span className={`kanban-priority kanban-priority--${task.priority}`}>
                    {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
                  </span>
                  <span className="kanban-due-date">{task.dueDate}</span>
                </div>
                <div className="kanban-card-assignee">{task.assignee}</div>
              </Card>
            ))}
          </div>
        </div>
        <div className="kanban-column">
          <div className="kanban-column-header">
            <h4>进行中</h4>
            <span className="kanban-count">{config.tasks.doing.length}</span>
          </div>
          <div className="kanban-cards">
            {config.tasks.doing.map((task) => (
              <Card key={task.id} padding="small" className="kanban-card">
                <div className="kanban-card-title">{task.title}</div>
                <div className="kanban-card-meta">
                  <span className={`kanban-priority kanban-priority--${task.priority}`}>
                    {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
                  </span>
                  <span className="kanban-due-date">{task.dueDate}</span>
                </div>
                <div className="kanban-card-assignee">{task.assignee}</div>
              </Card>
            ))}
          </div>
        </div>
        <div className="kanban-column">
          <div className="kanban-column-header">
            <h4>已完成</h4>
            <span className="kanban-count">{config.tasks.done.length}</span>
          </div>
          <div className="kanban-cards">
            {config.tasks.done.map((task) => (
              <Card key={task.id} padding="small" className="kanban-card">
                <div className="kanban-card-title">{task.title}</div>
                <div className="kanban-card-meta">
                  <span className={`kanban-priority kanban-priority--${task.priority}`}>
                    {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
                  </span>
                  <span className="kanban-due-date">{task.dueDate}</span>
                </div>
                <div className="kanban-card-assignee">{task.assignee}</div>
              </Card>
            ))}
          </div>
        </div>
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
            <span className="log-content">{log.content}</span>
          </div>
        ))}
      </div>
    </Card>
  </div>
)

// 主渲染函数
export default function DouyinContentStageRenderer({
  sections,
  products,
  metrics = [],
  roleId,
  stage,
  dateRangeA = '2024-01-01',
  dateRangeB = '2024-01-31'
}: DouyinContentStageRendererProps) {
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('')

  // 生成mock数据
  const materialData = useMemo(() => generateMaterialData(dateRangeA, dateRangeB), [dateRangeA, dateRangeB])
  const talentVideoData = useMemo(() => generateTalentVideoData(dateRangeA, dateRangeB), [dateRangeA, dateRangeB])
  const matrixData = useMemo(() => generateAudienceSellingPointMatrix(dateRangeA, dateRangeB), [dateRangeA, dateRangeB])
  
  const diagnosticCards = useMemo(() => {
    if (stage === 'cold_start') {
      return {
        operation: generateDiagnosticCards('operation', 'cold_start', dateRangeA, dateRangeB),
        material: generateDiagnosticCards('material', 'cold_start', dateRangeA, dateRangeB),
        audience: generateDiagnosticCards('audience', 'cold_start', dateRangeA, dateRangeB)
      }
    } else if (stage === 'scaling') {
      return {
        operation: generateDiagnosticCards('operation', 'scaling', dateRangeA, dateRangeB),
        material: generateDiagnosticCards('material', 'scaling', dateRangeA, dateRangeB),
        audience: generateDiagnosticCards('audience', 'scaling', dateRangeA, dateRangeB)
      }
    }
    return { operation: [], material: [], audience: [] }
  }, [stage, dateRangeA, dateRangeB])

  const tasks = useMemo(() => {
    if (stage === 'cold_start' || stage === 'scaling') {
      return generateTasks(stage, dateRangeA)
    }
    return { todo: [], doing: [], done: [] }
  }, [stage, dateRangeA])

  const operationLogs = useMemo(() => {
    if (stage === 'cold_start' || stage === 'scaling') {
      return generateOperationLogs(stage, dateRangeA)
    }
    return []
  }, [stage, dateRangeA])

  // 渲染单个section
  const renderSection = (section: DouyinContentStageSectionConfig) => {
    switch (section.type) {
      case 'kpi-cards':
        return <div key={section.type}>{renderKPICards(section)}</div>
      case 'material-performance-table':
        return (
          <div key={section.type}>
            {renderMaterialPerformanceTable(section, (id) => setSelectedMaterialId(id))}
          </div>
        )
      case 'audience-sellingpoint-matrix':
        return <div key={section.type}>{renderAudienceSellingPointMatrix(section)}</div>
      case 'talent-video-tracking-table':
        return <div key={section.type}>{renderTalentVideoTrackingTable(section)}</div>
      case 'target-progress':
        return <div key={section.type}>{renderTargetProgress(section)}</div>
      case 'insight-summary':
        return <div key={section.type}>{renderInsightSummary(section)}</div>
      case 'material-diagnosis-tables':
        return <div key={section.type}>{renderMaterialDiagnosisTables(section)}</div>
      case 'material-analysis':
        return (
          <div key={section.type}>
            {renderMaterialAnalysis(section, (id) => setSelectedMaterialId(id))}
          </div>
        )
      case 'diagnosis-insights':
        return <div key={section.type}>{renderDiagnosisInsights(section)}</div>
      case 'kanban-board':
        return <div key={section.type}>{renderKanbanBoard(section)}</div>
      case 'operation-logs':
        return <div key={section.type}>{renderOperationLogs(section)}</div>
      default:
        return null
    }
  }

  // 动态生成配置（基于mock数据）
  const dynamicSections = useMemo(() => {
    if (sections.length > 0) {
      // 如果已有配置，直接使用
      return sections
    }

    // 否则动态生成
    const generated: DouyinContentStageSectionConfig[] = []

    if (stage === 'overview') {
      // 总览页面
      generated.push(
        {
          type: 'kpi-cards',
          title: '关键指标',
          cards: [
            { label: '视频数量', metricKey: '85', unit: '个', trend: 'up', compareValue: '较对比期 +12%' },
            { label: '曝光', metricKey: '2500000', unit: '次', trend: 'up', compareValue: '较对比期 +15%' },
            { label: 'GMV', metricKey: '450000', unit: '元', trend: 'up', compareValue: '较对比期 +18%' },
            { label: 'ROI', metricKey: '2.5', unit: '', trend: 'stable', compareValue: '较对比期 +0.2' },
            { label: 'CTR', metricKey: '4.2', unit: '%', trend: 'up', compareValue: '较对比期 +0.5%' },
            { label: 'CVR', metricKey: '3.2', unit: '%', trend: 'up', compareValue: '较对比期 +0.3%' },
            { label: 'CPM', metricKey: '2.1', unit: '元', trend: 'down', compareValue: '较对比期 -0.2元' }
          ]
        },
        {
          type: 'material-performance-table',
          title: '素材表现明细表',
          materials: materialData
        },
        {
          type: 'audience-sellingpoint-matrix',
          title: '人群 × 卖点 组合矩阵',
          matrix: matrixData
        },
        {
          type: 'talent-video-tracking-table',
          title: '重点达人&人群视频跟踪表',
          videos: talentVideoData
        }
      )
    } else if (stage === 'cold_start' || stage === 'scaling') {
      // 冷启动/放量期页面
      const isScaling = stage === 'scaling'
      
      // 目标进度 + 洞察总结（并排）
      generated.push(
        {
          type: 'target-progress',
          title: isScaling ? '放量目标与进度' : '冷启动目标与进度',
          targets: [
            { label: 'GMV', current: 150000, target: 300000, unit: '元' },
            { label: 'CTR', current: 3.5, target: 4.0, unit: '%' },
            { label: 'ROI', current: 2.2, target: 2.5, unit: '' }
          ]
        },
        {
          type: 'insight-summary',
          title: '洞察总结',
          date: dateRangeA,
          bullets: isScaling 
            ? [
                '放量素材CTR下滑，需要扩充高效素材组合',
                'GMV持续增长，但CPM上升需要关注',
                '复购率达到12%，用户粘性良好',
                '建议扩大爆款素材投放规模'
              ]
            : [
                '冷启动期GMV达成率65%，需要加大投放',
                'CTR表现良好，达到4.2%',
                'ROI波动较大，需要稳定',
                '建议优化素材质量和人群匹配'
              ],
          buttonText: '查看详情'
        }
      )

      // 放量期额外KPI卡片
      if (isScaling) {
        generated.push({
          type: 'kpi-cards',
          title: '放量期关键指标',
          cards: [
            { label: '曝光量', metricKey: '3500000', unit: '次', trend: 'up' },
            { label: 'GMV', metricKey: '650000', unit: '元', trend: 'up' },
            { label: 'ROI', metricKey: '2.8', unit: '', trend: 'stable' },
            { label: 'CTR', metricKey: '3.5', unit: '%', trend: 'down' },
            { label: 'CVR', metricKey: '3.0', unit: '%', trend: 'stable' },
            { label: '复购率', metricKey: '12', unit: '%', trend: 'up' }
          ]
        })
      }

      // 素材诊断分析（三块Top5表）
      const top5ROI = [...materialData].sort((a, b) => b.roi - a.roi).slice(0, 5)
      const top5GMV = [...materialData].sort((a, b) => b.gmv - a.gmv).slice(0, 5)
      const top5CTR = [...materialData].sort((a, b) => b.ctr - a.ctr).slice(0, 5)

      generated.push({
        type: 'material-diagnosis-tables',
        title: '素材诊断分析',
        tables: [
          {
            title: '素材ROI贡献Top5（仅测试素材）',
            sortBy: 'roi',
            materials: top5ROI.map(m => ({
              materialId: m.materialId,
              spu: m.spu || '',
              strategy: m.strategy || '',
              cost: m.cost || 0,
              gmv: m.gmv,
              roi: m.roi,
              ctr: m.ctr,
              cvr: m.cvr,
              fullStoreSales: m.fullStoreSales || 0,
              audienceInsight: m.audienceInsight || ''
            }))
          },
          {
            title: '素材GMV贡献Top5',
            sortBy: 'gmv',
            materials: top5GMV.map(m => ({
              materialId: m.materialId,
              spu: m.spu || '',
              strategy: m.strategy || '',
              cost: m.cost || 0,
              gmv: m.gmv,
              roi: m.roi,
              ctr: m.ctr,
              cvr: m.cvr,
              fullStoreSales: m.fullStoreSales || 0,
              audienceInsight: m.audienceInsight || ''
            }))
          },
          {
            title: '素材点击率(CTR) Top5',
            sortBy: 'ctr',
            materials: top5CTR.map(m => ({
              materialId: m.materialId,
              spu: m.spu || '',
              strategy: m.strategy || '',
              cost: m.cost || 0,
              gmv: m.gmv,
              roi: m.roi,
              ctr: m.ctr,
              cvr: m.cvr,
              fullStoreSales: m.fullStoreSales || 0,
              audienceInsight: m.audienceInsight || ''
            }))
          }
        ]
      })

      // 素材分析
      const selectedMaterial = materialData.find(m => m.materialId === selectedMaterialId) || materialData[0]
      generated.push({
        type: 'material-analysis',
        title: '素材分析',
        selectedMaterialId: selectedMaterialId || materialData[0]?.materialId,
        kpis: [
          { label: '消耗', value: selectedMaterial?.cost || 0, unit: '元' },
          { label: '曝光', value: Math.round((selectedMaterial?.cost || 0) / (selectedMaterial?.cpm || 1) * 1000), unit: '次' },
          { label: 'ROI', value: selectedMaterial?.roi || 0 },
          { label: 'CTR', value: selectedMaterial?.ctr || 0, unit: '%' },
          { label: 'CVR', value: selectedMaterial?.cvr || 0, unit: '%' },
          { label: 'GMV', value: selectedMaterial?.gmv || 0, unit: '元' }
        ],
        insights: [
          `Hook：前3秒观看留存率达到65%，表现良好`,
          `画面结构：产品展示清晰，卖点传达明确`,
          `节奏密度：前3秒节奏适中，建议保持`
        ]
      })

      // 诊断洞察（AI诊断卡片，支持场景Tab）
      generated.push({
        type: 'diagnosis-insights',
        title: '诊断洞察',
        scenes: [
          {
            id: 'operation',
            title: isScaling ? '经营（规模&效率）' : '经营（目标&效率）',
            cards: diagnosticCards.operation
          },
          {
            id: 'material',
            title: isScaling ? '素材（爆款延展&衰退预警）' : '素材（素材质量&结构）',
            cards: diagnosticCards.material
          },
          {
            id: 'audience',
            title: isScaling ? '人群（扩量人群&新增人群）' : '人群（人群匹配&覆盖）',
            cards: diagnosticCards.audience
          }
        ]
      })

      // 任务看板
      generated.push({
        type: 'kanban-board',
        title: '任务看板',
        tasks
      })

      // 操作记录
      generated.push({
        type: 'operation-logs',
        title: '操作记录',
        logs: operationLogs
      })
    }

    return generated
  }, [sections, stage, materialData, talentVideoData, matrixData, diagnosticCards, tasks, operationLogs, selectedMaterialId, dateRangeA])

  return (
    <div className="douyin-content-stage-renderer">
      {dynamicSections.map((section, idx) => (
        <div key={idx}>{renderSection(section)}</div>
      ))}
    </div>
  )
}


