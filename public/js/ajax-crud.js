$.ajaxSetup({ headers:
    { 'X-CSRF-Token': $('input[name="_token"]').val() }
});

$(document).ready(function(){

    //Variables for shorting criteria, status (done/undone) and ascendent/descendent

    var $criteria, $status, $isAsc = true;
    var $done_asc = true, $undone_asc = true;

    // Load tasks when opening the website
    pageFirstLoading();

    /**
     * Get sorted tasks from DB
     */
    function getTasks($criteria, $status, $isAsc) {

        if (!$criteria){
            $criteria = status ? "done_at" : "title";
        }

        $.ajax({
            type: "GET",
            url: "task/sorted",
            data: {
                criteria: $criteria,
                status: $status,
                isAsc: $isAsc
            },
            dataType: "JSON",

            success: function (data) {
                $tasks = $status ? "done" : "undone";
                loadTasks(data, $tasks);
            },
            error: function (data) {
                console.log('Error:', data);
            }
        });
    }

    /**
     * Load done/undone tasks
     */
    function loadTasks(data, list){
        $('#' + list + '-tasks tbody').empty();

        if (data.length == 0){
            $text = (list == "done") ? "Whoops! Better get to work!" : "Nothing to do."

            if ($('#' + list + '-tasks tbody tr').length <= 0) {
                $('#' + list + '-tasks').remove();
                $('#' + list + '-container').addClass('panel-body')
                    .append('<p class="text-center">' + $text + '</p>');
            }
        }

        for (var i = 0; i < data.length; i++) {
            var task = taskHTMLBuilder(data[i]);
            $(task).hide().appendTo('#' + list + '-tasks tbody').fadeIn();
        }
    }

    /**
     * Add new task
     */
    $("#add-task").click(function(event){
        event.preventDefault();
        var token = $(this).data('token');

        $.ajax({
            type: "POST",
            data: $("#newTask").serialize(),
            url: "task",
            dataType: "JSON",

            success: function (data) {
                $('#add-task-errors').html('');
                $("#newTask")[0].reset();
                createTable("undone");
                var task = taskHTMLBuilder(data, token);
                $(task).hide().prependTo('#undone-tasks tbody').fadeIn();
            },
            error: function (data) {
                $('#add-task-errors').html(printErrors(data));
            }
        });
    });

    /**
     * Edit task
     */
    $('#task-show-form').on('click', '#edit-task', function(event){
        event.preventDefault();
        var token = $(this).data('token');
        var id = $(this).val();

        $.ajax({
            type: "GET",
            dataType: "html",
            url: "task/" + id + "/edit",

            success: function (data) {
                $("#show-task-pane").hide();
                $("#edit-task-pane").fadeOut().html(data).fadeIn();

            },
            error: function (data) {
                console.log('Error:', data);
            }
        });
    });

    /**
     * Update task
     */
    $('#edit-task-pane').on('click', '#edit-task', function(event){
        event.preventDefault();

        var token = $(this).data('token');
        var id = $(this).val();

        $.ajax({
            type: "PUT",
            data: $("#editTask").serialize(),
            url: "task/" + id,

            success: function (data) {
                $('#edit-task-errors').html('');
                $("#edit-task-pane").fadeOut();
                $('#task-' + id + ' .td-title').text(data.title);
                $('#task-' + id + ' .priority').html('<ul class="' + data.priority + '"><li></li></ul>');
            },
            error: function (data) {
                $('#edit-task-errors').html(printErrors(data));
            }
        });
    });

    /**
     * Show tasks
     */
    $('.tasks').on('click', '.task-show td:not(.noaction)', function() {
        var id = $(this).parent().attr('data-taskid');

        $.ajax({
            type: "GET",
            url: "task/" + id,

            success: function (data) {
                $("#edit-task-pane").fadeOut();
                $( "#task-add-form:visible" ).slideToggle();

                var $format_date = new Date(data.created_at);
                var $date = addZeroToDateFields($format_date.getHours()) + ":" +
                    addZeroToDateFields($format_date.getMinutes()) + " - " + $format_date.getDate() + "/" +
                    addZeroToDateFields($format_date.getMonth() + 1)+ "/" + addZeroToDateFields($format_date.getYear());

                $currentStatus = "Incomplete";

                if (data.status){
                    $format_date = new Date(data.done_at);
                    var $doneDate = addZeroToDateFields($format_date.getHours()) + ":" +
                        addZeroToDateFields($format_date.getMinutes()) + " - " + $format_date.getDate() + "/" +
                        addZeroToDateFields($format_date.getMonth() + 1)+ "/" + addZeroToDateFields($format_date.getYear());
                    $currentStatus = "Done at <u>" + $doneDate + "</u>";
                    $('#edit-button-zone').html('');
                } else {
                    $('#edit-button-zone').html('<button class="btn btn-primary" id="edit-task" value ="' + data.id +
                        '">Edit</button>');
                }

                $('#task-title').text(data.title);
                $('#title-field').text(data.title);
                $('#priority-field').text(data.priority);
                $('#notes-field').text(data.notes);
                $('#status-field').html($currentStatus);
                $('#createdDate-field').html($date);
                $('#show-task-pane').fadeIn();

            },
            error: function (data) {
                console.log('Error:', data);
            }
        });

    });

    /**
     * Delete tasks
     */
    $('.tasks').on('click', '.rmv-task',function(){
        var id = $(this).val();

        $('#task-to-remove').text($('#task-' + id + ' .td-title').text());
        $('#modal-confirm').modal("show");
        $("#confirm-rmv").val(id);
    });

    $('#modal-confirm').on('click', '#confirm-rmv', function(){
        var id = $(this).val();

        $.ajax({
            type: "DELETE",
            url: "task/" + id,

            success: function (data) {
                $('#modal-confirm').modal("hide");
                $("#task-" + id).fadeOut("normal", function () {
                    $(this).remove();

                    setEmptyListText("undone", "Nothing to do.");
                    setEmptyListText("done", "Whoops! Better get to work!");
                });
            },
            error: function (data) {
                console.log('Error:', data);
            }
        });

    });

    /**
     * Mark as done
     */
    $('.tasks').on('click', '.done-task', function(){

        var id = $(this).val();

        $.ajax({
            type: "POST",
            url: "task/done/" + id,

            success: function (data) {
                createTable("done");
                moveUndoneToDoneTask(id);

                if ($('#undone-tasks tbody tr').length <= 1) {
                    $('#undone-tasks').remove();
                    $('#undone-container').addClass('panel-body').html('<p class="text-center">Nothing to do.</p>');
                }

            },
            error: function (data) {
                console.log('Error:', data);
            }
        });
    });


    //Additional functions

    /**
     * Load tasks
     */
    function pageFirstLoading(){
        getTasks($criteria, false, $undone_asc);
        getTasks($criteria, true, $done_asc);
    }

    function setEmptyListText(list, $text){

        if ($('#' + list + '-tasks tbody tr').length <= 0) {
            $('#' + list + '-tasks').remove();
            $('#' + list + '-container').addClass('panel-body')
                .html('<p class="text-center">' + $text + '</p>');
        }
    }

    function createTable(list){
        if ($('#' + list + '-tasks tbody tr').length == 0) {
            $('#' + list + '-container').removeClass('panel-body');
            $('#' + list + '-container').html('' +
                '<table class="table table-responsive" id="' + list + '-tasks"><thead><tr><th>Priority</th>' +
                '<th>Title</th><th>Date</th><th class="actions">Actions</th></tr></thead><tbody></tbody></table>');
        }
    }

    function moveUndoneToDoneTask(id){
        $("#task-" + id).fadeOut("normal", function() {
            $(this).detach().prependTo("#done-tasks tbody");
            $("#task-" + id + " .done-task").remove();
            $(this).fadeIn("default");
        });
    }

    function taskHTMLBuilder(data){

        var $done = "";
        if (!data.status){
            $done = '<button class="btn btn-info done-task" value="' + data.id + '">' +
            '<span class="glyphicon glyphicon-ok"></span></button> '
        }

        var $format_date = new Date(data.created_at);
        var $date = $format_date.getDate() + "/" + addZeroToDateFields($format_date.getMonth() + 1) + " - " +
            addZeroToDateFields($format_date.getHours()) + ":" + addZeroToDateFields($format_date.getMinutes());

        var task = '<tr class="task-show" id="task-' + data.id + '"  data-taskid="' + data.id + '"> <td class="priority">' +
            '<ul class="' + data.priority + '"><li></li></ul> </td><td class="td-title">' + data.title + '</td>' +
            '<td>' + $date + '</td><td class="noaction"><span class="pull-right">' + $done +
            '<button class="btn btn-info rmv-task" value="' + data.id + '"><span class="glyphicon glyphicon-remove">' +
            '</span></button></span></td></tr>';

            return task;
    }

    function addZeroToDateFields($dateField){

        if ($dateField < 10) {
            $dateField = "0" + $dateField;
        }

        return $dateField;
    };

    function printErrors(data){

        var errors = data.responseJSON;
        console.log(errors);

        errorMessages = '<div class="alert alert-danger"><ul>';
        $.each(errors, function(field, message){
            console.log(message);
            errorMessages += ('<li>' + message[0] + '</li>');
        });

        errorMessages += '</ul>';

        return errorMessages;
    }

    //MANUAL SORTING METHODS

    $('#undone-tasks').on('click', 'th.priority, th.title, th.created_at', function(){
        $undone_asc = !$undone_asc;
        $criteria = $(this).attr("class");
        getTasks($criteria, false, $undone_asc);
    });

    $('#done-tasks').on('click', 'th.priority, th.title, th.created_at', function(){
        $done_asc = !$done_asc;
        $criteria = $(this).attr("class");
        getTasks($criteria, true, $done_asc);
    });
});

