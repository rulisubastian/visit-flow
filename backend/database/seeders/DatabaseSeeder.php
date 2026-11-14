<?php

namespace Database\Seeders;

use App\Models\Activity;
use App\Models\Entity;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'sales@visitflow.id'],
            [
                'name' => 'Rizky Pratama (Sales Lead)',
                'password' => Hash::make('password123'),
            ]
        );

        $entities = [
            ['id' => 'ent-001', 'name' => 'Kantor Layanan Melati', 'type' => 'Instansi', 'segment' => 'B2G', 'region' => 'Bandung'],
            ['id' => 'ent-002', 'name' => 'Toko Sinar Jaya', 'type' => 'Perusahaan', 'segment' => 'B2B', 'region' => 'Jakarta'],
            ['id' => 'ent-003', 'name' => 'Dinas Kesehatan Kota Bandung', 'type' => 'Instansi', 'segment' => 'B2G', 'region' => 'Bandung'],
            ['id' => 'ent-004', 'name' => 'PT Nusantara Digital', 'type' => 'Perusahaan', 'segment' => 'B2B', 'region' => 'Surabaya'],
            ['id' => 'ent-005', 'name' => 'Klinik Melati Sehat', 'type' => 'Klinik Swasta', 'segment' => 'B2B', 'region' => 'Bandung'],
            ['id' => 'ent-006', 'name' => 'Puskesmas Melati', 'type' => 'Instansi', 'segment' => 'B2G', 'region' => 'Bandung'],
        ];

        foreach ($entities as $ent) {
            Entity::updateOrCreate(['id' => $ent['id']], $ent);
        }

        $activities = [
            [
                'entity_id' => 'ent-001',
                'entity_name_snapshot' => 'Kantor Layanan Melati',
                'entity_type_snapshot' => 'Instansi',
                'region_snapshot' => 'Bandung',
                'segment' => 'B2G',
                'visit_date' => '2026-03-10',
                'sales_name' => 'Andi Saputra',
                'status' => 'VISITED',
            ],
            [
                'entity_id' => 'ent-002',
                'entity_name_snapshot' => 'Toko Sinar Jaya',
                'entity_type_snapshot' => 'Perusahaan',
                'region_snapshot' => 'Jakarta',
                'segment' => 'B2B',
                'visit_date' => '2026-03-15',
                'sales_name' => 'Budi Santoso',
                'status' => 'NOT_VISITED',
            ],
            [
                'entity_id' => 'ent-003',
                'entity_name_snapshot' => 'Dinas Kesehatan Kota Bandung',
                'entity_type_snapshot' => 'Instansi',
                'region_snapshot' => 'Bandung',
                'segment' => 'B2G',
                'visit_date' => '2026-03-18',
                'sales_name' => 'Citra Lestari',
                'status' => 'NOT_VISITED',
            ],
            [
                'entity_id' => 'hist-901',
                'entity_name_snapshot' => 'CV Maju Bersama (Riwayat)',
                'entity_type_snapshot' => 'CV',
                'region_snapshot' => 'Cimahi',
                'segment' => 'B2B',
                'visit_date' => '2026-02-20',
                'sales_name' => 'Andi Saputra',
                'status' => 'VISITED',
            ],
        ];

        foreach ($activities as $act) {
            Activity::create($act);
        }
    }
}
