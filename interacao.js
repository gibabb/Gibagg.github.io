/* Avaliação por estrelas (Firebase/Firestore) e comentários (Giscus). Preencha a CONFIG abaixo.
   Enquanto um campo estiver vazio, o bloco correspondente não aparece no site. */
(function () {
  var CONFIG = {
    giscus: { repo: "gibabb/Gibagg.github.io", repoId: "", category: "Comentários", categoryId: "" },
    firebase: { projectId: "", apiKey: "" }
  };
  var box = document.getElementById("interacao");
  if (!box) return;
  var slug = box.getAttribute("data-slug");
  var g = CONFIG.giscus, f = CONFIG.firebase;
  var hasC = g.repoId && g.categoryId, hasR = f.projectId && f.apiKey;
  if (!hasC && !hasR) return;
  box.hidden = false;
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  /* ---- estrelas ---- */
  if (hasR) {
    var rate = box.querySelector(".rate"); rate.hidden = false;
    var starsEl = rate.querySelector(".stars"), avgEl = rate.querySelector(".avg"), msg = rate.querySelector(".thanks");
    var base = "https://firestore.googleapis.com/v1/projects/" + f.projectId + "/databases/(default)/documents";
    var docName = "projects/" + f.projectId + "/databases/(default)/documents/ratings/" + slug;
    var mine = parseInt(store("nota:" + slug), 10) || 0;
    function paint(n) { [].forEach.call(starsEl.children, function (b, i) { b.classList.toggle("on", i < n); b.setAttribute("aria-checked", String(mine ? i + 1 === mine : false)); }); }
    function showAvg() {
      fetch(base + "/ratings/" + slug + "?key=" + f.apiKey).then(function (r) { return r.ok ? r.json() : null; }).then(function (d) {
        if (!d || !d.fields) return;
        var s = +d.fields.sum.integerValue, c = +d.fields.count.integerValue;
        if (c > 0) avgEl.textContent = "Média " + (s / c).toFixed(1).replace(".", ",") + " · " + c + (c === 1 ? " avaliação" : " avaliações");
      }).catch(function () {});
    }
    function lock() { starsEl.classList.add("done"); [].forEach.call(starsEl.children, function (b) { b.disabled = true; }); msg.textContent = "Obrigado pela sua nota."; }
    for (var i = 1; i <= 5; i++) (function (n) {
      var b = document.createElement("button"); b.type = "button"; b.textContent = "★"; b.setAttribute("role", "radio");
      b.setAttribute("aria-label", n + (n === 1 ? " estrela" : " estrelas"));
      b.onmouseenter = function () { if (!mine) paint(n); }; b.onfocus = b.onmouseenter;
      b.onmouseleave = function () { if (!mine) paint(0); };
      b.onclick = function () {
        if (mine) return; mine = n; paint(n); lock(); store("nota:" + slug, String(n));
        fetch(base + ":commit?key=" + f.apiKey, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ writes: [{
          update: { name: docName, fields: {} }, updateMask: { fieldPaths: [] },
          updateTransforms: [{ fieldPath: "sum", increment: { integerValue: String(n) } }, { fieldPath: "count", increment: { integerValue: "1" } }] }] }) })
          .then(showAvg).catch(function () {});
      };
      starsEl.appendChild(b);
    })(i);
    starsEl.setAttribute("role", "radiogroup");
    if (mine) { paint(mine); lock(); }
    showAvg();
  }

  /* ---- comentários ---- */
  if (hasC) {
    var cm = box.querySelector(".comments"); cm.hidden = false;
    var s = document.createElement("script"); s.src = "https://giscus.app/client.js"; s.async = true; s.crossOrigin = "anonymous";
    var at = { "data-repo": g.repo, "data-repo-id": g.repoId, "data-category": g.category, "data-category-id": g.categoryId,
      "data-mapping": "pathname", "data-strict": "0", "data-reactions-enabled": "1", "data-emit-metadata": "0",
      "data-input-position": "top", "data-theme": "preferred_color_scheme", "data-lang": "pt", "data-loading": "lazy" };
    for (var k in at) s.setAttribute(k, at[k]);
    cm.appendChild(s);
  }
})();
