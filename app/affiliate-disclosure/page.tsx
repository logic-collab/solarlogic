import type { Metadata } from "next";
import { LegalPage, Section, P } from "../../components/LegalPage";

export const metadata: Metadata = {
  title: "Affiliate Disclosure — SolarLogic",
  description: "Exactly how SolarLogic makes money — and how it does not affect our recommendations.",
};

export default function AffiliateDisclosure() {
  return (
    <LegalPage
      title="Affiliate Disclosure"
      updated="July 20, 2026"
      intro="Transparency matters — especially for a brand built on protecting homeowners from hidden costs. Here is exactly how SolarLogic makes money, and how that does (and does not) affect what you see."
    >
      <Section heading="Affiliate links">
        <P>
          Some of the links on this site are affiliate links. If you click one and buy a product or
          service, we may earn a commission — <strong className="text-white">at no additional cost to
          you.</strong> The price you pay is exactly the same whether or not you use our link.
        </P>
      </Section>

      <Section heading="Our own products">
        <P>
          We also sell our own digital products — guides, toolkits, and checklists. When you buy those,
          you are paying us directly, and that revenue helps fund our independent research.
        </P>
      </Section>

      <Section heading="Our promise on independence">
        <P>
          We are not installers, lenders, or manufacturers, and we do not take installer incentives.
          Our recommendations are based on our own research and what we would choose for our own homes.
          An affiliate commission never buys a better review or a higher ranking. If we do not think
          something is worth your money, we will say so.
        </P>
      </Section>

      <Section heading="Questions">
        <P>
          Have a question about a recommendation or a link? Email{" "}
          <a
            href="mailto:thelogicforge@gmail.com"
            className="gold-text underline underline-offset-2 hover:text-white"
          >
            thelogicforge@gmail.com
          </a>
          .
        </P>
      </Section>
    </LegalPage>
  );
}
