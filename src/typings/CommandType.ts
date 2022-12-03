import { Context } from "telegraf";
import { Update } from "telegraf/types";

interface RunOptions {
    ctx: Context<Update>;
    args: string[];
}

type RunFunction = (options: RunOptions) => any;

export interface CommandType {
    name: string;
    run: RunFunction;
}
