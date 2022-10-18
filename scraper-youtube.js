// scrape youtube channel for videos and add to json file https://www.youtube.com/user/OpenDataInstituteUK/videos

const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const writeFile = promisify(fs.writeFile);

// const { youtube } = require('googleapis/build/src/apis/youtube');
const env = require("dotenv").config();
const youtubeAPIKey = process.env.YOUTUBE_API_KEY;
const youtubeChannelId = process.env.YOUTUBE_CHANNEL_ID;

const youtube = google.youtube({
  version: "v3",
  auth: youtubeAPIKey,
});

const getVideoDetails = async (videoId) => {
  const response = await youtube.videos.list({
    part: "snippet",
    id: videoId,
  });
  return response.data.items[0].snippet;
};

const getVideoStats = async (videoId) => {
  const response = await youtube.videos.list({
    part: "statistics",
    id: videoId,
  });
  return response.data.items[0].statistics;
};

// get the tags from the video description
const getTags = (description) => {
  const tags = description.split("Tags:")[1];
  if (tags) {
    return tags.split(",").map((tag) => tag.trim());
  }
  return [];
};
let ODI = "UCnNmia8FaXDeGAqZNQEF2RA";

const getChannelVideos = async (channelId) => {
  const response = await youtube.search.list({
    channelId,
    part: "snippet",
    order: "date",
    maxResults: 50,
  });
  // console.log('response', response.data.items[0].snippet.description)
  return response.data.items;
};

// get video id of every video in the channel
const getVideoIds = async (channelId) => {
  const videos = await getChannelVideos(channelId);
  return videos.map((video) => video.id.videoId);
};
// find type
const findType = (videoDetails) => {
  if (videoDetails.title.includes("ODI Summit")) {
        "ODI Summit"
      } else if (videoDetails.title.includes("ODI Futures")) {  
        "ODI Podcast"
    } else if (videoDetails.title.includes("Canalside Chats")) {
        "ODI Research"
    } else if (videoDetails.title.includes("ODI Fridays")) {
        "ODI Fridays"
    } else {
        "Topic not found"
    } 
};


getVideoIds(ODI).then((videoIds) => {
  // if undefined, remove from array
  videoIds = videoIds.filter((videoId) => videoId);
  let final = videoIds.map(async (videoId) => {
    const videoDetails = await getVideoDetails(videoId);
    const videoStats = await getVideoStats(videoId);
    const tags = getTags(videoDetails.description);
    const video = {
      title: videoDetails.title,
      description: videoDetails.description,
      publishedAt: videoDetails.publishedAt,
      tags,
      ["Event / Series"] : findType(videoDetails),
      viewCount: videoStats.viewCount,
      likeCount: videoStats.likeCount,
      dislikeCount: videoStats.dislikeCount,
      commentCount: videoStats.commentCount,
      URL: `https://www.youtube.com/watch?v=${videoId}`,
      UploadDate: videoDetails.publishedAt.split("T")[0],
    };
    return video;
  });
  // get the final array of videos
  Promise.all(final)
    .then((videos) => {
      // write the videos to a json file
      fs.writeFile(
        path.join(__dirname, "videos.json"),
        JSON.stringify(videos, null, 2),
        "utf8"
      );
    })
    .catch((err) => {
      console.log("err", err);
    });
});

// getChannelVideos(ODI)
