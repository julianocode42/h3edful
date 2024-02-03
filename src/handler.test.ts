import request from "supertest";
import { createServer } from "http";
import { adaptHandler, adaptNodeHandler } from "./handler";
import { NodeRequest, adaptRequestPacker } from "./request";
import { NodeResponse, adaptResponseWriter } from "./response";

class Req {
    constructor(private nodeReq: NodeRequest) {}

    get path(): string {
        if (typeof this.nodeReq.url == "string") {
            return this.nodeReq.url;
        }

        return "/";
    }
}
class Res {
    body: string;
    code: number;

    constructor(code: number, body: string) {
        this.code = code;
        this.body = body;
    }
}

test("should create a handler with success", async () => {
    let server = createServer(
        adaptNodeHandler<Req, Res>({
            packer: adaptRequestPacker((req: NodeRequest): Req => {
                return new Req(req);
            }),
            writer: adaptResponseWriter((res: Res, nodeRes: NodeResponse) => {
                nodeRes.writeHead(res.code);
                nodeRes.write(res.body);
                nodeRes.end();
            }),
            handler: adaptHandler(async (req: Req): Promise<Res> => {
                try {
                    if (req.path == "/") return new Res(200, "Hello World!");

                    return new Res(404, "");
                } catch (err) {
                    return new Res(500, "");
                }
            }),
        })
    );

    let res = await request(server).get("/");

    expect(res.status).toBe(200);
    expect(res.text).toContain("Hello World!");
});
