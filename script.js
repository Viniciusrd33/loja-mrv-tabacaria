// Atualizar contador do carrinho no cabeçalho
function atualizarContadorCarrinho() {
  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  const contadorCarrinho = document.getElementById("carrinho-count");
  if (contadorCarrinho) {
    contadorCarrinho.textContent = carrinho.length;
  }
}

// Obter carrinho associado ao usuário logado
function obterCarrinho() {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (!usuarioLogado) {
    if (!window.location.pathname.includes("login.html")) {
      alert("Faça login para acessar o carrinho.");
      window.location.href = "login.html";
    }
    return [];
  }
  return (
    JSON.parse(localStorage.getItem(`carrinho_${usuarioLogado.email}`)) || []
  );
}

// Salvar carrinho associado ao usuário logado
function salvarCarrinho(carrinho) {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (usuarioLogado) {
    localStorage.setItem(
      `carrinho_${usuarioLogado.email}`,
      JSON.stringify(carrinho)
    );
  }
}

// Adicionar produto ao carrinho
function adicionarAoCarrinho(produto) {
  const cor = document.getElementById("cor")?.value || null;
  const tamanho = document.getElementById("tamanho")?.value || null;

  const carrinho = obterCarrinho();
  carrinho.push({ ...produto, cor, tamanho });
  salvarCarrinho(carrinho);
  atualizarContadorCarrinho();
  alert("Produto adicionado ao carrinho!");
}

// Redirecionar para a página de detalhes do produto
function verDetalhes(id) {
  window.location.href = `detalhes-produto.html?id=${id}`;
}

// Mostrar carrossel de imagens
let slideIndex = 0;
const slides = document.querySelectorAll(".slide");

function mostrarSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === index);
  });
}

document.getElementById("prev")?.addEventListener("click", () => {
  slideIndex = (slideIndex - 1 + slides.length) % slides.length;
  mostrarSlide(slideIndex);
});

document.getElementById("next")?.addEventListener("click", () => {
  slideIndex = (slideIndex + 1) % slides.length;
  mostrarSlide(slideIndex);
});

// Carregar avaliações
function carregarAvaliacoes(produtoId) {
  fetch(`php/avaliacoes.php?produto_id=${produtoId}`)
    .then((response) => response.json())
    .then((avaliacoes) => {
      const lista = document.getElementById("lista-avaliacoes");
      lista.innerHTML = "";

      avaliacoes.forEach((avaliacao) => {
        lista.insertAdjacentHTML(
          "beforeend",
          `<div class="avaliacao">
              <strong>${avaliacao.usuario}</strong>
              <p>Nota: ${avaliacao.nota}</p>
              <p>${avaliacao.comentario}</p>
              <small>${new Date(avaliacao.data).toLocaleDateString()}</small>
          </div>`
        );
      });
    });
}

// Enviar avaliação
document
  .getElementById("form-avaliacao")
  ?.addEventListener("submit", (event) => {
    event.preventDefault();

    const produtoId = new URLSearchParams(window.location.search).get("id");
    const usuario = document.getElementById("usuario").value;
    const comentario = document.getElementById("comentario").value;
    const nota = document.getElementById("nota").value;

    fetch("php/avaliacoes.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `produto_id=${produtoId}&usuario=${encodeURIComponent(
        usuario
      )}&comentario=${encodeURIComponent(comentario)}&nota=${nota}`,
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.sucesso);
        carregarAvaliacoes(produtoId);
        document.getElementById("form-avaliacao").reset();
      });
  });

// Carregar produtos relacionados
function carregarRelacionados(produtoId) {
  const relacionadosContainer = document.getElementById("relacionados");
  const relacionados = produtos.filter((p) => p.id !== produtoId).slice(0, 4);

  relacionadosContainer.innerHTML = "";

  relacionados.forEach((produto) => {
    relacionadosContainer.insertAdjacentHTML(
      "beforeend",
      `<div class="produto">
          <img src="${produto.imagem}" alt="${produto.nome}">
          <h3>${produto.nome}</h3>
          <p>R$ ${produto.preco.toFixed(2)}</p>
          <button class="btn" onclick="verDetalhes(${
            produto.id
          })">Ver Detalhes</button>
      </div>`
    );
  });
}

// Renderizar produtos na página principal
if (window.location.pathname.includes("index.html")) {
  const produtoContainer = document.querySelector(".produtos");

  function renderizarProdutosPrincipais() {
    produtoContainer.innerHTML = "";
    produtos.slice(0, 4).forEach((produto) => {
      const produtoHTML = `
          <div class="produto">
              <img src="${produto.imagem}" alt="${produto.nome}">
              <h3>${produto.nome}</h3>
              <p>R$ ${produto.preco.toFixed(2)}</p>
              <button class="btn" onclick="verDetalhes(${
                produto.id
              })">Ver Detalhes</button>
          </div>
      `;
      produtoContainer.insertAdjacentHTML("beforeend", produtoHTML);
    });
  }

  renderizarProdutosPrincipais();
}

// Página de Produtos
if (window.location.pathname.includes("produtos.html")) {
  const produtoContainer = document.querySelector(".produtos");
  const barraPesquisa = document.getElementById("barra-pesquisa");
  const paginacaoContainer = document.querySelector(".paginacao");
  const produtosPorPagina = 6;
  let paginaAtual = 1;

  const produtos = [
    {
      id: 1,
      nome: "Produto 1",
      preco: 99.9,
      imagem: "imagens/produto1.jpg",
      descricao: "Descrição do Produto 1.",
    },
    {
      id: 2,
      nome: "Produto 2",
      preco: 199.9,
      imagem: "imagens/produto2.jpg",
      descricao: "Descrição do Produto 2.",
    },
    {
      id: 3,
      nome: "Produto 3",
      preco: 299.9,
      imagem: "imagens/produto3.jpg",
      descricao: "Descrição do Produto 3.",
    },
  ];

  function renderizarProdutos(listaProdutos) {
    produtoContainer.innerHTML = "";
    listaProdutos.forEach((produto) => {
      const produtoHTML = `
          <div class="produto">
              <img src="${produto.imagem}" alt="${produto.nome}">
              <h3>${produto.nome}</h3>
              <p>R$ ${produto.preco.toFixed(2)}</p>
              <button class="btn" onclick="verDetalhes(${
                produto.id
              })">Ver Detalhes</button>
          </div>
      `;
      produtoContainer.insertAdjacentHTML("beforeend", produtoHTML);
    });
  }

  function atualizarPaginacao(totalProdutos) {
    const totalPaginas = Math.ceil(totalProdutos / produtosPorPagina);
    paginacaoContainer.innerHTML = "";

    for (let i = 1; i <= totalPaginas; i++) {
      const botao = document.createElement("button");
      botao.textContent = i;
      botao.classList.add("btn-paginacao");
      if (i === paginaAtual) botao.classList.add("ativo");

      botao.addEventListener("click", () => {
        paginaAtual = i;
        renderizarPagina(produtos);
      });

      paginacaoContainer.appendChild(botao);
    }
  }

  function renderizarPagina(listaProdutos) {
    const inicio = (paginaAtual - 1) * produtosPorPagina;
    const fim = inicio + produtosPorPagina;
    renderizarProdutos(listaProdutos.slice(inicio, fim));
    atualizarPaginacao(listaProdutos.length);
  }

  barraPesquisa.addEventListener("input", () => {
    const termo = barraPesquisa.value.toLowerCase();
    const produtosFiltrados = produtos.filter((produto) =>
      produto.nome.toLowerCase().includes(termo)
    );
    paginaAtual = 1;
    renderizarPagina(produtosFiltrados);
  });

  renderizarPagina(produtos);
}

// Página de Detalhes
if (window.location.pathname.includes("detalhes-produto.html")) {
  const params = new URLSearchParams(window.location.search);
  const produtoId = parseInt(params.get("id"));
  const produto = produtos.find((p) => p.id === produtoId);

  if (produto) {
    document.getElementById("produto-imagem").src = produto.imagem;
    document.getElementById("produto-nome").textContent = produto.nome;
    document.getElementById("produto-descricao").textContent =
      produto.descricao;
    document.getElementById(
      "produto-preco"
    ).textContent = `R$ ${produto.preco.toFixed(2)}`;
    carregarAvaliacoes(produtoId);
    carregarRelacionados(produtoId);
  } else {
    document.querySelector(".detalhes-produto").innerHTML =
      "<p>Produto não encontrado.</p>";
  }
}

// Inicializar contador do carrinho ao carregar qualquer página
document.addEventListener("DOMContentLoaded", atualizarContadorCarrinho);
