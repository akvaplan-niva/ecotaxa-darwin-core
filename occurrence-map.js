import {
  datasetUUIDv5,
  ECOTAXA_NAMESPACE,
  ECOTAXA_URL,
  eventUUIDv5,
  occurrenceUUIDv5,
  uuidv5,
} from "./id.js";
import { extractDate } from "./event-date.js";
import { extractLifestage, extractScientificName } from "./sci-name.js";

const { fromEntries, entries } = Object;

export const occurrenceMapFactory = ({
  datasetID,
  datasetName,
  countryCode,
  geodeticDatum = "WGS84",
  coordinateUncertaintyInMeters = 30,
  coordinatePrecision = 0.00001,
  dynamicProperties = false,
  basisOfRecord = "MachineObservation",
  project, //EcoTaxa project number
  debug,
} = {}) =>
  ({
    object_id,
    object_annotation_hierarchy,
    object_annotation_status,
    object_annotation_date,
    object_annotation_time,
    object_annotation_person_name,
    object_date,
    object_time,
    object_lon,
    object_lat,
    object_depth_max,
    object_depth_min,
    sample_id,
    sample_stationid,
    sample_net_type,
    sample_net_mesh,
    sample_ship,
    sample_tot_vol,
    sample_comment,
    img_file_name,
    objid,
    ...rest
  }) => {
    if (!datasetID && !project) {
      throw "Missing datasetID or EcoTaxa project number";
    }
    const scientificName = extractScientificName(object_annotation_hierarchy);
    const lifeStage = extractLifestage(object_annotation_hierarchy);

    // 1:1 mapping
    const fieldNumber = sample_id;
    const catalogNumber = object_id;
    const decimalLatitude = object_lat
      ? Number(Number(object_lat).toFixed(6))
      : undefined;
    const decimalLongitude = object_lon
      ? Number(Number(object_lon).toFixed(6))
      : undefined;
    const maximumDepthInMeters = object_depth_max;
    const minimumDepthInMeters = object_depth_min;
    const identificationVerificationStatus = object_annotation_status;

    // Dates
    const verbatimEventDate = `${object_date}T${object_time ?? ""}`;
    const dateIdentified = extractDate(
      `${object_annotation_date}T${object_annotation_time}`,
    );
    const eventDate = extractDate(verbatimEventDate, {
      max: new Date(dateIdentified ?? undefined),
    });

    const samplingProtocol = `${sample_net_type}`;

    // IDs
    // DatasetID from EcoTaxa project number
    datasetID = undefined === datasetID && project
      ? datasetUUIDv5({ project })
      : datasetID;

    // Parent event ID from dataset ID
    const parentEventID = datasetID ? datasetID : undefined;

    // eventID from fieldNumber and parentEventID
    const eventID = fieldNumber && parentEventID
      ? eventUUIDv5({ parentEventID, fieldNumber })
      : undefined;

    // occurrenceID from catalogNumber
    const occurrenceID = catalogNumber && datasetID
      ? occurrenceUUIDv5({ catalogNumber, datasetID })
      : uuidv5({ name: objid, namespace: ECOTAXA_NAMESPACE });

    const locality = sample_stationid ? String(sample_stationid) : undefined;

    const identifiedBy = object_annotation_person_name
      ? [ECOTAXA_URL, object_annotation_person_name].join(" | ")
      : ECOTAXA_URL;
    const associatedMedia = img_file_name;

    let samplingEffort = `${sample_net_type} mesh size ${sample_net_mesh ||
      "?"} from ${sample_ship || ""}`;

    const identificationRemarks = object_annotation_hierarchy;

    const occurrence = {
      scientificName,
      lifeStage,
      organismQuantity: 1,
      organismQuantityType: "individuals",
      occurrenceStatus: scientificName ? "present" : undefined,
      eventDate,
      fieldNumber,
      catalogNumber,
      locality,
      basisOfRecord,
      verbatimEventDate,
      decimalLongitude,
      decimalLatitude,
      maximumDepthInMeters,
      minimumDepthInMeters,
      samplingProtocol,
      eventRemarks: sample_comment !== "no" ? sample_comment : undefined,
      samplingEffort,
      occurrenceID,
      datasetID,
      eventID,
      parentEventID,
      countryCode,
      geodeticDatum: decimalLongitude && decimalLatitude
        ? geodeticDatum
        : undefined,
      coordinateUncertaintyInMeters: decimalLongitude
        ? coordinateUncertaintyInMeters
        : undefined,
      dateIdentified,
      identificationVerificationStatus,
      identificationRemarks,
      datasetName,
      identifiedBy,
      associatedMedia,
      // @todo identificationQualifier,
      // @todo sampleSizeValue: sample_tot_vol,
      // @todo sampleSizeUnit: ml?
      // @todo footprintWKT
      // @todo footprintSRS
      // @todo countryCode: if fx call countryCode([decimalLongitude,decimalLatitude])
      // @todo use higherClassification instead of identificationRemarks if scientificName is not empty (or if "Eukaryota"?)
    };
    if (
      dynamicProperties !== false && "function" === typeof dynamicProperties
    ) {
      occurrence.dynamicProperties = dynamicProperties(rest, occurrence) ??
        undefined;
    }
    if (debug) {
      console.warn(occurrence);
    }
    return occurrence;
  };
