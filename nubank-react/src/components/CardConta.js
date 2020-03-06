
import React from 'react';
import { Card, Row, Badge } from 'antd';

export default function CardConta(props) {
    const { item } = props;

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
        </Card>
    );
}
