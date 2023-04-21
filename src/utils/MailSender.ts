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

    public async sendMail(to: string, name: string, code: string) {
        await this.trasport.sendMail({
            from: `Bryan Rocha <${process.env.USER_NODEMAILER}>`,
            to: to,
            subject: "Recuperação de senha",
            html: `<h1>Olá ${name}, seu código é: ${code}</h1>`
        }).catch((err) => {
            console.error(err);
        });
    }
}







