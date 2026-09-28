/* global __ASSET_BASE__ */
// Base comes from vite.config.mjs so server markup and client bundle agree on asset paths.
export const assetUrl = filename => `${__ASSET_BASE__}assets/${filename}`;
