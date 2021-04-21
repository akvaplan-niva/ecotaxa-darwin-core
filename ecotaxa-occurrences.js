import {
  ndmapcommand,
  csvgenerator,
  jsongenerator,
  commonOptions,
  parseArgs,
} from "./deps.js";
import { occurrenceMapFactory } from "./occurrence-map.js";
import { alias } from "./alias.js";

const { stdin, args, exit } = Deno;

const helptext = () => {
  console.log(`Convert EcoTaxa data to Darwin Core Occurrences

Use:
  ecotaxa-occurrences --project {number} [OPTIONS] < INPUT

Options
  --project             EcoTaxa project number (integer)
  --dataset-id          
  --country             Set country code
  --not-living          Also include records classified as not-living
  --dynamic-properties  Store all unknown variables in dynamicProperties
  --from                Set input format [ tsv | ndjson ]

`);
  exit(0);
};

const ignoreFactory = (args) => (line, i) =>
  args["not-living"]
    ? line.length === 0
    : line.length === 0 || /not-living/.test(line);

const ecotaxaOccurrencesCommand = async (args) => {
  const mapfx = occurrenceMapFactory(args);

  args.ignore = ignoreFactory(args);
  const generator = /(nd)?json/i.test(args.from)
    ? jsongenerator(stdin, args)
    : csvgenerator(stdin, args);

  await ndmapcommand({
    mapfx,
    generator,
    args,
  });
};

if (import.meta.main) {
  try {
    const options = { ...commonOptions };
    options.alias = { ...options.alias, ...alias };
    options.default = { ...options.default, numeric: true, std: true };
    const args = parseArgs(Deno.args, options);
    if (args.temporary) {
      args.temporaryMap = new Map(JSON.parse(args.temporary));
    }
    if (args.help) {
      helptext();
    } else {
      ecotaxaOccurrencesCommand(args);
    }
  } catch (e) {
    console.error(e);
    exit(1);
  }
}
