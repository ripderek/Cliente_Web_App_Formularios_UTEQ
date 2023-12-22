import React from "react";
import Lottie from "lottie-react";
import anim from "../../public/anim/loader.json";
import { Dialog, DialogHeader } from "@material-tailwind/react";

export function Loader() {
  return (
    <Dialog open={true} className="w-9" size="xs">
      <DialogHeader>
        <div className="mx-auto">
          <Lottie animationData={anim} className="w-32 mx-auto" />
        </div>
      </DialogHeader>
    </Dialog>
  );
}

export default Loader;
