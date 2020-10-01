"use strict"

const
  request = require('request'),  
  express = require('express'),
  body_parser = require('body-parser'),
  app = express(),
  PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN || "EAAEUIdBwrdQBACITxGSGgG6qGa0MfX2ZBCZCqxMTgERA0jeZC7u9GAt77Vw4ZCZB7ddJebZCj5C0c4uNw7ts2x7iUavMdcRW9uRqW4w2DXL75bNT47WP2YbZB1WQZAdHLecMs6Ko39bxoURWoZA44aUAh9YXuqepsa7UJ7iTA9BHTGDKYlwOUUyMWZAhONcGiWas4ZD", // amm testing page
  VERIFY_TOKEN =  process.env.VERIFY_TOKEN ||"verify me", // passcode for webhook verify
  port = process.env.PORT || 3000;
  

app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());
app.listen(port, () => console.log("webhook is listening", port))

const serverURL = "";
// Adds support for GET requests to our webhook
app.get('/', (req,res)=>{
    console.log("testing ok...")
    res.status(200).send("Testing ok")
})

app.get("/webhook", (req, res) => {        
    // Parse the query params
    let mode = req.query["hub.mode"]
    let token = req.query["hub.verify_token"]
    let challenge = req.query["hub.challenge"]

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
        // Checks the mode and token sent is correct
        if (mode === "subscribe" && token === VERIFY_TOKEN) {
            // Responds with the challenge token from the request
            console.log("WEBHOOK_VERIFIED")
            res.status(200).send(challenge)
        } else {
            // Responds with "403 Forbidden" if verify tokens do not match
            res.sendStatus(403)
        }
    }
})

app.post("/webhook", (req, res) => {    
    const webhook_events = req.body.entry[0];    // parse messaging array
    console.log("webhook_events messaging:", webhook_events.messaging)     // Bot is in control - listen for messages  
    if (webhook_events.messaging) {
        // iterate webhook events
        webhook_events.messaging.forEach(event => {
          var sender_psid = event.sender.id;
          if (event.postback) {
            handlePostback(sender_psid, event.postback);
          } else if(event.pass_thread_control){
            console.log('move to doen mess');
            let response = {
              "text": "လူကြီးမင်းကို messenger bot ရဲ့အလိုအလျှောက်တုံ့ပြန်မှု့စနစ်ထဲသို့ လွှဲပြောင်းလိုက်ပြီ ဖြစ်၍ ပြန်လည်စတင်ရန် ကိုနှိပ်ပါ။",
              "quick_replies": [
                {
                  "content_type": "text",
                  "title": "ပြန်လည်စတင်ရန်",
                  "payload": "yes"
                }
              ]
            }
            callSend(sender_psid, response);
          } else if (event.message) {
            if (event.message.quick_reply) {
              handleQuickReply(sender_psid, event.message);
            } else {
              handleMessage(sender_psid, event.message);
            }    
          }
        })
        
        res.status(200).send('EVENT_RECEIVED');
    }    
    else {
        // Returns a "404 Not Found" if event is not from a page subscription
        res.status(404).send('No EVENT_RECEIVED')
    }

})


/**********************************************
Function to Handle when user send message to bot
***********************************************/
// Function to handle when user click button
function handlePostback(sender_psid, received_postback) {
  let payload = received_postback.payload;
  console.log("payload type:", payload);
  switch(payload){
      case 'back':
          quickReply(sender_psid);
          break
      case 'next':
          welcome(sender_psid);
          break    
      case 'home':
          quickReply(sender_psid);
          break;           
  }
}
// Function to handle when user input or text
function handleMessage(sender_psid, received_message) {
    let user_message = received_message.text;       
    console.log("received_message:", user_message)
    if(user_message){
      switch(user_message){
        case 'Hi':
            welcome(sender_psid);
            break
        case 'quick reply':
            doSomething(sender_psid);
            break    
        case 'carousel':
            doSomething(sender_psid);
            break
        default:
            unknownCommand(sender_psid);
            break            
      }
    }else {      
        unknownCommand(sender_psid);
    } 
}
// Function to handle when user click on quick reply button
function handleQuickReply(sender_psid, received_quickreply) {
  console.log("qick reply:",received_quickreply.quick_reply.payload);
  let qickreply = received_quickreply.quick_reply.payload;
  switch (qickreply) {
    case "yes":
      carouosel(sender_psid)
      break;
    case 'no':
      welcome(sender_psid)
      break;
    default:
      unknownCommand(sender_psid);
      break
  }
}


/************************************
  Function to reponse for the message
*************************************/
function welcome(sender_psid) {
  let text = 'Welcome,'; 
  // response type 1 -> button template
  let response1 =  {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "button",
        "text": "It is the template 'button' response.",
        "buttons": [
          {
            "type": "web_url",
            "title": "Go to link",              
            "url": `https://www.facebook.com/blife.mm`,
            "title": "BLife Facebook Page",
            "webview_height_ratio": "tall"
          },
          {
            "type": "postback",
            "title": "Home to quick reply",
            "payload": "home"
          }
          ,
          {
            "type": "postback",
            "title": "Back to default",
            "payload": "back"
          }
        ]
      }
    }
  }
  // response type 2 -> quick_reply
  let response2 =  {
    "text": "It is the 'quick_reply' response.",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "👉Test1 Yes",
        "payload": "yes"
      }, {
        "content_type": "text",
        "title": "👉Test2 No",
        "payload": "no",
      }      
    ]
  }
   // response type 2 -> generic template
  let response3 = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [
          {
            "title": "It is the templaet 'generic' response Title. Also called carousel.",
            "subtitle": `It is the templaet 'generic' response sub-title.`,
            "image_url": `http://blife.blifemm.com/img/icon/abt.png`,
            "buttons": [            
              {
                "type": "postback",
                "title": "Post back 1",
                "payload": "pstback1",
              },
              {
                "type": "postback",
                "title": "Post back 2",
                "payload": "pstback2",
              }
            ]
            
          },
          {
            "title": "It is the templaet 'generic' response Title. Also called carousel2.",
            "subtitle": `It is the templaet 'generic' response sub-title.`,
            "image_url": `http://blife.blifemm.com/img/icon/abt.png`,
            "buttons": [            
              {
                "type": "postback",
                "title": "Post back 1",
                "payload": "fasttopup",
              },
              {
                "type": "postback",
                "title": "Post back 2",
                "payload": "onechoice",
              }
            ]
            
          },
        ]
      }
    }
  }
  callSend(sender_psid, response1)
}

function quickReply(sender_psid) {
  let text = 'You just click a button.';
  let response =  {
    "text": "It is the 'quick_reply' response.",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "Yes to carousel",
        "payload": "yes"
      }, {
        "content_type": "text",
        "title": "No to template button",
        "payload": "no",
      }      
    ]
  }
  callSend(sender_psid, response);
}

function carouosel(sender_psid) {
  let text = 'You just click a button.';
    // response type 2 -> generic template
    let response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [
            {
              "title": "It is the templaet 'generic' response Title. Also called carousel.",
              "subtitle": `It is the templaet 'generic' response sub-title.`,
              "image_url": `http://blife.blifemm.com/img/icon/abt.png`,
              "buttons": [            
                {
                  "type": "postback",
                  "title": "To Button Template",
                  "payload": "next",
                },
                {
                  "type": "postback",
                  "title": "To quick Reply",
                  "payload": "back",
                }
              ]
              
            },
            {
              "title": "It is the templaet 'generic' response Title. Also called carousel2.",
              "subtitle": `It is the templaet 'generic' response sub-title.`,
              "image_url": `http://blife.blifemm.com/img/icon/abt.png`,
              "buttons": [            
                {
                  "type": "postback",
                  "title": "Post back 1",
                  "payload": "fasttopup",
                },
                {
                  "type": "postback",
                  "title": "Post back 2",
                  "payload": "onechoice",
                }
              ]
              
            },
          ]
        }
      }
    }
  callSend(sender_psid, response);
}

function doSomething(sender_psid) {
    let text = 'You just click a button.';
    let response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "button",
          "text": text,
          "buttons": [
            {
              "type": "postback",
              "title": "to welcome",
              "payload": "home"
            }
          ]
        }
      }
    }
    callSend(sender_psid, response);
}

function unknownCommand(sender_psid) {
    let response = { "text": "Sorry, I dont understand!" };
    callSend(sender_psid, response);
}
  

/**************************************
  Calling Facebook API for push message
**************************************/
function callSendAPI(sender_psid, response) {
    let request_body = {
      "recipient": { "id": sender_psid },
      "message": response
    }
  
    return new Promise(resolve => {
      request({
        "uri": "https://graph.facebook.com/v7.0/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
      }, (err, res, body) => 
        {
            if (!err) { resolve('message sent!') } 
            else { console.error("Unable to send message:" + err); }
        }
     );
    });
}

async function callSend(sender_psid, response) {
   let send = await callSendAPI(sender_psid, response);
}
