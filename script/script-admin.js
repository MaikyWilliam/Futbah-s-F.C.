// Verifique o token JWT no lado do cliente

// Obtenha o token do localStorage
const authToken = localStorage.getItem('authToken');

if (!authToken) {
    // Redirecione o usuário de volta para a página de login
    window.location.href = 'login.html';
} else {
    // Verifique o token
    const tokenParts = authToken.split('.');
    if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));

        // Verifique se o token ainda está válido (por exemplo, verifique a data de expiração)
        const currentTime = Math.floor(Date.now() / 1000); // Tempo atual em segundos
        if (payload.exp && payload.exp < currentTime) {
            // Token expirou, redirecione o usuário para a página de login
            window.location.href = 'login.html';
        } else {
        }
    } else {
        console.error('Token inválido');
        // Token inválido, redirecione o usuário para a página de login
        window.location.href = 'login.html';
    }
}

// Obtém o elemento textarea
const textarea = document.getElementById('noticia-textarea');

// Função para aplicar formatação ao texto selecionado no textarea
function applyFormatting(startTag, endTag) {
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const selectedText = textarea.value.substring(startPos, endPos);

    const newText = startTag + selectedText + endTag;

    textarea.setRangeText(newText, startPos, endPos, 'end');
}

// Botão de negrito
document.getElementById('bold-button').addEventListener('click', function (e) {
    e.preventDefault();
    applyFormatting('<strong>', '</strong>');
});

// Botão de itálico
document.getElementById('italic-button').addEventListener('click', function (e) {
    e.preventDefault();
    applyFormatting('<em>', '</em>');
});

// Botão de emoji
document.getElementById('emoji-button').addEventListener('click', function (e) {
    e.preventDefault();
    applyFormatting('😀', '');
});

// Quando o botão "Salvar" for clicado
$("#salvar-noticia").click(async function () {
    // Obtenha os valores dos campos do formulário
    var data = $("#data").val();
    var titulo = $("#titulo").val();
    var imagens = $("#img").val().split(',').map(image => "images/noticia/" + image.trim()); // Caminhos completos das imagens
    var timeAzul = $("#timeAzul").val().split(",");
    var timeVermelho = $("#timeVermelho").val().split(",");
    var noticia = $("#noticia-textarea").val();

    // Carregue os dados JSON existentes do servidor (ou de onde você os obtém)
    let jsonData = await loadElencoJSON('list_noticia');

    // Verifique se jsonData não é um objeto vazio; se for, inicialize como um objeto vazio
    if (typeof jsonData !== "object" || !jsonData.jogo || !Array.isArray(jsonData.jogo)) {
        jsonData = {
            "jogo": [] // Inicialize como um array vazio se não existir
        };
    }

    // Determine o próximo ID com base na sequência numérica das notícias existentes
    var proximoID = 1; // Valor padrão caso não haja notícias existentes
    if (jsonData.jogo.length > 0) {
        // Encontre o maior ID existente e adicione 1 para obter o próximo ID
        proximoID = Math.max(...jsonData.jogo.map(noticia => noticia.idNoticia)) + 1;
    }

    // Crie um objeto de notícia com os valores
    var novaNoticia = {
        "teveJogo": true,
        "idNoticia": proximoID,
        "data": data,
        "titulo": titulo,
        "img": imagens, // Use a matriz de caminhos das imagens
        "timeAzul": timeAzul,
        "timeVermelho": timeVermelho,
        "noticia": noticia
    };

    jsonData.jogo.push(novaNoticia);

    // Converta o objeto JSON atualizado em uma string JSON
    var jsonString = JSON.stringify(jsonData, null, 2); // O terceiro argumento adiciona recuo para formatação legível

    // Crie um elemento de ancoragem para o download
    var a = document.createElement('a');
    a.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(jsonString);
    a.download = 'noticias.json'; // Nome do arquivo JSON a ser baixado

    // Simule um clique no elemento de ancoragem para iniciar o download
    a.click();

    // Oculte o formulário após a adição da notícia
    $("#add-news-form").hide();
});

const editElencoLink = document.getElementById('edit-elenco');
const addNewsLink = document.getElementById('add-news');
const elencoForm = document.getElementById('elenco-form');
const addNewsForm = document.getElementById('add-news-form');

editElencoLink.addEventListener('click', function (event) {
    event.preventDefault();
    if (elencoForm.style.display === 'none' || elencoForm.style.display === '') {
        elencoForm.style.display = 'block';
        addNewsForm.style.display = 'none';
    } else {
        elencoForm.style.display = 'none';
    }
});

// $("#elenco-form").hide();
addNewsLink.addEventListener('click', function (event) {
    event.preventDefault();
    if (addNewsForm.style.display === 'none' || addNewsForm.style.display === '') {
        addNewsForm.style.display = 'block';
        elencoForm.style.display = 'none';
    } else {
        addNewsForm.style.display = 'none';
    }
});

let elencoJSON;
// Função para carregar o JSON do arquivo
async function loadElencoJSON(arquivo) {
    try {
        const response = await fetch(`jogadores/${arquivo}.json`);
        if (!response.ok) {
            throw new Error('Falha ao carregar JSON.');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return { elenco: [] }; // Retorna um array vazio em caso de erro
    }
}

// Função para gerar a tabela com base nos dados do elenco
async function generateElencoTable() {
    elencoJSON = await loadElencoJSON('list_jogador');
    const elencoTable = document.getElementById("elenco-table");

    elencoJSON.elenco.forEach(jogador => {
        const row = document.createElement("tr");

        // Definir o ID da linha com base no ID do jogador
        row.id = `jogador-${jogador.id}`;

        // Nome do jogador
        const nomeCell = document.createElement("td");
        nomeCell.textContent = jogador.nome;

        // Campos de entrada para gols, assistências e desarmes
        const golsCell = createInputCell(jogador, "gol");
        const classificacaoCell = createInputCell(jogador, "classificacao");
        const assistenciasCell = createInputCell(jogador, "assistencia");
        const desarmesCell = createInputCell(jogador, "desarmes");

        // Célula para mostrar a contagem de resultados (vitórias e empates)
        const resultadosCell = document.createElement("td");
        resultadosCell.className = "resultados"; // Adicione a classe 'resultados'
        resultadosCell.textContent = formatarResultados(jogador);

        // Botão para adicionar +3 às vitórias
        const adicionarVitoriaButton = createButton("+3", "vitoria", () => adicionarVitoria(jogador, 3));

        // Botão para adicionar +1 à classificação (empate)
        const adicionarEmpateButton = createButton("+1 (Empate)", "empate", () => adicionarEmpate(jogador, 1));

        // Adicionar os elementos à linha da tabela
        row.appendChild(nomeCell);
        row.appendChild(classificacaoCell);
        row.appendChild(golsCell);
        row.appendChild(assistenciasCell);
        row.appendChild(desarmesCell);
        resultadosCell.appendChild(adicionarVitoriaButton); // Adicione o botão +3 dentro da célula de resultados
        resultadosCell.appendChild(adicionarEmpateButton); // Adicione o botão +1 (Empate) dentro da célula de resultados
        row.appendChild(resultadosCell); // Adicione a célula de resultados à linha

        elencoTable.appendChild(row);
    });
}

// Função para criar um botão
function createButton(text, classe, onClick) {
    const button = document.createElement("button");
    button.textContent = text;
    button.className = `${classe}-button`;
    button.onclick = onClick;
    return button;
}

// Função para formatar os resultados (vitórias e empates)
function formatarResultados(jogador) {
    const vitorias = jogador.resultados ? jogador.resultados.match(/Vitoria/g) || [] : [];
    const empates = jogador.resultados ? jogador.resultados.match(/Empate/g) || [] : [];

    const vitoriasText = `${vitorias.length} vitórias`;
    const empatesText = `${empates.length} empates`;

    if (vitorias.length > 0 && empates.length > 0) {
        return `${vitoriasText}, ${empatesText}`;
    } else if (vitorias.length > 0) {
        return vitoriasText;
    } else if (empates.length > 0) {
        return empatesText;
    } else {
        return "";
    }
}


// Função para criar uma célula com campo de entrada
function createInputCell(jogador, propriedade) {
    const cell = document.createElement("td");
    const input = document.createElement("input");
    input.type = "number";
    input.value = jogador[propriedade];
    input.onchange = () => atualizarValor(jogador, propriedade, input.value);
    cell.appendChild(input);
    return cell;
}

// Função para atualizar o valor no JSON
function atualizarValor(jogador, propriedade, novoValor) {
    jogador[propriedade] = novoValor;
}

// Função para adicionar vitória
function adicionarVitoria(jogador, pontos) {
    // Adicione 1 à contagem de vitórias
    if (!jogador.vitorias) {
        jogador.vitorias = 0;
    }
    jogador.vitorias += 1;

    // Adicione pontos à classificação
    if (!jogador.classificacao) {
        jogador.classificacao = 0;
    }
    jogador.classificacao += pontos;

    // Atualize a interface do usuário
    const vitoriasCell = document.querySelector(`#jogador-${jogador.id} .resultados`);
    vitoriasCell.textContent = formatarResultados(jogador);

    const classificacaoCell = document.querySelector(`#jogador-${jogador.id} td:nth-child(2)`); // Seleciona a segunda célula (classificação)
    classificacaoCell.textContent = jogador.classificacao;
}

// Função para adicionar empate
function adicionarEmpate(jogador, pontos) {
    // Adicione pontos à classificação (empate)
    if (!jogador.classificacao) {
        jogador.classificacao = 0;
    }
    jogador.classificacao += pontos;

    // Atualize a interface do usuário
    const vitoriasCell = document.querySelector(`#jogador-${jogador.id} .resultados`);
    vitoriasCell.textContent = formatarResultados(jogador);

    const classificacaoCell = document.querySelector(`#jogador-${jogador.id} td:nth-child(2)`); // Seleciona a segunda célula (classificação)
    classificacaoCell.textContent = jogador.classificacao;
}

// Adicione um ouvinte de evento ao botão "Salvar Alterações"
const salvarButton = document.getElementById("salvar-button");
salvarButton.addEventListener("click", () => {
    // Obtenha o JSON do elenco atualizado
    const elencoAtualizado = { elenco: [] };
    const elencoTable = document.getElementById("elenco-table");
    const rows = elencoTable.getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const id = row.id.replace("jogador-", "");
        const jogador = elencoJSON.elenco.find(j => j.id === parseInt(id, 10));

        if (jogador) {
            const vitoriasCell = row.querySelector(".resultados");
            jogador.resultados = parseInt(vitoriasCell.textContent, 10);

            // Remova a propriedade "vitorias" do jogador
            delete jogador.vitorias;
            delete jogador.resultados;

            elencoAtualizado.elenco.push(jogador);
        }
    }

    // Crie um novo objeto Blob com o conteúdo do JSON atualizado
    const novoJSONString = JSON.stringify(elencoAtualizado, null, 2);
    const blob = new Blob([novoJSONString], { type: "application/json" });

    // Crie um elemento de link para download do arquivo JSON atualizado
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "elenco_atualizado.json";

    // Simule um clique no link para iniciar o download
    link.click();

    // Libere o objeto URL
    window.URL.revokeObjectURL(url);
});

// Inicialize a tabela de elenco
generateElencoTable();
