import IRequest from "./Irequest";

interface IDelete extends IRequest{
    userToken:{
        _id:string
    }
}
export default IDelete