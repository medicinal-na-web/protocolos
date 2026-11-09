// Gera o Portal do Prescritor (app estático) em saida/index.html.
// Acesso por login (código de 8 dígitos por e-mail ou chave profissional), reaproveitando
// a Edge Function login-chave do projeto nexusPrescricao. Após o login, busca os protocolos
// no banco (RLS: só autenticado lê) e exibe cada guia com o MESMO visual do PDF.
//
// Uso: node scripts/portal.mjs   (ou npm run portal)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dirSaida = path.join(raiz, "saida");

// ---- Configuração do backend (projeto nexusPrescricao) ----
const NEXUS_URL = "https://uahbcelcjmjcljogfilh.supabase.co";
const ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhaGJjZWxjam1qY2xqb2dmaWxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ1ODUzNTcsImV4cCI6MjEwMDE2MTM1N30.NoBkIgAjlziShwm0NQopOrymahzqQSWXXSldQahfNJs";

const APP = String.raw`
<!doctype html>
<html lang="pt-BR"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex, nofollow">
<title>Portal do Prescritor — Medicinal</title>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700&family=Figtree:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap">
<style>
  :root{
    --marca:#2A62AC; --marca-esc:#1c4a85;
    --bg:#eef2f7; --sup:#fff; --sup-2:#f6f8fb;
    --tinta:#15233a; --tinta-2:#51607a; --linha:#dde4ee;
    --ok:#1f9d62; --erro:#c23b3b; --acc:#2A62AC; --acc2:#5b8fd6;
    --sombra:0 1px 2px rgba(20,35,58,.06),0 10px 28px rgba(20,35,58,.08);
    --disp:"Sora",system-ui,sans-serif; --corpo:"Figtree",system-ui,sans-serif; --mono:"JetBrains Mono",ui-monospace,monospace;
  }
  @media (prefers-color-scheme:dark){:root:not([data-theme="light"]){
    --bg:#0d1420; --sup:#151e2d; --sup-2:#111a27; --tinta:#e9eef6; --tinta-2:#9fb0c7; --linha:#26324a;
    --sombra:0 1px 2px rgba(0,0,0,.3),0 12px 30px rgba(0,0,0,.4); color-scheme:dark;
  }}
  :root[data-theme="dark"]{
    --bg:#0d1420; --sup:#151e2d; --sup-2:#111a27; --tinta:#e9eef6; --tinta-2:#9fb0c7; --linha:#26324a;
    --sombra:0 1px 2px rgba(0,0,0,.3),0 12px 30px rgba(0,0,0,.4); color-scheme:dark;
  }
  *{box-sizing:border-box}
  html,body{margin:0}
  body{background:var(--bg);color:var(--tinta);font-family:var(--corpo);line-height:1.5;-webkit-font-smoothing:antialiased}
  h1,h2,h3{font-family:var(--disp);margin:0;letter-spacing:-.01em;text-wrap:balance}
  button{font:inherit;cursor:pointer}
  .env{padding-left:max(18px,env(safe-area-inset-left,0px));padding-right:max(18px,env(safe-area-inset-right,0px))}
  [hidden]{display:none!important}

  /* ---- Login ---- */
  .login{min-height:100svh;display:grid;place-items:center;padding:28px 0}
  .login-card{width:min(420px,92vw);background:var(--sup);border:1px solid var(--linha);border-radius:20px;box-shadow:var(--sombra);padding:30px 26px}
  .brand{display:flex;align-items:center;gap:12px;margin-bottom:22px}
  .brand .ico{width:40px;height:40px;border-radius:11px;background:linear-gradient(135deg,var(--marca),var(--marca-esc));display:grid;place-items:center;flex:none}
  .brand .ico svg{width:23px;height:23px;fill:#fff}
  .brand b{font-family:var(--disp);font-weight:700;font-size:17px;display:block;line-height:1.1}
  .brand span{font-size:11px;color:var(--tinta-2);letter-spacing:.14em;text-transform:uppercase}
  .login h1{font-size:21px;font-weight:600;margin-bottom:6px}
  .login p.sub{color:var(--tinta-2);font-size:14px;margin:0 0 20px}
  label.campo{display:block;font-size:12.5px;font-weight:600;color:var(--tinta-2);margin:0 0 6px}
  .in{width:100%;background:var(--sup-2);border:1px solid var(--linha);border-radius:12px;padding:13px 15px;color:var(--tinta);font:inherit;font-size:15px;outline:none}
  .in:focus{border-color:var(--acc)}
  #codigo{font-family:var(--mono);letter-spacing:.3em;text-align:center;font-size:20px}
  .btn{width:100%;margin-top:16px;border:0;border-radius:12px;padding:13px;color:#fff;font-family:var(--disp);font-weight:600;font-size:15px;background:linear-gradient(135deg,var(--acc),var(--acc2));transition:filter .15s}
  .btn:hover{filter:brightness(1.07)} .btn:disabled{opacity:.6;cursor:default;filter:none}
  .link{background:none;border:0;color:var(--acc);font-size:13.5px;margin-top:14px;padding:0}
  .aviso{margin-top:14px;font-size:13px;padding:10px 12px;border-radius:10px;display:none}
  .aviso.erro{display:block;background:color-mix(in srgb,var(--erro) 12%,transparent);color:var(--erro)}
  .aviso.ok{display:block;background:color-mix(in srgb,var(--ok) 14%,transparent);color:var(--ok)}
  .dica{font-size:12.5px;color:var(--tinta-2);margin-top:10px}

  /* ---- App ---- */
  .topo{position:sticky;top:env(safe-area-inset-top,0px);z-index:20;background:color-mix(in srgb,var(--sup) 90%,transparent);backdrop-filter:blur(10px);border-bottom:1px solid var(--linha)}
  body::before{content:"";position:fixed;inset:0 0 auto;height:env(safe-area-inset-top,0px);z-index:21;background:var(--sup)}
  .topo-in{max-width:1120px;margin:0 auto;padding-block:12px;display:flex;align-items:center;gap:14px}
  .topo .ico{width:32px;height:32px;border-radius:9px;background:linear-gradient(135deg,var(--marca),var(--marca-esc));display:grid;place-items:center;flex:none}
  .topo .ico svg{width:19px;height:19px;fill:#fff}
  .topo b{font-family:var(--disp);font-size:15px;line-height:1.05;display:block}
  .topo small{font-size:10.5px;color:var(--tinta-2);letter-spacing:.12em;text-transform:uppercase}
  .quem{margin-left:auto;display:flex;align-items:center;gap:12px;font-size:13px;color:var(--tinta-2)}
  .sair{border:1px solid var(--linha);background:var(--sup-2);color:var(--tinta);border-radius:999px;padding:7px 14px;font-size:13px;font-weight:600}
  main{max-width:1120px;margin:0 auto;padding-block:26px 64px}
  .intro h1{font-size:clamp(23px,4vw,32px);font-weight:700}
  .intro p{color:var(--tinta-2);max-width:60ch;margin:8px 0 0;font-size:15px}

  .grade{margin-top:26px;display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:18px}
  .pcard{text-align:left;background:var(--sup);border:1px solid var(--linha);border-radius:16px;overflow:hidden;box-shadow:var(--sombra);padding:0;display:flex;flex-direction:column;transition:transform .1s,box-shadow .15s}
  .pcard:hover{transform:translateY(-2px);box-shadow:0 2px 6px rgba(20,35,58,.1),0 16px 36px rgba(20,35,58,.12)}
  .pcard .capa{height:132px;background:linear-gradient(135deg,var(--acc),var(--acc2));background-size:cover;background-position:center}
  .pcard .corpo{padding:15px 16px 17px}
  .pcard .tag{font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--acc)}
  .pcard h3{font-size:17px;font-weight:600;margin:4px 0 0}
  .pcard .meta{color:var(--tinta-2);font-size:12.5px;margin-top:8px;font-variant-numeric:tabular-nums}
  .carregando{color:var(--tinta-2);padding:50px 0;text-align:center}

  /* ---- Visor do guia ---- */
  .visor{position:fixed;inset:0;z-index:40;background:var(--bg);display:flex;flex-direction:column}
  .visor-topo{display:flex;align-items:center;gap:12px;padding:10px max(14px,env(safe-area-inset-left,0px));padding-top:max(10px,env(safe-area-inset-top,0px));border-bottom:1px solid var(--linha);background:var(--sup)}
  .voltar{border:1px solid var(--linha);background:var(--sup-2);color:var(--tinta);border-radius:999px;padding:8px 15px;font-size:13.5px;font-weight:600;display:inline-flex;gap:7px;align-items:center}
  .visor-topo b{font-family:var(--disp);font-size:15px}
  .visor-topo .acoes{margin-left:auto;display:flex;gap:8px}
  .bcopiar{border:1px solid var(--linha);background:var(--sup-2);color:var(--tinta);border-radius:999px;padding:8px 14px;font-size:13px;font-weight:600}
  .palco{flex:1;overflow:auto;-webkit-overflow-scrolling:touch;display:flex;justify-content:center;padding:18px 10px 40px}
  .palco iframe{border:0;background:#fff;box-shadow:0 10px 40px rgba(20,35,58,.18);display:block}
  @media (prefers-reduced-motion:reduce){*{transition:none!important}}
</style>
</head><body>

<!-- ===================== LOGIN ===================== -->
<section class="login" id="tela-login">
  <div class="login-card">
    <div class="brand">
      <span class="ico"><svg viewBox="0 0 24 24"><path d="M3 14c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 3 2"/><path d="M3 9c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 3 2" opacity=".55"/><path d="M3 19c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 3 2" opacity=".3"/></svg></span>
      <span><b>Medicinal</b><span>Portal do Prescritor</span></span>
    </div>

    <div id="passo-id">
      <h1>Acesse o portal</h1>
      <p class="sub">Entre com sua chave profissional ou o e-mail cadastrado. Enviaremos um código de acesso.</p>
      <div id="modo-chave">
        <label class="campo" for="chave">Chave profissional</label>
        <input class="in" id="chave" inputmode="text" autocomplete="off" placeholder="ex.: 1-PR-20696">
      </div>
      <div id="modo-email" hidden>
        <label class="campo" for="email">E-mail</label>
        <input class="in" id="email" type="email" autocomplete="email" placeholder="voce@exemplo.com">
      </div>
      <button class="btn" id="btn-enviar">Enviar código</button>
      <button class="link" id="troca-modo">Não tenho chave — entrar com e-mail</button>
      <div class="aviso" id="aviso-id"></div>
    </div>

    <div id="passo-cod" hidden>
      <h1>Digite o código</h1>
      <p class="sub">Enviamos um código de 8 dígitos para <span id="dica-email">seu e-mail</span>.</p>
      <label class="campo" for="codigo">Código de acesso</label>
      <input class="in" id="codigo" inputmode="numeric" autocomplete="one-time-code" maxlength="8" placeholder="________">
      <button class="btn" id="btn-verificar">Entrar</button>
      <button class="link" id="reenviar">Reenviar código</button>
      <button class="link" id="voltar-id">Voltar</button>
      <div class="aviso" id="aviso-cod"></div>
    </div>
  </div>
</section>

<!-- ===================== APP ===================== -->
<div id="app" hidden>
  <header class="topo"><div class="topo-in env">
    <span class="ico"><svg viewBox="0 0 24 24"><path d="M3 14c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 3 2"/><path d="M3 9c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 3 2" opacity=".55"/></svg></span>
    <span><b>Portal do Prescritor</b><small>Medicinal</small></span>
    <div class="quem"><span id="quem-nome"></span><button class="sair" id="sair">Sair</button></div>
  </div></header>

  <main class="env">
    <div class="intro">
      <h1>Protocolos da Medicinal</h1>
      <p>Toque em um protocolo para ver o guia completo e copiar as fórmulas prontas para a prescrição.</p>
    </div>
    <div id="grade" class="grade" aria-live="polite"></div>
    <div class="carregando" id="carregando">Carregando protocolos…</div>
  </main>
</div>

<!-- ===================== VISOR DO GUIA ===================== -->
<div class="visor" id="visor" hidden>
  <div class="visor-topo">
    <button class="voltar" id="guia-voltar"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M15 5l-7 7 7 7"/></svg> Voltar</button>
    <b id="guia-titulo"></b>
    <div class="acoes"><button class="bcopiar" id="guia-copiar">Copiar fórmulas</button></div>
  </div>
  <div class="palco" id="palco"></div>
</div>

<script>
(function(){
  "use strict";
  var NEXUS_URL=${JSON.stringify(NEXUS_URL)}, ANON=${JSON.stringify(ANON_KEY)};
  var FN=NEXUS_URL+"/functions/v1/login-chave", REST=NEXUS_URL+"/rest/v1/portal_protocolo";
  var CHAVE_SESSAO="pp_sessao_v1";
  var sessao=null, protocolos=[], modoEmail=false, idEnvio={};

  var $=function(id){return document.getElementById(id)};
  function lerSessao(){try{return JSON.parse(localStorage.getItem(CHAVE_SESSAO)||"null")}catch(e){return null}}
  function gravarSessao(s){try{localStorage.setItem(CHAVE_SESSAO,JSON.stringify(s))}catch(e){}}
  function limparSessao(){try{localStorage.removeItem(CHAVE_SESSAO)}catch(e){}}

  // ---------- Login ----------
  function aviso(el,msg,tipo){el.className="aviso "+(tipo||"erro");el.textContent=msg}
  function limpaAviso(el){el.className="aviso";el.textContent=""}
  var MOTIVOS={nao_liberado:"Acesso não liberado para esta identidade. Procure a Medicinal.",sem_email:"Não há e-mail cadastrado para enviar o código. Procure a Medicinal.",formato:"Verifique a chave ou o e-mail informado.",envio:"Não foi possível enviar o código agora. Tente novamente em instantes.",interno:"Falha no servidor. Tente novamente.",codigo_invalido:"Código incorreto ou expirado.",codigo_curto:"Digite os 8 dígitos do código."};

  async function chamarFn(body){
    var r=await fetch(FN,{method:"POST",headers:{apikey:ANON,Authorization:"Bearer "+ANON,"Content-Type":"application/json"},body:JSON.stringify(body)});
    return r.json();
  }
  function idAtual(){return modoEmail?{email:($("email").value||"").trim()}:{chave:($("chave").value||"").trim().toUpperCase()}}

  $("troca-modo").onclick=function(){
    modoEmail=!modoEmail;
    $("modo-chave").hidden=modoEmail; $("modo-email").hidden=!modoEmail;
    $("troca-modo").textContent=modoEmail?"Tenho chave profissional":"Não tenho chave — entrar com e-mail";
    limpaAviso($("aviso-id"));
  };

  $("btn-enviar").onclick=async function(){
    var id=idAtual();
    if(!id.chave && !id.email){return aviso($("aviso-id"),"Informe a chave ou o e-mail.")}
    $("btn-enviar").disabled=true; aviso($("aviso-id"),"Enviando código…","ok");
    try{
      var d=await chamarFn(Object.assign({acao:"enviar"},id));
      if(!d.ok){limpaAviso($("aviso-id"));return aviso($("aviso-id"),MOTIVOS[d.motivo]||"Não foi possível enviar.")}
      idEnvio=id;
      $("dica-email").textContent=d.dica||"seu e-mail";
      $("passo-id").hidden=true; $("passo-cod").hidden=false; limpaAviso($("aviso-id"));
      setTimeout(function(){$("codigo").focus()},50);
    }catch(e){aviso($("aviso-id"),"Sem conexão com o servidor.")}
    $("btn-enviar").disabled=false;
  };

  $("reenviar").onclick=async function(){
    aviso($("aviso-cod"),"Reenviando…","ok");
    try{var d=await chamarFn(Object.assign({acao:"enviar"},idEnvio));
      aviso($("aviso-cod"),d.ok?"Código reenviado.":"Não foi possível reenviar.",d.ok?"ok":"erro");
    }catch(e){aviso($("aviso-cod"),"Sem conexão.")}
  };
  $("voltar-id").onclick=function(){$("passo-cod").hidden=true;$("passo-id").hidden=false;limpaAviso($("aviso-cod"))};

  $("btn-verificar").onclick=async function(){
    var codigo=($("codigo").value||"").replace(/\D/g,"");
    if(codigo.length<8){return aviso($("aviso-cod"),MOTIVOS.codigo_curto)}
    $("btn-verificar").disabled=true; aviso($("aviso-cod"),"Verificando…","ok");
    try{
      var d=await chamarFn(Object.assign({acao:"verificar",codigo:codigo},idEnvio));
      if(!d.ok||!d.access_token){limpaAviso($("aviso-cod"));$("btn-verificar").disabled=false;return aviso($("aviso-cod"),MOTIVOS[d.motivo]||"Código inválido.")}
      sessao={access_token:d.access_token,refresh_token:d.refresh_token,expira:Date.now()+(d.expires_in||3600)*1000,nome:d.nome||null,crm:d.crm||null,admin:!!d.admin};
      gravarSessao(sessao); entrarNoApp();
    }catch(e){aviso($("aviso-cod"),"Sem conexão com o servidor.");$("btn-verificar").disabled=false}
  };
  $("codigo").addEventListener("keydown",function(e){if(e.key==="Enter")$("btn-verificar").click()});
  $("chave").addEventListener("keydown",function(e){if(e.key==="Enter")$("btn-enviar").click()});
  $("email").addEventListener("keydown",function(e){if(e.key==="Enter")$("btn-enviar").click()});

  // ---------- Sessão / REST ----------
  async function refrescar(){
    if(!sessao||!sessao.refresh_token)return false;
    try{
      var r=await fetch(NEXUS_URL+"/auth/v1/token?grant_type=refresh_token",{method:"POST",headers:{apikey:ANON,"Content-Type":"application/json"},body:JSON.stringify({refresh_token:sessao.refresh_token})});
      if(!r.ok)return false;
      var d=await r.json();
      sessao.access_token=d.access_token; sessao.refresh_token=d.refresh_token; sessao.expira=Date.now()+(d.expires_in||3600)*1000;
      gravarSessao(sessao); return true;
    }catch(e){return false}
  }
  async function api(qs){
    var url=REST+qs;
    var headers={apikey:ANON,Authorization:"Bearer "+sessao.access_token};
    var r=await fetch(url,{headers:headers});
    if(r.status===401){ if(await refrescar()){ headers.Authorization="Bearer "+sessao.access_token; r=await fetch(url,{headers:headers}); } }
    if(r.status===401){ sair(); return null; }
    return r.ok?r.json():null;
  }

  // ---------- App ----------
  function entrarNoApp(){
    $("tela-login").hidden=true; $("app").hidden=false;
    var q=sessao.nome?("Dr(a). "+sessao.nome):(sessao.crm||"");
    $("quem-nome").textContent=q;
    carregarProtocolos();
  }
  async function carregarProtocolos(){
    var dados=await api("?select=slug,titulo,cor,ordem,capa,formulas&ativo=eq.true&order=ordem");
    if(!dados){$("carregando").textContent="Não foi possível carregar os protocolos.";return}
    protocolos=dados; $("carregando").hidden=true;
    var g=$("grade"); g.innerHTML="";
    dados.forEach(function(p){
      var cor=p.cor||{}, capa=p.capa?("background-image:url('"+p.capa+"')"):("background:linear-gradient(135deg,"+(cor.escura||"#2A62AC")+","+(cor.clara||"#5b8fd6")+")");
      var n=(p.formulas||[]).length;
      var b=document.createElement("button");
      b.className="pcard"; b.style.setProperty("--acc",cor.escura||"#2A62AC"); b.style.setProperty("--acc2",cor.clara||"#5b8fd6");
      b.innerHTML='<div class="capa" style="'+capa+'"></div><div class="corpo"><span class="tag">Protocolo</span><h3></h3><div class="meta">'+n+(n===1?" fórmula":" fórmulas")+'</div></div>';
      b.querySelector("h3").textContent=p.titulo;
      b.onclick=function(){abrirGuia(p)};
      g.appendChild(b);
    });
  }

  // ---------- Visor do guia ----------
  async function gunzipB64(b64){
    var bin=Uint8Array.from(atob(b64),function(c){return c.charCodeAt(0)});
    if(typeof DecompressionStream==="undefined"){throw new Error("sem-ds")}
    var ds=new DecompressionStream("gzip");
    var stream=new Blob([bin]).stream().pipeThrough(ds);
    return await new Response(stream).text();
  }
  function ajustarIframe(ifr){
    try{
      var doc=ifr.contentDocument; if(!doc)return;
      var larguraA4=794; // 210mm @ 96dpi
      var disp=Math.min($("palco").clientWidth-20,larguraA4);
      var escala=disp/larguraA4;
      var alturaTotal=doc.body.scrollHeight;
      ifr.style.width=larguraA4+"px";
      ifr.style.height=alturaTotal+"px";
      ifr.style.transform="scale("+escala+")";
      ifr.style.transformOrigin="top center";
      ifr.style.marginBottom=(alturaTotal*escala-alturaTotal)+"px";
    }catch(e){}
  }
  var protoAtual=null;
  async function abrirGuia(p){
    protoAtual=p;
    $("guia-titulo").textContent=p.titulo;
    $("visor").hidden=false; $("palco").innerHTML='<div class="carregando">Abrindo guia…</div>';
    history.pushState({guia:p.slug},"","#"+p.slug);
    var linha=await api("?select=guia_html&slug=eq."+encodeURIComponent(p.slug)+"&limit=1");
    if(!linha||!linha[0]||!linha[0].guia_html){$("palco").innerHTML='<div class="carregando">Guia indisponível.</div>';return}
    var html;
    try{ html=await gunzipB64(linha[0].guia_html); }
    catch(e){ $("palco").innerHTML='<div class="carregando">Seu navegador não suporta abrir este guia. Atualize o navegador.</div>'; return; }
    var ifr=document.createElement("iframe");
    ifr.setAttribute("title","Guia "+p.titulo);
    ifr.onload=function(){ setTimeout(function(){ajustarIframe(ifr)},250) };
    $("palco").innerHTML=""; $("palco").appendChild(ifr);
    ifr.srcdoc=html;
    window.addEventListener("resize",function(){ajustarIframe(ifr)});
  }
  function fecharGuia(){$("visor").hidden=true;$("palco").innerHTML="";protoAtual=null;if(location.hash)history.pushState("","",location.pathname)}
  $("guia-voltar").onclick=fecharGuia;
  window.addEventListener("popstate",function(){ if($("visor").hidden===false) fecharGuia(); });

  // Copiar todas as fórmulas do protocolo (texto pronto para prescrição)
  $("guia-copiar").onclick=function(){
    if(!protoAtual)return;
    var linhas=[protoAtual.titulo,""];
    (protoAtual.formulas||[]).forEach(function(f){
      linhas.push(f.nome+(f.via?" — "+f.via:""));
      (f.ativos||[]).forEach(function(a){linhas.push(a.nome+(a.dose?"  "+a.dose:""))});
      if(f.modo)linhas.push("Posologia: "+f.modo);
      linhas.push("");
    });
    linhas.push("(Medicinal Farmácia e Manipulação)");
    var txt=linhas.join("\n"), btn=$("guia-copiar");
    function ok(){btn.textContent="Copiado!";setTimeout(function(){btn.textContent="Copiar fórmulas"},1600)}
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(txt).then(ok).catch(sel)}else sel();
    function sel(){var ta=document.createElement("textarea");ta.value=txt;ta.style.position="fixed";ta.style.opacity="0";document.body.appendChild(ta);ta.select();try{document.execCommand("copy");ok()}catch(_){}document.body.removeChild(ta)}
  };

  // ---------- Sair ----------
  function sair(){limparSessao();sessao=null;location.hash="";$("app").hidden=true;$("visor").hidden=true;$("tela-login").hidden=false;$("passo-cod").hidden=true;$("passo-id").hidden=false}
  $("sair").onclick=sair;

  // ---------- Início ----------
  (async function(){
    sessao=lerSessao();
    if(sessao&&sessao.access_token){
      if(sessao.expira&&sessao.expira<Date.now()+60000){ if(!(await refrescar())){ sair(); return } }
      entrarNoApp();
    }
  })();
})();
</script>
</body></html>`;

fs.mkdirSync(dirSaida, { recursive: true });
fs.writeFileSync(path.join(dirSaida, "index.html"), APP);

// robots.txt — portal restrito à classe prescritora
fs.writeFileSync(
  path.join(dirSaida, "robots.txt"),
  "# Portal do Prescritor — Medicinal (acesso restrito à classe prescritora)\nUser-agent: *\nDisallow: /\n",
);

console.log("✓ portal: saida/index.html (app com login + guia do banco) e saida/robots.txt");
