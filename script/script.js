$(document).ready(function () {

  // Procura no json de noticia, e informa os dados do jogo
  $(async function () {
    const url = 'jogadroes/list_noticia.json';
    const response = await fetch(url);
    const json = await response.json();

    var i = 1;
    json.jogo.map((noticia) => {
      let header = noticia.titulo;
      let paragrafo = noticia.noticia;
      let data = noticia.data;

      let texto = `
            <div class="noticia w33">
                <div class="texto">
                    <img src="images/foto-${i}.jpg" alt="">
                    <p>${data}</p>
                    <h2>${header}</h2>
                    <p>${paragrafo.substring(0,250)}...</p>
                    <a id="btn-noticia" href="noticia-single.html">Saiba mais...</a>
                </div>
            </div>
            `

      document.getElementById("paragrafo").innerHTML += texto;
      i++
    })
  })

  // Procura no Json de jogadores as informações do elenco
  $(async function () {
    const url = 'jogadroes/list_jogador.json';

    try {
      var classificacao = "";
      const response = await fetch(url);
      const json = await response.json();



      var i = 1;
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
          console.log(jogador.campeao.qtd);
          for (let i = 0; i < jogador.campeao.qtd; i++) {
            texto += `<img class="${jogador.campeao.class}"  src="images/estrela.png" alt="Foto do ${jogador.nome}" title="Campeão em ${jogador.campeao.ano}">`
          }
        }

        texto +=
          `</div></div>`
        document.getElementById("elenco").innerHTML += texto;

      })

      // Ordena pela classificação
      json.elenco.sort((a, b) => {
        if (a.classificacao > b.classificacao) {
          return -1;
        }
        if (a.classificacao < b.classificacao) {
          return 1;
        }
        console.log()
      });

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


      console.log(json);
    } catch (err) {
      console.error(err);
    }
  });

  $(function () {
    $('.nome_rank').click(function () {
      console.log("aqui")
    })
  })

  $(function () {
    $('.menu-mobile').click(function () {
      $(this).find('ul').slideToggle();
    })
  })

});

