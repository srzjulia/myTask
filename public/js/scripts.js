$("#toggle-add-form").click(function(){
    $("#task-add-form").slideToggle();
});

$("#hide-show").click(function(){
    $("#show-task-pane").fadeOut();
});


$('#newTask').on('click','#cancel-new', function(){
    $("#newTask")[0].reset();
    $("#task-add-form").slideToggle();
});


$('#edit-task-pane').on('click','#cancel-edit', function(){
    $("#editTask")[0].reset();
    $('#edit-task-pane').fadeOut();
});
