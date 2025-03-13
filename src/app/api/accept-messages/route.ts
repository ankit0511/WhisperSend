
// Server Session is for geeting sessions so that we can get the information about the user 
import { getServerSession } from "next-auth";
// we need auth Options to run the above session 
import { authOptions } from "../auth/[...nextauth]/options";

import dbConnect from "@/lib/db-Connect";
import { UserModel } from "@/models/User-model";

import { User } from "next-auth";
export async function POST(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    // we are extrating the optional user from the session
    const user: User = session?.user as User
    if (session || !session.user) {
        return Response.json({
            success: false,
            message: "User is Not Registred"
        }, { status: 400 });
    }
    const userID = user._id;
    const { acceptMessages } = await request.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userID,
            { isAcceptingMessage: acceptMessages },
            // if we do this then we will get the new updated value of the user
            { new: true }
        )

        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "Error While changeing user staus to not accpting the message form accepting the message"
            }, { status: 400 });
        }
        return Response.json({
            success: true,
            message: "Successfully Changed the status of the User",
            updatedUser
        }, { status: 200 });


    } catch (error) {
        console.log("Error While changeing user staus to not accpting the message form accepting the message", error)
        return Response.json({
            success: false,
            message: "Error While changeing user staus to not accpting the message form accepting the message"
        }, { status: 500 });
    }
}

export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    // we are extrating the optional user from the session
    const user: User = session?.user as User
    if (session || !session.user) {
        return Response.json({
            success: false,
            message: "User is Not Registred"
        }, { status: 400 });
    }
   try {
     const userID = user._id;
 
     const foundUser = await UserModel.findById(userID);
 
     if(!foundUser){
         return Response.json({
             success: false,
             message: "User With this ID is Not Found in our databse"
         }, { status: 400 });
     }
 
     return Response.json({
         success: true,
         isAcceptingMessage : foundUser.isAcceptingMessage
     }, { status: 500 });
   } catch (error) {
    console.log("error at Accepting Message",error)
    return Response.json({
        success: false,
        message: "error at Accepting Message"
    }, { status: 400 });
   }
}