$(document).ready(function()
{
    const csrftoken = Cookies.get('csrftoken');
    
    // Add card
    $('#add_card_form').submit(function(event) {
        event.preventDefault();
        var front = $('#add_card_front').val();
        if (front.length > 280) {
            document.getElementById('add_card_front').setCustomValidity("Card face must have less than 280 characters");
            return;
        };
        var back = $('#add_card_back').val();
        if (back.length > 280) {
            document.getElementById('add_card_back').setCustomValidity("Card face must have less than 280 characters");
            return;
        };
        
        $.ajax({
        url : "deck",
        type : "POST",
        headers: {'X-CSRFToken': csrftoken},
        data : { front : front, back : back, order : '{{ next_card }}' },

        success : function() {
            $('#add_card_front').val('');
            $('#add_card_back').val('');
            $('#add_card').modal('hide');
            $('#all_cards').load(location.href+" #all_cards>*","");
        },

        error : function(xhr,errmsg) {
            $('#add_status').text(errmsg);
            console.log(xhr.status + ": " + xhr.responseText);
        }
        });
    });

    // Get edit card form
    $(document).on('click', 'button[id^="edit_card_"]', function(){
        var id = parseInt(this.id.split('_')[2]);
        var order = parseInt($('#order_' + id).text());
        var front = $('#front_' + id).text();
        var back = $('#back_' + id).text();

        $('#edit_card_id').val(id);
        $('#edit_card_order').val(order);
        $('#edit_card_front').val(front);
        $('#edit_card_back').val(back);
 
    });

    // Edit card
    $('#edit_card_form').submit(function(e) {
        e.preventDefault();
        var id = $('#edit_card_id').val();
        var order = parseInt($('#edit_card_order').val());
        var front = $('#edit_card_front').val();
        if (front.length > 280) {
            document.getElementById('edit_card_front').setCustomValidity("Card face must have less than 280 characters");
            return;
        };
        var back = $('#edit_card_back').val();
        if (back.length > 280) {
            document.getElementById('edit_card_back').setCustomValidity("Card face must have less than 280 characters");
            return;
        };

        $.ajax({
        url : "edit_card",
        type : "POST",
        headers: {'X-CSRFToken': csrftoken},
        data : { front : front, back : back, order : order, id : id },

        success : function() {
            $('#edit_card_id').val('');
            $('#edit_card_order').val('');
            $('#edit_card_front').val('');
            $('#edit_card_back').val('');
            $('#edit_card_modal').modal('hide');
            $('#all_cards').load(location.href+" #all_cards>*","");
        },

        error : function(xhr,errmsg) {
            $('#edit_status').text(errmsg);
            console.log(xhr.status + ": " + xhr.responseText);
        }
        });
    });

    // Get delete form
    $(document).on('click', 'button[id^="delete_card_modal_trigger_"]', function(){
        var id = parseInt(this.id.split('_')[4]);
        $('#delete_card_id').val(id);
        $('#delete_card_modal').modal('show');
    });
    
    // Delete card
    $('#delete_card_form').submit(function(event){
        event.preventDefault();
        var id = $('#delete_card_id').val();
        $.ajax({
        url : "delete_card",
        type : "POST",
        headers: {'X-CSRFToken': csrftoken},
        data : { id : id },

        success : function() {
            $('#delete_card_modal').modal('hide');
            $('#all_cards').load(location.href+" #all_cards>*","");
        },

        error : function(xhr,errmsg) {
            $('#delete_status').text(errmsg);
            console.log(xhr.status + ": " + xhr.responseText);
        }
        });
    });

    // Rename deck
    $('#rename_deck_form').submit(function(event){
        event.preventDefault();
        var id = parseInt($('#deck_id').val());
        var name = $('#rename_deck_form').find('#deck_name').val();

        $.ajax({
            url : "rename_deck",
            type : "POST",
            headers: {'X-CSRFToken': csrftoken},
            data : { id : id, name : name },
    
            success : function() {
                $('#rename_deck_modal').modal('hide');
                $('#deck-info').load(location.href+" #deck-info>*","");
            },
    
            error : function(xhr,errmsg) {
                $('#rename_status').text(errmsg);
                console.log(xhr.status + ": " + xhr.responseText);
            }
        });
    });

    $('.modal').each(function(){
        $(this).on('hide.bs.modal', function(){
            $('.error-message').text('');
        });
    });
});