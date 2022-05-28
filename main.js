const DB = require("./databasePool");
const { getGoogle } = require("./googleRssCrawler");
const { getNaver } = require("./naverApiCrawler");

function main() {
    DB.findAllKeyword(function (error, result){
        try {
            if (error)  console.log(error);
            else {
                if (result.length > 0) {
                    for(let i = 0; i < result.length; i++){
                        getGoogle(result[i].name);
                        getNaver(result[i].name);
                    }
                }
                else console.log('등록된 키워드 없다.');
            }
        } catch (error) {
            console.log(error);
        }
    });

} if (require.main === module) {
    main();
}


