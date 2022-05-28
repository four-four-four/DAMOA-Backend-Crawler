const convert = require('xml-js');
const DB = require('./databasePool.js');
const cheerio = require("cheerio");
const iconv = require('iconv-lite');
const charsetParser = require('charset-parser');
const { decoding } = require('./html-entities-escape');
const request = require('sync-request');

function getGoogle(keyword){
    console.log('구글 크롤링 키워드 : ' + keyword);
    const requestUrl = `https://news.google.com/rss/search?q="${encodeURI(keyword)}" ${encodeURI("when:1d")}&hl=ko&gl=KR&ceid=KR%3Ako`
    const response = request('GET', requestUrl);

    if(response.statusCode === 200) {
        const xmlToJson = convert.xml2json(response.getBody('utf8'), {compact: true, spaces: 4});
        const items = JSON.parse(xmlToJson).rss.channel.item;

        if(items === undefined) console.log('가져올 뉴스가 없습니다.');
        else {
            for (let i = 0; i < items.length; i++) getData(items[i].link._text, items[i].source._text, items[i].pubDate._text);
        }
    }
    else console.log(response.statusCode);
}

function getData(url, source, date){

    if(url.indexOf('http://news-i.co.kr/') === -1){
        const response = request('GET', url, {
            timeout: '2000'
        });
        const charset = charsetParser(response.headers['content-type'], response.getBody('binary'), 'UTF-8');
        const html = iconv.decode(response.getBody('binary'), charset);
        const $ = cheerio.load(html);
        const title = $('meta[property="og:title"]').attr('content');
        const image = $('meta[property="og:image"]').attr('content');
        const description = $('meta[property="og:description"]').attr('content');

        if(title === undefined || image === undefined || description === undefined) console.log('크롤링에 적합하지 않은 링크 ' + url);
        else {
            DB.insertMoa(
                'Didang',
                decoding(description),
                decoding(image),
                0,
                source,
                decoding(title),
                url,
                1,
                function (error, result){
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
                }
            );
        }
    }
    else console.log('크롤링에 적합하지 않은 신문사' + url);
}
module.exports = {
    getGoogle
}
