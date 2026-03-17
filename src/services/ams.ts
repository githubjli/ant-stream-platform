export type VideoType = 'live' | 'vod';

export interface StreamItem {
  id: string;
  title: string;
  channel: 'art' | 'education';
  type: VideoType;
  poster?: string;
  playUrl: string;
  views?: number;
}

const AMS_BASE_URL = process.env.UMI_APP_AMS_BASE_URL || 'http://localhost:5080';

export async function fetchAmsStreams(): Promise<StreamItem[]> {
  try {
    const response = await fetch(`${AMS_BASE_URL}/LiveApp/rest/v2/broadcasts/list/0/200`);
    if (!response.ok) {
      throw new Error('AMS broadcasts API request failed');
    }

    const data = (await response.json()) as Array<{ streamId: string; name?: string; status?: string }>;

    return data.map((item, idx) => ({
      id: item.streamId,
      title: item.name || `Live #${idx + 1}`,
      channel: idx % 2 === 0 ? 'art' : 'education',
      type: 'live',
      playUrl: `${AMS_BASE_URL}/LiveApp/streams/${item.streamId}.m3u8`,
    }));
  } catch {
    return [
      {
        id: 'sample-live',
        title: '艺术频道直播示例',
        channel: 'art',
        type: 'live',
        playUrl: `${AMS_BASE_URL}/LiveApp/streams/sample-live.m3u8`,
      },
      {
        id: 'sample-vod',
        title: '教育录播示例（本地 MP4）',
        channel: 'education',
        type: 'vod',
        playUrl: `${AMS_BASE_URL}/LiveApp/streams/sample.mp4`,
      },
    ];
  }
}
