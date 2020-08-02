Parse.Cloud.define("jobDeadline", async (request) => {
  const query = new Parse.Query("Status");
  const query2 = new Parse.Query("User");
  const query3 = new Parse.Query("User");
  console.log("Params ", request.params.status);
  query.equalTo("Action", request.params.status);
  const results = await query.find();
  if (typeof results !== 'undefined') {
    var officerList;
    for (var i = 0; i < results.length; i++) {
      var dbDate = results[i].get("Timestamp");
      //console.log("DB Date ",dbDate);
      var dateDiff = Math.round(Math.abs(new Date() - dbDate) / 36e5);
      if (dateDiff >= 24 || dateDiff >= 3) {
        let officerID = results[i].get("AssignedTo");
        query2.equalTo("objectId", officerID);
        const officerContactNo = await query2.find();
        query3.equalTo('officerClass','admin');
        const adminContactNo = await query3.find();
        officerList = {
          OfficerID: officerID,
          FileID: results[i].get("FileID"),
          PhoneNumber: officerContactNo[0].get("contactDetails"),
          ContactNumber: officerContactNo[0].get('phoneNumber'),
          adminContactNumber: adminContactNo[0].get('phoneNumber'),
          adminPhoneNumber: adminContactNo[0].get('contactDetails')
        };
      }
    }
    if (typeof officerList !== 'undefined')
      return officerList;
    else
      return "No Results Found";
  }
  else {
    return "No Results Found";
  }
});

// Find users and save their contact details
Parse.Cloud.define("saveContactDetails", async (request) => {
  const query = new Parse.Query("User");
  var res1 = "None";
  query.equalTo("email", request.params.email);
  const results = await query.find();
  if (typeof results !== 'undefined') {
    var res = update(results, request);
    if (res == 1)
      res1 = "Success";
  }
  function update(result, req) {
    const query = new Parse.Query("User");
    var user_id = req.params.user_id.toString();
    console.log("User ID recieved ", user_id);
    for (var i = 0, k = user_id; i < result.length; i++) {
      query.get(result[i].id).then((user, j = k) => {
        // Updates the data we want
        var user_id = j;
        console.log("User ID inside ", user_id);
        user.set('contactDetails', user_id);
        // Saves the user with the updated data
        Parse.Object.saveAll([user], { useMasterKey: true }).then((response) => {
          console.log('Updated user', response);
          return 1;
        })
          .catch((error) => {
            console.error('Error while updating user', error);
            return 0;
          });
      });
    }
  }
  console.log("Res 1 ", res1);
  return "Success";
});

//Reassign Jobs to higer ups
Parse.Cloud.define("reassign", async (request) => {
  const Tracking = Parse.Object.extend("Tracking");
  const tracking = new Tracking();
  const query = new Parse.Query("Status");
  const query2 = new Parse.Query("User");
  const query3 = new Parse.Query("User");
  query.equalTo("Action", "completed");
  query.find().then((results) => {
    if (results.length != 0) {
      for (var i = 0; i < results.length; i++) {
        if (results[i].get('AssignmentType') == 'manual') {
          console.log("Inside Custom Hierarchy");
          var list = results[i].get('CustomHierarchy');
          officerID = results[i].get("AssignedTo");
          query2.equalTo("objectId", officerID);
          var objID = results[i].id;
          query2.find().then((result) => {
            officerClass = result[0].get("officerClass");
            console.log("Custom officer Class ", officerClass);
            var index = list.indexOf(officerClass) + 1;
            console.log("Index ", index);
            if ((index) == list.length) {
              console.log("Reached end of custom");
              const Status = Parse.Object.extend("Status");
              const findFilesQuery = new Parse.Query(Status);
              findFilesQuery.equalTo('objectId', objID);
              findFilesQuery.find().then((res) => {
                res[0].set('Action', 'end');
                res[0].save().then(
                  (save) => {
                    if (typeof document !== 'undefined')
                      console.log("Updated to Status", save);
                  },
                  (error) => {
                    if (typeof document !== 'undefined')
                      console.log("Not Updated to Status", error);
                  }
                );
              });
            } else {
              var find = list[index];
              console.log("Find ", find);
              query3.equalTo("officerClass", find);
              query3.find().then((users) => {
                console.log("Users ", users);
                if (users.length > 1) {
                  const assign = Math.floor((Math.random() * users.length) + 1);
                  console.log("Assign ", assign);
                  officerID = users[assign].id;
                  console.log(officerID);
                }
                else {
                  console.log("Officer ID ", officerID);
                  officerID = users[0].id;
                  console.log("Assign ", officerID);
                }
              });
              const Status = Parse.Object.extend("Status");
              const findFilesQuery = new Parse.Query(Status);
              const findFilesQuery1 = new Parse.Query(Status);
              findFilesQuery.equalTo("Action", "completed");
              findFilesQuery.find().then((results) => {
                for (var i = 0; i < results.length; i++) {
                  console.log("Last done by officer id ", results[i].get("AssignedTo"));
                  if (results[i].get("AssignedTo") != officerID) {
                    //document.write(`${JSON.stringify(results)}`);
                    var objectID = results[i].id;
                    // //store to Tracking DB
                    tracking.set('FileID', results[i].get("FileID"));
                    tracking.set('AssignedTo', officerID);
                    tracking.set('Timestamp', new Date());
                    tracking.set('Action', "created");

                    tracking.save().then(
                      (result) => {
                        if (typeof document !== 'undefined')
                          //document.write(`Officers found: ${JSON.stringify(result)}`);
                          console.log('Success', result);
                      },
                      (error) => {
                        if (typeof document !== 'undefined')
                          console.error('Files not saved to Tracking', error);
                      }
                    );

                    //Store to Status
                    findFilesQuery1.get(objectID).then((object) => {
                      //document.write(`${JSON.stringify(object)}`);

                      object.set('FileID', object.get("FileID"));
                      object.set('AssignedTo', officerID);
                      object.set('Timestamp', new Date());
                      object.set('Action', "created");
                      object.save().then(
                        (save) => {
                          if (typeof document !== 'undefined')
                            console.log("Updated to Status", save);
                        },
                        (error) => {
                          if (typeof document !== 'undefined')
                            console.log("Not Updated to Status", error);
                        }
                      );
                    },
                      (error) => {
                        console.log("Error finding object ", error);
                      });

                  }
                }
              });
            }
          });
        } else {
          officerID = results[i].get("AssignedTo");
          query2.equalTo("objectId", officerID);
          query2.find().then((result) => {
            officerClass = result[0].get("officerClass");
            var find;
            if (parseInt(officerClass) == 5) {
              find = "4"
            }
            if (parseInt(officerClass) == 4) {
              find = "3"
            }
            if (parseInt(officerClass) == 3) {
              find = "2"
            }
            if (parseInt(officerClass) == 2) {
              find = "1"
            }
            if (parseInt(officerClass) == 1) {
              find = "0";
            }
            if (parseInt(find) != 0) {
              query3.equalTo("officerClass", find);
              query3.find().then((users) => {
                console.log("Users ", users);
                if (users.length > 1) {
                  const assign = Math.floor((Math.random() * users.length) + 1);
                  console.log("Assign ", assign);
                  officerID = users[assign].id;
                  console.log(officerID);
                }
                else {
                  console.log("Officer ID ", officerID);
                  officerID = users[0].id;
                  console.log("Assign ", officerID);
                }
              });
              const Status = Parse.Object.extend("Status");
              const findFilesQuery = new Parse.Query(Status);
              const findFilesQuery1 = new Parse.Query(Status);
              findFilesQuery.equalTo("Action", "completed");
              findFilesQuery.find().then((results) => {
                for (var i = 0; i < results.length; i++) {
                  console.log("Last done by officer id ", results[i].get("AssignedTo"));
                  if (results[i].get("AssignedTo") != officerID) {
                    //document.write(`${JSON.stringify(results)}`);
                    var objectID = results[i].id;
                    // //store to Tracking DB
                    tracking.set('FileID', results[i].get("FileID"));
                    tracking.set('AssignedTo', officerID);
                    tracking.set('Timestamp', new Date());
                    tracking.set('Action', "created");

                    tracking.save().then(
                      (result) => {
                        if (typeof document !== 'undefined')
                          //document.write(`Officers found: ${JSON.stringify(result)}`);
                          console.log('Success', result);
                      },
                      (error) => {
                        if (typeof document !== 'undefined')
                          console.error('Files not saved to Tracking', error);
                      }
                    );

                    //Store to Status
                    findFilesQuery1.get(objectID).then((object) => {
                      //document.write(`${JSON.stringify(object)}`);

                      object.set('FileID', object.get("FileID"));
                      object.set('AssignedTo', officerID);
                      object.set('Timestamp', new Date());
                      object.set('Action', "created");
                      object.save().then(
                        (save) => {
                          if (typeof document !== 'undefined')
                            console.log("Updated to Status", save);
                        },
                        (error) => {
                          if (typeof document !== 'undefined')
                            console.log("Not Updated to Status", error);
                        }
                      );
                    },
                      (error) => {
                        console.log("Error finding object ", error);
                      });

                  }
                }
              });
            }
          });
        }
      }
    }
  });
  return "Success";
});

Parse.Cloud.define("reassignJobs", async (request) => {
  const Tracking = Parse.Object.extend("Tracking");
  const tracking = new Tracking();
  const query = new Parse.Query("Status");
  const query2 = new Parse.Query("User");
  const query3 = new Parse.Query("User");
  query.equalTo('Action', 'reassigned - completed');
  query.find().then((results) => {
    if (results.length != 0) {
      for (var i = 0; i < results.length; i++) {
        if (results[i].get('AssignmentType') == 'manual') {
          console.log("Inside Custom Hierarchy reassigned");
          var list = results[i].get('CustomHierarchy');
          officerID = results[i].get("AssignedTo");
          query2.equalTo("objectId", officerID);
          var objID = results[i].id;
          query2.find().then((result) => {
            officerClass = result[0].get("officerClass");
            var index = list.indexOf(officerClass) + 1;
            console.log("Index ", index);
            if ((index) == list.length) {
              console.log("Reached end of custom reassigned");
              const Status = Parse.Object.extend("Status");
              const findFilesQuery = new Parse.Query(Status);
              findFilesQuery.equalTo('objectId', objID);
              findFilesQuery.find().then((res) => {
                res[0].set('Action', 'end');
                res[0].save().then(
                  (save) => {
                    if (typeof document !== 'undefined')
                      console.log("Updated to Status", save);
                  },
                  (error) => {
                    if (typeof document !== 'undefined')
                      console.log("Not Updated to Status", error);
                  }
                );
              });
            } else {
              var find = list[index];
              console.log("Find ", find);
              query3.equalTo("officerClass", find);
              query3.find().then((users) => {
                console.log("Users ", users);
                if (users.length > 1) {
                  const assign = Math.floor((Math.random() * users.length) + 1);
                  console.log("Assign ", assign);
                  officerID = users[assign].id;
                  console.log(officerID);
                }
                else {
                  console.log("Officer ID ", officerID);
                  officerID = users[0].id;
                  console.log("Assign ", officerID);
                }
              });
              const Status = Parse.Object.extend("Status");
              const findFilesQuery = new Parse.Query(Status);
              const findFilesQuery1 = new Parse.Query(Status);
              findFilesQuery.equalTo("Action", "reassigned - completed");
              findFilesQuery.find().then((results) => {
                for (var i = 0; i < results.length; i++) {
                  console.log("Last done by officer id ", results[i].get("AssignedTo"));
                  if (results[i].get("AssignedTo") != officerID) {
                    //document.write(`${JSON.stringify(results)}`);
                    var objectID = results[i].id;
                    // //store to Tracking DB
                    tracking.set('FileID', results[i].get("FileID"));
                    tracking.set('AssignedTo', officerID);
                    tracking.set('Timestamp', new Date());
                    tracking.set('Action', "reassigned - created");

                    tracking.save().then(
                      (result) => {
                        if (typeof document !== 'undefined')
                          //document.write(`Officers found: ${JSON.stringify(result)}`);
                          console.log('Success', result);
                      },
                      (error) => {
                        if (typeof document !== 'undefined')
                          console.error('Files not saved to Tracking', error);
                      }
                    );

                    //Store to Status
                    findFilesQuery1.get(objectID).then((object) => {
                      //document.write(`${JSON.stringify(object)}`);

                      object.set('FileID', object.get("FileID"));
                      object.set('AssignedTo', officerID);
                      object.set('Timestamp', new Date());
                      object.set('Action', "reassigned - created");
                      object.save().then(
                        (save) => {
                          if (typeof document !== 'undefined')
                            console.log("Updated to Status", save);
                        },
                        (error) => {
                          if (typeof document !== 'undefined')
                            console.log("Not Updated to Status", error);
                        }
                      );
                    },
                      (error) => {
                        console.log("Error finding object ", error);
                      });

                  }
                }
              });
            }
          });
        } else {
          officerID = results[i].get("AssignedTo");
          query2.equalTo("objectId", officerID);
          query2.find().then((result) => {
            officerClass = result[0].get("officerClass");
            var find;
            if (parseInt(officerClass) == 5) {
              find = "4"
            }
            if (parseInt(officerClass) == 4) {
              find = "3"
            }
            if (parseInt(officerClass) == 3) {
              find = "2"
            }
            if (parseInt(officerClass) == 2) {
              find = "1"
            }
            query3.equalTo("officerClass", find);
            query3.find().then((users) => {
              console.log("Users ", users);
              if (users.length > 1) {
                const assign = Math.floor((Math.random() * users.length) + 1);
                console.log("Assign ", assign);
                officerID = users[assign].id;
                console.log(officerID);
              }
              else {
                console.log("Officer ID ", officerID);
                officerID = users[0].id;
                console.log("Assign ", officerID);
              }
            });
            const Status = Parse.Object.extend("Status");
            const findFilesQuery = new Parse.Query(Status);
            const findFilesQuery1 = new Parse.Query(Status);
            findFilesQuery.equalTo("Action", "reassigned - completed");
            findFilesQuery.find().then((results) => {
              for (var i = 0; i < results.length; i++) {
                console.log("Last done by officer id ", results[i].get("AssignedTo"));
                if (results[i].get("AssignedTo") != officerID) {
                  //document.write(`${JSON.stringify(results)}`);
                  var objectID = results[i].id;
                  // //store to Tracking DB
                  tracking.set('FileID', results[i].get("FileID"));
                  tracking.set('AssignedTo', officerID);
                  tracking.set('Timestamp', new Date());
                  tracking.set('Action', "reassigned - created");

                  tracking.save().then(
                    (result) => {
                      if (typeof document !== 'undefined')
                        //document.write(`Officers found: ${JSON.stringify(result)}`);
                        console.log('Success', result);
                    },
                    (error) => {
                      if (typeof document !== 'undefined')
                        console.error('Files not saved to Tracking', error);
                    }
                  );

                  //Store to Status
                  findFilesQuery1.get(objectID).then((object) => {
                    //document.write(`${JSON.stringify(object)}`);

                    object.set('FileID', object.get("FileID"));
                    object.set('AssignedTo', officerID);
                    object.set('Timestamp', new Date());
                    object.set('Action', "reassigned - created");
                    object.save().then(
                      (save) => {
                        if (typeof document !== 'undefined')
                          console.log("Updated to Status", save);
                      },
                      (error) => {
                        if (typeof document !== 'undefined')
                          console.log("Not Updated to Status", error);
                      }
                    );
                  },
                    (error) => {
                      console.log("Error finding object ", error);
                    });
                }
              }
            });
          });
        }
      }
    }
  });
  return "Success from Reassigned";
});
