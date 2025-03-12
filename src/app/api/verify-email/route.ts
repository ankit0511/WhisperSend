import { UserModel } from './../../../models/User-model';
import dbConnect from "@/lib/db-Connect";
import { z } from "zod";

export async function POST(request: Request) {
    await dbConnect();


    try {
        const { userName, code } = request.json();
        const decodedUserName = decodeURIComponent(userName);
        const user = await UserModel.findOne({
            userName: decodedUserName;
        })
        if (!user) {
            return Response.json({
                success: false,
                message: "Enter Valid UserName"
            }, { status: 400 });
        }

        const isCodeVerified = user.verifyCode == code
        const isCodeValid = new Date(user.verifyCodeExpiry) > new Date();


        if (isCodeValid && isCodeVerified) {
            user.isVerified = true;
            await user.save();
            return Response.json({
                success: true,
                message: "Account Verification SuccessFull"
            }, { status: 200 });
        } else if (!isCodeValid) {
            return Response.json({
                success: false,
                message: "Verification Code is Expired"
            }, { status: 400 });
        } else {
            return Response.json({
                success: false,
                message: "Please Enter Correct Code"
            }, { status: 400 });
        }




    } catch (error) {
        console.log("Error While Verifyong  Email ", error)
        return Response.json({
            success: false,
            message: "Error In email Verfication"
        }, { status: 400 });
    }
}