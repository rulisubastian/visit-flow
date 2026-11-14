<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\Entity;
use Illuminate\Http\Request;

class EntityController extends Controller
{
    public function index(Request $request)
    {
        $segment = $request->query('segment');
        $search = $request->query('search');

        // 1. Ambil dari Master Data
        $masterQuery = Entity::query();
        if ($segment) {
            $masterQuery->where('segment', $segment);
        }
        if ($search) {
            $masterQuery->where('name', 'like', "%{$search}%");
        }

        $results = $masterQuery->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'type' => $item->type,
                'segment' => $item->segment,
                'region' => $item->region,
                'source' => 'master',
                // Label pembeda jika nama serupa
                'displayLabel' => "{$item->name} ({$item->type}) - {$item->region}",
            ];
        });

        // 2. Fallback dari Riwayat Kunjungan jika Master Data kosong / tidak menyediakan pilihan relevan
        if ($results->isEmpty()) {
            $historyQuery = Activity::query();
            if ($segment) {
                $historyQuery->where('segment', $segment);
            }
            if ($search) {
                $historyQuery->where('entity_name_snapshot', 'like', "%{$search}%");
            }

            $results = $historyQuery->get()
                ->unique(fn($act) => strtolower($act->entity_name_snapshot . '|' . $act->entity_type_snapshot))
                ->map(function ($act) {
                    $type = $act->entity_type_snapshot ?? 'Entitas Riwayat';
                    $region = $act->region_snapshot ?? 'Umum';
                    return [
                        'id' => $act->entity_id,
                        'name' => $act->entity_name_snapshot,
                        'type' => $type,
                        'segment' => $act->segment,
                        'region' => $region,
                        'source' => 'history',
                        'displayLabel' => "{$act->entity_name_snapshot} ({$type}) - {$region}",
                    ];
                })
                ->values();
        }

        // 3. Hindari duplikasi berdasarkan kombinasi nama + jenis entitas
        $uniqueResults = $results
            ->unique(fn($item) => strtolower($item['name'] . '|' . $item['type']))
            ->values();

        return response()->json($uniqueResults);
    }
}
