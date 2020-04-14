const createRadialGradient = (width, height, stops) => {
  var canvas = document.createElement("canvas");

  canvas.width = width;
  canvas.height = height;

  var ctx = canvas.getContext("2d");
  var gradient = ctx.createRadialGradient(
    0,
    0,
    width,
    0,
    0,
    Math.floor(width / 2)
  );
  var stopPoints = Object.keys(stops);

  for (var i = 0, n = stopPoints.length; i < n; i += 1)
    gradient.addColorStop(parseFloat(stopPoints[i]), stops[stopPoints[i]]);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  return canvas;
};

class AmbienceLayer extends CanvasLayer {
  constructor() {
    super();
    this.container = new PIXI.Container();
    this.mask = new PIXI.Sprite(
      new PIXI.Texture(
        new PIXI.BaseTexture(
          createRadialGradient(200, 200, { 0.0: "black", 1.0: "white" })
        )
      )
    );

    this.addChild(this.container);
  }

  async draw() {
    super.draw();
  }

  setLightSources(lights, width, height) {
    this.width = width;
    this.height = height;
    for (let light of lights) {
      console.log("drawing circle");
      console.log(light);
      let circle = new PIXI.Graphics();
      circle.cacheAsBitmap = true;
      console.log([light.r, light.g, light.b, light.a]);
      let color = PIXI.utils.rgb2hex([light.r, light.g, light.b]);
      console.log(color);
      circle.beginFill(color, light.a / 255);
      circle.drawCircle(0, 0, 200);
      circle.endFill();
      circle.x = light.x;
      circle.y = light.y;
      // circle.mask = this.mask;

      this.container.addChild(circle);
    }
    this.container.visible = true;
  }
}

export default AmbienceLayer;
