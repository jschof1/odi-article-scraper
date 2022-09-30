const fs = require("fs");

const nameDoc = (type) => {
  let jsonFile = fs.readFileSync(`./${type}.json`, "utf8");
  let page = JSON.parse(jsonFile);

  if (page[0].docUrl !== undefined) {
    for (let i = 0; i < page.length; i++) {
      for (let j = 0; j < page[i].docUrl.length; j++) {
        delete page[i].docUrl[j].data;
      }
    }
    for (let i = 0; i < page[0].docUrl.length; i++) {
      delete page[0].docUrl[i].data;
    }

    // get every guide url object inside json file, delete the data object, and save the address values to an array for each guide url object
    for (let i = 0; i < page.length; i++) {
      for (let j = 0; j < page[i].docUrl.length; j++) {
        delete page[i].docUrl[j].data;
      }
    }
  }
  // join every array elements into a string
  for (let i = 0; i < page.length; i++) {
    page[i].title = page[i].title.join("");
    page[i].synopsis = page[i].synopsis.join("");
    page[i].categories = page[i].categories.join(", ");
    page[i].author = page[i].author.join(", ");
    page[i].date = page[i].date.join("");
    page[i].story = page[i].story.join("");
    if (page[i].docUrl !== undefined) {
      let fixedAddress = page[i].docUrl.map((docUrl) => {
        let keyRemoved = Object.values(docUrl);
        return keyRemoved;
      });
      page[i].docUrl = fixedAddress.flat().join(", ");
    }
  }

  fs.writeFile(`cleaned${type}.json`, JSON.stringify(page), (err) => {
    if (err) throw err;
    console.log("The file has been saved!");
  });
};

nameDoc("guides");
