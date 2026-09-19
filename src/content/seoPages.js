/**
 * Content for the SEO landing pages:
 *
 *   /training                  -> trainingHub
 *   /training/<slug>           -> destinations[]   (one page per country)
 *   /hire-herd-managers        -> employersPage
 *   /agritech-solutions        -> agritechPage
 *
 * This file is plain JS (no JSX, no Vite-only APIs) on purpose: the React
 * pages render from it, and scripts/generate-sitemap.js and
 * scripts/prerender-seo-pages.js import it directly in Node. One source of
 * truth means the page a visitor sees and the HTML a crawler receives can
 * never drift apart.
 *
 * EDITING RULES
 *  - Only state things Rubisco can stand behind. Fees, course length,
 *    eligibility rules and visa outcomes are deliberately NOT stated here.
 *    When you have confirmed facts, add them (see the "ADD WHEN CONFIRMED"
 *    notes in README-SEO-PAGES.md) -- structured data must match the visible
 *    page, so never put a number in one place and not the other.
 *  - `relatedPosts` are blog slugs. The React page skips any slug that isn't
 *    a published post, so a renamed or unpublished post never breaks a page.
 */

// ---------------------------------------------------------------------------
// Shared curriculum. Every module below is drawn from topics already covered
// in the blog (milking/CIP, pasture, calving/calves, herd health, machinery
// safety, farm English, herd technology, effluent, forage).
// ---------------------------------------------------------------------------
export const TRAINING_MODULES = {
  milking: {
    title: 'Milking parlour operations',
    summary:
      'Rotary, herringbone and swing-over parlours: teat preparation, foremilk checks, cluster attachment, post-milking dip, CIP wash cycles and milk-quality compliance.',
  },
  pasture: {
    title: 'Pasture and feed management',
    summary:
      'Plate metering, daily break allocation, rotation planning and TMR wagon loading, so cows are fed accurately and pasture is used well.',
  },
  calving: {
    title: 'Calving and calf rearing',
    summary:
      'Colostrum management, automated calf feeders, neonatal scours treatment and basic obstetric assistance.',
  },
  herdHealth: {
    title: 'Herd health and biosecurity',
    summary:
      'Preventive care, lameness and mastitis awareness, transition-cow monitoring and biosecurity routines.',
  },
  machinery: {
    title: 'Machinery and workplace safety',
    summary:
      'Daily tractor checks, safe PTO shaft operation, loader and feed-wagon handling, basic hydraulic maintenance and zero-accident habits.',
  },
  english: {
    title: 'Farm English and SOPs',
    summary:
      'Reading standard operating procedures and safety signs, keeping logs, and clear communication at shift handovers.',
  },
  tech: {
    title: 'Herd technology and records',
    summary:
      'RFID identification, activity collars, automated drafting and herd software: recording events accurately and acting on the data.',
  },
  environment: {
    title: 'Effluent, soil and environmental compliance',
    summary:
      'Effluent storage and nutrient recycling, soil health and the record-keeping that environmental rules require.',
  },
  forage: {
    title: 'Forage and silage quality',
    summary:
      'Silage pit management, feed-face protocols and forage conservation that protect feed quality through winter.',
  },
}

// Shown on every destination page as the honest "what we do / don't do" box.
export const PROMISE_NOTE = {
  heading: 'What we do, and what we do not',
  body: [
    'We train you in practical dairy skills and introduce trained candidates to employers. We do not issue visas, and we cannot guarantee a job offer: those decisions belong to employers and to the destination country\u2019s immigration authority.',
    'Before you commit to any training programme or recruiter, ask for a written breakdown of every cost. Never pay anyone for a promise of a job.',
  ],
}

const DESTINATION_OPTIONS = ['New Zealand', 'Austria', 'Canada', 'Ireland', 'Not sure yet']

// ---------------------------------------------------------------------------
// Destination pages  ->  /training/<slug>
// ---------------------------------------------------------------------------
export const destinations = [
  {
    slug: 'new-zealand',
    name: 'New Zealand',
    seoTitle: 'Dairy Farm Training for New Zealand',
    seoDescription:
      'Hands-on dairy farm training for a career in New Zealand: pasture management, spring calving, milking and farm safety. Enquire with Rubisco.',
    h1: 'Practical dairy farm training for New Zealand',
    tagline: 'Grass, seasons and calving weeks',
    cardSummary:
      'Pasture-based, seasonal-calving systems where grazing decisions and reliable milking come first.',
    intro:
      'New Zealand dairy farms run on grass, seasons and teamwork. Our practical training prepares candidates for that rhythm: early starts, intensive calving weeks, disciplined grazing and safe, consistent milking.',
    systemHeading: 'How dairy farming works in New Zealand',
    system: [
      'Most New Zealand dairy farms are pasture-based. Cows graze outdoors for much of the year, herds calve in a compressed spring season, and milking happens in herringbone or rotary sheds. Farm teams are expected to combine animal care, grazing decisions and machinery work in the same day.',
      'That is why pasture allocation, calving and calf rearing, and dependable milking routines are the skills that matter first.',
    ],
    priorityModules: [
      { id: 'pasture', why: 'Daily grazing breaks and rotation decisions drive feed supply when cows eat mostly grazed grass.' },
      { id: 'calving', why: 'Seasonal calving packs most births into a few demanding weeks, so calf care has to be second nature.' },
      { id: 'milking', why: 'Rotary and herringbone sheds reward speed only when hygiene and technique stay consistent.' },
      { id: 'machinery', why: 'Tractors and loaders are part of everyday work, and safe habits have to be automatic.' },
      { id: 'english', why: 'English is the working language, so SOPs, safety signs and herd records must be easy to read and write.' },
    ],
    dayHeading: 'What a working day can involve',
    day: [
      'Early-morning milking starts and split shifts',
      'Moving cows to fresh pasture and checking fences and water',
      'Calf feeding, health checks and record-keeping',
      'Machinery checks and safe operation of tractors and loaders',
    ],
    languageNote:
      'English is the working language on New Zealand farms, which is why farm English is part of the training.',
    pathwayNote:
      'Work-visa rules, skill lists and employer requirements for New Zealand are set by the New Zealand government and change regularly. Check the official source before you plan.',
    official: { label: 'New Zealand Immigration', url: 'https://www.immigration.govt.nz' },
    faqs: [
      {
        q: 'What does dairy farm training for New Zealand include?',
        a: 'Practical modules in milking parlour operations, pasture and feed management, calving and calf rearing, herd health, machinery safety and farm English, with extra emphasis on pasture and seasonal calving.',
      },
      {
        q: 'Why does pasture management matter so much for New Zealand farms?',
        a: 'Because most farms feed cows mainly from grazed grass, allocating the right area each day directly affects milk production and animal condition.',
      },
      {
        q: 'Can Rubisco promise me a visa or a job in New Zealand?',
        a: 'No. We train you and introduce trained candidates to employers, but visas are decided by the New Zealand immigration authority and job offers by employers.',
      },
      {
        q: 'Can a New Zealand farm hire candidates through Rubisco?',
        a: 'Yes. Farm owners and managers can send a request through our employer page and describe the roles they need.',
      },
    ],
    relatedPosts: [
      'precision-pasture-allocations-plate-metering-break-fencing',
      'pasture-grazing-management-rotation-planning',
      'spring-calving-resilience-stamina-work-ethic-shift-discipline',
      'calving-management-obstetrics-newborn-care',
    ],
  },

  {
    slug: 'ireland',
    name: 'Ireland',
    seoTitle: 'Dairy Farm Training for Ireland',
    seoDescription:
      'Practical dairy farm training for working in Ireland: grass-based grazing, spring calving, milking hygiene and effluent management. Enquire with Rubisco.',
    h1: 'Practical dairy farm training for Ireland',
    tagline: 'Grass-based, spring-calving family farms',
    cardSummary:
      'Grass-based, largely spring-calving farms where grazing, calving and environmental compliance all matter.',
    intro:
      'Irish dairying is built on well-managed grass and careful stockmanship. Our training focuses on the skills Irish farms rely on: tight grazing rotations, a demanding spring calving season, high-hygiene milking and responsible effluent handling.',
    systemHeading: 'How dairy farming works in Ireland',
    system: [
      'Irish dairy farming is grass-based and largely spring-calving. Most farms are family-run and milk through herringbone parlours, and wet weather and strict environmental rules shape how the work is planned each week.',
      'That places a premium on grazing rotation, calving and calf care, milking hygiene, and keeping effluent and nutrient records in order.',
    ],
    priorityModules: [
      { id: 'pasture', why: 'Short, well-timed grazing rotations keep grass quality high through a wet growing season.' },
      { id: 'calving', why: 'Spring calving concentrates births into a short window that needs skilled, rested staff.' },
      { id: 'milking', why: 'Herringbone parlour routines depend on teat hygiene, correct cluster attachment and clean-down.' },
      { id: 'environment', why: 'Effluent storage, spreading and nutrient records are part of running a compliant farm.' },
      { id: 'machinery', why: 'Slurry, feed and grass work all involve machinery, so safety habits carry across every task.' },
    ],
    dayHeading: 'What a working day can involve',
    day: [
      'Morning and evening milking with strict teat hygiene',
      'Moving cows to the next paddock and monitoring grass covers',
      'Calf feeding and health checks during the calving season',
      'Machinery work and keeping effluent and herd records up to date',
    ],
    languageNote:
      'English is the working language on Irish farms, and farm English is part of the training.',
    pathwayNote:
      'Visa and employment-permit requirements for Ireland are set by the Irish authorities and change over time. Check the official source before you plan.',
    official: { label: 'Irish immigration service', url: 'https://www.irishimmigration.ie' },
    faqs: [
      {
        q: 'What is included in dairy training for working in Ireland?',
        a: 'Milking parlour operations, pasture management, calving and calf rearing, herd health, effluent and environmental compliance, machinery safety and farm English.',
      },
      {
        q: 'Why is effluent management part of the training?',
        a: 'Irish farms operate under environmental rules covering storage and spreading, so staff who understand nutrient recycling and record-keeping are more useful from their first week.',
      },
      {
        q: 'Does Rubisco guarantee employment or a permit in Ireland?',
        a: 'No. Employers decide who to hire, and the Irish authorities decide on visas and permits. We help you build practical skills and connect trained candidates with employers.',
      },
      {
        q: 'Can an Irish farm request trained staff from Rubisco?',
        a: 'Yes. Farm owners can use our employer page to describe the roles, herd size and start date they have in mind.',
      },
    ],
    relatedPosts: [
      'effluent-management-environmental-compliance',
      'pasture-grazing-management-rotation-planning',
      'milking-parlor-hygiene-mastitis-prevention',
      'calving-management-obstetrics-newborn-care',
    ],
  },

  {
    slug: 'canada',
    name: 'Canada',
    seoTitle: 'Dairy Farm Training for Canada',
    seoDescription:
      'Practical dairy farm training for working in Canada: herd health, calf rearing, milking, farm technology and winter housing. Enquire with Rubisco.',
    h1: 'Practical dairy farm training for Canada',
    tagline: 'Year-round housing, herd health and technology',
    cardSummary:
      'Housed, year-round dairies where herd health, calf care and farm technology set good staff apart.',
    intro:
      'Canadian dairies run all year in demanding winters, often with automation and herd software in daily use. Our training builds the routines that matter there: transition-cow care, calf rearing, clean housing and accurate records.',
    systemHeading: 'How dairy farming works in Canada',
    system: [
      'Many Canadian dairies house cows indoors, milk and calve year-round, and use freestall or tie-stall barns. Automation such as robotic milking and automated calf feeders is increasingly common, and herd software supports daily decisions.',
      'Long winters put a premium on housing hygiene, transition-cow and calf care, and the ability to use herd technology accurately.',
    ],
    priorityModules: [
      { id: 'herdHealth', why: 'Year-round housed herds depend on early detection of lameness, mastitis and metabolic problems.' },
      { id: 'calving', why: 'Calving happens across the year, so calf care and colostrum routines must be reliable in any season.' },
      { id: 'tech', why: 'Herd software, RFID and activity data are only useful if events are recorded correctly.' },
      { id: 'milking', why: 'Consistent milking routines and hygiene protect milk quality in parlour and automated systems alike.' },
      { id: 'machinery', why: 'Cold-weather starts and feed-handling equipment call for careful daily checks and safe operation.' },
    ],
    dayHeading: 'What a working day can involve',
    day: [
      'Milking shifts and udder-health observation',
      'Feeding, bedding and keeping cubicles and pens clean',
      'Calf feeding, colostrum handling and health checks',
      'Recording events in herd software and following farm SOPs',
    ],
    languageNote:
      'English is the working language on most Canadian farms, and French is common in Quebec. Farm English is part of the training.',
    pathwayNote:
      'Immigration programmes and requirements for Canada are set by the Canadian government and change regularly. Check the official source before you plan.',
    official: {
      label: 'Immigration, Refugees and Citizenship Canada',
      url: 'https://www.canada.ca/en/immigration-refugees-citizenship.html',
    },
    faqs: [
      {
        q: 'What does dairy training for Canada focus on?',
        a: 'Herd health and biosecurity, calving and calf rearing, milking, herd technology and records, and machinery safety, with attention to housed, year-round systems.',
      },
      {
        q: 'Why is herd technology part of Canada-focused training?',
        a: 'Many Canadian farms use herd software, identification tags and automation. Staff who record events accurately and understand the data are easier to integrate into those systems.',
      },
      {
        q: 'Can Rubisco arrange a visa or guarantee a job in Canada?',
        a: 'No. Job offers come from employers and immigration decisions from the Canadian authorities. We focus on practical training and introductions to employers.',
      },
      {
        q: 'How can a Canadian dairy request candidates?',
        a: 'Use our employer page to describe your roles, herd size, housing and milking system, and preferred start date.',
      },
    ],
    relatedPosts: [
      'metabolic-disease-prevention-transition-cows',
      'winter-housing-management-cubicle-hygiene',
      'automated-calf-feeding-milk-replacer-rumen-development',
      'data-driven-dairy-rfid-drafting-activity-collars-herd-software',
    ],
  },

  {
    slug: 'austria',
    name: 'Austria',
    seoTitle: 'Dairy Farm Training for Austria',
    seoDescription:
      'Practical dairy farm training for working in Austria: milking hygiene, hoof health, forage quality and machinery safety. Enquire with Rubisco.',
    h1: 'Practical dairy farm training for Austria',
    tagline: 'Family farms, forage and mountain terrain',
    cardSummary:
      'Small to mid-sized, often mountain family farms where forage quality, hoof health and safe machinery work matter.',
    intro:
      'Austrian dairy farms reward careful, hands-on stockmanship. Our training emphasises the fundamentals those farms depend on: clean milking, sound hooves, good forage and safe work on machinery.',
    systemHeading: 'How dairy farming works in Austria',
    system: [
      'Austrian dairy farms are typically small to mid-sized and family-run, many in mountain regions, with a high share of organic production. Forage quality, animal welfare and hoof health are central, and sloping terrain makes tractor safety essential.',
      'Staff who can milk hygienically, spot lameness early, respect forage quality and work safely with machinery are valued on this kind of farm.',
    ],
    priorityModules: [
      { id: 'herdHealth', why: 'Hoof health and early lameness detection matter on housed and grazed herds alike.' },
      { id: 'forage', why: 'Home-grown forage and silage quality underpin milk production through winter.' },
      { id: 'milking', why: 'Hygienic, consistent milking protects udder health and milk quality on family-run farms.' },
      { id: 'machinery', why: 'Slopes and narrow tracks raise the stakes for tractor checks and safe PTO and loader use.' },
      { id: 'english', why: 'Clear communication and reading procedures are the base for the German learning candidates will need.' },
    ],
    dayHeading: 'What a working day can involve',
    day: [
      'Milking and observing udder and hoof health',
      'Feeding forage and managing the feed face',
      'Cleaning housing and looking after calves and youngstock',
      'Careful machinery work on varied terrain',
    ],
    languageNote:
      'German is the working language on most Austrian farms. Candidates should plan to learn German alongside practical training; our training itself builds farm English and communication skills.',
    pathwayNote:
      'Residence and work-permit rules for Austria are set by the Austrian authorities and change over time. Check the official source before you plan.',
    official: { label: 'Austrian migration portal', url: 'https://www.migration.gv.at' },
    faqs: [
      {
        q: 'What does Austria-focused dairy training cover?',
        a: 'Milking hygiene, herd health with a focus on hoof care, forage and silage quality, calf and youngstock care, and machinery safety, plus farm communication skills.',
      },
      {
        q: 'Do I need German to work on an Austrian dairy farm?',
        a: 'German is the working language on most farms, so plan to learn it alongside your practical training. Speak to us about how to combine the two.',
      },
      {
        q: 'Will Rubisco guarantee a job or permit in Austria?',
        a: 'No. Employers decide on hiring and the Austrian authorities decide on permits. Our role is practical training and introductions to employers.',
      },
      {
        q: 'Can an Austrian farm ask Rubisco for trained staff?',
        a: 'Yes. Use our employer page to describe the roles, herd and housing system, and language requirements you have.',
      },
    ],
    relatedPosts: [
      'lameness-prevention-hoof-health-management',
      'silage-quality-forage-conservation',
      'farm-machinery-safety-operations',
      'milking-parlor-hygiene-mastitis-prevention',
    ],
  },
]

// ---------------------------------------------------------------------------
// Training hub  ->  /training
// ---------------------------------------------------------------------------
export const trainingHub = {
  path: '/training',
  seoTitle: 'Dairy Farm Training for Work Abroad',
  seoDescription:
    'Dairy farm training for people aiming to work in New Zealand, Austria, Canada and Ireland: milking, pasture, calving, herd health and machinery safety.',
  eyebrow: 'Training',
  h1: 'Dairy farm training for careers in New Zealand, Austria, Canada and Ireland',
  intro:
    'Rubisco gives aspiring dairy professionals the practical skills international farms look for: milking, pasture and feed, calving and calf care, herd health, machinery safety and farm English. Choose your destination to see what its farms expect.',
  howHeading: 'How training works',
  howSteps: [
    { title: 'Choose a destination', body: 'Each country farms differently. We emphasise the skills its dairies rely on most.' },
    { title: 'Train on practical skills', body: 'Hands-on modules in milking, pasture, calving, herd health, machinery and farm English.' },
    { title: 'Be assessed on the real tasks', body: 'Graduates come through CTEVT-aligned training and NSTB practical assessment.' },
    { title: 'Meet employers', body: 'Trained candidates are introduced to farms that have asked for staff with these skills.' },
  ],
  curriculumHeading: 'The core curriculum',
  curriculumIntro:
    'The same practical foundation underpins every destination. What changes from country to country is the emphasis.',
  faqs: [
    {
      q: 'Which countries does Rubisco train candidates for?',
      a: 'New Zealand, Austria, Canada and Ireland. Each has its own page describing how dairy farming works there and which skills we emphasise.',
    },
    {
      q: 'Is the training practical or classroom-based?',
      a: 'It is practical first. Candidates work on real dairy tasks such as milking, calf feeding, pasture allocation and machinery checks, supported by the theory behind them.',
    },
    {
      q: 'Can Rubisco guarantee a visa or a job abroad?',
      a: 'No. Visa decisions belong to each country\u2019s immigration authority and hiring decisions to employers. We train you and introduce trained candidates to employers.',
    },
    {
      q: 'I am not sure which country suits me. What should I do?',
      a: 'Read the destination pages, then send an enquiry and choose "Not sure yet". Tell us your experience and goals and we will point you to the best fit.',
    },
  ],
  relatedPosts: [
    'ctevt-certified-dairy-workforce-skill-standards-placement',
    'inside-ctevt-practical-exam-nstb-milking-calf-audits',
    'farm-english-communication-sops-safety-signs-logs',
  ],
}

// ---------------------------------------------------------------------------
// Training enquiry form (hub + every destination page)
// ---------------------------------------------------------------------------
export function trainingForm(defaultDestination = '') {
  return {
    intent: 'Training enquiry',
    heading: 'Ask about training',
    intro:
      'Tell us where you want to work and what farm experience you have. We reply with next steps, not a sales pitch.',
    submitLabel: 'Send enquiry',
    messageLabel: 'Anything else we should know?',
    messageRequired: false,
    showOrganisation: false,
    fields: [
      { name: 'phone', label: 'Phone or WhatsApp', type: 'text', autoComplete: 'tel', required: false },
      {
        name: 'destination',
        label: 'Destination you are interested in',
        type: 'select',
        options: DESTINATION_OPTIONS,
        required: true,
        default: defaultDestination,
      },
      {
        name: 'experience',
        label: 'Farm experience',
        type: 'select',
        options: ['No farm experience yet', 'Some farm experience', 'Experienced dairy worker'],
        required: true,
      },
    ],
  }
}

// ---------------------------------------------------------------------------
// Employers page  ->  /hire-herd-managers
// ---------------------------------------------------------------------------
export const employersPage = {
  path: '/hire-herd-managers',
  seoTitle: 'Hire Trained Dairy Farm Staff & Herd Managers',
  seoDescription:
    'Hire trained dairy farm staff and herd managers from Nepal for farms in New Zealand, Austria, Canada and Ireland. No placement fee for employers.',
  eyebrow: 'For dairy employers',
  h1: 'Hire trained dairy farm staff and herd managers, with no placement fee',
  intro:
    'Rubisco connects dairy farms in New Zealand, Austria, Canada and Ireland directly with practically trained, skill-assessed dairy professionals from Nepal. You describe the role; we prepare and vet candidates against it.',
  highlights: [
    {
      title: 'No placement fee for employers',
      body: 'We do not charge hiring employers placement or commission fees.',
    },
    {
      title: 'Skills assessed, not just listed',
      body: 'Graduates come through CTEVT-aligned training and NSTB practical assessment.',
    },
    {
      title: 'See it before you sign',
      body: 'Ask for live video practical audits or farm-specific skill tests before contracts are signed.',
    },
    {
      title: 'Trained to your routines',
      body: 'Your parlour software, herd protocols and machinery routines can be built into late-stage training.',
    },
  ],
  specHeading: 'Skill specification',
  specIntro:
    'These are the competency areas candidates are trained and assessed in. Tell us which matter most on your farm and we will prioritise them.',
  spec: [
    {
      area: 'Milking operations',
      detail: 'Rotary, herringbone and swing-over parlours; teat hygiene, foremilk checks, CIP cycles and milk-quality compliance.',
    },
    {
      area: 'Pasture and feeding',
      detail: 'Plate metering, daily break allocation, rotation calculation and TMR wagon loading.',
    },
    {
      area: 'Calf rearing and health',
      detail: 'Colostrum management, automated feeders, neonatal scours treatment and basic obstetric assistance.',
    },
    {
      area: 'Herd health and records',
      detail: 'Preventive care, heat and health observation, lameness awareness, and recording events in herd software.',
    },
    {
      area: 'Machinery and safety',
      detail: 'Daily tractor checks, PTO safety, loaders and feed wagons, basic hydraulic maintenance and biosecurity.',
    },
    {
      area: 'Communication and SOPs',
      detail: 'Farm English, reading SOPs and safety signs, logging and shift handovers.',
    },
  ],
  rolesHeading: 'Roles we can help you fill',
  roles: [
    'Herd manager or assistant herd manager',
    'Milker or dairy technician',
    'Calf rearer',
    'Pasture and feed operator',
    'Machinery operator',
  ],
  rolesNote:
    'Herd-manager roles normally call for experience. Tell us the level you need and we will say plainly what we can supply.',
  processHeading: 'How hiring works',
  process: [
    { title: 'Tell us the role', body: 'Positions, herd size, milking and housing system, language needs and start date.' },
    { title: 'We shortlist and vet', body: 'Candidates are matched to your brief using their training and assessment record.' },
    { title: 'You verify the skills', body: 'Request live video practical audits or custom skill tests before you decide.' },
    { title: 'Contracts and documents', body: 'Candidates sign directly with your farm. We support documentation; the destination\u2019s authorities decide on visas and permits.' },
  ],
  destinationsHeading: 'Where we can supply candidates',
  partnershipHeading: 'Partnership options',
  partnerships: [
    {
      title: 'Direct hiring for one farm or group',
      body: 'A single point of contact, one brief, and candidates prepared for your operation.',
    },
    {
      title: 'Recruitment agencies and farm groups',
      body: 'We work with agencies and groups that want a dependable source of trained dairy candidates.',
    },
    {
      title: 'Custom pre-departure training',
      body: 'Build your SOPs, parlour software and machinery routines into the final stage of candidate training.',
    },
  ],
  faqs: [
    {
      q: 'Do employers pay a placement fee to Rubisco?',
      a: 'No. Rubisco does not charge hiring employers placement or commission fees.',
    },
    {
      q: 'How are candidates\u2019 skills verified?',
      a: 'Candidates are trained to CTEVT-aligned standards and practically assessed under NSTB. Employers can also request live video practical audits or custom skill tests before signing.',
    },
    {
      q: 'Can you supply experienced herd managers?',
      a: 'It depends on the level you need. Herd-manager roles usually require experience, so tell us your requirements and we will be straightforward about what we can and cannot supply.',
    },
    {
      q: 'Who handles visas and work permits?',
      a: 'The employer and candidate go through the destination country\u2019s official process. We support the documentation, but outcomes are decided by the immigration authority.',
    },
    {
      q: 'How quickly can candidates start?',
      a: 'It depends on the role, the stage of training and visa processing in your country. Send us the details and we will give you an honest estimate.',
    },
  ],
  relatedPosts: [
    'zero-fee-placement-advantage-direct-institutional-hiring',
    'ctevt-certified-dairy-workforce-skill-standards-placement',
    'inside-ctevt-practical-exam-nstb-milking-calf-audits',
    'spring-calving-resilience-stamina-work-ethic-shift-discipline',
  ],
  form: {
    intent: 'Employer enquiry',
    heading: 'Request candidates',
    intro:
      'Describe the roles you need. We reply with next steps, not a sales pitch.',
    submitLabel: 'Request candidates',
    messageLabel: 'Anything else about the roles or your farm?',
    messageRequired: false,
    showOrganisation: true,
    fields: [
      {
        name: 'country',
        label: 'Farm location',
        type: 'select',
        options: ['New Zealand', 'Austria', 'Canada', 'Ireland', 'Other'],
        required: true,
      },
      { name: 'roles', label: 'Roles and number of positions', type: 'text', placeholder: 'e.g. 2 milkers, 1 assistant herd manager', required: true },
      { name: 'herd', label: 'Herd size and system', type: 'text', placeholder: 'e.g. 400 cows, pasture-based, rotary parlour', required: false },
      { name: 'start', label: 'Ideal start date', type: 'text', placeholder: 'e.g. before August calving', required: false },
    ],
  },
}

// ---------------------------------------------------------------------------
// AgriTech page  ->  /agritech-solutions
// ---------------------------------------------------------------------------
export const agritechPage = {
  path: '/agritech-solutions',
  seoTitle: 'Agro-OS Dairy Software, Sensors & Smart Farming',
  seoDescription:
    'Rubisco builds Agro-OS dairy enterprise software, IoT precision sensors and smart farming tools for dairy and grain farms. Partner or invest with us.',
  eyebrow: 'AgriTech',
  h1: 'Agro-OS: an operating system for dairy enterprises',
  intro:
    'Rubisco builds the software, sensors and automation that dairy and grain farms run on: offline-first, Nepali-language and maintained long after installation. We are looking for technology partners, distributors and investors who want to help it scale.',
  appName: 'Rubisco Agro-OS',
  appDescription:
    'Dairy enterprise software for herd, pasture and yield management that works offline and syncs when connectivity allows, with Nepali and English interfaces.',
  features: [
    'Herd, pasture and yield records',
    'Offline-first data entry with background sync',
    'Nepali-first interface with English available',
    'Sensor data and alerts for farm teams',
  ],
  pillarsHeading: 'Three connected products',
  pillars: [
    {
      number: '01',
      title: 'Agro-OS software',
      body: 'Herd, pasture and yield systems built for how a farm actually runs, not a generic dashboard bolted on afterwards. Data is written to the device first and syncs in the background.',
    },
    {
      number: '02',
      title: 'IoT precision sensors',
      body: 'Monitoring hardware we design, source, install and keep running, feeding readings and alerts into the same system farm teams already use.',
    },
    {
      number: '03',
      title: 'Smart farming tools',
      body: 'Automation and decision support for breeding, health, feed and pasture, turning farm data into the next action for the person on the ground.',
    },
  ],
  principlesHeading: 'Why it is built this way',
  principles: [
    {
      title: 'Offline is the default',
      body: 'Connectivity on a working farm is unreliable by nature, so we design for that first rather than treating it as an edge case.',
      post: 'what-offline-first-actually-means-on-a-farm',
    },
    {
      title: 'Nepali first, English second',
      body: 'Designing for the person who uses the system every day changes units, labels and layouts. English follows for owners, partners and reviewers.',
      post: 'why-we-build-in-nepali-first',
    },
    {
      title: 'Sensors are the easy part',
      body: 'Hardware is only useful if it is installed well, maintained and connected to decisions. That is where we spend our effort.',
      post: 'sensors-are-the-easy-part',
    },
  ],
  fitHeading: 'Who it is for',
  fit: [
    'Cooperatives and private dairies',
    'Grain storage and mixed farming operations',
    'Farm groups and programmes that need reliable data from the field',
  ],
  workforceHeading: 'A people advantage',
  workforceBody:
    'Rubisco also trains dairy professionals and introduces them to employers. That gives us direct contact with the people who use farm technology every day, and a view of what it takes for software and sensors to work in practice.',
  partnerHeading: 'Partner or invest',
  partnerTracks: [
    {
      title: 'Investors',
      body: 'If you back agritech and want to understand where Rubisco is headed, tell us about your focus and we will reply with next steps.',
    },
    {
      title: 'Technology and distribution partners',
      body: 'Hardware makers, integrators and distributors who want to bring reliable farm technology to more operations.',
    },
    {
      title: 'Cooperatives, farm groups and programmes',
      body: 'Organisations that want to digitise herd or field operations across many farms.',
    },
  ],
  faqs: [
    {
      q: 'What is Agro-OS?',
      a: 'Agro-OS is Rubisco\u2019s software for running a dairy enterprise: herd, pasture and yield records that work offline, with sensor data and alerts alongside.',
    },
    {
      q: 'Does it work without an internet connection?',
      a: 'Yes. Offline is the default design assumption. Records are written to the device first and sync when connectivity is available.',
    },
    {
      q: 'What does Rubisco do beyond software?',
      a: 'We design, source, install and maintain IoT sensors and monitoring hardware, and we work on automation and decision tools for dairy and grain operations.',
    },
    {
      q: 'How do I explore an investment or partnership?',
      a: 'Use the form below and tell us who you are and what you have in mind. We reply with next steps, not a sales pitch.',
    },
    {
      q: 'Where is Rubisco based?',
      a: 'Rubisco is registered in Bhaktapur, Nepal, with field operations based out of Sindhuli.',
    },
  ],
  form: {
    intent: 'Partnership / investor enquiry',
    heading: 'Start a conversation',
    intro:
      'Tell us who you are and what you have in mind. We reply with next steps, not a sales pitch.',
    submitLabel: 'Send enquiry',
    messageLabel: 'What would you like to explore?',
    messageRequired: true,
    showOrganisation: true,
    fields: [
      {
        name: 'role',
        label: 'I am a',
        type: 'select',
        options: [
          'Investor',
          'Technology or hardware partner',
          'Distributor or reseller',
          'Cooperative or farm group',
          'NGO or government programme',
          'Other',
        ],
        required: true,
      },
    ],
  },
  relatedPosts: [
    'automated-dairy-tech-precision-herd-management',
    'how-to-build-a-modern-dairy-farm-from-scratch-the-complete-tech-infrastructure-checklist',
    'what-offline-first-actually-means-on-a-farm',
  ],
}

// Every path the sitemap and prerender step need to know about.
export const SEO_PAGE_PATHS = [
  trainingHub.path,
  ...destinations.map((d) => `/training/${d.slug}`),
  employersPage.path,
  agritechPage.path,
]
