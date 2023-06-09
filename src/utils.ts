import { Color, Icon, Image } from "@raycast/api";
import { TransportMode } from "./types";

export function getTransportIcon(transportMode?: TransportMode, transportSubmode?: string): Image {
  switch (transportMode) {
    case TransportMode.Rail:
      return { source: "transport-modes/Train.svg", tintColor: Color.Red };
    case TransportMode.Bus:
      if (transportSubmode === "localBus") {
        return { source: "transport-modes/Bus.svg", tintColor: Color.Green };
      }
      return { source: "transport-modes/Bus.svg", tintColor: Color.Blue };
    case TransportMode.Coach:
      return { source: "transport-modes/Bus.svg", tintColor: Color.Purple };
    case TransportMode.Air:
      return { source: "transport-modes/Plane.svg", tintColor: Color.Orange };
    case TransportMode.Water:
      return { source: "transport-modes/Ferry.svg", tintColor: Color.Blue };
    case TransportMode.Tram:
      return { source: "transport-modes/Tram.svg", tintColor: Color.Yellow };
    case TransportMode.Metro:
      return { source: "transport-modes/Subway.svg", tintColor: Color.Magenta };
    default:
      return { source: Icon.QuestionMark };
  }
}

export function formatAsClock(isoString: string) {
  const d = new Date(isoString);
  const padTime = (n: number) => n.toString().padStart(2, "0");
  return `${padTime(d.getHours())}:${padTime(d.getMinutes())}`;
}

export function formatAsClockWithSeconds(isoString: string) {
  const d = new Date(isoString);
  const padTime = (n: number) => n.toString().padStart(2, "0");
  return `${padTime(d.getHours())}:${padTime(d.getMinutes())}:${padTime(d.getSeconds())}`;
}
