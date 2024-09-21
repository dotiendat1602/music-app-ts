import { Express } from "express";

import { topicRoute } from "./topic.route";

import { songRoute } from "./song.route";

export const routesClient = (app: Express) => {
    app.use("/topics", topicRoute);

    app.use("/songs", songRoute);
}