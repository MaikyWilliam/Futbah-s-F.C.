class HttpClient {
    constructor() {
        this.baseUrl = 'https://api.meulance.net.br/website'; 
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

    async postChannelId() {
        const requestData = {
            establishmentName: "FUTHAUS7 É US GURI"
        };

        const url = this.baseUrl + "/channels"; // URL de destino
    
        try {
            const data = await this.makeHttpRequest(url, "POST", requestData, this.token);
            this.quadra = data[0].label;
            this.channelId = data[0].value;
        } catch (error) {
            console.log('Erro na busca de ChannelId:', error);
        }
    }

    async postVideos() {
        try {
            // Passo 1: Login e obtenção do channelId
            await this.login();
            await this.postChannelId();
            
            //Teste para pegar outros dias
            const date = new Date('13/02/2024');
            date.date = '2024-02-13';
            date.hour = '20';

            // Obtém a data atual
            // const date = this.getPreviousSaturday(new Date());
    
            // Passo 2: Cálculo das datas e horas de início e fim dos intervalos desejados
            const startDate1 = new Date('2024-02-13T20:30:00');
            const endDate1 = new Date('2024-02-13T21:00:00');
    
            const startDate2 = new Date('2024-02-13T21:00:00');
            const endDate2 = new Date('2024-02-13T21:30:00');
    
            // Passo 3: Busca dos vídeos para cada intervalo desejado
            const videosInInterval1 = await this.getVideosInInterval(startDate1, endDate1);
            console.log(videosInInterval1)
            const videosInInterval2 = await this.getVideosInInterval(startDate2, endDate2);
            console.log(videosInInterval2)
    
            // Combinar os vídeos de ambos os intervalos
            const allVideos = [...videosInInterval1, ...videosInInterval2];
    
            // Formatar os vídeos em um objeto de resposta
            const responseUrlObject = {
                videos: allVideos.map(item => ({
                    data: date.date,
                    videoId: item.videoId,
                    url: item.url,
                    thumbnailUrl: item.thumbnailUrl,
                    formattedTime: item.formattedTime
                }))
            };
    
            // console.log(responseUrlObject); // Mostra os vídeos encontrados
            return responseUrlObject; // Retorna os vídeos encontrados
        } catch (error) {
            console.log('Erro na busca de vídeos:', error); // Manipula erros de requisição
            return [];
        }
    }
    
    async getVideosInInterval(startDate, endDate) {
        const videoParams = {
            state: 'RS',
            city: 'Estância Velha',
            establishmentName: 'FUTHAUS7 É US GURI',
            channelId: this.channelId,
            day: this.formatToISODate(startDate),
            hour: startDate.getHours().toString() // Utiliza apenas a hora inicial do intervalo
        };
    
        const url = this.baseUrl + "/videos"; // URL de destino
    
        try {
            const responseData = await this.makeHttpRequest(url, "POST", videoParams, this.token);
            // console.log(responseData);
            // Filtra os vídeos para encontrar aqueles dentro do intervalo de horário desejado
            const videosInInterval = responseData.filter(item => {
                // Extraia o tempo formatado
                const videoTime = new Date(`2024-02-13T${item.formattedTime}`); // A data '1970-01-01' é apenas um marcador, pois você está interessado apenas no tempo
            
                // Compare videoTime com startDate e endDate
                return videoTime >= startDate && videoTime < endDate;
            });
            
            return videosInInterval;
        } catch (error) {
            console.log('Erro na busca de vídeos:', error); // Manipula erros de requisição
            return [];
        }
    }


    // async postVideos() {
    //     // Passo 1: Login e obtenção do channelId
    //     await this.login();
    //     await this.postChannelId();

    //     //Teste para pegar outros dias
    //     // const date = new Date('13/02/2024');
    //     // date.date = '2024-02-13';
    //     // date.hour = '20';
        
    //     // Obtém a data atual
    //     const date = this.getPreviousSaturday(new Date());

    //     const videoParams = {
    //         state: 'RS',
    //         city: 'Estância Velha',
    //         establishmentName: 'FUTHAUS7 É US GURI',
    //         channelId: this.channelId,
    //         day: date.date, 
    //         hour: date.hour
    //     };
    
    //     const url = this.baseUrl + "/videos"; // URL de destino
    
    //     try {
    //         const responseData = await this.makeHttpRequest(url, "POST", videoParams, this.token);
    //         const responseUrlObject = {
    //             videos: []
    //         };
    
    //         if (Array.isArray(responseData)) {
    //             // Processa os dados da resposta
    //             responseData.forEach(item => {
    //                 if (item.url) {
    //                     const videoInfo = {
    //                         data: date.date,
    //                         videoId: item.videoId,
    //                         url: item.url,
    //                         thumbnailUrl: item.thumbnailUrl,
    //                         formattedTime: item.formattedTime
    //                     };
    
    //                     responseUrlObject.videos.push(videoInfo);
    //                 }
    //             });
    //         }
            
    //         return responseUrlObject;
    //     } catch (error) {
    //         console.log('Erro na busca de videos:', error);
    //     }
    // }
    

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
