var canvas = document.getElementById("app") as HTMLCanvasElement;
var stage = engine.run(canvas);
var bitmap = new engine.Bitmap();
let image = document.createElement("img");
image.src = "wander-icon.jpg";
bitmap.image = image;
stage.addChild(bitmap);
let speed = 10;

engine.Ticker.getInstance().register((deltaTime) => {
    bitmap.x += 1;
});

