import { useEffect, useState } from "react";
import "./PlanillaEvaluacion.css";
import { useParams } from "react-router-dom";
import ModalPlanillaEvaluacion from "./ModalPlanillaEvaluacion";
import axios from "axios";

const PlanillaEvaluacion = () => {
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  useEffect(() => {
    if (id) {
      fetchEntregables(id); // Usar el ID_empresa de la URL
    }
  }, [id]);

  const [grupoEmpresa, setGrupoEmpresa] = useState([]);
  const [nombresEstudiantes, setNombresEstudiantes] = useState([]);
  const [entregables, setEntregables] = useState([]);
  const [fechasEntregables, setFechasEntregables] = useState([]);

  const fetchEntregables = async (empresaId) => {
    try {
      console.log("Obteniendo datos para ID_empresa:", empresaId);

      const response = await axios.get(
        `http://localhost:8000/api/v1/grupo-empresa/${empresaId}/evaluacion`,
      );

      console.log("Respuesta del servidor:", response.data);

      const data = response.data.data; // Accedemos directamente al objeto 'data'
      console.log("Datos procesados desde el servidor:", data);

      // Extraer y asignar los datos de grupoEmpresa
      const grupoEmpresaData = {
        ID_empresa: data.grupoEmpresa.ID_empresa,
        nombre_empresa: data.grupoEmpresa.nombre_empresa,
        correo_empresa: data.grupoEmpresa.correo_empresa,
        nombre_representante: data.grupoEmpresa.nombre_representante,
        telf_representante: data.grupoEmpresa.telf_representante,
      };
      setGrupoEmpresa(grupoEmpresaData);
      console.log("Grupo empresa asignado:", grupoEmpresaData);

      // Asignar los nombres de estudiantes
      setNombresEstudiantes(data.nombresEstudiantes || []);
      console.log("Nombres de estudiantes asignados:", data.nombresEstudiantes);

      // Adaptar los entregables y extraer las fechas
      const formattedEntregables = data.entregables.map((entregable) => ({
        nombre_entregable: entregable.nombre_entregable,
        nota_entregable: entregable.nota_entregable,
        fechas_entregables: entregable.fechas_entregables, // Mantén las fechas junto con el entregable
      }));
      setEntregables(formattedEntregables);
      console.log("Entregables asignados con fechas:", formattedEntregables);

      const fechas = data.entregables.flatMap(
        (entregable) => entregable.fechas_entregables || [],
      );
      setFechasEntregables(fechas);
      console.log("Fechas de entregables asignadas:", fechas);
    } catch (error) {
      console.error("Error al obtener los datos de la empresa:", error);
    }
  };

  return (
    <section className="w-full px-10 py-6">
      <ModalPlanillaEvaluacion
        showModal={showModal}
        closeModal={closeModal}
      ></ModalPlanillaEvaluacion>

      <h2 className="text-2xl font-semibold text-primary-800">
        Planilla de evaluación
      </h2>
      <table className="mt-5 rounded-md">
        <thead className="text-primary-800">
          <tr>
            <th>{grupoEmpresa.nombre_empresa} </th>

            {/* COLUMNAS DE FECHAS ENTREGABLES */}
            {entregables.map((entregable, index) =>
              entregable.fechas_entregables.map((fecha, fechaIndex) => {
                // Convertir la fecha a formato YYYY-MM-DD
                const [dia, mes, anio] = fecha.split("/");
                const fechaISO = `${anio}-${mes}-${dia}`;
                const nombreDia = new Date(fechaISO).toLocaleDateString(
                  "es-ES",
                  {
                    weekday: "long",
                  },
                );

                return (
                  <th
                    key={`${index}-${fechaIndex}`}
                    className="fecha-entregable"
                  >
                    <div style={{ textAlign: "center" }}>
                      <div>{fecha}</div>
                      <div>
                        {nombreDia.charAt(0).toUpperCase() + nombreDia.slice(1)}
                      </div>
                    </div>
                  </th>
                );
              }),
            )}
            <th className="fecha-entregable">
              <button
                type="button"
                onClick={openModal}
                className="flex items-center justify-center mx-auto transition-colors border-2 rounded size-6 border-primary-200 text-primary-200 hover:border-primary-500 hover:text-primary-500"
              >
                <i className="fa-solid fa-plus"></i>
              </button>
            </th>

            {/* COLUMNAS DE CONTROL DE ASISTENCIA (FIJO) */}

            <th className="w-24 asistencia">
              <tr className="border-none">Nota sumativa</tr>
            </th>

            <th className="w-24 asistencia">
              <tr className="border-none">Tarde</tr>
            </th>

            <th className="w-24 asistencia">
              <tr className="border-none">Ausencia justificada</tr>
            </th>

            <th className="w-24 asistencia">
              <tr className="border-none">Ausencia injustificada</tr>
            </th>
          </tr>
        </thead>

        <tbody>
          {nombresEstudiantes.map((nombre, index) => (
            <tr key={index}>
              {/* Nombre del estudiante */}
              <td>{nombre}</td>
              <td></td> 
              {/* COLUMNAS DE NOTAS */}
              <td></td>
              <td></td> 
              {/* COLUMNA VACÍA PARA AGREGAR ENTREGABLE (FIJO) */}
              <td></td>

              {/* COLUMNA DE NOTA SUMATIVA */}
              <td></td>
              
              {/* COLUMNAS DE ASISTENCIA */}
              <td>0</td>
              <td>0</td>
              <td>0</td>
            </tr>
          ))}
        </tbody>

        <tfoot className="text-primary-800">
          <tr className="font-semibold">
            <td></td>

            {/* AGREGAR AQUI LOS NOMBRES DE LOS ENTREGABLES */}
            {entregables.map((entregable, index) => (
              <td key={index} colSpan={entregable.fechas_entregables.length}>
                {entregable.nombre_entregable}
              </td>
            ))}
            {/* ESPACIO EN BLANCO FIJO PARA LAS COLUMNAS DE ASISTENCIA Y NOTA SUMATIVA*/}
            <td colSpan={5}></td>
          </tr>
        </tfoot>
      </table>
    </section>
  );
};

export default PlanillaEvaluacion;
