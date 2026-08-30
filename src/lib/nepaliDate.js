// Bikram Sambat helpers shared by the invoice API (functions/) and the
// admin UI (src/). Uses @sbmdkl/nepali-date-converter for the actual
// calendar math rather than a hand-rolled conversion table: BS/AD
// conversion depends on a year-by-year lookup table with no closed-form
// formula, and getting even one row of that table wrong is exactly the
// kind of silent error you don't want in a tax document. A maintained,
// tested package is the right call here — do not replace this with a
// hand-written table.
//
// IMPORTANT: verify with `npm install` in your own dev environment (this
// sandbox has no network access to install/test packages) and sanity-check
// a few known BS/AD pairs before relying on this in production, e.g.
// 2023-04-14 AD == 2080-01-01 BS (Nepali New Year).
import { adToBs, bsToAd } from '@sbmdkl/nepali-date-converter'

/** '2025-08-30' (AD) -> '2082-05-14' (BS), zero-padded. */
export function adDateToBs(adDateStr) {
  const result = adToBs(adDateStr) // library returns { year, month, day } (see README)
  return `${result.year}-${String(result.month).padStart(2, '0')}-${String(result.day).padStart(2, '0')}`
}

/** '2082-05-14' (BS) -> '2025-08-30' (AD), zero-padded. */
export function bsDateToAd(bsDateStr) {
  const result = bsToAd(bsDateStr)
  return `${result.year}-${String(result.month).padStart(2, '0')}-${String(result.day).padStart(2, '0')}`
}

// Nepali government fiscal year runs Shrawan 1 -> Ashadh end (BS months
// 4 through 3-of-next-year). BS month numbering: 1 Baisakh ... 4 Shrawan
// ... 12 Chaitra.
const FISCAL_YEAR_START_BS_MONTH = 4

/**
 * Given a BS date string 'YYYY-MM-DD', return the fiscal year label used
 * in invoice numbers, e.g. "83-84" for anything from Shrawan 2083
 * through Ashadh 2084.
 */
export function fiscalYearFromBsDate(bsDateStr) {
  const [yearStr, monthStr] = bsDateStr.split('-')
  const year = Number(yearStr)
  const month = Number(monthStr)
  const startYear = month >= FISCAL_YEAR_START_BS_MONTH ? year : year - 1
  const shortStart = String(startYear).slice(-2)
  const shortEnd = String(startYear + 1).slice(-2)
  return `${shortStart}-${shortEnd}`
}

/** Convenience: fiscal year label for "today". */
export function currentFiscalYear() {
  const todayAd = new Date().toISOString().slice(0, 10)
  const todayBs = adDateToBs(todayAd)
  return fiscalYearFromBsDate(todayBs)
}
