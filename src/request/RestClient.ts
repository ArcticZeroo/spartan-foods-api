import * as superagent from 'superagent';
import {Request, Response, SuperAgentRequest} from 'superagent';

enum RequestType {
    GET = 'get',
    POST = 'post',
    DELETE = 'delete',
    PUT = 'put',
    PATCH = 'patch'
}

class RestClient {

    static async request(agent: Request): Promise<Response> {
        let response: Response;
        try {
            response = await agent;
        } catch (e) {
            throw e;
        }

        RestClient.validateResponse(response);

        return response;
    }

    private static validateResponse(response: Response) {
        if (!response.ok) {
            throw response.status;
        }
    }

    private readonly baseUrl: string;

    constructor(baseUrl: string = '') {
        this.baseUrl = baseUrl;
    }

    async get(url: string): Promise<Response> {
        const agent = this.buildRequestAgent(RequestType.GET, url);

        return RestClient.request(agent);
    }

    async delete(url = ''): Promise<Response> {
        const agent = this.buildRequestAgent(RequestType.DELETE, url);

        return RestClient.request(agent);
    }

    private buildUrl(url: string): string {
        return this.baseUrl + url;
    }

    private buildRequestAgent(method: RequestType, url: string, type = 'json'): SuperAgentRequest {
        return superagent[method](this.buildUrl(url)).type(type);
    }
}

export default RestClient;