import React from 'react';
import { Alert } from '@mui/material';

function AlertNotification({ alerts, removeAlert }) {
  return (
    <>
      {alerts.map((alert) => (
        <Alert
            key={alert.id}
            severity={alert.severity}
            onClose={() => removeAlert(alert.id)}
            sx={{ width: '100wh' }}
        >
            {alert.message}
        </Alert>      
      ))}
    </>
  );
}

export default AlertNotification;