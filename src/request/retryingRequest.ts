import superagent = require('superagent');
import { Response } from 'superagent';

interface IRequestParams {
    attempts?: number;
    type?: string;
}

export default async function retryingRequest<T = string>(url: string, { attempts = 2, type }: IRequestParams = {}): Promise<T> {
    let response: Response;

    try {
        const agent = superagent.get(url);

        if (type) {
            agent.type(type);
        }

        response = await agent;
    } catch (e) {
        if (attempts < 1) {
            throw e;
        }

        --attempts;

        return retryingRequest(url, { attempts, type });
    }

    return response.body;
}