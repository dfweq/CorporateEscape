import { useState, useEffect } from 'react';

export function useDateTime() {
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      
      // Format date as yyyy-mm-dd
      const formattedDate = now.toISOString().split('T')[0];
      
      // Format time as hh:mm:ss
      const formattedTime = now.toTimeString().split(' ')[0];
      
      setDate(formattedDate);
      setTime(formattedTime);
    };

    // Update immediately
    updateDateTime();
    
    // Then update every second
    const intervalId = setInterval(updateDateTime, 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  return { date, time };
}
