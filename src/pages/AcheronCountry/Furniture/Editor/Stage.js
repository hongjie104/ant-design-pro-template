/* eslint-disable react/jsx-no-bind */
import React, { PureComponent } from 'react';
import {
    Button,
    Row,
} from 'antd';
import { Stage, Layer, Shape } from 'react-konva';
import NetShape from '@/components/NetShape';
import UndersideTileCell from './UndersideTileCell';
import TouchAreaPoint from './TouchAreaPoint';
import FurnitureImage from '../FurnitureImage';
import { cellSize } from '../../config';
import { getItemIndex, getItemPos } from '../../../../utils/display45';

const netSize = 10;

export default class FurntiureStage extends PureComponent {
    constructor(props) {
        super(props);
        const { furniture } = this.props;
        this.state = {
            furniture,
            topPointX: netSize * cellSize / 2,
            topPointY: 100,
            furnitureX: 0,
            furnitureY: 0,
            operation: 0,
            underside: [],
            touchArea3: [],
            touchArea7: [],
        };

        this._offsetX3 = furniture.offsetX3;
        this._offsetY3 = furniture.offsetY3;
        this._offsetX7 = furniture.offsetX7;
        this._offsetY7 = furniture.offsetY7;
    }

    componentWillMount() {
        const { topPointX, topPointY } = this.state;
        const { furniture: { offsetX3, offsetY3, underside, touchArea3, touchArea7 } } = this.props;
        const { x, y } = getItemPos(0, 0, cellSize, topPointX, topPointY);
        this.setState({
            furnitureX: x - offsetX3,
            furnitureY: y - offsetY3,
            underside: underside.split('&').map(i => i.split(',').map(j => parseInt(j, 10))),
            touchArea3,
            touchArea7,
        });
    }

    componentDidMount() {
        window.addEventListener('keyup', this.handleKeyUp);
    }

    componentWillReceiveProps(nextProps) {
        const { topPointX, topPointY, curDir } = this.state;
        const { x, y } = getItemPos(0, 0, cellSize, topPointX, topPointY);
        const newState = {};
        if (curDir !== nextProps.curDir) {
            newState.curDir = nextProps.curDir;
            newState.furnitureX = x - (nextProps.curDir === 3 ? this._offsetX3 : this._offsetX7);
            newState.furnitureY = y - (nextProps.curDir === 3 ? this._offsetY3 : this._offsetY7);
        }
        this.setState({
            ...newState,
            furniture: nextProps.furniture,
            operation: nextProps.operation,
        });
    }

    componentWillUnmount() {
        window.removeEventListener('keyup', this.handleKeyUp);
    }

    get newData() {
        const { underside, touchArea3, touchArea7 } = this.state;
        const undersideRowArr = []
        for (let row = 0; row < underside.length; row += 1) {
            undersideRowArr[row] = underside[row].join(',');
        }
        // const touchAreaMapFunc = p => {
        //     p.x -= furnitureX;
        //     p.y -= furnitureY;
        //     return p;
        // };
        return {
            offsetX3: this._offsetX3,
            offsetY3: this._offsetY3,
            offsetX7: this._offsetX7,
            offsetY7: this._offsetY7,
            underside: undersideRowArr.join('&'),
            // touchArea3: touchArea3.map(touchAreaMapFunc),
            // touchArea7: touchArea7.map(touchAreaMapFunc),
            touchArea3,
            touchArea7,
        };
    }

    handleKeyUp = ({ code }) => {
        const { operation, curDir } = this.state;
        if (operation === 0) {
            const { furnitureX, furnitureY, topPointX, topPointY } = this.state;
            let movementX = 0;
            let movementY = 0;
            if (code === 'ArrowLeft' || code === 'KeyA') {
                movementX--;
            } else if (code === 'ArrowDown' || code === 'KeyS') {
                movementY++;
            } else if (code === 'ArrowRight' || code === 'KeyD') {
                movementX++;
            } else if (code === 'ArrowUp' || code === 'KeyW') {
                movementY--;
            } else {
                return;
            }
            this.setState({
                furnitureX: furnitureX + movementX,
                furnitureY: furnitureY + movementY,
            }, () => {
                if (curDir === 3) {
                    this._offsetX3 = topPointX - furnitureX - movementX;
                    this._offsetY3 = topPointY - furnitureY - movementY;
                } else {
                    this._offsetX7 = topPointX - furnitureX - movementX;
                    this._offsetY7 = topPointY - furnitureY - movementY;
                }
            });
        }
    };

    handleUnderside = ({ row, col }) => {
        const { operation } = this.state;
        if (operation === 1) {
            if (row > -1 && col > -1) {
                let { underside } = this.state;
                underside = underside.concat();
                if (underside.length > row) {
                    // 行列的长度都够
                    if (underside[0].length > col) {
                        for (let r = 0; r < underside.length; r += 1) {
                            if (row === r) {
                                for (let c = 0; c < underside[0].length; c += 1) {
                                    if (col === c) {
                                        underside[row][col] = underside[row][col] === 1 ? 0 : 1;
                                    }
                                }
                                break;
                            }
                        }
                    } else {
                        // 行够了，但是列数不够
                        const rowLength = underside[0].length;
                        for (let r = 0; r < underside.length; r += 1) {
                            if (!underside[r]) {
                                underside[r] = [];
                            }
                            for (let c = rowLength; c <= col; c += 1) {
                                underside[r][c] = (r === row && c === col) ? 1 : 0;
                            }
                        }
                    }
                } else if (underside[0] && underside[0].length > col) {
                    // 行不够，列够了
                    const rowLength = underside[0].length;
                    for (let r = underside.length; r <= row; r += 1) {
                        if (!underside[r]) {
                            underside[r] = [];
                        }
                        for (let c = 0; c < rowLength; c += 1) {
                            underside[r][c] = (r === row && c === col) ? 1 : 0;
                        }
                    }
                } else {
                    // 行不够，列也不够
                    for (let r = 0; r <= row; r += 1) {
                        if (!underside[r]) {
                            underside[r] = [];
                        }
                        for (let c = underside[r].length; c <= col; c += 1) {
                            underside[r][c] = (r === row && c === col) ? 1 : 0;
                        }
                    }
                }
                // 去掉多余的部分
                let minRow = 0;
                let minCol = 0;
                for (let r = 0; r < underside.length; r += 1) {
                    for (let c = 0; c < underside[r].length; c += 1) {
                        if (underside[r][c] === 1) {
                            minCol = c > minCol ? c : minCol;
                            minRow = r > minRow ? r : minRow;
                        }
                    }
                }
                const newUnderside = [];
                for (let r = 0; r <= minRow; r += 1) {
                    newUnderside[r] = newUnderside[r] || [];
                    for (let c = 0; c <= minCol; c += 1) {
                        newUnderside[r][c] = underside[r][c];
                    }
                }
                this.setState({
                    underside: newUnderside,
                });
            }
        }
    }

    handleAddTouchPoint = () => {
        const { curDir, touchArea3, touchArea7 } = this.state;
        if (curDir === 3) {
            this.setState({
                touchArea3: [...touchArea3, { x: 0, y: 0 }],
            });
        } else {
            this.setState({
                touchArea7: [...touchArea7, { x: 0, y: 0 }],
            });
        }
    };

    handlerClearTouchArea = () => {
        const { curDir } = this.state;
        this.setState({
            [`touchArea${curDir}`]: [],
        });
    };

    render() {
        const {
            furniture,
            topPointX,
            topPointY,
            furnitureX,
            furnitureY,
            operation,
            underside,
            curDir,
            touchArea3,
            touchArea7,
        } = this.state;
        return (
            <div>
                {
                    operation === 2 && (
                        <Row>
                            <Button icon="plus" onClick={this.handleAddTouchPoint} />
                            <Button icon="delete" onClick={this.handlerClearTouchArea} style={{ marginLeft: '8px' }} />
                        </Row>
                    )
                }
                <Row type="flex" justify="center">
                    <Stage
                        width={netSize * cellSize}
                        height={netSize * cellSize / 2 + topPointY}
                        onContentMouseMove={({ evt }) => {
                            // const p = editorUtils.getItemIndex(evt.layerX - layerX, evt.layerY - layerY, CELL_SIZE, topPointX, topPointY);
                            // this.setState({
                            //     mouseIndexRow: p.row,
                            //     mouseIndexCol: p.col,
                            // });
                            // if (this.isMouseDown) {
                            //     if (operation === MOVE) {
                            //         if (editingFurniture) {
                            //             // 拖拽家具
                            //             // editingFurniture.updateRowAndCol(evt.layerX - layerX, evt.layerY - layerY, topPointX, topPointY);
                            //             const { row, col } = editorUtils.getItemIndex(evt.layerX - layerX, evt.layerY - layerY, CELL_SIZE, topPointX, topPointY);
                            //             for (let index = 0; index < furnitureDataArr.length; index += 1) {
                            //                 if (furnitureDataArr[index].id === editingFurniture.getId()) {
                            //                     furnitureDataArr[index].row = row;
                            //                     furnitureDataArr[index].col = col;
                            //                     this.setState({
                            //                         furnitureDataArr: [...furnitureDataArr],
                            //                     });
                            //                     break;
                            //                 }
                            //             }
                            //         } else if (editingNPC) {
                            //             const { row, col } = editorUtils.getItemIndex(evt.layerX - layerX, evt.layerY - layerY, CELL_SIZE, topPointX, topPointY);
                            //             for (let index = 0; index < npcDataArr.length; index += 1) {
                            //                 if (npcDataArr[index].id === editingNPC.getId()) {
                            //                     npcDataArr[index].row = row;
                            //                     npcDataArr[index].col = col;
                            //                     this.setState({
                            //                         npcDataArr: [...npcDataArr],
                            //                     });
                            //                     break;
                            //                 }
                            //             }
                            //         } else {
                            //             this.setState({
                            //                 layerX: layerX + evt.movementX,
                            //                 layerY: layerY + evt.movementY,
                            //             });
                            //         }
                            //     } else if (operation === EDIT) {
                            //         if (p.row > -1 && p.col > -1 && p.row < mapData.length && p.col < mapData[0].length) {
                            //             mapData[p.row][p.col] = curMapType;
                            //             this.setState({
                            //                 mapData: [...mapData],
                            //             });
                            //         }
                            //     }
                            // }
                            if (this._isFurnitureSelected) {
                                // const { row, col } = getItemIndex(evt.layerX, evt.layerY, cellSize, topPointX, topPointY)
                                // const { x, y } = getItemPos(row, col, cellSize, topPointX, topPointY);
                                // this.setState({
                                //     furnitureX: x,
                                //     furnitureY: y,
                                // });
                                if (operation === 0) {
                                    this.setState({
                                        furnitureX: furnitureX + evt.movementX,
                                        furnitureY: furnitureY + evt.movementY,
                                    }, () => {
                                        if (curDir === 3) {
                                            this._offsetX3 = topPointX - furnitureX - evt.movementX;
                                            this._offsetY3 = topPointY - furnitureY - evt.movementY;
                                        } else {
                                            this._offsetX7 = topPointX - furnitureX - evt.movementX;
                                            this._offsetY7 = topPointY - furnitureY - evt.movementY;
                                        }
                                    });
                                }
                            } else if (!isNaN(this._touchPointSelectedIndex) && this._touchPointSelectedIndex !== '' && this._touchPointSelectedIndex >= 0) {
                                if (operation === 2) {
                                    if (curDir === 3) {
                                        const newTouchArea3 = [...touchArea3];
                                        newTouchArea3[this._touchPointSelectedIndex].x += evt.movementX;
                                        newTouchArea3[this._touchPointSelectedIndex].y += evt.movementY;
                                        this.setState({
                                            touchArea3: newTouchArea3,
                                        });
                                    } else if (curDir === 7) {
                                        const newTouchArea7 = [...touchArea7];
                                        newTouchArea7[this._touchPointSelectedIndex].x += evt.movementX;
                                        newTouchArea7[this._touchPointSelectedIndex].y += evt.movementY;
                                        this.setState({
                                            touchArea7: newTouchArea7,
                                        });
                                    }
                                }
                            }
                        }}
                        onContentMouseDown={() => {
                            // const newState = {};
                            // if (this.lastMouseDown !== 'furniture') {
                            //     newState.editingFurniture = null;
                            //     if (this.state.editingFurniture) {
                            //         this.state.editingFurniture.setSelected(false);
                            //     }
                            // }
                            // if (this.lastMouseDown !== 'npc') {
                            //     newState.editingNPC = null;
                            // }
                            // this.setState(newState);
                            // this.isMouseDown = true;
                        }}
                        onContentMouseUp={({ evt }) => {
                            this._isFurnitureSelected = false;
                            this._touchPointSelectedIndex = -1;
                            if (operation === 1) {
                                this.handleUnderside(getItemIndex(evt.layerX, evt.layerY, cellSize, topPointX, topPointY));
                            }
                            // const p = editorUtils.getItemIndex(evt.layerX - layerX, evt.layerY - layerY, CELL_SIZE, topPointX, topPointY);
                            // const newState = {};
                            // if (this.lastMouseDown !== 'furniture') {
                            //     newState.editingFurniture = null;
                            //     if (this.state.editingFurniture) {
                            //         this.state.editingFurniture.setSelected(false);
                            //     }
                            // }
                            // if (this.lastMouseDown !== 'npc') {
                            //     newState.editingNPC = null;
                            // }
                            // this.lastMouseDown = null;
                            // if (isMapEnterEditorVisible) {
                            //     // 编辑入口点
                            //     newState.enterRow = p.row;
                            //     newState.enterCol = p.col;
                            // }
                            // this.setState(newState);
                        }}
                        onContentMouseOut={() => {
                            this._isFurnitureSelected = false;
                            this._touchPointSelectedIndex = -1;
                        }}
                    >
                        <Layer>
                            <NetShape cellSize={cellSize} rows={netSize} cols={netSize} topPointX={topPointX} topPointY={topPointY} visible />
                            {
                                furniture && (
                                    <FurnitureImage
                                        furniture={furniture}
                                        onMouseDown={() => { this._isFurnitureSelected = true; }}
                                        x={furnitureX}
                                        y={furnitureY}
                                        curDir={curDir}
                                    />
                                )
                            }
                            {
                                operation === 1 && (
                                    underside.map((undersideRow, row) => {
                                        return undersideRow.map((val, col) => {
                                            if (val === 1) {
                                                const { x, y } = getItemPos(row, col, cellSize, topPointX, topPointY);
                                                return <UndersideTileCell x={x} y={y} cellSize={cellSize} opacity={.36} key={`${row}-${col}`} />;
                                            }
                                            return null;
                                        });
                                    })
                                )
                            }
                            {
                                // 触摸区域的线条
                                operation === 2 && (
                                    <Shape
                                        strokeWidth={1}
                                        stroke="red"
                                        // eslint-disable-next-line func-names
                                        sceneFunc={function (ctx) {
                                            ctx.beginPath();
                                            if (curDir === 3) {
                                                if (touchArea3.length > 0) {
                                                    ctx.moveTo(touchArea3[0].x + furnitureX, touchArea3[0].y + furnitureY);
                                                }
                                                for (let i = 1; i < touchArea3.length; i++) {
                                                    ctx.lineTo(touchArea3[i].x + furnitureX, touchArea3[i].y + furnitureY);
                                                }
                                            } else {
                                                if (touchArea7.length > 0) {
                                                    ctx.moveTo(touchArea7[0].x + furnitureX, touchArea7[0].y + furnitureY);
                                                }
                                                for (let i = 1; i < touchArea7.length; i++) {
                                                    ctx.lineTo(touchArea7[i].x + furnitureX, touchArea7[i].y + furnitureY);
                                                }
                                            }
                                            ctx.stroke();
                                            ctx.closePath();
                                            ctx.fillStrokeShape(this);
                                        }}
                                    />
                                )
                            }
                            {
                                // 触摸区域的点
                                operation === 2 && curDir === 3 && (
                                    touchArea3.map((touchPoint, i) => (
                                        <TouchAreaPoint
                                            key={i}
                                            x={touchPoint.x + furnitureX}
                                            y={touchPoint.y + furnitureY}
                                            onMouseDown={() => { this._touchPointSelectedIndex = i }}
                                        />
                                    ))
                                )
                            }
                            {
                                // 触摸区域的点
                                operation === 2 && curDir === 7 && (
                                    touchArea7.map((touchPoint, i) => (
                                        <TouchAreaPoint
                                            key={i}
                                            x={touchPoint.x + furnitureX}
                                            y={touchPoint.y + furnitureY}
                                            onMouseDown={() => { this._touchPointSelectedIndex = i }}
                                        />
                                    ))
                                )
                            }
                            {/* <Group> */}
                            {
                                // detail.id && (
                                //     <Furniture
                                //         ref={(c) => { this.furniture = c; }}
                                //         src={`${IMG_SERVER}/furniture/sheet${detail.sheetIndex}/${utils.int2Str(detail.id)}/editor/${detail.asset}_${curDir}.png`}
                                //         curDir={curDir}
                                //     />
                                // )
                            }
                            {/* <Cell ref={(c) => { this.cell = c; }} visible={isCellVisible} /> */}
                            {/* 网格层 */}
                            {/* <NetShape cellSize={cellSize} rows={rows} cols={cols} /> */}
                            {/* <Rect
                                            x={0}
                                            y={0}
                                            width={200}
                                            height={200}
                                            fill="green"
                                            // shadowBlur={5}
                                            onClick={this.handleClick}
                                        />
                                        <Image image={image} width={200} height={200} x={10} y={20} /> */}
                            {/* </Group> */}
                        </Layer>
                    </Stage>
                </Row>
            </div>
        );
    }
}
