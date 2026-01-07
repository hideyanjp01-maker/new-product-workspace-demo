import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams, useParams } from 'react-router-dom'
import MainLayout from '../../components/layout/MainLayout'
import PageHeader from '../../components/layout/PageHeader'
import FilterBar from '../../components/layout/FilterBar'
import { Card, Button, Tabs } from '../../components/ui'
import { useAppStore } from '../../store/appStore'
import { getProductById, getMetricsByRole, getRoleById, type Product } from '../../data/mockData'
import './RolePageBase.css'

// 角色对应的阶段映射
const roleStageMap: Record<string, string> = {
  'new-product-insight': 'insight',
  'ai-insight': 'insight',
  'market-analysis': 'insight',
  'brand-manager': 'planning',
  'product-management': 'planning',
  'ecommerce-director': 'cold-start',
  'tmall-operation': 'scale-up',
  'tmall-traffic': 'scale-up',
  'jd-operation': 'scale-up',
  'jd-traffic': 'scale-up',
  'douyin-shop': 'cold-start',
  'douyin-advertising': 'cold-start',
  'douyin-content': 'cold-start',
  'douyin-business': 'cold-start',
  'talent-insight': 'planning',
  'competitor-analysis': 'planning',
  'material-generator': 'planning',
  'task': 'planning'
}

// 阶段路由映射
const stageRouteMap: Record<string, string> = {
  'insight': '/stages/insight',
  'planning': '/stages/planning',
  'cold-start': '/stages/cold-start',
  'scale-up': '/stages/scale-up'
}

export default function GenericRolePage() {
  const navigate = useNavigate()
  const { roleId } = useParams<{ roleId: string }>()
  const [searchParams] = useSearchParams()
  const { dateA, dateB, viewMode, setViewMode, selectedProductId, setSelectedProductId } = useAppStore()
  const [product, setProduct] = useState<Product | null>(null)
  const [metrics, setMetrics] = useState<any[]>([])

  const role = roleId ? getRoleById(roleId) : null
  const productId = searchParams.get('product') || selectedProductId
  const stage = roleId ? roleStageMap[roleId] : null
  const backPath = stage ? stageRouteMap[stage] : '/stages/insight'

  useEffect(() => {
    if (roleId) {
      setMetrics(getMetricsByRole(roleId))
    }
  }, [roleId])

  useEffect(() => {
    if (productId) {
      const p = getProductById(productId)
      setProduct(p || null)
      setSelectedProductId(productId)
    }
  }, [productId, setSelectedProductId])

  if (!role) {
    return (
      <MainLayout>
        <div style={{ padding: '2rem' }}>
          <p>角色不存在</p>
        </div>
      </MainLayout>
    )
  }

  const tabs = [
    {
      key: 'dashboard',
      label: '数据看板',
      content: (
        <div className="role-dashboard">
          {product && (
            <div className="product-info-section">
              <Card padding="large">
                <h2 className="section-title">当前产品：{product.name}</h2>
                <div className="product-info-grid">
                  <div className="info-item">
                    <span className="info-label">分类</span>
                    <span className="info-value">{product.category}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">价格</span>
                    <span className="info-value">¥{product.price}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">阶段</span>
                    <span className="info-value">{product.phase}</span>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {metrics.length > 0 && (
            <div className="metrics-section">
              <h2 className="section-title">{role.name}指标</h2>
              <div className="metrics-grid">
                {metrics.map((metric) => (
                  <Card key={metric.id} padding="medium" hoverable>
                    <div className="metric-card">
                      <div className="metric-name">{metric.name}</div>
                      <div className="metric-value-row">
                        <span className="metric-value">
                          {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                        </span>
                        {metric.unit && <span className="metric-unit">{metric.unit}</span>}
                        {metric.trend && (
                          <span className={`metric-trend metric-trend--${metric.trend}`}>
                            {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'}
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {product && product.targetMetrics && (
            <div className="target-metrics-section">
              <Card padding="large">
                <h2 className="section-title">目标指标</h2>
                <div className="target-metrics-list">
                  {Object.entries(product.targetMetrics).map(([key, value]) => (
                    <div key={key} className="target-metric-item">
                      <span className="target-metric-label">{key}</span>
                      <span className="target-metric-value">{value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {product && product.currentMetrics && (
            <div className="target-metrics-section">
              <Card padding="large">
                <h2 className="section-title">当前指标</h2>
                <div className="target-metrics-list">
                  {Object.entries(product.currentMetrics).map(([key, value]) => (
                    <div key={key} className="target-metric-item">
                      <span className="target-metric-label">{key}</span>
                      <span className="target-metric-value">{value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>
      )
    },
    {
      key: 'ai',
      label: 'AI洞察',
      content: (
        <div className="role-ai">
          <Card padding="large">
            <h2 className="section-title">AI分析洞察</h2>
            <div className="ai-insights-list">
              {dateA === '2024-01-01' ? (
                <>
                  <div className="ai-insight-item">
                    <p>根据 {dateA} 至 {dateB} 的数据分析，{role.name}需要关注相关指标的表现和趋势。</p>
                  </div>
                  <div className="ai-insight-item">
                    <p>建议根据数据反馈调整策略，优化运营效果和业务指标。</p>
                  </div>
                  <div className="ai-insight-item">
                    <p>目标指标设定需要与实际情况对齐，确保策略的可行性和有效性。</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="ai-insight-item">
                    <p>根据 {dateA} 至 {dateB} 的最新数据分析，{role.name}表现良好，相关指标持续改善。</p>
                  </div>
                  <div className="ai-insight-item">
                    <p>建议继续保持当前策略，同时关注市场动态，保持竞争优势。</p>
                  </div>
                  <div className="ai-insight-item">
                    <p>运营效率持续提升，建议加大投入力度，进一步扩大业务规模。</p>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      )
    }
  ]

  return (
    <MainLayout>
      <PageHeader
        title={role.name}
        subtitle={role.description}
        backPath={backPath}
        actions={
          <Button variant="primary" onClick={() => navigate(backPath)}>
            返回{stage === 'insight' ? '洞察期' : stage === 'planning' ? '企划期' : stage === 'cold-start' ? '冷启动期' : '放量期'}
          </Button>
        }
      />
      <FilterBar showDateFilter showSearch={false} showCategoryFilter={false} />
      <Tabs items={tabs} activeKey={viewMode} onChange={(key) => setViewMode(key as 'dashboard' | 'ai')} />
    </MainLayout>
  )
}






