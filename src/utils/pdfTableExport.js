import jsPDF from 'jspdf';
import 'jspdf-autotable';

const exportPdfTable = (columns, rows, title, footer, fileName) => {
  const doc = new jsPDF();
  doc.text(title, 20, 10);

  doc.autoTable({
    theme: 'striped',
    head: [columns.map((col) => col.Header)],
    columns: columns.map((col) => ({
      ...col,
      dataKey: col.accessorKey,
      cell: (row, col) => row[col.dataKey]
    })),
    // Align the content to center
    halign: 'auto',
    lineWidth: 0.5,
    body: rows,
    foot: footer ? [footer] : null,
    bodyStyles: {
      fontSize: 10,
      cellPadding: 1,
      valign: 'middle'
    },
    footStyles: footer
      ? {
          fillColor: [44, 44, 44],
          textColor: [210, 210, 210],
          fontSize: 10
        }
      : null,
    didParseCell: (data) => {
      data.cell.width = 50;
      if (data.cell && data.cell.section === 'head') {
        // align the last column to the right
        // get the last column name
        const col = columns[columns.length - 1];
        // check if the current column name is the same as the last column name
        if (data.column.dataKey === col.accessorKey && footer) {
          data.cell.styles.halign = 'right';
        } else {
          data.cell.styles.halign = 'left';
        }
      }
      if (data.cell && data.cell.section === 'body') {
        const col = columns[columns.length - 1];
        if (data.column.dataKey === col.accessorKey && footer) {
          data.cell.styles.halign = 'right';
        } else {
          data.cell.styles.halign = 'left';
        }
      }
      if (data.cell && data.cell.section === 'foot') {
        data.cell.styles.halign = 'right';
      }
    },

    showFoot: footer ? 'lastPage' : null,
    // Add a total at the end of the report
    didDrawPage: (data) => {
      let str = 'Page ' + data.pageCount;
      // Total page number plugin only available in jspdf v1.0+
      if (typeof doc.putTotalPages === 'function') {
        //Get the total page number
        str = str + '/' + doc.internal.getNumberOfPages();
      }
      doc.setFontSize(10);
      // Draw horizontal line above footer

      doc.setLineWidth(0.1);
      doc.line(20, doc.internal.pageSize.height - 30, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 30);
      // Text at 12mm from bottom

      doc.setFontSize(10);
      doc.setTextColor(40);

      // If we use 'left' or 'center' alignment, we must set x and y position
      // Put the footer page info on the right corner

      // align it to the right
      doc.text(str, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10, {
        align: 'right'
      });
    }
  });
  doc.save(fileName);
};

export default exportPdfTable;
