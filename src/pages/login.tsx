import type { FC } from 'hono/jsx'
import { TEXT, t, type Lang } from '../data/i18n'

interface LoginPageProps {
  lang: Lang
}

export const LoginPage: FC<LoginPageProps> = ({ lang }) => {
  return (
    <div class="login-page">
      {/* Aurora background particles */}
      <div class="login-aurora">
        <div class="login-aurora-orb login-aurora-orb-1"></div>
        <div class="login-aurora-orb login-aurora-orb-2"></div>
        <div class="login-aurora-orb login-aurora-orb-3"></div>
      </div>

      {/* Login Card */}
      <div class="login-container">
        {/* Animated Logo */}
        <div class="login-logo-wrap">
          <div class="login-logo-rings">
            <div class="login-logo-ring login-ring-outer"></div>
            <div class="login-logo-ring login-ring-inner"></div>
          </div>
          <div class="login-logo-icon">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
              <path d="M20 4L34 12V28L20 36L6 28V12L20 4Z" stroke="white" stroke-width="2" fill="none" opacity="0.9"/>
              <path d="M20 10L28 14.5V23.5L20 28L12 23.5V14.5L20 10Z" fill="rgba(93,196,179,0.5)" stroke="white" stroke-width="1.5"/>
              <circle cx="20" cy="19" r="4" fill="white" opacity="0.9"/>
            </svg>
          </div>
        </div>

        {/* Brand Text */}
        <div class="login-brand">
          <div class="login-brand-title">条款通</div>
          <div class="login-brand-sub">Terms Connect</div>
          <div class="login-brand-desc">{lang === 'zh' ? '智能条款协商平台 · 滴灌通' : 'Smart Terms Negotiation · Micro Connect'}</div>
        </div>

        {/* Glass Form Card */}
        <div class="login-card">
          {/* Tab Switcher */}
          <div class="login-tabs" id="loginTabs">
            <button class="login-tab active" data-tab="login" onclick="switchTab('login')">
              <i class="fas fa-sign-in-alt"></i>
              {lang === 'zh' ? '登录' : 'Login'}
            </button>
            <button class="login-tab" data-tab="register" onclick="switchTab('register')">
              <i class="fas fa-user-plus"></i>
              {lang === 'zh' ? '注册' : 'Register'}
            </button>
          </div>

          {/* Login Form */}
          <form id="loginForm" class="login-form" onsubmit="handleLogin(event)">
            <div class="login-field">
              <label class="login-label">
                <i class="fas fa-user"></i>
                {lang === 'zh' ? '用户名 / 邮箱' : 'Username / Email'}
              </label>
              <input type="text" id="loginId" class="login-input" placeholder={lang === 'zh' ? '请输入用户名或邮箱' : 'Enter username or email'} required />
            </div>
            <div class="login-field">
              <label class="login-label">
                <i class="fas fa-lock"></i>
                {lang === 'zh' ? '密码' : 'Password'}
              </label>
              <input type="password" id="loginPassword" class="login-input" placeholder={lang === 'zh' ? '请输入密码' : 'Enter password'} required />
            </div>
            <button type="submit" class="login-submit btn-primary" id="loginBtn">
              <i class="fas fa-arrow-right"></i>
              {lang === 'zh' ? '登录' : 'Sign In'}
            </button>
          </form>

          {/* Register Form (hidden by default) */}
          <form id="registerForm" class="login-form" style="display:none" onsubmit="handleRegister(event)">
            <div class="login-field">
              <label class="login-label">
                <i class="fas fa-user"></i>
                {lang === 'zh' ? '用户名' : 'Username'}
              </label>
              <input type="text" id="regUsername" class="login-input" placeholder={lang === 'zh' ? '请输入用户名' : 'Enter username'} required />
            </div>
            <div class="login-field">
              <label class="login-label">
                <i class="fas fa-envelope"></i>
                {lang === 'zh' ? '邮箱' : 'Email'}
              </label>
              <input type="email" id="regEmail" class="login-input" placeholder={lang === 'zh' ? '请输入邮箱' : 'Enter email'} required />
            </div>
            <div class="login-field">
              <label class="login-label">
                <i class="fas fa-lock"></i>
                {lang === 'zh' ? '密码' : 'Password'}
              </label>
              <input type="password" id="regPassword" class="login-input" placeholder={lang === 'zh' ? '设置密码（至少6位）' : 'Set password (min 6 chars)'} required minlength={6} />
            </div>
            <div class="login-field">
              <label class="login-label">
                <i class="fas fa-building"></i>
                {lang === 'zh' ? '公司（选填）' : 'Company (optional)'}
              </label>
              <input type="text" id="regCompany" class="login-input" placeholder={lang === 'zh' ? '公司名称' : 'Company name'} />
            </div>
            <div class="login-field">
              <label class="login-label">
                <i class="fas fa-user-tag"></i>
                {lang === 'zh' ? '默认角色' : 'Default Role'}
              </label>
              <div class="login-role-group">
                <label class="login-role-option">
                  <input type="radio" name="defaultRole" value="borrower" checked />
                  <span class="login-role-chip">
                    <i class="fas fa-store"></i>
                    {lang === 'zh' ? '融资方' : 'Borrower'}
                  </span>
                </label>
                <label class="login-role-option">
                  <input type="radio" name="defaultRole" value="investor" />
                  <span class="login-role-chip">
                    <i class="fas fa-chart-line"></i>
                    {lang === 'zh' ? '投资方' : 'Investor'}
                  </span>
                </label>
              </div>
            </div>
            <button type="submit" class="login-submit btn-primary" id="registerBtn">
              <i class="fas fa-user-plus"></i>
              {lang === 'zh' ? '注册' : 'Sign Up'}
            </button>
          </form>

          {/* Divider */}
          <div class="login-divider">
            <span>{lang === 'zh' ? '或' : 'or'}</span>
          </div>

          {/* Guest Mode */}
          <button class="login-guest" onclick={`guestEnter('${lang}')`}>
            <i class="fas fa-rocket"></i>
            {lang === 'zh' ? '游客模式体验' : 'Continue as Guest'}
          </button>
        </div>

        {/* Footer */}
        <div class="login-footer">
          <span>POWERED BY</span>
          <span class="login-footer-brand">MICRO CONNECT GROUP</span>
        </div>
      </div>

      {/* Error/Success Toast */}
      <div id="loginToast" class="toast" style="z-index:10000"></div>

      {/* Scripts */}
      <script dangerouslySetInnerHTML={{__html: `
        var currentLang = '${lang}';

        function switchTab(tab) {
          document.querySelectorAll('.login-tab').forEach(function(t) {
            t.classList.toggle('active', t.dataset.tab === tab);
          });
          document.getElementById('loginForm').style.display = tab === 'login' ? 'flex' : 'none';
          document.getElementById('registerForm').style.display = tab === 'register' ? 'flex' : 'none';
        }

        function showToast(msg, type) {
          var toast = document.getElementById('loginToast');
          toast.textContent = msg;
          toast.className = 'toast toast-' + (type || 'info') + ' show';
          setTimeout(function() { toast.classList.remove('show'); }, 3000);
        }

        async function handleLogin(e) {
          e.preventDefault();
          var btn = document.getElementById('loginBtn');
          btn.disabled = true;
          btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ' + (currentLang === 'zh' ? '登录中...' : 'Signing in...');
          
          try {
            var res = await fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                username: document.getElementById('loginId').value,
                password: document.getElementById('loginPassword').value
              })
            });
            var data = await res.json();
            
            if (data.success) {
              localStorage.setItem('tc_token', data.token);
              localStorage.setItem('tc_user', JSON.stringify(data.user));
              showToast(currentLang === 'zh' ? '登录成功！' : 'Login successful!', 'success');
              setTimeout(function() {
                window.location.href = '/?lang=' + currentLang;
              }, 600);
            } else {
              showToast(data.message || (currentLang === 'zh' ? '登录失败' : 'Login failed'), 'error');
              btn.disabled = false;
              btn.innerHTML = '<i class="fas fa-arrow-right"></i> ' + (currentLang === 'zh' ? '登录' : 'Sign In');
            }
          } catch (err) {
            showToast(currentLang === 'zh' ? '网络错误' : 'Network error', 'error');
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-arrow-right"></i> ' + (currentLang === 'zh' ? '登录' : 'Sign In');
          }
        }

        async function handleRegister(e) {
          e.preventDefault();
          var btn = document.getElementById('registerBtn');
          btn.disabled = true;
          btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ' + (currentLang === 'zh' ? '注册中...' : 'Registering...');

          var role = document.querySelector('input[name="defaultRole"]:checked').value;
          
          try {
            var res = await fetch('/api/auth/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                username: document.getElementById('regUsername').value,
                email: document.getElementById('regEmail').value,
                password: document.getElementById('regPassword').value,
                company: document.getElementById('regCompany').value,
                defaultRole: role
              })
            });
            var data = await res.json();
            
            if (data.success) {
              localStorage.setItem('tc_token', data.token);
              localStorage.setItem('tc_user', JSON.stringify(data.user));
              showToast(currentLang === 'zh' ? '注册成功！' : 'Registration successful!', 'success');
              setTimeout(function() {
                window.location.href = '/?lang=' + currentLang;
              }, 600);
            } else {
              showToast(data.message || (currentLang === 'zh' ? '注册失败' : 'Registration failed'), 'error');
              btn.disabled = false;
              btn.innerHTML = '<i class="fas fa-user-plus"></i> ' + (currentLang === 'zh' ? '注册' : 'Sign Up');
            }
          } catch (err) {
            showToast(currentLang === 'zh' ? '网络错误' : 'Network error', 'error');
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-user-plus"></i> ' + (currentLang === 'zh' ? '注册' : 'Sign Up');
          }
        }

        function guestEnter(lang) {
          localStorage.setItem('tc_user', JSON.stringify({
            id: 'guest_' + Date.now(),
            username: 'guest',
            displayName: lang === 'zh' ? '游客' : 'Guest',
            defaultRole: 'both',
            isGuest: true
          }));
          localStorage.removeItem('tc_token');
          window.location.href = '/?lang=' + lang;
        }

        // Language switch
        function switchLang(newLang) {
          var url = new URL(window.location.href);
          url.searchParams.set('lang', newLang);
          window.location.href = url.toString();
        }
      `}} />
    </div>
  )
}
