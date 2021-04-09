import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import {
  datasetUUIDv5,
  ECOTAXA_NAMESPACE,
  ECOTAXA_URL,
  ecotaxaProjectURL,
  eventUUIDv5,
  occurrenceUUIDv5,
  uuidv5,
  uuidv5URL,
} from "./id.js";
const { test } = Deno;

test(`EcoTaxa namespace is UUID v5 of EcoTaxa URL: ${ECOTAXA_URL}`, () => {
  assertEquals(uuidv5URL(ECOTAXA_URL), ECOTAXA_NAMESPACE);
});

test(`datasetID is UUID v5 of project URL`, () => {
  const expect818 = "16c02403-3bca-59d2-b057-c0c40958827b";
  assertEquals(datasetUUIDv5({ project: 818 }), expect818);
  assertEquals(uuidv5URL(ecotaxaProjectURL({ project: 818 })), expect818);
});

test(`occurrenceID is UUID v5 generated from catalogNumber in datasetID namespace`, () => {
  const expect = "288a98e6-ee9f-5171-afaf-f9b61dd0af4d";
  const catalogNumber = "n1_12m_dive_autumn_2017_large_tot_1_2";
  const datasetID = "16c02403-3bca-59d2-b057-c0c40958827b";

  assertEquals(occurrenceUUIDv5({ catalogNumber, datasetID }), expect);
  assertEquals(
    uuidv5({
      name: catalogNumber,
      namespace: datasetID,
    }),
    expect,
  );
});

test("eventID is UUID v5 generated from fieldNumber in namespace parentEventID (or if missing: namespace datasetID)", () => {
  // uuidgen --sha1 --namespace "0b1f80a6-730f-4a78-9285-d29e7be41aab" --name "sample1"
  const parentEventID = "0b1f80a6-730f-4a78-9285-d29e7be41aab";
  const fieldNumber = "sample1";
  const expected = "3a244ec7-0df5-5dee-b0e2-adaa3736b31a";
  assertEquals(eventUUIDv5({ parentEventID, fieldNumber }), expected);
  assertEquals(
    eventUUIDv5({ datasetID: parentEventID, fieldNumber }),
    expected,
  );
});
