import { User, UserModel } from './../../../models/User-model';
import dbConnect from "@/lib/db-Connect";
import { z } from "zod"
// import userName Validation Scheme to use with Zod
import { userNameVerification } from '@/schema/Signup-Schema';

const userNameVedlidationSchema = z.object({
    userName: userNameVerification
})

// now here we are taking out userName to check if this is availabe in the database 

export async function GET(request: Request) {
    await dbConnect();

    try {
        const { searchParms } = new URL(request.url);
        const { localParsms } = {
            userName: searchParms.get('userName')
        }

        // validation with zod 
        const validateduserName = userNameVedlidationSchema.safeParse(localParsms)
        console.log(validateduserName)
        //  if there is any error in the userName 
        if (!validateduserName.success) {
            const userNameError = validateduserName.error.format().userName?._errors || [];
            return Response.json({
                success: false,
                message: "UserName is Not Correct"
            }, { status: 400 })
        }

        const { userName } = validateduserName.data

        const existingVerifiesUser = await UserModel.findOne({
            userName,
            isVerified: true
        })

        if (existingVerifiesUser) {
            return Response.json({
                success: false,
                message: "UserName is Alrady Taken"
            }, { status: 400 })
        }
        return Response.json({
            success: true,
            message: "UserName is Present"
        }, { status: 200 })


    } catch (error) {
        console.log("error while Searching UserName ", error);
        return Response.json({
            success: false,
            message: "Error While Searching For UserName"
        }, { status: 400 })
    }
}