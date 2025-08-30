"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailEvent = void 0;
const node_events_1 = require("node:events");
const send_email_1 = require("../email/send.email");
const verify_template_email_1 = require("../email/verify.template.email");
exports.emailEvent = new node_events_1.EventEmitter();
exports.emailEvent.on("confirmEmail", async (data) => {
    try {
        data.subject = "ConfirmEmail";
        data.html = (0, verify_template_email_1.verifyEmail)({ otp: data.otp, title: "Email Confirmation" });
        await (0, send_email_1.sendEmail)(data);
    }
    catch (error) {
        console.error(`❌ Fail to send confirmEmail to ${data.to}`, error);
    }
});
exports.emailEvent.on("resetPassword", async (data) => {
    try {
        data.subject = "Reset-Account-Password";
        data.html = (0, verify_template_email_1.verifyEmail)({ otp: data.otp, title: "Reset Code" });
        await (0, send_email_1.sendEmail)(data);
    }
    catch (error) {
        console.error(`Fail to send email`, error);
    }
});
