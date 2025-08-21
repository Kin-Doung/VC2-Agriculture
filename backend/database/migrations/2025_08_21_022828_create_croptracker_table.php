<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('croptracker', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('crop_id');
            $table->foreign('crop_id')->references('id')->on('crops')->onDelete('cascade');
            $table->date('planted'); 
            $table->string('location');
            $table->string('image_path')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('croptracker');
    }
};