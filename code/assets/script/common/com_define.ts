import { Language } from "./language";


export class ButtonStyle {
    static OK_CANCEL = 0;
    static OK = 1;
    static CANCEL = 2
}

export class ImageType {
    static IMAGE_TYPE_NONE = 0;
    static IMAGE_TYPE_FOOD = 1;
    static IMAGE_TYPE_HUMAN = 2;
    static IMAGE_TYPE_SCENE = 3;
    static IMAGE_TYPE_ANINAL = 4;
    static IMAGE_TYPE_BUILDING = 5;
}

export class ImageQuality {
    static IMAGE_QUALITY_NONE = 0;
    static IMAGE_QUALITY_ONE = 1;
    static IMAGE_QUALITY_TWO = 2;
    static IMAGE_QUALITY_THREE = 3;
    static IMAGE_QUALITY_FOUR = 4;
}

export class ResType {
    static RES_PIECE = 0;  // 碎片 
    static RES_GOLD = 1;   // 金币
}

export interface Task {
    taskid: number;
    desc: string;
    cond: number;
    award: number[];  // [类型，数量]
}
export let TaskDaily: Task[] = [
    {taskid: 0, desc: Language.TASK_DESC[0], cond: 1, award: [0, 2]},
    {taskid: 1, desc: Language.TASK_DESC[1], cond: 1, award: [0, 2]},
    {taskid: 2, desc: Language.TASK_DESC[2], cond: 1, award: [0, 2]},
    {taskid: 3, desc: Language.TASK_DESC[3], cond: 1, award: [0, 2]},
    {taskid: 4, desc: Language.TASK_DESC[4], cond: 1, award: [0, 2]},
    {taskid: 5, desc: Language.TASK_DESC[5], cond: 1, award: [0, 2]},
    {taskid: 6, desc: Language.TASK_DESC[6], cond: 1, award: [0, 2]},
]