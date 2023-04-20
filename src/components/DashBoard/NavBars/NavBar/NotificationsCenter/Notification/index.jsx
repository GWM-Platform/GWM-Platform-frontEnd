import React, { useEffect, useRef, useState } from 'react'
import MoreButton from 'components/DashBoard/GeneralUse/MoreButton'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import { OverlayTrigger, Popover, Dropdown } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import DetailModal from './DetailModal'
import axios from 'axios'
import { useContext } from 'react'
import { DashBoardContext } from 'context/DashBoardContext'
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-regular-svg-icons'
import { markAsRead } from 'Slices/DashboardUtilities/notificationsSlice'
import { useDispatch } from 'react-redux'

const Notification = ({ notification, fromPopup = true }) => {

    const { t } = useTranslation()
    const { ClientSelected, DashboardToastDispatch } = useContext(DashBoardContext)
    const dispatch = useDispatch()

    const [show, setShow] = useState(false)

    const ref = useRef(null);
    const history = useHistory()

    const [ShowModal, setShowModal] = useState(false)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                ref.current
                && !ref.current.contains(event.target) && event.target.id !== `popover-notification-${notification.id}-toggler`
                && !(event.target.tagName === "IMG" && event.target.parentNode.id === `popover-notification-${notification.id}-toggler`)
            ) {
                setShow(false);
            }
        };

        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, [notification.id]);

    const redirect = (route) => {
        history.push(route)
    }

    const ApiMarkAsRead = () => {
        axios.patch(`/notifications/${notification.id}`, null,
            {
                params: {
                    client: ClientSelected.id
                }
            }
        ).then(function () {
            DashboardToastDispatch({ type: "create", toastContent: { Icon: faCheckCircle, Title: "Notification mark as read" } });
            dispatch(markAsRead({ id: notification.id }))
        }).catch((err) => {
            if (err.message !== "canceled") {
                DashboardToastDispatch({ type: "create", toastContent: { Icon: faTimesCircle, Title: "There was an error marking the notification as read" } });
            }
        });
    }

    const notificationMenu = (
        <Popover className="notification-options" id={`notification-options-${notification.id}`}>
            <Popover.Body ref={ref} className="p-0" >
                <div
                    style={{ position: "relative", borderColor: "transparent" }}
                    aria-labelledby="collasible-nav-dropdown" data-bs-popper="static" className="dropdown-menu show mt-0">
                    {
                        notification.movementId &&
                        (
                            notification.movement.transferId ?
                                <Dropdown.Item onClick={() => redirect(`/DashBoard/history/history?id=${notification?.movement?.transferId}&type=transfers&SelectedTab=Transfers`)}>
                                    {t('Go to transfer')}
                                </Dropdown.Item>
                                :
                                <Dropdown.Item onClick={() => redirect(`/DashBoard/history/history?id=${notification?.movementId}&type=m`)}>
                                    {t('Go to movement')}
                                </Dropdown.Item>
                        )
                    }
                    {
                        notification.movement &&
                        <>
                            <Dropdown.Item onClick={() => setShowModal(true)}>
                                {t('View detail')}
                            </Dropdown.Item>
                            <DetailModal ShowModal={ShowModal} setShowModal={setShowModal} notification={notification} />
                        </>
                    }
                    {
                        ((notification.movementId || notification.movement) && !notification.read) && <Dropdown.Divider />
                    }
                    {
                        !notification.read &&
                        <Dropdown.Item onClick={() => ApiMarkAsRead()}>
                            {t('Mark as read')}
                        </Dropdown.Item>
                    }
                </div>
            </Popover.Body>
        </Popover>
    );


    return (
        <div className={`notification ${notification.read ? "" : "unread"}`} title={t(notification.type)}  >
            <div
                className='notification-resume' title={t(notification.eventType)}
                onClick={() => {
                    if (notification.path) {
                        history.push(notification.path)
                        setShow(false)
                    }
                }}
                style={{ cursor: notification.path ? "pointer" : "" }}
            >
                <h2 title={t(notification.type)} >
                    {t(notification.type)}
                </h2>
                <h3>
                    {moment(notification.createdAt).fromNow()}
                </h3>
            </div>

            {
                !!(notification.movementId || notification.movement || !notification.read) &&
                <OverlayTrigger show={show} placement="bottom" overlay={notificationMenu} >
                    <MoreButton id={`popover-notification-${notification.id}-toggler`} onClick={() => setShow(prevState => !prevState)} title={t("Notification options")} />
                </OverlayTrigger>
            }
        </div >
    )
}

export default Notification