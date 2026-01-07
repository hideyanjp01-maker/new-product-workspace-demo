import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import MainLayout from '../../components/layout/MainLayout'
import PageHeader from '../../components/layout/PageHeader'
import FilterBar from '../../components/layout/FilterBar'
import { Card, Button, Tabs } from '../../components/ui'
import { useAppStore } from '../../store/appStore'
import { getProductById, getMetricsByRole, type Product } from '../../data/mockData'
import './RolePageBase.css'

export default function BrandManagerRolePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { dateA, dateB, viewMode, setViewMode, selectedProductId, setSelectedProductId } = useAppStore()
  const productId = searchParams.get('product') || selectedProductId
  const [product, setProduct] = useState<Product | null>(null)
  const [metrics] = useState(getMetricsByRole('brand-manager'))

  useEffect(() => {
    if (productId) {
      const p = getProductById(productId)
      setProduct(p || null)
      setSelectedProductId(productId)
    }
  }, [productId, setSelectedProductId])

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
                    <span className="info-label">状态</span>
                    <span className="info-value">{product.status}</span>
                  </div>
                </div>
              </Card>
            </div>
          )}

          <div className="metrics-section">
            <h2 className="section-title">品牌指标</h2>
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
                    <p>根据 {dateA} 至 {dateB} 的数据分析，品牌负责人需要关注品牌定位和价格策略的制定。</p>
                  </div>
                  <div className="ai-insight-item">
                    <p>建议根据市场反馈调整品牌形象，提升品牌知名度和用户认知度。</p>
                  </div>
                  <div className="ai-insight-item">
                    <p>目标指标设定需要与市场数据对齐，确保品牌策略的可行性。</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="ai-insight-item">
                    <p>根据 {dateA} 至 {dateB} 的最新数据分析，品牌表现良好，品牌知名度持续提升。</p>
                  </div>
                  <div className="ai-insight-item">
                    <p>建议继续保持当前品牌策略，同时关注竞品动态，保持竞争优势。</p>
                  </div>
                  <div className="ai-insight-item">
                    <p>价格策略需要根据市场反馈进行微调，确保品牌价值与价格匹配。</p>
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
        title="品牌负责人"
        subtitle="品牌策略和定位管理"
        backPath="/stages/planning"
        actions={
          <Button variant="primary" onClick={() => navigate('/stages/planning')}>
            返回企划期
          </Button>
        }
      />
      <FilterBar showDateFilter showSearch={false} showCategoryFilter={false} />
      <Tabs items={tabs} activeKey={viewMode} onChange={(key) => setViewMode(key as 'dashboard' | 'ai')} />
    </MainLayout>
  )
}

