import { Component, ErrorInfo, ReactNode } from 'react'
import './ErrorBoundary.css'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error)
    console.error('[ErrorBoundary] Error info:', errorInfo)
    this.setState({
      error,
      errorInfo
    })
  }

  render() {
    if (this.state.hasError) {
      const { error, errorInfo } = this.state
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <h1 className="error-boundary-title">页面渲染错误</h1>
            <div className="error-boundary-message">
              <strong>错误信息：</strong>
              <pre>{error?.message || '未知错误'}</pre>
            </div>
            {errorInfo && (
              <div className="error-boundary-stack">
                <strong>组件堆栈：</strong>
                <pre>{errorInfo.componentStack}</pre>
              </div>
            )}
            {error?.stack && (
              <div className="error-boundary-stack">
                <strong>错误堆栈：</strong>
                <pre>{error.stack.split('\n').slice(0, 10).join('\n')}</pre>
              </div>
            )}
            <button
              className="error-boundary-button"
              onClick={() => {
                this.setState({ hasError: false, error: null, errorInfo: null })
                window.location.reload()
              }}
            >
              刷新页面
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

