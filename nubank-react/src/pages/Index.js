import React, { useState, useEffect } from 'react';
import { Container } from '@material-ui/core';
import { Button, Spin, Layout } from 'antd';
import ModalAddFiador from '../components/Modals/ModalAddFiador';
import api from '../services/api';

const { Content } = Layout;

export default function Index(props) {
    const [file, setFile] = useState('');
    const [faturas, setFaturas] = useState([]);
    const [reload, setReload] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true)
    const [fiadores, setFiadores] = useState([])

    useEffect(() => {
        (async () => {
            const faturas = await api.get('/faturas');
            const fiadores = await api.get('/fiadores');

            console.log(faturas)

            faturas && setFaturas(faturas.data);
            fiadores && setFiadores(fiadores.data)
            setLoading(false)
        })();


    }, [reload])


    function handleChange(e) {
        setFile(e.target.files[0])
    }

    async function handleSubmit(e) {
        setLoading(true)
        e.preventDefault();

        const data = new FormData();
        data.append('file', file)

        const response = await api.post('/extrair', data);

        setFaturas(faturas => ([...faturas, response.data]));
        setLoading(false)
    }

    async function handleOk(data) {
        setLoading(true)

        const formData = new FormData();

        formData.append('name', data)

        const response = await api.post('/fiador', formData);

        setFiadores(fiadores => ([...fiadores, response.data]));
        setShowModal(false)
        setLoading(false)
    }

    function handleCancel() {
        setShowModal(false)
    }

    async function handleDelete(key, id) {
        setLoading(true);

        await api.delete(`/${key}/${id}`)
        setReload(reload => !reload);

        setLoading(false)
    }

    return (
        <Layout>
            <Layout style={{ padding: '0 24px 24px' }}>
                <Content
                    className="site-layout-background"
                    style={{
                        background: '#fff',
                        padding: 24,
                        margin: 0,
                        minHeight: 280,
                    }}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {loading && <Spin />}
                    </div>
                    <h1>Index</h1>
                    <form onSubmit={handleSubmit}>
                        <input name="File" type="file" onChange={e => handleChange(e)} />
                        <Button type="primary" htmlType="submit">Upload</Button>
                    </form>

                    {faturas.map(item => (
                        <div key={item._id}>
                            <Button onClick={() => props.history.push('/fatura', { id: item._id })}>{item.vencimento}</Button>
                            <Button onClick={() => handleDelete('fatura', item._id)}>Delete</Button>
                        </div>
                    ))}
                </Content>
                <Content
                    className="site-layout-background"
                    style={{
                        background: '#fff',
                        padding: 24,
                        margin: 0,
                        minHeight: 280,
                    }}>
                    <Button type="primary" onClick={() => setShowModal(true)}>Add</Button>
                    <ModalAddFiador show={showModal} handleOk={handleOk} handleCancel={handleCancel} />
                    {fiadores && fiadores.map(item => (
                        <div key={item._id}>
                            <p>{item._id}</p>
                            <Button onClick={() => handleDelete('fiador', item._id)}>Delete</Button>
                        </div>
                    ))}
                </Content>
            </Layout>
        </Layout>
    );
}
