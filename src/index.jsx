import "@babel/polyfill";

import React from 'react';
import ReactDOM from 'react-dom';

const App = () => "Rendered!";

ReactDOM.render(<App/>, document.getElementById('app'));
