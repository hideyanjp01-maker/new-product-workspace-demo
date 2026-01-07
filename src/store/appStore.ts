import { create } from 'zustand'

export type ViewMode = 'dashboard' | 'ai'
export type Stage = 'overview' | 'insight' | 'planning' | 'cold-start' | 'scale-up'

// 时间选择类型
export type TimeSelectionType = 'month' | 'month_day_range' | 'date_range' | 'day_counter' | null

export interface TimeSelection {
  type: TimeSelectionType
  // month 类型
  month?: string // "2024-01"
  // month_day_range 类型
  start?: string // "2024-01-05"
  end?: string // "2024-01-12"
  // date_range 类型
  startDate?: string // "2024-01-05"
  endDate?: string // "2024-01-31"
  // day_counter 类型
  launchDate?: string // 启动日期
  dayCount?: number // 启动天数
}

export interface AppState {
  selectedProductId: string | null
  dateA: string // 开始日期（保留向后兼容）
  dateB: string // 结束日期（保留向后兼容）
  viewMode: ViewMode
  currentStage: Stage | null
  currentRoleId: string | null // 当前选择的角色ID
  timeSelection: TimeSelection | null // 时间选择
  
  // Actions
  setSelectedProductId: (id: string | null) => void
  setDateRange: (dateA: string, dateB: string) => void
  setViewMode: (mode: ViewMode) => void
  setCurrentStage: (stage: Stage | null) => void
  setCurrentRoleId: (roleId: string | null) => void
  setTimeSelection: (selection: TimeSelection | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  selectedProductId: '1',
  dateA: '2024-01-01',
  dateB: '2024-01-31',
  viewMode: 'dashboard',
  currentStage: 'overview',
  currentRoleId: 'market_analysis', // 默认角色：市场分析
  timeSelection: {
    type: 'date_range',
    startDate: '2024-01-01',
    endDate: '2024-01-31'
  },
  
  setSelectedProductId: (id) => set({ selectedProductId: id }),
  setDateRange: (dateA, dateB) => set({ dateA, dateB }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setCurrentStage: (stage) => set({ currentStage: stage }),
  setCurrentRoleId: (roleId) => set({ currentRoleId: roleId }),
  setTimeSelection: (selection) => set({ timeSelection: selection }),
}))
