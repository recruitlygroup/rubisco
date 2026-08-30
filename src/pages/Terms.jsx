import Seo from '../components/Seo.jsx'

export default function Terms() {
  return (
    <>
      <Seo
        title="Terms of Use"
        description="Standard terms of use for the Rubisco Tech website."
        path="/terms"
      />
      <section className="mx-auto max-w-3xl px-6 py-20 sm:px-10">
        <p className="font-mono text-xs uppercase tracking-widest text-leaf">Legal</p>
        <h1 className="mt-3 font-display text-3xl font-medium text-ink sm:text-4xl">
          Terms of Use
        </h1>
        <p className="mt-4 text-sm text-ink-soft">Last updated: August 2026</p>

        <div className="prose-rubisco mt-10">
          <p>
            These are the terms of use for the Rubisco Tech website
            (rubisco.tech). By using this website, you agree to them. They
            cover the website only — not any separate contract you may sign
            with us for a project.
          </p>

          <h2>Use of this site</h2>
          <p>
            You are welcome to browse this website and use the contact form
            to get in touch with us. You agree not to misuse the site — for
            example, by attempting to interfere with how it runs, submitting
            the contact form with false information, or using it to
            transmit anything unlawful, harmful, or abusive.
          </p>

          <h2>Content</h2>
          <p>
            The text, images, and other content on this website belong to
            Rubisco Tech Pvt. Ltd. unless stated otherwise, and are provided
            for general information about our work. You may not copy,
            reproduce, or reuse this content for commercial purposes without
            our written permission.
          </p>

          <h2>No warranty</h2>
          <p>
            We try to keep the information on this site accurate and up to
            date, but we make no guarantees about its completeness or
            accuracy, and the site is provided &ldquo;as is&rdquo; without
            warranties of any kind.
          </p>

          <h2>Limitation of liability</h2>
          <p>
            To the extent permitted by law, Rubisco Tech is not liable for
            any loss or damage arising from your use of this website. This
            does not affect any separate agreement or warranty covering
            actual project work we carry out for a client.
          </p>

          <h2>External links</h2>
          <p>
            This site may link to third-party websites. We are not
            responsible for the content or practices of those sites.
          </p>

          <h2>Changes to these terms</h2>
          <p>
            We may update these terms from time to time. The date at the top
            of this page reflects the last update.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about these terms can go to{' '}
            <a href="mailto:hello@rubisco.tech">hello@rubisco.tech</a>.
          </p>
        </div>
      </section>
    </>
  )
}
