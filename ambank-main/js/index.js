const API_URL = "http://localhost:8080";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const erroLogin = document.getElementById("erroLogin");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const login = document.getElementById("login").value;
    const senha = document.getElementById("senha").value;

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ login, senha })
      });

      if (!response.ok) {
        throw new Error("Falha ao autenticar");
      }

      const data = await response.json();

      // armazena token
      localStorage.setItem("token", data.token);

      // se ok vai para o home
      window.location.href = "/home.html";

    } catch (error) {
      erroLogin.style.display = "block";
      erroLogin.textContent = "Login inválido. Verifique suas credenciais.";
    }
  });
});