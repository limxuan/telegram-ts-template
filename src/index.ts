import { Client } from "./structures/Client";
require("dotenv").config();

const client = new Client(process.env.BOT_TOKEN);
client.init();
