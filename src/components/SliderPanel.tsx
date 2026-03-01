import type { FC } from 'hono/jsx'
import { TEXT, t, type Lang } from '../data/i18n'

interface SliderPanelProps {
  lang: Lang
  mode: 'calculator' | 'negotiation'
}

export const SliderPanel: FC<SliderPanelProps> = ({ lang, mode }) => {
  return (
    <div>
      {/* ── Three-Linked Slider Area ───────────────────────── */}
      <div class="card-static" style="padding:32px;margin-bottom:24px;background:linear-gradient(135deg,rgba(240,253,250,0.3),rgba(255,255,255,0.95))">
        <div style="text-align:center;margin-bottom:24px">
          <span style="font-size:13px;color:var(--text-tertiary)">
            {lang === 'zh' ? '投资方' : 'Investor'}
          </span>
          <span style="display:inline-block;width:200px;height:1px;background:linear-gradient(90deg,var(--brand),var(--terms-dark));margin:0 16px;vertical-align:middle"></span>
          <i class="fas fa-exchange-alt" style="color:var(--terms-dark)"></i>
          <span style="display:inline-block;width:200px;height:1px;background:linear-gradient(90deg,var(--terms-dark),var(--brand));margin:0 16px;vertical-align:middle"></span>
          <span style="font-size:13px;color:var(--text-tertiary)">
            {lang === 'zh' ? '融资方' : 'Borrower'}
          </span>
        </div>

        {/* Slider 1: Financing Amount */}
        <div class="slider-container" style="margin-bottom:28px">
          <div class="slider-label">
            <div class="slider-label-text">
              <i class="fas fa-coins slider-label-icon"></i>
              {t(TEXT.slider.financingAmount, lang)}
            </div>
            <div>
              <span class="slider-value">¥<span id="val-amount">0</span></span>
              <span class="slider-value-unit">{t(TEXT.slider.wan, lang)}</span>
            </div>
          </div>
          <div class="slider-track" id="track-amount">
            <div class="slider-fill" id="fill-amount" style="width:0%"></div>
            <div class="slider-thumb" id="thumb-amount" style="left:-12px"></div>
          </div>
          <div class="slider-range">
            <span>0</span>
            <span id="range-max-amount">500{lang === 'zh' ? '万' : '0K'}</span>
          </div>
        </div>

        {/* Slider 2: Revenue Share Ratio */}
        <div class="slider-container" style="margin-bottom:28px">
          <div class="slider-label">
            <div class="slider-label-text">
              <i class="fas fa-chart-pie slider-label-icon"></i>
              {t(TEXT.slider.revenueShareRatio, lang)}
              <span id="link-badge-ratio" style="font-size:11px;padding:2px 8px;border-radius:999px;background:var(--terms-light);color:var(--terms-dark)">
                {t(TEXT.slider.linked, lang)}
              </span>
            </div>
            <div>
              <span class="slider-value"><span id="val-ratio">0</span></span>
              <span class="slider-value-unit">%</span>
            </div>
          </div>
          <div class="slider-track" id="track-ratio">
            <div class="slider-fill" id="fill-ratio" style="width:0%"></div>
            <div class="slider-thumb" id="thumb-ratio" style="left:-12px"></div>
          </div>
          <div class="slider-range">
            <span>0%</span>
            <span id="range-max-ratio">20%</span>
          </div>
        </div>

        {/* Slider 3: Cooperation Term */}
        <div class="slider-container">
          <div class="slider-label">
            <div class="slider-label-text">
              <i class="fas fa-calendar-alt slider-label-icon"></i>
              {t(TEXT.slider.cooperationTerm, lang)}
              <span id="link-badge-term" style="font-size:11px;padding:2px 8px;border-radius:999px;background:var(--terms-light);color:var(--terms-dark)">
                {t(TEXT.slider.linked, lang)}
              </span>
            </div>
            <div>
              <span class="slider-value"><span id="val-term">0</span></span>
              <span class="slider-value-unit">{t(TEXT.slider.months, lang)}</span>
            </div>
          </div>
          <div class="slider-track" id="track-term">
            <div class="slider-fill" id="fill-term" style="width:0%"></div>
            <div class="slider-thumb" id="thumb-term" style="left:-12px"></div>
          </div>
          <div class="slider-range">
            <span>0</span>
            <span id="range-max-term">48{lang === 'zh' ? '月' : 'Mo'}</span>
          </div>
        </div>
      </div>

      {/* ── Formula Display ────────────────────────────────── */}
      <div class="card-static" style="padding:16px 24px;margin-bottom:24px;text-align:center">
        <div style="font-size:12px;color:var(--text-tertiary);margin-bottom:4px">
          <i class="fas fa-square-root-alt" style="margin-right:4px"></i>
          {t(TEXT.workspace.formulaShow, lang)}
        </div>
        <div id="formula-display" style="font-family:var(--font-brand);font-size:15px;font-weight:600;color:var(--text-primary)">
          --
        </div>
      </div>

      {/* ── Metrics Panel ──────────────────────────────────── */}
      <div class="card-static" style="padding:24px;margin-bottom:24px">
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-label">{t(TEXT.metrics.totalRepayment, lang)}</div>
            <div class="metric-value">¥<span id="metric-total">0</span></div>
            <div class="metric-unit">{t(TEXT.metrics.wan, lang)}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">{t(TEXT.metrics.monthlyRepayment, lang)}</div>
            <div class="metric-value">¥<span id="metric-monthly">0</span></div>
            <div class="metric-unit">{t(TEXT.metrics.wan, lang)}/{lang === 'zh' ? '月' : 'Mo'}</div>
          </div>
          <div class="metric-card" style="background:linear-gradient(135deg,var(--terms-light),rgba(93,196,179,0.08))">
            <div class="metric-label" style="color:var(--terms-dark)">{t(TEXT.metrics.irr, lang)}</div>
            <div class="metric-value" style="color:var(--terms-dark)"><span id="metric-irr">0</span>%</div>
            <div class="metric-unit" style="color:var(--terms-dark)">{lang === 'zh' ? '内部收益率' : 'Internal Rate'}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">{t(TEXT.metrics.paybackMonths, lang)}</div>
            <div class="metric-value"><span id="metric-payback">0</span></div>
            <div class="metric-unit">{t(TEXT.metrics.month, lang)}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">{t(TEXT.metrics.recoveryMultiple, lang)}</div>
            <div class="metric-value"><span id="metric-multiple">0</span>x</div>
            <div class="metric-unit">{lang === 'zh' ? '回收倍数' : 'Recovery'}</div>
          </div>
        </div>
      </div>

      {/* ── Save & Compare ─────────────────────────────────── */}
      <div style="display:flex;gap:12px;margin-bottom:24px">
        <button class="btn btn-secondary" onclick="saveToComparison()">
          <i class="fas fa-save"></i>
          {t(TEXT.actions.savePlan, lang)}
        </button>
        <button class="btn btn-ghost" onclick="clearComparison()">
          <i class="fas fa-trash-alt"></i>
          {t(TEXT.compare.clear, lang)}
        </button>
      </div>

      {/* ── Comparison Table ───────────────────────────────── */}
      <div class="card-static" style="padding:24px;overflow-x:auto">
        <h3 class="section-title" style="font-size:18px">
          <i class="fas fa-columns"></i>
          {t(TEXT.compare.title, lang)}
        </h3>
        <table class="compare-table">
          <thead>
            <tr id="comparison-head">
              <th>{t(TEXT.compare.metric, lang)}</th>
            </tr>
          </thead>
          <tbody id="comparison-body">
            <tr>
              <td colspan="7" style="text-align:center;color:var(--text-placeholder);padding:24px">
                {lang === 'zh' ? '暂无对比方案，点击"保存方案"添加' : 'No plans yet. Click "Save Plan" to add.'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
