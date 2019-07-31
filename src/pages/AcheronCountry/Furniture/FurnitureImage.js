import React, { PureComponent } from 'react';
import KonvaImage from '@/components/KonvaImage';

export default class FurntiureImage extends PureComponent {
    render() {
        const { furniture, onMouseDown, x, y, curDir } = this.props;
        return (
            <KonvaImage
                x={x}
                y={y}
                onMouseDown={onMouseDown}
                width={furniture.imgWidth}
                heighht={furniture.imgHeight}
                src={curDir === 3 ? furniture.imgUrl3 : furniture.imgUrl7}
            />
        );
    }
}
