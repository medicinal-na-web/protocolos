// Gera o Portal do Prescritor (app estático) em saida/index.html.
// Acesso por login (código de 8 dígitos por e-mail ou chave profissional), reaproveitando
// a Edge Function login-chave do projeto nexusPrescricao. Após o login, busca os protocolos
// no banco (RLS: só autenticado lê) e exibe cada guia com o MESMO visual do PDF.
//
// Uso: node scripts/portal.mjs   (ou npm run portal)

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dirSaida = path.join(raiz, "saida");

// Logo e imagens vêm da Edge Function portal-app (/img/...), servidas do repositório.
// Assim o site tem só o carregador e nada precisa ser subido manualmente.
const FN = "https://uahbcelcjmjcljogfilh.supabase.co/functions/v1/portal-app";
const LOGO = FN + "/img/_marca/logo-azul.webp";

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
  .brand{display:flex;align-items:center;gap:13px;margin-bottom:24px}
  .brand .logo-img{height:42px;width:auto;display:block}
  .brand .brand-sub{font-size:10.5px;color:var(--tinta-2);letter-spacing:.14em;text-transform:uppercase;line-height:1.25;border-left:1px solid var(--linha);padding-left:13px;max-width:92px}
  @media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .logo-img{filter:brightness(0) invert(1)}}
  :root[data-theme="dark"] .logo-img{filter:brightness(0) invert(1)}
  .login h1{font-size:21px;font-weight:600;margin-bottom:6px}
  .login p.sub{color:var(--tinta-2);font-size:14px;margin:0 0 20px}
  label.campo{display:block;font-size:12.5px;font-weight:600;color:var(--tinta-2);margin:0 0 6px}
  .in{width:100%;background:var(--sup-2);border:1px solid var(--linha);border-radius:12px;padding:13px 15px;color:var(--tinta);font:inherit;font-size:15px;outline:none}
  .in:focus{border-color:var(--acc)}
  select.in{appearance:none;-webkit-appearance:none;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%2351607a' stroke-width='2'><path d='M6 9l6 6 6-6'/></svg>");background-repeat:no-repeat;background-position:right 12px center;padding-right:38px}
  .dois{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  .campo2{display:block;font-size:12.5px;font-weight:600;color:var(--tinta-2);margin:14px 0 6px}
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
  .topo .logo-img{height:30px;width:auto;display:block}
  .topo .topo-sub{font-size:10px;color:var(--tinta-2);letter-spacing:.12em;text-transform:uppercase;border-left:1px solid var(--linha);padding-left:11px;line-height:1.2}
  .quem{margin-left:auto;display:flex;align-items:center;gap:12px;font-size:13px;color:var(--tinta-2)}
  .sair{border:1px solid var(--linha);background:var(--sup-2);color:var(--tinta);border-radius:999px;padding:7px 14px;font-size:13px;font-weight:600}
  main{max-width:1120px;margin:0 auto;padding-block:26px 64px}
  .intro h1{font-size:clamp(23px,4vw,32px);font-weight:700}
  .intro p{color:var(--tinta-2);max-width:60ch;margin:8px 0 0;font-size:15px}

  /* Mosaico (bento): a capa compõe cada bloco; os mais importantes ocupam mais espaço */
  .mosaico{margin-top:24px;display:grid;grid-template-columns:repeat(4,1fr);grid-auto-rows:118px;gap:14px;grid-auto-flow:dense}
  .pcard{position:relative;overflow:hidden;border-radius:18px;border:0;padding:0;cursor:pointer;box-shadow:var(--sombra);
    background:linear-gradient(135deg,var(--acc),var(--acc2));background-size:cover;background-position:center;
    grid-column:span 2;grid-row:span 2;transition:transform .12s,box-shadow .18s;isolation:isolate}
  .pcard.d2{grid-column:span 2;grid-row:span 2}
  .pcard.d3{grid-column:span 2;grid-row:span 3}
  .pcard:hover{transform:translateY(-3px);box-shadow:0 3px 8px rgba(20,35,58,.14),0 20px 44px rgba(20,35,58,.2)}
  .pcard::after{content:"";position:absolute;inset:0;background:linear-gradient(to top,rgba(10,18,32,.86) 0%,rgba(10,18,32,.5) 32%,rgba(10,18,32,.08) 62%,rgba(10,18,32,.18) 100%);z-index:1}
  .pcard .leg{position:absolute;inset:auto 0 0 0;z-index:2;padding:16px 17px;text-align:left;color:#fff}
  .pcard .tag{font-size:9.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;opacity:.85}
  .pcard h3{font-family:var(--disp);font-size:17px;font-weight:600;margin:3px 0 0;color:#fff;text-shadow:0 1px 10px rgba(0,0,0,.35);line-height:1.15}
  .pcard.d3 h3{font-size:22px}
  .pcard .meta{font-size:12px;margin-top:6px;opacity:.9;font-variant-numeric:tabular-nums}
  .pcard .novo{position:absolute;top:12px;left:12px;z-index:2;background:#fff;color:#0f6b3a;font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:4px 9px;border-radius:999px;box-shadow:0 2px 8px rgba(0,0,0,.2)}
  @media (max-width:760px){.mosaico{grid-template-columns:repeat(2,1fr);grid-auto-rows:104px}.pcard,.pcard.d2{grid-column:span 1;grid-row:span 2}.pcard.d3{grid-column:span 2;grid-row:span 2}}
  @media (max-width:430px){.pcard h3{font-size:15.5px}.pcard.d3 h3{font-size:19px}}
  .carregando{color:var(--tinta-2);padding:50px 0;text-align:center}

  /* ---- Visor do guia ---- */
  .visor{position:fixed;inset:0;z-index:40;background:var(--bg);display:flex;flex-direction:column}
  .visor-topo{display:flex;align-items:center;gap:12px;padding:10px max(14px,env(safe-area-inset-left,0px));padding-top:max(10px,env(safe-area-inset-top,0px));border-bottom:1px solid var(--linha);background:var(--sup)}
  .voltar{border:1px solid var(--linha);background:var(--sup-2);color:var(--tinta);border-radius:999px;padding:8px 15px;font-size:13.5px;font-weight:600;display:inline-flex;gap:7px;align-items:center}
  .visor-topo b{font-family:var(--disp);font-size:15px}
  .visor-topo .acoes{margin-left:auto;display:flex;gap:8px}
  .bcopiar{border:1px solid var(--linha);background:var(--sup-2);color:var(--tinta);border-radius:999px;padding:8px 14px;font-size:13px;font-weight:600}
  /* Aviso de cópia */
  .toast{position:fixed;left:50%;bottom:calc(24px + env(safe-area-inset-bottom,0px));transform:translate(-50%,12px);background:#15233a;color:#fff;padding:13px 18px;border-radius:13px;font-size:13.5px;font-weight:600;box-shadow:0 10px 34px rgba(0,0,0,.35);opacity:0;pointer-events:none;transition:opacity .2s,transform .2s;z-index:70;display:flex;gap:10px;align-items:center;max-width:min(92vw,420px)}
  .toast.show{opacity:1;transform:translate(-50%,0)}
  .toast svg{width:20px;height:20px;fill:none;stroke:#4ade80;stroke-width:2.2;flex:none}
  .palco{flex:1;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;display:flex;justify-content:center;padding:16px 6px 40px;
    scrollbar-width:thin;scrollbar-color:color-mix(in srgb,var(--tinta-2) 38%,transparent) transparent}
  .palco::-webkit-scrollbar{width:9px}
  .palco::-webkit-scrollbar-thumb{background:color-mix(in srgb,var(--tinta-2) 32%,transparent);border-radius:8px;border:2px solid transparent;background-clip:content-box}
  .palco::-webkit-scrollbar-thumb:hover{background:color-mix(in srgb,var(--tinta-2) 55%,transparent);background-clip:content-box}
  .palco::-webkit-scrollbar-track{background:transparent}
  .palco iframe{flex:0 0 auto;border:0;background:#fff;box-shadow:0 10px 40px rgba(20,35,58,.18);display:block;overflow:hidden}
  /* ---- Navegação (admin) ---- */
  .nav{display:flex;gap:4px;background:var(--sup-2);border:1px solid var(--linha);border-radius:999px;padding:4px}
  .nav-b{border:0;background:none;color:var(--tinta-2);font-family:var(--disp);font-weight:600;font-size:13px;padding:7px 14px;border-radius:999px}
  .nav-b.ativo{background:var(--sup);color:var(--acc);box-shadow:var(--sombra)}

  /* ---- Admin ---- */
  .subnav{display:inline-flex;gap:4px;background:var(--sup-2);border:1px solid var(--linha);border-radius:999px;padding:4px;margin-top:18px}
  .subnav-b{border:0;background:none;color:var(--tinta-2);font-family:var(--disp);font-weight:600;font-size:13px;padding:7px 15px;border-radius:999px;cursor:pointer}
  .subnav-b.ativo{background:var(--sup);color:var(--acc);box-shadow:var(--sombra)}
  .pr-ctrl{display:flex;gap:10px;align-items:center;margin:18px 0 8px;flex-wrap:wrap}
  .pr-resumo{color:var(--tinta-2);font-size:13px;margin-bottom:12px;font-variant-numeric:tabular-nums}
  .pr-email{border:1px solid var(--linha);background:var(--sup-2);color:var(--tinta);border-radius:9px;padding:8px 11px;font:inherit;font-size:12.5px;width:210px;max-width:46vw}
  .pr-email:focus{outline:none;border-color:var(--acc)}
  .mini.on{background:var(--ok);color:#fff;border-color:var(--ok)}
  .adm-lista{margin-top:22px;display:flex;flex-direction:column;gap:12px}
  .adm-row{background:var(--sup);border:1px solid var(--linha);border-radius:16px;box-shadow:var(--sombra);padding:15px 16px;display:grid;grid-template-columns:1fr auto;gap:14px;align-items:center}
  .adm-info{min-width:0}
  .adm-info h3{font-family:var(--disp);font-size:16px;font-weight:600;display:flex;align-items:center;gap:9px;flex-wrap:wrap}
  .adm-badge{font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:3px 8px;border-radius:999px}
  .adm-badge.pub{background:color-mix(in srgb,var(--ok) 14%,transparent);color:var(--ok)}
  .adm-badge.res{background:color-mix(in srgb,var(--acc) 14%,transparent);color:var(--acc)}
  .adm-badge.off{background:color-mix(in srgb,var(--tinta-2) 16%,transparent);color:var(--tinta-2)}
  .adm-meta{color:var(--tinta-2);font-size:12.5px;margin-top:5px}
  .adm-ctrl{display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:flex-end}
  .seg{display:flex;background:var(--sup-2);border:1px solid var(--linha);border-radius:10px;overflow:hidden}
  .seg button{border:0;background:none;color:var(--tinta-2);font-size:12.5px;font-weight:600;padding:8px 12px}
  .seg button.on{background:var(--acc);color:#fff}
  .mini{border:1px solid var(--linha);background:var(--sup-2);color:var(--tinta);border-radius:10px;padding:8px 12px;font-size:12.5px;font-weight:600}
  .mini.ghost{opacity:.55}
  .adm-sel{border:1px solid var(--linha);background:var(--sup-2);color:var(--tinta);border-radius:10px;padding:8px 10px;font:inherit;font-size:12.5px}
  .adm-badge.tmp{background:color-mix(in srgb,#e8912a 20%,transparent);color:#a8640f}
  @media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .adm-badge.tmp{color:#f0b968}}
  :root[data-theme="dark"] .adm-badge.tmp{color:#f0b968}
  .cart-exp{font-variant-numeric:tabular-nums}

  /* ---- Modal de liberação ---- */
  .modal{position:fixed;inset:0;z-index:60;background:rgba(10,18,32,.55);display:flex;align-items:flex-end;justify-content:center;padding:0}
  @media (min-width:640px){.modal{align-items:center;padding:20px}}
  .modal-card{background:var(--sup);width:min(560px,100%);max-height:88svh;display:flex;flex-direction:column;border-radius:20px 20px 0 0;box-shadow:0 -10px 40px rgba(0,0,0,.3)}
  @media (min-width:640px){.modal-card{border-radius:20px}}
  .modal-top{display:flex;align-items:center;gap:12px;padding:16px 18px;border-bottom:1px solid var(--linha)}
  .modal-top h3{font-family:var(--disp);font-size:16px;font-weight:600}
  .modal-top .x{margin-left:auto;border:0;background:var(--sup-2);color:var(--tinta);width:32px;height:32px;border-radius:9px;font-size:18px;line-height:1}
  .modal-body{padding:16px 18px;overflow:auto}
  .busca-in{display:flex;align-items:center;gap:9px;background:var(--sup-2);border:1px solid var(--linha);border-radius:12px;padding:10px 14px;margin-bottom:12px}
  .busca-in input{border:0;background:none;color:var(--tinta);font:inherit;font-size:14px;width:100%;outline:none}
  .pr-item{display:flex;align-items:center;gap:10px;padding:10px 2px;border-bottom:1px dashed var(--linha)}
  .pr-item:last-child{border-bottom:0}
  .pr-item .n{font-size:13.5px;font-weight:600}
  .pr-item .c{font-size:11.5px;color:var(--tinta-2);font-family:var(--mono)}
  .pr-item .ac{margin-left:auto}
  .rotulo{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--tinta-2);margin:16px 0 6px}
  @media (prefers-reduced-motion:reduce){*{transition:none!important}}
</style>
</head><body>

<!-- ===================== LOGIN ===================== -->
<section class="login" id="tela-login">
  <div class="login-card">
    <div class="brand">
      <img class="logo-img" src="${LOGO}" alt="Medicinal Farmácia e Manipulação">
      <span class="brand-sub">Portal do<br>Prescritor</span>
    </div>

    <div id="passo-id">
      <h1>Acesse o portal</h1>
      <p class="sub">Informe sua profissão, estado e número do registro. Enviaremos um código de acesso ao seu e-mail cadastrado.</p>
      <div id="modo-chave">
        <div class="dois">
          <div>
            <label class="campo" for="prof">Profissão</label>
            <select class="in" id="prof">
              <option value="1">Médico(a)</option>
              <option value="2">Nutricionista</option>
            </select>
          </div>
          <div>
            <label class="campo" for="uf">Estado</label>
            <select class="in" id="uf">
              <option value="" disabled selected>UF</option>
              <option>AC</option><option>AL</option><option>AP</option><option>AM</option><option>BA</option><option>CE</option><option>DF</option><option>ES</option><option>GO</option><option>MA</option><option>MT</option><option>MS</option><option>MG</option><option>PA</option><option>PB</option><option>PR</option><option>PE</option><option>PI</option><option>RJ</option><option>RN</option><option>RS</option><option>RO</option><option>RR</option><option>SC</option><option>SP</option><option>SE</option><option>TO</option>
            </select>
          </div>
        </div>
        <label class="campo2" for="reg" id="reg-label">Número do CRM</label>
        <input class="in" id="reg" inputmode="numeric" autocomplete="off" placeholder="ex.: 20696">
      </div>
      <div id="modo-email" hidden>
        <label class="campo" for="email">E-mail</label>
        <input class="in" id="email" type="email" autocomplete="email" placeholder="voce@exemplo.com">
      </div>
      <button class="btn" id="btn-enviar">Enviar código</button>
      <button class="link" id="troca-modo">Não tenho registro — entrar com e-mail</button>
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
    <img class="logo-img" src="${LOGO}" alt="Medicinal">
    <span class="topo-sub">Portal do<br>Prescritor</span>
    <nav class="nav" id="nav" hidden style="margin-left:18px">
      <button class="nav-b ativo" data-view="protocolos" type="button">Protocolos</button>
      <button class="nav-b" data-view="admin" type="button">Administração</button>
    </nav>
    <div class="quem"><span id="quem-nome"></span><button class="sair" id="sair">Sair</button></div>
  </div></header>

  <main class="env">
    <div id="view-protocolos">
      <div class="intro">
        <h1>Protocolos da Medicinal</h1>
        <p>Toque em um protocolo para ver o guia completo e copiar as fórmulas prontas para a prescrição.</p>
      </div>
      <div id="grade" class="mosaico" aria-live="polite"></div>
      <div class="carregando" id="carregando">Carregando protocolos…</div>
    </div>

    <div id="view-admin" hidden>
      <div class="intro">
        <h1>Administração</h1>
        <p>Libere o acesso dos prescritores ao portal e controle a visibilidade de cada protocolo.</p>
      </div>
      <div class="subnav">
        <button class="subnav-b ativo" data-sub="protocolos" type="button">Protocolos</button>
        <button class="subnav-b" data-sub="prescritores" type="button">Prescritores</button>
        <button class="subnav-b" data-sub="carteiras" type="button">Carteiras</button>
      </div>

      <div id="sub-protocolos">
        <div id="adm-lista" class="adm-lista"></div>
        <div class="carregando" id="adm-carregando">Carregando…</div>
      </div>

      <div id="sub-prescritores" hidden>
        <div class="pr-ctrl">
          <label class="busca-in" style="flex:1;min-width:220px;margin:0">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--tinta-2)"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></svg>
            <input id="pr-q" type="search" placeholder="Buscar por nome, registro ou e-mail…" autocomplete="off">
          </label>
          <select id="pr-filtro" class="adm-sel">
            <option value="todos">Todos</option>
            <option value="autorizados">Autorizados</option>
            <option value="pendentes">Não autorizados</option>
            <option value="sem_email">Sem e-mail</option>
          </select>
        </div>
        <div class="pr-resumo" id="pr-resumo"></div>
        <div id="pr-lista" class="adm-lista"></div>
        <div class="carregando" id="pr-carregando">Carregando…</div>
      </div>

      <div id="sub-carteiras" hidden>
        <div class="pr-ctrl">
          <select id="cv-visitadora" class="adm-sel" style="min-width:230px"></select>
          <label class="busca-in" style="flex:1;min-width:200px;margin:0">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--tinta-2)"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></svg>
            <input id="cv-q" type="search" placeholder="Buscar na carteira…" autocomplete="off">
          </label>
          <select id="cv-filtro" class="adm-sel">
            <option value="todos">Todos</option>
            <option value="temporario">Liberados 72h</option>
            <option value="definitivo">Acesso definitivo</option>
            <option value="sem">Sem acesso</option>
          </select>
        </div>
        <div class="pr-resumo" id="cv-resumo"></div>
        <div id="cv-lista" class="adm-lista"></div>
        <div class="carregando" id="cv-carregando" hidden>Carregando…</div>
      </div>
    </div>

    <div id="view-cartela" hidden>
      <div class="intro">
        <h1>Minha carteira</h1>
        <p>Libere o acesso de um prescritor da sua carteira ao portal por <b>72&nbsp;horas</b>. O cadastro definitivo de e-mail vem oficialmente do Fórmula Certa.</p>
      </div>
      <div class="pr-ctrl">
        <label class="busca-in" style="flex:1;min-width:220px;margin:0">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--tinta-2)"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></svg>
          <input id="ct-q" type="search" placeholder="Buscar por nome, registro ou e-mail…" autocomplete="off">
        </label>
        <select id="ct-filtro" class="adm-sel">
          <option value="todos">Todos</option>
          <option value="temporario">Liberados 72h</option>
          <option value="definitivo">Acesso definitivo</option>
          <option value="sem">Sem acesso</option>
        </select>
      </div>
      <div class="pr-resumo" id="ct-resumo"></div>
      <div id="ct-lista" class="adm-lista"></div>
      <div class="carregando" id="ct-carregando">Carregando sua carteira…</div>
    </div>
  </main>
</div>

<!-- Modal: liberar protocolo restrito a prescritores -->
<div class="modal" id="modal-acesso" hidden>
  <div class="modal-card">
    <div class="modal-top">
      <h3>Liberar acesso</h3>
      <button class="x" id="modal-fechar" type="button" aria-label="Fechar">&times;</button>
    </div>
    <div class="modal-body">
      <p class="adm-meta" id="modal-sub" style="margin:0 0 12px"></p>
      <label class="busca-in">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--tinta-2)"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></svg>
        <input id="pr-busca" type="search" placeholder="Buscar prescritor por nome, registro ou e-mail…" autocomplete="off">
      </label>
      <div id="pr-resultados"></div>
      <div class="rotulo">Com acesso liberado</div>
      <div id="pr-liberados"></div>
    </div>
  </div>
</div>

<!-- ===================== VISOR DO GUIA ===================== -->
<div class="visor" id="visor" hidden>
  <div class="visor-topo">
    <button class="voltar" id="guia-voltar"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M15 5l-7 7 7 7"/></svg> Voltar</button>
    <b id="guia-titulo"></b>
    <div class="acoes"><button class="bcopiar" id="guia-copiar">Copiar todas</button></div>
  </div>
  <div class="palco" id="palco"></div>
</div>

<div class="toast" id="toast" role="status" aria-live="polite">
  <svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg><span></span>
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
  function idAtual(){
    if(modoEmail)return {email:($("email").value||"").trim()};
    var prof=$("prof").value, uf=$("uf").value, reg=($("reg").value||"").replace(/\D/g,"");
    return {chave:(prof&&uf&&reg)?(prof+"-"+uf+"-"+reg):""};
  }
  // CRM para médico, CRN para nutricionista
  $("prof").addEventListener("change",function(){
    $("reg-label").textContent="Número do "+($("prof").value==="2"?"CRN":"CRM");
  });

  $("troca-modo").onclick=function(){
    modoEmail=!modoEmail;
    $("modo-chave").hidden=modoEmail; $("modo-email").hidden=!modoEmail;
    $("troca-modo").textContent=modoEmail?"Entrar com registro profissional":"Não tenho registro — entrar com e-mail";
    limpaAviso($("aviso-id"));
  };

  $("btn-enviar").onclick=async function(){
    var id=idAtual();
    if(!id.chave && !id.email){return aviso($("aviso-id"),modoEmail?"Informe o e-mail.":"Selecione profissão e estado e informe o número do registro.")}
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
      sessao={access_token:d.access_token,refresh_token:d.refresh_token,expira:Date.now()+(d.expires_in||3600)*1000,nome:d.nome||null,crm:d.crm||null,admin:!!d.admin,visitadora:!!d.visitadora};
      gravarSessao(sessao); entrarNoApp();
    }catch(e){aviso($("aviso-cod"),"Sem conexão com o servidor.");$("btn-verificar").disabled=false}
  };
  $("codigo").addEventListener("keydown",function(e){if(e.key==="Enter")$("btn-verificar").click()});
  $("reg").addEventListener("keydown",function(e){if(e.key==="Enter")$("btn-enviar").click()});
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
  async function rpc(fn,body){
    var url=NEXUS_URL+"/rest/v1/rpc/"+fn;
    function opt(){return {method:"POST",headers:{apikey:ANON,Authorization:"Bearer "+sessao.access_token,"Content-Type":"application/json"},body:JSON.stringify(body||{})}}
    var r=await fetch(url,opt());
    if(r.status===401){ if(await refrescar()) r=await fetch(url,opt()); }
    if(r.status===401){ sair(); return null; }
    return r.ok?r.json():null;
  }

  // ---------- App ----------
  function entrarNoApp(){
    $("tela-login").hidden=true; $("app").hidden=false;
    if(sessao.visitadora){
      $("quem-nome").textContent=(sessao.nome||"Visitadora")+" — Equipe Medicinal";
      $("nav").hidden=true;
      $("view-protocolos").hidden=true; $("view-admin").hidden=true; $("view-cartela").hidden=false;
      viewAtual="cartela";
      if(!cartelaCarregada){cartelaCarregada=true;carregarCartela();}
      return;
    }
    var q=sessao.nome?("Dr(a). "+sessao.nome):(sessao.crm||"");
    $("quem-nome").textContent=q;
    $("nav").hidden=!sessao.admin;
    $("view-cartela").hidden=true; $("view-protocolos").hidden=false;
    carregarProtocolos();
  }
  // Navegação Protocolos / Administração (admin)
  var viewAtual="protocolos", adminCarregado=false;
  [].forEach.call(document.querySelectorAll(".nav-b"),function(bt){
    bt.onclick=function(){
      var v=bt.dataset.view; if(v===viewAtual)return; viewAtual=v;
      document.querySelectorAll(".nav-b").forEach(function(x){x.classList.toggle("ativo",x.dataset.view===v)});
      $("view-protocolos").hidden=v!=="protocolos"; $("view-admin").hidden=v!=="admin";
      if(v==="admin"&&!adminCarregado){adminCarregado=true;carregarAdmin();}
    };
  });
  async function carregarProtocolos(){
    var dados=await api("?select=slug,titulo,cor,ordem,capa,formulas,destaque,novo&ativo=eq.true&order=destaque.desc,ordem");
    if(!dados){$("carregando").textContent="Não foi possível carregar os protocolos.";return}
    protocolos=dados; $("carregando").hidden=true;
    var g=$("grade"); g.innerHTML="";
    dados.forEach(function(p){
      var cor=p.cor||{}, n=(p.formulas||[]).length, d=p.destaque||1;
      var b=document.createElement("button");
      b.className="pcard"+(d>=3?" d3":d===2?" d2":"");
      b.style.background="linear-gradient(135deg,"+(cor.escura||"#2A62AC")+","+(cor.clara||"#5b8fd6")+")";
      if(p.capa){var im=new Image();im.onload=function(){b.style.backgroundImage="url('"+p.capa+"')"};im.src=p.capa;}
      b.innerHTML=(p.novo?'<span class="novo">Novo</span>':'')+'<div class="leg"><span class="tag">Protocolo</span><h3></h3><div class="meta">'+n+(n===1?" fórmula":" fórmulas")+'</div></div>';
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
      // Ocupa a largura disponível (amplia além do A4 em telas largas), com um teto para leitura
      var disp=Math.min($("palco").clientWidth-10,1400);
      var escala=disp/larguraA4;
      var alturaTotal=doc.body.scrollHeight;
      ifr.style.width=larguraA4+"px";
      ifr.style.height=alturaTotal+"px";
      ifr.style.transform="scale("+escala+")";
      ifr.style.transformOrigin="top center";
      ifr.style.marginBottom=(alturaTotal*escala-alturaTotal)+"px";
    }catch(e){}
  }
  // Texto de uma fórmula, pronto para colar na prescrição —
  // com pontilhado entre o ativo e a dose (como na tabela impressa) e posologia destacada.
  function textoFormula(f){
    var ALVO=46; // coluna onde a dose começa
    var L=[(f.nome||"").toUpperCase()+(f.via?"  ·  "+f.via:"")];
    L.push("");
    (f.ativos||[]).forEach(function(a){
      var nome=(a.nome||"").trim(), dose=(a.dose||"").trim();
      if(!dose){ L.push(nome); return; }
      var esq=nome+" ";
      var n=ALVO-esq.length;
      L.push(esq+(n>1?new Array(n).join("."):"")+" "+dose);
    });
    if(f.modo){ L.push(""); L.push("Posologia: "+f.modo); }
    return L.join("\n");
  }
  function escH(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}
  // Tabela HTML de uma fórmula (cola alinhada no Word/Docs/formulários)
  function htmlFormula(f){
    var ls=(f.ativos||[]).map(function(a){
      return '<tr><td style="padding:2px 30px 2px 0;white-space:nowrap">'+escH(a.nome)+'</td>'
           +'<td style="padding:2px 0;text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums">'+escH(a.dose||"")+'</td></tr>';
    }).join("");
    return '<div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#15233a;line-height:1.45">'
      +'<div style="font-weight:700;text-transform:uppercase;letter-spacing:.3px">'+escH(f.nome)+(f.via?' &middot; '+escH(f.via):'')+'</div>'
      +'<table style="border-collapse:collapse;margin:4px 0 6px">'+ls+'</table>'
      +(f.modo?'<div><b>Posologia:</b> '+escH(f.modo)+'</div>':'')+'</div>';
  }
  function rodapeHtml(p){return '<div style="color:#667;font-size:12px;margin-top:6px">('+escH(p.titulo)+' &middot; Medicinal)</div>'}
  // Copia HTML (tabela) + texto puro de reserva, na janela indicada (guia ou app)
  function copiarRico(win,doc,html,plain){
    return new Promise(function(res,rej){
      try{
        var nav=win.navigator;
        if(win.ClipboardItem&&nav.clipboard&&nav.clipboard.write){
          var item=new win.ClipboardItem({"text/html":new Blob([html],{type:"text/html"}),"text/plain":new Blob([plain],{type:"text/plain"})});
          nav.clipboard.write([item]).then(res).catch(txt);
        } else txt();
        function txt(){ if(nav.clipboard&&nav.clipboard.writeText){nav.clipboard.writeText(plain).then(res).catch(sel)} else sel(); }
        function sel(){ try{var ta=doc.createElement("textarea");ta.value=plain;ta.style.position="fixed";ta.style.opacity="0";doc.body.appendChild(ta);ta.focus();ta.select();doc.execCommand("copy");doc.body.removeChild(ta);res()}catch(e){rej(e)} }
      }catch(e){rej(e)}
    });
  }
  var ICO_COPIAR='<svg viewBox="0 0 24 24"><path d="M9 9V5.5A1.5 1.5 0 0 1 10.5 4h8A1.5 1.5 0 0 1 20 5.5v8a1.5 1.5 0 0 1-1.5 1.5H15M4 10.5A1.5 1.5 0 0 1 5.5 9h8A1.5 1.5 0 0 1 15 10.5v8A1.5 1.5 0 0 1 13.5 20h-8A1.5 1.5 0 0 1 4 18.5z"/></svg>';
  function showToast(msg){
    var t=$("toast"); t.querySelector("span").textContent=msg; t.classList.add("show");
    clearTimeout(t._tmr); t._tmr=setTimeout(function(){t.classList.remove("show")},2600);
  }
  // Injeta um botão "Copiar fórmula" ao lado de cada card do guia (no espaço livre do QR).
  function injetarCopias(ifr,p){
    try{
      var cd=ifr.contentDocument; if(!cd)return;
      var st=cd.createElement("style");
      st.textContent=
        ".pp-copiar{flex:none;align-self:center;display:inline-flex;align-items:center;gap:2.2mm;cursor:pointer;"+
        "background:linear-gradient(135deg,var(--tema-escura),var(--tema-clara));color:#fff;border:0;border-radius:3.2mm;"+
        "padding:3.4mm 5mm;font-family:inherit;font-size:9pt;font-weight:700;white-space:nowrap;box-shadow:0 1mm 3mm rgba(0,0,0,.16)}"+
        ".pp-copiar:hover{filter:brightness(1.08)} .pp-copiar:active{transform:translateY(0.3mm)}"+
        ".pp-copiar.ok{background:#1f9d62}"+
        ".pp-copiar svg{width:4mm;height:4mm;fill:none;stroke:#fff;stroke-width:1.8;flex:none}"+
        /* Fluxo contínuo: páginas internas crescem com o conteúdo; sem cabeçalho/selo repetidos */
        ".pagina.interna{height:auto!important;min-height:0!important;overflow:visible!important}"+
        ".pagina.interna .cabecalho,.pagina.interna .selo-canto{display:none!important}"+
        ".pagina.interna .conteudo{position:static!important;inset:auto!important;padding:10mm 0 6mm!important}";
      cd.head.appendChild(st);
      var cards=cd.querySelectorAll(".card"), fs=p.formulas||[];
      [].forEach.call(cards,function(card,i){
        var f=fs[i]; if(!f)return;
        var linha=card.closest(".linha-formula")||card.parentNode;
        if(!linha||linha.querySelector(".pp-copiar"))return;
        var b=cd.createElement("button"); b.className="pp-copiar"; b.type="button";
        b.innerHTML=ICO_COPIAR+'<span>Copiar fórmula</span>';
        b.onclick=function(){
          copiarRico(ifr.contentWindow, cd, htmlFormula(f)+rodapeHtml(p), textoFormula(f)+"\n\n("+p.titulo+" · Medicinal)").then(function(){
            b.classList.add("ok"); var s=b.querySelector("span"); s.textContent="Copiada!";
            showToast("Fórmula “"+f.nome+"” copiada — cole na prescrição (Ctrl+V).");
            setTimeout(function(){b.classList.remove("ok"); s.textContent="Copiar fórmula";},1700);
          }).catch(function(){ showToast("Não foi possível copiar automaticamente. Selecione o texto da fórmula."); });
        };
        linha.appendChild(b);
      });
      // O layout mudou (fluxo contínuo) → redesenha os conectores e reajusta a altura.
      setTimeout(function(){
        try{
          [].forEach.call(cd.querySelectorAll(".conectores"),function(s){ s.parentNode&&s.parentNode.removeChild(s); });
          if(ifr.contentWindow&&ifr.contentWindow.desenharConectores) ifr.contentWindow.desenharConectores();
        }catch(e){}
        ajustarIframe(ifr);
      },50);
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
    ifr.setAttribute("scrolling","no");
    ifr.setAttribute("allow","clipboard-write");
    ifr.onload=function(){ setTimeout(function(){ injetarCopias(ifr,p); ajustarIframe(ifr); },250) };
    $("palco").innerHTML=""; $("palco").appendChild(ifr);
    ifr.srcdoc=html;
    window.addEventListener("resize",function(){ajustarIframe(ifr)});
  }
  function fecharGuia(){$("visor").hidden=true;$("palco").innerHTML="";protoAtual=null;if(location.hash)history.pushState("","",location.pathname)}
  $("guia-voltar").onclick=fecharGuia;
  window.addEventListener("popstate",function(){ if($("visor").hidden===false) fecharGuia(); });

  // Copiar TODAS as fórmulas do protocolo
  $("guia-copiar").onclick=function(){
    if(!protoAtual)return;
    var p=protoAtual, fs=p.formulas||[];
    var plain=[p.titulo,""].concat(fs.map(textoFormula)).join("\n\n")+"\n\n(Medicinal Farmácia e Manipulação)";
    var html='<div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#15233a">'
      +'<div style="font-weight:700;font-size:15px;margin-bottom:8px">'+escH(p.titulo)+'</div>'
      +fs.map(htmlFormula).join('<div style="border-top:1px solid #e2e8f0;margin:10px 0"></div>')
      +rodapeHtml(p)+'</div>';
    var btn=$("guia-copiar");
    copiarRico(window, document, html, plain).then(function(){ btn.textContent="Copiado!"; setTimeout(function(){btn.textContent="Copiar todas"},1600); });
  };

  // ---------- Administração ----------
  // Sub-abas: Protocolos / Prescritores
  var prCarregado=false, tPr=null;
  [].forEach.call(document.querySelectorAll(".subnav-b"),function(bt){
    bt.onclick=function(){
      var v=bt.dataset.sub;
      document.querySelectorAll(".subnav-b").forEach(function(x){x.classList.toggle("ativo",x.dataset.sub===v)});
      $("sub-protocolos").hidden=v!=="protocolos"; $("sub-prescritores").hidden=v!=="prescritores"; $("sub-carteiras").hidden=v!=="carteiras";
      if(v==="prescritores"&&!prCarregado){prCarregado=true;carregarPrescritores();}
      if(v==="carteiras"&&!cvCarregado){cvCarregado=true;iniciarCarteiras();}
    };
  });
  $("pr-q").addEventListener("input",function(){ clearTimeout(tPr); tPr=setTimeout(carregarPrescritores,260); });
  $("pr-filtro").addEventListener("change",carregarPrescritores);

  async function carregarPrescritores(){
    $("pr-carregando").hidden=false;
    var d=await rpc("admin_prescritor_listar",{p_busca:$("pr-q").value.trim(),p_filtro:$("pr-filtro").value,p_limite:60});
    $("pr-carregando").hidden=true;
    if(!d){$("pr-lista").innerHTML='<p class="adm-meta">Não foi possível carregar.</p>';return}
    var r=d.resumo||{};
    $("pr-resumo").textContent=(r.total||0)+" prescritores · "+(r.autorizados||0)+" com acesso liberado · "+(r.pendentes||0)+" sem acesso";
    var L=$("pr-lista"); L.innerHTML="";
    (d.itens||[]).forEach(function(pr){ L.appendChild(linhaPrescritor(pr)); });
    if(!(d.itens||[]).length)L.innerHTML='<p class="adm-meta">Nenhum prescritor encontrado.</p>';
  }
  function linhaPrescritor(pr){
    var row=document.createElement("div"); row.className="adm-row";
    row.innerHTML='<div class="adm-info"><h3><span class="t"></span></h3><div class="adm-meta"></div></div>'
      +'<div class="adm-ctrl"><input class="pr-email" type="email" placeholder="e-mail de login"><button class="mini lib" type="button"></button></div>';
    row.querySelector(".t").textContent=pr.nome||"—";
    function badge(){ return pr.autorizado?' <span class="adm-badge pub">Autorizado</span>':' <span class="adm-badge off">Sem acesso</span>'; }
    function meta(){ return (pr.chave||"")+(pr.crm?" · CRM "+pr.crm:"")+(pr.tem_conta?" · já acessou":""); }
    var inp=row.querySelector(".pr-email"); inp.value=pr.email||"";
    var bt=row.querySelector(".lib");
    function pinta(){ row.querySelector("h3").innerHTML='<span class="t"></span>'+badge(); row.querySelector(".t").textContent=pr.nome||"—"; row.querySelector(".adm-meta").textContent=meta(); bt.textContent=pr.autorizado?"Revogar":"Liberar acesso"; bt.className="mini lib"+(pr.autorizado?" on":""); }
    pinta();
    // salva e-mail ao sair do campo (se mudou)
    inp.addEventListener("blur",async function(){
      var v=inp.value.trim(); if(v===(pr.email||""))return;
      var res=await rpc("admin_prescritor_set",{p_id:pr.id,p_email:v});
      if(res&&res.ok){ pr.email=res.email||v; showToast("E-mail salvo."); } else { showToast("E-mail inválido."); inp.value=pr.email||""; }
    });
    bt.onclick=async function(){
      bt.disabled=true;
      var liberar=!pr.autorizado;
      var res=await rpc("admin_prescritor_set",{p_id:pr.id,p_autorizado:liberar,p_email:inp.value.trim()||null});
      bt.disabled=false;
      if(!res||!res.ok){
        if(res&&res.motivo==="sem_email"){ showToast("Informe o e-mail antes de liberar."); inp.focus(); }
        else if(res&&res.motivo==="email_invalido"){ showToast("E-mail inválido."); inp.focus(); }
        else showToast("Não foi possível atualizar.");
        return;
      }
      pr.autorizado=res.autorizado; pr.email=res.email||pr.email; pinta();
      showToast(liberar?("Acesso liberado para "+(pr.nome||"o prescritor")+"."):"Acesso revogado.");
    };
    return row;
  }

  async function carregarAdmin(){
    var dados=await rpc("admin_protocolos",{});
    $("adm-carregando").hidden=true;
    if(!dados){$("adm-lista").innerHTML='<p class="adm-meta">Não foi possível carregar (apenas administradores).</p>';return}
    var L=$("adm-lista"); L.innerHTML="";
    dados.forEach(function(p){ L.appendChild(linhaAdmin(p)); });
  }
  function linhaAdmin(p){
    var row=document.createElement("div"); row.className="adm-row";
    function badges(){
      var b = p.visibilidade==="restrito" ? '<span class="adm-badge res">Restrito</span>' : '<span class="adm-badge pub">Público</span>';
      if(!p.ativo) b+='<span class="adm-badge off">Inativo</span>';
      if(p.novo) b+='<span class="adm-badge res">Novo</span>';
      return b;
    }
    function meta(){ return p.n_formulas+' fórmulas'+(p.visibilidade==="restrito"?' · '+p.n_liberados+' com acesso':''); }
    row.innerHTML='<div class="adm-info"><h3><span class="t"></span></h3><div class="adm-meta"></div></div><div class="adm-ctrl"></div>';
    row.querySelector(".t").textContent=p.titulo;
    var ctrl=row.querySelector(".adm-ctrl");
    var seg=document.createElement("div"); seg.className="seg";
    [["publico","Público"],["restrito","Restrito"]].forEach(function(o){
      var bt=document.createElement("button"); bt.textContent=o[1]; if(p.visibilidade===o[0])bt.classList.add("on");
      bt.onclick=async function(){ if(p.visibilidade===o[0])return; await rpc("admin_protocolo_flags",{p_slug:p.slug,p_visibilidade:o[0]}); p.visibilidade=o[0]; seg.querySelectorAll("button").forEach(function(x,i){x.classList.toggle("on",(i===0)===(o[0]==="publico"))}); atualiza(); };
      seg.appendChild(bt);
    });
    ctrl.appendChild(seg);
    var sel=document.createElement("select"); sel.className="adm-sel";
    [[1,"Normal"],[2,"Grande"],[3,"Herói"]].forEach(function(o){ var op=document.createElement("option"); op.value=o[0]; op.textContent="Tam.: "+o[1]; if(p.destaque===o[0])op.selected=true; sel.appendChild(op); });
    sel.onchange=async function(){ await rpc("admin_protocolo_flags",{p_slug:p.slug,p_destaque:parseInt(sel.value,10)}); p.destaque=parseInt(sel.value,10); };
    ctrl.appendChild(sel);
    var bn=document.createElement("button"); bn.textContent="Novo";
    function pintaNovo(){bn.className="mini"+(p.novo?"":" ghost")} pintaNovo();
    bn.onclick=async function(){ await rpc("admin_protocolo_flags",{p_slug:p.slug,p_novo:!p.novo}); p.novo=!p.novo; pintaNovo(); atualiza(); }; ctrl.appendChild(bn);
    var ba=document.createElement("button");
    function pintaAtivo(){ba.className="mini"+(p.ativo?"":" ghost");ba.textContent=p.ativo?"Ativo":"Inativo"} pintaAtivo();
    ba.onclick=async function(){ await rpc("admin_protocolo_flags",{p_slug:p.slug,p_ativo:!p.ativo}); p.ativo=!p.ativo; pintaAtivo(); atualiza(); }; ctrl.appendChild(ba);
    var bg=document.createElement("button"); bg.className="mini"; bg.textContent="Acesso"; bg.onclick=function(){abrirAcesso(p)}; ctrl.appendChild(bg);
    function atualiza(){ row.querySelector("h3").innerHTML='<span class="t"></span>'+badges(); row.querySelector(".t").textContent=p.titulo; row.querySelector(".adm-meta").textContent=meta(); bg.style.display=p.visibilidade==="restrito"?"":"none"; }
    atualiza();
    return row;
  }
  // Modal de liberação por prescritor
  var modalSlug=null, tBusca=null;
  function abrirAcesso(p){ modalSlug=p.slug; $("modal-sub").textContent='“'+p.titulo+'” — restrito. Escolha quem pode ver.'; $("pr-busca").value=""; $("pr-resultados").innerHTML=""; $("modal-acesso").hidden=false; carregarLiberados(); setTimeout(function(){$("pr-busca").focus()},50); }
  function fecharAcesso(){ $("modal-acesso").hidden=true; if(adminCarregado)carregarAdmin(); }
  $("modal-fechar").onclick=fecharAcesso;
  $("modal-acesso").addEventListener("click",function(e){ if(e.target===$("modal-acesso"))fecharAcesso(); });
  async function carregarLiberados(){ var d=await rpc("admin_acesso_list",{p_slug:modalSlug})||[]; renderPr($("pr-liberados"),d,true); }
  $("pr-busca").addEventListener("input",function(){ clearTimeout(tBusca); tBusca=setTimeout(async function(){ var q=$("pr-busca").value.trim(); if(q.length<2){$("pr-resultados").innerHTML="";return} var d=await rpc("admin_prescritores",{p_busca:q,p_limite:15})||[]; renderPr($("pr-resultados"),d,false); },260); });
  function renderPr(cont,lista,liberado){
    cont.innerHTML="";
    if(!lista.length){cont.innerHTML='<p class="adm-meta">'+(liberado?"Ninguém com acesso ainda.":"Nenhum prescritor encontrado.")+'</p>';return}
    lista.forEach(function(pr){
      var el=document.createElement("div"); el.className="pr-item";
      el.innerHTML='<div><div class="n"></div><div class="c"></div></div><div class="ac"></div>';
      el.querySelector(".n").textContent=pr.nome||"—";
      el.querySelector(".c").textContent=(pr.chave||"")+(pr.email?" · "+pr.email:"");
      var b=document.createElement("button"); b.className="mini"; b.textContent=liberado?"Remover":"Liberar";
      b.onclick=async function(){ b.disabled=true; await rpc("admin_acesso_set",{p_slug:modalSlug,p_prescritor:pr.id,p_liberar:!liberado}); if(liberado){carregarLiberados()}else{b.textContent="Liberado";b.classList.add("ghost");carregarLiberados()} };
      el.querySelector(".ac").appendChild(b); cont.appendChild(el);
    });
  }

  // ---------- Minha carteira (visitadora) ----------
  var cartelaCarregada=false, tCt=null, cartelaItens=[];
  $("ct-q").addEventListener("input",function(){ clearTimeout(tCt); tCt=setTimeout(carregarCartela,280); });
  $("ct-filtro").addEventListener("change",pintaCartela);

  async function carregarCartela(){
    $("ct-carregando").hidden=false;
    var d=await rpc("visitadora_cartela",{p_busca:$("ct-q").value.trim(),p_limite:800});
    $("ct-carregando").hidden=true;
    if(!d||!d.ok){ $("ct-lista").innerHTML='<p class="adm-meta">Não foi possível carregar sua carteira.</p>'; return; }
    cartelaItens=d.itens||[]; var r=d.resumo||{};
    $("ct-resumo").textContent=(r.total||0)+" na sua carteira · "+(r.definitivos||0)+" com acesso definitivo · "+(r.temporarios||0)+" liberados agora · "+(r.com_email||0)+" com e-mail";
    pintaCartela();
  }
  function pintaCartela(){
    var f=$("ct-filtro").value, L=$("ct-lista"); L.innerHTML="";
    var vis=cartelaItens.filter(function(it){
      if(f==="temporario")return it.situacao==="temporario";
      if(f==="definitivo")return it.situacao==="definitivo";
      if(f==="sem")return it.situacao==="novo"||it.situacao==="inativo";
      return true;
    });
    vis.forEach(function(it){ L.appendChild(linhaCartela(it)); });
    if(!vis.length)L.innerHTML='<p class="adm-meta">Nenhum prescritor neste filtro.</p>';
  }
  function linhaCartela(it,cdfun){
    var adm=(cdfun!=null);
    function argsLib(email){ var a={p_pfcrm:it.pfcrm,p_ufcrm:it.ufcrm,p_nrcrm:it.nrcrm,p_email:email}; if(adm)a.p_cdfun=cdfun; return a; }
    function argsRev(){ var a={p_pfcrm:it.pfcrm,p_ufcrm:it.ufcrm,p_nrcrm:it.nrcrm}; if(adm)a.p_cdfun=cdfun; return a; }
    var fnLib=adm?"admin_visitadora_liberar":"visitadora_liberar";
    var fnRev=adm?"admin_visitadora_revogar":"visitadora_revogar";
    var row=document.createElement("div"); row.className="adm-row";
    row.innerHTML='<div class="adm-info"><h3><span class="t"></span></h3><div class="adm-meta"></div></div><div class="adm-ctrl"></div>';
    var ctrl=row.querySelector(".adm-ctrl");
    function badge(){
      if(it.situacao==="definitivo")return '<span class="adm-badge pub">Acesso definitivo</span>';
      if(it.situacao==="temporario")return '<span class="adm-badge tmp cart-exp">72h · faltam '+(it.horas_restantes||0)+'h</span>';
      return '<span class="adm-badge off">Sem acesso</span>';
    }
    function meta(){ return "CRM "+it.nrcrm+"/"+it.ufcrm+(it.email?(" · "+it.email):" · sem e-mail"); }
    function pinta(){ row.querySelector("h3").innerHTML='<span class="t"></span> '+badge(); row.querySelector(".t").textContent=it.nome||"—"; row.querySelector(".adm-meta").textContent=meta(); render(); }
    function render(){
      ctrl.innerHTML="";
      if(it.situacao==="definitivo")return; // acesso oficial — nada a fazer
      var inp=document.createElement("input"); inp.className="pr-email"; inp.type="email"; inp.placeholder="e-mail do prescritor"; inp.value=it.email||"";
      var bt=document.createElement("button"); bt.className="mini lib";
      if(it.situacao==="temporario"){ bt.textContent="Revogar"; bt.classList.add("on"); } else bt.textContent="Liberar 72h";
      ctrl.appendChild(inp); ctrl.appendChild(bt);
      bt.onclick=async function(){
        bt.disabled=true;
        if(it.situacao==="temporario"){
          var rv=await rpc(fnRev,argsRev());
          bt.disabled=false;
          if(rv&&rv.ok){ it.situacao="inativo"; pinta(); showToast("Acesso de "+(it.nome||"prescritor")+" revogado."); }
          else showToast("Não foi possível revogar.");
          return;
        }
        var r=await rpc(fnLib,argsLib(inp.value.trim()||null));
        bt.disabled=false;
        if(!r||!r.ok){ showToast(r&&r.motivo==="email_invalido"?"E-mail inválido.":"Não foi possível liberar."); return; }
        if(r.situacao==="definitivo"){ it.situacao="definitivo"; pinta(); showToast("Este prescritor já tem acesso definitivo."); return; }
        it.situacao="temporario"; it.horas_restantes=72; it.email=r.email||inp.value.trim()||it.email; pinta();
        showToast(r.tem_email ? ((it.nome||"Prescritor")+" liberado por 72h — já pode entrar no portal.")
                              : "Liberado por 72h. Informe um e-mail para ele receber o código de acesso.");
      };
    }
    pinta();
    return row;
  }

  // ---------- Carteiras (admin): supervisão por visitadora ----------
  var cvCarregado=false, cvItens=[], cvCdfun=null, tCv=null;
  async function iniciarCarteiras(){
    var d=await rpc("admin_visitadoras",{});
    var sel=$("cv-visitadora");
    if(!d||!d.ok){ $("cv-resumo").textContent="Não foi possível carregar as visitadoras."; return; }
    sel.innerHTML="";
    (d.itens||[]).forEach(function(v){
      var o=document.createElement("option"); o.value=v.cdfun;
      o.textContent=(v.nome||("Func "+v.cdfun))+" — "+(v.total||0)+" na carteira"+((v.temporarios||0)?(" · "+v.temporarios+" em 72h"):"");
      sel.appendChild(o);
    });
    sel.onchange=function(){ cvCdfun=parseInt(sel.value,10); carregarCv(); };
    $("cv-q").addEventListener("input",function(){ clearTimeout(tCv); tCv=setTimeout(carregarCv,280); });
    $("cv-filtro").addEventListener("change",pintaCv);
    if((d.itens||[]).length){ cvCdfun=parseInt(sel.value,10); carregarCv(); }
    else $("cv-resumo").textContent="Nenhuma visitadora ativa.";
  }
  async function carregarCv(){
    if(cvCdfun==null)return;
    $("cv-carregando").hidden=false;
    var d=await rpc("admin_visitadora_cartela",{p_cdfun:cvCdfun,p_busca:$("cv-q").value.trim(),p_limite:2000});
    $("cv-carregando").hidden=true;
    if(!d||!d.ok){ $("cv-lista").innerHTML='<p class="adm-meta">Não foi possível carregar a carteira.</p>'; return; }
    cvItens=d.itens||[]; var r=d.resumo||{};
    $("cv-resumo").textContent=(r.total||0)+" na carteira · "+(r.definitivos||0)+" definitivos · "+(r.temporarios||0)+" liberados 72h · "+(r.com_email||0)+" com e-mail";
    pintaCv();
  }
  function pintaCv(){
    var f=$("cv-filtro").value, L=$("cv-lista"); L.innerHTML="";
    var vis=cvItens.filter(function(it){
      if(f==="temporario")return it.situacao==="temporario";
      if(f==="definitivo")return it.situacao==="definitivo";
      if(f==="sem")return it.situacao==="novo"||it.situacao==="inativo";
      return true;
    });
    vis.forEach(function(it){ L.appendChild(linhaCartela(it,cvCdfun)); });
    if(!vis.length)L.innerHTML='<p class="adm-meta">Nenhum prescritor neste filtro.</p>';
  }

  // ---------- Sair ----------
  function sair(){limparSessao();sessao=null;location.hash="";$("app").hidden=true;$("visor").hidden=true;$("modal-acesso").hidden=true;$("nav").hidden=true;$("view-admin").hidden=true;$("view-cartela").hidden=true;$("view-protocolos").hidden=false;viewAtual="protocolos";adminCarregado=false;cartelaCarregada=false;cartelaItens=[];cvCarregado=false;cvItens=[];cvCdfun=null;$("tela-login").hidden=false;$("passo-cod").hidden=true;$("passo-id").hidden=false}
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
// App versionado no repositório: a Edge Function portal-app serve este arquivo,
// então atualizar o portal é só `git push` (o site tem apenas o carregador).
const dirPortal = path.join(raiz, "portal");
fs.mkdirSync(dirPortal, { recursive: true });
fs.writeFileSync(path.join(dirPortal, "app.html"), APP);

// robots.txt — portal restrito à classe prescritora
fs.writeFileSync(
  path.join(dirSaida, "robots.txt"),
  "# Portal do Prescritor — Medicinal (acesso restrito à classe prescritora)\nUser-agent: *\nDisallow: /\n",
);

console.log("✓ portal: saida/index.html (app com login + guia do banco) e saida/robots.txt");
