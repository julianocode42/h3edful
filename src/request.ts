import { IncomingMessage } from "http";

export interface Request {}

export type NodeRequest = IncomingMessage;

export interface RequestPacker<TRequest extends Request> {
    pack(req: NodeRequest): TRequest;
}

export function adaptRequestPacker<TRequest extends Request>(
    packFunc: (req: NodeRequest) => TRequest
): RequestPacker<TRequest> {
    return {
        pack: packFunc,
    };
}
