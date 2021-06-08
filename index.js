const ping = require('domain-ping');
const Twitter = require('twitter');
const keys = require("./keys.json");

var client = new Twitter({
    consumer_key: keys.apiKey,
    consumer_secret: keys.apiSecret,
    access_token_key: keys.accessToken,
    access_token_secret: keys.accessSecret
});

async function pingTester()
{
    let i;
    let pings = new Array()

    for(i = 0; i < 5; i++)
    {
        await ping('google.com').then((res) => {
                //console.log(res.ping_time);
                pings.push(res.ping_time);
            })
            .catch((error) => {
                console.error(error);
                })
    }
    let avg = (array) => array.reduce((a, b) => a + b) / array.length;
    let avgPing = avg(pings);
    console.log('Avg Ping: ' + avgPing);

    return avgPing;
}

function tweet(client, ping)
{
    let msg = `Hi Windstream! My current ping is ${ping}, no matter how many times I call to get my internet fixed nothing ever changes. Thank you for monopolizing your ISP in Lewisburg PA! @Windstream`;
    client.post('statuses/update', {status: msg}, function(error, tweet, response) {
        if (!error) {
            console.log(tweet);
        }
        else{
            console.log(error);
        }
    });

}

async function main()
{
    let pingy = await pingTester();
    if(pingy > 400){
        tweet(client, pingy);
    }
}

var minutes = 5, the_interval = minutes * 60 * 1000;
setInterval(function() {
  console.log(`I am doing my ${minutes} minutes check`);
  main();
}, the_interval);