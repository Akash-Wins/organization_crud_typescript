import IRequest from "./Irequest";

interface IAuth extends IRequest{
    headers:{
        authorization:string
    },
    userToken:{
        
    }
}
export default IAuth