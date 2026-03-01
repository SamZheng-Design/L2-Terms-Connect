import type { FC } from 'hono/jsx'
import { TEXT, t, type Lang } from '../data/i18n'
import { mockNegotiations, industryIcons, statusConfig } from '../data/mock'

interface HomePageProps {
  lang: Lang
}

export const HomePage: FC<HomePageProps> = ({ lang }) => {
  return (
    <main style="max-width:1200px;margin:0 auto;padding:0 24px">
      {/* ── Hero ───────────────────────────────────────────── */}
      <section class="hero reveal">
        <img
          src="https://www.genspark.ai/api/files/s/xnam27pA"
          alt="Terms Connect Logo"
          class="hero-logo"
        />
        <h1 class="hero-title">{t(TEXT.hero.title, lang)}</h1>
        <p class="hero-subtitle">{t(TEXT.hero.subtitle, lang)}</p>
        <p class="hero-metaphor">{t(TEXT.hero.metaphor, lang)}</p>

        <a href={`/calculator?lang=${lang}`} class="btn btn-primary btn-lg" style="margin-top:8px">
          <i class="fas fa-calculator"></i>
          {t(TEXT.hero.quickCalc, lang)}
        </a>
      </section>

      {/* ── Formula Card ───────────────────────────────────── */}
      <section class="reveal" style="margin-bottom:48px">
        <div class="formula-card">
          <div style="font-size:13px;color:var(--terms-dark);font-weight:600;margin-bottom:12px">
            <i class="fas fa-function" style="margin-right:6px"></i>
            {t(TEXT.formula.title, lang)}
          </div>
          <div class="formula-expression">
            {t(TEXT.formula.expression, lang)}
          </div>
          <div class="formula-legend">
            <div class="formula-legend-item">
              <span class="formula-legend-dot"></span>
              {t(TEXT.formula.pcf, lang)}
            </div>
            <div class="formula-legend-item">
              <span class="formula-legend-dot" style="background:var(--brand)"></span>
              {t(TEXT.formula.yito, lang)}
            </div>
          </div>
        </div>
      </section>

      {/* ── Negotiation List ───────────────────────────────── */}
      <section class="reveal" style="margin-bottom:48px">
        <h2 class="section-title">
          <i class="fas fa-handshake"></i>
          {t(TEXT.negotiation.title, lang)}
        </h2>

        <div style="display:flex;flex-direction:column;gap:16px">
          {mockNegotiations.map((neg) => {
            const status = statusConfig[neg.status]
            const icon = industryIcons[neg.industry] || '📄'
            const statusLabel = t(TEXT.status[neg.status as keyof typeof TEXT.status], lang)
            const isActive = neg.status === 'negotiating'
            const cp = neg.currentProposal

            return (
              <a
                href={`/negotiation/${neg.id}?lang=${lang}`}
                class="card"
                style="display:block;padding:24px;text-decoration:none;color:inherit"
              >
                {/* Header */}
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
                  <div style="display:flex;align-items:center;gap:10px">
                    <span style="font-size:24px">{icon}</span>
                    <span style="font-size:17px;font-weight:700;color:var(--text-title)">{neg.projectName}</span>
                  </div>
                  <span
                    class={`badge badge-${neg.status}`}
                  >
                    {status.icon} {statusLabel}
                  </span>
                </div>

                {/* Counterparty */}
                <div style="font-size:13px;color:var(--text-secondary);margin-bottom:12px">
                  {t(TEXT.negotiation.counterparty, lang)}: {neg.investorName}
                </div>

                {/* Current Proposal Summary */}
                <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px">
                  <span style="background:var(--terms-light);color:var(--terms-dark);padding:4px 12px;border-radius:999px;font-size:13px;font-weight:600">
                    ¥{cp.financingAmount}{lang === 'zh' ? '万' : '0K'}
                  </span>
                  <span style="background:var(--terms-light);color:var(--terms-dark);padding:4px 12px;border-radius:999px;font-size:13px;font-weight:600">
                    {cp.revenueShareRatio}%
                  </span>
                  <span style="background:var(--terms-light);color:var(--terms-dark);padding:4px 12px;border-radius:999px;font-size:13px;font-weight:600">
                    {cp.cooperationTerm}{lang === 'zh' ? '月' : 'Mo'}
                  </span>
                </div>

                {/* Metrics Row */}
                <div style="display:flex;gap:20px;font-size:13px;color:var(--text-tertiary);margin-bottom:12px">
                  <span>IRR: <strong style="color:var(--text-primary)">{cp.calculatedMetrics.irr}%</strong></span>
                  <span>{t(TEXT.metrics.paybackMonths, lang)}: <strong style="color:var(--text-primary)">{cp.calculatedMetrics.paybackMonths}{lang === 'zh' ? '月' : 'Mo'}</strong></span>
                  <span>{t(TEXT.metrics.recoveryMultiple, lang)}: <strong style="color:var(--text-primary)">{cp.calculatedMetrics.recoveryMultiple}x</strong></span>
                </div>

                {/* Footer */}
                <div style="display:flex;justify-content:space-between;align-items:center">
                  <span style="font-size:12px;color:var(--text-placeholder)">
                    {isActive
                      ? `${lang === 'zh' ? '第' : 'Round '}${neg.proposals.length}${lang === 'zh' ? '轮提案' : ''} · ${neg.updatedAt} ${lang === 'zh' ? '更新' : 'updated'}`
                      : `${neg.updatedAt} ${t(TEXT.negotiation.achieved, lang)}`
                    }
                  </span>
                  <span class="btn btn-sm btn-primary" style="pointer-events:none">
                    {isActive ? t(TEXT.negotiation.enter, lang) : t(TEXT.negotiation.viewDetail, lang)}
                    <i class="fas fa-arrow-right" style="font-size:11px"></i>
                  </span>
                </div>
              </a>
            )
          })}
        </div>
      </section>

      {/* ── Scroll Reveal Script ───────────────────────────── */}
      <script dangerouslySetInnerHTML={{__html: `
        (function() {
          var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
              if (entry.isIntersecting) {
                entry.target.classList.add('visible');
              }
            });
          }, { threshold: 0.1 });
          document.querySelectorAll('.reveal').forEach(function(el) {
            observer.observe(el);
          });
        })();
      `}} />
    </main>
  )
}
