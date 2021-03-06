const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {save_user_information} = require('./models/server_db');
const path = require('path');
const publicPath = path.join(__dirname, './public');
const paypal = require('paypal-rest-sdk');
/* handling all the parsing */

app.use(bodyParser.json());
app.use(express.static(publicPath));

/* paypal configuration*/
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'ATW88AoHwpt1LjtY1qVA9_xgAsLPnjl2QvSme47jh_tbckgIB2gYV1PRdJny666lUqZncaD_eTgxVkhf',
  'client_secret': 'EJgxmtj4g6v0ynlCqcfnuPoBL5a-nA4-HS4QmNuSpSbHaC9m_f9h6JHVvIFza0Nlqz0ZiqqqhnUb6PA1'
});

app.post('/post_info' , async(req, res) =>{
  var email = req.body.email;
  var amount = req.body.amount;

if(amount <= 1 ){
return_info = {};
  return_info.error = true;
  return_info.message = "The amount should be greater than 1";
  return res.send(return_info);
}
var result = await save_user_information({"amount" : amount, "email" : email});
  //res.send({'amount' : amount , 'email' : email });

  var create_payment_json = {
      "intent": "sale",
      "payer": {
          "payment_method": "paypal"
      },
      "redirect_urls": {
          "return_url": "http://localhost:3000/success",
          "cancel_url": "http://localhost:3000/cancel"
      },
      "transactions": [{
          "item_list": {
              "items": [{
                  "name": "Lottery",
                  "sku": "Funding",
                  "price": amount,
                  "currency": "INR",
                  "quantity": 1
              }]
          },
          "amount": {
              "currency": "INR",
              "total": amount
          },
          'payee' : {
            'email' : 'lottery.manager@lotteryapp.com'
          },
          "description": "Lottery Purchase."
      }]
  };


  paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
          throw error;
      } else {
          console.log("Create Payment Response");
          console.log(payment);
          for(var i = 0; i<payment.links.length; i++){
            if(payment.links[i].rel == 'approval_url'){
              return res.send(payment.links[i].href)
            }
          }
      }
  });

  //res.send(result);
});

app.get('/success', async (req, res) => {
  const payerId = req.query.PayerId;
  const paymentId = req.query.paymentId;
})


app.get('/get_total_amount', async (req, res) => {
  var result = await get_total_amount();
  console.log(result);
    res.send(result);
})

app.listen(3000, ()=> {
  console.log('server is running on port 3000');
});
