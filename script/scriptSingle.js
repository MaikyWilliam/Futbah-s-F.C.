class Noticias {
    constructor() {
        this.banner = document.getElementById("noticia_single");
        this.noticiaString = localStorage.getItem('noticia'); // Receber a string
        this.noticia = JSON.parse(this.noticiaString); // transformar em objeto novamente
        this.jsonJogadores = localStorage.getItem('elenco'); // Receber a string
        this.elenco = JSON.parse(this.jsonJogadores); // transformar em objeto novamente
        
        // console.log(this.noticia);
    }

    async run() {
        await this.montaNoticiaSingle();
    }

    async criarElemento(tag, atributos, pai) {
        var elemento = document.createElement(tag);
        for (var chave in atributos) {
            elemento.setAttribute(chave, atributos[chave]);
        }
        if (pai) {
            pai.appendChild(elemento);
        }

        return elemento;
    }

    // Procura no json de noticia, e informa os dados do jogo
    async montaNoticiaSingle() {
        try {
            var container = document.getElementById('noticia_single')
            var div = await this.criarElemento("div", { class: "noticia w100" }, container);
            var titulo = await this.criarElemento("h2", { class: "texto" }, div);

            var item = await this.criarElemento("div", { id: "img"}, div);
            for (let i = 0; i < this.noticia.img.length; i++) {
                this.criarElemento("img", { src: this.noticia.img[i] }, item);
            }
            
            var h2Titulo = await this.criarElemento("h2", { class: "texto" }, div);
            var pData = await this.criarElemento("p", { class: "texto" }, div);
            var pNoticia1 = await this.criarElemento("p", { class: "texto" }, div);
            await this.criarElemento("br", { class: "texto" }, div);
            var pNoticia2 = await this.criarElemento("p", { class: "texto" }, div);
            await this.criarElemento("br", { class: "texto" }, div);
            var pNoticia3 = await this.criarElemento("p", { class: "texto" }, div);
            await this.criarElemento("br", { class: "texto" }, div);

            var noticiasSingle = "";
            if (this.noticia.teveJogo) {
                titulo.textContent = "Resumo da partida...";
                pData.textContent = this.noticia.data;
                h2Titulo.textContent = this.noticia.titulo
                pNoticia1.textContent = this.noticia.noticia1
                pNoticia2.textContent = this.noticia.noticia2
                pNoticia3.textContent = this.noticia.noticia3
            } else if (this.noticia.teveJogo == false) {
                titulo.textContent = "Resumo da partida...";
                pData.textContent = this.noticia.data;
                h2Titulo.textContent = this.noticia.titulo
                pNoticia1.textContent = this.noticia.noticia1
            }

            this.banner.innerHTML += noticiasSingle;

        } catch (error) {
            // console.log(error)
        }
    }
}

let noticias = new Noticias();
noticias.run();
