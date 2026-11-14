<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class VisitFlowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    public function test_unauthenticated_user_cannot_access_protected_endpoints(): void
    {
        $this->getJson('/api/activities')->assertStatus(401);
        $this->postJson('/api/activities', [])->assertStatus(401);
    }

    public function test_filter_activities_by_segment_status_date_range_and_search(): void
    {
        Sanctum::actingAs(User::first());

        $response = $this->getJson('/api/activities?segment=B2G&status=VISITED&from=2026-03-01&to=2026-03-31&search=melati');

        $response->assertStatus(200)
            ->assertJsonPath('summary.total', 1)
            ->assertJsonPath('summary.visited', 1)
            ->assertJsonPath('data.0.entityName', 'Kantor Layanan Melati');
    }

    public function test_create_activity_validation_and_success(): void
    {
        Sanctum::actingAs(User::first());

        // Uji validasi gagal jika input kosong
        $this->postJson('/api/activities', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['entityId', 'segment', 'visitDate', 'salesName']);

        // Uji simpan berhasil
        $this->postJson('/api/activities', [
            'entityId' => 'ent-001',
            'segment' => 'B2G',
            'visitDate' => '2026-03-25',
            'salesName' => 'Dedi Kurniawan',
        ])->assertStatus(201);
    }

    public function test_update_activity_status(): void
    {
        Sanctum::actingAs(User::first());

        $this->patchJson('/api/activities/2', ['status' => 'VISITED'])
            ->assertStatus(200)
            ->assertJsonPath('data.status', 'VISITED');
    }

    public function test_entities_fallback_to_history_when_master_not_found(): void
    {
        Sanctum::actingAs(User::first());

        // "CV Maju Bersama" hanya ada di riwayat kunjungan, tidak ada di master entities
        $this->getJson('/api/entities?segment=B2B&search=Maju')
            ->assertStatus(200)
            ->assertJsonPath('0.source', 'history')
            ->assertJsonPath('0.name', 'CV Maju Bersama (Riwayat)');
    }
}
