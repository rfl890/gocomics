const Axios = require("axios").default;
const cheerio = require("cheerio");

// I am only using resolve() and not reject() so you can await this function.
const getComicInfo = (comicUrl) => {
    return new Promise((resolve) => {
        Axios.get(comicUrl)
            .then(response => {
                // OK
                if (response.status == 200) {
                    const $ = cheerio.load(response.data);
                    const comicContainer = $(".comic");
                    if (comicContainer.length) { // it's a comic page and not some other page
                        const previousComicDiv = $(".gc-calendar-nav__previous");
                        const nextComicDiv = $(".gc-calendar-nav__next");
                        const pComicButton = previousComicDiv.children(".js-previous-comic");
                        const nComicButton = nextComicDiv.children('.fa-caret-right'); // seems like a bit of a hack but no other way to get this to work
                        const imageUrl = comicContainer.attr("data-image");
                        const comicName = comicContainer.attr("data-feature-name");
                        const comicDate = comicContainer.attr("data-formatted-date");

                        const isLatestComic = nComicButton.attr("href") == "";
                        if (isLatestComic) {
                            resolve({
                                success: true,
                                imageUrl,
                                comicName,
                                comicDate,
                                previousComic: pComicButton.attr("href"),
                                latest: true
                            });
                        } else {
                            resolve({
                                success: true,
                                imageUrl,
                                comicName,
                                comicDate,
                                previousComic: pComicButton.attr("href"),
                                nextComic: nComicButton.attr("href"),
                                latest: false
                            });
                        }
                    } else {
                        resolve({
                            success: false,
                            code: "NotFound",
                            errorMessage: "The requested comic could not be found."
                        });
                    }
                }
            })
            .catch(err => {
                if (err.response) { // the server responded
                    if (err.response.status == 404) {
                        resolve({
                            success: false,
                            code: "NotFound",
                            errorMessage: "The requested comic could not be found."
                        });
                    } else {
                        resolve({
                            success: false,
                            code: "ServerError",
                            errorMessage: "There was an internal error while trying to complete your request."
                        });        
                    }
                } else {
                    resolve({
                        success: false,
                        code: "OriginUnreachable",
                        errorMessage: "GoComics may be down. Please check the status."
                    });          
                }
            });
    });
}
module.exports = getComicInfo;
