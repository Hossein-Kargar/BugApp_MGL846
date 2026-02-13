import React, { useEffect, useState } from 'react';
import { Card, Statistic, Row, Col } from 'antd';
import { BugOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { ticketService } from '../services';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    in_progress: 0,
    fixed: 0,
    closed: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await ticketService.getTickets({ limit: 1000 });
        const tickets = response.data.results || response.data;
        
        const newStats = {
          total: tickets.length,
          open: tickets.filter(t => t.status === 'open').length,
          in_progress: tickets.filter(t => t.status === 'in_progress').length,
          fixed: tickets.filter(t => t.status === 'fixed').length,
          closed: tickets.filter(t => t.status === 'closed').length,
        };
        setStats(newStats);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      <h1>Dashboard</h1>
      <Row gutter={16}>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Total Tickets"
              value={stats.total}
              prefix={<BugOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Open"
              value={stats.open}
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<BugOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="In Progress"
              value={stats.in_progress}
              valueStyle={{ color: '#faad14' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Fixed"
              value={stats.fixed}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
