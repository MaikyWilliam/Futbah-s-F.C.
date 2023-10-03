function formatarData(dataString) {
    const data = new Date(dataString);

    const dia = (data.getDate() + 1).toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0'); // +1 porque os meses são indexados de 0 a 11
    const ano = data.getFullYear();

    return `${dia}/${mes}/${ano}`;
}

// Função para criar elementos de vídeo dinamicamente com base nos dados do vídeo
function createVideoElement(videoData) {
    const tituloH1 = document.querySelector(".titulo");
    let data = formatarData(videoData.data)
    tituloH1.innerHTML = `Vídeos de ${data}`;
    const videoElement = document.createElement("div");
    videoElement.classList.add("carousel-item");

    // Criar um elemento de vídeo
    const video = document.createElement("video");
    video.controls = true;
    video.innerHTML = `<source src="${videoData.url}" type="video/mp4">`;

    const timeElement = document.createElement("p");
    timeElement.textContent = `Hora: ${videoData.formattedTime}`;

    // Adicionar os elementos criados ao elemento do vídeo
    videoElement.appendChild(video);
    videoElement.appendChild(timeElement);

    return videoElement;
}

// Função para atualizar o carrossel
function updateCarousel() {
    const carousel = document.querySelector(".carousel");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const carouselItems = document.querySelectorAll(".carousel-item");
    let currentIndex = 0;

    // Exibir o vídeo atual
    function showCurrentVideo() {
        carouselItems.forEach((item, index) => {
            if (index === currentIndex) {
                item.style.display = "block";
            } else {
                item.style.display = "none";
            }
        });
    }

    // Avançar para o próximo vídeo
    function nextVideo() {
        currentIndex = (currentIndex + 1) % carouselItems.length;
        showCurrentVideo();
    }

    // Voltar para o vídeo anterior
    function prevVideo() {
        currentIndex = (currentIndex - 1 + carouselItems.length) % carouselItems.length;
        showCurrentVideo();
    }

    // Adicionar eventos aos botões Anterior e Próximo
    prevBtn.addEventListener("click", prevVideo);
    nextBtn.addEventListener("click", nextVideo);

    // Mostrar o primeiro vídeo ao carregar a página
    showCurrentVideo();
}

// Função para salvar um dado no localStorage com tempo de expiração em minutos
function salvarComExpiracao(chave, valor, minutosExpiracao) {
    const agora = new Date();
    const expiracao = new Date(agora.getTime() + minutosExpiracao * 60000); // Converter minutos para milissegundos
    const item = {
        valor: valor,
        expiracao: expiracao.getTime()
    };
    localStorage.setItem(chave, JSON.stringify(item));
}

// Função para recuperar um dado do localStorage com verificação de expiração
function recuperarComExpiracao(chave) {
    const item = JSON.parse(localStorage.getItem(chave));
    if (!item) {
        return null; // Dado não encontrado
    }
    const agora = new Date().getTime();
    if (agora > item.expiracao) {
        localStorage.removeItem(chave); // Remova o dado se estiver expirado
        return null; // Dado expirado
    }
    return item.valor; // Dado válido
}

async function getVideosSite(httpClient) {
    console.log('Chamando Login...');
    await httpClient.login();
    console.log('Chamando getChannelId...');
    await httpClient.getChannelId();
    console.log('Chamando getVideos...');
    const videos = await httpClient.getVideos();

    return videos;
}

// Função para inicializar o carrossel com os vídeos carregados
async function initializeCarousel() {
    // Crie uma instância da classe HttpClient
    const httpClient = new HttpClient();
    async function getVideos() {
        const videosData = recuperarComExpiracao("videos");
        if (videosData !== null) {
            return videosData;
        }

        // Se não houver dados no localStorage, chame a função para buscar os vídeos do site
        let valor = await getVideosSite(httpClient);
        salvarComExpiracao('videos', valor, 30);
        return valor; // Retorna os vídeos buscados do site
    }


    const videosData = await getVideos();

    // Encontre o elemento do carrossel
    const carousel = document.querySelector(".carousel");

    // Adicione os vídeos dinamicamente ao carrossel
    videosData.videos.forEach((videoData) => {
        const videoElement = createVideoElement(videoData);
        carousel.appendChild(videoElement);
    });

    // Inicialize o carrossel
    updateCarousel();
}

// Chame a função para inicializar o carrossel quando a página carregar
window.addEventListener("load", initializeCarousel);