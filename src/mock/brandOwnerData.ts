// 品牌负责人 Mock 数据生成器（seed 可复现，A/B 两期联动，自洽指标）
export type StageKey = 'overview' | 'coldStart' | 'scaleUp'
export type DateKey = 'current' | 'compare'
export type PlatformKey = 'douyin' | 'tmall' | 'jd'

function seededRandom(seed: number): () => number {
  let value = seed
  return () => {
    value = (value * 9301 + 49297) % 233280
    return value / 233280
  }
}

function hashSeed(input: string): number {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    const c = input.charCodeAt(i)
    hash = ((hash << 5) - hash) + c
    hash |= 0
  }
  return Math.abs(hash)
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

// 生成平台核心指标
export function genPlatformMetrics(platform: PlatformKey, stage: StageKey, dateKey: DateKey, dateA: string, dateB: string) {
  const seed = hashSeed(`brandOwner|${platform}|${stage}|${dateKey}|${dateA}|${dateB}`)
  const rnd = seededRandom(seed)
  
  const baseMultipliers = {
    douyin: { sales: 1100000, traffic: 58000, orders: 1200 },
    tmall: { sales: 800000, traffic: 48000, orders: 800 },
    jd: { sales: 600000, traffic: 33000, orders: 600 }
  }
  
  const multiplier = baseMultipliers[platform]
  const factor = 0.9 + rnd() * 0.2
  
  const sales = Math.round(multiplier.sales * factor)
  const traffic = Math.round(multiplier.traffic * factor)
  const orders = Math.round(multiplier.orders * factor)
  const exposure = Math.round(traffic * 45 * (0.8 + rnd() * 0.4))
  const clicks = Math.round(exposure * (0.03 + rnd() * 0.02))
  const cost = Math.round(sales * 0.38 * (0.8 + rnd() * 0.4))
  const ctr = clicks / Math.max(exposure, 1)
  const cpc = cost / Math.max(clicks, 1)
  const roi = sales / Math.max(cost, 1)
  const cvr = orders / Math.max(clicks, 1)
  const cart = Math.round(clicks * (0.11 + rnd() * 0.04))
  const pay = Math.round(orders * 0.91)
  
  return { sales, traffic, orders, exposure, clicks, cost, ctr, cpc, roi, cvr, cart, pay }
}

// 总览 KPI（全平台 + 分平台）
export function genOverviewKPIs(dateA: string, dateB: string) {
  const platforms: PlatformKey[] = ['douyin', 'tmall', 'jd']
  const cur = platforms.reduce((acc, p) => {
    const m = genPlatformMetrics(p, 'overview', 'current', dateA, dateB)
    return {
      sales: acc.sales + m.sales,
      traffic: acc.traffic + m.traffic,
      orders: acc.orders + m.orders,
      exposure: acc.exposure + m.exposure,
      clicks: acc.clicks + m.clicks,
      cost: acc.cost + m.cost
    }
  }, { sales: 0, traffic: 0, orders: 0, exposure: 0, clicks: 0, cost: 0 })
  
  const cmp = platforms.reduce((acc, p) => {
    const m = genPlatformMetrics(p, 'overview', 'compare', dateA, dateB)
    return {
      sales: acc.sales + m.sales,
      traffic: acc.traffic + m.traffic,
      orders: acc.orders + m.orders,
      exposure: acc.exposure + m.exposure,
      clicks: acc.clicks + m.clicks,
      cost: acc.cost + m.cost
    }
  }, { sales: 0, traffic: 0, orders: 0, exposure: 0, clicks: 0, cost: 0 })
  
  const delta = (a: number, b: number) => b > 0 ? ((a - b) / b) * 100 : 0
  const toTrend = (v: number) => v > 0.001 ? 'up' : v < -0.001 ? 'down' : 'stable'
  const toCmpText = (v: number) => `${v > 0 ? '↑' : v < 0 ? '↓' : '→'}${Math.abs(v).toFixed(1)}%`
  
  // 全平台汇总KPI
  const totalKPIs = [
    { label: '总GMV', metricKey: '总成交金额', value: cur.sales, unit: '元', trend: toTrend(delta(cur.sales, cmp.sales)), compareValue: toCmpText(delta(cur.sales, cmp.sales)) },
    { label: '总ROI', metricKey: undefined, value: cur.cost > 0 ? cur.sales / cur.cost : 0, unit: '', trend: 'stable', compareValue: '→0.0%', placeholder: true },
    { label: '总退货率', metricKey: '总退款率', value: 2.3, unit: '%', trend: 'stable', compareValue: '→0.0%' },
    { label: '总消耗', metricKey: undefined, value: cur.cost, unit: '元', trend: toTrend(delta(cur.cost, cmp.cost)), compareValue: toCmpText(delta(cur.cost, cmp.cost)), placeholder: true },
    { label: '总曝光量', metricKey: undefined, value: cur.exposure, unit: '', trend: toTrend(delta(cur.exposure, cmp.exposure)), compareValue: toCmpText(delta(cur.exposure, cmp.exposure)), placeholder: true },
    { label: '总点击量', metricKey: undefined, value: cur.clicks, unit: '', trend: toTrend(delta(cur.clicks, cmp.clicks)), compareValue: toCmpText(delta(cur.clicks, cmp.clicks)), placeholder: true },
    { label: '总CTR', metricKey: '天猫转化率', value: clamp(cur.clicks / Math.max(cur.exposure, 1) * 100, 0, 100), unit: '%', trend: toTrend(delta(cur.clicks / Math.max(cur.exposure, 1), cmp.clicks / Math.max(cmp.exposure, 1))), compareValue: toCmpText(delta(cur.clicks / Math.max(cur.exposure, 1), cmp.clicks / Math.max(cmp.exposure, 1))) },
    { label: '总CPC', metricKey: undefined, value: cur.cost / Math.max(cur.clicks, 1), unit: '元', trend: 'stable', compareValue: '→0.0%', placeholder: true },
    { label: '总CVR', metricKey: undefined, value: clamp(cur.orders / Math.max(cur.clicks, 1) * 100, 0, 100), unit: '%', trend: 'stable', compareValue: '→0.0%', placeholder: true },
    { label: '总UV', metricKey: '天猫流量', value: cur.traffic, unit: 'UV', trend: toTrend(delta(cur.traffic, cmp.traffic)), compareValue: toCmpText(delta(cur.traffic, cmp.traffic)) },
    { label: '总订单数', metricKey: '总成交订单数', value: cur.orders, unit: '单', trend: toTrend(delta(cur.orders, cmp.orders)), compareValue: toCmpText(delta(cur.orders, cmp.orders)) },
    { label: '客单价', metricKey: '客单价', value: cur.orders > 0 ? cur.sales / cur.orders : 0, unit: '元', trend: 'stable', compareValue: '→0.0%' }
  ]
  
  // 分平台KPI
  const platformKPIs = platforms.map(platform => {
    const curM = genPlatformMetrics(platform, 'overview', 'current', dateA, dateB)
    const cmpM = genPlatformMetrics(platform, 'overview', 'compare', dateA, dateB)
    const platformNames = { douyin: '抖音', tmall: '天猫', jd: '京东' }
    
    return {
      platform: platformNames[platform],
      platformKey: platform,
      kpis: [
        { label: 'GMV', metricKey: platform === 'douyin' ? '总成交金额' : platform === 'tmall' ? '天猫销售额' : '京东销售额', value: curM.sales, unit: '元', trend: toTrend(delta(curM.sales, cmpM.sales)), compareValue: toCmpText(delta(curM.sales, cmpM.sales)) },
        { label: 'UV', metricKey: platform === 'tmall' ? '天猫流量' : platform === 'jd' ? '京东流量' : undefined, value: curM.traffic, unit: 'UV', trend: toTrend(delta(curM.traffic, cmpM.traffic)), compareValue: toCmpText(delta(curM.traffic, cmpM.traffic)), placeholder: platform === 'douyin' },
        { label: '订单数', metricKey: '总成交订单数', value: curM.orders, unit: '单', trend: toTrend(delta(curM.orders, cmpM.orders)), compareValue: toCmpText(delta(curM.orders, cmpM.orders)) },
        { label: 'ROI', metricKey: undefined, value: curM.roi, unit: '', trend: toTrend(delta(curM.roi, cmpM.roi)), compareValue: toCmpText(delta(curM.roi, cmpM.roi)), placeholder: true },
        { label: 'CTR', metricKey: platform === 'tmall' ? '天猫转化率' : platform === 'jd' ? '京东转化率' : undefined, value: clamp(curM.ctr * 100, 0, 100), unit: '%', trend: toTrend(delta(curM.ctr, cmpM.ctr)), compareValue: toCmpText(delta(curM.ctr, cmpM.ctr)), placeholder: platform === 'douyin' },
        { label: 'CPC', metricKey: undefined, value: curM.cpc, unit: '元', trend: toTrend(delta(curM.cpc, cmpM.cpc)), compareValue: toCmpText(delta(curM.cpc, cmpM.cpc)), placeholder: true }
      ]
    }
  })
  
  return { totalKPIs, platformKPIs }
}

// 品牌资产/卖点词云
export function genWordCloud() {
  const words = [
    { text: '营养', weight: 85 },
    { text: '健康', weight: 78 },
    { text: '蛋白质', weight: 72 },
    { text: '口感', weight: 68 },
    { text: '孩子爱吃', weight: 65 },
    { text: '天然', weight: 62 },
    { text: '无添加', weight: 58 },
    { text: '高蛋白', weight: 55 },
    { text: '低糖', weight: 52 },
    { text: '有机', weight: 48 },
    { text: '新鲜', weight: 45 },
    { text: '美味', weight: 42 },
    { text: '优质', weight: 40 },
    { text: '安全', weight: 38 }
  ]
  
  return {
    words,
    topWords: ['营养', '健康', '蛋白质'],
    changedWords: ['低糖', '有机']
  }
}

// 结构分析数据
export function genStructureAnalysis(dateA: string, dateB: string) {
  const platforms: PlatformKey[] = ['douyin', 'tmall', 'jd']
  const cur = platforms.map(p => ({
    platform: p === 'douyin' ? '抖音' : p === 'tmall' ? '天猫' : '京东',
    platformKey: p,
    sales: genPlatformMetrics(p, 'overview', 'current', dateA, dateB).sales
  }))
  
  const totalSales = cur.reduce((sum, p) => sum + p.sales, 0)
  
  return {
    platformStructure: cur.map(p => ({
      name: p.platform,
      value: p.sales,
      percent: totalSales > 0 ? (p.sales / totalSales) * 100 : 0
    })),
    topSPUs: Array.from({ length: 10 }).map((_, i) => ({
      name: `SPU-${String(i + 1).padStart(3, '0')}`,
      value: Math.round(totalSales * (0.11 - i * 0.007))
    })),
    topChannels: [
      { name: '搜索', value: Math.round(totalSales * 0.38), percent: 38 },
      { name: '推荐', value: Math.round(totalSales * 0.34), percent: 34 },
      { name: '活动', value: Math.round(totalSales * 0.16), percent: 16 },
      { name: '内容', value: Math.round(totalSales * 0.12), percent: 12 }
    ]
  }
}

// Sankey 数据
export function genSankeyData(dateA: string, dateB: string) {
  return {
    nodes: [
      { id: 'douyin', name: '抖音' },
      { id: 'tmall', name: '天猫' },
      { id: 'jd', name: '京东' },
      { id: 'search', name: '搜索渠道' },
      { id: 'recommend', name: '推荐渠道' },
      { id: 'high-value', name: '高价值人群' },
      { id: 'new-customer', name: '新客人群' },
      { id: 'repurchase', name: '复购人群' },
      { id: 'spu1', name: 'SPU-001' },
      { id: 'spu2', name: 'SPU-002' },
      { id: 'spu3', name: 'SPU-003' }
    ],
    links: [
      { source: 'douyin', target: 'search', value: 440000 },
      { source: 'douyin', target: 'recommend', value: 380000 },
      { source: 'tmall', target: 'search', value: 320000 },
      { source: 'tmall', target: 'recommend', value: 280000 },
      { source: 'jd', target: 'search', value: 240000 },
      { source: 'jd', target: 'recommend', value: 210000 },
      { source: 'search', target: 'high-value', value: 500000 },
      { source: 'search', target: 'new-customer', value: 500000 },
      { source: 'recommend', target: 'high-value', value: 435000 },
      { source: 'recommend', target: 'new-customer', value: 435000 },
      { source: 'high-value', target: 'spu1', value: 350000 },
      { source: 'high-value', target: 'spu2', value: 300000 },
      { source: 'new-customer', target: 'spu1', value: 280000 },
      { source: 'new-customer', target: 'spu3', value: 200000 }
    ]
  }
}

// 明细表数据
export function genDetailTable(dateA: string, dateB: string, count = 20) {
  const platforms: PlatformKey[] = ['douyin', 'tmall', 'jd']
  const channels = ['搜索', '推荐', '活动', '内容']
  const rnd = seededRandom(hashSeed(`brandOwner|detailTable|${dateA}|${dateB}`))
  
  return Array.from({ length: count }).map((_, i) => {
    const platform = platforms[i % platforms.length]
    const channel = channels[i % channels.length]
    const baseM = genPlatformMetrics(platform, 'overview', 'current', dateA, dateB)
    const factor = 0.25 + rnd() * 0.35
    
    return {
      platform: platform === 'douyin' ? '抖音' : platform === 'tmall' ? '天猫' : '京东',
      channel,
      spu: `SPU-${String(i + 1).padStart(3, '0')}`,
      sales: Math.round(baseM.sales * factor),
      roi: +(baseM.roi * (0.75 + rnd() * 0.5)).toFixed(2),
      ctr: +(baseM.ctr * 100 * (0.75 + rnd() * 0.5)).toFixed(1),
      cpc: +(baseM.cpc * (0.75 + rnd() * 0.5)).toFixed(2),
      cvr: +(baseM.cvr * 100 * (0.75 + rnd() * 0.5)).toFixed(1),
      traffic: Math.round(baseM.traffic * factor),
      refundRate: +(2.0 + rnd() * 1.5).toFixed(1)
    }
  })
}

// 目标进度
export function genTargetProgress(stage: StageKey, dateA: string, dateB: string) {
  const { totalKPIs } = genOverviewKPIs(dateA, dateB)
  const gmvKPI = totalKPIs.find(k => k.label === '总GMV')
  const roiKPI = totalKPIs.find(k => k.label === '总ROI')
  const ctrKPI = totalKPIs.find(k => k.label === '总CTR')
  
  return [
    { 
      label: 'GMV目标', 
      targetKey: '总成交金额', 
      currentKey: '总成交金额', 
      target: (gmvKPI?.value || 2100000) * 1.15, 
      current: gmvKPI?.value || 2100000,
      unit: '元'
    },
    { 
      label: 'ROI目标', 
      targetKey: undefined, 
      currentKey: undefined, 
      target: 2.8, 
      current: roiKPI?.value || 2.6,
      unit: ''
    },
    { 
      label: 'CTR目标', 
      targetKey: '天猫转化率', 
      currentKey: '天猫转化率', 
      target: 4.5, 
      current: ctrKPI?.value || 4.2,
      unit: '%'
    }
  ]
}

// 漏斗数据
export function genFunnel(stage: StageKey, dateA: string, dateB: string) {
  const cur = genPlatformMetrics('douyin', stage, 'current', dateA, dateB)
  
  return [
    { label: '曝光/展现', value: cur.exposure || 9500000 },
    { label: '点击', value: cur.clicks || 380000 },
    { label: '加购', value: cur.cart || 47000 },
    { label: '下单', value: cur.orders || 38000 },
    { label: '支付/成交', value: cur.pay || 34000 }
  ]
}

// 平台漏斗数据
export function genPlatformFunnels(dateA: string, dateB: string) {
  const platforms: PlatformKey[] = ['tmall', 'jd']
  const platformNames = { douyin: '抖音', tmall: '天猫', jd: '京东' }
  
  return platforms.map(platform => {
    const m = genPlatformMetrics(platform, 'overview', 'current', dateA, dateB)
    return {
      name: platformNames[platform],
      platformKey: platform,
      steps: [
        { label: '曝光/展现', value: m.exposure },
        { label: '点击', value: m.clicks },
        { label: '加购', value: m.cart },
        { label: '下单', value: m.orders },
        { label: '支付/成交', value: m.pay }
      ]
    }
  })
}

// AI 诊断场景（6个Tab）
export function genDiagnosis(stage: StageKey, dateA: string, dateB: string) {
  const scenes = ['经营诊断', '商品诊断', '平台诊断', '渠道/载体诊断', '漏斗诊断', '人群诊断'] as const
  const metrics = ['总成交金额', '天猫销售额', '京东销售额', '总成交订单数', '客单价', '总退款率']
  
  function cards(kind: typeof scenes[number]) {
    const rnd = seededRandom(hashSeed(`brandOwner|diag|${stage}|${kind}|${dateA}|${dateB}`))
    const sev = ['high','medium','low','success'] as const
    const pick = <T,>(arr: T[]) => arr[Math.floor(rnd()*arr.length)]
    
    const templates = {
      '经营诊断': ['全平台GMV达成偏低','ROI波动需关注','预算效率待提升','退货率风险','客单价下降','转化率待优化'],
      '商品诊断': ['Top SPU表现优异','尾部SPU需优化','商品结构需调整','新品渗透不足','商品ROI差异大','商品库存风险'],
      '平台诊断': ['抖音表现优异','天猫ROI偏低','京东增长放缓','平台间差异需关注','平台预算分配不均','平台转化率差异'],
      '渠道/载体诊断': ['搜索效率待提升','推荐CPC偏高','活动ROI偏低','内容承接良好','渠道结构需优化','载体效果待验证'],
      '漏斗诊断': ['曝光到点击转化低','点击到加购转化低','加购到下单转化低','下单到支付转化低','整体漏斗效率待提升','关键环节需优化'],
      '人群诊断': ['高价值人群可扩','新客转化偏低','复购稳定','相似人群建议','人群包表现差异大','人群精准度待提升']
    }
    
    return Array.from({ length: 6 }).map((_, i) => ({
      title: pick(templates[kind]),
      severity: pick(sev),
      points: [
        `依据${dateA}与${dateB}两期对比，关键指标出现差异`,
        kind === '经营诊断' ? '建议按优先级进行优化' :
        kind === '商品诊断' ? '建议调整商品结构与预算分配' :
        kind === '平台诊断' ? '建议优化平台预算分配与策略' :
        kind === '渠道/载体诊断' ? '建议调整渠道预算，优化载体效率' :
        kind === '漏斗诊断' ? '建议针对薄弱环节优化' :
        '建议扩大高价值人群，排除低效人群'
      ],
      metrics: [pick(metrics)],
      suggestions: kind === '经营诊断' 
        ? ['优化出价降低CPC','提升CTR','倾斜预算至高ROI渠道','测试新素材']
        : kind === '商品诊断'
          ? ['提升尾部SPU效率','优化商品结构','加大新品投放','调整商品定价']
          : kind === '平台诊断'
            ? ['调整平台预算分配','优化平台策略','加强平台协同','测试新平台']
            : kind === '渠道/载体诊断'
              ? ['调整渠道预算','优化渠道出价','暂停低效渠道','测试新渠道']
              : kind === '漏斗诊断'
                ? ['优化曝光素材','提升点击率','优化加购引导','优化支付流程']
                : ['扩大高价值人群包','排除低效人群','优化人群出价','测试新人群']
    }))
  }
  
  const sceneData = scenes.map((s) => {
    const headers = ['维度', '指标', 'A期', 'B期', '建议']
    const rows = Array.from({ length: 6 }).map((_, i) => {
      const dimMap: Record<string, string[]> = {
        '经营诊断': ['GMV', 'ROI', 'CPC', 'CTR', '预算', '成本'],
        '商品诊断': ['SPU-001', 'SPU-002', 'SPU-003', 'SPU-004', 'SPU-005', 'SPU-006'],
        '平台诊断': ['抖音', '天猫', '京东', '平台差异', '预算分配', '策略优化'],
        '渠道/载体诊断': ['搜索', '推荐', '活动', '内容', '渠道A', '渠道B'],
        '漏斗诊断': ['曝光→点击', '点击→加购', '加购→下单', '下单→支付', '整体转化', '关键环节'],
        '人群诊断': ['高价值', '新客', '复购', '相似', '兴趣A', '兴趣B']
      }
      const dim = dimMap[s]?.[i] || `项-${i + 1}`
      const metric = metrics[i % metrics.length]
      const a = String(115 + i * 9)
      const b = String(125 + i * 8)
      const suggestion = ['扩大预算', '优化出价', '优化素材', '结构优化', '暂停投放', '测试新方案'][i % 6]
      return [dim, metric, a, b, suggestion]
    })

    return {
      key: s,
      label: s,
      cards: cards(s),
      table: { headers, rows },
      insights: [
        `根据${dateA}至${dateB}数据分析，${s}显示关键指标需关注`,
        `建议优先处理${cards(s)[0]?.title || '核心问题'}`,
        stage === 'scaleUp' ? `预期优化后可提升放量效率${(6 + Math.floor(Math.random() * 9))}%` : `预期优化后可提升整体效率${(6 + Math.floor(Math.random() * 9))}%`
      ]
    }
  })

  return { scenes: sceneData }
}

// 任务看板
export function genKanban(stage: StageKey, dateA: string, dateB: string) {
  const base = (d: number) => new Date(new Date(dateB).getTime() + d*24*3600*1000).toISOString().split('T')[0]
  const platforms: PlatformKey[] = ['douyin', 'tmall', 'jd']
  const platformNames = { douyin: '抖音', tmall: '天猫', jd: '京东' }
  
  return {
    todo: [
      { id: 't1', title: '品牌策略优化', assignee: '品牌负责人', deadline: base(2), relatedPlatform: platformNames[platforms[0]], relatedSPU: 'SPU-001', relatedMetric: '总成交金额' },
      { id: 't2', title: '平台预算分配', assignee: '品牌负责人', deadline: base(3), relatedPlatform: platformNames[platforms[1]], relatedSPU: 'SPU-002', relatedMetric: '天猫销售额' },
      { id: 't3', title: '商品结构调整', assignee: '品牌负责人', deadline: base(4), relatedPlatform: platformNames[platforms[2]], relatedSPU: 'SPU-003', relatedMetric: '京东销售额' }
    ],
    doing: [
      { id: 'd1', title: '品牌资产沉淀', assignee: '品牌团队', deadline: base(1), relatedPlatform: platformNames[platforms[0]], relatedSPU: 'SPU-001', relatedMetric: 'CTR' },
      { id: 'd2', title: '卖点词云优化', assignee: '品牌团队', deadline: base(2), relatedPlatform: platformNames[platforms[1]], relatedSPU: 'SPU-002', relatedMetric: '转化率' },
      { id: 'd3', title: '渠道协同', assignee: '运营团队', deadline: base(3), relatedPlatform: platformNames[platforms[2]], relatedSPU: 'SPU-003', relatedMetric: 'ROI' }
    ],
    done: [
      { id: 'f1', title: '目标设定', assignee: '品牌负责人', deadline: base(-1), relatedPlatform: '全平台', relatedSPU: 'SPU-001', relatedMetric: 'GMV' }
    ]
  }
}

// 操作记录
export function genLogs(stage: StageKey, dateA: string, dateB: string, count = 8) {
  const rnd = seededRandom(hashSeed(`brandOwner|logs|${stage}|${dateA}|${dateB}`))
  const actions = [
    '设定目标',
    '调整预算',
    '优化策略',
    '上传素材',
    '生成诊断',
    '指派任务',
    '调整出价',
    '驳回企划',
    '提交企划',
    '优化承接页'
  ]
  const operators = ['品牌负责人', '品牌A', '品牌B', '创意团队', '产品团队']
  return Array.from({ length: count }).map((_, i) => ({
    time: `${dateB} ${String(9 + (i%6)).padStart(2,'0')}:${String(Math.floor(rnd()*60)).padStart(2,'0')}`,
    action: actions[i % actions.length],
    operator: operators[i % operators.length],
    remark: i % 3 === 0 ? '操作备注信息' : undefined
  }))
}

// 企划期数据
export function genPlanningData() {
  return {
    planName: '2025 Q1品牌推广企划',
    owner: '品牌负责人',
    period: '2025-01-01 至 2025-03-31',
    targetMetric: '总成交金额',
    remark: 'Q1品牌推广重点提升GMV和品牌影响力',
    platformBudget: [
      { platform: '抖音', budget: 1200000, percent: 40 },
      { platform: '天猫', budget: 900000, percent: 30 },
      { platform: '京东', budget: 900000, percent: 30 }
    ],
    resourcePositions: [
      { name: '搜索资源位', count: 15 },
      { name: '推荐资源位', count: 12 },
      { name: '活动资源位', count: 8 }
    ],
    estimatedEffect: [
      { metric: 'GMV', target: 3000000, estimated: 2850000 },
      { metric: 'ROI', target: 2.8, estimated: 2.6 },
      { metric: 'UV', target: 150000, estimated: 142000 }
    ]
  }
}


