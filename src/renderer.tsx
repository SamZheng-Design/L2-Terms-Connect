import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html lang="zh-CN">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>条款通 Terms Connect — Micro Connect 滴灌通</title>
        <meta name="description" content="三联动滑块 · 投融资双方实时磋商 · RBF 条款达成" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2280%22>⚖️</text></svg>" />

        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Montserrat:wght@700;800;900&family=Noto+Sans+SC:wght@300;400;500;700&display=swap" rel="stylesheet" />

        {/* Tailwind CSS */}
        <script src="https://cdn.tailwindcss.com"></script>

        {/* FontAwesome */}
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />

        {/* QR Code Generator */}
        <script src="https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js"></script>

        {/* Design System CSS */}
        <link href="/static/style.css" rel="stylesheet" />
      </head>
      <body class="bg-page text-primary antialiased">
        {/* ═══ V33 Loading Screen ═══ */}
        <div id="app-loading">
          <div class="loading-logo">
            <div class="loading-logo-ring loading-logo-ring-outer"></div>
            <div class="loading-logo-ring loading-logo-ring-inner"></div>
            <div class="loading-logo-center">⚖️</div>
          </div>
          <div class="loading-text">条款通 Terms Connect</div>
          <div class="loading-sub">智能条款协商平台</div>
          <div class="loading-progress">
            <div class="loading-progress-bar"></div>
          </div>
          <div class="loading-powered">POWERED BY MICRO CONNECT GROUP</div>
        </div>

        {/* ═══ Main Content ═══ */}
        {children}

        {/* ═══ V33 Auth Modal Overlay ═══ */}
        <div id="authOverlay" class="auth-overlay" style="display:none">
          <div class="auth-overlay-bg"></div>
          <div class="auth-overlay-center">
            <div class="auth-card animate-scale-in">
              {/* Logo Area */}
              <div class="auth-logo-section">
                <div class="auth-logo-circles animate-float">
                  <div class="auth-circle auth-circle-top"></div>
                  <div class="auth-circle auth-circle-bottom"></div>
                </div>
                <h1 class="auth-brand-title">CONTRACT<br/>CONNECT</h1>
                <div class="auth-brand-line"></div>
                <p class="auth-brand-powered">POWERED BY MICRO CONNECT GROUP</p>
                <p class="auth-brand-cn">条款通</p>
              </div>

              {/* Tabs */}
              <div class="auth-tabs">
                <button onclick="switchAuthTab('login')" id="oTabLogin" class="auth-tab auth-tab-active">登录</button>
                <button onclick="switchAuthTab('register')" id="oTabRegister" class="auth-tab">注册</button>
              </div>

              {/* Login Form */}
              <div id="oFormLogin" class="auth-form-wrap">
                <form onsubmit="event.preventDefault(); oHandleLogin();" autocomplete="on">
                  <div class="auth-fields">
                    <div class="auth-field">
                      <label class="auth-label">用户名 / 邮箱</label>
                      <input type="text" id="oLoginUsername" class="auth-input" placeholder="请输入用户名或邮箱" autocomplete="username"
                        onkeydown="if(event.key==='Enter')document.getElementById('oLoginPassword').focus()" />
                    </div>
                    <div class="auth-field">
                      <label class="auth-label">密码</label>
                      <div class="password-wrapper">
                        <input type="password" id="oLoginPassword" class="auth-input" style="padding-right:44px"
                          placeholder="请输入密码" autocomplete="current-password" />
                        <button type="button" onclick="oTogglePwd('oLoginPassword',this)" class="password-toggle" tabindex={-1}>
                          <i class="fas fa-eye"></i>
                        </button>
                      </div>
                    </div>
                    <div class="auth-row" style="justify-content:space-between">
                      <label class="auth-check-label">
                        <input type="checkbox" class="auth-checkbox" />
                        <span>记住我</span>
                      </label>
                      <a href="#" class="auth-link">忘记密码？</a>
                    </div>
                    <button type="submit" class="auth-btn-primary" id="oLoginBtn">
                      <i class="fas fa-sign-in-alt"></i> 登录
                    </button>
                    <button type="button" class="auth-btn-guest" onclick="oGuestLogin()">
                      <i class="fas fa-user-secret"></i> 游客模式（体验功能）
                    </button>
                  </div>
                  <p id="oLoginError" class="form-error" style="display:none"></p>
                </form>
                <div class="auth-sso-section">
                  <p class="auth-sso-label">企业用户</p>
                  <button class="auth-btn-sso" onclick="oSSOLogin()">
                    <i class="fas fa-building"></i> 公司SSO登录（即将上线）
                  </button>
                </div>
              </div>

              {/* Register Form */}
              <div id="oFormRegister" class="auth-form-wrap" style="display:none">
                <form onsubmit="event.preventDefault(); oHandleRegister();" autocomplete="on">
                  <div class="auth-fields">
                    <div class="auth-grid-2">
                      <div class="auth-field">
                        <label class="auth-label">用户名 <span class="auth-required">*</span></label>
                        <input type="text" id="oRegUsername" class="auth-input" placeholder="用于登录" />
                      </div>
                      <div class="auth-field">
                        <label class="auth-label">姓名</label>
                        <input type="text" id="oRegDisplayName" class="auth-input" placeholder="显示名称" />
                      </div>
                    </div>
                    <div class="auth-field">
                      <label class="auth-label">邮箱 <span class="auth-required">*</span></label>
                      <input type="email" id="oRegEmail" class="auth-input" placeholder="your@email.com" />
                    </div>
                    <div class="auth-field">
                      <label class="auth-label">手机号</label>
                      <input type="tel" id="oRegPhone" class="auth-input" placeholder="13800138000" />
                    </div>
                    <div class="auth-field">
                      <label class="auth-label">密码 <span class="auth-required">*</span></label>
                      <div class="password-wrapper">
                        <input type="password" id="oRegPassword" class="auth-input" style="padding-right:44px"
                          placeholder="至少6位" autocomplete="new-password" />
                        <button type="button" onclick="oTogglePwd('oRegPassword',this)" class="password-toggle" tabindex={-1}>
                          <i class="fas fa-eye"></i>
                        </button>
                      </div>
                    </div>
                    <div class="auth-field">
                      <label class="auth-label">默认角色</label>
                      <div class="auth-role-grid">
                        <button type="button" onclick="oSelectRole('investor')" id="oRoleInvestor" class="auth-role-btn">
                          <i class="fas fa-landmark" style="color:var(--color-primary)"></i>投资方
                        </button>
                        <button type="button" onclick="oSelectRole('borrower')" id="oRoleBorrower" class="auth-role-btn">
                          <i class="fas fa-store" style="color:var(--color-accent-amber)"></i>融资方
                        </button>
                        <button type="button" onclick="oSelectRole('both')" id="oRoleBoth" class="auth-role-btn auth-role-active">
                          <i class="fas fa-exchange-alt" style="color:var(--color-accent-cyan)"></i>两者皆可
                        </button>
                      </div>
                    </div>
                    <div class="auth-grid-2">
                      <div class="auth-field">
                        <label class="auth-label">公司</label>
                        <input type="text" id="oRegCompany" class="auth-input" placeholder="所属公司" />
                      </div>
                      <div class="auth-field">
                        <label class="auth-label">职位</label>
                        <input type="text" id="oRegTitle" class="auth-input" placeholder="您的职位" />
                      </div>
                    </div>
                    <button type="submit" class="auth-btn-primary" id="oRegisterBtn">
                      <i class="fas fa-user-plus"></i> 注册
                    </button>
                  </div>
                  <p id="oRegisterError" class="form-error" style="display:none"></p>
                </form>
              </div>
            </div>
            <p class="auth-page-footer">&copy; 2026 条款通 Terms Connect · 滴灌通</p>
          </div>
        </div>

        {/* ═══ Auth Overlay Toast ═══ */}
        <div id="oAuthToast" class="toast" style="z-index:10001"></div>

        {/* ═══ Loading Screen Dismiss + Auth Check Script ═══ */}
        <script dangerouslySetInnerHTML={{__html: `
          (function() {
            /* ── Loading Screen ── */
            var loading = document.getElementById('app-loading');
            if (loading) {
              window.addEventListener('load', function() {
                setTimeout(function() {
                  loading.classList.add('fade-out');
                  setTimeout(function() {
                    loading.style.display = 'none';
                    // After loading screen fades, check auth
                    checkAndShowAuth();
                  }, 600);
                }, 1200);
              });
              setTimeout(function() {
                if (loading && !loading.classList.contains('fade-out')) {
                  loading.classList.add('fade-out');
                  setTimeout(function() {
                    loading.style.display = 'none';
                    checkAndShowAuth();
                  }, 600);
                }
              }, 3000);
            }

            /* ── Auth State Check ── */
            function checkAndShowAuth() {
              // Skip on standalone /login page
              if (window.location.pathname === '/login') return;
              var user = null;
              try { user = JSON.parse(localStorage.getItem('tc_user')); } catch(e) {}
              if (!user || !user.id) {
                document.getElementById('authOverlay').style.display = '';
                document.body.style.overflow = 'hidden';
              }
            }

            /* ── Close auth overlay ── */
            window._closeAuthOverlay = function() {
              var overlay = document.getElementById('authOverlay');
              overlay.style.opacity = '0';
              setTimeout(function() {
                overlay.style.display = 'none';
                overlay.style.opacity = '';
                document.body.style.overflow = '';
              }, 350);
            };

            /* ── Tab Switch ── */
            window.switchAuthTab = function(tab) {
              document.getElementById('oTabLogin').className = tab === 'login' ? 'auth-tab auth-tab-active' : 'auth-tab';
              document.getElementById('oTabRegister').className = tab === 'register' ? 'auth-tab auth-tab-active' : 'auth-tab';
              document.getElementById('oFormLogin').style.display = tab === 'login' ? '' : 'none';
              document.getElementById('oFormRegister').style.display = tab === 'register' ? '' : 'none';
            };

            /* ── Password Toggle ── */
            window.oTogglePwd = function(id, btn) {
              var inp = document.getElementById(id);
              var icon = btn.querySelector('i');
              if (inp.type === 'password') { inp.type = 'text'; icon.className = 'fas fa-eye-slash'; }
              else { inp.type = 'password'; icon.className = 'fas fa-eye'; }
            };

            /* ── Role ── */
            var oSelectedRole = 'both';
            window.oSelectRole = function(role) {
              oSelectedRole = role;
              ['investor','borrower','both'].forEach(function(r) {
                var b = document.getElementById('oRole' + r.charAt(0).toUpperCase() + r.slice(1));
                if (b) b.className = r === role ? 'auth-role-btn auth-role-active' : 'auth-role-btn';
              });
            };

            /* ── Toast ── */
            function oToast(msg, type) {
              var t = document.getElementById('oAuthToast');
              t.textContent = msg; t.className = 'toast toast-' + (type||'info') + ' show';
              setTimeout(function() { t.classList.remove('show'); }, 3000);
            }
            function oShowErr(id, msg) {
              var el = document.getElementById(id);
              el.innerHTML = '<i class="fas fa-exclamation-circle" style="margin-right:6px"></i>' + msg;
              el.style.display = ''; el.className = 'form-error';
            }
            function oHideErr(id) { document.getElementById(id).style.display = 'none'; }

            /* ── Login ── */
            window.oHandleLogin = async function() {
              var username = document.getElementById('oLoginUsername').value.trim();
              var password = document.getElementById('oLoginPassword').value;
              var btn = document.getElementById('oLoginBtn');
              oHideErr('oLoginError');
              if (!username || !password) { oShowErr('oLoginError','请输入用户名和密码'); return; }
              btn.classList.add('btn-loading'); btn.disabled = true;
              try {
                var res = await fetch('/api/auth/login', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({username:username,password:password}) });
                var data = await res.json();
                if (data.success) {
                  localStorage.setItem('tc_token', data.token);
                  localStorage.setItem('tc_user', JSON.stringify(data.user));
                  oToast('登录成功！欢迎回来，' + (data.user.displayName || data.user.username), 'success');
                  // Update navbar user label if present
                  var navLabel = document.getElementById('navUserLabel');
                  var navIcon = document.querySelector('#navUserBtn i');
                  if (navLabel) navLabel.textContent = data.user.displayName || data.user.username;
                  if (navIcon) navIcon.className = 'fas fa-user-check';
                  setTimeout(function() { window._closeAuthOverlay(); }, 500);
                } else {
                  oShowErr('oLoginError', data.message || '登录失败');
                }
              } catch(e) {
                oShowErr('oLoginError','网络错误，请重试');
              } finally { btn.classList.remove('btn-loading'); btn.disabled = false; }
            };

            /* ── Register ── */
            window.oHandleRegister = async function() {
              var username = document.getElementById('oRegUsername').value.trim();
              var email = document.getElementById('oRegEmail').value.trim();
              var password = document.getElementById('oRegPassword').value;
              var displayName = document.getElementById('oRegDisplayName').value.trim();
              var phone = document.getElementById('oRegPhone').value.trim();
              var company = document.getElementById('oRegCompany').value.trim();
              var title = document.getElementById('oRegTitle').value.trim();
              var btn = document.getElementById('oRegisterBtn');
              oHideErr('oRegisterError');
              if (!username||!email||!password) { oShowErr('oRegisterError','请填写必填项（用户名、邮箱、密码）'); return; }
              if (password.length<6) { oShowErr('oRegisterError','密码至少6位'); return; }
              btn.classList.add('btn-loading'); btn.disabled = true;
              try {
                var res = await fetch('/api/auth/register', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({username:username,email:email,password:password,displayName:displayName,phone:phone,company:company,title:title,defaultRole:oSelectedRole}) });
                var data = await res.json();
                if (data.success) {
                  localStorage.setItem('tc_token', data.token);
                  localStorage.setItem('tc_user', JSON.stringify(data.user));
                  oToast('注册成功！欢迎加入条款通', 'success');
                  var navLabel = document.getElementById('navUserLabel');
                  var navIcon = document.querySelector('#navUserBtn i');
                  if (navLabel) navLabel.textContent = data.user.displayName || data.user.username;
                  if (navIcon) navIcon.className = 'fas fa-user-check';
                  setTimeout(function() { window._closeAuthOverlay(); }, 500);
                } else {
                  oShowErr('oRegisterError', data.message || '注册失败');
                }
              } catch(e) {
                oShowErr('oRegisterError','网络错误，请重试');
              } finally { btn.classList.remove('btn-loading'); btn.disabled = false; }
            };

            /* ── Guest ── */
            window.oGuestLogin = function() {
              localStorage.setItem('tc_user', JSON.stringify({id:'guest_'+Date.now(),username:'guest',displayName:'游客用户',email:'',defaultRole:'both',isGuest:true}));
              localStorage.setItem('tc_token','guest_token');
              oToast('游客模式，可自由体验所有功能','info');
              var navLabel = document.getElementById('navUserLabel');
              var navIcon = document.querySelector('#navUserBtn i');
              if (navLabel) navLabel.textContent = '游客用户';
              if (navIcon) navIcon.className = 'fas fa-user-check';
              setTimeout(function() { window._closeAuthOverlay(); }, 400);
            };

            /* ── SSO ── */
            window.oSSOLogin = function() { oToast('公司SSO登录功能即将上线','info'); };
          })();
        `}} />
      </body>
    </html>
  )
})
