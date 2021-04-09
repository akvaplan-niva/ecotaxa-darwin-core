# ecotaxa-darwin-core

[Deno](https://deno.land) command-line tools for creating [Darwin Core](https://dwc.tdwg.org/terms/) records from [EcoTaxa](https://ecotaxa.obs-vlfr.fr/) exports.

![Calanoida](3717.jpg)

## ecotaxa-occurrences

```sh
$ ecotaxa-occurrences -h
ecotaxa-occurrences

 Converts EcoTaxa NDJSON to Darwin Core Occurrencess

Use:
  cat ecotaxa.ndjson | ecotaxa-occurrences --project number

Options
  --project     EcoTaxa project number (integer)
  --country     Set country code
  --not-living  Also include records classified as not-living

$ cat testdata/ecotaxa-doi-export-1-line.ndjson | deno run ecotaxa-occurrences.js --project 818
{"scientificName":"Copepoda","organismQuantity":1,"organismQuantityType":"individuals","occurrenceStatus":"present","eventDate":"2017-08-31T11:11:11Z","fieldNumber":"n1_12m_dive_autumn_2017_large","catalogNumber":"n1_12m_dive_autumn_2017_large_tot_1_2","locality":"n1","basisOfRecord":"MachineObservation","verbatimEventDate":"20170831T111111","decimalLongitude":-14.78215,"decimalLatitude":78.375417,"maximumDepthInMeters":12,"minimumDepthInMeters":12,"samplingProtocol":"dive","samplingEffort":"dive mesh size 100 from rubber_boat","occurrenceID":"288a98e6-ee9f-5171-afaf-f9b61dd0af4d","datasetID":"16c02403-3bca-59d2-b057-c0c40958827b","eventID":"8753512a-b0bc-5480-a947-a9a0a5111853","parentEventID":"16c02403-3bca-59d2-b057-c0c40958827b","geodeticDatum":"WGS84","coordinateUncertaintyInMeters":30,"dateIdentified":"2018-05-14T00:00:00Z","identificationVerificationStatus":"validated","identificationRemarks":"living>Eukaryota>Opisthokonta>Holozoa>Metazoa>Arthropoda>Crustacea>Maxillopoda>Copepoda","identifiedBy":"https://ecotaxa.obs-vlfr.fr | User Name"}

```
