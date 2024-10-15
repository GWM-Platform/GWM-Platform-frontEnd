import React, { useContext, useMemo, useState } from 'react'
import { Popover, OverlayTrigger, Badge, CloseButton } from "react-bootstrap";
import { useTranslation } from 'react-i18next';
import './index.scss'
import Notification from './Notification';
import { useHistory, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { markAllAsRead, selectAllNotifications } from 'Slices/DashboardUtilities/notificationsSlice';
import { DashBoardContext } from 'context/DashBoardContext';
import axios from 'axios'

import { faBell, faBellSlash, faCog } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-regular-svg-icons';
const NotificationsCenter = ({ active }) => {
    const { DashboardToastDispatch, getDashboardToastByKey, ClientSelected } = useContext(DashBoardContext)

    const notifications = useSelector(selectAllNotifications)
    const notificationsStatus = useSelector(state => state.notifications.status)

    const { t } = useTranslation()
    const history = useHistory()

    const [show, setShow] = useState(false)
    const togglePopover = () => {
        DashboardToastDispatch({ type: "hide_specific_key", specificKey: "UNREAD_NOTIFICATIONS" })
        setShow(prevState => !prevState)
    }

    const notificationsNoticeToastAlreadyCreated = useMemo(() => getDashboardToastByKey('UNREAD_NOTIFICATIONS'), [getDashboardToastByKey])

    const unreadNotifications = useMemo(
        () => {
            return notifications?.notifications?.filter(notification => !notification.read)
        },
        [notifications?.notifications],
    )

    const hasUnreadNotifications = useMemo(
        () => unreadNotifications?.length > 0,
        [unreadNotifications],
    )

    let location = useLocation()

    useEffect(() => {
        setShow(false)
        //eslint-disable-next-line
    }, [location])

    useEffect(() => {
        if (hasUnreadNotifications && !notificationsNoticeToastAlreadyCreated) {
            DashboardToastDispatch({ type: "create", key: "UNREAD_NOTIFICATIONS", noClose: true, onClick: () => setShow(true), toastContent: { Icon: faBell, Title: "You have unread notifications" } });
        }
        //eslint-disable-next-line
    }, [hasUnreadNotifications, notificationsNoticeToastAlreadyCreated])

    const dispatch = useDispatch()
    const ApiMarkAllAsRead = (showToast = true) => {
        axios.patch(`/notifications`,
            {
                notificationIds: unreadNotifications?.map(notification => notification.id)
            },
            {
                params: {
                    client: ClientSelected.id
                }
            }
        ).then(function () {
            if (showToast) {
                DashboardToastDispatch({ type: "create", toastContent: { Icon: faCheckCircle, Title: "All notifications have been marked as read"} });
            }
            dispatch(markAllAsRead({ id: unreadNotifications?.map(notification => notification.id) }))
        }).catch((err) => {
            if (err.message !== "canceled") {
                if (showToast) {
                    DashboardToastDispatch({ type: "create", toastContent: { Icon: faTimesCircle, Title: "There was an error marking all the notifications as read" } });
                }
            }
        });
    }


    const popover = (
        <Popover id="notifications-center">
            <Popover.Body >
                <div className='header'>
                    <h1>
                        {t("Notifications")}
                    </h1>
                    {
                        hasUnreadNotifications &&
                        <Badge className='ms-1 mt-auto'>
                            {unreadNotifications.length}
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
                    hasUnreadNotifications ?
                        <div className='notifications-container'>
                            {
                                unreadNotifications?.map(
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
                            </p>
                        </div>
                }
                <div className='actions'>
                    <button type="button"
                        onClick={() => ApiMarkAllAsRead()}>
                        {t("Mark all as read")}
                    </button>
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
                className={`nav-link noStyle ${show || active ? "active" : ""} ${hasUnreadNotifications ? "unread-notifications" : ""}`}
                onClick={togglePopover}
            >
                <div className="icon" >
                    <FontAwesomeIcon icon={faBell} />
                </div>
            </button>
        </OverlayTrigger>
    );
}

export default NotificationsCenter