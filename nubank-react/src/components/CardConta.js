
import React, { useState } from 'react';
import { Card, Row, Badge, Select, Button } from 'antd';
import ModalDividir from './Modals/ModalDividir';

const { Option } = Select;

export default function CardConta(props) {
    const [show, setShow] = useState(false)
    const { item, fiadores, handleChangeDividir } = props;

    function handleShowModal() {
        setShow(true)
    }

    function handleOk(value, item) {
        handleChangeDividir(value, item)
        setShow(false)
    }

    function handleCancel() {
        setShow(false)
    }

    return (
        <Card>
            <Row>
                {item.name}
            </Row>
            <Row>
                {item.value / 100}
            </Row>
            <Row>
                <Badge className="site-badge-count-109" count={item.date} style={{ backgroundColor: '#52c41a' }} />
            </Row>
            <Row>
                {item.fiador === 'Dividir' ? (
                    <>
                        <Button onClick={handleShowModal}>Dividir</Button>
                        {item.dividir && item.dividir.map(div => (
                            <p key={div._id}>{div.name}</p>
                        ))}
                    </>
                ) : null}
                <ModalDividir
                    item={item}
                    show={show}
                    handleOk={handleOk}
                    handleCancel={handleCancel}
                    fiadores={fiadores} />
            </Row>
        </Card>
    );
}
