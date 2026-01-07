import { useEffect, useState, ReactNode } from 'react'
import './AppFrame.css'

// 设计基准尺寸（可根据实际设计稿调整）
const DESIGN_W = 1920
const DESIGN_H = 1080

interface AppFrameProps {
  children: ReactNode
}

export default function AppFrame({ children }: AppFrameProps) {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const updateScale = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      
      // 计算缩放比例：取宽度和高度的最小缩放比，确保内容完全可见
      const scaleX = vw / DESIGN_W
      const scaleY = vh / DESIGN_H
      const newScale = Math.min(scaleX, scaleY)
      
      setScale(newScale)
    }

    // 初始化
    updateScale()

    // 监听窗口大小变化
    window.addEventListener('resize', updateScale)
    
    return () => {
      window.removeEventListener('resize', updateScale)
    }
  }, [])

  return (
    <div className="app-frame-wrapper">
      <div 
        className="app-frame-canvas"
        style={{
          width: DESIGN_W,
          height: DESIGN_H,
          transform: `scale(${scale})`,
          transformOrigin: 'center center'
        }}
      >
        {children}
      </div>
    </div>
  )
}

