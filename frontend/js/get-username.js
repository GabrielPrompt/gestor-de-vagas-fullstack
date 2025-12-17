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


document.addEventListener("DOMContentLoaded", carregarUsuarioNavbar)