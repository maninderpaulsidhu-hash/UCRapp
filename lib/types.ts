export type CoverageLevel = "common" | "sometimes" | "none";

export type OrganismCategory =
  | "gram-positive"
  | "gram-negative"
  | "anaerobe"
  | "atypical";

export type AntibioticClassName =
  | "penicillins"
  | "cephalosporins"
  | "carbapenems"
  | "aminoglycosides"
  | "macrolides"
  | "fluoroquinolones"
  | "tetracyclines"
  | "other";

export type AllergyGroup =
  | "beta-lactam"
  | "fluoroquinolone"
  | "sulfa"
  | "macrolide"
  | "tetracycline"
  | "aminoglycoside"
  | "none";

export interface Organism {
  id: string;
  name: string;
  fullName: string;
  category: OrganismCategory;
  sortOrder: number;
}

export interface InfectionType {
  id: string;
  name: string;
  fullName: string;
  commonOrganisms: string[];
  sometimesOrganisms: string[];
  sortOrder: number;
}

export interface AntibioticClass {
  id: AntibioticClassName;
  name: string;
  color: string;
  sortOrder: number;
}

export interface Antibiotic {
  id: string;
  name: string;
  abbreviation: string;
  classId: AntibioticClassName;
  allergyGroup: AllergyGroup;
  route: string[];
  organismCoverage: Record<string, CoverageLevel>;
  infectionCoverage: Record<string, CoverageLevel>;
  sortOrder: number;
}

export interface ComboCoverageResult {
  organismId: string;
  organismName: string;
  category: OrganismCategory;
  coverage: ComboDrugCoverage[];
  effectiveLevel: CoverageLevel;
}

export interface ComboDrugCoverage {
  antibioticId: string;
  antibioticName: string;
  level: CoverageLevel;
}
