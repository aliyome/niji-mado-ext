import {
  browser as chrome,
  Cookies,
  Runtime,
  Tabs,
} from 'webextension-polyfill-ts';
import type { Message, MessageType } from './model';

const cache: { [tabId: number]: Message | null } = {};

const onMessage = async (
  message: { type: MessageType; message?: Message },
  sender: Runtime.MessageSender,
  sendResponse: any,
) => {
  if (message.type === 'store') {
    cache[sender.tab?.id!] = message.message!;
    return;
  } else if (message.type === 'get') {
    return cache[message.message?.tabId!];
  }
  return;
};

chrome.runtime.onMessage.addListener(onMessage as any);
