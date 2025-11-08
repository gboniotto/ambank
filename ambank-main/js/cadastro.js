const API_URL = "http://localhost:8080";

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("cadastroForm");
    const erro = document.getElementById("erro");
    const sucesso = document.getElementById("sucesso");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        erro.style.display = "none";
        sucesso.style.display = "none";

        const data = {
            nome: document.getElementById("nome").value,
            email: document.getElementById("email").value,
            senha: document.getElementById("senha").value,
            telefone: document.getElementById("telefone").value,
            cpf: document.getElementById("cpf").value,
            tipoCliente: document.getElementById("tipoCliente").value,
            endereco: {
                logradouro: document.getElementById("logradouro").value,
                bairro: document.getElementById("bairro").value,
                cep: document.getElementById("cep").value,
                numero: document.getElementById("numero").value,
                complemento: document.getElementById("complemento").value,
                cidade: document.getElementById("cidade").value,
                uf: document.getElementById("uf").value
            }
        };

        // validacoes
        if (data.cpf.length !== 11) {
            erro.style.display = "block";
            erro.textContent = "CPF deve ter exatamente 11 números.";
            return;
        }

        if (data.senha.length < 6) {
            erro.style.display = "block";
            erro.textContent = "A senha deve ter no mínimo 6 caracteres.";
            return;
        }

        if (data.tipoCliente === "") {
            erro.style.display = "block";
            erro.textContent = "Selecione um tipo de cliente.";
            return;
        }

        try {
            const resp = await fetch(`${API_URL}/clientes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (!resp.ok) {
                const errObj = await resp.json();
                throw new Error(errObj.message || "Erro ao cadastrar cliente!");
            }

            sucesso.style.display = "block";
            sucesso.textContent = "Cliente cadastrado com sucesso!";

            setTimeout(() => {
                window.location.href = "/index.html";
            }, 1500);

        } catch (e) {
            erro.style.display = "block";
            erro.textContent = e.message;
        }
    });
});
