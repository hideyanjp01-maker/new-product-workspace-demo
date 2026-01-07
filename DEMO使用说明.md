# 新品工作台 Demo 使用说明

## 概述

这是一个完整的新品工作台交互式演示系统，基于PRD文档和指标池表格构建。系统100%使用您提供的角色设计图片作为前端页面展示。

## 核心特性

✅ **18个角色工作台** - 每个角色都有对应的设计图片，100%还原设计稿  
✅ **完整工作流** - 18步完整工作流程，从新品洞察到任务管理  
✅ **角色指标关联** - 根据指标池表格建立的指标与角色映射关系  
✅ **模拟数据** - 包含产品信息、角色数据、指标数据等丰富的模拟数据  
✅ **图片100%展示** - 角色页面完全使用您提供的JPG图片，无遮挡覆盖层  

## 项目结构

```
new-product-workspace/
├── src/
│   ├── components/        # 公共组件
│   │   └── Layout.tsx    # 布局组件
│   ├── pages/            # 页面组件
│   │   ├── HomePage.tsx  # 首页
│   │   ├── ProductListPage.tsx  # 产品列表页
│   │   ├── NewProductPage.tsx   # 新品页面（by角色+by商品+by阶段）
│   │   ├── WorkflowPage.tsx     # 工作流页面
│   │   ├── RoleDetailPage.tsx   # 角色详情页面（100%使用图片）
│   │   └── NewProductInsightPage.tsx  # 新品灵感洞察器
│   ├── store/            # 状态管理
│   │   └── workflowStore.ts      # 工作流状态
│   ├── data/             # 模拟数据
│   │   └── mockData.ts   # 产品、角色、指标数据
│   └── App.tsx           # 主应用组件
├── public/
│   └── images/           # 图片资源（18个角色图片）
└── package.json
```

## 角色列表

系统包含以下18个角色，每个角色都有对应的设计图片：

1. **新品灵感洞察器** - `/images/新品灵感洞察器.jpg`
2. **AI洞察** - `/images/AI洞察.jpg`
3. **市场分析** - `/images/市场分析.jpg`
4. **品牌负责人** - `/images/品牌负责人.jpg`
5. **商品管理** - `/images/商品管理.jpg`
6. **电商负责人** - `/images/电商负责人.jpg`
7. **天猫运营** - `/images/天猫运营.jpg`
8. **天猫流量运营** - `/images/天猫流量运营.jpg`
9. **京东运营** - `/images/京东运营.jpg`
10. **京东流量运营** - `/images/京东流量运营.jpg`
11. **抖音店铺** - `/images/抖音店铺.jpg`
12. **抖音投放** - `/images/抖音投放.jpg`
13. **抖音内容制作** - `/images/抖音内容制作.jpg`
14. **抖音商务** - `/images/抖音商务.jpg`
15. **潜力达人洞察** - `/images/潜力达人洞察.png`
16. **竞争品VS** - `/images/竞争品VS 模块.jpg`
17. **素材生成器** - `/images/素材生成器.jpg`
18. **任务** - `/images/任务.jpg`

## 安装和运行

### 1. 安装依赖

```bash
cd new-product-workspace
npm install
```

### 2. 运行开发服务器

```bash
npm run dev
```

访问 http://localhost:5173 查看演示（Vite默认端口）

### 3. 构建生产版本

```bash
npm run build
```

## 使用流程

### 方式一：通过工作流页面演示

1. **访问首页** (`/`)
   - 查看统计信息和所有角色工作台入口
   - 点击"开始工作流"按钮

2. **工作流页面** (`/workflow`)
   - 查看完整的18步工作流程
   - 点击任意步骤，自动跳转到对应的角色页面
   - 在角色页面查看100%还原的设计图片

3. **角色页面** (`/roles/:roleId`)
   - 完全使用您提供的设计图片展示
   - 右上角有浮动操作按钮（返回工作流、完成步骤）
   - 点击"完成步骤"按钮，自动进入下一步

### 方式二：直接访问角色页面

1. **从首页进入**
   - 在首页的"角色工作台"区域，点击任意角色卡片
   - 直接进入对应的角色页面，查看设计图片

2. **通过URL访问**
   - 直接在浏览器输入：`http://localhost:5173/roles/[角色ID]`
   - 例如：`/roles/market-analysis`、`/roles/brand-manager` 等

### 方式三：通过产品页面演示

1. **产品列表** (`/products`)
   - 查看所有产品列表
   - 点击产品卡片进入产品详情

2. **新品页面** (`/new-products/:productId?role=:roleId`)
   - 根据角色和产品展示不同的指标和内容
   - 支持企划期、冷启动期、放量期三个阶段

## 工作流步骤（18步）

1. **新品灵感洞察** → `/roles/new-product-insight`
2. **AI洞察分析** → `/roles/ai-insight`
3. **市场分析** → `/roles/market-analysis`
4. **品牌策略** → `/roles/brand-manager`
5. **商品管理** → `/roles/product-management`
6. **电商整体规划** → `/roles/ecommerce-director`
7. **天猫运营** → `/roles/tmall-operation`
8. **天猫流量运营** → `/roles/tmall-traffic`
9. **京东运营** → `/roles/jd-operation`
10. **京东流量运营** → `/roles/jd-traffic`
11. **抖音店铺运营** → `/roles/douyin-shop`
12. **抖音投放** → `/roles/douyin-advertising`
13. **抖音内容制作** → `/roles/douyin-content`
14. **抖音商务合作** → `/roles/douyin-business`
15. **潜力达人洞察** → `/roles/talent-insight`
16. **竞品分析** → `/roles/competitor-analysis`
17. **素材生成** → `/roles/material-generator`
18. **任务管理** → `/roles/task`

## 关键设计说明

### 图片100%展示

- 所有角色页面使用 `RolePage` 组件
- 图片完全展示，无白色覆盖层遮挡
- 只添加必要的浮动操作按钮（右上角）
- 图片路径：`/images/[角色名称].jpg` 或 `.png`

### 角色与指标映射

根据指标池表格（【2.0系统全量】指标池.xlsx），系统建立了角色与指标的映射关系：

- **抖音平台指标** → 抖音店铺、抖音投放、抖音内容制作等角色
- **天猫平台指标** → 天猫运营、天猫流量运营等角色
- **京东平台指标** → 京东运营、京东流量运营等角色
- **通用指标** → 电商负责人、品牌负责人等角色

所有映射关系定义在 `src/data/mockData.ts` 文件的 `metrics` 数组中。

### 产品状态机

根据PRD文档，产品状态流转如下：

**企划期（Planning Phase）**
- `pending-target` - 待生成目标（仅市场研究可见）
- `pending-brand-confirm` - 待品牌负责人确认
- `pending-review-target` - 待复核目标
- `pending-ecommerce-confirm` - 待电商负责人确认

**冷启动期（Cold-start Phase）**
- `cold-start` - 所有角色可见

**放量期（Scaling Phase）**
- `scaling` - 所有角色可见

## 模拟数据

系统包含以下模拟数据：

- **4个示例产品** - 不同状态和阶段的产品
- **18个角色定义** - 每个角色包含ID、名称、图片路径、描述
- **指标数据** - 根据指标池表格创建的指标数据，包含抖音、天猫、京东平台的指标
- **工作流步骤** - 18个完整的工作流步骤定义

所有数据都在 `src/data/mockData.ts` 中定义，可以根据需要修改。

## 技术栈

- **React 18** - UI框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **React Router** - 路由管理
- **Zustand** - 状态管理（工作流状态）
- **CSS3** - 样式

## 演示要点

1. **图片展示** - 所有角色页面100%使用您提供的设计图片
2. **工作流导航** - 可以在工作流页面和角色页面之间自由切换
3. **状态管理** - 工作流状态使用Zustand管理，支持步骤完成、跳转等操作
4. **数据展示** - 产品列表、产品详情、指标数据等都使用模拟数据展示
5. **完整流程** - 可以从首页 → 工作流 → 角色页面 → 完成步骤 → 下一步，完整演示整个流程

## 注意事项

1. 图片文件已经放在 `public/images/` 目录下，路径已经正确配置
2. 所有角色图片都使用原始文件名，保持与设计稿一致
3. 角色页面不添加任何遮挡图片内容的覆盖层，只添加必要的浮动操作按钮
4. 工作流状态在页面刷新后会重置，如需持久化可以添加localStorage支持

## 后续扩展建议

1. 添加产品状态流转的实际逻辑（根据PRD的状态机）
2. 添加更多模拟数据，使演示更丰富
3. 添加指标数据的图表展示
4. 添加AI洞察的交互功能
5. 添加任务管理功能
6. 添加用户权限控制（根据PRD中不同角色在不同阶段的可见性规则）






