<?php

namespace App\Http\Controllers\Api\Docente;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Entregable;
use App\Models\GrupoEmpresa;
use Illuminate\Support\Facades\Validator;

class EntregableController extends Controller
{

    public function getEntregables($empresaId)
{
    try {
        $response = ["success" => false];

        // Buscar la grupoempresa con estudiantes y entregables (incluyendo fechas de entregables)
        $grupoEmpresa = GrupoEmpresa::with([
            'estudiantes.user',
            'entregables.fecha_entregable' // Incluye las fechas de los entregables
        ])->where('ID_empresa', $empresaId)->first();

        if (!$grupoEmpresa) {
            return response()->json(['error' => 'Grupo empresa no encontrada'], 404);
        }

        $datosFiltrados = [
            "grupoEmpresa" => [
                "ID_empresa" => $grupoEmpresa->ID_empresa,
                "nombre_empresa" => $grupoEmpresa->nombre_empresa,
                "correo_empresa" => $grupoEmpresa->correo_empresa,
                "nombre_representante" => $grupoEmpresa->nombre_representante,
                "telf_representante" => $grupoEmpresa->telf_representante,
            ],
            "nombresEstudiantes" => $grupoEmpresa->estudiantes->map(function ($estudiante) {
            // Verificar si existe el usuario antes de acceder al nombre y apellido
            return $estudiante->user ? $estudiante->user->nombre . ' ' . $estudiante->user->apellido : null;
            })->filter()->toArray(), // Filtra los valores nulos
            "entregables" => $grupoEmpresa->entregables->map(function ($entregable) {
                return [
                    "nombre_entregable" => $entregable->nombre_entregable,
                    "nota_entregable" => $entregable->nota_entregable,
                    "fechas_entregables" => $entregable->fecha_entregable->map(function ($fecha) {
                        return $fecha->fecha_entregable;
                    })->toArray(),
                ];
            })->toArray(),
        ];

        // Preparar la respuesta
        $response["success"] = true;
        $response["data"] = $datosFiltrados;

        return response()->json($response, 200);

    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}
}
