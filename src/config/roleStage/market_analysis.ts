// 市场分析角色阶段配置
// 所有指标字段必须来自现有 mockData/metrics，不能新增字段

export type MarketAnalysisSectionType = 
  | 'kpi-cards'           // KPI卡片组
  | 'platform-breakdown'  // 平台拆分表格
  | 'funnel'              // 关键漏斗
  | 'word-cloud'          // 词云
  | 'structure-chart'     // 结构占比（圆环/进度条）
  | 'trend-bar-charts'    // 趋势柱状图
  | 'target-progress'     // 目标与进度
  | 'ai-insight'          // AI洞察
  | 'metric-cards'        // 关键指标卡矩阵
  | 'trend-line-charts'   // 趋势折线图
  | 'sankey-flow'         // Sankey/路径图
  | 'platform-funnels'    // 平台漏斗组
  | 'action-suggestions'  // 行动建议
  | 'data-notes'          // 数据说明

export interface KPICardConfig {
  type: 'kpi-cards'
  title?: string
  cards: Array<{
    label: string
    metricKey: string
    fallbackMetricKey?: string
    unit?: string
    aggregate?: boolean
    trend?: 'up' | 'down' | 'stable'
  }>
}

export interface PlatformBreakdownConfig {
  type: 'platform-breakdown'
  title?: string
  platforms: Array<{
    name: string
    platformKey: string
    metrics: Array<{
      label: string
      metricKey: string
      fallbackMetricKey?: string
      unit?: string
    }>
  }>
}

export interface FunnelConfig {
  type: 'funnel'
  title?: string
  steps: Array<{
    label: string
    value: number | null
  }>
}

export interface WordCloudConfig {
  type: 'word-cloud'
  title?: string
  words: Array<{ word: string; weight: number }>
}

export interface StructureChartConfig {
  type: 'structure-chart'
  title?: string
  charts: Array<{
    label: string
    data: Array<{ name: string; value: number }>
  }>
}

export interface TrendBarChartsConfig {
  type: 'trend-bar-charts'
  title?: string
  charts: Array<{
    label: string
    data: Array<{ name: string; value: number }>
  }>
}

export interface TargetProgressConfig {
  type: 'target-progress'
  title?: string
  metrics: Array<{
    label: string
    targetKey: string
    currentKey: string
  }>
}

export interface AIInsightConfig {
  type: 'ai-insight'
  title?: string
  insights: string[]
}

export interface MetricCardsConfig {
  type: 'metric-cards'
  title?: string
  cards: Array<{
    label: string
    metricKey: string
    fallbackMetricKey?: string
    unit?: string
    aggregate?: boolean
  }>
}

export interface TrendLineChartsConfig {
  type: 'trend-line-charts'
  title?: string
  charts: Array<{
    label: string
    metricKey: string
    data: Array<{ date: string; value: number }>
  }>
}

export interface SankeyFlowConfig {
  type: 'sankey-flow'
  title?: string
  nodes: Array<{ name: string }>
  links: Array<{ source: number; target: number; value: number }>
}

export interface PlatformFunnelsConfig {
  type: 'platform-funnels'
  title?: string
  funnels: Array<{
    platform: string
    steps: Array<{ label: string; value: number }>
  }>
}

export interface ActionSuggestionsConfig {
  type: 'action-suggestions'
  title?: string
  items: Array<{
    title: string
    description: string
    tag?: string
  }>
}

export interface DataNotesConfig {
  type: 'data-notes'
  title?: string
  notes: string[]
}

export type MarketAnalysisStageSectionConfig = 
  | KPICardConfig
  | PlatformBreakdownConfig
  | FunnelConfig
  | WordCloudConfig
  | StructureChartConfig
  | TrendBarChartsConfig
  | TargetProgressConfig
  | AIInsightConfig
  | MetricCardsConfig
  | TrendLineChartsConfig
  | SankeyFlowConfig
  | PlatformFunnelsConfig
  | ActionSuggestionsConfig
  | DataNotesConfig

export interface MarketAnalysisStageConfig {
  sections: MarketAnalysisStageSectionConfig[]
}

// Mock数据：词云
const mockMarketWords = [
  { word: '健康', weight: 90 },
  { word: '营养', weight: 85 },
  { word: '便捷', weight: 80 },
  { word: '性价比', weight: 75 },
  { word: '品质', weight: 70 },
  { word: '创新', weight: 65 },
  { word: '安全', weight: 60 },
  { word: '时尚', weight: 55 },
  { word: '环保', weight: 50 },
  { word: '科技', weight: 45 }
]

// Mock数据：结构占比
const mockCategoryStructure = [
  { name: '电子产品', value: 35 },
  { name: '食品饮料', value: 28 },
  { name: '美妆个护', value: 22 },
  { name: '服装配饰', value: 15 }
]

const mockChannelStructure = [
  { name: '抖音', value: 45 },
  { name: '天猫', value: 30 },
  { name: '京东', value: 25 }
]

// Mock数据：趋势数据
const mockTrendData = [
  { date: '2024-01-01', value: 100000 },
  { date: '2024-01-08', value: 120000 },
  { date: '2024-01-15', value: 150000 },
  { date: '2024-01-22', value: 140000 },
  { date: '2024-01-29', value: 160000 }
]

// Mock数据：Sankey节点和链接
const mockSankeyNodes = [
  { name: '人群A' },
  { name: '人群B' },
  { name: '人群C' },
  { name: '抖音' },
  { name: '天猫' },
  { name: '京东' },
  { name: '品类X' },
  { name: '品类Y' },
  { name: '品类Z' }
]
const mockSankeyLinks = [
  { source: 0, target: 3, value: 500 },
  { source: 1, target: 4, value: 300 },
  { source: 2, target: 5, value: 200 },
  { source: 3, target: 6, value: 400 },
  { source: 4, target: 7, value: 250 },
  { source: 5, target: 8, value: 150 }
]

export const marketAnalysisStageConfig = {
  overview: {
    sections: [
      {
        type: 'kpi-cards',
        title: '核心经营总览',
        cards: [
          { label: '总GMV', metricKey: '总成交金额', aggregate: true, unit: '元', trend: 'up' },
          { label: '总ROI', metricKey: '佣金', fallbackMetricKey: '总成交金额', unit: '', trend: 'stable' },
          { label: '总成交金额', metricKey: '总成交金额', aggregate: true, unit: '元', trend: 'up' },
          { label: '总订单数', metricKey: '总成交订单数', aggregate: true, unit: '单', trend: 'up' },
          { label: '退货率', metricKey: '总退款率', unit: '%', trend: 'down' },
          { label: '客单价', metricKey: '客单价', unit: '元', trend: 'stable' }
        ]
      } as KPICardConfig,
      {
        type: 'platform-breakdown',
        title: '平台拆分',
        platforms: [
          {
            name: '抖音',
            platformKey: 'douyin',
            metrics: [
              { label: 'GMV', metricKey: 'douyin-total-sales', unit: '元' },
              { label: '订单数', metricKey: 'douyin-total-orders', unit: '单' },
              { label: '退货率', metricKey: 'douyin-refund-rate', unit: '%' }
            ]
          },
          {
            name: '天猫',
            platformKey: 'tmall',
            metrics: [
              { label: 'GMV', metricKey: 'tmall-sales', unit: '元' },
              { label: '订单数', metricKey: 'tmall-traffic', fallbackMetricKey: 'douyin-total-orders', unit: '单' },
              { label: '退货率', metricKey: 'tmall-conversion', fallbackMetricKey: '总退款率', unit: '%' }
            ]
          },
          {
            name: '京东',
            platformKey: 'jd',
            metrics: [
              { label: 'GMV', metricKey: 'jd-sales', unit: '元' },
              { label: '订单数', metricKey: 'jd-traffic', fallbackMetricKey: 'douyin-total-orders', unit: '单' },
              { label: '退货率', metricKey: 'jd-conversion', fallbackMetricKey: '总退款率', unit: '%' }
            ]
          }
        ]
      } as PlatformBreakdownConfig,
      {
        type: 'funnel',
        title: '关键漏斗',
        steps: [
          { label: '曝光', value: 10000 },
          { label: '点击', value: 5000 },
          { label: '下单/支付', value: 2000 },
          { label: '退货', value: 200 }
        ]
      } as FunnelConfig,
      {
        type: 'word-cloud',
        title: '市场机会词云',
        words: mockMarketWords
      } as WordCloudConfig,
      {
        type: 'structure-chart',
        title: '结构占比',
        charts: [
          { label: '品类占比', data: mockCategoryStructure },
          { label: '渠道占比', data: mockChannelStructure }
        ]
      } as StructureChartConfig,
      {
        type: 'trend-bar-charts',
        title: '趋势分析',
        charts: [
          { label: '增长率', data: [{ name: '1月', value: 15 }, { name: '2月', value: 20 }, { name: '3月', value: 18 }] },
          { label: '规模', data: [{ name: '1月', value: 100 }, { name: '2月', value: 120 }, { name: '3月', value: 140 }] }
        ]
      } as TrendBarChartsConfig
    ]
  } as MarketAnalysisStageConfig,

  coldStart: {
    sections: [
      {
        type: 'target-progress',
        title: '冷启动阶段目标与进度',
        metrics: [
          { label: '总成交金额', targetKey: '总成交金额', currentKey: '总成交金额' },
          { label: '总成交订单数', targetKey: '总成交订单数', currentKey: '总成交订单数' },
          { label: '客单价', targetKey: '客单价', currentKey: '客单价' }
        ]
      } as TargetProgressConfig,
      {
        type: 'ai-insight',
        title: 'AI洞察',
        insights: [
          '本阶段关键动作：建议加大推广力度，扩大市场份额',
          '风险提示：退款率需要持续监控，建议分析退货原因',
          '建议：优化产品页面和详情描述，提升转化率'
        ]
      } as AIInsightConfig,
      {
        type: 'metric-cards',
        title: '关键指标',
        cards: [
          { label: 'GMV', metricKey: '总成交金额', aggregate: true, unit: '元' },
          { label: 'ROI', metricKey: '佣金', fallbackMetricKey: '总成交金额', unit: '' },
          { label: '退货率', metricKey: '总退款率', unit: '%' },
          { label: '转化率', metricKey: 'tmall-conversion', fallbackMetricKey: 'jd-conversion', unit: '%' },
          { label: '客单价', metricKey: '客单价', unit: '元' },
          { label: '订单数', metricKey: '总成交订单数', aggregate: true, unit: '单' }
        ]
      } as MetricCardsConfig,
      {
        type: 'trend-line-charts',
        title: '关键指标趋势',
        charts: [
          { label: 'GMV趋势', metricKey: '总成交金额', data: mockTrendData },
          { label: 'ROI趋势', metricKey: '佣金', data: mockTrendData.map(d => ({ ...d, value: d.value * 0.1 })) }
        ]
      } as TrendLineChartsConfig,
      {
        type: 'structure-chart',
        title: '平台占比',
        charts: [
          { label: '平台占比', data: mockChannelStructure }
        ]
      } as StructureChartConfig,
      {
        type: 'trend-bar-charts',
        title: '对比分析',
        charts: [
          { label: '分渠道对比', data: [{ name: '抖音', value: 500 }, { name: '天猫', value: 300 }, { name: '京东', value: 200 }] },
          { label: '分品类对比', data: [{ name: '电子产品', value: 400 }, { name: '食品饮料', value: 300 }, { name: '美妆个护', value: 300 }] }
        ]
      } as TrendBarChartsConfig,
      {
        type: 'action-suggestions',
        title: '问题清单/机会清单',
        items: [
          { title: '转化率优化', description: '当前转化率较目标存在一定差距，建议优化产品页面', tag: '高优先级' },
          { title: '推广策略', description: '建议加大推广力度，扩大市场份额', tag: '中优先级' },
          { title: '用户反馈', description: '用户评价整体积极，建议收集并分析用户评价', tag: '低优先级' },
          { title: '价格策略', description: '建议分析竞品价格，优化定价策略', tag: '中优先级' },
          { title: '库存管理', description: '当前库存充足，可支持持续销售', tag: '低优先级' },
          { title: '产品体验', description: '建议优化产品体验，提升用户满意度', tag: '高优先级' }
        ]
      } as ActionSuggestionsConfig
    ]
  } as MarketAnalysisStageConfig,

  scaleUp: {
    sections: [
      {
        type: 'kpi-cards',
        title: '核心经营总览',
        cards: [
          { label: '总GMV', metricKey: '总成交金额', aggregate: true, unit: '元', trend: 'up' },
          { label: '总ROI', metricKey: '佣金', fallbackMetricKey: '总成交金额', unit: '', trend: 'stable' },
          { label: '退货率', metricKey: '总退款率', unit: '%', trend: 'down' },
          { label: '总订单数', metricKey: '总成交订单数', aggregate: true, unit: '单', trend: 'up' },
          { label: '客单价', metricKey: '客单价', unit: '元', trend: 'stable' }
        ]
      } as KPICardConfig,
      {
        type: 'target-progress',
        title: '放量期目标节奏/达成进度',
        metrics: [
          { label: '总成交金额', targetKey: '总成交金额', currentKey: '总成交金额' },
          { label: '总成交订单数', targetKey: '总成交订单数', currentKey: '总成交订单数' }
        ]
      } as TargetProgressConfig,
      {
        type: 'metric-cards',
        title: '关键指标',
        cards: [
          { label: 'GMV', metricKey: '总成交金额', aggregate: true, unit: '元' },
          { label: 'ROI', metricKey: '佣金', fallbackMetricKey: '总成交金额', unit: '' },
          { label: '退货率', metricKey: '总退款率', unit: '%' },
          { label: '转化率', metricKey: 'tmall-conversion', fallbackMetricKey: 'jd-conversion', unit: '%' },
          { label: '客单价', metricKey: '客单价', unit: '元' },
          { label: '订单数', metricKey: '总成交订单数', aggregate: true, unit: '单' },
          { label: '支付率', metricKey: 'douyin-total-orders', fallbackMetricKey: '总成交订单数', unit: '%' },
          { label: '复购率', metricKey: 'douyin-total-orders', fallbackMetricKey: '总成交订单数', unit: '%' }
        ]
      } as MetricCardsConfig,
      {
        type: 'word-cloud',
        title: '市场机会词云',
        words: mockMarketWords
      } as WordCloudConfig,
      {
        type: 'sankey-flow',
        title: '人群-渠道-品类流向',
        nodes: mockSankeyNodes,
        links: mockSankeyLinks
      } as SankeyFlowConfig,
      {
        type: 'platform-funnels',
        title: '平台漏斗',
        funnels: [
          {
            platform: '抖音',
            steps: [
              { label: '曝光', value: 5000 },
              { label: '点击', value: 2500 },
              { label: '下单', value: 1000 },
              { label: '支付', value: 900 }
            ]
          },
          {
            platform: '天猫',
            steps: [
              { label: '曝光', value: 3000 },
              { label: '点击', value: 1500 },
              { label: '下单', value: 600 },
              { label: '支付', value: 540 }
            ]
          },
          {
            platform: '京东',
            steps: [
              { label: '曝光', value: 2000 },
              { label: '点击', value: 1000 },
              { label: '下单', value: 400 },
              { label: '支付', value: 360 }
            ]
          }
        ]
      } as PlatformFunnelsConfig,
      {
        type: 'action-suggestions',
        title: '行动建议',
        items: [
          { title: '扩大生产规模', description: '放量期表现优异，建议扩大生产规模', tag: '高优先级' },
          { title: '优化产品页面', description: '当前转化率保持稳定，建议继续优化产品页面', tag: '中优先级' },
          { title: '收集用户评价', description: '用户反馈整体积极，建议收集并分析用户评价', tag: '低优先级' },
          { title: '加大推广力度', description: '建议加大推广力度，进一步提升市场份额', tag: '高优先级' },
          { title: '价格策略优化', description: '建议分析竞品价格，优化定价策略', tag: '中优先级' }
        ]
      } as ActionSuggestionsConfig,
      {
        type: 'data-notes',
        title: '数据说明',
        notes: [
          '数据来源：基于现有看板商品/产品的 mock 数据衍生',
          '口径说明：GMV为总成交金额，ROI为佣金占比，退货率为总退款率',
          '备注：京东平台无地域数据，相关地域列显示为"—"'
        ]
      } as DataNotesConfig
    ]
  } as MarketAnalysisStageConfig
}

