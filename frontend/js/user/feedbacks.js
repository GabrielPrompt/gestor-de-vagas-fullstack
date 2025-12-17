const vagasContainer = document.querySelector(".vagas-container");

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

document.addEventListener("DOMContentLoaded", carregarUsuarioNavbar)

document.addEventListener("DOMContentLoaded", carregarFeedbacks);

async function carregarFeedbacks() {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
        window.location.href = "/index.html";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/candidaturas/minhas`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });

        if (response.status === 401) {
            localStorage.removeItem("accessToken");
            alert("Sessão expirada, faça login novamente");
            window.location.href = "/index.html";
            return;
        }

        if (!response.ok) {
            throw new Error("Erro ao buscar feedbacks");
        }

        const candidaturas = await response.json();
        renderizarFeedbacks(candidaturas);

    } catch (error) {
        console.error(error);
        alert("Erro ao carregar feedbacks");
    }
}

function renderizarFeedbacks(candidaturas) {
    vagasContainer.innerHTML = "";

    const candidaturasComFeedback = candidaturas.filter(c => c.feedback);

    if (candidaturasComFeedback.length === 0) {
        vagasContainer.innerHTML = "<p>Nenhum feedback disponível.</p>";
        return;
    }

    candidaturasComFeedback.forEach(candidatura => {
        const wrapper = document.createElement("div");

        wrapper.innerHTML = `
            <div class="vagas">
                <div class="vaga-info">
                    <div class="vaga-content">
                        <h2 class="title-vaga text-green">${candidatura.tituloVaga}</h2>
                        <p class="name-company">Resposta do setor de RH</p>
                    </div>

                    <div class="content-status">
                        <p>Status:</p>
                        <p class="${
                            candidatura.status === "APROVADO"
                                ? "status-aprovado"
                                : candidatura.status === "REPROVADO"
                                    ? "status-reprovado"
                                    : ""
                        }">
                            ${candidatura.status}
                        </p>
                    </div>
                </div>

                <div class="canditatura-feedback">
                    <h3>Feedback:</h3>
                    <p class="feedback">${candidatura.feedback}</p>
                </div>
            </div>
        `;

        vagasContainer.appendChild(wrapper);
    });
}
