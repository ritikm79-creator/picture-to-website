import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader, getRequestIP } from "@tanstack/react-start/server";

import { websiteEnquirySchema } from "@/lib/website-enquiries.schema";

const hourlyRequestLimit = 4;

async function hashVisitorAddress(address: string) {
  const encoder = new TextEncoder();
  const pepper = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  if (!pepper) throw new Error("Enquiry service is not configured.");

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(pepper),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const digest = await crypto.subtle.sign("HMAC", key, encoder.encode(address));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export const submitWebsiteEnquiry = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => websiteEnquirySchema.parse(input))
  .handler(async ({ data }) => {
    const address = getRequestHeader("cf-connecting-ip") || getRequestIP();
    if (!address) throw new Error("Enquiry could not be submitted. Please try again.");

    const now = Date.now();
    const bucketStart = new Date(Math.floor(now / 3_600_000) * 3_600_000).toISOString();
    const ipHash = await hashVisitorAddress(address);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: hasRequestSlot, error: limitError } = await supabaseAdmin.rpc(
      "claim_website_enquiry_slot",
      { _ip_hash: ipHash, _bucket_start: bucketStart, _maximum_requests: hourlyRequestLimit },
    );

    if (limitError) {
      console.error("Unable to check website enquiry submission limits.");
      throw new Error("Your enquiry could not be sent right now. Please try again shortly.");
    }

    if (!hasRequestSlot) {
      throw new Error("Please wait before sending another enquiry.");
    }

    const { error } = await supabaseAdmin.from("website_enquiries").insert({
      name: data.name,
      phone: data.phone,
      email: data.email,
      service: data.service,
      message: data.message,
      consent: data.consent,
    });

    if (error) {
      console.error("Unable to save a website enquiry.");
      throw new Error("Your enquiry could not be sent right now. Please try again shortly.");
    }

    return { success: true };
  });