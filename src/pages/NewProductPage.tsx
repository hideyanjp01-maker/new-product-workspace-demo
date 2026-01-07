import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams, Link as RouterLink } from 'react-router-dom'
import { getProductById, getRoleById } from '../data/mockData'
import type { Product } from '../data/mockData'
import './NewProductPage.css'

export default function NewProductPage() {
  const { productId } = useParams<{ productId: string }>()
  const [searchParams] = useSearchParams()
  const roleId = searchParams.get('role') || 'market-analysis'
  const navigate = useNavigate()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [currentRole] = useState(getRoleById(roleId))

  useEffect(() => {
    if (productId) {
      const p = getProductById(productId)
      if (p) {
        setProduct(p)
      }
    }
  }, [productId])

  if (!product) {
    return (
      <div className="new-product-page">
        <div className="error-state">
          <p>产品不存在</p>
          <button onClick={() => navigate('/products')}>返回产品列表</button>
        </div>
      </div>
    )
  }

  if (!currentRole) {
    return (
      <div className="new-product-page">
        <div className="error-state">
          <p>角色不存在</p>
          <button onClick={() => navigate('/products')}>返回产品列表</button>
        </div>
      </div>
    )
  }

  return (
    <div className="new-product-page">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate('/products')}>
          ← 返回产品列表
        </button>
        <h1>{product.name}</h1>
        <p>角色：{currentRole.name} | 状态：{getStatusText(product.status)}</p>
      </div>

      <div className="product-info">
        <div className="info-card">
          <h3>产品信息</h3>
          <p><strong>分类：</strong>{product.category}</p>
          <p><strong>价格：</strong>¥{product.price}</p>
          <p><strong>描述：</strong>{product.description}</p>
        </div>

        {product.targetMetrics && (
          <div className="info-card">
            <h3>目标指标</h3>
            {Object.entries(product.targetMetrics).map(([key, value]) => (
              <p key={key}><strong>{key}：</strong>{value.toLocaleString()}</p>
            ))}
          </div>
        )}

        {product.currentMetrics && (
          <div className="info-card">
            <h3>当前指标</h3>
            {Object.entries(product.currentMetrics).map(([key, value]) => (
              <p key={key}><strong>{key}：</strong>{value.toLocaleString()}</p>
            ))}
          </div>
        )}

        {product.aiInsights && product.aiInsights.length > 0 && (
          <div className="info-card">
            <h3>AI洞察</h3>
            <ul>
              {product.aiInsights.map((insight, index) => (
                <li key={index}>{insight}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="action-section">
          <RouterLink to={currentRole.route} className="action-btn primary">
            进入 {currentRole.name} 工作台 →
          </RouterLink>
        </div>
      </div>
    </div>
  )

  function getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      'pending-target': '待生成目标',
      'pending-brand-confirm': '待品牌负责人确认',
      'pending-review-target': '待复核目标',
      'pending-ecommerce-confirm': '待电商负责人确认',
      'cold-start': '冷启动期',
      'scaling': '放量期'
    }
    return statusMap[status] || status
  }
}

