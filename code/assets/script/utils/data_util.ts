
export class DataUtil {
    
    /**
     * 获取图片的资源路径，整图
     * @param imgId 图片id
     */
    static getImageById(imgId: number): string {
        let imgPath = "pieces_images/" + imgId.toString();
        return imgPath;
    }
}