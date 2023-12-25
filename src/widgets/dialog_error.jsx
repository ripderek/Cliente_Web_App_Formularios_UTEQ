import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import Lottie from "lottie-react";
import anim from "../../public/anim/error.json";

export function Dialog_Error({ mensaje, titulo, cerrar }) {
  return (
    <>
      <Dialog open={true} size="sm">
        <DialogHeader>{titulo}</DialogHeader>
        <DialogBody className="font-semibold">
          {mensaje}
          <div className="mx-auto h-12">
            {/* 
            <Lottie animationData={anim} className="h-auto" />
            */}
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="gradient"
            color="yellow"
            onClick={() => cerrar(false)}
          >
            <span>Cerrar</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default Dialog_Error;
