{{ csrf_field() }}
<div class="panel panel-default no-side-padding col-md-5">
    <div class="panel-heading"><h4 class="text-center">Incomplete</h4></div>
    <div class="tasks panel-body table-padding" id="undone-container">
        <table class="table table-responsive" id="undone-tasks">
            <thead>
            <tr>
                <th class="priority">Priority</th>
                <th class="title">Title</th>
                <th class="created_at">Date</th>
                <th class="actions">Actions</th>
            </tr>
            </thead>

            <tbody>
            </tbody>
        </table>
    </div>
</div>

<div class="panel panel-default no-side-padding col-md-5 col-xs-12 pull-right">
    <div class="panel-heading"><h4 class="text-center">Done</h4></div>
    <div class="tasks panel-body table-padding" id="done-container">
        <table class="table table-responsive" id="done-tasks">
            <thead>
            <tr data-status="false">
                <th class="priority">Priority</th>
                <th class="title">Title</th>
                <th class="created_at">Date</th>
                <th class="actions">Actions</th>
            </tr>
            </thead>

            <tbody>
            </tbody>
        </table>
    </div>
</div>