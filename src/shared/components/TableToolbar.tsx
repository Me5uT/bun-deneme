import { Button, Col, Row, Space } from 'antd';
import { AdvancedSearch } from 'app/shared/components/AdvancedSearch';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { AdminProfileInt } from 'app/shared/model/AdminModel';
import React from 'react';

interface ITableToolbarProps {
  setModalOpenClose?: (v: boolean) => void;
  setSearchData: (v: any) => void;
  addButtonText?: string;
  actionButtons?: React.ReactNode;
}

export const TableToolbar: React.FC<ITableToolbarProps> = ({ setModalOpenClose, setSearchData, addButtonText, actionButtons }) => {
  const [listFiltered, setListFiltered] = React.useState<boolean>(false);

  const searchTimeout = React.useRef(null);
  const [baseObj] = useMirketPortal();

  const onMainSearch = React.useCallback((text: string) => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current); // Mevcut zamanlayıcıyı iptal et
    }

    searchTimeout.current = setTimeout(() => {
      setSearchData(prev => ({ ...prev, searchtext: text }));

      // herhangi bir arama yapılıp yapılmadığının kontrolü
      if (text) setListFiltered(true);
      else setListFiltered(false);
    }, 700); // 1 saniye (1000 ms) gecikme
  }, []);

  return (
    <div className="toolbar-container">
      <Row gutter={16} justify={'space-between'} style={{ flexWrap: 'wrap-reverse', padding: '15px 20px', alignItems: 'center' }}>
        <Col xs={12} sm={12} md={12} lg={12}>
          <Space direction="horizontal">
            <AdvancedSearch onMainSearch={onMainSearch} />
            {listFiltered && <div style={{ fontSize: '12px', marginTop: -5, color: '#f5a864' }}>{'* List has been filtered.'}</div>}
          </Space>
        </Col>

        <Col xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {actionButtons ? actionButtons : null}

          {baseObj?.adminProfile !== AdminProfileInt.ReadOnly && addButtonText && (
            <Button className="btn-add-admin" type="primary" onClick={() => setModalOpenClose(true)} style={{ marginLeft: '10px' }}>
              {addButtonText}
            </Button>
          )}
        </Col>
      </Row>
    </div>
  );
};
