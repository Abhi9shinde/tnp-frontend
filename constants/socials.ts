const PLATFORMS = [
  { label: "GitHub", value: "github" },
  { label: "LinkedIn", value: "linkedin" },
  { label: "LeetCode", value: "leetcode" },
  { label: "Kaggle", value: "kaggle" },
  { label: "Hackster.io", value: "hackster" },
  { label: "GrabCad", value: "grabCad" },
  { label: "Medium", value: "medium" },
];

const PLATFORM_URL_REGEX: Record<string, RegExp> = {
  github: /^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9_-]+\/?$/,
  linkedin: /^https?:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9_-]+\/?$/,
  leetcode: /^https?:\/\/(www\.)?leetcode\.com\/[A-Za-z0-9_-]+\/?$/,
  kaggle: /^https?:\/\/(www\.)?kaggle\.com\/[A-Za-z0-9_-]+\/?$/,
  hackster: /^https?:\/\/(www\.)?hackster\.io\/[A-Za-z0-9_-]+\/?$/,
  grabCad: /^https?:\/\/(www\.)?grabcad\.com\/[A-Za-z0-9_-]+\/?$/,
  medium: /^https?:\/\/(www\.)?medium\.com\/@[A-Za-z0-9_-]+\/?$/,
};

export { PLATFORMS, PLATFORM_URL_REGEX };
