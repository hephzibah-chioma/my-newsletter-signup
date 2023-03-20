const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "/")));

app.get("/", function(req, res) {
    res.sendFile(`${__dirname}/signup.html`);
})

app.post("/", function(req, res) {
    
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    }
    const jsonData = JSON.stringify(data);
    const URL = "https://us20.api.mailchimp.com/3.0/lists/91679df4e7";
    const options = {
        method: "POST",
        auth: "chikey:d58f51bc5cbffdb41ef741c89454e27d-us21"
    }
    const request = https.request(URL, options, function(response) {
        let statusCode = response.statusCode;
        if (statusCode === 200) {
            res.sendFile(`${__dirname}/success.html`);
        } else {
            res.sendFile(`${__dirname}/failure.html`);
        }
        response.on("data", function(data) {
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();
})

app.post("/failure", function(req, res) {
    res.redirect("/");
})

app.listen(PORT, function() {
    console.log("Server is running.");
})

// const apiKey = "d58f51bc5cbffdb41ef741c89454e27d-us21"
// const listID = "91679df4e7"