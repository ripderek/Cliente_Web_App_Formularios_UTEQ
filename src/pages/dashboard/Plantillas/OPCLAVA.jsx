//OPCLAVA
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Checkbox,
  Button,
  Input,
  Select,
  Option,
  Tooltip,
} from "@material-tailwind/react";
import { useRef, useState } from "react";
import { AiOutlineUpload } from "react-icons/ai";
import axios from "axios";
import { Dialog_Error, Loader, Notification } from "@/widgets"; //Importar el componente
const TABLE_HEAD = ["Num", "Clave", "Tipo", ""];
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";
export default function OPCLAVA({
  tipo_preg,
  id_nivel,
  icono,
  AbrirEditor,
  cambiarPestañas,
  //AbrirEditarMEMRZAR,
}) {
  const [open, setOpen] = useState(true);
  const handleOpen = () => setOpen((cur) => !cur);
  //variable para detectar un error y mostrar el error
  const [error, setError] = useState(false);
  //variable para almacenar el mensaje del error
  const [mensajeError, setMensajeError] = useState("");
  //variable para mostrar el loader cuando carga una peticion
  const [load, setLoader] = useState(false);
  const fileInputRef = useRef(null);
  const cerrar1 = (valor) => {
    setError(valor);
  };
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Activa el input de tipo "file"
    }
  };
  //img preview
  const [file, setFile] = useState(null);
  const [fileP, setFileP] = useState();
  const ImagePreview = (e) => {
    try {
      setFile(e.target.files[0]);
      setFileP(URL.createObjectURL(e.target.files[0]));
    } catch (error) {
      console.log(error);
    }
  };
  //funcion para guardar crear la pregunta en la base de datos
  //primero los estados que necesito definir para poder crearlos
  const [enunciado, setEnunciado] = useState("");
  const [tiempoRespuesta, setTiempoRes] = useState(0);
  const [timepoImg, setTiempoIMG] = useState(0);
  //funcion para crear la pregunta
  const Crear_pregunta = async () => {
    //process.env.NEXT_PUBLIC_ACCESLINK
    //Router.push("/Inicio");
    setLoader(true);
    try {
      const form = new FormData();
      form.set("file", file);
      form.set("p_enunciado", enunciado);
      form.set("p_tiempos_segundos", tiempoRespuesta);
      form.set("p_tipo_pregunta", tipo_preg);
      form.set("p_id_nivel", id_nivel);
      //Antes era un JSON pero ahora solo se envia un valor xd skere modo diablo
      //form.set("p_claves_valor", JSON.stringify(datos));
      form.set("p_clave", primerClave);
      form.set("p_tiempo_enunciado", timepoImg);
      console.log(datos);
      //form.set("p_tiempo_img", 100);
      //en esta funcion se enviaba como jSON ---> Crear_pregunta_clave_valor
      const result = await axios.post(
        process.env.NEXT_PUBLIC_ACCESLINK +
          "preguntas/Crear_pregunta_clave_valor_noJSON",
        form,
        {
          withCredentials: true,
        }
      );
      setLoader(false);
      //se manda 0 como id porque se desconoce el id de la pregunta que se creo, y se envia true como segundo parametro para que relize la busqueda de la ultima pregunta en la sigueinte ventana en un useEffect
      //      AbrirEditor("SELCCLA", id_nivel, true);
      AbrirEditor("OPCLAVA", id_nivel, true);
    } catch (error) {
      console.log(error);
      setLoader(false);
      //colocar una alerta de error cuando no se pueda inciar sesion
      setMensajeError(error.response.data.message);
      //alert(error.response.data.error);
      setError(true);
    }
  };
  const [primerClave, setPrimerCLave] = useState("");
  //estado para almacenar las claves con el tipo para agregar a la pregunta
  const [datos, setDatos] = useState([]);
  //funcion para almacenar la data en el array de datos
  const agregarDato = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
    //el datos.lenght sirve para determinarle un id y poder luego borrarlo mediante un boton
    /*
    setDatos([
      ...datos,
      {clave: valor, tipo: seleccion },
    ]);
    console.log(datos);
    */
  };
  //eliminar datos
  const eliminarDato = (id) => {
    // Filtrar los datos para excluir el elemento con el id proporcionado
    const nuevosDatos = datos.filter((dato) => dato.id !== id);
    // Actualizar el estado con los nuevos datos
    setDatos(nuevosDatos);
  };
  //PARA EL COMBOBOX
  const [seleccion, setSeleccion] = useState("");
  const [valor, setValor] = useState("");

  return (
    <Card className="w-auto mx-auto rounded-none">
      {load ? <Loader /> : ""}
      {error ? (
        <Dialog_Error
          mensaje={mensajeError}
          titulo="Error al llenar el formulario"
          cerrar={cerrar1}
        />
      ) : (
        ""
      )}
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-1 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h4" color="orange">
              Pregunta con ingreso de datos
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Tooltip content="Regresar">
              <Button
                variant="outlined"
                size="sm"
                color="orange"
                onClick={() => cambiarPestañas("openPreguntas")}
              >
                <ArrowLeftOnRectangleIcon strokeWidth={2} className="h-6 w-6" />
              </Button>
            </Tooltip>
          </div>
        </div>
      </CardHeader>
      <CardBody className="flex flex-col gap-4">
        <Typography className="text-lg font-bold" color="black">
          Escriba el enunciado:
        </Typography>
        <textarea
          className="border p-2 border-yellow-900 rounded-sm"
          size="lg"
          onChange={(e) => setEnunciado(e.target.value)}
        />
        <div className="flex items-center">
          <Typography className="text-lg font-bold" color="black">
            Tiempo disponible para responder (segundos):
          </Typography>
          <input
            className="ml-6 w-16 p-2 border  rounded-sm border-yellow-900 "
            type="number"
            onChange={(e) => setTiempoRes(e.target.value)}
          />
        </div>
        <Typography className="text-lg font-bold" color="black">
          Imagen del enunciado:
        </Typography>
        <div className="mx-auto bg-yellow-800 p-2 rounded-xl">
          <label htmlFor="fileInput" className="text-white font-bold ">
            Subir Foto:
          </label>
          <input
            type="file"
            id="fileInput"
            onChange={ImagePreview}
            accept="image/png, .jpeg"
            className="hidden"
            ref={fileInputRef}
          />
          <Button
            className="ml-3  rounded-xl  bg-white h-11"
            onClick={handleButtonClick}
          >
            <AiOutlineUpload size="25px" color="black" />
          </Button>
        </div>

        <img
          src={
            !fileP
              ? process.env.NEXT_PUBLIC_ACCESLINK + "preguntas/Icono/" + icono
              : fileP
          }
          alt="Imagen"
          className="mt-3 h-64 w-auto mx-auto"
        />
        {/* AQUI VA LA TABLA PARA PODER INGRESAR LOS TIPOS DE DATOS QUE EXISTEN COMO CLAVES PARAS RESPUESTAS*/}
        <div>
          <Typography className="text-lg font-bold" color="black">
            Datos a ingresar en cada respuesta:
          </Typography>
          {/* Aqui colocar el input, combobox y el boton de agregar a la tabla la clave xd*/}
          <div className="mb-3 mt-4">
            <div className="flex w-full flex-row gap-6 mt-2">
              <Input
                className=" border-4 border-yellow-900"
                type="text"
                variant="outlined"
                label="Primer Dato"
                color="orange"
                valor={primerClave}
                onChange={(e) => setPrimerCLave(e.target.value)}
              />
              {/* 
              <Input
                className="mb-4"
                type="text"
                variant="outlined"
                label="Segundo dato"
                color="green"
                //onChange={(e) => setValor(e.target.value)}
              />
              */}
            </div>
            {/**
            <div className="flex w-full flex-row gap-6 mt-2">
              <Select size="md" label="Select Version" color="green">
                <Option onClick={() => setSeleccion("Texto")}>Texto</Option>
                <Option onClick={() => setSeleccion("Numero")}>Numero</Option>
              </Select>
            </div>
 */}
          </div>
          {/**
          <table className="w-3/4 mx-auto min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
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
              {datos.map(({ id, clave, tipo }, index) => {
                const isLast = index === datos.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={id}>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {index + 1}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {clave}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {tipo}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        as="a"
                        href="#"
                        variant="small"
                        color="blue-gray"
                        className="font-medium"
                        onClick={() => eliminarDato(id)}
                      >
                        Eliminar
                      </Typography>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
           */}
        </div>

        <div className="flex items-center">
          <Typography className="text-lg font-bold" color="black">
            Tiempo disponible para memorizar la imagen (segundos):
          </Typography>
          <input
            className="ml-6 w-16 p-2 border  rounded-sm border-yellow-900 "
            type="number"
            onChange={(e) => setTiempoIMG(e.target.value)}
          />
        </div>
      </CardBody>
      <CardFooter className="pt-0">
        <Button
          variant="gradient"
          fullWidth
          color="green"
          onClick={Crear_pregunta}
        >
          Crear Pregunta
        </Button>
      </CardFooter>
    </Card>
  );
}
