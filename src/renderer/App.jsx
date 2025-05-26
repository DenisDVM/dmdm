import React, { useEffect, useState } from 'react';
import { Card, Table, Typography, Tag, Layout, Image, ConfigProvider } from 'antd';
import logo from '../assets/logo.png';

const { Title } = Typography;
const { Content, Header } = Layout;
const getDiscount = (totalSales) => {
  if (totalSales >= 300000) return 15;
  if (totalSales >= 50000) return 10;
  if (totalSales >= 10000) return 5;
  return 0;
};


function App() {
  const [partners, setPartners] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [partnersData, salesData] = await Promise.all([
        window.api.getPartners(),
        window.api.getPartnerSales(),
      ]);

      console.log("salesData",salesData);
      console.log("partnersData",partnersData);

      const salesByPartner = salesData.reduce((acc, sale) => {
        acc[sale.partner_id] = (acc[sale.partner_id] || 0) + sale.revenue;
        return acc;
      }, {});

      const enrichedPartners = partnersData.map((partner) => ({
        ...partner,
        totalSales: salesByPartner[partner.id] || 0,
        discount: getDiscount(salesByPartner[partner.id] || 0),
      }));

      setPartners(enrichedPartners);
      setSales(salesData);
      setLoading(false);
    };

    fetchData();
  }, []);

  const columns = [
    { title: 'Компания', dataIndex: 'company_name', key: 'company_name' },
    { title: 'Тип', dataIndex: 'type', key: 'type' },
    { title: 'ИНН', dataIndex: 'inn', key: 'inn' },
    { title: 'Директор', dataIndex: 'director_fullname', key: 'director_fullname' },
    { title: 'Телефон', dataIndex: 'phone', key: 'phone', render: (value) => <Tag >{`+7 ${value}`}</Tag>, },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Рейтинг',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => <Tag color={rating >= 4 ? '#67BA80' : 'red'}>{rating}</Tag>,
    },
    {
      title: 'Продажи (₽)',
      dataIndex: 'totalSales',
      key: 'totalSales',
    },
    {
      title: 'Скидка (%)',
      dataIndex: 'discount',
      key: 'discount',
      render: (value) => <Tag color="#67BA80">{value}%</Tag>,
    },
  ];

  return (
    <ConfigProvider
  theme={{
    token: {
      fontFamily: 'Segoe UI',
    },
  }}
>
    <Layout style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <Header style={{ background: '#F4E8D3', display: 'flex', alignItems: 'center', paddingBottom: 16, gap: 16 }}>
        <Image src={logo} preview={false} height={40} width={40} style={{ marginRight: 16 }} />
        <h1 level={3} style={{ margin: 0, color: '#000', fontFamily: 'Segoe UI' }}>
          Модуль учёта партнёров
        </h1>
      </Header>
      <Content style={{ padding: 24 }}>
        <Card bordered style={{ fontFamily: 'Segoe UI' }}>
          <Table
            dataSource={partners}
            columns={columns}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </Card>
      </Content>
    </Layout>
    </ConfigProvider>
  );
}

export default App;