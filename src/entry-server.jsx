// Build-time rendering: the published HTML carries the page text for search engines and AI crawlers.
import React from 'react';
import { renderToString } from 'react-dom/server';
import { App, products } from './App.jsx';
import { caseStudies } from './CaseStudies.jsx';
import { buildVersionTwoCases } from './case-studies-v2.js';
import { formats, questions } from './ExpansionSections.jsx';

export function render(heroVariant = 'cards') {
  return renderToString(<React.StrictMode><App heroVariant={heroVariant} /></React.StrictMode>);
}

export const seoData = {
  products: products.map(({ name, description }) => ({ name, description })),
  formats: formats.map(({ name, for: audience }) => ({ name, for: audience })),
  pricedOffers: buildVersionTwoCases(caseStudies)
    .filter(item => item.caseLabel === 'Предложение агентства' && item.pricing)
    .map(item => ({ name: `${item.title} (${item.scale})`, description: item.summary, price: item.pricing.amount })),
  questions: questions.map(([question, answer]) => [question, answer]),
};
