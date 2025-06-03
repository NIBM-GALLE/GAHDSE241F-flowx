import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
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

//google incon by react-icons
import { FcGoogle } from "react-icons/fc";

//lottie
import LottieAnimation from "../../Lottie";
import signInImage from "../assets/animation/signin.json";
import { useUserStore } from "../stores/useUserStore";


function SignIn() {
  const navigate = useNavigate();
  const { signIn } = useUserStore();
  const [role, setRole] = React.useState("");
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
  const onSubmit = async (data) => {
    if (!role) {
      alert("Please select a role");
      return;
    }
    try {
      await signIn({ ...data, role }, navigate);
    } catch (err) {
      alert(err.message || "Sign in failed");
    }
  };

  return (
    <div className="min-h-screen grid sm:grid-cols-2 mx-auto justify-center items-center px-4">
      <div className="mx-auto hidden sm:block">
        <LottieAnimation lotti={signInImage} width={400} height={400} />
      </div>

      <div className="mx-auto w-full max-w-md">
        <div className="text-center mb-6">
          <div className="flex">
            <ModeToggle />
          </div>
          <h1 className="font-purple-purse text-4xl mb-2">Welcome Back!</h1>
          <h2 className="font-poppins text-2xl ">
            Sign in to your account,
          </h2>
        </div>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block mb-1 font-medium">Role</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  required
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="government_officer">Government Officer</option>
                  <option value="grama_sevaka">Grama Sevaka</option>
                </select>
              </div>
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your Password" type="password" {...field} />
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
                SignIn
              </Button>
            </form>
            <div className="flex mt-5 gap-5 justify-between mb-4">
              <div className="flex">
                <div>Not a member ?</div>
                <div
                  className="ml-2 cursor-pointer hover:underline text-blue-500"
                  onClick={() => navigate("/signup")}
                >
                  Signup
                </div>
              </div>
              <div
                className="cursor-pointer text-red-400 hover:underline"
                onClick={() => navigate("/forget-password")}
              >
                Forget Password ?
              </div>
            </div>

            <div className="flex items-center justify-center w-full my-4">
              <span className="flex-1 border-t border-gray-300"></span>
              <span className="px-3 text-gray-500 text-sm">or</span>
              <span className="flex-1 border-t border-gray-300"></span>
            </div>

            <div className="flex justify-center w-full mb-4">
              <Button
                variant="outline"
                size="lg"
                className="w-full flex items-center justify-center gap-2"
              >
                <FcGoogle className="h-5 w-5" />
                Sign in with Google
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
