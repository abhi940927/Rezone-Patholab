import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { StaffPortal } from './components/StaffPortal.tsx';
import './index.css';

// /doctor and /staff are separate portals (hash form #/doctor, #/staff also works)
const path = window.location.pathname + window.location.hash.replace('#', '');
const portal = /\/doctor/.test(path) ? 'doctor' : /\/staff/.test(path) ? 'collector' : null;

createRoot(document.getElementById('root')!).render(portal ? <StaffPortal role={portal} /> : <App />);
