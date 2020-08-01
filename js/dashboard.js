//Function to count newly assigned jobs and retun value to dashboard.
async function countNewlyAssignedJobs() {
    var Status = Parse.Object.extend("Status");
    var query = new Parse.Query(Status);
    const User = new Parse.User();
    var currentUser= Parse.User.current();
    query.equalTo("AssignedTo", currentUser.id);
    var query2 = new Parse.Query(Status);
    query2.equalTo("Action","created");
    const composedQuery= Parse.Query.and(query,query2);
    const count = await composedQuery.count();
    var output= "<h6 class='card-subtitle mb-2 text-muted'>"+count+"</h6>";
    document.getElementById("newTotal").innerHTML = output;
    query2.equalTo("Action","reassigned - created");
    const composedQuery1= Parse.Query.and(query,query2);
    const count1 = await composedQuery1.count();
    var oldCount= count;
    var newCount = oldCount + count1;
    var output= "<h6 class='card-subtitle mb-2 text-muted'>"+newCount+"</h6>";
    document.getElementById("newTotal").innerHTML = output;
  }
//Function to count completed jobs and return value to dashboard
async function countCompletedJobs(){
  console.log("Inside completed jobs");
  var Status = Parse.Object.extend("Tracking");
  var query = new Parse.Query(Status);
  const User = new Parse.User();
  var currentUser= Parse.User.current();
  query.equalTo("AssignedTo", currentUser.id);
  var query2 = new Parse.Query(Status);
  query2.equalTo("Action","completed");
  const composedQuery= Parse.Query.and(query,query2);
  const count = await composedQuery.count();
  var output= "<h6 class='card-subtitle mb-2 text-muted'>"+count+"</h6>";
  document.getElementById("completedTotal").innerHTML = output;
  query2.equalTo("Action","reassigned - completed");
  const composedQuery1= Parse.Query.and(query,query2);
  const count1 = await composedQuery1.count();
  var oldCount= count;
  var newCount = oldCount + count1;
  var output= "<h6 class='card-subtitle mb-2 text-muted'>"+newCount+"</h6>";
  document.getElementById("completedTotal").innerHTML = output;
}

//Function to count existing jobs and return value to dashboard
async function countExistingJobs(){
    var Status = Parse.Object.extend("Status");
    var query = new Parse.Query(Status);
    const User = new Parse.User();
    var currentUser= Parse.User.current();
    query.equalTo("AssignedTo", currentUser.id);
    var query2 = new Parse.Query(Status);
    query2.equalTo("Action","pending");
    const composedQuery= Parse.Query.and(query,query2);
    const count = await composedQuery.count();
    var output= "<h6 class='card-subtitle mb-2 text-muted'>"+count+"</h6>";
    document.getElementById("existingTotal").innerHTML = output;
    query2.equalTo("Action","reassigned - pending");
    const composedQuery1= Parse.Query.and(query,query2);
    const count1 = await composedQuery1.count();
    var oldCount= count;
    var newCount = oldCount + count1;
    var output= "<h6 class='card-subtitle mb-2 text-muted'>"+newCount+"</h6>";
    document.getElementById("existingTotal").innerHTML = output;
  }