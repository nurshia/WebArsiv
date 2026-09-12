/* © SwenzyBots 2026 — swenzy.com.tr — Unauthorized copying prohibited */
var _$sw=function(){var _0x='SwenzyBots',_1x='swenzy.com.tr',_2x='2026';return{o:_0x,d:_1x,y:_2x};}();
(function(){var _w='\u00A9 SwenzyBots \u2014 swenzy.com.tr';if(window._swenzy&&window._swenzy!==_w){document.body.innerHTML='';return;}window._swenzy=_w;})();
// ── Scroll Restoration ──
if('scrollRestoration'in history){history.scrollRestoration='manual';}
window.addEventListener('beforeunload',function(){window.scrollTo(0,0);});
const lenis=new Lenis({lerp:0.2,smoothWheel:true,wheelMultiplier:1,touchMultiplier:1.5,syncTouch:false,});
function lenisRaf(time){lenis.raf(time);requestAnimationFrame(lenisRaf);}
requestAnimationFrame(lenisRaf);
const navWrapper=document.getElementById('navbar-wrapper');
window.addEventListener('scroll',function(){if(window.scrollY>1){navWrapper.classList.add('scrolled');}else{navWrapper.classList.remove('scrolled');}},{passive:true});
const hamburgerBtn=document.getElementById('hamburgerBtn');
const mobileMenu=document.getElementById('mobileMenu');
const mobileMenuClose=document.getElementById('mobileMenuClose');
function openMobileMenu(){if(!mobileMenu)return;lenis.stop();mobileMenu.classList.add('open');document.body.style.overflow='hidden';}
function closeMobileMenu(){if(!mobileMenu)return;mobileMenu.classList.remove('open');document.body.style.overflow='';lenis.start();}
hamburgerBtn.addEventListener('click',openMobileMenu);
mobileMenuClose.addEventListener('click',closeMobileMenu);
mobileMenu.addEventListener('click',function(e){if(e.target===mobileMenu)closeMobileMenu();});
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeMobileMenu();});
const revealObserver=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target);}});},{threshold:0.05,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.reveal').forEach(function(el){revealObserver.observe(el);});
const ftObserver=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add('ft-visible');ftObserver.unobserve(entry.target);}});},{threshold:0,rootMargin:'0px 0px -10px 0px'});
document.querySelectorAll('.ft-reveal').forEach(function(el){ftObserver.observe(el);});
const faqItems=document.querySelectorAll('.faq-item');
faqItems.forEach(function(item){
  const btn=item.querySelector('.faq-q');
  const ans=item.querySelector('.faq-a');
  btn.addEventListener('click',function(){
    const isOpen=btn.classList.contains('open');
    faqItems.forEach(function(i){i.querySelector('.faq-q').classList.remove('open');i.querySelector('.faq-a').classList.remove('open');});
    if(!isOpen){btn.classList.add('open');ans.classList.add('open');setTimeout(function(){var rect=item.getBoundingClientRect();lenis.scrollTo(window.scrollY+rect.top-120,{duration:0.8});},50);}
  });
});
let faqAutoPlayed=false;
const faqSection=document.getElementById('sss');
const faqAutoObserver=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting&&!faqAutoPlayed){faqAutoPlayed=true;startFaqEntrance();}});},{threshold:0.25});
if(faqSection)faqAutoObserver.observe(faqSection);
function typeText(el,text,speed,onDone){let i=0;el.textContent='';const timer=setInterval(function(){el.textContent+=text[i];i++;if(i>=text.length){clearInterval(timer);if(onDone)onDone();}},speed);}
function startFaqEntrance(){
  const titleEl=document.getElementById('faq-title');
  const subEl=document.getElementById('faq-sub');
  const contactEl=document.getElementById('faq-contact');
  var lang=localStorage.getItem('swenzy_lang')||'tr';
  titleEl.textContent=faqTranslations.title[lang];
  setTimeout(function(){titleEl.classList.add('visible');},50);
  setTimeout(function(){subEl.style.transition='opacity 0.4s ease';subEl.style.opacity='1';typeText(subEl,faqTranslations.sub[lang],20,function(){applyFaqContactLang(lang);contactEl.style.transition='opacity 0.4s ease';contactEl.style.opacity='1';});},500);
}
document.querySelectorAll('.bento-card, .service-card, .step-card, .pricing-card').forEach(function(card){
  card.addEventListener('mousemove',function(e){const rect=card.getBoundingClientRect();card.style.setProperty('--spot-x',(e.clientX-rect.left)+'px');card.style.setProperty('--spot-y',(e.clientY-rect.top)+'px');card.style.setProperty('--spot-opacity','1');});
  card.addEventListener('mouseleave',function(){card.style.setProperty('--spot-opacity','0');});
});
document.addEventListener('DOMContentLoaded',function(){
  var savedLang=localStorage.getItem('swenzy_lang');
  if(savedLang&&savedLang!=='tr'){setTimeout(function(){setLang(savedLang);},1200);}
  const heroContent=document.querySelector('.hero-content');
  const heroSub=document.querySelector('.hero-sub');
  const ctaBtn=document.querySelector('.cta-btn');
  setTimeout(function(){if(navWrapper)navWrapper.classList.add('nav-visible');},100);
  /* hero yoksa (alt sayfalar) giriş animasyonunu atla */
  if(!heroContent)return;
  heroContent.style.opacity='0';heroContent.style.transform='translateY(24px)';heroContent.style.transition='opacity 0.9s ease, transform 0.9s ease';
  if(heroSub)heroSub.style.opacity='0';
  if(ctaBtn)ctaBtn.style.opacity='0';
  setTimeout(function(){heroContent.style.opacity='1';heroContent.style.transform='translateY(0)';setTimeout(function(){if(heroSub){heroSub.style.transition='opacity 0.6s ease';heroSub.style.opacity='1';}if(ctaBtn){ctaBtn.style.transition='opacity 0.6s ease 0.15s';ctaBtn.style.opacity='1';}},500);},350);
});
function toggleNavLang(){var menu=document.getElementById('navLangMenu');if(menu)menu.classList.toggle('open');}
document.addEventListener('click',function(e){if(!e.target.closest('#navLangDropdown')){var m=document.getElementById('navLangMenu');if(m)m.classList.remove('open');}});
function toggleDropdown(id){const menu=document.getElementById(id.replace('Dropdown','Menu'));menu.classList.toggle('open');const other=id==='themeDropdown'?'langMenu':'themeMenu';document.getElementById(other).classList.remove('open');}
document.addEventListener('click',function(e){if(!e.target.closest('.footer-dropdown')){document.querySelectorAll('.footer-dropdown-menu').forEach(function(m){m.classList.remove('open');});}});
function resolveTheme(pref){if(pref==='light'||pref==='dark')return pref;return window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}
function applyThemeAttr(pref){var actual=resolveTheme(pref);document.documentElement.setAttribute('data-theme',actual);}
function refreshThemeLabels(lang){const labels={system:{tr:'Sistem',en:'System'},dark:{tr:'Karanlık',en:'Dark'},light:{tr:'Aydınlık',en:'Light'}};var tl=document.getElementById('themeLabel');var pref=localStorage.getItem('swenzy_theme')||'system';if(tl)tl.textContent=(labels[pref]&&labels[pref][lang])||labels[pref].tr;var order=['system','dark','light'];document.querySelectorAll('#themeMenu button').forEach(function(btn,idx){var span=btn.querySelector('.t-menu-text');var key=order[idx]||'system';if(span)span.textContent=(labels[key]&&labels[key][lang])||labels[key].tr;});}
function setTheme(theme){document.getElementById('themeMenu').classList.remove('open');localStorage.setItem('swenzy_theme',theme);applyThemeAttr(theme);refreshThemeLabels(localStorage.getItem('swenzy_lang')||'tr');lenis.scrollTo(0,{duration:1.2,easing:function(t){return 1-Math.pow(1-t,4);}});}
(function initTheme(){var pref=localStorage.getItem('swenzy_theme')||'system';applyThemeAttr(pref);document.addEventListener('DOMContentLoaded',function(){refreshThemeLabels(localStorage.getItem('swenzy_lang')||'tr');});if(window.matchMedia){window.matchMedia('(prefers-color-scheme: light)').addEventListener('change',function(){var cur=localStorage.getItem('swenzy_theme')||'system';if(cur==='system')applyThemeAttr('system');});}})();
var faqTranslations={title:{tr:'Sıkça Sorulan Sorular',en:'Frequently Asked Questions'},sub:{tr:'SwenzyBots hakkında merak edilenler',en:'Everything you need to know about SwenzyBots'},contact:{tr:'Aradığınız yanıtı bulamazsanız',en:"Can't find what you're looking for?"},contactLink:{tr:"Discord'dan ulaşın",en:'Reach out on Discord'}};
function applyFaqContactLang(lang){var contactEl=document.getElementById('faq-contact');if(!contactEl)return;contactEl.innerHTML=faqTranslations.contact[lang]+' <a href="https://discord.gg/development" target="_blank">'+faqTranslations.contactLink[lang]+'</a>.';}
function setLang(lang){
  document.getElementById('langMenu').classList.remove('open');
  lenis.scrollTo(0,{duration:1.2,easing:function(t){return 1-Math.pow(1-t,4);}});
  const labels={tr:'Türkçe',en:'English'};const short={tr:'TR',en:'EN'};
  var ll=document.getElementById('langLabel');if(ll)ll.textContent=labels[lang];
  var lt=document.getElementById('langText');if(lt)lt.textContent=short[lang];
  var line1=document.querySelector('.line-1');var line2=document.querySelector('.line-2');
  if(line1){var t1=line1.getAttribute('data-'+lang);if(t1)line1.textContent=t1;}
  if(line2){var t2=line2.getAttribute('data-'+lang);if(t2)line2.textContent=t2;}
  document.querySelectorAll('[data-tr]').forEach(function(el){
    const text=el.getAttribute('data-'+lang);
    if(text){
      if(el.tagName==='INPUT'||el.tagName==='TEXTAREA'){el.placeholder=text;}
      else if(el.classList.contains('faq-q')){el.childNodes.forEach(function(node){if(node.nodeType===3&&node.textContent.trim()){node.textContent=text+' ';}});}
      else if(el.tagName==='A'||el.tagName==='BUTTON'){var hasText=false;el.childNodes.forEach(function(node){if(node.nodeType===3&&node.textContent.trim()){node.textContent=text+' ';hasText=true;}});if(!hasText&&!el.querySelector('svg')&&!el.querySelector('img')){el.textContent=text;}}
      else{var hasInnerHtml=el.querySelector('a, span, strong, b');if(hasInnerHtml&&text.includes('<')){el.innerHTML=text;}else if(!hasInnerHtml){el.textContent=text;}else if(hasInnerHtml&&!text.includes('<')){el.textContent=text;}}
    }
  });
  document.querySelectorAll('.faq-a').forEach(function(el){var innerText=el.getAttribute('data-'+lang+'-inner')||el.getAttribute('data-tr-inner');if(innerText){var innerEl=el.querySelector('.faq-a-inner p');if(innerEl)innerEl.textContent=innerText;}});
  var creditEl=document.querySelector('.footer-credit');
  if(creditEl){var creditTr='<span>SwenzyBots</span> \u{1F499} ile <span>Nuran</span> tarafından geliştirilmiştir.';var creditEn='Built with \u{1F499} for <span>SwenzyBots</span> by <span>Nuran</span>.';creditEl.innerHTML=lang==='tr'?creditTr:creditEn;}
  document.querySelectorAll('[data-en]').forEach(function(el){var enVal=el.getAttribute('data-en');var trVal=el.getAttribute('data-tr');var val=lang==='en'?enVal:trVal;if(val&&val.includes('<')&&(el.querySelector('span')||el.querySelector('strong'))){el.innerHTML=val;}});
  var ft=document.getElementById('faq-title');var fs=document.getElementById('faq-sub');
  if(ft)ft.textContent=faqTranslations.title[lang];
  if(fs)fs.textContent=faqTranslations.sub[lang];
  applyFaqContactLang(lang);
  var dBtn=document.querySelector('.discord-btn');if(dBtn){dBtn.childNodes.forEach(function(node){if(node.nodeType===3&&node.textContent.trim()){node.textContent=lang==='tr'?' Sunucumuz':' Our Server';}});}
  document.querySelectorAll('.mobile-menu a').forEach(function(a){var dt=a.getAttribute('data-tr');if(dt){var txt=a.getAttribute('data-'+lang)||dt;a.childNodes.forEach(function(node){if(node.nodeType===3&&node.textContent.trim()){node.textContent=txt;}});}});
  var tl2=document.querySelector('.trusted-label');if(tl2){tl2.textContent=lang==='tr'?'BİZE GÜVENEN TOPLULUKLAR':'COMMUNITIES THAT TRUST US';}
  refreshThemeLabels(lang);
  document.documentElement.lang=lang;
  localStorage.setItem('swenzy_lang',lang);
}
/* --- demo ortamı: github.io / localhost / file:// üzerinde koruma kapalı --- */
var _$demo=(function(){try{var h=location.hostname||'';return /(^|\.)github\.io$/i.test(h)||h==='localhost'||h==='127.0.0.1'||h===''||location.protocol==='file:'||window.self!==window.top;}catch(e){return true;}})();
if(!_$demo){document.addEventListener('contextmenu',function(e){e.preventDefault();});
document.addEventListener('keydown',function(e){if(e.key==='F12'){e.preventDefault();return false;}if(e.ctrlKey&&e.shiftKey&&['I','i','J','j','C','c'].includes(e.key)){e.preventDefault();return false;}if(e.ctrlKey&&['U','u','S','s'].includes(e.key)){e.preventDefault();return false;}});
document.addEventListener('selectstart',function(e){e.preventDefault();});
document.addEventListener('dragstart',function(e){e.preventDefault();});
}
var _$p='<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;background:#000;color:#fff;font-family:Inter,sans-serif;gap:16px;text-align:center;padding:24px;"><div style="width:64px;height:64px;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:28px;margin-bottom:8px;">\uD83D\uDD12</div><h1 style="font-size:22px;font-weight:700;margin:0;">Erişim Engellendi</h1><p style="color:#555;font-size:14px;max-width:320px;margin:0;line-height:1.6;">Bu sayfanın içeriği korumalıdır.</p><a href="./" style="margin-top:8px;background:#fff;color:#000;text-decoration:none;padding:10px 24px;border-radius:50px;font-size:13px;font-weight:600;">Ana Sayfaya Dön</a></div>';
(function(){if(_$demo)return;setInterval(function(){if(window.outerWidth-window.innerWidth>160||window.outerHeight-window.innerHeight>160){document.body.innerHTML=_$p;}},1000);})();
(function(){if(_$demo)return;var warnEl=null;function checkZoom(){var zoom=Math.round((window.outerWidth/window.innerWidth)*100);if(zoom<75){if(!warnEl){var lang=localStorage.getItem('swenzy_lang')||'tr';warnEl=document.createElement('div');warnEl.style.cssText='position:fixed;top:0;left:0;right:0;z-index:99999;background:rgba(239,68,68,.95);backdrop-filter:blur(8px);color:#fff;font-family:Inter,sans-serif;font-size:13px;font-weight:500;padding:10px 20px;text-align:center;';warnEl.textContent=lang==='tr'?'🔍 Bu site %75 ve üzeri zoom seviyesi ile görüntülenmelidir.':'🔍 This site must be viewed at 75% zoom level or higher.';document.body.prepend(warnEl);}}else{if(warnEl){warnEl.remove();warnEl=null;}}}window.addEventListener('resize',checkZoom);checkZoom();})();
document.querySelectorAll('a[href^="#"]').forEach(function(link){link.addEventListener('click',function(e){var id=link.getAttribute('href');if(id==='#')return;var target=document.querySelector(id);if(!target)return;e.preventDefault();lenis.scrollTo(target,{duration:1.2,easing:function(t){return 1-Math.pow(1-t,4);}});});});
document.querySelectorAll('a[href$=".html"]:not([target="_blank"])').forEach(function(link){link.addEventListener('click',function(e){if(link.href===window.location.href)return;e.preventDefault();var href=this.href;document.body.style.transition='opacity 0.35s ease, transform 0.35s ease';document.body.style.opacity='0';document.body.style.transform='translateY(-16px)';setTimeout(function(){window.location.href=href;},350);});});
