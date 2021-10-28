import React, { useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

import { useTranslation } from "react-i18next";


import moment from 'moment';
import './index.css'
import MovementsTab from './MovementsTab';


const FoundDetail = () => {

    const { t } = useTranslation();
    history.push(`/login`);

    return (
        <div>
            <h1>Grafico</h1>
        </div>
    )
}
export default FoundDetail

