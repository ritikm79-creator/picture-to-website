import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { type FormEvent, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronDown,
  CircleCheck,
  Coins,
  FileText,
  Globe2,
  LineChart,
  MessageCircle,
  Menu,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { businessConfig, getWhatsAppLink } from "@/lib/business-config";
import { submitWebsiteEnquiry } from "@/lib/website-enquiries.functions";
import { websiteEnquirySchema, websiteEnquiryServices } from "@/lib/website-enquiries.schema";
import cityAtNight from "@/assets/money-talks-market-city.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Money Talks | IPO Updates, Unlisted Shares, Forex & Portfolio Management" },
      {
        name: "description",
        content:
          "Explore IPO updates, unlisted shares information, forex trading mentorship, and portfolio management guidance with Money Talks.",
      },
      {
        property: "og:title",
        content: "Money Talks | IPO Updates, Unlisted Shares, Forex Mentorship & Portfolio Management",
      },
      {
        property: "og:description",
        content:
          "Clearer financial insights, educational market guidance, and personalised support from Money Talks.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

const services = [
  {
    number: "01",
    title: "IPO Updates",
    eyebrow: "PRIMARY MARKETS",
    description:
      "Stay informed about upcoming IPOs, key dates, subscription updates, and listing developments.",
    icon: FileText,
  },
  {
    number: "02",
    title: "Unlisted Shares",
    eyebrow: "BEFORE THE LISTING",
    description:
      "Understand unlisted companies, their fundamentals, and the opportunities and risks to consider.",
    icon: BarChart3,
  },
  {
    number: "03",
    title: "Forex Mentorship",
    eyebrow: "EDUCATION FIRST",
    description:
      "Build your understanding of currency markets, technical analysis, and thoughtful risk management.",
    icon: Globe2,
    note: "Educational information only. Trading forex carries a risk of loss.",
  },
  {
    number: "04",
    title: "Portfolio Management",
    eyebrow: "PERSONALISED SUPPORT",
    description:
      "Discuss investment objectives, asset allocation, and ongoing portfolio considerations.",
    icon: LineChart,
    note: "Subject to applicable regulatory authorisation and suitability.",
  },
];

const reasons = [
  {
    title: "Professional guidance",
    description: "A considered conversation, grounded in your questions.",
    icon: ShieldCheck,
  },
  {
    title: "Relevant market insights",
    description: "Understand what is happening and the context behind it.",
    icon: LineChart,
  },
  {
    title: "A transparent approach",
    description: "Clear communication about services, considerations, and risks.",
    icon: Sparkles,
  },
  {
    title: "Support that listens",
    description: "An open conversation tailored to what you want to learn.",
    icon: MessageCircle,
  },
  {
    title: "Multiple areas of expertise",
    description: "Explore four financial topics in one place.",
    icon: Coins,
  },
];

const steps = [
  ["01", "Explore services", "Find the financial topics you would like to discuss."],
  ["02", "Send an enquiry", "Share a few details through the secure enquiry form."],
  ["03", "Discuss your needs", "Tell us what you want to understand or explore."],
  ["04", "Understand your options", "Get information about eligibility, fees, and relevant risks."],
];

type EnquiryFields = {
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  consent: boolean;
  website: string;
};

type LegalDocument = "privacy" | "terms" | "risk" | null;

const legalContent = {
  privacy: {
    title: "Privacy notice",
    description:
      "The enquiry form collects your name, phone number, email address, selected topic, and message. Money Talks uses these details to review and respond to your enquiry. Enquiries are stored privately; visitors cannot view or change other people's submissions. You can contact Money Talks to ask about your enquiry details.",
  },
  terms: {
    title: "Terms and conditions",
    description:
      "The information on this website introduces Money Talks and its financial information and education services. Before proceeding with a service, discuss its scope, eligibility, applicable regulatory authorisation, any fees, and relevant risks directly with the business.",
  },
  risk: {
    title: "Financial risk disclosure",
    description:
      "Investing in shares, unlisted securities, and foreign-exchange trading involves risk and may result in the loss of capital. Educational information does not guarantee an outcome or constitute a promise of returns. Consider your circumstances, eligibility, the service's applicable authorisation, and all associated fees and risks before proceeding.",
  },
} as const;

const initialFields: EnquiryFields = {
  name: "",
  phone: "",
  email: "",
  service: "",
  message: "",
  consent: false,
  website: "",
};

function AppWordmark({ compact = false }: { compact?: boolean }) {
  return (
    <a aria-label="Money Talks, home" className="wordmark" href="#home">
      <span className="brand-symbol" aria-hidden="true">
        <svg viewBox="0 0 46 46" fill="none">
          <path d="m6 35 11-24 10 16 8-10 6 18" />
          <path d="M15 35h22M11 28l9-9 7 10 8-9" />
          <circle cx="37" cy="15" r="3" />
        </svg>
      </span>
      <span className="wordmark-copy">
        <span className="wordmark-name">{businessConfig.name}</span>
        {!compact && <span className="wordmark-caption">INSIGHT · CLARITY · GROWTH</span>}
      </span>
    </a>
  );
}

function ChartArtwork() {
  const candles = [
    [66, 115, 26, 34],
    [104, 103, 34, 22],
    [143, 93, 24, 27],
    [181, 83, 40, 24],
    [222, 88, 25, 38],
    [262, 63, 35, 28],
    [303, 52, 24, 23],
    [342, 44, 37, 25],
    [382, 30, 26, 22],
    [421, 37, 36, 32],
  ] as const;

  return (
    <svg aria-label="Illustrative financial market chart" className="chart-art" viewBox="0 0 500 250">
      <g className="chart-grid">
        <path d="M34 38h436M34 86h436M34 134h436M34 182h436M34 230h436" />
        <path d="M72 20v210M160 20v210M248 20v210M336 20v210M424 20v210" />
      </g>
      <path d="m38 192 48-8 40 10 43-36 42 12 43-56 39 18 44-48 37 20 53-63" className="chart-line chart-line-faint" />
      <path d="m38 177 45-8 44 9 44-32 42 9 40-46 38 14 45-43 38 17 55-55" className="chart-line" />
      {candles.map(([x, top, height, body], index) => (
        <g key={x} className={index === 4 ? "candle candle-soft" : "candle"}>
          <path d={`M${x + 9} ${top - 11}v${height + 24}`} />
          <rect x={x} y={top} width="18" height={body} rx="2" />
        </g>
      ))}
      <circle cx="472" cy="19" r="4" className="chart-point" />
    </svg>
  );
}

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="section-heading">
      <p className="eyebrow"><span />{eyebrow}</p>
      <h2>{title}</h2>
      {description && <p className="section-intro">{description}</p>}
    </div>
  );
}

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLegalDocument, setActiveLegalDocument] = useState<LegalDocument>(null);
  const [fields, setFields] = useState(initialFields);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const submitEnquiry = useServerFn(submitWebsiteEnquiry);
  const whatsappLink = getWhatsAppLink();

  function updateField(field: keyof EnquiryFields, value: string | boolean) {
    setFields((previous) => ({ ...previous, [field]: value }));
    setFieldErrors((previous) => ({ ...previous, [field]: "" }));
    if (status !== "idle") setStatus("idle");
  }

  function chooseService(title: string) {
    setFields((previous) => ({ ...previous, service: title }));
    setFieldErrors((previous) => ({ ...previous, service: "" }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const result = websiteEnquirySchema.safeParse({
      ...fields,
      service: fields.service || null,
      consent: fields.consent,
    });

    if (!result.success) {
      setFieldErrors(
        Object.fromEntries(
          Object.entries(result.error.flatten().fieldErrors).map(([field, messages]) => [
            field,
            messages?.[0] ?? "Please check this field.",
          ]),
        ),
      );
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    setStatus("submitting");
    setFieldErrors({});

    try {
      const response = await submitEnquiry({ data: result.data });
      if (response.success) {
        setFields(initialFields);
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const navLinks = [
    ["Features", "services"],
    ["About", "about"],
    ["Market", "approach"],
    ["Contact", "contact"],
  ] as const;

  return (
    <main>
      <header className="site-header">
        <nav aria-label="Main navigation" className="nav-shell container">
          <AppWordmark />
          <div className={`nav-links ${menuOpen ? "nav-links-open" : ""}`}>
            {navLinks.map(([label, target]) => (
              <a
                key={target}
                className={`nav-link ${target === "services" ? "nav-link-featured" : ""}`}
                href={`#${target}`}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </a>
            ))}
          </div>
          <a className="nav-action" href={whatsappLink ?? "#contact"} rel={whatsappLink ? "noreferrer" : undefined} target={whatsappLink ? "_blank" : undefined}>
            {whatsappLink ? "WhatsApp" : "Send an enquiry"} <ArrowRight aria-hidden="true" size={16} />
          </a>
          <Button
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            className="nav-toggle"
            onClick={() => setMenuOpen((open) => !open)}
            size="icon"
            variant="ghost"
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </Button>
        </nav>
      </header>

      <section aria-labelledby="hero-title" className="hero-section" id="home">
        <img
          alt="A vibrant financial district skyline illuminated at dusk"
          className="hero-city"
          fetchPriority="high"
          height="1024"
          src={cityAtNight}
          width="1536"
        />
        <div className="hero-overlay" />
        <div className="hero-grid" />
        <div className="hero-inner container">
          <div className="hero-copy">
            <p className="eyebrow"><span />{businessConfig.name}</p>
            <h1 id="hero-title">
              Your gateway to <span>smarter</span> financial opportunities.
            </h1>
            <p className="hero-description">
              Market insights, practical education, and thoughtful guidance for a more confident
              financial journey.
            </p>
            <div className="hero-actions">
              <Button asChild className="button-gold" size="lg">
                <a href="#services">Explore our services <ArrowRight aria-hidden="true" /></a>
              </Button>
              {whatsappLink ? (
                <Button asChild className="button-glass" size="lg" variant="outline">
                  <a href={whatsappLink} rel="noreferrer" target="_blank">
                    <MessageCircle aria-hidden="true" /> Connect on WhatsApp
                  </a>
                </Button>
              ) : (
                <a className="hero-text-link" href="#contact">
                  Get in touch <ArrowUpRight aria-hidden="true" />
                </a>
              )}
            </div>
            <div className="trust-strip">
              <span><CircleCheck aria-hidden="true" />Transparent</span>
              <i />
              <span>Client-focused</span>
              <i />
              <span>Education-led</span>
            </div>
          </div>

          <div className="market-widget" aria-label="Illustrative financial market chart">
            <div className="market-widget-header">
              <span className="market-title"><span className="live-dot" /> MARKET INSIGHTS</span>
              <span className="market-period">ILLUSTRATIVE ONLY</span>
            </div>
            <div className="market-widget-numbers">
              <div><span>Investment markets</span><strong>Made clearer<span>.</span></strong></div>
              <span className="market-index"><ArrowUpRight aria-hidden="true" /> A broader perspective</span>
            </div>
            <ChartArtwork />
            <div className="market-widget-footer">
              <span>IPO insights</span><i />
              <span>Forex education</span><i />
              <span>Portfolio guidance</span>
            </div>
          </div>
          <a className="scroll-cue" href="#services"><ArrowDown aria-hidden="true" /> Scroll to explore</a>
        </div>
        <div className="image-credit-band" aria-hidden="true"><span>INSIGHT</span><span>INTELLIGENCE</span><span>GROWTH</span></div>
      </section>

      <section className="services-section section-pad" id="services">
        <div className="container">
          <div className="services-heading-row">
            <SectionHeading
              eyebrow="What we do"
              title="A world of finance. One clear starting point."
              description="Explore the areas you are curious about, from IPOs to financial-market education."
            />
            <a className="section-side-link" href="#contact">Find the right place to start <ArrowDown aria-hidden="true" /></a>
          </div>
          <div className="services-grid">
            {services.map(({ number, title, eyebrow, description, icon: Icon, note }) => (
              <article className="service-item" key={number}>
                <div className="service-item-top"><span className="service-number">{number} / 04</span><Icon aria-hidden="true" className="service-icon" /></div>
                <p className="service-eyebrow">{eyebrow}</p>
                <h3>{title}</h3>
                <p className="service-description">{description}</p>
                {note && <p className="service-disclaimer">{note}</p>}
                <button
                  className="service-link"
                  onClick={() => {
                    chooseService(title);
                    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  type="button"
                >
                  Ask us about this <ArrowRight aria-hidden="true" />
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section section-pad" id="about">
        <div className="container about-layout">
          <div className="about-copy">
            <SectionHeading
              eyebrow="A different perspective"
              title="More understanding. Better conversations."
              description="Money Talks makes complex financial topics easier to explore, with relevant insights and support that starts with listening."
            />
            <p className="about-body">
              From IPO updates and unlisted shares information to forex education and portfolio
              considerations, we help you get clearer on the areas that matter to you. We believe
              an informed conversation is a good place to start.
            </p>
            <a className="section-side-link" href="#contact">Let’s start a conversation <ArrowRight aria-hidden="true" /></a>
          </div>
          <div className="about-visual">
            <div className="about-visual-caption"><span>THE BIGGER PICTURE</span><span>01 — 04</span></div>
            <ChartArtwork />
            <div className="about-visual-footer"><span>A thoughtful view of finance</span><Sparkles aria-hidden="true" /></div>
          </div>
        </div>
      </section>

      <section className="approach-section section-pad" id="approach">
        <div className="container">
          <SectionHeading eyebrow="Why Money Talks" title="A clear view. A conversation that puts you first." description="Professional support begins with transparency, attentive listening, and an honest conversation about risk." />
          <div className="reasons-grid">
            {reasons.map(({ title, description, icon: Icon }, index) => (
              <article className="reason-item" key={title}>
                <span className="reason-count">0{index + 1}</span>
                <Icon aria-hidden="true" className="reason-icon" />
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="steps-section section-pad" id="steps">
        <div className="container steps-layout">
          <SectionHeading eyebrow="A simple way to begin" title="Start with what you want to know." description="Good guidance starts with listening. Here’s how a conversation can unfold." />
          <ol className="steps-list">
            {steps.map(([number, title, description]) => (
              <li className="step-item" key={number}>
                <span className="step-number">{number}</span>
                <div><h3>{title}</h3><p>{description}</p></div>
                <Check aria-hidden="true" className="step-check" />
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="contact-section section-pad" id="contact">
        <div className="container">
          <div className="contact-intro">
            <SectionHeading eyebrow="Let's talk" title="Your next question deserves a conversation." description="Tell us what you are looking to understand, and the Money Talks team will have your enquiry to follow up." />
            <span className="contact-sparkle"><MessageCircle aria-hidden="true" /></span>
          </div>
          <div className="contact-layout">
            <aside className="contact-card contact-direct">
              <div>
                <p className="contact-card-eyebrow"><span className="live-dot" /> WE’RE LISTENING</p>
                <h3>Prefer to connect directly?</h3>
                <p>Send us an enquiry and tell us what financial topic is on your mind.</p>
              </div>
              {whatsappLink ? (
                <Button asChild className="button-gold contact-direct-button" size="lg">
                  <a href={whatsappLink} rel="noreferrer" target="_blank"><MessageCircle aria-hidden="true" /> Chat with us on WhatsApp <ArrowUpRight aria-hidden="true" /></a>
                </Button>
              ) : (
                <a className="direct-note" href="#enquiry-form">Use our secure enquiry form <ArrowRight aria-hidden="true" /></a>
              )}
              <div className="contact-direct-footer"><ShieldCheck aria-hidden="true" /> Your details stay private and secure.</div>
            </aside>

            <div className="contact-card contact-form-card" id="enquiry-form">
              <div className="contact-form-heading">
                <div><p className="service-eyebrow">WEBSITE ENQUIRY</p><h3>Tell us what’s on your mind.</h3></div>
                <FileText aria-hidden="true" />
              </div>

              {status === "success" && (
                <div className="form-feedback form-success" role="status"><CircleCheck aria-hidden="true" /><div><strong>Thank you for reaching out.</strong><span>Your enquiry has been saved securely for the Money Talks team.</span></div></div>
              )}
              {status === "error" && (
                <div className="form-feedback form-error" role="alert">
                  <div><strong>Your enquiry could not be sent.</strong><span>Please try again in a moment.{whatsappLink ? " You can also reach us on WhatsApp." : ""}</span></div>
                  {whatsappLink && <a href={whatsappLink} rel="noreferrer" target="_blank">Open WhatsApp <ArrowUpRight aria-hidden="true" /></a>}
                </div>
              )}

              <form className="enquiry-form" noValidate onSubmit={handleSubmit}>
                <div aria-hidden="true" className="honeypot-field"><label htmlFor="website">Website</label><input autoComplete="off" id="website" name="website" onChange={(event) => updateField("website", event.target.value)} tabIndex={-1} value={fields.website} /></div>
                <div className="form-row">
                  <FormInput error={fieldErrors["name"]} label="Full name" name="name" onChange={(value) => updateField("name", value)} placeholder="Your name" value={fields.name} />
                  <FormInput error={fieldErrors["phone"]} label="Phone number" name="phone" onChange={(value) => updateField("phone", value)} placeholder="+91 98765 43210" type="tel" value={fields.phone} />
                </div>
                <div className="form-row">
                  <FormInput autoComplete="email" error={fieldErrors["email"]} label="Email address" name="email" onChange={(value) => updateField("email", value)} placeholder="you@example.com" type="email" value={fields.email} />
                  <div className="form-field">
                    <label htmlFor="service">Service of interest <span>OPTIONAL</span></label>
                    <div className="select-wrap">
                      <select aria-invalid={Boolean(fieldErrors["service"])} id="service" onChange={(event) => updateField("service", event.target.value)} value={fields.service}>
                        <option value="">Choose a topic</option>
                        {websiteEnquiryServices.map((service) => <option key={service} value={service}>{service}</option>)}
                      </select>
                      <ChevronDown aria-hidden="true" />
                    </div>
                    {fieldErrors["service"] && <p className="field-error" role="alert">{fieldErrors["service"]}</p>}
                  </div>
                </div>
                <div className="form-field">
                  <label htmlFor="message">Message <span>{fields.message.length} / 1,000</span></label>
                  <Textarea aria-invalid={Boolean(fieldErrors["message"])} autoComplete="off" id="message" maxLength={1000} onChange={(event) => updateField("message", event.target.value)} placeholder="What would you like to know?" value={fields.message} />
                  {fieldErrors["message"] && <p className="field-error" role="alert">{fieldErrors["message"]}</p>}
                </div>
                <div className="consent-block">
                  <Checkbox checked={fields.consent} id="consent" onCheckedChange={(checked) => updateField("consent", checked === true)} />
                  <label htmlFor="consent">I agree to Money Talks contacting me about my enquiry and storing my details for that purpose.</label>
                </div>
                {fieldErrors["consent"] && <p className="field-error consent-error" role="alert">{fieldErrors["consent"]}</p>}
                <div className="form-footer">
                  <p><ShieldCheck aria-hidden="true" /> Your details stay private. Read our <a href="#privacy">privacy note.</a></p>
                  <Button className="button-gold form-submit" disabled={status === "submitting"} size="lg" type="submit">
                    {status === "submitting" ? "Sending enquiry…" : "Submit enquiry"} {status === "submitting" ? null : <ArrowRight aria-hidden="true" />}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="site-footer" id="privacy">
        <div className="container">
          <div className="footer-main">
            <div><AppWordmark /><p className="footer-about">A clearer perspective on financial markets, investment information, and financial education.</p></div>
            <div className="footer-links"><span>EXPLORE</span>{navLinks.map(([label, target]) => <a href={`#${target}`} key={target}>{label}</a>)}</div>
            <div className="footer-links"><span>YOUR PRIVACY</span><p>Enquiries are kept securely so Money Talks can respond to you. Anonymous visitors cannot access submitted details.</p><a href="#contact">Contact us about your data</a></div>
          </div>
          <div className="footer-disclaimer"><p><strong>IMPORTANT INFORMATION</strong><br />Financial markets involve risk. Investments and trading activities can result in losses. Past performance is not indicative of future results. Information is educational and informational and should not be treated as a promise of performance. Portfolio-related services are subject to applicable regulatory authorisation. Please consider eligibility, fees, and risks before proceeding.{businessConfig.registrationDetails && <> <br />{businessConfig.registrationDetails}</>}</p></div>
          <div className="footer-legal"><button onClick={() => setActiveLegalDocument("privacy")} type="button">Privacy notice</button><button onClick={() => setActiveLegalDocument("terms")} type="button">Terms &amp; conditions</button><button onClick={() => setActiveLegalDocument("risk")} type="button">Risk disclosure</button></div>
          <div className="footer-bottom"><span>© {new Date().getFullYear()} Money Talks. All rights reserved.</span><span>INSIGHT <i /> INTELLIGENCE <i /> GROWTH</span></div>
        </div>
      </footer>

      {whatsappLink && <a aria-label="Chat with Money Talks on WhatsApp" className="floating-whatsapp" href={whatsappLink} rel="noreferrer" target="_blank"><MessageCircle aria-hidden="true" /><span>Chat with us</span></a>}

      <Dialog open={activeLegalDocument !== null} onOpenChange={(open) => { if (!open) setActiveLegalDocument(null); }}>
        <DialogContent className="legal-dialog">
          {activeLegalDocument && <DialogHeader className="legal-dialog-header"><DialogTitle>{legalContent[activeLegalDocument].title}</DialogTitle><DialogDescription>{legalContent[activeLegalDocument].description}</DialogDescription></DialogHeader>}
        </DialogContent>
      </Dialog>
    </main>
  );
}

function FormInput({
  label,
  name,
  placeholder,
  value,
  onChange,
  error,
  type = "text",
  autoComplete = "",
}: {
  label: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error: string | undefined;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div className="form-field">
      <label htmlFor={name}>{label} <span>REQUIRED</span></label>
      <Input aria-invalid={Boolean(error)} autoComplete={autoComplete || undefined} id={name} maxLength={name === "name" ? 100 : undefined} name={name} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} type={type} value={value} />
      {error && <p className="field-error" role="alert">{error}</p>}
    </div>
  );
}