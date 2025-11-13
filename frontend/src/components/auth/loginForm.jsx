"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { email, z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { toast } from "sonner"
import { useAuth } from "../../hooks/useTravelApi"
import { useNavigate } from "react-router-dom"


// schema
const loginSchema = z.object({
    email: z.string().email('please enter a valid email address'),
    password: z.string().min(6, 'password atleast 6 character long')
})


const LoginForm = () => {
    const [isLoading, setIsLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    // initialise form
    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const onLoginSubmit = async (values) => {
        setIsLoading(true)
        try {
            const result=await login({
                email : values.email,
                password : values.password
            })
            toast.success('Login successfully')
            
            // Check if there's an intended destination stored
            const intendedDestination = localStorage.getItem('intendedDestination')
            if (intendedDestination) {
                localStorage.removeItem('intendedDestination')
                navigate(intendedDestination)
            } else {
                navigate('/dashboard')
            }
        } catch (error) {
            console.log(error)
            toast.error('Login failed')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onLoginSubmit)} className="space-y-4">
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
                                  placeholder="Enter your email"
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
                                Password
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
                <Button
                  type="submit"
                  className="w-full bg-[#fe6d3c] text-white font-semibold hover:bg-[#fe6d3c]"
                  disabled={isLoading}
                >
                    {isLoading ? 'Signing in..' : 'Sign In'}
                </Button>
            </form>
        </Form>
    )
}

export default LoginForm




