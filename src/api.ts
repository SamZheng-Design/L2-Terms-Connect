import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { mockNegotiations, mockHistoryCases } from './data/mock'
import type { CalculatedMetrics } from './data/mock'

export const apiRoutes = new Hono()

apiRoutes.use('/*', cors())

// ── Calculate Metrics Helper ──────────────────────────────────
function calculateMetrics(
  financingAmount: number,
  revenueShareRatio: number,
  cooperationTerm: number,
  pcf: number
): CalculatedMetrics {
  const ratio = revenueShareRatio / 100
  const totalRepayment = ratio * pcf * cooperationTerm
  const monthlyRepayment = ratio * pcf
  const paybackMonths = monthlyRepayment > 0 ? Math.ceil(financingAmount / monthlyRepayment) : 0
  const recoveryMultiple = financingAmount > 0 ? totalRepayment / financingAmount : 0
  let irr = 0
  if (financingAmount > 0 && cooperationTerm > 0) {
    irr = (Math.pow(totalRepayment / financingAmount, 12 / cooperationTerm) - 1) * 100
  }
  return {
    totalRepayment: Math.round(totalRepayment * 100) / 100,
    monthlyRepayment: Math.round(monthlyRepayment * 100) / 100,
    irr: Math.round(irr * 10) / 10,
    paybackMonths,
    recoveryMultiple: Math.round(recoveryMultiple * 100) / 100,
  }
}

// ── GET /api/terms/negotiations ───────────────────────────────
apiRoutes.get('/terms/negotiations', (c) => {
  return c.json({ success: true, negotiations: mockNegotiations })
})

// ── POST /api/terms/negotiations ──────────────────────────────
apiRoutes.post('/terms/negotiations', async (c) => {
  const body = await c.req.json()
  const newNeg = {
    id: 'tn-' + Date.now(),
    ...body,
    status: 'negotiating' as const,
    currentProposal: null,
    proposals: [],
    savedScenarios: [],
    createdAt: new Date().toISOString().slice(0, 10),
    updatedAt: new Date().toISOString().slice(0, 10),
  }
  return c.json({ success: true, negotiation: newNeg })
})

// ── GET /api/terms/negotiations/:id ───────────────────────────
apiRoutes.get('/terms/negotiations/:id', (c) => {
  const id = c.req.param('id')
  const neg = mockNegotiations.find(n => n.id === id)
  if (!neg) return c.json({ success: false, error: 'Not found' }, 404)
  return c.json({ success: true, negotiation: neg })
})

// ── POST /api/terms/negotiations/:id/propose ──────────────────
apiRoutes.post('/terms/negotiations/:id/propose', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  const neg = mockNegotiations.find(n => n.id === id)
  if (!neg) return c.json({ success: false, error: 'Not found' }, 404)

  const metrics = calculateMetrics(
    body.financingAmount,
    body.revenueShareRatio,
    body.cooperationTerm,
    neg.sliderConfig.pcf
  )

  const proposal = {
    id: 'tp-' + Date.now(),
    proposedBy: body.proposedBy,
    financingAmount: body.financingAmount,
    revenueShareRatio: body.revenueShareRatio,
    cooperationTerm: body.cooperationTerm,
    pcf: neg.sliderConfig.pcf,
    yito: neg.sliderConfig.yito,
    calculatedMetrics: metrics,
    note: body.note || '',
    createdAt: new Date().toISOString(),
  }

  return c.json({ success: true, proposal })
})

// ── PUT /api/terms/negotiations/:id/accept ────────────────────
apiRoutes.put('/terms/negotiations/:id/accept', (c) => {
  return c.json({ success: true, message: '条款已达成' })
})

// ── PUT /api/terms/negotiations/:id/reject ────────────────────
apiRoutes.put('/terms/negotiations/:id/reject', (c) => {
  return c.json({ success: true, message: '条款已拒绝' })
})

// ── POST /api/terms/calculate ─────────────────────────────────
apiRoutes.post('/terms/calculate', async (c) => {
  const body = await c.req.json()
  const metrics = calculateMetrics(
    body.financingAmount,
    body.revenueShareRatio,
    body.cooperationTerm,
    body.pcf
  )
  return c.json({ success: true, metrics })
})

// ── GET /api/terms/history ────────────────────────────────────
apiRoutes.get('/terms/history', (c) => {
  const industry = c.req.query('industry')
  let cases = mockHistoryCases
  if (industry) {
    cases = cases.filter(c => c.industry === industry)
  }
  return c.json({ success: true, cases })
})

// ── POST /api/terms/ai-suggest (simplified) ───────────────────
apiRoutes.post('/terms/ai-suggest', async (c) => {
  // Simplified: return statistical suggestion based on history
  const body = await c.req.json()
  const amounts = mockHistoryCases.map(c => c.amount)
  const ratios = mockHistoryCases.map(c => c.ratio)
  const terms = mockHistoryCases.map(c => c.term)

  return c.json({
    success: true,
    suggestion: {
      recommendedAmount: [Math.min(...amounts), Math.max(...amounts)],
      recommendedRatio: [Math.min(...ratios), Math.max(...ratios)],
      recommendedTerm: [Math.min(...terms), Math.max(...terms)],
      reasoning: '基于历史成功案例的统计分析推荐',
    },
  })
})

// ── POST /api/terms/initiate ──────────────────────────────────
apiRoutes.post('/terms/initiate', async (c) => {
  const body = await c.req.json()
  const negotiationId = 'tn-' + Date.now()
  return c.json({
    success: true,
    negotiationId,
    redirectUrl: `/negotiation/${negotiationId}`,
  })
})

// ══════════ Invite API ═══════════════════════════════════════

// In-memory invite store (production: use D1/KV)
const inviteStore = new Map<string, any>()

// Create invite link
apiRoutes.post('/invite/create', async (c) => {
  const { negotiationId, inviterName, role, message } = await c.req.json()
  
  if (!negotiationId) {
    return c.json({ success: false, message: '缺少协商ID' }, 400)
  }
  
  // Find the negotiation
  const neg = mockNegotiations.find(n => n.id === negotiationId)
  if (!neg) return c.json({ success: false, message: '协商不存在' }, 404)
  
  const token = 'inv_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 8)
  const invite = {
    token,
    negotiationId,
    projectName: neg.projectName,
    industry: neg.industry,
    inviterName: inviterName || '匿名用户',
    role: role || 'observer', // observer | negotiator
    message: message || '',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 3600000).toISOString(), // 7 days
    usedCount: 0,
    maxUses: 10,
    status: 'active'
  }
  
  inviteStore.set(token, invite)
  
  return c.json({
    success: true,
    invite: {
      token,
      negotiationId,
      projectName: neg.projectName,
      expiresAt: invite.expiresAt,
      inviteUrl: `/invite/${token}`
    }
  })
})

// Validate invite token
apiRoutes.get('/invite/:token', (c) => {
  const token = c.req.param('token')
  const invite = inviteStore.get(token)
  
  if (!invite) return c.json({ success: false, message: '邀请链接无效' }, 404)
  if (new Date(invite.expiresAt) < new Date()) {
    return c.json({ success: false, message: '邀请链接已过期' }, 410)
  }
  if (invite.usedCount >= invite.maxUses) {
    return c.json({ success: false, message: '邀请链接已达使用上限' }, 410)
  }
  
  return c.json({
    success: true,
    invite: {
      token: invite.token,
      negotiationId: invite.negotiationId,
      projectName: invite.projectName,
      industry: invite.industry,
      inviterName: invite.inviterName,
      role: invite.role,
      message: invite.message,
      expiresAt: invite.expiresAt
    }
  })
})

// Accept invite (join negotiation)
apiRoutes.post('/invite/:token/accept', async (c) => {
  const token = c.req.param('token')
  const invite = inviteStore.get(token)
  
  if (!invite) return c.json({ success: false, message: '邀请链接无效' }, 404)
  if (new Date(invite.expiresAt) < new Date()) {
    return c.json({ success: false, message: '邀请链接已过期' }, 410)
  }
  
  invite.usedCount++
  
  return c.json({
    success: true,
    message: '已加入协商',
    redirectUrl: `/negotiation/${invite.negotiationId}`
  })
})

// ══════════ Auth API (V33 style) ══════════════════════════════

// In-memory user/session store (production: use D1/KV)
const userStore = new Map<string, any>()
const sessionStore = new Map<string, any>()

// Register
apiRoutes.post('/auth/register', async (c) => {
  const { username, email, password, displayName, defaultRole, company, title } = await c.req.json()
  
  if (!username || !email || !password) {
    return c.json({ success: false, message: '请填写用户名、邮箱和密码' }, 400)
  }
  
  for (const [_, user] of userStore) {
    if (user.username === username) return c.json({ success: false, message: '用户名已被注册' }, 400)
    if (user.email === email) return c.json({ success: false, message: '邮箱已被注册' }, 400)
  }
  
  const userId = 'user_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6)
  const now = new Date().toISOString()
  
  const newUser = {
    id: userId, username, email, password,
    phone: '', displayName: displayName || username,
    company: company || '', title: title || '', bio: '',
    defaultRole: defaultRole || 'both',
    createdAt: now, updatedAt: now
  }
  userStore.set(userId, newUser)
  
  const token = 'tok_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 10)
  const expiresAt = new Date(Date.now() + 7 * 24 * 3600000).toISOString()
  sessionStore.set(token, { userId, token, expiresAt })
  
  return c.json({
    success: true, message: '注册成功',
    user: { id: userId, username, email, displayName: newUser.displayName, defaultRole: newUser.defaultRole },
    token, expiresAt
  })
})

// Login
apiRoutes.post('/auth/login', async (c) => {
  const { username, email, password } = await c.req.json()
  const loginId = username || email
  if (!loginId || !password) return c.json({ success: false, message: '请输入用户名/邮箱和密码' }, 400)
  
  let foundUser = null
  for (const [_, user] of userStore) {
    if (user.username === loginId || user.email === loginId) { foundUser = user; break }
  }
  
  if (!foundUser) return c.json({ success: false, message: '用户不存在' }, 401)
  if ((foundUser as any).password !== password) return c.json({ success: false, message: '密码错误' }, 401)
  
  const token = 'tok_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 10)
  const expiresAt = new Date(Date.now() + 7 * 24 * 3600000).toISOString()
  sessionStore.set(token, { userId: foundUser.id, token, expiresAt })
  
  return c.json({
    success: true, message: '登录成功',
    user: {
      id: foundUser.id, username: foundUser.username, email: foundUser.email,
      displayName: foundUser.displayName, phone: foundUser.phone,
      company: foundUser.company, title: foundUser.title,
      defaultRole: foundUser.defaultRole
    },
    token, expiresAt
  })
})

// Logout
apiRoutes.post('/auth/logout', async (c) => {
  const authHeader = c.req.header('Authorization')
  const token = authHeader?.replace('Bearer ', '')
  if (token) sessionStore.delete(token)
  return c.json({ success: true, message: '已登出' })
})

// Get current user
apiRoutes.get('/auth/me', async (c) => {
  const authHeader = c.req.header('Authorization')
  const token = authHeader?.replace('Bearer ', '')
  if (!token) return c.json({ success: false, message: '未登录' }, 401)
  
  const session = sessionStore.get(token)
  if (!session || new Date(session.expiresAt) < new Date()) {
    sessionStore.delete(token!)
    return c.json({ success: false, message: '会话已过期' }, 401)
  }
  
  const user = userStore.get(session.userId)
  if (!user) return c.json({ success: false, message: '用户不存在' }, 404)
  
  return c.json({
    success: true,
    user: {
      id: user.id, username: user.username, email: user.email,
      displayName: user.displayName, defaultRole: user.defaultRole
    }
  })
})
