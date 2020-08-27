import * as React from "react";
import { ReactNode } from "react";
import SeuratTile from "./SeuratTile";
import ImageCanvas, { SizedImage } from "./ImageCanvas";
import { shuffle } from "lodash";
import { replaceIndex } from "./util";

export interface Position {
  x: number;
  y: number;
}

export interface Props {
  tileSize: number;
  pixelLevel: number;
  image: SizedImage;
}

export interface Location extends Position {
  placedId?: number;
  correctId: number;
}

export interface NodeAndId {
  id: number;
  node: ReactNode;
}

export const StrokesPuzzle = ({ tileSize, pixelLevel, image }: Props) => {
  /**
   * store tiles as JSX elements?  as arrays of hexes?  as refs to Components?
   */

  /**
   * right now, storing an indexed array of tile Components to tileData
   * this won't be updated
   */
  const [tileData, setTileData] = React.useState<ReactNode[]>([]);
  /**
   * a second state stores the location where each tile is placed
   */
  const [locations, setLocations] = React.useState<Location[]>([]);

  const [movingTile, setMovingTile] = React.useState<number | null>(null);

  const handleClick: React.MouseEventHandler = (e) => {
    console.log("doing onRelease", e.nativeEvent, movingTile);
    const x = e.nativeEvent.pageX;
    const y = e.nativeEvent.pageY;
    /**
     * can normalize x and y to top left of tile and search for exact or can search for match based on range.
     */
    const isTarget = (location: Location): boolean => {
      return (
        x >= location.x &&
        x < location.x + tileSize &&
        y >= location.y &&
        y < location.y + tileSize
      );
    };
    const index = locations.findIndex(isTarget);
    if (index === -1) {
      console.log("did not release on a tile");
      return;
    }
    if (!movingTile) {
      const current = locations[index].placedId;
      if (current) {
        setMovingTile(current);
      }
      return;
    }
    const prevLocation = locations.findIndex((o) => o.placedId === movingTile);
    setLocations((locations) => {
      const withoutPrevious =
        prevLocation === -1
          ? locations
          : replaceIndex(locations, prevLocation, {
              ...locations[prevLocation],
              placedId: undefined
            });
      return replaceIndex(withoutPrevious, index, {
        ...locations[index],
        placedId: movingTile
      });
    });
    setMovingTile(null);
    //window.removeEventListener("click", onRelease);
  };

  const onLoad = (ctx: CanvasRenderingContext2D) => {
    let array: ReactNode[] = [];
    let locations: Location[] = [];
    let i = 0;
    for (let x = 0; x + tileSize <= image.width; x += tileSize) {
      for (let y = 0; y + tileSize <= image.height; y += tileSize) {
        array.push(
          <SeuratTile
            ctx={ctx}
            rectangle={{
              x,
              y,
              width: tileSize,
              height: tileSize
            }}
            pixelLevel={pixelLevel}
          />
        );
        locations.push({
          x,
          y,
          correctId: i
        });
        i++;
      }
    }
    setLocations(shuffle(locations));
    setTileData(array);
    console.log(tileData);
  };

  const isPlaced = (id: number) => locations.some((loc) => loc.placedId === id);

  const unPlaced: NodeAndId[] = tileData
    .map((node, id) => ({ node, id }))
    .filter((o) => !isPlaced(o.id));

  return (
    <div className="App">
      <div
        style={{
          position: "relative",
          width: image.width,
          height: image.height
        }}
      >
        <div
          style={{
            position: "absolute",
            zIndex: 0
          }}
        >
          <ImageCanvas image={image} onLoad={onLoad} />
        </div>

        {locations.map((location) => (
          <div
            onClick={(e) => {
              handleClick(e);
              console.log("clicked square");
            }}
            key={location.correctId}
            style={{
              position: "absolute",
              top: location.y,
              left: location.x,
              width: tileSize,
              height: tileSize,
              borderColor: "black",
              borderWidth: 1,
              borderStyle: "solid"
              //backgroundColor:location.placedId === undefined ? undefined : "black"
            }}
          >
            {location.placedId !== undefined && tileData[location.placedId]}
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap"
        }}
      >
        {unPlaced.map(({ node, id }) => (
          <div
            key={id}
            style={{
              margin: 10
            }}
            onClick={(e) => {
              setMovingTile(id);
              console.log("selected tile");
            }}
          >
            {node}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StrokesPuzzle;
