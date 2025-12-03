const API_URL = "http://localhost:8080";

document.addEventListener("DOMContentLoaded", async () => {

    const token = localStorage.getItem("token");

    if (!token) {
        alert("Você precisa fazer login primeiro.");
        window.location.href = "/index.html";
        return;
    }

    try {
        // busca o cliente
        const resp = await fetch(`${API_URL}/clientes/me`, {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (!resp.ok) {
            throw new Error("Não autorizado");
        }

        const cliente = await resp.json();

        document.getElementById("userName").textContent = cliente.nome;
        document.getElementById("userCpf").textContent = cliente.cpf;
        document.getElementById("userEmail").textContent = cliente.email;

        const dataCadastro = new Date(cliente.dataCadastro).toLocaleDateString("pt-BR");
        document.getElementById("userCadastro").textContent = dataCadastro;


        // vincula dados conta
        const conta = cliente.conta;

        document.getElementById("numeroConta").textContent = conta.numeroConta;
        document.getElementById("agenciaConta").textContent = conta.agencia;
        document.getElementById("saldoConta").textContent = 
            `R$ ${Number(conta.saldo).toFixed(2)}`;

        document.getElementById("chavePix").textContent = cliente.chavePix;

    } catch (e) {
        alert("Erro ao carregar dados da conta.");
        window.location.href = "/index.html";
    }
});

function voltarHome() {
    window.location.href = "/home.html";
}

