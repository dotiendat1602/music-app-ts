import { Request, Response } from "express";
import Topic from "../../models/topic.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
import FavoriteSong from "../../models/favorite-song.model";

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

    const existSongInFavorite = await FavoriteSong.findOne({
        // userId: res.locals.user.id,
        songId: song.id
    });

    if(existSongInFavorite) {
        song["isFavorite"] = true;
    }

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

// [PATCH] /songs/like
export const like = async (req: Request, res: Response) => {
    const { id, type } = req.body;

    const song = await Song.findOne({
        _id: id,
        status: "active",
        deleted: false
    });

    let updateLike = song.like;

    if(type == "like") {
        updateLike = updateLike + 1;
    } else {
        updateLike = updateLike - 1;
    }

    await Song.updateOne({
        _id: id,
        status: "active",
        deleted: false
    }, {
        like: updateLike
    });

    res.json({
        code: 200,
        updateLike: updateLike,
        message: "Cập nhật thành công!"
    });
}

// [PATCH] /songs/favorite
export const favorite = async (req: Request, res: Response) => {
    const { id } = req.body;

    const data = {
      // userId: res.locals.user.id,
      songId: id
    };

    const existSongInFavorite = await FavoriteSong.findOne(data);

    let status = "";
    
    if(existSongInFavorite) {
      await FavoriteSong.deleteOne(data);
    } else {
      const record = new FavoriteSong(data);
      await record.save();
      status = "add";
    }

    res.json({
      code: 200,
      status: status
    });
  };