# 条款通 Terms Connect

## 项目概述
- **名称**: 条款通 (Terms Connect)
- **定位**: Micro Connect 滴灌通平台"9个通"中的第6个产品 — 投融资双方的"条款磋商台"
- **核心功能**: 三联动滑块（融资金额 / 分成比例 / 联营期限），RBF 条款实时计算与磋商

## 在线地址
- **Production**: https://termsconnect.pages.dev
- **Sandbox**: https://3000-i98xl0aupmr9royvma6lk-5c13a017.sandbox.novita.ai

## 已完成功能

### 3个页面
| 页面 | 路由 | 功能 |
|------|------|------|
| 协商列表 | `/` | Hero区 + RBF公式卡片 + 协商卡片列表（含状态标签）|
| 协商工作区 | `/negotiation/:id` | 视角切换 + 三联动滑块 + 实时计算面板 + 时间线 + 方案对比 + 历史参考 |
| 独立计算器 | `/calculator` | 参数输入表单 → 三联动滑块 + 多方案对比 |

### 10个 API 端点
| 方法 | 路径 | 功能 |
|------|------|------|
| GET | `/api/terms/negotiations` | 获取协商列表 |
| POST | `/api/terms/negotiations` | 新建协商 |
| GET | `/api/terms/negotiations/:id` | 获取协商详情 |
| POST | `/api/terms/negotiations/:id/propose` | 提交新方案 |
| PUT | `/api/terms/negotiations/:id/accept` | 接受条款 |
| PUT | `/api/terms/negotiations/:id/reject` | 拒绝条款 |
| POST | `/api/terms/calculate` | 纯计算接口 |
| GET | `/api/terms/history` | 历史参考案例 |
| POST | `/api/terms/ai-suggest` | AI方案建议 |
| POST | `/api/terms/initiate` | 通间调用发起 |

### 核心交互
- **三联动滑块**: 融资金额为主变量，拖动自动联动分成比例和联营期限
- **实时计算引擎**: IRR、回收期、月均回款、回收倍数即时更新
- **方案对比表**: 保存多组配置并排比较（localStorage 持久化）
- **协商时间线**: 实时追加提案记录（localStorage 持久化）
- **状态管理**: 接受/拒绝状态持久化到 localStorage

### 设计系统
- Apple 风格设计，毛玻璃 Navbar，Aurora 深色 Footer
- 品牌色 #5DC4B3 + 专属紫 #8B5CF6
- Inter + Montserrat + Noto Sans SC 字体
- 滚动渐现动画 + 滑块拖拽反馈

### 国际化
- 中英文切换 (`?lang=en`)，所有链接保持语言参数传递

## 数据架构
- **数据模型**: TermsNegotiation, TermsProposal, CalculatedMetrics, SliderConfig, HistoryCase
- **存储**: localStorage（客户端） — Demo 模式，不依赖外部数据库
- **Mock 数据**: 2条协商记录 + 6条历史案例

## 技术栈
- **框架**: Hono + TypeScript + JSX (SSR)
- **部署**: Cloudflare Pages (wrangler)
- **样式**: Tailwind CSS (CDN) + CSS Design Tokens
- **图标**: FontAwesome 6.4
- **交互**: 纯原生 JS（inline script）

## 部署
- **平台**: Cloudflare Pages
- **状态**: ✅ Active
- **最后更新**: 2026-03-01
