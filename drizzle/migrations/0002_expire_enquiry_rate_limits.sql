CREATE INDEX website_enquiry_rate_limits_updated_at_idx ON public.website_enquiry_rate_limits (updated_at);
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
  DELETE FROM public.website_enquiry_rate_limits WHERE updated_at < now() - interval '48 hours';
  RETURN resulting_count <= _maximum_requests;
END;
$$;