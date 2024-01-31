import { hello } from "./index"

test("hello", async ()=> {

    expect(hello()).toBe("Hello World!")
})