"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailEvent = void 0;
const node_events_1 = require("node:events");
const send_email_1 = require("../email/send.email");
exports.emailEvent = new node_events_1.EventEmitter();
exports.emailEvent.on("confirmEmail", async (data) => {
    try {
        await (0, send_email_1.sendEmail)({
            to: data.to,
            subject: data.subject || "Confirm Your Email",
            text: `Your OTP is ${data.otp}`,
            html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Email Confirmation</h2>
          <p>Your OTP code is: <b style="font-size:18px;">${data.otp}</b></p>
          <p>This code will expire in 2 minutes.</p>
        </div>
      `,
        });
        console.log(`✅ OTP email sent to: ${data.to} | OTP: ${data.otp}`);
    }
    catch (error) {
        console.error(`❌ Fail to send confirmEmail to ${data.to}`, error);
    }
});
exports.emailEvent.on("sendForgotPassword", async (data) => {
    try {
        await (0, send_email_1.sendEmail)({
            to: data.to,
            subject: data.subject || "Forgot Password",
            text: `Your reset code is ${data.otp}`,
            html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Password Reset</h2>
          <p>Your OTP code is: <b style="font-size:18px;">${data.otp}</b></p>
          <p>${data.title || ""}</p>
        </div>
      `,
        });
        console.log(`✅ Forgot password email sent to: ${data.to} | OTP: ${data.otp}`);
    }
    catch (error) {
        console.error(`❌ Fail to send email to ${data.to}`, error);
    }
});
