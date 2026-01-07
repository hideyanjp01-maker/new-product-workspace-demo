import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import MainLayout from '../../components/layout/MainLayout'
import PageHeader from '../../components/layout/PageHeader'
import { Card } from '../../components/ui'
import { useNewProductFlowStore, type PlanningProduct } from '../../store/newProductFlowStore'
import { useAppStore } from '../../store/appStore'
import './EcommerceOwnerPlanningConfirmPage.css'

export default function EcommerceOwnerPlanningConfirmPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const productIdFromUrl = searchParams.get('productId')

  const { setCurrentStage } = useAppStore()
  const getEcommercePendingProducts = useNewProductFlowStore((state) => state.getEcommercePendingProducts)
  const getProductById = useNewProductFlowStore((state) => state.getProductById)
  const updateEcommerceTargets = useNewProductFlowStore((state) => state.updateEcommerceTargets)
  const confirmEcommerceTargets = useNewProductFlowStore((state) => state.confirmEcommerceTargets)

  const [pendingProducts, setPendingProducts] = useState(getEcommercePendingProducts())
  const [selectedProductId, setSelectedProductId] = useState<string | null>(productIdFromUrl)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  useEffect(() => {
    setCurrentStage('planning')
  }, [setCurrentStage])

  useEffect(() => {
    const products = getEcommercePendingProducts()
    setPendingProducts(products)
    if (!selectedProductId && products.length > 0) {
      setSelectedProductId(products[0].id)
    }
  }, [getEcommercePendingProducts, selectedProductId])

  const product = selectedProductId ? getProductById(selectedProductId) : null

  const handleReset = () => {
    if (!product) return
    // 重置为默认值
    updateEcommerceTargets(product.id, {
      targetGMV: 3000000,
      targetBudget: 1200000,
      targetRoiFloor: 2,
      targetAOV: 9,
      platformShare: {
        douyin: 20,
        tmall: 30,
        jd: 40
      },
      coldStartGMV: 3000000,
      coldStartROI: 3000000,
      coldStartBuyers: 2000
    })
    setToastMessage('已重置')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  const handleCalculate = () => {
    setToastMessage('已计算（Demo）')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  const handleConfirm = () => {
    if (!product) return
    confirmEcommerceTargets(product.id)
    setToastMessage('已确认目标')
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
      // 从列表中移除或跳转
      const remaining = getEcommercePendingProducts()
      if (remaining.length > 0) {
        setSelectedProductId(remaining[0].id)
        navigate(`/roles/ecommerce_owner/planning-confirm?productId=${remaining[0].id}`, { replace: true })
      } else {
        navigate('/stages/planning', { replace: true })
      }
    }, 2000)
  }

  const handleTargetChange = (field: keyof NonNullable<PlanningProduct['ecommerceTargets']>, value: number | string) => {
    if (!product) return
    updateEcommerceTargets(product.id, { [field]: value } as Partial<PlanningProduct['ecommerceTargets']>)
  }

  const handlePlatformShareChange = (platform: 'douyin' | 'tmall' | 'jd', value: number) => {
    if (!product || !product.ecommerceTargets) return
    updateEcommerceTargets(product.id, {
      platformShare: {
        ...product.ecommerceTargets.platformShare,
        [platform]: value
      }
    })
  }

  if (pendingProducts.length === 0) {
    return (
      <MainLayout>
        <PageHeader
          title="电商负责人目标确认"
          subtitle="确认新品启动目标"
          backPath="/stages/planning"
        />
        <Card padding="large">
          <div className="empty-state">
            <p>暂无待确认目标的新品</p>
            <p className="empty-hint">品牌负责人已批准的新品将显示在这里</p>
          </div>
        </Card>
      </MainLayout>
    )
  }

  if (!product) {
    return (
      <MainLayout>
        <PageHeader
          title="电商负责人目标确认"
          subtitle="确认新品启动目标"
          backPath="/stages/planning"
        />
        <Card padding="large">
          <p>产品不存在</p>
        </Card>
      </MainLayout>
    )
  }

  const targets = product.ecommerceTargets || {
    targetGMV: 3000000,
    targetBudget: 1200000,
    targetRoiFloor: 2,
    targetAOV: 9,
    platformShare: { douyin: 20, tmall: 30, jd: 40 },
    coldStartGMV: 3000000,
    coldStartROI: 3000000,
    coldStartBuyers: 2000
  }

  return (
    <MainLayout>
      <PageHeader
        title="电商负责人目标确认"
        subtitle="确认新品启动目标"
        backPath="/stages/planning"
      />

      <div className="ecommerce-confirm-content">
        {/* A) 顶部信息卡 */}
        <Card className="product-info-card" padding="large">
          <h2 className="confirm-section-title">
            待启动新品（品牌负责人已批准）· {product.title}
          </h2>
          <div className="info-cards-grid">
            <div className="info-card-left">
              <h3 className="info-card-title">立项锚点</h3>
              <div className="info-item">
                <span className="info-label">建议总GMV</span>
                <span className="info-value">3,000,000</span>
              </div>
              <div className="info-item">
                <span className="info-label">建议预算</span>
                <span className="info-value">1,200,000</span>
              </div>
              <div className="info-item">
                <span className="info-label">建议费比</span>
                <span className="info-value">2.5</span>
              </div>
              <div className="info-item">
                <span className="info-label">建议AOV</span>
                <span className="info-value">9.9</span>
              </div>
            </div>
            <div className="info-card-right">
              <h3 className="info-card-title">性别/年龄/地域/卖点</h3>
              <div className="info-item">
                <span className="info-label">性别</span>
                <span className="info-value">女</span>
              </div>
              <div className="info-item">
                <span className="info-label">年龄</span>
                <span className="info-value">24</span>
              </div>
              <div className="info-item">
                <span className="info-label">地域</span>
                <span className="info-value">北京</span>
              </div>
              <div className="info-item">
                <span className="info-label">卖点</span>
                <span className="info-value">好用好用好用好用</span>
              </div>
            </div>
          </div>
        </Card>

        {/* B) 目标模拟器 */}
        <Card className="goal-simulator-card" padding="large">
          <div className="simulator-header">
            <h2 className="confirm-section-title">目标模拟器</h2>
            <div className="simulator-actions">
              <button type="button" className="simulator-action-btn simulator-action-btn--reset" onClick={handleReset}>
                重置
              </button>
              <button type="button" className="simulator-action-btn simulator-action-btn--calculate" onClick={handleCalculate}>
                计算分平台目标
              </button>
              <button type="button" className="simulator-action-btn simulator-action-btn--confirm" onClick={handleConfirm}>
                确认启动新品
              </button>
            </div>
          </div>

          <div className="simulator-content">
            <div className="simulator-left">
              <h3 className="simulator-subtitle">销售目标</h3>
              <div className="simulator-input-group">
                <label className="simulator-input-label">目标GMV (元)</label>
                <input
                  type="number"
                  className="simulator-input"
                  value={targets.targetGMV}
                  onChange={(e) => handleTargetChange('targetGMV', Number(e.target.value))}
                />
              </div>
              <div className="simulator-input-group">
                <label className="simulator-input-label">目标预算 (元)</label>
                <input
                  type="number"
                  className="simulator-input"
                  value={targets.targetBudget}
                  onChange={(e) => handleTargetChange('targetBudget', Number(e.target.value))}
                />
              </div>
              <div className="simulator-input-group">
                <label className="simulator-input-label">目标ROI 下限</label>
                <input
                  type="number"
                  className="simulator-input"
                  value={targets.targetRoiFloor}
                  onChange={(e) => handleTargetChange('targetRoiFloor', Number(e.target.value))}
                />
              </div>
              <div className="simulator-input-group">
                <label className="simulator-input-label">客单价AOV (元/单)</label>
                <input
                  type="number"
                  className="simulator-input"
                  value={targets.targetAOV}
                  onChange={(e) => handleTargetChange('targetAOV', Number(e.target.value))}
                />
              </div>
            </div>

            <div className="simulator-middle">
              <h3 className="simulator-subtitle">平台占比</h3>
              <div className="platform-share-inputs">
                <div className="platform-share-item">
                  <label className="simulator-input-label">抖音</label>
                  <input
                    type="number"
                    className="simulator-input"
                    value={targets.platformShare.douyin}
                    onChange={(e) => handlePlatformShareChange('douyin', Number(e.target.value))}
                  />
                  <span className="platform-share-percent">%</span>
                </div>
                <div className="platform-share-item">
                  <label className="simulator-input-label">天猫</label>
                  <input
                    type="number"
                    className="simulator-input"
                    value={targets.platformShare.tmall}
                    onChange={(e) => handlePlatformShareChange('tmall', Number(e.target.value))}
                  />
                  <span className="platform-share-percent">%</span>
                </div>
                <div className="platform-share-item">
                  <label className="simulator-input-label">京东</label>
                  <input
                    type="number"
                    className="simulator-input"
                    value={targets.platformShare.jd}
                    onChange={(e) => handlePlatformShareChange('jd', Number(e.target.value))}
                  />
                  <span className="platform-share-percent">%</span>
                </div>
              </div>
              <div className="platform-share-note">注:三者和=1,可微调</div>
            </div>

            <div className="simulator-right">
              <h3 className="simulator-subtitle">效率</h3>
              <table className="efficiency-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>抖音</th>
                    <th>天猫</th>
                    <th>京东</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>点击率</td>
                    <td>1%</td>
                    <td>18%</td>
                    <td>20%</td>
                  </tr>
                  <tr>
                    <td>支付率</td>
                    <td>90%</td>
                    <td>92%</td>
                    <td>93%</td>
                  </tr>
                  <tr>
                    <td>退款率</td>
                    <td>10%</td>
                    <td>8%</td>
                    <td>7%</td>
                  </tr>
                </tbody>
              </table>
              <div className="efficiency-note">注:留空任意一列将自动降级为简化模式(使用全局CVR+平台CTR)</div>
            </div>
          </div>

          <div className="simulator-bottom">
            <div className="cold-start-targets">
              <h3 className="simulator-subtitle">冷启动目标</h3>
              <div className="cold-start-inputs">
                <div className="cold-start-item">
                  <label className="simulator-input-label">GMV</label>
                  <input
                    type="number"
                    className="simulator-input"
                    value={targets.coldStartGMV || 3000000}
                    onChange={(e) => handleTargetChange('coldStartGMV', Number(e.target.value))}
                  />
                </div>
                <div className="cold-start-item">
                  <label className="simulator-input-label">roi</label>
                  <input
                    type="number"
                    className="simulator-input"
                    value={targets.coldStartROI || 3000000}
                    onChange={(e) => handleTargetChange('coldStartROI', Number(e.target.value))}
                  />
                </div>
                <div className="cold-start-item">
                  <label className="simulator-input-label">购买人数</label>
                  <input
                    type="number"
                    className="simulator-input"
                    value={targets.coldStartBuyers || 2000}
                    onChange={(e) => handleTargetChange('coldStartBuyers', Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
            <div className="launch-date-input">
              <label className="simulator-input-label">新品上市日</label>
              <input
                type="date"
                className="simulator-input"
                value={targets.launchDate || ''}
                onChange={(e) => handleTargetChange('launchDate', e.target.value)}
              />
            </div>
          </div>
        </Card>

        {/* C) 分平台目标 */}
        <Card className="platform-targets-card" padding="large">
          <h2 className="confirm-section-title">分平台目标</h2>
          <table className="platform-targets-table">
            <thead>
              <tr>
                <th>平台</th>
                <th>目标GMV</th>
                <th>目标预算</th>
                <th>目标ROI下限</th>
                <th>目标订单数</th>
                <th>目标CPA</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>抖音</td>
                <td>639,000</td>
                <td>255,600</td>
                <td>2.50</td>
                <td>64,546</td>
                <td>3.96</td>
              </tr>
              <tr>
                <td>天猫</td>
                <td>1,761,000</td>
                <td>255,600</td>
                <td>2.50</td>
                <td>64,546</td>
                <td>3.96</td>
              </tr>
              <tr>
                <td>京东</td>
                <td>1,761,000</td>
                <td>255,600</td>
                <td>2.50</td>
                <td>64,546</td>
                <td>3.96</td>
              </tr>
              <tr className="summary-row">
                <td>汇总</td>
                <td colSpan={5}>
                  GMV 3,000,000 | 预算 1,200,000 | 预计支付 303,032
                </td>
              </tr>
            </tbody>
          </table>
        </Card>

        {/* D) 达成目标所需流量 */}
        <Card className="traffic-required-card" padding="large">
          <h2 className="confirm-section-title">达成目标所需流量</h2>
          <table className="traffic-required-table">
            <thead>
              <tr>
                <th>平台</th>
                <th>所需曝光</th>
                <th>所需点击</th>
                <th>所需支付订单数</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>抖音</td>
                <td>101,872,188</td>
                <td>1,629,955</td>
                <td>64,546</td>
              </tr>
              <tr>
                <td>天猫</td>
                <td>101,872,188</td>
                <td>1,629,955</td>
                <td>64,546</td>
              </tr>
              <tr>
                <td>京东</td>
                <td>101,872,188</td>
                <td>1,629,955</td>
                <td>64,546</td>
              </tr>
            </tbody>
          </table>
          <div className="table-note">
            详细模式:使用CTR/到达率/下单率/支付率;简化模式:使用全局CVR(点击→支付)+CTR
          </div>
        </Card>

        {/* E) 费用 */}
        <Card className="costs-card" padding="large">
          <h2 className="confirm-section-title">费用</h2>
          <table className="costs-table">
            <thead>
              <tr>
                <th>平台</th>
                <th>目标预算</th>
                <th>目标CPA</th>
                <th>目标ROI下限</th>
                <th>目标ROI下限(扣退)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>抖音</td>
                <td>101,872,188</td>
                <td>3.96</td>
                <td>2.50</td>
                <td>2.50</td>
              </tr>
              <tr>
                <td>天猫</td>
                <td>101,872,188</td>
                <td>3.96</td>
                <td>2.50</td>
                <td>2.50</td>
              </tr>
              <tr>
                <td>京东</td>
                <td>101,872,188</td>
                <td>3.96</td>
                <td>2.50</td>
                <td>2.50</td>
              </tr>
            </tbody>
          </table>
          <div className="table-note">CPA = 预算 / 预计支付单量。</div>
        </Card>
      </div>

      {/* Toast 提示 */}
      {showToast && (
        <div className="confirm-toast">
          {toastMessage}
        </div>
      )}
    </MainLayout>
  )
}

