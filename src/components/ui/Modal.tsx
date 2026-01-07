import { ReactNode, useEffect } from 'react'
import './Modal.css'
import Button from './Button'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  footer?: ReactNode
  width?: number | string
}

export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  width = 520
}: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  const modalWidth = typeof width === 'number' ? `${width}px` : width

  return (
    <div className="ui-modal-backdrop" onClick={onClose}>
      <div
        className="ui-modal"
        style={{ width: modalWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="ui-modal-header">
            <h3 className="ui-modal-title">{title}</h3>
            <button className="ui-modal-close" onClick={onClose}>
              ×
            </button>
          </div>
        )}
        <div className="ui-modal-body">{children}</div>
        {footer !== undefined && (
          <div className="ui-modal-footer">
            {footer || (
              <Button variant="primary" onClick={onClose}>
                确定
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}






