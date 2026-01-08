import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import MainLayout from '../../components/layout/MainLayout'
import PageHeader from '../../components/layout/PageHeader'
import { Card, Button } from '../../components/ui'
import { useNewProductFlowStore } from '../../store/newProductFlowStore'
import { useAppStore } from '../../store/appStore'
import './EcommerceOwnerIdeaApprovalPage.css'

interface PlatformTarget {
  platform: string
  targetGMV: number
  targetBudget: number
  targetRoiFloor: number
  targetOrders: number
  targetCPA: number
}

interface TrafficRequired {
  platform: string
  requiredExposure: number
  requiredClicks: number
  requiredPayOrders: number
}

interface CostTable {
  platform: string
  targetBudget: number
  targetCPA: number
  targetRoiFloor: number
  targetRoiFloorAfterRefund: number
}

export default function EcommerceOwnerIdeaApprovalPage() {
  const { ideaId } = useParams<{ ideaId: string }>()
  const navigate = useNavigate()
  const { setCurrentStage } = useAppStore()
  const getIdeaById = useNewProductFlowStore((state) => state.getIdeaById)
  const ownerApproveStart = useNewProductFlowStore((state) => state.ownerApproveStart)
  
  const idea = ideaId ? getIdeaById(ideaId) : null

  // 目标模拟器状态
  const [targetGMV, setTargetGMV] = useState(3000000)
  const [targetBudget, setTargetBudget] = useState(1200000)
  const [targetRoiFloor, setTargetRoiFloor] = useState(2.5)
  const [targetAOV, setTargetAOV] = useState(9.9)
  const [platformShare, setPlatformShare] = useState({ douyin: 20, tmall: 30, jd: 50 })
  
  // 效率数据（按平台）
  const [efficiency, setEfficiency] = useState({
    ctr: { douyin: 1, tmall: 18, jd: 20 },
    payRate: { douyin: 90, tmall: 92, jd: 93 },
    refundRate: { douyin: 10, tmall: 8, jd: 7 }
  })

  // 计算结果
  const [platformTargets, setPlatformTargets] = useState<PlatformTarget[]>([])
  const [trafficRequired, setTrafficRequired] = useState<TrafficRequired[]>([])
  const [costTable, setCostTable] = useState<CostTable[]>([])
  const [isCalculated, setIsCalculated] = useState(false)

  useEffect(() => {
    setCurrentStage('planning')
  }, [setCurrentStage])

  useEffect(() => {
    if (idea) {
      setTargetGMV(idea.anchor.suggestGMV)
      setTargetBudget(idea.anchor.suggestBudget)
      setTargetRoiFloor(parseFloat(idea.anchor.suggestFeeRatioText))
      setTargetAOV(idea.anchor.suggestAOV)
    }
  }, [idea])

  if (!idea) {
    return (
      <MainLayout>
        <PageHeader
          title="电商负责人最终审批"
          subtitle="审批启动新品"
          backPath="/stages/planning"
        />
        <Card padding="large">
          <div className="empty-state">
            <p>灵感卡片不存在</p>
          </div>
        </Card>
      </MainLayout>
    )
  }

  const handleReset = () => {
    if (idea) {
      setTargetGMV(idea.anchor.suggestGMV)
      setTargetBudget(idea.anchor.suggestBudget)
      setTargetRoiFloor(parseFloat(idea.anchor.suggestFeeRatioText))
      setTargetAOV(idea.anchor.suggestAOV)
      setPlatformShare({ douyin: 20, tmall: 30, jd: 50 })
      setIsCalculated(false)
      setPlatformTargets([])
      setTrafficRequired([])
      setCostTable([])
    }
  }

  const handleCalculate = () => {
    const platforms: Array<'douyin' | 'tmall' | 'jd'> = ['douyin', 'tmall', 'jd']
    
    // 计算分平台目标
    const targets: PlatformTarget[] = platforms.map(platform => {
      const share = platformShare[platform] / 100
      const platformGMV = targetGMV * share
      const platformBudget = targetBudget * share
      const platformOrders = Math.round(platformGMV / targetAOV)
      const platformCPA = platformOrders > 0 ? platformBudget / platformOrders : 0
      
      return {
        platform: platform === 'douyin' ? '抖音' : platform === 'tmall' ? '天猫' : '京东',
        targetGMV: Math.round(platformGMV),
        targetBudget: Math.round(platformBudget),
        targetRoiFloor: targetRoiFloor,
        targetOrders: platformOrders,
        targetCPA: parseFloat(platformCPA.toFixed(2))
      }
    })

    // 计算所需流量
    const traffic: TrafficRequired[] = platforms.map(platform => {
      const target = targets.find(t => 
        t.platform === (platform === 'douyin' ? '抖音' : platform === 'tmall' ? '天猫' : '京东')
      )!
      const ctr = efficiency.ctr[platform] / 100
      const payRate = efficiency.payRate[platform] / 100
      
      const requiredPayOrders = target.targetOrders
      const requiredClicks = Math.ceil(requiredPayOrders / Math.max(payRate, 0.01))
      const requiredExposure = Math.ceil(requiredClicks / Math.max(ctr, 0.001))
      
      return {
        platform: target.platform,
        requiredExposure,
        requiredClicks,
        requiredPayOrders
      }
    })

    // 计算费用表
    const costs: CostTable[] = platforms.map(platform => {
      const target = targets.find(t => 
        t.platform === (platform === 'douyin' ? '抖音' : platform === 'tmall' ? '天猫' : '京东')
      )!
      const refundRate = efficiency.refundRate[platform] / 100
      const roiAfterRefund = targetRoiFloor * (1 - refundRate)
      
      return {
        platform: target.platform,
        targetBudget: target.targetBudget,
        targetCPA: target.targetCPA,
        targetRoiFloor: targetRoiFloor,
        targetRoiFloorAfterRefund: parseFloat(roiAfterRefund.toFixed(2))
      }
    })

    setPlatformTargets(targets)
    setTrafficRequired(traffic)
    setCostTable(costs)
    setIsCalculated(true)
  }

  const handleConfirm = () => {
    if (ideaId) {
      ownerApproveStart(ideaId)
      navigate('/stages/planning')
    }
  }

  const totalGMV = platformTargets.reduce((sum, t) => sum + t.targetGMV, 0)
  const totalBudget = platformTargets.reduce((sum, t) => sum + t.targetBudget, 0)
  const totalOrders = platformTargets.reduce((sum, t) => sum + t.targetOrders, 0)

  return (
    <MainLayout>
      <PageHeader
        title={`待启动新品（品牌负责人已批准）：${idea.title}`}
        subtitle="电商负责人最终审批"
        backPath="/stages/planning"
      />

      <div className="ecommerce-idea-approval-content">
        {/* 立项锚点 + 画像 */}
        <Card padding="large" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>立项锚点</h3>
              <div className="anchor-info">
                <div className="anchor-item">
                  <span className="anchor-label">建议总GMV</span>
                  <span className="anchor-value">{idea.anchor.suggestGMV.toLocaleString('zh-CN')}</span>
                </div>
                <div className="anchor-item">
                  <span className="anchor-label">建议预算</span>
                  <span className="anchor-value">{idea.anchor.suggestBudget.toLocaleString('zh-CN')}</span>
                </div>
                <div className="anchor-item">
                  <span className="anchor-label">建议费比</span>
                  <span className="anchor-value">{idea.anchor.suggestFeeRatioText}</span>
                </div>
                <div className="anchor-item">
                  <span className="anchor-label">建议AOV</span>
                  <span className="anchor-value">{idea.anchor.suggestAOV}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>性别/年龄/地域/卖点</h3>
              <div className="portrait-info">
                <div className="portrait-item">
                  <span className="portrait-label">性别</span>
                  <span className="portrait-value">{idea.portrait.gender}</span>
                </div>
                <div className="portrait-item">
                  <span className="portrait-label">年龄</span>
                  <span className="portrait-value">{idea.portrait.age}</span>
                </div>
                <div className="portrait-item">
                  <span className="portrait-label">地域</span>
                  <span className="portrait-value">{idea.portrait.region}</span>
                </div>
                <div className="portrait-item">
                  <span className="portrait-label">卖点</span>
                  <span className="portrait-value">{idea.portrait.sellingPoint}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 目标模拟器 */}
        <Card padding="large" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600 }}>目标模拟器</h2>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button variant="outline" onClick={handleReset}>重置</Button>
              <Button variant="secondary" onClick={handleCalculate}>计算分平台目标</Button>
              <Button variant="primary" onClick={handleConfirm}>确认启动新品</Button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginBottom: '24px' }}>
            {/* 销售目标 */}
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>销售目标</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px' }}>目标GMV (元)</label>
                  <input
                    type="number"
                    value={targetGMV}
                    onChange={(e) => setTargetGMV(Number(e.target.value))}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px' }}>目标预算 (元)</label>
                  <input
                    type="number"
                    value={targetBudget}
                    onChange={(e) => setTargetBudget(Number(e.target.value))}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px' }}>目标ROI下限</label>
                  <input
                    type="number"
                    step="0.1"
                    value={targetRoiFloor}
                    onChange={(e) => setTargetRoiFloor(Number(e.target.value))}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px' }}>客单价AOV (元/单)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={targetAOV}
                    onChange={(e) => setTargetAOV(Number(e.target.value))}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
              </div>
            </div>

            {/* 平台占比 */}
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>平台占比</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {(['douyin', 'tmall', 'jd'] as const).map(platform => (
                  <div key={platform}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px' }}>
                      {platform === 'douyin' ? '抖音' : platform === 'tmall' ? '天猫' : '京东'}
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="number"
                        value={platformShare[platform]}
                        onChange={(e) => {
                          const value = Number(e.target.value)
                          setPlatformShare({ ...platformShare, [platform]: value })
                        }}
                        style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                      />
                      <span style={{ fontSize: '14px' }}>%</span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>注: 三者和=100%，可微调</div>
            </div>

            {/* 效率 */}
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>效率</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}></th>
                    <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>抖音</th>
                    <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>天猫</th>
                    <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>京东</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>点击率</td>
                    <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>{efficiency.ctr.douyin}%</td>
                    <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>{efficiency.ctr.tmall}%</td>
                    <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>{efficiency.ctr.jd}%</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>支付率</td>
                    <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>{efficiency.payRate.douyin}%</td>
                    <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>{efficiency.payRate.tmall}%</td>
                    <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>{efficiency.payRate.jd}%</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>退款率</td>
                    <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>{efficiency.refundRate.douyin}%</td>
                    <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>{efficiency.refundRate.tmall}%</td>
                    <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>{efficiency.refundRate.jd}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        {/* 计算结果表格 */}
        {isCalculated && (
          <>
            {/* 分平台目标表 */}
            <Card padding="large" style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>分平台目标</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ background: '#f5f5f5' }}>
                    <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>平台</th>
                    <th style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>目标GMV</th>
                    <th style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>目标预算</th>
                    <th style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>目标ROI下限</th>
                    <th style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>目标订单数</th>
                    <th style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>目标CPA</th>
                  </tr>
                </thead>
                <tbody>
                  {platformTargets.map((target, idx) => (
                    <tr key={idx}>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>{target.platform}</td>
                      <td style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>
                        {target.targetGMV.toLocaleString('zh-CN')}
                      </td>
                      <td style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>
                        {target.targetBudget.toLocaleString('zh-CN')}
                      </td>
                      <td style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>
                        {target.targetRoiFloor.toFixed(2)}
                      </td>
                      <td style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>
                        {target.targetOrders.toLocaleString('zh-CN')}
                      </td>
                      <td style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>
                        {target.targetCPA.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  <tr style={{ background: '#f9f9f9', fontWeight: 600 }}>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>汇总</td>
                    <td colSpan={5} style={{ padding: '10px', border: '1px solid #ddd' }}>
                      GMV {totalGMV.toLocaleString('zh-CN')} | 预算 {totalBudget.toLocaleString('zh-CN')} | 预计支付 {totalOrders.toLocaleString('zh-CN')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Card>

            {/* 达成目标所需流量表 */}
            <Card padding="large" style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>达成目标所需流量</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ background: '#f5f5f5' }}>
                    <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>平台</th>
                    <th style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>所需曝光</th>
                    <th style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>所需点击</th>
                    <th style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>所需支付订单数</th>
                  </tr>
                </thead>
                <tbody>
                  {trafficRequired.map((traffic, idx) => (
                    <tr key={idx}>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>{traffic.platform}</td>
                      <td style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>
                        {traffic.requiredExposure.toLocaleString('zh-CN')}
                      </td>
                      <td style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>
                        {traffic.requiredClicks.toLocaleString('zh-CN')}
                      </td>
                      <td style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>
                        {traffic.requiredPayOrders.toLocaleString('zh-CN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ fontSize: '12px', color: '#999', marginTop: '12px' }}>
                详细模式: 使用CTR/到达率/下单率/支付率; 简化模式: 使用全局CVR(点击→支付)+CTR
              </div>
            </Card>

            {/* 费用表 */}
            <Card padding="large" style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>费用</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ background: '#f5f5f5' }}>
                    <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>平台</th>
                    <th style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>目标预算</th>
                    <th style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>目标CPA</th>
                    <th style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>目标ROI下限</th>
                    <th style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>目标ROI下限(扣退)</th>
                  </tr>
                </thead>
                <tbody>
                  {costTable.map((cost, idx) => (
                    <tr key={idx}>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>{cost.platform}</td>
                      <td style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>
                        {cost.targetBudget.toLocaleString('zh-CN')}
                      </td>
                      <td style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>
                        {cost.targetCPA.toFixed(2)}
                      </td>
                      <td style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>
                        {cost.targetRoiFloor.toFixed(2)}
                      </td>
                      <td style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>
                        {cost.targetRoiFloorAfterRefund.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ fontSize: '12px', color: '#999', marginTop: '12px' }}>
                CPA = 预算 / 预计支付单量
              </div>
            </Card>
          </>
        )}
      </div>
    </MainLayout>
  )
}

