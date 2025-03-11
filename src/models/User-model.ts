
import mongoose, { Schema, Document } from "mongoose";

// Message Interface
export interface Message extends Document {
    content: string; // Fixed typo from "contant" to "content"
    createdAt: Date;
}

// Message Schema
const MessageSchema: Schema<Message> = new Schema({
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, required: true }
});

// User Interface
export interface User extends Document {
    userName: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean,
    isAcceptingMessage: boolean;
    messages: Message[]; // Fixed type
}

// User Schema
const UserSchema: Schema<User> = new Schema({
    userName: {
        type: String,
        unique: true,
        required: [true, "User Name is Required"]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email is Required"],
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please use a valid email"]
    },
    password: {
        type: String,
        required: true
    },
    verifyCode: {
        type: String,
        required: true
    },
    verifyCodeExpiry: {
        type: Date,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true
    },
    messages: [MessageSchema] // Nested array of messages
});

// // Exporting models
// export const MessageModel = mongoose.model<Message>("Message", MessageSchema);
// export const UserModel = mongoose.model<User>("User", UserSchema);

export const UserModel = (mongoose.models.User as mongoose.Model<User>)||mongoose.model<User>("User", UserSchema);
export const MessageModel = (mongoose.models.Message as mongoose.Model<Message>)||mongoose.model<Message>("Message", MessageSchema);