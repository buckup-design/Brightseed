import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import { BrightseedLogo } from "@/components/brand/BrightseedLogo";

export const metadata: Metadata = {
  title: "Hummingbird Brand",
};

/**
 * Marketing review index — entry point for the client to compare the three
 * re-skin directions of the same content (hero / testimonials / footer).
 * Each card previews the direction with its login screen.
 */
const STORYBOOK_URL =
  "https://brightseed-storybook.vercel.app/?path=/docs/getting-started--docs";

const sections = [
  {
    heading: "Context",
    body: (
      <>
        Becky Buck (John&rsquo;s wife) has been doing some pro bono work for Brightseed.
        She&rsquo;s working on a design system
        <sup className="ml-0.5">*</sup> that will enable faster prototyping with ai tools and
        reduce time spent on front end engineering, while improving product look and feel. She
        wants to ensure that even work in progress is aligned with brand intent. She saw a recent
        mockup for a new Hummingbird landing page for the website, and wants to check in with the
        decision makers for all things branding to ensure she is working from current best
        thinking.
      </>
    ),
    footnote: (
      <>
        <sup>*</sup> What is a design system? Think of a design system as a set of pre-existing UI
        Lego&rsquo;s for building interfaces, with some rules for how to use the legos together. If
        you want to learn even more{" "}
        <a
          href={STORYBOOK_URL}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-[var(--ds-color-text-brand)] underline"
        >
          start here
        </a>
        .
      </>
    ),
  },
  {
    heading: "Scope",
    body: (
      <>
        The scope of this work is intended to be minimal: a single public landing page for
        Hummingbird added to the main site, a custom signup form (so that the signup linked from
        the website&rsquo;s Hummingbird banner is different than the standard intake), an updated
        version of{" "}
        <a
          href="https://brightseed.ai/"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-[var(--ds-color-text-brand)] underline"
        >
          brightseed.ai
        </a>
        , and login screens. This is NOT intended to be a large brand update, nor a full website
        update.
      </>
    ),
  },
];

/** Shown below the concepts — it asks for a reaction to what you just saw. */
const requestedFeedback = {
  heading: "Requested Feedback",
  body: (
    <>
      We&rsquo;re looking for feedback on the attached concepts so we can align on a single
      direction. To complete the work, Becky will also need finalized content. (For example, on the
      login screens you see where Becky made up a headline and a claim &ldquo;6x faster&rdquo;.
      She&rsquo;s made some placeholder suggestions but needs approved content).
    </>
  ),
};

const directions = [
  {
    href: "/marketing/minimal",
    name: "Minimal",
    thumbnail: "/marketing/login-minimal.jpg",
    blurb:
      "Mostly white backgrounds with some subtle minty, light-green gradients. No serif fonts. Incorporates the geometric dot graphic from earlier mockups.",
  },
  {
    href: "/marketing/bold",
    name: "Bold",
    thumbnail: "/marketing/login-bold.jpg",
    blurb:
      "Vivid green backgrounds. Incorporates hummingbird and botanicals graphics with a blueprint-grid texture. Lime green pill CTAs. Tiempos Italic font used graphically for emphasis in headlines.",
  },
  {
    href: "/marketing/restrained",
    name: "Restrained",
    thumbnail: "/marketing/login-restrained.jpg",
    blurb:
      "Warm neutral backgrounds with forest-green CTAs and occasional lime accents. Incorporates hummingbird and botanicals graphics with a blueprint-grid texture.",
  },
];

function Section({
  heading,
  body,
  footnote,
}: {
  heading: string;
  body: React.ReactNode;
  footnote?: React.ReactNode;
}) {
  return (
    <section className="mt-16">
      <h2 className="text-4xl font-semibold tracking-tight text-[var(--ds-color-text-default)]">
        {heading}
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--ds-color-text-subtle)]">
        {body}
      </p>
      {footnote ? (
        <p className="mt-4 max-w-2xl text-xs leading-relaxed text-[var(--ds-color-text-subtle)]">
          {footnote}
        </p>
      ) : null}
    </section>
  );
}

export default function MarketingIndex() {
  return (
    <main className="min-h-dvh bg-[var(--ds-color-surface-default)] text-[var(--ds-color-text-default)]">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <BrightseedLogo variant="lockup" className="h-6" />
        <h1 className="mt-10 text-4xl font-semibold tracking-tight text-[var(--ds-color-text-default)]">
          Hummingbird Brand
        </h1>
        <p className="mt-3 max-w-xl text-sm text-[var(--ds-color-text-subtle)]">
          Three re-skins of the same draft content for review. Open each to compare.
        </p>

        {/* Context + Scope set up the ask before the concepts are shown. */}
        {sections.map((s) => (
          <Section key={s.heading} heading={s.heading} body={s.body} footnote={s.footnote} />
        ))}

        <div className="mt-16 flex flex-col gap-8">
          {directions.map((d) => (
            <Link
              key={d.href}
              href={d.href}
              className="group flex flex-col gap-6 overflow-hidden rounded-2xl border border-[var(--ds-color-border-subtle)] bg-[var(--ds-color-surface-default)] p-6 shadow-lg transition-shadow hover:shadow-xl sm:flex-row sm:items-center sm:gap-8"
            >
              <div className="w-full shrink-0 overflow-hidden rounded-xl sm:w-2/5">
                <Image
                  src={d.thumbnail}
                  alt={`${d.name} login screen`}
                  width={1380}
                  height={883}
                  sizes="(min-width: 640px) 40vw, 100vw"
                  className="block h-auto w-full"
                />
              </div>
              <div className="sm:flex-1">
                <div className="text-2xl font-semibold text-[var(--ds-color-text-default)]">
                  {d.name}
                </div>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--ds-color-text-subtle)]">
                  {d.blurb}
                </p>
                <span className="mt-5 inline-block text-sm font-medium text-[var(--ds-color-text-brand)] group-hover:underline">
                  View direction →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <Section heading={requestedFeedback.heading} body={requestedFeedback.body} />
      </div>
    </main>
  );
}
