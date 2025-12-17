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

document.addEventListener("DOMContentLoaded", carregarMinhasCandidaturas);

async function carregarMinhasCandidaturas() {
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
            throw new Error("Erro ao buscar candidaturas");
        }

        const candidaturas = await response.json();
        renderizarCandidaturas(candidaturas);

    } catch (error) {
        console.error(error);
        alert("Erro ao carregar suas candidaturas");
    }
}

function formatarEnum(texto) {
    if (!texto) return "";
    return texto
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, l => l.toUpperCase());
}

function renderizarCandidaturas(candidaturas) {
    vagasContainer.innerHTML = "";

    if (candidaturas.length === 0) {
        vagasContainer.innerHTML = "<p>Você ainda não se candidatou a nenhuma vaga.</p>";
        return;
    }

    candidaturas.forEach(candidatura => {

        const wrapper = document.createElement("div");

        wrapper.innerHTML = `
            <div class="vagas">
                <div class="vaga-info">
                    <div class="vaga-content">
                        <h2 class="title-vaga text-green">${candidatura.tituloVaga}</h2>
                        <p class="name-company">
                            Status:
                            <strong class="${
                                candidatura.status === 'APROVADO'
                                    ? 'status-aprovado'
                                    : candidatura.status === 'REPROVADO'
                                        ? 'status-reprovado'
                                        : ''
                            }">
                                ${candidatura.status}
                            </strong>
                        </p>
                        <p class="local-company">
                            ${
                                candidatura.feedback
                                ? `<a href="feedbacks.html" class="link-feedback">
                                    Visualizar feedback
                                    </a>`
                                : '<p>Aguardando feedback</p>'
                            }
                    </p>
                    </div>

                    <div class="content-candidatar">
                        <p>Candidatura em ${formatarData(candidatura.createdAt)}</p>
                        <button 
                            class="btn-cancelar"
                            onclick="cancelarCandidatura(${candidatura.vagaId}, this)">
                            Cancelar candidatura
                        </button>
                    </div>
                </div>

                <div class="vaga-detalhes">
                    <div class="detalhes">
                        <img src="../../assets/salario.png">
                        <p>${candidatura.salario}</p>
                    </div>

                    <div class="detalhes">
                        <img src="../../assets/portfolio.png">
                        <p>${formatarEnum(candidatura.experiencia)}</p>
                    </div>

                    <div class="detalhes">
                        <img src="../../assets/escritorio.png">
                        <p>${formatarEnum(candidatura.modalidade)}</p>
                    </div>
                </div>
            </div>
        `;

        vagasContainer.appendChild(wrapper);
    });
}

async function cancelarCandidatura(vagaId, button) {
    button.disabled = true;

    try {
        const response = await fetch(`${API_URL}/vagas/${vagaId}/candidatar`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
            }
        });

        if (!response.ok) {
            throw new Error("Erro ao cancelar candidatura");
        }

        button.closest(".vagas").remove();

    } catch (error) {
        console.error(error);
        alert("Erro ao cancelar candidatura");
        button.disabled = false;
    }
}

function formatarData(dataISO) {
    const data = new Date(dataISO);
    return data.toLocaleDateString("pt-BR");
}
