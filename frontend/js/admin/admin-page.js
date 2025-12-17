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
        const response = await fetch(`${API_URL}/feed`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (response.status === 401) {
            localStorage.removeItem("accessToken");
            alert("Sessão expirada, faça login novamente");
            window.location.href = "/index.html";
            return;
        }

        if (!response.ok) {
            throw new Error("Erro ao buscar vagas");
        }

        const data = await response.json();

        renderizarVagas(data.feedItens);

    } catch (error) {
        console.error(error);
        alert("Erro ao carregar vagas");
    }
}

function formatarEnum(texto) {
    if (!texto) return "";
    return texto
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, l => l.toUpperCase());
}


function renderizarVagas(vagas) {
    container.innerHTML = "";

    if (vagas.length === 0) {
        container.innerHTML = `<p>Nenhuma vaga criada, <a href="./criar-vagas.html" class="text-green">clique aqui para criar.</a></p>`;
        return;
    }

    vagas.forEach(vaga => {
        const div = document.createElement("div");

        div.innerHTML = `
            <div class="vagas">
                <div class="vaga-info">
                    <div class="vaga-content">
                        <h2 class="title-vaga text-green">${vaga.titulo}</h2>
                        <p class="name-company">${vaga.empresa}</p>
                        <p class="local-company">${vaga.localizacao}</p>
                    </div>

                    <div class="content-gerenciar">
                        <div class="container-buttons">
                            <button 
                                class="btn-gerenciar"
                                onclick="editarVaga(${vaga.vagaId})">
                                Editar Vaga
                            </button>

                            <button 
                                class="btn-cancelar"
                                onclick="excluirVaga(${vaga.vagaId})">
                                Excluir Vaga
                            </button>
                        </div>
                    </div>
                </div>

                <div class="vaga-detalhes">
                    <div class="detalhes">
                        <img src="../../assets/salario.png">
                        <p>${vaga.salario ?? "A Combinar"}</p>
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

        container.appendChild(div);
    });
}


function editarVaga(idVaga) {
    window.location.href = `/pages/admin/editar-vagas.html?id=${idVaga}`;
}


async function excluirVaga(idVaga) {
    const confirmar = confirm("Tem certeza que deseja excluir esta vaga?");
    if (!confirmar) return;

    try {
        const response = await fetch(
            `${API_URL}/vagas/${idVaga}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                }
            }
        );

        if (!response.ok) {
            throw new Error("Erro ao excluir vaga");
        }

        alert("Vaga excluída com sucesso");
        init(); 

    } catch (error) {
        console.error(error);
        alert("Erro ao excluir vaga");
    }
}
