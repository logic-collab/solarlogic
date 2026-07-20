import type { Metadata } from "next";
import { LegalPage, Section, P, List, Callout } from "../../components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy — SolarLogic",
  description: "How SolarLogic collects, uses, and protects your information.",
};

export default function PrivacyPolicy() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="July 20, 2026"
      intro='SolarLogic ("SolarLogic," "we," "us," or "our") operates this website, tools, and AI assistant (the "Service"). This Privacy Policy explains what information we collect, how we use it, and the choices you have. By using the Service, you agree to this Policy.'
    >
      <Section heading="1. Who we are">
        <P>
          SolarLogic is an independent research and education project that helps homeowners make
          smarter solar, battery, and EV decisions. We are not an installer, lender, or utility, and
          we do not take installer incentives. You can reach us any time at{" "}
          <a
            href="mailto:thelogicforge@gmail.com"
            className="gold-text underline underline-offset-2 hover:text-white"
          >
            thelogicforge@gmail.com
          </a>
          .
        </P>
      </Section>

      <Section heading="2. Information we collect">
        <P className="font-semibold text-white">Information you give us:</P>
        <List>
          <li>
            <strong className="text-white">Email address</strong> — when you use our payback
            calculator or otherwise opt in, so we can send you your results and related educational
            emails.
          </li>
          <li>
            <strong className="text-white">Messages to our AI assistant</strong> ("Ask SolarLogic")
            — the text of the chat messages you type.
          </li>
          <li>
            <strong className="text-white">Anything you send us directly</strong> — for example,
            when you email us.
          </li>
        </List>
        <P className="font-semibold text-white">Information collected automatically:</P>
        <List>
          <li>
            <strong className="text-white">Calculator inputs</strong> such as your state and
            estimated monthly electric bill. These are used in your browser to generate an estimate
            and are not stored on our servers.
          </li>
          <li>
            <strong className="text-white">Technical data</strong> such as your IP address, browser
            type, and pages viewed, collected through standard hosting logs and used for security,
            rate-limiting, and keeping the Service running.
          </li>
          <li>
            <strong className="text-white">Local storage</strong> — our AI assistant saves your
            recent conversation in your browser so it persists between visits. You can clear it any
            time with the trash icon in the chat window or by clearing your browser data.
          </li>
        </List>
        <P>
          <strong className="text-white">Payments:</strong> if you buy a product, checkout and
          payment are handled by our third-party checkout provider. We do not receive or store your
          full payment card details.
        </P>
      </Section>

      <Section heading="3. How we use your information">
        <List>
          <li>To deliver the results, reports, and tools you request</li>
          <li>To send educational emails and product updates you opted into (unsubscribe any time)</li>
          <li>To operate, secure, and improve the Service, including preventing abuse</li>
          <li>To respond to your questions and provide support</li>
          <li>To comply with our legal obligations</li>
        </List>
      </Section>

      <Section heading="4. Our AI assistant">
        <Callout>
          When you use "Ask SolarLogic," the messages you type are sent to our third-party AI
          provider (Groq) to generate a response. Please do not enter sensitive personal information
          — such as financial account numbers, passwords, or government IDs — into the chat. Chat
          responses are AI-generated and may be inaccurate; they are not professional advice.
        </Callout>
      </Section>

      <Section heading="5. How we share information">
        <P>
          <strong className="text-white">We do not sell your personal information.</strong> We share
          it only with service providers that help us run the Service:
        </P>
        <List>
          <li>
            <strong className="text-white">Kit</strong> (formerly ConvertKit) — email delivery and
            list management
          </li>
          <li>
            <strong className="text-white">Groq</strong> — AI chat responses
          </li>
          <li>
            <strong className="text-white">Our hosting provider</strong> — hosting and security
          </li>
          <li>
            <strong className="text-white">Our checkout provider</strong> — processing purchases
          </li>
        </List>
        <P>
          We may also disclose information if required by law, or to protect the rights, safety, and
          security of SolarLogic and its users.
        </P>
      </Section>

      <Section heading="6. Cookies and tracking">
        <P>
          We use browser local storage for the AI assistant as described above. We do not currently
          run third-party advertising trackers on this site. If we add analytics or advertising
          cookies in the future, we will update this Policy first.
        </P>
      </Section>

      <Section heading="7. Your choices and rights">
        <List>
          <li>
            <strong className="text-white">Unsubscribe:</strong> every marketing email includes an
            unsubscribe link. You can also email us to be removed.
          </li>
          <li>
            <strong className="text-white">Access or delete:</strong> you can ask for a copy of the
            personal information we hold about you, or ask us to delete it, by emailing us.
          </li>
        </List>
        <P>
          <strong className="text-white">California residents (CCPA/CPRA):</strong> you have the
          right to know what personal information we collect, to request access or deletion, to
          correct inaccurate information, and to opt out of the "sale" or "sharing" of personal
          information. We do not sell your personal information, and we will not discriminate against
          you for exercising these rights.
        </P>
        <P>
          <strong className="text-white">EU / UK visitors:</strong> where applicable, you have rights
          to access, correct, delete, restrict, or object to the processing of your personal data,
          and to data portability. Our lawful bases are your consent (for marketing) and our
          legitimate interests (in operating and securing the Service).
        </P>
        <P>
          To exercise any of these rights, email{" "}
          <a
            href="mailto:thelogicforge@gmail.com"
            className="gold-text underline underline-offset-2 hover:text-white"
          >
            thelogicforge@gmail.com
          </a>
          . We may need to verify your identity before responding.
        </P>
      </Section>

      <Section heading="8. Data retention">
        <P>
          We keep your email and related information for as long as you remain subscribed or as
          needed to provide the Service, then delete or anonymize it, unless a longer period is
          required by law.
        </P>
      </Section>

      <Section heading="9. Security">
        <P>
          We use reasonable technical and organizational measures to protect your information. No
          method of transmission or storage is 100% secure, so we cannot guarantee absolute security.
        </P>
      </Section>

      <Section heading="10. Children">
        <P>
          The Service is intended for adults and is not directed to children under 16. We do not
          knowingly collect personal information from children. If you believe a child has provided
          us information, contact us and we will delete it.
        </P>
      </Section>

      <Section heading="11. Changes to this Policy">
        <P>
          We may update this Policy from time to time. The "Last updated" date above reflects the
          latest version, and material changes will be posted on this page.
        </P>
      </Section>

      <Section heading="12. Contact">
        <P>
          Questions or requests? Email{" "}
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
