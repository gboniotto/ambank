const API_URL = "http://localhost:8080";

function mostrarEtapa(n) {
  document.getElementById("etapa1").style.display = n === 1 ? "block" : "none";
  document.getElementById("etapa2").style.display = n === 2 ? "block" : "none";
  document.getElementById("etapa3").style.display = n === 3 ? "block" : "none";
  document.getElementById("etapa4").style.display = n === 4 ? "block" : "none";
}

document.getElementById("btnContinuar1").addEventListener("click", async () => {
  const chave = document.getElementById("chavePix").value;
  const valor = document.getElementById("valor").value;
  const erro = document.getElementById("erro1");

  erro.textContent = "";

  if (!chave || !valor || valor <= 0) {
    erro.textContent = "Digite a chave e o valor corretamente.";
    return;
  }

  mostrarEtapa(2);
  document.getElementById("destChave").textContent = chave;
  document.getElementById("destValor").textContent = Number(valor).toFixed(2);

  try {
    const resp = await fetch(`${API_URL}/clientes/pix/${chave}`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    });

    if (!resp.ok) throw new Error();

    const cliente = await resp.json();
    document.getElementById("destNome").textContent = cliente.nome;
    document.getElementById("destCpf").textContent = cliente.cpf;

  } catch {
    document.getElementById("destNome").textContent = "PIX externo";
    document.getElementById("destCpf").textContent = "000.000.000-00";
  }
});

// ir p pin
document.getElementById("btnIrParaPin").addEventListener("click", () => {
  mostrarEtapa(3);
});

// pegar pin
document.getElementById("btnConfirmar").addEventListener("click", async () => {
  const pin = document.getElementById("pin").value;
  const erroPin = document.getElementById("erroPin");

  erroPin.textContent = "";

  if (!pin || pin.length !== 4) {
    erroPin.textContent = "PIN deve conter 4 números.";
    return;
  }

  const token = localStorage.getItem("token");
  const valor = parseFloat(document.getElementById("valor").value);
  const chave = document.getElementById("chavePix").value;

  try {
    const me = await fetch(`${API_URL}/clientes/me`, {
      headers: { "Authorization": "Bearer " + token }
    });

    if (!me.ok) throw new Error("Erro ao buscar cliente logado");

    const cliente = await me.json();

    const body = {
      clienteOrigemId: cliente.id,
      valor: valor,
      chavePixDestino: chave,
      pin: pin
    };

    const resp = await fetch(`${API_URL}/transacoes`, {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const text = await resp.text();
    let resultado = {};
    try {
      resultado = text ? JSON.parse(text) : {};
    } catch {}

    if (!resp.ok) {
      const msg = resultado?.message || resultado?.error || text || "Erro desconhecido";
      alert("❌ Erro ao processar transação:\n\n" + msg);
      return;
    }

    // n aprovada
    if (resultado.status === "NEGADA") {
      alert("❌ TRANSFERÊNCIA NEGADA:\n" +
            resultado.fraudReasons.split(";").map(r => "• " + r).join("\n"));
      return;
    }

    if (resultado.status === "PENDENTE_ANALISE") {
      alert("⚠️ Transação marcada como suspeita:\n" +
            resultado.fraudReasons.split(";").map(r => "• " + r).join("\n"));
      window.location.href = "/home.html";
      return;
    }

    // aprovada
    if (resultado.status === "APROVADA") {
      document.getElementById("resultadoStatus").textContent = resultado.status;
      document.getElementById("resultadoValor").textContent = Number(resultado.valor).toFixed(2);
      document.getElementById("resultadoNome").textContent = resultado.nomeDestinatario;
      document.getElementById("resultadoChave").textContent = chave;

      mostrarEtapa(4);
      return;
    }

    alert("Erro inesperado.");

  } catch (e) {
    alert("❌ Erro ao enviar transação:\n\n" + e.message);
  }
});

// Botões de voltar
document.getElementById("btnVoltar1").addEventListener("click", () => mostrarEtapa(1));
document.getElementById("btnVoltar2").addEventListener("click", () => mostrarEtapa(2));
document.getElementById("btnVoltarHome").addEventListener("click", () => (window.location.href = "/home.html"));

function voltarHome() {
  window.location.href = "/home.html";
}
