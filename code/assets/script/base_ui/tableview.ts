import {UIUtil} from "../utils/ui_util";

const {ccclass, property} = cc._decorator;

interface CellData {
    node: cc.Node;   // 节点对象
    index: number;   // 节点表示的数据 index
}

@ccclass
export class TableView {
    boundLen: number = 200;
    offset: number = 0;
    cellList: CellData[] = []; // 可见节点数据
    cellListCache: CellData[] = [];   // 不可见（缓存）节点数据
    cellAtIndex: any = null;   // 节点回调
    isScrolling: boolean = false;   // 是否在滑动
    node: cc.Node = null;        // tableview 顶层节点
    cell: cc.Node = null;        // 提供需要显示的 cell 节点，可以获取大小等
    cellNum: number = 0;         // 需要显示的 cell 个数
    direction: number = 0;       // 方向，水平(0)还是垂直1
    maxOffset: number = 0;       // 最大偏移量
    constructor(){
    }

    init(node: cc.Node, cellNum: number, direction: number) {
        this.node = node;
        this.cellNum = cellNum;
        this.cell = this.node.getChildByName("container").getChildByName("content");
        this.direction = direction;
        
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        let num = 0;  // 可见的cell个数
        if (this.direction == 0) {
            this.cell.setAnchorPoint(0, 0);
            num = Math.ceil(this.node.width / this.cell.width);
        } else {
            this.cell.setAnchorPoint(0, 1);
            num = Math.ceil(this.node.height / this.cell.height);
        }
        // 初始化可见区域的数据集
        for (let i=0; i< num+2; i++) {
            let cell = cc.instantiate(this.cell);
            if (i < this.cellNum) {
                cell.active = true;
            } else {
                cell.active = false;
            }
            
            this.node.getChildByName("container").addChild(cell);
            if (this.direction == 0) {
                cell.x = i * cell.width;
            } else {
                cell.y = - i * cell.height;
            }
            
            let cellObj = {"node": cell, "index": i};
            this.cellList.push(cellObj);
            if (i < this.cellNum) {
                this.setCellContent(cell, i);
            }
        }
        this.calMaxOffset();

        // 先预创建一些，防止卡顿，
        for (let i=0; i< 10; i++) {
            let cell = cc.instantiate(this.cell);
            cell.active = false;
            this.node.getChildByName("container").addChild(cell);
            let cellObj = {"node": cell, "index": i};
            this.cellListCache.push(cellObj);
        }

        this.cell.active = false;
    }

    onTouchStart(event: cc.Event.EventTouch) {
    }

    onTouchMove(event: cc.Event.EventTouch) {
        let distance: number = 0;
        if (this.direction == 0) {
            distance = event.getDeltaX();
        } else {
            distance = - event.getDeltaY();
        }
        this.isScrolling = true;   // 事件由 cell 来判断是否触发，到这里了就说了触发了滑动
        this.moveDistance(distance);
    }

    onTouchEnd(event: cc.Event.EventTouch) {
        if (this.offset < 0) {
            this.resetHead();
        } else if (this.offset > this.maxOffset - this.boundLen){
            this.resetTail();
        } else {
            // 需要动画实现效果，暂时不做
            // let dis = this.offset - this.tempOffset
            // cc.log("dis: ", dis)
            // if (Math.abs(dis) > 10) {
            //     this.moveDistance(-dis)
            // }
            // this.tempOffset = this.offset
        }
        this.isScrolling = false;
        
    }

    onTouchCancel(event: cc.Event.EventTouch) {
        if (this.offset < 0) {
            this.resetHead();
        } else if (this.offset > this.maxOffset - this.boundLen){
            this.resetTail();
        }
        this.isScrolling = false;
    }

    moveDistance(distance: number) {
        this.offset -= distance;
        let actualDis = distance;
        if (this.offset <= 0) {  // todo 需要防止减过头
            if (this.offset < -this.boundLen) {
                actualDis = this.boundLen + this.offset + distance;
                this.offset = -this.boundLen;
            }
        } else if (this.offset >= this.maxOffset - this.boundLen){
            if (this.offset > this.maxOffset) {
                actualDis =  (this.offset + distance) - this.maxOffset;   // 这个时候 distance 是负的，需要注意顺序
                this.offset = this.maxOffset;
            }
        }
        
        let cellListNew = [];
        if (this.direction == 0) {
            for (let i=0; i< this.cellList.length; i++) {
                let cellObj = this.cellList[i];
                cellObj.node.x += actualDis;
                if (cellObj.node.x < -5 * this.cell.width) {
                    cellObj.node.active = false;
                    this.cellListCache.push(cellObj);
                } else if (cellObj.node.x > this.node.width + 5 * this.cell.width) {
                    cellObj.node.active = false;
                    this.cellListCache.push(cellObj);
                } else {
                    cellListNew.push(cellObj);
                }
                if (i==0 && cellObj.node.x > -3 * this.cell.width && cellObj.index > 0) {
                    let obj = this.getNewCell();
                    obj.node.active = true;
                    obj.node.x = cellObj.node.x - this.cell.width;
                    obj.index = cellObj.index - 1;
                    cellListNew.unshift(obj);
                    this.setCellContent(obj.node, obj.index);
                }
                if (i == this.cellList.length -1 && 
                    cellObj.node.x < this.node.width + 3*this.cell.width && 
                    cellObj.index < this.cellNum-1) {
                    let obj = this.getNewCell();
                    obj.node.active = true;
                    obj.node.x = cellObj.node.x + this.cell.width;
                    obj.index = cellObj.index + 1;
                    cellListNew.push(obj);
                    this.setCellContent(obj.node, obj.index);
                }
            }
        } else {
            for (let i=0; i< this.cellList.length; i++) {
                let cellObj = this.cellList[i];
                cellObj.node.y -= actualDis;
                if (cellObj.node.y > 5 * this.cell.height) {
                    cellObj.node.active = false;
                    this.cellListCache.push(cellObj);
                } else if (cellObj.node.y < -this.node.height - 5 * this.cell.height) {
                    cellObj.node.active = false;
                    this.cellListCache.push(cellObj);
                } else {
                    cellListNew.push(cellObj);
                }
                if (i==0 && cellObj.node.y < 3 * this.cell.height && cellObj.index > 0) {
                    let obj = this.getNewCell();
                    obj.node.active = true;
                    obj.node.y = cellObj.node.y + this.cell.height;
                    obj.index = cellObj.index - 1;
                    cellListNew.unshift(obj);
                    this.setCellContent(obj.node, obj.index);
                }
                if (i == this.cellList.length -1 && 
                    cellObj.node.y > -this.node.height - 3*this.cell.height && 
                    cellObj.index < this.cellNum-1) {
                    let obj = this.getNewCell();
                    obj.node.active = true;
                    obj.node.y = cellObj.node.y - this.cell.height;
                    obj.index = cellObj.index + 1;
                    cellListNew.push(obj);
                    this.setCellContent(obj.node, obj.index);
                }
            }
        }
        
        this.cellList = cellListNew;
    }

    setCellContent(cell: cc.Node, index: number) {
        if (this.cellAtIndex) {
            this.cellAtIndex(cell, index);
        }
    }

    getNewCell(): CellData {
        if (this.cellListCache.length > 0) {
            return this.cellListCache.pop();
        }
        let cell = cc.instantiate(this.cell);
        this.node.getChildByName("container").addChild(cell);
        let cellObj = {"node": cell, "index": 0};
        return cellObj;
    }

    resetHead() {
        this.cellList.forEach(cellObj => {
            if (this.direction == 0) {
                cellObj.node.x += this.offset;
            } else {
                cellObj.node.y += -this.offset;
            }
        })
        this.offset = 0;
    }

    resetTail() {
        this.cellList.forEach(cellObj => {
            if (this.direction == 0) {
                cellObj.node.x += this.offset - (this.maxOffset - this.boundLen);
            } else {
                cellObj.node.y -= this.offset - (this.maxOffset - this.boundLen);
            }
        })
        this.offset = this.maxOffset - this.boundLen;
    }

    setCellAtIndexCallback(callback) {
        this.cellAtIndex = callback;
    }

    getScrollState(): boolean {
        return this.isScrolling;
    }

    /**
     * 重新加载 tableView 的数据
     * @param {*} cellNum ： 新的数据个数
     * @param {*} keepOffset : 是否保存偏移量
     * @param {*} deleteHead : 是否是删除了第一个元素，如果删除了第一个元素，需要指定来获取最新的index
     */
    reloadData(cellNum: number, keepOffset: boolean=false) {
        this.cellNum = cellNum;
        this.calMaxOffset();
        if (!keepOffset) {
            let num = 0;  // 防止 cellList 长度为0
            if (this.direction == 0) {
                num = Math.ceil(this.node.width / this.cell.width);
            } else {
                num = Math.ceil(this.node.height / this.cell.height);
            }
            let maxIndex = this.cellList.length > num ? this.cellList.length : num+2;
            let cellListNew: CellData[] = [];
            for (let i=0; i< maxIndex; i++) {
                let obj: CellData;
                if (i < this.cellList.length) {
                    obj = this.cellList[i];
                } else {
                    obj = this.getNewCell();
                }
                if (i < this.cellNum) {
                    obj.node.active = true;
                    obj.index = i;
                    if (this.direction == 0) {
                        obj.node.x = i * obj.node.width;
                    } else {
                        obj.node.y = - i * obj.node.height;
                    }
                    cellListNew.push(obj);
                    this.setCellContent(obj.node, i);
                } else {
                    obj.node.active = false;
                    obj.index = 0;
                    this.cellListCache.push(obj);
                }
            }
            this.offset = 0;
            this.cellList = cellListNew;
        } else {
            let cellListNew: CellData[] = [];
            for(let i=0; i<this.cellList.length; i++) {
                let cellObj = this.cellList[i];
                if (cellObj.index >= this.cellNum) {
                    cellObj.node.active = false;
                    this.cellListCache.push(cellObj);
                } else {
                    cellListNew.push(cellObj);
                    this.setCellContent(cellObj.node, cellObj.index);
                }
            }
            this.cellList = cellListNew;
            this.moveDistance(0);  // 防止cellList个数不够了
        }
    }

    /**
     * 计算最大偏移量
     */
    calMaxOffset() {
        if (this.direction == 0) {
            this.maxOffset = this.cellNum * this.cell.width - this.node.width;
            this.maxOffset = this.maxOffset > 0 ? this.maxOffset : 0;   // 防止一个元素小于0的情况
            this.maxOffset += this.boundLen;
        } else {
            this.maxOffset = this.cellNum * this.cell.height - this.node.height;
            this.maxOffset = this.maxOffset > 0 ? this.maxOffset : 0;   // 防止一个元素小于0的情况
            this.maxOffset += this.boundLen;
        }
    }
}

