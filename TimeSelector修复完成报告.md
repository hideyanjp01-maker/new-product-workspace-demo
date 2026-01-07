# TimeSelector Hooks 顺序问题修复完成报告

## ✅ 修复完成

## 🔍 根因分析

### 问题代码片段（原 TimeSelector.tsx 第 5-41 行）

```typescript
export default function TimeSelector() {
  const { currentStage, timeSelection, setTimeSelection } = useAppStore()
  const [error, setError] = useState<string | null>(null)  // ❌ 问题1：在所有分支之前调用

  // 根据阶段渲染不同的时间选择器
  if (currentStage === 'insight') {
    return (
      <div className="time-selector time-selector--disabled">
        {/* 直接返回，但 useState 已调用 */}
      </div>
    )
  }

  if (currentStage === 'cold-start') {
    // ❌ 问题2：在条件分支内调用 useEffect
    useEffect(() => {
      setTimeSelection({
        type: 'day_counter',
        launchDate,
        dayCount
      })
    }, [])  // 这个 hook 只在 cold-start 分支执行

    return (
      <div className="time-selector time-selector--readonly">
        {/* ... */}
      </div>
    )
  }

  // 其他分支也有不同的代码执行路径
  // 导致不同 stage 下 hooks 调用数量和顺序不一致
}
```

**问题根源**：
- **第7行**：`useState` 在所有分支之前调用，但在 `insight` 分支会提前 return，导致后续逻辑不执行
- **第27行**：`useEffect` 在条件分支 `if (currentStage === 'cold-start')` 内调用，这是**条件调用 hooks**
- React 要求 hooks 的调用顺序必须一致，否则会报错 "Rendered more hooks than during the previous render"

## 🔧 修复方案

**采用方案**：拆分方案（"无 hooks 的分发器 + 5 个子组件"）

### 方案说明

1. **主组件 TimeSelector**（第228-246行）：
   ```typescript
   export default function TimeSelector() {
     const currentStage = useAppStore((state) => state.currentStage)  // ✅ 只有一个固定的 hook
     
     // 只做渲染分发，不写任何条件 hook
     if (currentStage === 'insight') {
       return <TimeSelectorInsightDisabled />
     }
     if (currentStage === 'planning') {
       return <TimeSelectorPlanningMonth />
     }
     if (currentStage === 'cold-start') {
       return <TimeSelectorColdStartDayCounter />
     }
     if (currentStage === 'scale-up') {
       return <TimeSelectorScaleUpMonthDayRange />
     }
     return <TimeSelectorOverviewDateRange />
   }
   ```

2. **5 个子组件**：
   - `TimeSelectorInsightDisabled`（第4-12行）- 洞察期，无 hooks
   - `TimeSelectorPlanningMonth`（第15-38行）- 企划期，使用 `useAppStore`
   - `TimeSelectorColdStartDayCounter`（第41-68行）- 冷启动期，使用 `useAppStore` + `useEffect`
   - `TimeSelectorScaleUpMonthDayRange`（第71-167行）- 放量期，使用 `useAppStore` + `useState`
   - `TimeSelectorOverviewDateRange`（第170-227行）- 总览，使用 `useAppStore` + `useState`

每个子组件内部可以自由使用 hooks（互不影响），但每个子组件自己也要遵守 hooks 规则（hooks 必须在顶层、固定顺序）。

## 📁 修改的文件列表

1. **`src/components/TimeSelector.tsx`**
   - 完全重写（246行）
   - 拆分为分发器 + 5 个子组件
   - 主组件只有一个固定的 hook：`useAppStore((state) => state.currentStage)`
   - 子组件各自管理自己的 hooks

## 📝 关键 Diff

### 修复前（问题代码）

```typescript
export default function TimeSelector() {
  const { currentStage, timeSelection, setTimeSelection } = useAppStore()
  const [error, setError] = useState<string | null>(null)  // ❌ 条件调用

  if (currentStage === 'insight') {
    return <div>...</div>  // 提前返回
  }

  if (currentStage === 'cold-start') {
    useEffect(() => { ... }, [])  // ❌ 条件调用 hook
    return <div>...</div>
  }
  
  // 其他分支...
}
```

### 修复后（正确代码）

```typescript
// 主组件：只有一个固定的 hook
export default function TimeSelector() {
  const currentStage = useAppStore((state) => state.currentStage)  // ✅ 固定 hook

  // 只做渲染分发，不写任何条件 hook
  if (currentStage === 'insight') {
    return <TimeSelectorInsightDisabled />
  }
  // ...
}

// 子组件：各自管理自己的 hooks（固定顺序）
function TimeSelectorColdStartDayCounter() {
  const { timeSelection, setTimeSelection } = useAppStore()  // ✅ 固定顺序
  useEffect(() => { ... }, [...])  // ✅ 固定顺序
  // ...
}
```

## ✅ 验收标准

修复后必须满足：

1. ✅ `/stages/cold-start` 不再白屏
2. ✅ Console 不再出现：
   - "change in the order of Hooks"
   - "Rendered more hooks than during the previous render"
3. ✅ cold-start 显示"新品启动第X天"，页面有 TopBar/SideNav/内容区
4. ✅ npm run build 正常（TypeScript 编译通过）
5. ✅ 所有阶段的时间选择器按规则工作：
   - insight：不支持时间选择（显示禁用态）
   - planning：仅自然月选择
   - cold-start：显示"新品启动第X天"（只读）
   - scale-up：月份 + 同月内日期范围（带校验）
   - overview：任意自然日范围（可跨月）

## 🎯 修复验证

运行 `npm run dev` 后：
1. ✅ 访问 `/stages/cold-start`，应不再白屏
2. ✅ 打开 Console，不应有 hooks 相关错误
3. ✅ 切换不同阶段，TimeSelector 应正常显示对应的时间选择器
4. ✅ cold-start 阶段应显示"新品启动第X天"

## 📊 代码统计

- 文件：`src/components/TimeSelector.tsx`
- 总行数：246 行
- 主组件：1 个（TimeSelector，第228-246行）
- 子组件：5 个
- Hooks 调用：主组件 1 个固定 hook，子组件各自管理 hooks（互不影响）






