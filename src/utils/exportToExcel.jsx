import { decimalSeparator, groupSeparator } from 'components/DashBoard/Admin/TicketsAdministration';
import ExcelJS from 'exceljs';
import moment from 'moment';

export const exportToExcel = async ({ filename = "Archivo", sheetName = "Hoja 1", dataTableName = "test-table", excludedColumns = [], strictPlainNumberColumns = [], plainNumberColumns = [], useRowBackgroundColor, maxWidth = 30, strictPlainNumber = false, hideRows = false }) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    const table = document.querySelector(`[data-table-name="${dataTableName}"]`);
    let rows = Array.from(table.getElementsByTagName('tr'));

    if (hideRows) {
        rows = rows.filter(row => {
            const cells = Array.from(row.getElementsByTagName('td'))
            const hideCell = cells.find(cell => cell.getAttribute("data-column-name") === "hide")?.childNodes[0]?.getAttribute("data-hide")
            return hideCell !== "true"
        })
    }

    let cellIndex = 1;
    let totalCellsHeader

    rows.forEach((row, rowIndex) => {
        const cells = [...Array.from(row.getElementsByTagName('td')), ...Array.from(row.getElementsByTagName('th'))].filter(element => !excludedColumns.includes(element.getAttribute("data-column-name")));
        if (rowIndex === 0) {
            totalCellsHeader = cells.length
        }

        cellIndex = 1;
        const isRowDivider = row.getAttribute("row-divider") === "true"
        let rowBackgroundColor = null
        if (useRowBackgroundColor) {
            rowBackgroundColor = window.getComputedStyle(row)["background-color"];
        }
        if (isRowDivider) {
            for (let i = 0; i < totalCellsHeader; i++) {
                let excelCell = worksheet.getRow(rowIndex + 1).getCell(i + 1);
                excelCell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: "FFFFFF" },
                };
            }
        }
        cells.forEach((cell, ownCellIndex) => {
            let excelCell = worksheet.getRow(rowIndex + 1).getCell(cellIndex);

            const checkIsMerged = () => {
                if (excelCell.isMerged) {
                    cellIndex++
                    excelCell = worksheet.getRow(rowIndex + 1).getCell(cellIndex);
                    checkIsMerged(excelCell.isMerged)
                }
            }
            checkIsMerged()

            let value = cell.innerText
            
            // Cleans *
            value = value.replace(/\*/g, '')
            
            // Cleans blank spaces
            value = value.replace(/\s+/g, ' ').trim()
            
            // Cleans repited value with U$D format - Chrome
            value = value.replace(/(-?\+?U\$D\s*[\d,.]+)\s+\1/g, '$1')

            // Cleans repited value with numeric format - Chrome
            value = value.replace(/(\d+[,.]?\d*)\s+\1/g, '$1')

            // Clean concatenated duplicate currency values - Safari
            value = value.replace(/([+-]?U\$D\s*[\d.,]+)([+-]?U\$D\s*[\d.,]+)/g, (match, p1, p2) => {
                return p1 === p2 ? p1 : match;
            })
            
            // Clean concatenated duplicate numbers - Safari
            value = value.replace(/(\d+,\d+)(\d+,\d+)(\s+shares)/g, (match, p1, p2, p3) => {
                return p1 === p2 ? p1 + p3 : match;
            })

            if (moment(value, ['DD-MMM-YY'], true).isValid()) {
                value = moment(value, ['DD-MMM-YY'], true).toDate()
                excelCell.numFmt = "dd/mm/yyyy"
            }

            const dateFormat = cell.getAttribute("date-format")
            if (dateFormat && moment(value, [dateFormat], true).isValid()) {
                value = moment(value, [dateFormat], true).toDate()
                excelCell.numFmt = dateFormat
            }


            const regex = /^[+-]?U\$D ?[0-9().,-]*$/;
            if (regex.test(value) && value !== "" && value !== "-") {
                const isPlainNumber = cell.getAttribute("plain-text") === "true" || plainNumberColumns.includes(cell.getAttribute("data-column-name"))
                const isStrictPlainNumber = strictPlainNumberColumns.includes(cell.getAttribute("data-column-name"))
                
                const hasSign = value.startsWith('+') || value.startsWith('-')
                const hasUSD = value.includes('U$D')
                
                if (!isStrictPlainNumber && (!isPlainNumber || !strictPlainNumber) && !hasSign && !hasUSD) {
                    value = parseFloat(value.replace("(", "-").replace(")", "").replace("U$D ", "").replaceAll(groupSeparator, "").replaceAll(decimalSeparator, "."))
                    excelCell.numFmt = '#,##0.00';
                } else {
                    // Keeps as a text to preserve 'U$D'
                    excelCell.numFmt = "@";
                }
            }

            const isNotExcel = cell.getAttribute("not-excel") === "true"
            if (!isNotExcel) {
                excelCell.value = value;
            }

            const computedStyle = window.getComputedStyle(cell);
            const borderStyles = {
                top: computedStyle.borderTopWidth,
                left: computedStyle.borderLeftWidth,
                bottom: computedStyle.borderBottomWidth,
                right: computedStyle.borderRightWidth,
            };
            const textAlign = computedStyle["text-align"]
            let excelBorderStyles = {}
            const isAltDivider = cell.getAttribute("alt-divider") === "true"
            const isDivider = cell.getAttribute("data-column-name") === "divider" && !isAltDivider

            if (textAlign) {
                excelCell.alignment = { horizontal: textAlign };
            }

            if (isDivider) {
                excelCell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: "FFFFFF" },
                };
            } else if (cell.tagName.toLowerCase() === 'th') {
                let isHeader = row.parentNode.tagName.toLowerCase() === 'thead'
                excelCell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: isHeader ? '082044' : 'F2F2F2' },
                };

                excelCell.font = { bold: true, color: { argb: isHeader ? 'FFFFFF' : "000000" } };
                excelBorderStyles = {
                    top: { style: 'thin', color: { argb: isHeader ? (borderStyles.top !== '0px' ? 'FFFFFFFF' : 'FFFFFFFF') : "000000" } },
                    bottom: { style: 'thin', color: { argb: (rows.length === rowIndex + 1) ? "000000" : (isHeader ? (borderStyles.bottom !== '0px' ? 'FF000000' : 'FF000000') : "000000") } },
                    left: { style: '' },
                    right: (cells.length === ownCellIndex + 1) ? { style: 'thin', color: { argb: '000000' } } : {},
                };
            } else {

                if (rowBackgroundColor) {
                    const hex = rgbToHex(rowBackgroundColor)
                    if (hex) {
                        excelCell.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: hex },
                        };
                    }
                }

                const isFirstOfCtaCte = row.getAttribute("row-first-of-cta-cte") === "true"
                const forceBorderTop = cell.getAttribute("force-border-top") === "true"
                excelBorderStyles = {
                    top: isFirstOfCtaCte ? { style: 'thin', color: { argb: '000000' } } : forceBorderTop ? { style: "thin", color: computedStyle.borderTopColor ? rgbToHex(computedStyle.borderTopColor) : "000000" } : { style: '' },
                    bottom: (rows.length === rowIndex + 1) ? { style: 'thin', color: { argb: "000000" } } : { style: '' },
                    left: { style: 'thin', color: { argb: 'FFFFFFFF' } },
                    right: { style: 'thin', color: { argb: (cells.length === ownCellIndex + 1) ? '000000' : 'FFFFFFFF' } },
                };
                if (window.getComputedStyle(cell, null).getPropertyValue('font-weight') === 'bold') {
                    excelCell.font = { bold: true };
                }

                let elements = cell.querySelectorAll('*');
                for (let i = 0; i < elements.length; i++) {
                    if (window.getComputedStyle(elements[i], null).getPropertyValue('font-weight') > 400) {
                        excelCell.font = { bold: true };
                        break;
                    }
                }
            }
            excelCell.border = excelBorderStyles;

            const rowspan = cell.getAttribute('rowspan');
            if (rowspan) {
                const rowspanNum = parseInt(rowspan, 10);
                worksheet.mergeCells(rowIndex + 1, cellIndex, rowIndex + rowspanNum, cellIndex);
                excelCell.alignment = { vertical: 'middle' };
            }

            const colspan = cell.getAttribute('colspan');
            if (colspan) {
                const colspanNum = parseInt(colspan, 10);
                worksheet.mergeCells(rowIndex + 1, cellIndex, rowIndex + 1, cellIndex + colspanNum - 1);
                cellIndex += colspanNum;
            } else {
                const cellLength = cell.innerText.length + 2;
                const column = worksheet.getColumn(cellIndex);
                if (!column.width || column.width < cellLength) {
                    column.width = maxWidth > 0 ? (cellLength > maxWidth ? maxWidth : cellLength) : cellLength;
                }
                cellIndex++;
            }

        });
    });

    return workbook.xlsx.writeBuffer().then(buffer => {
        // Create a Blob from the buffer
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })

        // Create a download link and trigger the download
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    });
};

function rgbToHex(rgbString) {
    const match = rgbString.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
        const r = parseInt(match[1]);
        const g = parseInt(match[2]);
        const b = parseInt(match[3]);
        return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    }
    return null;
}