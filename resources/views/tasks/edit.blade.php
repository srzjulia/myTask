<div class="panel panel-default">
    <div class="panel-heading">
        <h4 class="aligned-text-button">Edit task: {{ $task->title }}</h4>
    </div>

    <div class="panel-body" id="edit-add-form">
        <div id="edit-task-errors"></div>


        {!! Form::open(['route' => ['task.update', $task->id], 'method' => 'PUT', 'id'=>'editTask'])!!}

        @include('tasks.form')

        <div class="row center-block">
            <button class="btn btn-primary" id="edit-task" data-token="{{ csrf_token() }}" value="{{ $task->id }}" >Add</button>
            <a class="btn btn-warning" id="cancel-edit">Cancel</a>


        </div>

        {!! Form::close() !!}

    </div>
</div>
