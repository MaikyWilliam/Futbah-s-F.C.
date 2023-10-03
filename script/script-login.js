let usersJSON;
let authToken = null;

// Função para carregar o JSON do arquivo
async function loadUsersJSON() {
    try {
        const response = await fetch('jogadores/users.json');
        if (!response.ok) {
            throw new Error('Falha ao carregar JSON.');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return { usuario: [] }; // Retorna um array vazio em caso de erro
    }
}

// Função para criar um token JWT simulado com tempo de expiração
function createJWTToken(payload, expiresIn) {
    const header = {
        alg: 'HS256',
        typ: 'JWT'
    };

    // Defina a data de expiração no payload
    if (expiresIn) {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        payload.exp = currentTimestamp + expiresIn;
    }

    const secretKey = payload;

    const headerBase64 = btoa(JSON.stringify(header));
    const payloadBase64 = btoa(JSON.stringify(payload));

    const signature = btoa(headerBase64 + '.' + payloadBase64 + '.' + secretKey);

    return headerBase64 + '.' + payloadBase64 + '.' + signature;
}


document.getElementById('login-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    usersJSON = await loadUsersJSON();

    // Obter os valores do usuário e senha
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Verificar se as credenciais correspondem a um usuário no JSON
    const foundUser = usersJSON.usuario.find(user => user.login === username && user.senha === password);

    if (foundUser) {
        // Crie um token JWT simulado com informações do usuário
        const tokenPayload = { userId: foundUser.id };
        // Defina o tempo de expiração para 15 min (em segundos)
        const expiresIn = 60 * 15; // 15 min

        authToken = createJWTToken(tokenPayload, expiresIn);

        // Armazene o token em localStorage
        localStorage.setItem('authToken', authToken);

        // Redirecionar para 'admin.html' ou fazer qualquer outra ação que você deseja
        window.location.href = 'admin.html';
    } else {
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = 'Credenciais inválidas. Tente novamente.';
    }
});