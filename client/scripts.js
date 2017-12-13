
document.addEventListener("DOMContentLoaded",function(){


var chirpstring;
var existingchirps;

    function deletechirp(chirpID){
            $.ajax({
                method: 'DELETE',
                url: "/api/chirps/" + chirpID
            }).then(() => {
                console.log('client side success')
                getChirps();
                
            })
        }




$('#chirpbutton').click(function(){
        postChirp();
})


function postChirp(){

    var message = $('#chirpinput').val();
    var user = 'Brandon';
    var d = new Date();
    var time = (d.getHours()+" :"+d.getMinutes()+" :"+d.getSeconds())

    
   
    
 //PUSH CHIRPS TO SQL   

    var chirp = {
        message: message,
        user: user,
        
    }    
     $.ajax({
        method: "POST",
        url: "/api/chirps",
        contentType: "application/json",
        data: JSON.stringify(chirp)
    });
    getChirps();    
}


//GET CHIRPS FROM SQL QUERY
    function getChirps(){ 
        $.ajax({
            method: "GET",
            url: "/api/chirps",
        }).then((data) => {
            let chirps = data;

            for(i = 0; i < chirps.length; i++){
                createChirpDiv(chirps[i]);
            }

            })
        } 
    
    function createChirpDiv (chirp) {
        var chirpDiv = $('<div></div>')
        var chirpmessage = $('<li></li>');
        var chirpuser = $('<li></li>');
        var chirptime = $('<li></li>');
        var chirpdelete = $('<button id= delete></button>');
                   
        $('<li></li>').text(chirp.id).appendTo(chirpDiv);
        $(chirpmessage).text(chirp.message).appendTo(chirpDiv);
        $(chirpuser).text(chirp.user).appendTo(chirpDiv);
        $(chirptime).text(chirp.time).appendTo(chirpDiv);
        $(chirpdelete).text("delete").attr('id', chirp.id).attr('val', chirp.id).appendTo(chirpDiv);
    

        $(chirpDiv).appendTo('#chirpbox');


        $(chirpdelete).click(() => {
            deletechirp(chirp.id);
            console.log(chirp.id);
        });
    }
    getChirps();
})

   



