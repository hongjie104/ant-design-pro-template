/**
 * 获得鼠标位置所在方块的索引值
 * @param {Number} mouseX 鼠标横坐标
 * @param {Number} mouseY 鼠标纵坐标
 * @param {Number} cellWidth 格子宽度
 * @param {Number} topPointX 顶点横坐标
 * @param {Number} topPointY 顶点纵坐标
 * @return {{col: Number, row: Number}} 结果
 */
export function getItemIndex(mouseX, mouseY, cellWidth, topPointX, topPointY) {
    mouseX -= topPointX;
    mouseY -= topPointY;
    let row = (mouseY / (cellWidth / 2)) - (mouseX / cellWidth);
    let col = (mouseX / cellWidth) + (mouseY / (cellWidth / 2));
    row = row < 0 ? -1 : row;
    col = col < 0 ? -1 : col;
    // row = row < 0 ? 0 : row;
    // col = col < 0 ? 0 : col;
    return {
        row: parseInt(row, 10),
        col: parseInt(col, 10),
    };
}

/**
 * 根据方块的索引值获取方块的屏幕坐标
 * @param {Number} row 行数
 * @param {Number} col列数
 * @param {Number} cellWidth 格子宽度
 * @param {Number} topPointX 顶点横坐标
 * @param {Number} topPointY 顶点纵坐标
 * @return {{x: Number, y: Number}} 结果
 */
export function getItemPos(row, col, cellWidth, topPointX, topPointY) {
    return {
        x: ((col - row) * (cellWidth * 0.5)) + topPointX,
        y: ((col + row) * (cellWidth / 4)) + topPointY,
    };
}