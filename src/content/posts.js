/**
 * Blog content. PLACEHOLDER COPY — swap in real posts before launch.
 * `body` is markdown, rendered with `marked` in BlogPost.jsx.
 */
export const posts = [
  {
    slug: 'what-offline-first-actually-means-on-a-farm',
    title: 'What "offline-first" actually means on a farm',
    date: '2025-03-14',
    excerpt:
      'Connectivity on a working farm is not a straight line — it is patchy, seasonal and sometimes gone for days. Here is how we design around that instead of around it.',
    body: `Most software gets built assuming a stable connection, then has "offline mode" added as an afterthought — a banner that says *you are offline*, and not much else.

That does not hold up on a working farm. Connectivity is patchy, weather-dependent, and sometimes gone for days during the monsoon. If the system stops working the moment the signal drops, it was never really built for the field.

## What we do differently

Every record — a breeding event, a moisture reading, a delivery — is written to the device first, full stop. Syncing to the server is a background concern the person entering data should never have to think about.

That single decision changes almost everything else about how the system is built: conflict resolution, storage limits on cheap devices, and how we test. It is slower to build. It is also the only version that actually gets used six months in.`,
  },
  {
    slug: 'sensors-are-the-easy-part',
    title: 'Sensors are the easy part',
    date: '2025-01-22',
    excerpt:
      'Installing a moisture sensor takes an afternoon. Getting a warehouse manager to trust the number it reports takes months. Here is what that trust actually requires.',
    body: `Every hardware project we run has the same shape: the installation is the fast part. Mounting sensors, wiring power, confirming readings — a day, maybe two per site.

The slow part is trust. A warehouse manager who has spent fifteen years reading grain moisture by hand is not going to hand that judgment over to a number on a screen because we installed one.

## Earning it

We do not ask for trust up front. For the first month on every install, the sensor readings run alongside the manual process, not instead of it. The manager checks both. When the numbers agree — and they almost always do — the manual check quietly stops being necessary.

Skipping this step does not save time. It just moves the resistance to later, when it is harder to work through.`,
  },
  {
    slug: 'why-we-build-in-nepali-first',
    title: 'Why we build in Nepali first, English second',
    date: '2024-11-05',
    excerpt:
      'Most farm software is designed in English and translated later, if at all. We build the other way around — and it changes decisions you would not expect.',
    body: `Language is not a settings toggle you add at the end. It shapes the interface itself.

When we design a screen in Nepali first, the questions change. Which unit is the natural one for this measurement — the one a herder already uses, not the one a spec sheet defaults to? Does this label make sense read aloud in a cowshed, not just glanced at on a desk?

## The English version comes second

Once the Nepali-first version works for the person actually using it daily, we build the English interface for the owner, the investor report, or the partner organisation reviewing the data. It is the same system, but the primary user was never an afterthought.`,
  },
]

export function getPostBySlug(slug) {
  return posts.find((post) => post.slug === slug)
}
