import superagent, { Response } from 'superagent';

export interface IRequestParams {
    type?: string;
}

export default async function request(url: string, options: IRequestParams = {}): Promise<any> {
    let response: Response;

    try {
        const agent = superagent.get(url);

        if (options.type) {
            agent.type(options.type);
        }

        response = await agent;
    } catch (e) {
        throw e;
    }

    return response.body;
}