import { Organism } from "../lib/types";

export const organisms: Organism[] = [
  { id: "strep", name: "Strep", fullName: "Streptococcus spp.", category: "gram-positive", sortOrder: 0 },
  { id: "mssa", name: "MSSA", fullName: "Methicillin-Sensitive Staphylococcus aureus", category: "gram-positive", sortOrder: 1 },
  { id: "mrsa", name: "MRSA", fullName: "Methicillin-Resistant Staphylococcus aureus", category: "gram-positive", sortOrder: 2 },
  { id: "enterococcus", name: "Enterococcus", fullName: "Enterococcus spp. (VSE)", category: "gram-positive", sortOrder: 3 },
  { id: "vre", name: "VRE", fullName: "Vancomycin-Resistant Enterococcus", category: "gram-positive", sortOrder: 4 },
  { id: "gnr", name: "GNRs", fullName: "Gram-Negative Rods (E. coli, Klebsiella, Proteus)", category: "gram-negative", sortOrder: 5 },
  { id: "pseudomonas", name: "Pseudomonas", fullName: "Pseudomonas aeruginosa", category: "gram-negative", sortOrder: 6 },
  { id: "escappm", name: "ESCAPPM", fullName: "Enterobacter, Serratia, Citrobacter, Aeromonas, Proteus (indole+), Providencia, Morganella", category: "gram-negative", sortOrder: 7 },
  { id: "esbl", name: "ESBL", fullName: "Extended-Spectrum Beta-Lactamase producers", category: "gram-negative", sortOrder: 8 },
  { id: "anaerobes", name: "Anaerobes", fullName: "Bacteroides, Clostridium, Fusobacterium", category: "anaerobe", sortOrder: 9 },
  { id: "atypicals", name: "Atypicals", fullName: "Mycoplasma, Chlamydia, Legionella", category: "atypical", sortOrder: 10 },
];
