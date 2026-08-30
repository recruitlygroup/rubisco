/**
 * Project / case-study content.
 * PLACEHOLDER DATA — swap in real client names, numbers and photography
 * before launch. Structure is the important part: keep the same shape
 * (slug, category, stats, sections) and the pages will render correctly.
 */
export const projects = [
  {
    slug: 'himal-dairy-herd-platform',
    category: 'Software',
    year: '2024',
    title: 'A herd management system for a 400-cow dairy',
    client: 'Himal Dairy Cooperative',
    location: 'Sindhuli, Nepal',
    summary:
      'Replaced paper herd registers with a system built around how the herders actually work — offline-first, Nepali-language, usable on a shared shop-floor tablet.',
    stats: [
      { value: '400+', label: 'Animals tracked' },
      { value: '31%', label: 'Reduction in missed breeding windows' },
      { value: '6', label: 'Weeks to full rollout' },
    ],
    sections: [
      {
        heading: 'The problem',
        body: 'Herd records lived in exercise books, split across three staff members, with no way to see breeding cycles or yield trends at a glance. Decisions were made from memory.',
      },
      {
        heading: 'What we built',
        body: 'A herd register that works offline on a shared tablet, syncing when connectivity allows. Breeding, health and yield events log in under 10 seconds per animal, in Nepali or English.',
      },
      {
        heading: 'Result',
        body: 'Missed breeding windows dropped by roughly a third in the first two seasons, and the cooperative now has a full herd history it can hand to a vet or a buyer on request.',
      },
    ],
  },
  {
    slug: 'terai-grain-moisture-sensors',
    category: 'Hardware & IoT',
    year: '2023',
    title: 'Grain-store moisture sensing across four warehouses',
    client: 'Terai Grain Storage Ltd.',
    location: 'Terai region, Nepal',
    summary:
      'Designed, installed and maintain a low-power sensor network monitoring grain moisture and temperature, cutting spoilage losses that used to be caught too late.',
    stats: [
      { value: '4', label: 'Warehouses instrumented' },
      { value: '60+', label: 'Sensors deployed' },
      { value: '~18%', label: 'Estimated spoilage reduction' },
    ],
    sections: [
      {
        heading: 'The problem',
        body: 'Moisture spikes inside grain stores were only caught during manual spot checks — often after spoilage had already started.',
      },
      {
        heading: 'What we built',
        body: 'A solar-assisted sensor mesh reporting moisture and temperature every fifteen minutes, with threshold alerts sent directly to warehouse managers by SMS.',
      },
      {
        heading: 'Result',
        body: 'Managers now catch moisture spikes within the hour instead of days later, and we maintain the hardware on a quarterly service visit.',
      },
    ],
  },
  {
    slug: 'kavre-cooperative-digital-transformation',
    category: 'Consulting',
    year: '2022–2023',
    title: 'End-to-end digital rollout for a farming cooperative',
    client: 'Kavre Farmers Cooperative',
    location: 'Kavrepalanchok, Nepal',
    summary:
      'A phased transformation — from first sensor to full staff training — bringing a 200-member cooperative onto a single digital system for records, payments and reporting.',
    stats: [
      { value: '200+', label: 'Member farmers onboarded' },
      { value: '5', label: 'Systems consolidated into one' },
      { value: '9', label: 'Months, first sensor to full rollout' },
    ],
    sections: [
      {
        heading: 'The problem',
        body: 'Records, payments and yield reporting were spread across five disconnected tools and paper processes, making it hard for the cooperative board to see the full picture.',
      },
      {
        heading: 'What we built',
        body: 'A phased rollout: unified records first, then payment tracking, then yield and quality reporting — with staff training built into every phase rather than bolted on at the end.',
      },
      {
        heading: 'Result',
        body: 'The board now reviews a single monthly report instead of reconciling five sources, and new staff are productive on the system within a day of training.',
      },
    ],
  },
]

export function getProjectBySlug(slug) {
  return projects.find((project) => project.slug === slug)
}
