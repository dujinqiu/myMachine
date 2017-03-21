namespace engine{
    export enum TouchEventsType{
        MOUSEDOWN = 0,
        MOUSEUP = 1,
        CLICK = 2,
        MOUSEMOVE = 3
    }

    export class TouchEventService{
        private static instance;
        private performerList : DisplayObject[]=[];
        static currentType:TouchEventsType;
    }

     export class TouchEvents{
         stageX: number;
    stageY: number;
    type: TouchEventsType;
    func: Function;
    obj: any;
    capture = false;
    priority = 0;


    constructor(type: TouchEventsType, func: Function, obj: any, capture?: boolean, priority?: number) {
        this.stageX = TouchEventService.stageX;
        this.stageY = TouchEventService.stageY;
        this.type = type;
        this.func = func;
        this.obj = obj;
        this.capture = capture || false;
        this.priority = priority || 0;

    }
}
}