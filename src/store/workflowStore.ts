import { create } from 'zustand'

export interface WorkflowStep {
  id: string
  name: string
  status: 'pending' | 'in-progress' | 'completed' | 'failed'
  description: string
  roleId?: string // 关联的角色ID
  route?: string // 角色页面路由
  data?: any
}

export interface WorkflowState {
  currentStep: number
  steps: WorkflowStep[]
  startWorkflow: () => void
  nextStep: () => void
  previousStep: () => void
  updateStepStatus: (stepId: string, status: WorkflowStep['status'], data?: any) => void
  resetWorkflow: () => void
  goToStep: (stepIndex: number) => void
}

const initialSteps: WorkflowStep[] = [
  {
    id: '1',
    name: '新品灵感洞察',
    status: 'pending',
    description: '发现新品灵感和市场机会',
    roleId: 'new-product-insight',
    route: '/roles/new-product-insight'
  },
  {
    id: '2',
    name: 'AI洞察分析',
    status: 'pending',
    description: 'AI驱动的智能洞察分析',
    roleId: 'ai-insight',
    route: '/roles/ai-insight'
  },
  {
    id: '3',
    name: '市场分析',
    status: 'pending',
    description: '市场趋势和竞争分析',
    roleId: 'market-analysis',
    route: '/roles/market-analysis'
  },
  {
    id: '4',
    name: '品牌策略',
    status: 'pending',
    description: '品牌策略和定位管理',
    roleId: 'brand-manager',
    route: '/roles/brand-manager'
  },
  {
    id: '5',
    name: '商品管理',
    status: 'pending',
    description: '商品信息和管理',
    roleId: 'product-management',
    route: '/roles/product-management'
  },
  {
    id: '6',
    name: '电商整体规划',
    status: 'pending',
    description: '电商整体运营管理',
    roleId: 'ecommerce-director',
    route: '/roles/ecommerce-director'
  },
  {
    id: '7',
    name: '天猫运营',
    status: 'pending',
    description: '天猫平台运营管理',
    roleId: 'tmall-operation',
    route: '/roles/tmall-operation'
  },
  {
    id: '8',
    name: '天猫流量运营',
    status: 'pending',
    description: '天猫流量获取和优化',
    roleId: 'tmall-traffic',
    route: '/roles/tmall-traffic'
  },
  {
    id: '9',
    name: '京东运营',
    status: 'pending',
    description: '京东平台运营管理',
    roleId: 'jd-operation',
    route: '/roles/jd-operation'
  },
  {
    id: '10',
    name: '京东流量运营',
    status: 'pending',
    description: '京东流量获取和优化',
    roleId: 'jd-traffic',
    route: '/roles/jd-traffic'
  },
  {
    id: '11',
    name: '抖音店铺运营',
    status: 'pending',
    description: '抖音店铺运营管理',
    roleId: 'douyin-shop',
    route: '/roles/douyin-shop'
  },
  {
    id: '12',
    name: '抖音投放',
    status: 'pending',
    description: '抖音广告投放管理',
    roleId: 'douyin-advertising',
    route: '/roles/douyin-advertising'
  },
  {
    id: '13',
    name: '抖音内容制作',
    status: 'pending',
    description: '抖音内容创作和管理',
    roleId: 'douyin-content',
    route: '/roles/douyin-content'
  },
  {
    id: '14',
    name: '抖音商务合作',
    status: 'pending',
    description: '抖音商务合作管理',
    roleId: 'douyin-business',
    route: '/roles/douyin-business'
  },
  {
    id: '15',
    name: '潜力达人洞察',
    status: 'pending',
    description: '达人分析和合作机会',
    roleId: 'talent-insight',
    route: '/roles/talent-insight'
  },
  {
    id: '16',
    name: '竞品分析',
    status: 'pending',
    description: '竞品对比分析',
    roleId: 'competitor-analysis',
    route: '/roles/competitor-analysis'
  },
  {
    id: '17',
    name: '素材生成',
    status: 'pending',
    description: '营销素材生成工具',
    roleId: 'material-generator',
    route: '/roles/material-generator'
  },
  {
    id: '18',
    name: '任务管理',
    status: 'pending',
    description: '任务管理和分配',
    roleId: 'task',
    route: '/roles/task'
  }
]

export const useWorkflowStore = create<WorkflowState>((set) => ({
  currentStep: 0,
  steps: initialSteps,
  
  startWorkflow: () => {
    set((state) => ({
      currentStep: 0,
      steps: state.steps.map((step, index) => 
        index === 0 ? { ...step, status: 'in-progress' } : step
      )
    }))
  },
  
  nextStep: () => {
    set((state) => {
      const nextIndex = state.currentStep + 1
      if (nextIndex >= state.steps.length) return state
      
      return {
        currentStep: nextIndex,
        steps: state.steps.map((step, index) => {
          if (index === state.currentStep) {
            return { ...step, status: 'completed' }
          }
          if (index === nextIndex) {
            return { ...step, status: 'in-progress' }
          }
          return step
        })
      }
    })
  },
  
  previousStep: () => {
    set((state) => {
      const prevIndex = state.currentStep - 1
      if (prevIndex < 0) return state
      
      return {
        currentStep: prevIndex,
        steps: state.steps.map((step, index) => {
          if (index === state.currentStep) {
            return { ...step, status: 'pending' }
          }
          if (index === prevIndex) {
            return { ...step, status: 'in-progress' }
          }
          return step
        })
      }
    })
  },
  
  updateStepStatus: (stepId, status, data) => {
    set((state) => ({
      steps: state.steps.map((step) =>
        step.id === stepId ? { ...step, status, data } : step
      )
    }))
  },
  
  resetWorkflow: () => {
    set({
      currentStep: 0,
      steps: initialSteps.map(step => ({ ...step, status: 'pending', data: undefined }))
    })
  },
  
  goToStep: (stepIndex: number) => {
    set((state) => {
      if (stepIndex < 0 || stepIndex >= state.steps.length) return state
      
      return {
        currentStep: stepIndex,
        steps: state.steps.map((step, index) => {
          if (index === stepIndex) {
            return { ...step, status: 'in-progress' }
          }
          if (index < stepIndex) {
            return { ...step, status: 'completed' }
          }
          return step
        })
      }
    })
  }
}))

