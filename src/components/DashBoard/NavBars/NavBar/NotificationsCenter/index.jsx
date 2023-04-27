import React, { useState } from 'react'
import { Popover, OverlayTrigger, Badge, CloseButton } from "react-bootstrap";
import { useTranslation } from 'react-i18next';
import './index.scss'
import Notification from './Notification';
import { useHistory, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectAllNotifications } from 'Slices/DashboardUtilities/notificationsSlice';

const { faBell, faBellSlash, faCog } = require("@fortawesome/free-solid-svg-icons")
const { FontAwesomeIcon } = require("@fortawesome/react-fontawesome")
const NotificationsCenter = ({ active }) => {

    const notifications = useSelector(selectAllNotifications)
    const notificationsStatus = useSelector(state => state.notifications.status)

    const { t } = useTranslation()
    const history = useHistory()

    const [show, setShow] = useState(false)


    const hasNotifications = () => notifications?.total > 0
    const hasUnreadNotifications = () => hasNotifications() && notifications?.notifications?.filter(notification => !notification.read).length > 0

    let location = useLocation()

    useEffect(() => {
        setShow(false)
        //eslint-disable-next-line
    }, [location])

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
                            {notifications.total}
                        </Badge>
                    }
                    {
                        false &&
                        <button
                            className='noStyle ms-auto' type="button" title={t("Notifications configuration")}
                            onClick={() => {
                                history.push('/Dashboard/Configuration?section=Password+and+authentication');
                                setShow(false);
                            }}
                        >
                            <FontAwesomeIcon icon={faCog} />
                        </button>
                    }
                    <CloseButton className='ms-auto' style={{ fontSize: ".85em" }} onClick={() => setShow(false)} type="button" title={t("Close")} />
                </div>
                {
                    hasNotifications() ?
                        <div className='notifications-container'>
                            {
                                notifications?.notifications?.map(
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

                    <button type="button"
                        onClick={() => {
                            history.push('/Dashboard/notificationsCenter'); setShow(false);
                        }}>
                        {t("View all")}
                    </button>
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
                disabled={notificationsStatus !== "succeeded"}
                id="popover-notifications-toggler" title={t("Notifications center")} type="button"
                className={`nav-link noStyle ${show || active ? "active" : ""} ${hasUnreadNotifications() ? "unread-notifications" : ""}`}
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