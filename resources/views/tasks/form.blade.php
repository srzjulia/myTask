<div class="row">
    <div class="pull-left col-xs-7">
        <label for="title">Title</label><br>
        {!! Form::text('title', null, ['class' => 'form-control', 'id' => 'title', 'placeholder' => 'Title']) !!}
    </div>

    <div class="pull-right col-xs-5">
        <label for="name">Priority</label><br>
        {!! Form::select('priority', ['Low' => 'Low', 'Medium' => 'Medium', 'High' => 'High'], null, ['id' => 'priority', 'class' => 'form-control', 'placeholder' => 'Chose one']) !!}
    </div>
</div>
<br>

<div class="row center-block">
    <label for="name">Notes</label>
    {!! Form::text('notes', null, ['class' => 'form-control', 'id' => 'notes', 'placeholder' => 'Additional info']) !!}
</div>
<br>

{{ Form::hidden('id', '0', array('id' => 'task-id')) }}