// 电商负责人 Mock 数据生成器（seed 可复现，A/B 两期联动，自洽指标）
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
  const seed = hashSeed(`ecommerceOwner|${platform}|${stage}|${dateKey}|${dateA}|${dateB}`)
  const rnd = seededRandom(seed)
  
  const baseMultipliers = {
    douyin: { sales: 1200000, traffic: 60000, orders: 1250 },
    tmall: { sales: 850000, traffic: 50000, orders: 850 },
    jd: { sales: 650000, traffic: 35000, orders: 650 }
  }
  
  const multiplier = baseMultipliers[platform]
  const factor = 0.9 + rnd() * 0.2 // 波动范围
  
  const sales = Math.round(multiplier.sales * factor)
  const traffic = Math.round(multiplier.traffic * factor)
  const orders = Math.round(multiplier.orders * factor)
  const exposure = Math.round(traffic * 50 * (0.8 + rnd() * 0.4))
  const clicks = Math.round(exposure * (0.035 + rnd() * 0.015))
  const cost = Math.round(sales * 0.4 * (0.8 + rnd() * 0.4))
  const ctr = clicks / Math.max(exposure, 1)
  const cpc = cost / Math.max(clicks, 1)
  const roi = sales / Math.max(cost, 1)
  const cvr = orders / Math.max(clicks, 1)
  const cart = Math.round(clicks * (0.1 + rnd() * 0.05))
  const pay = Math.round(orders * 0.92)
  
  return {
    sales, // GMV/成交额
    traffic, // UV/访客数
    orders, // 订单数
    exposure,
    clicks,
    cost,
    ctr,
    cpc,
    roi,
    cvr,
    cart,
    pay
  }
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
    { label: '总UV', metricKey: '天猫流量', value: cur.traffic, unit: 'UV', trend: toTrend(delta(cur.traffic, cmp.traffic)), compareValue: toCmpText(delta(cur.traffic, cmp.traffic)) },
    { label: '总订单数', metricKey: '总成交订单数', value: cur.orders, unit: '单', trend: toTrend(delta(cur.orders, cmp.orders)), compareValue: toCmpText(delta(cur.orders, cmp.orders)) },
    { label: '总ROI', metricKey: undefined, value: cur.cost > 0 ? cur.sales / cur.cost : 0, unit: '', trend: 'stable', compareValue: '→0.0%', placeholder: true },
    { label: '总曝光量', metricKey: undefined, value: cur.exposure, unit: '', trend: toTrend(delta(cur.exposure, cmp.exposure)), compareValue: toCmpText(delta(cur.exposure, cmp.exposure)), placeholder: true },
    { label: '总点击量', metricKey: undefined, value: cur.clicks, unit: '', trend: toTrend(delta(cur.clicks, cmp.clicks)), compareValue: toCmpText(delta(cur.clicks, cmp.clicks)), placeholder: true },
    { label: '总CTR', metricKey: '天猫转化率', value: clamp(cur.clicks / Math.max(cur.exposure, 1) * 100, 0, 100), unit: '%', trend: toTrend(delta(cur.clicks / Math.max(cur.exposure, 1), cmp.clicks / Math.max(cmp.exposure, 1))), compareValue: toCmpText(delta(cur.clicks / Math.max(cur.exposure, 1), cmp.clicks / Math.max(cmp.exposure, 1))) },
    { label: '总CPC', metricKey: undefined, value: cur.cpc || (cur.cost / Math.max(cur.clicks, 1)), unit: '元', trend: 'stable', compareValue: '→0.0%', placeholder: true },
    { label: '总消耗', metricKey: undefined, value: cur.cost, unit: '元', trend: toTrend(delta(cur.cost, cmp.cost)), compareValue: toCmpText(delta(cur.cost, cmp.cost)), placeholder: true },
    { label: '总CVR', metricKey: undefined, value: clamp(cur.orders / Math.max(cur.clicks, 1) * 100, 0, 100), unit: '%', trend: 'stable', compareValue: '→0.0%', placeholder: true },
    { label: '客单价', metricKey: '客单价', value: cur.orders > 0 ? cur.sales / cur.orders : 0, unit: '元', trend: 'stable', compareValue: '→0.0%' },
    { label: '总退款率', metricKey: '总退款率', value: 2.5, unit: '%', trend: 'stable', compareValue: '→0.0%' }
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

// 趋势小图数据（指标 × 平台）
export function genTrendCharts(dateA: string, dateB: string) {
  const platforms: PlatformKey[] = ['douyin', 'tmall', 'jd']
  const metrics = ['sales', 'traffic', 'orders', 'ctr', 'roi']
  const metricLabels = { sales: 'GMV', traffic: 'UV', orders: '订单数', ctr: 'CTR', roi: 'ROI' }
  
  return platforms.flatMap(platform => {
    const curM = genPlatformMetrics(platform, 'overview', 'current', dateA, dateB)
    const cmpM = genPlatformMetrics(platform, 'overview', 'compare', dateA, dateB)
    const platformNames = { douyin: '抖音', tmall: '天猫', jd: '京东' }
    
    return metrics.map(metric => ({
      platform: platformNames[platform],
      metric: metricLabels[metric as keyof typeof metricLabels],
      data: [
        { date: dateA, value: cmpM[metric as keyof typeof cmpM] as number },
        { date: dateB, value: curM[metric as keyof typeof curM] as number }
      ],
      trend: (curM[metric as keyof typeof curM] as number) > (cmpM[metric as keyof typeof cmpM] as number) ? 'up' : 'down'
    }))
  })
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
    channelStructure: [
      { name: '搜索', value: Math.round(totalSales * 0.4), percent: 40 },
      { name: '推荐', value: Math.round(totalSales * 0.35), percent: 35 },
      { name: '活动', value: Math.round(totalSales * 0.15), percent: 15 },
      { name: '内容', value: Math.round(totalSales * 0.1), percent: 10 }
    ],
    topSPUs: Array.from({ length: 10 }).map((_, i) => ({
      name: `SPU-${String(i + 1).padStart(3, '0')}`,
      value: Math.round(totalSales * (0.12 - i * 0.008))
    }))
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
      { id: 'repurchase', name: '复购人群' }
    ],
    links: [
      { source: 'douyin', target: 'search', value: 480000 },
      { source: 'douyin', target: 'recommend', value: 420000 },
      { source: 'tmall', target: 'search', value: 340000 },
      { source: 'tmall', target: 'recommend', value: 300000 },
      { source: 'jd', target: 'search', value: 260000 },
      { source: 'jd', target: 'recommend', value: 230000 },
      { source: 'search', target: 'high-value', value: 540000 },
      { source: 'search', target: 'new-customer', value: 540000 },
      { source: 'recommend', target: 'high-value', value: 475000 },
      { source: 'recommend', target: 'new-customer', value: 475000 }
    ]
  }
}

// 明细表数据
export function genDetailTable(dateA: string, dateB: string, count = 20) {
  const platforms: PlatformKey[] = ['douyin', 'tmall', 'jd']
  const channels = ['搜索', '推荐', '活动', '内容']
  const rnd = seededRandom(hashSeed(`ecommerceOwner|detailTable|${dateA}|${dateB}`))
  
  return Array.from({ length: count }).map((_, i) => {
    const platform = platforms[i % platforms.length]
    const channel = channels[i % channels.length]
    const baseM = genPlatformMetrics(platform, 'overview', 'current', dateA, dateB)
    const factor = 0.3 + rnd() * 0.4
    
    return {
      platform: platform === 'douyin' ? '抖音' : platform === 'tmall' ? '天猫' : '京东',
      channel,
      spu: `SPU-${String(i + 1).padStart(3, '0')}`,
      sales: Math.round(baseM.sales * factor),
      roi: +(baseM.roi * (0.8 + rnd() * 0.4)).toFixed(2),
      ctr: +(baseM.ctr * 100 * (0.8 + rnd() * 0.4)).toFixed(1),
      cpc: +(baseM.cpc * (0.8 + rnd() * 0.4)).toFixed(2),
      cvr: +(baseM.cvr * 100 * (0.8 + rnd() * 0.4)).toFixed(1),
      traffic: Math.round(baseM.traffic * factor)
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
      target: (gmvKPI?.value || 2000000) * 1.2, 
      current: gmvKPI?.value || 2000000,
      unit: '元'
    },
    { 
      label: 'ROI目标', 
      targetKey: undefined, 
      currentKey: undefined, 
      target: 3.0, 
      current: roiKPI?.value || 2.5,
      unit: ''
    },
    { 
      label: 'CTR目标', 
      targetKey: '天猫转化率', 
      currentKey: '天猫转化率', 
      target: 5.0, 
      current: ctrKPI?.value || 4.0,
      unit: '%'
    }
  ]
}

// 漏斗数据
export function genFunnel(stage: StageKey, dateA: string, dateB: string) {
  const { totalKPIs } = genOverviewKPIs(dateA, dateB)
  const cur = genPlatformMetrics('douyin', stage, 'current', dateA, dateB)
  
  return [
    { label: '曝光/展现', value: cur.exposure || 10000000 },
    { label: '点击', value: cur.clicks || 400000 },
    { label: '加购', value: cur.cart || 50000 },
    { label: '下单', value: cur.orders || 40000 },
    { label: '支付/成交', value: cur.pay || 36000 }
  ]
}

// AI 诊断场景（6个Tab）
export function genDiagnosis(stage: StageKey, dateA: string, dateB: string) {
  const scenes = ['经营诊断', '商品诊断', '平台诊断', '渠道/载体诊断', '漏斗诊断', '人群诊断'] as const
  const metrics = ['总成交金额', '天猫销售额', '京东销售额', '总成交订单数', '客单价', '总退款率']
  
  function cards(kind: typeof scenes[number]) {
    const rnd = seededRandom(hashSeed(`ecommerceOwner|diag|${stage}|${kind}|${dateA}|${dateB}`))
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
      const a = String(120 + i * 8)
      const b = String(130 + i * 7)
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
        stage === 'scaleUp' ? `预期优化后可提升放量效率${(5 + Math.floor(Math.random() * 10))}%` : `预期优化后可提升整体效率${(5 + Math.floor(Math.random() * 10))}%`
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
      { id: 't1', title: '预算校准', assignee: '电商负责人', deadline: base(2), relatedPlatform: platformNames[platforms[0]], relatedSPU: 'SPU-001', relatedMetric: '总成交金额' },
      { id: 't2', title: '平台策略优化', assignee: '电商负责人', deadline: base(3), relatedPlatform: platformNames[platforms[1]], relatedSPU: 'SPU-002', relatedMetric: '天猫销售额' },
      { id: 't3', title: '渠道结构调整', assignee: '运营团队', deadline: base(4), relatedPlatform: platformNames[platforms[2]], relatedSPU: 'SPU-003', relatedMetric: '京东销售额' }
    ],
    doing: [
      { id: 'd1', title: '素材测试', assignee: '创意团队', deadline: base(1), relatedPlatform: platformNames[platforms[0]], relatedSPU: 'SPU-001', relatedMetric: 'CTR' },
      { id: 'd2', title: '商品优化', assignee: '产品团队', deadline: base(2), relatedPlatform: platformNames[platforms[1]], relatedSPU: 'SPU-002', relatedMetric: '转化率' },
      { id: 'd3', title: '平台协同', assignee: '运营团队', deadline: base(3), relatedPlatform: platformNames[platforms[2]], relatedSPU: 'SPU-003', relatedMetric: 'ROI' }
    ],
    done: [
      { id: 'f1', title: '目标设定', assignee: '电商负责人', deadline: base(-1), relatedPlatform: '全平台', relatedSPU: 'SPU-001', relatedMetric: 'GMV' }
    ]
  }
}

// 操作记录
export function genLogs(stage: StageKey, dateA: string, dateB: string, count = 8) {
  const rnd = seededRandom(hashSeed(`ecommerceOwner|logs|${stage}|${dateA}|${dateB}`))
  const actions = [
    '设定目标',
    '调整预算',
    '优化策略',
    '上传素材',
    '生成诊断',
    '指派任务',
    '调整出价',
    '新增人群包',
    '下线低效渠道',
    '优化承接页'
  ]
  const operators = ['电商负责人', '运营A', '运营B', '创意团队', '产品团队']
  return Array.from({ length: count }).map((_, i) => ({
    time: `${dateB} ${String(9 + (i%6)).padStart(2,'0')}:${String(Math.floor(rnd()*60)).padStart(2,'0')}`,
    action: actions[i % actions.length],
    operator: operators[i % operators.length]
  }))
}

