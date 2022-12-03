import { Telegraf } from "telegraf";
import glob from "glob";
import { promisify } from "util";
import { Event } from "../structures/Event";
import { CommandType } from "../typings/CommandType";

const globPromise = promisify(glob);

const importFile = async (filePath) => {
    return (await import(filePath))?.default;
};

export class Client extends Telegraf {
    public commands: Map<string, CommandType> = new Map();
    constructor(token: string) {
        super(token);
    }

    private async importFile(filePath: string) {
        return (await import(filePath))?.default;
    }

    public async init() {
        this.launch();
        this.telegram
            .getMe()
            .then((me) => console.log(`${me.username} has logged in!`));
        const commandFiles = await globPromise(
            `${__dirname}/../commands/**/*{.ts,.js}`
        );

        commandFiles.forEach(async (filePath) => {
            const command: CommandType = await importFile(filePath);

            this.command(command.name, (ctx) => {
                const [_, ...args] = ctx.message.text
                    .slice(process.env.PREFIX.length)
                    .trim()
                    .split(/ +/g);

                command.run({ ctx, args });
            });
        });

        const eventFiles = await globPromise(
            `${__dirname}/../events/*{.ts,.js}`
        );

        eventFiles.forEach(async (filePath) => {
            const event: Event = await importFile(filePath);

            this.on(event.event as any, event.run);
        });
    }
}
