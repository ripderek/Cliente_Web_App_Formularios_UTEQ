import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Checkbox,
  IconButton,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import Cookies from "universal-cookie";
import axios from "axios";
import { Dialog_Error, Loader, Notification } from "@/widgets"; //Importar el componente

import { XCircleIcon } from "@heroicons/react/24/solid";

export default function AddSeccion({ cerrar, id_seccion }) {
  return (
    <>
      <Dialog size="xs" open={true} className="bg-transparent shadow-none">
        <Card className="mx-auto w-full max-w-[24rem]">
          <CardBody className="flex flex-col gap-4">
            <Typography variant="h4" color="blue-gray">
              Agregar Seccion
            </Typography>
            <IconButton
              className="!absolute top-3 right-3 bg-transparent shadow-none"
              onClick={() => cerrar()}
            >
              <XCircleIcon className="w-11" color="orange" />
            </IconButton>

            <Typography
              className="mb-3 font-normal"
              variant="paragraph"
              color="gray"
            >
              Llene el formulario
            </Typography>

            <Input label="Cantidad de niveles" size="lg" name="p_Titulo" />

            {/* 
          <div className="-ml-2.5 -mt-3">
            <Checkbox label="Remember Me" />
          </div>
          */}
          </CardBody>
          <CardFooter className="pt-0">
            <Button variant="gradient" fullWidth color="green">
              Aceptar
            </Button>
          </CardFooter>
        </Card>
      </Dialog>
    </>
  );
}
