/**
 * Sandbox root — Forager surfaces live under /strategies and /compounds.
 * The root page redirects to /strategies (the entry surface for the
 * project flow per the design brief).
 */

import { redirect } from "next/navigation"

export default function Home() {
  redirect("/strategies")
}
