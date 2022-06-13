const express = require('express')
const app = express() 
const axios = require('axios');
const {parse} = require('node-html-parser');

const fs = require('fs').promises;
const path = require('path')
//to get path of the other file, it is a inbuilt module

const PORT = process.env.PORT|| 3000
//IT will check variables named port if 
//it is there it will use it if not avalilable then it will go to 3000

const URL = 'https://time.com/';
const QUERY_SELECTOR_STORY = '.latest-stories__item a';
const PARSED_FILE = 'parsed.txt';

//function to get the data of parsed file i.e.s our requires result ton the server as a response
app.get('/getTimeStories', (req, res) => {
    //the result will be sent at /getTimeSTories using express
    var options = {
        root: path.join(__dirname)
    };
     
    res.sendFile(PARSED_FILE, options, (err) => {
        if (err) {   //handing errors
            next(err);
        } else {
            console.log('Sent:', PARSED_FILE);
        }
    });
});
 
app.listen(PORT , () => {
    console.log('Listening on port 3000')
})//it will listen on the requires port

main();
//main function called

async function main() {
    const response = await axios.get(URL); 
    //axios gets the data from the url and store sin the response variable

    const root = parse(response.data);
    //the date is parsed and stored in the variable root. it is parsed using node-html-parse

    const _links = root.querySelectorAll(QUERY_SELECTOR_STORY);
    //using queryselectorall we fetch the required data at the specific html tag and store in the variable 
    //this is found using the chrome dev tools

    await Promise.all(_links.map(async link => {
        //all the tags are fetch, in our case 6 tags and there are mapped and are iterated through an async function
        const story = link.structuredText;
        const link_ = link.rawAttrs;
        //at every iteration the story and link is fetched using methods to each html element.
        //in our case we are fetching the story headline and link

        const links = link_.replace('href="', `"link":"${URL}`);
        //href  tag is replaced with some requireed formatting

        await fs.appendFile(PARSED_FILE, `{${newline()}"title:"${story},${newline()}${links}${newline()}},${newline()}`);
        //the data is is appended to the file using th variables story and links
    }));
}
//This is a utility function which adds a new line when called
function newline()  {
    return '\r\n';
}






