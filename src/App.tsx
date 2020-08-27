import * as React from "react";
import "./styles.css";
import { ReactNode } from "react";
import SeuratTile from "./SeuratTile";
import ImageCanvas, { SizedImage } from "./ImageCanvas";
import { shuffle } from "lodash";
import StrokesPuzzle from "./SeuratPuzzle";
import SingleColorPuzzle from "./SingleColorPuzzle";

export default function App() {
  const orangeDessert: SizedImage = {
    source_url:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/ET_Afar_asv2018-01_img48_Dallol.jpg/640px-ET_Afar_asv2018-01_img48_Dallol.jpg",
    width: 640,
    height: 360
  };

  const cat: SizedImage = {
    source_url:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/June_odd-eyed-cat_cropped.jpg/570px-June_odd-eyed-cat_cropped.jpg",
    width: 570,
    height: 480
  };

  return <StrokesPuzzle image={cat} tileSize={80} pixelLevel={10} />;
}
