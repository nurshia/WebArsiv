// ── Demo ortamı tespiti ───────────────────────────────
// github.io / localhost / file:// / iframe üzerinde koruma katmanları kapalı.
// Gerçek domainde (swenzy.com.tr) hepsi eskisi gibi çalışır.
var _$demo = (function () {
  try {
    var h = (window.location.hostname || '').toLowerCase();
    return /(^|\.)github\.io$/.test(h) || h === 'localhost' || h === '127.0.0.1' ||
           h === '' || window.location.protocol === 'file:' || window.self !== window.top;
  } catch (e) { return true; }
})();

// ── Domain Koruma ─────────────────────────────────────
(function(){
  if (_$demo) return;
  var allowed = ['swenzy.com.tr', 'www.swenzy.com.tr', 'localhost', '127.0.0.1'];
  var host = window.location.hostname.toLowerCase();
  if (allowed.indexOf(host) === -1) {
    document.body.innerHTML = '';
    window.location.replace('https://swenzy.com.tr');
  }
})();

// ── Turnstile Koruma ──────────────────────────────────
(function () {
  if (_$demo) return;
  var SITE_KEY = '0x4AAAAAAEl1oHatXTlpWIuZ';
  var SESSION_KEY = 'swenzy_verified';

  if (sessionStorage.getItem(SESSION_KEY) === '1') return;

  // Overlay CSS — sayfanın kendi CSS'i yüklenmeden önce çalışsın
  var style = document.createElement('style');
  style.textContent = '#_sw_overlay{position:fixed;inset:0;z-index:2147483647;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;font-family:Inter,-apple-system,sans-serif;transition:opacity .4s ease}#_sw_overlay img{border-radius:12px;opacity:.9}#_sw_overlay .sw-title{color:#fff;font-size:16px;font-weight:700;margin:0 0 4px;text-align:center}#_sw_overlay .sw-sub{color:#555;font-size:13px;margin:0;text-align:center}';
  document.head.appendChild(style);

  // Body hazır değilse bekle
  function init() {
    var overlay = document.createElement('div');
    overlay.id = '_sw_overlay';
    overlay.innerHTML =
      '<img src="swenzy_logo.png" width="52" height="52" alt="">' +
      '<div><p class="sw-title">SwenzyBots</p><p class="sw-sub">Devam etmek için doğrulama yapın</p></div>' +
      '<div id="_sw_widget"></div>';

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    // Turnstile script
    var s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    s.onload = function () {
      turnstile.render('#_sw_widget', {
        sitekey: SITE_KEY,
        theme: 'dark',
        callback: function () {
          sessionStorage.setItem(SESSION_KEY, '1');
          overlay.style.opacity = '0';
          document.body.style.overflow = '';
          setTimeout(function () { overlay.remove(); }, 420);
        }
      });
    };
    document.head.appendChild(s);
  }

  if (document.body) {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();

// ── Koruma ────────────────────────────────────────────
if (!_$demo) {
document.addEventListener('contextmenu', function (e) { e.preventDefault(); });
document.addEventListener('keydown', function (e) {
  if (e.key === 'F12') { e.preventDefault(); return false; }
  if (e.ctrlKey && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)) { e.preventDefault(); return false; }
  if (e.ctrlKey && ['U', 'u', 'S', 's'].includes(e.key)) { e.preventDefault(); return false; }
});
document.addEventListener('selectstart', function (e) { e.preventDefault(); });
document.addEventListener('dragstart', function (e) { e.preventDefault(); });
}

(function () {
  if (_$demo) return;
  setInterval(function () {
    if (window.outerWidth - window.innerWidth > 160 || window.outerHeight - window.innerHeight > 160) {
      document.body.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;background:#000;color:#fff;font-family:Inter,sans-serif;gap:16px;text-align:center;padding:24px;"><div style="width:64px;height:64px;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:28px;margin-bottom:8px;">🔒</div><h1 style="font-size:22px;font-weight:700;margin:0;">Erişim Engellendi</h1><p style="color:#555;font-size:14px;max-width:320px;margin:0;line-height:1.6;">Bu sayfanın içeriği korumalıdır.</p><a href="./" style="margin-top:8px;background:#fff;color:#000;text-decoration:none;padding:10px 24px;border-radius:50px;font-size:13px;font-weight:600;">Ana Sayfaya Dön</a></div>';
    }
  }, 1000);
})();
