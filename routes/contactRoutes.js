const keys = require("../config/keys");
const nodemailer = require("nodemailer");
const Twit = require("twit");

var T = Twit({
  consumer_key: keys.twitterConsumerKey,
  consumer_secret: keys.twitterConsumerSecret,
  access_token: keys.twitterAccessToken,
  access_token_secret: keys.twitterAccessTokenSecret
});

module.exports = app => {
  app.post("/api/sendmessage", (req, res) => {
    if (req.body.name && req.body.email && req.body.message) {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        service: "gmail",
        port: 645,
        secure: false,
        auth: {
          user: keys.myEmail,
          pass: keys.myPassword
        },
        tls: {
          rejectUnauthorized: false
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
