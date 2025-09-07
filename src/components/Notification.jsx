import { useEffect } from "react";
import { useShop } from "../contexts/ShopContext";

function Notification() {
  const { state, removeNotification } = useShop();

  useEffect(() => {
    state.notifications.forEach((notification) => {
      const timer = setTimeout(() => {
        removeNotification(notification.id);
      }, 3000);

      return () => clearTimeout(timer);
    });
  }, [state.notifications, removeNotification]);

  if (state.notifications.length === 0) return null;

  return (
    <div className="notification-container">
      {state.notifications.map((notification) => (
        <div
          key={notification.id}
          className={`notification notification-${notification.type}`}
        >
          <span>{notification.message}</span>
          <button
            className="notification-close"
            onClick={() => removeNotification(notification.id)}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      ))}
    </div>
  );
}

export default Notification;
