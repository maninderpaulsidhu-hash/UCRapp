import { antibiotics } from "./antibiotics";
import { organisms } from "./organisms";
import { infections } from "./infections";
import { antibioticClasses } from "./classes";

export const antibioticById = new Map(antibiotics.map((a) => [a.id, a]));
export const organismById = new Map(organisms.map((o) => [o.id, o]));
export const infectionById = new Map(infections.map((i) => [i.id, i]));

export const antibioticsByClass = antibioticClasses.map((cls) => ({
  ...cls,
  antibiotics: antibiotics
    .filter((a) => a.classId === cls.id)
    .sort((a, b) => a.sortOrder - b.sortOrder),
}));

export { antibiotics, organisms, infections, antibioticClasses };
