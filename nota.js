/* nota média nos cards de artigo */
(function(){
var P="gibagg-d8ab9",K="AIzaSyDz6T4Ysmj_ao1vxhuxmrBsXi-gBgIWklQ";
var url="https://firestore.googleapis.com/v1/projects/"+P+"/databases/(default)/documents/ratings?pageSize=300&key="+K;
function fmt(n){return n.toFixed(1).replace(".",",");}
function aplica(m){
  [].forEach.call(document.querySelectorAll('a.card[href^="artigo-"]'),function(a){
    if(a.querySelector(".nota"))return;
    var s=a.getAttribute("href").replace(/^artigo-/,"").replace(/\.html.*$/,"");
    var r=m[s];if(!r||!r.c)return;
    var tag=a.querySelector(".tag");if(!tag)return;
    var e=document.createElement("span");e.className="nota";
    e.title="Nota média dos leitores: "+fmt(r.s/r.c)+" de 5, com "+r.c+(r.c===1?" avaliação":" avaliações");
    e.innerHTML='<b>★</b> '+fmt(r.s/r.c)+' <small>('+r.c+')</small>';
    tag.appendChild(e);
  });
}
function le(d){var m={};(d.documents||[]).forEach(function(x){var f=x.fields;if(f&&f.count){m[x.name.split("/").pop()]={s:+(f.sum&&f.sum.integerValue||0),c:+f.count.integerValue};}});return m;}
var cache=null;try{cache=JSON.parse(sessionStorage.getItem("notas"));}catch(e){}
if(cache&&Date.now()-cache.t<300000){aplica(cache.m);return;}
fetch(url).then(function(r){if(!r.ok)throw 0;return r.json();}).then(function(d){var m=le(d);try{sessionStorage.setItem("notas",JSON.stringify({t:Date.now(),m:m}));}catch(e){}aplica(m);}).catch(function(){});
})();
