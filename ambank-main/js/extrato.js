const API_URL = "http://localhost:8080";

let transacoes = [];
let filtroAtual = "todas";

document.addEventListener("DOMContentLoaded", async () => {

    const token = localStorage.getItem("token");
    if (!token) {
        alert("Faça login novamente");
        window.location.href = "/index.html";
        return;
    }

    const lista = document.getElementById("lista-transacoes");

    try {
        const resp = await fetch(`${API_URL}/transacoes/me`, {
            headers: { "Authorization": "Bearer " + token }
        });

        transacoes = await resp.json();

        if (transacoes.length === 0) {
            lista.innerHTML = "<p>Sem transações.</p>";
            return;
        }

        renderizarTransacoes();

    } catch (e) {
        lista.innerHTML = "<p>Erro ao carregar extrato.</p>";
    }

    // filtros
    document.getElementById("btn-todas").addEventListener("click", () => {
        filtroAtual = "todas";
        atualizarFiltroAtivo("btn-todas");
        renderizarTransacoes();
    });

    document.getElementById("btn-enviadas").addEventListener("click", () => {
        filtroAtual = "enviadas";
        atualizarFiltroAtivo("btn-enviadas");
        renderizarTransacoes();
    });

    document.getElementById("btn-recebidas").addEventListener("click", () => {
        filtroAtual = "recebidas";
        atualizarFiltroAtivo("btn-recebidas");
        renderizarTransacoes();
    });
});

function atualizarFiltroAtivo(id) {
    document.querySelectorAll(".filtros button").forEach(btn => btn.classList.remove("ativo"));
    document.getElementById(id).classList.add("ativo");
}

function renderizarTransacoes() {
    const lista = document.getElementById("lista-transacoes");
    lista.innerHTML = "";

    const cpfUsuario = obterCpfUsuario();

    let filtradas = transacoes;

    if (filtroAtual === "enviadas") {
        filtradas = transacoes.filter(t => t.cpfOrigem === cpfUsuario);
    } else if (filtroAtual === "recebidas") {
        filtradas = transacoes.filter(t => t.cpfDestinatario === cpfUsuario);
    }

    if (filtradas.length === 0) {
        lista.innerHTML = "<p>Nenhuma transação encontrada para o filtro atual.</p>";
        return;
    }

    filtradas.forEach(t => {
        const div = document.createElement("div");
        div.classList.add("item");

        const enviada = t.cpfOrigem === cpfUsuario;
        const tipo = enviada ? "envio" : "recebido";
        const seta = enviada ? "Enviada" : "Recebido";

        div.innerHTML = `
            <div class="item-info ${tipo}">
                <p><b>Valor:</b> R$ ${Number(t.valor).toFixed(2)}</p>
                <p><b>Status:</b> ${t.status}</p>
                <p><b>Suspeita Golpe:</b> ${t.suspeitaGolpe ? "SIM" : "NÃO"}</p>
                <p><b>Nome destinatário:</b> ${t.nomeDestinatario}</p>
                <p><b>Data:</b> ${t.data.replace("T"," ")}</p>
            </div>
            <div class="seta">${seta}</div>
        `;

        lista.appendChild(div);
    });
}

function obterCpfUsuario() {
    return transacoes.length > 0 ? transacoes[0].cpfOrigem : "";
}
