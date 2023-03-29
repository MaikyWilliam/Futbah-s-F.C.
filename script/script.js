$(document).ready(function () {

  // import { elenco } from "../jogadroes/list_jogador.json"; 

  $(function () {
    for (let i = 1; i < 4; i++) {
      let header = "Time joga muito bem e garante mais uma vitória";
      let paragrafo = "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Reiciendis excepturi pariatur nisi odio! Sit temporibus illo vitae, distinctio suscipit accusantium tempora iste quasi atque, ipsa, corrupti quisquam recusandae nesciunt eum?";
      let data = ['04/06/2022', '28/05/2022', '21/05/2022'];

      let texto = `
            <div class="noticia w33">
                <div class="texto">
                    <img src="images/foto-${i}.jpg" alt="">
                    <p>${data[i - 1]}</p>
                    <h2>${header}</h2>
                    <p>${paragrafo}</p>
                    <a id="btn-noticia" href="noticia-single.html">Saiba mais...</a>
                </div>
            </div>
            `

      document.getElementById("paragrafo").innerHTML += texto;

    }
  })

  $(function () {
    fetch("../jogadroes/list_jogador.json").then((response) => {
      response.json().then((dados) => {
        dados.elenco.map((jogador) => {
          let texto = `
          <div class="jogador">
            <div class="btn-avancar-jogador">
              <!-- ${jogador.id} -->
              <img src="images/${jogador.id}.jpeg" alt="Foto do ${jogador.nome}">
              <h3>${jogador.nome}</h3>
              <p>Posição: ${jogador.posicao}</p>
              <p>Número: ${jogador.numero}</p>
            </div>
          </div>
          `
          document.getElementById("elenco").innerHTML += texto;

          let classificacao = `
          <tbody>
              <tr>
                  <td>1º</td>
                  <td>${jogador.nome}</td>
                  <td>${jogador.classificacao}</td>
                  <td>${jogador.gol}</td>
                  <td>${jogador.assistencia}</td>
              </tr>
          <tbody>
          `
          document.getElementById("classificacao").innerHTML += classificacao;

        })
      })
    })
  })

  $(function () {
    $('.menu-mobile').click(function () {
      $(this).find('ul').slideToggle();
    })
  })

});
