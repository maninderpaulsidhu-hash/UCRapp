import { AntibioticClass } from "../lib/types";

export const antibioticClasses: AntibioticClass[] = [
  { id: "penicillins", name: "Penicillins", color: "#3B82F6", sortOrder: 0 },
  { id: "cephalosporins", name: "Cephalosporins", color: "#8B5CF6", sortOrder: 1 },
  { id: "carbapenems", name: "Carbapenems", color: "#EC4899", sortOrder: 2 },
  { id: "aminoglycosides", name: "Aminoglycosides", color: "#F59E0B", sortOrder: 3 },
  { id: "macrolides", name: "Macrolides", color: "#10B981", sortOrder: 4 },
  { id: "fluoroquinolones", name: "Fluoroquinolones", color: "#EF4444", sortOrder: 5 },
  { id: "tetracyclines", name: "Tetracyclines", color: "#06B6D4", sortOrder: 6 },
  { id: "other", name: "Other", color: "#6B7280", sortOrder: 7 },
];
