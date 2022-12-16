import { Document } from "mongoose";

interface IUser extends Document{
    _id:string;
    firstName:string,
    lastName:string,
    email:string,
    userName:string,
    password:string,
    isDeleted:boolean,
    updatePassword:boolean

}

export default IUser



