import React, { useState } from 'react';
import { Modal, Form, Input } from 'antd';


export default function ModalAddFiador(props) {
    const [fiador, setFiador] = useState('')
    const { show } = props;

    function handleOk(fiador) {
        props.handleOk(fiador);
        setFiador('');
    }
    return (
        <Modal
            title="Basic Modal"
            visible={show}
            onOk={() => handleOk(fiador)}
            onCancel={props.handleCancel}
        >
            <Form
                name="addFiador"
            >
                <Form.Item
                    label="Fiador"
                    name="fiador"
                    rules={[{ required: true, message: 'Required' }]}
                >
                    <Input
                        value={fiador}
                        onChange={e => setFiador(e.target.value)} />
                </Form.Item>
            </Form>
        </Modal>
    );
}
