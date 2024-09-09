import React from 'react'

import { Document, Font } from '@react-pdf/renderer'
//import SF from 'Fonts/SF-Regular.ttf'
import Decimal from 'decimal.js'
// import { DataTableCell, TableBody, TableCell, TableHeader, Table } from '@david.kucsai/react-pdf-table'
import SfLight from '../MovementTable/Fonts/SF/SF-Pro-Text-Light.otf'
import SfMedium from '../MovementTable/Fonts/SF/SF-Pro-Text-Medium.otf'
import SfRegular from '../MovementTable/Fonts/SF/SF-Pro-Text-Regular.otf'
import SfBold from '../MovementTable/Fonts/SF/SF-Pro-Text-Bold.otf'
import SfSemiBold from '../MovementTable/Fonts/SF/SF-Pro-Text-Semibold.otf'
import { FundsStatementDetail } from './FundsStatementDetail'
import { AccountsStatementDetail } from './AccountsStatementDetail'
import { Cover } from './Cover'

// Registrar la fuente
Font.register({
    family: 'SF',
    fonts: [
        { src: SfBold, fontWeight: 'bold' },
        { src: SfRegular },
        { src: SfMedium, fontWeight: 'medium' },
        { src: SfSemiBold, fontWeight: 'semibold' },
        { src: SfLight, fontWeight: 'light' },
    ]
});

export const paginate = (array, pageSize) => {
    return array.reduce((acc, _, i) => {
        if (i % pageSize === 0) acc.push(array.slice(i, i + pageSize));
        return acc;
    }, []);
};


const HoldingsReport = ({ headerInfo, sharesDecimalPlaces = 5, AccountSelected, holdings, year = 2023 }) => {
    Decimal.set({ precision: 100 })

    return (
        <Document>
            <Cover AccountSelected={AccountSelected} holdings={holdings} year={year} headerInfo={headerInfo} />
            <AccountsStatementDetail accountsStatement={holdings.accountsStatement} year={year} headerInfo={headerInfo} />
            <FundsStatementDetail AccountSelected={AccountSelected} sharesDecimalPlaces={sharesDecimalPlaces} fundsStatement={holdings.fundsStatement} year={year} headerInfo={headerInfo} />
        </Document >
    )
}

export default HoldingsReport

