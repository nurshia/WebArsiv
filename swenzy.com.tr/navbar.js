// Shared navbar: scroll shrink + entrance + page transitions
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    var nav = document.querySelector('.nav');
    var navInner = document.querySelector('.nav-inner');
    if (!nav || !navInner) return;

    // Giriş animasyonu
    nav.style.opacity = '0';
    nav.style.transform = 'translateY(-16px)';
    nav.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    setTimeout(function() {
      nav.style.opacity = '1';
      nav.style.transform = 'translateY(0)';
    }, 80);

    // Scroll shrink: HARDCODED inline style yerine CLASS kullan
    // CSS tarafında :root / [data-theme="light"] altında .nav-inner.scrolled tanımlı olacak
    window.addEventListener('scroll', function() {
      if (window.scrollY > 10) {
        navInner.classList.add('scrolled');
      } else {
        navInner.classList.remove('scrolled');
      }
    }, { passive: true });

    // Sayfa geçiş animasyonu
    document.querySelectorAll('a[href]').forEach(function(link) {
      var href = link.getAttribute('href');
      if (!href) return;
      if (href.startsWith('#') || href.startsWith('javascript')) return;
      if (link.href.includes('discord.gg') || link.href.includes('mailto') || link.href.includes('github.com')) return;

      link.addEventListener('click', function(e) {
        if (link.href === window.location.href) return;
        e.preventDefault();
        var dest = link.href;
        document.body.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        document.body.style.opacity = '0';
        document.body.style.transform = 'translateY(-16px)';
        setTimeout(function() { window.location.href = dest; }, 300);
      });
    });
  });
})();
