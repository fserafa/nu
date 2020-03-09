import React, { useState } from 'react';
import { Modal, Form, Input, Select } from 'antd';

const { Option } = Select;

export default function ModalDividir(props) {
    const [value, setValue] = useState([])
    const { show, handleOk, handleCancel, fiadores, item } = props;

    return (
        <Modal
            title="Basic Modal"
            visible={show}
            onOk={() => handleOk(value, item)}
            onCancel={handleCancel}
        >
            <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Select"
                // value={item.dividir && item.dividir.map(d => d._id)}
                onChange={(value) => setValue(value)}
            >
                {fiadores && fiadores.map(item => (
                    <Option key={item._id}>{item.name}</Option>
                ))}
            </Select>
        </Modal>
    );
}
