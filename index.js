const rwClient = require("./twitterClient.js");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
// from route folder
const loginRoutes = require("./routes/login/routes");
const TweeterRoutes = require("./routes/twitter/routes");

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
    // allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/login", loginRoutes);
app.use("/twitter", TweeterRoutes);

app.post("/tweet", async (req, res) => {
  // get the text from the request body
  //   const { text, image } = req.body;
  // get form data
  const { text, image } = req.body;

  try {
    console.log(text);
    console.log(image);
    // read image from the file system into a buffer
    const path = "./img/sri.jpg";
    const img = rwClient.v1.uploadMedia(path);
    const response = await rwClient.v2.tweet({
      text: `${text} ${new Date().toISOString()}`,
      media_ids: img.media_id_string,
    });
    console.log(img);
    res.send(response);
  } catch (e) {
    console.log(e);
    res.send(e.message);
  }
});

// app.get("/tweet", async (req, res) => {
//     // get all tweets from the timeline
//     try {
// //    read all tweets from the timeline
//         const tweets = await rwClient.v2.timeline(
//             "@Shashik88093",
//             {
//                 max_results: 100,
//             }
//         );
//         console.log(tweets);
//         res.send(tweets);
//     } catch (e) {
//         console.log(e);
//         res.send(e.message);
//     }

// }
// );

app.listen(8000, () => {
  console.log("Listening on port 8000");
});
