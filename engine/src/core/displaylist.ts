namespace engine {


    


export type MovieClipData = {

        name: string,
        frames: MovieClipFrameData[]
    }

    


export type MovieClipFrameData = {
        "image": string
    }


    export interface Drawable {
        render(context2D : CanvasRenderingContext2D);
    }

    export abstract class DisplayObject implements Drawable{
        parent:DisplayObjectContainer;
        protected scaleX=1;
        protected scaleY=1;
        x=0;
        y=0;
        alpha=1;
        globalAlpha=1;
        rotation=0;
        localMatrix=new Matrix();
        globalMatrix=new Matrix();
        listener:TouchEvents[]=[];
        protected width=1;
        protected height=1;
        touchEnabled=true;
        protected normalWidth=-1;
        protected normalHeight=-1;
        setWidth(width:number){
            this.width=width;
        }
        setHeight(height:number){
            this.height=height;
        }
        setScaleX(scalex){
            this.scaleX=scalex;
            this.width=this.width*this.scaleX;
        }
         setScaleY(scaley){
            this.scaleY=scaley;
            this.height=this.height*this.scaleY;
        }
        getWidth(){
        return this.width;
        }
    getHeight(){
        return this.height;
    }
     draw(context2D : CanvasRenderingContext2D){

        if(this.normalWidth > 0){
            this.scaleX = this.width / this.normalWidth;
        }

        if(this.normalHeight > 0){
            this.scaleY = this.height / this.normalHeight;
        }

        this.localMatrix.updateFromDisplayObject(this.x,this.y,this.scaleX,this.scaleY,this.rotation);
        if(this.parent){
            this.globalAlpha = this.parent.globalAlpha * this.alpha;
            this.globalMatrix = matrixAppendMatrix(this.localMatrix,this.parent.globalMatrix);
        }
        if(this.parent == null){
            this.globalAlpha = this.alpha;
            this.globalMatrix = this.localMatrix;
        }
        context2D.globalAlpha = this.globalAlpha;
        context2D.setTransform(this.globalMatrix.a,this.globalMatrix.b,this.globalMatrix.c,this.globalMatrix.d,this.globalMatrix.tx,this.globalMatrix.ty);
        this.render(context2D);
    }
    addEventLisener(type:TouchEventsType,touchFunction:Fouction,object:any,ifCapture?:boolean,priority?:number){
        var touchEvent=new TouchEvents(type,touchFunction,object)
    }



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


   


export class MovieClip extends Bitmap {

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