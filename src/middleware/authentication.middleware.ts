import { NextFunction ,Response, Request } from "express";
import { BadRequest, ForbiddenException } from "../utils/response/error.response";
import { decodeToken, TokenEnum } from "../utils/security/token.security";
import { RoleEnum } from "../DB/models/User.model";


export const authentication = (tokenType: TokenEnum = TokenEnum.access) => {
    return async (req: Request, res: Response, next:NextFunction) =>{
      
        if (!req.headers.authorization) {
            throw new BadRequest("validation error",{
                key:"headers",
                issues: [{ path: "authorization", message:"missing authorization" }]
            })
        }
        const { decoded, user } = await decodeToken({
            authorization: req.headers.authorization,
            tokenType,
        });

        req.user = user;
        req.decoded = decoded;
        next();
    }
}



export const authorization = (
    accessRoles: RoleEnum[] = [],
    tokenType: TokenEnum = TokenEnum.access
) => {
    return async (req: Request, res: Response, next:NextFunction) =>{
      
        if (!req.headers.authorization) {
            throw new BadRequest("validation error",{
                key:"headers",
                issues: [{ path: "authorization", message:"missing authorization" }]
            })
        }
        const { decoded, user } = await decodeToken({
            authorization: req.headers.authorization,
            tokenType,
        });


        if (!accessRoles.includes(user.role)) {
            throw new ForbiddenException("Not authorized account")
        }

        req.user = user;
        req.decoded = decoded;
        next();
    }
}