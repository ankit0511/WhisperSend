import { UserModel } from './../../../models/User-model';
import dbConnect from "@/lib/db-Connect";
import { z } from "zod";
// Import userName validation schema
import { userNameVerification } from '@/schema/Signup-Schema';

const userNameValidationSchema = z.object({
    userName: userNameVerification
});

export async function GET(request: Request) {
   if(request.method !== "GET"){
    return Response.json({
        success: false,
        message: "Method Not Allowed"
    }, { status: 400 });
   }
    await dbConnect();

    try {
        const searchParams = new URL(request.url).searchParams;
        const localParams = {
            userName: searchParams.get('userName')
        };

        // Validate with Zod
        const validatedUserName = userNameValidationSchema.safeParse(localParams);
        console.log(validatedUserName);

        // If validation fails
        if (!validatedUserName.success) {
            const userNameError = validatedUserName.error.format().userName?._errors || [];
            return Response.json({
                success: false,
                message: "UserName is Not Correct"
            }, { status: 400 });
        }

        const { userName } = validatedUserName.data;

        const existingVerifiedUser = await UserModel.findOne({
            userName,
            isVerified: true
        });

        if (existingVerifiedUser) {
            return Response.json({
                success: false,
                message: "UserName is Already Taken"
            }, { status: 400 });
        }

        return Response.json({
            success: true,
            message: "UserName is Available"
        }, { status: 200 });

    } catch (error) {
        console.log("Error while searching UserName ", error);
        return Response.json({
            success: false,
            message: "Error While Searching For UserName"
        }, { status: 500 });
    }
}
