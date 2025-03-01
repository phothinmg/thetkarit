export type Zone = {
  id: string;
  aliases: string[];
  location?: {
    countryCode?: string;
    countryName?: string;
    comment?: string;
    latitude?: number;
    longitude?: number;
  };
  offsets: string[];
  currentOffset: string;
  nextTransition: any;
};
export type Res = {
  ianaVersion: string;
  fullVersionId: string;
  zones: Zone[];
};
export type InfoType = {
  names: string[];
  countryCode: string;
  countryName: string;
  latitude: number;
  longitude: number;
  offsets: string[];
  currentOffset: number;
};
export type TzInfo = InfoType[];
