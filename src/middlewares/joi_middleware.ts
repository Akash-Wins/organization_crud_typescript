import validationHelper from "../helpers/validation_helper.js";
import Response from "../helpers/response_helper";
import MESSAGE from "../helpers/message_helper";
import IJoivalid from "../interfaces/Ijoivalid";
import IResponse from "src/interfaces/Iresponse.js";
class Validation {
  JoiMiddleware(req:IJoivalid, res:IResponse, next) {
    let route = req.route.path;
    let method = req.method.toLowerCase();

    let schema = validationHelper(route, method);
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      let Validation_error = error.details.map((err)=>{
        let userError ={};
        Object.assign(userError,{message:err.message.replace(/[\,"]/g,' '),path:err.path.toString()});
        return userError;
      })
        let payload={
          message: MESSAGE.VALIDATION_ERROR,
          payload: Validation_error,
        }
       return Response.error(res,payload);
    }
    next();
  }
}

export default new Validation();



