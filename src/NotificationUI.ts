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
        // Find match index
        const index = notifications.findIndex(
            (notifiction) => notifiction.id === notifictionId
        );

        if (index !== -1) {
            // Remove from the collection and return the item
            const removed = notifications.splice(index, 1)[0];

            // Update
            updateNotifications(notifications);

            return removed;
        }

        return undefined;
    };

    // Register current UI to the global container
    NotificationContainer.register(addNotification, removeNotification);

    // Render notifications
    const renderNotifications = () => {
        return notifications.map((notification) =>
            notification.render(itemClassName)
        );
    };

    React.useEffect(() => {
        return () => {
            // Dispose all notifications to avoid any timeout memory leak
            notifications.forEach((notification) => notification.dispose());
        };
    }, []);

    return React.createElement('div', { className }, renderNotifications());
}
