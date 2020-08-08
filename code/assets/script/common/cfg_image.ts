
export interface ImageDefine {
    imageid: number;  // 索引 id
    name: string;   // 名称
    type: number;  // 所属类型 见 ImageType
    quality: number; // 品质 见 ImageQuality
}

export let CfgImage: {[index:number]: ImageDefine} = {
    10000: {imageid: 10000, name: "tes1", type: 1, quality: 3},
    10001: {imageid: 10000, name: "tes2", type: 2, quality: 2},
    10002: {imageid: 10000, name: "tes3", type: 3, quality: 2},
    10003: {imageid: 10000, name: "tes4", type: 2, quality: 3},
    10004: {imageid: 10000, name: "tes5", type: 2, quality: 1},
    10005: {imageid: 10000, name: "tes6", type: 1, quality: 3},
    10006: {imageid: 10000, name: "tes7", type: 3, quality: 2},
    10007: {imageid: 10000, name: "tes8", type: 5, quality: 1},
    10008: {imageid: 10000, name: "tes9", type: 5, quality: 2},
}