// const events = require("inquirer/lib/utils/events");

class Futbah {
  constructor() {
    this.urlListJogador = 'jogadroes/list_jogador.json';
    this.urlNoticia = 'jogadroes/list_noticia.json';
    this.paragrafo = document.getElementById("paragrafo");
    this.elencoJogadores = document.getElementById("elenco");
    this.btnNoticia = "";
  }

  run() {
    this.noticia();
    this.elenco();
    this.rankClassificacao();
    // this.clicando();
  }

  // Procura no json de noticia, e informa os dados do jogo
  async noticia() {

    try {
      const response = await fetch(this.urlNoticia);
      const json = await response.json();

      var i = 1;
      json.jogo.map((noticia) => {
        let header = noticia.titulo;
        let paragrafo = noticia.noticia;
        let data = noticia.data;

        var divNoticia = document.createElement("div");
        var divTexto = document.createElement("div");
        var img = document.createElement("img");
        var pData = document.createElement("p");
        var pParagrafo = document.createElement("p");
        var h2 = document.createElement("h2");
        var a = document.createElement("a");

        img.textContent = `images/foto-${i}.jpg`; 
        pData.textContent = data;
        h2.textContent = header;
        pParagrafo.textContent = paragrafo.substring(0, 250) + "...";
        a.textContent = `Saiba mais...`;

        divNoticia.appendChild(divTexto);
        divTexto.appendChild(img);
        divTexto.appendChild(pData);
        divTexto.appendChild(h2);
        divTexto.appendChild(pParagrafo);
        divTexto.appendChild(a);

        img.setAttribute("src",`images/foto-${i}.jpg`);
        divNoticia.classList.add("noticia");
        divNoticia.classList.add("w33");
        a.classList.add("btn_noticia");
        this.paragrafo.appendChild(divNoticia)
        a.setAttribute("onclick", "href='noticia-single.html'");
        // divNoticia.setAttribute("onclick", this.clicando());
        i++
      })

    } catch (error) {
      console.log(error)
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
      console.error(err);
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
      json.elenco.map((jogador) => {
        classificacao = `
          <tbody> `
        if (i < 5) {
          classificacao += `<tr class="promoted">`
        } else if (i > 17) {
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

      })

    } catch (err) {
      console.error(err);
    }
  }

  // async clicando() {
    // this.btnNoticia = document.querySelector('.btn_noticia');
    // await btnNoticia.addEventListener('click', (e) => {
      // href='noticia-single.html'
      // console.log('e')
    // })
  // }



}

let futbah = new Futbah();
futbah.run();


