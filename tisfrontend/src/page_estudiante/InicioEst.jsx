import { useState, useEffect } from "react";
import InfoUsuario from "../components/InfoUsuario";
import Config from "../Config";
import PlaceholderIMG from "../assets/img/no-image.jpg";

const InicioEst = () => {
  //const botonesNavbar = [{ nombreBoton: " ", hrefBoton: "#" }];
  const [estudiante, setEstudiante] = useState({});
  const [empresa, setEmpresa] = useState({});
  const [docente, setDocente] = useState({});
  useEffect(() => {
    getInfoEst();
  }, []);

  const getInfoEst = async () => {
    try {
      const response = await Config.getInfoEst();
      console.log(response);
      setEstudiante(response.data);
      setEmpresa(response.data.datosEmpresa);
      setDocente(response.data.datosDocente);
    } catch (error) {
      console.error("Error al obtener la información del estudiante:", error);
    }
  };

  return (
    <section className="form-container">
      <div className="mx-auto w-fit">
        <div className="my-4 rounded-md bg-primary-600 p-3 text-center">
          <span className="text-xl font-semibold text-white">
            Bienvenido tu espacio de trabajo
          </span>
        </div>

        <article className="mx-auto mb-8 w-fit rounded-md bg-primary-600 px-6 py-5 text-white lg:mb-0">
          <h1 className="mb-8 flex justify-center text-lg font-semibold lg:mb-4">
            Información de usuario
          </h1>
          <section className="flex flex-col gap-5 lg:flex lg:flex-row lg:gap-10">
            <div className="order-last min-w-96 max-w-fit space-y-2 lg:order-first">
              <InfoUsuario
                icono={<i className="fa-solid fa-user"></i>}
                titulo={"Usuario: "}
                info={`${estudiante.nombre} ${estudiante.apellido}`}
              />

              <InfoUsuario
                icono={<i className="fa-solid fa-envelope"></i>}
                titulo={"Correo: "}
                info={estudiante.correo}
              />

              <InfoUsuario
                icono={<i className="fa-solid fa-id-badge"></i>}
                titulo={"Código SISS: "}
                info={estudiante.cod_sis}
              />

              <InfoUsuario
                icono={<i className="fa-solid fa-building"></i>}
                titulo={"Grupo-empresa: "}
                info={
                  empresa?.nombre_empresa
                    ? empresa.nombre_empresa
                    : "No esta registrado"
                }
              />

              <InfoUsuario
                icono={<i className="fa-solid fa-graduation-cap"></i>}
                titulo={"Docente: "}
                info={
                  docente?.nombre && docente?.apellido
                    ? `${docente.nombre} ${docente.apellido}`
                    : "No tiene docentes registrados"
                }
              />
            </div>

            <div className="relative flex items-center justify-center">
              <img
                src={PlaceholderIMG}
                alt="avatar'usuario"
                className="absolute size-32 rounded-full"
              />
              <img
                src={`https://ui-avatars.com/api/?size=100&bold=true&rounded=true&name=${estudiante.nombre}+${estudiante.apellido}`}
                alt=""
                className="relative z-10 size-32"
                loading="lazy"
              />
            </div>
          </section>
        </article>
      </div>
    </section>
  );
};

export default InicioEst;
