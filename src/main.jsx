import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { App } from "./App.jsx";
import "./styles.css";
import "./typography.css";
import "./founder.css";
import "./hero-process.css";
import "./hero-versions.css";

const root = document.getElementById("root");
const selectedHero = root.dataset.heroVariant;
const heroVariant = ['flow', 'orbit'].includes(selectedHero) ? selectedHero : 'cards';
const app = <React.StrictMode><App heroVariant={heroVariant} /></React.StrictMode>;

// Published pages arrive with prerendered markup; the dev server serves an empty root.
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);
