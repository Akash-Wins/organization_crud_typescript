import IRequest from "./Irequest";

interface IProfile extends IRequest{
    userToken:{
        _id:string
    }
}
export default IProfile