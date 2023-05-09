export type ClinicOpeningHour = {
  name: string;
  openingHours: string[];
};

export const exampleClinicOpeningHours: ClinicOpeningHour[] = [
  {
    name: "Mayo Clinic",
    openingHours: ["Mon-Sun 8am to 9pm"],
  },
  {
    name: "Auckland Cardiology",
    openingHours: ["Mon-Sun 11am to 11pm"],
  },
  {
    name: "The Heart Team",
    openingHours: [
      "Mon-Fri 11am to 11pm",
      "Sat 11am to 2am",
      "Sun 12pm to 9pm",
    ],
  },
  {
    name: "Atrium Analysts",
    openingHours: [
      "Mon-Thu 11am to 10pm",
      "Fri 11am to 11pm",
      "Sat 11am to 11pm",
      "Sun 4pm to 10pm",
    ],
  },
  {
    name: "Angios R Us",
    openingHours: ["Thu-Sun 11am to 4pm"],
  },
];
