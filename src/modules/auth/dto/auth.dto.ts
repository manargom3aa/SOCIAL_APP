// export interface ISignupBodyInputs{
//     username : string,
//     email : string,
//     password:string ,
//     phone:string 
// }


import * as validators from './auth.validation'

import{ z } from "zod";
export type ISignupBodyInputsDTto = z.infer<typeof validators.signup.body>;

export type ILoginBodyInputsDTO = z.infer<typeof validators.login.body>;
export type IConfirmEmailBodyInputsDTO = z.infer<typeof validators.confirmEmail.body>;
export type IForgotCodeBodyInputsDTO = z.infer<typeof validators.sendForgotCode.body>;
export type IVerifyForgotPasswordBodyInputsDTO = z.infer<typeof validators.verifyForgotPassword.body>;
export type IResetForgotPasswordBodyInputsDTO = z.infer<typeof validators.resetForgotPassword.body>;
export type IGmail = z.infer<typeof validators.signupWithGmail.body>;
