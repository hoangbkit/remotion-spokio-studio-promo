import React from "react";
import {Composition} from "remotion";
import {Promo} from "./Promo";
import {FORMATS, FPS, TOTAL} from "./config";

export const Root: React.FC = () => (
  <>
    {Object.values(FORMATS).map(({id, width, height}) => (
      <Composition
        key={id}
        id={id}
        component={Promo}
        durationInFrames={TOTAL}
        fps={FPS}
        width={width}
        height={height}
      />
    ))}
  </>
);
