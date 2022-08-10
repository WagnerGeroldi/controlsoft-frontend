import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from  "pdfmake/build/vfs_fonts";

export function ReportGeneral(products: any) {

  (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

  const pdfTitle = [
    {
      text: "Relatório Geral do Estoque",
      fontSize: 16,
      bold: true,
      alignment: "center",
      margin: [10, 10, 10, 15],
    },
  ];

  const data =  products.map((item: any) => {
    return [
        { text: item.name, fontSize: 9,   alignment: "center", },
            { text: item.quantity, fontSize: 9,   alignment: "center", },
            { text: item.categoryProduct, fontSize: 9,   alignment: "center", },
    ]
  })

  const dataInfo = [
    {
      table: {
        headerRows: 1,
        widths: ["*", "*", "*"],
      
        body: [
          [
            { text: "Nome", style: "tableHeader",   alignment: "center", },
            { text: "Quantidade", style: "tableHeader",   alignment: "center", },
            { text: "Categoria", style: "tableHeader",   alignment: "center", },
          ],
          ...data
        ],
      },
      layout: {
				fillColor: function (rowIndex, node, columnIndex) {
					return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
				}
      }
    },
  ];

  const footerInfo = [
    {
      text: "Unisoft Informática",
      fontSize: 12,
      bold: true,
      alignment: "center",
      margin: [10, 10, 10, 10],
    },
  ];

  const docDefinition = {
    pageSize: "A4",
    pageMargins: [20, 40, 20, 40],

    header: [pdfTitle],
    content: [dataInfo],
    footer: [footerInfo],
  };
  let win = window.open('', '_blank');
  pdfMake.createPdf(docDefinition).open({}, win);
}
