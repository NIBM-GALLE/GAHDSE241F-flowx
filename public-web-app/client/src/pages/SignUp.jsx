import React, { useState } from "react";
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
import signUp from "../assets/Signup.png";

// Step 1 and Step 2 schema
const step1Schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(10, "Enter a valid phone number"),
  homeId: z.string().min(1, "Home ID is required"),
});

const step2Schema = z.object({
  address: z.string().min(1, "Address is required"),
  location: z.string().min(1, "Location is required"),
  district: z.string().min(1, "District is required"),
  divisionalSecretariat: z.string().min(1, "Divisional Secretariat is required"),
  gramaNiladari: z.string().min(1, "Grama Niladari Division is required"),
});

const formSchema = step1Schema.merge(step2Schema);

function SignUp() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      homeId: "",
      address: "",
      location: "",
      district: "",
      divisionalSecretariat: "",
      gramaNiladari: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Form Submitted:", data);
    // perform signup logic here
  };

  const handleNext = () => {
    const values = form.getValues();
    const result = step1Schema.safeParse(values);
    if (result.success) {
      setStep(2);
    } else {
      result.error.errors.forEach((error) => {
        form.setError(error.path[0], {
          message: error.message,
        });
      });
    }
  };

  return (
    <div className="min-h-screen grid sm:grid-cols-2 mx-auto justify-center items-center px-4">
      <div className="mx-auto hidden sm:block">
        <img src={signUp} alt="Sign Up" className="w-full h-full object-cover" />
      </div>

      <div className="mx-auto w-full max-w-md">
        <div className="text-center mb-6">
          <div className="flex justify-end">
            <ModeToggle />
          </div>
          <h1 className="font-purple-purse text-4xl mb-2">Welcome To FlowX!</h1>
          <h2 className="font-poppins text-2xl">Sign up to your account</h2>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {step === 1 && (
              <>
                {["firstName", "lastName", "email", "phone", "homeId"].map((fieldName) => (
                  <FormField
                    key={fieldName}
                    control={form.control}
                    name={fieldName}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{fieldName.replace(/([A-Z])/g, " $1")}</FormLabel>
                        <FormControl>
                          <Input placeholder={`Enter your ${fieldName}`} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <Button type="button" className="w-full" onClick={handleNext}>
                  Next
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                {["address", "location", "district", "divisionalSecretariat", "gramaNiladari"].map((fieldName) => (
                  <FormField
                    key={fieldName}
                    control={form.control}
                    name={fieldName}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{fieldName.replace(/([A-Z])/g, " $1")}</FormLabel>
                        <FormControl>
                          <Input placeholder={`Enter your ${fieldName}`} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}

                <div className="flex gap-4">
                  <Button type="button" variant="secondary" className="w-1/2" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button type="submit" variant="outline" className="w-1/2">
                    Sign Up
                  </Button>
                </div>
              </>
            )}
          </form>

          <div className="flex mt-5 gap-5 justify-between mb-4">
            <div className="flex">
              <div>Already a member?</div>
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
  );
}

export default SignUp;
