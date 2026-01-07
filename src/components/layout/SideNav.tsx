import { Link, useLocation } from 'react-router-dom'
import { useAppStore } from '../../store/appStore'
import './SideNav.css'

const navItems = [
  { path: '/stages/overview', label: '总览' },
  { path: '/stages/insight', label: '洞察期' },
  { path: '/stages/planning', label: '企划期' },
  { path: '/stages/cold-start', label: '冷启动期' },
  { path: '/stages/scale-up', label: '放量期' },
]

export default function SideNav() {
  const location = useLocation()
  const { viewMode, setViewMode } = useAppStore()

  return (
    <div className="layout-sidenav">
      <nav className="layout-sidenav-nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`layout-sidenav-item ${location.pathname === item.path ? 'layout-sidenav-item--active' : ''}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      
      <div className="layout-sidenav-footer">
        <div className="layout-sidenav-switch">
          <button
            className={`layout-sidenav-switch-btn ${viewMode === 'dashboard' ? 'layout-sidenav-switch-btn--active' : ''}`}
            onClick={() => setViewMode('dashboard')}
          >
            数据看板
          </button>
          <button
            className={`layout-sidenav-switch-btn ${viewMode === 'ai' ? 'layout-sidenav-switch-btn--active' : ''}`}
            onClick={() => setViewMode('ai')}
          >
            AI洞察
          </button>
        </div>
      </div>
    </div>
  )
}
