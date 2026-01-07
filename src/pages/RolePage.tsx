import { ReactNode } from 'react'
import './RolePage.css'

interface RolePageProps {
  roleName: string
  imagePath: string
  children?: ReactNode
  onAction?: (action: string) => void
}

export default function RolePage({ roleName, imagePath, children, onAction }: RolePageProps) {
  return (
    <div className="role-page">
      <div className="role-page-image-container">
        <img 
          src={imagePath} 
          alt={roleName}
          className="role-page-image"
        />
        {children && (
          <div className="role-page-overlay">
            {children}
          </div>
        )}
      </div>
    </div>
  )
}





