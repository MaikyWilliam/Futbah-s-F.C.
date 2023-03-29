$(document).ready(function () {

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

  $(async function () {
    const url = '../jogadroes/list_jogador.json';

    try {
      const response = await fetch(url);
      const json = await response.json();

      var i = 1;
      json.elenco.map((jogador) => {
        let foto = jogador.img ? jogador.img : "images/1.jpeg";
        let texto = `
        <div class="jogador">
          <div class="btn-avancar-jogador">
            <!-- ${jogador.id} -->
            <img src="${foto}" alt="Foto do ${jogador.nome}">
            <h3>${jogador.nome}</h3>
            <p>Posição: ${jogador.posicao}</p>
            <p>Número: ${jogador.numero}</p>
          </div>
        </div>
        `
        document.getElementById("elenco").innerHTML += texto;


        json.elenco.sort( compare );

        let classificacao = `
        <tbody>
            <tr>
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


      // console.log(json);
    } catch (err) {
      console.error(err);
    }
  });

  async function compare(a, b) {
    if (a.classificacao < b.classificacao) {
      console.log(a.classificacao);
      return 1;
    }
    if (a.classificacao > b.classificacao) {
      return -1;
    }
    return 0;
  }

  $(function () {
    $('.menu-mobile').click(function () {
      $(this).find('ul').slideToggle();
    })
  })

});


class Futbah {
  run(){
      this.noticia();
      this.elenco();  
  }


  noticia() {

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
  }

  async elenco(){
    const url = '../jogadroes/list_jogador.json';

    try {
      const response = await fetch(url);
      const json = await response.json();

      var i = 1;
      json.elenco.map((jogador) => {
        let foto = jogador.img ? jogador.img : "images/1.jpeg";
        let texto = `
        <div class="jogador">
          <div class="btn-avancar-jogador">
            <!-- ${jogador.id} -->
            <img src="${foto}" alt="Foto do ${jogador.nome}">
            <h3>${jogador.nome}</h3>
            <p>Posição: ${jogador.posicao}</p>
            <p>Número: ${jogador.numero}</p>
          </div>
        </div>
        `
        document.getElementById("elenco").innerHTML += texto;


        json.elenco.sort( compare );

        let classificacao = `
        <tbody>
            <tr>
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


      // console.log(json);
    } catch (err) {
      console.error(err);
    }
  }

}

let futbah = new Futbah();
// futbah.run();
