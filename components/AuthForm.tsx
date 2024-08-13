'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import CustomInput from './CustomInput'
import { authFormSchema } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getLoggedInUser, signIn, signUp } from '@/lib/actions/user.action'



const AuthForm = ({type}: {type : string}) => {
    const [user, setUser] = useState(null)
    const [isLoading,setIsLoading] = useState(false);

    const formSchema = authFormSchema(type);

    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password:"",
    },
  })
 
  // 2. Define a submit handler.
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    try {
      // sign up with appWrite & create a plaid link token 
      if(type === 'Sign-Up'){
        const newUser = await signUp(data)
        setUser(newUser)
      }
      if(type === 'Sign-In'){
        const response = await signIn({
          email: data.email,
          password: data.password,
        })
        if(response) {
          router.push('/')
        }
      }
    } catch (error) {
      console.log(error)
    }finally{
      setIsLoading(false)
    }
  }
  return (
    <section className='auth-form'>
        <header className='flex flex-col gap-5 md:gap-8'>
            <Link href='/' className='flex cursor-pointer items-center gap-1'>
                <Image
                    src='/icons/logo.svg'
                    width={34}
                    height={34}
                    alt='horizon logo'
                />
                <h1 className='text-26 font-ibm-plex-serif font-bold text-black-1'>Horizon</h1>
            </Link>
            <div className='flex flex-col gap-1 md:gap-3'>
                <h1 className='text-24 lg:text-36 font-semibold text-gray-900'>{user ? 'Link Account': type === 'Sign-In' ? 'Sign-In' : 'Sign-Up'}</h1>
                <p className='text-16 font-normal text-gray-600'>
                    {user ? 'Link Your Account' : 'Pleas Enter Your Details'}
                </p>
            </div>
        </header>
        {user ? (
            <div className='flex flex-col gap-4'> 
                    {/*plaidLink  */}
            </div>
        ):(
            <>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                      {type === 'Sign-Up' && (
                        <>

                          <div className='flex gap-4'>
                            <CustomInput control={form.control} label='First Name' name='firstName' placeholder='ex: John' />
                            <CustomInput control={form.control} label='Last Name' name='lastName' placeholder='ex: Doe' />
                          </div>

                          <CustomInput control={form.control} label='Address' name='address1' placeholder='Enter your specific Address' />
                          <CustomInput control={form.control} label='City' name='city' placeholder='Enter your specific Address' />

                          <div className='flex gap-4'>
                            <CustomInput control={form.control} label='State' name='state' placeholder='ex:NY' />
                            <CustomInput control={form.control} label='Postal Code' name='postalCode' placeholder='ex: 1110' />
                          </div>

                          <div className='flex gap-4'>
                            <CustomInput control={form.control} label='Date of Birth' name='dob' placeholder='yyyy-mm-dd' />
                            <CustomInput control={form.control} label='SSN' name='ssn' placeholder='ex: 1234' />
                          </div>
                        </>
                      )}
                    <CustomInput control={form.control} label='Email' name='email' placeholder='Please enter your email' />
                    <CustomInput control={form.control} label='Password' name='password' placeholder='Please enter your password' />  
                  <div className='flex flex-col gap-4'>
                    <Button type="submit" className='form-btn' disabled={isLoading}>{isLoading ? (
                      <>
                        <Loader2 size={20} className='animation-spin'/> &nbsp;
                        Loading...
                      </>
                    ):(
                      type === 'Sign-In' ? 'Sign-In' : 'Sign-Up'
                    )}</Button>
                  </div>
                </form>
              </Form>
              <footer className='flex justify-center gap-1'>
                  <p className='text-14 font-normal text-gray-600'>
                    {
                      type === 'Sign-In'? 'Don\'t have an account?' : 'Already have an account?'
                    }
                  </p>
                  <Link className='form-link' href={type=== 'Sign-In' ? '/sign-up' : '/sign-in'}>
                    {type === 'Sign-In' ? 'Sign-Up' : 'Sign-In'}
                  </Link>
              </footer>
            </>
        )}
    </section>
  )
}

export default AuthForm