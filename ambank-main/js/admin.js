const API_URL = "http://localhost:8080";
const token = localStorage.getItem("token");

if (!token) {
  alert("Faça login novamente");
  window.location.href = "/index.html";
}

async function carregarClientes() {
  const conteudo = document.getElementById("conteudo");
  conteudo.innerHTML = "<p>Carregando clientes...</p>";

  try {
    const resp = await fetch(`${API_URL}/admin`, {
      headers: { "Authorization": "Bearer " + token }
    });

    if (!resp.ok) throw new Error("Erro ao buscar clientes");

    const data = await resp.json();
    const clientes = data.content || [];

    if (clientes.length === 0) {
      conteudo.innerHTML = "<p>Nenhum cliente encontrado.</p>";
      return;
    }

    conteudo.innerHTML = `
      <h3>Clientes Ativos</h3>
      <table>
        <thead><tr><th>Nome</th><th>Email</th><th>Telefone</th><<th>CPF/CNPJ</th><th>Tipo</th></tr></thead>
        <tbody>
          ${clientes.map(c => `
            <tr>
              <td>${c.nome}</td>
              <td>${c.email}</td>
              <TD>${c.telefone}</td>
              <td>${c.cpf}</td>
              <td>${c.tipoCliente}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  } catch (e) {
    conteudo.innerHTML = `<p>Erro: ${e.message}</p>`;
  }
}

async function carregarTodasTransacoes() {
  const conteudo = document.getElementById("conteudo");
  conteudo.innerHTML = "<p>Carregando transações...</p>";

  try {
    const resp = await fetch(`${API_URL}/transacoes/admin`, {
      headers: { "Authorization": "Bearer " + token }
    });

    if (!resp.ok) throw new Error("Erro ao buscar transações");

    const transacoes = await resp.json();

    if (transacoes.length === 0) {
      conteudo.innerHTML = "<p>Nenhuma transação encontrada.</p>";
      return;
    }

    conteudo.innerHTML = `
      <h3>Todas as Transações</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Valor</th><th>Origem</th><th>Destino</th><th>Status</th><th>Suspeita de Golpe</th><th>Razões Golpe</th><th>Pontuação de fraude</th><th>Data</th>
          </tr>
        </thead>
        <tbody>
          ${transacoes.map(t => `
            <tr>
              <td>${t.id}</td>
              <td>R$ ${Number(t.valor).toFixed(2)}</td>
              <td>${t.cpfOrigem}</td>
              <td>${t.cpfDestinatario}</td>
              <td>${t.status}</td>
              <td>${t.suspeitaGolpe ? "Sim" : "Não"}</td>
              <td>${t.fraudReasons}</td>
              <td>${t.fraudScore}</td>
              <td>${t.data.replace("T", " ")}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  } catch (e) {
    conteudo.innerHTML = `<p>Erro: ${e.message}</p>`;
  }
}

async function carregarTransacoesPendentes() {
  const conteudo = document.getElementById("conteudo");
  conteudo.innerHTML = "<p>Carregando transações pendentes...</p>";

  try {
    const resp = await fetch(`${API_URL}/transacoes/pendentes`, {
      headers: { "Authorization": "Bearer " + token }
    });

    if (!resp.ok) throw new Error("Erro ao buscar pendentes");

    const pendentes = await resp.json();

    if (pendentes.length === 0) {
      conteudo.innerHTML = "<p>Sem transações pendentes.</p>";
      return;
    }

    conteudo.innerHTML = `
      <h3>Transações Pendentes</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Valor</th><th>Origem</th><th>Destino</th><th>Status</th><th>Suspeita de golpe</th><th>Razões de fraude</th><th>Pontuação de fraude</th><th>Ações</th>
          </tr>
        </thead>
        <tbody>
          ${pendentes.map(t => `
            <tr>
              <td>${t.id}</td>
              <td>R$ ${Number(t.valor).toFixed(2)}</td>
              <td>${t.nomeOrigem}\n CPF: ${t.cpfOrigem}</td>
              <td>${t.nomeDestinatario}\n CPF: ${t.cpfDestinatario}</td>
              <td>${t.status}</td>
              <td>${t.suspeitaGolpe ? "Sim" : "Não"}</td>
              <td>${t.fraudReasons}</td>
              <td>${t.fraudScore}</td>
              <td>
                <button class="aprovar" onclick="aprovar(${t.id})">Aprovar</button>
                <button class="negar" onclick="negar(${t.id})">Negar</button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  } catch (e) {
    conteudo.innerHTML = `<p>Erro: ${e.message}</p>`;
  }
}

async function aprovar(id) {
  if (!confirm(`Aprovar transação ${id}?`)) return;

  const resp = await fetch(`${API_URL}/transacoes/${id}/aprovar`, {
    method: "POST",
    headers: { "Authorization": "Bearer " + token }
  });

  if (resp.ok) {
    alert("Transação aprovada!");
    carregarTransacoesPendentes();
  } else {
    alert("Erro ao aprovar.");
  }
}

async function negar(id) {
  if (!confirm(`Negar transação ${id}?`)) return;

  const resp = await fetch(`${API_URL}/transacoes/${id}/negar`, {
    method: "POST",
    headers: { "Authorization": "Bearer " + token }
  });

  if (resp.ok) {
    alert("Transação negada!");
    carregarTransacoesPendentes();
  } else {
    alert("Erro ao negar.");
  }
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/index.html";
}
