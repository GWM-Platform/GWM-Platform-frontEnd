import React from "react";
import Loading from 'components/DashBoard/User/MovementsTable/CardsContainer/MainCard/MainCardFund/MovementsTab/Loading';
import EmptyTable from "./EmptyTable";
import Notification from "components/DashBoard/NavBars/NavBar/NotificationsCenter/Notification";
import { useSelector } from "react-redux";
import { selectAllNotifications } from "Slices/DashboardUtilities/notificationsSlice";


const NotificationsList = () => {
    const notifications = useSelector(selectAllNotifications)
    const notificationsStatus = useSelector(state => state.notifications.status)

    return (
        notificationsStatus==="loading"
            ?
            <Loading className="h-100 mb-5" />
            :
            false ?
                <EmptyTable className="h-100 mb-5" />
                :
                <div className="notifications-container px-0">
                    {
                        notifications.notifications.map(notification =>
                            <Notification notification={notification} key={`notification-${notification.id}`} />
                        )
                    }
                </div>
    );
}

export default NotificationsList