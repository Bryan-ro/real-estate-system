const nodemailer = require("nodemailer");
// import dotenv from "dotenv";
// dotenv.config();

const trasport = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
        user:"bryan.rocha8ballpool@gmail.com",
        pass: "Inicialacbb06241234"
    },
    tls:{
        rejectUnauthorized: false
    }
});

trasport.sendMail({
    from: "Bryan Rocha <bryan.rocha8ballpool@gmail.com>",
    to: "bryangomesrocha@gmail.com",
    subject: "Enviando email com node.js",
    html: "<h1>Email enviado com node</h1>"
}).then(() => {
    console.log("Sucesso");
}).catch(err => {
    console.log("Error: " + err);
});

