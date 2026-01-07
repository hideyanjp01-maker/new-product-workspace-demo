import { ReactNode } from 'react'
import TopBar from './TopBar'
import SideNav from './SideNav'
import AppFrame from '../AppFrame'
import './MainLayout.css'

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <AppFrame>
      <div className="main-layout">
        <TopBar />
        <div className="main-layout-body">
          <SideNav />
          <main className="main-layout-content">
            {children}
          </main>
        </div>
      </div>
    </AppFrame>
  )
}
