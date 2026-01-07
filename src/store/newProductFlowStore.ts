import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// 洞察期机会卡
export interface IdeaOpportunity {
  id: string
  title: string // 如"儿童×10-19.9元×301-500g：高端组合"
  score: number // 机会分
  evidenceSamples: Array<{
    name: string
    specs: string
    gmv: string
    price: string
  }>
  createdAt: string
}

// 默认企划期阶段状态
export const defaultPlanningStageStatus = {
  brandOwnerDecision: 'pending' as 'pending' | 'approved' | 'rejected',
  ecommerceOwnerDecision: 'pending' as 'pending' | 'confirmed'
}

// 企划期待审批新品
export interface PlanningProduct {
  id: string
  title: string
  status: 'pending' | 'approved' | 'rejected'
  pushedByRoleId: string
  pushedAt: string
  rejectReason?: string
  trialReportMock?: {
    summary: string
    keyPoints: string[]
  }
  simulatorFormMock?: {
    targetGMV: number
    gmvGrowthRate: string
    targetCostRatio: string
    roiGrowthRate: string
  }
  // 三个月目标数据
  threeMonthTargets?: Array<{
    month: string
    targetGMV: number
    targetBudget: number
    targetCostRatio: string
  }>
  // 评分体系数据
  scoringSystem?: {
    trackGrowthRate: number
    rampUpPeriod: number
    newProductPenetrationRate: number
    pricingReasonableness: number
    sellingPointMatching: number
    overallScore: number
  }
  // 企划期阶段状态
  planningStageStatus?: {
    brandOwnerDecision: 'pending' | 'approved' | 'rejected'
    ecommerceOwnerDecision: 'pending' | 'confirmed'
  }
  // 电商负责人目标字段
  ecommerceTargets?: {
    targetGMV: number
    targetBudget: number
    targetRoiFloor: number
    targetAOV: number
    platformShare: {
      douyin: number // 百分比，如 20 表示 20%
      tmall: number
      jd: number
    }
    launchDate?: string
    coldStartGMV?: number
    coldStartROI?: number
    coldStartBuyers?: number
  }
}

interface NewProductFlowState {
  planningProducts: PlanningProduct[]
  
  pushToPlanning: (idea: IdeaOpportunity) => void
  approvePlanning: (productId: string) => void
  rejectPlanning: (productId: string, reason: string) => void
  getPendingProducts: () => PlanningProduct[]
  getProductById: (productId: string) => PlanningProduct | undefined
  
  // 电商负责人相关方法
  getEcommercePendingProducts: () => PlanningProduct[]
  updateEcommerceTargets: (productId: string, partialTargets: Partial<PlanningProduct['ecommerceTargets']>) => void
  confirmEcommerceTargets: (productId: string) => void
}

// 默认电商目标值
const getDefaultEcommerceTargets = (): NonNullable<PlanningProduct['ecommerceTargets']> => ({
  targetGMV: 3000000,
  targetBudget: 1200000,
  targetRoiFloor: 2,
  targetAOV: 9,
  platformShare: {
    douyin: 20,
    tmall: 30,
    jd: 40
  },
  coldStartGMV: 3000000,
  coldStartROI: 3000000,
  coldStartBuyers: 2000
})

// 迁移函数：补齐缺失的 planningStageStatus
const migratePlanningProducts = (products: PlanningProduct[]): PlanningProduct[] => {
  return products.map(p => ({
    ...p,
    planningStageStatus: {
      ...defaultPlanningStageStatus,
      ...(p.planningStageStatus ?? {})
    }
  }))
}

export const useNewProductFlowStore = create<NewProductFlowState>()(
  persist(
    (set, get) => ({
      planningProducts: [],

      pushToPlanning: (idea: IdeaOpportunity) => {
        const state = get()
        // 检查是否已存在 pending 状态
        const exists = state.planningProducts.some(p => p.id === idea.id && p.status === 'pending')
        if (exists) {
          // 已在队列中，不重复添加
          return
        }

        const newProduct: PlanningProduct = {
          id: idea.id,
          title: idea.title,
          status: 'pending',
          pushedByRoleId: 'market_analysis',
          pushedAt: new Date().toISOString(),
          planningStageStatus: { ...defaultPlanningStageStatus },
          ecommerceTargets: getDefaultEcommerceTargets(),
          trialReportMock: {
            summary: '根据市场调研和试销数据，该产品具备良好的市场潜力。',
            keyPoints: [
              '目标用户群体明确，需求旺盛',
              '价格定位合理，符合市场预期',
              '产品卖点突出，差异化明显',
              '渠道反馈积极，推广阻力小'
            ]
          },
          simulatorFormMock: {
            targetGMV: 3000000,
            gmvGrowthRate: '12.5%',
            targetCostRatio: '40%',
            roiGrowthRate: '10%'
          },
          threeMonthTargets: [
            { month: '1月', targetGMV: 570000, targetBudget: 270000, targetCostRatio: '40%' },
            { month: '2月', targetGMV: 510000, targetBudget: 220000, targetCostRatio: '40%' },
            { month: '3月', targetGMV: 420000, targetBudget: 160000, targetCostRatio: '40%' }
          ],
          scoringSystem: {
            trackGrowthRate: 80,
            rampUpPeriod: 85,
            newProductPenetrationRate: 70,
            pricingReasonableness: 70,
            sellingPointMatching: 50,
            overallScore: 69.8
          }
        }

        set({
          planningProducts: [...state.planningProducts, newProduct]
        })
      },

      approvePlanning: (productId: string) => {
        set((state) => ({
          planningProducts: state.planningProducts.map(p =>
            p.id === productId ? {
              ...p,
              status: 'approved',
              planningStageStatus: {
                ...defaultPlanningStageStatus,
                ...p.planningStageStatus,
                brandOwnerDecision: 'approved',
                ecommerceOwnerDecision: p.planningStageStatus?.ecommerceOwnerDecision ?? 'pending'
              }
            } : p
          )
        }))
      },

      rejectPlanning: (productId: string, reason: string) => {
        set((state) => ({
          planningProducts: state.planningProducts.map(p =>
            p.id === productId ? {
              ...p,
              status: 'rejected',
              rejectReason: reason,
              planningStageStatus: {
                ...p.planningStageStatus,
                brandOwnerDecision: 'rejected',
                ecommerceOwnerDecision: p.planningStageStatus?.ecommerceOwnerDecision || 'pending'
              }
            } : p
          )
        }))
      },

      getPendingProducts: () => {
        return get().planningProducts.filter(p => p.status === 'pending')
      },

      getProductById: (productId: string) => {
        return get().planningProducts.find(p => p.id === productId)
      },

      getEcommercePendingProducts: () => {
        return get().planningProducts.filter(p =>
          p.planningStageStatus?.brandOwnerDecision === 'approved' &&
          p.planningStageStatus?.ecommerceOwnerDecision === 'pending'
        )
      },

      updateEcommerceTargets: (productId: string, partialTargets: Partial<PlanningProduct['ecommerceTargets']>) => {
        const pt = partialTargets ?? {}
        const defaultTargets = getDefaultEcommerceTargets()
        set((state) => ({
          planningProducts: state.planningProducts.map(p => {
            if (p.id !== productId) return p
            const existingTargets = p.ecommerceTargets ?? defaultTargets
            return {
              ...p,
              ecommerceTargets: {
                targetGMV: pt.targetGMV ?? existingTargets.targetGMV,
                targetBudget: pt.targetBudget ?? existingTargets.targetBudget,
                targetRoiFloor: pt.targetRoiFloor ?? existingTargets.targetRoiFloor,
                targetAOV: pt.targetAOV ?? existingTargets.targetAOV,
                platformShare: {
                  ...existingTargets.platformShare,
                  ...(pt.platformShare || {})
                },
                launchDate: pt.launchDate ?? existingTargets.launchDate,
                coldStartGMV: pt.coldStartGMV ?? existingTargets.coldStartGMV,
                coldStartROI: pt.coldStartROI ?? existingTargets.coldStartROI,
                coldStartBuyers: pt.coldStartBuyers ?? existingTargets.coldStartBuyers
              }
            }
          })
        }))
      },

      confirmEcommerceTargets: (productId: string) => {
        set((state) => ({
          planningProducts: state.planningProducts.map(p => {
            if (p.id !== productId) return p
            return {
              ...p,
              planningStageStatus: {
                brandOwnerDecision: p.planningStageStatus?.brandOwnerDecision || 'pending',
                ecommerceOwnerDecision: 'confirmed'
              }
            }
          })
        }))
      }
    }),
    {
      name: 'new-product-flow-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // 迁移：补齐缺失的 planningStageStatus
        if (state?.planningProducts) {
          state.planningProducts = migratePlanningProducts(state.planningProducts)
        }
      },
    }
  )
)
