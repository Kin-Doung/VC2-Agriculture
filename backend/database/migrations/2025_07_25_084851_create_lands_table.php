<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lands', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->decimal('data_area_ha', 8, 2);
            $table->decimal('data_area_acres', 8, 2);
            $table->decimal('seed_amount_min', 8, 2);
            $table->decimal('seed_amount_max', 8, 2);
            $table->jsonb('fertilizer_total');
            $table->date('date');
            $table->string('land_type');
            $table->jsonb('boundary_points');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lands');
    }
};