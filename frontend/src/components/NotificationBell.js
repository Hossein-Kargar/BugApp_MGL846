
import React, { useEffect, useState } from 'react';
import { notificationService } from '../services';
import { Badge, List, Button, Drawer } from 'antd';
import { BellOutlined } from '@ant-design/icons';


const NOTIF_READ_KEY = 'readNotifications';

const NotificationBell = () => {
  const [visible, setVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [readIds, setReadIds] = useState([]);

  // Generate a unique id for each notification (hash or string)
  const getNotifId = (notif) => {
    // Use a simple hash or fallback to string
    return btoa(unescape(encodeURIComponent(notif))).slice(0, 16);
  };

  // Load read notification ids from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(NOTIF_READ_KEY);
    if (stored) setReadIds(JSON.parse(stored));
  }, []);

  // Fetch notifications
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationService.getNotifications();
      setNotifications(res.data.notifications || []);
    } catch (e) {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // When opening drawer, fetch and mark all as read
  const handleOpen = async () => {
    await fetchNotifications();
    // Mark all as read
    const ids = (res => (res.data.notifications || []).map(getNotifId))(await notificationService.getNotifications());
    setReadIds(ids);
    localStorage.setItem(NOTIF_READ_KEY, JSON.stringify(ids));
    setVisible(true);
  };

  // Unread notifications
  const unread = notifications.filter(n => !readIds.includes(getNotifId(n)));

  return (
    <>
      <Badge count={unread.length} overflowCount={99} style={{ backgroundColor: '#ff4d4f' }}>
        <Button
          icon={<BellOutlined />}
          shape="circle"
          onClick={handleOpen}
        />
      </Badge>
      <Drawer
        title="Notifications"
        placement="right"
        onClose={() => setVisible(false)}
        open={visible}
        width={350}
      >
        <List
          loading={loading}
          dataSource={notifications}
          renderItem={(item, idx) => (
            <List.Item key={idx} style={{ background: !readIds.includes(getNotifId(item)) ? '#fffbe6' : undefined }}>
              <span
                dangerouslySetInnerHTML={{ __html: item }}
                style={{ wordBreak: 'break-word' }}
              />
            </List.Item>
          )}
          locale={{ emptyText: 'No notifications.' }}
        />
      </Drawer>
    </>
  );
};

export default NotificationBell;
