import { Command } from "../../structures/Command";

export default new Command({
    name: "echo",
    run: async ({ ctx, args }) => {
        console.log("echo ran");
        const content = args.join(" ") || "some content";
        ctx.reply(content);
    }
});
