import "../components/background.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Importar useParams
import ItemBacklog from "../components/grupo-empresa/ItemBacklog";
import ItemTablaSprint from "../components/grupo-empresa/ItemTablaSprint";
import "../components/grupo-empresa/RegistroEmpresa.css";
import axios from "axios";
import "../components/grupo-empresa/ProductBacklog.css";

const VistaBacklog = () => {
  const { id } = useParams(); // Obtener el ID_empresa de la URL
  const [backlogItems, setBacklogItems] = useState([]);
  const [sprintItems, setSprintItems] = useState([]);

  useEffect(() => {
    if (id) {
      fetchBacklog(id); // Usar el ID_empresa de la URL
      fetchSprints(id);
    }
  }, [id]);

  // Función para obtener las historias de usuario
  const fetchBacklog = async (empresaId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/grupo-empresa/${empresaId}/historias`
      );

      // Adaptar las historias de usuario
      const historias = response.data.map((historia) => ({
        ID_historia: historia.ID_historia,
        titulo: historia.titulo,
        descripcion: historia.descripcion,
        sprint: historia.sprint
          ? {
              ID_sprint: historia.sprint.ID_sprint,
              nombre_sprint: historia.sprint.nombre_sprint,
              fecha_inicio: historia.sprint.fecha_inicio,
              fecha_fin: historia.sprint.fecha_fin,
            }
          : null, // Si no hay sprint, asignar null
      }));

      setBacklogItems(historias || []);
      console.log(historias); // Verificar en consola
    } catch (error) {
      console.error("Error al obtener el backlog del producto:", error);
    }
  };

  // Función para obtener los sprints
  const fetchSprints = async (empresaId) => {
    try { 
      const response = await axios.get(
        `http://localhost:8000/api/v1/grupo-empresa/${empresaId}/sprints`
      );
      setSprintItems(response.data.sprints || []);
      console.log(response.data.sprints);
    } catch (error) {
      console.error("Error al obtener los sprints:", error);
    }
  };

  return (
    <section className="w-full pt-8 bg-white background">
      <div className="mx-auto w-fit">
        <div className="w-full px-10 py-6 product-backlog">
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold text-primary-800">
              Product Backlog
            </h1>
          </div>

          <div className="flex gap-8 mt-5">
            {/* Tabla de historias de usuario */}
            <section className="flex-1 border rounded-md tabla-backlog border-primary-800">
              <div className="flex justify-between px-6 py-3 font-semibold border-b border-primary-800 text-primary-800">
                <span>Historia de usuario</span>
                <span># Sprint</span>
              </div>
              <div className="p-3 space-y-2">
                {backlogItems.length > 0 ? (
                  backlogItems.map((item) => (
                    <ItemBacklog
                      key={item.ID_historia}
                      id_hu={item.ID_historia}
                      nombre_hu={item.titulo}
                      num_sprint={item.sprint?.nombre_sprint || "No asignado"}
                    />
                  ))
                ) : (
                  <p>No hay historias de usuario en el backlog</p>
                )}
              </div>
            </section>

            {/* Tabla de sprints */}
            <section className="border rounded-md tabla-sprint border-primary-800">
              <div className="flex justify-between px-6 py-3 font-semibold border-b border-primary-800 text-primary-800">
                <span>Sprints</span>
              </div>
              <div className="p-3 space-y-2">
                {sprintItems.length > 0 ? (
                  sprintItems.map((sprint) => (
                    <ItemTablaSprint
                      key={sprint.ID_sprint}
                      nombre_sprint={sprint.nombre_sprint}
                    />
                  ))
                ) : (
                  <p>No hay sprints asignados</p>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VistaBacklog;
