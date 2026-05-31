"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CalendarIcon,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

import { patientRegistrationFormSchema } from "@/lib/validators";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

type PatientFormValues = z.infer<typeof patientRegistrationFormSchema>;

const STEPS = ["Personal Info", "Address", "Review"];

export default function PatientRegisterPage() {
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientRegistrationFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      dob: undefined,
      address: "",
      city: "",
      state: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async (values: PatientFormValues) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          dob: format(values.dob, "yyyy-MM-dd"),
          role: "PATIENT",
        }),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.error?.message || "Registration failed");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = async () => {
    const fieldsToValidate: (keyof PatientFormValues)[] =
      step === 0
        ? ["fullName", "email", "phone", "password", "dob"]
        : step === 1
          ? ["address", "city", "state"]
          : [];

    if (await form.trigger(fieldsToValidate)) {
      setStep((currentStep) => currentStep + 1);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="py-12 text-center"
      >
        <CheckCircle className="mx-auto mb-6 h-16 w-16 text-success" />
        <h2 className="mb-3 text-2xl font-bold text-foreground">Registration Successful!</h2>
        <p className="mb-6 text-muted-foreground">
          Services will be available soon. We will notify you once operations begin.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-6 py-3 font-medium text-white"
        >
          Go to Login <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="mb-2 text-2xl font-bold text-foreground font-[family-name:var(--font-outfit)]">
        Patient Registration
      </h1>
      <p className="mb-6 text-muted-foreground">Create your account to join Mendyr</p>

      <div className="mb-8 flex items-center gap-2">
        {STEPS.map((label, index) => (
          <div key={label} className="flex flex-1 items-center gap-2">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
                index <= step ? "bg-gradient-primary text-white" : "bg-muted text-muted-foreground"
              )}
            >
              {index + 1}
            </div>
            <span
              className={cn(
                "hidden text-xs sm:block",
                index <= step ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {label}
            </span>
            {index < STEPS.length - 1 && (
              <div className={cn("h-px flex-1", index < step ? "bg-primary" : "bg-muted")} />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {step === 0 && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <FormControl>
                        <Input {...field} placeholder="Full name" className="h-12 rounded-xl pl-11" />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <FormControl>
                        <Input {...field} type="email" placeholder="you@example.com" className="h-12 rounded-xl pl-11" />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <FormControl>
                        <Input {...field} type="tel" placeholder="Phone number" className="h-12 rounded-xl pl-11" />
                      </FormControl>
                    </div>
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
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <FormControl>
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          className="h-12 rounded-xl pl-11 pr-11"
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowPassword((current) => !current)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <button
                            type="button"
                            className={cn(
                              "flex h-12 w-full items-center rounded-xl border border-white/60 bg-white/40 px-4 py-3 text-left text-sm shadow-sm backdrop-blur-md transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-white/10 dark:bg-black/20",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                            {field.value ? format(field.value, "PPP") : <span>Select a date</span>}
                          </button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto border border-white/40 bg-background/95 p-0 shadow-xl backdrop-blur-md" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
          )}

          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <FormControl>
                        <Input {...field} placeholder="Full address" className="h-12 rounded-xl pl-11" />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="City" className="h-12 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="State" className="h-12 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-3 rounded-xl border border-white/60 bg-white/40 p-6 text-sm shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-black/20"
            >
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Full Name</span>
                <span className="text-right text-foreground">{form.getValues("fullName")}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Email</span>
                <span className="text-right text-foreground">{form.getValues("email")}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Phone</span>
                <span className="text-right text-foreground">{form.getValues("phone")}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">DOB</span>
                <span className="text-right text-foreground">
                  {form.getValues("dob") ? format(form.getValues("dob"), "PPP") : ""}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Address</span>
                <span className="text-right text-foreground">{form.getValues("address")}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">City</span>
                <span className="text-right text-foreground">{form.getValues("city")}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">State</span>
                <span className="text-right text-foreground">{form.getValues("state")}</span>
              </div>
            </motion.div>
          )}

          <div className="mt-6 flex gap-3">
            {step > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep((currentStep) => currentStep - 1)}
                className="h-12 rounded-xl border-white/60 bg-white/40 text-foreground backdrop-blur-md hover:bg-white/60 dark:border-white/10 dark:bg-black/20 dark:hover:bg-black/40"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
            )}

            {step < 2 ? (
              <Button
                type="button"
                onClick={nextStep}
                className="h-12 flex-1 rounded-xl bg-gradient-primary text-white transition-opacity hover:opacity-90"
              >
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={loading}
                className="h-12 flex-1 rounded-xl bg-gradient-primary text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                {loading ? "Registering..." : "Complete Registration"}
              </Button>
            )}
          </div>
        </form>
      </Form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign In
        </Link>
      </p>
    </motion.div>
  );
}
