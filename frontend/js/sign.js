const API_URL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:8080"
    : "http://backend:8080";

const form = document.getElementById("signForm");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("input-email").value.trim();
    const password = document.getElementById("input-senha").value.trim();

    if (!username || !password) {
        alert("Preencha todos os campos");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        if (response.status === 201 || response.status === 200) {
            alert("Conta criada com sucesso!");
            window.location.href = "../index.html";
            return;
        }

        if (response.status === 422) {
            alert("Usuário já existe!");
            return;
        }

        alert("Erro ao cadastrar usuário");

    } catch (error) {
        console.error(error);
        alert("Erro ao conectar com o servidor");
    }
});
