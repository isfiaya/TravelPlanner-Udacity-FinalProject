import { updateUi } from "../src/client/js/updateUi";

describe("Testing the update UI with the data that came from localstorage", () => {
    test("Testing the updateUi() function", () => {
        expect(updateUi).toBeDefined();
    })
})