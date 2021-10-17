const cron = require("node-cron"); // 스케쥴러
const axios = require("axios"); //특정  URL  삽입 시 URL html 태그 가지고
const cheerio = require("cheerio");
const config = require("./config"); // DB 불러오기

var conn = config.getConnection;
var keywordIdx;

cron.schedule('0 9,12,18 * * *', () => {
  console.log('9시, 12시, 6시에 실행: ', new Date().toString());

  // HTML 코드를 가지고 오는 함수
  const getHTML = async(keyword) => {
    try{
      return await axios.get("https://search.naver.com/search.naver?where=news&query=" + encodeURI(keyword) + "&sm=tab_opt&sort=1&photo=0&field=0&pd=0&ds=&de=&docid=&related=0&mynews=0&office_type=0&office_section_code=0&news_office_checked=&nso=so%3Add%2Cp%3Aall&is_sug_officeid=0" ); //""안에는 URL 삽입
    }catch(err) {
      console.log(err);
    }
  }

   // 파싱 함수
  const parsing = async (keyword, keywordIdx) => {
    const html = await getHTML(keyword)
    const $ = cheerio.load(html.data);// 가지고 오는 data load
    const $news = $(".list_news > .bx");

    let informations = [];
    $news.each((idx,node) => {
      informations.push({
        title: $(node).find(".news_tit").text(), // 제목
        press: $(node).find(".info_group > .press").text(), // 언론
        time: $(node).find(".info_group > span").text(), // 시간
        // contents: $(node).find(".dsc_wrap").text(), // 내용
        link : $(node).find(".news_tit").attr("href"), // 본문 링크
        img : $(node).find("a > img").attr("src") // 이미지
      })
    }); //for문과 동일
    console.log(informations);

    for (var t = 0; t < informations.length; t++) {
      conn.query('INSERT INTO Keyword_Info(keyword_idx, title, press, time, link, imgUrl) VALUES(?, ?, ?, ?, ?, ?);',
      [keywordIdx, informations[t].title, informations[t].press, informations[t].time, informations[t].link, informations[t].img],
      (err, result) => {
        if (err) console.log(err);
        console.log("성공"); // 변경 예정
      })
    }
  }

  conn.query('SELECT * from Keyword', (err, results, fields) => {
      try{
        for (var i = 0; i < results.length; i++) {
          keywordIdx = results[i].idx;
          parsing(results[i].keyword, keywordIdx);
        }
      }
      catch(err){
        console.log(err);
      }
  });
});
