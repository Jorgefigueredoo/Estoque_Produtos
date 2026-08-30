// ============================================================================
// ESTOQUE — script.js
// Fluxo completo: listar (GET) -> cadastrar (POST) -> editar (PUT)
//                 -> deletar (DELETE) -> entrada/saída (POST /{id}/entrada|saida)
// ============================================================================

const API_URL = "http://localhost:8080/api/produtos"; // ajuste a porta se for diferente

// Elementos da ficha (formulário de cadastro/edição)
const form = document.getElementById("produto-form");
const inputId = document.getElementById("produto-id");
const inputNome = document.getElementById("nome");
const inputDescricao = document.getElementById("descricao");
const inputCategoria = document.getElementById("categoria");
const inputPreco = document.getElementById("preco");
const inputQuantidade = document.getElementById("quantidade");
const campoQuantidade = document.getElementById("campo-quantidade");
const btnSalvar = document.getElementById("btn-salvar");
const btnCancelarEdicao = document.getElementById("btn-cancelar-edicao");
const fichaModo = document.getElementById("ficha-modo");

// Elementos da listagem
const tbody = document.getElementById("produtos-tbody");
const linhaVazia = document.getElementById("linha-vazia");
const btnRecarregar = document.getElementById("btn-recarregar");
const contadorTotal = document.getElementById("contador-total");

// Elementos de mensagem
const mensagemEl = document.getElementById("mensagem");

// Elementos do modal de entrada/saída
const modal = document.getElementById("movimento-modal");
const movimentoForm = document.getElementById("movimento-form");
const movimentoTitulo = document.getElementById("movimento-titulo");
const movimentoProdutoId = document.getElementById("movimento-produto-id");
const movimentoTipo = document.getElementById("movimento-tipo");
const movimentoQuantidade = document.getElementById("movimento-quantidade");
const btnFecharModal = document.getElementById("btn-fechar-modal");

// Guarda o que veio da última listagem, pra preencher a ficha no "Editar"
// sem precisar de um GET /{id} extra.
let produtosEmTela = [];

// ============================================================================
// Mensagens de sucesso / erro
// ============================================================================

let mensagemTimer;

function mostrarMensagem(texto, tipo) {
    clearTimeout(mensagemTimer);
    mensagemEl.textContent = texto;
    mensagemEl.className = `mensagem mensagem--${tipo}`;
    mensagemEl.hidden = false;
    mensagemTimer = setTimeout(() => { mensagemEl.hidden = true; }, 4000);
}

// O GlobalExceptionHandler devolve os erros como texto puro
// (ResponseEntity<String>), então aqui se lê com .text() e NÃO com .json().
async function lerErro(resposta) {
    const texto = await resposta.text();
    return texto || `Erro ${resposta.status}`;
}

// ============================================================================
// Listagem
// ============================================================================

function criarLinhaProduto(produto) {
    const tr = document.createElement("tr");
    // O id fica na própria linha: é assim que o clique sabe qual produto é.
    tr.dataset.id = produto.id;
    tr.innerHTML = `
        <td>
            <span class="produto-nome">${produto.nome}</span>
            <span class="produto-descricao">${produto.descricao ?? ""}</span>
        </td>
        <td><span class="badge">${produto.categoria}</span></td>
        <td class="col-numero">R$ ${produto.preco.toFixed(2)}</td>
        <td class="col-numero">${produto.quantidade}</td>
        <td class="col-acoes">
            <div class="linha-acoes">
                <button class="btn btn--linha" data-acao="editar">Editar</button>
                <button class="btn btn--linha btn--excluir" data-acao="excluir">Excluir</button>
                <button class="btn btn--linha btn--entrada" data-acao="entrada">Entrada</button>
                <button class="btn btn--linha btn--saida" data-acao="saida">Saída</button>
            </div>
        </td>
    `;
    return tr;
}

async function carregarProdutos() {
    try {
        const resposta = await fetch(API_URL);

        if (!resposta.ok) {
            mostrarMensagem(await lerErro(resposta), "erro");
            return;
        }

        const produtos = await resposta.json();
        produtosEmTela = produtos;

        const linhas = tbody.querySelectorAll("tr:not(#linha-vazia)");
        linhas.forEach(linha => linha.remove());

        if (produtos.length === 0) {
            linhaVazia.hidden = false;
        } else {
            linhaVazia.hidden = true;
            produtos.forEach(produto => {
                const tr = criarLinhaProduto(produto);
                tbody.appendChild(tr);
            });
        }

        contadorTotal.textContent = produtos.length;

    } catch (erro) {
        console.error("Erro ao carregar produtos:", erro);
        mostrarMensagem("Não foi possível falar com a API. O servidor está no ar?", "erro");
    }
}

// ============================================================================
// Ficha: modo cadastro x modo edição
// ============================================================================

function entrarModoEdicao(produto) {
    inputId.value = produto.id;
    inputNome.value = produto.nome;
    inputDescricao.value = produto.descricao ?? "";
    inputCategoria.value = produto.categoria;
    inputPreco.value = produto.preco;

    // O service recusa mudança de nome (NomeImutavelException) e ignora a
    // quantidade no PUT — a quantidade só muda por entrada/saída.
    inputNome.readOnly = true;
    campoQuantidade.hidden = true;

    fichaModo.textContent = `Editando: ${produto.nome}`;
    btnSalvar.textContent = "Salvar alterações";
    btnCancelarEdicao.hidden = false;

    inputDescricao.focus();
}

function sairModoEdicao() {
    form.reset();
    inputId.value = "";
    inputNome.readOnly = false;
    campoQuantidade.hidden = false;

    fichaModo.textContent = "Novo cadastro";
    btnSalvar.textContent = "Cadastrar produto";
    btnCancelarEdicao.hidden = true;
}

// ============================================================================
// Cadastrar (POST) e editar (PUT)
// ============================================================================

form.addEventListener("submit", async (evento) => {
    // Sem isso o navegador faz o submit nativo e recarrega a página.
    evento.preventDefault();

    const id = inputId.value;
    const editando = id !== "";

    const produto = {
        nome: inputNome.value.trim(),
        descricao: inputDescricao.value.trim(),
        categoria: inputCategoria.value,
        preco: parseFloat(inputPreco.value),
        quantidade: editando ? undefined : parseInt(inputQuantidade.value, 10)
    };

    // O form é novalidate, então a validação é nossa.
    if (!produto.nome) {
        mostrarMensagem("Informe o nome do produto.", "erro");
        return;
    }
    if (!produto.categoria) {
        mostrarMensagem("Escolha uma categoria.", "erro");
        return;
    }
    if (Number.isNaN(produto.preco)) {
        mostrarMensagem("Informe um preço válido.", "erro");
        return;
    }
    if (!editando && Number.isNaN(produto.quantidade)) {
        mostrarMensagem("Informe a quantidade inicial.", "erro");
        return;
    }

    try {
        const resposta = await fetch(editando ? `${API_URL}/${id}` : API_URL, {
            method: editando ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(produto)
        });

        if (!resposta.ok) {
            mostrarMensagem(await lerErro(resposta), "erro");
            return;
        }

        mostrarMensagem(editando ? "Produto atualizado." : "Produto cadastrado.", "sucesso");
        sairModoEdicao();
        carregarProdutos();

    } catch (erro) {
        console.error("Erro ao salvar produto:", erro);
        mostrarMensagem("Não foi possível falar com a API. O servidor está no ar?", "erro");
    }
});

btnCancelarEdicao.addEventListener("click", sairModoEdicao);
btnRecarregar.addEventListener("click", carregarProdutos);

// ============================================================================
// Ações das linhas (editar / excluir / entrada / saída)
// ============================================================================

// As linhas são recriadas a cada carregarProdutos(), então o listener fica no
// tbody (delegação) em vez de um por botão — assim não some ao recarregar.
tbody.addEventListener("click", (evento) => {
    const botao = evento.target.closest("button[data-acao]");
    if (!botao) return;

    const id = botao.closest("tr").dataset.id;
    const produto = produtosEmTela.find(p => String(p.id) === id);
    if (!produto) return;

    switch (botao.dataset.acao) {
        case "editar":
            entrarModoEdicao(produto);
            break;
        case "excluir":
            excluirProduto(produto);
            break;
        case "entrada":
            abrirModal(produto, "entrada");
            break;
        case "saida":
            abrirModal(produto, "saida");
            break;
    }
});

async function excluirProduto(produto) {
    if (!confirm(`Excluir "${produto.nome}"?`)) return;

    try {
        const resposta = await fetch(`${API_URL}/${produto.id}`, { method: "DELETE" });

        if (!resposta.ok) {
            mostrarMensagem(await lerErro(resposta), "erro");
            return;
        }

        // Se o produto excluído era o que estava na ficha, volta pro modo cadastro.
        if (inputId.value === String(produto.id)) {
            sairModoEdicao();
        }

        mostrarMensagem("Produto excluído.", "sucesso");
        carregarProdutos();

    } catch (erro) {
        console.error("Erro ao excluir produto:", erro);
        mostrarMensagem("Não foi possível falar com a API. O servidor está no ar?", "erro");
    }
}

// ============================================================================
// Modal de entrada / saída
// ============================================================================

function abrirModal(produto, tipo) {
    movimentoProdutoId.value = produto.id;
    movimentoTipo.value = tipo;
    movimentoTitulo.textContent = tipo === "entrada"
        ? `Entrada — ${produto.nome}`
        : `Saída — ${produto.nome}`;
    movimentoQuantidade.value = "";

    modal.hidden = false;
    movimentoQuantidade.focus();
}

function fecharModal() {
    modal.hidden = true;
    movimentoForm.reset();
}

btnFecharModal.addEventListener("click", fecharModal);

// Clique no fundo escuro fecha (mas clique dentro da caixa, não).
modal.addEventListener("click", (evento) => {
    if (evento.target === modal) fecharModal();
});

document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && !modal.hidden) fecharModal();
});

movimentoForm.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const id = movimentoProdutoId.value;
    const tipo = movimentoTipo.value;
    const quantidade = parseInt(movimentoQuantidade.value, 10);

    if (Number.isNaN(quantidade) || quantidade <= 0) {
        mostrarMensagem("Informe uma quantidade maior que zero.", "erro");
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/${id}/${tipo}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantidade })
        });

        if (!resposta.ok) {
            // Ex.: EstoqueInsuficienteException numa saída maior que o estoque.
            mostrarMensagem(await lerErro(resposta), "erro");
            return;
        }

        fecharModal();
        mostrarMensagem(tipo === "entrada" ? "Entrada registrada." : "Saída registrada.", "sucesso");
        carregarProdutos();

    } catch (erro) {
        console.error("Erro ao movimentar estoque:", erro);
        mostrarMensagem("Não foi possível falar com a API. O servidor está no ar?", "erro");
    }
});

// ============================================================================

carregarProdutos();
