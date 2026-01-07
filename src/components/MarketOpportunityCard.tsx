import { useState } from 'react'
import { Card, Modal } from './ui'
import { useNewProductFlowStore, type IdeaOpportunity } from '../store/newProductFlowStore'
import './MarketOpportunityCard.css'

export interface MarketOpportunity {
  id: string
  title: string // 格式：{人群} × {价格带} × {规格}：{组合名}
  opportunityScore: number // 机会分数
  evidenceExamples: Array<{
    name: string // 商品名
    specs: string // 规格信息
    gmv: string // GMV（如 ¥180.19万）
    price: string // 价格（如 ¥11.1）
  }>
  evidenceTable?: Array<{
    productName: string
    specs: string
    priceRange: string
    gmv: string
    roi?: string
    evidenceStrength?: string
  }>
}

interface MarketOpportunityCardProps {
  opportunity: MarketOpportunity
  onPushToNewProduct?: (id: string) => void
}

export default function MarketOpportunityCard({ opportunity, onPushToNewProduct }: MarketOpportunityCardProps) {
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false)
  const [showPushToast, setShowPushToast] = useState(false)
  const [isPushed, setIsPushed] = useState(false)
  const pushToPlanning = useNewProductFlowStore((state) => state.pushToPlanning)

  const handleEvidenceTable = () => {
    setIsEvidenceModalOpen(true)
  }

  const handlePushToNewProduct = () => {
    // 转换为 IdeaOpportunity 格式
    const idea: IdeaOpportunity = {
      id: opportunity.id,
      title: opportunity.title,
      score: opportunity.opportunityScore,
      evidenceSamples: opportunity.evidenceExamples.map(e => ({
        name: e.name,
        specs: e.specs,
        gmv: e.gmv,
        price: e.price
      })),
      createdAt: new Date().toISOString()
    }

    // 调用 store 方法
    pushToPlanning(idea)
    
    // 标记为已推入
    setIsPushed(true)
    
    // Toast 提示
    setShowPushToast(true)
    setTimeout(() => setShowPushToast(false), 2000)

    // 可选：调用回调
    if (onPushToNewProduct) {
      onPushToNewProduct(opportunity.id)
    }
  }

  const evidenceTableData = opportunity.evidenceTable || [
    { productName: '金典有机纯牛奶 250mL×12盒', specs: '有机奶源 蛋白营养 口感醇厚', priceRange: '69-79元', gmv: '¥180.19万', roi: '15.2%', evidenceStrength: '高' },
    { productName: '安慕希原味 205g×12瓶', specs: '浓醇口感 乳酸菌发酵 多口味矩阵', priceRange: '59-69元', gmv: '¥123.58万', roi: '12.8%', evidenceStrength: '中' },
    { productName: '优酸乳 原味 250mL×12盒', specs: '清爽酸甜 乳酸菌饮品 适合佐餐与日常', priceRange: '39-49元', gmv: '¥206.20万', roi: '18.5%', evidenceStrength: '高' },
    { productName: '金典有机纯牛奶 250mL×16盒', specs: '有机奶源 蛋白营养 口感醇厚', priceRange: '89-99元', gmv: '¥156.32万', roi: '14.1%', evidenceStrength: '中' },
    { productName: '安慕希蓝莓味 205g×12瓶', specs: '浓醇口感 乳酸菌发酵 多口味矩阵', priceRange: '59-69元', gmv: '¥198.76万', roi: '16.3%', evidenceStrength: '高' },
  ]

  return (
    <>
      <Card className="market-opportunity-card">
        {/* (1) 标题行 */}
        <div className="opportunity-title">{opportunity.title}</div>

        {/* (2) 机会分数行 */}
        <div className="opportunity-score-row">
          <span className="opportunity-score-label">机会分：</span>
          <span className="opportunity-score-value">{opportunity.opportunityScore.toFixed(1)}</span>
        </div>

        {/* (3) 证据示例区 */}
        <div className="opportunity-evidence">
          <div className="evidence-label">证据示例：</div>
          <div className="evidence-examples">
            {opportunity.evidenceExamples.map((evidence, index) => (
              <div key={index} className="evidence-item">
                {evidence.name} {evidence.specs}（{evidence.gmv}，{evidence.price}）；
              </div>
            ))}
          </div>
        </div>

        {/* (4) 按钮行 */}
        <div className="opportunity-actions">
          <button type="button" onClick={handleEvidenceTable} className="evidence-table-btn">
            证据表
          </button>
          <button
            type="button"
            onClick={handlePushToNewProduct}
            className="push-product-btn"
            disabled={isPushed}
          >
            {isPushed ? '已推入' : '推入新品'}
          </button>
        </div>

        {/* Toast 提示 */}
        {showPushToast && (
          <div className="push-toast">
            已推入企划期-待审批
          </div>
        )}
      </Card>

      {/* 证据表 Modal */}
      <Modal
        open={isEvidenceModalOpen}
        onClose={() => setIsEvidenceModalOpen(false)}
        title="证据表"
      >
        <div className="evidence-table-container">
          <table className="evidence-table">
            <thead>
              <tr>
                <th>商品名</th>
                <th>规格</th>
                <th>价格带</th>
                <th>GMV</th>
                <th>ROI</th>
                <th>证据强度</th>
              </tr>
            </thead>
            <tbody>
              {evidenceTableData.map((row, index) => (
                <tr key={index}>
                  <td>{row.productName}</td>
                  <td>{row.specs}</td>
                  <td>{row.priceRange}</td>
                  <td>{row.gmv}</td>
                  <td>{row.roi || '-'}</td>
                  <td>{row.evidenceStrength || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>
    </>
  )
}
