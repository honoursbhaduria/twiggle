import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import LoginForm from "./loginForm"
import RegisterForm from "./RegisterForm"
import AnimatedSection from "../motion/animation"

const Auth = () => {
  const [activeTab, setActiveTab] = useState('login')
  
  return (
    <AnimatedSection>
    <div className="flex h-screen overflow-hidden ">
      {/* Left side - Form content */}
      <div className="w-full md:w-1/2 flex justify-center items-center p-5 overflow-y-auto">
        <div className="w-full max-w-md p-8 bg-white/95 backdrop-blur border border-[#fe6d3c]/30 rounded-2xl ">
          <h1 className="text-5xl text-center mb-2 text-[#fe6d3c] font-semibold tracking-tight">TWIGGLE</h1>
          <p className="text-center text-slate-600 mb-8">Welcome back! Plan your next adventure with ease.</p>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-6 w-full rounded-xl bg-[#fe6d3c]/20 border border-[#fe6d3c]/30 p-1">
              <TabsTrigger value="login" className="data-[state=active]:bg-[#fe6d3c] data-[state=active]:text-white data-[state=active]:shadow-[0_8px_20px_rgba(254,109,60,0.3)] text-[#fe6d3c] hover:text-[#fe6d3c]">
                Login
              </TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-[#fe6d3c] data-[state=active]:text-white data-[state=active]:shadow-[0_8px_20px_rgba(254,109,60,0.3)] text-[#fe6d3c] hover:text-[#fe6d3c]">
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
       
      </div>
    </div>
    </AnimatedSection>
  )
}

export default Auth




