import http from "http";
import { Request, RequestPacker } from "./request";
import { Response, ResponseWriter } from "./response";

export interface Handler<TRequest extends Request, TResponse extends Response> {
    exec(req: TRequest): Promise<TResponse>;
}

export type NodeHandler = (
    req: http.IncomingMessage,
    res: http.ServerResponse<http.IncomingMessage> & {
        req: http.IncomingMessage;
    }
) => void;

export function adaptNodeHandler<
    TRequest extends Request,
    TResponse extends Response,
>(args: {
    packer: RequestPacker<TRequest>;
    writer: ResponseWriter<TResponse>;
    handler: Handler<TRequest, TResponse>;
}): NodeHandler {
    return async (nodeReq, nodeRes) => {
        let req = args.packer.pack(nodeReq);
        let res = await args.handler.exec(req);
        args.writer.write(res, nodeRes);
    };
}

export function adaptHandler<
    TRequest extends Request,
    TResponse extends Response,
>(
    handler: (req: TRequest) => Promise<TResponse>
): Handler<TRequest, TResponse> {
    return {
        exec: handler,
    };
}
