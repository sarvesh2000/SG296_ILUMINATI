$(document).ready(function(){
    var query = new Parse.Query("User");
    query.ascending("objectId");
    query.find().then((result)=>{
        result.forEach(element => {
            var tr = $('<tr>');
            $("#myContent").append(tr);
            $(tr).append('<td>' + element.id + '</td>');
            $(tr).append('<td>' + element.getUsername() + '</td>');
            $(tr).append('<td>' + element.get('officerClass') + '</td>');
            $(tr).append('<td>' + element.get('accountStatus') + '</td>');
            if(typeof element.get('email') === 'undefined')
                $(tr).append('<td>Not Registered</td>');
            else
            $(tr).append('<td>' + element.get('email') + '</td>');
            if(typeof element.get('phoneNumber') === 'undefined')
                $(tr).append('<td>Not Registered</td>');
            else
                $(tr).append('<td>' + element.get('phoneNumber') + '</td>');
            if(typeof element.get('contactDetails') === 'undefined')
                $(tr).append('<td>Not Registered</td>');
            else
                $(tr).append('<td>' + element.get('contactDetails') + '</td>');
            $('#myTable').DataTable();
        });
    });
});