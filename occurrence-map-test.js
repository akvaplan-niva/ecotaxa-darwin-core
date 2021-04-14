import {
  assertEquals,
  assertObjectMatch,
} from "https://deno.land/std/testing/asserts.ts";
import { occurrenceMapFactory } from "./occurrence-map.js";
import {
  countryCode,
  ecotaxaDOIObject,
  project,
} from "./_test/doi-export-1-line.js";

const { test } = Deno;

const expected = {
  scientificName: "Calanus",
  lifeStage: undefined,
  occurrenceStatus: "present",
  eventDate: "2018-10-01T12:00:00Z",
  fieldNumber: "c_2_01102018",
  catalogNumber: "C_2_01102018_tot_1_706",
  locality: "Station1",
  basisOfRecord: "MachineObservation",
  verbatimEventDate: "20181001T120000",
  decimalLongitude: 21.166667,
  decimalLatitude: 70.416667,
  maximumDepthInMeters: 3,
  minimumDepthInMeters: 2,
  eventRemarks: "halocline",
  identificationRemarks:
    "living>Eukaryota>Opisthokonta>Holozoa>Metazoa>Arthropoda>Crustacea>Maxillopoda>Copepoda>Calanoida>Calanidae>Calanus",
  datasetID: "26363c61-01fd-5797-9c92-f6243374b769",
  occurrenceID: "46b7ac5b-2bc2-5905-9408-a21aa11e5cb3",
  eventID: "10e9a6cc-e9cb-5b7e-be07-c3528ffab99c",
  parentEventID: "26363c61-01fd-5797-9c92-f6243374b769",
  countryCode: "NO",
  geodeticDatum: "WGS84",
  coordinateUncertaintyInMeters: 30,
  dateIdentified: "2019-01-17T10:45:09Z",
  identificationVerificationStatus: "validated",
  datasetName: undefined,
  identifiedBy: "https://ecotaxa.obs-vlfr.fr | Some Person",
  associatedMedia: "images/Calanus/106561382_0.jpg",
};

test(`occurrence map yields { "scientificName: "Calanus", "occurrenceStatus": "present" […], country: "${countryCode}, […] }" , `, () => {
  const mapperfx = occurrenceMapFactory({ project, countryCode });
  const actual = mapperfx(ecotaxaDOIObject);
  assertObjectMatch(actual, expected);
});

test(`dynamicProperties`, () => {
  const dynamicProperties = (rest, dwc) =>
    Object.fromEntries(
      Object.entries(rest).filter(([k, v]) => /^img_/.test(k)),
    );

  const mapperfx = occurrenceMapFactory({
    project,
    countryCode,
    dynamicProperties,
  });
  const actual = mapperfx(ecotaxaDOIObject);
  assertObjectMatch(actual, {
    ...expected,
    dynamicProperties: {
      img_rank: 0,
    },
  });
});
