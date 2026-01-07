// BU品牌负责人冷启动期AI洞察扩展数据（按钮之后的内容）
export type InsightTab = '经营' | '产品' | '人群' | '评价' | '费比'

// AI洞察内容（按Tab分类）
export const aiInsightsByTab: Record<InsightTab, string[]> = {
  经营: [
    '全平台GMV达成率85%，较目标存在15%差距，建议加大推广力度',
    'ROI波动需关注，部分平台ROI低于2.0，建议优化投放策略',
    '预算效率待提升，建议倾斜预算至高ROI渠道'
  ],
  产品: [
    'Top SPU表现优异，SPU-001贡献GMV占比达35%',
    '尾部SPU需优化，SPU-005/006转化率低于2%，建议暂停或调整',
    '产品结构需调整，建议加大新品投放力度'
  ],
  人群: [
    '高价值人群可扩，当前高价值人群ROI达3.5，建议扩大人群包',
    '新客转化偏低，新客转化率仅2.1%，建议优化新客承接页',
    '复购稳定，复购人群贡献GMV占比30%，表现良好'
  ],
  费比: [
    '总费比35.2%，较目标32%偏高，建议优化费用结构',
    '推广费比18.5%，占比较高，建议提升推广效率',
    '佣金费比12.3%，需关注佣金与GMV的平衡关系',
    '费用增长快于GMV增长，建议控制费用增速'
  ],
  评价: [
    '好评率85%，用户评价整体积极，产品质量稳定',
    '差评主要集中在"物流慢"和"包装破损"，建议优化物流和包装',
    '评价关键词Top3：营养、健康、口感，品牌资产沉淀良好'
  ]
}

// 问题诊断卡片（按Tab分类）
export interface DiagnosticCard {
  title: string
  description: string
  status: 'high' | 'medium' | 'low' | 'success'
  actionText: string
  affectedMetrics?: string[]
}

export const diagnosticsByTab: Record<InsightTab, DiagnosticCard[]> = {
  经营: [
    {
      title: '转化率偏低',
      description: '全平台转化率2.5%，低于目标3.0%，建议优化产品页面和详情',
      status: 'high',
      actionText: '查看原因',
      affectedMetrics: ['总成交金额', '总成交订单数']
    },
    {
      title: '退货率需监控',
      description: '退货率2.8%，接近预警阈值3.0%，建议分析退货原因',
      status: 'medium',
      actionText: '查看建议',
      affectedMetrics: ['总退款率']
    },
    {
      title: '推广力度不足',
      description: '当前推广预算仅完成目标的75%，建议加大推广力度',
      status: 'medium',
      actionText: '查看详情',
      affectedMetrics: []
    },
    {
      title: 'ROI波动需关注',
      description: 'ROI波动较大，部分平台ROI低于2.0，建议优化投放策略',
      status: 'high',
      actionText: '查看原因',
      affectedMetrics: []
    },
    {
      title: '预算效率待提升',
      description: '预算效率偏低，建议倾斜预算至高ROI渠道',
      status: 'low',
      actionText: '查看建议',
      affectedMetrics: []
    },
    {
      title: 'GMV达成率偏低',
      description: 'GMV达成率85%，较目标存在15%差距，建议加大推广力度',
      status: 'high',
      actionText: '查看详情',
      affectedMetrics: ['总成交金额']
    }
  ],
  产品: [
    {
      title: 'Top SPU表现优异',
      description: 'SPU-001贡献GMV占比达35%，表现优异，建议加大投放',
      status: 'success',
      actionText: '查看详情',
      affectedMetrics: ['总成交金额']
    },
    {
      title: '尾部SPU需优化',
      description: 'SPU-005/006转化率低于2%，建议暂停或调整',
      status: 'high',
      actionText: '查看原因',
      affectedMetrics: ['总成交订单数']
    },
    {
      title: '商品结构需调整',
      description: '商品结构需调整，建议加大新品投放力度',
      status: 'medium',
      actionText: '查看建议',
      affectedMetrics: []
    },
    {
      title: '新品渗透不足',
      description: '新品渗透率仅15%，低于目标20%，建议加大新品推广',
      status: 'medium',
      actionText: '查看详情',
      affectedMetrics: []
    },
    {
      title: '商品ROI差异大',
      description: '商品ROI差异较大，最高3.5，最低1.2，建议优化商品结构',
      status: 'low',
      actionText: '查看建议',
      affectedMetrics: []
    },
    {
      title: '商品库存风险',
      description: '部分商品库存不足，建议及时补货',
      status: 'medium',
      actionText: '查看详情',
      affectedMetrics: []
    }
  ],
  人群: [
    {
      title: '高价值人群可扩',
      description: '高价值人群ROI达3.5，建议扩大人群包',
      status: 'success',
      actionText: '查看详情',
      affectedMetrics: []
    },
    {
      title: '新客转化偏低',
      description: '新客转化率仅2.1%，建议优化新客承接页',
      status: 'high',
      actionText: '查看原因',
      affectedMetrics: ['总成交订单数']
    },
    {
      title: '复购稳定',
      description: '复购人群贡献GMV占比30%，表现良好',
      status: 'success',
      actionText: '查看详情',
      affectedMetrics: ['总成交金额']
    },
    {
      title: '相似人群建议',
      description: '相似人群ROI达2.8，建议扩大相似人群包',
      status: 'low',
      actionText: '查看建议',
      affectedMetrics: []
    },
    {
      title: '人群包表现差异大',
      description: '人群包表现差异较大，建议优化人群策略',
      status: 'medium',
      actionText: '查看详情',
      affectedMetrics: []
    },
    {
      title: '人群精准度待提升',
      description: '部分人群精准度偏低，建议优化人群标签',
      status: 'low',
      actionText: '查看建议',
      affectedMetrics: []
    }
  ],
  费比: [
    {
      title: '推广费比偏高',
      description: '推广费比18.5%，高于目标15%，建议提升推广效率',
      status: 'high',
      actionText: '查看原因',
      affectedMetrics: ['总成交金额']
    },
    {
      title: '佣金挤压毛利',
      description: '佣金费比12.3%，占比较高，建议优化佣金结构',
      status: 'medium',
      actionText: '查看建议',
      affectedMetrics: ['佣金']
    },
    {
      title: '费用增长快于GMV',
      description: '费用增长25%，GMV增长18%，建议控制费用增速',
      status: 'high',
      actionText: '查看原因',
      affectedMetrics: ['总成交金额']
    },
    {
      title: '低效费用项占比高',
      description: '低效费用项占比达35%，建议优化费用结构',
      status: 'medium',
      actionText: '查看建议',
      affectedMetrics: []
    },
    {
      title: '总费比需控制',
      description: '总费比35.2%，较目标32%偏高，建议优化费用结构',
      status: 'high',
      actionText: '查看详情',
      affectedMetrics: []
    },
    {
      title: '费用结构需优化',
      description: '费用结构需优化，建议调整费用分配',
      status: 'medium',
      actionText: '查看建议',
      affectedMetrics: []
    }
  ],
  评价: [
    {
      title: '好评率85%',
      description: '用户评价整体积极，产品质量稳定',
      status: 'success',
      actionText: '查看详情',
      affectedMetrics: []
    },
    {
      title: '差评主要集中在物流',
      description: '差评主要集中在"物流慢"，建议优化物流',
      status: 'medium',
      actionText: '查看原因',
      affectedMetrics: []
    },
    {
      title: '评价关键词Top3',
      description: '评价关键词Top3：营养、健康、口感，品牌资产沉淀良好',
      status: 'success',
      actionText: '查看详情',
      affectedMetrics: []
    },
    {
      title: '包装破损需关注',
      description: '包装破损差评占比15%，建议优化包装',
      status: 'medium',
      actionText: '查看建议',
      affectedMetrics: []
    },
    {
      title: '用户满意度较高',
      description: '用户满意度较高，建议继续保持',
      status: 'success',
      actionText: '查看详情',
      affectedMetrics: []
    },
    {
      title: '评价回复率待提升',
      description: '评价回复率仅60%，建议提升回复率',
      status: 'low',
      actionText: '查看建议',
      affectedMetrics: []
    }
  ]
}

// 行动卡数据
export interface ActionCard {
  id: string
  title: string
  description: string
  status: string
  assignee?: string
  deadline?: string
  relatedPlatform?: string
  relatedSPU?: string
  relatedMetric?: string
  tab?: InsightTab // 关联的Tab
}

// 行动卡数据（按Tab分类）
const baseActionCards: Record<InsightTab, { todo: ActionCard[]; doing: ActionCard[]; done: ActionCard[] }> = {
  经营: {
    todo: [
      {
        id: 'todo-1',
        title: '优化产品页面详情',
        description: '提升转化率',
        status: '待办',
        assignee: '品牌负责人',
        deadline: '2025-03-05',
        relatedPlatform: '全平台',
        relatedSPU: 'SPU-001',
        relatedMetric: '总成交金额',
        tab: '经营'
      },
      {
        id: 'todo-2',
        title: '分析退货原因',
        description: '降低退款率',
        status: '待办',
        assignee: '品牌负责人',
        deadline: '2025-03-06',
        relatedPlatform: '全平台',
        relatedSPU: 'SPU-002',
        relatedMetric: '总退款率',
        tab: '经营'
      }
    ],
    doing: [
      {
        id: 'doing-1',
        title: '收集用户反馈',
        description: '优化产品体验',
        status: '进行中',
        assignee: '品牌团队',
        deadline: '2025-03-04',
        relatedPlatform: '抖音',
        relatedSPU: 'SPU-001',
        relatedMetric: '总成交订单数',
        tab: '经营'
      }
    ],
    done: [
      {
        id: 'done-1',
        title: '产品上架',
        description: '已完成',
        status: '已完成',
        assignee: '品牌负责人',
        deadline: '2025-02-28',
        relatedPlatform: '全平台',
        relatedSPU: 'SPU-001',
        relatedMetric: '总成交金额',
        tab: '经营'
      }
    ]
  },
  产品: {
    todo: [
      {
        id: 'todo-4',
        title: '优化产品结构',
        description: '调整头部/腰部/尾部产品比例',
        status: '待办',
        assignee: '品牌负责人',
        deadline: '2025-03-05',
        relatedPlatform: '全平台',
        relatedSPU: 'SPU-002',
        relatedMetric: '总成交金额',
        tab: '产品'
      }
    ],
    doing: [
      {
        id: 'doing-4',
        title: '商品页面优化',
        description: '提升商品转化率',
        status: '进行中',
        assignee: '品牌团队',
        deadline: '2025-03-04',
        relatedPlatform: '天猫',
        relatedSPU: 'SPU-002',
        relatedMetric: '总成交订单数',
        tab: '产品'
      }
    ],
    done: []
  },
  人群: {
    todo: [
      {
        id: 'todo-5',
        title: '扩大高价值人群',
        description: '提升高价值人群覆盖',
        status: '待办',
        assignee: '品牌负责人',
        deadline: '2025-03-05',
        relatedPlatform: '全平台',
        relatedSPU: 'SPU-003',
        relatedMetric: '总成交金额',
        tab: '人群'
      }
    ],
    doing: [
      {
        id: 'doing-5',
        title: '新客承接页优化',
        description: '提升新客转化率',
        status: '进行中',
        assignee: '品牌团队',
        deadline: '2025-03-04',
        relatedPlatform: '京东',
        relatedSPU: 'SPU-003',
        relatedMetric: '总成交订单数',
        tab: '人群'
      }
    ],
    done: []
  },
  评价: {
    todo: [
      {
        id: 'todo-6',
        title: '优化物流服务',
        description: '降低物流差评率',
        status: '待办',
        assignee: '品牌负责人',
        deadline: '2025-03-05',
        relatedPlatform: '全平台',
        relatedSPU: 'SPU-001',
        relatedMetric: '总退款率',
        tab: '评价'
      }
    ],
    doing: [
      {
        id: 'doing-6',
        title: '评价回复优化',
        description: '提升评价回复率',
        status: '进行中',
        assignee: '品牌团队',
        deadline: '2025-03-04',
        relatedPlatform: '全平台',
        relatedSPU: 'SPU-001',
        relatedMetric: '总成交订单数',
        tab: '评价'
      }
    ],
    done: []
  },
  费比: {
    todo: [
      {
        id: 'todo-7',
        title: '优化费用结构',
        description: '降低总费比至目标32%',
        status: '待办',
        assignee: '品牌负责人',
        deadline: '2025-03-05',
        relatedPlatform: '全平台',
        relatedSPU: 'SPU-001',
        relatedMetric: '总成交金额',
        tab: '费比'
      },
      {
        id: 'todo-8',
        title: '控制推广费比',
        description: '推广费比降至15%',
        status: '待办',
        assignee: '品牌负责人',
        deadline: '2025-03-06',
        relatedPlatform: '全平台',
        relatedSPU: 'SPU-002',
        relatedMetric: '佣金',
        tab: '费比'
      }
    ],
    doing: [
      {
        id: 'doing-7',
        title: '费用效率分析',
        description: '分析费用与GMV关系',
        status: '进行中',
        assignee: '品牌团队',
        deadline: '2025-03-04',
        relatedPlatform: '全平台',
        relatedSPU: 'SPU-001',
        relatedMetric: '总成交金额',
        tab: '费比'
      }
    ],
    done: []
  }
}

// 合并所有Tab的行动卡为"全部"
const allActionCards = {
  todo: Object.values(baseActionCards).flatMap(tab => tab.todo),
  doing: Object.values(baseActionCards).flatMap(tab => tab.doing),
  done: Object.values(baseActionCards).flatMap(tab => tab.done)
}

export const actionBoardData: Record<InsightTab | '全部', { todo: ActionCard[]; doing: ActionCard[]; done: ActionCard[] }> = {
  ...baseActionCards,
  全部: allActionCards
}


// 图表数据（按Tab分类）
export interface ChartData {
  type: 'trend' | 'bar' | 'pie' | 'table'
  label: string
  data: any
}

export const chartsByTab: Record<InsightTab, ChartData[]> = {
  经营: [
    {
      type: 'table',
      label: '分平台表现',
      data: {
        headers: ['平台', 'GMV', 'ROI', '订单数', '转化率'],
        rows: [
          ['抖音', '120万', '2.5', '1200', '3.2%'],
          ['天猫', '85万', '2.8', '850', '3.5%'],
          ['京东', '65万', '2.6', '650', '4.2%']
        ]
      }
    },
    {
      type: 'trend',
      label: 'GMV趋势',
      data: [
        { date: '2025-02-27', value: 2500000 },
        { date: '2025-02-28', value: 2700000 }
      ]
    },
    {
      type: 'trend',
      label: 'ROI趋势',
      data: [
        { date: '2025-02-27', value: 2.5 },
        { date: '2025-02-28', value: 2.6 }
      ]
    }
  ],
  产品: [
    {
      type: 'table',
      label: '核心SKU表现',
      data: {
        headers: ['SPU', 'GMV', 'ROI', '订单数', '转化率'],
        rows: [
          ['SPU-001', '90万', '3.5', '900', '4.2%'],
          ['SPU-002', '65万', '2.8', '650', '3.5%'],
          ['SPU-003', '45万', '2.2', '450', '2.8%'],
          ['SPU-004', '30万', '1.8', '300', '2.1%'],
          ['SPU-005', '20万', '1.5', '200', '1.5%']
        ]
      }
    },
    {
      type: 'bar',
      label: '商品结构',
      data: {
        labels: ['头部', '腰部', '尾部'],
        values: [35, 45, 20]
      }
    }
  ],
  人群: [
    {
      type: 'bar',
      label: '人群结构',
      data: {
        labels: ['新客', '老客', '会员'],
        values: [40, 35, 25]
      }
    },
    {
      type: 'table',
      label: '人群表现',
      data: {
        headers: ['人群', 'GMV', 'ROI', '转化率'],
        rows: [
          ['高价值人群', '80万', '3.5', '4.5%'],
          ['新客人群', '60万', '2.1', '2.1%'],
          ['复购人群', '75万', '3.2', '3.8%']
        ]
      }
    }
  ],
  费比: [
    {
      type: 'bar',
      label: '费用结构',
      data: {
        labels: ['投放费用', '站内推广费', '达人费用', '佣金', '平台服务费', '物流费用'],
        values: [35, 25, 15, 12, 8, 5]
      }
    },
    {
      type: 'table',
      label: '费比指标',
      data: {
        headers: ['指标', '当前值', '目标值', '状态'],
        rows: [
          ['总费比', '35.2%', '32%', '偏高'],
          ['推广费比', '18.5%', '15%', '偏高'],
          ['佣金费比', '12.3%', '12%', '正常']
        ]
      }
    },
    {
      type: 'trend',
      label: '费比趋势',
      data: [
        { date: '2025-02-27', value: 33.5 },
        { date: '2025-02-28', value: 35.2 }
      ]
    },
    {
      type: 'table',
      label: '费效关系',
      data: {
        headers: ['费用项', '费用', 'GMV', '费比', 'ROI'],
        rows: [
          ['投放费用', '95万', '270万', '35.2%', '2.8'],
          ['站内推广费', '68万', '270万', '25.2%', '4.0'],
          ['达人费用', '41万', '270万', '15.2%', '6.6'],
          ['佣金', '33万', '270万', '12.2%', '8.2']
        ]
      }
    }
  ],
  评价: [
    {
      type: 'pie',
      label: '评分分布',
      data: {
        labels: ['5星', '4星', '3星', '2星', '1星'],
        values: [60, 25, 10, 3, 2]
      }
    },
    {
      type: 'table',
      label: '评价关键词',
      data: {
        headers: ['关键词', '出现次数', '占比'],
        rows: [
          ['营养', '1250', '35%'],
          ['健康', '980', '28%'],
          ['口感', '750', '21%'],
          ['包装', '320', '9%'],
          ['物流', '280', '8%']
        ]
      }
    },
    {
      type: 'table',
      label: '差评原因Top',
      data: {
        headers: ['原因', '次数', '占比'],
        rows: [
          ['物流慢', '45', '35%'],
          ['包装破损', '28', '22%'],
          ['与描述不符', '25', '19%'],
          ['质量问题', '18', '14%'],
          ['其他', '12', '9%']
        ]
      }
    }
  ]
}

