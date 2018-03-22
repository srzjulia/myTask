<?php

namespace App\Http\Controllers;

use App\Task;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\TaskFormRequest;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $undone_tasks = Task::orderBy('created_at', 'desc')->get()->where('user_id', Auth::user()->id)
            ->where('status', false);
        $done_tasks = Task::orderBy('done_at', 'desc')->get()->where('user_id', Auth::user()->id)
            ->where('status', true);

        return view('tasks.index', compact('undone_tasks', 'done_tasks'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(TaskFormRequest $request)
    {
        $task = new Task($request->all());
        $task->user_id = Auth::user()->id;
        $task->save();

        return response()->json($task);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $task = Task::findOrFail($id);

        return response()->json($task);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $task = Task::find($id);

        return view('tasks.edit', compact('task'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(TaskFormRequest $request, $id)
    {
        $task = Task::find($id);
        $task->title = $request->title;
        $task->priority = $request->priority;
        $task->notes = $request->notes;
        $task->save();

        return response()->json($task);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $task = Task::find($id);
        $task->delete();

        return response()->json([
            'success' => 'Record has been deleted successfully!'
        ]);
    }

    /**
     * Changes the task status from incomplete to done (true)
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function markAsDone($id){

        $task = Task::find($id);
        $task->status = true;
        $task->done_at = Carbon::now()->format('Y-m-d H:i:s');
        $task->save();

        return response()->json([
            'success' => 'Task marked as done!'
        ]);
    }

    /**
     * Sorts the database items by the specified criteria.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function sortedBy(Request $request)
    {
        $criteria = $request->input( 'criteria' );
        $status = true;
        $ascOrDesc = "desc";

        if($request->input( 'isAsc' ) == "true"){ $ascOrDesc = "asc"; }
        if ($request->input( 'status' ) == "false"){ $status = false; }
        $tasks = Task::orderBy($criteria, $ascOrDesc)->where('user_id', Auth::user()->id)->
            where('status', $status)->get();

        return response()->json($tasks);
    }
}
