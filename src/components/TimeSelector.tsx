import { useEffect, useState } from 'react'
import { useAppStore } from '../store/appStore'
import './TimeSelector.css'

// 洞察期：不支持时间选择
function TimeSelectorInsightDisabled() {
  return (
    <div className="time-selector time-selector--disabled">
      <span className="time-selector-label">时间选择</span>
      <span className="time-selector-disabled-text">洞察期不支持时间选择</span>
    </div>
  )
}

// 企划期：仅自然月选择
function TimeSelectorPlanningMonth() {
  const { timeSelection, setTimeSelection } = useAppStore()
  const month = timeSelection?.month || '2024-01'

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMonth = e.target.value
    setTimeSelection({
      type: 'month',
      month: newMonth
    })
  }

  return (
    <div className="time-selector">
      <label className="time-selector-label">选择月份</label>
      <input
        type="month"
        value={month}
        onChange={handleMonthChange}
        className="time-selector-input"
      />
    </div>
  )
}

// 冷启动期：显示"新品启动第X天"
function TimeSelectorColdStartDayCounter() {
  const { timeSelection, setTimeSelection } = useAppStore()
  
  useEffect(() => {
    const launchDate = timeSelection?.launchDate || '2024-01-01'
    const today = new Date()
    const launch = new Date(launchDate)
    const diffTime = today.getTime() - launch.getTime()
    const dayCount = Math.max(1, Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1)

    setTimeSelection({
      type: 'day_counter',
      launchDate,
      dayCount
    })
  }, [timeSelection?.launchDate, setTimeSelection])

  const launchDate = timeSelection?.launchDate || '2024-01-01'
  const today = new Date()
  const launch = new Date(launchDate)
  const diffTime = today.getTime() - launch.getTime()
  const dayCount = Math.max(1, Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1)

  return (
    <div className="time-selector time-selector--readonly">
      <span className="time-selector-label">新品启动</span>
      <span className="time-selector-day-count">第 {dayCount} 天</span>
    </div>
  )
}

// 放量期：月份 + 同月内日期范围
function TimeSelectorScaleUpMonthDayRange() {
  const { timeSelection, setTimeSelection } = useAppStore()
  const [error, setError] = useState<string | null>(null)

  const month = timeSelection?.month || '2024-01'
  const start = timeSelection?.start || ''
  const end = timeSelection?.end || ''

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMonth = e.target.value
    setTimeSelection({
      type: 'month_day_range',
      month: newMonth,
      start: '',
      end: ''
    })
    setError(null)
  }

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = e.target.value
    const monthPrefix = month + '-'
    if (!newStart.startsWith(monthPrefix)) {
      setError('开始日期必须与选择的月份一致')
      return
    }
    
    if (end && newStart > end) {
      setError('开始日期不能晚于结束日期')
      return
    }

    setTimeSelection({
      type: 'month_day_range',
      month,
      start: newStart,
      end
    })
    setError(null)
  }

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = e.target.value
    const monthPrefix = month + '-'
    if (!newEnd.startsWith(monthPrefix)) {
      setError('结束日期必须与选择的月份一致')
      return
    }

    if (start && newEnd < start) {
      setError('结束日期不能早于开始日期')
      return
    }

    setTimeSelection({
      type: 'month_day_range',
      month,
      start,
      end: newEnd
    })
    setError(null)
  }

  return (
    <div className="time-selector time-selector--range">
      <label className="time-selector-label">选择月份</label>
      <input
        type="month"
        value={month}
        onChange={handleMonthChange}
        className="time-selector-input"
      />
      <label className="time-selector-label">开始日期</label>
      <input
        type="date"
        value={start}
        onChange={handleStartChange}
        className="time-selector-input"
        min={month + '-01'}
        max={month + '-31'}
      />
      <label className="time-selector-label">结束日期</label>
      <input
        type="date"
        value={end}
        onChange={handleEndChange}
        className="time-selector-input"
        min={month + '-01'}
        max={month + '-31'}
      />
      {error && <span className="time-selector-error">{error}</span>}
    </div>
  )
}

// 总览：任意自然日范围（可跨月）
function TimeSelectorOverviewDateRange() {
  const { timeSelection, setTimeSelection } = useAppStore()
  const [error, setError] = useState<string | null>(null)

  const startDate = timeSelection?.startDate || '2024-01-01'
  const endDate = timeSelection?.endDate || '2024-01-31'

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value
    if (endDate && newStartDate > endDate) {
      setError('开始日期不能晚于结束日期')
      return
    }
    setTimeSelection({
      type: 'date_range',
      startDate: newStartDate,
      endDate
    })
    setError(null)
  }

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value
    if (startDate && newEndDate < startDate) {
      setError('结束日期不能早于开始日期')
      return
    }
    setTimeSelection({
      type: 'date_range',
      startDate,
      endDate: newEndDate
    })
    setError(null)
  }

  return (
    <div className="time-selector time-selector--range">
      <label className="time-selector-label">开始日期</label>
      <input
        type="date"
        value={startDate}
        onChange={handleStartDateChange}
        className="time-selector-input"
      />
      <label className="time-selector-label">结束日期</label>
      <input
        type="date"
        value={endDate}
        onChange={handleEndDateChange}
        className="time-selector-input"
        min={startDate}
      />
      {error && <span className="time-selector-error">{error}</span>}
    </div>
  )
}

// 主组件：无 hooks 的分发器（只有一个固定的 hook：useAppStore）
export default function TimeSelector() {
  const currentStage = useAppStore((state) => state.currentStage)

  // 只在这里做渲染分发，不写任何条件 hook
  if (currentStage === 'insight') {
    return <TimeSelectorInsightDisabled />
  }
  if (currentStage === 'planning') {
    return <TimeSelectorPlanningMonth />
  }
  if (currentStage === 'cold-start') {
    return <TimeSelectorColdStartDayCounter />
  }
  if (currentStage === 'scale-up') {
    return <TimeSelectorScaleUpMonthDayRange />
  }
  // overview 或默认
  return <TimeSelectorOverviewDateRange />
}
