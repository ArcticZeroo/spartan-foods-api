import request, { IRequestParams } from './request';

interface IRetryingRequestParams extends IRequestParams {
    attempts?: number;
    type?: string;
}

export default async function retryingRequest<T = string>(url: string, options: IRetryingRequestParams = {}): Promise<T> {
    let { attempts = 2, type } = options;

    try {
        return await request(url, options)
    } catch (e) {
        if (attempts < 1) {
            throw e;
        }

        --attempts;

        return retryingRequest(url, { attempts, type });
    }
}