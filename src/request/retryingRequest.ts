import superagent = require('superagent');
import { Response } from 'superagent';

export default async function retryingRequest(url: string, attempts: number = 2): Promise<string> {
    let response: Response;

    try {
        response = await superagent.get(url);
    } catch (e) {
        if (attempts < 1) {
            throw e;
        }

        return retryingRequest(url, --attempts);
    }

    return response.body;
}