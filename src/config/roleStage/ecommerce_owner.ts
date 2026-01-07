// 电商负责人阶段配置
// 所有指标字段必须来自现有 mockData/metrics，不能新增字段

export type SectionType = 
  | 'kpi-cards'           // KPI卡片组
  | 'platform-breakdown'  // 平台拆分表格
  | 'funnel'              // 漏斗展示
  | 'platform-funnel-cards' // 平台漏斗小卡（抖音/天猫/京东）
  | 'anomaly-alert'       // 异动监控
  | 'status-bar'          // 状态条（冷启动第X天）
  | 'target-progress'     // 目标与进度
  | 'ai-insight-summary'  // AI洞察摘要（绿底卡片）
  | 'efficiency-panel'    // 效率面板
  | 'action-suggestions'  // 行动建议
  | 'time-selector'       // 时间选择器（放量期）
  | 'pacing'              // 目标节奏/达成进度
  | 'diagnosis'           // 漏斗/效率诊断
  | 'ai-diagnosis-cards'  // AI诊断卡片（红/黄/绿）
  | 'kanban-board'        // 任务看板
  | 'operation-logs'      // 操作记录

export interface KPICardConfig {
  type: 'kpi-cards'
  title?: string
  cards: Array<{
    label: string
    // 指标字段名（来自 metrics 的 name 或 Product 的 currentMetrics key）
    metricKey: string
    // 如果字段不存在，使用的替代字段（可选）
    fallbackMetricKey?: string
    unit?: string
    // 是否从 products 聚合计算（true）还是从 metrics 读取（false）
    aggregate?: boolean
  }>
}

export interface PlatformBreakdownConfig {
  type: 'platform-breakdown'
  title?: string
  platforms: Array<{
    name: string        // 展示名称：抖音/天猫/京东
    platformKey: string // 数据key：douyin/tmall/jd
    metrics: Array<{
      label: string
      metricKey: string  // 如 'douyin-total-sales' 对应 metrics 中的 id
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
    metricKey: string
    fallbackMetricKey?: string
  }>
}

export interface AnomalyAlertConfig {
  type: 'anomaly-alert'
  title?: string
  items: Array<{
    label: string
    metricKey: string
    changeType?: '环比' | '同比'
  }>
}

export interface StatusBarConfig {
  type: 'status-bar'
  // 状态条使用现有实现，此配置仅占位
}

export interface TargetProgressConfig {
  type: 'target-progress'
  title?: string
  metrics: Array<{
    label: string
    targetKey: string  // Product.targetMetrics 中的 key
    currentKey: string // Product.currentMetrics 中的 key
  }>
}

export interface EfficiencyPanelConfig {
  type: 'efficiency-panel'
  title?: string
  metrics: Array<{
    label: string
    metricKey: string
    fallbackMetricKey?: string
    unit?: string
    aggregate?: boolean
  }>
}

export interface ActionSuggestionsConfig {
  type: 'action-suggestions'
  title?: string
  // 静态文案，不做逻辑
  suggestions: string[]
}

export interface TimeSelectorConfig {
  type: 'time-selector'
  // 时间选择器使用现有实现，此配置仅占位
}

export interface PacingConfig {
  type: 'pacing'
  title?: string
  metrics: Array<{
    label: string
    targetKey: string
    currentKey: string
  }>
}

export interface DiagnosisConfig {
  type: 'diagnosis'
  title?: string
  steps: Array<{
    label: string
    metricKey: string
    fallbackMetricKey?: string
  }>
  riskTips?: string[]  // 静态风险提示文案
}

export interface PlatformFunnelCardsConfig {
  type: 'platform-funnel-cards'
  title?: string
  platforms: Array<{
    name: string
    platformKey: string
    steps: Array<{
      label: string
      value: number
    }>
  }>
}

export interface AIInsightSummaryConfig {
  type: 'ai-insight-summary'
  title?: string
  date?: string
  insights: string[]
  actionText?: string
}

export interface AIDiagnosisCardsConfig {
  type: 'ai-diagnosis-cards'
  title?: string
  cards: Array<{
    title: string
    conclusion: string
    suggestions: string[]
    severity: 'high' | 'medium' | 'low' | 'success'
  }>
}

export interface KanbanBoardConfig {
  type: 'kanban-board'
  title?: string
  columns: Array<{
    id: string
    title: string
    cards: Array<{
      id: string
      title: string
      deadline?: string
      assignee?: string
      status?: string
    }>
  }>
}

export interface OperationLogsConfig {
  type: 'operation-logs'
  title?: string
  logs: Array<{
    time: string
    action: string
  }>
}

export type StageSectionConfig = 
  | KPICardConfig
  | PlatformBreakdownConfig
  | FunnelConfig
  | PlatformFunnelCardsConfig
  | AnomalyAlertConfig
  | StatusBarConfig
  | TargetProgressConfig
  | AIInsightSummaryConfig
  | EfficiencyPanelConfig
  | ActionSuggestionsConfig
  | TimeSelectorConfig
  | PacingConfig
  | DiagnosisConfig
  | AIDiagnosisCardsConfig
  | KanbanBoardConfig
  | OperationLogsConfig

export interface StageConfig {
  sections: StageSectionConfig[]
}

export const ecommerceOwnerStageConfig = {
  overview: {
    sections: [
      {
        type: 'kpi-cards',
        title: '核心经营总览',
        cards: [
          {
            label: '总GMV',
            metricKey: '总成交金额',
            aggregate: true,
            unit: '元'
          },
          {
            label: '总ROI',
            // 注意：ROI字段不在现有数据中，使用佣金作为替代展示
            metricKey: '佣金',
            fallbackMetricKey: '总成交金额',
            unit: '',
            aggregate: false
          },
          {
            label: '总退款率',
            metricKey: '总退款率',
            unit: '%',
            aggregate: false
          },
          {
            label: '总订单数',
            metricKey: '总成交订单数',
            aggregate: true,
            unit: '单'
          },
          {
            label: '客单价',
            metricKey: '客单价',
            unit: '元',
            aggregate: false
          }
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
              {
                label: 'GMV',
                metricKey: 'douyin-total-sales',
                unit: '元'
              },
              {
                label: '订单数',
                metricKey: 'douyin-total-orders',
                unit: '单'
              },
              {
                label: '退款率',
                metricKey: 'douyin-refund-rate',
                unit: '%'
              }
            ]
          },
          {
            name: '天猫',
            platformKey: 'tmall',
            metrics: [
              {
                label: '销售额',
                metricKey: 'tmall-sales',
                unit: '元'
              },
              {
                label: '转化率',
                metricKey: 'tmall-conversion',
                unit: '%'
              }
            ]
          },
          {
            name: '京东',
            platformKey: 'jd',
            metrics: [
              {
                label: '销售额',
                metricKey: 'jd-sales',
                unit: '元'
              },
              {
                label: '转化率',
                metricKey: 'jd-conversion',
                unit: '%'
              }
            ]
          }
        ]
      } as PlatformBreakdownConfig,
      {
        type: 'funnel',
        title: '关键漏斗',
        steps: [
          {
            label: '曝光',
            // 注意：曝光字段不存在，使用内容播放量作为替代
            metricKey: 'content-views',
            fallbackMetricKey: 'douyin-total-orders'
          },
          {
            label: '点击',
            // 注意：点击字段不存在，使用订单数作为替代展示
            metricKey: 'douyin-total-orders',
            fallbackMetricKey: 'tmall-traffic'
          },
          {
            label: '下单/支付',
            metricKey: '总成交订单数',
            aggregate: true
          }
        ]
      } as FunnelConfig,
      {
        type: 'platform-funnel-cards',
        title: '多平台漏斗',
        platforms: [
          {
            name: '抖音',
            platformKey: 'douyin',
            steps: [
              { label: '曝光', value: 5000000 },
              { label: '点击', value: 300000 },
              { label: '下单', value: 15000 },
              { label: '支付', value: 12500 }
            ]
          },
          {
            name: '天猫',
            platformKey: 'tmall',
            steps: [
              { label: '曝光', value: 3500000 },
              { label: '点击', value: 210000 },
              { label: '下单', value: 10500 },
              { label: '支付', value: 8500 }
            ]
          },
          {
            name: '京东',
            platformKey: 'jd',
            steps: [
              { label: '曝光', value: 2800000 },
              { label: '点击', value: 168000 },
              { label: '下单', value: 8400 },
              { label: '支付', value: 6500 }
            ]
          }
        ]
      } as PlatformFunnelCardsConfig,
      {
        type: 'action-suggestions',
        title: '行动建议',
        suggestions: [
          '建议优化商品页面和详情，提升转化率',
          '加强投放力度，扩大市场份额',
          '提升搜索流量，优化关键词策略',
          '治理退款问题，分析退货原因'
        ]
      } as ActionSuggestionsConfig
    ]
  } as StageConfig,

  coldStart: {
    sections: [
      {
        type: 'status-bar'
        // 状态条使用现有实现（冷启动第X天），此配置仅占位
      } as StatusBarConfig,
      {
        type: 'target-progress',
        title: '冷启动阶段目标与进度',
        metrics: [
          {
            label: '总成交金额',
            targetKey: '总成交金额',
            currentKey: '总成交金额'
          },
          {
            label: '总成交订单数',
            targetKey: '总成交订单数',
            currentKey: '总成交订单数'
          },
          {
            label: '客单价',
            targetKey: '客单价',
            currentKey: '客单价'
          }
        ]
      } as TargetProgressConfig,
      {
        type: 'ai-insight-summary',
        title: 'AI洞察摘要',
        date: '2024-01-25',
        insights: [
          '本周期GMV达成率85%，表现良好',
          '整体ROI保持在3.0以上，建议保持当前策略',
          '退款率较上周下降0.2%，治理效果明显',
          '建议继续优化商品页，提升转化率'
        ],
        actionText: '查看详情'
      } as AIInsightSummaryConfig,
      {
        type: 'efficiency-panel',
        title: '核心效率面板',
        metrics: [
          {
            label: '总成交金额',
            metricKey: '总成交金额',
            aggregate: true,
            unit: '元'
          },
          {
            label: '转化率',
            metricKey: 'tmall-conversion',
            fallbackMetricKey: 'jd-conversion',
            unit: '%'
          },
          {
            label: '退款率',
            metricKey: '总退款率',
            unit: '%'
          }
        ]
      } as EfficiencyPanelConfig,
      {
        type: 'platform-breakdown',
        title: '分平台冷启动表现',
        platforms: [
          {
            name: '抖音',
            platformKey: 'douyin',
            metrics: [
              {
                label: 'GMV',
                metricKey: 'douyin-total-sales',
                unit: '元'
              },
              {
                label: '退款率',
                metricKey: 'douyin-refund-rate',
                unit: '%'
              }
            ]
          },
          {
            name: '天猫',
            platformKey: 'tmall',
            metrics: [
              {
                label: '销售额',
                metricKey: 'tmall-sales',
                unit: '元'
              },
              {
                label: '转化率',
                metricKey: 'tmall-conversion',
                unit: '%'
              }
            ]
          },
          {
            name: '京东',
            platformKey: 'jd',
            metrics: [
              {
                label: '销售额',
                metricKey: 'jd-sales',
                unit: '元'
              },
              {
                label: '转化率',
                metricKey: 'jd-conversion',
                unit: '%'
              }
            ]
          }
        ]
      } as PlatformBreakdownConfig,
      {
        type: 'action-suggestions',
        title: '行动建议',
        suggestions: [
          '建议优化商品页和详情，提升转化率',
          '加强投放力度，扩大市场份额',
          '提升搜索流量，优化关键词策略',
          '治理退款问题，分析退货原因',
          '收集并分析用户评价，优化产品体验'
        ]
      } as ActionSuggestionsConfig,
      {
        type: 'kanban-board',
        title: '任务看板',
        columns: [
          {
            id: 'todo',
            title: '待处理',
            cards: [
              { id: 'todo-1', title: '优化商品页', deadline: '2024-01-26', assignee: '运营团队' },
              { id: 'todo-2', title: '加强投放', deadline: '2024-01-27', assignee: '流量团队' },
              { id: 'todo-3', title: '分析退款原因', deadline: '2024-01-28', assignee: '客服团队' }
            ]
          },
          {
            id: 'doing',
            title: '进行中',
            cards: [
              { id: 'doing-1', title: '提升搜索流量', deadline: '2024-01-25', assignee: 'SEO团队' },
              { id: 'doing-2', title: '优化关键词', deadline: '2024-01-26', assignee: '流量团队' }
            ]
          },
          {
            id: 'done',
            title: '已完成',
            cards: [
              { id: 'done-1', title: '收集用户评价', deadline: '2024-01-24', assignee: '产品团队' }
            ]
          }
        ]
      } as KanbanBoardConfig,
      {
        type: 'operation-logs',
        title: '操作记录',
        logs: [
          { time: '2024-01-25 14:30', action: '调整目标：总成交金额提升至 300万' },
          { time: '2024-01-25 13:20', action: '分配任务：优化商品页给运营团队' },
          { time: '2024-01-25 12:15', action: '确认素材：新商品详情页已上线' },
          { time: '2024-01-25 11:00', action: '复盘会议：冷启动期表现良好' },
          { time: '2024-01-24 18:20', action: '调整目标：总订单数提升至 3000单' },
          { time: '2024-01-24 17:10', action: '分配任务：分析退款原因给客服团队' },
          { time: '2024-01-24 16:00', action: '确认素材：新推广素材已审核通过' }
        ]
      } as OperationLogsConfig
    ]
  } as StageConfig,

  scaleUp: {
    sections: [
      {
        type: 'time-selector'
        // 时间选择器使用现有实现，此配置仅占位
      } as TimeSelectorConfig,
      {
        type: 'kpi-cards',
        title: '放量期经营总览',
        cards: [
          {
            label: '总GMV',
            metricKey: '总成交金额',
            aggregate: true,
            unit: '元'
          },
          {
            label: '总ROI',
            metricKey: '佣金',
            fallbackMetricKey: '总成交金额',
            unit: '',
            aggregate: false
          },
          {
            label: '退款率',
            metricKey: '总退款率',
            unit: '%',
            aggregate: false
          },
          {
            label: '总订单数',
            metricKey: '总成交订单数',
            aggregate: true,
            unit: '单'
          },
          {
            label: '客单价',
            metricKey: '客单价',
            unit: '元',
            aggregate: false
          }
        ]
      } as KPICardConfig,
      {
        type: 'pacing',
        title: '目标节奏/达成进度',
        metrics: [
          {
            label: '总成交金额',
            targetKey: '总成交金额',
            currentKey: '总成交金额'
          },
          {
            label: '总成交订单数',
            targetKey: '总成交订单数',
            currentKey: '总成交订单数'
          }
        ]
      } as PacingConfig,
      {
        type: 'ai-insight-summary',
        title: 'AI洞察摘要',
        date: '2024-01-25',
        insights: [
          '放量期GMV持续增长，建议扩大投放规模',
          '整体ROI保持稳定，建议保持当前策略',
          '退款率需要持续监控，建议分析退货原因',
          '建议加大推广力度，扩大市场份额'
        ],
        actionText: '查看详情'
      } as AIInsightSummaryConfig,
      {
        type: 'platform-breakdown',
        title: '分平台拆分',
        platforms: [
          {
            name: '抖音',
            platformKey: 'douyin',
            metrics: [
              {
                label: 'GMV',
                metricKey: 'douyin-total-sales',
                unit: '元'
              },
              {
                label: '订单数',
                metricKey: 'douyin-total-orders',
                unit: '单'
              },
              {
                label: '退款率',
                metricKey: 'douyin-refund-rate',
                unit: '%'
              }
            ]
          },
          {
            name: '天猫',
            platformKey: 'tmall',
            metrics: [
              {
                label: '销售额',
                metricKey: 'tmall-sales',
                unit: '元'
              },
              {
                label: '转化率',
                metricKey: 'tmall-conversion',
                unit: '%'
              }
            ]
          },
          {
            name: '京东',
            platformKey: 'jd',
            metrics: [
              {
                label: '销售额',
                metricKey: 'jd-sales',
                unit: '元'
              },
              {
                label: '转化率',
                metricKey: 'jd-conversion',
                unit: '%'
              }
            ]
          }
        ]
      } as PlatformBreakdownConfig,
      {
        type: 'funnel',
        title: '转化漏斗',
        steps: [
          {
            label: '曝光',
            metricKey: 'content-views',
            fallbackMetricKey: 'douyin-total-orders'
          },
          {
            label: '点击',
            metricKey: 'douyin-total-orders',
            fallbackMetricKey: 'tmall-traffic'
          },
          {
            label: '转化',
            metricKey: 'tmall-conversion',
            fallbackMetricKey: 'jd-conversion'
          },
          {
            label: '支付',
            metricKey: '总成交订单数'
          },
          {
            label: '退货',
            metricKey: '总退款率'
          }
        ]
      } as FunnelConfig,
      {
        type: 'platform-funnel-cards',
        title: '分平台漏斗',
        platforms: [
          {
            name: '天猫',
            platformKey: 'tmall',
            steps: [
              { label: '曝光', value: 3500000 },
              { label: '点击', value: 210000 },
              { label: '下单', value: 10500 },
              { label: '支付', value: 8500 }
            ]
          },
          {
            name: '京东',
            platformKey: 'jd',
            steps: [
              { label: '曝光', value: 2800000 },
              { label: '点击', value: 168000 },
              { label: '下单', value: 8400 },
              { label: '支付', value: 6500 }
            ]
          },
          {
            name: '抖音',
            platformKey: 'douyin',
            steps: [
              { label: '曝光', value: 5000000 },
              { label: '点击', value: 300000 },
              { label: '下单', value: 15000 },
              { label: '支付', value: 12500 }
            ]
          }
        ]
      } as PlatformFunnelCardsConfig,
      {
        type: 'ai-diagnosis-cards',
        title: 'AI诊断',
        cards: [
          {
            title: '转化率偏低',
            conclusion: '当前转化率较目标存在一定差距',
            suggestions: ['建议优化产品页面', '提升商品详情质量'],
            severity: 'high'
          },
          {
            title: '退款率正常',
            conclusion: '退款率保持在合理区间',
            suggestions: ['建议继续保持', '持续监控退货原因'],
            severity: 'success'
          },
          {
            title: 'ROI表现稳定',
            conclusion: '整体ROI保持稳定',
            suggestions: ['建议保持当前策略', '可考虑扩大投放规模'],
            severity: 'low'
          },
          {
            title: '流量获取需优化',
            conclusion: '搜索流量占比偏低',
            suggestions: ['建议优化关键词策略', '加强SEO优化'],
            severity: 'medium'
          }
        ]
      } as AIDiagnosisCardsConfig,
      {
        type: 'kanban-board',
        title: '任务看板',
        columns: [
          {
            id: 'todo',
            title: '待处理',
            cards: [
              { id: 'todo-1', title: '扩大投放规模', deadline: '2024-01-26', assignee: '流量团队' },
              { id: 'todo-2', title: '优化产品页面', deadline: '2024-01-27', assignee: '运营团队' },
              { id: 'todo-3', title: '分析退货原因', deadline: '2024-01-28', assignee: '客服团队' }
            ]
          },
          {
            id: 'doing',
            title: '进行中',
            cards: [
              { id: 'doing-1', title: '加大推广力度', deadline: '2024-01-25', assignee: '市场团队' },
              { id: 'doing-2', title: '拓展新渠道', deadline: '2024-01-26', assignee: 'BD团队' }
            ]
          },
          {
            id: 'done',
            title: '已完成',
            cards: [
              { id: 'done-1', title: '扩大生产规模', deadline: '2024-01-24', assignee: '供应链团队' }
            ]
          }
        ]
      } as KanbanBoardConfig,
      {
        type: 'operation-logs',
        title: '操作记录',
        logs: [
          { time: '2024-01-25 14:30', action: '调整目标：总成交金额提升至 500万' },
          { time: '2024-01-25 13:20', action: '分配任务：扩大投放规模给流量团队' },
          { time: '2024-01-25 12:15', action: '确认素材：新推广素材已审核通过' },
          { time: '2024-01-25 11:00', action: '复盘会议：放量期表现优异' },
          { time: '2024-01-24 18:20', action: '调整目标：总订单数提升至 5000单' },
          { time: '2024-01-24 17:10', action: '分配任务：拓展新渠道给BD团队' },
          { time: '2024-01-24 16:00', action: '确认素材：新商品详情页已上线' }
        ]
      } as OperationLogsConfig
    ]
  } as StageConfig
}

