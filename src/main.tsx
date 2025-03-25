
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { motion } from 'framer-motion'

const root = createRoot(document.getElementById("root")!);

root.render(
  <>
    <div className="animated-bg" />
    <App />
  </>
);
