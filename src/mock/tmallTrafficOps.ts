// 天猫流量运营 Mock 生成器（seed 可复现，A/B 两期联动，自洽指标）
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

// 生成核心口径（自洽：CTR=点击/曝光，CPC=消耗/点击，CPM=消耗/曝光*1000，ROI=GMV/消耗）
export function genMetricsBundle(stage: StageKey, dateKey: DateKey, dateA: string, dateB: string) {
  const seed = hashSeed(`tmallTrafficOps|${stage}|${dateKey}|${dateA}|${dateB}`)
  const rnd = seededRandom(seed)
  const exposure = Math.round(6_000_000 + 4_000_000 * rnd()) // 曝光量
  const click = Math.round(exposure * (0.04 + 0.02 * rnd())) // 点击量
  const uv = Math.round(click * (0.6 + 0.25 * rnd())) // 进店UV（不一定有指标池，作为维度值用）
  const cost = Math.round(200_000 + 180_000 * rnd()) // 消耗
  const gmv = Math.round(cost * (2.3 + 1.2 * rnd())) // GMV
  const ctr = exposure > 0 ? click / exposure : 0
  const cpc = click > 0 ? cost / click : 0
  const cpm = exposure > 0 ? (cost / exposure) * 1000 : 0
  const roi = cost > 0 ? gmv / cost : 0
  const cart = Math.round(click * (0.09 + 0.04 * rnd())) // 加购人数
  const order = Math.round(cart * (0.85 + 0.05 * rnd()))
  const pay = Math.round(order * (0.9 + 0.05 * rnd()))
  const cvr = click > 0 ? (pay / click) : 0
  return { exposure, click, uv, cost, gmv, ctr, cpc, cpm, roi, cart, order, pay, cvr }
}

// 概览 KPI（严格映射口径，无法映射的使用占位并标注 TODO）
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
    uv: delta(cur.uv, cmp.uv),
    roi: delta(cur.roi, cmp.roi),
    cpm: delta(cur.cpm, cmp.cpm),
    cvr: delta(cur.cvr, cmp.cvr)
  }
  const toTrend = (v: number) => v > 0.001 ? 'up' : v < -0.001 ? 'down' : 'stable'
  const toCmpText = (v: number) => `${v > 0 ? '↑' : v < 0 ? '↓' : '→'}${Math.abs(v).toFixed(1)}%`

  // 指标池映射：'天猫流量'(UV), '天猫转化率', '天猫销售额' 等；点击/CPA/收藏率等若不存在 -> 占位
  return [
    { label: '曝光量', metricKey: undefined, value: cur.exposure, unit: '', trend: toTrend(diff.exposure), compareValue: toCmpText(diff.exposure), placeholder: true },
    { label: '点击量', metricKey: undefined, value: cur.click, unit: '', trend: toTrend(diff.click), compareValue: toCmpText(diff.click), placeholder: true },
    { label: 'CTR', metricKey: '天猫转化率', value: clamp(cur.ctr * 100, 0, 100), unit: '%', trend: toTrend(diff.ctr), compareValue: toCmpText(diff.ctr) },
    { label: 'CPC', metricKey: undefined, value: cur.cpc, unit: '元', trend: toTrend(diff.cpc), compareValue: toCmpText(diff.cpc), placeholder: true },
    { label: '进店UV', metricKey: '天猫流量', value: cur.uv, unit: 'UV', trend: toTrend(diff.uv), compareValue: toCmpText(diff.uv) },
    { label: 'CPA', metricKey: undefined, value: 0, unit: '元', trend: 'stable', compareValue: '→0.0%', placeholder: true },
    { label: '付费ROI', metricKey: undefined, value: cur.roi, unit: '', trend: toTrend(diff.roi), compareValue: toCmpText(diff.roi), placeholder: true },
    { label: '加购率', metricKey: undefined, value: clamp(cur.cart / Math.max(cur.uv, 1) * 100, 0, 100), unit: '%', trend: 'stable', compareValue: '→0.0%', placeholder: true },
    { label: '收藏率', metricKey: undefined, value: 0, unit: '%', trend: 'stable', compareValue: '→0.0%', placeholder: true }
  ]
}

export function genChannels(stage: StageKey, dateA: string, dateB: string) {
  const names = ['搜索', '推荐', '活动', '内容', '万相台-推荐', '万相台-搜索']
  const cur = genMetricsBundle(stage, 'current', dateA, dateB)
  const rows = names.map((channel, i) => {
    const factor = 1 - i * 0.07
    const exposure = Math.round(cur.exposure * factor * 0.2)
    const click = Math.round(exposure * (cur.ctr))
    const cost = Math.round(cur.cpc * Math.max(click, 1))
    const gmv = Math.round(cost * cur.roi * (0.7 + 0.6 * (1 - factor)))
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

export function genPlans(stage: StageKey, dateA: string, dateB: string, count = 20) {
  const rnd = seededRandom(hashSeed(`tmallTrafficOps|plans|${stage}|${dateA}|${dateB}`))
  return Array.from({ length: count }).map((_, i) => {
    const cost = Math.round(12_000 + 18_000 * rnd())
    const roi = +(2.0 + 1.8 * rnd()).toFixed(2)
    const gmv = Math.round(cost * roi)
    const clicks = Math.round(8_000 + 6_000 * rnd())
    const exposure = Math.round(clicks / (0.05 + 0.02 * rnd()))
    const ctr = +(clicks / Math.max(exposure, 1) * 100).toFixed(1)
    const cpc = +(cost / Math.max(clicks, 1)).toFixed(2)
    const cvr = +(3.0 + 2.0 * rnd()).toFixed(1)
    return {
      planId: `P${String(i + 1).padStart(3, '0')}`,
      planName: `资源位-${String.fromCharCode(65 + (i % 26))}`,
      cost, gmv, roi, ctr, cpc, cvr
    }
  })
}

export function genFunnel(stage: StageKey, dateA: string, dateB: string) {
  const m = genMetricsBundle(stage, 'current', dateA, dateB)
  return [
    { label: '曝光量', value: m.exposure },
    { label: '点击量', value: m.click },
    { label: '进店UV', value: m.uv },
    { label: '加购人数', value: m.cart },
    { label: '支付买家数', value: m.pay }
  ]
}

export function genRank(stage: StageKey, dateA: string, dateB: string, title: 'audience' | 'keyword') {
  const rnd = seededRandom(hashSeed(`tmallTrafficOps|rank|${stage}|${dateA}|${dateB}|${title}`))
  const names = title === 'audience'
    ? ['高价值', '新客', '复购', '高购次', '高客单', '价格敏感', '兴趣A', '兴趣B', '地域C', '地域D']
    : ['关键词A', '关键词B', '关键词C', '关键词D', '关键词E', '关键词F', '关键词G', '关键词H', '关键词I', '关键词J']
  return names.map((name, i) => ({
    name,
    value: Math.round(80 - i * 5 + rnd() * 8),
    unit: title === 'keyword' ? '%' : ''
  }))
}

// AI 诊断场景（简化，引用现有指标名；缺失指标不写名字，仅做文本建议）
export function genDiagnosis(stage: StageKey, dateA: string, dateB: string) {
  const scenes = ['经营', '渠道/资源位', '关键词', '人群'] as const
  const metrics = ['天猫销售额', '天猫转化率', '天猫流量', '总成交金额'] // 仅引用存在的指标名
  function cards(kind: typeof scenes[number]) {
    const rnd = seededRandom(hashSeed(`tmallTrafficOps|diag|${stage}|${kind}|${dateA}|${dateB}`))
    const sev = ['high','medium','low','success'] as const
    const pick = <T,>(arr: T[]) => arr[Math.floor(rnd()*arr.length)]
    return Array.from({ length: 6 }).map((_, i) => ({
      title: kind === '经营' ? pick(['GMV达成偏低','ROI波动需关注','预算效率待提升','退货率风险']) :
             kind === '渠道/资源位' ? pick(['搜索效率待提升','推荐CPC偏高','活动ROI偏低','内容承接良好']) :
             kind === '关键词' ? pick(['高潜词可扩','低效词需否','CTR下降词优化','新增词测试']) :
             pick(['高价值人群可扩','新客转化偏低','复购稳定','相似人群建议']),
      severity: pick(sev),
      points: ['依据两期对比，关键指标出现差异','建议按优先级进行优化'],
      metrics: [pick(metrics)],
      suggestions: ['优化出价降低CPC','提升CTR','倾斜预算至高ROI渠道','测试新素材']
    }))
  }
  const sceneData = scenes.map((s) => {
    const headers = ['维度', '指标', 'A期', 'B期', '建议']
    const rows = Array.from({ length: 6 }).map((_, i) => {
      const dim =
        s === '渠道/资源位'
          ? ['搜索', '推荐', '活动', '内容'][i % 4]
          : s === '关键词'
            ? `关键词-${i + 1}`
            : s === '人群'
              ? ['高价值', '新客', '复购', '相似'][i % 4]
              : `项-${i + 1}`
      const metric = metrics[i % metrics.length]
      const a = String(100 + i * 6)
      const b = String(110 + i * 5)
      const suggestion = ['扩大预算', '优化出价', '优化素材', '结构优化'][i % 4]
      return [dim, metric, a, b, suggestion]
    })

    return {
      key: s,
      label: s,
      cards: cards(s),
      table: { headers, rows }
    }
  })

  return { scenes: sceneData }
}

export function genKanban(stage: StageKey, dateA: string, dateB: string) {
  const base = (d: number) => new Date(new Date(dateB).getTime() + d*24*3600*1000).toISOString().split('T')[0]
  return {
    todo: [
      { id: 't1', title: '预算校准', assignee: '流量团队', deadline: base(2) },
      { id: 't2', title: '关键词优化', assignee: '流量团队', deadline: base(3) },
      { id: 't3', title: '人群扩展', assignee: '流量团队', deadline: base(4) }
    ],
    doing: [
      { id: 'd1', title: '素材测试', assignee: '创意', deadline: base(1) },
      { id: 'd2', title: '承接优化', assignee: '产品', deadline: base(2) },
      { id: 'd3', title: '渠道优化', assignee: '运营', deadline: base(3) }
    ],
    done: [
      { id: 'f1', title: '创建计划', assignee: '运营', deadline: base(-1) }
    ]
  }
}

export function genLogs(stage: StageKey, dateA: string, dateB: string, count = 8) {
  const rnd = seededRandom(hashSeed(`tmallTrafficOps|logs|${stage}|${dateA}|${dateB}`))
  return Array.from({ length: count }).map((_, i) => ({
    time: `${dateB} ${String(9 + (i%6)).padStart(2,'0')}:${String(Math.floor(rnd()*60)).padStart(2,'0')}`,
    action: ['创建投放计划','调整预算','优化关键词','上传素材','生成诊断','指派任务'][i%6]
  }))
}


