const request = require('request');
var accToken = "";
var user_Id = ""
  request(
    {
      uri: "https://graph.facebook.com/v2.6/me/accounts",
      qs: { access_token: PAGE_ACCESS_TOKEN,  }, // access token of your app (bot server) to your page
      method: "POST",
      json: {
        recipient: {
          id: sender_psid
        }
      }
    },
    (err, res, body) => {
      if (err || body.error) {
        console.log("UNABLE TO SEND PASS THREAD REQUEST", err || body.error);
      } else {
        console.log("PASSED THREAD TO MESSAGE DASHBOARD BOT");
      }
    }
  );