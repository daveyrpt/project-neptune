import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { Alert, Collapse } from '@mui/material';
export default function FlashedMessages() {
  const [visible, setVisible] = useState(true);
  const [errorMessages, setErrorMessages] = useState([]);
  const { flash, errors } = usePage().props;
  const formErrors = Object.keys(errors).length;

  useEffect(() => {
    setVisible(true);
    setErrorMessages(Object.values(errors));
  }, [flash, errors]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [visible]);

  // console.log(formErrors);
  return (
    <>
      <Collapse in={visible}>
        {formErrors > 0 && visible && (
          <Alert
            variant="filled"
            severity="error"
            onClose={() => setVisible(false)}
          >
            <ul>
              {
                errorMessages.map((message, index) => (
                  <li key={index}>{message}</li>
                ))
              }
            </ul>
            {'There are ' + formErrors + ' form errors.'}
          </Alert>
        )}
        {flash?.success && visible && (
          <Alert
            variant="filled"
            severity="success"
            onClose={() => setVisible(false)}
          >
            {flash.success}
          </Alert>
        )}
        {flash?.error && visible && (
          <Alert
            variant="filled"
            severity="error"
            onClose={() => setVisible(false)}
          >
            {flash.error}
          </Alert>
        )}
        {flash?.warning && visible && (
          <Alert
            variant="filled"
            severity="warning"
            onClose={() => setVisible(false)}
          >
            {flash.warning}
          </Alert>
        )}
      </Collapse>
    </>
  );
}