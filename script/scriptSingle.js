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

        setInterval(async () => {
            // await this.loop();
        }, 2000);
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

    async loop() {
        for (let i = 0; i < this.noticia.img.length; i++) {
            this.imagem[i].style.display = 'none';
        }
    }

    async formatarTextoParaParagrafos(texto) {
        // Divide o texto em parágrafos usando quebras de linha como separador
        const paragrafos = texto.split('\n');

        // Filtra e remove parágrafos vazios
        const paragrafosFiltrados = paragrafos.filter(paragrafo => paragrafo.trim() !== '');

        // Formata cada parágrafo em uma tag <p>
        const paragrafosFormatados = paragrafosFiltrados.map(paragrafo => {
            // Processa a formatação dentro do parágrafo
            const paragrafoFormatado = paragrafo
                .replace(/\[negrito\]/g, '<strong>')
                .replace(/\[\/negrito\]/g, '</strong>')
                .replace(/\[italico\]/g, '<em>')
                .replace(/\[\/italico\]/g, '</em>')
                .replace(/\[emoji\]/g, '😀'); // Substitua por um emoji real

            return `<p class="texto">${paragrafoFormatado}</p>`;
        });

        // Une os parágrafos em uma única string
        const textoFormatado = paragrafosFormatados.join('');
        console.log(textoFormatado);
        return textoFormatado;
    }

    // Função para montar a notícia
    async montaNoticiaSingle() {
        try {
            var container = document.getElementById('noticia_single');
            var div = await this.criarElemento("div", { class: "noticia w100" }, container);
            var titulo = await this.criarElemento("h2", { class: "texto" }, div);

            var item = await this.criarElemento("div", { id: "img" }, div);
            for (let i = 0; i < this.noticia.img.length; i++) {
                this.criarElemento("img", { src: this.noticia.img[i] }, item);
            }
            this.imagem = document.querySelectorAll('#img img');

            var h2Titulo = await this.criarElemento("h2", { class: "texto" }, div);
            var pData = await this.criarElemento("p", { class: "texto" }, div);
            var pNoticia = await this.criarElemento("div", { class: "noticia-texto" }, div);

            titulo.textContent = "Resumo da partida...";
            pData.textContent = this.noticia.data;
            h2Titulo.textContent = this.noticia.titulo;

            // Chama a função para formatar o texto da notícia
            console.log(this.noticia.noticia)
            const textoFormatado = await this.formatarTextoParaParagrafos(this.noticia.noticia);

            // Define o conteúdo da div de texto da notícia com o texto formatado
            pNoticia.innerHTML = textoFormatado;

            this.banner.innerHTML += noticiasSingle;
        } catch (error) {
            // console.log(error)
        }
    }
}

let noticias = new Noticias();
noticias.run();
