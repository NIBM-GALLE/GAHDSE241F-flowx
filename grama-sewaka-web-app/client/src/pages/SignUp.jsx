import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "../components/ui/mode-toggle";

//lottie
import LottieAnimation from "../../Lottie";
import signUp from "../assets/animation/signup.json";

function SignUp() {
  const navigate = useNavigate();
  // schema for form validation
  const formSchema = z.object({
    email: z.string().email({
      message: "Please enter a valid email address",
    }),
    password: z.string().min(4, {
      message: "Please enter your password",
    }),
  });

  //initialize the form with react-hook-form and zod
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  //handle submission
  const onSubmit = (data) => {
    console.log("Form Data:", data);
  };

  return (
    <div className="min-h-screen grid sm:grid-cols-2 mx-auto justify-center items-center px-4">
      <div className="mx-auto hidden sm:block">
        <LottieAnimation lotti={signUp} width={500} height={500} />
      </div>

      <div className="mx-auto w-full max-w-md">
        <div className="text-center mb-6">
          <div className="flex">
            <ModeToggle />
          </div>
          <h1 className="font-purple-purse text-4xl mb-2">Welcome To FlowX!</h1>
          <h2 className="font-poppins text-2xl ">
            Sign up to your account,
          </h2>
        </div>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="securityCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Security Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your Security Code" {...field} />
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
                      <Input placeholder="Enter your Password" {...field} />
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
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Confirm your Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
            />


              <Button
                type="submit"
                variant="outline"
                size="lg"
                className="w-full"
              >
                SignUp
              </Button>
            </form>
            <div className="flex mt-5 gap-5 justify-between mb-4">
              <div className="flex">
                <div>Already a member ?</div>
                <div
                  className="ml-2 cursor-pointer hover:underline text-blue-500"
                  onClick={() => navigate("/signin")}
                >
                  Signin
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
