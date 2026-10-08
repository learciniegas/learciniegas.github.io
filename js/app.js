const P = [
  { id: 'k60', img: 'k60.png', n: 'Teclado K60', c: 'Teclados', p: 60, o: 80, t: 1 },
  { id: 'm30', img: 'm30.png', n: 'Ratón M30', c: 'Ratones', p: 30, o: 40, t: 1 },
  { id: 'a75', img: 'a75.png', n: 'Audífonos A75', c: 'Audífonos', p: 75, o: 100, t: 1 },
  { id: 't45', img: 't45.png', n: 'Teclado T45', c: 'Teclados', p: 45, o: 60, t: 0 },
  { id: 'r45', img: 'r45.png', n: 'Ratón R45', c: 'Ratones', p: 45, o: 60, t: 0 },
  { id: 'a60', img: 'a60.png', n: 'Audífonos A60', c: 'Audífonos', p: 60, o: 80, t: 0 },
];
const $ = (s, r = document) => r.querySelector(s),
  $$ = (s, r = document) => [...r.querySelectorAll(s)],
  byId = (id) => P.find((x) => x.id === id);
const money = (n) => '$' + n,
  SHIP = 10;
const get = () => {
  try {
    return JSON.parse(localStorage.cart || '{}');
  } catch {
    return {};
  }
};
const save = (c) => {
  localStorage.cart = JSON.stringify(c);
  paint();
};
const count = () => Object.values(get()).reduce((a, b) => a + b, 0);
function toast(m) {
  const t = $('#toast');
  t.textContent = '';
  setTimeout(() => (t.textContent = m), 50);
  setTimeout(() => (t.textContent = ''), 4000);
}
function add(id, q = 1) {
  const c = get();
  c[id] = Math.min(10, (c[id] || 0) + q);
  save(c);
  toast(byId(id).n + ' agregado al carrito.');
}
const card = (p) =>
  `<article class="card"><div class="im"><img src="img/${p.img}" alt="${p.n}"></div><div class="bd"><span class="cat">${p.c}</span><h3>${p.n}</h3><div class="pr">${money(p.p)}</div><div class="old">Antes ${money(p.o)}, ahora ${money(p.p)}, ${Math.round(100 - (p.p / p.o) * 100)} % menos</div><button class="btn pri" data-add="${p.id}" aria-label="Agregar ${p.n} al carrito">Agregar al carrito</button><a class="btn" href="producto.html?id=${p.id}" aria-label="Ver ${p.n}">Ver producto</a></div></article>`;
function layout() {
  document.body.insertAdjacentHTML(
    'afterbegin',
    `<a class="skip" href="#main">Saltar al contenido</a><header><a class="logo" href="index.html"><img src="img/logo.png" alt="Logo de la tienda">PERIFÉRICOS</a><form role="search" action="index.html"><label class="sr" for="q">Buscar productos</label><input id="q" name="q" type="search" placeholder="Buscar teclados, ratones, audífonos…"><button class="btn pri">Buscar</button></form><span>Precios en USD</span></header><nav aria-label="Principal"><a class="btn" href="index.html">Categorías</a><a class="btn" href="ayuda.html">Ayuda / FAQ</a><a class="btn sp" href="registro.html">Cuenta</a><button class="btn" id="open" aria-haspopup="dialog"><span>Carrito (<span id="n">0</span>)</span></button></nav>`,
  );
  if (localStorage.user) $('nav a.sp').textContent = localStorage.user;
  document.body.insertAdjacentHTML(
    'beforeend',
    `<div id="toast" role="status"></div><dialog id="cart" aria-labelledby="ct"><div class="row"><h2 id="ct">Tu carrito</h2><button class="btn" id="close">Cerrar</button></div><div id="items"></div></dialog>`,
  );
  $('#open').onclick = () => $('#cart').showModal();
  $('#close').onclick = () => $('#cart').close();
  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-add]');
    if (a) add(a.dataset.add);
    const b = e.target.closest('[data-q]');
    if (b) {
      const c = get(),
        [i, d] = b.dataset.q.split(':');
      c[i] = Math.max(1, Math.min(10, c[i] + +d));
      save(c);
    }
    const r = e.target.closest('[data-rm]');
    if (r) {
      const c = get();
      delete c[r.dataset.rm];
      save(c);
      toast('Artículo quitado.');
    }
  });
  paint();
}
function paint() {
  const c = get(),
    ids = Object.keys(c);
  $('#n').textContent = count();
  if (!ids.length) {
    $('#items').innerHTML =
      '<p>Tu carrito está vacío. Agrega productos para verlos aquí.</p><a class="btn pri" href="index.html">Explorar catálogo</a>';
    return;
  }
  let s = 0;
  const h = ids
    .map((i) => {
      const p = byId(i);
      s += p.p * c[i];
      return `<div class="it"><strong>${p.n}</strong><span class="old">${money(p.p)} c/u</span><div class="row"><div class="qty"><button class="btn" data-q="${i}:-1" aria-label="Disminuir cantidad de ${p.n}">−</button><output aria-label="Cantidad de ${p.n}">${c[i]}</output><button class="btn" data-q="${i}:1" aria-label="Aumentar cantidad de ${p.n}">+</button></div><strong>Subtotal: ${money(p.p * c[i])}</strong></div><div class="row"><button class="btn" data-rm="${i}" aria-label="Quitar ${p.n}">Quitar</button><a class="btn out" href="envio.html?solo=${i}&q=${c[i]}">Comprar este producto</a></div></div>`;
    })
    .join('');
  $('#items').innerHTML =
    h +
    `<div class="row"><span>Subtotal</span><strong>${money(s)}</strong></div><div class="row"><span>Envío estándar</span><strong>${money(SHIP)}</strong></div><div class="row"><span>Total (USD)</span><span class="tot">${money(s + SHIP)}</span></div><p class="old">Impuestos incluidos.</p><a class="btn pri w" href="envio.html">Pagar todo</a>`;
}
function catalog() {
  const u = new URLSearchParams(location.search),
    q = (u.get('q') || '').toLowerCase(),
    cat = u.get('cat') || '',
    mn = +u.get('min') || 0,
    mx = +u.get('max') || 9999,
    ord = u.get('ord') || '';
  const L = P.filter(
    (p) =>
      (!cat || p.c === cat) &&
      p.p >= mn &&
      p.p <= mx &&
      (!q || (p.n + p.c).toLowerCase().includes(q)),
  );
  if (ord) L.sort((a, b) => (ord === 'asc' ? a.p - b.p : b.p - a.p));
  const ch = [
    [cat, ['cat'], cat],
    [
      u.get('min') || u.get('max'),
      ['min', 'max'],
      'Precio: $' + (mn || 0) + '–' + (u.get('max') ? '$' + mx : 'sin límite'),
    ],
    [u.get('stock'), ['stock'], 'En stock'],
    [q, ['q'], 'Búsqueda: ' + u.get('q')],
  ]
    .filter((x) => x[0])
    .map(([, k, t]) => {
      const w = new URLSearchParams(location.search);
      k.forEach((y) => w.delete(y));
      return `<a class="chip" href="index.html?${w}" aria-label="Quitar filtro ${t}">${t} ×</a>`;
    })
    .join('');
  $('#chips').innerHTML = ch;
  $('#ord').value = ord;
  $('#stk').checked = !!u.get('stock');
  $('#hq').value = u.get('q') || '';
  $('#cnt').textContent = L.length + (L.length === 1 ? ' producto' : ' productos');
  if (!L.length) {
    $('#res').innerHTML =
      '<div class="box"><h2>0 resultados</h2><p>Prueba con otra palabra o quita los filtros.</p><a class="btn pri" href="index.html">Ver todo el catálogo</a></div>';
    return;
  }
  $('#res').innerHTML = [
    ['Temporada', 1],
    ['Más comprados', 0],
  ]
    .map(([h, t]) => {
      const x = L.filter((p) => p.t === t);
      return x.length
        ? `<section aria-labelledby="s${t}"><h2 id="s${t}">${h}</h2><div class="grid">${x.map(card).join('')}</div></section>`
        : '';
    })
    .join('');
  $$('[name=cat]').forEach((r) => (r.checked = r.value === cat));
  $('#min').value = u.get('min') || '';
  $('#max').value = u.get('max') || '';
  $('#q').value = u.get('q') || '';
}
function detail() {
  const p = byId(new URLSearchParams(location.search).get('id')) || P[0];
  document.title = p.n + ' · Periféricos';
  let q = 1;
  const sp = {
      Teclados: [
        'USB-C, compatible con Windows, macOS y Linux.',
        '36 × 13 × 3 cm. Plástico ABS.',
        'Cable de 1,8 m. Garantía de 12 meses.',
      ],
      Ratones: [
        'Conexión USB o inalámbrica 2,4 GHz.',
        '11 × 6 × 4 cm. Plástico mate.',
        'Incluye receptor. Garantía de 12 meses.',
      ],
      Audífonos: [
        'Jack 3,5 mm y Bluetooth 5.0.',
        'Diadema ajustable. Almohadillas de espuma.',
        'Incluye cable. Garantía de 12 meses.',
      ],
    }[p.c],
    tt = ['Conexión y compatibilidad', 'Dimensiones y materiales', 'Contenido y garantía'];
  $('#main').innerHTML =
    `<h1>${p.n}</h1><nav class="crumbs" aria-label="Ruta"><a href="index.html">Catálogo</a> / <a href="index.html?cat=${p.c}">${p.c}</a> / <span aria-current="page">${p.n} · Disponible</span></nav><div class="det"><div class="im"><img src="img/${p.img}" alt="${p.n}, vista superior"></div><div><section class="box" aria-labelledby="pd"><h2 id="pd">Precio y disponibilidad</h2><div class="pr" style="color:var(--p);font-size:2.2rem">${money(p.p)} USD</div><p><strong>Antes ${money(p.o)}, ahora ${money(p.p)}, ${Math.round(100 - (p.p / p.o) * 100)} % menos</strong></p><p>En stock · Envío estándar $10 por pedido</p><div class="qty"><span id="ql">Cantidad</span> <button class="btn" id="mi" aria-label="Disminuir cantidad">−</button><output id="qv" aria-labelledby="ql">1</output><button class="btn" id="pl" aria-label="Aumentar cantidad">+</button></div><p><button class="btn pri w" id="ad">Agregar al carrito</button></p><a class="btn out w" id="by" href="envio.html?solo=${p.id}&q=1">Comprar este producto</a><p class="old">Compra solo este producto. Tu carrito no cambia.</p></section><section aria-labelledby="es"><h2 id="es">Especificaciones</h2>${tt.map((x, i) => `<details><summary>${x}</summary><p>${sp[i]}</p></details>`).join('')}</section></div></div><section class="box" aria-labelledby="rv"><div class="row"><h2 id="rv">Reseñas cortas</h2><a class="btn out" href="resena.html?id=${p.id}">Escribir reseña</a></div>${rvs(p)}<p class="old">Comparte tu experiencia con el producto en hasta 140 caracteres, sin insultos.</p></section>`;
  const set = (v) => {
    q = Math.max(1, Math.min(10, q + v));
    $('#qv').textContent = q;
    $('#by').href = `envio.html?solo=${p.id}&q=${q}`;
  };
  $('#mi').onclick = () => set(-1);
  $('#pl').onclick = () => set(1);
  $('#ad').onclick = () => add(p.id, q);
}
function envio() {
  if (!localStorage.user)
    return location.replace(
      'registro.html?next=' + encodeURIComponent('envio.html' + location.search),
    );
  $('.lead').textContent =
    'Compras como ' + localStorage.user + ' · Los campos con * son obligatorios.';
  const u = new URLSearchParams(location.search),
    solo = u.get('solo'),
    c = solo && u.get('q') ? { [solo]: +u.get('q') } : get(),
    ids = Object.keys(c);
  let s = 0;
  $('#sum').innerHTML =
    (ids.length
      ? ids
          .map((i) => {
            const p = byId(i);
            s += p.p * c[i];
            return `<p><strong>${p.n} × ${c[i]} · ${money(p.p)} c/u<br>Subtotal del producto: ${money(p.p * c[i])}</strong></p>`;
          })
          .join('')
      : '<p>No hay productos. <a href="index.html">Explorar catálogo</a></p>') +
    `<div class="row"><span>Subtotal</span><strong>${money(s)}</strong></div><div class="row"><span>Envío estándar</span><strong>${money(s ? SHIP : 0)}</strong></div><div class="row"><span>Total</span><span class="tot">${money(s ? s + SHIP : 0)}</span></div><p class="old">Impuestos incluidos.</p>`;
  $('#f').onsubmit = (e) => {
    e.preventDefault();
    let bad;
    $$('[required]', e.target).forEach((i) => {
      const m = validationMessage(i);
      i.setAttribute('aria-invalid', !!m);
      $('#e-' + i.id).textContent = m;
      if (m && !bad) bad = i;
    });
    if (bad) return bad.focus();
    if (!ids.length) return toast('Agrega productos antes de continuar.');
    sessionStorage.items = JSON.stringify(c);
    sessionStorage.solo = solo || '';
    sessionStorage.envio = JSON.stringify(Object.fromEntries(new FormData(e.target)));
    location.href = 'pago.html';
  };
}
document.addEventListener('DOMContentLoaded', () => {
  layout();
  ({
    cat: catalog,
    det: detail,
    env: envio,
    pay: pago,
    res: resena,
    reg: reg,
    conf: conf,
    seg: seg,
  })[document.body.dataset.p]?.();
});

const RV = [
  [
    'Ana · Oficina',
    5,
    'Cómodo para escribir durante el día. El tamaño encaja bien en mi escritorio.',
  ],
  [
    'Luis · Gamer',
    4,
    'Responde bien en mis partidas. Me gustaría que el cable fuera un poco más largo.',
  ],
  ['Mar · Uso casual', 3, 'Cumple para estudiar y navegar. Las teclas se sienten algo firmes.'],
];
function rvs(p) {
  let L = [...JSON.parse(localStorage['rv_' + p.id] || '[]'), ...(p.c === 'Teclados' ? RV : [])];
  if (!L.length) return '<p>Aún no hay reseñas. Sé la primera persona en opinar.</p>';
  const a = (L.reduce((s, r) => s + r[1], 0) / L.length).toFixed(1).replace('.', ',');
  return `<p><strong>${a} de 5 · ${L.length} ${L.length > 1 ? 'reseñas' : 'reseña'}</strong></p><div class="rvs">${L.map((r) => `<article><strong>${r[0]}</strong><div><span aria-hidden="true">${'★'.repeat(r[1])}${'☆'.repeat(5 - r[1])}</span> ${r[1]} de 5</div><p>${r[2]}</p></article>`).join('')}</div>`;
}
const BAD = ['porquería', 'idiota', 'basura', 'estúpido', 'estúpida'];
function resena() {
  const p = byId(new URLSearchParams(location.search).get('id')) || P[0];
  $('#pn').textContent = p.n;
  $('#vp').href = 'producto.html?id=' + p.id;
  const t = $('#tx'),
    k = $('#ct2');
  t.oninput = () => (k.textContent = t.value.length + ' / 140 caracteres');
  $('#f').onsubmit = (e) => {
    e.preventDefault();
    const v = $('[name=v]:checked'),
      m = t.value.trim(),
      bad = BAD.filter((w) => m.toLowerCase().includes(w)),
      a = $('#al');
    let msg = '';
    if (!v) msg = 'Elige una valoración de 1 a 5.';
    else if (!m) msg = 'Escribe tu comentario.';
    else if (bad.length)
      msg =
        'Lenguaje inapropiado: elimina ' +
        bad.map((w) => '«' + w + '»').join(' y ') +
        ' y vuelve a publicar.';
    a.hidden = !msg;
    a.textContent = msg;
    t.setAttribute('aria-invalid', !!bad.length);
    if (msg) return (!v ? $('[name=v]') : t).focus();
    const k2 = 'rv_' + p.id,
      L = JSON.parse(localStorage[k2] || '[]');
    L.unshift([localStorage.user || 'Cliente', +v.value, m]);
    localStorage[k2] = JSON.stringify(L);
    location.href = 'producto.html?id=' + p.id;
  };
}
function validationMessage(input) {
  if (input.validity.valueMissing) return 'Completa este campo.';
  if (input.validity.typeMismatch)
    return input.type === 'email'
      ? 'Ingresa un correo electrónico válido, por ejemplo nombre@correo.ec.'
      : 'Revisa el formato ingresado.';
  if (input.validity.patternMismatch)
    return input.dataset.msg || 'Revisa el formato ingresado.';
  if (input.validity.tooShort)
    return `Ingresa al menos ${input.minLength} caracteres.`;
  return '';
}
function reg() {
  const nx = new URLSearchParams(location.search).get('next') || 'envio.html',
    ok = /^[a-z]+\.html(\?[\w=&%.-]*)?$/.test(nx) ? nx : 'envio.html';
  const go = (form, n) => (e) => {
    e.preventDefault();
    let bad;
    $$('input[required]', form).forEach((input) => {
      const message = validationMessage(input);
      input.setAttribute('aria-invalid', !!message);
      $('#e-' + input.id).textContent = message;
      if (message && !bad) bad = input;
    });
    if (bad) return bad.focus();
    localStorage.user = n();
    location.href = ok;
  };
  $('#f1').onsubmit = go($('#f1'), () => $('#em').value.split('@')[0]);
  $('#f2').onsubmit = go($('#f2'), () => $('#nn').value.split(' ')[0]);
  if (localStorage.user) {
    $('#main').insertAdjacentHTML(
      'afterbegin',
      `<p class="box">Sesión iniciada como <strong>${localStorage.user}</strong>. <button class="btn" id="lo">Cerrar sesión</button></p>`,
    );
    $('#lo').onclick = () => {
      delete localStorage.user;
      location.reload();
    };
  }
}
const luhn = (n) =>
  [...n].reverse().reduce((a, d, i) => {
    d = +d;
    if (i % 2) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    return a + d;
  }, 0) %
    10 ===
  0;
const order = () => JSON.parse(sessionStorage.pedido || 'null');
function pago() {
  const c = JSON.parse(sessionStorage.items || '{}'),
    ids = Object.keys(c),
    e = JSON.parse(sessionStorage.envio || '{}');
  let s = 0;
  ids.forEach((i) => (s += byId(i).p * c[i]));
  const T = ids.length ? s + SHIP : 0;
  $('#sum').innerHTML =
    ids
      .map((i) => `<p><strong>${byId(i).n} × ${c[i]}</strong> · ${money(byId(i).p * c[i])}</p>`)
      .join('') +
    `<div class="row"><span>Envío estándar</span><strong>${money(ids.length ? SHIP : 0)}</strong></div><div class="row"><span>Total</span><span class="tot">${money(T)}</span></div>`;
  $('#ent').textContent = e.dir
    ? `${e.nom} · ${e.dir}, ${e.col}, ${e.ciu}, ${e.prov}, ${e.cp}`
    : 'Falta la dirección de entrega.';
  $('#pay').textContent = 'Pagar ' + money(T) + ' USD';
  $('#num').oninput = (x) =>
    (x.target.value = x.target.value
      .replace(/\D/g, '')
      .slice(0, 16)
      .replace(/(.{4})/g, '$1 ')
      .trim());
  $('#f').onsubmit = (x) => {
    x.preventDefault();
    const d = $('#num').value.replace(/\s/g, ''),
      m = $('#exp').value.match(/^(0[1-9]|1[0-2])\/(\d\d)$/),
      now = new Date(),
      V = {
        nom: $('#nom').value.trim() ? '' : 'Escribe el nombre como aparece en la tarjeta.',
        num: d.length === 16 && luhn(d) ? '' : 'Revisa el número: debe tener 16 dígitos válidos.',
        exp:
          m && new Date(2000 + +m[2], +m[1], 1) > now
            ? ''
            : 'Escribe una fecha vigente con formato MM/AA.',
        cvv: /^\d{3,4}$/.test($('#cvv').value) ? '' : 'El código tiene 3 o 4 dígitos.',
      };
    let bad;
    for (const k in V) {
      $('#' + k).setAttribute('aria-invalid', !!V[k]);
      $('#e-' + k).textContent = V[k];
      if (V[k] && !bad) bad = k;
    }
    if (bad) {
      const a = $('#al');
      a.hidden = false;
      a.textContent =
        'No se realizó ningún cargo. Tus productos siguen en el carrito. Corrige el campo marcado y vuelve a intentarlo.';
      return $('#' + bad).focus();
    }
    const cc = sessionStorage.solo ? get() : {};
    if (sessionStorage.solo) ids.forEach((i) => delete cc[i]);
    localStorage.cart = JSON.stringify(cc);
    sessionStorage.pedido = JSON.stringify({
      id: 'PC-1048',
      c,
      T,
      e,
      l4: d.slice(-4),
      f: now.toLocaleString('es-EC', { dateStyle: 'long', timeStyle: 'short' }),
    });
    location.href = 'confirmacion.html';
  };
}
function conf() {
  const o = order();
  if (!o) {
    $('#main').innerHTML =
      '<h1>No hay pedido reciente</h1><a class="btn pri" href="index.html">Explorar catálogo</a>';
    return;
  }
  $('#oid').textContent = o.id;
  $('#ofe').textContent = 'Creado el ' + o.f;
  $('#ot').textContent = money(o.T) + ' USD';
  $('#opg').textContent = 'Tarjeta terminada en ' + o.l4;
  $('#oen').textContent = `${o.e.nom} · ${o.e.dir}, ${o.e.col}, ${o.e.ciu}, ${o.e.prov}, ${o.e.cp}`;
  $('#oit').innerHTML = Object.keys(o.c)
    .map((i) => `<li>${byId(i).n} × ${o.c[i]} · ${money(byId(i).p * o.c[i])}</li>`)
    .join('');
}
function seg() {
  const o = order() || { id: 'PC-1048' };
  $('#sid').textContent = 'Pedido ' + o.id + ' · Guía EC84720136';
  const E = [
    ['Pedido recibido', 'Completado'],
    ['Preparando el envío', 'Actual'],
    ['En camino con el courier', 'Pendiente'],
    ['Entregado', 'Pendiente'],
  ];
  $('#tl').innerHTML = E.map(
    ([a, b]) =>
      `<li class="${b === 'Actual' ? 'cur' : ''}" ${b === 'Actual' ? 'aria-current="step"' : ''}><strong>${a}</strong> — ${b === 'Completado' ? '✓ ' : ''}${b}</li>`,
  ).join('');
}
