const convert = require('xml-js');
const DB = require('./databasePool.js');
const cheerio = require("cheerio");
const iconv = require('iconv-lite');
const charsetParser = require('charset-parser');
const { decoding } = require('./html-entities-escape');
const request = require('sync-request');

function getNaver(keyword) {
    console.log('크롤링 키워드 : ' + keyword);
    const requestUrl = `https://openapi.naver.com/v1/search/news.xml?query="${encodeURI(keyword)}"&display=10&start=1&sort=date`
    const res = request('GET', requestUrl, {
        headers: {
            'X-Naver-Client-Id': 'pQ3wpt8L5kP2oL0CPHLt',
            'X-Naver-Client-Secret': 'x6OvlLsZbS',
        },
    });

    if (res.statusCode === 200) {
        const xmlToJson = convert.xml2json(res.getBody('utf8'), {compact: true, spaces: 4});
        const obj = JSON.parse(xmlToJson);
        const items = obj.rss.channel.item;

        if (items === undefined) console.log('가져올 뉴스가 없습니다.');
        else {
            for (let i = 0; i < items.length; i++) getData(items[i].title._text, items[i].link._text, items[i].pubDate._text);
        }
    } else console.log(res.statusCode);
}

function getData(title, link, pubDate){
    if(link.indexOf('http://www.mediapen.com/') === -1) {
        const res = request('GET', link, {
            timeout: '2000'
        });

        const charset = charsetParser(res.headers['content-type'], res.getBody('binary'), 'UTF-8');
        const html = iconv.decode(res.getBody('binary'), charset);
        const $ = cheerio.load(html);
        const image = $('meta[property="og:image"]').attr('content');
        const des = $('meta[property="og:description"]').attr('content');
        const source = $('meta[name="twitter:creator"]').attr('content');

        if (source === undefined || image === undefined || des === undefined) console.log('크롤링에 적합하지 않은 링크 ' + link);
        else {
            console.log();
            console.log('링크 ' + link);
            console.log('소스 ' + source);
            console.log('날자 ' + pubDate);
            console.log('타이틀 ' + decoding(title));
            console.log('이미지 ' + decoding(image));
            console.log('요약 ' + decoding(des));
            console.log();

            DB.insertMoa('Didang',decoding(des),decoding(image),0, source, decoding(title), link, 1, function (error, result){
                try {
                    try {
                        if (error) console.log(error);
                        else console.log('DB에 넣었습니다.')
                    } catch (error) {
                        console.log('DB에 넣는중 오류가 발생했다.')
                    }
                } catch (error) {
                    console.log(error);
                }
            });
        }
    }
    else {

        console.log('크롤링에 적합하지 않은 신문사 ' + link);
    }
}
module.exports = {
    getNaver
}
