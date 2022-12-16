import IRequest from "./Irequest"

interface IAddUser extends IRequest {
    body:{
        firstName:string,
        lastName:string,
        userName:string,
        email:string,
        password:string,
        organization:{
            orgName: string,
            address: {
              orgAddress1: string,
              orgAddress2:string,
              city: string,
              state: string,
              zipCode: string
            }
          }
      }
}
export default  IAddUser