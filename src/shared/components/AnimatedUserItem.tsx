import { animated, config, useSpring } from '@react-spring/web';
import { Avatar, Card, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React from 'react';

const { Text } = Typography;
interface IAnimatedUserItemProps {
  items: { username: string; count: number }[];
}
const getColorByCount = (c: number) => {
  switch (true) {
    case c > 50:
      return '#f56a00';
    case c < 50 && c > 20:
      return '#7265e6';

    default:
      return '#00a2ae';
  }
};
export const AnimatedUserItem: React.FC<IAnimatedUserItemProps> = ({ items = [] }) => {
  const springs = items.map((item, index) =>
    useSpring({
      from: { opacity: 0, filter: 'blur(10px)' },
      to: { opacity: 1, filter: 'blur(0px)' },
      delay: index * 300,
      config: config.gentle,
    })
  );

  return (
    <Card className="animated-user-item" style={{ padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      {springs.map((style, index) => (
        <animated.div key={index} style={{ ...style, display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          {/* <Avatar size="large" style={{ marginRight: '10px', backgroundColor: getColorByCount(items[index].count) }}>
            {items[index].username[0].toUpperCase()}
          </Avatar>
          <div>
            <Text strong>{items[index].username}</Text>
            <Text type="secondary" style={{ marginLeft: '10px' }}>
              ({items[index].count})
            </Text>
          </div> */}
        </animated.div>
      ))}
    </Card>
  );
};
