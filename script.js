const PIX_KEY = "21 971963818";
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx68kIYLxZsN0eDyZfkCSLnRwEHjhArsEjKXdUyFrIJ2IAOIspf94n2jkqST2FOhZk19g/exec";

const valoresProdutos = {
  "Micro-ondas":100, "Fogão":100, "Armário de cozinha":100, "Geladeira":100, 
  "Painel para TV":100, "Sofá":100, "Televisão":100, "Ar-condicionado":100, 
  "Armário":100, "Colchão de casa D20":100, "Sapateira":100, "Máquina de lavar":100, 
  "Aspirador de pó":100, "Jogo de panelas":100, "Panela de pressão":150, "Capa de colchão impermeável":50,
  "2 jogos de lençol":70, "Kit porta algodão, escova e cotonete + saboneteira":70,
  "Sanduicheira":100, "Liquidificador":170, "Mixer":170, "Jogo de canecas":75,
  "Jogo de pratos de porcelanato":100, "Utensílios de silicone":50, "Boleira de vidro":50,
  "Garrafa térmica":55, "Escorredor de louça de parede":60, "Escorredores de inox":70,
  "Talheres":60, "Potes herméticos J1":90, "Potes herméticos J2":105, "Jogo de copos de vidro":65,
  "Jogo de tabuleiros":85, "Jogo de pirex":100, "Ralador":50, "Tábua de inox":50,
  "Lixeiras":55, "Suporte para papel higiênico":55, "Kits suporte de toalha":75,
  "Espelho":80, "Toalhas de banho":100, "Toalhas de rosto":50, "Cortina":100,
  "Tapete":70, "Capa de almofada":90, "Edredom":120, "Travesseiros":75,
  "Cabeceira":60, "Sexto de roupa":50, "Mope":50, "Ferro de passar roupa":110,
  "Tábua de passar roupa":100, "Varal de teto":65, "Varal de chão":90
};

// Imagens
const imagensProdutos = {};
Object.keys(valoresProdutos).forEach(prod => {
  imagensProdutos[prod] = `imagens/${prod.replace(/[^a-zA-Z0-9]/g,'')}.jpg`;
});

// Produtos com limite
const produtosComLimite = [
  {nome:"Micro-ondas", limite:6}, {nome:"Fogão", limite:10}, {nome:"Armário de cozinha", limite:5},
  {nome:"Geladeira", limite:15}, {nome:"Painel para TV", limite:2}, {nome:"Sofá", limite:10},
  {nome:"Televisão", limite:15}, {nome:"Ar-condicionado", limite:10}, {nome:"Armário", limite:10},
  {nome:"Colchão de casa D20", limite:3}, {nome:"Sapateira", limite:3}, {nome:"Máquina de lavar", limite:10},
  {nome:"Aspirador de pó", limite:3}, {nome:"Jogo de panelas", limite:6}
];

const produtosNormais = Object.keys(valoresProdutos).filter(p => !produtosComLimite.find(pc=>pc.nome===p));
const catalogo=document.getElementById("catalogo");
let escolhidos=JSON.parse(localStorage.getItem("itensEscolhidos"))||[];

function criarCards(){
  let id=1;
  produtosComLimite.forEach(prod=>{
    catalogo.appendChild(criarCard(prod.nome,id,prod.limite));
    id++;
  });
  produtosNormais.forEach(prod=>{
    catalogo.appendChild(criarCard(prod,id,1));
    id++;
  });
}

function criarCard(nome,id,limite){
  const div=document.createElement("div");
  div.className="card";
  div.dataset.id=id;
  div.dataset.nome=nome;
  div.dataset.limite=limite;

  let inputHTML = limite>1 ? `<input type="number" id="quantidade-${id}" value="1" min="1" max="${limite}">` : '';
  const tipoTexto = limite===1 ? 'Item' : `Limite de vales: ${limite}`;

  div.innerHTML=`
    <img src="${imagensProdutos[nome] || 'https://via.placeholder.com/300x180?text='+encodeURIComponent(nome)}" alt="${nome}">
    <div class="card-content">
      <h3>${nome}</h3>
      <p>${tipoTexto}</p>
      ${inputHTML}
      <div style="display:flex;gap:.5rem;justify-content:center;align-items:center">
        <button onclick="abrirConfirm(this)">Escolher</button>
      </div>
    </div>
  `;

  if(escolhidos.includes(String(id))){
    const btn=div.querySelector("button");
    btn.textContent="Escolhido"; 
    btn.disabled=true; 
    div.style.opacity=0.6;
  }
  return div;
}

// Modal e lógica de escolha
const confirmModal=document.getElementById('confirmModal');
const pixModal=document.getElementById('pixModal');
let currentSelection=null;

function abrirConfirm(btn){
  const card=btn.closest('.card');
  const id=card.dataset.id;
  const nome=card.dataset.nome;
  const limite=parseInt(card.dataset.limite);
  let quantidade = limite>1 ? parseInt(document.getElementById(`quantidade-${id}`).value)||1 : 1;
  const comprador=document.getElementById("nomeComprador").value.trim();
  if(!comprador){ alert("Informe seu nome antes de escolher."); return; }
  if(quantidade<1){ alert("Informe uma quantidade válida"); return; }
  if(limite>1 && quantidade>limite){ alert("Quantidade maior que o limite"); return; }

  currentSelection={id:String(id),nome,limite,quantidade,comprador};
  document.getElementById('conf-nome').textContent=`Produto: ${nome}`;
  document.getElementById('conf-qtd').textContent=`Quantidade: ${quantidade}`;
  document.getElementById('conf-unit').textContent=`Valor unitário: R$ ${valoresProdutos[nome].toFixed(2).replace('.',',')}`;
  document.getElementById('conf-total').textContent=`Total: R$ ${(valoresProdutos[nome]*quantidade).toFixed(2).replace('.',',')}`;
  document.getElementById('conf-comprador').textContent=`Comprador: ${comprador}`;
  document.getElementById('pix-key').textContent=PIX_KEY;
  document.getElementById('conf-msg').textContent='';
  confirmModal.classList.add('active');
}

function fecharConfirm(){ confirmModal.classList.remove('active'); currentSelection=null; }
function copiarPix(){ navigator.clipboard.writeText(PIX_KEY).then(()=>{document.getElementById('conf-msg').textContent='Chave PIX copiada.'}).catch(()=>{document.getElementById('conf-msg').textContent='Não foi possível copiar.'}); }

async function confirmarCompra(){
  if(!currentSelection) return;
  const {id,nome,limite,quantidade,comprador}=currentSelection;
  document.getElementById('conf-msg').textContent='Registrando...';
  try{
    const params=new URLSearchParams({nome, quantidade:String(quantidade), limite:String(limite), comprador});
    const res=await fetch(`${SCRIPT_URL}?${params.toString()}`);
    const data=await res.json();
    if(data.status==='ok'){
      escolhidos.push(String(id));
      localStorage.setItem('itensEscolhidos',JSON.stringify(escolhidos));
      marcarComoEscolhido(id);
      fecharConfirm();
      abrirPixModal();
    } else{
      document.getElementById('conf-msg').textContent=data.mensagem||'Erro ao registrar.';
    }
  } catch(err){
    console.error(err);
    document.getElementById('conf-msg').textContent='Erro de comunicação.';
  }
}

function marcarComoEscolhido(id){
  const card=document.querySelector(`.card[data-id="${id}"]`);
  if(!card) return;
  const btn=card.querySelector('button');
  btn.textContent='Escolhido'; btn.disabled=true; card.style.opacity=0.6;
}
function abrirPixModal(){ pixModal.classList.add('active'); }
function fecharPix(){ pixModal.classList.remove('active'); }

criarCards();
document.querySelectorAll('.card').forEach(card=>{ const id=String(card.dataset.id); if(escolhidos.includes(id)) marcarComoEscolhido(id); });
