const cron = require("node-cron"); // 스케쥴러
const axios = require("axios"); //특정  URL  삽입 시 URL html 태그 가지고
const cheerio = require("cheerio");
const config = require("./config"); // DB 불러오기

var conn = config.getConnection;
var keywordIdx;

cron.schedule('*/1 * * * *', () => { // 테스트때문에 1분마다 실행으로 변경
  console.log('1분마다 실행: ', new Date().toString());

    // HTML 코드를 가지고 오는 함수 (기사 최신순)
    const getHTML = async(keyword) => {
      try{
        return await axios.get("https://news.google.com/search?q=" + encodeURI(keyword) + "%20when%3A1d&hl=ko&gl=KR&ceid=KR%3Ako") //""안에는 URL 삽입
      }catch(err) {
        console.log(err);
      }
    }

     // 파싱 함수
    const parsing = async (keyword, keywordIdx) => {
      const html = await getHTML(keyword);
      const $ = cheerio.load(html.data);// 가지고 오는 data load
      const $news = $("div.NiLAwe, div.y6IFtc, div.R7GTQ, div.keNKEd, div.j7vNaf, div.nID9nc");

      let informations = [];
      $news.each((idx, node) => {
        informations.push({
          title: $(node).find("article > h3 > a").text(), // 제목
          press: $(node).find(".SVJrMe > a").text(), // 언론
          time: $(node).find(".SVJrMe > time").text(), // 시간
          // contents: $(node).find(".dsc_wrap").text(), // 내용
          link : $(node).find("article > .VDXfz").attr("href"), // 본문 링크
          img : $(node).find("a > figure > img").attr("src") // 이미지
        })
      });

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
