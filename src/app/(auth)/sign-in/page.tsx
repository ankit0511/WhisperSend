'use client'
import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
// different Syntax
import * as z from "zod"

import { useDebounceValue } from 'usehooks-ts'

import Link from 'next/link'

import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import { userSingupVerifiction } from '@/schema/Signup-Schema'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/apiResponse'
const SigninPage = () => {
  // we are going to use concept of debouncing here  Debouncing here 
  const [userName, setUserName] = useState('');
  // userName Message : - this will show the message to the uset that userName he/she entred is availabe or not 
  const [userNameMessage, setUserNameMessage] = useState("");
  // this is the loading state
  const [isCheckingUserName, setIsCheckingUserName] = useState(false);
  // here we are making the submitting state of the form 
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const debouncedUserName = useDebounceValue(userName, 3000);
  const router = useRouter();


  // zod implmemtation 

  const form = useForm({
    resolver: zodResolver(userSingupVerifiction),
    defaultValues: {
      userName: "",
      email: "",
      password: ""
    }
  })

  // we are using useEffect to ckeck userName here 
  useEffect(() => {
    const checkUserNameUnique = async () => {
      if (debouncedUserName) {
        setIsCheckingUserName(true);
        setUserNameMessage('')
      }
      try {
        const userMessage = axios.get(`/api/check-userName-unique?userName = ${debouncedUserName}`)
        setUserNameMessage((await userMessage).data.message)
      } catch (error) {
        console.log("Error While Fetchign the UserName ", error)
        const axiosError = error as AxiosError<ApiResponse>
        setUserNameMessage(axiosError.response?.data.message)
      }
      finally { setIsCheckingUserName(false) }
    }
    checkUserNameUnique();
  }, [debouncedUserName])

  
  return (
    <div>page</div>
  )
}

export default SigninPage