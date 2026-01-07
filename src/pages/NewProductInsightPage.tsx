import { Link } from 'react-router-dom'
import './NewProductInsightPage.css'

export default function NewProductInsightPage() {
  return (
    <div className="new-product-insight-page">
      <div className="page-header">
        <Link to="/" className="back-link">← 返回首页</Link>
        <h1>新品灵感洞察器</h1>
        <p>发现新品灵感和市场机会</p>
      </div>

      <div className="insight-content">
        <div className="insight-card">
          <h2>功能说明</h2>
          <p>在新品灵感洞察器页面中，您可以：</p>
          <ul>
            <li>查看市场趋势和热门品类</li>
            <li>分析竞品表现</li>
            <li>发现新的产品机会</li>
            <li>点击"推入新品"按钮，创建新的产品进入企划期</li>
          </ul>
        </div>

        <div className="action-section">
          <Link to="/roles/new-product-insight" className="action-btn primary">
            查看完整页面 →
          </Link>
        </div>
      </div>
    </div>
  )
}




