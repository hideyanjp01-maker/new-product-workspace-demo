import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkflowStore } from '../store/workflowStore'
import './WorkflowPage.css'

export default function WorkflowPage() {
  const navigate = useNavigate()
  const {
    currentStep,
    steps,
    startWorkflow,
    nextStep,
    previousStep,
    updateStepStatus,
    resetWorkflow,
    goToStep
  } = useWorkflowStore()

  useEffect(() => {
    // 页面加载时自动开始工作流
    if (steps[0].status === 'pending') {
      startWorkflow()
    }
  }, [])

  const handleStepAction = (stepId: string, action: 'complete' | 'fail') => {
    const status = action === 'complete' ? 'completed' : 'failed'
    updateStepStatus(stepId, status)
    
    if (action === 'complete' && currentStep < steps.length - 1) {
      setTimeout(() => {
        nextStep()
      }, 500)
    }
  }

  const currentStepData = steps[currentStep]

  return (
    <div className="workflow-page">
      <div className="workflow-header">
        <h1>工作流管理</h1>
        <button className="reset-btn" onClick={resetWorkflow}>
          重置工作流
        </button>
      </div>

      <div className="workflow-container">
        <div className="workflow-steps">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`workflow-step ${step.status} ${index === currentStep ? 'current' : ''} ${step.route ? 'clickable' : ''}`}
              onClick={() => {
                if (step.route) {
                  goToStep(index)
                  navigate(step.route)
                }
              }}
            >
              <div className="step-indicator">
                <div className="step-number">
                  {step.status === 'completed' ? '✓' :
                   step.status === 'failed' ? '✗' :
                   step.status === 'in-progress' ? '→' : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`step-connector ${step.status === 'completed' ? 'completed' : ''}`} />
                )}
              </div>
              <div className="step-content">
                <h3>{step.name}</h3>
                <p>{step.description}</p>
                {step.route && (
                  <div className="step-action">
                    <span className="step-link">点击进入 →</span>
                  </div>
                )}
                {step.data && (
                  <div className="step-data">
                    <pre>{JSON.stringify(step.data, null, 2)}</pre>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="workflow-actions">
          <div className="current-step-panel">
            <h2>当前步骤: {currentStepData.name}</h2>
            <p>{currentStepData.description}</p>
            
            {currentStepData.status === 'in-progress' && (
              <div className="step-form">
                {currentStepData.route ? (
                  <div className="step-navigation">
                    <p>点击下方按钮进入角色页面进行操作</p>
                    <button
                      className="action-btn primary"
                      onClick={() => {
                        if (currentStepData.route) {
                          navigate(currentStepData.route)
                        }
                      }}
                    >
                      进入 {currentStepData.name} 页面
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="form-group">
                      <label>产品名称</label>
                      <input type="text" placeholder="请输入产品名称" />
                    </div>
                    <div className="form-group">
                      <label>产品描述</label>
                      <textarea placeholder="请输入产品描述" rows={4} />
                    </div>
                    <div className="form-group">
                      <label>产品价格</label>
                      <input type="number" placeholder="请输入价格" />
                    </div>
                    
                    <div className="form-actions">
                      <button
                        className="action-btn success"
                        onClick={() => handleStepAction(currentStepData.id, 'complete')}
                      >
                        完成此步骤
                      </button>
                      <button
                        className="action-btn danger"
                        onClick={() => handleStepAction(currentStepData.id, 'fail')}
                      >
                        标记失败
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {currentStepData.status === 'completed' && (
              <div className="step-completed">
                <div className="success-icon">✓</div>
                <p>此步骤已完成</p>
                {currentStep < steps.length - 1 && (
                  <button className="action-btn primary" onClick={nextStep}>
                    进入下一步
                  </button>
                )}
              </div>
            )}

            {currentStepData.status === 'failed' && (
              <div className="step-failed">
                <div className="error-icon">✗</div>
                <p>此步骤失败，请检查后重试</p>
                <button
                  className="action-btn primary"
                  onClick={() => updateStepStatus(currentStepData.id, 'in-progress')}
                >
                  重新开始
                </button>
              </div>
            )}

            <div className="navigation-buttons">
              {currentStep > 0 && (
                <button className="nav-btn" onClick={previousStep}>
                  上一步
                </button>
              )}
              {currentStep < steps.length - 1 && currentStepData.status === 'completed' && (
                <button className="nav-btn primary" onClick={nextStep}>
                  下一步
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

