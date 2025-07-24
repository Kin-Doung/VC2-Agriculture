<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('farm_id')->constrained('farms')->onDelete('cascade');
            $table->foreignId('crop_id')->constrained('crops')->onDelete('cascade');
            $table->string('task_type');
            $table->string('description')->nullable();
            $table->date('due_date');
            $table->boolean('is_competed')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
