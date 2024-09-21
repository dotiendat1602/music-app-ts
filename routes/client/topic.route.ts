import express from "express";
const router = express.Router();

import * as controller from "../../controllers/client/topic.controller";

router.get("/", controller.index);

export const topicRoute = router;