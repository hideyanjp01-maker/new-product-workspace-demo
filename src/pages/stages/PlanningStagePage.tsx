import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import MainLayout from '../../components/layout/MainLayout'
import PageHeader from '../../components/layout/PageHeader'
import FilterBar from '../../components/layout/FilterBar'
import { Card, Button } from '../../components/ui'
import { useAppStore } from '../../store/appStore'
import { useNewProductFlowStore } from '../../store/newProductFlowStore'
import PlanningProductDetail from './PlanningProductDetail'
import './PlanningStagePage.css'

export default function PlanningStagePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const productIdFromUrl = searchParams.get('productId')
  
  const { setCurrentStage, currentRoleId } = useAppStore()
  const planningProducts = useNewProductFlowStore((state) => state.planningProducts)
  
  // 按角色过滤待处理产品
  const listForBrandOwner = planningProducts.filter(p => 
    (p.planningStageStatus?.brandOwnerDecision ?? 'pending') === 'pending'
  )
  const listForEcomOwner = planningProducts.filter(p =>
    (p.planningStageStatus?.brandOwnerDecision ?? 'approved') === 'approved' &&
    (p.planningStageStatus?.ecommerceOwnerDecision ?? 'pending') === 'pending'
  )
  
  // 调试日志
  console.debug('[PlanningStage] role', currentRoleId, {
    total: planningProducts.length,
    brandPending: listForBrandOwner.length,
    ecomPending: listForEcomOwner.length,
    sample: planningProducts.slice(0, 3).map(p => ({
      id: p.id,
      brand: p.planningStageStatus?.brandOwnerDecision,
      eco: p.planningStageStatus?.ecommerceOwnerDecision
    }))
  })
  
  const [pendingProducts, setPendingProducts] = useState(
    currentRoleId === 'bu_brand_owner' ? listForBrandOwner : listForEcomOwner
  )
  const [selectedProductId, setSelectedProductId] = useState<string | null>(productIdFromUrl)

  useEffect(() => {
    setCurrentStage('planning')
  }, [setCurrentStage])

  useEffect(() => {
    // 根据角色更新待处理列表
    if (currentRoleId === 'bu_brand_owner') {
      setPendingProducts(listForBrandOwner)
    } else if (currentRoleId === 'ecommerce_owner') {
      setPendingProducts(listForEcomOwner)
    } else {
      setPendingProducts([])
    }
  }, [planningProducts, currentRoleId, listForBrandOwner, listForEcomOwner])

  useEffect(() => {
    if (productIdFromUrl) {
      setSelectedProductId(productIdFromUrl)
    }
  }, [productIdFromUrl])

  const handleProductClick = (productId: string) => {
    setSelectedProductId(productId)
    navigate(`/stages/planning?productId=${productId}`, { replace: true })
  }

  const handleCloseDetail = () => {
    setSelectedProductId(null)
    navigate('/stages/planning', { replace: true })
  }

  // 角色判断
  const isBrandOwner = currentRoleId === 'bu_brand_owner'
  const isEcommerceOwner = currentRoleId === 'ecommerce_owner'

  return (
    <MainLayout>
      <PageHeader
        title="企划期"
        subtitle="新品企划与审批管理"
        backPath="/stages/overview"
      />
      <FilterBar showDateFilter showSearch showCategoryFilter />

      <div className="planning-content">
        {(isBrandOwner || isEcommerceOwner) && selectedProductId ? (
          // 显示详情页
          <PlanningProductDetail productId={selectedProductId} onClose={handleCloseDetail} />
        ) : isBrandOwner && pendingProducts.length > 0 ? (
          // 品牌负责人：显示待审批新品列表
          <div className="planning-pending-products">
            <h2 className="section-title">待审批新品</h2>
            <div className="pending-products-grid">
              {pendingProducts.map((product) => (
                <Card
                  key={product.id}
                  padding="large"
                  hoverable
                  onClick={() => handleProductClick(product.id)}
                  className="pending-product-card"
                >
                  <div className="pending-product-header">
                    <h3 className="pending-product-title">{product.title}</h3>
                    <span className="pending-product-badge">待审批</span>
                  </div>
                  <div className="pending-product-info">
                    <div className="pending-product-meta">
                      <span>推入时间：{new Date(product.pushedAt).toLocaleString('zh-CN')}</span>
                    </div>
                  </div>
                  <div className="pending-product-actions">
                    <Button variant="primary" onClick={(e) => {
                      e.stopPropagation()
                      handleProductClick(product.id)
                    }}>
                      查看详情
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : isEcommerceOwner && pendingProducts.length > 0 ? (
          // 电商负责人：显示待确认新品列表
          <div className="planning-pending-products">
            <h2 className="section-title">待确认新品</h2>
            <div className="pending-products-grid">
              {pendingProducts.map((product) => (
                <Card
                  key={product.id}
                  padding="large"
                  hoverable
                  onClick={() => handleProductClick(product.id)}
                  className="pending-product-card"
                >
                  <div className="pending-product-header">
                    <h3 className="pending-product-title">{product.title}</h3>
                    <span className="pending-product-badge">待确认目标</span>
                  </div>
                  <div className="pending-product-info">
                    <div className="pending-product-meta">
                      <span>品牌负责人已批准：{new Date(product.pushedAt).toLocaleString('zh-CN')}</span>
                    </div>
                  </div>
                  <div className="pending-product-actions">
                    <Button variant="primary" onClick={(e) => {
                      e.stopPropagation()
                      handleProductClick(product.id)
                    }}>
                      确认目标
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : isBrandOwner ? (
          // 品牌负责人：无待审批新品
          <Card padding="large">
            <div className="empty-state">
              <p>暂无待审批新品</p>
              <p className="empty-hint">市场分析推入的新品将显示在这里</p>
            </div>
          </Card>
        ) : isEcommerceOwner ? (
          // 电商负责人：无待确认新品
          <Card padding="large">
            <div className="empty-state">
              <p>暂无待确认新品</p>
              <p className="empty-hint">品牌负责人已批准的新品将显示在这里</p>
            </div>
          </Card>
        ) : (
          // 其他角色：显示原有的企划期内容
          <div className="planning-dashboard">
            <Card padding="large">
              <div className="planning-info">
                <h2>企划期工作台</h2>
                <p>当前角色无待审批权限，请切换到品牌负责人或电商负责人角色查看待处理新品</p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
