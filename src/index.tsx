import { Color, LaunchProps, List } from "@raycast/api";
import { useEffect, useState } from "react";
import { Actions } from "./Actions";
import { fetchDepartures, fetchVenue } from "./api";
import { Detail } from "./Detail";
import { Departures } from "./types";
import { formatAsClock, formatAsClockWithSeconds, getTransportIcon } from "./utils";

interface CommandArguments {
  query: string;
}

export default function Command(props: LaunchProps<{ arguments: CommandArguments }>) {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<Departures>();
  const [numberOfDepartures, setNumberOfDepartures] = useState(5);
  const [showDetails, setShowDetails] = useState(false);

  const [clock, setClock] = useState(formatAsClockWithSeconds(new Date().toISOString()));
  setInterval(() => setClock(formatAsClockWithSeconds(new Date().toISOString())), 1000);

  useEffect(() => {
    setIsLoading(true);
    fetchVenue(props.arguments.query).then((feature) => {
      const stopId = feature?.properties.id;
      if (!stopId) return;
      fetchDepartures(stopId, numberOfDepartures).then((departures) => {
        setItems(departures);
        setIsLoading(false);
      });
    });
  }, [props.arguments.query, numberOfDepartures]);

  const departuresWithSortedQuays = items?.quays?.sort((a, b) => {
    if (a.name + a.publicCode < b.name + b.publicCode) return -1;
    if (a.name + a.publicCode > b.name + b.publicCode) return 1;
    return 0;
  });

  return (
    <List
      navigationTitle={clock}
      searchBarPlaceholder={
        isLoading
          ? "Laster..."
          : `${items?.name}${items?.description ? " " + items?.description : ""}`
      }
      filtering={{ keepSectionOrder: true }}
      isShowingDetail={showDetails}
      searchBarAccessory={
        <List.Dropdown
          tooltip="Select number of departures to show"
          onChange={(newValue) => setNumberOfDepartures(parseInt(newValue))}
        >
          <List.Dropdown.Section title="Number of departures pr. platform">
            <List.Dropdown.Item title="5" value="5" />
            <List.Dropdown.Item title="10" value="10" />
            <List.Dropdown.Item title="50" value="50" />
          </List.Dropdown.Section>
        </List.Dropdown>
      }
    >
      {!isLoading &&
        items &&
        departuresWithSortedQuays?.map((quay, i) => {
          return (
            <List.Section
              key={quay.id}
              title={`${quay.name ?? `Quay ${i}`} ${quay.publicCode ?? ""}`}
              subtitle={quay.description}
            >
              {quay.estimatedCalls.map((ec) => {
                const lineName = `${ec.serviceJourney.line.publicCode ?? ""} ${
                  ec.destinationDisplay?.frontText ?? ""
                }`;
                return (
                  <List.Item
                    accessories={[
                      {
                        tag: {
                          value: new Date(ec.expectedDepartureTime ?? ec.aimedDepartureTime),
                          color: ec.realtime
                            ? ec.predictionInaccurate
                              ? Color.Yellow
                              : Color.Green
                            : Color.SecondaryText,
                        },
                      },
                    ]}
                    icon={getTransportIcon(
                      ec.serviceJourney.line.transportMode,
                      ec.serviceJourney.line.transportSubmode
                    )}
                    actions={
                      <Actions
                        ec={ec}
                        quayId={quay.id}
                        departures={items}
                        setShowDetails={() => setShowDetails(!showDetails)}
                      />
                    }
                    key={ec.serviceJourney.id + ec.aimedDepartureTime}
                    title={lineName}
                    subtitle={
                      showDetails
                        ? undefined
                        : formatAsClock(ec.expectedDepartureTime ?? ec.aimedDepartureTime)
                    }
                    detail={<Detail ec={ec} />}
                    keywords={[
                      ec.destinationDisplay?.frontText ?? "",
                      ec.serviceJourney.line.description ?? "",
                      ec.serviceJourney.line.publicCode ?? "",
                      ec.serviceJourney.line.transportMode ?? "",
                    ]}
                  />
                );
              })}
            </List.Section>
          );
        })}
    </List>
  );
}
