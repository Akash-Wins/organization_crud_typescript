import { Document } from "mongoose";
export default interface IEmail extends Document{ 

    body:{
        from: string,
        to: string,
        subject: string,
        text: string,
    }
}