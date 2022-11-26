const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require("input"); // npm i input

const TG_API_ID = 19374719;
const TG_API_HASH = "0c858df31d89c50b7a94342629b6f50d";
// const sessionStr = '1AQAOMTQ5LjE1NC4xNzUuNTYBu3WaLCFdFL0yOLODz6yqUnGWEzKl2aSUWz2wLlePG/oIkC3sxiUlkV+8Im2ZIexCRffwnlnVWkP/8ZE8X9ZisvqJfN+anv77GC6qR7kT+qkF3F6RTrzE0agYaiTWMIsHyiz+DIbf9l29xkTdmvFDYes2V3GeiUnqzhBhkiB32g6xrFzD4OcL/J4fcRU6kvkk1svCH+OzkGHhQKscOwctYnWijyhOBDOcGHDO26N5Qeqmaujylr23fYHJ9A8tRrnroirdfEtN42BLhlf4N39P4afemLD0uoDw9gP4NaDOn0rUXFrnfyFsBEQm2alZdULg+rBW8zr3xOYJgfFR5NPOCYI='
// remote host:
// 1AQAOMTQ5LjE1NC4xNzUuNjABu6qk6M1tFM2uQo0oQvM2pQij5uBA5RyrK2An3ZMFTcKx8x4xMU/1pB8+fV1aSkUUkEx2Lpts/I5vuhyyHup9L0Sh4l9iMDJ/6+efuHUn/uemsY9dRPAmxgAXAqHHMhzMB4H429izLZcUpZQcozsv3SdplrHELz4XhJlQQaPP3LG6WsBswSX5VMt1d+Vqs0j4foawimz9JIMFyrOI2ewdOTfvMOiswEMxD4ORm7moXbTJqtGutc8xetIlZU+4uIhNBjfuMIT0eMI8HvjHqmdwZwkBhhItbrntmRQlaCn5XDY6Nr1yuIWWSHkdTkgjY3v4Arf8lN4NhCk4Lv28+gF5/uE=
const stringSession = new StringSession("");

(async () => {
    console.log("Loading interactive example...");
    const client = new TelegramClient(stringSession, TG_API_ID, TG_API_HASH, {
        connectionRetries: 5,
    });
    await client.start({
        phoneNumber: async () => await input.text("Please enter your number: "),
        password: async () => await input.text("Please enter your password: "),
        phoneCode: async () =>
            await input.text("Please enter the code you received: "),
        onError: (err) => console.log(err),
    });
    console.log("You should now be connected.");
    console.log(client.session.save()); // Save this string to avoid logging in again
    await client.sendMessage("me", { message: "Hello!" });
})();