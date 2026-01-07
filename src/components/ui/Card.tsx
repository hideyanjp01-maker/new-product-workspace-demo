import { HTMLAttributes, ReactNode } from 'react'
import './Card.css'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  padding?: 'none' | 'small' | 'medium' | 'large'
  hoverable?: boolean
}

export default function Card({
  children,
  padding = 'medium',
  hoverable = false,
  className = '',
  ...props
}: CardProps) {
  const classes = [
    'ui-card',
    `ui-card--padding-${padding}`,
    hoverable && 'ui-card--hoverable',
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}






