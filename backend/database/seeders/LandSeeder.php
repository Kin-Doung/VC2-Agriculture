<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LandSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('lands')->insert([
            [
                'name' => 'Rice Field A',
                'data_area_ha' => 12.5,
                'data_area_acres' => 30.9,
                'boundary_points' => '[[10.123, 104.123], [10.124, 104.124], [10.125, 104.125]]',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
