class Noticias {
    constructor() {
        this.urlListJogador = 'jogadroes/list_jogador.json';
        this.urlNoticia = 'jogadroes/list_noticia.json';
        this.banner = document.getElementById("noticia_single");
        this.noticiaString = localStorage.getItem('noticia'); // Receber a string
        this.noticia = JSON.parse(this.noticiaString); // transformar em objeto novamente
        console.log(this.noticia);
    }

    async run() {
        await this.montaNoticiaSingle();
    }


    // Procura no json de noticia, e informa os dados do jogo
    async montaNoticiaSingle() {
        try {

            let noticiasSingle =
                `<h2>Resumo da partida... </h2>
                <div class="noticia w100">
                    <p class="texto">
                        <img src="${this.noticia.img}" alt="">
                    <p>${this.noticia.data}</p>
                    <h2>${this.noticia.titulo}</h2>
                    <p>${this.noticia.noticia1}</p>
                    <br>
                    <p>${this.noticia.noticia2}</p>
                    <br>
                    <p>${this.noticia.noticia3}</p>
                </div>
                `

            this.banner.innerHTML += noticiasSingle;

        } catch (error) {
            // console.log(error)
        }
    }


}

let noticias = new Noticias();
noticias.run();