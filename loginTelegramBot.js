const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require("input"); // npm i input

const stringSession = ''; // leave this empty for now
const TG_API_ID = 19374719;
const TG_API_HASH = "0c858df31d89c50b7a94342629b6f50d";
const BOT_TOKEN = '5730105367:AAFipUScQE3xab2x6iubZMUm-2QkCiU5QFc'; // put your bot token here
// key for local host
// 1AQAOMTQ5LjE1NC4xNzUuNTYBuxk0mXKSiBTfpaDapzvlGtoRTd9ki9p8kBRQSpDhLBaw0fQ1lbE2RtkLkdfsS3pUPYHA5S4+oTYbgIfyHHHSquQPX9lsjzAuhVo2PjEom3ufyK/l8UgJgKcBIKvpcuYIDfRlbhq3Z0AZKG/WlYh16juiP9h3ZIWHTeCGfEB39rXexxPOR0SG8P4INHRLTW4REDro80WEYkwRK6Lfi6/U2o53d6VSsnCjkg9osQjgw3ERSJEQwJ1fQBBOcFCbbtQHK/Js1qXtwfQ+96kYXtXxnP2ZjEWUpbPp59/SDlomI+Fnq5/2TnKR0MN/erok3ZY1HtQEovc7ysoDLrWkombaumM=
// key for remote host
// 1AQAOMTQ5LjE1NC4xNzUuNTQBu8MRedBXyYp0b421yC/bfpjypa3KiycOXYnhDqWYAtpNPOlXZ+oCWvnCuzoBNSMdYgDoCgLzlWmgfll8H+JfVE7ZJqupKS/D/siLbTD7v4pz1lZsXBBcTswB6m/rFea9V4d1ywTltIOexR6oEhq6wJkNhieH14zPD7QHM+GtMJM+VdHtqojWsblCnuPZUd6WaWKZTk+gMOUu05UekAWNRFjx8Ry/3tk52L4EIJqjaFIbd4NXWG72mTCzSXU18jAAXVtO76PJl3a1/3F+oLdlQJMoTfls7GJa/YC7DdEfrKhzgJrw5DqAXL9U8kKsY9q8iPofu5scrn4+Bon4YcVM4ps=
(async () => {
    const client = new TelegramClient(new StringSession(stringSession),
        TG_API_ID, TG_API_HASH, { connectionRetries: 5 });
    await client.start({
        botAuthToken: BOT_TOKEN
    });
    console.log(client.session.save())
})();