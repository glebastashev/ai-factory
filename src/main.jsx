import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import "./styles.css";
import "./typography.css";
import "./founder.css";
import "./hero-process.css";
import "./hero-versions.css";

const selectedHero = document.getElementById("root").dataset.heroVariant;
const heroVariant = ['flow', 'orbit'].includes(selectedHero) ? selectedHero : 'cards';

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App heroVariant={heroVariant} />
  </React.StrictMode>,
);
