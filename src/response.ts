import { IncomingMessage, ServerResponse } from "http";

export interface Response {}

export type NodeResponse = ServerResponse<IncomingMessage> & {
    req: IncomingMessage;
};

export interface ResponseWriter<TResponse extends Response> {
    write(src: TResponse, dest: NodeResponse): void;
}

export function adaptResponseWriter<TResponse extends Response>(
    writer: (src: TResponse, dest: NodeResponse) => void
): ResponseWriter<TResponse> {
    return {
        write: writer,
    };
}
