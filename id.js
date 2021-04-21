import { generate } from "./deps.js";

export const ECOTAXA_URL = "https://ecotaxa.obs-vlfr.fr";
export const ECOTAXA_NAMESPACE = "7b6c779d-4de2-5860-8b14-bef66d7114c2";
// uuidgen --sha1 --namespace @url --name "https://ecotaxa.obs-vlfr.fr"
// 7b6c779d-4de2-5860-8b14-bef66d7114c2

const URL_NAMESPACE = "6ba7b811-9dad-11d1-80b4-00c04fd430c8";

export const ecotaxaProjectURL = ({ project }) =>
  `${ECOTAXA_URL}/prj/${project}`;

export const uuidv5 = ({ name, namespace }) => {
  if (!name || !namespace) {
    throw `Missing name or namespace: ${JSON.stringify({ name, namespace })}`;
  }
  return generate({ value: String(name), namespace });
};

export const uuidv5URL = (url) =>
  uuidv5({ name: url, namespace: URL_NAMESPACE });

export const datasetUUIDv5 = ({ project }) =>
  uuidv5URL(ecotaxaProjectURL({ project }));

export const occurrenceUUIDv5 = ({ catalogNumber, datasetID }) =>
  uuidv5({ name: catalogNumber, namespace: datasetID });

export const eventUUIDv5 = ({ fieldNumber, datasetID, parentEventID }) =>
  uuidv5({ name: fieldNumber, namespace: parentEventID ?? datasetID });
