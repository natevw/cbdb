export * from 'https://unpkg.com/preact@latest?module';
export * from 'https://unpkg.com/preact@latest/hooks/dist/hooks.module.js?module';

import {h} from 'https://unpkg.com/preact@latest?module';
import htm from "https://unpkg.com/htm@latest/dist/htm.module.js?module";
export const html = htm.bind(h);
