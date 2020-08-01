async function search(){
    var fileID = document.getElementById("search");
    if($("#search_results").html() != "")
        document.getElementById("search_results").innerHTML = "";
    if(fileID.value == ""){
        alert("Please Enter a file number to search");
    }else{
        const query = new Parse.Query("Tracking");
        query.descending("Timestamp");
        query.equalTo("FileID",fileID.value);
        const results = await query.find();
        if(results.length == 0){
            alert("No Results Found");
        }else{
            for (let i = 0; i < results.length; i++) {
                var file = results[i];
                console.log("Type ",typeof(file.get("FileID")));
                var functionCall = 'reassign(' + '\'' + file.get("FileID") + '\'' + ',' + '\''+ file.get("AssignedTo") + '\'' + ')';
                // alert(object.id + ' - ' + object.get('playerName'));
                var tr = $('<tr>');
                $("#search_results").append(tr);
                $(tr).append("<td>" + file.get("FileID") + "</td>");
                $(tr).append("<td>" + file.get("AssignedTo") + "</td>");
                $(tr).append("<td>" + file.get("Action") + "</td>");
                $(tr).append("<td>" + file.get("Timestamp") + "</td>");
                $(tr).append("<td><a class='btn btn-primary' role='button' onclick=" +  functionCall + ">Reassign</a></td>");
            }
        }
    }
}

async function reassign(FileId, officerId){
    const User = new Parse.User();
    const query= new Parse.Query("Status");
    const Tracking = Parse.Object.extend("Tracking");
    const tracking = new Tracking();
    const Status = Parse.Object.extend("Status");
    const status = new Status();

    tracking.set('FileID', FileId);
    tracking.set('AssignedTo', officerId);
    tracking.set('Action', 'reassigned - created');
    tracking.set('Timestamp', new Date());

    tracking.save().then(
    (result) => {
        if (typeof document !== 'undefined')
        console.log('Tracking created', result);
    },
    (error) => {
        if (typeof document !== 'undefined')
        console.error('Error while creating Tracking: ', error);
    }
    );
    query.equalTo("FileID",FileId);
    var results = await query.find();
    query.get(results[0].id).then((object) => {
        object.set('FileID', FileId);
        object.set('AssignedTo', officerId);
        object.set('Action', 'reassigned - created');
        object.set('Timestamp', new Date());
        object.save().then((response) => {
          // You can use the "get" method to get the value of an attribute
          // Ex: response.get("<ATTRIBUTE_NAME>")
          if (typeof document !== 'undefined') 
          console.log('Updated Status', response);
        }, (error) => {
          if (typeof document !== 'undefined') 
          console.error('Error while updating Status', error);
        });
      });
    
}