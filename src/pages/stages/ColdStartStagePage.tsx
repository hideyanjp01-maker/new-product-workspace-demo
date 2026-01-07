import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../../components/layout/MainLayout'
import PageHeader from '../../components/layout/PageHeader'
import FilterBar from '../../components/layout/FilterBar'
import { Card, Button, Tabs } from '../../components/ui'
import { useAppStore } from '../../store/appStore'
import { getProducts, getRoles, getMetricsByRole, type Product } from '../../data/mockData'
import { ecommerceOwnerStageConfig } from '../../config/roleStage/ecommerce_owner'
import { brandOwnerStageConfig } from '../../config/roleStage/bu_brand_owner'
import { marketAnalysisStageConfig } from '../../config/roleStage/market_analysis'
import { douyinShopOpsStageConfig } from '../../config/roleStage/douyin_store_live'
import { ecommerceBDStageConfig } from '../../config/roleStage/ecommerce_bd'
import { douyinAdsStageConfig } from '../../config/roleStage/douyin_ads'
import { jdTrafficStageConfig } from '../../config/roleStage/jd_traffic'
import { jdOperatorStageConfig } from '../../config/roleStage/jd_ops'
import { tmallTrafficStageConfig } from '../../config/roleStage/tmall_traffic'
import { getTmallTrafficOpsStageConfig } from '../../config/roleStage/tmall_traffic_ops'
import TmallTrafficOpsStageRenderer from '../../components/roleStage/TmallTrafficOpsStageRenderer'
import { getTmallOpsStageConfig } from '../../config/roleStage/tmall_ops'
import TmallOpsStageRenderer from '../../components/roleStage/TmallOpsStageRenderer'
import StageSectionRenderer from '../../components/roleStage/StageSectionRenderer'
// 回退：移除 Owner 动态配置与 TmallOps 渲染器
import BrandOwnerStageRenderer from '../../components/roleStage/BrandOwnerStageRenderer'
import BrandOwnerAIInsightExtended from '../../components/roleStage/BrandOwnerAIInsightExtended'
import MarketAnalysisStageRenderer from '../../components/roleStage/MarketAnalysisStageRenderer'
import DouyinShopOpsStageRenderer from '../../components/roleStage/DouyinShopOpsStageRenderer'
import DouyinBizStageRenderer from '../../components/roleStage/DouyinBizStageRenderer'
import DouyinAdsStageRenderer from '../../components/roleStage/DouyinAdsStageRenderer'
import JdTrafficStageRenderer from '../../components/roleStage/JdTrafficStageRenderer'
import JdOperatorStageRenderer from '../../components/roleStage/JdOperatorStageRenderer'
import TmallTrafficStageRenderer from '../../components/roleStage/TmallTrafficStageRenderer'
// 回退：移除 tmall_ops 相关导入
import DouyinContentStageRenderer from '../../components/roleStage/DouyinContentStageRenderer'
import EcommerceOwnerColdStartFiveScreens from '../../components/roleStage/EcommerceOwnerColdStartFiveScreens'
import './ColdStartStagePage.css'

// Mock数据：冷启动期产品
const getColdStartProducts = (dateA: string): Product[] => {
  try {
    const allProducts = getProducts()
    const isPeriodA = dateA === '2024-01-01'
    
    // 筛选冷启动期产品，并根据日期调整指标
    return allProducts
      .filter(p => p.phase === 'cold-start')
      .map(p => ({
        ...p,
        // 根据日期调整当前指标，模拟数据变化
        currentMetrics: p.currentMetrics ? Object.fromEntries(
          Object.entries(p.currentMetrics).map(([key, value]) => [
            key,
            isPeriodA ? value : Math.round(value * 1.15) // 增长15%
          ])
        ) : undefined
      }))
  } catch (error) {
    console.error('[ColdStart] Error in getColdStartProducts:', error)
    return []
  }
}

export default function ColdStartStagePage() {
  const navigate = useNavigate()
  const { dateA, dateB, viewMode, setViewMode, setCurrentStage, setSelectedProductId, currentRoleId, setCurrentRoleId } = useAppStore()
  const [products, setProducts] = useState<Product[]>([])
  
  // 验证 roleId 是否合法，如果非法则兜底（只执行一次）
  useEffect(() => {
    const roles = getRoles()
    const validRoleIds = roles.map(r => r.id)
    if (currentRoleId && !validRoleIds.includes(currentRoleId)) {
      setCurrentRoleId('ecommerce_owner')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // 只在组件挂载时检查一次

  useEffect(() => {
    setCurrentStage('cold-start')
  }, [setCurrentStage])

  // 数据加载：只在 dateA 变化时重新加载
  useEffect(() => {
    try {
      const prods = getColdStartProducts(dateA)
      setProducts(prods)
    } catch (error) {
      console.error('[ColdStart] Error loading products:', error)
      setProducts([])
    }
  }, [dateA])

  const handleViewProduct = (productId: string) => {
    setSelectedProductId(productId)
    navigate(`/roles/ecommerce_owner?product=${productId}`)
  }

  const tabs = [
    {
      key: 'dashboard',
      label: '数据看板',
      content: (
        <div className="coldstart-dashboard" style={{ border: '2px solid red', minHeight: 200 }}>
          <div className="coldstart-stats-grid">
            <Card padding="medium" hoverable>
              <div className="stat-item">
                <div className="stat-label">冷启动产品数</div>
                <div className="stat-value">{products.length}</div>
              </div>
            </Card>
            <Card padding="medium" hoverable>
              <div className="stat-item">
                <div className="stat-label">总成交金额</div>
                <div className="stat-value">
                  {products.reduce((sum, p) => sum + (p.currentMetrics?.['总成交金额'] || 0), 0).toLocaleString()}元
                </div>
              </div>
            </Card>
            <Card padding="medium" hoverable>
              <div className="stat-item">
                <div className="stat-label">总订单数</div>
                <div className="stat-value">
                  {products.reduce((sum, p) => sum + (p.currentMetrics?.['总成交订单数'] || 0), 0)}
                </div>
              </div>
            </Card>
          </div>

          <div className="coldstart-products">
            <h2 className="section-title">冷启动期产品列表</h2>
            <div className="products-grid">
              {products.length > 0 ? (
                products.map((product) => (
                  <Card key={product.id} padding="large" hoverable>
                    <div className="product-card">
                      <div className="product-header">
                        <h3 className="product-title">{product.name}</h3>
                        <span className="product-badge product-badge--coldstart">
                          冷启动期
                        </span>
                      </div>
                      <p className="product-description">{product.description}</p>
                      
                      {product.targetMetrics && product.currentMetrics && (
                        <div className="product-metrics-comparison">
                          <div className="metrics-section">
                            <div className="metrics-title">目标指标</div>
                            <div className="metrics-list">
                              {Object.entries(product.targetMetrics).map(([key, value]) => (
                                <div key={key} className="metric-row">
                                  <span className="metric-name">{key}</span>
                                  <span className="metric-value">{value.toLocaleString()}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="metrics-section">
                            <div className="metrics-title">当前指标</div>
                            <div className="metrics-list">
                              {Object.entries(product.currentMetrics).map(([key, value]) => {
                                const targetValue = product.targetMetrics?.[key] || 0
                                const progress = targetValue > 0 ? (value / targetValue) * 100 : 0
                                return (
                                  <div key={key} className="metric-row">
                                    <span className="metric-name">{key}</span>
                                    <span className="metric-value">{value.toLocaleString()}</span>
                                    <span className={`metric-progress ${progress >= 100 ? 'metric-progress--complete' : progress >= 50 ? 'metric-progress--good' : 'metric-progress--low'}`}>
                                      {progress.toFixed(0)}%
                                    </span>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="product-actions">
                        <Button variant="primary" onClick={() => handleViewProduct(product.id)}>
                          查看详情
                        </Button>
                        <Button variant="secondary" onClick={() => navigate(`/roles/ecommerce_owner?product=${product.id}`)}>
                          进入电商工作台
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <Card padding="large">
                  <div className="empty-state">
                    <p>暂无冷启动期产品</p>
                    <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>这是空状态，不是白屏</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'ai',
      label: 'AI洞察',
      content: (
        <div className="coldstart-ai">
          <Card padding="large">
            <h2 className="section-title">AI分析洞察</h2>
            <div className="ai-insights-list">
              {dateA === '2024-01-01' ? (
                <>
                  <div className="ai-insight-item">
                    <p>根据 {dateA} 至 {dateB} 的数据分析，当前有 {products.length} 个产品处于冷启动期，需要持续关注转化率和用户反馈。</p>
                  </div>
                  <div className="ai-insight-item">
                    <p>建议加大推广力度，优化产品页面和详情，提升用户转化率。重点关注流量获取渠道的ROI。</p>
                  </div>
                  <div className="ai-insight-item">
                    <p>当前指标与目标存在一定差距，建议分析具体原因并制定优化策略，必要时调整目标指标。</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="ai-insight-item">
                    <p>根据 {dateA} 至 {dateB} 的最新数据分析，冷启动期产品表现良好，成交金额较前期增长约15%。</p>
                  </div>
                  <div className="ai-insight-item">
                    <p>产品转化率持续提升，建议继续保持当前推广策略，并考虑扩大投放规模。</p>
                  </div>
                  <div className="ai-insight-item">
                    <p>用户反馈整体积极，建议收集并分析用户评价，优化产品体验和服务质量。</p>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      )
    }
  ]

  // 电商负责人使用原有配置化渲染（回退）
  if (currentRoleId === 'ecommerce_owner') {
    const metrics = getMetricsByRole('ecommerce_owner')
    const renderSections = ecommerceOwnerStageConfig.coldStart.sections.filter(
      s => s.type !== 'status-bar'
    )
    return (
      <MainLayout>
        <PageHeader
          title="冷启动期"
          subtitle="产品冷启动和运营管理"
          backPath="/stages/planning"
        />
        <FilterBar showDateFilter showSearch showCategoryFilter />
        <Tabs items={tabs} activeKey={viewMode} onChange={(key) => setViewMode(key as 'dashboard' | 'ai')} />
        {viewMode === 'dashboard' && (
          <StageSectionRenderer
            sections={renderSections}
            products={products}
            metrics={metrics}
            roleId={currentRoleId}
          />
        )}
      </MainLayout>
    )
  }

  // BU品牌负责人使用配置化渲染
  if (currentRoleId === 'bu_brand_owner') {
    const metrics = getMetricsByRole('bu_brand_owner')
    
    return (
      <MainLayout>
        <PageHeader
          title="冷启动期"
          subtitle="产品冷启动和运营管理"
          backPath="/stages/planning"
        />
        <FilterBar showDateFilter showSearch showCategoryFilter />
        <Tabs items={tabs} activeKey={viewMode} onChange={(key) => setViewMode(key as 'dashboard' | 'ai')} />
        {viewMode === 'dashboard' && (
          <BrandOwnerStageRenderer
            sections={brandOwnerStageConfig.coldStart.sections}
            products={products}
            metrics={metrics}
            roleId={currentRoleId}
            stage="cold-start"
          />
        )}
        {viewMode === 'ai' && (
          <div className="brand-owner-ai-mode">
            {/* 按钮之前的原有内容保持不变 */}
            <Card padding="large">
              <h2 className="section-title">AI分析洞察</h2>
              <div className="ai-insights-list">
                {dateA === '2024-01-01' ? (
                  <>
                    <div className="ai-insight-item">
                      <p>根据 {dateA} 至 {dateB} 的数据分析，当前有 {products.length} 个产品处于冷启动期，需要持续关注转化率和用户反馈。</p>
                    </div>
                    <div className="ai-insight-item">
                      <p>建议加大推广力度，优化产品页面和详情，提升用户转化率。重点关注流量获取渠道的ROI。</p>
                    </div>
                    <div className="ai-insight-item">
                      <p>当前指标与目标存在一定差距，建议分析具体原因并制定优化策略，必要时调整目标指标。</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="ai-insight-item">
                      <p>根据 {dateA} 至 {dateB} 的最新数据分析，冷启动期产品表现良好，成交金额较前期增长约15%。</p>
                    </div>
                    <div className="ai-insight-item">
                      <p>产品转化率持续提升，建议继续保持当前推广策略，并考虑扩大投放规模。</p>
                    </div>
                    <div className="ai-insight-item">
                      <p>用户反馈整体积极，建议收集并分析用户评价，优化产品体验和服务质量。</p>
                    </div>
                  </>
                )}
              </div>
              {/* 两个按钮 */}
              <div className="ai-insight-actions" style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
                <Button variant="primary" onClick={() => {}}>
                  查看详情
                </Button>
                <Button variant="secondary" onClick={() => navigate('/stages/overview')}>
                  进入电商工作台
                </Button>
              </div>
            </Card>
            {/* 按钮之后的新内容 */}
            <BrandOwnerAIInsightExtended dateA={dateA || '2025-02-27'} dateB={dateB || '2025-02-28'} />
          </div>
        )}
      </MainLayout>
    )
  }

  // 市场分析使用配置化渲染
  if (currentRoleId === 'market_analysis') {
    const metrics = getMetricsByRole('market_analysis')
    
    return (
      <MainLayout>
        <PageHeader
          title="市场分析（Owner/市场分析） - 冷启动期"
          subtitle="市场机会洞察与经营诊断"
          backPath="/stages/planning"
        />
        <FilterBar showDateFilter showSearch showCategoryFilter />
        <Tabs items={tabs} activeKey={viewMode} onChange={(key) => setViewMode(key as 'dashboard' | 'ai')} />
        {viewMode === 'dashboard' && (
          <MarketAnalysisStageRenderer
            sections={marketAnalysisStageConfig.coldStart.sections}
            products={products}
            metrics={metrics}
            roleId={currentRoleId}
            stage="cold-start"
          />
        )}
        {viewMode === 'ai' && (
          <Card padding="large">
            <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
              <p>AI洞察功能开发中...</p>
            </div>
          </Card>
        )}
      </MainLayout>
    )
  }

  // 抖音店播运营使用配置化渲染
  if (currentRoleId === 'douyin_store_live') {
    const metrics = getMetricsByRole('douyin_store_live')
    
    return (
      <MainLayout>
        <PageHeader
          title="抖音店播运营 - 冷启动期"
          subtitle="抖音店铺直播运营管理"
          backPath="/stages/planning"
        />
        <FilterBar showDateFilter showSearch showCategoryFilter />
        <Tabs items={tabs} activeKey={viewMode} onChange={(key) => setViewMode(key as 'dashboard' | 'ai')} />
        {viewMode === 'dashboard' && (
          <DouyinShopOpsStageRenderer
            sections={douyinShopOpsStageConfig.coldStart.sections}
            products={products}
            metrics={metrics}
            roleId={currentRoleId}
            stage="cold-start"
          />
        )}
        {viewMode === 'ai' && (
          <Card padding="large">
            <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
              <p>AI洞察功能开发中...</p>
            </div>
          </Card>
        )}
      </MainLayout>
    )
  }

  // 电商商务（达人/资源位）使用配置化渲染
  if (currentRoleId === 'ecommerce_bd') {
    const metrics = getMetricsByRole('ecommerce_bd')
    
    return (
      <MainLayout>
        <PageHeader
          title="抖音商务（冷启动期）"
          subtitle="电商商务合作管理"
          backPath="/stages/planning"
        />
        <FilterBar showDateFilter showSearch showCategoryFilter />
        <Tabs items={tabs} activeKey={viewMode} onChange={(key) => setViewMode(key as 'dashboard' | 'ai')} />
        {viewMode === 'dashboard' && (
          <DouyinBizStageRenderer
            sections={ecommerceBDStageConfig.coldStart.sections}
            products={products}
            metrics={metrics}
            roleId={currentRoleId}
            stage="cold-start"
          />
        )}
        {viewMode === 'ai' && (
          <Card padding="large">
            <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
              <p>AI洞察功能开发中...</p>
            </div>
          </Card>
        )}
      </MainLayout>
    )
  }

  // 抖音投放使用配置化渲染
  if (currentRoleId === 'douyin_ads') {
    const metrics = getMetricsByRole('douyin_ads')
    
    return (
      <MainLayout>
        <PageHeader
          title="抖音投放（冷启动期）"
          subtitle="抖音广告投放管理"
          backPath="/stages/planning"
        />
        <FilterBar showDateFilter showSearch showCategoryFilter />
        <Tabs items={tabs} activeKey={viewMode} onChange={(key) => setViewMode(key as 'dashboard' | 'ai')} />
        {viewMode === 'dashboard' && (
          <DouyinAdsStageRenderer
            sections={douyinAdsStageConfig.coldStart.sections}
            products={products}
            metrics={metrics}
            roleId={currentRoleId}
            stage="cold-start"
          />
        )}
        {viewMode === 'ai' && (
          <Card padding="large">
            <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
              <p>AI洞察功能开发中...</p>
            </div>
          </Card>
        )}
      </MainLayout>
    )
  }

  // 天猫运营使用专用渲染器
  if (currentRoleId === 'tmall_ops') {
    const metrics = getMetricsByRole('tmall_ops')
    const config = getTmallOpsStageConfig('coldStart', dateA || '2025-02-27', dateB || '2025-02-28')
    
    return (
      <MainLayout>
        <PageHeader
          title="天猫运营（冷启动期）"
          subtitle="天猫平台运营管理"
          backPath="/stages/planning"
        />
        <FilterBar showDateFilter showSearch showCategoryFilter />
        <Tabs items={tabs} activeKey={viewMode} onChange={(key) => setViewMode(key as 'dashboard' | 'ai')} />
        {viewMode === 'dashboard' && (
          <TmallOpsStageRenderer
            sections={config.sections}
            products={products}
            metrics={metrics}
            roleId={currentRoleId}
            stage="cold-start"
            dateRangeA={dateA || '2025-02-27'}
            dateRangeB={dateB || '2025-02-28'}
          />
        )}
        {viewMode === 'ai' && (
          <TmallOpsStageRenderer
            sections={config.sections.filter(s => (s as any).type === 'diagnosis-insights')}
            products={products}
            metrics={metrics}
            roleId={currentRoleId}
            stage="cold-start"
            dateRangeA={dateA || '2025-02-27'}
            dateRangeB={dateB || '2025-02-28'}
          />
        )}
      </MainLayout>
    )
  }

  // 京东流量运营使用配置化渲染
  if (currentRoleId === 'jd_traffic') {
    const metrics = getMetricsByRole('jd_traffic')
    
    return (
      <MainLayout>
        <PageHeader
          title="京东流量运营（冷启动期）"
          subtitle="京东流量获取和优化"
          backPath="/stages/planning"
        />
        <FilterBar showDateFilter showSearch showCategoryFilter />
        <Tabs items={tabs} activeKey={viewMode} onChange={(key) => setViewMode(key as 'dashboard' | 'ai')} />
        {viewMode === 'dashboard' && (
          <JdTrafficStageRenderer
            sections={jdTrafficStageConfig.coldStart.sections}
            products={products}
            metrics={metrics}
            roleId={currentRoleId}
            stage="cold-start"
          />
        )}
        {viewMode === 'ai' && (
          <Card padding="large">
            <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
              <p>AI洞察功能开发中...</p>
            </div>
          </Card>
        )}
      </MainLayout>
    )
  }

  // 京东运营使用配置化渲染
  if (currentRoleId === 'jd_ops') {
    const metrics = getMetricsByRole('jd_ops')
    
    return (
      <MainLayout>
        <PageHeader
          title="京东运营（冷启动期）"
          subtitle="京东平台运营管理"
          backPath="/stages/planning"
        />
        <FilterBar showDateFilter showSearch showCategoryFilter />
        <Tabs items={tabs} activeKey={viewMode} onChange={(key) => setViewMode(key as 'dashboard' | 'ai')} />
        {viewMode === 'dashboard' && (
          <JdOperatorStageRenderer
            sections={jdOperatorStageConfig.coldStart.sections}
            products={products}
            metrics={metrics}
            roleId={currentRoleId}
            stage="cold-start"
          />
        )}
        {viewMode === 'ai' && (
          <Card padding="large">
            <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
              <p>AI洞察功能开发中...</p>
            </div>
          </Card>
        )}
      </MainLayout>
    )
  }

  // 天猫流量运营使用配置化渲染（动态生成A/B + 诊断Tab）
  if (currentRoleId === 'tmall_traffic') {
    const metrics = getMetricsByRole('tmall_traffic')
    const dateRangeA = dateA || '2025-02-27'
    const dateRangeB = dateB || '2025-02-28'
    const config = getTmallTrafficOpsStageConfig('coldStart', dateRangeA, dateRangeB)
    return (
      <MainLayout>
        <PageHeader
          title="天猫流量运营（冷启动期）"
          subtitle="天猫流量获取和优化"
          backPath="/stages/planning"
        />
        <FilterBar showDateFilter showSearch showCategoryFilter />
        <Tabs items={tabs} activeKey={viewMode} onChange={(key) => setViewMode(key as 'dashboard' | 'ai')} />
        {viewMode === 'dashboard' && (
          <TmallTrafficOpsStageRenderer
            sections={config.sections}
            products={products}
            metrics={metrics}
            roleId={currentRoleId}
            stage="cold-start"
          />
        )}
        {viewMode === 'ai' && (
          <TmallTrafficOpsStageRenderer
            sections={config.sections}
            products={products}
            metrics={metrics}
            roleId={currentRoleId}
            stage="cold-start"
          />
        )}
      </MainLayout>
    )
  }

  // 天猫运营分支回退无改动（如需专属渲染，保持既有实现或空分支）

  // 抖音内容制作使用专用渲染器
  if (currentRoleId === 'douyin_content') {
    const metrics = getMetricsByRole('douyin_content')
    
    return (
      <MainLayout>
        <PageHeader
          title="抖音内容制作（冷启动期）"
          subtitle="内容创作和管理"
        />
        <FilterBar showDateFilter showSearch showCategoryFilter />
        <Tabs items={tabs} activeKey={viewMode} onChange={(key) => setViewMode(key as 'dashboard' | 'ai')} />
        {viewMode === 'dashboard' && (
          <DouyinContentStageRenderer
            sections={[]}
            products={products}
            metrics={metrics}
            roleId={currentRoleId}
            stage="cold_start"
            dateRangeA={dateA}
            dateRangeB={dateB}
          />
        )}
        {viewMode === 'ai' && (
          <DouyinContentStageRenderer
            sections={[]}
            products={products}
            metrics={metrics}
            roleId={currentRoleId}
            stage="cold_start"
            dateRangeA={dateA}
            dateRangeB={dateB}
          />
        )}
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <PageHeader
        title="冷启动期"
        subtitle="产品冷启动和运营管理"
        backPath="/stages/planning"
      />
      <FilterBar showDateFilter showSearch showCategoryFilter />
      <Tabs items={tabs} activeKey={viewMode} onChange={(key) => setViewMode(key as 'dashboard' | 'ai')} />
    </MainLayout>
  )
}
