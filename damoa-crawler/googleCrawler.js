const axios = require("axios"); //특정  URL  삽입 시 URL html 태그 가지고
const cheerio = require("cheerio");

// HTML 코드를 가지고 오는 함수 (기사 최신순)
const getHTML = async(keyword) => {
  try{
    return await axios.get("https://news.google.com/search?q=" + encodeURI(keyword) + "%20when%3A1d&hl=ko&gl=KR&ceid=KR%3Ako") //""안에는 URL 삽입
  }catch(err) {
    console.log(err);
  }
}

 // 파싱 함수
const parsing = async (keyword) => {
  const html = await getHTML(keyword);
  const $ = cheerio.load(html.data);// 가지고 오는 data load
  const $news = $("div.NiLAwe, div.y6IFtc, div.R7GTQ, div.keNKEd, div.j7vNaf, div.nID9nc");

  let informations = [];
  $news.each((idx,node) => {
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
}

parsing("개발자 채용");
