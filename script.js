const PIX_KEY = "21 971963818";
const SCRIPT_URL = "https://script.google.com/macros/s/SEU_SCRIPT_ID/exec"; // Substitua pelo seu script

let compradorConfirmado = "";

// Produtos e valores
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
  {nome:"Panela de pressão", valor:150, img:"imagens/PANELADEPRESSÃO.jpg", limite:6},
  {nome:"Sanduicheira", valor:100, img:"imagens/SANDUUICHEIRA.jpg", limite:5},
  {nome:"Capa de colchão impermeável", valor:50, img:"imagens/CAPADECOLCHÃOIMPERMEAVEL.jpg", limite:10},
  {nome:"2 jogos de lençol", valor:70, img:"imagens/JOGODELENÇOL.jpg", limite:10},
  {nome:"Kit porta algodão, escova e cotonete + saboneteira", valor:70, img:"imagens/Kit porta algodão, escova e cotonete + saboneteira.jpg", limite:10},
  // Adicione os demais itens aqui...
];

let escolhidos = JSON.parse(localStorage.getItem("itensEscolhidos"))||[];
const catalogo = document.getElementById("catalogo");

// CONFIRMA NOME
document.getElementById("confirmarNomeBtn").addEventListener("click", () => {
  const nomeInput = document.getElementById("nomeCompradorInput").value.trim();
  if(!nomeInput){ alert("Digite seu nome"); return; }
  compradorConfirmado = nomeInput;
  document.getElementById("compradorScreen").classList.add("hidden");
  catalogo.classList.remove("hidden");
  criarCards();
});

// CRIAR CARDS
function criarCards(){
  catalogo.innerHTML="";
  produtos.forEach((prod, idx)=>{
    const div = document.createElement("div");
    div.className="card";
    div.dataset.id=idx;

    let inputHTML = prod.limite>1 ? `<input type="number" id="quantidade-${idx}" value="1" min="1" max="${prod.limite}">` : '';
    const tipoTexto = prod.limite===1 ? 'Item' : `Limite de vales: ${prod.limite}`;

    div.innerHTML=`
      <img src="${prod.img}" alt="${prod.nome}">
      <div class="card-content">
        <h3>${prod.nome}</h3>
        <p>${tipoTexto}</p>
        ${inputHTML}
        <p>Valor unitário: R$ ${prod.valor.toFixed(2).replace('.',',')}</p>
        <div style="display:flex;gap:.5rem;justify-content:center;align-items:center">
          <button onclick="abrirConfirm(this)">Escolher</button>
        </div>
      </div>
    `;

    if(escolhidos.includes(String(idx))){
      const btn = div.querySelector("button");
      btn.textContent="Escolhido";
      btn.disabled=true;
      div.style.opacity=0.6;
    }
    catalogo.appendChild(div);
  });
}

// MODAL
let currentSelection = null;
const confirmModal = document.getElementById("confirmModal");
const pixModal = document.getElementById("pixModal");

function abrirConfirm(btn){
  const card = btn.closest(".card");
  const id = parseInt(card.dataset.id);
  const prod = produtos[id];
  let quantidade = prod.limite>1 ? parseInt(document.getElementById(`quantidade-${id}`).value)||1 : 1;

  if(quantidade<1){ alert("Informe uma quantidade válida"); return; }
  if(prod.limite>1 && quantidade>prod.limite){ alert("Quantidade maior que o limite"); return; }

  currentSelection = {id, quantidade, comprador: compradorConfirmado};

  document.getElementById('conf-nome').textContent=`Produto: ${prod.nome}`;
  document.getElementById('conf-qtd').textContent=`Quantidade: ${quantidade}`;
  document.getElementById('conf-unit').textContent=`Valor unitário: R$ ${prod.valor.toFixed(2).replace('.',',')}`;
  document.getElementById('conf-total').textContent=`Total: R$ ${(prod.valor*quantidade).toFixed(2).replace('.',',')}`;
  document.getElementById('conf-comprador').textContent=`Comprador: ${compradorConfirmado}`;
  document.getElementById('pix-key').textContent=PIX_KEY;
  document.getElementById('conf-msg').textContent='';
  confirmModal.classList.remove("hidden");
}

function fecharConfirm(){ confirmModal.classList.add("hidden"); currentSelection=null; }
function copiarPix(){ navigator.clipboard.writeText(PIX_KEY); }

// CONFIRMAR COMPRA
async function confirmarCompra(){
  if(!currentSelection) return;
  const {id, quantidade, comprador} = currentSelection;
  const prod = produtos[id];

  document.getElementById('conf-msg').textContent='Registrando...';
  try{
    const params = new URLSearchParams({nome: prod.nome, quantidade, limite: prod.limite, comprador});
    const res = await fetch(`${SCRIPT_URL}?${params.toString()}`, {method:"POST"});
    const data = await res.json();
    if(data.status==='ok'){
      escolhidos.push(String(id));
      localStorage.setItem('itensEscolhidos', JSON.stringify(escolhidos));
      marcarComoEscolhido(id);
      fecharConfirm();
      abrirPixModal();
    } else {
      document.getElementById('conf-msg').textContent=data.mensagem||'Erro ao registrar.';
    }
  } catch(err){
    console.error(err);
    document.getElementById('conf-msg').textContent='Erro de comunicação.';
  }
}

function marcarComoEscolhido(id){
  const card = document.querySelector(`.card[data-id="${id}"]`);
  if(!card) return;
  const btn = card.querySelector("button");
  btn.textContent='Escolhido';
  btn.disabled=true;
  card.style.opacity=0.6;
}

function abrirPixModal(){ pixModal.classList.remove("hidden"); }
function fecharPix(){ pixModal.classList.add("hidden"); }
