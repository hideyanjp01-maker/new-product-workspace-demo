import RoleSwitcher from '../RoleSwitcher'
import TimeSelector from '../TimeSelector'
import './TopBar.css'

export default function TopBar() {
  return (
    <div className="layout-topbar">
      <div className="layout-topbar-content">
        <div className="layout-topbar-logo">
          新品工作台
        </div>
        <div className="layout-topbar-controls">
          <RoleSwitcher />
          <TimeSelector />
        </div>
      </div>
    </div>
  )
}
