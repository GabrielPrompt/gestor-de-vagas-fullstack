const container = document.querySelector(".vagas-container");

document.addEventListener("DOMContentLoaded", init);
document.addEventListener("DOMContentLoaded", carregarUsuarioNavbar)

async function carregarUsuarioNavbar() {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
        const response = await fetch(`${API_URL}/me`, {
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

async function init() {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
        window.location.href = "/index.html";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/candidaturas`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (response.status === 401 || response.status === 403) {
            alert("Acesso não autorizado");
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
        alert("Erro ao carregar candidaturas");
    }
}



function renderizarCandidaturas(candidaturas) {
    container.innerHTML = "";

    if (candidaturas.length === 0) {
        container.innerHTML = "<p>Ninguem se candidatou até o momento.</p>";
        return;
    }

    candidaturas.forEach(c => {
        const wrapper = document.createElement("div");
        wrapper.classList.add("candidaturas");

        wrapper.innerHTML = `
            <div class="vaga-info">
                <div class="vaga-content">
                    <h2 class="title-vaga text-green">${c.tituloVaga}</h2>
                    <p class="local-company">Candidato à vaga: <strong> ${c.nomeUsuario} </strong> </p>
                </div>

                <div class="content-candidatar">
                    <p>Candidatura em ${formatarData(c.createdAt)}</p>
                </div>
            </div>

            <div class="container-btn">
                <div class="detalhes">
                    <button 
                        class="btn-aprovar ${c.status === "APROVADO" ? "btn-aprovado-ativo" : ""}"
                        ${c.feedback ? "disabled" : ""}
                        onclick="atualizarStatus(${c.candidaturaId}, 'APROVADO', this)">
                        Aprovado
                    </button>

                    <button 
                        class="btn-reprovar ${c.status === "REPROVADO" ? "btn-reprovado-ativo" : ""}"
                        ${c.feedback ? "disabled" : ""}
                        onclick="atualizarStatus(${c.candidaturaId}, 'REPROVADO', this)">
                        Reprovado
                    </button>
                </div>

                <div class="detalhes">
                    <button class="btn-cv" disabled>Visualizar CV</button>
                </div>
            </div>

            <div>
                <input 
                    class="input-feedback ${c.feedback ? "text-green" : ""}"
                    id="feedback-${c.candidaturaId}"
                    ${c.feedback ? "disabled" : ""}
                    type="text"
                    placeholder="Digite o feedback"
                    value="${c.feedback ? "Feedback enviado com sucesso!" : ""}"
                >
                <button 
                    class="btn-feedback"
                    ${c.feedback ? "disabled" : ""}
                    onclick="enviarFeedback(${c.candidaturaId})">
                    Enviar Feedback
                </button>
            </div>
        `;

        container.appendChild(wrapper);
    });
}

async function atualizarStatus(idCandidatura, status, button) {
    const candidatura = button.closest(".candidaturas");

    const btnAprovar = candidatura.querySelector(".btn-aprovar");
    const btnReprovar = candidatura.querySelector(".btn-reprovar");

    try {
        const response = await fetch(
            `${API_URL}/candidaturas/${idCandidatura}/status`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ status })
            }
        );

        if (!response.ok) {
            throw new Error("Erro ao atualizar status");
        }

        btnAprovar.classList.remove("btn-aprovado-ativo");
        btnReprovar.classList.remove("btn-reprovado-ativo");

        if (status === "APROVADO") {
            btnAprovar.classList.add("btn-aprovado-ativo");
        } else {
            btnReprovar.classList.add("btn-reprovado-ativo");
        }

    } catch (error) {
        console.error(error);
        alert("Erro ao atualizar status");
    }
}

async function enviarFeedback(idCandidatura) {
    const input = document.getElementById(`feedback-${idCandidatura}`);
    const feedback = input.value.trim();

    if (!feedback) {
        alert("Digite um feedback");
        return;
    }


    try {
        const response = await fetch(
            `${API_URL}/candidaturas/${idCandidatura}/feedback`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ feedback })
            }
        );

        if (!response.ok) {
            throw new Error("Erro ao enviar feedback");
        }

        alert("Feedback enviado com sucesso");

        input.value = "Feedback enviado com sucesso"
        input.classList.add("text-green")


    } catch (error) {
        console.error(error);
        alert("Erro ao enviar feedback, verifique se adicionou um status");
    }
}

function formatarData(dataISO) {
    return new Date(dataISO).toLocaleDateString("pt-BR");
}
