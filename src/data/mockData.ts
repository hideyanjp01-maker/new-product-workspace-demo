// 角色定义
export interface Role {
  id: string
  name: string
  imagePath: string
  description: string
  route: string
}

// 指标定义
export interface Metric {
  id: string
  name: string
  value: number | string
  unit?: string
  trend?: 'up' | 'down' | 'stable'
  roleIds: string[]
}

// 新品阶段类型
export type ProductPhase = 'planning' | 'cold-start' | 'scaling'
export type PlanningStatus = 'pending-target' | 'pending-brand-confirm' | 'pending-review-target' | 'pending-ecommerce-confirm'
export type ProductStatus = PlanningStatus | 'cold-start' | 'scaling'

// 产品信息
export interface Product {
  id: string
  name: string
  category: string
  price: number
  status: ProductStatus
  phase: ProductPhase
  description: string
  images: string[]
  createdAt: string
  updatedAt: string
  tags: string[]
  targetMetrics?: { [key: string]: number }
  currentMetrics?: { [key: string]: number }
  aiInsights?: string[]
  visibleRoles?: string[]
}

// 工作流历史
export interface WorkflowHistory {
  id: string
  productId: string
  productName: string
  step: string
  action: string
  operator: string
  timestamp: string
  comment?: string
}

export const mockProducts: Product[] = [
  {
    id: '1',
    name: '金典有机纯牛奶 250mL×12盒',
    category: '液体奶',
    price: 69,
    status: 'scaling',
    phase: 'scaling',
    description: '金典有机纯牛奶，采用有机奶源，富含优质蛋白，口感醇厚，适合家庭日常饮用和早餐搭配',
    images: ['/images/product-1.jpg'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    tags: ['有机奶源', '蛋白营养', '口感醇厚'],
    visibleRoles: ['*'],
    targetMetrics: { '总成交金额': 500000, '总成交订单数': 500, '客单价': 1000 },
    currentMetrics: { '总成交金额': 520000, '总成交订单数': 520, '客单价': 1000 },
    aiInsights: ['产品表现超出预期，成交金额较目标提升4%', '建议加大投放力度，扩大市场份额']
  },
  {
    id: '2',
    name: '安慕希原味 205g×12瓶',
    category: '液体奶',
    price: 59,
    status: 'pending-ecommerce-confirm',
    phase: 'planning',
    description: '安慕希希腊风味酸奶，采用希腊酸奶工艺，口感浓醇，富含活性乳酸菌，多口味选择满足不同需求',
    images: ['/images/product-2.jpg'],
    createdAt: '2024-01-18',
    updatedAt: '2024-01-19',
    tags: ['浓醇口感', '乳酸菌发酵', '多口味矩阵'],
    visibleRoles: ['market-analysis', 'bu_brand_owner', 'ecommerce_owner'],
    targetMetrics: { '总成交金额': 200000, '总成交订单数': 1000 }
  },
  {
    id: '3',
    name: '优酸乳 原味 250mL×12盒',
    category: '液体奶',
    price: 39,
    status: 'cold-start',
    phase: 'cold-start',
    description: '优酸乳乳酸菌饮品，清爽酸甜口感，富含乳酸菌，适合佐餐和日常饮用，深受年轻消费者喜爱',
    images: ['/images/product-3.jpg'],
    createdAt: '2024-01-10',
    updatedAt: '2024-01-17',
    tags: ['清爽酸甜', '乳酸菌饮品', '适合佐餐与日常'],
    visibleRoles: ['*'],
    targetMetrics: { '总成交金额': 300000, '总成交订单数': 750 },
    currentMetrics: { '总成交金额': 150000, '总成交订单数': 375 }
  },
  {
    id: '4',
    name: '金典有机纯牛奶 250mL×16盒',
    category: '液体奶',
    price: 89,
    status: 'pending-target',
    phase: 'planning',
    description: '金典有机纯牛奶，采用有机奶源，富含优质蛋白，口感醇厚，适合家庭日常饮用和早餐搭配',
    images: ['/images/product-4.jpg'],
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20',
    tags: ['有机奶源', '蛋白营养', '口感醇厚'],
    visibleRoles: ['market-analysis']
  }
]

export const mockWorkflowHistory: WorkflowHistory[] = [
  {
    id: '1',
    productId: '1',
    productName: '金典有机纯牛奶 250mL×12盒',
    step: '品牌策略',
    action: '创建',
    operator: '品牌负责人',
    timestamp: '2024-01-15 10:00:00',
    comment: '产品信息已完善，请审核'
  }
]

// 正确的11个角色定义（唯一口径）
export const roles: Role[] = [
  { id: 'douyin_ads', name: '抖音投放团队', imagePath: '/images/抖音投放.jpg', description: '抖音广告投放管理', route: '/roles/douyin_ads' },
  { id: 'douyin_content', name: '抖音内容制作', imagePath: '/images/抖音内容制作.jpg', description: '抖音内容创作和管理', route: '/roles/douyin_content' },
  { id: 'douyin_store_live', name: '抖音店播运营', imagePath: '/images/抖音店铺.jpg', description: '抖音店铺直播运营管理', route: '/roles/douyin_store_live' },
  { id: 'ecommerce_bd', name: '电商商务（达人/资源位）', imagePath: '/images/抖音商务.jpg', description: '电商商务合作管理', route: '/roles/ecommerce_bd' },
  { id: 'tmall_ops', name: '天猫运营', imagePath: '/images/天猫运营.jpg', description: '天猫平台运营管理', route: '/roles/tmall_ops' },
  { id: 'tmall_traffic', name: '天猫流量运营', imagePath: '/images/天猫流量运营.jpg', description: '天猫流量获取和优化', route: '/roles/tmall_traffic' },
  { id: 'jd_ops', name: '京东运营', imagePath: '/images/京东运营.jpg', description: '京东平台运营管理', route: '/roles/jd_ops' },
  { id: 'jd_traffic', name: '京东流量运营', imagePath: '/images/京东流量运营.jpg', description: '京东流量获取和优化', route: '/roles/jd_traffic' },
  { id: 'bu_brand_owner', name: 'BU品牌负责人', imagePath: '/images/品牌负责人.jpg', description: '品牌策略和定位管理', route: '/roles/bu_brand_owner' },
  { id: 'ecommerce_owner', name: '电商负责人（Owner）', imagePath: '/images/电商负责人.jpg', description: '电商整体运营管理', route: '/roles/ecommerce_owner' },
  { id: 'market_analysis', name: '市场分析', imagePath: '/images/市场分析.jpg', description: '市场趋势和竞争分析', route: '/roles/market_analysis' }
]

export const metrics: Metric[] = [
  { id: 'douyin-total-sales', name: '总成交金额', value: 1250000, unit: '元', trend: 'up', roleIds: ['douyin_store_live', 'ecommerce_owner', 'tmall_ops', 'jd_ops'] },
  { id: 'douyin-short-video-sales', name: '短视频成交金额', value: 450000, unit: '元', trend: 'up', roleIds: ['douyin_content', 'douyin_store_live'] },
  { id: 'douyin-live-sales', name: '直播成交金额', value: 600000, unit: '元', trend: 'up', roleIds: ['douyin_content', 'douyin_store_live'] },
  { id: 'douyin-product-card-sales', name: '商品卡成交金额', value: 200000, unit: '元', trend: 'up', roleIds: ['douyin_store_live', 'douyin_ads'] },
  { id: 'douyin-total-orders', name: '总成交订单数', value: 1250, unit: '单', trend: 'up', roleIds: ['douyin_store_live', 'ecommerce_owner'] },
  { id: 'douyin-avg-price', name: '客单价', value: 1000, unit: '元', trend: 'stable', roleIds: ['douyin_store_live', 'ecommerce_owner', 'bu_brand_owner'] },
  { id: 'douyin-commission', name: '佣金', value: 12500, unit: '元', trend: 'up', roleIds: ['douyin_ads', 'ecommerce_owner'] },
  { id: 'douyin-refund-rate', name: '总退款率', value: 2.5, unit: '%', trend: 'down', roleIds: ['douyin_store_live', 'ecommerce_owner'] },
  { id: 'tmall-sales', name: '天猫销售额', value: 850000, unit: '元', trend: 'up', roleIds: ['tmall_ops', 'ecommerce_owner'] },
  { id: 'tmall-traffic', name: '天猫流量', value: 50000, unit: 'UV', trend: 'up', roleIds: ['tmall_traffic', 'tmall_ops'] },
  { id: 'tmall-conversion', name: '天猫转化率', value: 3.5, unit: '%', trend: 'stable', roleIds: ['tmall_ops', 'tmall_traffic'] },
  { id: 'jd-sales', name: '京东销售额', value: 650000, unit: '元', trend: 'up', roleIds: ['jd_ops', 'ecommerce_owner'] },
  { id: 'jd-traffic', name: '京东流量', value: 35000, unit: 'UV', trend: 'up', roleIds: ['jd_traffic', 'jd_ops'] },
  { id: 'jd-conversion', name: '京东转化率', value: 4.2, unit: '%', trend: 'up', roleIds: ['jd_ops', 'jd_traffic'] },
  { id: 'content-views', name: '内容播放量', value: 2500000, unit: '次', trend: 'up', roleIds: ['douyin_content', 'douyin_ads'] },
  { id: 'talent-cooperation', name: '达人合作数', value: 15, unit: '人', trend: 'up', roleIds: ['ecommerce_bd'] },
  { id: 'brand-awareness', name: '品牌知名度', value: 78, unit: '分', trend: 'up', roleIds: ['bu_brand_owner', 'market_analysis'] }
]

export const getProducts = (): Product[] => mockProducts
export const getProductById = (id: string): Product | undefined => mockProducts.find(p => p.id === id)
export const getProductsByStatus = (status: ProductStatus): Product[] => mockProducts.filter(p => p.status === status)
export const getWorkflowHistory = (productId?: string): WorkflowHistory[] => {
  if (productId) return mockWorkflowHistory.filter(h => h.productId === productId)
  return mockWorkflowHistory
}
export const getRoles = (): Role[] => roles
export const getRoleById = (id: string): Role | undefined => roles.find(r => r.id === id)
export const getMetricsByRole = (roleId: string): Metric[] => metrics.filter(m => m.roleIds.includes(roleId))
export const getAllMetrics = (): Metric[] => metrics
