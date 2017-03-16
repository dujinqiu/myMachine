namespace engine {


    type MovieClipData = {

        name: string,
        frames: MovieClipFrameData[]
    }

    type MovieClipFrameData = {
        "image": string
    }


    export interface Drawable {
        update();
    }

    export abstract class DisplayObject {

        type = "DisplayObject";

        x = 0;

        y = 0;

        scaleX = 1;

        scaleY = 1;

        rotation = 0;

        alpha = 1;

        globalAlpha = 1;

        localMatrix: Matrix;

        globalMatrix: Matrix;

        parent: DisplayObjectContainer;

        touchEnabled: boolean;

        constructor(type: string) {
            this.type = type;
            this.localMatrix = new Matrix();
            this.globalMatrix = new Matrix();
        }





        // 模板方法模式        
        update() {
            this.localMatrix.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation);
            if (this.parent) {
                this.globalMatrix = matrixAppendMatrix(this.localMatrix, this.parent.globalMatrix);
            }
            else {
                this.globalMatrix = this.localMatrix;
            }
            if (this.parent) {
                this.globalAlpha = this.parent.globalAlpha * this.alpha;
            }
            else {
                this.globalAlpha = this.alpha;
            }
        }

        abstract hitTest(x: number, y: number): DisplayObject
    }


    export class Bitmap extends DisplayObject {

        image: HTMLImageElement;

        constructor() {
            super("Bitmap");
        }

        hitTest(x: number, y: number) {
            console.log(x, y)
            let rect = new Rectangle();
            rect.x = rect.y = 0;
            rect.width = this.image.width;
            rect.height = this.image.height;
            if (rect.isPointInRectangle(new Point(x, y))) {
                return this;
            }
            else {
                return null;
            }
        }
    }


    var fonts = {

        "name": "Arial",
        "font": {
            "A": [0, 0, 0, 0, 1, 0, 0, 1, 1, 0],
            "B": []
        }

    }

    export class TextField extends DisplayObject {

        text: string = "";

        constructor() {
            super("TextField");
        }

        hitTest(x: number, y: number) {
            var rect = new Rectangle();
            rect.height = 20;
            var point = new Point(x, y);
            if (rect.isPointInRectangle(point)) {
                return this;
            }
            else {
                return null;
            }
        }
    }

    export class DisplayObjectContainer extends DisplayObject {

        constructor() {
            super("DisplayObjectContainer");
        }

        children: DisplayObject[] = [];

        update() {
            super.update();
            for (let drawable of this.children) {
                drawable.update();
            }
        }

        addChild(child: DisplayObject) {
            this.children.push(child);
            child.parent = this;
        }

        hitTest(x, y) {
            for (let i = this.children.length - 1; i >= 0; i--) {
                let child = this.children[i];
                let point = new Point(x, y);
                let invertChildLocalMatrix = invertMatrix(child.localMatrix);
                let pointBaseOnChild = pointAppendMatrix(point, invertChildLocalMatrix);
                let hitTestResult = child.hitTest(pointBaseOnChild.x, pointBaseOnChild.y);
                if (hitTestResult) {
                    return hitTestResult;
                }
            }
            return null;
        }

    }


    class MovieClip extends Bitmap {

        private advancedTime: number = 0;

        private static FRAME_TIME = 20;

        private static TOTAL_FRAME = 10;

        private currentFrameIndex: number;

        private data: MovieClipData;

        constructor(data: MovieClipData) {
            super();
            this.setMovieClipData(data);
            this.play();
        }

        ticker = (deltaTime) => {
            // this.removeChild();
            this.advancedTime += deltaTime;
            if (this.advancedTime >= MovieClip.FRAME_TIME * MovieClip.TOTAL_FRAME) {
                this.advancedTime -= MovieClip.FRAME_TIME * MovieClip.TOTAL_FRAME;
            }
            this.currentFrameIndex = Math.floor(this.advancedTime / MovieClip.FRAME_TIME);

            let data = this.data;

            let frameData = data.frames[this.currentFrameIndex];
            let url = frameData.image;
        }

        play() {
            Ticker.getInstance().register(this.ticker);
        }

        stop() {
            Ticker.getInstance().unregister(this.ticker)
        }

        setMovieClipData(data: MovieClipData) {
            this.data = data;
            this.currentFrameIndex = 0;
            // 创建 / 更新 

        }
    }

}