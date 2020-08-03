$(document).ready(function(){
    var query = new Parse.Query("User");
    var query2 = new Parse.Query("Tracking");
    var query3 = new Parse.Query("Tracking");
    var query4 = new Parse.Query("Status");
    var query5 = new Parse.Query("Status");
    query.ascending("objectId");
    query.find().then((result)=>{
        result.forEach(element => {
            var officerId = element.id;
            query2.equalTo('Action','created');
            query3.equalTo('AssignedTo',officerId);
            const composedQuery = Parse.Query.and(query2,query3);
            composedQuery.count().then((count)=>{
                console.log("New Jobs Count ",count);
                sessionStorage.setItem('assigned',count);
            });
            query2.equalTo('Action','completed');
            query3.equalTo('AssignedTo',officerId);
            composedQuery.count().then((count)=>{
                console.log("Completed Jobs Count ",count);
                sessionStorage.setItem('completed',count);
            });
            query5.equalTo('AssignedTo',officerId);
            query4.equalTo('Action','Pending');
            const composedQuery1 = Parse.Query.and(query4,query5);
            composedQuery.count().then((count)=>{
                console.log("Pending Jobs Count ",count);
                sessionStorage.setItem('pending',count);
            });
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
            $(tr).append('<td>' + sessionStorage.getItem('assigned') + '</td>');
            $(tr).append('<td>' + sessionStorage.getItem('completed') + '</td>');
            $(tr).append('<td>' + sessionStorage.getItem('pending') + '</td>');
            
            $('#myTable').DataTable();
        });
    });
});