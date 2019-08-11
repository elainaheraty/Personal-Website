const keys = require("../config/keys");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const Twit = require("twit");

var T = Twit({
  consumer_key: keys.twitterConsumerKey,
  consumer_secret: keys.twitterConsumerSecret,
  access_token: keys.twitterAccessToken,
  access_token_secret: keys.twitterAccessTokenSecret
});

const oauth2Client = new OAuth2(
  keys.googleClientId, // ClientID
  keys.googleClientSecret, // Client Secret
  "https://developers.google.com/oauthplayground" // Redirect URL
);

oauth2Client.setCredentials({
  refresh_token: keys.googleRefreshToken
});

module.exports = app => {
  app.post("/api/sendmessage", (req, res) => {
    if (req.body.name && req.body.email && req.body.message) {
      const accessToken = oauth2Client.getAccessToken();
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: keys.myEmail,
          clientId: keys.googleClientId,
          clientSecret: keys.googleClientSecret,
          refreshToken: keys.googleRefreshToken,
          accessToken: accessToken
        }
      });

      const mailOptions = {
        from: req.body.email,
        to: "ashwathkrishnan@yahoo.com",
        subject:
          "message from " +
          req.body.name +
          ", subject: " +
          (req.body.subject ? req.body.subject : "NO SUBJECT"),
        text: req.body.message
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          return res.status(500).json({
            message: "error sending mail",
            error
          });
        } else {
          return res.status(200).json({
            message: "message sent successfully"
          });
        }
      });
    } else {
      return res.status(400).json({
        message: "missing parameters"
      });
    }
  });

  app.get("/api/tweets", async (req, res) => {
    var tweets = await T.get("statuses/user_timeline", {
      screen_name: "ashwathbkrishna",
      count: 3
    });

    res.status(200).json({
      tweets
    });
  });
};
