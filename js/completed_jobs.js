const User = new Parse.User();
var currentUser = Parse.User.current();
var currentUserId = currentUser.id;
const Status = Parse.Object.extend("Tracking");
const query = new Parse.Query(Status);
const query2 = new Parse.Query(Status);
query.equalTo("AssignedTo", currentUserId);
const query1 = new Parse.Query(Status);
query1.equalTo("Action", "completed");
query2.equalTo("Action", "reassigned - completed");
const composedQuery = Parse.Query.and(query, query1);
composedQuery.find().then(results => {
  if (typeof document !== "undefined") {
    createTable(results);
  }
  if(results.length==0){
    alert("No Records Found for completed jobs");
  }
});

const composedQuery1 = Parse.Query.and(query, query2);
composedQuery1.find().then(results => {
  if (typeof document !== "undefined") {
    createTable(results);
  }
  if(results.length==0){
    alert("No Records Found for reassigned - completed jobs");
  }
});

async function createTable(result) {
  for (let i = 0; i < result.length; i++) {
    var objects = result[i];
    const Files = Parse.Object.extend("Files");
    const query3 = new Parse.Query(Files);
    query3.equalTo("FileID", objects.get("FileID"));
    var files = await query3.find();
    for (let i = 0; i < files.length; i++) {
      var file = files[i];
      var tr = $('<tr>');
      $("#content").append(tr);
      $(tr).append("<td class='column1'>" + file.get("FileID") + "</td>");
      $(tr).append("<td class='column2'>" + file.get("PersonName") + "</td>");
      $(tr).append("<td class='column3'>" + file.get("ProblemDescription") + "</td>");
      $(tr).append("<td class='column4'>" + file.get("Priority") + "</td>");
      $(tr).append("<td class='column5'>" + file.get("DeliveryDate") + "</td>");
      if(objects.get("Action") == "reassigned - completed")
        $(tr).append("<td class='column6'>Reassigned</td>");
      else
        $(tr).append("<td class='column6'>New</td>");
      $(tr).append(
        "<td class='column7'>"+ result[i].get("Timestamp") +"</td>"
      );
    }
  }
}
