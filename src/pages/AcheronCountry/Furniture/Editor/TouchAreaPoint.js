/* eslint-disable react/jsx-no-bind */
import React, { PureComponent } from 'react';
import { Shape } from 'react-konva';

const WIDTH = 10;
const HEIGHT = 10;

export default class TouchAreaPoint extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            x: props.x || 0,
            y: props.y || 0,
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            x: nextProps.x,
            y: nextProps.y,
        });
    }

    render() {
        const { x, y } = this.state;
        const { onMouseDown } = this.props;
        return (
            <Shape
                strokeWidth={1}
                stroke='red'
                fill='blue'
                onMouseDown={onMouseDown}
                x={x}
                y={y}
                // eslint-disable-next-line func-names
                sceneFunc={function (ctx) {
                    ctx.beginPath();
                    ctx.moveTo(WIDTH / -2, HEIGHT / -2);
                    ctx.lineTo(WIDTH / 2, HEIGHT / -2);
                    ctx.lineTo(WIDTH / 2, HEIGHT / 2);
                    ctx.lineTo(WIDTH / -2, HEIGHT / 2);
                    ctx.stroke();
                    ctx.closePath();
                    ctx.fillStrokeShape(this);
                }}
            />
        );
    }
}
