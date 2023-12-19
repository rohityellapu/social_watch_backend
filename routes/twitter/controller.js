require("dotenv").config();
const crypto = require("crypto");
const Oauth = require("oauth-1.0a");
const qs = require("querystring");
const { URLSearchParams } = require("url");
const readline = require("readline");
const request = require("request");
// db
const { MongoClient } = require('mongodb');
const { MONGODB_URI } = process.env;

const clientMongo = new MongoClient(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


// Oauth sign function
const oauth = Oauth({
  consumer: {
    key: process.env.TWITTER_CONSUMER_KEY,
    secret: process.env.TWITTER_CONSUMER_SECRET,
  },
  signature_method: "HMAC-SHA1",
  hash_function:(baseString, key)=>crypto.createHmac('sha1',key).update(baseString).digest('base64'),
}
);

async function input(prompt) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer);
    })
  );
}

// get the oauth
async function requestToken() {
    try{
  const requestTokenURL =
    "https://api.twitter.com/oauth/request_token?oauth_callback=oob&x_auth_access_type=write";
  const authHeader = oauth.toHeader(
    oauth.authorize({
      url: requestTokenURL,
      method: "POST",
    })
  );

  const response = await request(requestTokenURL, {
      'method': "POST",
      headers: {
          Authorization: authHeader["Authorization"],
      },
  });
 console.log(response,"response");
  const body = await response
  return Object.fromEntries(new URLSearchParams(body));
}
catch(e){
    console.log(e,"get auth token");
    return e.message;
}
}

// Validate the pin => User requested action
async  function accessToken({oauth_token,oauth_secret}, verifier){
    try{
    const url = `https://api.twitter.com/oauth/access_token?oauth_verifier=${verifier}&oauth_token=${oauth_token}`;
    const authHeader = oauth.toHeader(
        oauth.authorize({
            url,
            method: 'POST',
        })
    );
    const response = request(url, {
        method: 'POST',
        headers: {
            Authorization: authHeader['Authorization'],
        },
    });
    console.log(response,"response");
    const body = await response.text();
    return Object.fromEntries(new URLSearchParams(body));
    }
    catch(e){
        console.log(e);
        return e.message;
    }

}
// Send THE TWEET
const  writeTweet = async({oauth_token,oauth_secret},tweet)=>{
    const token = {
        key: oauth_token,
        secret: oauth_secret,
    };
    const url = 'https://api.twitter.com/2/tweets';
    const authHeader = oauth.toHeader(
        oauth.authorize({
            url,
            method: 'POST',
        },token)
    );
    try{
        const response = request(url, {
            method: 'POST',
            body: JSON.stringify(tweet),
            responseType: 'json',
            headers: {
                Authorization: headers['Authorization'],
                'user-agent': 'TwitterDevDemo',
                'content-type': 'application/json',
            },
        });
        const body = await response.json();
        return body;
    }
    catch(e){
        console.log(e,"Validate the pin => User requested action");
        return e.message;
    }
}


// post api

const postTweet = async (req, res) => {
  try {
    // Get the token
    const oAuthRequestToken = await requestToken();
    // Request the user for a pin
    const authorizeURL = `https://api.twitter.com/oauth/authorize?oauth_token=${oAuthRequestToken.oauth_token}`;
    console.log("Please go here and authorize:", authorizeURL);
    const pin = await input("Paste the PIN here: ");
    // validate the pin
    const oAuthAccessToken = await accessToken(oAuthRequestToken, pin);
    // Send Message
    const messageResponse = await writeTweet(oAuthAccessToken,{
        'text': 'Hello World',
    });
    console.log(messageResponse);
  } catch (err) {
    console.log(err);
  }
};


const postDataInMongoDb = async (req, res) => {
    // clientMongo social_media
// .twitters
   

    try {
        await clientMongo.connect();
        const database = clientMongo.db('social_media');
        const collection = database.collection('twitters');
        const result = await collection.insertOne(req.body);
        console.log(result);
        res.send(result);
    } catch (err) {
        console.log(err);
    }
}

const getDataFromMongoDb = async (req, res) => {
    // with client_id
    // clientMongo social_media
// .twitters
    const {client_id} = req.body;
    
        try {
            await clientMongo.connect();
            const database = clientMongo.db('social_media');
            const collection = database.collection('twitters');
            const result = await collection.find({client_id:client_id}).toArray();
            console.log(result);
            res.send(result);
        }
        catch (err) {
            console.log(err);
        }
    }
    


module.exports = {
  postTweet,
  postDataInMongoDb,
  getDataFromMongoDb
};
