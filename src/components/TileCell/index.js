/* eslint-disable react/jsx-no-bind */
import React, { PureComponent } from 'react';
import { Shape } from 'react-konva';

export default class Cell extends PureComponent {
    getStroke = () => {
        return 'red';
    }

    getFill = () => {
        return 'red';
    }

    render() {
        const { cellSize, x, y, opacity = 1 } = this.props;
        return (
            <Shape
                x={x}
                y={y}
                strokeWidth={1}
                stroke={this.getStroke()}
                fill={this.getFill()}
                Opacity={opacity}
                // eslint-disable-next-line func-names
                sceneFunc={function (ctx) {
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(cellSize / 2, cellSize / 4);
                    ctx.lineTo(0, cellSize / 2);
                    ctx.lineTo(cellSize / -2, cellSize / 4);
                    ctx.stroke();
                    ctx.closePath();
                    ctx.fillStrokeShape(this);
                }}
            />
        );
    }
}
