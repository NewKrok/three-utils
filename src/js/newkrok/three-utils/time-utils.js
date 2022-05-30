export const TimePattern = {
  HH_MM_SS: "HH:MM:SS",
  MM_SS: "MM:SS",
  MM_SS_MS: "MM:SS.MS",
};

const patterns = [
  { pattern: "HH", routine: ({ hours }) => String(hours).padStart(2, "0") },
  { pattern: "MM", routine: ({ minutes }) => String(minutes).padStart(2, "0") },
  { pattern: "SS", routine: ({ seconds }) => String(seconds).padStart(2, "0") },
  {
    pattern: "MS",
    routine: ({ milliseconds }) => String(milliseconds).padStart(3, "0"),
  },
];

export const formatTime = (timeInMS, pattern) => {
  const milliseconds = Math.floor(timeInMS % 1000);
  const seconds = Math.floor((timeInMS / 1000) % 60);
  const minutes = Math.floor(Math.floor(timeInMS / 1000 / 60) % 60);
  const hours = Math.floor((Math.floor(timeInMS / 1000 / 60) / 60) % 24);
  const timeDetails = { hours, minutes, seconds, milliseconds };

  let result = pattern;
  patterns.forEach(
    ({ pattern: currentPattern, routine }) =>
      (result = result.replace(currentPattern, routine(timeDetails)))
  );

  return result;
};
