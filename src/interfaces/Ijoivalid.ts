import IRequest from "./Irequest";

interface IJoivaild extends IRequest{
    route:{
        path:string
    },
    method:string,
    body:{
        
    }
}
export default IJoivaild