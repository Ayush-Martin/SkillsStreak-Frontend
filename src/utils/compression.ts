import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL, fetchFile } from "@ffmpeg/util";

export const compressVideo = async (file: File): Promise<File> => {
  const ffmpeg = new FFmpeg();

  const baseURL = "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm";
  //   ffmpeg.on("log", ({ message }) => {
  //     if (messageRef.current) messageRef.current.innerHTML = message;
  //   });
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
    workerURL: await toBlobURL(
      `${baseURL}/ffmpeg-core.worker.js`,
      "text/javascript"
    ),
  });

  console.log("loaded");

  await ffmpeg.writeFile("input.mp4", await fetchFile(file));
  console.log("wrote");

  await ffmpeg.exec([
    "-i",
    "input.mp4",
    "-c:v",
    "libx264",
    "-preset",
    "ultrafast",
    "-crf",
    "32",
    "-vf",
    "scale='min(1280,iw)':'min(720,ih)':force_original_aspect_ratio=decrease",
    "output.mp4",
  ]);

  console.log("executed");
  const outData = await ffmpeg.readFile("output.mp4");
  const data = new Uint8Array(outData as unknown as ArrayBuffer);
  const blob = new Blob([data.buffer], { type: "video/mp4" });

  console.log("converted");
  // Convert Blob to File
  return new File([blob], "compressed.mp4", {
    type: blob.type,
    lastModified: Date.now(),
  });
};
