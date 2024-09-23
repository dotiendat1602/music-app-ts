import { Request, Response } from "express";
import Topic from "../../models/topic.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";

// [GET] /songs/:slugTopic
export const list = async (req: Request, res: Response) => {
    const slugTopic = req.params.slugTopic;

    const topic = await Topic.findOne({
        slug: slugTopic,
        deleted: false,
        status: "active"
    });

    const songs = await Song.find({
        topicId: topic.id,
        deleted: false,
        status: "active"
    }).select("title avatar singerId like slug");

    for (const item of songs) {
        const singerInfo = await Singer.findOne({
            _id: item.singerId,
        }).select("fullName");

        item["singerFullName"] = singerInfo["fullName"];
    }

    res.render("client/pages/songs/list", {
        pageTitle: topic.title,
        songs: songs,
    });
}

// [GET] /songs/:slugSong
export const detail = async (req: Request, res: Response) => {
    const slugSong: string = req.params.slugSong;

    const song = await Song.findOne({
        slug: slugSong,
        deleted: false,
        status: "active"
    });

    const topic = await Topic.findOne({
        _id: song.topicId,
    }).select("title");

    const singer = await Singer.findOne({
        _id: song.singerId
    }).select("fullName");

    res.render("client/pages/songs/detail", {
        pageTitle: "Chi tiết bài hát",
        topic: topic,
        song: song,
        singer: singer
    });
}