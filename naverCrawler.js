const axios = require("axios"); //특정  URL  삽입 시 URL html 태그 가지고
const cheerio = require("cheerio");

// HTML 코드를 가지고 오는 함수 (기사 최신순)
const getHTML = async(keyword) => {
  try{
    return await axios.get("https://search.naver.com/search.naver?where=news&query=" + encodeURI(keyword) + "&sm=tab_opt&sort=1&photo=0&field=0&pd=0&ds=&de=&docid=&related=0&mynews=0&office_type=0&office_section_code=0&news_office_checked=&nso=so%3Add%2Cp%3Aall&is_sug_officeid=0" ) //""안에는 URL 삽입
  }catch(err) {
    console.log(err);
  }
}

 // 파싱 함수
const parsing = async (keyword) => {
  const html = await getHTML(keyword)
  const $ = cheerio.load(html.data);// 가지고 오는 data load
  const $news = $(".list_news > .bx");

  let informations = [];
  $news.each((idx,node) => {
    informations.push({
      title: $(node).find(".news_tit").text(), // 제목
      press: $(node).find(".info_group > .press").text(), // 언론
      time: $(node).find(".info_group > span").text(), // 시간
      contents: $(node).find(".dsc_wrap").text(), // 내용
      link : $(node).find(".news_tit").attr("href"), // 본문 링크
      img : $(node).find("a > img").attr("src") // 이미지
    })
  }); //for문과 동일
  console.log(informations);
}

parsing("개발자");
