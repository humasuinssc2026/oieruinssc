<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Membuat akun Super Admin default
        User::updateOrCreate(
            ['email' => 'superadmin@uinsiber.ac.id'],
            [
                'first_name' => 'Super',
                'last_name' => 'Admin',
                'password' => \Illuminate\Support\Facades\Hash::make('password123'),
                'role' => 'superadmin',
                'status' => 'active',
            ]
        );
    }
}
