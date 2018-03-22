<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

//Route::get('/', function () { return view('welcome'); });
//Route::get('/home', 'HomeController@index');


Auth::routes();

Route::group(['middleware' => 'auth'], function()
{
    Route::get('/', 'TaskController@index')->name('tasks');
    Route::get('task/sorted', 'TaskController@sortedBy')->name('task.sorted');
    Route::resource('task','TaskController', ['only' => ['index', 'store', 'destroy', 'edit', 'show', 'update']]);
    Route::post('task/done/{id}', 'TaskController@markAsDone')->name('task.done');

});

