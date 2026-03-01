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

  // Serialize proposals for JS usage
  const proposalsJson = JSON.stringify(proposals)

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
        <span class={`badge badge-${neg.status}`} id="statusBadge">
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
      <div class="reveal" style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:40px" id="actionButtons">
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
        <button class="btn btn-ghost" onclick="openInviteModal()" style="margin-left:auto">
          <i class="fas fa-user-plus"></i>
          {lang === 'zh' ? '邀请协商方' : 'Invite'}
        </button>
      </div>

      {/* ── Invite Share Modal ──────────────────────────────────── */}
      <div id="inviteModal" class="invite-modal-overlay" style="display:none">
        <div class="invite-modal">
          <div class="invite-modal-header">
            <h3><i class="fas fa-share-alt" style="margin-right:8px;color:var(--terms-dark)"></i>{lang === 'zh' ? '邀请协商方' : 'Invite to Negotiate'}</h3>
            <button onclick="closeInviteModal()" class="invite-modal-close"><i class="fas fa-times"></i></button>
          </div>
          <div class="invite-modal-body">
            {/* Step 1: Options */}
            <div id="invStepOptions">
              <p class="invite-modal-desc">
                {lang === 'zh'
                  ? '生成邀请链接或二维码，分享给其他协商方，对方扫码或点击链接即可加入本次协商。'
                  : 'Generate an invite link or QR code to share with others.'}
              </p>
              <div class="invite-form-field">
                <label class="auth-label">{lang === 'zh' ? '您的名字（显示给被邀请方）' : 'Your name (shown to invitee)'}</label>
                <input type="text" id="inviterNameInput" class="auth-input" placeholder={lang === 'zh' ? '请输入您的名字' : 'Enter your name'} />
              </div>
              <div class="invite-form-field">
                <label class="auth-label">{lang === 'zh' ? '邀请角色' : 'Invitee Role'}</label>
                <div style="display:flex;gap:8px">
                  <button type="button" class="invite-role-btn invite-role-active" id="roleNegotiator" onclick="selectInviteRole('negotiator')">
                    <i class="fas fa-handshake"></i> {lang === 'zh' ? '协商方' : 'Negotiator'}
                  </button>
                  <button type="button" class="invite-role-btn" id="roleObserver" onclick="selectInviteRole('observer')">
                    <i class="fas fa-eye"></i> {lang === 'zh' ? '观察者' : 'Observer'}
                  </button>
                </div>
              </div>
              <div class="invite-form-field">
                <label class="auth-label">{lang === 'zh' ? '附言（可选）' : 'Message (optional)'}</label>
                <textarea id="inviteMessage" class="auth-input" rows={2} placeholder={lang === 'zh' ? '例如：请审阅这份收入分成方案' : 'e.g., Please review this proposal'} style="resize:none"></textarea>
              </div>
              <button class="btn btn-primary" style="width:100%;margin-top:16px" onclick="generateInvite()" id="genInviteBtn">
                <i class="fas fa-qrcode"></i> {lang === 'zh' ? '生成邀请链接 & 二维码' : 'Generate Invite & QR'}
              </button>
            </div>

            {/* Step 2: QR + Link (hidden initially) */}
            <div id="invStepResult" style="display:none">
              <div class="invite-qr-section">
                <div id="qrCodeContainer" class="invite-qr-box"></div>
                <p class="invite-qr-hint">{lang === 'zh' ? '扫描二维码加入协商' : 'Scan QR to join'}</p>
              </div>
              <div class="invite-link-section">
                <label class="auth-label">{lang === 'zh' ? '邀请链接' : 'Invite Link'}</label>
                <div class="invite-link-row">
                  <input type="text" id="inviteLinkInput" class="auth-input" readonly style="font-size:13px" />
                  <button class="btn btn-secondary invite-copy-btn" onclick="copyInviteLink()">
                    <i class="fas fa-copy"></i>
                  </button>
                </div>
              </div>
              <div class="invite-info-row">
                <span><i class="fas fa-clock" style="color:var(--text-placeholder)"></i> {lang === 'zh' ? '有效期 7 天' : '7 days'}</span>
                <span><i class="fas fa-users" style="color:var(--text-placeholder)"></i> {lang === 'zh' ? '最多 10 人' : 'Max 10'}</span>
              </div>
              <div style="display:flex;gap:10px;margin-top:16px">
                <button class="btn btn-ghost" style="flex:1" onclick="resetInviteModal()">
                  <i class="fas fa-redo"></i> {lang === 'zh' ? '重新生成' : 'New'}
                </button>
                <button class="btn btn-primary" style="flex:1" onclick="closeInviteModal()">
                  <i class="fas fa-check"></i> {lang === 'zh' ? '完成' : 'Done'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Timeline ───────────────────────────────────────── */}
      <div class="card-static reveal" style="padding:28px;margin-bottom:24px">
        <h3 class="section-title" style="font-size:18px">
          <i class="fas fa-history"></i>
          {t(TEXT.timeline.title, lang)}
        </h3>
        <div class="timeline" id="timeline-container">
          {/* Server-rendered initial proposals */}
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
              <div style="display:flex;align-items:center;gap:16px;padding:14px 18px;background:var(--surface-page);border-radius:var(--radius-md);font-size:14px;flex-wrap:wrap">
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
        var STORAGE_KEY = 'termsconnect_' + NEGOTIATION_ID;
        var COMPARE_KEY = 'termsconnect_compare_' + NEGOTIATION_ID;
        var STATUS_KEY = 'termsconnect_status_' + NEGOTIATION_ID;
        var PROPOSALS_KEY = 'termsconnect_proposals_' + NEGOTIATION_ID;

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

        // ── localStorage helpers ──────────────────────────────
        function lsGet(key, fallback) {
          try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
          catch(e) { return fallback; }
        }
        function lsSet(key, val) {
          try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {}
        }

        // ── Load persisted state ──────────────────────────────
        var serverProposals = ${proposalsJson};
        var localProposals = lsGet(PROPOSALS_KEY, []);
        var localStatus = lsGet(STATUS_KEY, '${neg.status}');
        window.comparisonPlans = lsGet(COMPARE_KEY, []);
        window.proposalCount = serverProposals.length + localProposals.length;

        // ── Restore persisted status ──────────────────────────
        function updateStatusUI(newStatus) {
          var badge = document.getElementById('statusBadge');
          if (!badge) return;
          var cfg = {
            negotiating: { icon: '⏳', label: LANG==='zh'?'协商中':'Negotiating', cls: 'badge-negotiating' },
            agreed:      { icon: '✓',  label: LANG==='zh'?'已达成':'Agreed',      cls: 'badge-agreed' },
            rejected:    { icon: '✕',  label: LANG==='zh'?'已拒绝':'Rejected',    cls: 'badge-rejected' }
          };
          var s = cfg[newStatus] || cfg.negotiating;
          badge.className = 'badge ' + s.cls;
          badge.textContent = s.icon + ' ' + s.label;

          // Disable action buttons if finalized
          if (newStatus === 'agreed' || newStatus === 'rejected') {
            var btns = document.querySelectorAll('#actionButtons .btn-primary, #actionButtons .btn-success, #actionButtons .btn-danger');
            btns.forEach(function(b) {
              b.disabled = true;
              b.style.opacity = '0.5';
              b.style.pointerEvents = 'none';
            });
          }
        }

        if (localStatus !== '${neg.status}') {
          updateStatusUI(localStatus);
        }

        // ── Render local proposals into timeline ──────────────
        function renderLocalProposals() {
          if (localProposals.length === 0) return;
          var container = document.getElementById('timeline-container');
          if (!container) return;

          // Prepend local proposals (newest first) before existing items
          var fragment = '';
          localProposals.slice().reverse().forEach(function(p, idx) {
            var roundNum = serverProposals.length + localProposals.length - idx;
            var roleLabel = p.proposedBy === 'investor'
              ? (LANG === 'zh' ? '投资方' : 'Investor')
              : (LANG === 'zh' ? '融资方' : 'Borrower');
            var timeStr = p.createdAt.replace('T', ' ').slice(0, 16);
            var unit = LANG === 'zh' ? '万' : '0K';
            var moUnit = LANG === 'zh' ? '月' : 'Mo';
            var roundPre = LANG === 'zh' ? '第' : 'Round ';
            var roundSuf = LANG === 'zh' ? '轮' : '';

            fragment += '<div class="timeline-item">'
              + '<div class="timeline-dot" style="background:var(--terms-dark);border-color:var(--terms-dark)"></div>'
              + '<div class="timeline-content" style="border:1.5px solid rgba(93,196,179,0.15)">'
              + '<div class="timeline-header">'
              + '<span class="timeline-round">📌 ' + roundPre + roundNum + roundSuf + '</span>'
              + '<span class="timeline-role">· ' + roleLabel + '</span>'
              + '<span class="timeline-time">' + timeStr + '</span>'
              + '<span style="margin-left:8px;font-size:10px;padding:2px 6px;border-radius:999px;background:var(--terms-light);color:var(--terms-dark)">NEW</span>'
              + '</div>'
              + '<div class="timeline-data">'
              + '<span>¥' + p.financingAmount + unit + '</span>'
              + '<span>' + p.revenueShareRatio + '%</span>'
              + '<span>' + p.cooperationTerm + moUnit + '</span>'
              + '<span>IRR ' + p.irr + '%</span>'
              + '</div>'
              + (p.note ? '<div class="timeline-note">"' + p.note + '"</div>' : '')
              + '</div></div>';
          });

          container.insertAdjacentHTML('afterbegin', fragment);
        }

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

        // ── Action Handlers with localStorage ─────────────────
        function submitProposal() {
          if (localStatus !== 'negotiating' && localStatus !== '${neg.status}') {
            showToast(LANG === 'zh' ? '协商已结束，无法提交' : 'Negotiation closed', 'error');
            return;
          }
          var note = document.getElementById('negotiationNote').value || '';
          var cv = window.currentValues;
          var cfg = window.sliderConfig;

          // Calculate metrics
          var ratio = cv.revenueShareRatio / 100;
          var totalRepayment = ratio * cfg.pcf * cv.cooperationTerm;
          var monthlyRepayment = ratio * cfg.pcf;
          var paybackMonths = monthlyRepayment > 0 ? Math.ceil(cv.financingAmount / monthlyRepayment) : 0;
          var recoveryMultiple = cv.financingAmount > 0 ? totalRepayment / cv.financingAmount : 0;
          var irr = 0;
          if (cv.financingAmount > 0 && cv.cooperationTerm > 0) {
            irr = (Math.pow(totalRepayment / cv.financingAmount, 12 / cv.cooperationTerm) - 1) * 100;
          }

          var proposal = {
            id: 'tp-local-' + Date.now(),
            proposedBy: currentPerspective,
            financingAmount: cv.financingAmount,
            revenueShareRatio: cv.revenueShareRatio,
            cooperationTerm: cv.cooperationTerm,
            irr: irr.toFixed(1),
            note: note,
            createdAt: new Date().toISOString()
          };

          localProposals.push(proposal);
          lsSet(PROPOSALS_KEY, localProposals);
          window.proposalCount++;

          // Add to timeline dynamically
          var container = document.getElementById('timeline-container');
          var roundNum = window.proposalCount;
          var roleLabel = currentPerspective === 'investor'
            ? (LANG === 'zh' ? '投资方' : 'Investor')
            : (LANG === 'zh' ? '融资方' : 'Borrower');
          var timeStr = proposal.createdAt.replace('T', ' ').slice(0, 16);
          var unit = LANG === 'zh' ? '万' : '0K';
          var moUnit = LANG === 'zh' ? '月' : 'Mo';
          var roundPre = LANG === 'zh' ? '第' : 'Round ';
          var roundSuf = LANG === 'zh' ? '轮' : '';

          var html = '<div class="timeline-item" style="animation:fadeInUp 0.4s ease">'
            + '<div class="timeline-dot" style="background:var(--terms-dark);border-color:var(--terms-dark)"></div>'
            + '<div class="timeline-content" style="border:1.5px solid rgba(93,196,179,0.15)">'
            + '<div class="timeline-header">'
            + '<span class="timeline-round">📌 ' + roundPre + roundNum + roundSuf + '</span>'
            + '<span class="timeline-role">· ' + roleLabel + '</span>'
            + '<span class="timeline-time">' + timeStr + '</span>'
            + '<span style="margin-left:8px;font-size:10px;padding:2px 6px;border-radius:999px;background:var(--terms-light);color:var(--terms-dark)">NEW</span>'
            + '</div>'
            + '<div class="timeline-data">'
            + '<span>¥' + proposal.financingAmount + unit + '</span>'
            + '<span>' + proposal.revenueShareRatio + '%</span>'
            + '<span>' + proposal.cooperationTerm + moUnit + '</span>'
            + '<span>IRR ' + proposal.irr + '%</span>'
            + '</div>'
            + (proposal.note ? '<div class="timeline-note">"' + proposal.note + '"</div>' : '')
            + '</div></div>';

          container.insertAdjacentHTML('afterbegin', html);
          document.getElementById('negotiationNote').value = '';
          showToast(LANG === 'zh' ? '新方案已提交（第' + roundNum + '轮）' : 'Proposal submitted (Round ' + roundNum + ')', 'info');
        }

        function acceptTerms() {
          localStatus = 'agreed';
          lsSet(STATUS_KEY, 'agreed');
          updateStatusUI('agreed');
          showToast(LANG === 'zh' ? '条款已达成（Demo）' : 'Terms Agreed (Demo)', 'success');
        }

        function rejectTerms() {
          localStatus = 'rejected';
          lsSet(STATUS_KEY, 'rejected');
          updateStatusUI('rejected');
          showToast(LANG === 'zh' ? '条款已拒绝' : 'Terms Rejected', 'error');
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

        // ── Comparison with localStorage ──────────────────────
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
          lsSet(COMPARE_KEY, window.comparisonPlans);
          renderComparison();
          showToast(LANG === 'zh' ? '方案已保存到对比' : 'Plan saved to comparison', 'info');
        }

        function clearComparison() {
          window.comparisonPlans = [];
          lsSet(COMPARE_KEY, []);
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
        function initPage() {
          initSliders();
          renderLocalProposals();
          renderComparison();
          // Pre-fill inviter name from logged-in user
          try {
            var user = JSON.parse(localStorage.getItem('tc_user'));
            if (user && user.displayName) {
              var inp = document.getElementById('inviterNameInput');
              if (inp) inp.value = user.displayName;
            }
          } catch(e) {}
        }

        // ── Invite Modal ───────────────────────────────────────
        var inviteRole = 'negotiator';

        function openInviteModal() {
          document.getElementById('inviteModal').style.display = '';
          document.body.style.overflow = 'hidden';
        }
        function closeInviteModal() {
          var modal = document.getElementById('inviteModal');
          modal.style.opacity = '0';
          setTimeout(function() {
            modal.style.display = 'none';
            modal.style.opacity = '';
            document.body.style.overflow = '';
          }, 250);
        }
        function selectInviteRole(role) {
          inviteRole = role;
          document.getElementById('roleNegotiator').className =
            role === 'negotiator' ? 'invite-role-btn invite-role-active' : 'invite-role-btn';
          document.getElementById('roleObserver').className =
            role === 'observer' ? 'invite-role-btn invite-role-active' : 'invite-role-btn';
        }
        function resetInviteModal() {
          document.getElementById('invStepOptions').style.display = '';
          document.getElementById('invStepResult').style.display = 'none';
          document.getElementById('qrCodeContainer').innerHTML = '';
        }

        async function generateInvite() {
          var btn = document.getElementById('genInviteBtn');
          var inviterName = document.getElementById('inviterNameInput').value.trim() || (LANG==='zh'?'匿名用户':'Anonymous');
          var message = document.getElementById('inviteMessage').value.trim();
          btn.classList.add('btn-loading'); btn.disabled = true;
          try {
            var res = await fetch('/api/invite/create', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                negotiationId: NEGOTIATION_ID,
                inviterName: inviterName,
                role: inviteRole,
                message: message
              })
            });
            var data = await res.json();
            if (data.success) {
              var fullUrl = window.location.origin + data.invite.inviteUrl;
              document.getElementById('inviteLinkInput').value = fullUrl;

              // Generate QR code
              var qr = qrcode(0, 'M');
              qr.addData(fullUrl);
              qr.make();
              var container = document.getElementById('qrCodeContainer');
              container.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 4, scalable: true });
              // Style the SVG
              var svg = container.querySelector('svg');
              if (svg) {
                svg.style.width = '100%';
                svg.style.height = '100%';
                svg.style.maxWidth = '200px';
                svg.style.maxHeight = '200px';
              }

              document.getElementById('invStepOptions').style.display = 'none';
              document.getElementById('invStepResult').style.display = '';
              showToast(LANG==='zh'?'邀请链接已生成':'Invite link generated', 'success');
            } else {
              showToast(data.message || (LANG==='zh'?'生成失败':'Failed'), 'error');
            }
          } catch(e) {
            showToast(LANG==='zh'?'网络错误':'Network error', 'error');
          } finally { btn.classList.remove('btn-loading'); btn.disabled = false; }
        }

        function copyInviteLink() {
          var input = document.getElementById('inviteLinkInput');
          if (navigator.clipboard) {
            navigator.clipboard.writeText(input.value).then(function() {
              showToast(LANG==='zh'?'链接已复制到剪贴板':'Link copied!', 'success');
            });
          } else {
            input.select();
            document.execCommand('copy');
            showToast(LANG==='zh'?'链接已复制':'Link copied!', 'success');
          }
        }

        document.addEventListener('DOMContentLoaded', initPage);
        if (document.readyState !== 'loading') initPage();

        // ── Reveal animations ─────────────────────────────────
        (function() {
          var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(e) {
              if (e.isIntersecting) e.target.classList.add('visible');
            });
          }, { threshold: 0.1 });
          document.querySelectorAll('.reveal').forEach(function(el) { observer.observe(el); });
        })();
      `}} />

      {/* ── Animation keyframes ────────────────────────────── */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </main>
  )
}
