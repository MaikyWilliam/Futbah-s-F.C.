// const events = require("inquirer/lib/utils/events");

class Futbah {
    constructor() {
        this.urlListJogador = 'jogadores/list_jogador.json';
        this.urlNoticia = 'jogadores/list_noticia.json';
        this.paragrafo = document.getElementById("paragrafo");
        this.elencoJogadores = document.getElementById("elenco");
        this.banner = document.getElementById(".banner");
        this.btnNoticia = "";
    }

    async run() {
        await this.noticia();
        await this.elenco();
        await this.rankClassificacao();
        this.clicando();
    }

    async ordenaNoticia(json) {
        // Ordena pela classificação
        json.sort((a, b) => {
            if (a.idNoticia > b.idNoticia) {
                return -1;
            }
            if (a.idNoticia < b.idNoticia) {
                return 1;
            }
            // console.log()
        });
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
        return textoFormatado;
    }

    // Procura no json de noticia, e informa os dados do jogo
    async noticia() {
        try {
            const response = await fetch(this.urlNoticia);
            const json = await response.json();
            let noticia = json.jogo;

            for (let i = 0; i < noticia.length; i++) {
                this.ordenaNoticia(noticia);

                let header = noticia[i].titulo;
                let textoNoticia = noticia[i].noticia;
                let data = noticia[i].data;

                var divNoticia = document.createElement("div");
                var img = document.createElement("img");
                var pData = document.createElement("p");
                var pParagrafo = document.createElement("p");
                var h2 = document.createElement("h2");
                var a = document.createElement("a");

                img.textContent = noticia[i].img[0];
                pData.textContent = data;
                h2.textContent = header;

                // Chama a função para formatar o texto da notícia
                let paragrafo = await this.formatarTextoParaParagrafos(textoNoticia);
                // let paragrafo = textoNoticia;
                pParagrafo.innerHTML = paragrafo.substring(0, 200) + "...";

                a.textContent = `Saiba mais...`;

                divNoticia.appendChild(img);
                divNoticia.appendChild(pData);
                divNoticia.appendChild(h2);
                divNoticia.appendChild(pParagrafo);
                divNoticia.appendChild(a);

                img.setAttribute("src", noticia[i].img[0]);
                divNoticia.classList.add("noticia");
                divNoticia.classList.add("w33");
                divNoticia.classList.add(data);
                a.classList.add("btn_noticia");
                a.setAttribute("href", "noticia-single.html");
                this.paragrafo.appendChild(divNoticia);
                a.setAttribute("onclick", "futbah.clicando()");
                a.classList.add(data);
                if (i >= 2) { break; }
            }
        } catch (error) {
            // console.log(error)
        }
    }


    // Procura no Json de jogadores as informações do elenco
    async elenco() {

        try {
            const response = await fetch(this.urlListJogador);
            const json = await response.json();

            json.elenco.map((jogador) => {

                let texto = `
            <div class="jogador">
            <div class="btn-avancar-jogador">
            <!-- ${jogador.id} -->
            <img src="${jogador.img}" alt="Foto do ${jogador.nome}">
            <h3>${jogador.nome}</h3>
            <p>Posição: ${jogador.posicao}</p>
            <p>Número: ${jogador.numero}</p>`

                if (jogador.campeao.class == "campeao") {
                    for (let i = 0; i < jogador.campeao.qtd; i++) {
                        texto += `<img class="${jogador.campeao.class}"  src="images/estrela.png" alt="Foto do ${jogador.nome}" title="Campeão em ${jogador.campeao.ano}">`
                    }
                }

                texto +=
                    `</div></div>`
                this.elencoJogadores.innerHTML += texto;

            })
        } catch (err) {
            // console.error(err);
        }
    }

    // Procura no Json de jogadores as informações de classificação
    async rankClassificacao() {

        try {
            let classificacao = "";
            const response = await fetch(this.urlListJogador);
            const json = await response.json();

            // Ordena pela classificação
            json.elenco.sort((a, b) => {
                if (a.classificacao > b.classificacao) {
                    return -1;
                }
                if (a.classificacao < b.classificacao) {
                    return 1;
                }
                // console.log()
            });

            var i = 1;
            this.nomesE = Array[{}];
            json.elenco.map((jogador) => {

                classificacao = `
                <tbody> `
                if (i < 5) {
                    classificacao += `<tr class="promoted">`
                } else if (i > 14) {
                    classificacao += `<tr class="relegated">`
                } else {
                    classificacao += `<tr>`
                }

                classificacao += `
                        <td>${i}</td>
                        <td>${jogador.nome}</td>
                        <td>${jogador.classificacao}</td>
                        <td>${jogador.gol}</td>
                        <td>${jogador.assistencia}</td>
                    </tr>
                <tbody>
                `
                document.getElementById("classificacao").innerHTML += classificacao;
                i++;

                let novoObjeto = { nome: jogador.nome, classificacao: jogador.classificacao };
                // console.log(novoObjeto); // pegar a lista da classificação


            })

            // let posicao = 1;
            // console.log(`| Posição | Nome | Classificacao |`)
            // console.log(`| ------- | ---- | ------------- |`)
            // for (let i = 0; i < json.elenco.length; i++) {
            //     console.log(`| ${posicao} | ${json.elenco[i].nome} | ${json.elenco[i].classificacao} |`)
            //     posicao++
            // }
            localStorage.setItem('elenco', JSON.stringify(json.elenco));

        } catch (err) {
            // console.error(err);
        }
    }

    async clicando() {
        const response = await fetch(this.urlNoticia);
        const json = await response.json();

        this.btnNoticia = document.querySelectorAll('.noticia .w33')
        // console.log(noticias);

        NodeList.prototype.addEventListener = function (event, func) {
            this.forEach(function (content, item) {
                // console.log(item);
                content.addEventListener(event, func);
            });
        }

        this.btnNoticia.addEventListener("click", function (e) {
            // console.log(this, "  awas clicked");
            // console.log(json);

            for (let i = 0; i < json.jogo.length; i++) {
                if (e.target.classList[1] == json.jogo[i].data) {
                    localStorage.setItem('noticia', JSON.stringify(json.jogo[i]));

                    window.location.href = "noticia-single.html";

                    // futbah.enviaNoticia(noticia);
                }
            }

        });
    }
}

let futbah = new Futbah();
futbah.run();


