<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fecha_entregable extends Model
{
    use HasFactory;

    protected $table = 'fecha_entrega';
    protected $primaryKey = 'ID_fecha_entregable';

    protected $fillable = [
        'ID_fecha_entregable',
        'fecha_entregable',
        'ID_entregable'
    ];
    
    public function entregable()
    {
        return $this->belongsTo(Entregable::class, 'ID_rubrica');
    }
}
