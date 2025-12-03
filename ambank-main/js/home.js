const API_URL = "http://localhost:8080";

document.addEventListener("DOMContentLoaded", async () => {

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Você precisa fazer login primeiro.");
    window.location.href = "/index.html";
    return;
  }

  try {
    // puxas dados json do cliente
    const meResponse = await fetch(`${API_URL}/clientes/me`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    if (!meResponse.ok) {
      throw new Error("Não autorizado");
    }

    const cliente = await meResponse.json();

    // nome do cliente
    document.getElementById("nomeCliente").textContent = cliente.nome;

    // numero da conta
    document.getElementById("contaNumero").textContent = cliente.conta.numeroConta.slice(-4);

    // procura saldo da conta
    const contaId = cliente.conta.id;

    const saldoResponse = await fetch(`${API_URL}/contas/${contaId}/saldo`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    const saldoData = await saldoResponse.json();
    const saldo = saldoData.saldo;

    document.getElementById("valorSaldo").textContent =
      `R$ ${Number(saldo).toFixed(2)}`;

  } 
  
  catch (error) {
    alert("Sessão expirada. Faça login novamente.");
    localStorage.removeItem("token");
    window.location.href = "/index.html";
  }

});

function irParaPix() {
  window.location.href = "/pix.html";
}

function irParaConta() {
  window.location.href = "/conta.html"
}

function irParaExtrato() {
  window.location.href = "/extrato.html"
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/index.html";
}