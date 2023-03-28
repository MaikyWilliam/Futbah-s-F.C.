$(document).ready(function () {

  $(function () {
    for (let i = 1; i < 4; i++) {
      let header = "Time joga muito bem e garante mais uma vitória";
      let paragrafo = "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Reiciendis excepturi pariatur nisi odio! Sit temporibus illo vitae, distinctio suscipit accusantium tempora iste quasi atque, ipsa, corrupti quisquam recusandae nesciunt eum?";
      let data = ['04/06/2022', '28/05/2022', '21/05/2022']
      let texto = `
            <div class="noticia w33">
                <div class="texto">
                    <img src="images/foto-${i}.jpg" alt="">
                    <p>${data[i - 1]}</p>
                    <h2>${header}</h2>
                    <p>${paragrafo}</p>
                    <a href="#">Saiba mais...</a>
                </div>
            </div>
            `
      document.getElementById("paragrafo").innerHTML += texto;
    }
  })

  $(function () {
    $('.menu-mobile').click(function () {
      $(this).find('ul').slideToggle();
    })
  })

});
