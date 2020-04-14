import AmbienceLayer from "./ambienceLayer.js";

Hooks.once("canvasInit", (canvas) => {
  canvas.ambience = canvas.stage.addChildAt(new AmbienceLayer(canvas), 10);
});

Hooks.on("canvasReady", (_) => {
  canvas.ambience.update();
});

Hooks.on("ready", () => {
  if (game.scenes.active) {
    canvas.ambience.update();
  }
});

Hooks.on("updateScene", async (scene, updateData, options, userId) => {
  console.log("updateScene");
  canvas.ambience.update();
});
