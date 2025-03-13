import dbConnect from "@/lib/db-Connect";
import { UserModel } from "@/models/User-model";
import { Message } from '@/models/User-model'


export async function POST(request: Request) {
    await dbConnect();
    const { userName, content } = await request.json();
    try {
        const user = await UserModel.findOne({ userName })
        if (!user) {
            return Response.json({
                success: false,
                message: "User Not Found"
            }, { status: 400 });
        }
        if (!user.isAcceptingMessage) {
            return Response.json({
                success: false,
                message: "User is Not Accepting Messages"
            }, { status: 400 });
        }
        const newMessage = { content, createdAt: new Date() }
        //   we are pushing  the messages to the user
        user.messages.push(newMessage as Message)
        await user.save();
        return Response.json({
            success: false,
            message: "Message Sent Successfully"
        }, { status: 200 });

    } catch (error) {
        console.log("error while sending the message", error);
        return Response.json({
            success: false,
            message: "Error While Sending the message"
        }, { status: 400 });
    }
}
