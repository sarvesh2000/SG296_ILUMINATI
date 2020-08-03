$(document).ready(function(){
    var query = new Parse.Query("Files");
    query.ascending("objectId");
    query.find().then((result)=>{
        console.log("Result ",result);
        result.forEach(element => {
            var tr = $('<tr>');
            $("#myContent").append(tr);
            $(tr).append('<td>' + element.get('FileID') + '</td>');
            $(tr).append('<td>' + element.get('PersonName') + '</td>');
            $(tr).append('<td>' + element.get('Priority') + '</td>');
            $(tr).append('<td>' + element.get('Address') + '</td>');
            $(tr).append('<td>' + element.get('ProblemDescription') + '</td>');
            $(tr).append('<td>' + element.get('Category') + '</td>');
            $(tr).append('<td>' + element.get('AssignmentType') + '</td>');
            var list = element.get('CustomHierarchy');
            $(tr).append('<td>' + element.get('CustomHierarchy') + '</td>');
            $(tr).append('<td>' + element.get('DeliveryDate') + '</td>');
        });
        $('#myTable').DataTable();
    });
});