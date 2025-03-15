'use client'
import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Link from 'next/link'
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/apiResponse'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 as Loader } from 'lucide-react';
import * as z from "zod"
import { signinSchemaVerification } from '@/schema/SignIn-Schema'
import { signIn } from 'next-auth/react'
const SigninPage = () => {
   
     const [isFormSubmitting, setIsFormSubmitting] = useState(false);
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(signinSchemaVerification),
        defaultValues: {
            userName: "",
            password: ""
        }
    });

  
    const onSubmit = async (data: z.infer<typeof signinSchemaVerification>) => {
        setIsFormSubmitting(true);
        const result =    await signIn('credentials', {
          // these are the idetifiers 
          redirect:false,
          identifier:data.identifier,
          password: data.password
        })

        if(result?.error){
          toast("login Failed",{
            description:"Incorrect UserName Or Password",
          })
        }
        if(result?.url){
          router.replace('/dashboard')
        }

       
    };

    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Join Wishper Send</h1>
                    <p className="mb-4">Sign In to start your anonymous adventure</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                        <FormField
                            control={form.control}
                            name="identifier"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter Your User Name"
                                            {...field}
                                        />
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