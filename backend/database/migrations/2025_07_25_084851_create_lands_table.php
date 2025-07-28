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
            $table->text('boundary_points');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lands');
    }
};
