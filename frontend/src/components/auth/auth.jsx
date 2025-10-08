import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import LoginForm from "./loginForm"
import RegisterForm from "./RegisterForm"
import AnimatedSection from "../motion/animation"

const Auth = () => {
  const [activeTab, setActiveTab] = useState('login')
  
  return (
    <AnimatedSection>
    <div className="flex h-screen overflow-hidden">
      {/* Left side - Form content */}
      <div className="w-full md:w-1/2 flex justify-center items-center p-5 overflow-y-auto">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg border">
          <h1 className="text-5xl text-center mb-2  text-black font-normal ">TWIGLE</h1>
          <p className="text-center text-gray-700 mb-8">Welcome Back! Please enter your details</p>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-6 w-full">
              <TabsTrigger value="login" className="data-[state=active]:bg-black data-[state=active]:text-white">
                Login
              </TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-black data-[state=active]:text-white">
                Register
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            <TabsContent value="register">
              <RegisterForm onSuccess={() => setActiveTab('login')} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden md:block md:w-1/2 h-screen relative">
        <img
          src="/authbg.jpg"
          alt="auth background"
          className="h-full w-full object-cover absolute inset-0"
        />
        {/* Optional overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
    </div>
    </AnimatedSection>
  )
}

export default Auth