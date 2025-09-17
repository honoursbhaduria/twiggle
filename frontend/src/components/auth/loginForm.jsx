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


// schema
const loginSchema = z.object({
    email: z.string().email('please enter a valid email address'),
    password: z.string().min(6, 'password atleast 6 character long')
})

const LoginForm = () => {
    const [isLoading, setIsLoading] = useState(false)
    const { login } = useAuth()

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
        } catch (error) {
            console.log(error)
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
                            <FormLabel className="text-gray-500">
                                Email
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="Enter your email" {...field} />
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
                            <FormLabel className="text-gray-500">
                                Password
                            </FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="Enter your Password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full dark:bg-gray-400" disabled={isLoading}>
                    {isLoading ? 'Signing in..' : 'Sign In'}
                </Button>
            </form>
        </Form>
    )
}

export default LoginForm