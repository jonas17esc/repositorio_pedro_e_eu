              // ══════════════ DATA ══════════════
const VIDEOS=[
  {id:1,cat:'Plantio',catColor:'#dcfce7',catTextColor:'#16a34a',title:'Como Plantar o Cajueiro do Zero',desc:'Aprenda o passo a passo completo do plantio do cajueiro: da escolha do local ao cuidado com as mudas nos primeiros meses.',videoId:'Vc_o1vG6ueY',dur:'4 min'},
  {id:2,cat:'Pragas',catColor:'#fee2e2',catTextColor:'#dc2626',title:'Mosca-da-fruta: Identificação e Controle',desc:'A mosca-da-fruta é uma das pragas mais prejudiciais ao cajueiro. Aprenda a identificar e controlar com eficiência.',videoId:'TPQA3uCecvU',dur:'13 min'},
  {id:3,cat:'Pragas',catColor:'#fee2e2',catTextColor:'#dc2626',title:'Pragas do Cajueiro: Guia Completo',desc:'Conheça todas as principais pragas que atacam o cajueiro no Nordeste brasileiro e as melhores estratégias de controle.',videoId:'hJpOhm_Wjn8',dur:'11 min'},
  {id:4,cat:'Pragas',catColor:'#fee2e2',catTextColor:'#dc2626',title:'Manejo Integrado de Pragas (MIP)',desc:'O MIP é a abordagem mais moderna e sustentável para proteger seu cajueiral com menor uso de defensivos.',videoId:'u_ZS58PH6uo',dur:'9 min'},
  {id:5,cat:'Colheita',catColor:'#fef3c7',catTextColor:'#d97706',title:'Colheita do Caju: Momento Certo e Técnicas',desc:'Saber o momento ideal de colher é fundamental para garantir a qualidade e reduzir perdas.',videoId:'c6YWjB1_cAM',dur:'8 min'},
  {id:6,cat:'Processamento',catColor:'#fed7aa',catTextColor:'#ea580c',title:'Processamento da Castanha de Caju',desc:'Do campo à amêndoa de qualidade: aprenda todo o processo de beneficiamento da castanha.',videoId:'2N5maJrDMdc',dur:'1 min'},
  {id:7,cat:'Irrigação',catColor:'#dbeafe',catTextColor:'#2563eb',title:'Irrigação do Cajueiro: Quando e Quanto',desc:'A irrigação suplementar pode aumentar a produtividade do cajueiro em até 40% em regiões semiáridas.',videoId:'dAO3bhovIuk',dur:'5 min'},
  {id:8,cat:'Negócios',catColor:'#f3e8ff',catTextColor:'#7c3aed',title:'Como Vender Caju e Aumentar seu Lucro',desc:'Estratégias de comercialização, acesso a mercados e como agregar valor ao caju.',videoId:'eXLY8d538xE',dur:'6 min'},
];

const COURSES=[...VIDEOS]; // same data, shown as courses with YouTube links

// ══════════════ NAVIGATION ══════════════
// ══════════════ CLIMA REAL (Open-Meteo) ══════════════
async function fetchWeather(){
  const WX_CODES={0:'☀️ Céu limpo',1:'🌤️ Principalmente limpo',2:'⛅ Parcialmente nublado',3:'☁️ Nublado',45:'🌫️ Névoa',48:'🌫️ Névoa com gelo',51:'🌦️ Garoa leve',53:'🌦️ Garoa moderada',55:'🌧️ Garoa forte',61:'🌧️ Chuva leve',63:'🌧️ Chuva moderada',65:'🌧️ Chuva forte',71:'🌨️ Neve leve',80:'🌦️ Pancadas leves',81:'🌧️ Pancadas moderadas',82:'⛈️ Pancadas fortes',95:'⛈️ Trovoada',99:'⛈️ Trovoada com granizo'};
  try{
    const url='https://api.open-meteo.com/v1/forecast?latitude=-4.27&longitude=-41.78&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation&daily=precipitation_sum&timezone=America%2FFortaleza&forecast_days=1';
    const r=await fetch(url);
    const d=await r.json();
    const c=d.current;
    const temp=Math.round(c.temperature_2m);
    const hum=c.relative_humidity_2m;
    const wind=Math.round(c.wind_speed_10m);
    const rain=c.precipitation??0;
    const cond=WX_CODES[c.weather_code]??'🌡️ Clima variável';
    document.getElementById('wx-temp').textContent=temp+'°C';
    document.getElementById('wx-cond').textContent=cond;
    document.getElementById('wx-hum').textContent='💧 '+hum+'% Umidade';
    document.getElementById('wx-wind').textContent='💨 '+wind+' km/h';
    document.getElementById('wx-rain').textContent='🌧️ '+rain.toFixed(1)+' mm chuva hoje';
  }catch(e){
    document.getElementById('wx-cond').textContent='⚠️ Clima indisponível';
  }
}
fetchWeather();
setInterval(fetchWeather,10*60*1000);

function go(page){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('nav a').forEach(a=>a.classList.remove('active'));
  document.getElementById('page-'+page).classList.add('active');
  const idx={'dashboard':0,'variedades':1,'plantacoes':2,'diagnostico':3,'marketplace':4,'financeiro':5,'rastreabilidade':6,'estoque':7,'alertas':8,'mensagens':9,'academia':10,'informacao':11};
  const links=document.querySelectorAll('nav a');
  if(idx[page]!==undefined)links[idx[page]].classList.add('active');
  if(page==='financeiro')initCharts();
  if(page==='academia')renderVideos('Todos');
  if(page==='mensagens'){document.getElementById('page-mensagens').style.display='flex';loadContacts();}else{const pm=document.getElementById('page-mensagens');if(pm)pm.style.display='none';}
  window.scrollTo?window.scrollTo(0,0):null;
  document.getElementById('content').scrollTop=0;
}

// ══════════════ TABS ══════════════
function switchTab(btn,pane){
  btn.closest('.tabs').querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.tab-pane').forEach(p=>p.classList.remove('active'));
  document.getElementById(pane).classList.add('active');
}

// ══════════════ CHARTS ══════════════
let chartsInitialized=false;
function initCharts() {
  if (chartsInitialized) return;
  chartsInitialized = true;

  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
  const income = [32000, 28000, 45000, 38000, 52000, 60000];
  const expenses = [18000, 15000, 22000, 19000, 25000, 28000];
  const profit = income.map((v, i) => v - expenses[i]);

  // Gráfico 1: Linha - Receitas vs Custos
  new Chart(document.getElementById('chartFinancial'), {
    type: 'line',
    data: {
      labels: months,
      datasets: [
        {
          label: 'Receitas',
          data: income,
          borderColor: '#16a34a',
          backgroundColor: 'rgba(22,163,74,.1)',
          fill: true,
          tension: 0.4,
          borderWidth: 2.5,
          pointRadius: 0
        },
        {
          label: 'Custos',
          data: expenses,
          borderColor: '#dc2626',
          backgroundColor: 'rgba(220,38,38,.08)',
          fill: true,
          tension: 0.4,
          borderWidth: 2.5,
          pointRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'top' } },
      scales: {
        x: { grid: { display: false } },
        y: {
          grid: { color: 'rgba(0,0,0,.05)' },
          ticks: { callback: v => 'R$ ' + (v / 1000) + 'k' }
        }
      }
    }
  });

  // Gráfico 2: Barras - Lucro
  new Chart(document.getElementById('chartProfit'), {
    type: 'bar',
    data: {
      labels: months,
      datasets: [{
        label: 'Lucro',
        data: profit,
        backgroundColor: profit.map(v => v >= 0 ? '#16a34a' : '#dc2626'),
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false } },
        y: {
          grid: { color: 'rgba(0,0,0,.05)' },
          ticks: { callback: v => 'R$ ' + (v / 1000) + 'k' }
        }
      }
    }
  });

  // Gráfico 3: Doughnut - Despesas por categoria
  new Chart(document.getElementById('chartExpense'), {
    type: 'doughnut',
    data: {
      labels: ['Insumos', 'Mão de Obra', 'Equipamentos', 'Irrigação', 'Outros'],
      datasets: [{
        data: [35, 30, 15, 12, 8],
        backgroundColor: ['#dc2626', '#f97316', '#eab308', '#3b82f6', '#8b5cf6'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom' } }
    }
  });
}
  necrose_ramos:['necrose','galho','seco','mort','descend','murcho','murcha','colapso'],
  queda_flor:['flor','flores','queda','cair','caindo','frutificação','baixa'],
  folhas_doentes:['folha nova','lançamento','jovem','brotação','broto'],
  alta_umidade:['chuva','umidade','úmido','molhado','molhada','estação chuvosa'],
};

let selectedPart = 'folha';

function setPart(btn, part){
  document.querySelectorAll('#part-pills .pill').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  selectedPart = part;
  autoAnalyze();
}

function autoAnalyze(){
  const checked = Array.from(document.querySelectorAll('.diag-cb:checked')).map(c=>c.value);
  if(checked.length === 0) return;
  if(checked.length >= 1) runDiagnosis();
}

function getSymptomScores(checkedSymptoms, textKeywords=[]){
  return EMBRAPA_DISEASES.map(disease => {
    let score = 0;
    let matched = [];
    checkedSymptoms.forEach(sym => {
      if(disease.symptomWeights[sym]){
        score += disease.symptomWeights[sym];
        matched.push(sym);
      }
    });
    // text keyword bonus
    textKeywords.forEach(kw => {
      Object.entries(KEYWORD_MAP).forEach(([sym, words]) => {
        if(words.some(w => kw.includes(w) || w.includes(kw))){
          if(disease.symptomWeights[sym] && !matched.includes(sym)){
            score += disease.symptomWeights[sym] * 0.7;
            matched.push(sym+'_text');
          }
        }
      });
    });
    // Part affinity bonus
    if(disease.partsAffected.includes(selectedPart) || selectedPart==='todos') score *= 1.15;
    // Clone susceptibility bonus
    const clone = document.getElementById('clone-select').value;
    if(clone && disease.resistantClones[clone]==='S') score *= 1.2;
    if(clone && disease.resistantClones[clone]==='R') score *= 0.6;
    return {disease, score: Math.round(score), matched};
  }).sort((a,b)=>b.score-a.score);
}

function renderResults(scored, chatMode=false){
  const box = document.getElementById('diag-result-box');
  const max = scored[0]?.score || 1;
  if(max === 0){
    box.innerHTML=`<div style="text-align:center;padding:32px;color:var(--muted)"><div style="font-size:40px;opacity:.3;margin-bottom:12px">🤔</div><p style="font-size:14px;font-weight:600">Sintomas não identificados</p><p style="font-size:13px;margin-top:6px">Tente selecionar sintomas mais específicos ou consultar um técnico agrícola.</p></div>`;
    return;
  }

  const clone = document.getElementById('clone-select').value;
  const cloneNote = clone ? `<div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:10px 14px;margin-bottom:16px;font-size:12px;color:#92400e"><strong>🌱 Clone: ${clone}</strong> — resistência considerada na análise</div>` : '';

  box.innerHTML = `
    <div style="padding:4px">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid var(--border)">
        <div style="width:40px;height:40px;border-radius:12px;background:rgba(61,107,47,.1);display:flex;align-items:center;justify-content:center;font-size:20px">🤖</div>
        <div>
          <strong style="font-size:14px;display:block">Análise Concluída</strong>
          <span style="font-size:12px;color:var(--muted)">${chatMode?'Busca por texto':'Sintomas selecionados'} · Fonte: Embrapa 2019</span>
        </div>
        <div style="margin-left:auto"><span class="badge badge-green">IA Ativa</span></div>
      </div>
      ${cloneNote}
      <p style="font-size:12px;color:var(--muted);margin-bottom:16px;text-transform:uppercase;letter-spacing:.05em;font-weight:700">Probabilidade por Doença</p>
      ${scored.map((s,i)=>{
        const pct = Math.min(100, Math.round((s.score/max)*100));
        if(pct < 5 && i > 0) return '';
        const d = s.disease;
        const urgColors = {alta:'#dc2626',media:'#d97706',baixa:'#2563eb'};
        const cloneReact = clone ? d.resistantClones[clone] : null;
        const cloneBadge = cloneReact && cloneReact!=='-' ? `<span class="clone-tag ${cloneReact}" style="margin-left:8px">Seu clone: ${cloneReact==='R'?'Resistente':cloneReact==='S'?'Susceptível':cloneReact==='MR'?'Mod. Resistente':'Intermediário'}</span>` : '';
        return `
        <div class="diag-disease-card" style="background:${d.bg};border-color:${d.border};${i===0?'box-shadow:0 4px 20px rgba(0,0,0,.1)':'opacity:.85'}">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px">
            <div>
              <div style="font-size:22px;margin-bottom:4px">${d.emoji}</div>
              <strong style="font-size:16px;color:${d.color}">${d.name}</strong>
              ${i===0?'<span class="badge" style="background:'+d.color+';color:#fff;margin-left:8px;font-size:10px">MAIS PROVÁVEL</span>':''}
              ${cloneBadge}
              <div style="font-size:11px;color:var(--muted);font-style:italic;margin-top:2px">${d.sci}</div>
            </div>
            <div style="text-align:right">
              <div style="font-size:26px;font-weight:900;color:${d.color}">${pct}%</div>
              <div style="font-size:10px;color:var(--muted)">probabilidade</div>
            </div>
          </div>
          <div class="disease-bar"><div class="disease-bar-fill" style="width:${pct}%;background:${d.color}"></div></div>
          ${i===0?`
          <p style="font-size:13px;color:var(--muted);line-height:1.6;margin:14px 0">${d.desc}</p>
          <div style="margin-bottom:14px">
            <strong style="font-size:12px;text-transform:uppercase;letter-spacing:.05em;color:var(--muted)">🧪 Controle Recomendado</strong>
            <div style="margin-top:10px;display:flex;flex-direction:column;gap:8px">
              ${d.controls.map(c=>`<div style="display:flex;align-items:flex-start;gap:10px;background:rgba(255,255,255,.7);padding:10px 12px;border-radius:10px"><span style="font-size:16px">${c.icon}</span><span style="font-size:13px;line-height:1.4">${c.text}</span></div>`).join('')}
            </div>
          </div>
          <div>
            <strong style="font-size:12px;text-transform:uppercase;letter-spacing:.05em;color:var(--muted)">🌱 Clones Resistentes Recomendados</strong>
            <div style="margin-top:8px;display:flex;flex-wrap:wrap">
              ${d.recommended.map(c=>`<span class="clone-tag R">${c}</span>`).join('')}
            </div>
          </div>
          <div style="margin-top:14px;padding-top:12px;border-top:1px solid ${d.border};font-size:11px;color:var(--muted)">📚 ${d.source}</div>
          <div style="display:flex;gap:8px;margin-top:14px">
            <button onclick="go('alertas')" class="btn" style="flex:1;justify-content:center;background:${d.color}">🔔 Criar Alerta</button>
            <button onclick="showCloneTable()" class="btn btn-outline" style="flex:1;justify-content:center;font-size:13px">🌱 Ver Tabela Clones</button>
          </div>
          `:''}
        </div>`;
      }).join('')}
    </div>`;
}

function runDiagnosis(){
  const checked = Array.from(document.querySelectorAll('.diag-cb:checked')).map(c=>c.value);
  if(!checked.length){ alert('Selecione pelo menos um sintoma.'); return; }
  const scored = getSymptomScores(checked);
  renderResults(scored, false);
}

function chatDiagnose(){
  const input = document.getElementById('diag-chat-input');
  const text = input.value.trim().toLowerCase();
  if(!text){ alert('Digite uma descrição dos sintomas.'); return; }
  const words = text.split(/[\s,\.]+/).filter(w=>w.length>2);
  const scored = getSymptomScores([], words);
  // Also auto-check matching checkboxes
  Object.entries(KEYWORD_MAP).forEach(([sym, kws])=>{
    if(words.some(w=> kws.some(k=>k.includes(w)||w.includes(k)))){
      const cb = document.querySelector(`.diag-cb[value="${sym}"]`);
      if(cb) cb.checked = true;
    }
  });
  renderResults(scored, true);
}

function quickSearch(term){
  document.getElementById('diag-chat-input').value = term;
  chatDiagnose();
}

function showCloneTable(){
  const rows = [
    ['CCP 06','R','R','R','S'],
    ['CCP 09','S','S','S','I'],
    ['CCP 76','R','S','S','S'],
    ['CCP 1001','R','S','S','R'],
    ['EMBRAPA 50','S','MR','—','I'],
    ['EMBRAPA 51','R','MR','MR','S'],
    ['BRS 189','R','S','S','S'],
    ['BRS 226','R','MR','R','I'],
    ['BRS 253','R','R','—','R'],
    ['BRS 265','S','R','S','S'],
    ['BRS 274','S','S','MR','R'],
    ['BRS 275','R','R','S','R'],
    ['FAGA 1','S','R','S','S'],
    ['FAGA 11','S','R','S','I'],
  ];
  const tagColors={R:'background:#dcfce7;color:#16a34a',S:'background:#fee2e2;color:#dc2626',MR:'background:#fef3c7;color:#d97706',I:'background:#dbeafe;color:#2563eb','—':'background:#f3f4f6;color:#9ca3af'};
  document.getElementById('clone-table-body').innerHTML = rows.map(r=>`<tr>
    <td style="font-weight:700">${r[0]}</td>
    ${r.slice(1).map(v=>`<td><span style="display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;${tagColors[v]||''}">${v}</span></td>`).join('')}
  </tr>`).join('');
  document.getElementById('clone-modal').classList.add('open');
}

function closeCloneModal(){
  document.getElementById('clone-modal').classList.remove('open');
}

// ══════════════ AUTH ══════════════
const API='/api';
let authToken=localStorage.getItem('cajutec_token')||null;
let authUser=JSON.parse(localStorage.getItem('cajutec_user')||'null');

function switchLoginTab(tab){
  document.querySelectorAll('.login-tab').forEach(t=>t.classList.remove('active'));
  event.target.classList.add('active');
  document.getElementById('login-panel').style.display=tab==='login'?'flex':'none';
  document.getElementById('register-panel').style.display=tab==='register'?'flex':'none';
  document.getElementById('login-error').classList.remove('show');
}
function showLoginError(msg){const el=document.getElementById('login-error');el.textContent=msg;el.classList.add('show');}

async function doLogin(){
  const email=document.getElementById('login-email').value.trim();
  const pass=document.getElementById('login-pass').value;
  if(!email||!pass){showLoginError('Preencha e-mail e senha.');return;}
  const btn=event.target;btn.disabled=true;btn.textContent='Entrando...';
  try{
    const r=await fetch(API+'/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password:pass})});
    const d=await r.json();
    if(!r.ok){showLoginError(d.error||'Erro ao entrar.');btn.disabled=false;btn.textContent='Entrar →';return;}
    authToken=d.token;authUser=d.user;
    localStorage.setItem('cajutec_token',authToken);
    localStorage.setItem('cajutec_user',JSON.stringify(authUser));
    onLogin();
  }catch{showLoginError('Erro de conexão com o servidor.');btn.disabled=false;btn.textContent='Entrar →';}
}

async function doRegister(){
  const name=document.getElementById('reg-name').value.trim();
  const email=document.getElementById('reg-email').value.trim();
  const pass=document.getElementById('reg-pass').value;
  if(!name||!email||!pass){showLoginError('Preencha todos os campos.');return;}
  const btn=event.target;btn.disabled=true;btn.textContent='Criando conta...';
  try{
    const r=await fetch(API+'/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,email,password:pass})});
    const d=await r.json();
    if(!r.ok){showLoginError(d.error||'Erro ao cadastrar.');btn.disabled=false;btn.textContent='Criar conta →';return;}
    authToken=d.token;authUser=d.user;
    localStorage.setItem('cajutec_token',authToken);
    localStorage.setItem('cajutec_user',JSON.stringify(authUser));
    onLogin();
  }catch{showLoginError('Erro de conexão com o servidor.');btn.disabled=false;btn.textContent='Criar conta →';}
}

function onLogin(){
  document.getElementById('login-screen').classList.add('hidden');
  const initials=(authUser.name||'U').split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
  document.getElementById('topbar-avatar').textContent=initials;
  document.getElementById('topbar-avatar').title=authUser.name+' — '+authUser.email+'\n(clique para sair)';
  startMsgPolling();
}

function logout(){
  if(!confirm('Deseja sair da conta?'))return;
  localStorage.removeItem('cajutec_token');localStorage.removeItem('cajutec_user');
  authToken=null;authUser=null;
  document.getElementById('login-screen').classList.remove('hidden');
}

// Check if already logged in
if(authToken&&authUser){onLogin();}

// ══════════════ MENSAGENS ══════════════
let allContacts=[];
let activeContact=null;
let msgPollingInterval=null;

function apiHeaders(){return{Authorization:'Bearer '+authToken,'Content-Type':'application/json'};}

async function loadContacts(){
  if(!authToken)return;
  try{
    const r=await fetch(API+'/messages/users',{headers:apiHeaders()});
    const d=await r.json();
    allContacts=d.users||[];
    renderContacts(allContacts);
  }catch{}
}

function renderContacts(list){
  const el=document.getElementById('contacts-list');
  if(!list.length){el.innerHTML='<p style="padding:16px;color:var(--muted);font-size:13px;text-align:center">Nenhum agricultor cadastrado ainda.</p>';return;}
  el.innerHTML=list.map(u=>`
    <div onclick="openChat(${u.id},'${escHtml(u.name)}','${escHtml(u.role||'agricultor')}')"
      style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;cursor:pointer;transition:.15s;${activeContact?.id===u.id?'background:rgba(61,107,47,.1);':''}"
      onmouseover="this.style.background='rgba(61,107,47,.07)'" onmouseout="this.style.background='${activeContact?.id===u.id?'rgba(61,107,47,.1)':''}'"
      id="contact-${u.id}">
      <div style="width:38px;height:38px;border-radius:50%;background:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:15px;flex-shrink:0">${initials(u.name)}</div>
      <div style="flex:1;min-width:0">
        <div style="font-weight:600;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escHtml(u.name)}</div>
        <div style="font-size:12px;color:var(--muted)">${escHtml(u.role||'Agricultor')}</div>
      </div>
      <span id="unread-${u.id}" style="display:none;background:#dc2626;color:#fff;border-radius:999px;font-size:10px;font-weight:700;padding:2px 7px"></span>
    </div>`).join('');
  fetchUnread();
}

function filterContacts(){
  const q=document.getElementById('msg-search').value.toLowerCase();
  renderContacts(q?allContacts.filter(u=>u.name.toLowerCase().includes(q)||u.email.toLowerCase().includes(q)):allContacts);
}

function initials(name){return(name||'?').split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();}
function escHtml(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

async function openChat(userId,name,role){
  activeContact={id:userId,name,role};
  document.getElementById('chat-placeholder').style.display='none';
  const ca=document.getElementById('chat-area');ca.style.display='flex';ca.style.flexDirection='column';
  document.getElementById('chat-avatar').textContent=initials(name);
  document.getElementById('chat-name').textContent=name;
  document.getElementById('chat-role').textContent='🌿 '+role;
  await loadMessages();
  document.getElementById('msg-input').focus();
}

async function loadMessages(){
  if(!activeContact||!authToken)return;
  try{
    const r=await fetch(API+'/messages/conversation/'+activeContact.id,{headers:apiHeaders()});
    const d=await r.json();
    renderMessages(d.messages||[]);
    fetchUnread();
  }catch{}
}

function renderMessages(msgs){
  const el=document.getElementById('chat-messages');
  if(!msgs.length){el.innerHTML='<div style="text-align:center;color:var(--muted);font-size:13px;padding:24px">Nenhuma mensagem ainda.<br>Diga olá! 👋</div>';return;}
  const myId=authUser.id;
  el.innerHTML=msgs.map(m=>{
    const mine=m.senderId===myId;
    const time=new Date(m.createdAt).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
    return`<div style="display:flex;justify-content:${mine?'flex-end':'flex-start'};margin:2px 0">
      <div style="max-width:72%;padding:10px 14px;border-radius:${mine?'18px 18px 4px 18px':'18px 18px 18px 4px'};background:${mine?'var(--primary)':'#fff'};color:${mine?'#fff':'var(--text)'};box-shadow:0 1px 4px rgba(0,0,0,.08);font-size:14px;line-height:1.5">
        ${escHtml(m.content)}
        <div style="font-size:10px;opacity:.6;margin-top:4px;text-align:right">${time}${mine&&m.read?' ✓✓':mine?' ✓':''}</div>
      </div></div>`;
  }).join('');
  el.scrollTop=el.scrollHeight;
}

async function sendMsg(){
  const input=document.getElementById('msg-input');
  const text=input.value.trim();
  if(!text||!activeContact||!authToken)return;
  input.value='';
  try{
    await fetch(API+'/messages/send/'+activeContact.id,{method:'POST',headers:apiHeaders(),body:JSON.stringify({content:text})});
    await loadMessages();
  }catch{}
}

function msgKeydown(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMsg();}}

async function fetchUnread(){
  if(!authToken)return;
  try{
    const r=await fetch(API+'/messages/unread',{headers:apiHeaders()});
    const d=await r.json();
    let total=0;
    (d.unread||[]).forEach(row=>{
      const el=document.getElementById('unread-'+row.senderId);
      if(el){el.style.display='inline';el.textContent=row.count;total+=row.count;}
    });
    const badge=document.getElementById('msg-badge');
    if(total>0){badge.style.display='inline';badge.textContent=total;}else{badge.style.display='none';}
  }catch{}
}

function startMsgPolling(){
  if(msgPollingInterval)clearInterval(msgPollingInterval);
  msgPollingInterval=setInterval(()=>{
    fetchUnread();
    if(activeContact)loadMessages();
  },8000);
  fetchUnread();
}

// ══════════════ MAP ══════════════
let myLat=null,myLon=null;
function showMap(lat,lon,label){
  const delta=0.05;
  const bbox=`${lon-delta},${lat-delta},${lon+delta},${lat+delta}`;
  document.getElementById('map-modal-frame').src=`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
  document.getElementById('map-label').textContent=label;
  document.getElementById('map-coords').textContent=`${lat.toFixed(5)}, ${lon.toFixed(5)}`;
  document.getElementById('gmaps-link').href=`https://www.google.com/maps?q=${lat},${lon}`;
  document.getElementById('directions-link').href=`https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
  document.getElementById('map-modal').classList.add('open');
}
function closeMapModal(){document.getElementById('map-modal').classList.remove('open');document.getElementById('map-modal-frame').src='';}
async function showListingMap(location){
  try{
    const r=await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location+', Brasil')}&format=json&limit=1`);
    const d=await r.json();
    if(d.length)showMap(parseFloat(d[0].lat),parseFloat(d[0].lon),location);
    else window.open(`https://www.google.com/maps/search/${encodeURIComponent(location)}`,'_blank');
  }catch{window.open(`https://www.google.com/maps/search/${encodeURIComponent(location)}`,'_blank');}
}
function showMyMap(){if(myLat&&myLon)showMap(myLat,myLon,'Minha localização');}
function getLocation(){
  if(!navigator.geolocation){alert('Geolocalização não suportada.');return;}
  const btn=event.target;btn.textContent='📡 Obtendo...';btn.disabled=true;
  navigator.geolocation.getCurrentPosition(async pos=>{
    myLat=pos.coords.latitude;myLon=pos.coords.longitude;
    try{
      const r=await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${myLat}&lon=${myLon}&format=json&accept-language=pt-BR`);
      const d=await r.json();
      const city=d.address?.city||d.address?.town||d.address?.village||`${myLat.toFixed(4)}, ${myLon.toFixed(4)}`;
      const state=d.address?.state_district||d.address?.state||'';
      const label=state?`${city}, ${state}`:city;
      document.getElementById('loc-text').textContent=`📍 ${label}`;
    }catch{document.getElementById('loc-text').textContent=`📍 ${myLat.toFixed(4)}, ${myLon.toFixed(4)}`;}
    document.getElementById('view-loc-btn').style.display='flex';
    btn.textContent='🔄 Atualizar';btn.disabled=false;
    showMyMap();
  },err=>{
    alert(err.code===1?'Permissão negada. Permita a localização no navegador.':'Erro ao obter localização.');
    btn.textContent='📡 Usar minha localização';btn.disabled=false;
  },{timeout:10000,enableHighAccuracy:true});
}
{label:'Receitas',data:income,borderColor:'#16a34a',backgroundColor:'rgba(22,163,74,.1)',fill:true,tension:.4,borderWidth:2.5,pointRadius:0},
    {label:'Custos',data:expenses,borderColor:'#dc2626',backgroundColor:'rgba(220,38,38,.08)',fill:true,tension:.4,borderWidth:2.5,pointRadius:0}
  ]},options:{responsive:true,plugins:{legend:{position:'top'}},scales:{x:{grid:{display:false}},y:{grid:{color:'rgba(0,0,0,.05)'},ticks:{callback:v=>'R$'+(v/1000)+'k'}}}}});

  new Chart(document.getElementById('chartProfit'),{type:'bar',data:{labels:months,datasets:[{label:'Lucro',data:profit,backgroundColor:profit.map(v=>v>=0?'#16a34a':'#dc2626'),borderRadius:6}]},options:{responsive:true,plugins:{legend:{display:false}},scales:{x:{grid:{display:false}},y:{grid:{color:'rgba(0,0,0,.05)'},ticks:{callback:v=>'R$'+(v/1000)+'k'}}}}});
