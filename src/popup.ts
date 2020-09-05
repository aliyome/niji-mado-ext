import {
  browser as chrome,
  Cookies,
  Runtime,
  Tabs,
} from 'webextension-polyfill-ts';
import { Message, Live } from './model';
import dayjs from 'dayjs';

import { orderBy } from 'lodash-es';

import './popup.scss';

const appElm = document.getElementById('app')!;

const emptyElm: HTMLTemplateElement = document.getElementById(
  'empty',
) as HTMLTemplateElement;

const liveRowElm: HTMLTemplateElement = document.getElementById(
  'live-row',
) as HTMLTemplateElement;

const getThumbUrl = (videoId: string) =>
  `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;

const getElapsedTime = (value: Date | null): string | null => {
  if (!value) {
    return null;
  }
  const diffSecs = Math.floor((Date.now() - new Date(value).getTime()) / 1000);
  const hours = Math.floor(diffSecs / 3600);
  const mins = Math.floor((diffSecs / 60) % 60);
  // const secs = diffSecs % 60;
  let result = '';
  result += hours ? `${hours}時間` : '';
  result += mins ? `${mins}分` : '';
  return result + '経過';
};

const createLiveRow = (live: Live) => {
  const viewer = live.viewer ? live.viewer.toLocaleString() : '-';
  const date = dayjs(live.publishedAt).format('MM/DD HH:mm開始');
  console.log(live.publishedAt);
  const elapsed = getElapsedTime(live.publishedAt);
  const dateStr = elapsed ? `${date}（${elapsed}）` : date;
  const thumbUrl = getThumbUrl(live.videoId);
  const row = document.importNode(liveRowElm.content, true);

  (row.querySelector('img.live-avatar') as HTMLImageElement).src = live.avatar;
  row.querySelector('.title')!.innerHTML = live.title;
  row.querySelector('.count')!.innerHTML = viewer;
  row.querySelector('.date')!.innerHTML = dateStr;
  (row.querySelector('.live-thumb') as HTMLImageElement).src = thumbUrl;
  return row;
};

const addLiveRow = (live: Live) => {
  appElm.appendChild(createLiveRow(live));
};

const addEmptyRow = () => {
  const row = document.importNode(emptyElm.content, true);
  appElm.appendChild(row);
};

const main = async () => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const message: Message = await chrome.runtime.sendMessage({
    type: 'get',
    message: { tabId: tabs[0].id! },
  });

  if (!message || message.lives.length === 0) {
    addEmptyRow();
    return;
  }

  for (const live of orderBy(
    message.lives,
    ['type', 'viewer'],
    ['asc', 'desc'],
  )) {
    addLiveRow(live);
  }
};

main().catch(console.error);
