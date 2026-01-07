# TimeSelector Hooks 顺序问题修复说明

## 🔍 根因分析

### 问题代码片段（原 TimeSelector.tsx）

原代码中存在**条件调用 hooks**的问题：

```typescript
export default function TimeSelector() {
  const { currentStage, timeSelection, setTimeSelection } = useAppStore()
  const [error, setError] = useState<string | null>(null)  // ❌ 问题：这个 hook 在某些分支不会执行

  // 根据阶段渲染不同的时间选择器
  if (currentStage === 'insight') {
    return (
      // ... 直接返回，没有调用 setError
    )
  }

  if (currentStage === 'cold-start') {
    // ❌ 问题：这里有一个 useEffect，但只在 cold-start 分支执行
    useEffect(() => {
      // ...
    }, [])
    return (
      // ...
    )
  }

  // 其他分支也有不同的 hooks 调用
  // 这导致不同 stage 下 hooks 调用数量和顺序不一致
}
```

**问题根源**：
- 在不同 `currentStage` 下，组件会提前 return，导致后续的 hooks（如 `useState`, `useEffect`）在某些渲染中不被调用
- React 要求 hooks 的调用顺序必须一致，否则会报错 "Rendered more hooks than during the previous render"

## 🔧 修复方案

**采用方案**：拆分方案（"无 hooks 的分发器 + 5 个子组件"）

### 方案说明

1. **主组件 TimeSelector**：
   - 只有一个固定的 hook：`useAppStore((state) => state.currentStage)`
   - 只做渲染分发，不写任何条件 hook
   - 根据 `currentStage` 返回对应的子组件

2. **5 个子组件**：
   - `TimeSelectorInsightDisabled` - 洞察期（无 hooks）
   - `TimeSelectorPlanningMonth` - 企划期（使用 useAppStore）
   - `TimeSelectorColdStartDayCounter` - 冷启动期（使用 useAppStore + useEffect）
   - `TimeSelectorScaleUpMonthDayRange` - 放量期（使用 useAppStore + useState）
   - `TimeSelectorOverviewDateRange` - 总览（使用 useAppStore + useState）

每个子组件内部可以自由使用 hooks（互不影响），但每个子组件自己也要遵守 hooks 规则（hooks 必须在顶层、固定顺序）。

## 📁 修改的文件列表

1. **`src/components/TimeSelector.tsx`**
   - 完全重写，拆分为分发器 + 5 个子组件
   - 主组件只有一个固定的 hook：`useAppStore`
   - 子组件各自管理自己的 hooks

## 📝 关键 Diff

### 修复前（问题代码）

```typescript
export default function TimeSelector() {
  const { currentStage, timeSelection, setTimeSelection } = useAppStore()
  const [error, setError] = useState<string | null>(null)  // ❌ 条件调用

  if (currentStage === 'insight') {
    return <div>...</div>  // 提前返回，useState 不执行
  }

  if (currentStage === 'cold-start') {
    useEffect(() => { ... }, [])  // ❌ 条件调用
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
  if (currentStage === 'planning') {
    return <TimeSelectorPlanningMonth />
  }
  // ...
}

// 子组件：各自管理自己的 hooks
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
4. ✅ npm run dev 正常
5. ✅ 所有阶段的时间选择器按规则工作：
   - insight：不支持时间选择（隐藏/禁用态）
   - planning：仅自然月
   - cold-start：显示"新品启动第X天"
   - scale-up：月份 + 同月内日期范围
   - overview：任意自然日范围（可跨月）

## 🎯 修复验证

运行 `npm run dev` 后：
1. 访问 `/stages/cold-start`，应不再白屏
2. 打开 Console，不应有 hooks 相关错误
3. 切换不同阶段，TimeSelector 应正常显示对应的时间选择器
4. cold-start 阶段应显示"新品启动第X天"






