import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from  "pdfmake/build/vfs_fonts";
import { HandleOnlyDate } from "../../../services/HandleOnlyDate";

export function ReportPDFOutByDate(products: any, initialDate: string, finalDate: string) {
  
  // (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
  (pdfMake as any).vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfMake.vfs;

  const iniDate = HandleOnlyDate(new Date(initialDate))
  const fDate = HandleOnlyDate(new Date(finalDate))

  const pdfTitle = [
    {
      text: `Relatório de Saídas de ${iniDate.props.children} até ${fDate.props.children} `,
      fontSize: 16,
      bold: true,
      alignment: "center",
      margin: [10, 10, 10, 10],
    },
  ];

  const data = products.map((item: any) => {

    const date = HandleOnlyDate(new Date(item.updatedAt))
   
    return [
      { text: item.product, fontSize: 9, alignment: "center" },
      { text: item.quantity, fontSize: 9, alignment: "center" },
      { text: date.props.children, fontSize: 9, alignment: "center" },
    ];
  });

  const dataInfo = [
    {
      table: {
        headerRows: 1,
        widths: ["*", "*", "*"],
        alignment: "center",

        body: [
          [
            { text: "Nome", style: "tableHeader", alignment: "center" },
            { text: "Quantidade", style: "tableHeader", alignment: "center" },
            { text: "Data da Baixa", style: "tableHeader", alignment: "center" },
          ],
          ...data,
        ],
      },
      layout: {
        fillColor: function (rowIndex, node, columnIndex) {
          return rowIndex % 2 === 0 ? "#CCCCCC" : null;
        },
      },
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

  const docDefinition: any = {
    pageSize: "A4",
    pageMargins: [20, 40, 20, 40],

    header: [pdfTitle],
    content: [dataInfo],
    footer: [footerInfo],
  };
  pdfMake.createPdf(docDefinition).download();
}
