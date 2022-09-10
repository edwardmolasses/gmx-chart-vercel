const contentful = require("contentful-management");
const CSVToJSON = require('csvtojson');
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const SPACE_ID = process.env.SPACE_ID;

async function getPositionsFromCsv() {
    return CSVToJSON().fromFile('positions.csv')
        .then(positions => {
            return positions.map(row => {
                return {
                    "timestamp": parseInt(row['timestamp']),
                    "shortLongDiff": parseInt(row['shortLongDiff']),
                    "shortVolume": parseInt(row['shortVolume']),
                    "longVolume": parseInt(row['longVolume']),
                    "ethPrice": !!row['ethPrice'] ? parseInt(row['ethPrice']) : null
                }
            });
        }).catch(err => {
            // log error if any
            console.log(err);
        });
}

async function getContentfulData() {
    const positionsFromCsv = (await getPositionsFromCsv()).sort((a, b) => a['timestamp'] - b['timestamp']);
    const client = contentful.createClient({ accessToken: ACCESS_TOKEN });

    return client.getSpace(SPACE_ID)
        .then((space) => space.getEnvironment('master'))
        .then((environment) => environment.getEntries('positions', {
        }))
        .then((entries) => {
            const contentfulRecords = entries.items
                .map(function (entry) {
                    return {
                        "timestamp": parseInt(entry.fields.timestamp['en-US']),
                        "shortLongDiff": parseInt(entry.fields.shortLongDiff['en-US']),
                        "shortVolume": parseInt(entry.fields.shortVolume['en-US']),
                        "longVolume": parseInt(entry.fields.longVolume['en-US']),
                        "ethPrice": !!entry.fields.ethPrice['en-US'] ? parseInt(entry.fields.ethPrice['en-US']) : null
                    }
                })
                .sort((a, b) => a['timestamp'] - b['timestamp']);
            const earlistContentfulTimestamp = contentfulRecords[0]['timestamp'];
            const csvSliceIndex = positionsFromCsv.findIndex(csvRecord => csvRecord.timestamp >= earlistContentfulTimestamp);
            const usablePositionsFromCsv = positionsFromCsv.slice(0, csvSliceIndex);

            return usablePositionsFromCsv.concat(contentfulRecords);
        })
        .catch(console.error);
}

async function getPositionsFromContentful() {
    return await getContentfulData();
}

module.exports = getPositionsFromContentful;