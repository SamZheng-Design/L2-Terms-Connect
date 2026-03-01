import type { FC } from 'hono/jsx'
import { TEXT, t, type Lang } from '../data/i18n'

interface NavbarProps {
  lang: Lang
  current: string
}

export const Navbar: FC<NavbarProps> = ({ lang }) => {
  const otherLang = lang === 'zh' ? 'en' : 'zh'
  const langLabel = lang === 'zh' ? '中/EN' : 'EN/中'

  return (
    <nav class="navbar" id="navbar">
      <div class="navbar-inner">
        {/* Left: Brand */}
        <a href={`/?lang=${lang}`} class="navbar-brand">
          <div class="navbar-brand-logo">
            MICRO CONNECT <span style="font-size:12px;opacity:0.6;margin-left:4px">滴灌通</span>
          </div>
          <div class="navbar-brand-divider"></div>
          <div class="navbar-product">
            <div class="navbar-product-icon">
              <i class="fas fa-sliders-h"></i>
            </div>
            <span class="navbar-product-name">{t(TEXT.nav.product, lang)}</span>
          </div>
        </a>

        {/* Right: Actions */}
        <div class="navbar-actions">
          <button class="lang-toggle" id="langToggle" onclick={`switchLang('${otherLang}')`}>
            {langLabel}
          </button>
          <button class="navbar-btn" id="navUserBtn" onclick={`handleUserAction('${lang}')`}>
            <i class="fas fa-user-circle" style="font-size:14px"></i>
            <span id="navUserLabel">{lang === 'zh' ? '登录' : 'Login'}</span>
          </button>
          <button class="navbar-btn" onclick="window.open('https://microconnect.com','_blank')">
            <i class="fas fa-external-link-alt" style="font-size:11px"></i>
            <span>{t(TEXT.nav.backToMain, lang)}</span>
          </button>
        </div>
      </div>

      {/* Navbar scroll effect + Language switch script + User state */}
      <script dangerouslySetInnerHTML={{__html: `
        (function() {
          // Scroll effect
          var navbar = document.getElementById('navbar');
          window.addEventListener('scroll', function() {
            navbar.classList.toggle('scrolled', window.scrollY > 10);
          });

          // Check user state and update nav
          var user = null;
          try { user = JSON.parse(localStorage.getItem('tc_user')); } catch(e) {}
          if (user && user.displayName) {
            var label = document.getElementById('navUserLabel');
            var icon = document.querySelector('#navUserBtn i');
            if (label) label.textContent = user.displayName;
            if (icon) icon.className = 'fas fa-user-check';
          }
        })();

        // Language switch: preserve current path, only change lang param
        function switchLang(newLang) {
          var url = new URL(window.location.href);
          url.searchParams.set('lang', newLang);
          window.location.href = url.toString();
        }

        // User action: go to login or show user menu
        function handleUserAction(lang) {
          var user = null;
          try { user = JSON.parse(localStorage.getItem('tc_user')); } catch(e) {}
          if (user && user.id) {
            // Already logged in - ask to logout
            if (confirm(lang === 'zh' ? '确认登出？' : 'Confirm logout?')) {
              localStorage.removeItem('tc_user');
              localStorage.removeItem('tc_token');
              window.location.href = '/login?lang=' + lang;
            }
          } else {
            window.location.href = '/login?lang=' + lang;
          }
        }
      `}} />
    </nav>
  )
}
