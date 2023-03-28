import React from "react";
import notifications from "../notifications";
import Loading from 'components/DashBoard/User/MovementsTable/CardsContainer/MainCard/MainCardFund/MovementsTab/Loading';
import EmptyTable from "./EmptyTable";
import Notification from "components/DashBoard/NavBars/NavBar/NotificationsCenter/Notification";


const NotificationsList = () => {

    return (
        false
            ?
            <Loading className="h-100 mb-5" />
            :
            false ?
                <EmptyTable className="h-100 mb-5" />
                :
                <div className="notifications-container px-0">
                    {
                        notifications.map(notification =>
                            <Notification notification={notification} key={`notification-${notification.id}`} />
                        )
                    }
                </div>
    );
}

export default NotificationsList