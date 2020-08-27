import * as React from "react";
import { getAverageColor, rgbaToHex } from "./average";

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Props {
  ctx: CanvasRenderingContext2D;
  rectangle: Rectangle;
  pixelLevel: number;
}

export default ({ ctx, rectangle, pixelLevel }: Props) => {
  /**rather than storing x and y's, just go in order by row and display with flexbox */
  const [dots, setDots] = React.useState<string[]>([]);

  const makeDots = (): string[] => {
    let dots: string[] = [];

    for (
      let y = rectangle.y;
      y < rectangle.y + rectangle.height;
      y += pixelLevel
    ) {
      for (
        let x = rectangle.x;
        x < rectangle.x + rectangle.width;
        x += pixelLevel
      ) {
        const data = ctx.getImageData(x, y, pixelLevel, pixelLevel);
        const rgba = getAverageColor(data);
        dots.push(rgbaToHex(rgba));
      }
    }
    return dots;
  };

  React.useEffect(() => {
    setDots(makeDots);
  }, [ctx]);

  return (
    <div
      style={{
        width: rectangle.width,
        height: rectangle.height,
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap"
      }}
    >
      {dots.map((hex, i) => (
        <div
          key={i}
          style={{
            margin: 1,
            backgroundColor: hex,
            width: pixelLevel - 2,
            height: pixelLevel - 2,
            borderRadius: 0.5 * pixelLevel
          }}
        />
      ))}
    </div>
  );
};
