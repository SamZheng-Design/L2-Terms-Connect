import type { FC } from 'hono/jsx'
import { type Lang } from '../data/i18n'

interface InvitePageProps {
  lang: Lang
  token: string
}

export const InvitePage: FC<InvitePageProps> = ({ lang, token }) => {
  const zh = lang === 'zh'
  return (
    <main style="max-width:560px;margin:0 auto;padding:100px 24px 60px">
      {/* Invite Card */}
      <div class="card-static reveal" id="inviteCard" style="padding:0;overflow:hidden">
        {/* Header Banner */}
        <div class="invite-landing-header">
          <div class="invite-landing-rings">
            <div class="auth-circle auth-circle-top" style="width:36px;height:36px"></div>
            <div class="auth-circle auth-circle-bottom" style="width:36px;height:36px;opacity:0.8"></div>
          </div>
          <h2 class="invite-landing-title">{zh ? '协商邀请' : 'Negotiation Invite'}</h2>
          <p class="invite-landing-sub">{zh ? '您被邀请加入以下收入分成方案协商' : 'You are invited to join the following negotiation'}</p>
        </div>

        {/* Invite Details (populated by JS) */}
        <div style="padding:28px" id="inviteContent">
          <div class="invite-loading" id="inviteLoading">
            <i class="fas fa-circle-notch fa-spin" style="font-size:28px;color:var(--terms-dark)"></i>
            <p style="margin-top:12px;color:var(--text-tertiary);font-size:14px">{zh ? '正在验证邀请链接…' : 'Validating invite link…'}</p>
          </div>

          {/* Success content (hidden initially) */}
          <div id="inviteSuccess" style="display:none">
            <div class="invite-detail-grid">
              <div class="invite-detail-item">
                <span class="invite-detail-label"><i class="fas fa-project-diagram"></i> {zh ? '项目名称' : 'Project'}</span>
                <span class="invite-detail-value" id="invProjectName">-</span>
              </div>
              <div class="invite-detail-item">
                <span class="invite-detail-label"><i class="fas fa-user"></i> {zh ? '邀请人' : 'Inviter'}</span>
                <span class="invite-detail-value" id="invInviterName">-</span>
              </div>
              <div class="invite-detail-item">
                <span class="invite-detail-label"><i class="fas fa-user-tag"></i> {zh ? '角色' : 'Role'}</span>
                <span class="invite-detail-value" id="invRole">-</span>
              </div>
              <div class="invite-detail-item">
                <span class="invite-detail-label"><i class="fas fa-clock"></i> {zh ? '有效期' : 'Expires'}</span>
                <span class="invite-detail-value" id="invExpires">-</span>
              </div>
            </div>
            <div id="invMessage" style="display:none;margin:16px 0;padding:14px 18px;background:var(--terms-light);border-radius:var(--radius-md);font-size:14px;color:var(--text-secondary)">
              <i class="fas fa-comment-dots" style="color:var(--terms-dark);margin-right:6px"></i>
              <span id="invMessageText"></span>
            </div>
            <button class="btn btn-primary" style="width:100%;margin-top:20px;padding:14px;font-size:16px" onclick="acceptInvite()">
              <i class="fas fa-handshake"></i>
              {zh ? '接受邀请，加入协商' : 'Accept & Join Negotiation'}
            </button>
          </div>

          {/* Error content (hidden initially) */}
          <div id="inviteError" style="display:none;text-align:center;padding:20px 0">
            <i class="fas fa-exclamation-triangle" style="font-size:48px;color:var(--color-warning);margin-bottom:16px"></i>
            <h3 id="invErrorTitle" style="font-size:18px;font-weight:700;color:var(--text-title);margin-bottom:8px"></h3>
            <p id="invErrorMsg" style="font-size:14px;color:var(--text-tertiary)"></p>
            <a href="/" class="btn btn-secondary" style="margin-top:20px;display:inline-flex">
              <i class="fas fa-home"></i> {zh ? '返回首页' : 'Go Home'}
            </a>
          </div>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{__html: `
        var LANG = '${lang}';
        var TOKEN = '${token}';
        var zh = LANG === 'zh';

        async function loadInvite() {
          try {
            var res = await fetch('/api/invite/' + TOKEN);
            var data = await res.json();
            document.getElementById('inviteLoading').style.display = 'none';

            if (data.success) {
              var inv = data.invite;
              document.getElementById('invProjectName').textContent = inv.projectName;
              document.getElementById('invInviterName').textContent = inv.inviterName;
              var roleMap = { observer: zh ? '观察者' : 'Observer', negotiator: zh ? '协商方' : 'Negotiator' };
              document.getElementById('invRole').textContent = roleMap[inv.role] || inv.role;
              document.getElementById('invExpires').textContent = new Date(inv.expiresAt).toLocaleDateString();
              if (inv.message) {
                document.getElementById('invMessage').style.display = '';
                document.getElementById('invMessageText').textContent = inv.message;
              }
              document.getElementById('inviteSuccess').style.display = '';
            } else {
              showInviteError(
                zh ? '邀请无效' : 'Invalid Invite',
                data.message || (zh ? '该邀请链接无效或已过期' : 'This invite link is invalid or expired')
              );
            }
          } catch(e) {
            showInviteError(
              zh ? '网络错误' : 'Network Error',
              zh ? '无法连接到服务器，请稍后重试' : 'Could not connect to server'
            );
          }
        }

        function showInviteError(title, msg) {
          document.getElementById('inviteLoading').style.display = 'none';
          document.getElementById('invErrorTitle').textContent = title;
          document.getElementById('invErrorMsg').textContent = msg;
          document.getElementById('inviteError').style.display = '';
        }

        async function acceptInvite() {
          var btn = document.querySelector('#inviteSuccess button');
          btn.classList.add('btn-loading'); btn.disabled = true;
          try {
            var res = await fetch('/api/invite/' + TOKEN + '/accept', { method: 'POST', headers: { 'Content-Type': 'application/json' } });
            var data = await res.json();
            if (data.success) {
              window.location.href = data.redirectUrl + '?lang=' + LANG;
            } else {
              alert(data.message || (zh ? '加入失败' : 'Failed to join'));
            }
          } catch(e) {
            alert(zh ? '网络错误' : 'Network Error');
          } finally { btn.classList.remove('btn-loading'); btn.disabled = false; }
        }

        loadInvite();
      `}} />
    </main>
  )
}
