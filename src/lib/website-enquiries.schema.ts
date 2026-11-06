import { z } from "zod";

export const websiteEnquiryServices = [
  "IPO Updates",
  "Unlisted Shares",
  "Forex Mentorship",
  "Portfolio Management",
] as const;

export const websiteEnquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Please enter your full name.")
    .max(100, "Please keep your name under 100 characters."),
  phone: z
    .string()
    .trim()
    .regex(/^(?:\+91)?[6-9]\d{9}$/, "Enter a valid Indian mobile number, with or without +91."),
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email address.")
    .email("Enter a valid email address.")
    .max(254, "Please enter an email address under 255 characters."),
  service: z.enum(websiteEnquiryServices).nullable(),
  message: z
    .string()
    .trim()
    .min(1, "Please tell us a little about your enquiry.")
    .max(1000, "Please keep your message under 1,000 characters."),
  consent: z.literal(true, {
    error: "Please agree to being contacted about your enquiry.",
  }),
  website: z.string().max(0, "Please leave this field blank.").default(""),
});

export type WebsiteEnquiry = z.infer<typeof websiteEnquirySchema>;