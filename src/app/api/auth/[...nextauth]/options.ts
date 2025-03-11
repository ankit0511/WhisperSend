
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db-Connect";
import { UserModel } from "@/models/User-model";


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "Enter Your Email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();


                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { userName: credentials.identifier }
                        ]
                    })

                    if (!user) {
                        throw new Error("No user Found with this Email Or UserName")
                    }

                    if (!user.isVerified) {
                        throw new Error("Please Verify Your Account First ")
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)

                    if (isPasswordCorrect) {
                        return user
                    } else {
                        throw new Error("Please Enter Valid Password")
                    }
                } catch (error: any) {
                    throw new Error(error)
                }
            }
        }),
//     //     GoogleProvider({
//     // clientId: process.env.GOOGLE_CLIENT_ID,
//     // clientSecret: process.env.GOOGLE_CLIENT_SECRET
//   })
    ],
    callbacks: {
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id?.toString()
                session.user.userName = token.userName
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessages = token.isAcceptingMessages
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString()
                token.userName = user.userName
                token.isVerified = user.isVerified
                token.isAcceptingMessages = user.isAcceptingMessages
            }
            return token
        },
        // async signIn({ account, profile }: { account?: Account; profile?: Profile }) {
        //     if (account?.provider === "google") {
        //       return profile?.email_verified && profile?.email?.endsWith("@gmail.com") || false;
        //     }
        //     return true;
        //   }
          
          
    },
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXT_AUTH_SECRET
}

