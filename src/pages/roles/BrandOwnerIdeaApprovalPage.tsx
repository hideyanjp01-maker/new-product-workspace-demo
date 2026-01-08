import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import MainLayout from '../../components/layout/MainLayout'
import PageHeader from '../../components/layout/PageHeader'
import { Card, Button } from '../../components/ui'
import { useNewProductFlowStore } from '../../store/newProductFlowStore'
import './BrandOwnerIdeaApprovalPage.css'

export default function BrandOwnerIdeaApprovalPage() {
  const { ideaId } = useParams<{ ideaId: string }>()
  const navigate = useNavigate()
  const getIdeaById = useNewProductFlowStore((state) => state.getIdeaById)
  const approveIdea = useNewProductFlowStore((state) => state.approveIdea)
  const rejectIdea = useNewProductFlowStore((state) => state.rejectIdea)
  
  const idea = ideaId ? getIdeaById(ideaId) : null
  
  // 目标模拟器状态
  const [targetGMV, setTargetGMV] = useState(3000000)
  const [gmvGrowthRate, setGmvGrowthRate] = useState('12.5')
  const [targetFeeRatio, setTargetFeeRatio] = useState('40')
  const [roiGrowthRate, setRoiGrowthRate] = useState('10')
  const [threeMonthTargets, setThreeMonthTargets] = useState<Array<{
    month: string
    targetGMV: number
    targetBudget: number
    targetCostRatio: string
  }>>([])

  useEffect(() => {
    if (!idea) {
      // 如果找不到 idea，返回企划期页面
      navigate('/stages/planning')
    }
  }, [idea, navigate])

  const handleCalculate = () => {
    // 计算三个月目标（系数法）
    const coefficients = [
      { gmv: 0.19, budget: 0.09 },
      { gmv: 0.17, budget: 0.073333 },
      { gmv: 0.14, budget: 0.053333 }
    ]
    
    const targets = coefficients.map((coeff, idx) => ({
      month: `${idx + 1}月`,
      targetGMV: Math.round(targetGMV * coeff.gmv),
      targetBudget: Math.round(targetGMV * coeff.budget),
      targetCostRatio: `${targetFeeRatio}%`
    }))
    
    setThreeMonthTargets(targets)
  }

  const handleApprove = () => {
    if (ideaId) {
      approveIdea(ideaId)
      navigate('/stages/planning')
    }
  }

  const handleReject = () => {
    if (ideaId) {
      rejectIdea(ideaId)
      navigate('/stages/planning')
    }
  }

  if (!idea) {
    return null
  }

  // 评分体系数据（从 idea 或使用默认值）
  const scoringSystem = {
    trackGrowthRate: 80,
    rampUpPeriod: 85,
    newProductPenetrationRate: 70,
    pricingReasonableness: 70,
    sellingPointMatching: 50,
    overallScore: 69.8
  }

  return (
    <MainLayout>
      <PageHeader
        title={`待启动新品：${idea.title}`}
        subtitle="试销审批"
        backPath="/stages/planning"
      />

      <div className="approval-page-content">
        {/* 上半区：立项锚点 + 画像 + 审批按钮 */}
        <div className="approval-top-section" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          {/* 左卡：立项锚点 */}
          <Card padding="large">
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
          </Card>

          {/* 右卡：画像 + 审批按钮 */}
          <Card padding="large">
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>画像</h3>
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
            
            {/* 审批按钮组 */}
            <div className="approval-buttons" style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <Button variant="outline" onClick={handleReject}>
                驳回
              </Button>
              <Button variant="primary" onClick={handleApprove}>
                同意
              </Button>
            </div>
          </Card>
        </div>

        {/* 目标模拟器模块 */}
        <Card padding="large" style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>目标模拟器</h3>
          
          <div className="simulator-inputs" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>目标GMV（元）</label>
              <input
                type="number"
                value={targetGMV}
                onChange={(e) => setTargetGMV(Number(e.target.value))}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>GMV提升率</label>
              <input
                type="text"
                value={gmvGrowthRate}
                onChange={(e) => setGmvGrowthRate(e.target.value)}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>目标费比</label>
              <input
                type="text"
                value={targetFeeRatio}
                onChange={(e) => setTargetFeeRatio(e.target.value)}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>ROI提升率</label>
              <input
                type="text"
                value={roiGrowthRate}
                onChange={(e) => setRoiGrowthRate(e.target.value)}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
          </div>

          <Button variant="primary" onClick={handleCalculate} style={{ marginBottom: '16px' }}>
            试算三月路径
          </Button>

          {threeMonthTargets.length > 0 && (
            <div className="three-month-table">
              <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>三个月目标试算</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f5f5f5' }}>
                    <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>月</th>
                    <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>目标GMV（元）</th>
                    <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>目标预算（元）</th>
                    <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>目标费比</th>
                  </tr>
                </thead>
                <tbody>
                  {threeMonthTargets.map((target, idx) => (
                    <tr key={idx}>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>{target.month}</td>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                        {target.targetGMV.toLocaleString('zh-CN')}
                      </td>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                        {target.targetBudget.toLocaleString('zh-CN')}
                      </td>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>{target.targetCostRatio}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* 评分体系模块 */}
        <Card padding="large">
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>评分体系</h3>
          
          <div className="scoring-dimensions" style={{ marginBottom: '24px' }}>
            {[
              { label: '赛道增速', value: scoringSystem.trackGrowthRate },
              { label: '起量周期', value: scoringSystem.rampUpPeriod },
              { label: '新品渗透率', value: scoringSystem.newProductPenetrationRate },
              { label: '定价合理度', value: scoringSystem.pricingReasonableness },
              { label: '卖点匹配度', value: scoringSystem.sellingPointMatching }
            ].map((dimension, idx) => (
              <div key={idx} className="scoring-dimension" style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '14px' }}>{dimension.label}</span>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>{dimension.value}分</span>
                </div>
                <div
                  className="scoring-bar"
                  style={{
                    height: '24px',
                    background: '#f0f0f0',
                    borderRadius: '4px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  title={`${dimension.label} ${dimension.value}分`}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${dimension.value}%`,
                      background: '#4caf50',
                      borderRadius: '4px',
                      transition: 'width 0.3s'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* 综合评分 */}
          <div className="overall-score" style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #eee' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '16px', fontWeight: 600 }}>综合评分</span>
              <span style={{ fontSize: '16px', fontWeight: 600, color: '#4caf50' }}>
                {scoringSystem.overallScore}/100
              </span>
            </div>
            <div
              className="overall-score-bar"
              style={{
                height: '32px',
                background: '#f0f0f0',
                borderRadius: '4px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${scoringSystem.overallScore}%`,
                  background: '#4caf50',
                  borderRadius: '4px',
                  transition: 'width 0.3s'
                }}
              />
            </div>
          </div>

          <p style={{ marginTop: '16px', fontSize: '12px', color: '#999' }}>
            点击任意维度查看「公式 + 分子分母 + 证据表」。
          </p>
        </Card>
      </div>
    </MainLayout>
  )
}

