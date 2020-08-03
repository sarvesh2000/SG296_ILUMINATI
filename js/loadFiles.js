$(document).ready(function(){
    var query = new Parse.Query("Files");
    var query2 = new Parse.Query("Status");
    query.ascending("objectId");
    query.find().then((result)=>{
        console.log("Result ",result);
        result.forEach(element => {
            var FileID = element.get('FileID');
            query2.equalTo('FileID',FileID);
            query2.find().then((res)=>{
                res.forEach(function(item){
                    var assignedTo = item.get('AssignedTo');
                    var status = item.get('Action');
                    var tr = $('<tr>');
                    $("#myContent").append(tr);
                    $(tr).append('<td>' + element.get('FileID') + '</td>');
                    $(tr).append('<td>' + element.get('PersonName') + '</td>');
                    $(tr).append('<td>' + element.get('Priority') + '</td>');
                    $(tr).append('<td>' + element.get('Address') + '</td>');
                    $(tr).append('<td>' + element.get('ProblemDescription') + '</td>');
                    $(tr).append('<td>' + element.get('Category') + '</td>');
                    $(tr).append('<td>' + element.get('AssignmentType') + '</td>');
                    if(typeof element.get('CustomHierarchy') === 'undefined')
                        $(tr).append('<td>None</td>');
                    else
                        $(tr).append('<td>' + element.get('CustomHierarchy') + '</td>');
                    $(tr).append('<td>' + element.get('DeliveryDate') + '</td>');
                    $(tr).append('<td>' + assignedTo + '</td>');
                    $(tr).append('<td>' + status + '</td>');
                    $('#myTable').DataTable();
                });
            });
        });
    });
});