const sa = require('superagent');

class HttpService {

    put(url, body ,headers) {
        var request = sa.put(url).accept('application/json');
        if(headers) {
            request = request.set(headers);
        }
        if(body) {
            request.set('Content-Type', 'application/json');
            request = request.send(body);
        }
        return request;
    }

    delete(url, body ,headers) {
        var request = sa.delete(url).accept('application/json');
        if(headers) {
            request = request.set(headers);
        }
        if(body) {
            request.set('Content-Type', 'application/json');
            request = request.send(body);
        }
        return request;
    }

    post(url, body ,headers) {
        var request = sa.post(url).accept('application/json');
        if(headers) {
            request = request.set(headers);
        }
        if(body) {
            request.set('Content-Type', 'application/json');
            request = request.send(body);
        }
        return request;
    }

    get(url, queryParams ,headers) {
        var request = sa.get(url).accept('application/json');
        if(headers) {
            request = request.set(headers);
        }
        if(queryParams) {
            request = request.query(queryParams);
        }
        return request;
    }
    
}


exports.HttpService = HttpService;