/* eslint-disable @typescript-eslint/no-explicit-any */

export enum TransportMode {
  Air = "air",
  Bus = "bus",
  Cableway = "cableway",
  Coach = "coach",
  Funicular = "funicular",
  Lift = "lift",
  Metro = "metro",
  Monorail = "monorail",
  Rail = "rail",
  Tram = "tram",
  Trolleybus = "trolleybus",
  Unknown = "unknown",
  Water = "water",
}

export type Departures = {
  id: string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  quays?: Array<{
    id: string;
    name: string;
    description?: string;
    publicCode?: string;
    estimatedCalls: Array<EstimatedCall>;
  }>;
};

export type EstimatedCall = {
  date: string;
  expectedDepartureTime: string | null;
  aimedDepartureTime: string;
  realtime: boolean;
  predictionInaccurate: boolean;
  cancellation: boolean;
  quay: { id: string };
  destinationDisplay?: { frontText?: string };
  serviceJourney: {
    id: string;
    line: {
      id: string;
      description?: string;
      publicCode?: string;
      transportMode?: TransportMode;
      transportSubmode?: string;
      authority?: {
        id: string;
        name: string;
        url?: string;
      };
    };
    estimatedCalls: Array<SjEstimatedCall>;
  };
};

export type SjEstimatedCall = {
  quay: {
    id: string;
    name: string;
    publicCode?: string;
  };
  aimedDepartureTime: string;
  expectedDepartureTime: string | null;
};

export type StopPlace = {
  name: string;
  transportMode?: Array<TransportMode>;
  description?: string;
  id: string;
  latitude?: number;
  longitude?: number;
  quays?: Array<{
    id: string;
    description?: string;
    name: string;
    publicCode?: string;
    stopPlace?: { id: string };
  }>;
};

export type Feature = {
  properties: {
    id: string;
    name: string;
    label: string;
    county: string;
  };
};
