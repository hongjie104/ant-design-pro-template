import React, { PureComponent } from 'react';
import { Image } from 'react-konva';

export default class KonvaImage extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isSelected: !!props.isSelected,
            src: props.src || null,
            width: props.width,
            height: props.height,
            x: props.x || 0,
            y: props.y || 0,
            img: null,
        };
    }

    componentDidMount() {
        this.loadImg();
    }

    componentWillReceiveProps(nextProps) {
        const newState = {};
        if (nextProps.src) {
            newState.src = nextProps.src;
        }
        if (nextProps.x || nextProps.x === 0) {
            newState.x = nextProps.x;
        }
        if (nextProps.y || nextProps.y === 0) {
            newState.y = nextProps.y;
        }
        if (nextProps.width || nextProps.width === 0) {
            newState.width = nextProps.width;
        }
        if (nextProps.height || nextProps.height === 0) {
            newState.height = nextProps.height;
        }
        this.setState(newState, () => {
            this.loadImg();
        });
    }

    loadImg() {
        const img = new window.Image();
        const { src } = this.state;
        if (src) {
            img.src = src;
            img.onload = () => {
                this.setState({
                    img,
                });
            };
        }
    }

    render() {
        const { isSelected, img, x, y, width, height } = this.state;
        const { onMouseDown, onMouseUp, onClick } = this.props;
        return (
            <Image
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onClick={onClick}
                x={x}
                y={y}
                width={width}
                height={height}
                image={img}
                stroke={isSelected ? '#ff0000' : 'transparent'}
            />
        );
    }
}