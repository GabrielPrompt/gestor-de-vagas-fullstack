const form = document.querySelector(".form-criar-vaga");

document.addEventListener("DOMContentLoaded", carregarUsuarioNavbar)

async function carregarUsuarioNavbar() {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
        const response = await fetch(`${API_URL}me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) return;

        const user = await response.json();

        const nameUser = document.querySelector(".name-user").innerHTML = user.nome


    } catch (e) {
        console.error("Erro ao carregar usuário", e);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
        window.location.href = "/index.html";
    }
});

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const accessToken = localStorage.getItem("accessToken");

    const vaga = {
        titulo: document.getElementById("titulo").value.trim(),
        empresa: document.getElementById("empresa").value.trim(),
        localizacao: document.getElementById("localizacao").value.trim(),
        salario: document.getElementById("salario").value.trim(),
        experiencia: document.getElementById("experiencia").value,
        modalidade: document.getElementById("modalidade").value
    };

    try {
        const response = await fetch(`${API_URL}/vagas`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(vaga)
        });

        if (response.status === 401) {
            alert("Sessão expirada");
            localStorage.removeItem("accessToken");
            window.location.href = "/index.html";
            return;
        }

        if (!response.ok) {
            throw new Error("Erro ao criar vaga");
        }

        alert("Vaga criada com sucesso!");
        window.location.href = "./admin-page.html";

    } catch (error) {
        console.error(error);
        alert("Erro ao criar vaga");
    }
});
