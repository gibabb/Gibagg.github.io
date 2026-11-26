/* Busca de artigos: campo no topo, índice em busca-index.json (sem servidor). */
(function () {
  if (window.__busca) return; window.__busca = 1;
  var wrap = document.querySelector('.site-header .wrap'); if (!wrap) return;
  var nav = wrap.querySelector('.nav');
  var form = document.createElement('form');
  form.className = 'busca'; form.setAttribute('role', 'search');
  form.innerHTML = '<label class="sr" for="busca-q">Buscar artigos</label>' +
    '<input id="busca-q" type="search" placeholder="Buscar artigos" autocomplete="off" aria-controls="busca-res" aria-expanded="false">' +
    '<div id="busca-res" class="busca-res" role="listbox" hidden></div>';
  wrap.insertBefore(form, nav);
  var input = form.querySelector('input'), box = form.querySelector('.busca-res');
  var data = null, loading = false, cur = -1, queue = [];
  function norm(s) { return (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
  function esc(s) { return (s || '').replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function load(cb) {
    if (data) return cb();
    queue.push(cb); if (loading) return; loading = true;
    fetch('busca-index.json').then(function (r) { return r.json(); }).then(function (j) {
      data = j.map(function (a) { return { f: a[0], t: a[1], d: a[2], g: a[3], h: a[4], s: a[5], nt: norm(a[1]), nd: norm(a[2]), ng: norm(a[3]), nh: norm(a[4]) }; });
      var q = queue; queue = []; q.forEach(function (f) { f(); });
    }).catch(function () { loading = false; queue = []; });
  }
  function search(q) {
    var terms = norm(q).split(/\s+/).filter(function (x) { return x.length > 1; });
    if (!terms.length) return [];
    var out = [];
    data.forEach(function (a) {
      var sc = 0;
      for (var i = 0; i < terms.length; i++) {
        var t = terms[i], s = 0;
        if (a.nt.indexOf(t) > -1) s += 6;
        if (a.ng.indexOf(t) > -1) s += 4;
        if (a.nd.indexOf(t) > -1) s += 3;
        if (a.nh.indexOf(t) > -1) s += 2;
        if (!s) return;
        sc += s;
      }
      out.push([sc, a]);
    });
    out.sort(function (x, y) { return y[0] - x[0]; });
    return out.map(function (x) { return x[1]; });
  }
  function close() { box.hidden = true; input.setAttribute('aria-expanded', 'false'); cur = -1; }
  function render() {
    var q = input.value.trim();
    if (q.length < 2) return close();
    load(function () {
      var r = search(q);
      var html = '';
      if (!r.length) html = '<p class="busca-vazio">Nenhum artigo encontrado para “' + esc(q) + '”. Tente outra palavra.</p>';
      else {
        html = '<p class="busca-n">' + r.length + (r.length === 1 ? ' artigo' : ' artigos') + '</p>';
        r.slice(0, 15).forEach(function (a, i) {
          html += '<a role="option" href="' + a.f + '" data-i="' + i + '"><b>' + esc(a.t) + '</b><small>' + esc(a.s) + '</small></a>';
        });
        if (r.length > 15) html += '<p class="busca-n">Mostrando 15. Acrescente outra palavra para refinar.</p>';
      }
      box.innerHTML = html; box.hidden = false; input.setAttribute('aria-expanded', 'true'); cur = -1;
    });
  }
  function move(d) {
    var it = box.querySelectorAll('a'); if (!it.length) return;
    if (cur > -1) it[cur].classList.remove('on');
    cur = (cur + d + it.length) % it.length;
    it[cur].classList.add('on'); it[cur].scrollIntoView({ block: 'nearest' });
  }
  input.addEventListener('input', render);
  input.addEventListener('focus', function () { if (input.value.trim().length > 1) render(); else load(function () {}); });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
    else if (e.key === 'Escape') { close(); input.blur(); }
    else if (e.key === 'Enter') { var it = box.querySelectorAll('a'); var a = cur > -1 ? it[cur] : it[0]; if (a) { e.preventDefault(); location.href = a.getAttribute('href'); } else e.preventDefault(); }
  });
  form.addEventListener('submit', function (e) { e.preventDefault(); });
  document.addEventListener('click', function (e) { if (!form.contains(e.target)) close(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === '/' && !/^(INPUT|TEXTAREA|SELECT)$/.test((document.activeElement || {}).tagName || '')) { e.preventDefault(); input.focus(); }
  });
})();
