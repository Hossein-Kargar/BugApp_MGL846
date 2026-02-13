import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Button, Form, Input, Select, message, Space, DatePicker, Modal, Tag } from 'antd';
import dayjs from 'dayjs';
import { useParams, useNavigate } from 'react-router-dom';
import { ticketService } from '../services';
import { userService } from '../services';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [statusLoading, setStatusLoading] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchTicket();
    const fetchUsers = async () => {
      try {
        const res = await userService.getUsers();
        let userList = Array.isArray(res.data) ? res.data : (res.data.results || []);
        setUsers(userList);
      } catch (e) {
        setUsers([]);
      }
    };
    fetchUsers();
  }, [id]);

  const fetchTicket = async () => {
    try {
      const response = await ticketService.getTicket(id);
      setTicket(response.data);
      form.setFieldsValue({
        title: response.data.title,
        description: response.data.description,
        status: response.data.status,
        priority: response.data.priority,
        severity: response.data.severity,
        assigned_to: response.data.assigned_to?.id,
        due_date: response.data.due_date ? dayjs(response.data.due_date) : undefined,
      });
    } catch (error) {
      message.error('Failed to load ticket');
    } finally {
      setLoading(false);
    }
  };

  // Ensure form fields are set when editing is enabled
  useEffect(() => {
    if (editing && ticket) {
      form.setFieldsValue({
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
        severity: ticket.severity,
        assigned_to: ticket.assigned_to?.id,
        due_date: ticket.due_date ? dayjs(ticket.due_date) : undefined,
      });
    }
    // eslint-disable-next-line
  }, [editing, ticket]);

  const handleStatusChange = async (newStatus) => {
    if (isAssigned || isCreator) {
      Modal.confirm({
        title: 'Confirm Status Change',
        content: 'Are you sure you want to change the status of this ticket?',
        okText: 'Yes',
        cancelText: 'No',
        onOk: async () => {
          setStatusLoading(true);
          try {
            await ticketService.updateTicketStatus(id, newStatus);
            message.success('Status updated successfully');
            fetchTicket();
          } catch (error) {
            message.error('Failed to update status');
          } finally {
            setStatusLoading(false);
          }
        },
      });
    } else {
      setStatusLoading(true);
      try {
        await ticketService.updateTicketStatus(id, newStatus);
        message.success('Status updated successfully');
        fetchTicket();
      } catch (error) {
        message.error('Failed to update status');
      } finally {
        setStatusLoading(false);
      }
    }
  };

  const onFinish = async (values) => {
    try {
      const payload = { ...values };
      if (payload.due_date && payload.due_date.format) {
        payload.due_date = payload.due_date.format('YYYY-MM-DD');
      }
      await ticketService.updateTicket(id, payload);
      message.success('Ticket updated successfully');
      setEditing(false);
      fetchTicket();
    } catch (error) {
      message.error('Failed to update ticket');
    }
  };

  const isCreator = ticket && currentUser && ticket.creator && ticket.creator.id === currentUser.id;
  const isAssigned = ticket && currentUser && ticket.assigned_to && ticket.assigned_to.id === currentUser.id;

  if (loading) return <Card loading />;
  if (!ticket) return <Card>Ticket not found</Card>;

  return (
    <div style={{ padding: '24px' }}>
      <Button onClick={() => navigate('/tickets')}>Back to Tickets</Button>
      <Card title={`Ticket #${ticket.id}`} style={{ marginTop: '16px' }}>
        <Descriptions column={1} bordered size="middle" style={{ maxWidth: 500, margin: '0 auto' }}>
          <Descriptions.Item label="Title">{ticket.title}</Descriptions.Item>
          <Descriptions.Item label="Description">{ticket.description}</Descriptions.Item>
          <Descriptions.Item label="Assigned To">{ticket.assigned_to ? (ticket.assigned_to.username || ticket.assigned_to.email || ticket.assigned_to.id) : 'Unassigned'}</Descriptions.Item>
          <Descriptions.Item label="Created By">{ticket.creator?.username}</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={
              ticket.status === 'open' ? 'blue' :
              ticket.status === 'in_progress' ? 'orange' :
              ticket.status === 'fixed' ? 'green' :
              ticket.status === 'closed' ? 'red' :
              ticket.status === 'reopened' ? 'purple' : 'default'
            }>
              {ticket.status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Priority">{ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}</Descriptions.Item>
          <Descriptions.Item label="Severity">{ticket.severity.charAt(0).toUpperCase() + ticket.severity.slice(1)}</Descriptions.Item>
          <Descriptions.Item label="Due Date">{ticket.due_date || 'No due date'}</Descriptions.Item>
          <Descriptions.Item label="Created At">{new Date(ticket.created_at).toLocaleDateString()}</Descriptions.Item>
        </Descriptions>

        <h3 style={{ marginTop: '24px' }}>Description</h3>
        <p>{ticket.description}</p>

        <Space style={{ marginTop: '24px' }}>
          <Select
            defaultValue={ticket.status}
            onChange={handleStatusChange}
            style={{ width: '150px' }}
            disabled={!isCreator && !isAssigned}
            loading={statusLoading}
          >
            <Select.Option value="open">Open</Select.Option>
            <Select.Option value="in_progress">In Progress</Select.Option>
            <Select.Option value="fixed">Fixed</Select.Option>
            <Select.Option value="closed">Closed</Select.Option>
            <Select.Option value="reopened">Reopened</Select.Option>
          </Select>
          {isCreator && (
            <Button type="primary" onClick={() => setEditing((prev) => !prev)}>
              {editing ? 'Cancel' : 'Edit'}
            </Button>
          )}
        </Space>

        {isCreator && (
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            style={{ maxWidth: 500, margin: '32px auto 0 auto', display: editing ? 'block' : 'none' }}
          >
            <Form.Item name="title" label="Title" rules={[{ required: true }]}> <Input /> </Form.Item>
            <Form.Item name="description" label="Description" rules={[{ required: true }]}> <Input.TextArea rows={4} /> </Form.Item>
            <Form.Item name="assigned_to" label="Assign to">
              <Select placeholder="Select a user" allowClear showSearch optionFilterProp="children">
                {(Array.isArray(users) ? users : []).map((user) => (
                  <Select.Option key={user.id} value={user.id}>
                    {user.username} {user.first_name || ''} {user.last_name || ''}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="priority" label="Priority">
              <Select>
                <Select.Option value="low">Low</Select.Option>
                <Select.Option value="medium">Medium</Select.Option>
                <Select.Option value="high">High</Select.Option>
                <Select.Option value="critical">Critical</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="severity" label="Severity">
              <Select>
                <Select.Option value="low">Low</Select.Option>
                <Select.Option value="medium">Medium</Select.Option>
                <Select.Option value="high">High</Select.Option>
                <Select.Option value="critical">Critical</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="due_date" label="Due Date">
              <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default TicketDetail;
