import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import AppFrame from './AppFrame'
import './Layout.css'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()

  return (
    <AppFrame>
      <div className="layout">
        <nav className="navbar">
          <Link to="/" className="nav-brand">
            新品工作台
          </Link>
          <div className="nav-links">
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
              首页
            </Link>
            <Link to="/products" className={location.pathname.startsWith('/products') ? 'active' : ''}>
              产品列表
            </Link>
            <Link to="/workflow" className={location.pathname === '/workflow' ? 'active' : ''}>
              工作流
            </Link>
            <Link to="/new-product-insight" className={location.pathname === '/new-product-insight' ? 'active' : ''}>
              新品灵感洞察器
            </Link>
          </div>
        </nav>
        <main className="main-content">
          {children}
        </main>
      </div>
    </AppFrame>
  )
}
