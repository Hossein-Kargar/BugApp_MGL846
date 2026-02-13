import React, { useEffect, useState, useCallback } from 'react';
import { Table, Button, Input, Select, Space, Card, Popconfirm, message, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import { ticketService } from '../services';

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const navigate = useNavigate();
  const { current: pageNum, pageSize } = pagination;

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        offset: (pageNum - 1) * pageSize,
        limit: pageSize,
      };
      if (searchText) params.search = searchText;
      if (filterStatus) params.status = filterStatus;

      const response = await ticketService.getTickets(params);
      const data = response.data.results || response.data;
      setTickets(data);
      setPagination((prev) => ({
        ...prev,
        total: response.data.count || data.length,
      }));
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setLoading(false);
    }
  }, [pageNum, pageSize, searchText, filterStatus]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleDelete = async (id) => {
    try {
      await ticketService.deleteTicket(id);
      message.success('Ticket deleted');
      fetchTickets();
    } catch (error) {
      message.error('Failed to delete ticket');
    }
  };

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Assigned To', dataIndex: 'assigned_to', key: 'assigned_to', render: (assigned_to) => assigned_to ? (assigned_to.username || assigned_to.email || assigned_to.id) : 'Unassigned' },
    { title: 'Created By', dataIndex: ['creator', 'username'], key: 'creator', render: (username, record) => record.creator ? (record.creator.username || record.creator.email || record.creator.id) : 'Unknown' },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status', 
      render: (status) => {
        let color = 'default';
        if (status === 'open') color = 'blue';
        else if (status === 'in_progress') color = 'orange';
        else if (status === 'fixed') color = 'green';
        else if (status === 'closed') color = 'red';
        else if (status === 'reopened') color = 'purple';
        // Format: in_progress -> In Progress
        const formatted = status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        return (
          <Tag color={color}>
            {formatted}
          </Tag>
        );
      }
    },
    { title: 'Priority', dataIndex: 'priority', key: 'priority', render: (priority) => priority.charAt(0).toUpperCase() + priority.slice(1) },
    { title: 'Severity', dataIndex: 'severity', key: 'severity', render: (severity) => severity.charAt(0).toUpperCase() + severity.slice(1) },
    { title: 'Due Date', dataIndex: 'due_date', key: 'due_date', render: (due_date) => due_date ? due_date : 'No due date' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => navigate(`/tickets/${record.id}`)}>
            View
          </Button>
          {record.creator && currentUser && record.creator.id === currentUser.id && (
            <Popconfirm
              title="Are you sure to delete this ticket?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" danger>Delete</Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <h1>Tickets</h1>
      <Card style={{ marginBottom: '24px' }}>
        <Space style={{ marginBottom: '16px', width: '100%', display: 'flex' }}>
          <Input
            placeholder="Search tickets..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ flex: 1 }}
          />
          <Select
            placeholder="Filter by status"
            value={filterStatus}
            onChange={setFilterStatus}
            allowClear
            style={{ width: '150px' }}
          >
            <Select.Option value="open">Open</Select.Option>
            <Select.Option value="in_progress">In Progress</Select.Option>
            <Select.Option value="fixed">Fixed</Select.Option>
            <Select.Option value="closed">Closed</Select.Option>
            <Select.Option value="reopened">Reopened</Select.Option>
          </Select>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/tickets/create')}
          >
            New Ticket
          </Button>
        </Space>
      </Card>
      <Table
        columns={columns}
        dataSource={tickets}
        loading={loading}
        pagination={pagination}
        onChange={(newPagination) => setPagination(newPagination)}
        rowKey="id"
      />
    </div>
  );
};

export default TicketList;
