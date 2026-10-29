
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  
  var SCHEDULE = [
    { s: 12,   e: 13.5, act: '物理性甦醒',   note: '睜開眼確認世界還沒毀滅，在床上進行靈魂歸位', tag: '床上' },
    { s: 13.5, e: 14,   act: '重力搏鬥',     note: '試圖下床，通常以「融化」至床緣宣告失敗',       tag: '融化' },
    { s: 14,   e: 16,   act: '低電量進食',   note: '攝取維持生命最低限度的熱量（冷咖啡或剩菜）',   tag: '低電量' },
    { s: 16,   e: 19,   act: '高效失蹤',     note: '靈魂公休，拒絕所有社交訊息',                   tag: '斷訊中' },
    { s: 19,   e: 22,   act: '被迫營業',     note: '處理瑣事，眼神死達到峰值，內心瘋狂想回床上',   tag: '營業中' },
    { s: 22,   e: 26,   act: '報復性清醒',   note: '能量最強。滑手機、看廢片、腦內併購全球企業',   tag: '尖峰' },   // 22:00–02:00
    { s: 2,    e: 4,    act: '寂寞顆粒時間', note: '深夜與自己握手言和（或是投降）',               tag: '顆粒' },
    { s: 4,    e: 12,   act: '深層離線',     note: '回到唯一的避難所：被窩',                       tag: '離線' }
  ];

  function fmt(h) {
    h = ((h % 24) + 24) % 24;
    var hh = Math.floor(h), mm = Math.round((h - hh) * 60);
    return (hh < 10 ? '0' : '') + hh + ':' + (mm < 10 ? '0' : '') + mm;
  }

  function currentBlock(now) {
    var h = now.getHours() + now.getMinutes() / 60;
    for (var i = 0; i < SCHEDULE.length; i++) {
      var b = SCHEDULE[i], s = b.s, e = b.e;
      if (e > 24) { // wraps midnight
        if (h >= s || h < (e - 24)) return b;
      } else if (h >= s && h < e) return b;
    }
    return SCHEDULE[0];
  }

  
  var list = document.getElementById('schedList');
  if (list) {
    SCHEDULE.forEach(function (b) {
      var li = document.createElement('li');
      li.dataset.s = b.s; li.dataset.e = b.e;
      li.innerHTML =
        '<span class="sched__time">' + fmt(b.s) + '–' + fmt(b.e) + '</span>' +
        '<span class="sched__act">' + b.act + '</span>' +
        '<span class="sched__badge">[ ' + b.tag + ' ]</span>' +
        '<span class="sched__note">' + b.note + '</span>';
      list.appendChild(li);
    });
  }

  
  var elAct = document.getElementById('statusAct'),
      elRange = document.getElementById('statusRange'),
      elTag = document.getElementById('statusTag'),
      elClock = document.getElementById('clock');

  var stateCells = [].slice.call(document.querySelectorAll('.bento__cell[data-act]'));

  function tick() {
    var now = new Date(), b = currentBlock(now);
    if (elClock) {
      var p = function (n) { return (n < 10 ? '0' : '') + n; };
      elClock.textContent = p(now.getHours()) + ':' + p(now.getMinutes()) + ':' + p(now.getSeconds());
    }
    if (elAct) elAct.textContent = b.act;
    if (elRange) elRange.textContent = fmt(b.s) + ' – ' + fmt(b.e);
    if (elTag) elTag.textContent = '[ ' + b.tag + ' ]';
    if (list) {
      list.querySelectorAll('li').forEach(function (li) {
        li.classList.toggle('now', li.querySelector('.sched__act').textContent === b.act);
      });
    }
    
    stateCells.forEach(function (c) {
      var on = c.dataset.act === b.act;
      c.classList.toggle('is-now', on);
      var badge = c.querySelector('.bento__now');
      if (badge) badge.hidden = !on;
    });
  }
  tick();
  setInterval(tick, 1000);

  
  var QUOTES = [
    ['醒了，但沒完全醒。', '起床 / 重力'],
    ['重力太大，我回床上。', '起床 / 重力'],
    ['訊息已讀，靈魂未讀。', '社交斷訊'],
    ['我沒不回你，我關機了。', '社交斷訊'],
    ['腦內裝著億萬富翁，作業系統是 Windows 95。', '野心 vs 現實'],
    ['統治世界之前，先統治這條棉被。', '野心 vs 現實'],
    ['微笑著，但本體已離線。', '被迫營業'],
    ['02:00 是我的尖峰時段。', '深夜模式'],
    ['壓力 0.1 帕，我已液態。', '融化態'],
    ['桌角是我的形狀。', '融化態'],
    ['我投降，但我不認輸。', '官方座右銘']
  ];
  var qText = document.getElementById('quoteText'), qCat = document.getElementById('quoteCat'), qi = 0;
  if (qText && !reduce) {
    setInterval(function () {
      qi = (qi + 1) % QUOTES.length;
      qText.style.opacity = 0; qText.style.transform = 'translateY(10px)';
      setTimeout(function () {
        qText.textContent = QUOTES[qi][0];
        qCat.textContent = QUOTES[qi][1];
        qText.style.opacity = 1; qText.style.transform = 'none';
      }, 500);
    }, 4200);
  }

  
  var reveals = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  }

  
  var rail = document.getElementById('rail');
  if (rail) {
    var railLinks = [].slice.call(rail.querySelectorAll('a'));
    var secs = railLinks.map(function (a) { return document.querySelector(a.getAttribute('href')); });
    var setOn = function (idx) {
      railLinks.forEach(function (a, i) { a.classList.toggle('on', i === idx); });
    };
    var HOT = 120, IDLE = 1100;
    var pastHero = false, scrolling = false, near = false, idleTimer = 0;
    var sync = function () {
      rail.classList.toggle('on',
        pastHero && (scrolling || near || rail.contains(document.activeElement)));
    };
    var onScroll = function () {
      var y = window.scrollY || window.pageYOffset;
      pastHero = y > window.innerHeight * 0.6;
      scrolling = true;
      clearTimeout(idleTimer);
      idleTimer = setTimeout(function () { scrolling = false; sync(); }, IDLE);
      
      var line = y + window.innerHeight / 3, cur = 0;
      secs.forEach(function (el, i) { if (el && el.offsetTop <= line) cur = i; });
      setOn(cur);
      sync();
    };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    addEventListener('mousemove', function (e) {
      var n = e.clientX > innerWidth - HOT;
      if (n !== near) { near = n; sync(); }
    }, { passive: true });
    rail.addEventListener('focusin', sync);
    rail.addEventListener('focusout', function () { setTimeout(sync, 0); });
    onScroll();
  }

  
  var custSel = document.getElementById('custQuote'),
      custTee = document.getElementById('custTee'),
      custMug = document.getElementById('custMug'),
      custPlates = [].slice.call(document.querySelectorAll('.cust')),
      custSideBtns = [].slice.call(document.querySelectorAll('.cust__side button'));
  if (custSel && custTee && custMug) {
    var setSide = function (side) {
      custPlates.forEach(function (el) { el.dataset.side = side; });
      custSideBtns.forEach(function (b) { b.classList.toggle('is-on', b.dataset.side === side); });
    };
    var paintQuote = function (userPicked) {
      custTee.textContent = custSel.value;
      custMug.textContent = custSel.value;
      if (userPicked) setSide(custSel.value ? 'back' : 'front');
    };
    custSel.addEventListener('change', function () { paintQuote(true); });
    custSideBtns.forEach(function (b) {
      b.addEventListener('click', function () { setSide(b.dataset.side); });
    });
    paintQuote(false);
  }

  
  var burger = document.getElementById('burger'),
      links = document.querySelector('.nav__links'),
      nav = document.querySelector('.nav');
  if (burger && links) {
    var toggle = function (open) {
      links.classList.toggle('open', open);
      nav.classList.toggle('menu-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', function () { toggle(!links.classList.contains('open')); });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { toggle(false); });
    });
  }
  
  var swWrap = document.getElementById('nailSwatches');
  if (swWrap) {
    var nailName = document.getElementById('nailName'),
        nailWhen = document.getElementById('nailWhen'),
        nailView = document.getElementById('nailView'),
        closeName = document.getElementById('nailCloseName'),
        swBtns = [].slice.call(swWrap.querySelectorAll('button'));

    var pick = function (btn) {
      swBtns.forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
      var label = btn.querySelector('b').textContent;
      
      var tints = document.querySelectorAll('.nailtint');
      for (var t = 0; t < tints.length; t++) {
        tints[t].src = 'assets/ante_nails_' + btn.dataset.nail + '.webp';
      }
      if (nailName) nailName.textContent = label;
      if (nailWhen) nailWhen.textContent = btn.dataset.when;
      if (closeName) closeName.textContent = label;
    };
    pick(swBtns[0]);
    
    swBtns.forEach(function (b) {
      b.addEventListener('mouseenter', function () { pick(b); });
      b.addEventListener('focus', function () { pick(b); });
    });
    swWrap.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (b) pick(b);
    });
    
    swWrap.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      var i = swBtns.indexOf(document.activeElement);
      if (i < 0) return;
      e.preventDefault();
      var n = swBtns[(i + (e.key === 'ArrowRight' ? 1 : swBtns.length - 1)) % swBtns.length];
      n.focus(); pick(n);
    });
  }

  
  var mdl = document.getElementById('merchModal');
  if (mdl) {
    var mCards = [].slice.call(document.querySelectorAll('.merch__card[data-md]')),
        mPanes = [].slice.call(mdl.querySelectorAll('.mdetail[data-md]')),
        mKeys  = mPanes.map(function (n) { return n.dataset.md; }),
        mLast  = null;

    mCards.forEach(function (c) {
      if (mKeys.indexOf(c.dataset.md) < 0) {
        console.warn('[merch] 卡片 data-md="' + c.dataset.md + '" 在彈窗裡找不到對應的 .mdetail');
      }
    });

    var mDialog = mdl.querySelector('.mdl__panel');
    var mOpen = function (key, opener) {
      var hit = false;
      mPanes.forEach(function (n) {
        var on = n.dataset.md === key;
        n.hidden = !on;
        if (on) { hit = true; mDialog.setAttribute('aria-labelledby', n.querySelector('.mdetail__h').id); }
      });
      if (!hit) return;
      mLast = opener || null;
      mdl.hidden = false;
      document.body.classList.add('mdl-open');
      mdl.querySelector('.mdl__body').scrollTop = 0;
      renderKnockBtn(key);          
      mdl.querySelector('.mdl__x').focus();
    };
    var mClose = function () {
      mdl.hidden = true;
      document.body.classList.remove('mdl-open');
      if (mLast) { mLast.focus(); mLast = null; }
    };

    mCards.forEach(function (c) {
      
      c.addEventListener('click', function () { mOpen(c.dataset.md, c.querySelector('.merch__link')); });
    });
    mdl.addEventListener('click', function (e) {
      if (e.target.closest('[data-close]')) mClose();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !mdl.hidden) mClose();
    });
    
    mdl.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var f = [].slice.call(mDialog.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])'))
               .filter(function (n) { return n.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  
  var KNOCK_OA = '%40719anpch';
  var KNOCK_MSG = {
    blindbox: '投降盲盒。做出來我要一份。抽到重複的也認了。',
    charm:    '迷你吊飾。做出來我要一個。掛包上那個。',
    figure:   '標準款公仔。做出來我要一隻。',
    apparel:  '語錄服飾。做出來我要一件。先做「拒絕營業中」。'
  };
  var KNOCK_KEY = 'native.knock.';
  var ls = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  var renderKnockBtn = function (item) {
    var btn = document.getElementById('knockBtn');
    if (!btn) return;
    var msg = KNOCK_MSG[item];
    btn.href = msg
      ? 'https://line.me/R/oaMessage/' + KNOCK_OA + '/?' + encodeURIComponent(msg)
      : 'https://line.me/R/ti/p/' + KNOCK_OA;
    btn.dataset.item = item || '';
    var done = ls.get(KNOCK_KEY + item) === '1';
    btn.classList.toggle('is-done', done);
    document.getElementById('knockLabel').textContent = done ? '催過了' : '去催代理人';
  };

  var knockBtn = document.getElementById('knockBtn');
  if (knockBtn) {
    
    knockBtn.addEventListener('click', function () {
      if (knockBtn.dataset.item) ls.set(KNOCK_KEY + knockBtn.dataset.item, '1');
    });
  }

  
  var heroArt = document.getElementById('heroArt');
  if (heroArt) {
    var setTag = function (on) {
      heroArt.classList.toggle('tag-on', on);
      heroArt.setAttribute('aria-expanded', on ? 'true' : 'false');
    };
    heroArt.addEventListener('click', function (e) {
      e.stopPropagation();
      setTag(!heroArt.classList.contains('tag-on'));
    });
    heroArt.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setTag(!heroArt.classList.contains('tag-on')); }
    });
    document.addEventListener('click', function () { setTag(false); });
  }
  
  (function () {
    var q = (location.search.match(/[?&]halloween=([01])/) || [])[1];
    var tw = new Date(Date.now() + 8 * 3600e3);
    var m = tw.getUTCMonth() + 1, d = tw.getUTCDate(), h = tw.getUTCHours();
    var on = q ? q === '1' : ((m === 10 && d >= 24) || (m === 11 && d === 1 && h < 4));
    if (!on) return;
    document.documentElement.classList.add('is-halloween');
    var track = document.querySelector('.ticker__track');
    if (track) {
      var words = ['萬聖節試裝中', '怎麼扮，耳朵都會跑出來', '不給糖，我就回床上'];
      var spans = track.querySelectorAll('span'), half = spans.length / 2;
      [0, half].forEach(function (i) {
        var ref = spans[i];
        words.forEach(function (w) {
          var el = document.createElement('span');
          el.className = 'hw-tick'; el.textContent = w;
          track.insertBefore(el, ref);
        });
      });
    }
    var card = document.getElementById('hwCard'), x = document.getElementById('hwClose');
    try { if (sessionStorage.getItem('hwClosed')) card.classList.add('is-closed'); } catch (e) {}
    if (x) x.addEventListener('click', function () {
      card.classList.add('is-closed');
      try { sessionStorage.setItem('hwClosed', '1'); } catch (e) {}
    });
  })();
})();
