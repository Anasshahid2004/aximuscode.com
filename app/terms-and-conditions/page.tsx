import type { Metadata } from "next";
import PageBreadcrumb from "@/app/components/shared/PageBreadcrumb";
import styles from "@/app/privacy-policy/PrivacyPolicy.module.css";

export const metadata: Metadata = {
  title: "Terms & Conditions - nimo",
};

// The demo content has no dedicated "Terms and Conditions" page (unlike
// Privacy Policy, which at least existed as a WordPress default draft) - the
// footer's "404" link was a placeholder pointing nowhere real. Standard
// terms-of-use copy written here, styled the same as the Privacy Policy page.
export default function TermsAndConditionsPage() {
  return (
    <main>
      <PageBreadcrumb title="Terms & Conditions" current="Terms & Conditions" />
      <div className={styles.wrap}>
        <div className="container nm-container-1">
          <div className={styles.content}>
            <h2>Introduction</h2>
            <p>
              These terms and conditions outline the rules and regulations for the use of nimo&rsquo;s website. By
              accessing this website, we assume you accept these terms and conditions in full. Do not continue to
              use nimo&rsquo;s website if you do not accept all of the terms and conditions stated on this page.
            </p>

            <h2>Use of the Site</h2>
            <p>
              Unless otherwise stated, nimo and/or its licensors own the intellectual property rights for all
              material on this website. All intellectual property rights are reserved. You may view and/or print
              pages from the website for your own personal use, subject to restrictions set in these terms and
              conditions.
            </p>
            <p>You must not:</p>
            <p>
              Republish material from this website; sell, rent, or sub-license material from this website; reproduce,
              duplicate, or copy material from this website; or redistribute content from this website, unless
              content is specifically made available for redistribution.
            </p>

            <h2>User Content</h2>
            <p>
              In these terms and conditions, &ldquo;your content&rdquo; means any material (including text, images,
              audio material, video material, or audio-visual material) that you submit to this website, for
              whatever purpose. By submitting content, you grant nimo a worldwide, non-exclusive, royalty-free
              license to use, reproduce, and display that content.
            </p>

            <h2>No Warranties</h2>
            <p>
              This website is provided &ldquo;as is,&rdquo; without any representations or warranties, express or
              implied. nimo makes no representations or warranties in relation to this website or the information
              and materials provided on it.
            </p>

            <h2>Limitation of Liability</h2>
            <p>
              nimo will not be liable to you in relation to the content of, or use of, or otherwise in connection
              with this website for any indirect, special, or consequential loss, or for any loss of business,
              revenue, profits, or anticipated savings.
            </p>

            <h2>Changes to These Terms</h2>
            <p>
              We may revise these terms and conditions from time to time. Revised terms will apply to the use of
              this website from the date of publication of the revised terms on this website, so please check this
              page regularly.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about these terms and conditions, please get in touch through our{" "}
              <a href="/contact">contact page</a>.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
