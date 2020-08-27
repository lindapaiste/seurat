import * as React from "react";
import { getAverageColor, rgbaToHex, remainder } from "./average";
import { shuffle, round } from "lodash";
import { SizedImage, Position } from "./App";
import { replaceIndex } from "./util";
import ImageCanvas from "./ImageCanvas";

export interface Tile {
  x: number;
  y: number;
  hex: string;
  rgba: number[];
  id: number;
}

export interface PuzzleProps {
  tileSize: number;
  image: SizedImage;
}

export interface PuzzleState {
  tiles: Tile[];
  //  placements: []
}

export const Puzzle = ({ image, tileSize }: PuzzleProps) => {
  /**
   * data for all tiles with their correct x and y
   *
   * and also what tile has been placed here, if any( but that could be separated )
   */
  const [tiles, setTiles] = React.useState<(Tile & { placed?: Placed })[]>([]);

  const [movingTile, setMovingTile] = React.useState<Tile | null>(null);

  const dotSize = 0.8 * tileSize;

  const createTile = (
    ctx: CanvasRenderingContext2D,
    { x, y }: Position,
    id: number
  ): Tile => {
    const data = ctx.getImageData(x, y, tileSize, tileSize);
    const _rgba = getAverageColor(data);
    /**
     * round to the nearest 10
     */
    const rgba = _rgba.map((v) => round(v, -1));
    const hex = rgbaToHex(rgba);
    return {
      x,
      y,
      id,
      rgba,
      hex
    };
  };

  /**
  React.useEffect(() => {
    if (movingTile !== null) {
      window.addEventListener("click", onRelease);
    }
    return () => window.removeEventListener("click", onRelease);
  }, [movingTile]);
  */

  const onRelease: React.MouseEventHandler = (e) => {
    console.log("doing onRelease", e.nativeEvent, movingTile);
    const x = e.nativeEvent.pageX;
    const y = e.nativeEvent.pageY;
    if (!movingTile) {
      return;
    }
    /**
     * can normalize x and y to top left of tile and search for exact or can search for match based on range.
     */
    const isTarget = (tile: Tile): boolean => {
      return (
        x >= tile.x &&
        x < tile.x + tileSize &&
        y >= tile.y &&
        y < tile.y + tileSize
      );
    };
    const index = tiles.findIndex(isTarget);
    if (index === -1) {
      console.log("did not release on a tile");
      return;
    }
    setTiles((tiles) =>
      replaceIndex(tiles, index, { ...tiles[index], placed: movingTile })
    );
    //window.removeEventListener("click", onRelease);
  };

  const onLoad = (ctx: CanvasRenderingContext2D) => {
    let array: Tile[] = [];
    let id = 0;
    for (let x = 0; x + tileSize <= image.width; x += tileSize) {
      for (let y = 0; y + tileSize <= image.height; y += tileSize) {
        console.log({ x, y });
        array.push(createTile(ctx, { x, y }, id));
        id++;
      }
    }
    setTiles(shuffle(array));
    console.log(tiles);
  };

  const isPlacedId = (id: number) =>
    tiles.some((tile) => tile.placed?.id === id);

  const unPlaced = tiles.filter((tile) => !isPlacedId(tile.id));

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
        <div
          style={{
            zIndex: 10
          }}
        >
          {tiles.map((tile) => (
            <ImageSquare
              onClick={(e) => {
                onRelease(e);
                console.log("clicked square");
              }}
              key={tile.id}
              {...tile}
              tileSize={tileSize}
              dotSize={dotSize}
            />
          ))}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap"
        }}
      >
        {unPlaced.map((tile) => (
          <div
            draggable="true"
            key={tile.id}
            onClick={(e) => {
              setMovingTile({
                ...tile,
                x: e.nativeEvent.screenX,
                y: e.nativeEvent.screenY
              });
              console.log("selected color");
            }}
          >
            <DotCircle hex={tile.hex} dotSize={dotSize} />
          </div>
        ))}
      </div>
    </div>
  );
};

export interface Sizes {
  tileSize: number;
  dotSize: number;
}

export const DotCircle = ({
  hex,
  dotSize
}: {
  hex: string;
  dotSize: number;
}) => (
  <div
    style={{
      backgroundColor: hex,
      width: dotSize,
      height: dotSize,
      borderRadius: 0.5 * dotSize
    }}
  />
);

export type ImageSquareProps = Omit<Tile, "id"> &
  Sizes & {
    placed?: Placed;
    onClick: React.MouseEventHandler;
  };

export interface Placed {
  id: number;
  hex: string;
  rgba: number[];
}

/**
 * can either nest the placed dot here or overlay separately
 */
export const ImageSquare = ({
  x,
  y,
  rgba,
  placed,
  tileSize,
  dotSize,
  onClick
}: ImageSquareProps) => {
  const getBackground = () => {
    if (!placed) {
      return undefined;
    }
    /**
     * want to multiply the remainer to make it more obvious, but also keep in range of 0-255
     */
    const _raw = remainder(rgba, placed.rgba);
    return rgbaToHex(_raw.map((v) => 3 * v));
  };

  return (
    <div
      style={{
        position: "absolute",
        backgroundColor: getBackground(),
        top: y,
        left: x,
        width: tileSize,
        height: tileSize,
        borderColor: "black",
        borderWidth: 1,
        borderStyle: "solid",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
      onClick={onClick}
    >
      {!!placed && <DotCircle hex={placed.hex} dotSize={dotSize} />}
    </div>
  );
};

export type DotProps = Tile & Sizes;

export const PlacedDot = ({ x, y, hex, tileSize, dotSize }: DotProps) => (
  <div
    style={{
      position: "absolute",
      backgroundColor: hex,
      top: y + 0.5 * (tileSize - dotSize),
      left: x + 0.5 * (tileSize - dotSize),
      width: dotSize,
      height: dotSize,
      borderRadius: 0.5 * dotSize
    }}
  />
);

export default Puzzle;
