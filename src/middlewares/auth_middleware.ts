import Response from "../helpers/response_helper";
import jwt from "jsonwebtoken";
import IAuth from "../interfaces/Iauth"
import IResponse from "src/interfaces/Iresponse";

class Middleware {
  authValidation(req:IAuth, res:IResponse, next:any) {
    const header = req.headers.authorization;
    const token = header.replace("Bearer ", "");

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userToken = decoded;
    } catch (err) {
      let resPayload = {
        message: err.message,
        payload: {},
      };
      return Response.error(res, resPayload, 401);
    }
    next();
  }
}

export default new Middleware();
