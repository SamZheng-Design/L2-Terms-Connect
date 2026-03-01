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

        {/* ═══ Loading Screen Dismiss Script ═══ */}
        <script dangerouslySetInnerHTML={{__html: `
          (function() {
            var loading = document.getElementById('app-loading');
            if (loading) {
              // Wait for page to be fully loaded then fade out
              window.addEventListener('load', function() {
                setTimeout(function() {
                  loading.classList.add('fade-out');
                  setTimeout(function() {
                    loading.style.display = 'none';
                  }, 600);
                }, 1200);
              });
              // Fallback: force hide after 3 seconds
              setTimeout(function() {
                if (loading && !loading.classList.contains('fade-out')) {
                  loading.classList.add('fade-out');
                  setTimeout(function() {
                    loading.style.display = 'none';
                  }, 600);
                }
              }, 3000);
            }
          })();
        `}} />
      </body>
    </html>
  )
})
