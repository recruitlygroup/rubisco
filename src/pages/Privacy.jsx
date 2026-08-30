import Seo from '../components/Seo.jsx'

export default function Privacy() {
  return (
    <>
      <Seo
        title="Privacy Policy"
        description="How Rubisco Tech handles information submitted through the contact form."
        path="/privacy"
      />
      <section className="mx-auto max-w-3xl px-6 py-20 sm:px-10">
        <p className="font-mono text-xs uppercase tracking-widest text-leaf">Legal</p>
        <h1 className="mt-3 font-display text-3xl font-medium text-ink sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-4 text-sm text-ink-soft">Last updated: August 2026</p>

        <div className="prose-rubisco mt-10">
          <p>
            This page explains what happens to the information you give us
            through the contact form on this website. We have kept it short
            on purpose — if anything here is unclear, email us and we will
            explain it plainly.
          </p>

          <h2>What we collect</h2>
          <p>
            When you submit the contact form, we collect the information you
            type into it: your name, email address, farm or organisation
            name, and your message. We do not collect anything else through
            the form beyond what is needed to reply to you.
          </p>

          <h2>How we use it</h2>
          <p>
            We use this information for one purpose only: to read your
            message and reply to it. We do not use it for marketing, we do
            not add you to a mailing list, and we do not use it to build a
            profile of you or your organisation.
          </p>

          <h2>Who we share it with</h2>
          <p>
            We do not sell your information, and we do not share it with
            third parties. The only people who see it are the people at
            Rubisco Tech who handle inquiries and respond to them.
          </p>

          <h2>How long we keep it</h2>
          <p>
            We keep contact form submissions for as long as is reasonably
            necessary to respond to your inquiry and to keep a record of the
            conversation, and no longer than that unless you go on to become
            a client, in which case ordinary business records rules apply.
          </p>

          <h2>Requesting deletion</h2>
          <p>
            You can ask us to delete any information we hold about you from
            the contact form at any time. To do this, email{' '}
            <a href="mailto:hello@rubisco.tech">hello@rubisco.tech</a> with
            &ldquo;delete my data&rdquo; in the subject line, along with the
            name or email address you used when you contacted us. We will
            confirm once it has been removed.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about this policy can go to the same address:{' '}
            <a href="mailto:hello@rubisco.tech">hello@rubisco.tech</a>.
          </p>
        </div>
      </section>
    </>
  )
}
