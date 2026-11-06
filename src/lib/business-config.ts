export const businessConfig = {
  name: "Money Talks",
  tagline: "A clearer view of your financial world",
  whatsappNumber: "",
  whatsappMessage: "Hi Money Talks, I would like to know more about your services.",
  businessEmail: "",
  location: "",
  socialLinks: {},
  registrationDetails: "",
} as const;

export function getWhatsAppLink(message = businessConfig.whatsappMessage) {
  const number = businessConfig.whatsappNumber.replace(/\D/g, "");
  return number ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : null;
}