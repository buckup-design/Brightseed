/**
 * Screening fixtures for the Filter Prototype — the feasibility / novelty /
 * safety attributes the drawer's score panels filter on.
 *
 * Keyed by `resultKey(result)`, the same sidecar shape WORKSPACE_DETAILS uses,
 * so nothing in the shipped `Result` type has to change to carry them.
 *
 * All values are invented but internally consistent: well-studied dietary
 * polyphenols score easy-to-formulate and GRAS; the alkaloids carry real
 * solubility and toxicity trade-offs; the three Brightseed-HBPB catalog entries
 * are DELIBERATELY absent below. A predicted compound genuinely has no
 * formulation, GRAS or FTO workup yet, and their absence is what exercises the
 * model's unknown-value rule — they pass at ANY and drop out the moment any
 * score or flag is raised off its floor. Do not "complete" them.
 *
 * On promotion out of WORK IN PROGRESS this should move next to the results it
 * annotates, in components/hummingbird/data.ts.
 */

import type { ScreeningIndex } from "./filter-model";

export const SCREENING_PROFILES: ScreeningIndex = {
  "Epigallocatechin gallate": {
    productFormat: "capsule, powder, beverage",
    requiresDeliveryTechnology: false,
    easeOfFormulation: 4,
    solubility: 4,
    fto: 2,
    patentability: 1,
    admet: 1,
    hasGhsHazard: false,
    grasSource: true,
    nonNovelSource: true,
  },
  Capsaicin: {
    productFormat: "capsule, softgel",
    requiresDeliveryTechnology: true,
    easeOfFormulation: 2,
    solubility: 2,
    fto: 3,
    patentability: 2,
    admet: 2,
    hasGhsHazard: true,
    grasSource: true,
    nonNovelSource: true,
  },
  Genistein: {
    productFormat: "capsule, tablet",
    requiresDeliveryTechnology: false,
    easeOfFormulation: 3,
    solubility: 2,
    fto: 2,
    patentability: 2,
    admet: 2,
    hasGhsHazard: false,
    grasSource: true,
    nonNovelSource: false,
  },
  Berberine: {
    productFormat: "capsule, tablet",
    requiresDeliveryTechnology: true,
    easeOfFormulation: 2,
    solubility: 1,
    fto: 3,
    patentability: 3,
    admet: 2,
    hasGhsHazard: false,
    grasSource: false,
    nonNovelSource: false,
  },
  "o-Coumaric acid": {
    productFormat: "powder",
    requiresDeliveryTechnology: false,
    easeOfFormulation: 5,
    solubility: 3,
    fto: 3,
    patentability: 2,
    admet: 1,
    hasGhsHazard: false,
    grasSource: true,
    nonNovelSource: true,
  },
  Puerarin: {
    productFormat: "capsule, powder",
    requiresDeliveryTechnology: true,
    easeOfFormulation: 2,
    solubility: 1,
    fto: 2,
    patentability: 3,
    admet: 1,
    hasGhsHazard: false,
    grasSource: false,
    nonNovelSource: true,
  },
  Myricetin: {
    productFormat: "powder, tablet",
    requiresDeliveryTechnology: false,
    easeOfFormulation: 4,
    solubility: 2,
    fto: 3,
    patentability: 2,
    admet: 1,
    hasGhsHazard: false,
    grasSource: true,
    nonNovelSource: true,
  },
  "Syringic acid": {
    productFormat: "powder",
    requiresDeliveryTechnology: false,
    easeOfFormulation: 5,
    solubility: 4,
    fto: 3,
    patentability: 1,
    admet: 1,
    hasGhsHazard: false,
    grasSource: true,
    nonNovelSource: true,
  },
  "Lipoic acid": {
    productFormat: "capsule, softgel, tablet",
    requiresDeliveryTechnology: false,
    easeOfFormulation: 4,
    solubility: 5,
    fto: 1,
    patentability: 1,
    admet: 2,
    hasGhsHazard: false,
    grasSource: true,
    nonNovelSource: true,
  },
  "Epigallocatechin gallate + Capsaicin": {
    productFormat: "capsule, softgel",
    requiresDeliveryTechnology: true,
    easeOfFormulation: 2,
    solubility: 3,
    fto: 3,
    patentability: 3,
    admet: 2,
    hasGhsHazard: true,
    grasSource: true,
    nonNovelSource: true,
  },
  "Berberine + Sulforaphane": {
    productFormat: "capsule",
    requiresDeliveryTechnology: true,
    easeOfFormulation: 1,
    solubility: 1,
    fto: 3,
    patentability: 3,
    admet: 3,
    hasGhsHazard: false,
    grasSource: false,
    nonNovelSource: false,
  },
};
