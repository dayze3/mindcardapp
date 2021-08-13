$(document).ready(function()
{
    window.order = 'ordered';
    window.start = 'term';
    $('#finished').hide();
    const csrftoken = Cookies.get('csrftoken');
    const cards_data = JSON.parse(document.getElementById('cards').textContent).split(', ');
    var studied = 0;
    var cards = [];
    var past_counters = [];
    var rewind = 0;
    create_card_array();
    swipe();

    past_counters.push(0);

    // Set up for first card
    if (window.order === 'random') {
        card_counter = Math.floor(Math.random() * cards.length);
    }
    else {
        card_counter = 0;
    };

    display_card();
    $('#study_progress').text(studied + '/' + cards.length);

    $('#settings_form').submit(function(e){
        e.preventDefault();
        window.order = $('#study_order').val();
        window.start = $('#study_start').val();
        $('#settings_modal').modal('hide');
        display_card();
        if ($('.card-content').hasClass('flipped')){
            $('.card-content').toggleClass('flipped');
        };
    });

    $(document.body).keyup(function(e){
        switch (e.key) {
        // If press space, flip card
        case " ":
            e.preventDefault();    
            e.stopPropagation();
            $('button').blur();
            $('.card-content').toggleClass('flipped');
            break;
        
        // If press up, flip card
        case "ArrowUp":
            e.preventDefault();
            e.stopImmediatePropagation();            

            $('.card-content').toggleClass('flipped');
            break;
        
        // If press down, flip card
        case "ArrowDown":
            e.preventDefault();
            e.stopImmediatePropagation();            

            $('.card-content').toggleClass('flipped');
            break;
        case "1":
            if ($('.card-content').hasClass('flipped')){
                $('#study_again').click();
            };
            break;
        case "2":
            if ($('.card-content').hasClass('flipped')){
                $('#got_it').click();
            };
            break;
        default:
            return;
        }
    });

    $(document.body).keydown(function(e){
        switch (e.key) {
        // If click right arrow, go to next card
        case "ArrowRight":
            $('#card_nav_right').click();
            break;
            
        // If left arrow clicked, go back to previous card
        case "ArrowLeft":
            $('#card_nav_left').click();
            break;

        default:
            return;
        }
    });

    function display_card() {
        if (window.start === 'term') {
            $('#front').text(cards[card_counter]['front']);
            $('#back').text(cards[card_counter]['back']);
        }
        else {
            $('#front').text(cards[card_counter]['back']);
            $('#back').text(cards[card_counter]['front']);
        };
        $('#order').text(cards[card_counter]['order']);
        $('#study_progress').text(studied + '/' + cards.length);
    };

    $('#card_nav_left').on('click touchend', function(){
        if (rewind > 0) {
            rewind -= 1;
        };
        card_counter = past_counters[rewind];
        
        /* console.log('card counter: ' + card_counter);
        console.log('back rewind: ' + rewind);
        console.log(''); */
        display_card();

        if ($('.card-content').hasClass('flipped')){
            $('.card-content').toggleClass('flipped');
        };
    });

    $('#card_nav_right').on('click touchend', function(){
        set_card_counter();
        display_card();
        if ($('.card-content').hasClass('flipped')){
            $('.card-content').toggleClass('flipped');
        };
    });

    $('#study_again').on('click touchend', function(e){
        e.stopPropagation();
        e.preventDefault();
        cards[card_counter]['study'] = true;
        if (cards[card_counter]['study'] == false){
            studied--;
        };
        set_card_counter();
        display_card();

        $('#study_again').blur();
        
        if ($('.card-content').hasClass('flipped')){
            $('.card-content').toggleClass('flipped');
        };
    });

    $('#got_it').on('click touchend', function(e){
        e.stopPropagation();
        e.preventDefault();
        if (cards[card_counter]['study'] === true) {
            studied++;
        }
        cards[card_counter]['study'] = false;
        
        if (studied === cards.length) {
            console.log('done');
            $('#study_progress').text(studied + '/' + cards.length);
            $('.card-content').hide();
            $('#card_nav_buttons').hide();
            $('#finished').show();
            return;
        };
        set_card_counter();
        display_card();
        if ($('.card-content').hasClass('flipped')){
            $('.card-content').toggleClass('flipped');
        }
        $('#got_it').blur();
    });

    $('.card-content').on('click touchend', function(){
        $('.card-content').toggleClass('flipped');
    });

    $('#restart').click(function(){
        console.log('restart');
        $('#restart').blur();
        $('#finished').hide();
        studied = 0;
        card_counter = 0;
        past_counters.length = 0;
        rewind = 0;
        for (var i = 0; i < cards.length; i++) {
            cards[i]['study'] = true;
        };

        display_card();
        if ($('.card-content').hasClass('flipped')){
            $('.card-content').toggleClass('flipped');
        };
        $('.card-content').show();
    });

    function set_card_counter() {
        if (rewind < past_counters.length - 1 && rewind >= 0){
            rewind++;
            card_counter = past_counters[rewind];
        }
        
        else {
            rewind++;
            if (window.order === 'random'){
                var new_counter = Math.floor(Math.random() * cards.length);
                
                while (new_counter === card_counter || cards[new_counter]['study'] === false){
                    new_counter = Math.floor(Math.random() * cards.length);
                };
                card_counter = new_counter;
            }
            else {
                card_counter++;
                if (card_counter >= cards.length) {
                    card_counter = 0;
                }
                while (cards[card_counter]['study'] === false) {
                    card_counter++
                    if (card_counter >= cards.length) {
                        card_counter = 0;
                    }
                }
            };
            past_counters.push(card_counter);
        };
        /* console.log("card counter: " + card_counter);
        console.log('studied: ' + studied);
        console.log('past counter length: ' + past_counters.length);
        console.log('past counters: ' + past_counters)
        console.log('rewind: ' + rewind);
        console.log(""); */
    };

    function swipe() {
        let touchstartX = 0;
        let touchstartY = 0;
        let touchendX = 0;
        let touchendY = 0;

        var card = document.getElementsByClassName("card-content")[0];

        card.addEventListener('touchstart', function(event) {
            event.stopPropagation();
            event.preventDefault();
            touchstartX = event.changedTouches[0].screenX;
            touchstartY = event.changedTouches[0].screenY;
        }, false);

        card.addEventListener('touchmove', function(event) {
            event.preventDefault();
        });

        card.addEventListener('touchend', function(event) {
            event.preventDefault();
            touchendX = event.changedTouches[0].screenX;
            touchendY = event.changedTouches[0].screenY;
            
            // Swipe right
            if (touchendX - touchstartX <= -10 && !vertical()) {
                event.stopImmediatePropagation();
                console.log('right');
                set_card_counter();
                display_card();
                
                if ($('.card-content').hasClass('flipped')){
                    $('.card-content').toggleClass('flipped');
                };
            }
            
            // Swipe left
            else if (touchstartX - touchendX <= 10 && !vertical()) {
                event.stopImmediatePropagation();
                console.log('left');
                if (rewind > 0) {
                    rewind -= 1;
                };
                card_counter = past_counters[rewind];
                
                /* console.log('card counter: ' + card_counter);
                console.log('back rewind: ' + rewind);
                console.log(''); */
                display_card();
    
                if ($('.card-content').hasClass('flipped')){
                    $('.card-content').toggleClass('flipped');
                };
            }

            else {
                return;
            };
        }, false); 
            

        function vertical() {
            if (Math.sign('-1') < ((touchstartY - touchendY)/(touchstartX - touchendX)) < 1) {
                return true;
            }
            else {
                return false;
            };
        }
    };

    function create_card_array() {
        var dict_counter = 0;
        var card_dict = {};
        for (var i = 0; i < cards_data.length; i++) {
            // Data already split by comma, now spliting key and value
            var split_card = cards_data[i].split(': ');
            
            // Split values on quotes to get rid of brackets and quotes
            var key = split_card[0].split('"')[1];
            var value = split_card[1].split('"')[1];
            
            // Some values are the first element after split, some second
            if (value === undefined) {
                value = split_card[1].split('"')[0];
            }
            // If value is int, make it an int
            if (!isNaN(value)) {
                value = parseInt(value);
            }
            card_dict[key] = value;
            
            // Every four items, create new dict (for new card)
            dict_counter++;
            if (dict_counter === 4) {
                card_dict['study'] = true;
                cards.push(card_dict);
                card_dict = {};
                dict_counter = 0;
            };
        };
    }

    $('#settings-modal').on('hide.bs.modal', function(){
        $('.error-message').text('');
    });
});