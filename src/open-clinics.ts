import { DateTime } from "luxon";
import { ClinicOpeningHour } from "../data/example-clinic-opening-hours";

type ParsedClinicOpeningHours = {
  [key: string]: string[];
};

const WEEKDAYS_MAP = {
  Mon: "1",
  Tue: "2",
  Wed: "3",
  Thu: "4",
  Fri: "5",
  Sat: "6",
  Sun: "7",
};

type Weekdays = keyof typeof WEEKDAYS_MAP;

export const ErrorMsg = "the startHour shouldn't be greater than the endHour";

/**
 * to update the timemap
 * @param param0
 * @returns
 */
export function updateTimemap({
  startDay,
  endDay,
  startHour,
  endHour,
  name,
  timemap,
}: {
  startDay: number;
  endDay: number;
  startHour: number;
  endHour: number;
  name: string;
  timemap: ParsedClinicOpeningHours;
}) {
  for (let i = startDay; i <= endDay; i++) {
    for (let j = startHour; j <= endHour; j++) {
      timemap = {
        ...timemap,
        [`${i}:${j}`]: timemap[`${i}:${j}`]
          ? [...timemap[`${i}:${j}`], name]
          : [name],
      };
    }
  }
  return timemap;
}

/**
 * to get the start day and the end day from the string formatted opening hours
 * @param time
 * @returns start day and the end day in number
 */
export function getDay(time: string) {
  const dayString = time.split(" ")[0];
  let startDay, endDay;

  if (dayString.includes("-")) {
    startDay = dayString.split("-")[0] as Weekdays;
    endDay = dayString.split("-")[1] as Weekdays;
    return {
      startDay: +WEEKDAYS_MAP[`${startDay}`],
      endDay: +WEEKDAYS_MAP[`${endDay}`],
    };
  }

  return {
    startDay: +WEEKDAYS_MAP[`${dayString as Weekdays}`],
    endDay: +WEEKDAYS_MAP[`${dayString as Weekdays}`],
  };
}

/**
 * to get the start hour and the end hour from the string formatted opening hours
 * @param time
 * @returns start hour and the end hour in number
 */
export function getHour(time: string) {
  let startHour, endHour;
  const startHourFromString = time.split(" ")[1];
  const endHourFromString = time.split(" ")[3];
  if (startHourFromString.includes("am")) {
    startHour = +startHourFromString.replace("am", "");
  } else if (startHourFromString === "12pm") {
    startHour = +startHourFromString.replace("pm", "");
  } else {
    startHour = +startHourFromString.replace("pm", "") + 12;
  }

  if (endHourFromString.includes("am")) {
    endHour = +endHourFromString.replace("am", "");
  } else if (endHourFromString === "12pm") {
    endHour = +endHourFromString.replace("pm", "");
  } else {
    endHour = +endHourFromString.replace("pm", "") + 12;
  }

  if (startHour > endHour) {
    throw new Error(ErrorMsg);
  }
  return {
    startHour,
    endHour,
  };
}

/**
 * Parses a set of clinic opening hours and returns a data structure that can be
 * queried to find which clinics are open at a specified date and time. The
 * querying is done using the getOpenClinics() function.
 *
 * Notes:
 *
 * - The format of the opening hours data to be parsed can be seen in the
 *   "data/example-clinic-opening-hours.ts" file.
 *
 * - The input data can be assumed to be correctly formatted, i.e. there is no
 *   requirement to validate it or handle any errors it may contain.
 */
export function parseClinicOpeningHours(
  clinicOpeningHours: ClinicOpeningHour[]
): ParsedClinicOpeningHours {
  // assuming clinicOpeningHours would exist
  let timemap: ParsedClinicOpeningHours = {};

  // looping through the clinic
  clinicOpeningHours.forEach((record: ClinicOpeningHour) => {
    const { name, openingHours } = record;

    // looping through the open hours for a single clinic
    openingHours.forEach((time) => {
      try {
        const { startDay, endDay } = getDay(time);
        const { startHour, endHour } = getHour(time);
        timemap = updateTimemap({
          startDay,
          endDay,
          startHour,
          endHour,
          name,
          timemap,
        });
      } catch (error) {
        // further error handling here, requires product decision.
        // but for now, it just going to skip the error data
      }
    });
  });

  return timemap;
}

/**
 * Takes a set of parsed clinic opening hours and returns an array containing
 * the names of those clinics which are open at the specified date and time,
 * sorted alphabetically.
 */
export function getOpenClinics(
  parsedClinicOpeningHours: ParsedClinicOpeningHours,
  queryTime: DateTime
) {
  const { weekday, hour } = queryTime;
  const result = parsedClinicOpeningHours[`${weekday}:${hour}`] ?? [];

  return result.sort();
}
