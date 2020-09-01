const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const port =process.env.PORT || 3001;

let stationInfo = require('./Data/station-info.json');

let line = ['1호선', '2호선', '3호선', '4호선', '5호선', '6호선', '7호선', '8호선'];
let line_length = [10, 50, 33, 26, 52, 39, 51, 7, ] 
let line_stno = [
    150, 151, 152, 153, 154, 155, 156, 157, 158, 159
]

let fromWep = []; //크롤링해 온것 담아놀것

const axios = require('axios');
const cheerio = require('cheerio');
for(let key in stationInfo){
    console.log(`${key} 라인`);
    async function getHTML() {
        try {
            return await axios.get("http://www.seoulmetro.co.kr/kr/equipmentList.do?menuIdx=367", {params: {'line':key ,'stno':stationInfo[key].stno}})
        } catch (error) {
            console.error(error);
        }
    }
    
    getHTML()
        .then(html => {
            let result_list = []
            const $ = cheerio.load(html.data);
            const tr_list = $("#contents div table tbody").children('tr')
    
            tr_list.each(function(i, elem){
                let td_list = Array.from($(this).children('td')).map(function(value){
                    return value.children[0].data.trim()
                })
                result_list[i] = {
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
}



    app.use(cors());

    app.use(bodyParser.json());
    app.use('/api', (req, res)=> res.json(fromWep));        // localhost:3000/api 에 fromwep json 저장
    
    app.listen(port, ()=>{
        console.log(`express is running on ${port}`);
    })