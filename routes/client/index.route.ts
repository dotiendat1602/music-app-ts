import { Express } from "express";

import { topicRoute } from "./topic.route";

export const routesClient = (app: Express) => {
    app.use("/topics", topicRoute);
}