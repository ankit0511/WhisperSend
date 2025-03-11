import { Message } from "@/models/User-model";

export interface ApiResponse{
    success:boolean,
    message:string,
    isAcceptingMessages?:boolean,
    messages?:Array<Message>
// ? for making the field optional

}