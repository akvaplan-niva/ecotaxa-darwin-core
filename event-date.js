export const extractDate = (
  verbatimDate,
  {
    dateregex = /^(?<y>[0-9]{4}).?(?<m>[0-9]{2}).?(?<d>[0-9]{2})/,
    timeregex = /(?<hh>[0-9]{2}).?(?<mm>[0-9]{2}).?(?<ss>[0-6]{1}[0-9]{1})/,
    tz = "Z",
    min = new Date(1900),
    max = new Date(1 + new Date().getFullYear()),
  } = {},
) => {
  const [date, time] = verbatimDate.split(/[t\s]/i);

  const {
    groups: { y, m, d },
  } = dateregex.exec(date) || { groups: {} };

  if (Number(y) > max || Number(y) < min) {
    //console.warn("Year missing/invalid", { year: y }, verbatimDate);
    return;
  }

  try {
    let dt;
    const {
      groups: { hh, mm, ss },
    } = timeregex.exec(time) || { groups: {} };

    if (y && m && d) {
      let ds = `${y}-${m}-${d}`;
      if (hh) {
        ds += `T${hh}:${mm || "00"}:${ss || "00"}`;
      }
      ds += tz;
      dt = new Date(ds).toJSON().replace(".000Z", "Z");
    } else if (y && m) {
      dt = new Date(y, m - 1, 1).toJSON().split("-").slice(0, 2).join("-");
    } else if (y) {
      dt = y;
    }
    return dt;
  } catch (e) {
    console.error("Invalid date", verbatimDate);
  }
};
