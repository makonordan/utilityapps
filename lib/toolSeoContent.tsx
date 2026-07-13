/**
 * Per-tool SEO overrides for tools rendered by the generic catch-all at
 * app/tools/[slug]/page.tsx (Finance, Health, Calculator, Text and SEO
 * Tools — categories that don't have a dedicated category shell). Mirrors
 * the pattern used by lib/pdfFaqs.ts, lib/legalFaqs.ts etc.: a title/H1
 * that carries the exact long-tail keyword, a longer seoContent block for
 * on-page content depth, and real per-tool FAQs (also surfaced as
 * FAQPage JSON-LD by ToolFAQ).
 */

import type { ReactNode } from "react";

import { type FAQItem } from "@/components/tools/ToolFAQ";

export interface ToolSeoOverride {
  /** Used for <title>, og:title and the on-page H1. */
  title: string;
  /** Used for meta description and the paragraph under the H1. */
  description: string;
  seoContent: ReactNode;
  faqItems: FAQItem[];
}

export const TOOL_SEO_CONTENT: Record<string, ToolSeoOverride> = {
  // ============================================================ Finance
  "loan-calculator": {
    title: "Free Loan Calculator — Monthly Payment & Amortization Schedule",
    description:
      "Calculate monthly loan payments, total interest, and a full amortization schedule for personal, auto, student, or business loans — free, instant, no signup.",
    seoContent: (
      <article>
        <h2>How the monthly payment is calculated</h2>
        <p>
          The calculator uses the standard amortizing-loan formula, which turns your principal,
          annual interest rate, and loan term into a fixed monthly payment. Each payment is split
          between interest (larger at the start of the loan) and principal (larger toward the
          end) — that split is what the amortization schedule shows month by month.
        </p>
        <h2>Why the amortization schedule matters</h2>
        <p>
          Two loans with the same monthly payment can cost very different amounts in total
          interest depending on the term. A 5-year auto loan and a 7-year auto loan at the same
          rate might have payments $80 apart but thousands of dollars apart in lifetime interest —
          the schedule makes that trade-off visible instead of hidden in the payment number alone.
        </p>
        <h2>Comparing loan offers</h2>
        <p>
          When comparing quotes from different lenders, line up the APR (not just the interest
          rate — APR includes fees), the term, and any prepayment penalty. Run each offer through
          the calculator with its real APR to see the true monthly payment and total cost side by
          side, rather than trusting the lender&rsquo;s advertised rate alone.
        </p>
        <h2>Why use UtilityApps for this</h2>
        <p>
          The calculator runs entirely in your browser — the loan amount, rate, and term you enter
          are never sent to a server or stored anywhere. No signup, no email wall, no ads blocking
          the numbers you came for.
        </p>
      </article>
    ),
    faqItems: [
      {
        q: "How is my monthly loan payment calculated?",
        a: "Using the standard amortization formula: monthly payment = P × [r(1+r)^n] / [(1+r)^n − 1], where P is principal, r is the monthly interest rate, and n is the number of payments. The calculator does this instantly as you adjust any input.",
      },
      {
        q: "What loan types can I use this for?",
        a: "Any fixed-rate installment loan — personal loans, auto loans, student loans, business loans, and equipment financing. For a mortgage specifically, the dedicated Mortgage Calculator adds property tax, insurance, and PMI to the payment.",
      },
      {
        q: "Does it show a full amortization schedule?",
        a: "Yes — a payment-by-payment breakdown of how much of each payment goes to interest versus principal, and the remaining balance after each payment, which you can review for the full loan term.",
      },
      {
        q: "Can I compare different rates or terms side by side?",
        a: "Change the rate, term, or amount and the results update instantly, so you can try several scenarios back-to-back and compare total interest paid across each one.",
      },
      {
        q: "Does the calculator account for extra or early payments?",
        a: "The base schedule assumes the fixed monthly payment; if you want to see the effect of extra payments on payoff time, you can adjust the term shorter to approximate an accelerated payoff and compare total interest.",
      },
      {
        q: "Is my loan information stored or sent anywhere?",
        a: "No. All calculations happen locally in your browser. Nothing you type — loan amount, rate, or term — is transmitted to a server or saved.",
      },
    ],
  },

  "mortgage-calculator": {
    title: "Mortgage Calculator with Amortization Schedule — PITI & Affordability",
    description:
      "Estimate your full monthly mortgage payment — principal, interest, property tax, insurance and PMI — plus an amortization schedule and affordability check.",
    seoContent: (
      <article>
        <h2>What PITI actually includes</h2>
        <p>
          Your real monthly housing cost is rarely just principal and interest. PITI stands for
          Principal, Interest, Taxes, and Insurance — and this calculator adds property tax and
          homeowners insurance on top of the loan payment itself, plus PMI (private mortgage
          insurance) if your down payment is under 20%, and optional HOA fees. That&rsquo;s the number
          that actually shows up in your monthly budget.
        </p>
        <h2>15-year vs 30-year: the real trade-off</h2>
        <p>
          A 15-year mortgage carries a higher monthly payment but a meaningfully lower interest
          rate and far less total interest over the life of the loan — often less than half of
          what a 30-year term costs on the same principal. A 30-year term lowers the monthly
          payment and frees up cash flow, at the cost of paying more interest overall. Run both
          terms through the calculator to see the exact dollar trade-off for your numbers.
        </p>
        <h2>Affordability and debt-to-income</h2>
        <p>
          Lenders typically want your total monthly debt payments (mortgage plus other debts) to
          stay under roughly 36–43% of gross monthly income, and housing costs alone under about
          28%. The calculator&rsquo;s affordability check uses your income and existing debt to flag
          whether a given home price fits comfortably within those common guidelines.
        </p>
        <h2>Why use UtilityApps for this</h2>
        <p>
          Everything runs in your browser — your income, home price, and down payment never leave
          your device. No signup, no lead-generation form to a mortgage broker, just the numbers.
        </p>
      </article>
    ),
    faqItems: [
      {
        q: "How is my monthly mortgage payment (PITI) calculated?",
        a: "It combines four parts: principal and interest (amortized over your loan term at your rate), 1/12th of your annual property tax, 1/12th of your annual homeowners insurance, and PMI if your down payment is below 20%. HOA fees are added if you include them.",
      },
      {
        q: "What's the real difference between a 15-year and 30-year term?",
        a: "A 15-year loan has a higher monthly payment but usually a lower rate and dramatically less total interest paid. A 30-year loan lowers your monthly payment and improves cash flow but costs more in interest over the loan's life. Compare both terms with your actual numbers to see the exact difference.",
      },
      {
        q: "Does the calculator include PMI?",
        a: "Yes — if your down payment is less than 20% of the home price, an estimated PMI amount is added to your monthly payment, since that's what most conventional lenders require until you reach 20% equity.",
      },
      {
        q: "How is affordability determined?",
        a: "The calculator compares your estimated monthly payment against your gross income and existing monthly debts using standard debt-to-income (DTI) guidelines lenders commonly use, so you can see whether a price range looks affordable before you apply.",
      },
      {
        q: "Can I see or download a full amortization schedule?",
        a: "Yes — a month-by-month breakdown of principal, interest, and remaining balance across the entire loan term, viewable on the page.",
      },
      {
        q: "Does it work for homes outside the US?",
        a: "The inputs (price, down payment, rate, term, tax, insurance) are generic enough to model a mortgage in most countries, though specific rules like PMI thresholds and typical tax rates are US-oriented — adjust the tax and insurance fields to match your local market.",
      },
      {
        q: "Is my financial information private?",
        a: "Yes. The calculator runs client-side — your home price, income, and loan details are never uploaded or stored on a server.",
      },
    ],
  },

  "tax-calculator": {
    title: "Free Income Tax Calculator — Estimate Federal & State Tax by Country",
    description:
      "Estimate federal, state, and local income tax and take-home pay for the US, UK, Canada, and EU countries, using current published bracket data.",
    seoContent: (
      <article>
        <h2>How the estimate is built</h2>
        <p>
          The calculator applies your country&rsquo;s published progressive tax brackets to your gross
          income, then layers on standard deductions or personal allowances, common credits, and —
          for the US — state and self-employment tax where applicable. Progressive brackets mean
          only the income within each bracket is taxed at that bracket&rsquo;s rate, not your entire
          income at your top rate — a detail this tool applies correctly behind the scenes.
        </p>
        <h2>Why your real tax rate looks lower than your bracket</h2>
        <p>
          People often quote their &ldquo;tax bracket&rdquo; as if it applies to their whole income, but your
          effective tax rate (total tax ÷ total income) is almost always lower than your marginal
          bracket, because only the top slice of income is taxed at that top rate. The calculator
          shows both numbers so you can see the difference clearly.
        </p>
        <h2>What this estimate can&rsquo;t capture</h2>
        <p>
          Every jurisdiction has itemized deductions, credits, and edge cases (dependents,
          investment income, business deductions) that a general calculator can&rsquo;t fully model.
          Treat the result as a solid planning estimate, not a substitute for a tax professional or
          official filing software when you actually file.
        </p>
        <h2>Why use UtilityApps for this</h2>
        <p>
          Your income figures are calculated locally in your browser and never transmitted or
          stored — no signup, no account, and nothing tied to your identity.
        </p>
      </article>
    ),
    faqItems: [
      {
        q: "Which countries does this tax calculator support?",
        a: "The US (federal plus state), UK, Canada, Germany, France, and several other EU countries, each using that country's published bracket structure and standard deduction or personal allowance.",
      },
      {
        q: "Is this an official or exact tax filing calculation?",
        a: "No — it's a planning estimate using current published brackets and standard deductions. It doesn't account for itemized deductions, tax credits specific to your situation, or investment/business income edge cases. Use official filing software or a tax professional for your actual return.",
      },
      {
        q: "What's the difference between my tax bracket and my effective tax rate?",
        a: "Your bracket is the marginal rate applied only to income within that bracket's range. Your effective rate is your total tax divided by your total income — almost always lower than your top bracket, because progressive systems only tax the top slice at the top rate.",
      },
      {
        q: "Does it include state or provincial tax?",
        a: "Yes for the US (state income tax by state) and Canada (federal plus provincial), where applicable. Some US states have no income tax, which the calculator reflects automatically.",
      },
      {
        q: "Is self-employment tax included?",
        a: "Yes, for US self-employment income — the calculator adds the self-employment tax (Social Security and Medicare) on top of standard federal income tax.",
      },
      {
        q: "How current is the bracket data?",
        a: "Brackets and standard deductions are updated for each new tax year as governments publish them. Because rules change annually, always confirm figures for critical decisions against your government's official tax authority site.",
      },
      {
        q: "Is my income information kept private?",
        a: "Yes — everything is calculated in your browser. Your income and filing details are never sent to a server or logged.",
      },
    ],
  },

  "salary-calculator": {
    title: "Salary Calculator After Tax — Take-Home Pay Calculator",
    description:
      "Convert between hourly, weekly, monthly, and annual pay and estimate real take-home pay after tax, across the US, UK, Canada, and EU currencies.",
    seoContent: (
      <article>
        <h2>Gross pay vs. take-home pay</h2>
        <p>
          The headline salary in a job offer is gross pay — before income tax, payroll taxes
          (Social Security/National Insurance), and any benefits deductions. Take-home pay (net
          pay) is what actually lands in your bank account. This calculator converts a gross figure
          in any pay period into hourly, weekly, biweekly, monthly, and annual equivalents, then
          estimates the net amount after typical withholding for your country.
        </p>
        <h2>Comparing job offers on equal footing</h2>
        <p>
          A $65,000 salary and a $32/hour rate aren&rsquo;t directly comparable until you know the hours
          — 40 hours a week at $32/hour is about $66,560/year before overtime. Converting every
          offer to the same annual, after-tax basis is the only fair way to compare a salaried role
          against an hourly one, or offers across different countries and currencies.
        </p>
        <h2>Overtime and benefits adjustments</h2>
        <p>
          For hourly roles, overtime pay (commonly time-and-a-half past 40 hours in the US) changes
          your effective annual pay significantly if it&rsquo;s a regular part of the job. The calculator
          lets you factor in expected overtime and the estimated cost of benefits so the final
          number reflects what you&rsquo;d actually take home, not just the sticker rate.
        </p>
        <h2>Why use UtilityApps for this</h2>
        <p>
          Your salary figures are calculated locally in your browser — nothing is uploaded, stored,
          or tied to an account. No signup required to convert or compare pay.
        </p>
      </article>
    ),
    faqItems: [
      {
        q: "How do I convert an hourly rate to an annual salary?",
        a: "Enter your hourly rate and typical hours per week; the calculator multiplies by 52 weeks (adjustable for unpaid time off) to show the annual equivalent, alongside weekly, biweekly, and monthly figures.",
      },
      {
        q: "Does it estimate take-home pay after tax?",
        a: "Yes — it applies an estimated withholding for your selected country (and US state, where relevant) to show a net take-home figure alongside the gross amount, so you can see roughly what actually reaches your bank account.",
      },
      {
        q: "Can it factor in overtime pay?",
        a: "Yes. If your role regularly includes overtime, add expected overtime hours and the calculator applies the standard time-and-a-half (or your custom multiplier) to the annual estimate.",
      },
      {
        q: "Can I compare pay across different currencies?",
        a: "Yes — select the currency and country for each offer you're comparing; conversions use standard exchange-rate logic so you can line up international offers on a common basis.",
      },
      {
        q: "How accurate is the take-home estimate?",
        a: "It's a solid planning estimate based on standard tax brackets and typical payroll deductions, but actual take-home pay varies with benefits elections, retirement contributions, and local tax nuances your employer's payroll system applies.",
      },
      {
        q: "Is my salary information private?",
        a: "Yes — all conversions and estimates run in your browser. Nothing you enter is transmitted to a server or stored.",
      },
    ],
  },

  "currency-converter": {
    title: "Free Currency Converter — Live Exchange Rates for 160+ Currencies",
    description:
      "Convert between 160+ world currencies using live mid-market exchange rates, with historical charts and multi-amount conversion tables.",
    seoContent: (
      <article>
        <h2>Mid-market rate vs. what your bank charges</h2>
        <p>
          The mid-market rate is the midpoint between global buy and sell rates for a currency pair
          — the rate you see quoted on financial news and in this converter. Banks and card
          networks typically add a markup of 2–5% (sometimes more) on top of that rate for actual
          transactions, plus a flat fee. Knowing the true mid-market rate lets you judge how much a
          bank, exchange counter, or card is actually charging you.
        </p>
        <h2>Reading the historical chart</h2>
        <p>
          Exchange rates move with interest rate differentials, inflation data, and macroeconomic
          news. The 30/90/365-day charts show whether a currency pair is trending or holding
          steady, which is useful context before converting a large amount, timing an international
          transfer, or budgeting a multi-month trip.
        </p>
        <h2>Building a multi-currency budget table</h2>
        <p>
          For travel or invoicing across currencies, converting one amount at a time is slow. The
          multi-amount table lets you enter several line items (or a full budget) and see them all
          converted at once, which is faster for trip planning, freelance invoicing, or comparing
          prices across countries.
        </p>
        <h2>Why use UtilityApps for this</h2>
        <p>
          Conversions happen instantly with no signup and no daily limit. We don&rsquo;t add a markup to
          the rate you see — it&rsquo;s the same mid-market rate used across the tool&rsquo;s charts and
          tables.
        </p>
      </article>
    ),
    faqItems: [
      {
        q: "What exchange rate does this converter use?",
        a: "The mid-market rate — the midpoint between global buy and sell prices for the currency pair, refreshed regularly. This is the same reference rate financial institutions use internally, before their markup.",
      },
      {
        q: "How many currencies are supported?",
        a: "160+ world currencies, including all major and most minor currencies, so you can convert between virtually any two countries' currencies in one step.",
      },
      {
        q: "Why is my bank's rate different from the one shown here?",
        a: "Banks, card networks, and exchange counters typically add a markup (often 2–5%) on top of the mid-market rate, plus sometimes a flat fee. The mid-market rate shown here is the baseline before any provider's markup.",
      },
      {
        q: "Can I see historical exchange rate trends?",
        a: "Yes — 30-day, 90-day, and 365-day charts for any currency pair, useful for spotting trends before converting a large amount or timing a transfer.",
      },
      {
        q: "Can I convert multiple amounts or build a budget table?",
        a: "Yes — enter several line items and the tool converts them all at once into your target currency, handy for trip budgets or multi-currency invoices.",
      },
      {
        q: "Is there a limit to how many conversions I can do?",
        a: "No daily limit and no signup required — convert as many amounts as you need.",
      },
    ],
  },

  // ============================================================ Health
  "bmi-calculator": {
    title: "Free BMI Calculator — Body Mass Index (Metric & Imperial)",
    description:
      "Calculate Body Mass Index in metric (kg/cm) or imperial (lb/ft-in) units, with WHO healthy-range categories and ideal weight guidance for adults.",
    seoContent: (
      <article>
        <h2>How BMI is calculated</h2>
        <p>
          BMI is weight divided by height squared (kg/m² in metric, or weight in pounds × 703 ÷
          height in inches squared for imperial). It&rsquo;s a simple screening ratio, not a direct
          measure of body fat — the calculator handles the unit conversion automatically so you can
          enter either metric or imperial values.
        </p>
        <h2>What the WHO categories mean</h2>
        <p>
          The World Health Organization defines standard adult ranges: under 18.5 is underweight,
          18.5–24.9 is a healthy weight range, 25–29.9 is overweight, and 30+ falls into obesity
          classes. These thresholds are population-level screening guidance, not a diagnosis for
          any individual — the calculator shows which range your BMI falls into using these
          published cutoffs.
        </p>
        <h2>Where BMI falls short</h2>
        <p>
          BMI doesn&rsquo;t distinguish muscle from fat, so athletes and very muscular people are often
          classified as &ldquo;overweight&rdquo; despite low body fat. It also doesn&rsquo;t account for fat
          distribution, age, or sex-based body composition differences. It&rsquo;s best used as one data
          point alongside other measures (waist circumference, body fat percentage) rather than a
          standalone health verdict.
        </p>
        <h2>Why use UtilityApps for this</h2>
        <p>
          Your height and weight are calculated locally in your browser and never stored or sent
          anywhere. No signup, and it works offline once the page has loaded.
        </p>
      </article>
    ),
    faqItems: [
      {
        q: "How is BMI calculated?",
        a: "BMI = weight (kg) ÷ height (m)². For imperial units, it's weight (lb) × 703 ÷ height (in)². The calculator does the conversion for you regardless of which unit system you enter.",
      },
      {
        q: "What do the healthy range categories mean?",
        a: "Based on WHO adult thresholds: under 18.5 is underweight, 18.5–24.9 is a healthy range, 25–29.9 is overweight, and 30 and above falls into obesity classes. These are population screening guidelines, not an individual diagnosis.",
      },
      {
        q: "Is BMI accurate for athletes or very muscular people?",
        a: "Not reliably — BMI doesn't distinguish muscle mass from fat mass, so muscular individuals often show a higher BMI despite low body fat. Waist circumference or body-fat percentage are better measures in that case.",
      },
      {
        q: "Does the calculator adjust for age or sex?",
        a: "The standard adult BMI formula and WHO ranges used here are the same across adult ages and both sexes. Growth-chart-based BMI percentiles for children and teens are a different calculation not covered by this tool.",
      },
      {
        q: "Can I use metric and imperial units?",
        a: "Yes — switch between kg/cm and lb/ft-in and the calculator converts automatically.",
      },
      {
        q: "Is my health information private?",
        a: "Yes — your height and weight are calculated entirely in your browser and never uploaded, logged, or linked to any account.",
      },
    ],
  },

  "calorie-calculator": {
    title: "Free Calorie Calculator — Daily Calorie Needs (TDEE)",
    description:
      "Estimate your Total Daily Energy Expenditure (TDEE) using Mifflin-St Jeor or Katch-McArdle, plus calorie targets for weight loss, maintenance, or muscle gain.",
    seoContent: (
      <article>
        <h2>Mifflin-St Jeor vs Katch-McArdle</h2>
        <p>
          Mifflin-St Jeor estimates your basal metabolic rate (BMR) from age, sex, height, and
          weight, and is considered one of the more accurate general-population formulas. Katch-
          McArdle instead uses lean body mass, which is more precise if you know your body-fat
          percentage — useful for people who are more muscular or leaner than average, where weight
          alone under- or over-estimates true metabolic needs.
        </p>
        <h2>From BMR to TDEE</h2>
        <p>
          BMR is the energy your body burns at rest. TDEE multiplies BMR by an activity factor
          (sedentary, lightly active, moderately active, very active) to estimate total daily
          burn including movement and exercise. TDEE — not BMR — is the number to use when setting
          a calorie target, since it reflects your actual day, not just resting metabolism.
        </p>
        <h2>Setting a target: cut, maintain, or bulk</h2>
        <p>
          A sustainable deficit for fat loss is typically 15–25% below TDEE; a more aggressive cut
          risks muscle loss and fatigue. Recomposition or lean bulking targets are usually within a
          few hundred calories of TDEE in either direction. The calculator applies these common
          ranges to your specific TDEE so the targets are calibrated to you, not a generic number.
        </p>
        <h2>Why use UtilityApps for this</h2>
        <p>
          All calculations run locally in your browser — your body stats are never uploaded or
          stored. No signup, no meal-plan upsell, just the numbers.
        </p>
      </article>
    ),
    faqItems: [
      {
        q: "What's the difference between BMR and TDEE?",
        a: "BMR (basal metabolic rate) is the energy your body burns at complete rest. TDEE (Total Daily Energy Expenditure) multiplies BMR by an activity factor to estimate your full day's calorie burn including movement and exercise — TDEE is what you should use to set a calorie target.",
      },
      {
        q: "Which formula should I use, Mifflin-St Jeor or Katch-McArdle?",
        a: "Mifflin-St Jeor works well for most people using just age, sex, height, and weight. If you know your body-fat percentage and are notably more or less muscular than average, Katch-McArdle (based on lean body mass) tends to be more precise.",
      },
      {
        q: "How many calories should I eat to lose weight?",
        a: "A common sustainable range is 15–25% below your TDEE. Larger deficits can speed short-term loss but increase the risk of muscle loss, fatigue, and rebound weight regain — the calculator shows a moderate range rather than a single aggressive number.",
      },
      {
        q: "How does activity level change the result?",
        a: "Activity level is a multiplier on your BMR — sedentary, lightly active, moderately active, and very active each add a different percentage on top of resting burn, since exercise and daily movement both add up over a full day.",
      },
      {
        q: "Does this calculator give macro recommendations too?",
        a: "Yes — alongside a calorie target, it can break the target into protein, carbohydrate, and fat grams using common macro-split guidance for your goal (cutting, maintenance, or lean bulking).",
      },
      {
        q: "Is this medical advice?",
        a: "No — it's a general estimation tool based on established formulas. For specific medical, dietary, or clinical guidance, consult a doctor or registered dietitian, especially if you have a health condition.",
      },
      {
        q: "Is my personal data private?",
        a: "Yes — your age, weight, height, and activity level are processed locally in your browser and never sent to a server.",
      },
    ],
  },

  // ============================================================ Calculator
  "percentage-calculator": {
    title: "Free Percentage Calculator — Percent Change, Increase & Off",
    description:
      "Calculate percent of a number, percent change, percent increase or decrease, discounts, and tips instantly, with step-by-step formulas shown.",
    seoContent: (
      <article>
        <h2>The three most common percentage questions</h2>
        <p>
          Almost every percentage problem falls into one of three shapes: &ldquo;what is X% of Y&rdquo;
          (e.g. 15% of 80), &ldquo;X is what percent of Y&rdquo; (e.g. 20 is what % of 80), and &ldquo;percent
          change between X and Y&rdquo; (e.g. from 80 to 100 is what % increase). This calculator covers
          all three plus common variants like percent-off pricing and tip math.
        </p>
        <h2>Percent change: the sign matters</h2>
        <p>
          Percent change is (new value − old value) ÷ old value × 100. Going from 80 to 100 is a
          +25% increase, but going from 100 back down to 80 is a −20% decrease — the same
          absolute gap produces different percentages depending on which number is the base. This
          asymmetry trips people up constantly, and the calculator shows the formula alongside the
          answer so the logic is visible, not just the result.
        </p>
        <h2>Percent-off and discount math</h2>
        <p>
          For a 30% off $80 item: the discount is 30% of $80 ($24), so the final price is $80 −
          $24 = $56 — not simply &ldquo;70 of something.&rdquo; The calculator handles this directly so you get
          the sale price instantly without doing the subtraction by hand.
        </p>
        <h2>Why use UtilityApps for this</h2>
        <p>
          Instant results with no signup, and every answer shows the formula used — helpful if
          you&rsquo;re learning the math, not just checking an answer.
        </p>
      </article>
    ),
    faqItems: [
      {
        q: "How do I calculate what percent one number is of another?",
        a: "Divide the part by the whole and multiply by 100: (part ÷ whole) × 100. For example, 20 is 25% of 80, because 20 ÷ 80 × 100 = 25.",
      },
      {
        q: "How is percent change calculated?",
        a: "(New value − Old value) ÷ Old value × 100. Note the direction matters — increasing from 80 to 100 is +25%, but decreasing from 100 back to 80 is −20%, even though the gap is the same 20 units.",
      },
      {
        q: "How do I calculate a discount or percent off?",
        a: "Multiply the original price by the discount percentage to get the amount taken off, then subtract that from the original price. 30% off $80 = $80 − (0.30 × $80) = $56.",
      },
      {
        q: "Does it show the formula, or just the answer?",
        a: "Both — each result includes a step-by-step breakdown of the formula used, which is useful for checking your own work or learning the underlying math rather than just copying an answer.",
      },
      {
        q: "Can I use it for grade or test-score calculations?",
        a: "Yes — enter points earned and total points to get a percentage score, which works the same as any \"part of whole\" percentage calculation.",
      },
      {
        q: "Is there a limit to how many calculations I can run?",
        a: "No limit and no signup — it's free to use as many times as you need.",
      },
    ],
  },

  "age-calculator": {
    title: "Free Age Calculator — Exact Age in Years, Months & Days",
    description:
      "Calculate exact age or duration between any two dates in years, months, weeks, and days, with leap-year handling and a next-birthday countdown.",
    seoContent: (
      <article>
        <h2>Why &ldquo;just subtract the years&rdquo; doesn&rsquo;t work</h2>
        <p>
          Subtracting birth year from the current year gives the wrong age whenever the birthday
          hasn&rsquo;t happened yet this year — someone born in December is a year &ldquo;younger&rdquo; than the
          simple subtraction suggests for most of the year. This calculator works from the actual
          birth date to today&rsquo;s date, accounting for whether the birthday has occurred yet, so the
          result is always exact.
        </p>
        <h2>Leap years and month-length differences</h2>
        <p>
          Months have different lengths (28–31 days) and February has an extra day in leap years,
          which makes manual day-counting error-prone over long spans. The calculator accounts for
          the Gregorian calendar&rsquo;s actual leap-year rule (divisible by 4, except centuries not
          divisible by 400) so multi-decade age calculations stay accurate to the day.
        </p>
        <h2>Beyond birthdays</h2>
        <p>
          The same date-difference math applies to legal and HR use cases — calculating tenure
          between a start date and today, time until a contract renewal, or the exact duration
          between any two events, not just a birth date and today.
        </p>
        <h2>Why use UtilityApps for this</h2>
        <p>
          Dates are calculated instantly in your browser with no signup — nothing about the dates
          you enter is stored or transmitted.
        </p>
      </article>
    ),
    faqItems: [
      {
        q: "How is exact age calculated?",
        a: "The calculator finds the difference between your birth date and today's date directly, correctly handling whether your birthday has occurred yet this year, so the years/months/days figure is exact rather than a rough subtraction.",
      },
      {
        q: "Does it handle leap years correctly?",
        a: "Yes — it follows the Gregorian calendar's leap-year rule (years divisible by 4, except century years not divisible by 400), so age and duration calculations stay accurate across leap years.",
      },
      {
        q: "Can I calculate the duration between two dates that aren't a birthday?",
        a: "Yes — enter any start and end date to get the exact duration in years, months, weeks, and days, useful for tenure, contract terms, or countdowns to any event.",
      },
      {
        q: "Does it show my next birthday countdown?",
        a: "Yes — alongside your current exact age, it shows how many days remain until your next birthday.",
      },
      {
        q: "Does it show a zodiac sign?",
        a: "Yes — both the Western zodiac sign and Chinese zodiac year are shown based on your birth date, as an added detail alongside the age calculation.",
      },
      {
        q: "Is my birth date kept private?",
        a: "Yes — the calculation runs entirely in your browser. Your birth date and any other dates you enter are never sent to a server.",
      },
    ],
  },

  "tip-calculator": {
    title: "Free Tip Calculator — Split the Bill & Calculate Tip Instantly",
    description:
      "Calculate tips and split a bill across any number of people, with country-aware tipping presets for the US, UK, Canada, and EU.",
    seoContent: (
      <article>
        <h2>Tipping norms vary a lot by country</h2>
        <p>
          15–20% is standard restaurant tipping in the US, while the UK and much of Europe treat
          10–12% (or a small rounded amount) as generous, and some countries fold service into the
          bill entirely (a service charge already added, where an extra tip isn&rsquo;t expected). The
          calculator&rsquo;s country presets set a sensible starting percentage so you&rsquo;re not guessing at
          an unfamiliar norm while traveling or eating out abroad.
        </p>
        <h2>Splitting the bill fairly</h2>
        <p>
          Splitting evenly is simplest, but &ldquo;per-person total&rdquo; needs to include the tip and tax,
          not just the food total — otherwise the group under-tips or under-covers the check. The
          calculator adds the tip to the subtotal first, then divides by the party size, so each
          person&rsquo;s share reflects the full bill.
        </p>
        <h2>Tax-inclusive vs tax-exclusive tipping</h2>
        <p>
          Some people tip on the pre-tax subtotal, others on the post-tax total — the difference is
          usually small but can matter on a large bill. The calculator supports separating tax from
          the tip base if you want to tip on the pre-tax amount specifically.
        </p>
        <h2>Why use UtilityApps for this</h2>
        <p>
          Fast enough to use at the table — no signup, no ads blocking the numbers, works offline
          once loaded.
        </p>
      </article>
    ),
    faqItems: [
      {
        q: "What's a standard tip percentage?",
        a: "It depends on the country — the US commonly runs 15–20% at restaurants, the UK and much of Europe 10–12% (often already included as a service charge), and other regions vary further. The calculator's country presets give a sensible starting point.",
      },
      {
        q: "How does bill splitting work with a tip included?",
        a: "The tip is calculated on the subtotal (or total, depending on your setting) first, then the subtotal plus tip is divided evenly across the party size, so each person's share covers their portion of both the meal and the tip.",
      },
      {
        q: "Should I tip on the pre-tax or post-tax amount?",
        a: "Conventions vary — many people tip on the pre-tax subtotal. The calculator lets you separate tax out so you can tip on whichever base you prefer.",
      },
      {
        q: "Can I split the bill unevenly?",
        a: "The core mode splits evenly across the party size; for itemized or uneven splits, adjust each person's share manually after seeing the even-split total as a baseline.",
      },
      {
        q: "Does it round the per-person amount?",
        a: "Yes — a rounding option is available so each person's share comes out as a clean, easy-to-pay amount rather than an awkward fraction of a cent.",
      },
      {
        q: "Is this the same as calculating a percentage generally?",
        a: "It uses the same underlying percentage math as our Percentage Calculator, applied specifically to bills, tips, and party splits.",
      },
    ],
  },

  "gpa-calculator": {
    title: "Free GPA Calculator — Weighted & Unweighted, 4.0 & 5.0 Scale",
    description:
      "Calculate weighted, unweighted, and cumulative GPA on 4.0 or 5.0 scales for high school and college, and project the GPA needed next term.",
    seoContent: (
      <article>
        <h2>Weighted vs unweighted GPA</h2>
        <p>
          Unweighted GPA treats every class the same, with an A worth 4.0 regardless of difficulty.
          Weighted GPA adds extra points (commonly +0.5 or +1.0) for honors, AP, or IB courses to
          reflect their added rigor — which is why a student&rsquo;s weighted GPA can exceed 4.0 even
          though the unweighted scale caps at 4.0. Colleges often recalculate applicants&rsquo; GPAs on
          their own scale, so both numbers are worth knowing.
        </p>
        <h2>How cumulative GPA is calculated</h2>
        <p>
          Cumulative GPA is the total grade points earned across all terms divided by total credit
          hours attempted — not a simple average of each term&rsquo;s GPA, since terms with more credit
          hours carry proportionally more weight. Add each course&rsquo;s credit hours and letter grade
          and the calculator weights them correctly.
        </p>
        <h2>Projecting the GPA you need next term</h2>
        <p>
          If you know your current cumulative GPA and credit hours, and how many credit hours are
          left this term, you can work backward to find the GPA needed this term to hit a target
          cumulative GPA — useful for scholarship or academic-standing thresholds. The calculator
          runs this projection directly instead of requiring manual algebra.
        </p>
        <h2>Why use UtilityApps for this</h2>
        <p>
          No signup, and nothing about your grades or school is stored — calculations happen
          locally in your browser.
        </p>
      </article>
    ),
    faqItems: [
      {
        q: "What's the difference between weighted and unweighted GPA?",
        a: "Unweighted GPA scores every class the same (A = 4.0 max). Weighted GPA adds bonus points for honors, AP, or IB courses (commonly +0.5 or +1.0), which is why weighted GPAs can exceed 4.0 while unweighted GPAs cap at 4.0.",
      },
      {
        q: "How is cumulative GPA calculated across multiple semesters?",
        a: "Total grade points earned (grade value × credit hours, summed across every course) divided by total credit hours attempted — not a simple average of each semester's GPA, since semesters with more credit hours count more.",
      },
      {
        q: "Does it support the 5.0 scale?",
        a: "Yes — many high schools use a 5.0 weighted scale for honors/AP courses alongside the standard 4.0 scale; you can select which scale matches your school's system.",
      },
      {
        q: "Can I project the GPA I need next term?",
        a: "Yes — enter your current cumulative GPA, credit hours completed, and planned credit hours for the upcoming term, and the calculator works out what GPA you'd need this term to reach a target cumulative GPA.",
      },
      {
        q: "Does it support letter grades and numeric/percentage scores?",
        a: "Yes — enter either standard letter grades (A, A-, B+, etc.) or a numeric/percentage score, and the calculator converts to the appropriate grade-point value for your selected scale.",
      },
      {
        q: "Is my grade data private?",
        a: "Yes — grades and credit hours are processed entirely in your browser and never uploaded or linked to any account.",
      },
    ],
  },

  // ============================================================ Text
  "word-counter": {
    title: "Free Word Counter, Character Counter, Case Converter & Text Diff Checker",
    description:
      "Count words, characters, sentences, and reading time; check platform limits; convert case; and compare two texts for differences — one toolkit, instantly, in your browser.",
    seoContent: (
      <article>
        <h2>What gets counted, and how</h2>
        <p>
          Word count splits text on whitespace and punctuation boundaries, so contractions and
          hyphenated words are counted sensibly rather than being split incorrectly. Alongside
          words, the toolkit tracks characters (with and without spaces), sentences, paragraphs,
          lines, and UTF-8 bytes — all updated live as you type or paste, with reading and speaking
          time estimated from average adult rates (roughly 238 wpm reading, 130 wpm speaking).
        </p>
        <h2>Platform character limits in one view</h2>
        <p>
          X (Twitter) counts some emoji and non-Latin characters as more than one character toward
          its 280 limit; the toolkit applies that same weighting rather than a naive count. Presets
          for SMS, meta descriptions, title tags, LinkedIn, Instagram, Bluesky, and YouTube each
          show a live progress bar so you know exactly how much room is left before you hit send or
          publish.
        </p>
        <h2>Convert case without leaving the page</h2>
        <p>
          The same text you just measured can be converted to any of 11 case styles — UPPERCASE,
          Title Case, camelCase, snake_case, kebab-case, and more — with a one-click copy per
          style. Acronyms, emoji, and punctuation are handled sensibly rather than mangled by a
          naive character-by-character transform.
        </p>
        <h2>Compare two texts side-by-side</h2>
        <p>
          Switch to Compare mode for a line-by-line diff of two blocks of text — useful for
          proofreading drafts, reviewing contract redlines, or checking that a copy-paste didn&rsquo;t
          silently drop a paragraph. Added and removed lines are colour-coded so you can scan a
          long document for just what changed.
        </p>
        <h2>Why use UtilityApps for this</h2>
        <p>
          Everything updates live with no signup, and your text is processed entirely in your
          browser — nothing you paste, including unpublished drafts or contract text, is ever
          uploaded or stored.
        </p>
      </article>
    ),
    faqItems: [
      {
        q: "How is the word count calculated?",
        a: "Text is split on whitespace and standard word boundaries, handling contractions and hyphenated words sensibly rather than splitting them into separate words, so the count matches what you'd expect from a word processor.",
      },
      {
        q: "Does it match X (Twitter)'s exact character limit?",
        a: "Yes — it uses the same character-weighting rules X applies (some emoji and non-Latin characters count as more than one toward the 280 limit), not just a plain character count, so the number matches what X enforces. Presets for SMS, meta descriptions, title tags, LinkedIn, Instagram, Bluesky, and YouTube are included too.",
      },
      {
        q: "What case formats can I convert to?",
        a: "UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, and two novelty styles (alternating and inverse case) — 11 formats covering both writing style and programming naming conventions.",
      },
      {
        q: "How does the text comparison (diff) mode work?",
        a: "Paste an original and a changed version into the Compare tab; the toolkit highlights added lines in green and removed lines in red using a line-by-line diff, so you can spot exactly what changed without re-reading both versions manually.",
      },
      {
        q: "What's the difference between reading time and speaking time?",
        a: "Reading time is estimated at roughly 238 words per minute (average adult silent reading speed); speaking time uses a slower rate (roughly 130 words per minute), so the same text takes noticeably longer to speak aloud than to read silently.",
      },
      {
        q: "Does it show byte count as well as character count?",
        a: "Yes — a UTF-8 byte count is shown alongside the character count, since non-Latin characters and emoji often take multiple bytes each, which matters for systems with byte-based limits.",
      },
      {
        q: "Is my text private?",
        a: "Yes — every mode (counting, case conversion, and comparison) runs entirely in your browser. Nothing you paste is sent to a server or stored, which matters if you're comparing sensitive contracts or unpublished drafts.",
      },
    ],
  },

  // ============================================================ SEO
  "meta-tag-generator": {
    title: "Free Meta Tag Generator — SEO, Open Graph & Twitter Card Tags",
    description:
      "Build complete meta tags — title, description, canonical, Open Graph, and Twitter Cards — with live previews of Google, Facebook, X, and LinkedIn.",
    seoContent: (
      <article>
        <h2>Why Open Graph and Twitter Cards are separate from SEO tags</h2>
        <p>
          Your &lt;title&gt; and meta description control how Google shows your page in search
          results. Open Graph tags (og:title, og:description, og:image) control how the page
          appears when shared on Facebook and LinkedIn. Twitter Card tags do the same for X. All
          three read from the same page but are separate tag sets — miss the Open Graph tags and
          your link preview on social media falls back to an unpredictable, often ugly default.
        </p>
        <h2>Character limits that actually matter</h2>
        <p>
          Google typically truncates title tags around 50–60 characters and descriptions around
          155–160 characters in search results. Social platforms crop og:title and og:description
          differently again. The generator enforces sensible limits with live counters so your
          snippet doesn&rsquo;t end in an awkward mid-word ellipsis on any platform.
        </p>
        <h2>JSON-LD structured data</h2>
        <p>
          Beyond meta tags, the generator can output basic JSON-LD structured data, which helps
          search engines understand your page&rsquo;s type (article, product, organization) and is a
          prerequisite for certain rich-result features in Google Search.
        </p>
        <h2>Why use UtilityApps for this</h2>
        <p>
          Live previews update as you type, with no signup — the generated tags are yours to copy
          and paste directly into your site&rsquo;s &lt;head&gt;.
        </p>
      </article>
    ),
    faqItems: [
      {
        q: "What's the difference between SEO meta tags and Open Graph tags?",
        a: "SEO meta tags (title, description, canonical) control how your page appears in search engine results. Open Graph tags control how the page's link preview appears when shared on Facebook and LinkedIn. Both are needed for full coverage across search and social.",
      },
      {
        q: "What character limits should I follow?",
        a: "Roughly 50–60 characters for the title tag and 155–160 for the meta description to avoid truncation in Google search results. The generator shows a live character counter with a visual limit indicator for each field.",
      },
      {
        q: "Do I need separate tags for X (Twitter)?",
        a: "Yes — Twitter Card tags (twitter:title, twitter:description, twitter:image, twitter:card) are read independently by X and control how your link preview looks there, separate from Open Graph.",
      },
      {
        q: "What image size should I use for og:image?",
        a: "1200×630 pixels is the widely recommended size for Open Graph images — it displays well as a large preview card on Facebook, LinkedIn, and X without awkward cropping.",
      },
      {
        q: "Does the generator create JSON-LD structured data too?",
        a: "Yes — basic structured data output is included, which helps search engines understand the page type and is a prerequisite for some rich-result features.",
      },
      {
        q: "How do I preview how my tags will actually look?",
        a: "The tool shows a live Google SERP preview alongside Facebook, X, and LinkedIn share-card previews as you fill in each field, so you can see the real result before publishing.",
      },
      {
        q: "Is this tool free to use for unlimited pages?",
        a: "Yes — no signup, no page limit. Generate tags for as many pages as you need and copy the output directly into your site's HTML.",
      },
    ],
  },

  "slug-generator": {
    title: "Free Slug Generator — SEO-Friendly URL Slug Converter",
    description:
      "Convert any title or string into a clean, lowercase, hyphenated URL slug, with stop-word removal, accent normalization, and non-Latin transliteration.",
    seoContent: (
      <article>
        <h2>What makes a slug &ldquo;SEO-friendly&rdquo;</h2>
        <p>
          A good URL slug is short, lowercase, hyphen-separated, and free of special characters,
          stop words, and unnecessary numbers — search engines and users can both read
          &ldquo;/blog/best-coffee-makers&rdquo; more easily than
          &ldquo;/blog/The-Best-Coffee-Makers-of-2024!!!&rdquo;. Shorter, cleaner slugs also tend to display
          better in search results, which don&rsquo;t always show the full URL.
        </p>
        <h2>Handling accents and non-Latin scripts</h2>
        <p>
          A title like &ldquo;Café Résumé&rdquo; needs its accented characters normalized to plain ASCII
          (&ldquo;cafe-resume&rdquo;) for a clean URL. For non-Latin scripts — Cyrillic, Greek, or CJK
          characters — the generator can transliterate to a readable Latin-alphabet
          approximation, since raw non-Latin characters in a URL often get percent-encoded into
          long, unreadable strings by browsers and platforms.
        </p>
        <h2>Stop words: keep or strip?</h2>
        <p>
          Removing common stop words (&ldquo;the,&rdquo; &ldquo;a,&rdquo; &ldquo;of&rdquo;) shortens slugs and can slightly improve
          keyword density in the URL, but some site owners prefer to keep them for readability or
          brand consistency. The generator supports both modes, plus a custom separator if your CMS
          expects underscores instead of hyphens.
        </p>
        <h2>Why use UtilityApps for this</h2>
        <p>
          Instant conversion, no signup — paste a title and copy the slug straight into your CMS or
          routing config.
        </p>
      </article>
    ),
    faqItems: [
      {
        q: "What makes a URL slug good for SEO?",
        a: "Short, lowercase, hyphen-separated, free of stop words and special characters, and descriptive of the page content — search engines and users can both parse a clean slug more easily than one with mixed case, punctuation, or unnecessary words.",
      },
      {
        q: "Does it handle accented characters like é or ñ?",
        a: "Yes — accented characters are normalized to their plain ASCII equivalent (é → e, ñ → n), since accented characters in raw URLs often get percent-encoded into long, unreadable strings.",
      },
      {
        q: "Can it transliterate non-Latin scripts like Cyrillic or CJK?",
        a: "Yes — Cyrillic, Greek, and CJK characters (Chinese, Japanese, Korean) are transliterated into a readable Latin-alphabet approximation rather than left as raw characters that would otherwise get encoded.",
      },
      {
        q: "Should I remove stop words like 'the' and 'a' from slugs?",
        a: "It's optional — removing them shortens the slug and slightly improves keyword focus, but some sites keep them for readability or brand consistency. The generator supports both, so you can choose per page.",
      },
      {
        q: "Can I use underscores instead of hyphens?",
        a: "Yes — a custom separator option is available if your CMS or platform expects underscores or another separator instead of the standard hyphen.",
      },
      {
        q: "Is there a length limit recommended for slugs?",
        a: "There's no hard limit, but shorter slugs (roughly 3–5 words) tend to display better in search results and are easier for users to read and remember.",
      },
    ],
  },
};

export function getToolSeoOverride(toolId: string): ToolSeoOverride | undefined {
  return TOOL_SEO_CONTENT[toolId];
}
