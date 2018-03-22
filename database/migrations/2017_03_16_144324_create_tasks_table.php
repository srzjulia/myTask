<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTasksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tasks', function(Blueprint $table)
        {
            $table->increments('id');
            $table->string('title');
            $table->text('notes');
            $table->boolean('status')->default(false);
            $table->enum('priority', array('Low', 'Medium', 'High'));
            $table->integer('user_id')->unsigned();
            $table->dateTime('done_at')->nullable();
            $table->timestamps();

        });

        Schema::table('tasks', function(Blueprint $table)
        {
            $table->foreign('user_id')
                ->references('id')->on('users')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
