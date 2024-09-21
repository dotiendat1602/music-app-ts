import express from "express";
const router = express.Router();

import * as controller from "../../controllers/client/song.controller";

router.get("/:slugTopic", controller.list);

export const songRoute = router;