/* ── MOBILE MENU ── */
  var hamburger = document.getElementById('hamburger');
  var mobMenu   = document.getElementById('mobMenu');
  var mobClose  = document.getElementById('mobClose');
  function openMenu(){ if(hamburger)hamburger.classList.add('open'); if(mobMenu){mobMenu.classList.add('open');mobMenu.setAttribute('aria-hidden','false');} document.body.style.overflow='hidden'; }
  function closeMenu(){ if(hamburger)hamburger.classList.remove('open'); if(mobMenu){mobMenu.classList.remove('open');mobMenu.setAttribute('aria-hidden','true');} document.body.style.overflow=''; }
  if(hamburger) hamburger.addEventListener('click',function(){ mobMenu&&mobMenu.classList.contains('open')?closeMenu():openMenu(); });
  if(mobClose)  mobClose.addEventListener('click',closeMenu);
  if(mobMenu)   mobMenu.querySelectorAll('.mob-menu__link').forEach(function(a){ a.addEventListener('click',closeMenu); });

  /* ── SMOOTH ANCHOR SCROLL ── */
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click',function(e){
      var t=document.querySelector(a.getAttribute('href'));
      if(t){ e.preventDefault(); closeMenu(); setTimeout(function(){ t.scrollIntoView({behavior:'smooth',block:'start'}); },50); }
    });
  });

  /* ── SCROLL PROGRESS ── */
  var pb = document.getElementById('scrollProgress');
  window.addEventListener('scroll',function(){
    if(!pb) return;
    pb.style.width=(window.scrollY/(document.documentElement.scrollHeight-window.innerHeight)*100)+'%';
  },{passive:true});

  /* ── NAVBAR SCROLL ── */
  var navWrap  = document.getElementById('navWrap');
  var isMobile = window.innerWidth < 768;
  var lastSc   = 0;
  window.addEventListener('scroll',function(){
    var cur = window.scrollY;
    if(navWrap){
      navWrap.style.paddingTop = cur>80 ? '12px' : (isMobile?'14px':'22px');
      if(isMobile){
        if(cur>lastSc&&cur>150){ navWrap.style.transform='translateY(-110%)'; navWrap.style.opacity='0'; }
        else{ navWrap.style.transform='translateY(0)'; navWrap.style.opacity='1'; }
      }
    }
    lastSc = Math.max(0,cur);
  },{passive:true});

  /* ── GALLERY ── */
  (function(){
    var heroEl  = document.getElementById('galleryHero');
    var heroImg = document.getElementById('heroImg');
    if(!heroEl||!heroImg) return;
    // Full gallery — 9 photos, NO team/about photo
    var imgs = [
      {src:'assets/img/gallery-mermer-ada.jpg',      label:'Beyaz Mermer Ada'},
      {src:'assets/img/gallery-calacatta.jpg',        label:'Calacatta Mermer'},
      {src:'assets/img/gallery-ada-bar.jpg',          label:'Ada & Bar'},
      {src:'assets/img/gallery-acik-mutfak.jpg',      label:'Modern Açık Mutfak'},
      {src:'assets/img/gallery-tezgah.jpg',           label:'Tezgah Detayı'},
      {src:'assets/img/gallery-banyo-lavabo.jpg',     label:'Banyo Lavabo'},
      {src:'assets/img/gallery-mermer-lavabo.jpg',    label:'Mermer Lavabo'},
      {src:'assets/img/gallery-grand-mutfak.jpg',     label:'Grand Mutfak'},
      {src:'assets/img/gallery-ekip-calismasi.jpg',   label:'Ekip Çalışması'},
    ];
    var TOTAL=imgs.length, cur=0;
    heroEl.style.transition='opacity .35s ease';
    var pEl=document.getElementById('galProgress'), cEl=document.getElementById('galCurr'), tEl=document.getElementById('galTotal'), dEl=document.getElementById('galDots'), lbEl=document.getElementById('galleryLightbox'), lbImg=document.getElementById('lbImg'), hlEl=document.getElementById('heroLabel');
    if(tEl) tEl.textContent=String(TOTAL).padStart(2,'0');
    heroImg.src = imgs[0].src;
    if(document.getElementById('heroLabel')) document.getElementById('heroLabel').textContent = imgs[0].label;
    if(dEl) for(var i=0;i<TOTAL;i++){ (function(idx){ var d=document.createElement('button'); d.className='gallery__dot'+(idx===0?' active':''); d.addEventListener('click',function(){goTo(idx);}); dEl.appendChild(d); })(i); }
    function goTo(idx){
      cur=((idx%TOTAL)+TOTAL)%TOTAL;
      if(pEl) pEl.style.width=((cur+1)/TOTAL*100)+'%';
      if(cEl) cEl.textContent=String(cur+1).padStart(2,'0');
      if(dEl) dEl.querySelectorAll('.gallery__dot').forEach(function(d,i){ d.classList.toggle('active',i===cur); });
      heroEl.style.opacity='0';
      setTimeout(function(){
        heroImg.src=imgs[cur].src;
        if(hlEl) hlEl.textContent=imgs[cur].label;
        heroEl.style.opacity='1';
        document.querySelectorAll('.gallery__stack-item').forEach(function(item,i){
          var idx2=(cur+1+i)%TOTAL, im=item.querySelector('img'), sp=item.querySelector('span');
          if(im) im.src=imgs[idx2].src;
          if(sp) sp.textContent=imgs[idx2].label;
          item.dataset.index=idx2;
        });
      },300);
    }
    var prevB=document.getElementById('galPrev'), nextB=document.getElementById('galNext');
    if(prevB) prevB.addEventListener('click',function(){goTo(cur-1);});
    if(nextB) nextB.addEventListener('click',function(){goTo(cur+1);});
    document.querySelectorAll('.gallery__stack-item').forEach(function(item){ item.addEventListener('click',function(){ goTo(parseInt(item.dataset.index)||0); }); });
    var tx=0;
    heroEl.addEventListener('touchstart',function(e){tx=e.touches[0].clientX;},{passive:true});
    heroEl.addEventListener('touchend',function(e){ var dx=tx-e.changedTouches[0].clientX; if(Math.abs(dx)>50) dx>0?goTo(cur+1):goTo(cur-1); });
    heroEl.addEventListener('click',function(){ if(lbImg){lbImg.src=imgs[cur].src;lbImg.style.display='block';} if(lbEl)lbEl.classList.add('open'); document.body.style.overflow='hidden'; });
    var lbClose=document.getElementById('galLbClose');
    function closeLb(){ if(lbEl)lbEl.classList.remove('open'); document.body.style.overflow=''; }
    if(lbClose) lbClose.addEventListener('click',closeLb);
    if(lbEl) lbEl.addEventListener('click',function(e){ if(e.target===lbEl)closeLb(); });
  })();

  /* ── REVIEWS SLIDER ── */
  (function(){
    var vp=document.getElementById('reviewsViewport'), tr=document.getElementById('reviewsTrack'), dw=document.getElementById('revDots'), ce=document.getElementById('revCount');
    if(!vp||!tr) return;
    var cards=tr.querySelectorAll('.reviews__card'), total=cards.length, cur=0, sx=0, drag=false, dx=0;
    for(var i=0;i<total;i++){ (function(idx){ var d=document.createElement('button'); d.className='reviews__dot'+(idx===0?' active':''); d.addEventListener('click',function(){goTo(idx);}); if(dw)dw.appendChild(d); })(i); }
    function goTo(idx){
      var max=Math.max(0,total-Math.max(1,Math.round(vp.offsetWidth/(cards[0].offsetWidth+24))));
      cur=Math.max(0,Math.min(((idx%total)+total)%total,max));
      tr.style.transform='translateX(-'+(cur*(cards[0].offsetWidth+24))+'px)';
      if(dw) dw.querySelectorAll('.reviews__dot').forEach(function(d,i){d.classList.toggle('active',i===cur);});
      if(ce) ce.textContent=String(cur+1).padStart(2,'0')+' / '+String(total).padStart(2,'0');
    }
    var pb2=document.getElementById('revPrev'), nb2=document.getElementById('revNext');
    if(pb2) pb2.addEventListener('click',function(){goTo(cur-1);});
    if(nb2) nb2.addEventListener('click',function(){goTo(cur+1);});
    vp.addEventListener('mousedown',function(e){sx=e.clientX;drag=true;vp.classList.add('grabbing');});
    window.addEventListener('mousemove',function(e){if(drag)dx=e.clientX-sx;});
    window.addEventListener('mouseup',function(){if(!drag)return;drag=false;vp.classList.remove('grabbing');if(dx<-60)goTo(cur+1);else if(dx>60)goTo(cur-1);dx=0;});
    vp.addEventListener('touchstart',function(e){sx=e.touches[0].clientX;},{passive:true});
    vp.addEventListener('touchend',function(e){var d2=e.changedTouches[0].clientX-sx;if(d2<-50)goTo(cur+1);else if(d2>50)goTo(cur-1);});
    var timer=setInterval(function(){goTo(cur+1>=total?0:cur+1);},5500);
    vp.addEventListener('mouseenter',function(){clearInterval(timer);});
    vp.addEventListener('mouseleave',function(){timer=setInterval(function(){goTo(cur+1>=total?0:cur+1);},5500);});
    window.addEventListener('resize',function(){goTo(cur);});
    goTo(0);
  })();

  /* ── SCROLL OBSERVER — rich staggered reveals ── */
  var REVEAL_SELECTORS = [
    '.about__eyebrow','.about__headline','.about__desc','.about__feat',
    '.svc__eyebrow','.svc__headline','.svc__desc-block',
    '.gallery__eyebrow','.gallery__headline','.gallery__desc-block','.gallery__controls',
    '.brands__header',
    '.reviews__header','.reviews__stage',
    '.ct__eyebrow','.ct__headline','.ct__desc','.ct__wa','.ct__right',
    '.areas__eyebrow','.areas__headline','.areas__header-right',
  ].join(',');

  var obs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  },{threshold:0.06, rootMargin:'0px 0px -20px 0px'});

  document.querySelectorAll(REVEAL_SELECTORS).forEach(function(el){ obs.observe(el); });

  /* Stagger svc-cards */
  var svcObs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        var cards = e.target.querySelectorAll('.svc-card');
        cards.forEach(function(c,i){
          setTimeout(function(){ c.style.opacity='1'; c.style.transform='translateY(0) scale(1)'; },i*90);
        });
        svcObs.unobserve(e.target);
      }
    });
  },{threshold:0.08});
  var svcGrid = document.querySelector('.svc__grid');
  if(svcGrid){
    svcGrid.querySelectorAll('.svc-card').forEach(function(c){
      c.style.opacity='0'; c.style.transform='translateY(36px) scale(0.97)';
      c.style.transition='opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)';
    });
    svcObs.observe(svcGrid);
  }

  /* Stagger areas cards */
  var areasObs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        e.target.querySelectorAll('.areas__card').forEach(function(c,i){
          setTimeout(function(){ c.style.opacity='1'; c.style.transform='translateY(0)'; },i*80);
        });
        areasObs.unobserve(e.target);
      }
    });
  },{threshold:0.08});
  var areasGrid = document.querySelector('.areas__cards');
  if(areasGrid){
    areasGrid.querySelectorAll('.areas__card').forEach(function(c){
      c.style.opacity='0'; c.style.transform='translateY(28px)';
      c.style.transition='opacity 0.75s cubic-bezier(0.16,1,0.3,1), transform 0.75s cubic-bezier(0.16,1,0.3,1)';
    });
    areasObs.observe(areasGrid);
  }

  /* Fallback: force all visible after 1s */
  setTimeout(function(){
    document.querySelectorAll(REVEAL_SELECTORS).forEach(function(el){ el.classList.add('visible'); });
    document.querySelectorAll('.svc-card,.areas__card').forEach(function(el){
      el.style.opacity='1'; el.style.transform='translateY(0) scale(1)';
    });
  },1000);

  /* ── PARALLAX (desktop) ── */
  if(!isMobile){
    var heroBg=document.getElementById('heroBg');
    window.addEventListener('scroll',function(){ if(heroBg&&window.scrollY<window.innerHeight) heroBg.style.transform='translateY('+(window.scrollY*.22)+'px)'; },{passive:true});
  }

  /* ── CARD TILT (desktop) ── */
  if(!isMobile){
    document.querySelectorAll('.svc-card').forEach(function(card){
      card.addEventListener('mousemove',function(e){ var r=card.getBoundingClientRect(), x=((e.clientX-r.left)/r.width-.5)*6, y=((e.clientY-r.top)/r.height-.5)*6; card.style.transform='translateY(-8px) rotateX('+(-y)+'deg) rotateY('+x+'deg)'; card.style.transition='transform .15s ease'; });
      card.addEventListener('mouseleave',function(){ card.style.transform=''; card.style.transition=''; });
    });
  }

  /* ── ESC KEY ── */
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'){ closeMenu(); var lb=document.getElementById('galleryLightbox'); if(lb)lb.classList.remove('open'); document.body.style.overflow=''; }
  });

  /* ── MOBILE TOUCH ANIMATIONS ── */
  var isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
  if(isTouch){
    var mObs = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          e.target.style.transition='opacity .7s cubic-bezier(.16,1,.3,1) '+e.target.dataset.delay+'s, transform .7s cubic-bezier(.16,1,.3,1) '+e.target.dataset.delay+'s';
          e.target.style.opacity='1'; e.target.style.transform='translateY(0) scale(1)';
          mObs.unobserve(e.target);
        }
      });
    },{threshold:0.07,rootMargin:'0px 0px -10px 0px'});
    ['.svc-card','.areas__card','.about__feat','.ct__card','.gallery__stack-item','.reviews__card'].forEach(function(sel){
      document.querySelectorAll(sel).forEach(function(el,i){
        el.style.opacity='0'; el.style.transform='translateY(20px)'; el.dataset.delay=(i*0.07).toFixed(2); mObs.observe(el);
      });
    });
    var hbg=document.getElementById('heroBg');
    window.addEventListener('scroll',function(){ if(hbg&&window.scrollY<window.innerHeight*.8) hbg.style.transform='translateY('+(window.scrollY*.1)+'px)'; },{passive:true});
  }
  var si=document.getElementById('siteIntro');
  if(si){ si.addEventListener('animationend',function(){ si.style.display='none'; }); setTimeout(function(){ if(si) si.style.display='none'; },3200); }
  /* ── HERO CURSOR GLOW (desktop) ── */
  var heroSection = document.querySelector('.hero');
  if(heroSection && !isTouch){
    heroSection.addEventListener('mousemove', function(e){
      var r = heroSection.getBoundingClientRect();
      var x = e.clientX - r.left, y = e.clientY - r.top;
      heroSection.style.setProperty('--mx', x + 'px');
      heroSection.style.setProperty('--my', y + 'px');
      var after = heroSection;
      if(after) after.style.transform = 'none'; // handled via CSS pseudo
    });
  }

  /* ── MAGNETIC BUTTONS ── */
  if(!isTouch){
    document.querySelectorAll('.cta-primary,.cta-secondary,.btn-wa').forEach(function(btn){
      btn.addEventListener('mousemove',function(e){
        var r=btn.getBoundingClientRect();
        var x=(e.clientX-r.left-r.width/2)*0.15;
        var y=(e.clientY-r.top-r.height/2)*0.15;
        btn.style.transform='translateY('+y+'px) translateX('+x+'px)';
        btn.style.transition='transform 0.15s ease';
      });
      btn.addEventListener('mouseleave',function(){
        btn.style.transform='';
        btn.style.transition='transform 0.5s cubic-bezier(0.16,1,0.3,1)';
      });
    });
  }

  /* ── NUMBER COUNTER ANIMATION ── */
  function animateCounter(el, target, duration){
    var start=0, step=target/60, cur=0;
    var timer=setInterval(function(){
      cur=Math.min(cur+step, target);
      el.textContent = Math.round(cur) + (el.dataset.suffix||'');
      if(cur>=target) clearInterval(timer);
    }, duration/60);
  }

  var statsObs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        e.target.querySelectorAll('[data-count]').forEach(function(el){
          animateCounter(el, parseInt(el.dataset.count), 1200);
        });
        statsObs.unobserve(e.target);
      }
    });
  },{threshold:0.3});
  document.querySelectorAll('.about__features').forEach(function(el){ statsObs.observe(el); });

  /* ── ENHANCED SECTION OBSERVERS ── */
  var obs2 = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('visible'); obs2.unobserve(e.target); }
    });
  },{threshold:0.08, rootMargin:'0px 0px -20px 0px'});

  // About left/right
  document.querySelectorAll('.about__left,.about__right').forEach(function(el){ obs2.observe(el); });

  // Contact left split
  var ctLeft = document.querySelector('.ct__left');
  var ctRight = document.querySelector('.ct__right');
  var ctObs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        e.target.classList.add('visible');
        ctObs.unobserve(e.target);
      }
    });
  },{threshold:0.08});
  if(ctLeft) ctObs.observe(ctLeft);
  if(ctRight) ctObs.observe(ctRight);

  // Svc top
  var svcTop = document.querySelector('.svc__top');
  if(svcTop) obs2.observe(svcTop);
  var galTop = document.querySelector('.gallery__top');
  if(galTop) obs2.observe(galTop);

  // Svc cards stagger
  var svcGrid2 = document.querySelector('.svc__grid');
  if(svcGrid2){
    var svcCardObs = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          e.target.querySelectorAll('.svc-card').forEach(function(c){ c.classList.add('card-visible'); });
          svcCardObs.unobserve(e.target);
        }
      });
    },{threshold:0.12});
    svcCardObs.observe(svcGrid2);
  }

  /* ── PARALLAX: hero bg + svc bg ── */
  window.addEventListener('scroll',function(){
    var sy = window.scrollY;
    var heroBg = document.getElementById('heroBg');
    if(heroBg && sy < window.innerHeight * 1.2){
      heroBg.style.transform = 'translateY(' + (sy * (isTouch ? 0.1 : 0.22)) + 'px)';
    }
  },{passive:true});

  /* ── BRANDS: force animation running always ── */
  var bTrack = document.getElementById('brandsTrack');
  if(bTrack){
    bTrack.style.animationPlayState = 'running';
    // Remove all pause listeners
    var bWrap = bTrack.closest('.brands__track-wrap');
    if(bWrap){
      bWrap.addEventListener('mouseenter', function(){ bTrack.style.animationPlayState = 'running'; });
      bWrap.addEventListener('mouseleave', function(){ bTrack.style.animationPlayState = 'running'; });
    }
  }

  /* ── SMOOTH SECTION TRANSITIONS: opacity on scroll ── */
  var allSections = document.querySelectorAll('section');
  var sectionObs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      e.target.style.opacity = e.isIntersecting ? '1' : '';
    });
  },{threshold:0.05});
  allSections.forEach(function(s){ sectionObs.observe(s); });

  /* ── FALLBACK: force all visible ── */
  setTimeout(function(){
    document.querySelectorAll('.about__left,.about__right,.ct__left,.ct__right,.svc__top,.gallery__top').forEach(function(el){
      el.classList.add('visible');
    });
    document.querySelectorAll('.svc-card').forEach(function(c){ c.classList.add('card-visible'); });
  }, 1200);
