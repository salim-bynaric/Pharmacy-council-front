import React from 'react';
import { Route } from 'react-router-dom';
import OuterCartPage from './OuterCartPage';

const OuterContent = () => {
    return (
        <div>
            <Route exact path="/outercart" component={OuterCartPage}/>
        </div>
    );
};

export default OuterContent;