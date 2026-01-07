import { ReactNode } from 'react'
import './Tabs.css'

export interface TabItem {
  key: string
  label: string
  content?: ReactNode
}

export interface TabsProps {
  items: TabItem[]
  activeKey: string
  onChange: (key: string) => void
  className?: string
}

export default function Tabs({ items, activeKey, onChange, className = '' }: TabsProps) {
  return (
    <div className={`ui-tabs ${className}`}>
      <div className="ui-tabs-nav">
        {items.map((item) => (
          <button
            key={item.key}
            className={`ui-tabs-tab ${activeKey === item.key ? 'ui-tabs-tab--active' : ''}`}
            onClick={() => onChange(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="ui-tabs-content">
        {items.find(item => item.key === activeKey)?.content}
      </div>
    </div>
  )
}





