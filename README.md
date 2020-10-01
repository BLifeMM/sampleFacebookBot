# sampleFacebookBot
Library Prerequisites
1. Node >= 5.0.0 (Express framework)
2. An Active Facebook App from Facebook developer,  a page access token. To create account here.
3. Webhook - Please use a server endpoint URL that supports HTTPS. If you deploy on your own custom server, you’ll need a trusted (ca.pem) certificate, not self-signed. If you want to run with local test, please make sure you have installed ngrok. 
Prerequisites
Create a Facebook Page
If you don’t already have one, you need to create a Facebook Page. The Facebook Page is the “identity” of your bot, including the name and image that appears when someone chats with it inside Facebook Messenger.
If you’re just creating a dummy one for your chatbot, it doesn’t really matter what you name it or how you categorize it. You can skip through most of the setup steps.
In order to communicate with your bot, people will need to go through your Page, which we’ll look at in a bit.
Create a Facebook App
Go to the Facebook Developer’s Quickstart Page and click “Skip and Create App ID” at the top right. Then create a new Facebook App for your bot and give your app a name, category and contact email.

You’ll see your new App ID at the top right on the next page. Scroll down and click “Get Started” next to Messenger.

Setup Your Messaging App
Now you’re in the Messenger settings for your Facebook App. There are a few things in here you’ll need to fill out in order to get your chatbot wired up to the ngrok.
Generate a Page Access Token

Using the Page you created earlier (or an existing Page), click through the auth flow and you’ll receive a Page Access Token for your app.

Click on the Page Access Token to copy it to your clipboard. You’ll need to set it as an environment variable for your Heroku application. On the command line, in the same folder where you cloned the application, run:
add PAGE_ACCESS_TOKEN=”your_page_token_here” in the environment file or in the code.
This token will be used to authenticate your requests whenever you try to send a message or reply to someone.
Setup Webhook

When you go to setup your webhook, you’ll need a few bits of information:


Callback URL - The hosting listening (localhost/ngrok or specific server) URL that we setup earlier.
Verify Token - A secret value that will be sent to your bot, in order to verify the request is coming from Facebook. Whatever value you set here, make sure you add it to your environment or in the code using VERIFY_TOKEN=“your_verification_token_here” 
Subscription Fields - This tells Facebook what messaging events you care about and want it to notify your webhook about. If you're not sure, just start with "messages," as you can change this later.

After you’ve configured your webhook, you’ll need to subscribe to the specific page you want to receive message notifications for.

Once you’ve gotten your Page Access Token and set up your webhook, make sure you set both the PAGE_ACCESS_TOKEN and VERIFY_TOKEN config values in your application, and you should be good to go!


How to run?

Simple facebook-bot, with code and instruction for getting start.

       Clone https://github.com/BLifeMM/sampleFacebookBot and navigate to the ‘sampleFaceBookBot’ folder.

       If you have own Facebook app and Facebook page, change PAGE_ACCESS_TOKEN and VERIFY_TOKEN value. 

Run     
➢ npm install
➢ npm start

       The local deployment is success. The brief of the code is explained in the index.js. Please follow the steps. 


       The webhook ‘Get’ method end point ‘/’, is the CalbackURL which is used to verify the server is https and ensure it is working by the Facebook app and webhook VERIFY_TOKEN is used to verify the server is correct.






How we track the request, response?
       The userInput may come from the message templates, each designed to support a different, common message structure, including lists, receipts, buttons, and more from the ‘response’. For complete details, see Templates. Genernally, the userInput can be divided into three postback, pass_thread_control and message based on the json reply from the webhook listening.




Facebook messenger bot response with its own API.
‘https://graph.facebook.com/v7.0/me/messages’

As an example for sending message in messenger bot, call this funciton callSendAPI-> 
function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v7.0/me/messages",
    "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  }); 
}
It required ‘sender_psid’ and the ‘response’ to show in the messenger bot.
Testing when FB has not yet approved
Use username and password for login with test account is not working.
Even though it states that it has testing flow, which means testing account is allowed, it is not working with testing page. This link, https://developers.facebook.com/docs/facebook-login/testing-your-login-flow/, will show how to connect with test account and test page.


For the current, your facebook account will be needed to the facebook app for messaging since it is In development state. Only Live mode will allow to message with everyone.

More Info;

Run facebook messenger bot with ngrok example-> 
https://github.com/montecripto/Messenger-Bot-Ngrok-Tutorial

https://github.com/digithun/fb-messenger-bot-nodejs-example

