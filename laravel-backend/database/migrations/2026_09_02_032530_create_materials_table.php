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
        Schema::create('materials', function (Blueprint $table) {
            $table->id();
            $table->string('title', 255);
            $table->enum('type', ['document', 'video']);
            $table->string('category_slug', 100);
            $table->string('author', 150);
            $table->foreignId('uploader_id')->nullable()->default(1)->constrained('users')->onDelete('set null');
            $table->string('file_url', 255)->nullable();
            $table->string('module_url', 255)->nullable();
            $table->enum('status', ['published', 'review', 'draft'])->default('published');
            $table->integer('downloads')->default(0);
            $table->integer('views')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('materials');
    }
};
