import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui'
import './PageHeader.css'

interface PageHeaderProps {
  title: string
  subtitle?: string
  onBack?: () => void
  backPath?: string
  actions?: ReactNode
}

export default function PageHeader({
  title,
  subtitle,
  onBack,
  backPath,
  actions
}: PageHeaderProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else if (backPath) {
      navigate(backPath)
    } else {
      navigate(-1)
    }
  }

  return (
    <div className="page-header">
      <div className="page-header-left">
        <Button variant="ghost" size="small" onClick={handleBack}>
          ← 返回
        </Button>
        <div className="page-header-title-group">
          <h1 className="page-header-title">{title}</h1>
          {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="page-header-actions">{actions}</div>}
    </div>
  )
}




