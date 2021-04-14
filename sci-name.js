const isScientificName = (s, re = /[A-Z][a-z\s]+/) => re.test(s);

export const isSpecies = (s, re = /^[A-Z][a-z]+\s[a-z]+(\s[a-z]+)?$/) =>
  re.test(s);

const split = (s, re = /[\>\<]{1}/g) => [...String(s).split(re)];

export const extractIdentificationRemarks = (h) => h.trim();

export const extractIdentificationQualifier = (h) => {
  if (/\ssp.$/.test(String(h).trim())) {
    return "sp.";
  }
  return undefined;
};

export const extractScientificName = (h /* object_annotation_hierarchy*/) => {
  if (!h) {
    return;
  }
  h = h.trim();
  if (isSpecies(h)) {
    return h;
  }
  const lifestage = extractLifestage(h);
  if (lifestage) {
    h = h.replace(lifestage, "").trim();
  }
  const iqual = extractIdentificationQualifier(h);
  if (iqual) {
    h = h.replace(iqual, "").trim();
  }
  h = h.replace(/ X$/, "");
  const parts = [...new Set(split(h))];

  const cand = parts.pop();

  if (isScientificName(cand)) {
    return cand;
  }
  const cand2 = parts.pop();
  if (isScientificName(cand2)) {
    return cand2;
  }
  return "";
};

export const extractLifestage = (
  h,
  lifestages = ["egg", "nauplii", "part", "veliger", "zoea"]
) => {
  const cand = split(h).pop();
  const l = lifestages.find((l) => cand === l);
  return l;
};
