/**
 * return a single rgba array
 */
export function getAverageColor(data: ImageData): number[] {
  return separateRgbaChannels(data.data).map(average);
}

/**
 * getImageData returns a flat array with r,g,b,a for each pixel
 * takes the flat array of image pixel data and groups into four arrays for r g b and a
 *
 * note: when tile size is large, this becomes a very large loop.
 */
function separateRgbaChannels(data: Uint8ClampedArray): number[][] {
  let rgba: number[][] = [[], [], [], []];
  for (let i = 0; i < data.length; i++) {
    let channel = i % 4;
    rgba[channel].push(data[i]);
  }
  return rgba;
}

/**
 * helper to get average value from an array of numbers
 */
function average(array: number[]): number {
  const sum = array.reduce((a, b) => a + b);
  return sum / array.length;
}

function rgbaString(array: number[]): string {
  return "rgba(" + array.join(", ") + ")";
}

/**
 * include hash #
 */
export function rgbaToHex(array: number[]): string {
  return (
    "#" +
    array
      .slice(0, 3)
      .map((val) => Math.round(val).toString(16).padStart(2, "0"))
      .join("")
  );
}

export function remainder(a: number[], b: number[]): number[] {
  return a.slice(0, 3).map((val, i) => Math.abs(val - b[i]));
}
