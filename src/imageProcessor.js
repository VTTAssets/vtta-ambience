const CONFIG = {
  numBlocks: 20,
};

const loadImage = (url) => {
  return new Promise((resolve, reject) => {
    //  && updateData.width && updateData.height
    let img = new Image();
    img.addEventListener("load", (event) => {
      resolve(img);
    });
    img.addEventListener("error", (event) => {
      reject(event);
    });
    img.src = url;
  });
};

const processSource = (source) => {
  const MAX_DIMENSION = 320;

  // for extracting the color information we do not need a high-res image, so we scale it down to something more manageable
  console.log("Image loaded");
  console.log(`Meta: ${source.width}/${source.height}`);
  console.log(`Meta: ${source.naturalWidth}/${source.naturalHeight}`);

  //   if (source.width > MAX_DIMENSION) {
  //     // x / 320 = 1 / source.width => x = 320 / source.width
  //     const factor = MAX_DIMENSION / source.width;
  //     width = fact * source.width;
  //     height = fact * source.height;
  //     console.log(`Resampled: ${width}/${height}`);
  //   } else {
  //   }

  let blockWidth, numHorizontalBlocks, numVerticalBlocks, width, height;
  if (source.width >= source.height) {
    width = MAX_DIMENSION;
    // sw / sh = 320 / x
    // x = 320 * sh / sw
    height = (MAX_DIMENSION * source.height) / source.width;

    blockWidth = Math.floor(width / CONFIG.numBlocks);
    numHorizontalBlocks = CONFIG.numBlocks;
    numVerticalBlocks = Math.floor((height - 2 * blockWidth) / blockWidth);
  } else {
    height = MAX_DIMENSION;
    // sw / sh = x / 320
    // sw * 320 / sh = x
    width = Math.floor((source.width * MAX_DIMENSION) / source.height);

    blockWidth = Math.floor(height / CONFIG.numBlocks);
    numVerticalBlocks = CONFIG.numBlocks;
    numHorizontalBlocks = Math.floor((width - 2 * blockWidth) / blockWidth);
  }

  console.log(
    `Block width: ${blockWidth} at Vertical: ${numVerticalBlocks}, Horizontal: ${numHorizontalBlocks}`
  );

  // get the pixel information
  let canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  let ctx = canvas.getContext("2d");
  // draw the resampled image on the canvas
  ctx.drawImage(source, 0, 0, source.width, source.height, 0, 0, width, height);

  //  const imageData = ctx.getImageData(0, 0, width, height);

  // get top row
  let avgColors = [];
  // get the color information from this block
  // it is blockWidth wide and high
  let r = 0,
    g = 0,
    b = 0,
    a = 0;
  for (let x = 0; x < numHorizontalBlocks; x++) {
    for (let y = 0; y < numVerticalBlocks; y++) {
      // process only the frame
      if (
        x === 0 ||
        x === numHorizontalBlocks - 1 ||
        y === 0 ||
        y === numVerticalBlocks - 1
      ) {
        let pixels = ctx.getImageData(
          x * blockWidth,
          y * blockWidth,
          blockWidth,
          blockWidth
        ).data;

        for (let index = 0; index < pixels.length; index += 4) {
          r += pixels[index + 0];
          g += pixels[index + 1];
          b += pixels[index + 2];
          a += pixels[index + 3];
        }
        r = Math.round(r / (pixels.length / 4));
        g = Math.round(g / (pixels.length / 4));
        b = Math.round(b / (pixels.length / 4));
        a = Math.round(a / (pixels.length / 4));
        avgColors.push({
          x: x * (source.width / blockWidth),
          y: y * (source.height / blockWidth),
          r: r,
          g: g,
          b: b,
          a: a,
        });
      }
    }
  }
  return avgColors;
};

export default processSource;
