import { config } from 'dotenv';

global.ResizeObserver = require('resize-observer-polyfill');

config();
window.matchMedia = jest.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
}));

document.body.innerHTML = '<div id="root"><div id="mAndP"></div><div id="play-buttons">'
  + '</div><div id="share-buttons"></div></div>';
window.HTMLMediaElement.prototype.load = () => { /* do nothing */ };
window.HTMLMediaElement.prototype.play = () => Promise.resolve();
window.HTMLMediaElement.prototype.pause = () => { /* do nothing */ };
Object.defineProperty(window, 'location', { value: { reload: jest.fn(), assign: jest.fn(), href: '/' }, writable: true });
