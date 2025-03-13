// Server Session is for geeting sessions so that we can get the information about the user 
import { getServerSession } from "next-auth";
// we need auth Options to run the above session 
import { authOptions } from "../auth/[...nextauth]/options";

import dbConnect from "@/lib/db-Connect";
import { UserModel } from "@/models/User-model";

import { User } from "next-auth";
import mongoose from "mongoose";

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

    // as we need mongoose ObjectID to apply aggrigation Piplelines 
    const userID = new mongoose.Types.ObjectId(user._id)

    try {
        // aggrigation Piplines: with all of this we are now able to get all the messages in the single Object
        const user = UserModel.aggregate([
            { $match: { id: userID } },
            // here we are using Unwind to convert the array of the message to individual documents 
            { $unwind: "$messages" },
            { $sort: { 'message.createdAt': -1 } },
            // we are using group to make group pf the elements coz they are scattered right now
            { $group: { _id: '$_id', messages: { $push: '$messages' } } }
        ])

      if(!user || (await user).length === 0 ){
        return Response.json({
            success: false,
            message: "User is Not Registred"
        }, { status: 400 });
      }

      return Response.json({
        success: true,
        message: user[0].messages
    }, { status: 200 });

    } catch (error) {
        console.log(error)
        return Response.json({
            success: true,
            message:" something went wrong or user Not Found"
        }, { status: 400 });
    }
}
