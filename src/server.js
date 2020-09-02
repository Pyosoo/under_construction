/*
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const port =process.env.PORT || 3001;

let stationInfo = require('./Data/station-info.json');

let fromWep = []; //크롤링해 온것 담아놀것

const axios = require('axios');
const cheerio = require('cheerio');
let count = 0;

let result_list = [];


    
        async function getHTML() {
            try {
                return await axios.get("http://underproject.pythonanywhere.com/api/")
            } catch (error) {
                console.error(error);
            }
        }
        
        getHTML()
            .then(html => {
                const $ = cheerio.load(html.data);
        
                tr_list.each(function(i, elem){
                    let td_list = Array.from($(this).children('prettyprint')).map(function(value){
                        return value.children[0].data.trim()
                    })
                    result_list[i] = {
                        stno: stno,
                        facility: td_list[0],
                        operating_section: td_list[1],
                        location: td_list[2],
                        usage_status: td_list[3]
                    }
                })
                fromWep = [...fromWep, result_list];
                return result_list
            })
            .then(res => console.log(res));



    app.use(cors());

    app.use(bodyParser.json());
    app.use('/api', (req, res)=> res.json(fromWep));        // localhost:3000/api 에 fromwep json 저장
    
    app.listen(port, ()=>{
        console.log(`express is running on ${port}`);
    })


*/