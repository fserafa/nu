import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import CardConta from './CardConta';


export default function DraggableCardConta(props) {
    const { item, index } = props;
    return (
        <Draggable draggableId={index.toString()} index={index}>
            {provided => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}>
                    <CardConta item={item} />
                </div>
            )}
        </Draggable>
    );
}
