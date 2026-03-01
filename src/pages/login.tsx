import type { FC } from 'hono/jsx'
import { type Lang } from '../data/i18n'

interface LoginPageProps {
  lang: Lang
}

export const LoginPage: FC<LoginPageProps> = ({ lang }) => {
  return (
    <div class="page active flex-col min-h-screen cyber-bg particles-bg" style="display:flex; overflow-y:auto; -webkit-overflow-scrolling:touch">
      <div class="flex-1 flex flex-col items-center p-4 relative" style="z-index:10">
        <div class="auth-card animate-scale-in" style="margin-top:auto; margin-bottom:auto">
          {/* ── Logo Area ── */}
          <div class="auth-logo-section">
            {/* Dual-circle overlapping logo (V33) */}
            <div class="auth-logo-circles animate-float">
              <div class="auth-circle auth-circle-top"></div>
              <div class="auth-circle auth-circle-bottom"></div>
            </div>
            <h1 class="auth-brand-title">CONTRACT<br/>CONNECT</h1>
            <div class="auth-brand-line"></div>
            <p class="auth-brand-powered">POWERED BY MICRO CONNECT GROUP</p>
            <p class="auth-brand-cn">{lang === 'zh' ? '条款通' : 'Terms Connect'}</p>
          </div>

          {/* ── Login / Register Tabs ── */}
          <div class="auth-tabs">
            <button onclick="switchAuthTab('login')" id="tabLogin" class="auth-tab auth-tab-active">
              {lang === 'zh' ? '登录' : 'Login'}
            </button>
            <button onclick="switchAuthTab('register')" id="tabRegister" class="auth-tab">
              {lang === 'zh' ? '注册' : 'Register'}
            </button>
          </div>

          {/* ── Login Form ── */}
          <div id="formLogin" class="auth-form-wrap">
            <form onsubmit="event.preventDefault(); handleLogin();" autocomplete="on">
              <div class="auth-fields">
                <div class="auth-field">
                  <label class="auth-label">{lang === 'zh' ? '用户名 / 邮箱' : 'Username / Email'}</label>
                  <input type="text" id="loginUsername" class="auth-input"
                    placeholder={lang === 'zh' ? '请输入用户名或邮箱' : 'Enter username or email'}
                    autocomplete="username"
                    onkeydown="if(event.key==='Enter')document.getElementById('loginPassword').focus()" />
                </div>
                <div class="auth-field">
                  <label class="auth-label">{lang === 'zh' ? '密码' : 'Password'}</label>
                  <div class="password-wrapper">
                    <input type="password" id="loginPassword" class="auth-input" style="padding-right:44px"
                      placeholder={lang === 'zh' ? '请输入密码' : 'Enter password'}
                      autocomplete="current-password" />
                    <button type="button" onclick="togglePwdVis('loginPassword', this)" class="password-toggle" tabindex={-1}>
                      <i class="fas fa-eye"></i>
                    </button>
                  </div>
                </div>
                <div class="auth-row" style="justify-content:space-between">
                  <label class="auth-check-label">
                    <input type="checkbox" id="rememberMe" class="auth-checkbox" />
                    <span>{lang === 'zh' ? '记住我' : 'Remember me'}</span>
                  </label>
                  <a href="#" class="auth-link">{lang === 'zh' ? '忘记密码？' : 'Forgot password?'}</a>
                </div>
                <button type="submit" class="auth-btn-primary" id="loginBtn">
                  <i class="fas fa-sign-in-alt"></i>
                  {lang === 'zh' ? '登录' : 'Sign In'}
                </button>
                <button type="button" class="auth-btn-guest" onclick={`handleGuestLogin('${lang}')`}>
                  <i class="fas fa-user-secret"></i>
                  {lang === 'zh' ? '游客模式（体验功能）' : 'Guest Mode (Demo)'}
                </button>
              </div>
              <p id="loginError" class="form-error" style="display:none"></p>
            </form>

            {/* SSO Placeholder */}
            <div class="auth-sso-section">
              <p class="auth-sso-label">{lang === 'zh' ? '企业用户' : 'Enterprise'}</p>
              <button onclick="handleSSOLogin()" class="auth-btn-sso">
                <i class="fas fa-building"></i>
                {lang === 'zh' ? '公司SSO登录（即将上线）' : 'Company SSO Login (Coming Soon)'}
              </button>
            </div>
          </div>

          {/* ── Register Form (hidden) ── */}
          <div id="formRegister" class="auth-form-wrap" style="display:none">
            <form onsubmit="event.preventDefault(); handleRegister();" autocomplete="on">
              <div class="auth-fields">
                <div class="auth-grid-2">
                  <div class="auth-field">
                    <label class="auth-label">{lang === 'zh' ? '用户名' : 'Username'} <span class="auth-required">*</span></label>
                    <input type="text" id="regUsername" class="auth-input"
                      placeholder={lang === 'zh' ? '用于登录' : 'For login'} />
                  </div>
                  <div class="auth-field">
                    <label class="auth-label">{lang === 'zh' ? '姓名' : 'Display Name'}</label>
                    <input type="text" id="regDisplayName" class="auth-input"
                      placeholder={lang === 'zh' ? '显示名称' : 'Display name'} />
                  </div>
                </div>
                <div class="auth-field">
                  <label class="auth-label">{lang === 'zh' ? '邮箱' : 'Email'} <span class="auth-required">*</span></label>
                  <input type="email" id="regEmail" class="auth-input"
                    placeholder={lang === 'zh' ? 'your@email.com' : 'your@email.com'} />
                </div>
                <div class="auth-field">
                  <label class="auth-label">{lang === 'zh' ? '手机号' : 'Phone'}</label>
                  <input type="tel" id="regPhone" class="auth-input"
                    placeholder={lang === 'zh' ? '13800138000' : '13800138000'} />
                </div>
                <div class="auth-field">
                  <label class="auth-label">{lang === 'zh' ? '密码' : 'Password'} <span class="auth-required">*</span></label>
                  <div class="password-wrapper">
                    <input type="password" id="regPassword" class="auth-input" style="padding-right:44px"
                      placeholder={lang === 'zh' ? '至少6位' : 'Min 6 chars'}
                      autocomplete="new-password" />
                    <button type="button" onclick="togglePwdVis('regPassword', this)" class="password-toggle" tabindex={-1}>
                      <i class="fas fa-eye"></i>
                    </button>
                  </div>
                </div>
                <div class="auth-field">
                  <label class="auth-label">{lang === 'zh' ? '默认角色' : 'Default Role'}</label>
                  <div class="auth-role-grid">
                    <button type="button" onclick="selectRegRole('investor')" id="regRoleInvestor" class="auth-role-btn">
                      <i class="fas fa-landmark" style="color:var(--color-primary)"></i>
                      {lang === 'zh' ? '投资方' : 'Investor'}
                    </button>
                    <button type="button" onclick="selectRegRole('borrower')" id="regRoleBorrower" class="auth-role-btn">
                      <i class="fas fa-store" style="color:var(--color-accent-amber)"></i>
                      {lang === 'zh' ? '融资方' : 'Borrower'}
                    </button>
                    <button type="button" onclick="selectRegRole('both')" id="regRoleBoth" class="auth-role-btn auth-role-active">
                      <i class="fas fa-exchange-alt" style="color:var(--color-accent-cyan)"></i>
                      {lang === 'zh' ? '两者皆可' : 'Both'}
                    </button>
                  </div>
                </div>
                <div class="auth-grid-2">
                  <div class="auth-field">
                    <label class="auth-label">{lang === 'zh' ? '公司' : 'Company'}</label>
                    <input type="text" id="regCompany" class="auth-input"
                      placeholder={lang === 'zh' ? '所属公司' : 'Company'} />
                  </div>
                  <div class="auth-field">
                    <label class="auth-label">{lang === 'zh' ? '职位' : 'Title'}</label>
                    <input type="text" id="regTitle" class="auth-input"
                      placeholder={lang === 'zh' ? '您的职位' : 'Your title'} />
                  </div>
                </div>
                <button type="submit" class="auth-btn-primary" id="registerBtn">
                  <i class="fas fa-user-plus"></i>
                  {lang === 'zh' ? '注册' : 'Sign Up'}
                </button>
              </div>
              <p id="registerError" class="form-error" style="display:none"></p>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <p class="auth-page-footer">&copy; 2026 {lang === 'zh' ? '条款通 Terms Connect · 滴灌通' : 'Terms Connect · Micro Connect Group'}</p>

      {/* Toast */}
      <div id="authToast" class="toast" style="z-index:10000"></div>

      {/* ══ Scripts ══ */}
      <script dangerouslySetInnerHTML={{__html: `
        var currentLang = '${lang}';
        var selectedRegRole = 'both';

        /* ── Tab Switch ── */
        function switchAuthTab(tab) {
          var tabLogin = document.getElementById('tabLogin');
          var tabRegister = document.getElementById('tabRegister');
          tabLogin.className = tab === 'login' ? 'auth-tab auth-tab-active' : 'auth-tab';
          tabRegister.className = tab === 'register' ? 'auth-tab auth-tab-active' : 'auth-tab';
          document.getElementById('formLogin').style.display = tab === 'login' ? '' : 'none';
          document.getElementById('formRegister').style.display = tab === 'register' ? '' : 'none';
        }

        /* ── Password Visibility Toggle ── */
        function togglePwdVis(inputId, btn) {
          var input = document.getElementById(inputId);
          var icon = btn.querySelector('i');
          if (input.type === 'password') {
            input.type = 'text';
            icon.className = 'fas fa-eye-slash';
          } else {
            input.type = 'password';
            icon.className = 'fas fa-eye';
          }
        }

        /* ── Role Selector ── */
        function selectRegRole(role) {
          selectedRegRole = role;
          ['investor','borrower','both'].forEach(function(r) {
            var btn = document.getElementById('regRole' + r.charAt(0).toUpperCase() + r.slice(1));
            if (btn) btn.className = r === role ? 'auth-role-btn auth-role-active' : 'auth-role-btn';
          });
        }

        /* ── Toast ── */
        function showAuthToast(msg, type) {
          var t = document.getElementById('authToast');
          t.textContent = msg;
          t.className = 'toast toast-' + (type||'info') + ' show';
          setTimeout(function() { t.classList.remove('show'); }, 3000);
        }

        /* ── Show Form Error ── */
        function showFormError(elId, msg) {
          var el = document.getElementById(elId);
          el.innerHTML = '<i class="fas fa-exclamation-circle" style="margin-right:6px"></i>' + msg;
          el.style.display = '';
          el.className = 'form-error';
        }
        function hideFormError(elId) {
          document.getElementById(elId).style.display = 'none';
        }

        /* ── Login ── */
        async function handleLogin() {
          var username = document.getElementById('loginUsername').value.trim();
          var password = document.getElementById('loginPassword').value;
          var btn = document.getElementById('loginBtn');
          hideFormError('loginError');

          if (!username || !password) {
            showFormError('loginError', currentLang === 'zh' ? '请输入用户名和密码' : 'Please enter username and password');
            return;
          }

          btn.classList.add('btn-loading'); btn.disabled = true;

          try {
            var res = await fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username: username, password: password })
            });
            var data = await res.json();

            if (data.success) {
              localStorage.setItem('tc_token', data.token);
              localStorage.setItem('tc_user', JSON.stringify(data.user));
              hideFormError('loginError');
              showAuthToast(currentLang === 'zh' ? '登录成功！' : 'Login successful!', 'success');
              setTimeout(function() { window.location.href = '/?lang=' + currentLang; }, 600);
            } else {
              showFormError('loginError', data.message || (currentLang === 'zh' ? '登录失败' : 'Login failed'));
            }
          } catch(e) {
            showFormError('loginError', currentLang === 'zh' ? '网络错误，请重试' : 'Network error');
          } finally {
            btn.classList.remove('btn-loading'); btn.disabled = false;
          }
        }

        /* ── Register ── */
        async function handleRegister() {
          var username = document.getElementById('regUsername').value.trim();
          var email = document.getElementById('regEmail').value.trim();
          var password = document.getElementById('regPassword').value;
          var displayName = document.getElementById('regDisplayName').value.trim();
          var phone = document.getElementById('regPhone').value.trim();
          var company = document.getElementById('regCompany').value.trim();
          var title = document.getElementById('regTitle').value.trim();
          var btn = document.getElementById('registerBtn');
          hideFormError('registerError');

          if (!username || !email || !password) {
            showFormError('registerError', currentLang === 'zh' ? '请填写必填项（用户名、邮箱、密码）' : 'Required: username, email, password');
            return;
          }
          if (password.length < 6) {
            showFormError('registerError', currentLang === 'zh' ? '密码至少6位' : 'Password min 6 chars');
            return;
          }

          btn.classList.add('btn-loading'); btn.disabled = true;

          try {
            var res = await fetch('/api/auth/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username:username, email:email, password:password, displayName:displayName, phone:phone, company:company, title:title, defaultRole:selectedRegRole })
            });
            var data = await res.json();

            if (data.success) {
              localStorage.setItem('tc_token', data.token);
              localStorage.setItem('tc_user', JSON.stringify(data.user));
              hideFormError('registerError');
              showAuthToast(currentLang === 'zh' ? '注册成功！欢迎加入条款通' : 'Registration successful!', 'success');
              setTimeout(function() { window.location.href = '/?lang=' + currentLang; }, 600);
            } else {
              showFormError('registerError', data.message || (currentLang === 'zh' ? '注册失败' : 'Registration failed'));
            }
          } catch(e) {
            showFormError('registerError', currentLang === 'zh' ? '网络错误，请重试' : 'Network error');
          } finally {
            btn.classList.remove('btn-loading'); btn.disabled = false;
          }
        }

        /* ── Guest Login ── */
        function handleGuestLogin(lang) {
          localStorage.setItem('tc_user', JSON.stringify({
            id: 'guest_' + Date.now(),
            username: 'guest',
            displayName: lang === 'zh' ? '游客用户' : 'Guest User',
            email: '',
            defaultRole: 'both',
            isGuest: true
          }));
          localStorage.setItem('tc_token', 'guest_token');
          showAuthToast(lang === 'zh' ? '游客模式，可自由体验所有功能' : 'Guest mode, explore all features', 'info');
          setTimeout(function() { window.location.href = '/?lang=' + lang; }, 500);
        }

        /* ── SSO Placeholder ── */
        function handleSSOLogin() {
          showAuthToast(currentLang === 'zh' ? '公司SSO登录功能即将上线' : 'Company SSO coming soon', 'info');
        }
      `}} />
    </div>
  )
}
