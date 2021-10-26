import { dateDiffInDays } from "../src/client/js/dateDiffInDays";

describe("Testing the date differnce beetween start and end trip", () => {
    test("Testing the dateDiffInDays() function", () => {
        expect(dateDiffInDays).toBeDefined();
    })
})