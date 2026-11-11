import React from 'react';
import {createRoot,hydrateRoot} from 'react-dom/client';
import {App} from './components/site.jsx';
import './styles/style.css';
import './styles/refresh.css';
const root=document.getElementById('root');
const path=window.location.pathname.replace(/\/$/,'')||'/';
if(root.children.length)hydrateRoot(root,<App path={path}/>);else createRoot(root).render(<App path={path}/>);
