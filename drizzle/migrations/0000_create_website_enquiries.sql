CREATE TABLE public.website_enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  service text,
  message text NOT NULL,
  consent boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT website_enquiries_name_valid CHECK (char_length(trim(name)) BETWEEN 1 AND 100),
  CONSTRAINT website_enquiries_phone_valid CHECK (phone ~ '^(\+91)?[6-9][0-9]{9}$'),
  CONSTRAINT website_enquiries_email_valid CHECK (char_length(email) <= 254 AND email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'),
  CONSTRAINT website_enquiries_service_valid CHECK (service IS NULL OR service IN ('IPO Updates', 'Unlisted Shares', 'Forex Mentorship', 'Portfolio Management')),
  CONSTRAINT website_enquiries_message_valid CHECK (char_length(trim(message)) BETWEEN 1 AND 1000)
);
GRANT INSERT (name, phone, email, service, message, consent) ON TABLE public.website_enquiries TO anon;
GRANT ALL ON TABLE public.website_enquiries TO service_role;
ALTER TABLE public.website_enquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visitors can submit valid enquiries" ON public.website_enquiries FOR INSERT TO anon WITH CHECK (consent IS TRUE);