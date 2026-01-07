import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProducts, getRoles } from '../data/mockData'
import type { Product } from '../data/mockData'
import './HomePage.css'

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [roles] = useState(getRoles())
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    reviewing: 0,
    draft: 0
  })

  useEffect(() => {
    const data = getProducts()
    setProducts(data)
    setStats({
      total: data.length,
      published: data.filter(p => p.status === 'scaling').length,
      reviewing: data.filter(p => p.status === 'cold-start').length,
      draft: data.filter(p => p.phase === 'planning').length
    })
  }, [])

  return (
    <div className="home-page">
      <div className="page-header">
        <h1>新品工作台</h1>
        <p>欢迎使用新品工作台管理系统</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">总产品数</div>
        </div>
        <div className="stat-card published">
          <div className="stat-value">{stats.published}</div>
          <div className="stat-label">放量期</div>
        </div>
        <div className="stat-card reviewing">
          <div className="stat-value">{stats.reviewing}</div>
          <div className="stat-label">冷启动期</div>
        </div>
        <div className="stat-card draft">
          <div className="stat-value">{stats.draft}</div>
          <div className="stat-label">企划期</div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>快速操作</h2>
        <div className="action-buttons">
          <Link to="/new-product-insight" className="action-btn primary">
            新品灵感洞察器
          </Link>
          <Link to="/products" className="action-btn secondary">
            查看产品列表
          </Link>
          <Link to="/workflow" className="action-btn secondary">
            开始工作流
          </Link>
        </div>
      </div>

      <div className="roles-section">
        <h2>角色工作台</h2>
        <div className="roles-grid">
          {roles.map(role => (
            <Link
              key={role.id}
              to={role.route}
              className="role-card"
            >
              <div className="role-card-image">
                <img src={role.imagePath} alt={role.name} />
              </div>
              <div className="role-card-info">
                <h3>{role.name}</h3>
                <p>{role.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="recent-products">
        <h2>最近产品</h2>
        <div className="product-grid">
          {products.slice(0, 4).map(product => (
            <Link 
              key={product.id} 
              to={`/new-products/${product.id}?role=market-analysis`}
              className="product-card"
            >
              <div className="product-image">
                {product.images[0] ? (
                  <img src={product.images[0]} alt={product.name} />
                ) : (
                  <div className="placeholder-image">暂无图片</div>
                )}
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-price">¥{product.price}</p>
                <span className={`status-badge ${product.status}`}>
                  {getStatusText(product.status)}
                </span>
              </div>
            </Link>
          ))}
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
