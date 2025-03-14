'use client'
import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useDebounceCallback } from 'usehooks-ts'
import Link from 'next/link'
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import { userSingupVerifiction } from '@/schema/Signup-Schema'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/apiResponse'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 as Loader } from 'lucide-react';
import * as z from "zod"
const SigninPage = () => {
    const [userName, setUserName] = useState('');
    const [userNameMessage, setUserNameMessage] = useState("");
    const [isCheckingUserName, setIsCheckingUserName] = useState(false);
    const [isFormSubmitting, setIsFormSubmitting] = useState(false);

    const debounced = useDebounceCallback((value) => setUserName(value), 300);
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(userSingupVerifiction),
        defaultValues: {
            userName: "",
            email: "",
            password: ""
        }
    });

    useEffect(() => {
        const checkUserNameUnique = async () => {
            if (userName) {
                setIsCheckingUserName(true);
                setUserNameMessage('');
                try {
                    const { data } = await axios.get(`/api/check-userName-unique?userName=${userName}`);
                    setUserNameMessage(data.message);
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    setUserNameMessage(axiosError.response?.data.message || "Error checking username");
                } finally {
                    setIsCheckingUserName(false);
                }
            }
        };
        checkUserNameUnique();
    }, [userName]);

    const onSubmit = async (data: { userName: string; email: string; password: string }) => {
        setIsFormSubmitting(true);
        try {
            const response = await axios.post('/api/sign-up', data);
            console.log("the response coming from the backend",response);
                toast("Success", {
                    description: response.data.message,
                    style: { color: 'black' },
                });
            router.replace(`/verify-email/${userName}`);
        } catch (error) {
            console.log("the error is ", error)
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data.message || "Something went wrong";
            toast('Something Went Wrong While Signup', {
                description: errorMessage,
                style: { color: 'red' },
            });
        } finally {
            setIsFormSubmitting(false);
        }
    };

    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Join Wishper Send</h1>
                    <p className="mb-4">Sign Up to start your anonymous adventure</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                        <FormField
                            control={form.control}
                            name="userName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter Your User Name"
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                debounced(e.target.value);
                                            }}
                                        />
                                    </FormControl>
                                    {isCheckingUserName && <Loader className='mr-2 h-4 w-4 animate-spin' />}
                                    <p className={`text-sm ${userNameMessage === "UserName is Available" ? "text-green-500" : "text-red-500"}`}>
                                        {userNameMessage}
                                    </p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Your Email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type='password' placeholder="Enter Your Password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type='submit' disabled={isFormSubmitting}>
                            {isFormSubmitting ? (
                                <>
                                    <Loader className='mr-2 h-4 w-4 animate-spin' /> Please wait
                                </>
                            ) : (
                                'Signup'
                            )}
                        </Button>
                    </form>
                </Form>
                <div className="text-center mt-4">
                    <p>Already Registered{' '}
                        <Link href="/sign-in" className='text-black hover:text-gray-800'>
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SigninPage;