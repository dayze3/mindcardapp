$(document).ready(function()
{
    const csrftoken = Cookies.get('csrftoken');
    if (!$.trim( $('#decks').html()).length){
        $('.empty').css('visibility', 'visible');
    }
    else {
        $('.empty').css('visibility', 'hidden');
    };

    $("div[id^='created_']").each(function () {
        var date = new Date($(this).text());
        date = date.toLocaleString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'});
        date = date.replace(',','');
        $(this).text(date);
    });

    $("div[id^='modified_']").each(function () {
        var date = new Date($(this).text());
        date = date.toLocaleString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'});
        date = date.replace(',','');
        $(this).text(date);
    });

    $(".deck-card").hover(function() {
        $(this).toggleClass('flipped');
    });

    $(document).on('click', 'div[id^="deck_"]', function(event){
        event.preventDefault();
        var id = parseInt(this.id.split('_')[1]);
        $.ajax({
        url : "",
        type : "POST",
        headers: {'X-CSRFToken': csrftoken},
        data : { id : id },
        
        complete: function() {
        location.href = 'deck';
        return true;
        }
        });
    });

    $('.deck-card').each(function swipe() {
        let touchstartX = 0;
        let touchstartY = 0;
        let touchendX = 0;
        let touchendY = 0;
        let card = this;

        this.addEventListener('touchstart', function(event) {
            touchstartX = event.changedTouches[0].screenX;
            touchstartY = event.changedTouches[0].screenY;
        }, false);

        this.addEventListener('touchend', function(event) {
            touchendX = event.changedTouches[0].screenX;
            touchendY = event.changedTouches[0].screenY;
            handleGesture();
        }, false); 

        function handleGesture() {
            if (touchendX - touchstartX <= -10 && !vertical()) {
                $(card).toggleClass('flipped');
            }
            
            if (touchstartX - touchendX <= 10 && !vertical()) {
                $(card).toggleClass('flipped');
            };
        }

        function vertical() {
            if (Math.sign('-1') < ((touchstartY - touchendY)/(touchstartX - touchendX)) < 1) {
                return true;
            }
            else {
                return false;
            };
        }
    });

    $('#create_deck').on('show.bs.modal', function(){
        $('#create_deck').find('#deck_name').focus();
    });
});