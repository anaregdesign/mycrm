import type { Channel } from "./account";

export type TemperatureZone = "ambient" | "chilled" | "frozen";

export interface ProductCatalogItem {
  id: string;
  name: string;
  category: string;
  temperatureZone: TemperatureZone;
  shelfLifeDays: number;
  packSize: string;
  marginBand: string;
  targetChannels: Channel[];
  basePrice: number;
}