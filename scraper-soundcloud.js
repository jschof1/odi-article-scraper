const SoundCloud = require("soundcloud-scraper");
const client = new SoundCloud.Client();
const fs = require("fs");

// get all links from sound cloud user page
async function getLinks() {
    let links = [];
    let page = 1;
    let response = await client.getUser("theodi", 3)
    // loop through all of the pages of the response and get the .tracks and get the .url
    while (response.tracks > 0) {
        response.tracks.forEach((track) => {
            // console.log(track.url);§
            links.push(track.url);
        });
        page++;

    }
    return links;
}
    getLinks()
// 
    // client.getSongInfo("https://soundcloud.com/theodi/20150206_odifridays_lmi_peter-glover")
    // .then(async song => {
    //     const stream = await song.downloadProgressive();
    //     const writer = stream.pipe(fs.createWriteStream(`./${song.title}.mp3`));
    //     writer.on("finish", () => {
    //       console.log("Finished writing song!")
    //       process.exit(1);
    //     });
    // })
    // .catch(console.error);
