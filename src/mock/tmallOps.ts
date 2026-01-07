// 天猫运营 Mock 生成器（seed 可复现，A/B 两期联动，自洽指标）
export type StageKey = 'overview' | 'coldStart' | 'scaleUp'
export type DateKey = 'current' | 'compare'

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

// 生成核心指标（自洽：CTR=点击/曝光，CPC=消耗/点击，ROI=GMV/消耗，CPA=消耗/订单）
export function genMetricsBundle(stage: StageKey, dateKey: DateKey, dateA: string, dateB: string) {
  const seed = hashSeed(`tmallOps|${stage}|${dateKey}|${dateA}|${dateB}`)
  const rnd = seededRandom(seed)
  const exposure = Math.round(8_000_000 + 5_000_000 * rnd()) // 曝光量
  const click = Math.round(exposure * (0.035 + 0.015 * rnd())) // 点击量
  const uv = Math.round(click * (0.65 + 0.2 * rnd())) // 进店UV
  const cost = Math.round(250_000 + 200_000 * rnd()) // 消耗
  const gmv = Math.round(cost * (2.5 + 1.5 * rnd())) // GMV（天猫销售额）
  const ctr = exposure > 0 ? click / exposure : 0
  const cpc = click > 0 ? cost / click : 0
  const roi = cost > 0 ? gmv / cost : 0
  const cart = Math.round(uv * (0.12 + 0.05 * rnd())) // 加购人数
  const collect = Math.round(uv * (0.08 + 0.04 * rnd())) // 收藏人数
  const order = Math.round(cart * (0.8 + 0.1 * rnd())) // 下单数
  const pay = Math.round(order * (0.92 + 0.05 * rnd())) // 支付数
  const cvr = click > 0 ? (pay / click) : 0
  const cpa = order > 0 ? cost / order : 0
  const cpo = order > 0 ? cost / order : 0 // 下单CPO
  const cartRate = uv > 0 ? cart / uv : 0
  const collectRate = uv > 0 ? collect / uv : 0
  return { 
    exposure, click, uv, cost, gmv, ctr, cpc, roi, 
    cart, collect, order, pay, cvr, cpa, cpo, cartRate, collectRate 
  }
}

// 总览 KPI（严格映射指标池，无法映射的用占位）
export function genOverviewKPIs(dateA: string, dateB: string) {
  const cur = genMetricsBundle('overview', 'current', dateA, dateB)
  const cmp = genMetricsBundle('overview', 'compare', dateA, dateB)
  function delta(a: number, b: number) {
    if (b === 0) return 0
    return ((a - b) / b) * 100
  }
  const diff = {
    exposure: delta(cur.exposure, cmp.exposure),
    click: delta(cur.click, cmp.click),
    ctr: delta(cur.ctr, cmp.ctr),
    cpc: delta(cur.cpc, cmp.cpc),
    gmv: delta(cur.gmv, cmp.gmv),
    cpa: delta(cur.cpa, cmp.cpa),
    cpo: delta(cur.cpo, cmp.cpo),
    cartRate: delta(cur.cartRate, cmp.cartRate),
    collectRate: delta(cur.collectRate, cmp.collectRate)
  }
  const toTrend = (v: number) => v > 0.001 ? 'up' : v < -0.001 ? 'down' : 'stable'
  const toCmpText = (v: number) => `${v > 0 ? '↑' : v < 0 ? '↓' : '→'}${Math.abs(v).toFixed(1)}%`

  // 指标池映射：'天猫销售额'(GMV), '天猫转化率'(CTR), '天猫流量'(UV) 等
  return [
    { label: '曝光量', metricKey: undefined, value: cur.exposure, unit: '', trend: toTrend(diff.exposure), compareValue: toCmpText(diff.exposure), placeholder: true },
    { label: '点击', metricKey: undefined, value: cur.click, unit: '', trend: toTrend(diff.click), compareValue: toCmpText(diff.click), placeholder: true },
    { label: 'CTR', metricKey: '天猫转化率', value: clamp(cur.ctr * 100, 0, 100), unit: '%', trend: toTrend(diff.ctr), compareValue: toCmpText(diff.ctr) },
    { label: 'CPC', metricKey: undefined, value: cur.cpc, unit: '元', trend: toTrend(diff.cpc), compareValue: toCmpText(diff.cpc), placeholder: true },
    { label: 'GMV', metricKey: '天猫销售额', value: cur.gmv, unit: '元', trend: toTrend(diff.gmv), compareValue: toCmpText(diff.gmv) },
    { label: 'CPA', metricKey: undefined, value: cur.cpa, unit: '元', trend: toTrend(diff.cpa), compareValue: toCmpText(diff.cpa), placeholder: true },
    { label: '下单CPO', metricKey: undefined, value: cur.cpo, unit: '元', trend: toTrend(diff.cpo), compareValue: toCmpText(diff.cpo), placeholder: true },
    { label: '加购率', metricKey: undefined, value: clamp(cur.cartRate * 100, 0, 100), unit: '%', trend: toTrend(diff.cartRate), compareValue: toCmpText(diff.cartRate), placeholder: true },
    { label: '收藏率', metricKey: undefined, value: clamp(cur.collectRate * 100, 0, 100), unit: '%', trend: toTrend(diff.collectRate), compareValue: toCmpText(diff.collectRate), placeholder: true }
  ]
}

// 渠道贡献表
export function genChannels(stage: StageKey, dateA: string, dateB: string) {
  const names = ['搜索', '推荐', '活动', '内容', '万相台-推荐', '万相台-搜索']
  const cur = genMetricsBundle(stage, 'current', dateA, dateB)
  const rows = names.map((channel, i) => {
    const factor = 1 - i * 0.08
    const exposure = Math.round(cur.exposure * factor * 0.18)
    const click = Math.round(exposure * (cur.ctr))
    const cost = Math.round(cur.cpc * Math.max(click, 1))
    const gmv = Math.round(cost * cur.roi * (0.75 + 0.5 * (1 - factor)))
    return {
      channel,
      exposure,
      clicks: click,
      ctr: clamp((click / Math.max(exposure, 1)) * 100, 0, 100),
      cpc: clamp(cost / Math.max(click, 1), 0, 999),
      gmv,
      roi: clamp(gmv / Math.max(cost, 1), 0, 99)
    }
  })
  return rows
}

// 计划维度明细表
export function genPlans(stage: StageKey, dateA: string, dateB: string, count = 20) {
  const rnd = seededRandom(hashSeed(`tmallOps|plans|${stage}|${dateA}|${dateB}`))
  return Array.from({ length: count }).map((_, i) => {
    const cost = Math.round(15_000 + 20_000 * rnd())
    const roi = +(2.2 + 2.0 * rnd()).toFixed(2)
    const gmv = Math.round(cost * roi)
    const clicks = Math.round(10_000 + 8_000 * rnd())
    const exposure = Math.round(clicks / (0.04 + 0.02 * rnd()))
    const ctr = +(clicks / Math.max(exposure, 1) * 100).toFixed(1)
    const cpc = +(cost / Math.max(clicks, 1)).toFixed(2)
    const cvr = +(3.2 + 2.5 * rnd()).toFixed(1)
    const suggestion = ['扩大预算', '优化出价', '优化素材', '结构优化', '暂停投放'][i % 5]
    return {
      planId: `PLAN${String(i + 1).padStart(4, '0')}`,
      planName: `计划-${String.fromCharCode(65 + (i % 26))}${i + 1}`,
      cost, gmv, roi, ctr, cpc, cvr, suggestion
    }
  })
}

// 漏斗图
export function genFunnel(stage: StageKey, dateA: string, dateB: string) {
  const m = genMetricsBundle(stage, 'current', dateA, dateB)
  return [
    { label: '曝光/展现', value: m.exposure },
    { label: '点击', value: m.click },
    { label: '加购', value: m.cart },
    { label: '收藏', value: m.collect },
    { label: '支付/成交', value: m.pay }
  ]
}

// 诊断排行（人群/关键词）
export function genRank(stage: StageKey, dateA: string, dateB: string, title: 'audience' | 'keyword' | 'channel') {
  const rnd = seededRandom(hashSeed(`tmallOps|rank|${stage}|${dateA}|${dateB}|${title}`))
  const names = title === 'audience'
    ? ['高价值人群', '新客人群', '复购人群', '高购次人群', '高客单人群', '价格敏感人群', '兴趣A人群', '兴趣B人群', '地域C人群', '地域D人群']
    : title === 'keyword'
      ? ['关键词A', '关键词B', '关键词C', '关键词D', '关键词E', '关键词F', '关键词G', '关键词H', '关键词I', '关键词J']
      : ['搜索渠道', '推荐渠道', '活动渠道', '内容渠道', '万相台推荐', '万相台搜索']
  return names.map((name, i) => ({
    name,
    value: Math.round(85 - i * 4 + rnd() * 10),
    unit: title === 'keyword' ? '%' : ''
  }))
}

// 目标进度
export function genTargetProgress(dateA: string, dateB: string) {
  const cur = genMetricsBundle('coldStart', 'current', dateA, dateB)
  return [
    { label: 'GMV目标完成度', targetKey: '总成交金额', currentKey: '总成交金额', target: 1000000, current: cur.gmv, unit: '元' },
    { label: 'ROI完成度', targetKey: '总成交金额', currentKey: '总成交金额', target: 3.0, current: cur.roi, unit: '' },
    { label: '曝光完成度', targetKey: undefined, currentKey: undefined, target: 10000000, current: cur.exposure, unit: '' }
  ]
}

// AI 诊断场景（8个Tab：经营、渠道、计划、漏斗、人群、关键词、创意、承接）
export function genDiagnosis(stage: StageKey, dateA: string, dateB: string) {
  const scenes = ['经营诊断', '渠道诊断', '计划诊断', '漏斗诊断', '人群诊断', '关键词诊断', '创意诊断', '承接诊断'] as const
  const metrics = ['天猫销售额', '天猫转化率', '天猫流量', '总成交金额'] // 仅引用存在的指标名
  
  function cards(kind: typeof scenes[number]) {
    const rnd = seededRandom(hashSeed(`tmallOps|diag|${stage}|${kind}|${dateA}|${dateB}`))
    const sev = ['high','medium','low','success'] as const
    const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rnd()*arr.length)]
    
    const templates = {
      '经营诊断': ['GMV达成偏低','ROI波动需关注','预算效率待提升','退货率风险','客单价下降','转化率待优化'],
      '渠道诊断': ['搜索效率待提升','推荐CPC偏高','活动ROI偏低','内容承接良好','万相台效果待验证','渠道结构需优化'],
      '计划诊断': ['Top计划表现优异','低效计划需暂停','计划预算分配不均','计划ROI差异大','计划CPC偏高','计划承接待优化'],
      '漏斗诊断': ['曝光到点击转化低','点击到加购转化低','加购到收藏转化低','收藏到支付转化低','整体漏斗效率待提升','关键环节需优化'],
      '人群诊断': ['高价值人群可扩','新客转化偏低','复购稳定','相似人群建议','人群包表现差异大','人群精准度待提升'],
      '关键词诊断': ['高潜词可扩','低效词需否','CTR下降词优化','新增词测试','关键词出价偏高','关键词覆盖不足'],
      '创意诊断': ['素材点击率偏低','创意疲劳需更新','素材表现差异大','新素材测试建议','创意与人群匹配度待提升','素材风格需优化'],
      '承接诊断': ['落地页跳失率高','详情页承接不足','转化路径待优化','页面加载速度慢','页面体验需提升','承接与流量匹配度低']
    }
    
    return Array.from({ length: 6 }).map((_, i) => ({
      title: pick(templates[kind]),
      severity: pick(sev),
      points: [
        `依据${dateA}与${dateB}两期对比，关键指标出现差异`,
        kind === '经营诊断' ? '建议按优先级进行优化' :
        kind === '渠道诊断' ? '建议调整渠道预算分配' :
        kind === '计划诊断' ? '建议优化计划出价与预算' :
        kind === '漏斗诊断' ? '建议针对薄弱环节优化' :
        kind === '人群诊断' ? '建议扩大高价值人群，排除低效人群' :
        kind === '关键词诊断' ? '建议扩词、否词、优化出价' :
        kind === '创意诊断' ? '建议更新素材，测试新创意' :
        '建议优化落地页与详情页体验'
      ],
      metrics: [pick(metrics)],
      suggestions: kind === '经营诊断' 
        ? ['优化出价降低CPC','提升CTR','倾斜预算至高ROI渠道','测试新素材']
        : kind === '渠道诊断'
          ? ['调整渠道预算','优化渠道出价','暂停低效渠道','测试新渠道']
          : kind === '计划诊断'
            ? ['暂停低ROI计划','提升高效计划预算','优化计划出价','测试新计划']
            : kind === '漏斗诊断'
              ? ['优化曝光素材','提升点击率','优化加购引导','优化支付流程']
              : kind === '人群诊断'
                ? ['扩大高价值人群包','排除低效人群','优化人群出价','测试新人群']
                : kind === '关键词诊断'
                  ? ['扩大高潜关键词','否定低效词','优化关键词出价','测试新词']
                  : kind === '创意诊断'
                    ? ['更新疲劳素材','测试新创意','优化素材风格','提升素材质量']
                    : ['优化落地页','提升加载速度','优化详情页','改善用户体验']
    }))
  }
  
  const sceneData = scenes.map((s) => {
    const headers = ['维度', '指标', 'A期', 'B期', '建议']
    const rows = Array.from({ length: 6 }).map((_, i) => {
      const dimMap: Record<string, string[]> = {
        '经营诊断': ['GMV', 'ROI', 'CPC', 'CTR', '预算', '成本'],
        '渠道诊断': ['搜索', '推荐', '活动', '内容', '万相台推荐', '万相台搜索'],
        '计划诊断': ['计划A', '计划B', '计划C', '计划D', '计划E', '计划F'],
        '漏斗诊断': ['曝光→点击', '点击→加购', '加购→收藏', '收藏→支付', '整体转化', '关键环节'],
        '人群诊断': ['高价值', '新客', '复购', '相似', '兴趣A', '兴趣B'],
        '关键词诊断': ['关键词-1', '关键词-2', '关键词-3', '关键词-4', '关键词-5', '关键词-6'],
        '创意诊断': ['素材A', '素材B', '素材C', '素材D', '素材E', '素材F'],
        '承接诊断': ['落地页', '详情页', '支付页', '客服页', '评价页', '复购页']
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
        `根据${dateA}至${dateB}数据分析，${s}显示${s.includes('诊断') ? '关键指标需关注' : '表现良好'}`,
        `建议优先处理${cards(s)[0]?.title || '核心问题'}`,
        `预期优化后可提升整体效率${(5 + Math.floor(Math.random() * 10))}%`
      ]
    }
  })

  return { scenes: sceneData }
}

// 任务看板
export function genKanban(stage: StageKey, dateA: string, dateB: string) {
  const base = (d: number) => new Date(new Date(dateB).getTime() + d*24*3600*1000).toISOString().split('T')[0]
  const tasks = {
    todo: [
      { id: 't1', title: '预算校准', assignee: '天猫运营团队', deadline: base(2), relatedSPU: 'SPU-001', relatedPlan: 'PLAN0001', relatedMetric: '天猫销售额' },
      { id: 't2', title: '关键词优化', assignee: '天猫运营团队', deadline: base(3), relatedSPU: 'SPU-002', relatedPlan: 'PLAN0002', relatedMetric: '天猫转化率' },
      { id: 't3', title: '人群扩展', assignee: '天猫运营团队', deadline: base(4), relatedSPU: 'SPU-003', relatedPlan: 'PLAN0003', relatedMetric: '天猫流量' }
    ],
    doing: [
      { id: 'd1', title: '素材测试', assignee: '创意团队', deadline: base(1), relatedSPU: 'SPU-001', relatedPlan: 'PLAN0001', relatedMetric: 'CTR' },
      { id: 'd2', title: '承接优化', assignee: '产品团队', deadline: base(2), relatedSPU: 'SPU-002', relatedPlan: 'PLAN0002', relatedMetric: '转化率' },
      { id: 'd3', title: '渠道优化', assignee: '运营团队', deadline: base(3), relatedSPU: 'SPU-003', relatedPlan: 'PLAN0003', relatedMetric: 'ROI' }
    ],
    done: [
      { id: 'f1', title: '创建计划', assignee: '运营团队', deadline: base(-1), relatedSPU: 'SPU-001', relatedPlan: 'PLAN0001', relatedMetric: 'GMV' }
    ]
  }
  return tasks
}

// 操作记录
export function genLogs(stage: StageKey, dateA: string, dateB: string, count = 8) {
  const rnd = seededRandom(hashSeed(`tmallOps|logs|${stage}|${dateA}|${dateB}`))
  const actions = [
    '创建投放计划',
    '调整预算',
    '优化关键词',
    '上传素材',
    '生成诊断',
    '指派任务',
    '调整出价',
    '新增人群包',
    '下线低效渠道',
    '优化承接页'
  ]
  const operators = ['天猫运营团队', '运营A', '运营B', '创意团队', '产品团队']
  return Array.from({ length: count }).map((_, i) => ({
    time: `${dateB} ${String(9 + (i%6)).padStart(2,'0')}:${String(Math.floor(rnd()*60)).padStart(2,'0')}`,
    action: actions[i % actions.length],
    operator: operators[i % operators.length]
  }))
}



