import React from 'react'
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
});  

const useNotifier = ({body}) => {
    const handleNotifier = async() => {
        const identifier = await Notifications.scheduleNotificationAsync({
            content: {
              title: "Новое уведомление!",
              body: 'Заказ готов!',
            },
            trigger: null,
        })

        await Notifications.cancelScheduledNotificationAsync(identifier);
    }

    return handleNotifier
}

export default useNotifier
