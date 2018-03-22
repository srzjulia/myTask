@extends('layouts.app')
@section('content')
    <div class="container">
        <div class="row">
            <div class="col-md-10 col-md-offset-1">
                @include('tasks.add')
                @include('tasks.show')
                <div id="edit-task-pane"></div>
                @include('tasks.lists')
            </div>
        </div>
    </div>

    <div id="modal-confirm" class="modal fade" role="dialog">
        <div class="modal-dialog">

            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title">Confirm delete</h4>
                </div>
                <div class="modal-body">
                    <p>¿Are you sure you want to delete this task?:</p> <p id="task-to-remove" class="text-center"></p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                    <button class="btn btn-info" id="confirm-rmv">Delete</button>
                </div>
            </div>

        </div>
    </div>

@endsection