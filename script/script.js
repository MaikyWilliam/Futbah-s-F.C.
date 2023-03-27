$(document).ready(function() {

    function noticia() {

        for (let i = 1; i < 4; i++) {
            let header = "Time joga muito bem e garante mais uma vitória";
            let paragrafo = "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Reiciendis excepturi pariatur nisi odio! Sit temporibus illo vitae, distinctio suscipit accusantium tempora iste quasi atque, ipsa, corrupti quisquam recusandae nesciunt eum?";
            let data = ['04/06/2022', '28/05/2022', '21/05/2022']
            let texto = `
            <div class="noticia3 w33">
                <div class="texto">
                    <img src="images/Foto-${i}.JPG" alt="">
                    <p>${data[i - 1]}</p>
                    <h2>${header}</h2>
                    <p>${paragrafo}</p>
                    <a href="#">Saiba mais...</a>
                </div>
            </div>
            `
            document.getElementById("paragrafo").innerHTML += texto;
        }
    }

    noticia();

    // Função para exibir a galeria de imagens
    $('#galeria .thumbnail').click(function() {
      var imgSrc = $(this).attr('src');
      $('#galeria .imagem-principal').fadeOut('fast', function() {
        $(this).attr('src', imgSrc);
        $(this).fadeIn('fast');
      });
    });
  
    // Carrossel de jogadores
    var jogadores = $('#elenco .jogador');
    var numJogadores = jogadores.length;
    var jogadorAtual = 0;
  
    function avancaJogador() {
      jogadores.eq(jogadorAtual).removeClass('ativo');
      jogadorAtual = (jogadorAtual + 1) % numJogadores;
      jogadores.eq(jogadorAtual).addClass('ativo');
    }
  
    function retrocedeJogador() {
      jogadores.eq(jogadorAtual).removeClass('ativo');
      jogadorAtual = (jogadorAtual + numJogadores - 1) % numJogadores;
      jogadores.eq(jogadorAtual).addClass('ativo');
    }
  
    $('#btn-avancar-jogador').click(avancaJogador);
    $('#btn-retroceder-jogador').click(retrocedeJogador);
  
    // Efeitos dinâmicos
    $('.card').hover(function() {
      $(this).addClass('hover');
    }, function() {
      $(this).removeClass('hover');
    });
  
    $('.card').click(function() {
      $(this).toggleClass('selecionado');
    });
  });
  