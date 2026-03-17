import { PageContainer, ProList } from '@ant-design/pro-components';
import { Modal, Tag, Typography } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'umi';
import UniversalPlayer from '@/components/UniversalPlayer';
import { fetchAmsStreams, StreamItem } from '@/services/ams';

const { Text } = Typography;

const DiscoverPage: React.FC = () => {
  const { pathname } = useLocation();
  const [loading, setLoading] = useState(true);
  const [streams, setStreams] = useState<StreamItem[]>([]);
  const [active, setActive] = useState<StreamItem>();

  useEffect(() => {
    let mounted = true;
    fetchAmsStreams().then((res) => {
      if (mounted) {
        setStreams(res);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const channel = useMemo<'art' | 'education'>(() => {
    if (pathname.includes('/education')) {
      return 'education';
    }
    return 'art';
  }, [pathname]);

  const list = useMemo(() => streams.filter((item) => item.channel === channel), [channel, streams]);

  return (
    <PageContainer title={channel === 'art' ? '艺术频道' : '教育频道'}>
      <ProList<StreamItem>
        rowKey="id"
        loading={loading}
        dataSource={list}
        grid={{ gutter: 16, column: 3 }}
        showActions="hover"
        metas={{
          title: { dataIndex: 'title' },
          description: {
            render: (_, entity) => (
              <>
                <Tag color={entity.type === 'live' ? 'red' : 'blue'}>
                  {entity.type === 'live' ? 'LIVE' : 'VOD'}
                </Tag>
                <Text type="secondary">{entity.playUrl}</Text>
              </>
            ),
          },
          content: {
            render: (_, entity) => (
              <div
                style={{
                  height: 170,
                  borderRadius: 12,
                  background: '#f5f5f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text strong>{entity.title}</Text>
              </div>
            ),
          },
        }}
        onItem={(record) => ({
          onClick: () => setActive(record),
        })}
      />

      <Modal
        title={active?.title}
        open={Boolean(active)}
        width={900}
        destroyOnClose
        onCancel={() => setActive(undefined)}
        footer={null}
      >
        <UniversalPlayer src={active?.playUrl} autoPlay />
      </Modal>
    </PageContainer>
  );
};

export default DiscoverPage;
