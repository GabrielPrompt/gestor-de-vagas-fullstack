const form = document.querySelector(".form-criar-vaga");


const params = new URLSearchParams(window.location.search);
const vagaId = params.get("id");


document.addEventListener("DOMContentLoaded", () => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
        window.location.href = "/index.html";
        return;
    }

    if (!vagaId) {
        alert("Vaga inválida");
        window.location.href = "./admin-page.html";
        return;
    }

    carregarVaga(vagaId, accessToken);
});

async function carregarVaga(vagaId, accessToken) {
    try {
        const response = await fetch(`${API_URL}/vagas/${vagaId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error("Erro ao buscar vaga");
        }

        const vaga = await response.json();
        preencherFormulario(vaga);

    } catch (error) {
        console.error(error);
        alert("Erro ao carregar vaga");
        window.location.href = "./admin-page.html";
    }
}

function preencherFormulario(vaga) {
    document.getElementById("titulo").value = vaga.titulo;
    document.getElementById("empresa").value = vaga.empresa;
    document.getElementById("localizacao").value = vaga.localizacao;
    document.getElementById("salario").value = vaga.salario;
    document.getElementById("experiencia").value = vaga.experiencia;
    document.getElementById("modalidade").value = vaga.modalidade;

    document.querySelector(".btn-salvar-vaga").innerText = "Salvar Alterações";
}


form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const accessToken = localStorage.getItem("accessToken");

    const vagaAtualizada = {
        titulo: document.getElementById("titulo").value.trim(),
        empresa: document.getElementById("empresa").value.trim(),
        localizacao: document.getElementById("localizacao").value.trim(),
        salario: document.getElementById("salario").value.trim(),
        experiencia: document.getElementById("experiencia").value,
        modalidade: document.getElementById("modalidade").value
    };

    try {
        const response = await fetch(`${API_URL}/vagas/${vagaId}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(vagaAtualizada)
        });

        if (!response.ok) {
            throw new Error("Erro ao atualizar vaga");
        }

        alert("Vaga atualizada com sucesso!");
        window.location.href = "./admin-page.html";

    } catch (error) {
        console.error(error);
        alert("Erro ao atualizar vaga");
    }
})