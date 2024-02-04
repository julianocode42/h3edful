import { Request } from "./request";
import { Response } from "./response";

export interface Next<TRequest extends Request, TResponse extends Response> {
    exec(req: TRequest): Promise<TResponse>;
}

export interface Middleware<
    TRequest extends Request,
    TResponse extends Response,
> {
    exec(req: TRequest, next: Next<TRequest, TResponse>): Promise<TResponse>;
}

export function joinTwoMiddlewares<
    TRequest extends Request,
    TResponse extends Response,
>(
    first: Middleware<TRequest, TResponse>,
    second: Middleware<TRequest, TResponse>
): Middleware<TRequest, TResponse> {
    return {
        exec: async (req: TRequest, next: Next<TRequest, TResponse>) => {
            let secondAsNext: Next<TRequest, TResponse> = {
                exec: async (sReq: TRequest) => {
                    return await second.exec(sReq, next);
                },
            };

            return await first.exec(req, secondAsNext);
        },
    };
}
