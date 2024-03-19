import React from "react";
import Lottie from "lottie-react";
import anim from "../../public/anim/loader.json";
import { Dialog, DialogHeader,Card } from "@material-tailwind/react";

export function Loader() {
  return (
    <Dialog open={true} className=" bg-transparent shadow-none" size="xs" animate={{
      mount: { scale: 1, y: 0 },
      unmount: { scale: 0.9, y: -100 },
    }}>
      <DialogHeader >

        <div className="mx-auto bg-white">
          <Lottie animationData={anim} className="w-32 mx-auto" />
        </div>

      </DialogHeader>
      
    </Dialog>
  );
}

export default Loader;
