const axios = require('axios');

async function getVixDataFromUrl() {
    const promise = axios.get("https://cdn.cboe.com/api/global/us_indices/daily_prices/VIX_History.csv")
    const dataPromise = promise.then((response) => response.data);

    return dataPromise
}

async function getAndProcessVixData() {
    return getVixDataFromUrl()
        .then(async data => {
            const csvToArray = (data, delimiter = ',', omitFirstRow = false) =>
                data
                    .slice(omitFirstRow ? data.indexOf('\n') + 1 : 0)
                    .split('\n')
                    .map(v => v.split(delimiter));
            const csvData = csvToArray(data)
                .slice(1, -1)
                .map(row => {
                    const datetimeArr = row[0].split("/");
                    const datetime = new Date(datetimeArr[2], datetimeArr[0] - 1, datetimeArr[1]);
                    return [datetime.getTime(), row[4]];
                })
                .reverse();

            return csvData;
        })
        .catch(err => console.log(err));
}

function latestVixTrend(vixData) {
    // from latest to earliest data
    // 
}

async function getVixData() {
    const vixData = await getAndProcessVixData();
    // console.log(vixData);
    return vixData;
}

module.exports = getVixData;