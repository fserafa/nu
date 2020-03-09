import React, { useEffect, useState } from 'react';
import { Layout, Menu, Spin, Select, Button } from 'antd';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import DraggableCardConta from '../components/DraggableCardConta';
import api from '../services/api';

const { Option } = Select;
const { Header, Content, Sider } = Layout;

export default function Fatura(props) {
    const [fatura, setFatura] = useState('');
    const [loading, setLoading] = useState(true);
    const [fiadores, setFiadores] = useState([]);
    const [selectedFiadores, setSelectedFiadores] = useState([]);

    useEffect(() => {
        (async () => {
            const id = props.location.state.id;

            const fatura = await api.get(`/fatura/${id}`);
            const fiadores = await api.get(`/fiadores`);

            console.log(fatura)

            setFiadores(fiadores.data)
            setFatura(fatura.data);
            setLoading(false);
        })();
    }, [props.location.state.id])

    function calc(contas = []) {
        if (contas.length === 0) return 0;
        let values = [];

        contas.map(f => values = [...values, f.value])

        return (values.reduce((a, b) => a + b) / 100);
    }

    function handleChangeFiador(value, option) {
        let selected = [];
        let _fatura = { ...fatura }

        value.map(v => {
            selected = [...selected, fiadores.filter(fiador => fiador._id === v)[0]]
        })

        _fatura.fiadores = selected;

        console.log(_fatura)

        setFatura(_fatura)
    }

    function handleChangeDividir(value, item) {
        let selected = [];
        let _fatura = { ...fatura }
        let index = fatura.contas.indexOf(item)

        value.map(v => {
            selected = [...selected, fiadores.filter(fiador => fiador._id === v)[0]]
        })

        item.dividir = selected;

        _fatura.contas.splice(index, 1, item);

        if (item.fiador === 'Dividir') {
            dividir(item);
        }

        setFatura(_fatura);
    }

    async function handleSave() {
        setLoading(true);

        await api.put(`/fatura/${fatura._id}`, fatura);

        setLoading(false);
    }

    function dividir(conta) {
        let _fatura = { ...fatura }
        let newConta;
        let newContas = [];

        conta.dividir && conta.dividir.map(d => {
            newConta = { ...conta }
            newConta.value = conta.value / conta.dividir.length;
            newConta.fiador = d.name;
            newContas = [...newContas, newConta]
        })

        _fatura.contas.splice(0, 0, ...newContas);

        setFatura(_fatura)
        // const [removed] = _fatura.contas.splice(source.index, 1);

        // _fatura.contas[source.index].fiador = destination.droppableId === 'droppableSider' ? '' : (
        //     fiadores.filter(fiador => (
        //         fiador._id === destination.droppableId
        //     ))[0].name
        // )
    }

    function onDragEnd(result) {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }

        console.log(source, destination)

        // let indexOf = fatura.indexOf(record)
        let _fatura = { ...fatura }


        _fatura.contas[source.index].fiador = destination.droppableId === 'droppableSider' ? '' : (
            fiadores.filter(fiador => (
                fiador._id === destination.droppableId
            ))[0].name
        )


        // _fatura.indexOf()

        console.log(_fatura.contas[source.index], source.index)
        console.log(_fatura.contas[destination.index], destination.index)
        const [removed] = _fatura.contas.splice(source.index, 1);
        console.log(removed)
        _fatura.contas.splice(destination.index, 0, removed);

        setFatura(_fatura)

        // const sourceClone = Array.from('droppableContent1')
        // const destClone = Array.from('droppableContent2')
        // const [removed] = sourceClone.splice(source.index, 1);

        // destClone.splice(destination.index, 0, removed);

        // let foo = {};
        // foo[source.droppableId] = sourceClone;
        // foo[destination.droppableId] = destClone;

        // console.log(foo)

        // if (source.droppableId === destination.droppableId) {
        //     const items = reorder(
        //         this.getList(source.droppableId),
        //         source.index,
        //         destination.index
        //     );

        //     let state = { items };

        //     if (source.droppableId === 'droppable2') {
        //         state = { selected: items };
        //     }

        //     this.setState(state);
        // } else {
        //     const result = move(
        //         this.getList(source.droppableId),
        //         this.getList(destination.droppableId),
        //         source,
        //         destination
        //     );

        //     this.setState({
        //         items: result.droppable,
        //         selected: result.droppable2
        //     });
        // }
    }

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Spin />
        </div>
    )

    return (
        <Layout>
            <DragDropContext onDragEnd={onDragEnd}>
                <Header className="header">
                    <div className="logo" />
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['2']}
                        style={{ lineHeight: '64px' }}
                    >
                        <Menu.Item key="1">nav 1</Menu.Item>
                        <Menu.Item key="2">nav 2</Menu.Item>
                        <Menu.Item key="3">nav 3</Menu.Item>
                    </Menu>
                </Header>
                <Layout>
                    <Sider>
                        <Droppable droppableId="droppableSider">
                            {provided => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}>
                                    {fatura.contas.map((item, index) => item.fiador === '' ? (
                                        <DraggableCardConta key={index.toString()} item={item} index={index} />
                                    ) : null)}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </Sider>
                    <Layout style={{ padding: '0 24px 24px' }}>
                        <Content
                            className="site-layout-background"
                            style={{
                                background: '#fff',
                                padding: 24,
                                margin: 0,
                                minHeight: 280,
                            }}>
                            <Button type="primary" onClick={handleSave}>Save</Button>
                            <p>{calc(fatura.contas)}</p>

                            <Select
                                mode="multiple"
                                style={{ width: '100%' }}
                                placeholder="Select"
                                value={fatura.fiadores.map(f => f._id)}
                                onChange={handleChangeFiador}
                            >
                                {fiadores.map(item => (
                                    <Option key={item._id}>{item.name}</Option>
                                ))}
                            </Select>
                            <div style={{ display: 'flex' }}>
                                {fatura.fiadores && fatura.fiadores.map((fiador) => (
                                    <Droppable droppableId={fiador._id} key={fiador._id}>
                                        {provided => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                style={{ marginRight: 50 }}>
                                                <p>{calc(fatura.contas.filter(f => f.fiador === fiador.name))}</p>
                                                <p>{fiador._id}</p>
                                                <p>{fiador.name}</p>
                                                <div style={{ border: '1px solid #000', minWidth: '30%', minHeight: '100vh' }}>
                                                    {fatura.contas.map((item, index) => item.fiador === fiador.name ? (
                                                        <DraggableCardConta
                                                            key={index.toString()}
                                                            item={item}
                                                            index={index}
                                                            fiadores={fatura.fiadores}
                                                            handleChangeDividir={handleChangeDividir} />
                                                    ) : null)}
                                                </div>
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                ))}
                                {/* <Droppable droppableId="droppableContent1">
                                    {provided => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}>
                                            <p>{calc(fatura.filter(f => f.fiador === 'mae'))}</p>

                                            <div style={{ border: '1px solid #000', width: 500, height: 500 }}>
                                                {fatura.map((item, index) => item.fiador === 'mae' ? (
                                                    <DraggableCardConta key={index.toString()} item={item} index={index} />
                                                ) : null)}
                                            </div>
                                            {provided.placeholder}
                                        </div>

                                    )}
                                </Droppable>
                                <Droppable droppableId="droppableContent2">
                                    {provided => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}>
                                            <p>{calc(fatura.filter(f => f.fiador === 'felipe'))}</p>

                                            <div style={{ border: '1px solid #000', width: 500, height: 500 }}>
                                                {fatura.map((item, index) => item.fiador === 'felipe' ? (
                                                    <DraggableCardConta key={index.toString()} item={item} index={index} />
                                                ) : null)}
                                            </div>
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable> */}

                            </div>
                        </Content>


                    </Layout>
                </Layout>
            </DragDropContext>

        </Layout >
    );
}

// const columns = [
//     {
//         title: 'Data',
//         dataIndex: 'date',
//         key: 'date',
//     },
//     {
//         title: 'Nome',
//         dataIndex: 'name',
//         key: 'name',
//     },
//     {
//         title: 'Valor',
//         dataIndex: 'value',
//         key: 'value',
//     },
//     {
//         title: 'De',
//         dataIndex: 'de',
//         key: 'de',
//         render: (text, record, index) => (
//             <>
//                 <Select defaultValue="" value={record.de} style={{ width: 120 }} allowClear onChange={(value) => handleSelectChange(record, index, value)}>
//                     <Option value="mae">Mãe</Option>
//                     <Option value="felipe">Felipe</Option>
//                 </Select>
//             </>
//         )
//     },
// ];

/* <Content
                        className="site-layout-background"
                        style={{
                            background: '#fff',
                            padding: 24,
                            margin: 0,
                            minHeight: 280,
                        }}>
                        {loading ? <Skeleton /> : <Table dataSource={fatura.filter(f => f.de === "")} columns={columns} />}
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <Table dataSource={_fatura.filter(f => f.de === 'mae')} columns={columns} />
                                {_fatura.map((n, index) => n.de === 'mae' ? <p>{JSON.stringify(n)}</p> : null)}
                                <p>{calc(_fatura.filter(f => f.de === 'mae'))}</p>
                            </div>
                            <div>
                                <Table dataSource={_fatura.filter(f => f.de === 'felipe')} columns={columns} />
                                {_fatura.map((n, index) => n.de === 'felipe' ? <p>{JSON.stringify(n)}</p> : null)}
                                <p>{calc(_fatura.filter(f => f.de === 'felipe'))}</p>
                            </div>
                        </div>

                        <Button onClick={teste}>Teste</Button>
                    </Content> */
