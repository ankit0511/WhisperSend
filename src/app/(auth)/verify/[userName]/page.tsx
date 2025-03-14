"use client"
import { verifySchema } from '@/schema/Verify-Schema';
import { ApiResponse } from '@/types/apiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

const VerifyEmail = () => {
  const [otpVeryfying, setOtpVeryfying] = useState(false);
  const router = useRouter();
  const params = useParams();

  const form = useForm({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setOtpVeryfying(true);
    try {
      const response = await axios.post("/api/verify-email", {
        userName: params.userName,
        code: data.code,
      });

      toast.success('Success', {
        description: response.data.message,
      });

      router.replace('/sign-in');
    } catch (error) {
      console.error('The error occurred while verifying the OTP:', error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data?.message || 'An unexpected error occurred. Please try again.';
      toast.error('Verification Failed', {
        description: errorMessage,
      });
    } finally {
      setOtpVeryfying(false);
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
        <div className='text-center'>
          <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>Verify Your Account</h1>
          <p className='mb-4'>Enter the verification code that we sent you on your email</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='code'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter OTP</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter OTP' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <button
              className={`py-2 px-4 bg-black text-white font-semibold rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 ${
                otpVeryfying ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              type='submit'
              disabled={otpVeryfying}
            >
              {otpVeryfying ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
                </>
              ) : (
                'Verify OTP'
              )}
            </button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default VerifyEmail;