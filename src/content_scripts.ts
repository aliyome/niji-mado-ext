import {
  browser as chrome,
  Cookies,
  Runtime,
  browser,
} from 'webextension-polyfill-ts';
import { MessageType } from './model';

storeLivesToBackgroundCache();
enableCheat();

// make it possible to play multiple videos simultaneously
function enableCheat() {
  const pause = window.localStorage.getItem('rulePauseOther');
  if (pause === '1') {
    window.localStorage.setItem('rulePauseOther', '0');
  }
}

// store current lives and connection count to the background cache
function storeLivesToBackgroundCache() {
  window.addEventListener('nijimado-lives', (ev) => {
    chrome.runtime.sendMessage({
      type: 'store',
      // @ts-ignore
      message: { lives: ev.detail },
    });
  });
}
