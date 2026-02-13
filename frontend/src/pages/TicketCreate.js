import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Select, Card, message, DatePicker } from 'antd';
import { ticketService, userService } from '../services';

const { Option } = Select;

const TicketCreate = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await userService.getUsers();
        // Si la réponse est un objet avec results, prendre results, sinon prendre data ou []
        let userList = Array.isArray(res.data) ? res.data : (res.data.results || []);
        setUsers(userList);
      } catch (e) {
        setUsers([]);
      }
    };
    fetchUsers();
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = { ...values };
      if (payload.due_date && payload.due_date.format) {
        payload.due_date = payload.due_date.format('YYYY-MM-DD');
      }
      await ticketService.createTicket(payload);
      message.success('Ticket created successfully');
      navigate('/tickets');
    } catch (error) {
      message.error('Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Create New Ticket" style={{ maxWidth: 600, margin: '0 auto' }}>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please enter a title' }]}> 
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please enter a description' }]}> 
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item name="assigned_to" label="Assign to">
          <Select placeholder="Select a user" allowClear showSearch optionFilterProp="children">
            {(Array.isArray(users) ? users : []).map((user) => (
              <Option key={user.id} value={user.id}>
                {user.username} {user.first_name || ''} {user.last_name || ''}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="priority" label="Priority" rules={[{ required: true, message: 'Please select a priority' }]}> 
          <Select placeholder="Select priority">
            <Option value="low">Low</Option>
            <Option value="medium">Medium</Option>
            <Option value="high">High</Option>
            <Option value="critical">Critical</Option>
          </Select>
        </Form.Item>
        <Form.Item name="severity" label="Severity" rules={[{ required: true, message: 'Please select a severity' }]}> 
          <Select placeholder="Select severity">
            <Option value="low">Low</Option>
            <Option value="medium">Medium</Option>
            <Option value="high">High</Option>
            <Option value="critical">Critical</Option>
          </Select>
        </Form.Item>
        <Form.Item name="due_date" label="Due Date">
          <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Create Ticket
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default TicketCreate;
