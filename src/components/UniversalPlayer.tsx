import Hls from 'hls.js';
import { Alert, Empty, Spin } from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';

export interface UniversalPlayerProps {
  src?: string;
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
}

const isHlsSource = (src: string) => src.includes('.m3u8');

const UniversalPlayer: React.FC<UniversalPlayerProps> = ({
  src,
  poster,
  autoPlay = false,
  muted = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const shouldUseHls = useMemo(() => (src ? isHlsSource(src) : false), [src]);

  useEffect(() => {
    setLoading(true);
    setError('');

    if (!src || !videoRef.current) {
      setLoading(false);
      return;
    }

    const video = videoRef.current;
    let hls: Hls | undefined;

    const markReady = () => setLoading(false);
    const markError = () => {
      setError('视频加载失败，请检查 AMS 地址或流状态。');
      setLoading(false);
    };

    video.addEventListener('loadeddata', markReady);
    video.addEventListener('error', markError);

    if (shouldUseHls) {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
      } else if (Hls.isSupported()) {
        hls = new Hls({ enableWorker: true });
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) {
            markError();
          }
        });
      } else {
        markError();
      }
    } else {
      video.src = src;
    }

    return () => {
      video.removeEventListener('loadeddata', markReady);
      video.removeEventListener('error', markError);
      if (hls) {
        hls.destroy();
      }
    };
  }, [shouldUseHls, src]);

  if (!src) {
    return <Empty description="请选择视频后播放" />;
  }

  return (
    <div>
      {error && <Alert style={{ marginBottom: 12 }} type="error" showIcon message={error} />}
      {loading && <Spin style={{ marginBottom: 12 }} />}
      <video
        ref={videoRef}
        poster={poster}
        controls
        style={{ width: '100%', borderRadius: 12, backgroundColor: '#000' }}
        autoPlay={autoPlay}
        muted={muted}
      />
    </div>
  );
};

export default UniversalPlayer;
