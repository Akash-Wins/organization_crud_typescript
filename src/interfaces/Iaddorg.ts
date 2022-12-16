import IRequest from './Irequest';

interface IOrgAdd extends IRequest{
    body:{
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
    },
    userToken:{
        _id:string
    }
    
}

export default IOrgAdd