import { EventEmitter } from "node:events";
import { sendEmail } from "../email/send.email";
import Mail from "nodemailer/lib/mailer";
import { verifyEmail } from "../email/verify.template.email";


export const emailEvent = new EventEmitter();

interface IEmail extends Mail.Options {
  otp: number ;
}

 
emailEvent.on("confirmEmail", async (data: IEmail) => {
  try {
   data.subject = "ConfirmEmail";
   data.html = verifyEmail({otp: data.otp ,title: "Email Confirmation"})
  await sendEmail(data)

  } catch (error) {
    console.error(`❌ Fail to send confirmEmail to ${data.to}`, error);
  }
});

 
emailEvent.on("resetPassword", async (data: IEmail) => {
  try {
   data.subject = "Reset-Account-Password";
   data.html = verifyEmail({otp: data.otp ,title: "Reset Code"})
  await sendEmail(data)

  } catch (error) {
    console.error(`Fail to send email`, error);
  }
});

