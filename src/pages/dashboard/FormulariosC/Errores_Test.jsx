import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Card,
  CardHeader,
  Input,
  Typography,
  CardBody,
  Chip,
  CardFooter,
  Tabs,
  TabsHeader,
  Tab,
  Avatar,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
const TABLE_HEAD_1 = ["", "Error"];
import { useEffect, useState } from "react";
import { Dialog_Error, Loader, Notification } from "@/widgets"; //Importar el componente

export default function Errores_Test({ cerrar, id_test }) {
  const [erroresTest, setErroresTest] = useState([]);
  const [load, setLoader] = useState(false);
  useEffect(() => {
    ObtnerErroresTest();
  }, []);
  //hacer una funcion que retorne todos los errores de un test
  const ObtnerErroresTest = async () => {
    setLoader(true);
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_ACCESLINK + "test/TestErrores/" + id_test,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await response.json();
      setErroresTest(data);
      //console.log(result.data);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };
  return (
    <Dialog open={true} size="sm">
      {load ? <Loader /> : ""}
      <DialogHeader>Lista de Errores</DialogHeader>
      <DialogBody className="font-semibold">
        Corrija los siguientes errores para habilitar el test
        <table className="mt-4 w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD_1.map((head) => (
                <th
                  key={head}
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {erroresTest.map(
              ({ r_id_error, r_error_detalle, r_estado }, index) => {
                const isLast = index === erroresTest.length - 1;
                const classes = isLast
                  ? "p-4 cursor-pointer"
                  : "p-4 cursor-pointer border-b border-blue-gray-50";

                return (
                  <tr key={r_id_error}>
                    <td className={classes}>
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {index + 1}
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <Tooltip content="Seleccionar Opcion">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {r_error_detalle}
                            </Typography>
                          </Tooltip>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </DialogBody>
      <DialogFooter>
        <Button variant="gradient" color="yellow" onClick={() => cerrar(false)}>
          <span>Cerrar</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
