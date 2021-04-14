const { test } = Deno;
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import {
  extractIdentificationQualifier,
  extractIdentificationRemarks,
  extractLifestage,
  extractScientificName,
  isSpecies,
} from "./sci-name.js";

const mollusca_veliger =
  "living>Eukaryota>Opisthokonta>Holozoa>Metazoa>Mollusca>veliger";

test("extractScientificName", () => {
  assertEquals(
    extractScientificName(
      "living>Eukaryota>Opisthokonta>Holozoa>Metazoa>Arthropoda>Crustacea>Maxillopoda>Copepoda>Siphonostomatoida>Lepeophtheirus>Lepeophtheirus salmonis",
    ),
    "Lepeophtheirus salmonis",
  );
  assertEquals(
    extractScientificName(
      "living>Eukaryota>Harosa>Alveolata>Myzozoa>Holodinophyta>Dinophyceae>Gonyaulacales>Ceratiaceae>Ceratium>Ceratium sp.",
    ),
    "Ceratium",
  );

  assertEquals(extractScientificName("Mollusca"), "Mollusca");
  assertEquals(extractScientificName("Calanus sp."), "Calanus");
  assertEquals(
    extractScientificName("Calanus finmarchicus"),
    "Calanus finmarchicus",
  );
  assertEquals(extractScientificName(mollusca_veliger), "Mollusca");
  assertEquals(extractScientificName("Copepoda>multiple"), "Copepoda");
  assertEquals(
    extractScientificName(
      "living>Eukaryota>Opisthokonta>Holozoa>Metazoa>Arthropoda>Crustacea>Maxillopoda>Copepoda>Calanoida>Calanidae>Calanus",
    ),
    "Calanus",
  );
});

test("identificationQualifier", () => {
  assertEquals(
    extractIdentificationQualifier(
      "living>Eukaryota>Harosa>Alveolata>Myzozoa>Holodinophyta>Dinophyceae>Gonyaulacales>Ceratiaceae>Ceratium>Ceratium sp.",
    ),
    "sp.",
  );
});

test("extractIdentificatinRemarks", () => {
  const h =
    "living>Eukaryota>Opisthokonta>Holozoa>Metazoa>Arthropoda>Crustacea>Maxillopoda>Copepoda>Calanoida>Calanidae>Calanus";
  assertEquals(extractIdentificationRemarks(h), h);
});

test("extractLifestage [zoea, veliger, etc.]", () => {
  assertEquals(extractLifestage(mollusca_veliger), "veliger");
});

test("Calanus finmarchicus is species", () => {
  assertEquals(isSpecies("Calanus finmarchicus"), true);
});

test("Calanus [sp.] is not species", () => {
  assertEquals(isSpecies("Calanus"), false);
  assertEquals(isSpecies("Calanus sp."), false);
});
