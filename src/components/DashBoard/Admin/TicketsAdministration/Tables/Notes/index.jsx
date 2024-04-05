import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';


const Notes = ({ transferNote, clientNote, denialMotive, adminNote, partialLiquidate }) => {
    const { t } = useTranslation();
    return (
        <>
            {
                (!!(transferNote) || !!(clientNote) || !!(denialMotive) || !!(adminNote)) &&
                <div className='w-100 d-flex' style={{ borderBottom: "1px solid lightgray" }} />
            }
            {!!(transferNote) &&
                <div className='d-flex justify-content-between'>
                    <span >
                        <span className="d-inline">{t('Transfer note')}:&nbsp;</span>
                        "{transferNote.text}"
                    </span>
                </div>
            }
            {!!(clientNote) &&
                <div className='d-flex justify-content-between'>
                    <span >
                        <span className="d-inline">{t('Personal note')}:&nbsp;</span>
                        "{clientNote.text}"
                    </span>
                </div>
            }
            {!!(denialMotive) &&
                <div className='d-flex justify-content-between'>
                    <span >
                        <span className="d-inline">{t('Denial motive')}:&nbsp;</span>
                        "{denialMotive.text}"
                    </span>
                </div>
            }
            {!!(adminNote) &&
                <div className='d-flex justify-content-between'>
                    <span >
                        <span className="d-inline">{t('Admin note')}:&nbsp;</span>
                        "{adminNote.text}"
                    </span>
                </div>
            }
            {!!(partialLiquidate) &&
                <div className='d-flex justify-content-between'>
                    <span >
                        "{partialLiquidate.text}" ({partialLiquidate.userName})
                    </span>
                </div>
            }
        </>
    )
}
export default Notes

