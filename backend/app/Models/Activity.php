<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    protected $fillable = ['id', 'entity_id', 'entity_name_snapshot', 'entity_type_snapshot', 'region_snapshot', 'segment', 'visit_date', 'sales_name', 'status'];

    public function entity()
    {
        return $this->belongsTo(Entity::class, 'entity_id', 'id');
    }
}
