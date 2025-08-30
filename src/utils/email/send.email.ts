import { createTransport, type Transporter} from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { BadRequest } from "../response/error.response";


export const sendEmail = async (data: Mail.Options): Promise<void> => {
  if (!data.html && !data.attachments?.length && !data.text) {
    throw new BadRequest("Missing email content")
  }
  const transporter : Transporter<
  SMTPTransport.SentMessageInfo,
  SMTPTransport.Options
  > = createTransport({
     service: "gmail",
    auth: {
      user: process.env.EMAIL_USER as string,
      pass: process.env.EMAIL_PASS as string,
    },
  })
   
 

 const info = await transporter.sendMail({
  ...data,
  from: process.env.EMAIL_USER,
 })

 console.log("Message sent: ",info.messageId);
 
};
