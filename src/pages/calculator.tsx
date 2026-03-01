import type { FC } from 'hono/jsx'
import { TEXT, t, type Lang } from '../data/i18n'
import { SliderPanel } from '../components/SliderPanel'

interface CalculatorPageProps {
  lang: Lang
}

export const CalculatorPage: FC<CalculatorPageProps> = ({ lang }) => {
  return (
    <main style="max-width:900px;margin:0 auto;padding:0 24px;padding-top:80px">
      {/* Breadcrumb */}
      <div class="breadcrumb">
        <a href={`/?lang=${lang}`}>{t(TEXT.nav.product, lang)}</a>
        <i class="fas fa-chevron-right" style="font-size:10px"></i>
        <span class="breadcrumb-current">{t(TEXT.calculator.title, lang)}</span>
      </div>

      {/* Title */}
      <div class="reveal" style="text-align:center;margin-bottom:32px">
        <h1 style="font-size:32px;font-weight:800;color:var(--text-title);letter-spacing:-0.02em;margin-bottom:8px">
          <i class="fas fa-calculator" style="color:var(--terms-dark);margin-right:10px"></i>
          {t(TEXT.calculator.title, lang)}
        </h1>
        <p style="font-size:15px;color:var(--text-secondary)">
          {t(TEXT.calculator.subtitle, lang)}
        </p>
      </div>

      {/* Parameter Input Form */}
      <div class="card-static reveal" style="padding:32px;margin-bottom:32px" id="paramForm">
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px">
          <div>
            <label class="input-label">{t(TEXT.calculator.pcfLabel, lang)}</label>
            <input type="number" class="input-field" id="paramPcf" value="85" min="1" step="1" />
          </div>
          <div>
            <label class="input-label">{t(TEXT.calculator.yitoLabel, lang)}</label>
            <input type="number" class="input-field" id="paramYito" value="15" min="1" max="100" step="1" />
          </div>
          <div>
            <label class="input-label">{t(TEXT.calculator.maxAmountLabel, lang)}</label>
            <input type="number" class="input-field" id="paramMaxAmount" value="500" min="1" step="10" />
          </div>
          <div>
            <label class="input-label">{t(TEXT.calculator.maxRatioLabel, lang)}</label>
            <input type="number" class="input-field" id="paramMaxRatio" value="20" min="1" max="100" step="1" />
          </div>
          <div>
            <label class="input-label">{t(TEXT.calculator.maxTermLabel, lang)}</label>
            <input type="number" class="input-field" id="paramMaxTerm" value="48" min="1" max="120" step="1" />
          </div>
        </div>

        <div style="text-align:center;margin-top:24px;display:flex;gap:12px;justify-content:center">
          <button class="btn btn-primary btn-lg" id="startCalcBtn" onclick="startCalculator()">
            <i class="fas fa-play"></i>
            {t(TEXT.calculator.startCalc, lang)}
          </button>
        </div>
      </div>

      {/* Slider Panel (hidden initially) */}
      <div id="calcSliderArea" style="display:none">
        <SliderPanel lang={lang} mode="calculator" />

        {/* Reset Button */}
        <div style="text-align:center;margin-top:24px">
          <button class="btn btn-secondary" onclick="resetCalculator()">
            <i class="fas fa-redo"></i>
            {t(TEXT.calculator.resetParams, lang)}
          </button>
        </div>
      </div>

      {/* ── Calculator Script ──────────────────────────────── */}
      <script dangerouslySetInnerHTML={{__html: `
        var LANG = '${lang}';
        var CALC_COMPARE_KEY = 'termsconnect_calc_compare';
        var CALC_PARAMS_KEY = 'termsconnect_calc_params';

        // localStorage helpers
        function lsGet(key, fallback) {
          try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
          catch(e) { return fallback; }
        }
        function lsSet(key, val) {
          try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {}
        }

        // Restore last params
        (function() {
          var saved = lsGet(CALC_PARAMS_KEY, null);
          if (saved) {
            if (saved.pcf) document.getElementById('paramPcf').value = saved.pcf;
            if (saved.yito) document.getElementById('paramYito').value = saved.yito;
            if (saved.maxAmount) document.getElementById('paramMaxAmount').value = saved.maxAmount;
            if (saved.maxRatio) document.getElementById('paramMaxRatio').value = saved.maxRatio;
            if (saved.maxTerm) document.getElementById('paramMaxTerm').value = saved.maxTerm;
          }
        })();

        function startCalculator() {
          var pcf = parseFloat(document.getElementById('paramPcf').value) || 85;
          var yito = parseFloat(document.getElementById('paramYito').value) || 15;
          var maxAmount = parseFloat(document.getElementById('paramMaxAmount').value) || 500;
          var maxRatio = parseFloat(document.getElementById('paramMaxRatio').value) || 20;
          var maxTerm = parseFloat(document.getElementById('paramMaxTerm').value) || 48;

          // Store config
          window.sliderConfig = {
            maxFinancingAmount: maxAmount,
            maxRevenueShareRatio: maxRatio,
            maxCooperationTerm: maxTerm,
            pcf: pcf,
            yito: yito / 100
          };

          // Init slider values (50% default)
          window.currentValues = {
            financingAmount: Math.round(maxAmount * 0.5),
            revenueShareRatio: Math.round(maxRatio * 0.5 * 10) / 10,
            cooperationTerm: Math.round(maxTerm * 0.5),
            linkedMode: true
          };

          // Show slider area
          document.getElementById('calcSliderArea').style.display = 'block';
          document.getElementById('paramForm').style.display = 'none';

          // Save params to localStorage
          lsSet(CALC_PARAMS_KEY, { pcf: pcf, yito: yito, maxAmount: maxAmount, maxRatio: maxRatio, maxTerm: maxTerm });

          // Load comparison plans from localStorage
          window.comparisonPlans = lsGet(CALC_COMPARE_KEY, []);

          // Init sliders
          initSliders();
          updateCalculations();
          renderComparison();
        }

        function resetCalculator() {
          document.getElementById('calcSliderArea').style.display = 'none';
          document.getElementById('paramForm').style.display = 'block';
        }

        // ── Slider Engine ─────────────────────────────────────
        var isDragging = null;

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

          document.addEventListener('touchend', function() {
            isDragging = null;
          });

          renderSliders();
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
            // Linked mode: auto-adjust ratio and term
            if (cv.linkedMode) {
              cv.revenueShareRatio = Math.round(pct * cfg.maxRevenueShareRatio * 10) / 10;
              cv.cooperationTerm = Math.round(pct * cfg.maxCooperationTerm);
            }
          } else if (name === 'ratio') {
            cv.revenueShareRatio = Math.round(pct * cfg.maxRevenueShareRatio * 10) / 10;
            // Manual drag breaks linked mode for this axis
          } else if (name === 'term') {
            cv.cooperationTerm = Math.round(pct * cfg.maxCooperationTerm);
          }

          renderSliders();
          updateCalculations();
        }

        function renderSliders() {
          var cfg = window.sliderConfig;
          var cv = window.currentValues;

          // Amount
          var amtPct = cfg.maxFinancingAmount > 0 ? cv.financingAmount / cfg.maxFinancingAmount : 0;
          setSliderUI('amount', amtPct, cv.financingAmount);

          // Ratio
          var ratioPct = cfg.maxRevenueShareRatio > 0 ? cv.revenueShareRatio / cfg.maxRevenueShareRatio : 0;
          setSliderUI('ratio', ratioPct, cv.revenueShareRatio);

          // Term
          var termPct = cfg.maxCooperationTerm > 0 ? cv.cooperationTerm / cfg.maxCooperationTerm : 0;
          setSliderUI('term', termPct, cv.cooperationTerm);
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

          // Update UI
          var elTotal = document.getElementById('metric-total');
          var elMonthly = document.getElementById('metric-monthly');
          var elIrr = document.getElementById('metric-irr');
          var elPayback = document.getElementById('metric-payback');
          var elMultiple = document.getElementById('metric-multiple');

          if (elTotal) elTotal.textContent = totalRepayment.toFixed(1);
          if (elMonthly) elMonthly.textContent = monthlyRepayment.toFixed(2);
          if (elIrr) elIrr.textContent = irr.toFixed(1);
          if (elPayback) elPayback.textContent = paybackMonths;
          if (elMultiple) elMultiple.textContent = recoveryMultiple.toFixed(2);

          // Update formula display
          var formulaEl = document.getElementById('formula-display');
          if (formulaEl) {
            var pcf = cfg.pcf;
            var r = cv.revenueShareRatio;
            var term = cv.cooperationTerm;
            var yitoP = (cfg.yito * 100).toFixed(0);
            formulaEl.textContent = LANG === 'zh'
              ? '融资金额 = (' + pcf + ' × ' + r + '% × ' + term + ') / (1 + ' + yitoP + '%) = ¥' + cv.financingAmount + '万'
              : 'Financing = (' + pcf + ' × ' + r + '% × ' + term + ') / (1 + ' + yitoP + '%) = ¥' + cv.financingAmount + '0K';
          }
        }

        // ── Comparison (Calculator mode) ──────────────────────
        window.comparisonPlans = [];

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

          var plan = {
            label: String.fromCharCode(65 + window.comparisonPlans.length),
            amount: cv.financingAmount,
            ratio: cv.revenueShareRatio,
            term: cv.cooperationTerm,
            irr: irr.toFixed(1),
            payback: paybackMonths,
            multiple: recoveryMultiple.toFixed(2)
          };

          window.comparisonPlans.push(plan);
          lsSet(CALC_COMPARE_KEY, window.comparisonPlans);
          renderComparison();
          showToast(LANG === 'zh' ? '方案已保存到对比' : 'Plan saved to comparison', 'info');
        }

        function clearComparison() {
          window.comparisonPlans = [];
          lsSet(CALC_COMPARE_KEY, []);
          renderComparison();
        }

        function renderComparison() {
          var container = document.getElementById('comparison-body');
          if (!container) return;
          var plans = window.comparisonPlans;

          if (plans.length === 0) {
            container.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text-placeholder);padding:24px">' +
              (LANG === 'zh' ? '暂无对比方案，点击"保存方案"添加' : 'No plans yet. Click "Save Plan" to add.') + '</td></tr>';
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

          // Update header
          var thead = document.getElementById('comparison-head');
          if (thead) {
            var hhtml = '<th>' + (LANG === 'zh' ? '指标' : 'Metric') + '</th>';
            plans.forEach(function(p) {
              hhtml += '<th>' + (LANG === 'zh' ? '方案 ' : 'Plan ') + p.label + '</th>';
            });
            thead.innerHTML = hhtml;
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

        // ── Reveal animation ──────────────────────────────────
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
