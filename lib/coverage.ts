import {
  Antibiotic,
  Organism,
  ComboCoverageResult,
  CoverageLevel,
} from "./types";

export function computeComboCoverage(
  selectedAntibiotics: Antibiotic[],
  organisms: Organism[]
): ComboCoverageResult[] {
  return organisms.map((org) => {
    const coverage = selectedAntibiotics.map((abx) => ({
      antibioticId: abx.id,
      antibioticName: abx.name,
      level: (abx.organismCoverage[org.id] ?? "none") as CoverageLevel,
    }));

    const effectiveLevel: CoverageLevel = coverage.some(
      (c) => c.level === "common"
    )
      ? "common"
      : coverage.some((c) => c.level === "sometimes")
        ? "sometimes"
        : "none";

    return {
      organismId: org.id,
      organismName: org.name,
      category: org.category,
      coverage,
      effectiveLevel,
    };
  });
}

export interface GapSuggestion {
  organismId: string;
  organismName: string;
  category: string;
  suggestions: {
    antibiotic: Antibiotic;
    level: CoverageLevel;
    additionalOrganismsCovered: string[];
  }[];
}

export function findGapSuggestions(
  results: ComboCoverageResult[],
  selectedIds: string[],
  allAntibiotics: Antibiotic[],
  allOrganisms: Organism[]
): GapSuggestion[] {
  const gaps = results.filter((r) => r.effectiveLevel === "none");
  const gapOrgIds = new Set(gaps.map((g) => g.organismId));
  const available = allAntibiotics.filter((a) => !selectedIds.includes(a.id));

  return gaps.map((gap) => {
    const suggestions = available
      .map((abx) => {
        const level = (abx.organismCoverage[gap.organismId] ?? "none") as CoverageLevel;
        if (level === "none") return null;

        // Count how many OTHER gap organisms this drug also covers
        const additionalOrganismsCovered = [...gapOrgIds]
          .filter((orgId) => orgId !== gap.organismId)
          .filter((orgId) => {
            const l = abx.organismCoverage[orgId];
            return l === "common" || l === "sometimes";
          })
          .map((orgId) => {
            const org = allOrganisms.find((o) => o.id === orgId);
            return org?.name ?? orgId;
          });

        return { antibiotic: abx, level, additionalOrganismsCovered };
      })
      .filter(Boolean) as GapSuggestion["suggestions"];

    // Sort: common first, then by how many additional gaps they cover
    suggestions.sort((a, b) => {
      if (a.level === "common" && b.level !== "common") return -1;
      if (a.level !== "common" && b.level === "common") return 1;
      return b.additionalOrganismsCovered.length - a.additionalOrganismsCovered.length;
    });

    return {
      organismId: gap.organismId,
      organismName: gap.organismName,
      category: gap.category,
      suggestions,
    };
  });
}

export function getCoverageStats(results: ComboCoverageResult[]) {
  const total = results.length;
  const common = results.filter((r) => r.effectiveLevel === "common").length;
  const sometimes = results.filter(
    (r) => r.effectiveLevel === "sometimes"
  ).length;
  const none = results.filter((r) => r.effectiveLevel === "none").length;
  return {
    total,
    common,
    sometimes,
    none,
    coveredPercent: Math.round(((common + sometimes) / total) * 100),
  };
}
