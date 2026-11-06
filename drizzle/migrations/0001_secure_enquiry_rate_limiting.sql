CREATE TABLE public.website_enquiry_rate_limits (
  ip_hash text PRIMARY KEY,
  bucket_start timestamptz NOT NULL,
  request_count integer NOT NULL DEFAULT 1,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT website_enquiry_rate_limits_hash_valid CHECK (char_length(ip_hash) = 64),
  CONSTRAINT website_enquiry_rate_limits_count_valid CHECK (request_count >= 1)
);
GRANT ALL ON TABLE public.website_enquiry_rate_limits TO service_role;
ALTER TABLE public.website_enquiry_rate_limits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role manages website enquiry rate limits" ON public.website_enquiry_rate_limits FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE OR REPLACE FUNCTION public.claim_website_enquiry_slot(_ip_hash text, _bucket_start timestamptz, _maximum_requests integer)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  resulting_count integer;
BEGIN
  IF _ip_hash !~ '^[a-f0-9]{64}$' OR _maximum_requests < 1 THEN
    RETURN false;
  END IF;
  INSERT INTO public.website_enquiry_rate_limits (ip_hash, bucket_start, request_count, updated_at)
  VALUES (_ip_hash, _bucket_start, 1, now())
  ON CONFLICT (ip_hash) DO UPDATE
    SET bucket_start = EXCLUDED.bucket_start,
        request_count = CASE
          WHEN public.website_enquiry_rate_limits.bucket_start = EXCLUDED.bucket_start
            THEN public.website_enquiry_rate_limits.request_count + 1
          ELSE 1
        END,
        updated_at = now()
  RETURNING request_count INTO resulting_count;
  RETURN resulting_count <= _maximum_requests;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.claim_website_enquiry_slot(text, timestamptz, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_website_enquiry_slot(text, timestamptz, integer) TO service_role;
REVOKE INSERT ON TABLE public.website_enquiries FROM anon;
DROP POLICY "Visitors can submit valid enquiries" ON public.website_enquiries;