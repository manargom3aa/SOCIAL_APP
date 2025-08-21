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
