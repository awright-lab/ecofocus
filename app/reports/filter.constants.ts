export const YEARS = Array.from({ length: 8 }, (_, i) => new Date().getFullYear() - i);

export const TOPIC_MAP: Record<string, string> = {
  "Consumer Insights": "consumer-insights",
  "Packaging & Claims": "packaging-claims",
  "Sustainability": "sustainability",
  "Retail": "retail",
  "Beverage": "beverage",
  "Food": "food",
};

export const TYPE_MAP: Record<string, string> = {
  "Syndicated": "syndicated",
  "Data Integration": "data-integration",
  "Custom": "custom",
  "Brief": "brief",
  "White Paper": "white-paper",
};

