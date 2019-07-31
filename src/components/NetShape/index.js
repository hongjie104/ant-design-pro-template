/* eslint-disable react/jsx-no-bind */
import React, { PureComponent } from 'react';
import { Shape } from 'react-konva';

/**
 * 网格图形
 */
export default class NetShape extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            points: [],
            visible: props.visible !== false,
        };
    }

    componentWillMount() {
        this.draw(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.draw(nextProps);
    }

    draw({ cellSize, rows, cols, topPointX, topPointY, visible }) {
        const cellWidth = cellSize;
        const cellHeight = cellWidth / 2;
        const halfCellWidth = cellHeight;
        const halfCellHeight = cellHeight / 2;
        // 算出格子线条的坐标值
        const points = [];
        // 开始画行线
        let startX = topPointX;
        let startY = topPointY;
        let endX = (cols * halfCellWidth) + topPointX;
        let endY = (cols * halfCellHeight) + topPointY;
        for (let row = 0; row <= rows; row += 1) {
            points.push([startX, startY, endX, endY]);
            startX -= halfCellWidth;
            startY += halfCellHeight;
            endX -= halfCellWidth;
            endY += halfCellHeight;
        }
        // 开始画列线
        startX = topPointX;
        startY = topPointY;
        endX = topPointX - (rows * halfCellWidth);
        endY = topPointY + (rows * halfCellHeight);
        for (let col = 0; col <= cols; col += 1) {
            points.push([startX, startY, endX, endY]);
            startX += halfCellWidth;
            startY += halfCellHeight;
            endX += halfCellWidth;
            endY += halfCellHeight;
        }
        this.setState({
            points,
            visible: visible !== false,
        });
    }

    render() {
        const { points, visible } = this.state;
        return (
            <Shape
                visible={visible}
                x={0}
                y={0}
                strokeWidth={1}
                stroke="black"
                // eslint-disable-next-line func-names
                sceneFunc={function (ctx) {
                    ctx.beginPath();
                    for (let index = 0; index < points.length; index += 1) {
                        ctx.moveTo(points[index][0], points[index][1]);
                        ctx.lineTo(points[index][2], points[index][3]);
                    }
                    ctx.stroke();
                    ctx.closePath();
                    ctx.fillStrokeShape(this);
                }}
            />
        );
    }
}
