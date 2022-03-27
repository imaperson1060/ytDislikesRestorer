import express from "express";

import { google } from "googleapis";

import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig.js"
var db = new JsonDB(new Config("database", true, true, "/"));

import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "http://localhost:3000/google/auth"
);

if (db_get("refreshToken")) {
    oauth2Client.setCredentials({
        refresh_token: db_get("/refreshToken")
    });
}

const youtube = await google.youtube({
    version: "v3",
    auth: oauth2Client
});

var videos = [];

app.get("/*", async (req, res, next) => {
    if (!db_get("/refreshToken")) {
        var url = await oauth2Client.generateAuthUrl({
            access_type: "offline",
            scope: [ "https://www.googleapis.com/auth/youtube" ]
        });
    
        res.redirect(url);
    } else {
        next();
    }
});

app.get("/", async (req, res) => {
    res.end(await res.render("index.ejs", { optimized: db_get("/optimized") }));
});

app.get("/channel", async (req, res) => {
    var stats = {};
    for await (const x of videos) stats[x.id.videoId] = ((await youtube.videos.list({ part: "statistics", id: x.id.videoId })).data.items)[0];
    res.end(await res.render("channel.ejs", { videos, stats, database: db_get("/videos") || [], optimized: db_get("/optimized") }));
});

app.get("/settings", async (req, res) => {
    res.end(await res.render("settings.ejs", { optimized: db_get("/optimized") }));
});

app.post("/settings", async (req, res) => {
    db.push("/optimized", req.body.optimizationMode == "optimized");
    res.end(await res.render("settings.ejs", { optimized: db_get("/optimized") }));
});

app.get("/run", async (req, res) => {
    res.end(await res.render("run.ejs", { run: false, optimized: db_get("/optimized") }));
});

app.post("/run", async (req, res) => {
    if (req.body.videoId) {
        const video = (await youtube.videos.list({ part: "snippet,statistics", id: req.body.videoId })).data.items[0];

        if (video.snippet.localized.title.match(/\[👍 \d* 👎 \d*\]/g)) {
            video.snippet.title = video.snippet.localized.title.replace(/\[👍 \d* 👎 \d*\]/g, `[👍 ${video.statistics.likeCount} 👎 ${video.statistics.dislikeCount}]`);
        } else {
            video.snippet.title = `${video.snippet.localized.title} [👍 ${video.statistics.likeCount} 👎 ${video.statistics.dislikeCount}]`;
        }
                
        await youtube.videos.update({
            part: "id,localizations,snippet,statistics",
            id: req.body.videoId,
            resource: video
        });
    } else {
        db_get("/videos").forEach(async x => {
            const video = (await youtube.videos.list({ part: "snippet,statistics", id: x })).data.items[0];

            if (video.snippet.localized.title.match(/\[👍 \d* 👎 \d*\]/g)) {
                video.snippet.title = video.snippet.localized.title.replace(/\[👍 \d* 👎 \d*\]/g, `[👍 ${video.statistics.likeCount} 👎 ${video.statistics.dislikeCount}]`);
            } else {
                video.snippet.title = `${video.snippet.localized.title} [👍 ${video.statistics.likeCount} 👎 ${video.statistics.dislikeCount}]`;
            }
                
            await youtube.videos.update({
                part: "id,localizations,snippet,statistics",
                id: x,
                resource: video
            });
        });
    }
    
    res.end(await res.render("run.ejs", { run: req.body.showForm ? false : true, optimized: db_get("/optimized") }));
});

app.post("/", async (req, res) => {
    if (req.body.addVideo) {
        if (typeof req.body.addVideo == "object") req.body.addVideo.forEach(x => db.push(`/videos[]`, x));
        else db.push(`/videos[]`, req.body.addVideo);
    }
    if (req.body.remVideo) {
        var videos = [];

        if (typeof req.body.remVideo == "object") {
            videos = req.body.remVideo;
            videos.forEach(x => db.delete(`/videos[${db.getIndex("/videos", x)}]`));
        } else {
            db.delete(`/videos[${db.getIndex("/videos", req.body.remVideo)}]`);
            videos.push(req.body.remVideo);
        }

        for await (const x of videos) {
            const video = (await youtube.videos.list({ part: "snippet,statistics", id: x })).data.items[0];
            if (video.snippet.localized.title.match(/\[👍 \d* 👎 \d*\]/g)) {
                video.snippet.title = video.snippet.localized.title.replace(/\[👍 \d* 👎 \d*\]/g, "");
            }
                
            await youtube.videos.update({
                part: "id,localizations,snippet,statistics",
                id: x,
                resource: video
            });
        }
    }

    if (req.body.refreshVideos) await getVideos();

    res.redirect(req.body.ref);
});

app.get("/google/auth", async (req, res) => {
    const { tokens } = await oauth2Client.getToken(req.query.code);
    oauth2Client.setCredentials(tokens);
    res.redirect("/");
});

oauth2Client.on("tokens", async (tokens) => {
    if (tokens.refresh_token) {
        db.push("/refreshToken", tokens.refresh_token);
    }
});

function db_get(entry) {
    try {
        return db.getData(entry);
    } catch (e) {
        return false;
    }
}

async function getVideos() {
    videos = (await youtube.search.list({ part: "snippet", forMine: true, type: "video", maxResults: 50 })).data.items;
}

app.listen(process.env.PORT, () => console.log(`Dislike updater running on ${process.env.PORT}`));