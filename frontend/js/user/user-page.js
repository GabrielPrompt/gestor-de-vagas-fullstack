const vagasContainer = document.querySelector(".vagas-container");

document.addEventListener("DOMContentLoaded", init);

async function init() {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
        window.location.href = "/index.html";
        return;
    }

    try {
        const [feedResponse, minhasCandidaturas] = await Promise.all([
            fetch(`${API_URL}/feed`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            }),
            buscarMinhasCandidaturas()
        ]);

        if (feedResponse.status === 401) {
            localStorage.removeItem("accessToken");
            alert("Sessão expirada, faça login novamente");
            window.location.href = "/index.html";
            return;
        }

        console.log(`${API_URL}/feed`)

        if (!feedResponse.ok) {
            throw new Error("Erro ao buscar vagas");
        }

        const data = await feedResponse.json();
        renderizarVagas(data.feedItens, minhasCandidaturas);

    } catch (error) {
        console.error(error);
        alert("Erro ao carregar vagas");
    }
}

async function buscarMinhasCandidaturas() {
    try {
        const response = await fetch(`${API_URL}/candidaturas/minhas`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
            }
        });

        if (!response.ok) return [];
        const data = await response.json(); 

        return data.map(c => c.vagaId);

    } catch {
        return [];
    }
}

function formatarEnum(texto) {
    if (!texto) return "";
    return texto
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, l => l.toUpperCase());
}

function renderizarVagas(vagas, minhasCandidaturas) {
    vagasContainer.innerHTML = "";

    if (vagas.length === 0) {
        vagasContainer.innerHTML = "<p>Não há vagas disponiveis no momento.</p>";
        return;
    }
    

    vagas.forEach(vaga => {
        const jaCandidatado = minhasCandidaturas.includes(vaga.vagaId);

        const wrapper = document.createElement("div");

        wrapper.innerHTML = `
            <div class="vagas">
                <div class="vaga-info">
                    <div class="vaga-content">
                        <h2 class="title-vaga text-green">${vaga.titulo}</h2>
                        <p class="name-company">${vaga.empresa}</p>
                        <p class="local-company">${vaga.localizacao}</p>
                    </div>

                    <div class="content-candidatar">
                        <p>vaga criada em ${formatarData(vaga.criadaEm)}</p>
                        ${
                            jaCandidatado
                                ? `<button class="btn-gerenciar" onclick="irParaMinhasCandidaturas()">Gerenciar candidatura</button>`
                                : `<button class="btn-candidatar" onclick="candidatar(${vaga.vagaId}, this)">Candidatar</button>`
                        }
                    </div>
                </div>

                <div class="vaga-detalhes">
                    <div class="detalhes">
                        <img src="../../assets/salario.png">
                        <p>${vaga.salario}</p>
                    </div>

                    <div class="detalhes">
                        <img src="../../assets/portfolio.png">
                        <p>${formatarEnum(vaga.experiencia)}</p>
                    </div>

                    <div class="detalhes">
                        <img src="../../assets/escritorio.png">
                        <p>${formatarEnum(vaga.modalidade)}</p>
                    </div>
                </div>
            </div>
        `;

        vagasContainer.appendChild(wrapper);
    });
}

async function candidatar(vagaId, button) {
    button.disabled = true;

    try {
        const response = await fetch(`${API_URL}/vagas/${vagaId}/candidatar`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
            }
        });

        if (!response.ok) {
            throw new Error("Erro ao se candidatar");
        }

        button.innerText = "Gerenciar candidatura";
        button.classList.remove("btn-candidatar");
        button.classList.add("btn-gerenciar");
        button.onclick = irParaMinhasCandidaturas;

    } catch (error) {
        console.error(error);
        alert("Erro ao se candidatar");
    } finally {
        button.disabled = false;
    }
}

function irParaMinhasCandidaturas() {
    window.location.href = "/pages/user/candidaturas.html";
}

function formatarData(dataISO) {
    return new Date(dataISO).toLocaleDateString("pt-BR");
}
