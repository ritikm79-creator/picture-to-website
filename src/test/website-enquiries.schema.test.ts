import { describe, expect, it } from "vitest";

import { websiteEnquirySchema } from "@/lib/website-enquiries.schema";

const validEnquiry = {
  name: "Asha Patel",
  phone: "9876543210",
  email: "asha@example.com",
  service: "IPO Updates" as const,
  message: "I would like to learn more.",
  consent: true as const,
  website: "",
};

describe("website enquiry validation", () => {
  it.each(["9876543210", "+919876543210"])("accepts an Indian mobile number: %s", (phone) => {
    expect(websiteEnquirySchema.safeParse({ ...validEnquiry, phone }).success).toBe(true);
  });

  it("rejects a phone number that is not ten Indian mobile digits", () => {
    expect(websiteEnquirySchema.safeParse({ ...validEnquiry, phone: "12345" }).success).toBe(false);
  });

  it("accepts a message of exactly 1,000 characters and rejects 1,001", () => {
    expect(
      websiteEnquirySchema.safeParse({ ...validEnquiry, message: "a".repeat(1000) }).success,
    ).toBe(true);
    expect(
      websiteEnquirySchema.safeParse({ ...validEnquiry, message: "a".repeat(1001) }).success,
    ).toBe(false);
  });

  it("requires permission to contact the visitor", () => {
    expect(websiteEnquirySchema.safeParse({ ...validEnquiry, consent: false }).success).toBe(false);
  });

  it("blocks the hidden honeypot when it contains a value", () => {
    expect(
      websiteEnquirySchema.safeParse({ ...validEnquiry, website: "spam" }).success,
    ).toBe(false);
  });
});