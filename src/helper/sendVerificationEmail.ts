import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/apiResponse";




export async function SendVerificationEmail(
    email: string,
    userName: string,
    veryCode: string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: ['delivered@resend.dev'],
            subject: 'Hello world',
            react: VerificationEmail({ userName, otp: veryCode })
        });
        return {
            success: true,
            message: " Verifiaction Email Sent Successfully"
        }
    } catch (emailError) {
        console.log("Error sending Verification Email", emailError);
        return {
            success: false,
            message: "Error While Sending Verifiaction Email"
        }
    }
}