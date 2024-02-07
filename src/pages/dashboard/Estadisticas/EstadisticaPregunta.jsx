import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
} from "@material-tailwind/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function EstadisticaPregunta({
  cerrar,
  openA,
  idPregunta,
  idTest,
  pregunta,
}) {
  const [histogramData, setHistogramData] = useState([]);
  //PreguntasFormulariosGrafica
  useEffect(() => {
    Obtener_Secciones_Usuario();
  }, []);
  const Obtener_Secciones_Usuario = async () => {
    //setLoader(true);
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_ACCESLINK +
          "test/PreguntasFormulariosGrafica/" +
          idPregunta +
          "/" +
          idTest,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await response.json();
      setHistogramData(data);
      console.log(data);
      //setLoader(false);
      //console.log(data);
    } catch (error) {
      console.log(error);
      //setLoader(false);
      alert("Error");
      //colocar una alerta de error cuando no se pueda inciar sesion
      // setError(true);
      //setMensajeError(error.response.data.error);
    }
  };
  return (
    <>
      <Dialog open={openA} handler={cerrar} size="xxl">
        <DialogHeader>
          Estadistica
          <Button
            color="red"
            variant="text"
            size="md"
            className="!absolute top-3 right-3"
            onClick={cerrar}
          >
            <Typography variant="h5" color="blue-gray">
              X
            </Typography>
          </Button>
        </DialogHeader>
        <DialogBody>
          <div>{pregunta}</div>
          <BarChart
            width={900}
            height={500}
            data={histogramData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            className="mx-auto"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="r_opcion" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="cantidad" fill="#8884d8" />
          </BarChart>
        </DialogBody>
        <DialogFooter></DialogFooter>
      </Dialog>
    </>
  );
}
