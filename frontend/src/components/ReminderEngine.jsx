import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import icon from '../assets/logo.svg';

const ReminderEngine = () => {

    useEffect(() => {
        // Poll every 30 seconds
        const interval = setInterval(() => {
            const reminders = JSON.parse(localStorage.getItem('medicine_reminders')) || [];
            if (reminders.length === 0) return;

            const now = new Date();
            const currentHour = now.getHours().toString().padStart(2, '0');
            const currentMinute = now.getMinutes().toString().padStart(2, '0');
            const currentTimeStr = `${currentHour}:${currentMinute}`;
            const currentDateStr = now.toLocaleDateString();

            let updated = false;

            reminders.forEach(reminder => {
                if (reminder.time === currentTimeStr && reminder.lastTriggered !== currentDateStr) {
                    
                    // Trigger System Notification
                    if (Notification.permission === "granted") {
                        new Notification("Medicine Reminder", {
                            body: `It's time to take your ${reminder.name} (${reminder.dosage})`,
                        });
                    }

                    // Trigger toast in browser
                    toast.info(`Time to take your medicine: ${reminder.name} (${reminder.dosage})`, {
                        position: "top-center",
                        autoClose: 10000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        theme: "colored",
                        icon: "💊"
                    });

                    // Mark as triggered today
                    reminder.lastTriggered = currentDateStr;
                    updated = true;
                }
            });

            if (updated) {
                localStorage.setItem('medicine_reminders', JSON.stringify(reminders));
            }

        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, []);

    return null; // Invisible global component
};

export default ReminderEngine;
