import React, { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ModeToggle } from "../components/ui/mode-toggle";
import LottieAnimation from "../../Lottie";
import signUp from "../assets/animation/signup.json";
import UserType from "@/components/UserType";

// Schema definitions
const adminSchema = z.object({
  nic: z.string().min(10, { message: "NIC must be at least 10 characters" }),
  firstname: z.string().min(1, { message: "First name is required" }),
  lastname: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
  address: z.string().min(1, { message: "Address is required" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Please confirm your password" }),
  securityCode: z.string().min(6, { message: "Security code is required" }),
}).superRefine(({ password, confirmPassword }, ctx) => {
  if (password !== confirmPassword) {
    ctx.addIssue({
      code: "custom",
      message: "Passwords don't match",
      path: ["confirmPassword"]
    });
  }
});

const governmentOfficerSchema = z.object({
  nic: z.string().min(10, { message: "NIC must be at least 10 characters" }),
  firstname: z.string().min(1, { message: "First name is required" }),
  lastname: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
  address: z.string().min(1, { message: "Address is required" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Please confirm your password" }),
  securityCode: z.string().min(6, { message: "Security code is required" }),
  divisional_secretariat_id: z.string().min(1, { message: "Secretariat is required" }),
  district_id: z.string().min(1, { message: "District is required" }),
}).superRefine(({ password, confirmPassword }, ctx) => {
  if (password !== confirmPassword) {
    ctx.addIssue({
      code: "custom",
      message: "Passwords don't match",
      path: ["confirmPassword"]
    });
  }
});

const gramaSevakaSchema = z.object({
  nic: z.string().min(10, { message: "NIC must be at least 10 characters" }),
  firstname: z.string().min(1, { message: "First name is required" }),
  lastname: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
  address: z.string().min(1, { message: "Address is required" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Please confirm your password" }),
  securityCode: z.string().min(6, { message: "Security code is required" }),
  grama_niladhari_division_id: z.string().min(1, { message: "Division is required" }),
  divisional_secretariat_id: z.string().min(1, { message: "Secretariat is required" }),
  district_id: z.string().min(1, { message: "District is required" }),
}).superRefine(({ password, confirmPassword }, ctx) => {
  if (password !== confirmPassword) {
    ctx.addIssue({
      code: "custom",
      message: "Passwords don't match",
      path: ["confirmPassword"]
    });
  }
});

function SignUp() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState(null);
  const [districts, setDistricts] = useState([]);
  const [divisionalSecretariats, setDivisionalSecretariats] = useState([]);
  const [gramaNiladhariDivisions, setGramaNiladhariDivisions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form
  const form = useForm({
    resolver: zodResolver(
      userType === "grama_sevaka" ? gramaSevakaSchema :
      userType === "government_officer" ? governmentOfficerSchema :
      adminSchema
    ),
    defaultValues: {
      nic: "",
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      address: "",
      password: "",
      confirmPassword: "",
      securityCode: "",
      district_id: "",
      divisional_secretariat_id: "",
      grama_niladhari_division_id: ""
    }
  });

  // Watch district and divisional secretariat changes
  const selectedDistrict = form.watch("district_id");
  const selectedDivisionalSecretariat = form.watch("divisional_secretariat_id");

  // Fetch districts on component mount
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await fetch('/api/districts');
        const data = await response.json();
        setDistricts(data);
      } catch (error) {
        console.error("Failed to fetch districts:", error);
      }
    };
    fetchDistricts();
  }, []);

  // Fetch divisional secretariats when district changes
  useEffect(() => {
    const fetchDivisionalSecretariats = async () => {
      if (!selectedDistrict) return;
      try {
        const response = await fetch(`/api/divisional-secretariats?district_id=${selectedDistrict}`);
        const data = await response.json();
        setDivisionalSecretariats(data);
        form.setValue("divisional_secretariat_id", "");
        form.setValue("grama_niladhari_division_id", "");
      } catch (error) {
        console.error("Failed to fetch divisional secretariats:", error);
      }
    };
    fetchDivisionalSecretariats();
  }, [selectedDistrict]);

  // Fetch grama niladhari divisions when divisional secretariat changes
  useEffect(() => {
    const fetchGramaNiladhariDivisions = async () => {
      if (!selectedDivisionalSecretariat) return;
      try {
        const response = await fetch(`/api/grama-niladhari-divisions?divisional_secretariat_id=${selectedDivisionalSecretariat}`);
        const data = await response.json();
        setGramaNiladhariDivisions(data);
        form.setValue("grama_niladhari_division_id", "");
      } catch (error) {
        console.error("Failed to fetch grama niladhari divisions:", error);
      }
    };
    fetchGramaNiladhariDivisions();
  }, [selectedDivisionalSecretariat]);

  const handleUserTypeSelect = (type) => {
    setUserType(type);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Remove confirmPassword before sending to backend
      const { confirmPassword, ...userData } = data;
      
      const endpoint = `/api/auth/register/${userType}`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const result = await response.json();
      console.log("Registration successful:", result);
      navigate("/signin");
    } catch (error) {
      console.error("Registration error:", error);
      // Handle error (show toast, etc.)
    } finally {
      setIsLoading(false);
    }
  };

  if (!userType) {
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
            <h2 className="font-poppins text-2xl">Sign up to your account</h2>
          </div>
          <div className="flex justify-center">
            <UserType onSelect={handleUserTypeSelect} />
          </div>
          <div className="flex mt-5 gap-5 justify-center mb-4">
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
          <h1 className="font-purple-purse text-4xl mb-2">
            Register as {userType.replace("_", " ")}
          </h1>
          <h2 className="font-poppins text-2xl">
            Please fill in your details
          </h2>
        </div>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Common fields for all user types */}
              <FormField
                control={form.control}
                name="nic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIC</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your NIC" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your first name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Security code field for all user types */}
              <FormField
                control={form.control}
                name="securityCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Security Code</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Enter security code" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* District dropdown for government officers and grama sevakas */}
              {(userType === "grama_sevaka" || userType === "government_officer") && (
                <FormField
                  control={form.control}
                  name="district_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>District</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select district" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {districts.map((district) => (
                            <SelectItem key={district.id} value={district.id}>
                              {district.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Divisional Secretariat dropdown */}
              {(userType === "grama_sevaka" || userType === "government_officer") && (
                <FormField
                  control={form.control}
                  name="divisional_secretariat_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Divisional Secretariat</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                        disabled={!selectedDistrict}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select divisional secretariat" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {divisionalSecretariats.map((secretariat) => (
                            <SelectItem key={secretariat.id} value={secretariat.id}>
                              {secretariat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Grama Niladhari Division dropdown (only for grama sevakas) */}
              {userType === "grama_sevaka" && (
                <FormField
                  control={form.control}
                  name="grama_niladhari_division_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grama Niladhari Division</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                        disabled={!selectedDivisionalSecretariat}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select grama niladhari division" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {gramaNiladhariDivisions.map((division) => (
                            <SelectItem key={division.id} value={division.id}>
                              {division.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Password fields */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Enter your password" 
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
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Confirm your password" 
                        {...field} 
                      />
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
                disabled={isLoading}
              >
                {isLoading ? "Registering..." : `Register as ${userType.replace("_", " ")}`}
              </Button>
            </form>
          </Form>

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
            <div
              className="cursor-pointer text-blue-500 hover:underline"
              onClick={() => setUserType(null)}
            >
              Change Role
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;