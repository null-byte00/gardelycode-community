/* GardelyCode site — language, theme, hero typing, reveal, demo video, lightbox.
   Plain JS, no build step. English copy lives in index.html; Russian lives here. */
(function () {
  'use strict';

  var html = document.documentElement;
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode etc. */ } }
  };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------ RU copy */
  var RU = {
    'meta.title': 'GardelyCode — бесплатная AI-среда для вайбкодинга на Windows',
    'meta.desc': 'Опишите, что нужно. Gardely напишет код, запустит его и покажет результат — бесплатно и без API-ключей. Крошечная AI-среда для вайбкодинга на Windows, на русском и английском.',

    'skip': 'К содержимому',
    'nav.demo': 'Демо', 'nav.how': 'Как это работает', 'nav.features': 'Возможности', 'nav.open': 'Открытый код', 'nav.faq': 'Вопросы',
    'nav.download': 'Скачать', 'theme': 'Переключить тему',

    'hero.pill': 'Бесплатная AI-среда для вайбкодинга · Windows',
    'hero.h1': 'Вырасти своё <em>приложение.</em>',
    'hero.sub': 'Опишите, что нужно. Gardely напишет код, запустит его и покажет результат — бесплатно и без API-ключей.',
    'hero.cta': 'Скачать для Windows',
    'hero.cta2': 'Смотреть, как строит',
    'hero.note': 'Бесплатно · Windows 10/11',
    'hero.live': 'Живой предпросмотр',
    'hero.alt': 'Окно GardelyCode: слева разговор с агентом Gardely и изменённые файлы с кнопками «Принять» и «Отклонить», в центре живой предпросмотр сайта кофейни, справа дерево файлов, диф в редакторе кода и терминал.',
    'hero.prompt': 'Сделай мне лендинг для моей кофейни с формой бронирования',
    'hero.working': 'Gardely работает…',
    'hero.done': 'Готово · 3 файла · Чекпоинт 1',
    'mode.ask': 'Спросить', 'mode.agent': 'Агент', 'mode.plan': 'План',

    'demo.eyebrow': 'Демо',
    'demo.h2': 'От одной фразы до <em>работающего сайта.</em>',
    'demo.sub': 'Один запрос, никаких настроек. Вот страница, которую Gardely собрала по нему.',
    'demo.alt': 'Готовый лендинг кофейни, сделанный Gardely: тёплая коричневая шапка с названием и меню из шести позиций с ценами.',
    'demo.caption': 'Собрано Gardely меньше чем за 2 минуты',
    'demo.caption2': 'реальный замер, а не макет',

    'how.eyebrow': 'Как это работает',
    'how.h2': 'Три шага. <em>Без церемоний.</em>',
    'how.1.t': 'Опишите',
    'how.1.p': 'Скажите, что хотите, обычными словами — по-русски или по-английски. Можно приложить скриншот.',
    'how.1.mock': 'Добавь переключатель тёмной темы в шапку',
    'how.2.t': 'Gardely строит',
    'how.2.p': 'Файлы появляются прямо по ходу. Каждое изменение приходит как диф, который можно принять или отклонить — одним кликом.',
    'how.3.t': 'Смотрите вживую — и растите дальше',
    'how.3.p': 'Сцена показывает приложение, как только оно готово. Каждый шаг — чекпоинт: одно нажатие на «Вернуться сюда» — и вы снова там.',
    'mock.edited': 'изменён', 'mock.new': 'новый', 'mock.accept': 'Принять', 'mock.reject': 'Отклонить', 'mock.kept': 'Принято',
    'mock.cp': 'Чекпоинт 2', 'mock.restore': 'Вернуться сюда',
    'mock.hint': 'Opus 5.5 · бесплатно, без ключа', 'mock.enter': 'Enter — отправить',

    'feat.eyebrow': 'Возможности',
    'feat.h2': 'Всё, что нужно. <em>Ничего настраивать.</em>',
    'feat.1.t': 'Без API-ключей. Без карты.',
    'feat.1.p': 'Бесплатные модели уже внутри. Установили, открыли, описали — вот и вся настройка.',
    'feat.2.t': 'Семейство моделей Claude',
    'feat.2.p': 'Выбирайте модель под задачу: Opus для больших фич, Fable для дизайна, Sonnet для повседневного кода, Haiku для мгновенных правок.',
    'feat.3.t': 'Режимы разрешений',
    'feat.3.p': 'Вы решаете, сколько Gardely делает сама — от вопроса перед каждой правкой до полной автономии.',
    'pm.auto': 'Авто', 'pm.ask': 'Спрашивать всегда', 'pm.accept': 'Принимать правки', 'pm.plan': 'План', 'pm.full': 'Полный доступ',
    'feat.4.t': 'Чекпоинты и откат в один клик',
    'feat.4.p': 'Каждый ход сохраняется. Не понравилось, куда всё пошло? Вернитесь к любой точке и попробуйте иначе.',
    'feat.5.t': 'Серверы MCP',
    'feat.5.p': 'Подключайте инструменты по MCP. Конфиги из других редакторов работают как есть — ничего переписывать не нужно.',
    'feat.6.t': 'Скиллы и правила проекта',
    'feat.6.p': 'Научите Gardely работать по-вашему: плейбуки <code>SKILL.md</code> и соглашения проекта в <code>AGENTS.md</code>.',
    'feat.7.t': 'Сцена, терминал, редактор',
    'feat.7.p': 'Живой предпросмотр, настоящий терминал и редактор кода — рядом, в одном окне.',
    'feat.8.t': 'Русский и английский',
    'feat.8.p': 'Весь интерфейс — и сама Gardely — говорят на обоих. Переключайте в любой момент.',
    'feat.9.t': 'Крошечная и быстрая',
    'feat.9.p': 'Установщик ~6 МБ и нативное ядро на Rust. Мало памяти, быстрый старт — даже на скромном ноутбуке.',

    'gal.eyebrow': 'Скриншоты',
    'gal.h2': 'Спокойное место, <em>чтобы строить.</em>',
    'gal.open': 'Открыть в полном размере',
    'gal.1': 'Лесная ночь — тёмная тема по умолчанию', 'gal.1.alt': 'GardelyCode в тёмной теме по умолчанию.',
    'gal.2': 'Дневная оранжерея — светлая тема', 'gal.2.alt': 'GardelyCode в светлой теме.',
    'gal.3': 'Русский интерфейс', 'gal.3.alt': 'GardelyCode с русским интерфейсом.',
    'gal.4': 'Выбор модели — Opus, Fable, Sonnet, Haiku', 'gal.4.alt': 'Меню выбора модели: Claude Opus 5.5, Claude Fable 5.1, Claude Sonnet 5.5, Claude Haiku 5.5, переключатели Presto и Adagio.',
    'gal.5': 'Режимы разрешений — от «Спрашивать всегда» до «Полного доступа»', 'gal.5.alt': 'Меню разрешений: Авто, Спрашивать всегда, Принимать правки, План, Полный доступ.',
    'gal.6': 'Gardely за работой — шаги, объяснение простыми словами, короткая пауза, когда бесплатные модели заняты', 'gal.6.alt': 'Gardely работает: список выполненных шагов и заметка, что бесплатная модель делает короткую паузу.',

    'open.eyebrow': 'Открытый код',
    'open.h2': 'Открыто там, <em>где это важно.</em>',
    'open.p1': 'Модули рабочего пространства — файлы, поиск, терминал, живой предпросмотр, — а также скиллы и шаблоны проектов открыты на GitHub. Читайте, форкайте, присылайте пулл-реквесты.',
    'open.p2': 'Ядро — агент, AI-модели и интерфейс — наше и остаётся проприетарным. Именно это позволяет держать приложение бесплатным, а модели — без ключей.',
    'open.cta': 'Открыть на GitHub',
    'open.l1': 'Открыто на GitHub',
    'open.l1.1': 'Рабочее пространство: файлы · поиск · терминал · предпросмотр',
    'open.l1.2': 'Скиллы агента (SKILL.md)',
    'open.l1.3': 'Шаблоны проектов',
    'open.l2': 'Наше ядро',
    'open.l2.1': 'Агент', 'open.l2.2': 'AI-модели', 'open.l2.3': 'Интерфейс',

    'faq.eyebrow': 'Вопросы',
    'faq.h2': 'Честные <em>ответы.</em>',
    'faq.1.q': 'Это правда бесплатно?',
    'faq.1.a': 'Да. GardelyCode бесплатно скачивается и используется. Встроенные модели работают через бесплатных провайдеров с лимитами честного использования: если модель занята, Gardely подождёт несколько секунд и продолжит. Без пробного периода, без карты.',
    'faq.2.q': 'Нужен ли API-ключ?',
    'faq.2.a': 'Нет. Нигде не нужно регистрироваться и ничего вставлять. Установите и начните описывать.',
    'faq.3.q': 'Какой ИИ внутри?',
    'faq.3.a': 'GardelyCode работает поверх ведущих открытых моделей через бесплатных провайдеров. Модели — Claude Opus, Fable, Sonnet, Haiku — подходят для разных задач; по умолчанию стоит Opus.',
    'faq.4.q': 'Мой код приватен?',
    'faq.4.a': 'Если честно: чтобы получить ответ, ваши запросы и код, над которым вы работаете, отправляются AI-провайдерам. Поэтому не вставляйте в чат секреты, ключи и пароли. Всё остальное — файлы проекта, терминал — остаётся на вашем компьютере.',
    'faq.5.q': 'Mac или Linux?',
    'faq.5.a': 'Сначала Windows. Сборки для Mac и Linux в планах — подпишитесь на Telegram-канал, чтобы узнать первыми.',

    'mod.eyebrow': 'Модели',
    'mod.h2': 'Выбирайте модель <em>по вкусу.</em>',
    'mod.sub': 'Всё, что есть в списке моделей текущей версии — бесплатно и без ключа.',
    'mod.all': 'Показать все',
    'mod.note': 'Модели приходят от бесплатных провайдеров с лимитами честного использования, поэтому занятая модель может подождать пару секунд или передать запрос другой. Список растёт с каждым релизом.',

    'com.eyebrow': 'Сообщество',
    'com.h2': 'Смотрите, <em>как растёт.</em>',
    'com.sub': 'Новые сборки, короткие демо и планы — в Telegram, на YouTube и в TikTok.',
    'com.tg': 'Telegram-канал', 'com.tg.s': 'Сборки, заметки, ответы на вопросы',
    'com.yt': 'YouTube', 'com.yt.s': 'Смотрите, как Gardely строит — от начала до конца',
    'com.tt': 'TikTok', 'com.tt.s': 'Короткие сборки по 30 секунд',

    'final.h2': 'Готовы что-нибудь <em>вырастить?</em>',
    'foot.copy': '© 2026 GardelyCode. Для тех, кто строит словами.',
    'foot.releases': 'Релизы', 'foot.top': 'Наверх',
    'lb.close': 'Закрыть'
  };

  /* --------------------------------------------------------------- language */
  var originals = new Map(); // element -> { text, html, alt, aria }
  var metaDesc = document.querySelector('meta[name="description"]');
  var enTitle = document.title, enDesc = metaDesc ? metaDesc.content : '';

  function remember(el) {
    if (originals.has(el)) return;
    originals.set(el, { html: el.innerHTML, alt: el.getAttribute('alt'), aria: el.getAttribute('aria-label') });
  }

  function applyLang(lang) {
    var ru = lang === 'ru';
    html.setAttribute('lang', ru ? 'ru' : 'en');

    document.querySelectorAll('[data-i18n],[data-i18n-html]').forEach(function (el) {
      remember(el);
      var key = el.getAttribute('data-i18n') || el.getAttribute('data-i18n-html');
      var isHtml = el.hasAttribute('data-i18n-html');
      if (ru && RU[key] != null) {
        if (isHtml) el.innerHTML = RU[key]; else el.textContent = RU[key];
      } else {
        el.innerHTML = originals.get(el).html;
      }
    });
    document.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
      remember(el);
      var key = el.getAttribute('data-i18n-alt');
      el.setAttribute('alt', ru && RU[key] ? RU[key] : originals.get(el).alt);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      remember(el);
      var key = el.getAttribute('data-i18n-aria');
      el.setAttribute('aria-label', ru && RU[key] ? RU[key] : originals.get(el).aria);
    });

    document.title = ru ? RU['meta.title'] : enTitle;
    if (metaDesc) metaDesc.content = ru ? RU['meta.desc'] : enDesc;
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-lang') === (ru ? 'ru' : 'en') ? 'true' : 'false');
    });
    restartTyping();
  }

  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () {
      var l = b.getAttribute('data-lang');
      store.set('gc-lang', l);
      applyLang(l);
    });
  });

  /* ------------------------------------------------------------------ theme */
  var themeMeta = document.querySelector('meta[name="theme-color"]');
  function applyTheme(t) {
    html.setAttribute('data-theme', t);
    if (themeMeta) themeMeta.content = t === 'light' ? '#f0f2eb' : '#0b100d';
  }
  var themeBtn = document.getElementById('themeBtn');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    store.set('gc-theme', next);
    applyTheme(next);
  });
  applyTheme(html.getAttribute('data-theme') === 'light' ? 'light' : 'dark');

  /* ------------------------------------------------------- hero composer loop */
  var typed = document.querySelector('.typed');
  var status = document.querySelector('.composer-status');
  var timers = [];
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }

  function restartTyping() {
    if (!typed || !status) return;
    clearTimers();
    var full = typed.textContent;
    if (reduceMotion || document.hidden) {
      typed.textContent = full;
      status.setAttribute('data-state', 'done');
      return;
    }
    (function cycle() {
      typed.textContent = '';
      status.setAttribute('data-state', 'typing');
      var i = 0;
      (function tick() {
        if (i <= full.length) {
          typed.textContent = full.slice(0, i++);
          later(tick, 34 + Math.random() * 40);
        } else {
          later(function () { status.setAttribute('data-state', 'working'); }, 450);
          later(function () { status.setAttribute('data-state', 'done'); }, 2700);
          later(cycle, 7200);
        }
      })();
    })();
  }
  document.addEventListener('visibilitychange', function () { if (!document.hidden) restartTyping(); });

  /* ------------------------------------------------------- reveal on scroll */
  var rv = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    rv.forEach(function (el) { io.observe(el); });
  } else {
    rv.forEach(function (el) { el.classList.add('in'); });
  }

  /* --------------------------------------------------------- demo video */
  var video = document.querySelector('[data-youtube-id]');
  if (video) {
    var id = (video.getAttribute('data-youtube-id') || '').trim();
    if (/^[\w-]{6,}$/.test(id)) {
      video.classList.add('is-video');
      var poster = video.querySelector('img');
      if (poster) {
        poster.src = 'https://i.ytimg.com/vi/' + id + '/maxresdefault.jpg';
        poster.removeAttribute('width'); poster.removeAttribute('height');
      }
      var play = document.createElement('button');
      play.type = 'button'; play.className = 'play'; play.setAttribute('aria-label', 'Play video');
      play.innerHTML = '<svg class="ic"><use href="#i-play"/></svg>';
      video.appendChild(play);
      play.addEventListener('click', function () {
        var f = document.createElement('iframe');
        f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
        f.title = 'GardelyCode demo';
        f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        f.allowFullscreen = true;
        video.innerHTML = ''; video.appendChild(f);
      });
    }
  }

  /* ------------------------------------------------------------- lightbox */
  var lb = document.getElementById('lightbox');
  if (lb && typeof lb.showModal === 'function') {
    var lbImg = lb.querySelector('img');
    document.querySelectorAll('.shot-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var img = btn.querySelector('img');
        lbImg.src = img.currentSrc || img.src; lbImg.alt = img.alt;
        lb.showModal();
      });
    });
    lb.querySelector('.lb-close').addEventListener('click', function () { lb.close(); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
    lb.addEventListener('close', function () { lbImg.src = ''; });
  }

  /* ---------------------------------------------------------------- init */
  applyLang(html.getAttribute('lang') === 'ru' ? 'ru' : 'en');
})();
