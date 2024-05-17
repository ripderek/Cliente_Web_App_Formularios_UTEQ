// generarPDF.js
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import ExcelJS from "exceljs";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const generarPDF = (ListaParticipantes) => {
  try {
    let contador = 1;
    const participantes = ListaParticipantes.map((participante) => [
      contador++,
      participante.r_nombres_apellidos,
      participante.r_correo_institucional,
      participante.r_supero_limite ? "Si" : "No",
      participante.r_fecha_add,
    ]);

    const docDefinition = {
      content: [
        { text: "hola ", style: "test" },
        { text: "Lista de Participantes del test", style: "header" },
        { text: " ", style: "subheader" },
        {
          table: {
            headerRows: 1,
            body: [
              [
                "Num",
                "Nombres y Apellidos",
                "Correo Institucional",
                "Superó Límite",
                "Fecha Agregado",
              ],
              ...participantes,
            ],
            layout: "noBorders",
            minCellHeight: 100,
          },
        },
      ],
      styles: {
        test: {
          fontSize: 20,
          bold: true,
          alignment: "center",
          margin: [0, 0, 0, 10],
        },
        header: {
          fontSize: 16,
          bold: true,
          alignment: "center",
        },
        subheader: {
          fontSize: 12,
          alignment: "center",
        },
      },
    };
    pdfMake.createPdf(docDefinition).download("Reporte_Participantes.pdf");
  } catch (error) {
    console.log(error);
  }
};

//Exel

const generarExcel = (ListaParticipantes) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Participantes");

    // Definir las columnas de la tabla
    worksheet.columns = [
      { header: "Num", key: "num", width: 10 },
      { header: "Nombres y Apellidos", key: "nombresApellidos", width: 30 },
      { header: "Correo Institucional", key: "correoInstitucional", width: 30 },
      { header: "Superó Límite", key: "superoLimite", width: 15 },
      { header: "Fecha Agregado", key: "fechaAgregado", width: 20 },
    ];

    // Agregar datos de participantes
    ListaParticipantes.forEach((participante, index) => {
      worksheet.addRow({
        num: index + 1,
        nombresApellidos: participante.r_nombres_apellidos,
        correoInstitucional: participante.r_correo_institucional,
        superoLimite: participante.r_supero_limite ? "Si" : "No",
        fechaAgregado: participante.r_fecha_add,
      });
    });

    // Escribir el archivo Excel
    workbook.xlsx
      .writeBuffer()
      .then((buffer) => {
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Reporte_Participantes.xlsx";
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error al generar el archivo Excel:", error);
      });
  } catch (error) {
    console.log(error);
  }
};

// Exportar las funciones
export { generarPDF, generarExcel };
