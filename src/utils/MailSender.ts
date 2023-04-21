import { createTransport } from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export class MailSender {
    private trasport = createTransport({
        host: "smtp.office365.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.USER_NODEMAILER,
            pass: process.env.PASS_NODEMAILER
        },
        tls:{
            rejectUnauthorized: false
        }
    });

    public sendMail(to: string, name: string, token: string) {
        this.trasport.sendMail({
            from: `Bryan Rocha <${process.env.USER_NODEMAILER}>`,
            to: "bryangomesrocha@gmail.com",
            subject: "Enviando email com node.js",
            html: "<h1>Email enviado com node</h1>"
        });
    }
}







