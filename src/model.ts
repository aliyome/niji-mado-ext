import { Tabs } from 'webextension-polyfill-ts';

const GROUPS = [
  'nijisanjip',
  'nijisanjiid',
  'nijisanjiin',
  'nijisanjikr',

  'hololive',
  'yumenographia',
  'slee',
  'other',
] as const;

export type GroupKind = typeof GROUPS[number];

export interface Live {
  author: string;
  channel: string;
  videoId: string;
  title: string;
  background: string;
  avatar: string;
  selected: boolean;
  type: 'live' | 'upcoming';
  groups: GroupKind[];
  publishedAt: Date;
  viewer: number | null;
  isPremiere: boolean;
}

export interface Message {
  lives: Live[];
  connectionCount: number;
  tabId?: number;
}

export type MessageType = 'store' | 'get';
