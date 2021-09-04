const axios = require("axios"); //특정  URL  삽입 시 URL html 태그 가지고
const cheerio = require("cheerio");

// HTML 코드를 가지고 오는  함수
const getHTML = async(keyword) => {
  try{
    return await axios.get("https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=1&ie=utf8&query=" + encodeURI(keyword)) //""안에는 URL 삽입
  }catch(err) {
    console.log(err);
  }
}

 // 파싱 함수
const parsing = async (keyword) => {
  const html = await getHTML(keyword)
  const $ = cheerio.load(html.data);// 가지고 오는 data load
  const $informationlist = $(".main_pack");
  const $titlist = $(".bx");


  let informations = [];
  let test = [];
  var i;

$informationlist.each((idx,node) => {
  test.push({
    name : $(node).find(".name > a > strong").text(),
    job : $(node).find(".name > span").text(),
    birth : $(node).find("dd > span:eq(1)").text(),
    team : $(node).find("dd > a:eq(1)").text(),
    agency : $(node).find("dd > a:eq(2)").text(),
  })
});

$titlist.each((idx,node) => {
    informations.push({
        title: $(node).find(".news_tit").text(),
        press: $(node).find(".info_group >a").text(),
        time: $(node).find(".info_group > span").text(),
        contents: $(node).find(".dsc_wrap").text(),
        //img: $(node).find(".dsc_thumb > img").attr("src"),
    })
  }); //for문과 동일
console.log(test);
console.log(informations);

}

parsing("");






//let name =  $(node).find(".name > a > strong").text();
//let job  = $(node).find(".name > span").text();
//let birth = $(node).find("dd > span:eq(1)").text();
//let team = $(node).find("dd > a:eq(1)").text();
//let agency  = $(node).find("dd > a:eq(2)").text();
//console.log(name);
//console.log(job);
//console.log(birth);
//console.log(team);
//console.log(agency);
