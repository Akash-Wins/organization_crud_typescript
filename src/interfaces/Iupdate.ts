import IRequest from "./Irequest"

interface IUpdate extends IRequest{
    body:{
        _id:string,
        firstName:string,
        lastName:string,
        userName:string,
        email:string,
        password:string,
        createdAt:string,
        updatedAt:string,
        updatePassword:boolean
    },
    userToken:{
        _id:string
    }


}
export default IUpdate