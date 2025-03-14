import { User } from './../../../models/User-model';
import dbConnect from "@/lib/db-Connect";
import { UserModel } from "@/models/User-model";
import bcrypt from "bcryptjs";

import { SendVerificationEmail } from "@/helper/sendVerificationEmail";
export async function POST(request: Request) {
    await dbConnect()

    try {
        const { userName, email, password } = await request.json();
        const existingUserVerifyByEmail = await UserModel.findOne({
            userName,
            isVerified: true
        })

        if (existingUserVerifyByEmail) {
            return Response.json({
                success: false,
                message: "userNamme is alrady Taken"
            }, { status: 400 })
        }
        const existingUserByEmail = await UserModel.findOne({
            email
        })

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserByEmail) {

            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "Email is Alrady taken"
                }, { status: 400 })
            }
            else {
                console.log(password);
                const hasedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hasedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                const expiryDate = new Date;
                expiryDate.setHours(expiryDate.getHours() + 1)
                existingUserByEmail.verifyCodeExpiry = expiryDate;



                await existingUserByEmail.save();

            }
        }
        else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date;
            expiryDate.setHours(expiryDate.getHours() + 1)
            const newUser = new UserModel({
                userName,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []// Fixed type
            })
            await newUser.save();
        }

        // send Verification email
        const verificationEmail = await SendVerificationEmail(email, userName, verifyCode)
        if (!verificationEmail.success) {
            return Response.json({
                success: false,
                message: "Unable to Send Email For Verification"
            }, { status: 400 })
        }
        return Response.json({
            success: true,
            message: "Account Created Successfully Verify Your email To Continue"
        }, { status: 200 })
    } catch (error) {
        console.log("error while regestring user", error);
        return Response.json(
            {
                success: false,
                message: "Error While Regestring User"
            }, {
            status: 500
        }
        )
    }
}