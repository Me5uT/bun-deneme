import { Button, Card, Row, Space } from 'antd';
import React from 'react';
import { ThreeDotDropdown } from './ThreeDotDropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Typography } from 'antd';

const { Paragraph } = Typography;
interface ISSPDashboardItemProps {
  isEditable?: boolean;
  key: string;
  label: string;
  link: string;
  imgSrc: string;
}

export const SSPDashboardItem: React.FC<ISSPDashboardItemProps> = ({ imgSrc, key, label, link }) => {
  const [editable, setEditable] = React.useState<boolean>(false);
  const [value, setValue] = React.useState<string>(label);
  return (
    <Card className="ssp-dashboard-item-container" title="" style={{ maxWidth: '150px' }} hoverable bordered key={key}>
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}
      >
        <ThreeDotDropdown icon={<FontAwesomeIcon icon={'ellipsis'} />}>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditable(true);
            }}
          >
            {'Edit'}
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />}>
            {'Delete'}
          </Button>
        </ThreeDotDropdown>
      </div>
      <div style={{ width: '100%', height: '100%', justifyContent: 'center' }}>
        <img
          width={130}
          height={100}
          src={imgSrc}
          onClick={() => {
            window.open(link, '_blank');
          }}
        />
        <Paragraph
          editable={{
            triggerType: ['icon'],
            icon: <></>,
            editing: editable,
            onCancel() {
              setValue(label);
              setEditable(false);
            },
            onEnd() {
              setEditable(false);
            },
            onChange(v) {
              setValue(v);
            },
          }}
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'center',
            paddingTop: '10px',
            marginLeft: 'auto',
            fontWeight: 'bold',
            color: '#6d6b77',
          }}
        >
          {value}
        </Paragraph>
      </div>
    </Card>
  );
};
