import React, { useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Toast, ToastContainer } from 'react-bootstrap';
import { DashBoardContext } from 'context/DashBoardContext';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const DashboardToasts = () => {

    const { DashboardToast } = useContext(DashBoardContext)

    return (
        <ToastContainer className="p-3" style={{ zIndex: "10000" }} position="top-end">
            {DashboardToast.map((toast, key) => {
                return <ToastComponent key={key} ownKey={key} toast={toast} />
            })}
        </ToastContainer>

    )
}
export default DashboardToasts

const ToastComponent = ({ ownKey, toast }) => {

    const { DashboardToastDispatch } = useContext(DashBoardContext)
    const { t } = useTranslation()
    return (
        <Toast
            onClose={() => DashboardToastDispatch({ type: "hide", toastKey: ownKey })}
            show={toast.Show} delay={toast.noClose ? null : 3000} autohide={!toast.noClose} >
            <Toast.Header>
                <strong className="me-auto">
                    {
                        toast?.Content?.Icon && <FontAwesomeIcon className="me-1" icon={toast?.Content?.Icon} />
                    }
                    {t(toast?.Content?.Title)}</strong>
                <small>{t(toast?.Content?.Detail)}</small>
            </Toast.Header>
            {
                toast?.Content?.Body && <Toast.Body>{t(toast?.Content?.Body)}</Toast.Body>
            }
        </Toast >
    )
}