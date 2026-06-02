# Forager — Object Model & IA

**Status:** First pass, Apr 29 2026 · Author: Becky Buck · Reviewers: Anna, Meng

This doc locks the names, hierarchy, and relationships of the top-level objects in Forager. It exists to unblock UX team from itterating on the "app shell" (meaning: navigaion patterns, breadcrumbs, icon systems, and copy decisions). When something is unresolved, it lives in **Open questions** at the bottom rather than being decided here.

Field-level details (like what's in a Strategy, what's on a Project, what's on a Sample Group) is captured here when it's been confirmed in mocks; component specs live elsewhere.

---

## 1. Object glossary

Forager has **five top-level data objects** (Plant Source, Compound, Target, Strategy, Sample) plus three **workflow objects** (Project, Chat, Linked Doc). Data objects are the biology surface area users navigate; workflow objects are the containers and outputs that organize a user's sessions with the product.

### Data objects

**Plant Source** — A plant species or specimen catalogued in Forager's library. Plant Sources are the highest level in the biology hierarchy and serve as the *source* of Compounds (hence the name). Each Plant Source contains Compounds.

The Plant Source library is **curated and treated as exhaustive** — users do not upload or create new Plant Sources. There is no "New Plant Source" affordance, and the upload mechanism for Linked Docs (Citations, Notes) does not extend to creating Plant Sources.

*Note on naming:* "Plant" and "Plant Source" are synonymous; you'll see both informally. **Plant Source** is the canonical system noun — it reads correctly in the contexts where this object actually surfaces (the `Plant Sources` tab on a Strategy detail page, the `Sources` column on a project overview, etc.). When this doc says "Plant" anywhere, read it as a shorthand for Plant Source.

**Compound** — A chemical compound originating from a Plant Source. Compounds are nested inside Plant Sources and relate to Targets.

Compound carries several attributes visible in the Apr 29 mocks: bioactive potential percentage (e.g. `85%`), descriptive tags (`Animal-cow`, `Animal-ruminants`, `GRAS`, `IP Landscape`), a list of related Targets shown as chips, and a list of Plant Sources it originates from.

Three subtypes:
- **Known** — A documented compound with established literature and properties.
- **Combination** — A compound formed from two or more Known compounds.
- **Predictive** — A compound proposed by Forager's models, not yet confirmed.

Compounds also have a **chemical class** attribute (Terpenoids, Alkaloids, Polyketides, Fatty acids, Amino acids, Carbohydrates) — visible in the Samples mock as a bar-chart axis. Class is a property of Compound, not a separate object.

**Target** — A biological receptor that researchers are screening compounds against. Forager maintains a curated reference table of ~50 receptor abbreviations commonly used by the scientific community. Targets relate to Compounds.

Targets surface in the UI primarily as **filter facets** inside exploration views and as **chips** next to Compounds — not as a top-nav section and not as a standalone index page. A user encounters Targets while exploring Compounds (filter the compound list by receptor) rather than browsing them directly. Targets *do* have a detail surface — reachable contextually by clicking a Target chip — but the path is always contextual, not navigational.

**Strategy** — An *approach* to solving a Project's business Goal. A Strategy is a hypothesis: a specific biological mechanism, supported by specific Compounds, that could achieve what the Project is trying to do. Strategies relate to Targets, Compounds, and Plant Sources.

Example: if a Project's Goal is *"increase milk production in cows,"* Forager surfaces a set of Strategy cards — each one a different mechanism (*"shift rumen microbiome toward propionate producers,"* *"stimulate mTOR / IGF-1 signaling,"* etc.) — with the Compounds and evidence linked to that approach. Strategies are **competing approaches to the same Goal**, not parallel tasks. The team evaluates them side-by-side using three pillars (Evidence, Feasibility, Legal) and decides which to pursue. The `Eliminated` status reflects this — losing strategies get eliminated, not just deferred.

End users encounter Strategies **only within a Chat or a Project** — those are the user-facing entry points. At the system level, however, a Strategy *can* be created by an admin or an AI agent and exist temporarily without an attached Project or Chat. Treat orphaned Strategies as a transitional state, not a user-navigable category. There is no end-user "All Strategies" index in nav.

**Strategy fields** (from Apr 29 mocks):
- **Name** + one-liner + detailed description
- **Three evaluation pillars**, each with a green / yellow / red status indicator:
  - **Evidence** — what's in literature + what's predicted
  - **Feasibility** — formula and safety concerns
  - **Legal** — freedom to operate
- **Status** (state machine): `Ready` · `Incomplete` · `Eliminated`
- **IP assessment** — badge (distinct from the Legal pillar)
- **Compounds** — the compounds the strategy is collecting
- **Plant Sources** — the plants those compounds come from
- **Notes** — free-text

The Strategy detail page has two tabs: **Compounds** and **Plant Sources**. Each tab is a card-based list of items with a filter bar and per-item metadata (bioactive potential, related Targets, tags).

**Sample** — A unit of lab/test data analyzed by Forager for its compound content. Samples are user-scoped (the "My Samples" page) — they belong to the user whose account they're attached to.

Samples are **uploaded by Brightseed admins**, not by end users. The system analyzes uploaded Sample data and auto-generates a Report (presented to the end user as a dashboard — see the Report definition below). End users view their Samples, click into Compounds detected in them, and chat about results.

Each Sample has:
- **Sample ID** — a unique identifier in Brightseed's lab format (e.g. `ERD250174`)
- **Unique Bioactives count** — how many distinct compounds were detected
- **Action affordance** — *Explore Compounds* (links into the compound list filtered to this sample)

Samples are organized into **Sample Groups** — a structural, not visual, grouping. A Sample Group is a Brightseed **work order**: a customer sends in physical samples to be processed, and each work order becomes a Sample Group containing 1-N Samples. Sample Group is therefore a real parent object with its own URL hierarchy.

Each Sample Group has:
- **Name** + status badge (e.g. `New`)
- A **Sample-Group Report** (system-generated; see Linked Doc → Sample-Group Report below)
- Group-level visualizations on the dashboard:
  - **Recommended Health Areas** — ranked list of health areas with relevance scores (Metabolic Health, Glucose Management, Immune Health, Brain Health, Skin Health, etc.). What a Health Area *is* — its own object, a tag, or a computed aggregation — is open. *(See Q2.)*
  - **Unique Compound Count by Class** — bar chart of compound classes per Sample, with filter chips (`claim ready`, `predicted`).

Anna noted Samples is "half-baked" — the IA above reflects what's visible in the Apr 29 draft mock. Expect refinements as the section matures.

### Workflow objects

**Project** — A workspace container. A Project is the home for an active research effort.

**Project fields** (from Apr 29 mocks):
- **Goal** — free-text statement of what the project is solving (e.g. *"help individuals on GLP-1 weight loss drugs retain lean muscle mass"*)
- **Target Audience** — free-text (e.g. *"Women over 50"*)
- **Constraints** — free-text (e.g. *"none"*)
- **References** — rollup count of attached Citations, with a link to view all (e.g. *"view all 23 citations or export to..."*)
- **Team** — list of contributing users, shown as avatar initials

A Project also holds:
- **One or more Strategies** — the competing approaches the project is evaluating against its Goal
- **References to Plant Sources, Compounds, and Targets** — the biology objects in the project's scope. These are references, not copies; the underlying object lives globally and can appear in many Projects.
- **Linked Docs** attached to the project — Reports, Citations, Notes
- **One or more Chats** with the Hummingbird assistant

Chats can also exist **outside** any Project (orphaned). Strategies can also exist outside in a transitional state — see the Strategy definition above.

**How items enter a Project's scope.** Two paths:

- **Star from chat** — when Hummingbird surfaces a Plant Source, Compound, or Target during a chat, the user can star it to save it to the project. Primary mechanism for adding biology objects to a Project. The icon used is the **star** (not pin — see Anna's pin-to-star switch noted in CLAUDE.md).
- **Manual upload** — users upload Reports (Word, PDF, Excel, CSV), Citations, and Notes directly. Mechanism for adding any user-attached Linked Doc to a Project.

A Project's "Reports" can also include references to the user's **Sample-Group Reports** — those aren't *uploaded* into the Project; they're *referenced* from existing Sample Groups (which are auto-generated by Forager).

**Chat** — A threaded conversation between the user and the Hummingbird assistant. A Chat may live inside a Project or may exist independently of any Project (an "orphaned" Chat). Industry pattern — mirrors how chats work in Claude.

**Linked Doc** — A document attached to a Project. Linked Docs are project-scoped. Three types in v1:

- **Report** — A user-uploaded document attached to a Project. Can be a Word document, PDF, Excel file, or CSV. User-uploaded only — not auto-generated. The Project's "Reports" UI can additionally include **references to Sample-Group Reports** (see below) — but those are pointers to objects living elsewhere, not Reports authored in this Project.
- **Citation** — A referenced paper, dataset, or external source. Manually uploaded by the user. Project-scoped.
- **Note** — The user's own annotation or working memo. Manually uploaded or written by the user. Project-scoped.

The umbrella term "Linked Doc" is the system noun; users may primarily encounter Reports, Citations, and Notes by name in the UI. The umbrella matters when listing them together (the project's "Linked Docs" tab) and when reasoning about IA. The v1 set is **locked for now**. New Linked Doc types would be a v2+ expansion.

**Sample-Group Report** — A **system-generated interactive dashboard** that lives inside a Sample Group. Always created by Forager (never user-authored). Brightseed admins upload Sample data; the system analyzes it and produces the Sample-Group Report, presented to end users as a clickable dashboard with drill-in charts and a chat affordance to ask questions about the data. Each Sample Group has exactly one Sample-Group Report.

Sample-Group Report is a **distinct object from Report** — different parent (Sample Group vs. Project), different creation path (system-generated vs. user-uploaded), different presentation (interactive dashboard vs. document file). They share the colloquial word "report" in user-facing language but are not the same thing in the IA.

*Note on column-header variation:* Anna's Apr 29 project overview mock uses `Artifacts` as a column header where this doc says `Linked Docs`. That's an inconsistency to clean up in mocks before handoff — the system noun is **Linked Doc**.

---

## 2. Containment vs. relation

Two things are happening in this graph and they should not be confused:

- **Containment** — one object lives *inside* another (a Compound belongs to its parent Plant Source; a Sample belongs to its parent Sample Group; a Chat may belong to its parent Project).
- **Relation** — one object *references* another but is not owned by it (a Compound is associated with one or more Targets, but a Target does not "contain" Compounds).

```
              ┌─────────────────────────────────────────────────┐
              │                 DATA OBJECTS                    │
              │                                                 │
              │   Plant Source ──contains──▶ Compound           │
              │                                 │               │
              │                                 │ relates       │
              │                                 ▼               │
              │                              Target             │
              │                                                 │
              │   Strategy ──relates──▶ Target                  │
              │       │                                         │
              │       ├──relates──▶ Compound                    │
              │       └──relates──▶ Plant Source                │
              │                                                 │
              │   Sample Group ──contains──▶ Sample             │
              │                                 │               │
              │                                 │ relates       │
              │                                 ▼               │
              │                              Compound           │
              └─────────────────────────────────────────────────┘

              ┌─────────────────────────────────────────────────┐
              │              WORKFLOW OBJECTS                   │
              │                                                 │
              │   Project                                       │
              │     ├─contains──▶ Strategy(ies)                 │
              │     ├─contains──▶ Chat(s)                       │
              │     ├─contains──▶ Linked Docs                   │
              │     │              (Report, Citation, Note)     │
              │     ├─references─▶ Sample-Group Report(s)       │
              │     └─references─▶ Plant Source / Compound /    │
              │                    Target (project scope)       │
              │                                                 │
              │   Sample Group ──contains──▶ Sample-Group Report│
              │                              (system-generated) │
              │                                                 │
              │   Chat (orphaned, no Project)                   │
              │   Strategy (transitional, admin/AI-created)     │
              └─────────────────────────────────────────────────┘
```

**Compound subtypes** (Known / Combination / Predictive) are a `type` attribute on Compound, not separate objects. They share the Compound URL space, schema, and detail page; they differ in icon and in which fields are populated.

---

## 3. Naming conventions

These apply across nav, breadcrumbs, page titles, headings, body copy, and URLs.

**Capitalization**

- **Title Case** in nav, breadcrumbs, page titles, and table column headers (`Plant Sources`, `Compounds`, `Strategy detail`, `Sample Groups`).
- **Sentence case** in body copy and microcopy ("This compound was found in 12 plant sources").
- Object names are capitalized when referring to the object as a *type* ("a Compound is..."), and lowercased in narrative prose ("we found a new compound").

**Singular vs. plural**

- List/index views use the **plural** form (`Compounds`, `Plant Sources`, `Samples`).
- Detail views use the **singular** form (page title shows the entity name, breadcrumb shows `Compounds / Quercetin`).

**URL slugs**

- Lowercase, plural, kebab-case for the index: `/plant-sources`, `/compounds`, `/projects`, `/chats`, `/samples`. (No `/targets` index — Target is a filter facet, not a navigable section. No global `/strategies` — Strategy is reached only via Chat or Project.)
- Detail by ID or slug: `/compounds/quercetin`, `/plant-sources/foeniculum-vulgare`.
- Sample Group is a real URL parent (it's a Brightseed work order, structurally containing 1-N Samples): `/samples/[group-id]`, `/samples/[group-id]/[sample-id]`.
- Compound subtypes filter by query param, not path segment: `/compounds?type=known`. (Engineering call; design recommendation only.)
- Project-scoped Linked Docs nest under their parent Project: `/projects/[project]/reports/[report]`, `/projects/[project]/citations/[citation]`, `/projects/[project]/notes/[note]`. They have no global index — they only exist in the context of their Project.
- Sample-Group Reports live under their parent Sample Group: `/samples/[group-id]/report`. One per Sample Group.

**Icon-name pairing** — Every object gets a custom-designed icon. No generic doc icons, no shared affordances. The set covers Plant Source, Compound (plus three Compound subtypes — Known, Combination, Predictive), Target, Strategy, Sample, Sample Group, Project, Chat, the three Linked Doc types (Report, Citation, Note), and Sample-Group Report — **fifteen in total**.

---

## 4. Where each object shows up

Provisional. Nav structure is still fuzzy per Anna; treat the nav column as a hypothesis to test against the App Shell tickets, not a decision.

| Object | Top nav | Breadcrumb | List view | Detail view | Card | Search |
|---|---|---|---|---|---|---|
| Plant Source | yes | `Plant Sources / [name]` | yes | yes | yes | yes |
| Compound | yes | `Compounds / [name]` or `Plant Sources / [plant] / Compounds / [name]` | yes | yes | yes | yes |
| Target | **no** — filter facet, not nav | only via filter context | **no global index** | yes (reachable contextually by clicking a Target chip) | yes (filter chip next to Compounds) | yes (filter autocomplete) |
| Strategy | **no** end-user nav (admin only) | `Projects / [project] / Strategies / [name]` (or `Chats / [chat] / Strategies / [name]`) | yes (within Project or Chat) | yes — two tabs: `Compounds`, `Plant Sources` | yes | yes |
| Sample | yes (`My Samples`) | `Samples / [group] / [sample-id]` | yes (grouped by Sample Group) | yes | yes (table row) | yes |
| Sample Group | yes (within Samples page) | `Samples / [group]` | yes (expandable section on Samples page) | yes (group-level dashboard) | yes (expandable header) | yes |
| Project | yes (workspace nav) | `Projects / [name]` | yes | yes (the "active project view") | yes | yes |
| Chat | within Project, plus an "All chats" view for orphaned + project chats | `Projects / [project] / Chats / [chat]` for nested; `Chats / [chat]` for orphaned | yes | yes | yes (chat tile with title + last message) | yes |
| Report | inside Project (Linked Docs tab) | `Projects / [project] / Reports / [name]` | yes (within Project) | yes (file viewer) | yes | yes (within Project scope) |
| Citation | inside Project (Linked Docs tab) | `Projects / [project] / Citations / [name]` | yes (within Project) | yes | yes | yes (within Project scope) |
| Note | inside Project (Linked Docs tab) | `Projects / [project] / Notes / [name]` | yes (within Project) | yes | yes | yes (within Project scope) |
| Sample-Group Report | inside Sample Group | `Samples / [group] / Report` | one per Sample Group (no list view) | yes (interactive dashboard) | n/a (always shown as the group's primary surface) | yes |

**Why two breadcrumb shapes for Compound** — Compounds can be reached either from the Compounds index (flat) or from a parent Plant Source (nested). Both should work. The breadcrumb reflects the path the user took, not just the canonical containment.

**Why Report and Sample-Group Report are separate rows** — they share the colloquial word "report" in user-facing language but are distinct objects with different parents, creation paths, and presentation. Report is a user-uploaded file; Sample-Group Report is a system-generated dashboard. A Project may *reference* a Sample-Group Report in its Linked Docs list, but the underlying object lives in the Sample Group.

---

## 5. Open questions

Things this doc does *not* decide. Each is a real question — not deferred indefinitely, just not blocking the unblock.

1. **What's on a Sample detail view?** The mocks show Sample as a row in a Sample Group table (Sample ID, Unique Bioactives count, Action). Clicking a sample presumably opens a detail view, but it isn't in the mocks. *Low priority — TBD.*
2. **What is a Health Area?** The Recommended Health Areas chart shows things like Metabolic Health, Glucose Management, Immune Health, etc. Are these their own object (a tag or category), or are they a computed aggregation across Compounds? Affects icon system, search, and filterability. **Following up with Anna.**

**Vocabulary note:** "Collection" is a colloquial synonym for Project — not a separate object. If a user says "my plant collection," they mean the plants in their project. The IA only has Project.

---

## 6. Downstream impact

This doc unblocks:

- **BUC-83** — Object Model & Icons. The icon system covers five data objects (Plant Source, Compound, Target, Strategy, Sample) + three Compound subtypes (Known, Combination, Predictive) + Sample Group + two workflow containers (Project, Chat) + three Linked Doc types (Report, Citation, Note) + Sample-Group Report = **fifteen custom icons in v1**.
- **App Shell tickets** under BUC-82 — nav layout, breadcrumb component, page header copy.
- **Anna's pin → star icon switch** (separate ticket) — independent of this doc but adjacent.

---

*If you redline this doc, edit in place. Major decisions (renames, hierarchy changes) should also be reflected in `CLAUDE.md` so AI codegen stays in sync.*
