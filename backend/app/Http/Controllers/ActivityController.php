<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\Entity;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    public function index(Request $request)
    {
        $query = Activity::query();

        if ($request->filled('segment')) {
            $query->where('segment', $request->query('segment'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($request->filled('from')) {
            $query->whereDate('visit_date', '>=', $request->query('from'));
        }

        if ($request->filled('to')) {
            $query->whereDate('visit_date', '<=', $request->query('to'));
        }

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('entity_name_snapshot', 'like', "%{$search}%")
                  ->orWhere('sales_name', 'like', "%{$search}%")
                  ->orWhereHas('entity', function ($sub) use ($search) {
                      $sub->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $activities = $query->orderBy('visit_date', 'desc')->get()->map(function ($act) {
            return [
                'id' => $act->id,
                'entityId' => $act->entity_id,
                'entityName' => $act->entity?->name ?? $act->entity_name_snapshot,
                'entityType' => $act->entity?->type ?? $act->entity_type_snapshot ?? '-',
                'region' => $act->entity?->region ?? $act->region_snapshot ?? '-',
                'segment' => $act->segment,
                'visitDate' => $act->visit_date,
                'salesName' => $act->sales_name,
                'status' => $act->status,
            ];
        });

        return response()->json([
            'data' => $activities,
            'summary' => [
                'total' => $activities->count(),
                'visited' => $activities->where('status', 'VISITED')->count(),
                'notVisited' => $activities->where('status', 'NOT_VISITED')->count(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'entityId' => 'required|string',
            'segment' => 'required|in:B2G,B2B',
            'visitDate' => 'required|date',
            'salesName' => 'required|string|min:2|max:100',
        ], [
            'entityId.required' => 'Entitas tujuan wajib dipilih.',
            'segment.required' => 'Segmen (B2G atau B2B) wajib dipilih.',
            'segment.in' => 'Segmen harus bernilai B2G atau B2B.',
            'visitDate.required' => 'Tanggal kunjungan wajib diisi.',
            'visitDate.date' => 'Format tanggal kunjungan tidak valid.',
            'salesName.required' => 'Nama Sales wajib diisi.',
            'salesName.min' => 'Nama Sales minimal 2 karakter.',
        ]);

        // Ambil snapshot entitas dari Master atau Riwayat sebelumnya
        $entity = Entity::find($validated['entityId']);
        $history = Activity::where('entity_id', $validated['entityId'])->first();

        if (!$entity && !$history) {
            return response()->json([
                'message' => 'Entitas yang dipilih tidak ditemukan di master data maupun riwayat.',
            ], 422);
        }

        $activity = Activity::create([
            'entity_id' => $validated['entityId'],
            'entity_name_snapshot' => $entity?->name ?? $history->entity_name_snapshot,
            'entity_type_snapshot' => $entity?->type ?? $history->entity_type_snapshot,
            'region_snapshot' => $entity?->region ?? $history->region_snapshot,
            'segment' => $validated['segment'],
            'visit_date' => $validated['visitDate'],
            'sales_name' => $validated['salesName'],
            'status' => 'NOT_VISITED',
        ]);

        return response()->json([
            'message' => 'Rencana kunjungan berhasil ditambahkan.',
            'data' => $activity,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $activity = Activity::with('entity')->find($id);

        if (!$activity) {
            return response()->json(['message' => 'Data kunjungan tidak ditemukan.'], 404);
        }

        $validated = $request->validate([
            'status' => 'required|in:VISITED,NOT_VISITED',
        ], [
            'status.required' => 'Status kunjungan wajib diisi.',
            'status.in' => 'Status hanya boleh VISITED atau NOT_VISITED.',
        ]);

        $activity->status = $validated['status'];
        $activity->save();

        return response()->json([
            'message' => 'Status kunjungan berhasil diperbarui.',
            'data' => [
                'id' => $activity->id,
                'entityId' => $activity->entity_id,
                'entityName' => $activity->entity?->name ?? $activity->entity_name_snapshot,
                'entityType' => $activity->entity?->type ?? $activity->entity_type_snapshot ?? '-',
                'region' => $activity->entity?->region ?? $activity->region_snapshot ?? '-',
                'segment' => $activity->segment,
                'visitDate' => $activity->visit_date,
                'salesName' => $activity->sales_name,
                'status' => $activity->status,
            ],
        ]);
    }
}
