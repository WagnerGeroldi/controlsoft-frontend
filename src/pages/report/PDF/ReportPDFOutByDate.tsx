import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from  "pdfmake/build/vfs_fonts";
import { HandleOnlyDate } from "../../../services/HandleOnlyDate";

export function ReportPDFOutByDate(products: any, initialDate: string, finalDate: string) {
  
  // (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
  (pdfMake as any).vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfMake.vfs;

  function reverseDate(date) {
    var splitDate = date.split("");    
    var reverseArray = [splitDate[8], splitDate[9],splitDate[7],splitDate[5],splitDate[6],splitDate[4],splitDate[0],splitDate[1],splitDate[2],splitDate[3]];
    var joinDate = reverseArray.join("");
    return joinDate;
  }

  

  const pdfTitle = [
    {
      text: `Relatório de Saídas de ${reverseDate(initialDate)} até ${reverseDate(finalDate)} `,
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
  pdfMake.createPdf(docDefinition).download(`Relatório de Baixas ${reverseDate(initialDate)} até ${reverseDate(finalDate)} `);
}
