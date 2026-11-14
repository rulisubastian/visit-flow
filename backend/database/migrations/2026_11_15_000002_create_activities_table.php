<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('activities', function (Blueprint $table) {
            $table->id();
            $table->string('entity_id');
            $table->string('entity_name_snapshot')->nullable();
            $table->string('entity_type_snapshot')->nullable();
            $table->string('region_snapshot')->nullable();
            $table->enum('segment', ['B2G', 'B2B']);
            $table->date('visit_date');
            $table->string('sales_name');
            $table->enum('status', ['NOT_VISITED', 'VISITED'])->default('NOT_VISITED');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activities');
    }
};
