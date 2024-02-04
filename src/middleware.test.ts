import { Middleware, Next, joinTwoMiddlewares } from "./middleware";

test("should join two middlewares correctly", async () => {
    type Req = { name: string };
    type Res = { msg: string };

    let m1: Middleware<Req, Res> = {
        exec: async (req: Req, next: Next<Req, Res>): Promise<Res> => {
            let newReq = {
                name: req.name + " First",
            };

            let res = await next.exec(newReq);

            return {
                msg: `<<${res.msg}>>`,
            };
        },
    };

    let m2: Middleware<Req, Res> = {
        exec: async (req: Req, next: Next<Req, Res>): Promise<Res> => {
            let res = {
                msg: `Hello ${req.name}`,
            };

            return res;
        },
    };

    let m3 = joinTwoMiddlewares(m1, m2);

    let res = await m3.exec(
        {
            name: "Bob",
        },
        {
            exec: async req => {
                throw new Error("last middleware call next");
            },
        }
    );

    expect(res.msg).toBe("<<Hello Bob First>>");
});
