import processSource from "./imageProcessor.js";

const createRadialGradient = (width, height, stops) => {
  let canvas = document.createElement("canvas");

  canvas.width = width;
  canvas.height = height;
  document.body.appendChild(canvas);
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";

  var ctx = canvas.getContext("2d");
  var gradient = ctx.createRadialGradient(
    width / 2,
    height / 2,
    Math.floor(Math.min(width, height) / 4),
    width / 2,
    height / 2,
    width / 2
  );
  gradient.addColorStop(0, "white");
  gradient.addColorStop(1, "black");

  // var stopPoints = Object.keys(stops);

  // for (var i = 0, n = stopPoints.length; i < n; i += 1)
  //   gradient.addColorStop(parseFloat(stopPoints[i]), stops[stopPoints[i]]);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  // var img = canvas.toDataURL("image/png");
  // document.write('<img src="' + img + '"/>');
  return canvas;
};

const convertColor = (obj) => {
  var arr = [64, 128, 192];
  const toHex = (num) => Number(num).toString(16).padStart(2, "0");
  const hex = toHex(obj.r) + toHex(obj.g) + toHex(obj.b);
  const color = parseInt("0x" + hex);

  return {
    hex: "#" + hex,
    color: color,
    alpha: obj.a / 256,
  };
};

class AmbienceLayer extends CanvasLayer {
  constructor(canvas) {
    console.log("Creating ambience layer");
    super();
    this.visible = true;

    this.container = new PIXI.Container();

    // for (let i = 0; i < 10; i++) {
    //   let circle = new PIXI.Graphics();
    //   circle.beginFill(0xff0000, 1);
    //   circle.drawCircle(0, 0, i);
    //   circle.endFill();
    //   circle.x = i;
    //   circle.y = i;
    //   circle.visible = true;
    //   this.container.addChild(circle);
    // }

    this.addChild(this.container);
    this.updateMask();
    const d = canvas.dimensions;
    console.log(d);
    let maskWidth = canvas.dimensions.paddingX || 100;
    let maskHeight = canvas.dimensions.paddingY || 100;
    console.log(canvas.dimensions);
    this.lightMask = new PIXI.Sprite(
      new PIXI.Texture(
        new PIXI.BaseTexture(
          createRadialGradient(maskWidth, maskHeight, {
            0.0: "black",
            0.2: "black",
            1.0: "white",
          })
        )
      )
    );
    this.container.addChild(this.lightMask);

    this.addChild(this.container);
  }

  async update() {
    let layer = canvas.background;
    if (layer.source) {
      canvas.ambience.updateMask();
      let lightSources = await processSource(layer.source);
      canvas.ambience.setLightSources(lightSources, layer.width, layer.height);
    }
    this.updateMask();
  }

  updateMask() {
    this.height = canvas.background.height;
    this.width = canvas.background.width;
    console.log("Bounds: ");
    console.log(canvas.background.getBounds());
    console.log(canvas.background.getLocalBounds());
    console.log(canvas.background.getGlobalPosition());
    return;
    this.visible = true;
    // Setup scene mask
    if (this.mask) this.removeChild(this.mask);
    this.mask = new PIXI.Graphics();
    this.addChild(this.mask);
    const d = canvas.dimensions;
    this.mask.beginFill(0xffffff);
    if (canvas.background.img) {
      this.mask.drawRect(
        d.paddingX - d.shiftX,
        d.paddingY - d.shiftY,
        d.sceneWidth,
        d.sceneHeight
      );
    } else {
      this.mask.drawRect(0, 0, d.width, d.height);
    }
  }

  async draw() {
    super.draw();
  }

  setLightSources(lights, width, height) {
    for (let light of lights) {
      console.log("drawing circle");
      console.log(light);
      let circle = new PIXI.Graphics();
      //circle.cacheAsBitmap = true;
      console.log([light.r, light.g, light.b, light.a]);
      let color = convertColor(light);
      console.log(color);
      //circle.beginFill(color.color, color.alpha);
      circle.beginFill(color.color, color.alpha);
      circle.drawCircle(0, 0, 20);
      circle.endFill();
      circle.visible = true;
      circle.x = light.x;
      circle.y = light.y;
      circle.mask = this.lightMask;

      this.addChild(circle);
    }
    this.container.visible = true;
    this.draw();
  }
}

export default AmbienceLayer;
