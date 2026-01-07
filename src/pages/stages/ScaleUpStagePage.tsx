import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../../components/layout/MainLayout'
import PageHeader from '../../components/layout/PageHeader'
import FilterBar from '../../components/layout/FilterBar'
import { Card, Button, Tabs } from '../../components/ui'
import { useAppStore } from '../../store/appStore'
import { getProducts, getMetricsByRole, type Product } from '../../data/mockData'
import { ecommerceOwnerStageConfig } from '../../config/roleStage/ecommerce_owner'
import { brandOwnerStageConfig } from '../../config/roleStage/bu_brand_owner'
import { marketAnalysisStageConfig } from '../../config/roleStage/market_analysis'
import { douyinShopOpsStageConfig } from '../../config/roleStage/douyin_store_live'
import { ecommerceBDStageConfig } from '../../config/roleStage/ecommerce_bd'
import { douyinAdsStageConfig } from '../../config/roleStage/douyin_ads'
import { jdTrafficStageConfig } from '../../config/roleStage/jd_traffic'
import { jdOperatorStageConfig } from '../../config/roleStage/jd_ops'
// import { tmallTrafficStageConfig } from '../../config/roleStage/tmall_traffic'
import { getTmallTrafficOpsStageConfig } from '../../config/roleStage/tmall_traffic_ops'
import TmallTrafficOpsStageRenderer from '../../components/roleStage/TmallTrafficOpsStageRenderer'
import { getTmallOpsStageConfig } from '../../config/roleStage/tmall_ops'
import TmallOpsStageRenderer from '../../components/roleStage/TmallOpsStageRenderer'
import StageSectionRenderer from '../../components/roleStage/StageSectionRenderer'
// 回退：移除 Owner 动态配置与 TmallOps 渲染器
import BrandOwnerStageRenderer from '../../components/roleStage/BrandOwnerStageRenderer'
import MarketAnalysisStageRenderer from '../../components/roleStage/MarketAnalysisStageRenderer'
import DouyinShopOpsStageRenderer from '../../components/roleStage/DouyinShopOpsStageRenderer'
import DouyinBizStageRenderer from '../../components/roleStage/DouyinBizStageRenderer'
import DouyinAdsStageRenderer from '../../components/roleStage/DouyinAdsStageRenderer'
import JdTrafficStageRenderer from '../../components/roleStage/JdTrafficStageRenderer'
import JdOperatorStageRenderer from '../../components/roleStage/JdOperatorStageRenderer'
// import TmallTrafficStageRenderer from '../../components/roleStage/TmallTrafficStageRenderer'
// 回退：移除 tmall_ops 相关导入
import DouyinContentStageRenderer from '../../components/roleStage/DouyinContentStageRenderer'
import './ScaleUpStagePage.css'

// Mock数据：放量期产品
const getScaleUpProducts = (dateA: string): Product[] => {
  const allProducts = getProducts()
  const isPeriodA = dateA === '2024-01-01'
  
  // 筛选放量期产品，并根据日期调整指标
  return allProducts
    .filter(p => p.phase === 'scaling')
    .map(p => ({
      ...p,
      // 根据日期调整当前指标，模拟数据变化
      currentMetrics: p.currentMetrics ? Object.fromEntries(
        Object.entries(p.currentMetrics).map(([key, value]) => [
          key,
          isPeriodA ? value : Math.round(value * 1.2) // 增长20%
        ])
      ) : undefined,
      // 根据日期调整AI洞察
      aiInsights: isPeriodA 
        ? p.aiInsights 
        : [...(p.aiInsights || []), '放量期表现优异，建议扩大生产规模']
    }))
}

export default function ScaleUpStagePage() {
  const navigate = useNavigate()
  const { dateA, dateB, viewMode, setViewMode, setCurrentStage, setSelectedProductId, currentRoleId } = useAppStore()
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    setCurrentStage('scale-up')
  }, [setCurrentStage])

  useEffect(() => {
    setProducts(getScaleUpProducts(dateA))
  }, [dateA])

  const handleViewProduct = (productId: string) => {
    setSelectedProductId(productId)
    navigate(`/roles/tmall-operation?product=${productId}`)
  }

  const tabs = [
    {
      key: 'dashboard',
      label: '数据看板',
      content: (
        <div className="scaleup-dashboard">
          <div className="scaleup-stats-grid">
            <Card padding="medium" hoverable>
              <div className="stat-item">
                <div className="stat-label">放量期产品数</div>
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
            <Card padding="medium" hoverable>
              <div className="stat-item">
                <div className="stat-label">平均客单价</div>
                <div className="stat-value">
                  {(() => {
                    const totalSales = products.reduce((sum, p) => sum + (p.currentMetrics?.['总成交金额'] || 0), 0)
                    const totalOrders = products.reduce((sum, p) => sum + (p.currentMetrics?.['总成交订单数'] || 0), 0)
                    return totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0
                  })()}元
                </div>
              </div>
            </Card>
          </div>

          <div className="scaleup-products">
            <h2 className="section-title">放量期产品列表</h2>
            <div className="products-grid">
              {products.map((product) => (
                <Card key={product.id} padding="large" hoverable>
                  <div className="product-card">
                    <div className="product-header">
                      <h3 className="product-title">{product.name}</h3>
                      <span className="product-badge product-badge--scaling">
                        放量期
                      </span>
                    </div>
                    <p className="product-description">{product.description}</p>
                    
                    {product.targetMetrics && product.currentMetrics && (
                      <div className="product-performance">
                        <div className="performance-summary">
                          <div className="performance-item">
                            <span className="performance-label">目标完成率</span>
                            <span className="performance-value">
                              {(() => {
                                const targetSales = product.targetMetrics?.['总成交金额'] || 0
                                const currentSales = product.currentMetrics?.['总成交金额'] || 0
                                const rate = targetSales > 0 ? (currentSales / targetSales) * 100 : 0
                                return `${rate.toFixed(1)}%`
                              })()}
                            </span>
                          </div>
                          <div className="performance-item">
                            <span className="performance-label">成交金额</span>
                            <span className="performance-value">
                              {product.currentMetrics['总成交金额']?.toLocaleString() || 0}元
                            </span>
                          </div>
                          <div className="performance-item">
                            <span className="performance-label">订单数</span>
                            <span className="performance-value">
                              {product.currentMetrics['总成交订单数']?.toLocaleString() || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {product.aiInsights && product.aiInsights.length > 0 && (
                      <div className="product-insights">
                        <div className="insights-title">AI洞察</div>
                        <ul className="insights-list">
                          {product.aiInsights.map((insight, index) => (
                            <li key={index}>{insight}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="product-actions">
                      <Button variant="primary" onClick={() => handleViewProduct(product.id)}>
                        查看详情
                      </Button>
                      <Button variant="secondary" onClick={() => navigate(`/roles/tmall-operation?product=${product.id}`)}>
                        进入运营工作台
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'ai',
      label: 'AI洞察',
      content: (
        <div className="scaleup-ai">
          <Card padding="large">
            <h2 className="section-title">AI分析洞察</h2>
            <div className="ai-insights-list">
              {dateA === '2024-01-01' ? (
                <>
                  <div className="ai-insight-item">
                    <p>根据 {dateA} 至 {dateB} 的数据分析，当前有 {products.length} 个产品处于放量期，整体表现良好。</p>
                  </div>
                  <div className="ai-insight-item">
                    <p>产品成交金额和订单数持续增长，建议继续保持当前运营策略，同时优化供应链和库存管理。</p>
                  </div>
                  <div className="ai-insight-item">
                    <p>用户满意度较高，建议关注用户评价和反馈，持续优化产品质量和服务体验。</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="ai-insight-item">
                    <p>根据 {dateA} 至 {dateB} 的最新数据分析，放量期产品表现优异，成交金额较前期增长约20%。</p>
                  </div>
                  <div className="ai-insight-item">
                    <p>产品已进入稳定增长期，建议扩大生产规模，提升市场占有率。同时关注竞品动态，保持竞争优势。</p>
                  </div>
                  <div className="ai-insight-item">
                    <p>运营效率持续提升，建议加大市场投入，拓展新渠道，进一步扩大品牌影响力。</p>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      )
    }
  ]

  // 电商负责人使用配置化渲染
  if (currentRoleId === 'ecommerce_owner') {
    const metrics = getMetricsByRole('ecommerce_owner')
    // 过滤出 time-selector 之外的其他 sections（time-selector 由页面本身处理）
    const renderSections = ecommerceOwnerStageConfig.scaleUp.sections.filter(
      s => s.type !== 'time-selector'
    )
    return (
      <MainLayout>
        <PageHeader
          title="放量期"
          subtitle="产品放量和规模化运营"
          backPath="/stages/cold-start"
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
          title="放量期"
          subtitle="产品放量和规模化运营"
          backPath="/stages/cold-start"
        />
        <FilterBar showDateFilter showSearch showCategoryFilter />
        <Tabs items={tabs} activeKey={viewMode} onChange={(key) => setViewMode(key as 'dashboard' | 'ai')} />
        {viewMode === 'dashboard' && (
          <BrandOwnerStageRenderer
            sections={brandOwnerStageConfig.scaleUp.sections}
            products={products}
            metrics={metrics}
            roleId={currentRoleId}
            stage="scale-up"
          />
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
          title="市场分析（Owner/市场分析） - 放量期"
          subtitle="市场机会洞察与经营诊断"
          backPath="/stages/cold-start"
        />
        <FilterBar showDateFilter showSearch showCategoryFilter />
        <Tabs items={tabs} activeKey={viewMode} onChange={(key) => setViewMode(key as 'dashboard' | 'ai')} />
        {viewMode === 'dashboard' && (
          <MarketAnalysisStageRenderer
            sections={marketAnalysisStageConfig.scaleUp.sections}
            products={products}
            metrics={metrics}
            roleId={currentRoleId}
            stage="scale-up"
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
          title="抖音店播运营 - 放量期"
          subtitle="抖音店铺直播运营管理"
          backPath="/stages/cold-start"
        />
        <FilterBar showDateFilter showSearch showCategoryFilter />
        <Tabs items={tabs} activeKey={viewMode} onChange={(key) => setViewMode(key as 'dashboard' | 'ai')} />
        {viewMode === 'dashboard' && (
          <DouyinShopOpsStageRenderer
            sections={douyinShopOpsStageConfig.scaleUp.sections}
            products={products}
            metrics={metrics}
            roleId={currentRoleId}
            stage="scale-up"
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
          title="抖音商务（放量期）"
          subtitle="电商商务合作管理"
          backPath="/stages/cold-start"
        />
        <FilterBar showDateFilter showSearch showCategoryFilter />
        <Tabs items={tabs} activeKey={viewMode} onChange={(key) => setViewMode(key as 'dashboard' | 'ai')} />
        {viewMode === 'dashboard' && (
          <DouyinBizStageRenderer
            sections={ecommerceBDStageConfig.scaleUp.sections}
            products={products}
            metrics={metrics}
            roleId={currentRoleId}
            stage="scale-up"
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
          title="抖音投放（放量期）"
          subtitle="抖音广告投放管理"
          backPath="/stages/cold-start"
        />
        <FilterBar showDateFilter showSearch showCategoryFilter />
        <Tabs items={tabs} activeKey={viewMode} onChange={(key) => setViewMode(key as 'dashboard' | 'ai')} />
        {viewMode === 'dashboard' && (
          <DouyinAdsStageRenderer
            sections={douyinAdsStageConfig.scaleUp.sections}
            products={products}
            metrics={metrics}
            roleId={currentRoleId}
            stage="scale-up"
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
    const config = getTmallOpsStageConfig('scaleUp', dateA || '2025-02-27', dateB || '2025-02-28')
    
    return (
      <MainLayout>
        <PageHeader
          title="天猫运营（放量期）"
          subtitle="天猫平台运营管理"
          backPath="/stages/cold-start"
        />
        <FilterBar showDateFilter showSearch showCategoryFilter />
        <Tabs items={tabs} activeKey={viewMode} onChange={(key) => setViewMode(key as 'dashboard' | 'ai')} />
        {viewMode === 'dashboard' && (
          <TmallOpsStageRenderer
            sections={config.sections}
            products={products}
            metrics={metrics}
            roleId={currentRoleId}
            stage="scale-up"
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
            stage="scale-up"
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
          title="京东流量运营（放量期）"
          subtitle="京东流量获取和优化"
          backPath="/stages/cold-start"
        />
        <FilterBar showDateFilter showSearch showCategoryFilter />
        <Tabs items={tabs} activeKey={viewMode} onChange={(key) => setViewMode(key as 'dashboard' | 'ai')} />
        {viewMode === 'dashboard' && (
          <JdTrafficStageRenderer
            sections={jdTrafficStageConfig.scaleUp.sections}
            products={products}
            metrics={metrics}
            roleId={currentRoleId}
            stage="scale-up"
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
          title="京东运营（放量期）"
          subtitle="京东平台运营管理"
          backPath="/stages/cold-start"
        />
        <FilterBar showDateFilter showSearch showCategoryFilter />
        <Tabs items={tabs} activeKey={viewMode} onChange={(key) => setViewMode(key as 'dashboard' | 'ai')} />
        {viewMode === 'dashboard' && (
          <JdOperatorStageRenderer
            sections={jdOperatorStageConfig.scaleUp.sections}
            products={products}
            metrics={metrics}
            roleId={currentRoleId}
            stage="scale-up"
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
    return (
      <MainLayout>
        <PageHeader
          title="天猫流量运营（放量期）"
          subtitle="天猫流量获取和优化"
          backPath="/stages/cold-start"
        />
        <FilterBar showDateFilter showSearch showCategoryFilter />
        <Tabs items={tabs} activeKey={viewMode} onChange={(key) => setViewMode(key as 'dashboard' | 'ai')} />
        {viewMode === 'dashboard' && (
          <TmallTrafficOpsStageRenderer
            sections={getTmallTrafficOpsStageConfig('scaleUp', dateA || '2025-02-27', dateB || '2025-02-28').sections}
            products={products}
            metrics={metrics}
            roleId={currentRoleId}
            stage="scale-up"
          />
        )}
        {viewMode === 'ai' && (
          <TmallTrafficOpsStageRenderer
            sections={getTmallTrafficOpsStageConfig('scaleUp', dateA || '2025-02-27', dateB || '2025-02-28').sections}
            products={products}
            metrics={metrics}
            roleId={currentRoleId}
            stage="scale-up"
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
          title="抖音内容制作（放量期）"
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
            stage="scaling"
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
            stage="scaling"
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
        title="放量期"
        subtitle="产品放量和规模化运营"
        backPath="/stages/cold-start"
      />
      <FilterBar showDateFilter showSearch showCategoryFilter />
      <Tabs items={tabs} activeKey={viewMode} onChange={(key) => setViewMode(key as 'dashboard' | 'ai')} />
    </MainLayout>
  )
}



