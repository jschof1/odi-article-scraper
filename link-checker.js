const airtable = require('airtable');
const fetch = require('node-fetch');
const jsdom = require("jsdom")

require('dotenv').config();

const key = process.env.AIRTABLE_API_KEY;
const baseId = process.env.AIRTABLE_BASE_ID;


const base = new airtable({apiKey: key}).base(baseId);
const getLinks = async (type, column) => {
    let allLinks = [];
    
    const records = await base(type)
    .select({ view: 'Grid view' })
    .all();
  records.forEach(function (record) {
    allLinks.push(record.fields.Address);
  });
  return await allLinks;
}

// check if youtube video exists
const checkYoutube = async (type) => {
    let allLinks = await getLinks(type);
    let brokenLinks = [];
    for (let i = 0; i < allLinks.length; i++) {
        console.log(allLinks[i])
        let link = allLinks[i];
        if (link.includes('youtube')) {
            let id = link.split('v=')[1];
            let response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`);
            if (response.status >= 400) {
                brokenLinks.push(link);
            }
        }
    }
    return brokenLinks;
}


// checkYoutube('Youtube Videos')


// check if vimeo video exists
const checkVimeo = async (type) => {
    let allLinks = await getLinks(type);
    let brokenLinks = [];
    for (let i = 0; i < allLinks.length; i++) {
        let link = allLinks[i];
        if (link.includes('vimeo')) {
            let id = link.split('.com/')[1];
            let response = await fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${id}`);
            if (response.status >= 400) {
                brokenLinks.push(link);
            }
        }
    }
    return brokenLinks;
}
const checkSoundcloud = async (type) => {
    let allLinks = await getLinks(type);
    let brokenLinks = [];
    for (let i = 0; i < allLinks.length; i++) {
        let link = allLinks[i];
        if (link.includes('soundcloud')) {
            let id = link.split('.com/')[1];
            let response = await fetch(`https://soundcloud.com/oembed?url=https://soundcloud.com/${id}&format=json`);
            if (response.status >= 400) {
                brokenLinks.push(link);
            }
        }
    }
    return brokenLinks;
}


// turn into reusable function
const checkLinks = async (type, url, splitUrl) => {
    let allLinks = await getLinks(type);
    let brokenLinks = [];
    for (let i = 0; i < allLinks.length; i++) {
        let link = allLinks[i];
        if(link.includes(url)) {
            let id = link.split(splitUrl)[1];
            let response = await fetch(`${url}/oembed?url=${url}${id}&format=json`);
            if (response.status >= 400) {
                brokenLinks.push(link);
            }
        }
    }
    return brokenLinks;
}

checkLinks('Youtube Videos', 'youtube', 'v=')


// checkSoundcloud('Podcasts')




// check if webapge https://theodi.org/ contains h1 .page-title with text "Oops! That page can’t be found."
const checkOdi = async (type) => {
    let allLinks = await getLinks(type);
    // console.log(allLinks)
    let brokenLinks = [];
    for (let i = 0; i < allLinks.length; i++) {
        let link = allLinks[i];
        if (link.includes('theodi.org')) {
            let response = await fetch(link)
            let html = await response.text();
            let doc = new jsdom.JSDOM(html);
            // console.log(doc)
            let h1 = doc.window.document.querySelector('h1');
            console.log(h1.textContent)
            if (h1 && h1.textContent === "Oops! That page can’t be found.") {
                brokenLinks.push(link);
            }
        }
    }
    return brokenLinks;
}

checkOdi('Blog')

