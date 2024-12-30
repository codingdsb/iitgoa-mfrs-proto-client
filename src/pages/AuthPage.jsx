import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import * as constants from "@/constants.json";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/store";

const AuthPage = () => {
  const { toast } = useToast();
  const { login } = useStore();
  const navigate = useNavigate();
  // Register form details
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  });

  // handle register
  const handleRegister = async () => {
    try {
      const response = await axios.post(`${constants.API_URL}/auth/signup`, {
        name: registerName,
        email: registerEmail+"@iitgoa.ac.in",
        password: registerPassword,
      });
      const token = response.data.data.token;

      login({
        name: registerName,
        email: registerEmail + "@iitgoa.ac.in",
        isAdmin: false,
        isSuperAdmin: false,
      });
      localStorage.setItem("token", token);
      navigate("/");
      toast({
        title: "Success",
        description: response.data.message ,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response.data.message || JSON.stringify(error),
        variant: "destructive",
      });
    }
  };

  // Login form details
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // handle login
  const handleLogin = async () => {
    try {
      const response = await axios.post(`${constants.API_URL}/auth/signin`, {
        email: loginEmail + "@iitgoa.ac.in",
        password: loginPassword,
      });
      const token = response.data.data.token;
      const userResponse = await axios.get(`${constants.API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      login({
        name: userResponse.data.data.name,
        email: userResponse.data.data.email,
        isAdmin: userResponse.data.data.is_admin,
        isSuperAdmin: userResponse.data.data.is_super_admin,
      });

      localStorage.setItem("token", token);
      navigate("/");
      toast({
        title: "Success",
        description: response.data.message,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response.data.message || JSON.stringify(error),
        variant: "destructive",
      });
    }
  };

  return (
    <div className='flex h-screen flex-col items-center justify-center space-y-6 auth_page'>
      <div className="flex border border-gray-200 p-3 shadow rounded-xl w-[90%]  min-w-[300px] max-w-[400px] items-center justify-between" style={{background:"white"}}>
      <img src='/logo.jpeg' style={{height:"70px"}}/>
      <div className="">
      <p className='text-4xl w-[100%] text-right'>
        MFRS
      </p>
      <p className='text-3sm' style={{color:"gray"}}>
        Mess Food Review System
      </p>
      </div>
      </div>
      <Tabs
        defaultValue='login'
        className='w-[90%] min-w-[300px] max-w-[400px]'
      >
        {/* Tablist start */}

        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger className='' value='register'>
            Register
          </TabsTrigger>
          <TabsTrigger value='login'>Login</TabsTrigger>
        </TabsList>

        {/* Tablist End */}

        {/* Register form card start */}

        <TabsContent value='register'>
          <Card>
            <CardHeader>
              <CardTitle>Register</CardTitle>
              <CardDescription>
                Create your account now and join the mess forum of IIT Goa!
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-2'>
              <Input
                type='text'
                placeholder='Enter your full name'
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
              />

              <div className='flex justify-center items-center'>
                <Input
                  type='text'
                  placeholder='Email Address'
                  value={registerEmail}
                  style={{borderRadius: "0.5rem 0 0 0.5rem",borderRight:"none"}}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                />
                <span className="border border-gray-300 rounded-md p-[0.46rem] bg-gray-200 text-gray-600 text-sm" style={{borderRadius: "0 0.5rem 0.5rem 0 ",borderLeft:"none"}}>@iitgoa.ac.in</span>
              </div>

              <Input
                type='password'
                placeholder='Create a password'
                value={registerPassword}
                style={{marginBottom:"1rem"}}
                onChange={(e) => setRegisterPassword(e.target.value)}
              />
              <Button  onClick={handleRegister}>Signup</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Register form card end */}

        {/* Login form card start */}

        <TabsContent value='login'>
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Enter your credentials</CardDescription>
            </CardHeader>
            <CardContent className='space-y-2'>
              <div className='flex justify-center items-center'>
                <Input
                  type='text'
                  placeholder='Email Address'
                  style={{borderRadius: "0.5rem 0 0 0.5rem",borderRight:"none"}}
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              <span className="border border-gray-300 rounded-md p-[0.44rem] bg-gray-200 text-gray-600 text-sm" style={{borderRadius: "0 0.5rem 0.5rem 0 ",borderLeft:"none"}}>@iitgoa.ac.in</span>
              </div>
              <Input
                type='password'
                placeholder='Enter your password'
                value={loginPassword}
                style={{marginBottom:"1rem"}}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
              <Button onClick={handleLogin}>Login</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Login form card end */}
      </Tabs>
    </div>
  );
};

export default AuthPage;
