import { DateTime } from "luxon";
import { expect, it, test } from "vitest";
import { exampleClinicOpeningHours } from "../data/example-clinic-opening-hours";
import {
  ErrorMsg,
  getDay,
  getHour,
  getOpenClinics,
  parseClinicOpeningHours,
  updateTimemap,
} from "./open-clinics";

const parseResult = parseClinicOpeningHours(exampleClinicOpeningHours);

// Test helper that returns those clinics open on a specific weekday and hour
// of the day. Monday is weekday === 1, and Sunday is weekday === 7.
function getClinicsOpenAt(weekdayAndHour: { weekday: number; hour: number }) {
  return getOpenClinics(parseResult, DateTime.fromObject(weekdayAndHour));
}

it("Reports no open clinics on Sunday at 5am", () => {
  expect(getClinicsOpenAt({ weekday: 7, hour: 5 })).toEqual([]);
});

it("Reports only the Mayo Clinic open on Monday at 8am", () => {
  expect(getClinicsOpenAt({ weekday: 1, hour: 8 })).toEqual(["Mayo Clinic"]);
});

it("Reports Clinics open on Sunday at 9pm", () => {
  expect(getClinicsOpenAt({ weekday: 7, hour: 21 })).toEqual([
    "Atrium Analysts",
    "Auckland Cardiology",
    "Mayo Clinic",
    "The Heart Team",
  ]);
});

it("Reports Clinics open on Friday at 4pm", () => {
  expect(getClinicsOpenAt({ weekday: 5, hour: 16 })).toEqual([
    "Angios R Us",
    "Atrium Analysts",
    "Auckland Cardiology",
    "Mayo Clinic",
    "The Heart Team",
  ]);
});

// Utils Tests
it("getDay should work as expected for day range", () => {
  const mockOpenningHours = "Mon-Fri 11am to 11pm";
  const { startDay, endDay } = getDay(mockOpenningHours);
  expect(startDay).toEqual(1);
  expect(endDay).toEqual(5);
});

it("getDay should work as expected for single day", () => {
  const mockOpenningHours = "Fri 11am to 11pm";
  const { startDay, endDay } = getDay(mockOpenningHours);
  expect(startDay).toEqual(5);
  expect(endDay).toEqual(5);
});

it("getHour should work as expected", () => {
  const mockOpenningHours = "Mon-Fri 11am to 11pm";
  const { startHour, endHour } = getHour(mockOpenningHours);
  expect(startHour).toEqual(11);
  expect(endHour).toEqual(23);
});

it("getHour should work as expected for special case 12pm", () => {
  const mockOpenningHours = "Sun 12pm to 9pm";
  const { startHour, endHour } = getHour(mockOpenningHours);
  expect(startHour).toEqual(12);
  expect(endHour).toEqual(21);
});

test("getHour should throw error when start hour is greater than the end hour", () => {
  const mockOpenningHours = "Sat 11am to 2am";

  expect(() => getHour(mockOpenningHours)).toThrowError(ErrorMsg);
});

it("updateTimemap should work as expected", () => {
  const mockOpenningHours = "Mon-Fri 11am to 2pm";
  const mockClinicName = "Jo Care";
  const { startDay, endDay } = getDay(mockOpenningHours);
  const { startHour, endHour } = getHour(mockOpenningHours);
  const expectedResult = {
    "1:11": ["Jo Care"],
    "1:12": ["Jo Care"],
    "1:13": ["Jo Care"],
    "1:14": ["Jo Care"],
    "2:11": ["Jo Care"],
    "2:12": ["Jo Care"],
    "2:13": ["Jo Care"],
    "2:14": ["Jo Care"],
    "3:11": ["Jo Care"],
    "3:12": ["Jo Care"],
    "3:13": ["Jo Care"],
    "3:14": ["Jo Care"],
    "4:11": ["Jo Care"],
    "4:12": ["Jo Care"],
    "4:13": ["Jo Care"],
    "4:14": ["Jo Care"],
    "5:11": ["Jo Care"],
    "5:12": ["Jo Care"],
    "5:13": ["Jo Care"],
    "5:14": ["Jo Care"],
  };
  let timemap = {};
  const result = updateTimemap({
    startDay,
    endDay,
    startHour,
    endHour,
    name: mockClinicName,
    timemap,
  });
  expect(result).toEqual(expectedResult);
});
