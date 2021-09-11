const axios = require("axios"); //특정 URL의 html을 가져옴
const cheerio = require("cheerio"); //파싱 가능(jquery)

const getHTML = async(keyword) => {
  try {
    return await axios.get("https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=1&ie=utf8&query=" + encodeURI(keyword));
  }
  catch(err) {
    console.log(err);
  }
}

let profile = [];
let info = [];
const parsing = async(keyword) => {
  const html = await getHTML(keyword);
  const $ = cheerio.load(html.data);
  const $person = $(".profile_wrap");

  let infoArr = $(".detail_profile > dt");
  for (let i = 0; i < infoArr.length; i++) {
    const s = infoArr[i].children[0].data;
    info.push(s);
  }
  console.log(info);

  $person.each((idx, node) => {
    console.log(idx);
    profile.push({
      name: $(node).find(".detail_profile > .name > a > strong").text(),
      job: $(node).find(".detail_profile > .name > span").text(),
      info: $(node).find(".detail_profile > dd > span:eq(1)").text()
    })
  });


  console.log(profile);
}

parsing("김연아");
