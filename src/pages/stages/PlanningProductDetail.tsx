import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Modal, Button } from '../../components/ui'
import { useNewProductFlowStore, defaultPlanningStageStatus } from '../../store/newProductFlowStore'
import { useAppStore } from '../../store/appStore'
import './PlanningProductDetail.css'

interface PlanningProductDetailProps {
  productId: string
  onClose?: () => void
}

export default function PlanningProductDetail({ productId, onClose }: PlanningProductDetailProps) {
  const navigate = useNavigate()
  const product = useNewProductFlowStore((state) => state.getProductById(productId))
  const approvePlanning = useNewProductFlowStore((state) => state.approvePlanning)
  const rejectPlanning = useNewProductFlowStore((state) => state.rejectPlanning)
  const confirmEcommerceTargets = useNewProductFlowStore((state) => state.confirmEcommerceTargets)
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [launchDate, setLaunchDate] = useState<string>('')
  const [launchDateError, setLaunchDateError] = useState<string>('')
  const currentRoleId = useAppStore((state) => state.currentRoleId)
  
  // 读取并兜底状态
  const s = product?.planningStageStatus ?? defaultPlanningStageStatus
  const brand = s.brandOwnerDecision ?? 'pending'
  const eco = s.ecommerceOwnerDecision ?? 'pending'
  
  // 角色权限判断
  const canBrandApprove = currentRoleId === 'bu_brand_owner' && brand === 'pending'
  const canEcomApprove = currentRoleId === 'ecommerce_owner' && brand === 'approved' && eco === 'pending'
  
  // 调试日志
  console.debug('[PlanningProductDetail] Debug:', {
    productId,
    currentRoleId,
    productExists: !!product,
    brandStatus: brand,
    ecoStatus: eco,
    canBrandApprove,
    canEcomApprove
  })

  if (!product) {
    return (
      <div className="planning-product-detail">
        <Card padding="large">
          <p>产品不存在</p>
        </Card>
      </div>
    )
  }

  const handleApprove = () => {
    if (currentRoleId === 'bu_brand_owner') {
      approvePlanning(productId)
    } else if (currentRoleId === 'ecommerce_owner') {
      // 电商负责人必须选择拟定上市年月日
      if (!launchDate) {
        setLaunchDateError('请先选择拟定上市年月日')
        return
      }
      setLaunchDateError('')
      confirmEcommerceTargets(productId)
    }
    if (onClose) {
      onClose()
    } else {
      navigate('/stages/planning')
    }
  }

  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert('请输入驳回原因')
      return
    }
    rejectPlanning(productId, rejectReason)
    setIsRejectModalOpen(false)
    setRejectReason('')
    if (onClose) {
      onClose()
    } else {
      navigate('/stages/planning')
    }
  }

  const simulatorData = product.simulatorFormMock || {
    targetGMV: 3000000,
    gmvGrowthRate: '12.5%',
    targetCostRatio: '40%',
    roiGrowthRate: '10%'
  }

  const threeMonthData = product.threeMonthTargets || [
    { month: '1月', targetGMV: 570000, targetBudget: 270000, targetCostRatio: '40%' },
    { month: '2月', targetGMV: 510000, targetBudget: 220000, targetCostRatio: '40%' },
    { month: '3月', targetGMV: 420000, targetBudget: 160000, targetCostRatio: '40%' }
  ]

  const scoringData = product.scoringSystem || {
    trackGrowthRate: 80,
    rampUpPeriod: 85,
    newProductPenetrationRate: 70,
    pricingReasonableness: 70,
    sellingPointMatching: 50,
    overallScore: 69.8
  }

  return (
    <div className="planning-product-detail">
      {/* 立项锚点区域 */}
      <Card className="product-anchor-points" padding="large">
        <h2 className="detail-section-title">待启动新品·{product.title}</h2>
        <div className="anchor-points-grid">
          <div className="anchor-points-left">
            <h3 className="anchor-subtitle">立项锚点</h3>
            <div className="anchor-item">
              <span className="anchor-label">建议总GMV</span>
              <span className="anchor-value">3,000,000</span>
            </div>
            <div className="anchor-item">
              <span className="anchor-label">建议预算</span>
              <span className="anchor-value">1,200,000</span>
            </div>
            <div className="anchor-item">
              <span className="anchor-label">建议费比</span>
              <span className="anchor-value">2.5</span>
            </div>
            <div className="anchor-item">
              <span className="anchor-label">建议AOV</span>
              <span className="anchor-value">9.9</span>
            </div>
          </div>
          <div className="anchor-points-right">
            <h3 className="anchor-subtitle">性别/年龄/地域/卖点</h3>
            <div className="anchor-item">
              <span className="anchor-label">性别</span>
              <span className="anchor-value">女</span>
            </div>
            <div className="anchor-item">
              <span className="anchor-label">年龄</span>
              <span className="anchor-value">24</span>
            </div>
            <div className="anchor-item">
              <span className="anchor-label">地域</span>
              <span className="anchor-value">北京</span>
            </div>
            <div className="anchor-item">
              <span className="anchor-label">卖点</span>
              <span className="anchor-value">好用好用好用好用</span>
            </div>
          </div>
        </div>
      </Card>

      {/* 目标模拟器 */}
      <Card className="goal-simulator" padding="large">
        <h2 className="detail-section-title">目标模拟器</h2>
        <div className="simulator-form">
          <div className="simulator-row">
            <label className="simulator-label">目标GMV (元)</label>
            <input
              type="number"
              className="simulator-input"
              defaultValue={simulatorData.targetGMV}
              readOnly
            />
          </div>
          <div className="simulator-row">
            <label className="simulator-label">GMV提升率</label>
            <input
              type="text"
              className="simulator-input"
              defaultValue={simulatorData.gmvGrowthRate}
              readOnly
            />
          </div>
          <div className="simulator-row">
            <label className="simulator-label">目标费比</label>
            <input
              type="text"
              className="simulator-input"
              defaultValue={simulatorData.targetCostRatio}
              readOnly
            />
          </div>
          <div className="simulator-row">
            <label className="simulator-label">ROI提升率</label>
            <input
              type="text"
              className="simulator-input"
              defaultValue={simulatorData.roiGrowthRate}
              readOnly
            />
          </div>
          <button type="button" className="simulator-calculate-btn">
            试算三月路径
          </button>
        </div>
      </Card>

      {/* 三个月目标试算 */}
      <Card className="three-month-targets" padding="large">
        <h2 className="detail-section-title">三个月目标试算</h2>
        <table className="three-month-table">
          <thead>
            <tr>
              <th>周</th>
              <th>目标GMV (元)</th>
              <th>目标预算 (元)</th>
              <th>目标费比</th>
            </tr>
          </thead>
          <tbody>
            {threeMonthData.map((item, index) => (
              <tr key={index}>
                <td>{item.month}</td>
                <td>{item.targetGMV.toLocaleString()}</td>
                <td>{item.targetBudget.toLocaleString()}</td>
                <td>{item.targetCostRatio}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* 试销报告 */}
      <Card className="trial-report" padding="large">
        <h2 className="detail-section-title">试销报告</h2>
        <div className="trial-report-content">
          <p className="trial-report-summary">{product.trialReportMock?.summary || '暂无试销报告'}</p>
          <ul className="trial-report-points">
            {(product.trialReportMock?.keyPoints || []).map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>
      </Card>

      {/* 评分体系 */}
      <Card className="scoring-system" padding="large">
        <h2 className="detail-section-title">评分体系</h2>
        <div className="scoring-chart">
          <div className="scoring-bars">
            <div className="scoring-bar-item">
              <div className="scoring-bar-label">赛道增速</div>
              <div className="scoring-bar-container">
                <div
                  className="scoring-bar scoring-bar--grey"
                  style={{ height: `${scoringData.trackGrowthRate}%` }}
                >
                  <span className="scoring-bar-value">{scoringData.trackGrowthRate}</span>
                </div>
              </div>
            </div>
            <div className="scoring-bar-item">
              <div className="scoring-bar-label">起量周期</div>
              <div className="scoring-bar-container">
                <div
                  className="scoring-bar scoring-bar--green"
                  style={{ height: `${scoringData.rampUpPeriod}%` }}
                >
                  <span className="scoring-bar-value">{scoringData.rampUpPeriod}</span>
                </div>
              </div>
            </div>
            <div className="scoring-bar-item">
              <div className="scoring-bar-label">新品渗透率</div>
              <div className="scoring-bar-container">
                <div
                  className="scoring-bar scoring-bar--grey"
                  style={{ height: `${scoringData.newProductPenetrationRate}%` }}
                >
                  <span className="scoring-bar-value">{scoringData.newProductPenetrationRate}</span>
                </div>
              </div>
            </div>
            <div className="scoring-bar-item">
              <div className="scoring-bar-label">定价合理度</div>
              <div className="scoring-bar-container">
                <div
                  className="scoring-bar scoring-bar--grey"
                  style={{ height: `${scoringData.pricingReasonableness}%` }}
                >
                  <span className="scoring-bar-value">{scoringData.pricingReasonableness}</span>
                </div>
              </div>
            </div>
            <div className="scoring-bar-item">
              <div className="scoring-bar-label">卖点匹配度</div>
              <div className="scoring-bar-container">
                <div
                  className="scoring-bar scoring-bar--grey"
                  style={{ height: `${scoringData.sellingPointMatching}%` }}
                >
                  <span className="scoring-bar-value">{scoringData.sellingPointMatching}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="overall-score">
          <div className="overall-score-label">综合评分</div>
          <div className="overall-score-bar-container">
            <div
              className="overall-score-bar"
              style={{ width: `${scoringData.overallScore}%` }}
            >
              <span className="overall-score-value">{scoringData.overallScore}/100</span>
            </div>
          </div>
          <div className="scoring-hint">点击任意维度查看「公式+分子分母+证据表」</div>
        </div>
      </Card>

      {/* 品牌负责人审批按钮 */}
      {canBrandApprove && (
        <div className="approval-actions">
          <button
            type="button"
            className="approval-btn approval-btn--reject"
            onClick={() => setIsRejectModalOpen(true)}
          >
            驳回
          </button>
          <button
            type="button"
            className="approval-btn approval-btn--approve"
            onClick={handleApprove}
          >
            同意
          </button>
        </div>
      )}
      
      {/* 电商负责人确认按钮 */}
      {canEcomApprove && (
        <>
          <Card className="launch-date-selector" padding="large">
            <div className="launch-date-form">
              <label className="launch-date-label">拟定上市年月日</label>
              <input
                type="date"
                className="launch-date-input"
                value={launchDate}
                onChange={(e) => {
                  setLaunchDate(e.target.value)
                  if (e.target.value) {
                    setLaunchDateError('')
                  }
                }}
              />
              {launchDateError && (
                <div className="launch-date-error">{launchDateError}</div>
              )}
            </div>
          </Card>
          <div className="approval-actions">
            <button
              type="button"
              className="approval-btn approval-btn--approve"
              onClick={handleApprove}
            >
              同意
            </button>
          </div>
        </>
      )}
      
      {/* 审批结果展示 */}
      {currentRoleId === 'bu_brand_owner' && brand === 'approved' && (
        <div className="approval-actions">
          <span className="approval-status approval-status--approved">已同意</span>
        </div>
      )}
      {currentRoleId === 'bu_brand_owner' && brand === 'rejected' && (
        <div className="approval-actions">
          <span className="approval-status approval-status--rejected">
            已驳回{product.rejectReason && `：${product.rejectReason}`}
          </span>
        </div>
      )}
      {currentRoleId === 'ecommerce_owner' && eco === 'confirmed' && (
        <div className="approval-actions">
          <span className="approval-status approval-status--approved">已确认目标</span>
        </div>
      )}

      {/* 驳回弹窗 */}
      <Modal
        open={isRejectModalOpen}
        onClose={() => {
          setIsRejectModalOpen(false)
          setRejectReason('')
        }}
        title="驳回原因"
        width={500}
      >
        <div className="reject-modal-content">
          <textarea
            className="reject-reason-textarea"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="请输入驳回原因..."
            rows={6}
          />
          <div className="reject-modal-actions">
            <Button
              variant="secondary"
              onClick={() => {
                setIsRejectModalOpen(false)
                setRejectReason('')
              }}
            >
              取消
            </Button>
            <Button variant="primary" onClick={handleReject}>
              确认驳回
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

