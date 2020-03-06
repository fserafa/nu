import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Index from './pages/Index'
import Fatura from './pages/Fatura';

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Index} />
                <Route path="/fatura" component={Fatura} />
            </Switch>
        </BrowserRouter>
    );

}
