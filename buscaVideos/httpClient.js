class HttpClient {
    constructor() {
        this.baseUrl = 'https://server.meulance.net.br/website';
    }

    async makeHttpRequest(url, method, data = null, authToken = null, headers = {}) {
        try {
            headers['Content-Type'] = 'application/json';

            if (authToken) {
                headers['Authorization'] = `Bearer ${authToken}`;
            }
            // Adicione aqui qualquer cabeçalho adicional necessário para autenticação ou outras finalidades

            const options = {
                method,
                headers,
                body: data ? JSON.stringify(data) : null
            };

            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`Erro na solicitação: ${response.statusText}`);
            }

            const responseData = await response.json();
            return responseData;
        } catch (error) {
            throw new Error(`Erro na requisição: ${error.message}`);
        }
    }

    async objectToQueryString(obj) {
        return Object.keys(obj).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`).join('&');
    }

    async login() {

        try {

            let postData = {
                "email": "maikywilliam.620@gmail.com",
                "password": "96574565"
            };

            let url = this.baseUrl + '/visitor-sessions';
            let data = await this.makeHttpRequest(url, "POST", postData);
            this.token = data.token;
        } catch (error) {
            console.error('Erro no login:', error);
        }

    }

    async getChannelId() {
        // Defina os parâmetros em um objeto
        const queryParams = {
            establishmentName: 'FUTHAUS7 É US GURI'
        };

        // Crie a URL da solicitação GET com a string de consulta
        const baseUrl = this.baseUrl + '/channels';
        const queryString = await this.objectToQueryString(queryParams);
        const url = `${baseUrl}?${queryString}`;

        try {
            let data = await this.makeHttpRequest(url, "GET", null, this.token);
            this.quadra = data[0].label;
            this.channelId = data[0].value;
        } catch (error) {
            console.log('Erro na busca de ChannelId:', data);
        }


    }

    async getVideos() {
        // const date = this.getPreviousSaturday(new Date('2023-09-23 09:15:41 GMT-0300'));
        const date = this.getPreviousSaturday(new Date());

        const videoParams = {
            state: 'RS',
            city: 'Estância Velha',
            establishmentName: 'FUTHAUS7 É US GURI',
            channelId: this.channelId,
            day: date.date, 
            hour: date.hour
        };

        // Crie a URL da solicitação GET com a string de consulta
        const baseUrl = this.baseUrl + '/videos';
        const queryString = await this.objectToQueryString(videoParams);
        const url = `${baseUrl}?${queryString}`;

        try {
            let responseUrl = await this.makeHttpRequest(url, "GET", null, this.token);
            // console.log(responseUrl);
            // Array para armazenar os objetos com as URLs
            const urlObjects = [];

            // Adicione a responseUrl à estrutura desejada
            const responseUrlObject = {
                videos: []
            };

            // Percorra o array de objetos e adicione cada objeto ao array urlObjects e também à estrutura responseUrlObject
            responseUrl.forEach(item => {
                if (item.url) {
                    urlObjects.push({
                        thumbnailUrl: item.thumbnailUrl,
                        url: item.url,
                        hora: item.formattedTime
                    });

                    // Adicione os mesmos dados à estrutura responseUrlObject
                    responseUrlObject.videos.push({
                        data: date.date,
                        videoId: item.videoId,
                        url: item.url,
                        thumbnailUrl: item.thumbnailUrl,
                        formattedTime: item.formattedTime
                    });
                }
            });


            // Exiba o array com os objetos
            // console.log(responseUrlObject);
            return responseUrlObject;

        } catch (error) {
            console.log('Erro na busca de videos:', data);

        }
    }

    formatToISODate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    getPreviousSaturday(date) {
        const previousSaturday = new Date(date);
        previousSaturday.setDate(date.getDate() - (date.getDay() + 1) % 7); // Sábado anterior
        const formattedDate = this.formatToISODate(previousSaturday);
        const formattedHour = '10'; // Define a hora como '10'

        return {
            date: formattedDate,
            hour: formattedHour,
        };
    }

    getCurrentDateOrNextSaturday(date) {
        const currentDate = new Date();

        // Se a data atual for maior que a próxima data de sábado, retorne a próxima data de sábado.
        if (currentDate >= this.getNextSaturday(date)) {
            return this.getNextSaturday(date);
        }

        // Caso contrário, retorne a data atual.
        return currentDate;
    }

}
