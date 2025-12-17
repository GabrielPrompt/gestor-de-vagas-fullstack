const API_URL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:8080"
    : "http://backend:8080";

const form = document.getElementById("loginForm");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("input-email").value;
    const password = document.getElementById("input-senha").value;

    if (!username || !password) {
        alert("Preencha todos os campos!");
        return;
    }

    console.log(API_URL)

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        if (!response.ok) {
            alert("Usuário ou senha inválidos!");
            return;
        }

        if(response.ok) {
            alert("Login feito com sucesso!")
        }

        const data = await response.json();

        
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("expiresIn", data.expiresIn);

        
        const payload = JSON.parse(atob(data.accessToken.split(".")[1]));
        const scope = payload.scope;

        if (scope.includes("ADMIN")) {
            window.location.href = "/pages/admin/admin-page.html";
        } else {
            window.location.href = "/pages/user/user-page.html";
        }

    } catch (error) {
        console.error(error);
        alert("Erro ao conectar com o servidor");
    }
});

