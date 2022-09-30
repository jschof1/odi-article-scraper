const airtable = require('airtable');
const fs = require('fs');

require('dotenv').config();

const key = process.env.AIRTABLE_API_KEY;
const baseId = process.env.AIRTABLE_BASE_ID;

const base = new airtable({apiKey: key}).base(baseId);


const exporter = (type) => {
    let jsonFile = fs.readFileSync(`./cleaned${type}.json`, 'utf8');
    let page = JSON.parse(jsonFile);

    // insert JSON data into airtable
    for (let i = 0; i < page.length; i++) {
        base('guides').create([{
        "fields" : {
            "Title": page[i].title,
            "Synopsis" : page[i].Snyposis,
            "Categories": page[i].categories,
            "Author": page[i].author,
            "Date": page[i].date,
            "Story": page[i].story,
            "Document URL": page[i].docUrl,
            "Type": page[i].type,
            "Address": page[i].address
        }}], function(err, record) {
            if (err) {
                console.error(err);
                return;
            }
            console.log(record.getId());
        });
    }
}

exporter('guides');



