// 抖音内容制作角色的Mock数据
// 支持日期对比，基于seed生成确定性数据

export interface MaterialData {
  materialId: string
  audience: string  // 人群
  sellingPoint: string  // 卖点
  gmv: number
  roi: number
  ctr: number
  cvr: number
  cpm: number
  interactionRate: number
  spu?: string
  strategy?: string  // 组合策略
  cost?: number
  fullStoreSales?: number  // 全店销量
  audienceInsight?: string  // 人群洞察
}

export interface TalentVideoData {
  rank: number
  spu: string
  talentName: string
  talentId: string
  videoId: string
  publishDate: string
  gmv: number
  orderCount: number
  refundRate: number
}

export interface AudienceSellingPointMatrix {
  audience: string
  sellingPoints: Record<string, { roi: number; gmv: number; videoCount?: number }>
}

export interface DiagnosticCard {
  id: string
  title: string
  severity: 'high' | 'medium' | 'low'  // 红/黄/绿
  triggerMetrics: string[]  // 触发指标
  conclusion: string
  suggestions: string[]
}

export interface TaskItem {
  id: string
  title: string
  priority: 'high' | 'medium' | 'low'
  dueDate: string
  assignee: string
  status: 'todo' | 'doing' | 'done'
}

export interface OperationLog {
  time: string
  action: string
  content: string
}

// 基于seed生成确定性随机数
function seededRandom(seed: number): () => number {
  let value = seed
  return () => {
    value = (value * 9301 + 49297) % 233280
    return value / 233280
  }
}

// 生成hash seed
function hashSeed(input: string): number {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

// 生成素材数据
export function generateMaterialData(
  dateRangeA: string,
  dateRangeB: string,
  count: number = 20
): MaterialData[] {
  const seed = hashSeed(`materials_${dateRangeA}_${dateRangeB}`)
  const random = seededRandom(seed)
  
  const audiences = ['宝妈', '学生', '白领', '银发', '儿童']
  const sellingPoints = ['高钙', '低糖', '轻食', '口感', '营养密度']
  const spus = ['SPU-A001', 'SPU-A002', 'SPU-A003', 'SPU-B001', 'SPU-B002']
  
  const materials: MaterialData[] = []
  
  for (let i = 0; i < count; i++) {
    const audience = audiences[Math.floor(random() * audiences.length)]
    const sellingPoint = sellingPoints[Math.floor(random() * sellingPoints.length)]
    const spu = spus[Math.floor(random() * spus.length)]
    
    const baseGMV = 50000 + random() * 200000
    const baseROI = 1.5 + random() * 2.5
    const baseCTR = 3 + random() * 5
    const baseCVR = 2 + random() * 4
    const baseCPM = 1.5 + random() * 3
    const baseInteractionRate = 5 + random() * 10
    const cost = baseGMV / baseROI
    const fullStoreSales = Math.floor(1000 + random() * 5000)
    
    materials.push({
      materialId: `MAT-${String(i + 1).padStart(4, '0')}`,
      audience,
      sellingPoint,
      gmv: Math.round(baseGMV),
      roi: Number(baseROI.toFixed(2)),
      ctr: Number(baseCTR.toFixed(2)),
      cvr: Number(baseCVR.toFixed(2)),
      cpm: Number(baseCPM.toFixed(2)),
      interactionRate: Number(baseInteractionRate.toFixed(2)),
      spu,
      strategy: `${audience}-${sellingPoint}-标准装-${Math.round(50 + random() * 100)}元`,
      cost: Math.round(cost),
      fullStoreSales,
      audienceInsight: `${audience}群体对${sellingPoint}卖点接受度高，建议加大投放`
    })
  }
  
  return materials.sort((a, b) => b.gmv - a.gmv)
}

// 生成达人视频数据
export function generateTalentVideoData(
  dateRangeA: string,
  dateRangeB: string,
  count: number = 15
): TalentVideoData[] {
  const seed = hashSeed(`talent_${dateRangeA}_${dateRangeB}`)
  const random = seededRandom(seed)
  
  const talentNames = ['李佳琦', '薇娅', '罗永浩', '辛巴', '董明珠', '张一鸣', '雷军', '刘强东']
  const spus = ['SPU-A001', 'SPU-A002', 'SPU-A003', 'SPU-B001', 'SPU-B002']
  
  const videos: TalentVideoData[] = []
  
  for (let i = 0; i < count; i++) {
    const talentName = talentNames[Math.floor(random() * talentNames.length)]
    const spu = spus[Math.floor(random() * spus.length)]
    const baseGMV = 100000 + random() * 500000
    const baseOrderCount = Math.floor(100 + random() * 500)
    const baseRefundRate = 1 + random() * 5
    
    const publishDate = new Date(2024, 0, 1 + Math.floor(random() * 30))
      .toISOString()
      .split('T')[0]
    
    videos.push({
      rank: i + 1,
      spu,
      talentName,
      talentId: `TALENT-${String(i + 1).padStart(4, '0')}`,
      videoId: `VID-${String(i + 1).padStart(6, '0')}`,
      publishDate,
      gmv: Math.round(baseGMV),
      orderCount: baseOrderCount,
      refundRate: Number(baseRefundRate.toFixed(2))
    })
  }
  
  return videos.sort((a, b) => b.gmv - a.gmv).map((v, i) => ({ ...v, rank: i + 1 }))
}

// 生成人群×卖点矩阵
export function generateAudienceSellingPointMatrix(
  dateRangeA: string,
  dateRangeB: string
): AudienceSellingPointMatrix[] {
  const seed = hashSeed(`matrix_${dateRangeA}_${dateRangeB}`)
  const random = seededRandom(seed)
  
  const audiences = ['宝妈', '学生', '白领', '银发', '儿童']
  const sellingPoints = ['高钙', '低糖', '轻食', '口感', '营养密度']
  
  return audiences.map(audience => {
    const sellingPointData: Record<string, { roi: number; gmv: number; videoCount?: number }> = {}
    
    sellingPoints.forEach(sp => {
      const baseROI = 1.5 + random() * 3
      const baseGMV = 30000 + random() * 150000
      const videoCount = Math.floor(5 + random() * 20)
      
      sellingPointData[sp] = {
        roi: Number(baseROI.toFixed(2)),
        gmv: Math.round(baseGMV),
        videoCount
      }
    })
    
    return { audience, sellingPoints: sellingPointData }
  })
}

// 生成诊断卡片
export function generateDiagnosticCards(
  scene: 'operation' | 'material' | 'audience',
  stage: 'cold_start' | 'scaling',
  dateRangeA: string,
  dateRangeB: string
): DiagnosticCard[] {
  const seed = hashSeed(`diagnostic_${scene}_${stage}_${dateRangeA}_${dateRangeB}`)
  const random = seededRandom(seed)
  
  const cards: DiagnosticCard[] = []
  
  if (scene === 'operation') {
    if (stage === 'cold_start') {
      cards.push(
        {
          id: 'op1',
          title: 'GMV目标达成率偏低',
          severity: 'high',
          triggerMetrics: ['GMV', 'ROI'],
          conclusion: '当前GMV为目标的65%，需要加大投放力度',
          suggestions: ['提升素材质量，优化CTR', '扩大人群覆盖范围', '增加测试素材数量']
        },
        {
          id: 'op2',
          title: 'CTR表现良好',
          severity: 'low',
          triggerMetrics: ['CTR'],
          conclusion: 'CTR达到4.2%，高于行业平均',
          suggestions: ['保持当前素材策略', '复制高CTR素材组合']
        },
        {
          id: 'op3',
          title: 'ROI波动较大',
          severity: 'medium',
          triggerMetrics: ['ROI', 'CPM'],
          conclusion: 'ROI在1.8-3.2之间波动，需要稳定',
          suggestions: ['优化出价策略', '筛选高效人群组合', '降低低效素材消耗']
        },
        {
          id: 'op4',
          title: 'CPM成本上升',
          severity: 'medium',
          triggerMetrics: ['CPM', '消耗'],
          conclusion: 'CPM较上期上升15%，需要优化',
          suggestions: ['调整投放时段', '优化素材创意', '测试新人群包']
        },
        {
          id: 'op5',
          title: 'CVR转化率偏低',
          severity: 'high',
          triggerMetrics: ['CVR', 'GMV'],
          conclusion: 'CVR为2.8%，低于目标3.5%',
          suggestions: ['优化落地页体验', '提升商品详情质量', '加强卖点传达']
        },
        {
          id: 'op6',
          title: '曝光量增长稳定',
          severity: 'low',
          triggerMetrics: ['曝光'],
          conclusion: '曝光量持续增长，趋势良好',
          suggestions: ['继续保持投放节奏', '扩大高效素材规模']
        }
      )
    } else {
      cards.push(
        {
          id: 'op1',
          title: 'GMV规模持续增长',
          severity: 'low',
          triggerMetrics: ['GMV', '订单量'],
          conclusion: 'GMV较上期增长25%，表现优异',
          suggestions: ['扩大投放规模', '复制爆款素材', '拓展新人群']
        },
        {
          id: 'op2',
          title: 'CPM成本上升',
          severity: 'high',
          triggerMetrics: ['CPM', '消耗'],
          conclusion: 'CPM上升20%，需要控制成本',
          suggestions: ['优化出价策略', '下线低效素材', '调整投放时段']
        },
        {
          id: 'op3',
          title: 'CTR出现下滑',
          severity: 'medium',
          triggerMetrics: ['CTR', '曝光'],
          conclusion: 'CTR从4.2%下滑至3.5%，需要关注',
          suggestions: ['更新素材创意', '测试新卖点', '优化人群匹配']
        },
        {
          id: 'op4',
          title: '复购率表现良好',
          severity: 'low',
          triggerMetrics: ['复购率'],
          conclusion: '复购率达到12%，用户粘性高',
          suggestions: ['加强用户运营', '推送复购活动', '优化商品组合']
        },
        {
          id: 'op5',
          title: 'ROI波动需关注',
          severity: 'medium',
          triggerMetrics: ['ROI', 'GMV'],
          conclusion: 'ROI在2.0-3.5之间波动，需要稳定',
          suggestions: ['优化素材组合', '筛选高效人群', '控制低效消耗']
        },
        {
          id: 'op6',
          title: '素材疲劳度上升',
          severity: 'high',
          triggerMetrics: ['CTR', 'CVR', '互动率'],
          conclusion: '部分素材表现下滑，需要更新',
          suggestions: ['下线低效素材', '补充新素材', '优化创意方向']
        }
      )
    }
  } else if (scene === 'material') {
    if (stage === 'cold_start') {
      cards.push(
        {
          id: 'mat1',
          title: 'CTR偏低',
          severity: 'high',
          triggerMetrics: ['CTR'],
          conclusion: '平均CTR为3.2%，低于目标4.0%',
          suggestions: ['优化Hook开头', '提升画面吸引力', '加强卖点传达']
        },
        {
          id: 'mat2',
          title: '素材同质化严重',
          severity: 'medium',
          triggerMetrics: ['CTR', '互动率'],
          conclusion: '多素材创意相似，差异化不足',
          suggestions: ['增加创意测试', '尝试新卖点角度', '优化画面结构']
        },
        {
          id: 'mat3',
          title: 'ROI达标但GMV未达标',
          severity: 'medium',
          triggerMetrics: ['ROI', 'GMV'],
          conclusion: 'ROI达到2.5，但GMV仅为目标的70%',
          suggestions: ['扩大高效素材投放', '增加测试素材数量', '优化人群匹配']
        },
        {
          id: 'mat4',
          title: '高潜人群覆盖不足',
          severity: 'high',
          triggerMetrics: ['曝光', 'CTR'],
          conclusion: '高ROI人群曝光占比仅30%',
          suggestions: ['加大高潜人群投放', '优化人群包配置', '测试新人群组合']
        },
        {
          id: 'mat5',
          title: '素材节奏密度需优化',
          severity: 'low',
          triggerMetrics: ['完播率', '互动率'],
          conclusion: '部分素材节奏偏慢，完播率偏低',
          suggestions: ['加快前3秒节奏', '优化画面切换', '加强节奏感']
        },
        {
          id: 'mat6',
          title: 'Hook观看留存良好',
          severity: 'low',
          triggerMetrics: ['完播率', 'CTR'],
          conclusion: 'Hook前3秒留存率达到65%',
          suggestions: ['保持当前Hook策略', '复制高留存素材', '优化后续内容']
        }
      )
    } else {
      cards.push(
        {
          id: 'mat1',
          title: '爆款素材延展不足',
          severity: 'high',
          triggerMetrics: ['GMV', 'ROI'],
          conclusion: 'Top3素材贡献60%GMV，依赖度高',
          suggestions: ['复制爆款素材组合', '测试相似创意', '扩大爆款投放']
        },
        {
          id: 'mat2',
          title: '素材衰退预警',
          severity: 'medium',
          triggerMetrics: ['CTR', 'CVR', '互动率'],
          conclusion: '部分素材CTR下滑15%，出现疲劳',
          suggestions: ['下线低效素材', '更新创意方向', '补充新素材']
        },
        {
          id: 'mat3',
          title: 'CPM上升影响效率',
          severity: 'high',
          triggerMetrics: ['CPM', 'ROI'],
          conclusion: 'CPM上升导致ROI下降，需要优化',
          suggestions: ['优化出价策略', '筛选高效素材', '调整投放时段']
        },
        {
          id: 'mat4',
          title: '新素材测试不足',
          severity: 'medium',
          triggerMetrics: ['素材数量', 'CTR'],
          conclusion: '新素材占比仅20%，需要补充',
          suggestions: ['增加素材测试', '尝试新卖点', '优化创意方向']
        },
        {
          id: 'mat5',
          title: '素材组合效率高',
          severity: 'low',
          triggerMetrics: ['ROI', 'GMV'],
          conclusion: '人群×卖点组合ROI达到3.2',
          suggestions: ['扩大高效组合投放', '复制成功组合', '测试新组合']
        },
        {
          id: 'mat6',
          title: '素材质量稳定',
          severity: 'low',
          triggerMetrics: ['CTR', 'CVR'],
          conclusion: '整体素材质量保持稳定',
          suggestions: ['保持当前策略', '持续优化细节', '关注行业趋势']
        }
      )
    }
  } else if (scene === 'audience') {
    if (stage === 'cold_start') {
      cards.push(
        {
          id: 'aud1',
          title: '高潜人群覆盖不足',
          severity: 'high',
          triggerMetrics: ['曝光', 'ROI'],
          conclusion: '高ROI人群曝光占比仅35%',
          suggestions: ['加大高潜人群投放', '优化人群包配置', '测试新人群组合']
        },
        {
          id: 'aud2',
          title: '人群匹配度需提升',
          severity: 'medium',
          triggerMetrics: ['CTR', 'CVR'],
          conclusion: '部分人群CTR偏低，匹配度不足',
          suggestions: ['优化人群标签', '调整素材卖点', '测试新人群']
        },
        {
          id: 'aud3',
          title: '人群扩展空间大',
          severity: 'low',
          triggerMetrics: ['曝光', 'GMV'],
          conclusion: '当前覆盖5个人群，可扩展至8-10个',
          suggestions: ['测试新人群', '扩大覆盖范围', '优化人群组合']
        },
        {
          id: 'aud4',
          title: '核心人群表现优异',
          severity: 'low',
          triggerMetrics: ['ROI', 'GMV'],
          conclusion: '宝妈+白领人群ROI达到3.5',
          suggestions: ['加大核心人群投放', '复制成功组合', '优化卖点匹配']
        },
        {
          id: 'aud5',
          title: '人群×卖点组合需优化',
          severity: 'medium',
          triggerMetrics: ['ROI', 'CTR'],
          conclusion: '部分组合ROI偏低，需要调整',
          suggestions: ['优化人群卖点匹配', '测试新组合', '下线低效组合']
        },
        {
          id: 'aud6',
          title: '人群洞察数据不足',
          severity: 'low',
          triggerMetrics: ['曝光', '互动率'],
          conclusion: '部分人群数据样本较小，需要补充',
          suggestions: ['增加测试样本', '延长测试周期', '收集更多数据']
        }
      )
    } else {
      cards.push(
        {
          id: 'aud1',
          title: '扩量人群表现良好',
          severity: 'low',
          triggerMetrics: ['GMV', 'ROI'],
          conclusion: '新扩人群ROI达到2.8，表现稳定',
          suggestions: ['继续扩大投放', '优化人群组合', '测试相似人群']
        },
        {
          id: 'aud2',
          title: '新增人群测试不足',
          severity: 'medium',
          triggerMetrics: ['曝光', 'CTR'],
          conclusion: '新增人群占比仅15%，需要补充',
          suggestions: ['增加新人群测试', '扩大测试规模', '优化人群配置']
        },
        {
          id: 'aud3',
          title: '人群结构需优化',
          severity: 'medium',
          triggerMetrics: ['ROI', 'GMV'],
          conclusion: '高ROI人群占比偏低，需要调整',
          suggestions: ['加大高ROI人群投放', '优化人群结构', '下线低效人群']
        },
        {
          id: 'aud4',
          title: '核心人群持续增长',
          severity: 'low',
          triggerMetrics: ['GMV', '订单量'],
          conclusion: '核心人群GMV增长30%，表现优异',
          suggestions: ['保持核心人群策略', '扩大投放规模', '优化卖点匹配']
        },
        {
          id: 'aud5',
          title: '人群疲劳度上升',
          severity: 'high',
          triggerMetrics: ['CTR', 'CVR'],
          conclusion: '部分人群CTR下滑，出现疲劳',
          suggestions: ['更新素材创意', '测试新卖点', '调整人群策略']
        },
        {
          id: 'aud6',
          title: '人群×卖点矩阵优化',
          severity: 'low',
          triggerMetrics: ['ROI', 'GMV'],
          conclusion: '人群×卖点组合效率持续提升',
          suggestions: ['扩大高效组合', '复制成功模式', '持续优化']
        }
      )
    }
  }
  
  return cards
}

// 生成任务数据
export function generateTasks(
  stage: 'cold_start' | 'scaling',
  dateRangeA: string
): { todo: TaskItem[]; doing: TaskItem[]; done: TaskItem[] } {
  const seed = hashSeed(`tasks_${stage}_${dateRangeA}`)
  const random = seededRandom(seed)
  
  const todoTasks: TaskItem[] = []
  const doingTasks: TaskItem[] = []
  const doneTasks: TaskItem[] = []
  
  if (stage === 'cold_start') {
    todoTasks.push(
      { id: 't1', title: '预算校准', priority: 'high', dueDate: '2024-02-15', assignee: '内容团队', status: 'todo' },
      { id: 't2', title: '素材补量', priority: 'medium', dueDate: '2024-02-20', assignee: '制作团队', status: 'todo' }
    )
    doingTasks.push(
      { id: 't3', title: '人群扩展', priority: 'high', dueDate: '2024-02-18', assignee: '运营团队', status: 'doing' }
    )
    doneTasks.push(
      { id: 't4', title: '卖点重拍', priority: 'low', dueDate: '2024-02-10', assignee: '制作团队', status: 'done' },
      { id: 't5', title: '加测组合', priority: 'medium', dueDate: '2024-02-12', assignee: '内容团队', status: 'done' }
    )
  } else {
    todoTasks.push(
      { id: 't1', title: '爆款素材迭代', priority: 'high', dueDate: '2024-02-20', assignee: '制作团队', status: 'todo' },
      { id: 't2', title: '上新补量', priority: 'medium', dueDate: '2024-02-25', assignee: '内容团队', status: 'todo' }
    )
    doingTasks.push(
      { id: 't3', title: '人群扩展', priority: 'high', dueDate: '2024-02-22', assignee: '运营团队', status: 'doing' },
      { id: 't4', title: '预算倾斜', priority: 'medium', dueDate: '2024-02-23', assignee: '运营团队', status: 'doing' }
    )
    doneTasks.push(
      { id: 't5', title: '低效素材下线', priority: 'low', dueDate: '2024-02-15', assignee: '运营团队', status: 'done' }
    )
  }
  
  return { todo: todoTasks, doing: doingTasks, done: doneTasks }
}

// 生成操作记录
export function generateOperationLogs(
  stage: 'cold_start' | 'scaling',
  dateRangeA: string,
  count: number = 10
): OperationLog[] {
  const seed = hashSeed(`logs_${stage}_${dateRangeA}`)
  const random = seededRandom(seed)
  
  const actions = [
    '生成诊断',
    '创建任务',
    '标记完成',
    '调整预算',
    '更新素材',
    '优化人群',
    '分析数据',
    '导出报告'
  ]
  
  const logs: OperationLog[] = []
  const baseDate = new Date(dateRangeA)
  
  for (let i = 0; i < count; i++) {
    const date = new Date(baseDate)
    date.setDate(date.getDate() + i)
    const time = date.toISOString().split('T')[0] + ' ' + 
      String(9 + Math.floor(random() * 8)).padStart(2, '0') + ':' +
      String(Math.floor(random() * 60)).padStart(2, '0')
    const action = actions[Math.floor(random() * actions.length)]
    const content = `${action}操作完成`
    
    logs.push({ time, action, content })
  }
  
  return logs.reverse()  // 最新的在前
}



