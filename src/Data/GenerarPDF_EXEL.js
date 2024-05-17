// generarPDF.js
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import ExcelJS from "exceljs";
import html2canvas from "html2canvas";
import { useState } from "react";
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

import rutaImagen from '../../public/img/Home/clasicoimagenes.png';

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
                "N°",
                "Nombres y Apellidos",
                "Correo Institucional",
                "Superó Límite",
                "Fecha Agregado",
              ],
              ...participantes,
            ],
            layout: {
              defaultBorder: false,
              paddingLeft: function (i) {
                return i === 0 ? 0 : 8;
              },
              paddingRight: function (i, node) {
                return i === node.table.widths.length - 1 ? 0 : 8;
              },
              paddingTop: function (i) {
                return i === 0 ? 0 : 4;
              },
              paddingBottom: function (i, node) {
                return i === node.table.body.length - 1 ? 0 : 4;
              },
            },
            heights: function () {
              return 35;
            }, // Ajusta este valor según tu preferencia
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

//PDF Progreso preguntas

const generarPDF_Progreso_Pre = async (dataPromise) => {
  try {
    // Esperamos a que se resuelva la promesa para obtener los datos
    const data = await dataPromise;

    // Mapeamos los datos para generar el contenido del PDF
    const contenido = [];

    for (const preguntaResultado of data[0].resultado) {
      //console.log(preguntaResultado);
      contenido.push(
        { text: preguntaResultado.pregunta, style: "subheader" },
        {
          image: await generarGraficoImagen(preguntaResultado.respuestas),
          width: 500,
          height: 300,
        }
      );
    }

    const docDefinition = {
      content: [
        { text: "Reporte de Encuestas", style: "header", alignment: "center" },
        ...contenido,
      ],
      styles: {
        header: {
          fontSize: 20,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5],
        },
      },
    };

    // Creamos y descargamos el PDF
    pdfMake.createPdf(docDefinition).download("Reporte_Encuestas.pdf");
  } catch (error) {
    console.log(error);
  }
};

const generarGraficoImagen = async (respuestas) => {
  try {
    //console.log(respuestas);
    const histogramData = respuestas.map((respuesta) => ({
      respuesta: respuesta.respuesta,
      cantidad: parseInt(respuesta.Num_Personas),
    }));

    // Creamos un div para contener el gráfico
    const div = document.createElement("div");
    div.style.width = "500px";
    div.style.height = "300px";
    document.body.appendChild(div);

    // Creamos un nodo raíz con createRoot y lo asociamos al div
    const root = createRoot(div);

    // Renderizamos el gráfico de barras utilizando recharts
    const chart = (
      <BarChart
        width={500}
        height={300}
        data={histogramData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="respuesta" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="cantidad" fill="#02B92E" />
      </BarChart>
    );

    // Renderizamos el gráfico en el nodo raíz
    root.render(chart);
    // Renderizamos el componente en el div
    //createRoot(div).render(chart);

    // Capturamos el contenido del div como una imagen con html2canvas
    // Espera 500 milisegundos antes de capturar el contenido del div
    await new Promise(resolve => setTimeout(resolve, 1000));
    const canvas = await html2canvas(div);

    // Convertimos el canvas en una imagen
    const imgData = canvas.toDataURL("image/png");

    // Removemos el div del DOM
    document.body.removeChild(div);
    
    console.log(canvas);
    console.log(imgData);
    return imgData;

  } catch (error) {
    console.log(error);
  }
};

const generarPDF_Progreso_Prevale = async (data) => {
  try {
    // Creamos un array de objetos para el contenido del PDF
    const content = [];

    // Recorremos los datos y agregamos las preguntas y opciones al contenido del PDF
    data.forEach((item) => {
      // Agregamos la pregunta al contenido
      content.push({ text: item.r_pregunta, style: "pregunta" });

      // Creamos un array de objetos para las opciones y la cantidad
      const opciones = [
        {
          respuesta: item.r_respuesta,
          cantidad: parseInt(item.r_num_personas_respondieron),
        },
      ];

      // Creamos una tabla con las opciones y la cantidad
      const tableRows = opciones.map((opcion) => [
        opcion.respuesta,
        opcion.cantidad,
      ]);
      content.push({
        table: {
          widths: ["*", "auto"],
          body: [["Respuesta", "Cantidad"], ...tableRows],
        },
        layout: "lightHorizontalLines",
        margin: [0, 0, 0, 10], // Margen inferior entre cada pregunta y opciones
      });
    });

    // Definimos el documento PDF
    const docDefinition = {
      content: content,
      styles: {
        pregunta: {
          fontSize: 16,
          bold: true,
          margin: [0, 0, 0, 5], // Margen inferior después de cada pregunta
        },
      },
    };

    // Creamos y descargamos el PDF
    pdfMake.createPdf(docDefinition).download("Reporte_Preguntas.pdf");
  } catch (error) {
    console.log(error);
  }
};

const generarExcel_Progreso_Pre = (data) => {};

// Exportar las funciones
export {
  generarPDF,
  generarExcel,
  generarPDF_Progreso_Pre,
  generarExcel_Progreso_Pre,
};
