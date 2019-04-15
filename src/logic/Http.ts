const http = {
    get: (url: string): Promise<any> => {
        const request = new XMLHttpRequest();
    
        return new Promise((resolve, reject) => {
            request.open("GET", url);
    
            request.onload = () => {
                if (request.status >= 200 && request.status < 300) {
                    resolve(request.response);
                } else {
                    reject({
                        status: request.status,
                        statusText: request.statusText
                    });
                }
            };
    
            request.onerror = () => {
                reject({
                    status: request.status,
                    statusText: request.statusText
                });
            };
            
            request.send();
        });
    }
}

export default http;