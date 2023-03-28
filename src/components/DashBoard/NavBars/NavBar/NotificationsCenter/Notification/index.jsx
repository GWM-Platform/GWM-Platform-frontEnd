import React, { useEffect, useRef, useState } from 'react'
import MoreButton from 'components/DashBoard/GeneralUse/MoreButton'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import { OverlayTrigger, Popover, Dropdown } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

const Notification = ({ notification, fromPopup = true }) => {
    const { t } = useTranslation()
    const [show, setShow] = useState(false)

    const ref = useRef(null);
    const history = useHistory()


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


    const notificationMenu = (
        <Popover id={`notification-options-${notification.id}`}>
            <Popover.Body ref={ref} className="p-0" >
                <div
                    style={{ position: "relative", borderColor: "transparent" }}
                    aria-labelledby="collasible-nav-dropdown" data-bs-popper="static" className="dropdown-menu show mt-0">
                    <Dropdown.Item>
                        {t('Go to details')}
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item>
                        {t('Mark as read')}
                    </Dropdown.Item>
                    <Dropdown.Item >
                        {t('Dimiss')}
                    </Dropdown.Item>
                </div>
            </Popover.Body>
        </Popover>
    );


    return (
        <div className={`notification ${notification.read ? "" : "unread"}`}  >
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
                <h2 >
                    {t(notification.eventType)}
                </h2>
                <h3>
                    {moment(notification.time).fromNow()}
                </h3>
            </div>

            <OverlayTrigger show={show} placement="bottom" overlay={notificationMenu}

            >
                <MoreButton id={`popover-notification-${notification.id}-toggler`} onClick={() => setShow(prevState => !prevState)} title={t("Notification options")} />
            </OverlayTrigger>
        </div >
    )
}

export default Notification