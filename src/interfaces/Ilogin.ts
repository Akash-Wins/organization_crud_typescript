import IRequest from "./Irequest";

interface ILogin extends IRequest{
    body:{
            userName:string;
            password:string;
        }
}
export default ILogin