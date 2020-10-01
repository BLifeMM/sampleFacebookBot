"use strict"

const
  request = require('request'),  
  express = require('express'),
  body_parser = require('body-parser'),
  app = express(),
  PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN || "EAAFYRyzpU1IBAMg0ZCx5bl7a0dFJkLwVT3fz4hfoAsIR44jdh7Qy64OCauhLzZCsm2JZCAXqtemq3Nm6PtvgxOaumRmpeRNIRVhx6UEK847ZA0q1sOxjZB60CSSSLy52RlxHIo4rvHzgKSgkjYkN4ZAvfqKAzPOItZCfZANyr341YHymuzrXRDilF6ZCAWiQ0INsZD",
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
    console.log(webhook_events)     // Bot is in control - listen for messages  
    if (webhook_events.messaging) {
        // iterate webhook events
        webhook_events.messaging.forEach(event => {
          var sender_psid = event.sender.id;
          if (event.postback) {
            handlePostback(sender_psid, event.postback);
          }else if(event.pass_thread_control){
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
function handlePostback(sender_psid, postback) {
  let payload = received_postback.payload;
  console.log("payload type:", payload);
  switch(payload){
      case 'back':
          doSomething(sender_psid);
          break
      case 'next':
          doSomething(sender_psid);
          break    
      case 'home':
          doSomething(sender_psid);
          break;           
  }
}
// Function to handle when user input or text
function handleMessage(sender_psid, received_message) {
    let user_message = received_message.text;       
    console.log("user_message:", user_message)
    switch(user_message){
        case 'Hi':
            doSomething(sender_psid);
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
  
    if(user_message){
        doSomething(sender_psid);
    }else {      
        unknownCommand(sender_psid);
    } 
}
// Function to handle when user click on quick reply button
function handleQuickReply(sender_psid) {
    let response = {
      "text": `Please choose a quick reply`,
      "quick_replies": [
        {
          "content_type": "text",
          "title": "Talk with bot👉",
          "payload": "talktoagent"
        },
        {
          "content_type": "text",
          "title": "👈 Call center(1)👉",
          "payload": "phone1",
        },
        {
          "content_type": "text",
          "title": "👈 Call center(2)👉",
          "payload": "phone2",
        },
        {
          "content_type": "text",
          "title": "👈 Call center(3)",
          "payload": "phone3",
        }
      ]
    }
    callSend(sender_psid, response);
}


/************************************
  Function to reponse for the message
*************************************/
function doSomething(sender_psid) {
    let text = '☎ဖုန်းခေါ်ရန်သေချာပါရဲ့လား? သေချာရင်"ခေါ် ဆိုမည်"ကိုနှိပ်ပါ';
    let response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "button",
          "text": text,
          "buttons": [
            {
              "type": "phone_number",
              "title": "✆ ခေါ် ဆိုမည်",
              "payload": "959897879771"
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
