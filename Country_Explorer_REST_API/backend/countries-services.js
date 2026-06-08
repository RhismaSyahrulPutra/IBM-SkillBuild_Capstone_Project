const https = require("https");

function fetchCountries() {
  return new Promise(function (resolve, reject) {
    const API_URL =
      "https://restcountries.com/v3.1/all?fields=name,capital,flags,currencies,languages,region,subregion,population";
    //                                      ↑ hapus &fullText=True dari sini

    let req = https.get(API_URL, function (res) {
      let data = "";

      res.on("data", function (chunk) {
        data += chunk;
      });

      res.on("end", function () {
        try {
          const countriesData = JSON.parse(data);
          resolve(countriesData);
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on("error", function (error) {
      reject(error);
    });

    req.end();
  });
}

module.exports = {
  fetchCountries,
};
