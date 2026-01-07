import { useEffect, useState } from 'react'
import MainLayout from '../../components/layout/MainLayout'
import PageHeader from '../../components/layout/PageHeader'
import FilterBar from '../../components/layout/FilterBar'
import { Card, Button } from '../../components/ui'
import { useAppStore } from '../../store/appStore'
import { getRoleById, getMetricsByRole, getProducts, type Product } from '../../data/mockData'
import { ecommerceOwnerStageConfig } from '../../config/roleStage/ecommerce_owner'
import { brandOwnerStageConfig } from '../../config/roleStage/bu_brand_owner'
import { marketAnalysisStageConfig } from '../../config/roleStage/market_analysis'
import { douyinShopOpsStageConfig } from '../../config/roleStage/douyin_store_live'
import { ecommerceBDStageConfig } from '../../config/roleStage/ecommerce_bd'
import { douyinAdsStageConfig } from '../../config/roleStage/douyin_ads'
import { jdTrafficStageConfig } from '../../config/roleStage/jd_traffic'
import { jdOperatorStageConfig } from '../../config/roleStage/jd_ops'
import { getTmallTrafficOpsStageConfig } from '../../config/roleStage/tmall_traffic_ops'
import TmallTrafficOpsStageRenderer from '../../components/roleStage/TmallTrafficOpsStageRenderer'
import { getTmallOpsStageConfig } from '../../config/roleStage/tmall_ops'
import TmallOpsStageRenderer from '../../components/roleStage/TmallOpsStageRenderer'
import StageSectionRenderer from '../../components/roleStage/StageSectionRenderer'
// 动态 Owner 配置与 TmallOps 渲染器回退移除
import BrandOwnerStageRenderer from '../../components/roleStage/BrandOwnerStageRenderer'
import MarketAnalysisStageRenderer from '../../components/roleStage/MarketAnalysisStageRenderer'
import DouyinShopOpsStageRenderer from '../../components/roleStage/DouyinShopOpsStageRenderer'
import DouyinBizStageRenderer from '../../components/roleStage/DouyinBizStageRenderer'
import DouyinAdsStageRenderer from '../../components/roleStage/DouyinAdsStageRenderer'
import JdTrafficStageRenderer from '../../components/roleStage/JdTrafficStageRenderer'
import JdOperatorStageRenderer from '../../components/roleStage/JdOperatorStageRenderer'
import DouyinContentStageRenderer from '../../components/roleStage/DouyinContentStageRenderer'
import './OverviewPage.css'

// 根据角色ID生成不同的mock数据
const getRoleSpecificData = (roleId: string) => {
  const baseData: Record<string, any> = {
    'douyin_ads': {
      title: '抖音投放数据',
      cards: [
        { label: '投放金额', value: '45万', unit: '元' },
        { label: '投放次数', value: '156', unit: '次' },
        { label: 'ROI', value: '3.2', unit: '' }
      ],
      listTitle: '投放效果',
      listItems: [
        '信息流广告 - ROI 3.5',
        '品牌广告 - ROI 2.8',
        '效果广告 - ROI 3.8'
      ]
    },
    'douyin_content': {
      title: '抖音内容制作数据',
      cards: [
        { label: '内容播放量', value: '250万', unit: '次' },
        { label: '内容数', value: '85', unit: '个' },
        { label: '平均播放', value: '2.9万', unit: '次' }
      ],
      listTitle: '内容表现',
      listItems: [
        '短视频内容 - 播放量 180万',
        '直播内容 - 观看量 70万',
        '图文内容 - 阅读量 50万'
      ]
    },
    'douyin_store_live': {
      title: '抖音店播运营数据',
      cards: [
        { label: '总成交金额', value: '45万', unit: '元' },
        { label: '总订单数', value: '450', unit: '单' },
        { label: '客单价', value: '1000', unit: '元' }
      ],
      listTitle: '成交渠道',
      listItems: [
        '短视频成交 - 18万',
        '直播成交 - 20万',
        '商品卡成交 - 7万'
      ]
    },
    'ecommerce_bd': {
      title: '电商商务数据',
      cards: [
        { label: '达人合作数', value: '15', unit: '人' },
        { label: '资源位数量', value: '8', unit: '个' },
        { label: '合作金额', value: '35万', unit: '元' }
      ],
      listTitle: '商务合作',
      listItems: [
        '头部达人合作 - 5人',
        '腰部达人合作 - 10人',
        '资源位合作 - 8个'
      ]
    },
    'tmall_ops': {
      title: '天猫运营数据',
      cards: [
        { label: '天猫销售额', value: '85万', unit: '元' },
        { label: '天猫流量', value: '5万', unit: 'UV' },
        { label: '转化率', value: '3.5%', unit: '' }
      ],
      listTitle: '天猫运营',
      listItems: [
        '店铺流量持续增长',
        '转化率保持稳定',
        '销售额较上月提升15%'
      ]
    },
    'tmall_traffic': {
      title: '天猫流量数据',
      cards: [
        { label: '自然流量', value: '3.5万', unit: 'UV' },
        { label: '付费流量', value: '1.5万', unit: 'UV' },
        { label: '流量转化', value: '4.2%', unit: '' }
      ],
      listTitle: '流量来源',
      listItems: [
        '搜索流量 - 2.5万 UV',
        '推荐流量 - 1.2万 UV',
        '活动流量 - 1.3万 UV'
      ]
    },
    'jd_ops': {
      title: '京东运营数据',
      cards: [
        { label: '京东销售额', value: '65万', unit: '元' },
        { label: '京东流量', value: '3.5万', unit: 'UV' },
        { label: '转化率', value: '4.2%', unit: '' }
      ],
      listTitle: '京东运营',
      listItems: [
        '店铺排名提升',
        '转化率持续改善',
        '销售额增长12%'
      ]
    },
    'jd_traffic': {
      title: '京东流量数据',
      cards: [
        { label: '自然流量', value: '2.5万', unit: 'UV' },
        { label: '付费流量', value: '1万', unit: 'UV' },
        { label: '流量转化', value: '5.1%', unit: '' }
      ],
      listTitle: '流量来源',
      listItems: [
        '搜索流量 - 1.8万 UV',
        '推荐流量 - 0.9万 UV',
        '活动流量 - 0.8万 UV'
      ]
    },
    'bu_brand_owner': {
      title: '品牌管理数据',
      cards: [
        { label: '品牌知名度', value: '78', unit: '分' },
        { label: '品牌价值', value: '850', unit: '万元' },
        { label: '用户认知度', value: '65%', unit: '' }
      ],
      listTitle: '品牌策略',
      listItems: [
        '品牌定位策略优化建议',
        '价格策略调整方案',
        '品牌形象提升计划'
      ]
    },
    'ecommerce_owner': {
      title: '电商运营数据',
      cards: [
        { label: '总成交金额', value: '125万', unit: '元' },
        { label: '总订单数', value: '1250', unit: '单' },
        { label: '客单价', value: '1000', unit: '元' }
      ],
      listTitle: '平台表现',
      listItems: [
        '天猫平台 - 成交额 85万',
        '京东平台 - 成交额 65万',
        '抖音平台 - 成交额 45万'
      ]
    },
    'market_analysis': {
      title: '市场分析数据',
      cards: [
        { label: '市场规模', value: '5.2M', unit: '元' },
        { label: '竞争指数', value: '6.5', unit: '/10' },
        { label: '市场份额', value: '12%', unit: '' }
      ],
      listTitle: '市场趋势',
      listItems: [
        '消费电子类产品需求上升',
        '健康监测功能成为新趋势',
        '快充技术成为标配'
      ]
    }
  }

  return baseData[roleId] || baseData['market_analysis']
}

export default function OverviewPage() {
  const { currentRoleId, setCurrentStage, dateA, dateB } = useAppStore()
  const [roleData, setRoleData] = useState<any>(null)
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    setCurrentStage('overview')
  }, [setCurrentStage])

  useEffect(() => {
    if (currentRoleId) {
      const data = getRoleSpecificData(currentRoleId)
      setRoleData(data)
    }
  }, [currentRoleId])

  useEffect(() => {
    // 获取所有产品用于电商负责人总览
    const allProducts = getProducts()
    setProducts(allProducts)
  }, [])

  const role = currentRoleId ? getRoleById(currentRoleId) : null
  const metrics = currentRoleId ? getMetricsByRole(currentRoleId) : []

  // 仅电商负责人可见"商品管理"模块
  const showProductManagement = currentRoleId === 'ecommerce_owner'

  // 抖音内容制作使用专用渲染器
  if (currentRoleId === 'douyin_content') {
    return (
      <MainLayout>
        <PageHeader
          title="抖音内容制作（总览）"
          subtitle="内容创作和管理"
        />
        <FilterBar showDateFilter showSearch showCategoryFilter />
        <DouyinContentStageRenderer
          sections={[]}
          products={products}
          metrics={metrics}
          roleId={currentRoleId}
          stage="overview"
          dateRangeA={dateA || '2024-01-01'}
          dateRangeB={dateB || '2024-01-31'}
        />
      </MainLayout>
    )
  }

  // 电商负责人使用配置化渲染（回退到原有实现）
  if (currentRoleId === 'ecommerce_owner') {
    return (
      <MainLayout>
        <PageHeader
          title={`${role?.name || '电商负责人'} - 总览`}
          subtitle={role?.description}
        />
        <StageSectionRenderer
          sections={ecommerceOwnerStageConfig.overview.sections}
          products={products}
          metrics={metrics}
          roleId={currentRoleId}
        />
      </MainLayout>
    )
  }

  if (!role || !roleData) {
    return (
      <MainLayout>
        <div style={{ padding: '2rem' }}>
          <p>加载中...</p>
        </div>
      </MainLayout>
    )
  }

  // 电商负责人使用配置化渲染
  if (currentRoleId === 'ecommerce_owner') {
    return (
      <MainLayout>
        <PageHeader
          title={`${role.name} - 总览`}
          subtitle={role.description}
        />
        <StageSectionRenderer
          sections={ecommerceOwnerStageConfig.overview.sections}
          products={products}
          metrics={metrics}
          roleId={currentRoleId}
        />
      </MainLayout>
    )
  }

  // BU品牌负责人使用配置化渲染
  if (currentRoleId === 'bu_brand_owner') {
    return (
      <MainLayout>
        <PageHeader
          title={`${role.name} - 总览`}
          subtitle={role.description}
        />
        <BrandOwnerStageRenderer
          sections={brandOwnerStageConfig.overview.sections}
          products={products}
          metrics={metrics}
          roleId={currentRoleId}
          stage="overview"
        />
      </MainLayout>
    )
  }

  // 市场分析使用配置化渲染
  if (currentRoleId === 'market_analysis') {
    return (
      <MainLayout>
        <PageHeader
          title="市场分析（Owner/市场分析） - 总览"
          subtitle="市场机会洞察与经营诊断"
        />
        <MarketAnalysisStageRenderer
          sections={marketAnalysisStageConfig.overview.sections}
          products={products}
          metrics={metrics}
          roleId={currentRoleId}
          stage="overview"
        />
      </MainLayout>
    )
  }

  // 抖音店播运营使用配置化渲染
  if (currentRoleId === 'douyin_store_live') {
    return (
      <MainLayout>
        <PageHeader
          title={`${role.name} - 总览`}
          subtitle={role.description}
        />
        <DouyinShopOpsStageRenderer
          sections={douyinShopOpsStageConfig.overview.sections}
          products={products}
          metrics={metrics}
          roleId={currentRoleId}
          stage="overview"
        />
      </MainLayout>
    )
  }

  // 电商商务（达人/资源位）使用配置化渲染
  if (currentRoleId === 'ecommerce_bd') {
    return (
      <MainLayout>
        <PageHeader
          title="抖音商务（总览）"
          subtitle={role.description}
        />
        <DouyinBizStageRenderer
          sections={ecommerceBDStageConfig.overview.sections}
          products={products}
          metrics={metrics}
          roleId={currentRoleId}
          stage="overview"
        />
      </MainLayout>
    )
  }

  // 天猫运营使用专用渲染器
  if (currentRoleId === 'tmall_ops') {
    const config = getTmallOpsStageConfig('overview', dateA || '2025-02-27', dateB || '2025-02-28')
    return (
      <MainLayout>
        <PageHeader
          title="天猫运营（总览）"
          subtitle="天猫平台运营管理"
        />
        <FilterBar showDateFilter showSearch showCategoryFilter />
        <TmallOpsStageRenderer
          sections={config.sections}
          products={products}
          metrics={metrics}
          roleId={currentRoleId}
          stage="overview"
          dateRangeA={dateA || '2025-02-27'}
          dateRangeB={dateB || '2025-02-28'}
        />
      </MainLayout>
    )
  }

  // 抖音投放使用配置化渲染
  if (currentRoleId === 'douyin_ads') {
    return (
      <MainLayout>
        <PageHeader
          title="抖音投放（总览）"
          subtitle={role.description}
        />
        <DouyinAdsStageRenderer
          sections={douyinAdsStageConfig.overview.sections}
          products={products}
          metrics={metrics}
          roleId={currentRoleId}
          stage="overview"
        />
      </MainLayout>
    )
  }

  // 京东流量运营使用配置化渲染
  if (currentRoleId === 'jd_traffic') {
    return (
      <MainLayout>
        <PageHeader
          title="京东流量运营（总览）"
          subtitle={role.description}
        />
        <JdTrafficStageRenderer
          sections={jdTrafficStageConfig.overview.sections}
          products={products}
          metrics={metrics}
          roleId={currentRoleId}
          stage="overview"
        />
      </MainLayout>
    )
  }

  // 京东运营使用配置化渲染
  if (currentRoleId === 'jd_ops') {
    return (
      <MainLayout>
        <PageHeader
          title="京东运营（总览）"
          subtitle={role.description}
        />
        <JdOperatorStageRenderer
          sections={jdOperatorStageConfig.overview.sections}
          products={products}
          metrics={metrics}
          roleId={currentRoleId}
          stage="overview"
        />
      </MainLayout>
    )
  }

  // 天猫流量运营使用配置化渲染（动态生成A/B）
  if (currentRoleId === 'tmall_traffic') {
    const dateRangeA = dateA || '2025-02-27'
    const dateRangeB = dateB || '2025-02-28'
    const config = getTmallTrafficOpsStageConfig('overview', dateRangeA, dateRangeB)
    return (
      <MainLayout>
        <PageHeader
          title="天猫流量运营（总览）"
          subtitle={role.description}
        />
        <FilterBar showDateFilter showSearch showCategoryFilter />
        <TmallTrafficOpsStageRenderer
          sections={config.sections}
          products={products}
          metrics={metrics}
          roleId={currentRoleId}
          stage="overview"
        />
      </MainLayout>
    )
  }

  // 天猫运营使用配置化渲染
  if (currentRoleId === 'tmall_ops') {
    const dateRangeA = dateA || '2025-02-27'
    const dateRangeB = dateB || '2025-02-28'
    const config = getTmallOpsStageConfig('overview', dateRangeA, dateRangeB)
    const metrics = getMetricsByRole('tmall_ops')
    return (
      <MainLayout>
        <PageHeader
          title="天猫运营（总览）"
          subtitle={role.description}
        />
        <FilterBar showDateFilter showSearch showCategoryFilter />
        <TmallOpsStageRenderer
          sections={config.sections}
          products={products}
          metrics={metrics}
          roleId={currentRoleId}
          stage="overview"
        />
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <PageHeader
        title={`${role.name} - 总览`}
        subtitle={role.description}
      />
      <div className="overview-content">
        <div className="overview-cards">
          {roleData.cards.map((card: any, index: number) => (
            <Card key={index} padding="large" hoverable>
              <div className="overview-card">
                <div className="overview-card-label">{card.label}</div>
                <div className="overview-card-value">
                  {card.value}
                  {card.unit && <span className="overview-card-unit">{card.unit}</span>}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* 商品管理模块 - 仅电商负责人可见 */}
        {showProductManagement && (
          <div className="overview-module-section">
            <Card padding="large" hoverable>
              <div className="module-header">
                <h2 className="module-title">商品管理</h2>
                <Button variant="primary" onClick={() => console.log('进入商品管理')}>
                  进入模块 →
                </Button>
              </div>
              <p className="module-description">维护商品信息，管理商品库存和状态</p>
            </Card>
          </div>
        )}

        {metrics.length > 0 && (
          <div className="overview-metrics">
            <h2 className="overview-section-title">相关指标</h2>
            <div className="overview-metrics-grid">
              {metrics.slice(0, 6).map((metric) => (
                <Card key={metric.id} padding="medium" hoverable>
                  <div className="overview-metric-item">
                    <div className="overview-metric-name">{metric.name}</div>
                    <div className="overview-metric-value">
                      {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                      {metric.unit && <span className="overview-metric-unit">{metric.unit}</span>}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="overview-list">
          <Card padding="large">
            <h2 className="overview-section-title">{roleData.listTitle}</h2>
            <ul className="overview-list-items">
              {roleData.listItems.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
