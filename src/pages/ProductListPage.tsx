import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getProducts } from '../data/mockData'
import type { Product } from '../data/mockData'
import './ProductListPage.css'

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    const data = getProducts()
    setProducts(data)
  }, [])

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="product-list-page">
      <div className="page-header">
        <h1>产品列表</h1>
        <input
          type="text"
          className="search-input"
          placeholder="搜索产品..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="filter-tabs">
        <button
          className={filterStatus === 'all' ? 'active' : ''}
          onClick={() => setFilterStatus('all')}
        >
          全部
        </button>
        <button
          className={filterStatus === 'pending-target' ? 'active' : ''}
          onClick={() => setFilterStatus('pending-target')}
        >
          待生成目标
        </button>
        <button
          className={filterStatus === 'cold-start' ? 'active' : ''}
          onClick={() => setFilterStatus('cold-start')}
        >
          冷启动期
        </button>
        <button
          className={filterStatus === 'scaling' ? 'active' : ''}
          onClick={() => setFilterStatus('scaling')}
        >
          放量期
        </button>
      </div>

      <div className="product-list">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="product-item"
            >
              <div className="product-item-image">
                {product.images[0] ? (
                  <img src={product.images[0]} alt={product.name} />
                ) : (
                  <div className="placeholder-image">暂无图片</div>
                )}
              </div>
              <div className="product-item-info">
                <h3>{product.name}</h3>
                <p className="product-category">{product.category}</p>
                <p className="product-description">{product.description}</p>
                <div className="product-meta">
                  <span className="product-price">¥{product.price}</span>
                  <span className={`status-badge ${product.status}`}>
                    {getStatusText(product.status)}
                  </span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="empty-state">
            <p>没有找到匹配的产品</p>
          </div>
        )}
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
