import type { Metadata } from "next";

import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { DeveloperToolShell } from "@/components/dev-tools/DeveloperToolShell";
import { CronExpressionBuilder } from "@/components/dev-tools/CronExpressionBuilder";
import { devToolOgUrl, getDevFaqs } from "@/lib/devFaqs";
import { SITE_CONFIG } from "@/lib/utils";

const TOOL_ID = "cron-expression-builder";
const TITLE = "Free Cron Expression Builder — Live Description + Next-Run Preview";
const DESCRIPTION =
  "Build cron expressions with a visual editor, see a plain-English description, and preview the next 5 fire times. Free, no signup, in your browser.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["cron expression", "cron builder", "cron syntax", "crontab", "online cron"],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [{ url: devToolOgUrl(TITLE, DESCRIPTION), width: 1200, height: 630, alt: "Cron Expression Builder" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, creator: SITE_CONFIG.twitterHandle },
};

export default function CronExpressionBuilderPage() {
  return (
    <>
      <TrackToolVisit toolId={TOOL_ID} />
      <DeveloperToolShell
        toolId={TOOL_ID}
        title="Cron Expression Builder"
        description="Pick a preset or type the expression directly. Get a plain-English description and the next 5 fire times computed in your local timezone."
        faqItems={getDevFaqs(TOOL_ID)}
        seoContent={<SeoContent />}
      >
        <CronExpressionBuilder />
      </DeveloperToolShell>
    </>
  );
}

function SeoContent() {
  return (
    <article>
      <h2>Reading a cron expression</h2>
      <p>
        A standard cron expression has five fields — minute, hour, day of month, month, and day of
        week — each accepting a number, a range (<code>1-5</code>), a list (<code>1,15,30</code>),
        a step (<code>*/15</code>), or a wildcard (<code>*</code>) meaning &ldquo;every value.&rdquo; A
        schedule like <code>0 9 * * 1-5</code> means &ldquo;9:00 AM, every weekday&rdquo; — the builder shows
        that plain-English translation live as you edit each field.
      </p>
      <h2>Why the next-run preview matters</h2>
      <p>
        Cron syntax is compact but easy to get subtly wrong — mixing up the day-of-month and
        day-of-week fields, or misplacing a step value, silently produces a schedule that fires at
        the wrong time (or far more often than intended). Previewing the next 5 fire times catches
        that mistake before you deploy the schedule to a real job.
      </p>
      <h2>Timezone is the most common cron gotcha</h2>
      <p>
        Most schedulers (cron, Kubernetes CronJobs, CI/CD pipelines) evaluate expressions in the
        server&rsquo;s configured timezone, not the timezone of whoever wrote the expression. The
        preview shows fire times in your local browser timezone, but always double-check what
        timezone your actual scheduler runs in before deploying.
      </p>
      <h2>Why use UtilityApps for this</h2>
      <p>
        The expression, description, and preview are all computed locally in your browser — no
        signup, and nothing about your schedule is sent to a server.
      </p>
    </article>
  );
}
