const PIX_KEY = "21 971963818";
const SCRIPT_URL = "COLE_AQUI_SEU_URL_DO_APPS_SCRIPT";

// Valores personalizados
const valoresProdutos = {
  "Micro-ondas": 100, "Fogão": 100, "Armário de cozinha": 100, "Geladeira": 100, 
  "Painel para TV": 100, "Sofá": 100, "Televisão": 100, "Ar-condicionado": 100, 
  "Armário": 100, "Colchão de casa D20": 100, "Sapateira": 100, "Máquina de lavar": 100, 
  "Aspirador de pó": 100, "Sanduicheira": 170, "Liquidificador": 170, "Mixer": 170,
  "Jogo de canecas": 75, "Jogo de pratos de porcelanato": 100, "Utensílios de silicone":50,
  "Boleira de vidro":50, "Garrafa térmica":55, "Escorredor de louça de parede":60,
  "Escorredores de inox":70, "Talheres":60, "Potes herméticos J1":90, "Potes herméticos J2":105,
  "Jogo de copos de vidro":65, "Jogo de tabuleiros":85, "Jogo de pirex":100, "Ralador":50,
  "Tábua de inox":50, "Lixeiras":55, "Suporte para papel higiênico":55, "Kits suporte de toalha":75,
  "Espelho":80, "Toalhas de banho":100, "Toalhas de rosto":50, "Kit porta algodão, escova e cotonete + saboneteira":70,
  "Cortina":100, "Tapete":70, "Capa de almofada":90, "Edredom":120, "2 jogos de lençol":70,
  "Travesseiros":75, "Cabeceira":60, "Capa de colchão impermeável":50, "Sexto de roupa":50,
  "Mope":50, "Ferro de passar roupa":110, "Tábua de passar roupa":100, "Varal de teto":65,
  "Varal de chão":90, "Panela de pressão":150, "Jogo de panelas":100
};

// Caminho das imagens
const imagensProdutos = {
  "Micro-ondas": "imagens/MICROONDAS.jpg", "Fogão": "imagens/FOGAO.jpg", "Armário de cozinha": "imagens/ARMARIODECOZINHA.jpg",
  "Geladeira": "imagens/GELADEIRA.jpg", "Painel para TV": "imagens/PAINELPARATV.jpg", "Sofá": "imagens/SOFÁ.jpg",
  "Televisão": "imagens/TELEVISÃO.jpg", "Ar-condicionado": "imagens/ARCONDICIONADO.jpg", "Armário": "imagens/ARMARIO.jpg",
  "Colchão de casa D20": "imagens/COLCHAO.jpg", "Sapateira": "imagens/SAPATEIRA.jpg", "Máquina de lavar": "imagens/MAQUINADELAVAR.jpeg",
  "Aspirador de pó": "imagens/ASPIRADORDEPO.jpg", "Sanduicheira": "imagens/SANDUUICHEIRA.jpg", "Liquidificador": "imagens/LIQUIDIFICADOR.jpg",
  "Mixer": "imagens/MIXER.jpg", "Jogo de canecas": "imagens/JOGODECANECAS.jpg", "Jogo de pratos de porcelanato": "imagens/JOGODEPRATOSPORCELANADO.jpg",
  "Utensílios de silicone": "imagens/UTENCILIOSDESILICONE.jpg", "Boleira de vidro": "imagens/BOLEIRADEVIDRO.jpg", "Garrafa térmica": "imagens/GARRAFATERMICA.jpg",
  "Escorredor de louça de parede": "imagens/ESCORREDORDELOUÇADEPARADE.jpg", "Escorredores de inox": "imagens/ESCORREDORDEINOX.jpeg", "Talheres": "imagens/TALHERES.jpg",
  "Potes herméticos J1": "imagens/POTESHERMETICOSJ1.jpg", "Potes herméticos J2": "imagens/POTESHERMETICOSJ2.jpg", "Jogo de copos de vidro": "imagens/JOGODECOPOSDEVIDRO.jpg",
  "Jogo de tabuleiros": "imagens/JOGODETABULEIROS.jpg", "Jogo de pirex": "imagens/JOGODEPIREX.jpg", "Ralador": "imagens/RALADOR.jpg",
  "Tábua de inox": "imagens/TABUADEINOX.jpg", "Lixeiras": "imagens/LIXEIRA.jpeg", "Suporte para papel higiênico": "imagens/SUPORTEHIGIENICO.jpeg",
  "Kits suporte de toalha": "imagens/KITSUPORTEDETOALHA.jpg", "Espelho": "imagens/ESPELHO.jpg", "Toalhas de banho": "imagens/TOALHASDEBANHO.jpg",
  "Toalhas de rosto": "imagens/TOALHASDEROSTO.jpg", "Kit porta algodão, escova e cotonete + saboneteira": "imagens/KITPORTAALGODAO.jpg",
  "Cortina": "imagens/CORTINA.jpg", "Tapete": "imagens/TAPETE.jpg", "Capa de almofada": "imagens/CAPADEALMOFADA.jpg", "Edredom": "imagens/EDREDOM.jpg",
  "2 jogos de lençol": "imagens/JOGODELENÇOL.jpg", "Travesseiros": "imagens/TRAVESSEIRO.jpeg", "Cabeceira": "imagens/CABECEIRA.jpg",
  "Capa de colchão impermeável": "imagens/CAPADECOLCHAO.jpg", "Sexto de roupa": "imagens/SEXTODEROUPA.jpg", "Mope": "imagens/MOPE.jpg",
  "Ferro de passar roupa": "imagens/FERRODEPASSAR.jpg", "Tábua de passar roupa": "imagens/TABUADEPASSAR.jpg", "Varal de teto": "imagens/VARALTETO.jpg",
  "Varal de chão": "imagens/VARALCHAO.jpg", "Panela de pressão": "imagens/PANELADEPRESSAO.jpg", "Jogo de panelas": "imagens/JOGODEPANELA.jpg"
};

const catalogo = document.getElementById("catalogo");
let escolhidos = JSON.parse(localStorage.getItem("itensEscolhidos")) || [];

function criarCards(){
  let id=1;
  Object.keys(valoresProdutos).forEach(nome=>{
    const card = criarCard(nome, id, 1);
    catalogo.appendChild(card);
    id++;
  });
}

function criarCard(nome,id,limite){
  const div = document.createElement("div");
  div.className = "card";
  div.dataset.id = id;
  div.dataset.nome = nome;
  div.dataset.limite = limite;

  const imgSrc = imagensProdutos[nome] || `https://via.placeholder.com/300x180?text=${encodeURIComponent(nome)}`;
  const inputHTML = limite>1 ? `<input type="number" id="quantidade-${id}" value="1" min="1" max="${limite}">` : '';
  
  div.innerHTML = `
    <img src="${imgSrc}" alt="${nome}">
    <div class="card-content">
      <h3>${nome}</h3>
      <p>Valor unitário: R$ ${valoresProdutos[nome].toFixed(2).replace('.',',')}</p>
      ${inputHTML}
      <div style="display:flex;gap:.5rem;justify-content:center;align-items:center">
        <button onclick="abrirConfirm(this)">Escolher</button>
      </div>
    </div>
  `;
  if(escolhidos.includes(String(id))){
    const btn = div.querySelector("button");
    btn.textContent = "Escolhido";
    btn.disabled = true;
    div.style.opacity = 0.6;
  }
  return div;
}

const confirmModal = document.getElementById('confirmModal');
const pixModal = document.getElementById('pixModal');
let currentSelection = null;

function abrirConfirm(btn){
  const card = btn.closest('.card');
  const id = card.dataset.id;
  const nome = card.dataset.nome;
  const quantidade = card.querySelector('input') ? parseInt(card.querySelector('input').value) : 1;
  const comprador = document.getElementById("nomeComprador").value.trim();
  if(!comprador){ alert("Informe seu nome antes de escolher."); return; }

  currentSelection = {id, nome, quantidade, comprador};
  document.getElementById('conf-nome').textContent = `Produto: ${nome}`;
  document.getElementById('conf-qtd').textContent = `Quantidade: ${quantidade}`;
  document.getElementById('conf-unit').textContent = `Valor unitário: R$ ${valoresProdutos[nome].toFixed(2).replace('.',',')}`;
  document.getElementById('conf-total').textContent = `Total: R$ ${(valoresProdutos[nome]*quantidade).toFixed(2).replace('.',',')}`;
  document.getElementById('conf-comprador').textContent = `Comprador: ${comprador}`;
  document.getElementById('pix-key').textContent = PIX_KEY;
  document.getElementById('conf-msg').textContent = '';
  confirmModal.classList.add('active');
}

function fecharConfirm(){ confirmModal.classList.remove('active'); currentSelection = null; }
function abrirPixModal(){ pixModal.classList.add('active'); }
function fecharPix(){ pixModal.classList.remove('active'); }
function copiarPix(){ navigator.clipboard.writeText(PIX_KEY); }

async function confirmarCompra(){
  if(!currentSelection) return;
  const {id,nome,quantidade,comprador} = currentSelection;
  document.getElementById('conf-msg').textContent='Registrando...';
  try {
    const res = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: new URLSearchParams({ nome, quantidade:String(quantidade), comprador })
    });
    const data = await res.json();
    if(data.status==='ok'){
      escolhidos.push(id);
      localStorage.setItem('itensEscolhidos', JSON.stringify(escolhidos));
      marcarComoEscolhido(id);
      fecharConfirm();
      abrirPixModal();
    } else {
      document.getElementById('conf-msg').textContent = data.mensagem || 'Erro ao registrar.';
    }
  } catch(err){
    console.error(err);
    document.getElementById('conf-msg').textContent='Erro de comunicação.';
  }
}

function marcarComoEscolhido(id){
  const card = document.querySelector(`.card[data-id="${id}"]`);
  if(!card) return;
  const btn = card.querySelector('button');
  btn.textContent='Escolhido'; btn.disabled=true; card.style.opacity=0.6;
}

criarCards();
