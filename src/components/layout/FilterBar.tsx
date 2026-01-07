import React from 'react'
import { useAppStore } from '../../store/appStore'
import { Input, Select } from '../ui'
import './FilterBar.css'

interface FilterBarProps {
  showDateFilter?: boolean
  showSearch?: boolean
  showCategoryFilter?: boolean
}

export default function FilterBar({
  showDateFilter = true,
  showSearch = true,
  showCategoryFilter = true
}: FilterBarProps) {
  const { dateA, dateB, setDateRange } = useAppStore()
  const [searchTerm, setSearchTerm] = React.useState('')
  const [category, setCategory] = React.useState('all')

  const handleDateToggle = () => {
    // 切换日期范围
    const newDateA = dateA === '2024-01-01' ? '2024-01-15' : '2024-01-01'
    const newDateB = dateB === '2024-01-31' ? '2024-02-15' : '2024-01-31'
    setDateRange(newDateA, newDateB)
  }

  return (
    <div className="filter-bar">
      {showDateFilter && (
        <div className="filter-bar-item">
          <label className="filter-bar-label">日期范围</label>
          <div className="filter-bar-date">
            <span className="filter-bar-date-text">{dateA} 至 {dateB}</span>
            <button className="filter-bar-date-toggle" onClick={handleDateToggle}>
              切换
            </button>
          </div>
        </div>
      )}
      {showSearch && (
        <div className="filter-bar-item filter-bar-item--flex">
          <Input
            placeholder="搜索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ maxWidth: '300px' }}
          />
        </div>
      )}
      {showCategoryFilter && (
        <div className="filter-bar-item filter-bar-item--flex">
          <Select
            options={[
              { value: 'all', label: '全部品类' },
              { value: 'electronics', label: '电子产品' },
              { value: 'wearable', label: '可穿戴设备' },
              { value: 'audio', label: '音频设备' }
            ]}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ maxWidth: '200px' }}
          />
        </div>
      )}
    </div>
  )
}

