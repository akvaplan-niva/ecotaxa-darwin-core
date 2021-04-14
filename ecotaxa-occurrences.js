import { ndmapcommand } from "https://deno.land/x/newline@v0/nd-map/command.js";
import { jsongenerator } from "https://deno.land/x/newline@v0/generator/json-gen.js";

import { occurrenceMapFactory } from "./occurrence-map.js";
import { alias } from "./alias.js";
import { parse as parseArgs } from "https://deno.land/std@0.88.0/flags/mod.ts";

const { stdin, args, exit } = Deno;

const helptext = () => {
  console.log(`Converts EcoTaxa NDJSON to Darwin Core Occurrences NDJSON

Use:
  cat ecotaxa.ndjson | ecotaxa-occurrences --project number

Options
  --project     EcoTaxa project number (integer)
  --country     Set country code
  --not-living  Also include records classified as not-living

`);
  exit(0);
};

const ignoreFactory = (args) => (line, i) =>
  args["not-living"]
    ? line.length === 0
    : line.length === 0 || /not-living/.test(line);

const occurrences = async (args) => {
  try {
    const mapfx = occurrenceMapFactory(args);
    args.ignore = ignoreFactory(args);

    const generator = jsongenerator(stdin, args);
    await ndmapcommand({
      mapfx,
      generator,
      ...args,
    });
  } catch (e) {
    console.error(e);
    exit(1);
  }
};

if (import.meta.main) {
  const { help, ...parsedArgs } = parseArgs(args, {
    alias,
  });

  if (help) {
    helptext();
  } else {
    occurrences(parsedArgs);
  }
}
