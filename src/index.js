import AmbienceLayer from "./ambienceLayer.js";
import processSource from "./imageProcessor.js";

let ambienceLayer;

Hooks.once("canvasInit", (canvas) => {
  ambienceLayer = new AmbienceLayer();
  // check layer ordering
  canvas.stage.addChildAt(ambienceLayer, 10);
});

Hooks.on("updateScene", async (scene, updateData, options, userId) => {
  console.log("updateScene");
  let layer = canvas.layers.find((layer) => layer instanceof BackgroundLayer);
  if (layer.source) {
    let lightSources = await processSource(layer.source);
    ambienceLayer.setLightSources(lightSources, layer.width, layer.height);
  }
  //   console.log(layer);
  //   // this is the thing we're interested in
  //   if (updateData.img) {
  //     // since we are not interested in delaying the further processing, we can just async that processing
  //     let img = await ImageProcessor.process(updateData.img);

  //     console.log(img);
  //   }
});
