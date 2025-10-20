const PIX_KEY = "21 971963818";
const SCRIPT_URL = "SEU_URL_DO_GOOGLE_SCRIPT_AQUI";

// Produtos, valores e imagens
const produtos = [
  {nome:"Micro-ondas", valor:100, img:"imagens/MICROONDAS.jpg", limite:6},
  {nome:"Fogão", valor:100, img:"imagens/FOGAO.jpg", limite:10},
  {nome:"Armário de cozinha", valor:100, img:"imagens/ARMARIODECOZINHA.jpg", limite:5},
  {nome:"Geladeira", valor:100, img:"imagens/GELADEIRA.jpg", limite:15},
  {nome:"Painel para TV", valor:100, img:"imagens/PAINELPARATV.jpg", limite:2},
  {nome:"Sofá", valor:100, img:"imagens/SOFÁ.jpg", limite:10},
  {nome:"Televisão", valor:100, img:"imagens/TELEVISÃO.jpg", limite:15},
  {nome:"Ar-condicionado", valor:100, img:"imagens/ARCONDICIONADO.jpg", limite:10},
  {nome:"Armário", valor:100, img:"imagens/ARMARIO.jpg", limite:10},
  {nome:"Colchão de casa D20", valor:100, img:"imagens/COLCHAO.jpg", limite:3},
  {nome:"Sapateira", valor:100, img:"imagens/SAPATEIRA.jpg", limite:3},
  {nome:"Máquina de lavar", valor:100, img:"imagens/MAQUINADELAVAR.jpeg", limite:10},
  {nome:"Aspirador de pó", valor:100, img:"imagens/ASPIRADORDEPO.jpg", limite:3},
  {nome:"Sanduicheira", valor:170, img:"imagens/SANDUUICHEIRA.jpg", limite:0},
  {nome:"Kit porta algodão, escova e cotonete + saboneteira", valor:70, img:"imagens/KITALGODAO.jpg", limite:0},
  {nome:"2 jogos de lençol", valor:70, img:"imagens/JOGODELENÇOL.jpg", limite:0},
  {nome:"Capa de colchão impermeável", valor:50, img:"imagens/CAPADECOLCHÃOIMPERMEAVEL.jpg", limite:0},
  {nome:"Panela de pressão", valor:150, img:"imagens/PANELADEPRESSÃO.jpg", limite:0},
  {nome:"Jogo de panelas", valor:100, img:"imagens/JOGODEPANELA.jpg", limite:6}
];

const catalogo = document.getElementById("catalogo");
let escolhidos = JSON.parse(localStorage.getItem("itensEscolhidos")) || [];

function criarCards(){
  produtos.forEach((prod,i)=>{
    const div = document.createElement("div");
    div.className="card";
    div.dataset.id=i;
    div.dataset.nome=prod.nome;
    div.dataset.limite=prod.limite;

    let inputHTML = prod.limite>1 ? `<input type="number" id="quantidade-${i}" value="1" min="1" max="${prod.limite}">` : '';

    div.innerHTML=`
      <img src="${prod.img}" alt="${prod.nome}">
      <div class="card-content">
        <h3>${prod.nome}</h3>
        <p>${prod.limite>0 ? "Limite: "+prod.limite : "Item"} - R$ ${prod.valor.toFixed(2).replace('.',',')}</p>
        ${inputHTML}
        <div style="display:flex;gap:.5rem;justify-content:center;align-items:center">
          <button onclick="abrirConfirm(this)">Escolher</button>
        </div>
      </div>
    `;

    if(escolhidos.includes(String(i))){
      const btn=div.querySelector("button");
      btn.textContent="Escolhido"; 
      btn.disabled=true; 
      div.style.opacity=0.6;
    }

    catalogo.appendChild(div);
  });
}

let currentSelection = null;
const confirmModal = document.getElementById('confirmModal');
const pixModal = document.getElementById('pixModal');

function abrirConfirm(btn){
  const card = btn.closest('.card');
  const id = card.dataset.id;
  const nome = card.dataset.nome;
  const limite = parseInt(card.dataset.limite);
  const quantidade = limite>1 ? parseInt(document.getElementById(`quantidade-${id}`).value)||1 : 1;
  const comprador = document.getElementById("nomeComprador").value.trim();

  if(!comprador){ alert("Informe seu nome antes de escolher."); return; }
  if(quantidade<1){ alert("Quantidade inválida"); return; }
  if(limite>0 && quantidade>limite){ alert("Quantidade maior que o limite"); return; }

  currentSelection={id, nome, quantidade, limite, comprador};

  document.getElementById('conf-nome').textContent=`Produto: ${nome}`;
  document.getElementById('conf-qtd').textContent=`Quantidade: ${quantidade}`;
  document.getElementById('conf-unit').textContent=`Valor unitário: R$ ${produtos[id].valor.toFixed(2).replace('.',',')}`;
  document.getElementById('conf-total').textContent=`Total: R$ ${(produtos[id].valor*quantidade).toFixed(2).replace('.',',')}`;
  document.getElementById('conf-comprador').textContent=`Comprador: ${comprador}`;
  document.getElementById('pix-key').textContent=PIX_KEY;
  document.getElementById('conf-msg').textContent='';
  confirmModal.classList.add('active');
}

function fecharConfirm(){ confirmModal.classList.remove('active'); currentSelection=null; }
function copiarPix(){ navigator.clipboard.writeText(PIX_KEY); }

async function confirmarCompra(){
  if(!currentSelection) return;
  const {id,nome,quantidade,limite,comprador} = currentSelection;
  document.getElementById('conf-msg').textContent='Registrando...';
  try{
    const res = await fetch(SCRIPT_URL,{
      method:'POST',
      headers:{'Content-Type':'application/x-www-form-urlencoded'},
      body: new URLSearchParams({nome, quantidade, limite, comprador})
    });
    const data = await res.json();
    if(data.status==='ok'){
      escolhidos.push(id);
      localStorage.setItem('itensEscolhidos',JSON.stringify(escolhidos));
      marcarComoEscolhido(id);
      fecharConfirm();
      abrirPixModal();
    } else {
      document.getElementById('conf-msg').textContent=data.mensagem || 'Erro ao registrar';
    }
  } catch(err){
    console.error(err);
    document.getElementById('conf-msg').textContent='Erro de comunicação';
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
