// 伊利液体奶演示商品池（统一数据源）

// SPU定义
export interface SPU {
  id: string
  name: string
  series: '金典' | '安慕希' | '优酸乳'
  category: string
  subCategory: string
  brand: string
  sellingPoints: string[]
  description: string
}

// SKU定义
export interface SKU {
  id: string
  spuId: string
  name: string
  spec: string
  price: number
  priceRange?: string
}

// 商品选项（用于下拉/筛选）
export interface ProductOption {
  label: string
  value: string
  brand: string
  series: string
  spec: string
  spuId: string
  skuId: string
}

// SPU数据
export const demoSPUs: SPU[] = [
  {
    id: 'spu-1',
    name: '金典 有机纯牛奶',
    series: '金典',
    category: '液体奶',
    subCategory: '纯牛奶',
    brand: '伊利',
    sellingPoints: ['有机奶源', '蛋白营养', '口感醇厚'],
    description: '金典有机纯牛奶，采用有机奶源，富含优质蛋白，口感醇厚，适合家庭日常饮用和早餐搭配'
  },
  {
    id: 'spu-2',
    name: '安慕希 希腊风味酸奶',
    series: '安慕希',
    category: '液体奶',
    subCategory: '常温酸奶',
    brand: '伊利',
    sellingPoints: ['浓醇口感', '乳酸菌发酵', '多口味矩阵'],
    description: '安慕希希腊风味酸奶，采用希腊酸奶工艺，口感浓醇，富含活性乳酸菌，多口味选择满足不同需求'
  },
  {
    id: 'spu-3',
    name: '优酸乳 乳酸菌饮品',
    series: '优酸乳',
    category: '液体奶',
    subCategory: '乳酸菌饮品',
    brand: '伊利',
    sellingPoints: ['清爽酸甜', '乳酸菌饮品', '适合佐餐与日常'],
    description: '优酸乳乳酸菌饮品，清爽酸甜口感，富含乳酸菌，适合佐餐和日常饮用，深受年轻消费者喜爱'
  }
]

// SKU数据
export const demoSKUs: SKU[] = [
  // 金典 SKU
  {
    id: 'sku-1-1',
    spuId: 'spu-1',
    name: '金典有机纯牛奶 250mL×12盒',
    spec: '250mL×12盒',
    price: 69,
    priceRange: '69-79元'
  },
  {
    id: 'sku-1-2',
    spuId: 'spu-1',
    name: '金典有机纯牛奶 250mL×16盒',
    spec: '250mL×16盒',
    price: 89,
    priceRange: '89-99元'
  },
  {
    id: 'sku-1-3',
    spuId: 'spu-1',
    name: '金典有机纯牛奶 200mL×24盒',
    spec: '200mL×24盒',
    price: 79,
    priceRange: '79-89元'
  },
  {
    id: 'sku-1-4',
    spuId: 'spu-1',
    name: '金典低脂纯牛奶 250mL×12盒',
    spec: '250mL×12盒',
    price: 65,
    priceRange: '65-75元'
  },
  {
    id: 'sku-1-5',
    spuId: 'spu-1',
    name: '金典有机纯牛奶 1L×6盒',
    spec: '1L×6盒',
    price: 99,
    priceRange: '99-109元'
  },
  {
    id: 'sku-1-6',
    spuId: 'spu-1',
    name: '金典有机纯牛奶 500mL×12盒',
    spec: '500mL×12盒',
    price: 85,
    priceRange: '85-95元'
  },
  // 安慕希 SKU
  {
    id: 'sku-2-1',
    spuId: 'spu-2',
    name: '安慕希原味 205g×12瓶',
    spec: '205g×12瓶',
    price: 59,
    priceRange: '59-69元'
  },
  {
    id: 'sku-2-2',
    spuId: 'spu-2',
    name: '安慕希蓝莓味 205g×12瓶',
    spec: '205g×12瓶',
    price: 59,
    priceRange: '59-69元'
  },
  {
    id: 'sku-2-3',
    spuId: 'spu-2',
    name: '安慕希草莓味 205g×12瓶',
    spec: '205g×12瓶',
    price: 59,
    priceRange: '59-69元'
  },
  {
    id: 'sku-2-4',
    spuId: 'spu-2',
    name: '安慕希黄桃燕麦 205g×12瓶',
    spec: '205g×12瓶',
    price: 62,
    priceRange: '62-72元'
  },
  {
    id: 'sku-2-5',
    spuId: 'spu-2',
    name: '安慕希原味 205g×16瓶',
    spec: '205g×16瓶',
    price: 79,
    priceRange: '79-89元'
  },
  {
    id: 'sku-2-6',
    spuId: 'spu-2',
    name: '安慕希原味 100g×20瓶',
    spec: '100g×20瓶',
    price: 49,
    priceRange: '49-59元'
  },
  // 优酸乳 SKU
  {
    id: 'sku-3-1',
    spuId: 'spu-3',
    name: '优酸乳 原味 250mL×12盒',
    spec: '250mL×12盒',
    price: 39,
    priceRange: '39-49元'
  },
  {
    id: 'sku-3-2',
    spuId: 'spu-3',
    name: '优酸乳 草莓味 250mL×12盒',
    spec: '250mL×12盒',
    price: 39,
    priceRange: '39-49元'
  },
  {
    id: 'sku-3-3',
    spuId: 'spu-3',
    name: '优酸乳 低糖原味 250mL×12盒',
    spec: '250mL×12盒',
    price: 42,
    priceRange: '42-52元'
  },
  {
    id: 'sku-3-4',
    spuId: 'spu-3',
    name: '优酸乳 小瓶装 100mL×30瓶',
    spec: '100mL×30瓶',
    price: 45,
    priceRange: '45-55元'
  },
  {
    id: 'sku-3-5',
    spuId: 'spu-3',
    name: '优酸乳 原味 250mL×16盒',
    spec: '250mL×16盒',
    price: 52,
    priceRange: '52-62元'
  },
  {
    id: 'sku-3-6',
    spuId: 'spu-3',
    name: '优酸乳 蓝莓味 250mL×12盒',
    spec: '250mL×12盒',
    price: 39,
    priceRange: '39-49元'
  }
]

// 商品选项（用于下拉/筛选）
export const demoProductOptions: ProductOption[] = demoSKUs.map(sku => {
  const spu = demoSPUs.find(s => s.id === sku.spuId)!
  return {
    label: sku.name,
    value: sku.id,
    brand: spu.brand,
    series: spu.series,
    spec: sku.spec,
    spuId: sku.spuId,
    skuId: sku.id
  }
})

// 默认选中商品ID（金典有机纯牛奶 250mL×12）
export const getDefaultProductId = (): string => 'sku-1-1'

// 根据SKU ID获取完整信息
export const getSKUInfo = (skuId: string) => {
  const sku = demoSKUs.find(s => s.id === skuId)
  if (!sku) return null
  const spu = demoSPUs.find(s => s.id === sku.spuId)
  return { sku, spu }
}

// 根据SPU ID获取所有SKU
export const getSKUsBySPU = (spuId: string): SKU[] => {
  return demoSKUs.filter(s => s.spuId === spuId)
}

// 获取SPU名称（用于展示）
export const getSPUName = (spuId: string): string => {
  const spu = demoSPUs.find(s => s.id === spuId)
  return spu?.name || ''
}

// 获取SKU名称（用于展示）
export const getSKUName = (skuId: string): string => {
  const sku = demoSKUs.find(s => s.id === skuId)
  return sku?.name || ''
}

// 获取商品完整名称（SPU + SKU规格）
export const getProductFullName = (skuId: string): string => {
  const info = getSKUInfo(skuId)
  if (!info) return ''
  return info.sku.name
}



