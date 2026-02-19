// entities/cart/model/duration.ts

import { Duration } from "./types";

export interface DurationOption {
  value: Duration;
  label: string;
}

export const DURATION_OPTIONS: DurationOption[] = [
  { value: "30-d", label: "30 дней" },
  { value: "90-d", label: "90 дней" },
  { value: "1-y", label: "1 год" },
];

export const MAX_QUANTITY = 999;
