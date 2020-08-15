import React from 'react';
import { NotificationContainer } from '@etsoo/notificationbase';
import { NotificationReact } from './NotificationReact';

/**
 * Notification UI properties
 */
export interface NotificationUIProps {
    /**
     * Style class name
     */
    className?: string;

    /**
     * Each notification style class name
     */
    itemClassName?: string;
}

/**
 * Notification UI
 */
export function NotificationUI(props: NotificationUIProps) {
    // Destruct
    const { className, itemClassName } = props;

    // User state to hold notifications
    const [notifications, updateNotifications] = React.useState<
        NotificationReact[]
    >([]);

    /**
     * Add notification
     * @param notifiction Notification
     * @param top Does insert in the top position
     */
    const addNotification = (notifiction: NotificationReact, top: boolean) => {
        updateNotifications(
            top
                ? [notifiction, ...notifications]
                : [...notifications, notifiction]
        );
    };

    /**
     * Remove notification
     * @param notifictionId Notification id
     */
    const removeNotification = (notifictionId: string) => {
        // Filter
        const temp = notifications.filter((n) => n.id !== notifictionId);

        // Update
        updateNotifications(temp);
    };

    // Render notifications
    const renderNotifications = () => {
        return notifications.map((notification) =>
            notification.render(itemClassName)
        );
    };

    // Register current UI to the global container
    // Every update should register again under functional component
    NotificationContainer.register(addNotification, removeNotification);

    // Layout ready
    React.useEffect(() => {
        return () => {
            // Dispose all notifications to avoid any timeout memory leak
            notifications.forEach((notification) => notification.dispose());
        };
    }, []);

    // Return composition
    return React.createElement('div', { className }, renderNotifications());
}
