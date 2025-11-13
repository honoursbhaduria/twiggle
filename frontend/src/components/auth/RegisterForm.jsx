"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

import { toast } from "sonner"
import { useAuth } from "../../hooks/useTravelApi"

const registerSchema = z.object({
  username: z.string().min(3, 'Name must be 3 characters long'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be 6 character long'),
  confirmPassword: z.string().min(6, 'Password must be 6 character long')
}).refine(data => data.password == data.confirmPassword, {
  message: 'Passowrd do not match',
  path: ['confirmPassword']
})

const RegisterForm = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { signup } = useAuth()

  // initialise form
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  })



  const onRegisterSubmit = async (values) => {
    setIsLoading(true)
    console.log(values);

    try {

      const result = await signup({
        username: values.username,
        email: values.email,
        password: values.password
      })
      toast.success('your account has been created successfully. pls sign in')

      if (onSuccess) {
        onSuccess()
      }
    } catch (e) {
      console.log(e)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onRegisterSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#fe6d3c] font-medium">
                Name
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your name"
                  className="border-[#fe6d3c]/40 focus-visible:border-[#fe6d3c] focus-visible:ring-[#fe6d3c]/40"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#fe6d3c] font-medium">
                Email
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your Email"
                  className="border-[#fe6d3c]/40 focus-visible:border-[#fe6d3c] focus-visible:ring-[#fe6d3c]/40"
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
              <FormLabel className="text-[#fe6d3c] font-medium">
                Passoword
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your Password"
                  className="border-[#fe6d3c]/40 focus-visible:border-[#fe6d3c] focus-visible:ring-[#fe6d3c]/40"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#fe6d3c] font-medium">
                Confirm Password
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your Password again"
                  className="border-[#fe6d3c]/40 focus-visible:border-[#fe6d3c] focus-visible:ring-[#fe6d3c]/40"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-[#fe6d3c] text-white font-semibold hover:bg-[#fe6d3c]"
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account..' : 'Create Account'}
        </Button>
      </form>
    </Form>
  )
}

export default RegisterForm




