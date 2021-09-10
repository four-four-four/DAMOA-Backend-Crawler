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

  $person.each((idx, node) => {
    let infoArr = $(".detail_profile > dt");
    for (let i = 0; i < infoArr.length; i++) {
      const s = infoArr[i].children[0].data;
      info.push(s);
    }
    console.log(info);
    let proArr = $(".detail_profile > dd");
    console.log(proArr.length);
    console.log(proArr[0]);
    for (let i = 0; i < proArr.length; i++) {
      if ($(".detail_profile > dd > span")) {
        const p = proArr[i].children[0].data;
        profile.push(p);
      }
      else if ($(".detail_profile > dd > a")){
        const p = proArr[i].children[0].data;
        profile.push(p);
      }
    }
    console.log(profile);
    // profile.push({
    //   photo: $(node).find(".big_thumb > a > img").attr("src"),
    //   detail: $(node).find(".detail_profile").text()
    // })
  });

  //console.log(profile);
}

parsing("손흥민");
