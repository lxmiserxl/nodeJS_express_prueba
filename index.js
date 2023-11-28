const express = require('express')
const body_parser = require('body-parser')
const app = express();
var crypto = require('crypto');
const axios = require('axios')
require('dotenv').config()
//
const URL_WHATSAPP = process.env.URL_WHATSAPP
const ID_NUMERO_TELEFONO = process.env.ID_NUMERO_TELEFONO
//const ID_CUENTA_WHATSAPP_BUSINESS = process.env.ID_CUENTA_WHATSAPP_BUSINESS
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN
const VERIFY_TOKEN = process.env.VERIFY_TOKEN

function verifyRequestSignature(req, res, buf) {
    var signature = req.headers["x-hub-signature-256"];
  
    if (!signature) {
      console.warn(`Couldn't find "x-hub-signature-256" in headers.`);
    } else {
      var elements = signature.split("=");
      var signatureHash = elements[1];
      var expectedHash = crypto
        .createHmac("sha256", config.appSecret)
        .update(buf)
        .digest("hex");
      if (signatureHash != expectedHash) {
        throw new Error("Couldn't validate the request signature.");
      }
    }
  }

  function abortOnError(err, req, res, next) {
    if (err) {
      console.log(err);
      res.status(400).send({ error: "Invalid signature." });
    } else {
      next();
    }
  }

app.listen(8000 || process.env.PORT, () => {
    console.log("webhooks escuchando");
});


app.use(body_parser.json({ verify: verifyRequestSignature }))

// Add an error-handling Express middleware function 
// to prevent returning sensitive information.
app.use(abortOnError);

app.get('/webhooks', (req, res) => {
    console.log("webhooks get ");
    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === VERIFY_TOKEN) {
        res.send(req.query['hub.challenge']);
        console.log("webhooks suscrito");
    } else {
        res.sendStatus(400);
        console.log("Error de suscripcion de webhooks");
    }
})

app.post('/webhooks', (req, res) => {
    let body_param = req.body
    console.log(JSON.stringify(body_param, null, 2))
    crypto_js.SHA256.encry
    if (body_param.object) {
        if (body_param.entry &&
            body_param.entry[0].changes &&
            body_param.entry[0].changes[0].value &&
            body_param.entry[0].changes[0].value.messages &&
            body_param.entry[0].changes[0].value.messages[0]
        ) {
            //let PHONE_NUMBER = body_param.entry[0].changes[0].value.metadata.display_phone_number
            //let PHONE_NUMBER_ID = body_param.entry[0].changes[0].value.metadata.phone_number_id

            let messages_type = body_param.entry[0].changes[0].value.messages[0].type
            let messages_from = body_param.entry[0].changes[0].value.messages[0].from
            let messages_text_body = body_param.entry[0].changes[0].value.messages[0].text.body
            axios({
                method: 'post',
                url: URL_WHATSAPP + ID_NUMERO_TELEFONO + "/messages?access_token=" + WHATSAPP_TOKEN,
                data: {
                    messaging_product: "whatsapp",
                    recipient_type: "individual",
                    to: messages_from,
                    type: "text",
                    text: { // the text object                       
                        body: "HOLA ES mensaje de rpt A " + messages_text_body
                    },
                    headers: {
                        "Content-Type": 'application/json'
                    }
                }
            })

            res.sendStatus(200)
        }
        else {

            res.sendStatus(404)
        }
    }

})

app.get('/', (req, res) => {
    res.status(200).send("webhooks esta cargado")
})


/*const express = require('express')
const body_parser = require('body-parser')
const app = express().use(body_parser.json())
const axios = require('axios')
require('dotenv').config()

const URL_WHATSAPP = process.env.URL_WHATSAPP 
const ID_NUMERO_TELEFONO = process.env.ID_NUMERO_TELEFONO
const ID_CUENTA_WHATSAPP_BUSINESS = process.env.ID_CUENTA_WHATSAPP_BUSINESS
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN
const VERIFY_TOKEN = process.env.VERIFY_TOKEN


app.listen(8000||process.env.PORT, () => {
    console.log("hola estoy ecuchando");
});

app.get('/webhooks', (req, res) => {
    console.log("webhooks get ");
    let mode = req.query['hub.mode']
    let verify_token = req.query['hub.verify_token']
    let challenge = req.query['hub.challenge']

    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === VERIFY_TOKEN) {
        res.send(req.query['hub.challenge']);
        console.log("hola if ");
    } else {
        res.sendStatus(400);
        console.log("hola else");
    }
})
app.post('/webhooks', (req, res) => {
    let body_param = req.body
    console.log("webhooks post ");
    console.log(req)
    

    if (body_param.object) {
        if (body_param.entry &&
            body_param.entry[0].changes &&
            body_param.entry[0].changes[0].value &&
            body_param.entry[0].changes[0].value.messages &&
            body_param.entry[0].changes[0].value.messages[0]
        ) {
            let PHONE_NUMBER = body_param.entry[0].changes[0].value.metadata.display_phone_number
            //let PHONE_NUMBER_ID = body_param.entry[0].changes[0].value.metadata.phone_number_id
            let messages_type = body_param.entry[0].changes[0].value.messages[0].type
            let messages_from = body_param.entry[0].changes[0].value.messages[0].from
            let messages_text_body = body_param.entry[0].changes[0].value.messages[0].text.body
            axios({
                method: 'post',
                url: URL_WHATSAPP + ID_NUMERO_TELEFONO + "/messages?access_token=" + WHATSAPP_TOKEN,
                data: {
                    messaging_product: "whatsapp",
                    recipient_type: "individual",
                    to: messages_from,
                    type: "text",
                    text: { // the text object                       
                        body: "HOLA ES mensaje de rpt A " + messages_text_body
                    },
                headers: {
                    "Content-Type": 'application/json'
                    }
                }
            })

            res.sendStatus(200)
        }
        else{

            res.sendStatus(404)
        }
    }

})

app.get('/', (req, res) => {
    res.status(200).send("hello tis is cargado")
})
*/
