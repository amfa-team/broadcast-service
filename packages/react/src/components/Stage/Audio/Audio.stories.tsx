import { number, select, withKnobs } from "@storybook/addon-knobs";
import React from "react";
import track from "./fixtures/outfoxing.mp3";
import { Audio } from ".";

export default {
  title: "Stage/Audio",
  component: Audio,
  decorators: [withKnobs],
};

export function Base() {
  const positionX = number("positionX", 50);
  const positionY = number("positionY", 50);
  const positionZ = number("positionZ", 300);
  const maxDistance = number("maxDistance", 20000);
  const distanceModel = select(
    "distanceModel",
    ["linear", "inverse", "exponential"],
    "linear",
  );
  const panningModel = select("panningModel", ["HRTF", "equalpower"], "HRTF");
  return (
    <Audio
      media={track}
      positionZ={positionZ}
      positionX={positionX}
      positionY={positionY}
      maxDistance={maxDistance}
      distanceModel={distanceModel}
      panningModel={panningModel}
    />
  );
}
