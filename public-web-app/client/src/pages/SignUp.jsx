import React, { useState, useEffect } from "react";
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
import signUpImage from "../assets/Signup.png";
import { useUserStore } from "../stores/useUserStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FiEye, FiEyeOff } from "react-icons/fi";

//user details and password
const step1Schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(10, "Enter a valid phone number"),
  homeId: z.string().min(1, "Home ID is required"),
  password: z.string().min(6, "Password is required and must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

//address and area details
const step2Schema = z.object({
  address: z.string().min(1, "Address is required"),
  members: z.string().min(1, "Members is required"),
  distance_to_river: z.string().min(1, "Distance to river is required"),
  district_id: z.string().min(1, "District is required"),
  divisional_secretariat_id: z.string().min(1, "Divisional Secretariat is required"),
  grama_niladhari_division_id: z.string().min(1, "Grama Niladhari Division is required"),
});

function SignUp() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const { signUp } = useUserStore();
  const [districts, setDistricts] = useState([]);
  const [divSecs, setDivSecs] = useState([]);
  const [gnDivs, setGnDivs] = useState([]);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  //form for user details
  const step1Form = useForm({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      homeId: "",
      password: "",
      confirmPassword: "",
    },
  });

  //form for address/area
  const step2Form = useForm({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      address: "",
      members: "",
      distance_to_river: "",
      district_id: "",
      divisional_secretariat_id: "",
      grama_niladhari_division_id: "",
    },
  });

  //fetch districts
  useEffect(() => {
    fetch("/api/area/districts")
      .then(res => res.json())
      .then(data => setDistricts(data.data || []));
  }, []);

  //fetch divisional secretariats when district changes
  const watchedDistrictId = step2Form.watch("district_id");
  useEffect(() => {
    if (!watchedDistrictId) return;
    fetch(`/api/area/divisional-secretariats?district_id=${watchedDistrictId}`)
      .then(res => res.json())
      .then(data => setDivSecs(data.data || []));
  }, [watchedDistrictId]);

  //fetch GN divisions when DS changes
  const watchedDivSecId = step2Form.watch("divisional_secretariat_id");
  useEffect(() => {
    if (!watchedDivSecId) return;
    fetch(`/api/area/grama-niladhari-divisions?divisional_secretariat_id=${watchedDivSecId}`)
      .then(res => res.json())
      .then(data => setGnDivs(data.data || []));
  }, [watchedDivSecId]);

  const handleStep1Submit = () => {
    setStep(2);
  };

  const handleStep2Submit = async (values) => {
    try {
      const step1Values = step1Form.getValues();
      const payload = {
        ...step1Values,
        ...values,
        houseId: step1Values.homeId,
        members: Number(values.members),
        distance_to_river: Number(values.distance_to_river),
      };
      //remove homeId from payload if backend does not expect it
      delete payload.homeId;
      await signUp(payload, navigate);
    } catch (err) {
      alert(err.message || "Sign up failed");
    }
  };

  return (
    <div className="min-h-screen grid sm:grid-cols-2 mx-auto justify-center items-center px-4">
      <div className="mx-auto hidden sm:block">
        <img src={signUpImage} alt="Sign Up" className="w-full h-full object-cover" />
      </div>
      <div className="mx-auto w-full max-w-md">
        <div className="text-center mb-6">
          <div className="flex justify-end">
            <ModeToggle />
          </div>
          <h1 className="font-purple-purse text-4xl mb-2">Welcome To FlowX!</h1>
          <h2 className="font-poppins text-2xl">Sign up to your account</h2>
        </div>
        {step === 1 && (
          <Form {...step1Form}>
            <form onSubmit={step1Form.handleSubmit(handleStep1Submit)} className="space-y-6">
              {['firstName', 'lastName', 'email', 'phone', 'homeId', 'password', 'confirmPassword'].map((fieldName) => (
                <FormField
                  key={fieldName}
                  control={step1Form.control}
                  name={fieldName}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{fieldName.replace(/([A-Z])/g, ' $1')}</FormLabel>
                      <FormControl>
                        {fieldName.toLowerCase().includes('password') ? (
                          <div className="relative">
                            <Input
                              placeholder={`Enter your ${fieldName}`}
                              type={fieldName === 'password' ? (showPassword ? 'text' : 'password') : (fieldName === 'confirmPassword' ? (showConfirmPassword ? 'text' : 'password') : 'text')}
                              {...field}
                            />
                            <button
                              type="button"
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              tabIndex={-1}
                              onClick={() => fieldName === 'password' ? setShowPassword((v) => !v) : setShowConfirmPassword((v) => !v)}
                            >
                              {fieldName === 'password'
                                ? (showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />)
                                : (showConfirmPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />)
                              }
                            </button>
                          </div>
                        ) : (
                          <Input
                            placeholder={`Enter your ${fieldName}`}
                            {...field}
                            type="text"
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button type="submit" className="w-full">Next</Button>
            </form>
          </Form>
        )}
        {step === 2 && (
          <Form {...step2Form}>
            <form onSubmit={step2Form.handleSubmit(handleStep2Submit)} className="space-y-6">
              {/* address/area fields */}
              <FormField control={step2Form.control} name="address" render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl><Input placeholder="Enter your address" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={step2Form.control} name="members" render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Members</FormLabel>
                  <FormControl><Input type="number" placeholder="Number of members" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={step2Form.control} name="distance_to_river" render={({ field }) => (
                <FormItem>
                  <FormLabel>Distance to River (meters)</FormLabel>
                  <FormControl><Input type="number" placeholder="Distance to river" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={step2Form.control} name="district_id" render={({ field }) => (
                <FormItem>
                  <FormLabel>District</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select district" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {districts.map(d => (
                        <SelectItem key={d.district_id} value={String(d.district_id)}>{d.district_name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={step2Form.control} name="divisional_secretariat_id" render={({ field }) => (
                <FormItem>
                  <FormLabel>Divisional Secretariat</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={!step2Form.watch("district_id")}> 
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select DS" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {divSecs.map(ds => (
                        <SelectItem key={ds.divisional_secretariat_id} value={String(ds.divisional_secretariat_id)}>{ds.divisional_secretariat_name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={step2Form.control} name="grama_niladhari_division_id" render={({ field }) => (
                <FormItem>
                  <FormLabel>Grama Niladhari Division</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={!step2Form.watch("divisional_secretariat_id")}> 
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select GN Division" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {gnDivs.map(gn => (
                        <SelectItem key={gn.grama_niladhari_division_id} value={String(gn.grama_niladhari_division_id)}>{gn.grama_niladhari_division_name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="flex gap-4">
                <Button type="button" variant="secondary" className="w-1/2" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button type="submit" variant="outline" className="w-1/2">
                  Sign Up
                </Button>
              </div>
            </form>
          </Form>
        )}
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
      </div>
    </div>
  );
}

export default SignUp;
