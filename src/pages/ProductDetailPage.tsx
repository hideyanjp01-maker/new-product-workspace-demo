import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProductById, getWorkflowHistory } from '../data/mockData'
import type { Product, WorkflowHistory } from '../data/mockData'
import './ProductDetailPage.css'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [history, setHistory] = useState<WorkflowHistory[]>([])

  useEffect(() => {
    if (id) {
      const productData = getProductById(id)
      setProduct(productData || null)
      
      const historyData = getWorkflowHistory(id)
      setHistory(historyData)
    }
  }, [id])

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="empty-state">
          <p>产品不存在</p>
          <Link to="/products">返回产品列表</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="product-detail-page">
      <div className="detail-header">
        <Link to="/products" className="back-link">← 返回列表</Link>
        <h1>{product.name}</h1>
      </div>

      <div className="detail-content">
        <div className="detail-main">
          <div className="product-images">
            {product.images.length > 0 ? (
              product.images.map((img, index) => (
                <div key={index} className="product-image">
                  <img src={img} alt={`${product.name} - 图片 ${index + 1}`} />
                </div>
              ))
            ) : (
              <div className="product-image placeholder">
                <div className="placeholder-text">暂无图片</div>
              </div>
            )}
          </div>

          <div className="product-info-card">
            <h2>产品信息</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>产品名称</label>
                <div>{product.name}</div>
              </div>
              <div className="info-item">
                <label>分类</label>
                <div>{product.category}</div>
              </div>
              <div className="info-item">
                <label>价格</label>
                <div className="price">¥{product.price}</div>
              </div>
              <div className="info-item">
                <label>状态</label>
                <span className={`status-badge ${product.status}`}>
                  {product.status === 'published' ? '已发布' :
                   product.status === 'reviewing' ? '审核中' :
                   product.status === 'approved' ? '已审核' : '草稿'}
                </span>
              </div>
              <div className="info-item full-width">
                <label>描述</label>
                <div>{product.description}</div>
              </div>
              <div className="info-item full-width">
                <label>标签</label>
                <div className="tags">
                  {product.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="info-item">
                <label>创建时间</label>
                <div>{product.createdAt}</div>
              </div>
              <div className="info-item">
                <label>更新时间</label>
                <div>{product.updatedAt}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="detail-sidebar">
          <div className="workflow-history-card">
            <h2>工作流历史</h2>
            {history.length === 0 ? (
              <div className="empty-history">暂无工作流记录</div>
            ) : (
              <div className="history-list">
                {history.map(item => (
                  <div key={item.id} className="history-item">
                    <div className="history-header">
                      <span className="history-step">{item.step}</span>
                      <span className="history-time">{item.timestamp}</span>
                    </div>
                    <div className="history-action">
                      <strong>{item.action}</strong> - {item.operator}
                    </div>
                    {item.comment && (
                      <div className="history-comment">{item.comment}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="action-card">
            <h2>操作</h2>
            <div className="action-buttons">
              <Link to="/workflow" className="action-btn primary">
                开始工作流
              </Link>
              <button className="action-btn secondary">
                编辑产品
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
