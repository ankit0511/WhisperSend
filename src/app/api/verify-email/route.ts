import { UserModel } from './../../../models/User-model';
import dbConnect from "@/lib/db-Connect";
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    await dbConnect();

    try {
        const userCollectionName = UserModel.collection.name;
        console.log("Current Collection:", userCollectionName);
        
        const { userName, code } = await request.json();
        console.log("Request Payload:", { userName, code }); // Debugging

        const decodedUserName = decodeURIComponent(userName);
        console.log (typeof(decodedUserName));
        const user = await UserModel.findOne({
            userName: decodedUserName,
        });
      console.log(user);
      
        if (!user) {
            return NextResponse.json(
                { success: false, message: "Enter Valid UserName" },
                { status: 400 }
            );
        }

        const isCodeVerified = user.verifyCode == code;
        const isCodeValid = new Date(user.verifyCodeExpiry) > new Date();

        if (isCodeValid && isCodeVerified) {
            user.isVerified = true;
            await user.save();
            return NextResponse.json(
                { success: true, message: "Account Verification SuccessFull" },
                { status: 200 }
            );
        } else if (!isCodeValid) {
            return NextResponse.json(
                { success: false, message: "Verification Code is Expired" },
                { status: 400 }
            );
        } else {
            return NextResponse.json(
                { success: false, message: "Please Enter Correct Code" },
                { status: 400 }
            );
        }
    } catch (error) {
        console.log("Error While Verifying Email:", error);
        return NextResponse.json(
            { success: false, message: "Error In Email Verification" },
            { status: 500 }
        );
    }
}