import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Stack } from "expo-router";
import Svg, { Line, Path, Text as SvgText } from "react-native-svg";

type WaveformKey = "ra" | "rv" | "pa" | "pcwp";

type WaveformDef = {
  label: string;
  range: string;
  rate: string;
  desc: string;
  path: (b: number) => [number, number][];
  labels: { t: string; x: number; y: number }[];
};

const waveforms: Record<WaveformKey, WaveformDef> = {
  ra: {
    label: "Right Atrium (RA)",
    range: "2–6 mmHg (mean)",
    rate: "a-wave: atrial contraction · v-wave: venous filling",
    desc: "The RA tracing shows three positive deflections (a, c, v) and two descents (x, y). The a-wave follows the P wave (atrial contraction); the c-wave reflects tricuspid valve closure / RV contraction onset; the v-wave reflects venous filling against a closed tricuspid valve. Large a-waves suggest tricuspid stenosis or RV hypertrophy; large v-waves suggest tricuspid regurgitation.",
    path: (b) => {
      const cycle = (x0: number): [number, number][] => [
        [x0, b], [x0 + 15, b - 38], [x0 + 30, b - 10], [x0 + 38, b - 18], [x0 + 55, b - 2],
        [x0 + 75, b - 30], [x0 + 95, b - 8], [x0 + 115, b],
      ];
      return ([] as [number, number][]).concat(cycle(20), cycle(20 + 185), cycle(20 + 370), cycle(20 + 555));
    },
    labels: [{ t: "a", x: 35, y: 0 }, { t: "c", x: 60, y: 8 }, { t: "v", x: 90, y: -2 }],
  },
  rv: {
    label: "Right Ventricle (RV)",
    range: "Systolic 15–25 / Diastolic 0–8 mmHg",
    rate: "Rapid systolic upstroke, low diastolic baseline",
    desc: 'On entering the RV, the diastolic pressure drops sharply toward 0 mmHg while systolic pressure rises (~15–25 mmHg). There is no dicrotic notch (pulmonic valve hasn\'t been crossed yet). A "square-root sign" diastolic pattern can suggest restrictive physiology or tamponade.',
    path: (b) => {
      const cycle = (x0: number): [number, number][] => [
        [x0, b], [x0 + 10, b - 2], [x0 + 22, b - 70], [x0 + 45, b - 78], [x0 + 60, b - 66],
        [x0 + 72, b - 4], [x0 + 95, b], [x0 + 115, b - 1],
      ];
      return ([] as [number, number][]).concat(cycle(20), cycle(20 + 185), cycle(20 + 370), cycle(20 + 555));
    },
    labels: [{ t: "systole", x: 45, y: -78 }, { t: "diastole ≈ 0", x: 95, y: 10 }],
  },
  pa: {
    label: "Pulmonary Artery (PA)",
    range: "Systolic 15–25 / Diastolic 8–15 mmHg",
    rate: "Systolic upstroke + dicrotic notch",
    desc: "Crossing the pulmonic valve, systolic pressure is similar to the RV, but diastolic pressure rises (8–15 mmHg) because the pulmonic valve now holds pressure during diastole. A dicrotic notch appears on the downslope, marking pulmonic valve closure.",
    path: (b) => {
      const cycle = (x0: number): [number, number][] => [
        [x0, b - 30], [x0 + 10, b - 32], [x0 + 22, b - 72], [x0 + 38, b - 80], [x0 + 52, b - 60],
        [x0 + 58, b - 50], [x0 + 64, b - 58], [x0 + 80, b - 40], [x0 + 100, b - 32], [x0 + 115, b - 30],
      ];
      return ([] as [number, number][]).concat(cycle(20), cycle(20 + 185), cycle(20 + 370), cycle(20 + 555));
    },
    labels: [{ t: "systole", x: 38, y: -82 }, { t: "dicrotic notch", x: 60, y: -65 }, { t: "diastole", x: 100, y: -40 }],
  },
  pcwp: {
    label: "Pulmonary Capillary Wedge (PCWP)",
    range: "6–12 mmHg (mean)",
    rate: "a and v waves (delayed/damped vs RA)",
    desc: 'Once "wedged," the catheter senses left atrial pressure transmitted through the pulmonary capillary bed. The tracing resembles the RA (a and v waves) but is lower amplitude and slightly time-delayed. Elevated PCWP (>18 mmHg) suggests left heart failure / cardiogenic pulmonary edema; large v-waves suggest mitral regurgitation.',
    path: (b) => {
      const cycle = (x0: number): [number, number][] => [
        [x0, b], [x0 + 15, b - 22], [x0 + 32, b - 6], [x0 + 55, b - 4],
        [x0 + 75, b - 20], [x0 + 95, b - 4], [x0 + 115, b],
      ];
      return ([] as [number, number][]).concat(cycle(20), cycle(20 + 185), cycle(20 + 370), cycle(20 + 555));
    },
    labels: [{ t: "a", x: 35, y: -2 }, { t: "v", x: 90, y: -2 }],
  },
};

const QUICK_REFERENCE: [string, string, string][] = [
  ["Right Atrium (RA / CVP)", "2–6 (mean)", "a, c, v waves; x and y descents"],
  ["Right Ventricle (RV)", "15–25 / 0–8", "Rapid systolic upstroke, low diastolic, no dicrotic notch"],
  ["Pulmonary Artery (PA)", "15–25 / 8–15", "Systolic upstroke + dicrotic notch (pulmonic valve closure)"],
  ["PCWP (wedge)", "6–12 (mean)", "Resembles RA: a and v waves, but damped & delayed"],
];

type Status = "low" | "normal" | "high" | null;
type ResultRow = { name: string; value: number | null; unit: string; range: string; status: Status };
type Profile = { text: string; interventions: string[] } | null;

type Inputs = {
  height: string; weight: string; hr: string;
  sbp: string; dbp: string; co: string;
  cvp: string; pas: string; pad: string; pcwp: string;
  sao2: string; svo2: string; hgb: string;
};

const initialInputs: Inputs = {
  height: "", weight: "", hr: "",
  sbp: "", dbp: "", co: "",
  cvp: "", pas: "", pad: "", pcwp: "",
  sao2: "", svo2: "", hgb: "",
};

function rangeStatus(v: number | null, lo: number, hi: number): Status {
  if (v === null) return null;
  if (v < lo) return "low";
  if (v > hi) return "high";
  return "normal";
}

function num(v: string): number | null {
  const n = parseFloat(v);
  return isNaN(n) ? null : n;
}

function fmt(value: number | null, unit: string) {
  if (value === null) return "—";
  return `${Math.round(value * 100) / 100}${unit ? " " + unit : ""}`;
}

const BADGE_COLORS: Record<"low" | "normal" | "high", { bg: string; text: string; label: string }> = {
  low: { bg: "rgba(79,195,247,.15)", text: "#4fc3f7", label: "LOW" },
  normal: { bg: "rgba(102,187,106,.15)", text: "#66bb6a", label: "NORMAL" },
  high: { bg: "rgba(239,83,80,.15)", text: "#ef5350", label: "HIGH" },
};

function Badge({ status }: { status: Status }) {
  if (status === null) return <Text style={styles.badgeEmpty}>—</Text>;
  const c = BADGE_COLORS[status];
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <Text style={[styles.badgeText, { color: c.text }]}>{c.label}</Text>
    </View>
  );
}

function Field({
  label, unit, value, onChangeText, placeholder,
}: {
  label: string;
  unit: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
}) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>
        {label} <Text style={styles.fieldUnit}>{unit}</Text>
      </Text>
      <TextInput
        style={styles.fieldInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#5b6b7a"
        keyboardType="numeric"
      />
    </View>
  );
}

export default function SwanGanzPage() {
  const [mainTab, setMainTab] = useState<"waveforms" | "calculator">("waveforms");
  const [activeWf, setActiveWf] = useState<WaveformKey>("ra");
  const [inputs, setInputs] = useState<Inputs>(initialInputs);
  const [results, setResults] = useState<{
    rows: ResultRow[];
    interp: [string, string][];
    interventions: [string, string[]][];
    profile: Profile;
  } | null>(null);

  const wf = waveforms[activeWf];

  const svgPath = useMemo(() => {
    const baseline = 190;
    const pts = wf.path(baseline);
    let d = `M ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
      const [x, y] = pts[i];
      const [px, py] = pts[i - 1];
      const mx = (px + x) / 2, my = (py + y) / 2;
      d += ` Q ${px} ${py} ${mx} ${my}`;
    }
    return { d, baseline };
  }, [wf]);

  function setInput<K extends keyof Inputs>(key: K, value: string) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  function calculate() {
    const h = num(inputs.height), w = num(inputs.weight), hr = num(inputs.hr);
    const sbp = num(inputs.sbp), dbp = num(inputs.dbp), co = num(inputs.co);
    const cvp = num(inputs.cvp), pas = num(inputs.pas), pad = num(inputs.pad), pcwp = num(inputs.pcwp);
    const sao2 = num(inputs.sao2), svo2 = num(inputs.svo2), hgb = num(inputs.hgb);

    const bsa = h !== null && w !== null ? 0.007184 * Math.pow(w, 0.425) * Math.pow(h, 0.725) : null;
    const map = sbp !== null && dbp !== null ? dbp + (sbp - dbp) / 3 : null;
    const pam = pas !== null && pad !== null ? pad + (pas - pad) / 3 : null;

    let fickCO: number | null = null;
    if (hgb !== null && sao2 !== null && svo2 !== null) {
      const vo2 = bsa !== null ? 125 * bsa : 125 * 1.73;
      fickCO = vo2 / (hgb * 1.34 * ((sao2 - svo2) / 100) * 10);
    }
    const coUsed = co !== null ? co : fickCO;

    const ci = coUsed !== null && bsa !== null ? coUsed / bsa : null;
    const sv = coUsed !== null && hr !== null ? (coUsed * 1000) / hr : null;
    const svi = sv !== null && bsa !== null ? sv / bsa : null;

    const svr = map !== null && cvp !== null && coUsed !== null ? (80 * (map - cvp)) / coUsed : null;
    const svri = svr !== null && bsa !== null ? svr * bsa : null;

    const pvr = pam !== null && pcwp !== null && coUsed !== null ? (80 * (pam - pcwp)) / coUsed : null;
    const pvri = pvr !== null && bsa !== null ? pvr * bsa : null;

    const rvswi = pam !== null && cvp !== null && svi !== null ? 0.0136 * (pam - cvp) * svi : null;
    const lvswi = map !== null && pcwp !== null && svi !== null ? 0.0136 * (map - pcwp) * svi : null;

    const rows: ResultRow[] = [
      { name: "BSA", value: bsa, unit: "m²", range: "1.6–2.0", status: null },
      { name: "MAP", value: map, unit: "mmHg", range: "70–105", status: rangeStatus(map, 70, 105) },
      { name: "PA Mean (PAm)", value: pam, unit: "mmHg", range: "9–18", status: rangeStatus(pam, 9, 18) },
      { name: "Cardiac Output (CO)", value: coUsed, unit: "L/min", range: "4.0–8.0", status: rangeStatus(coUsed, 4.0, 8.0) },
      { name: "Cardiac Index (CI)", value: ci, unit: "L/min/m²", range: "2.5–4.0", status: rangeStatus(ci, 2.5, 4.0) },
      { name: "Stroke Volume (SV)", value: sv, unit: "mL", range: "60–100", status: rangeStatus(sv, 60, 100) },
      { name: "Stroke Volume Index (SVI)", value: svi, unit: "mL/m²", range: "33–47", status: rangeStatus(svi, 33, 47) },
      { name: "CVP / RA mean", value: cvp, unit: "mmHg", range: "2–6", status: rangeStatus(cvp, 2, 6) },
      { name: "PCWP", value: pcwp, unit: "mmHg", range: "6–12", status: rangeStatus(pcwp, 6, 12) },
      { name: "SVR", value: svr, unit: "dyn·s/cm⁵", range: "800–1200", status: rangeStatus(svr, 800, 1200) },
      { name: "SVRI", value: svri, unit: "dyn·s·m²/cm⁵", range: "1970–2390", status: rangeStatus(svri, 1970, 2390) },
      { name: "PVR", value: pvr, unit: "dyn·s/cm⁵", range: "<250", status: pvr === null ? null : pvr > 250 ? "high" : "normal" },
      { name: "PVRI", value: pvri, unit: "dyn·s·m²/cm⁵", range: "255–285", status: rangeStatus(pvri, 255, 285) },
      { name: "RVSWI", value: rvswi, unit: "g·m/m²", range: "5–10", status: rangeStatus(rvswi, 5, 10) },
      { name: "LVSWI", value: lvswi, unit: "g·m/m²", range: "50–62", status: rangeStatus(lvswi, 50, 62) },
    ];

    const interp: [string, string][] = [];
    if (ci !== null) {
      if (ci < 2.2) interp.push(["Cardiac Index", `CI ${ci.toFixed(2)} L/min/m² is reduced — suggests low cardiac output / poor forward flow. Consider cardiogenic shock if SVR is elevated, or look for a precipitant (ischemia, arrhythmia, valvular disease, tamponade).`]);
      else if (ci < 2.5) interp.push(["Cardiac Index", `CI ${ci.toFixed(2)} L/min/m² is borderline-low.`]);
      else if (ci <= 4.0) interp.push(["Cardiac Index", `CI ${ci.toFixed(2)} L/min/m² is within normal range.`]);
      else interp.push(["Cardiac Index", `CI ${ci.toFixed(2)} L/min/m² is elevated — seen in sepsis/distributive (hyperdynamic) shock, anemia, thyrotoxicosis, or AV shunting.`]);
    }
    if (svr !== null) {
      if (svr < 800) interp.push(["SVR", `SVR ${Math.round(svr)} dyn·s/cm⁵ is low — suggests vasodilation/distributive shock (sepsis, anaphylaxis, neurogenic, liver failure) or excessive vasodilator therapy.`]);
      else if (svr <= 1200) interp.push(["SVR", `SVR ${Math.round(svr)} dyn·s/cm⁵ is within normal range.`]);
      else interp.push(["SVR", `SVR ${Math.round(svr)} dyn·s/cm⁵ is elevated — suggests compensatory vasoconstriction (e.g., cardiogenic shock, hypovolemia) or excess vasopressor effect.`]);
    }
    if (pvr !== null) {
      if (pvr > 250) interp.push(["PVR", `PVR ${Math.round(pvr)} dyn·s/cm⁵ is elevated — suggests pulmonary hypertension (precapillary if PCWP is normal: e.g. PE, COPD, primary PAH; or due to chronically elevated PCWP if left-sided disease is present).`]);
      else interp.push(["PVR", `PVR ${Math.round(pvr)} dyn·s/cm⁵ is within normal range.`]);
    }
    if (pcwp !== null) {
      if (pcwp > 18) interp.push(["PCWP", `PCWP ${pcwp} mmHg is elevated — suggests left ventricular dysfunction / cardiogenic pulmonary edema, severe mitral regurgitation, or volume overload.`]);
      else if (pcwp < 6) interp.push(["PCWP", `PCWP ${pcwp} mmHg is low — suggests hypovolemia or a preload-deplete state.`]);
      else interp.push(["PCWP", `PCWP ${pcwp} mmHg is within normal range, consistent with euvolemic left-sided filling pressures.`]);
    }
    if (cvp !== null) {
      if (cvp > 6) interp.push(["CVP", `CVP ${cvp} mmHg is elevated — consider right heart failure, tamponade, constrictive pericarditis, volume overload, or tricuspid valve disease.`]);
      else if (cvp < 2) interp.push(["CVP", `CVP ${cvp} mmHg is low — consistent with hypovolemia / reduced right-sided preload.`]);
    }

    const interventions: [string, string[]][] = [];
    if (ci !== null && ci < 2.2) {
      interventions.push(["Low Cardiac Index", [
        "Inotropic support (e.g., dobutamine, milrinone) if cardiogenic in origin.",
        "Treat the underlying cause: revascularize if ischemic, rate/rhythm control if arrhythmic, pericardiocentesis if tamponade.",
        "Consider mechanical circulatory support (IABP, Impella, ECMO) in refractory cardiogenic shock.",
        "Optimize preload first — give a fluid challenge only if PCWP/CVP are not already elevated.",
      ]]);
    }
    if (svr !== null && svr > 1200) {
      interventions.push(["Elevated SVR", [
        "Afterload reduction with vasodilators (e.g., nitroprusside, nitroglycerin, ACE inhibitor/ARB) once perfusion pressure is adequate.",
        "Wean vasopressors if elevated SVR is iatrogenic from excess vasoconstrictor dosing.",
        "Treat pain/anxiety, which can drive sympathetic vasoconstriction.",
      ]]);
    }
    if (svr !== null && svr < 800) {
      interventions.push(["Low SVR", [
        "Vasopressors (norepinephrine first-line; vasopressin or phenylephrine as adjuncts) to restore vascular tone.",
        "Source control and antibiotics if septic shock is suspected.",
        "Stop or reduce vasodilating agents if drug-induced.",
      ]]);
    }
    if (pvr !== null && pvr > 250) {
      interventions.push(["Elevated PVR", [
        "Pulmonary vasodilators (inhaled nitric oxide, inhaled epoprostenol, sildenafil) for precapillary pulmonary hypertension.",
        "Treat the underlying cause (anticoagulation for PE, bronchodilators/oxygen for COPD).",
        "Avoid hypoxia, hypercapnia, and acidosis, which all worsen pulmonary vasoconstriction.",
        "If PVR elevation is driven by elevated PCWP (left heart disease), prioritize treating the left-sided pressure instead.",
      ]]);
    }
    if (pcwp !== null && pcwp > 18) {
      interventions.push(["Elevated PCWP", [
        "Diuresis (IV loop diuretics) to reduce volume overload and pulmonary congestion.",
        "Afterload reduction (vasodilators) to improve forward flow and lower left-sided filling pressure.",
        "Consider inotropes if forward flow (CI) is also low (cardiogenic, not purely volume overload).",
        "Non-invasive ventilation/CPAP for acute pulmonary edema with respiratory distress.",
      ]]);
    }
    if (pcwp !== null && pcwp < 6) {
      interventions.push(["Low PCWP", [
        "IV fluid resuscitation to restore left-sided preload, guided by repeat CI/PCWP response.",
        "Identify and treat the source of volume loss (hemorrhage, GI losses, excessive diuresis).",
      ]]);
    }
    if (cvp !== null && cvp > 6) {
      interventions.push(["Elevated CVP", [
        "Evaluate for right heart failure, tamponade, or constrictive pericarditis with echocardiography.",
        "Diuresis if right-sided volume overload; pericardiocentesis/drainage if tamponade.",
        "Avoid aggressive fluid administration.",
      ]]);
    }
    if (cvp !== null && cvp < 2) {
      interventions.push(["Low CVP", ["IV fluid bolus to restore right-sided preload, reassessing CVP/CI response."]]);
    }

    let profile: Profile = null;
    if (ci !== null && svr !== null) {
      const lowCI = ci < 2.2, highSVR = svr > 1200, lowSVR = svr < 800;
      const highPCWP = pcwp !== null && pcwp > 18, lowPCWP = pcwp !== null && pcwp < 8;
      if (lowCI && highSVR && highPCWP) {
        profile = {
          text: "Cardiogenic shock pattern: ↓CI, ↑SVR, ↑PCWP — pump failure with compensatory vasoconstriction and elevated filling pressures.",
          interventions: [
            "Inotropes (dobutamine, milrinone) to augment contractility.",
            "Diuresis if congested and blood pressure tolerates it.",
            "Cautious afterload reduction once perfusion pressure is adequate.",
            "Treat the precipitant: revascularization for MI, antiarrhythmics for arrhythmia, valve intervention if structural.",
            "Escalate to mechanical circulatory support (IABP/Impella/ECMO) if refractory.",
          ],
        };
      } else if (lowCI && highSVR && lowPCWP) {
        profile = {
          text: "Hypovolemic shock pattern: ↓CI, ↑SVR, ↓/normal PCWP — inadequate preload with compensatory vasoconstriction.",
          interventions: [
            "Volume resuscitation (crystalloid or blood products if hemorrhagic) is the primary intervention.",
            "Identify and control the source of fluid loss.",
            "Avoid premature vasopressors before adequate volume repletion.",
          ],
        };
      } else if (!lowCI && lowSVR) {
        profile = {
          text: "Distributive (septic) shock pattern: normal/↑CI with ↓SVR — vasodilatory shock with preserved or hyperdynamic cardiac output.",
          interventions: [
            "Norepinephrine as first-line vasopressor to restore SVR/MAP.",
            "Early fluid resuscitation guided by dynamic measures, balanced against right/left filling pressures.",
            "Source control and early appropriate antibiotics if sepsis.",
            "Add vasopressin or stress-dose steroids if norepinephrine requirement escalates.",
          ],
        };
      } else if (lowCI && lowSVR) {
        profile = {
          text: "Mixed shock pattern (e.g., late/septic with myocardial depression): ↓CI with ↓SVR — consider combined cardiogenic and distributive physiology.",
          interventions: [
            "Vasopressors (norepinephrine) to restore SVR while reassessing volume status.",
            "Add an inotrope (dobutamine or epinephrine) if echocardiography confirms depressed contractility.",
            "Treat the underlying septic or inflammatory source.",
            "Closely titrate fluids — these patients can be harmed by both under- and over-resuscitation.",
          ],
        };
      } else {
        profile = {
          text: "Hemodynamics do not fit a classic single shock profile — interpret in the context of clinical exam, lactate, and trend over time.",
          interventions: ["Reassess with serial measurements and correlate with exam, lactate, and urine output rather than a single snapshot."],
        };
      }
    }

    setResults({ rows, interp, interventions, profile });
  }

  return (
    <>
      <Stack.Screen options={{ title: "Swan-Ganz Toolkit" }} />
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Text style={styles.headerTitle}>Swan-Ganz Catheter Toolkit</Text>
        <Text style={styles.headerSubtitle}>
          Right heart catheterization waveforms & hemodynamic calculator with interpretation
        </Text>

        <View style={styles.tabRow}>
          {(["waveforms", "calculator"] as const).map((tab) => (
            <Pressable
              key={tab}
              style={[styles.tabButton, mainTab === tab && styles.tabButtonActive]}
              onPress={() => setMainTab(tab)}
            >
              <Text style={[styles.tabButtonText, mainTab === tab && styles.tabButtonTextActive]}>
                {tab === "waveforms" ? "Waveforms" : "Calculator"}
              </Text>
            </Pressable>
          ))}
        </View>

        {mainTab === "waveforms" && (
          <>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Pressure Waveforms During Catheter Insertion</Text>
              <Text style={styles.cardSubtitle}>
                As the catheter is advanced from the right atrium through the right ventricle, into the pulmonary
                artery, and finally wedged in a distal branch, the pressure tracing changes shape and amplitude.
                Select a chamber below.
              </Text>

              <View style={styles.wfButtonRow}>
                {(Object.keys(waveforms) as WaveformKey[]).map((key) => (
                  <Pressable
                    key={key}
                    style={[styles.wfButton, activeWf === key && styles.wfButtonActive]}
                    onPress={() => setActiveWf(key)}
                  >
                    <Text style={[styles.wfButtonText, activeWf === key && styles.wfButtonTextActive]}>
                      {waveforms[key].label.split(" (")[0]}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <View style={styles.svgBox}>
                <Svg viewBox="0 0 760 260" width="100%" height={220}>
                  <Line x1="10" y1={svgPath.baseline} x2="750" y2={svgPath.baseline} stroke="#2a3a4a" strokeWidth={1} />
                  <SvgText x="14" y={svgPath.baseline - 4} fill="#94a7b8" fontSize="11">0</SvgText>
                  <Path d={svgPath.d} fill="none" stroke="#4fc3f7" strokeWidth={2.5} strokeLinecap="round" />
                  {wf.labels.map((l) => (
                    <SvgText
                      key={l.t}
                      x={l.x}
                      y={svgPath.baseline + l.y - 95}
                      fill="#ff8a65"
                      fontSize="13"
                      fontWeight="600"
                    >
                      {l.t}
                    </SvgText>
                  ))}
                </Svg>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoBox}>
                  <Text style={styles.infoLabel}>Normal Range</Text>
                  <Text style={styles.infoValue}>{wf.range}</Text>
                </View>
                <View style={styles.infoBox}>
                  <Text style={styles.infoLabel}>Key Features</Text>
                  <Text style={styles.infoValue}>{wf.rate}</Text>
                </View>
              </View>

              <Text style={styles.desc}>{wf.desc}</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardSectionTitle}>Quick Reference: Normal Pressures</Text>
              <View style={styles.table}>
                {QUICK_REFERENCE.map((row) => (
                  <View key={row[0]} style={styles.refRow}>
                    <Text style={styles.refChamber}>{row[0]}</Text>
                    <Text style={styles.refPressure}>{row[1]} mmHg</Text>
                    <Text style={styles.refFeatures}>{row[2]}</Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}

        {mainTab === "calculator" && (
          <>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Hemodynamic Calculator</Text>
              <Text style={styles.cardSubtitle}>
                Enter the values obtained from the Swan-Ganz catheter and vitals. Leave fields blank if unavailable —
                derived values that depend on them will simply be skipped.
              </Text>

              <Text style={styles.fieldGroupTitle}>Patient</Text>
              <Field label="Height" unit="(cm)" value={inputs.height} onChangeText={(t) => setInput("height", t)} placeholder="170" />
              <Field label="Weight" unit="(kg)" value={inputs.weight} onChangeText={(t) => setInput("weight", t)} placeholder="70" />
              <Field label="Heart Rate" unit="(bpm)" value={inputs.hr} onChangeText={(t) => setInput("hr", t)} placeholder="80" />

              <Text style={styles.fieldGroupTitle}>Systemic</Text>
              <Field label="Systolic BP" unit="(mmHg)" value={inputs.sbp} onChangeText={(t) => setInput("sbp", t)} placeholder="120" />
              <Field label="Diastolic BP" unit="(mmHg)" value={inputs.dbp} onChangeText={(t) => setInput("dbp", t)} placeholder="75" />
              <Field label="Cardiac Output (CO)" unit="(L/min) — thermodilution or Fick" value={inputs.co} onChangeText={(t) => setInput("co", t)} placeholder="5.0" />

              <Text style={styles.fieldGroupTitle}>Right Heart / Pulmonary</Text>
              <Field label="CVP / RA mean" unit="(mmHg)" value={inputs.cvp} onChangeText={(t) => setInput("cvp", t)} placeholder="6" />
              <Field label="PA Systolic" unit="(mmHg)" value={inputs.pas} onChangeText={(t) => setInput("pas", t)} placeholder="25" />
              <Field label="PA Diastolic" unit="(mmHg)" value={inputs.pad} onChangeText={(t) => setInput("pad", t)} placeholder="12" />
              <Field label="PCWP" unit="(mmHg)" value={inputs.pcwp} onChangeText={(t) => setInput("pcwp", t)} placeholder="10" />

              <Text style={styles.fieldGroupTitle}>Oxygenation (optional — Fick CO)</Text>
              <Field label="SaO₂" unit="(%)" value={inputs.sao2} onChangeText={(t) => setInput("sao2", t)} placeholder="98" />
              <Field label="SvO₂ (mixed venous)" unit="(%)" value={inputs.svo2} onChangeText={(t) => setInput("svo2", t)} placeholder="68" />
              <Field label="Hemoglobin" unit="(g/dL)" value={inputs.hgb} onChangeText={(t) => setInput("hgb", t)} placeholder="13" />

              <Pressable style={styles.calcButton} onPress={calculate}>
                <Text style={styles.calcButtonText}>Calculate</Text>
              </Pressable>
              <Text style={styles.formulaNote}>
                Formulas: BSA (Du Bois) = 0.007184 × W^0.425 × H^0.725. SVR = 80×(MAP−CVP)/CO. PVR =
                80×(PAmean−PCWP)/CO. Fick CO = (VO₂ ÷ (Hgb×1.34×(SaO₂−SvO₂)×10)), using an assumed VO₂ of 125
                mL/min/m² when not measured directly.
              </Text>
            </View>

            {results && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Results</Text>
                <View style={styles.resultsTable}>
                  {results.rows.map((r) => (
                    <View key={r.name} style={styles.resultRow}>
                      <Text style={styles.resultName}>{r.name}</Text>
                      <View style={styles.resultRight}>
                        <Text style={styles.resultValue}>{fmt(r.value, r.unit)}</Text>
                        <Text style={styles.resultRange}>{r.range}</Text>
                        <Badge status={r.status} />
                      </View>
                    </View>
                  ))}
                </View>

                {results.interp.map(([title, p]) => (
                  <View key={title} style={styles.interpBlock}>
                    <Text style={styles.interpTitle}>{title}</Text>
                    <Text style={styles.interpText}>{p}</Text>
                  </View>
                ))}

                <Text style={styles.cardSectionTitle}>Possible Interventions</Text>
                {results.interventions.length === 0 ? (
                  <Text style={styles.cardSubtitle}>
                    All entered parameters are within normal range — no specific intervention indicated based on
                    hemodynamics alone.
                  </Text>
                ) : (
                  results.interventions.map(([title, list]) => (
                    <View key={title} style={styles.interpBlock}>
                      <Text style={styles.interpTitle}>{title}</Text>
                      {list.map((item) => (
                        <Text key={item} style={styles.bulletItem}>• {item}</Text>
                      ))}
                    </View>
                  ))
                )}

                {results.profile && (
                  <View style={styles.profileBox}>
                    <Text style={styles.profileText}>
                      <Text style={styles.profileLabel}>Hemodynamic Profile: </Text>
                      {results.profile.text}
                    </Text>
                    {results.profile.interventions.map((item) => (
                      <Text key={item} style={styles.bulletItem}>• {item}</Text>
                    ))}
                  </View>
                )}
              </View>
            )}
          </>
        )}

        <Text style={styles.footerNote}>
          For education only — not a substitute for clinical judgment or institutional protocols.
        </Text>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#0f1620" },
  content: { padding: 16, paddingBottom: 40 },
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#e8eef4", textAlign: "center", marginBottom: 4 },
  headerSubtitle: { fontSize: 13, color: "#94a7b8", textAlign: "center", marginBottom: 16 },
  tabRow: { flexDirection: "row", justifyContent: "center", gap: 8, marginBottom: 16 },
  tabButton: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#2a3a4a",
    backgroundColor: "#16202c",
  },
  tabButtonActive: { backgroundColor: "#4fc3f7", borderColor: "#4fc3f7" },
  tabButtonText: { color: "#e8eef4", fontSize: 14 },
  tabButtonTextActive: { color: "#06222e", fontWeight: "700" },
  card: {
    backgroundColor: "#16202c",
    borderWidth: 1,
    borderColor: "#2a3a4a",
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
  },
  cardTitle: { fontSize: 17, fontWeight: "700", color: "#e8eef4", marginBottom: 4 },
  cardSectionTitle: { fontSize: 15, fontWeight: "700", color: "#4fc3f7", marginBottom: 8, marginTop: 4 },
  cardSubtitle: { fontSize: 13, color: "#94a7b8", marginBottom: 14, lineHeight: 18 },
  wfButtonRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 12 },
  wfButton: {
    flexGrow: 1,
    minWidth: "45%",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2a3a4a",
    backgroundColor: "#1c2a38",
    alignItems: "center",
  },
  wfButtonActive: { backgroundColor: "#4fc3f7", borderColor: "#4fc3f7" },
  wfButtonText: { color: "#e8eef4", fontSize: 12 },
  wfButtonTextActive: { color: "#06222e", fontWeight: "700" },
  svgBox: {
    backgroundColor: "#0b121a",
    borderWidth: 1,
    borderColor: "#2a3a4a",
    borderRadius: 10,
    padding: 10,
  },
  infoRow: { flexDirection: "row", gap: 12, marginTop: 14 },
  infoBox: { flex: 1, backgroundColor: "#1c2a38", borderRadius: 10, padding: 12 },
  infoLabel: { color: "#4fc3f7", fontSize: 11, fontWeight: "700", textTransform: "uppercase", marginBottom: 4, letterSpacing: 0.5 },
  infoValue: { color: "#e8eef4", fontSize: 13 },
  desc: { color: "#94a7b8", fontSize: 13, marginTop: 14, lineHeight: 19 },
  table: { marginTop: 4 },
  refRow: { borderBottomWidth: 1, borderBottomColor: "#2a3a4a", paddingVertical: 10 },
  refChamber: { color: "#e8eef4", fontWeight: "700", fontSize: 13, marginBottom: 2 },
  refPressure: { color: "#4fc3f7", fontSize: 12, marginBottom: 2 },
  refFeatures: { color: "#94a7b8", fontSize: 12 },
  fieldGroupTitle: { fontSize: 14, fontWeight: "700", color: "#4fc3f7", marginTop: 16, marginBottom: 4 },
  fieldWrap: { marginTop: 8 },
  fieldLabel: { fontSize: 12, color: "#94a7b8", marginBottom: 4 },
  fieldUnit: { fontSize: 11, color: "#6b7d8d" },
  fieldInput: {
    backgroundColor: "#1c2a38",
    borderWidth: 1,
    borderColor: "#2a3a4a",
    color: "#e8eef4",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 9,
    fontSize: 14,
  },
  calcButton: {
    marginTop: 18,
    backgroundColor: "#4fc3f7",
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
  },
  calcButtonText: { color: "#06222e", fontWeight: "700", fontSize: 15 },
  formulaNote: { fontSize: 11, color: "#94a7b8", marginTop: 10, lineHeight: 15 },
  resultsTable: { marginBottom: 8 },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#2a3a4a",
    paddingVertical: 8,
  },
  resultName: { color: "#e8eef4", fontSize: 13, flex: 1 },
  resultRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  resultValue: { color: "#e8eef4", fontWeight: "700", fontSize: 13 },
  resultRange: { color: "#94a7b8", fontSize: 11 },
  badge: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 6 },
  badgeText: { fontSize: 11, fontWeight: "700" },
  badgeEmpty: { color: "#94a7b8", fontSize: 12 },
  interpBlock: { marginTop: 14 },
  interpTitle: { color: "#4fc3f7", fontWeight: "700", fontSize: 14, marginBottom: 4 },
  interpText: { color: "#cfdae3", fontSize: 13, lineHeight: 18 },
  bulletItem: { color: "#cfdae3", fontSize: 13, lineHeight: 19, marginBottom: 2 },
  profileBox: {
    marginTop: 16,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2a3a4a",
    backgroundColor: "#1c2a38",
  },
  profileLabel: { color: "#ff8a65", fontWeight: "700" },
  profileText: { color: "#e8eef4", fontSize: 13, lineHeight: 19, marginBottom: 6 },
  footerNote: { textAlign: "center", color: "#94a7b8", fontSize: 11, paddingTop: 8, paddingBottom: 16 },
});
