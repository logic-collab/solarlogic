import type { Metadata } from "next";
import { LegalPage, Section, P, List, Callout } from "../../components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service — SolarLogic",
  description: "The terms that govern your use of SolarLogic's website, tools, and products.",
};

export default function TermsOfService() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="July 20, 2026"
      intro='These Terms of Service ("Terms") govern your use of the SolarLogic website, tools, AI assistant, and digital products (the "Service"). By using the Service, you agree to these Terms. If you do not agree, please do not use the Service.'
    >
      <Section heading="1. Educational purpose — not professional advice">
        <Callout>
          SolarLogic provides independent educational information and decision tools. We are not an
          installer, contractor, licensed electrician, financial advisor, tax advisor, or attorney,
          and nothing on the Service is professional financial, tax, legal, or engineering advice.
        </Callout>
        <P>
          Our calculators, estimates, and AI assistant produce illustrative, first-pass figures based
          on general assumptions and the limited inputs you provide. Actual costs, savings, payback,
          equipment needs, local code requirements, and utility policies vary widely. Always verify
          with qualified local professionals and your utility before you purchase equipment or sign a
          contract.
        </P>
      </Section>

      <Section heading="2. No guarantees">
        <P>
          All estimates, savings figures, product recommendations, and AI responses are provided "as
          is" and "as available," without warranties of any kind, express or implied — including
          accuracy, merchantability, or fitness for a particular purpose. We do not guarantee any
          particular savings, payback period, or outcome.
        </P>
      </Section>

      <Section heading="3. The AI assistant">
        <P>
          "Ask SolarLogic" is an automated tool that can make mistakes. Do not rely on it as a
          substitute for professional advice or a real quote review, and do not enter sensitive
          personal information into it. See our{" "}
          <a href="/privacy" className="gold-text underline underline-offset-2 hover:text-white">
            Privacy Policy
          </a>{" "}
          for how chat data is handled.
        </P>
      </Section>

      <Section heading="4. Products and purchases">
        <P>
          We offer digital products such as guides, toolkits, and checklists. Purchases are processed
          by a third-party checkout provider and are subject to their terms as well as these. When you
          buy a digital product, we grant you a personal, non-transferable license to use it for your
          own, non-commercial purposes. You may not resell, redistribute, or publicly share the
          materials.
        </P>
        <Callout>
          <strong className="text-white">Refunds:</strong> because our products are digital and
          delivered instantly, all sales are final except where a refund is required by law. If you
          have trouble accessing a purchase, email{" "}
          <a
            href="mailto:thelogicforge@gmail.com"
            className="gold-text underline underline-offset-2 hover:text-white"
          >
            thelogicforge@gmail.com
          </a>{" "}
          and we will help. <em>(Update this section to match the refund policy you want to offer.)</em>
        </Callout>
      </Section>

      <Section heading="5. Affiliate links">
        <P>
          Some links on the Service are affiliate links, and we may earn a commission if you buy
          through them — at no additional cost to you. Affiliate relationships never change our
          recommendations. See our{" "}
          <a
            href="/affiliate-disclosure"
            className="gold-text underline underline-offset-2 hover:text-white"
          >
            Affiliate Disclosure
          </a>{" "}
          for details.
        </P>
      </Section>

      <Section heading="6. Intellectual property">
        <P>
          The Service and its content — text, tools, graphics, and branding — are owned by SolarLogic
          and protected by law. You may not copy, reproduce, or create derivative works from our
          content without permission, except for your own personal use.
        </P>
      </Section>

      <Section heading="7. Acceptable use">
        <P>
          You agree not to misuse the Service, including by attempting to disrupt it, bypass rate
          limits or security, scrape it at scale, or use it for any unlawful purpose.
        </P>
      </Section>

      <Section heading="8. Third-party links and services">
        <P>
          The Service links to third-party websites and services we do not control. We are not
          responsible for their content, products, or practices, and your use of them is at your own
          risk.
        </P>
      </Section>

      <Section heading="9. Limitation of liability">
        <P>
          To the fullest extent permitted by law, SolarLogic and its operators will not be liable for
          any indirect, incidental, or consequential damages, or for any decision you make based on
          the Service. Our total liability for any claim relating to the Service will not exceed the
          amount you paid us, if any, in the 12 months before the claim.
        </P>
      </Section>

      <Section heading="10. Indemnification">
        <P>
          You agree to indemnify and hold SolarLogic harmless from any claims arising out of your
          misuse of the Service or your violation of these Terms.
        </P>
      </Section>

      <Section heading="11. Governing law">
        <P>
          These Terms are governed by the laws of{" "}
          <strong className="text-white">[your state / country]</strong>, without regard to its
          conflict-of-laws rules.
        </P>
      </Section>

      <Section heading="12. Changes">
        <P>
          We may update these Terms from time to time. Continued use of the Service after changes
          take effect means you accept the updated Terms.
        </P>
      </Section>

      <Section heading="13. Contact">
        <P>
          Questions about these Terms? Email{" "}
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
