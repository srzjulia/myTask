<div class="panel panel-default add-task-pane">
    <div class="panel-heading">
       <button type="button" id="toggle-add-form" class="btn btn-default btn-circle pull-right"><i class="glyphicon glyphicon-plus"></i></button>
        <h4 class="aligned-text-button">Add new task</h4>
    </div>
    <div class="panel-body" id="task-add-form">
    <div id="add-task-errors"></div>

        {!! Form::open(['route' => 'task.store','id'=>'newTask', 'method' => 'POST'])!!}

        @include('tasks.form')

        <div class="row center-block">
            <button class="btn btn-primary" id="add-task" data-token="{{ csrf_token() }}" >Add</button>
            <a class="btn btn-warning" id="cancel-new">Cancel</a>

        </div>

        {!! Form::close() !!}

    </div>
</div>