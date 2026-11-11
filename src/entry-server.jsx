import React from 'react';
import {renderToString} from 'react-dom/server';
import {App,meta} from './components/site.jsx';
export {meta};
export function render(path){return renderToString(<App path={path}/>)}
