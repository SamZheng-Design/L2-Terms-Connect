import type { FC } from 'hono/jsx'
import { TEXT, t, type Lang } from '../data/i18n'
import { mockNegotiations, industryIcons, statusConfig, mockHistoryCases } from '../data/mock'
import { SliderPanel } from '../components/SliderPanel'

interface NegotiationPageProps {
  lang: Lang
  negotiationId: string
}

export const NegotiationPage: FC<NegotiationPageProps> = ({ lang, negotiationId }) => {
  const neg = mockNegotiations.find(n => n.id === negotiationId) || mockNegotiations[0]
  const icon = industryIcons[neg.industry] || '📄'
  const status = statusConfig[neg.status]
  const statusLabel = t(TEXT.status[neg.status as keyof typeof TEXT.status], lang)
  const cp = neg.currentProposal
  const proposals = [...neg.proposals].reverse()

  // Filter history cases by industry
  const industryCases = mockHistoryCases.filter(c => {
    const indMap: Record<string, string> = { catering: '餐饮', retail: '零售', education: '教育', concert: '演出', saas: 'SaaS' }
    return c.industry === (indMap[neg.industry] || neg.industry)
  })

  return (
    <main style="max-width:1000px;margin:0 auto;padding:0 24px;padding-top:80px">
      {/* Breadcrumb */}
      <div class="breadcrumb">
        <a href={`/?lang=${lang}`}>{t(TEXT.nav.product, lang)}</a>
        <i class="fas fa-chevron-right" style="font-size:10px"></i>
        <span class="breadcrumb-current">{neg.projectName}</span>
      </div>

      {/* ── Perspective Toggle ─────────────────────────────── */}
      <div class="reveal" style="margin-bottom:24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
        <div class="tab-group" id="perspectiveToggle">
          <button class="tab-item active" data-role="investor" onclick="switchPerspective('investor')">
            <i class="fas fa-search" style="margin-right:6px;font-size:12px"></i>
            {t(TEXT.workspace.investor, lang)}
          </button>
          <button class="tab-item" data-role="borrower" onclick="switchPerspective('borrower')">
            <i class="fas fa-rocket" style="margin-right:6px;font-size:12px"></i>
            {t(TEXT.workspace.borrower, lang)}
          </button>
        </div>
        <span class={`badge badge-${neg.status}`}>
          {status.icon} {statusLabel}
        </span>
      </div>

      {/* ── Project Info Card ──────────────────────────────── */}
      <div class="card-static reveal" style="padding:24px;margin-bottom:24px">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px">
          <div style="display:flex;align-items:center;gap:12px">
            <span style="font-size:32px">{icon}</span>
            <div>
              <div style="font-size:18px;font-weight:700;color:var(--text-title)">{neg.projectName}</div>
              <div style="font-size:13px;color:var(--text-tertiary);margin-top:2px">
                {lang === 'zh' ? neg.industry === 'catering' ? '餐饮行业' : neg.industry === 'education' ? '教育行业' : neg.industry : neg.industry}
                {' | '}
                {t(TEXT.workspace.monthlyRevenue, lang)} ¥{neg.sliderConfig.pcf}{lang === 'zh' ? '万' : '0K'}
              </div>
            </div>
          </div>

          <div style="display:flex;gap:24px;flex-wrap:wrap">
            <div style="text-align:center">
              <div style="font-size:11px;color:var(--text-tertiary)">PCF</div>
              <div style="font-family:var(--font-brand);font-size:18px;font-weight:800;color:var(--terms-dark)">¥{neg.sliderConfig.pcf}</div>
              <div style="font-size:11px;color:var(--text-placeholder)">{lang === 'zh' ? '万/月' : '0K/Mo'}</div>
            </div>
            <div style="text-align:center">
              <div style="font-size:11px;color:var(--text-tertiary)">YITO</div>
              <div style="font-family:var(--font-brand);font-size:18px;font-weight:800;color:var(--terms-dark)">{(neg.sliderConfig.yito * 100).toFixed(0)}%</div>
              <div style="font-size:11px;color:var(--text-placeholder)">{lang === 'zh' ? '目标收益率' : 'Target Yield'}</div>
            </div>
            <div style="text-align:center">
              <div style="font-size:11px;color:var(--text-tertiary)">{t(TEXT.workspace.maxFinancing, lang)}</div>
              <div style="font-family:var(--font-brand);font-size:18px;font-weight:800;color:var(--terms-dark)">¥{neg.sliderConfig.maxFinancingAmount}</div>
              <div style="font-size:11px;color:var(--text-placeholder)">{lang === 'zh' ? '万' : '0K'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Three-Linked Slider Panel ──────────────────────── */}
      <div class="reveal">
        <SliderPanel lang={lang} mode="negotiation" />
      </div>

      {/* ── Negotiation Note Input ─────────────────────────── */}
      <div class="card-static reveal" style="padding:20px;margin-bottom:24px">
        <textarea
          id="negotiationNote"
          class="input-field"
          rows={3}
          placeholder={t(TEXT.actions.notePlaceholder, lang)}
          style="resize:vertical"
        ></textarea>
      </div>

      {/* ── Action Buttons ─────────────────────────────────── */}
      <div class="reveal" style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:40px">
        <button class="btn btn-secondary" onclick="saveToComparison()">
          <i class="fas fa-save"></i>
          {t(TEXT.actions.savePlan, lang)}
        </button>
        <button class="btn btn-primary" onclick="submitProposal()">
          <i class="fas fa-paper-plane"></i>
          {t(TEXT.actions.submitProposal, lang)}
        </button>
        <button class="btn btn-success" onclick="acceptTerms()">
          <i class="fas fa-check"></i>
          {t(TEXT.actions.acceptTerms, lang)}
        </button>
        <button class="btn btn-danger" onclick="rejectTerms()">
          <i class="fas fa-times"></i>
          {t(TEXT.actions.reject, lang)}
        </button>
      </div>

      {/* ── Timeline ───────────────────────────────────────── */}
      <div class="card-static reveal" style="padding:28px;margin-bottom:24px">
        <h3 class="section-title" style="font-size:18px">
          <i class="fas fa-history"></i>
          {t(TEXT.timeline.title, lang)}
        </h3>
        <div class="timeline" id="timeline-container">
          {proposals.map((p, idx) => {
            const roundNum = proposals.length - idx
            const roleLabel = p.proposedBy === 'investor'
              ? t(TEXT.timeline.investorRole, lang)
              : t(TEXT.timeline.borrowerRole, lang)
            const timeStr = p.createdAt.replace('T', ' ').slice(0, 16)
            return (
              <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                  <div class="timeline-header">
                    <span class="timeline-round">
                      📌 {t(TEXT.timeline.round, lang)}{roundNum}{t(TEXT.timeline.roundSuffix, lang)}
                    </span>
                    <span class="timeline-role">· {roleLabel}</span>
                    <span class="timeline-time">{timeStr}</span>
                  </div>
                  <div class="timeline-data">
                    <span>¥{p.financingAmount}{lang === 'zh' ? '万' : '0K'}</span>
                    <span>{p.revenueShareRatio}%</span>
                    <span>{p.cooperationTerm}{lang === 'zh' ? '月' : 'Mo'}</span>
                    <span>IRR {p.calculatedMetrics.irr}%</span>
                  </div>
                  {p.note && (
                    <div class="timeline-note">"{p.note}"</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── History Reference ──────────────────────────────── */}
      {industryCases.length > 0 && (
        <div class="card-static reveal" style="padding:28px;margin-bottom:24px">
          <h3 class="section-title" style="font-size:18px">
            <i class="fas fa-landmark"></i>
            {t(TEXT.history.title, lang)}
          </h3>
          <div style="display:flex;flex-direction:column;gap:12px">
            {industryCases.map((c) => (
              <div style="display:flex;align-items:center;gap:16px;padding:14px 18px;background:var(--surface-page);border-radius:var(--radius-md);font-size:14px">
                <span style="font-weight:600;color:var(--text-primary);min-width:50px">{c.industry}</span>
                <span style="color:var(--text-secondary)">¥{c.amount}{lang === 'zh' ? '万' : '0K'}</span>
                <span style="color:var(--text-secondary)">{c.ratio}%</span>
                <span style="color:var(--text-secondary)">{c.term}{lang === 'zh' ? '月' : 'Mo'}</span>
                <span style="font-family:var(--font-brand);font-weight:700;color:var(--terms-dark)">IRR {c.irr}%</span>
                <span style="margin-left:auto" class="badge badge-agreed">{c.outcome}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Negotiation Page Scripts ───────────────────────── */}
      <script dangerouslySetInnerHTML={{__html: `
        var LANG = '${lang}';
        var NEGOTIATION_ID = '${negotiationId}';
        var currentPerspective = 'investor';

        // Initialize slider config from server data
        window.sliderConfig = {
          maxFinancingAmount: ${neg.sliderConfig.maxFinancingAmount},
          maxRevenueShareRatio: ${neg.sliderConfig.maxRevenueShareRatio},
          maxCooperationTerm: ${neg.sliderConfig.maxCooperationTerm},
          pcf: ${neg.sliderConfig.pcf},
          yito: ${neg.sliderConfig.yito}
        };

        window.currentValues = {
          financingAmount: ${cp.financingAmount},
          revenueShareRatio: ${cp.revenueShareRatio},
          cooperationTerm: ${cp.cooperationTerm},
          linkedMode: true
        };

        // ── Perspective Switch ────────────────────────────────
        function switchPerspective(role) {
          currentPerspective = role;
          var btns = document.querySelectorAll('#perspectiveToggle .tab-item');
          btns.forEach(function(b) {
            b.classList.toggle('active', b.getAttribute('data-role') === role);
          });
          showToast(
            LANG === 'zh'
              ? '已切换到' + (role === 'investor' ? '投资方' : '融资方') + '视角'
              : 'Switched to ' + (role === 'investor' ? 'Investor' : 'Borrower') + ' view',
            'info'
          );
        }

        // ── Action Handlers ───────────────────────────────────
        function submitProposal() {
          var note = document.getElementById('negotiationNote').value || '';
          var cv = window.currentValues;
          showToast(LANG === 'zh' ? '新方案已提交（Demo）' : 'Proposal submitted (Demo)', 'info');
          document.getElementById('negotiationNote').value = '';
        }

        function acceptTerms() {
          showToast(LANG === 'zh' ? '条款已达成（Demo）' : 'Terms Agreed (Demo)', 'success');
        }

        function rejectTerms() {
          showToast(LANG === 'zh' ? '条款已拒绝' : 'Terms Rejected', 'error');
        }

        // ── Slider Engine (same as calculator) ────────────────
        var isDragging = null;
        window.comparisonPlans = [];

        function initSliders() {
          var sliders = ['amount', 'ratio', 'term'];
          sliders.forEach(function(name) {
            var track = document.getElementById('track-' + name);
            var thumb = document.getElementById('thumb-' + name);
            if (!track || !thumb) return;

            thumb.addEventListener('mousedown', function(e) {
              e.preventDefault();
              isDragging = name;
              document.body.style.cursor = 'grabbing';
            });
            thumb.addEventListener('touchstart', function(e) {
              isDragging = name;
            }, { passive: true });
            track.addEventListener('click', function(e) {
              var rect = track.getBoundingClientRect();
              var pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
              updateSliderValue(name, pct);
            });
          });

          document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            handleDrag(isDragging, e.clientX);
          });
          document.addEventListener('touchmove', function(e) {
            if (!isDragging) return;
            handleDrag(isDragging, e.touches[0].clientX);
          }, { passive: true });
          document.addEventListener('mouseup', function() {
            isDragging = null;
            document.body.style.cursor = '';
          });
          document.addEventListener('touchend', function() { isDragging = null; });

          renderSliders();
          updateCalculations();
        }

        function handleDrag(name, clientX) {
          var track = document.getElementById('track-' + name);
          if (!track) return;
          var rect = track.getBoundingClientRect();
          var pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
          updateSliderValue(name, pct);
        }

        function updateSliderValue(name, pct) {
          var cfg = window.sliderConfig;
          var cv = window.currentValues;
          if (name === 'amount') {
            cv.financingAmount = Math.round(pct * cfg.maxFinancingAmount);
            if (cv.linkedMode) {
              cv.revenueShareRatio = Math.round(pct * cfg.maxRevenueShareRatio * 10) / 10;
              cv.cooperationTerm = Math.round(pct * cfg.maxCooperationTerm);
            }
          } else if (name === 'ratio') {
            cv.revenueShareRatio = Math.round(pct * cfg.maxRevenueShareRatio * 10) / 10;
          } else if (name === 'term') {
            cv.cooperationTerm = Math.round(pct * cfg.maxCooperationTerm);
          }
          renderSliders();
          updateCalculations();
        }

        function renderSliders() {
          var cfg = window.sliderConfig;
          var cv = window.currentValues;
          setSliderUI('amount', cfg.maxFinancingAmount > 0 ? cv.financingAmount / cfg.maxFinancingAmount : 0, cv.financingAmount);
          setSliderUI('ratio', cfg.maxRevenueShareRatio > 0 ? cv.revenueShareRatio / cfg.maxRevenueShareRatio : 0, cv.revenueShareRatio);
          setSliderUI('term', cfg.maxCooperationTerm > 0 ? cv.cooperationTerm / cfg.maxCooperationTerm : 0, cv.cooperationTerm);
        }

        function setSliderUI(name, pct, value) {
          var fill = document.getElementById('fill-' + name);
          var thumb = document.getElementById('thumb-' + name);
          var valEl = document.getElementById('val-' + name);
          if (fill) fill.style.width = (pct * 100) + '%';
          if (thumb) thumb.style.left = 'calc(' + (pct * 100) + '% - 12px)';
          if (valEl) valEl.textContent = name === 'ratio' ? value.toFixed(1) : Math.round(value);
        }

        function updateCalculations() {
          var cfg = window.sliderConfig;
          var cv = window.currentValues;
          var ratio = cv.revenueShareRatio / 100;
          var totalRepayment = ratio * cfg.pcf * cv.cooperationTerm;
          var monthlyRepayment = ratio * cfg.pcf;
          var paybackMonths = monthlyRepayment > 0 ? Math.ceil(cv.financingAmount / monthlyRepayment) : 0;
          var recoveryMultiple = cv.financingAmount > 0 ? totalRepayment / cv.financingAmount : 0;
          var irr = 0;
          if (cv.financingAmount > 0 && cv.cooperationTerm > 0) {
            irr = (Math.pow(totalRepayment / cv.financingAmount, 12 / cv.cooperationTerm) - 1) * 100;
          }
          var el = function(id) { return document.getElementById(id); };
          if (el('metric-total')) el('metric-total').textContent = totalRepayment.toFixed(1);
          if (el('metric-monthly')) el('metric-monthly').textContent = monthlyRepayment.toFixed(2);
          if (el('metric-irr')) el('metric-irr').textContent = irr.toFixed(1);
          if (el('metric-payback')) el('metric-payback').textContent = paybackMonths;
          if (el('metric-multiple')) el('metric-multiple').textContent = recoveryMultiple.toFixed(2);

          var formulaEl = el('formula-display');
          if (formulaEl) {
            formulaEl.textContent = LANG === 'zh'
              ? '融资金额 = (' + cfg.pcf + ' × ' + cv.revenueShareRatio + '% × ' + cv.cooperationTerm + ') / (1 + ' + (cfg.yito*100).toFixed(0) + '%) = ¥' + cv.financingAmount + '万'
              : 'Financing = (' + cfg.pcf + ' × ' + cv.revenueShareRatio + '% × ' + cv.cooperationTerm + ') / (1 + ' + (cfg.yito*100).toFixed(0) + '%) = ¥' + cv.financingAmount + '0K';
          }
        }

        function saveToComparison() {
          var cfg = window.sliderConfig;
          var cv = window.currentValues;
          var ratio = cv.revenueShareRatio / 100;
          var totalRepayment = ratio * cfg.pcf * cv.cooperationTerm;
          var monthlyRepayment = ratio * cfg.pcf;
          var paybackMonths = monthlyRepayment > 0 ? Math.ceil(cv.financingAmount / monthlyRepayment) : 0;
          var recoveryMultiple = cv.financingAmount > 0 ? totalRepayment / cv.financingAmount : 0;
          var irr = 0;
          if (cv.financingAmount > 0 && cv.cooperationTerm > 0) {
            irr = (Math.pow(totalRepayment / cv.financingAmount, 12 / cv.cooperationTerm) - 1) * 100;
          }
          window.comparisonPlans.push({
            label: String.fromCharCode(65 + window.comparisonPlans.length),
            amount: cv.financingAmount,
            ratio: cv.revenueShareRatio,
            term: cv.cooperationTerm,
            irr: irr.toFixed(1),
            payback: paybackMonths,
            multiple: recoveryMultiple.toFixed(2)
          });
          renderComparison();
          showToast(LANG === 'zh' ? '方案已保存到对比' : 'Plan saved to comparison', 'info');
        }

        function clearComparison() {
          window.comparisonPlans = [];
          renderComparison();
        }

        function renderComparison() {
          var container = document.getElementById('comparison-body');
          if (!container) return;
          var plans = window.comparisonPlans;
          if (plans.length === 0) {
            container.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text-placeholder);padding:24px">' +
              (LANG === 'zh' ? '暂无对比方案' : 'No plans yet') + '</td></tr>';
            return;
          }
          var rows = [
            { label: LANG === 'zh' ? '融资金额' : 'Amount', key: 'amount', unit: LANG === 'zh' ? '万' : '0K' },
            { label: LANG === 'zh' ? '分成比例' : 'Ratio', key: 'ratio', unit: '%' },
            { label: LANG === 'zh' ? '联营期限' : 'Term', key: 'term', unit: LANG === 'zh' ? '月' : 'Mo' },
            { label: 'IRR', key: 'irr', unit: '%' },
            { label: LANG === 'zh' ? '回收期' : 'Payback', key: 'payback', unit: LANG === 'zh' ? '月' : 'Mo' },
            { label: LANG === 'zh' ? '回收倍数' : 'Multiple', key: 'multiple', unit: 'x' }
          ];
          var html = '';
          rows.forEach(function(row) {
            html += '<tr><td style="font-weight:500;color:var(--text-primary)">' + row.label + '</td>';
            plans.forEach(function(p) {
              html += '<td style="text-align:center;font-family:var(--font-brand);font-weight:700">' + p[row.key] + row.unit + '</td>';
            });
            html += '</tr>';
          });
          container.innerHTML = html;
          var thead = document.getElementById('comparison-head');
          if (thead) {
            var h = '<th>' + (LANG === 'zh' ? '指标' : 'Metric') + '</th>';
            plans.forEach(function(p) { h += '<th>' + (LANG === 'zh' ? '方案 ' : 'Plan ') + p.label + '</th>'; });
            thead.innerHTML = h;
          }
        }

        // ── Toast ─────────────────────────────────────────────
        function showToast(msg, type) {
          var existing = document.getElementById('toast');
          if (existing) existing.remove();
          var toast = document.createElement('div');
          toast.id = 'toast';
          toast.className = 'toast toast-' + (type || 'info');
          toast.textContent = msg;
          document.body.appendChild(toast);
          setTimeout(function() { toast.classList.add('show'); }, 10);
          setTimeout(function() {
            toast.classList.remove('show');
            setTimeout(function() { toast.remove(); }, 300);
          }, 2500);
        }

        // ── Init ──────────────────────────────────────────────
        document.addEventListener('DOMContentLoaded', function() {
          initSliders();
        });

        // Fallback: init immediately if DOM already loaded
        if (document.readyState !== 'loading') {
          initSliders();
        }

        // Reveal animations
        (function() {
          var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(e) {
              if (e.isIntersecting) e.target.classList.add('visible');
            });
          }, { threshold: 0.1 });
          document.querySelectorAll('.reveal').forEach(function(el) { observer.observe(el); });
        })();
      `}} />
    </main>
  )
}
