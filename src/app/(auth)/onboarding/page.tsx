"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useAuth } from "@/hooks/use-auth";
import { markOnboardingComplete } from "@/lib/onboarding";
import { ROLE_DASHBOARD_PATH, type Role } from "@/lib/mock-users";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const onboardingSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]),
  phone: z.string().min(10, "Enter a valid phone number").max(15),
});

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

// Shown once, right after login, so a first-time user has a profile to work
// with. There's no backend yet, so this just saves to localStorage — see
// src/lib/onboarding.ts — and drops the user into their role dashboard.
export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const role = (user?.role as Role) || null;

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: { fullName: "", dateOfBirth: "", gender: "PREFER_NOT_TO_SAY", phone: "" },
    mode: "onTouched",
  });

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    form.reset({
      fullName: user.fullName || "",
      dateOfBirth: "",
      gender: "PREFER_NOT_TO_SAY",
      phone: user.phone || "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user, router]);

  const onSubmit = (values: OnboardingFormValues) => {
    if (!role) return;
    setSubmitting(true);
    markOnboardingComplete(role, values);
    router.push(ROLE_DASHBOARD_PATH[role]);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="mb-2 text-2xl font-bold text-foreground font-[family-name:var(--font-outfit)]">
        Tell us about yourself
      </h1>
      <p className="mb-8 text-muted-foreground">A few quick details to finish setting up your account.</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Jane Doe" className="h-12 rounded-xl" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" className="h-12 rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 w-full rounded-xl">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PREFER_NOT_TO_SAY">Prefer not to say</SelectItem>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input {...field} type="tel" placeholder="+91 98765 43210" className="h-12 rounded-xl" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            disabled={submitting}
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
            {submitting ? "Saving..." : "Continue"}
          </Button>
        </form>
      </Form>
    </motion.div>
  );
}
