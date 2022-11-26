const randomUserAgent = require('random-useragent');
const randomFacts = require('random-facts');
const page_url = 'https://gmx-server-mainnet.uw.r.appspot.com/position_stats';
const fs = require('fs');
const fetch = require('node-fetch');
const contentful = require("contentful-management");
const { ACCEPT_STRINGS } = require('./constants');

const CONTENTFUL_ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const CONTENTFUL_SPACE_ID = process.env.SPACE_ID;

function getAcceptForBrowserVersion(browser, version) {
    let accept;

    browser = browser.toLowerCase();
    version = parseInt(version);

    if (browser === 'firefox') {
        if (version < 65) {
            accept = ACCEPT_STRINGS['firefox64andEarlier'];
        }
        if (version === 65) {
            accept = ACCEPT_STRINGS['firefox65'];
        }
        if (version >= 66 && version <= 71) {
            accept = ACCEPT_STRINGS['firefox66to71'];
        }
        if (version >= 72 && version <= 91) {
            accept = ACCEPT_STRINGS['firefox72to91'];
        }
        if (version >= 92 || !!!version) {
            accept = ACCEPT_STRINGS['firefox92andLater'];
        }
    } else if (browser === 'safari' || browser === 'chrome') {
        if (browser === 'safari' && !!version && version === 5) {
            accept = ACCEPT_STRINGS['safari5'];
        } else {
            accept = ACCEPT_STRINGS['safariAndChrome'];
        }
    } else if (browser === 'ie') {
        accept = ACCEPT_STRINGS['ie8'];
    } else if (browser === 'edge') {
        accept = ACCEPT_STRINGS['edge'];
    } else if (browser === 'opera') {
        accept = ACCEPT_STRINGS['opera'];
    } else {
        accept = ACCEPT_STRINGS['defaultAccept'];
    }

    return accept;
}

async function getPositionData() {
    // NOTES:
    // leaving out Host could allow bot detection
    // e.g. Host: 'www.amazon.com'
    const userAgentData = randomUserAgent.getRandomData();
    const response = await fetch(page_url, {
        "headers": {
            "accept": getAcceptForBrowserVersion(userAgentData.browserName, userAgentData.browserMajor),
            "accept-language": "en-US,en;q=0.9,la;q=0.8",
            "Accept-Encoding": "gzip, deflate, br",
            "Host": "gmx-server-mainnet.uw.r.appspot.com",
            "User-Agent": userAgentData.userAgent,
            "if-none-match": "W/\"131-hOwnr0C8nbILkIgUZkJoiOiWrXo\"",
            "Referer": "https://app.gmx.io/",
            "Referrer-Policy": "strict-origin-when-cross-origin",
            "Dnt": "1",
            "Upgrade-Insecure-Requests": "1",
            "origin": "https://app.gmx.io",
        },
        "body": null,
        "method": "GET"
    });
    const text = await response.text();

    return JSON.parse(text);
}

function addPositionToContentful(datetime, shortVolume, longVolume, shortLongDiff, ethPrice) {
    const client = contentful.createClient({ accessToken: CONTENTFUL_ACCESS_TOKEN });
    let entry = client.getSpace(CONTENTFUL_SPACE_ID)
        .then((space) => space.getEnvironment('master'))
        .then((environment) => environment.createEntry('positions', {
            fields: {
                timestamp: { 'en-US': datetime },
                shortVolume: { 'en-US': shortVolume },
                longVolume: { 'en-US': longVolume },
                shortLongDiff: { 'en-US': shortLongDiff },
                ethPrice: { 'en-US': ethPrice }
            }
        }))
        .then((entry) => null)
        .catch(console.error);
}

async function getEthPrice() {
    const userAgentData = randomUserAgent.getRandomData();
    const response = await fetch("https://api.ethereumdb.com/v1/ticker?pair=ETH-USD&range=1h", {
        "User-Agent": userAgentData.userAgent,
        "referrerPolicy": "strict-origin-when-cross-origin",
        "mode": "cors",
        "body": null,
        "method": "GET"
    });
    const text = await response.text();

    return JSON.parse(text);
}

async function addPositions() {
    const positionData = await getPositionData();
    const ethPrice = await getEthPrice();

    if (!!positionData) {
        const volumeFactor = Math.pow(10, 30);
        const shortVolume = parseInt(positionData.totalShortPositionSizes / volumeFactor);
        const longVolume = parseInt(positionData.totalLongPositionSizes / volumeFactor);
        const shortLongDiff = shortVolume - longVolume;
        const datetime = Date.now();
        const row = `\r\n${datetime},${shortVolume},${longVolume},${shortLongDiff},${parseInt(ethPrice.price)}`;

        // comment out the last two lines to stop adding positions to database
        // addPositionToContentful(datetime, shortVolume, longVolume, shortLongDiff, parseInt(ethPrice.price));
        // fs.appendFileSync("positions.csv", row);
    }
}

module.exports = addPositions;