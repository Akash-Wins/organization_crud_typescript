import { Document } from "mongoose";
interface IOrganization extends Document{
    orgName:string,
    address:{
        address1:string,
        address2:string,
        city:string,
        country:string,
        zipCode:number,
    },
    userId:string,
    isActive:boolean

}
export default IOrganization