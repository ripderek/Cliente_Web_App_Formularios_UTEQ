import { useState } from "react";
import { Alert, IconButton } from "@material-tailwind/react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
export function Notification({ mensaje, abrir, crear }) {
  const [open, setOpen] = useState(false);
  return (
    <Alert
      color="green"
      icon={<CheckCircleIcon className="h-10" />}
      className="fixed bottom-1 right-8 z-40 w-auto "
      onClose={() => crear(false)}
      open={abrir}
    >
      {mensaje}
    </Alert>
  );
}

export default Notification;
