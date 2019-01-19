import React from 'react';
import SearchComponent from "./components/SearchComponents/SearchComponent";


//const eventAccessCode = '123456';
//const eventAccessCode = '071404';
//const eventAccessCode = '164111';
//const eventAccessCode = '736303';

/*global drupalSettings:true*/
/*eslint no-undef: "error"*/
const eventAccessCode = drupalSettings.eventAccessCode;

const App = () => {
    //console.log("Event code is " + eventAccessCode);

    return (
        <SearchComponent eventAccessCode={eventAccessCode} />
    );
};

export default App;