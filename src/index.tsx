import { Hono } from 'hono'
import { renderer } from './renderer'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { HomePage } from './pages/home'
import { NegotiationPage } from './pages/negotiation'
import { CalculatorPage } from './pages/calculator'
import { LoginPage } from './pages/login'
import { InvitePage } from './pages/invite'
import { apiRoutes } from './api'

const app = new Hono()

app.use(renderer)

// ── Login Page ──────────────────────────────────────────────
app.get('/login', (c) => {
  const lang = (c.req.query('lang') || 'zh') as 'zh' | 'en'
  return c.render(
    <LoginPage lang={lang} />
  )
})

// ── Invite Landing Page ─────────────────────────────────────
app.get('/invite/:token', (c) => {
  const token = c.req.param('token')
  const lang = (c.req.query('lang') || 'zh') as 'zh' | 'en'
  return c.render(
    <div>
      <Navbar lang={lang} current="invite" />
      <InvitePage lang={lang} token={token} />
      <Footer lang={lang} />
    </div>
  )
})

// ── Page Routes ──────────────────────────────────────────────
app.get('/', (c) => {
  const lang = (c.req.query('lang') || 'zh') as 'zh' | 'en'
  return c.render(
    <div>
      <Navbar lang={lang} current="home" />
      <HomePage lang={lang} />
      <Footer lang={lang} />
    </div>
  )
})

app.get('/negotiation/:id', (c) => {
  const id = c.req.param('id')
  const lang = (c.req.query('lang') || 'zh') as 'zh' | 'en'
  return c.render(
    <div>
      <Navbar lang={lang} current="negotiation" />
      <NegotiationPage lang={lang} negotiationId={id} />
      <Footer lang={lang} />
    </div>
  )
})

app.get('/calculator', (c) => {
  const lang = (c.req.query('lang') || 'zh') as 'zh' | 'en'
  return c.render(
    <div>
      <Navbar lang={lang} current="calculator" />
      <CalculatorPage lang={lang} />
      <Footer lang={lang} />
    </div>
  )
})

// ── API Routes ───────────────────────────────────────────────
app.route('/api', apiRoutes)

export default app
