import type { FC } from 'hono/jsx'
import { TEXT, t, type Lang } from '../data/i18n'

interface FooterProps {
  lang: Lang
}

export const Footer: FC<FooterProps> = ({ lang }) => {
  return (
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-top">
          {/* Brand */}
          <div class="footer-brand">
            <div class="footer-logo">
              <span>MICRO</span> CONNECT
            </div>
            <p class="footer-tagline">{t(TEXT.footer.tagline, lang)}</p>
          </div>

          {/* Links */}
          <div class="footer-links">
            <div class="footer-links-group">
              <h4>{t(TEXT.footer.products, lang)}</h4>
              <a href="#">{lang === 'zh' ? '身份通 Identity Connect' : 'Identity Connect'}</a>
              <a href="#">{lang === 'zh' ? '发起通 Launch Connect' : 'Launch Connect'}</a>
              <a href="#">{lang === 'zh' ? '评估通 Assess Connect' : 'Assess Connect'}</a>
              <a href="#">{lang === 'zh' ? '风控通 Risk Connect' : 'Risk Connect'}</a>
              <a href="#">{lang === 'zh' ? '参与通 Engage Connect' : 'Engage Connect'}</a>
              <a href={`/?lang=${lang}`} style="color:rgba(255,255,255,0.8)">
                <i class="fas fa-sliders-h" style="font-size:11px;margin-right:4px"></i>
                {lang === 'zh' ? '条款通 Terms Connect' : 'Terms Connect'}
              </a>
            </div>
            <div class="footer-links-group">
              <h4>{t(TEXT.footer.resources, lang)}</h4>
              <a href="#">{lang === 'zh' ? 'API 文档' : 'API Docs'}</a>
              <a href="#">{lang === 'zh' ? '开发者指南' : 'Developer Guide'}</a>
              <a href="#">{lang === 'zh' ? 'RBF 教程' : 'RBF Tutorial'}</a>
            </div>
            <div class="footer-links-group">
              <h4>{t(TEXT.footer.company, lang)}</h4>
              <a href="#">{lang === 'zh' ? '关于我们' : 'About Us'}</a>
              <a href="#">{lang === 'zh' ? '联系我们' : 'Contact'}</a>
              <a href="#">{lang === 'zh' ? '隐私政策' : 'Privacy Policy'}</a>
            </div>
          </div>
        </div>

        <div class="footer-divider"></div>

        <div class="footer-bottom">
          <div>
            <span class="footer-aurora-dot"></span>
            {t(TEXT.footer.copyright, lang)}
          </div>
          <div style="display:flex;align-items:center;gap:6px">
            <span style="font-size:11px">Powered by</span>
            <span style="color:rgba(125,212,199,0.8);font-family:var(--font-brand);font-weight:700;font-size:12px">Hono + Cloudflare Pages</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
