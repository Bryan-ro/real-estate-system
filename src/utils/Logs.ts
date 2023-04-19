import { Application } from "express";
import { createWriteStream } from "fs";
import { join } from "path";
import morganBody from "morgan-body";

export class Logs {
    private logs = createWriteStream(join(__dirname, "../logs", "requestsAndResponsesLogs.log"), { flags: "a" });

    public storeLog(app: Application) {
        morganBody(app, {
            noColors: true,
            stream: this.logs,
            filterParameters: ["password", "authorization"],
            logIP: true,
            logRequestId: true
        });
    }
}


