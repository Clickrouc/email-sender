const express = require('express');
const nodemailer = require('nodemailer');
const fs = require("fs");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

const app = express();
const port = 4201;

app.post('/send', upload.single('attachment'), (req, res) => {
    const readHTMLFile = function(path, callback) {
        fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
            if (err) {
                callback(err);
                throw err;

            }
            else {
                callback(null, html);
            }
        });
    };

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: req.body['gmail-login'],
            pass: req.body['gmail-password']
        }
    });

    readHTMLFile(__dirname + '/template.html', (err, html) => {
        const mailOptions = {
            from: req.body['gmail-login'],
            to: req.body['email-to'],
            subject: req.body['subject'],
            html: html,
            attachments: [{
                filename: 'offer.pdf',
                path: req.file.path,
                contentType: 'application/pdf'
            }]
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
                res.send(error);
            } else {
                res.send("Сообщение отправлено!");
                console.log('Email sent: ' + info.response);
            }
        });
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
