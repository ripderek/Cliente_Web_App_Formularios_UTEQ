import { useState, useEffect } from "react";
import {
  PencilIcon,
  UserPlusIcon,
  PlusCircleIcon,
  XCircleIcon,
  CheckCircleIcon,
  PlusIcon,
  Bars3Icon,
  ClipboardDocumentCheckIcon,
  ClipboardIcon,
  TrashIcon,
  CogIcon,
  Cog6ToothIcon,
  AdjustmentsHorizontalIcon,
  ChartBarIcon,
  PresentationChartBarIcon,
  UserIcon,
  Square3Stack3DIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";
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
  Alert,
} from "@material-tailwind/react";

export default function OpcionesParticipantes({ cerrar, id_participante }) {
  return (
    <div>
      <Dialog open={true} handler={cerrar} size="xl">
        <DialogHeader>
          Opciones participante
          <IconButton
            className="!absolute top-3 right-3 bg-transparent shadow-none"
            onClick={cerrar}
          >
            <XCircleIcon className="w-11" color="orange" />
          </IconButton>
        </DialogHeader>
        <DialogBody>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-5">
            <div
              key={0}
              className={`bg-blue-gray-50  shadow-2xl rounded-none cursor-pointer border-4 border-green-900 hover:border-orange-600  `}
            >
              <div className="mx-auto">
                <div className="text-center">
                  <ArrowRightOnRectangleIcon className="h-16 mx-auto" />
                </div>
                <div className="w-full p-4 text-center font-bold text-black text-xl">
                  <span> Ingresos </span>
                </div>
              </div>
            </div>
            <div
              key={1}
              className={`bg-blue-gray-50  shadow-2xl rounded-none cursor-pointer border-4 border-green-900 hover:border-orange-600  `}
            >
              <div className="mx-auto">
                <div className="text-center">
                  <AdjustmentsHorizontalIcon className="h-16 mx-auto" />
                </div>
                <div className="w-full p-4 text-center font-bold text-black text-xl">
                  <span>Progreso </span>
                </div>
              </div>
            </div>
            <div
              key={2}
              className={`bg-blue-gray-50  shadow-2xl rounded-none cursor-pointer border-4 border-green-900 hover:border-orange-600  `}
            >
              <div className="mx-auto">
                <div className="text-center">
                  <XCircleIcon className="h-16 mx-auto" />
                </div>
                <div className="w-full p-4 text-center font-bold text-black text-xl">
                  <span>Expulsar </span>
                </div>
              </div>
            </div>
            <div
              key={3}
              className={`bg-blue-gray-50  shadow-2xl rounded-none cursor-pointer border-4 border-green-900 hover:border-orange-600  `}
            >
              <div className="mx-auto">
                <div className="text-center">
                  <XCircleIcon className="h-16 mx-auto" />
                </div>
                <div className="w-full p-4 text-center font-bold text-black text-xl">
                  <span>Reestablecer progreso </span>
                </div>
              </div>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>{/*  AQUI VA EL FOOTER SI ES NECESARIO */}</DialogFooter>
      </Dialog>
    </div>
  );
}
