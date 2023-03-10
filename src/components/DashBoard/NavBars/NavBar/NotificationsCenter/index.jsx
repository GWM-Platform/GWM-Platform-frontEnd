import React, { useState } from 'react'
import { Popover, OverlayTrigger, Badge, CloseButton } from "react-bootstrap";
import { useTranslation } from 'react-i18next';
import './index.scss'
import moment from 'moment';
import Notification from './Notification';
import { useHistory } from 'react-router-dom';

const { faBell, faBellSlash, faCog } = require("@fortawesome/free-solid-svg-icons")
const { FontAwesomeIcon } = require("@fortawesome/react-fontawesome")
const NotificationsCenter = () => {
    const { t } = useTranslation()
    const history = useHistory()

    const notifications = [
        {
            id: 1,
            eventType: "FIXED_DEPOSIT_TICKET_APPROVED",
            time: moment().subtract(1.7, 'hour').format(),
            read: true
        },
        {
            id: 2,
            eventType: "WITHDRAW_TICKET_LIQUIDATED",
            time: moment().subtract(27, 'hour').format(),
            read: false
        },
        {
            id: 3,
            eventType: "FUND_CREATED",
            time: moment().subtract(0.1, 'hour').format(),
            read: false
        }
    ].sort((a, b) => moment(a.time).isAfter(moment(b.time)) ? -1 : 0)

    const [show, setShow] = useState(false)


    const hasNotifications = () => notifications.length > 0
    const hasUnreadNotifications = () => hasNotifications() && notifications.filter(notification => !notification.read).length > 0

    const popover = (
        <Popover id="notifications-center">
            <Popover.Body >
                <div className='header'>
                    <h1>
                        {t("Notifications")}
                    </h1>
                    {
                        hasNotifications() &&
                        <Badge className='ms-1 mt-auto'>
                            {notifications.length}
                        </Badge>
                    }

                    <button
                        className='noStyle ms-auto' type="button" title={t("Notifications configuration")}
                        onClick={() => {
                            history.push('/Dashboard/Configuration?section=Password+and+authentication');
                            setShow(false);
                        }}
                    >
                        <FontAwesomeIcon icon={faCog} />
                    </button>
                    <CloseButton style={{fontSize:".85em"}} onClick={() => setShow(false)} type="button" title={t("Close")} />
                </div>
                {
                    hasNotifications() ?
                        <div className='notifications-container'>
                            {
                                notifications.map(
                                    notification =>
                                        <Notification notification={notification} key={`notification-${notification.id}`} />
                                )
                            }
                        </div>
                        :
                        <div className='no-notifications'>
                            <FontAwesomeIcon
                                icon={faBellSlash}
                            />
                            <p>
                                {t("You have no notifications right now")}
                                <br />
                                {t("Come back later")}
                            </p>
                        </div>
                }
                <div className='actions'>
                    {
                        (hasUnreadNotifications()) &&
                        <button type="button">
                            {t("Mark all as read")}
                        </button>
                    }
                    {
                        (hasNotifications()) &&
                        <button type="button">
                            {t("View all")}
                        </button>
                    }
                </div>
            </Popover.Body>
        </Popover>
    );
    return (
        <OverlayTrigger placement="bottom" overlay={popover} show={show}
            popperConfig={{
                modifiers: [
                    {
                        name: 'preventOverflow',
                        options: {
                            altBoundary: true, // false by default
                        },
                    }
                ],
            }}
        >
            <button
                id="popover-notifications-toggler" title={t("Notifications center")} type="button"
                className={`nav-link noStyle ${show ? "active" : ""} ${hasUnreadNotifications() ? "unread-notifications" : ""}`}
                onClick={() => setShow(prevState => !prevState)}
            >
                <div className="icon" >
                    <FontAwesomeIcon icon={faBell} />
                </div>
            </button>
        </OverlayTrigger>
    );
}

export default NotificationsCenter