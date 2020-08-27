import * as React from "react";

export interface SizedImage {
  source_url: string;
  width: number;
  height: number;
}

export const ImageCanvas = ({
  image,
  onLoad
}: {
  image: SizedImage;
  onLoad: (ctx: CanvasRenderingContext2D) => void;
}) => {
  const canvasRef = React.createRef<HTMLCanvasElement>();

  const onImageReceived = (img: HTMLImageElement) => {
    if (canvasRef.current === null) return;
    const ctx = canvasRef.current.getContext("2d");
    if (ctx === null) return;
    ctx.drawImage(img, 0, 0);

    try {
      localStorage.setItem(
        "saved-image-example",
        canvasRef.current.toDataURL("image/png")
      );
      onLoad(ctx);
      //console.log(localStorage.getItem("saved-image-example"))
    } catch (err) {
      console.log("Error: " + err);
    }
  };

  React.useEffect(() => {
    console.log("runniing effect");
    const downloadedImg = new Image();
    downloadedImg.crossOrigin = "Anonymous";
    downloadedImg.addEventListener(
      "load",
      (e) => onImageReceived(e.target),
      false
    );
    downloadedImg.src = image.source_url;
  }, [image.source_url]);

  return <canvas ref={canvasRef} width={image.width} height={image.height} />;
};

export default ImageCanvas;
