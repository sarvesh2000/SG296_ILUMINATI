function submitFile(){
    var FileID = document.getElementById("FileID");
    var hashVal = location.hash.substr(1);
    const User = new Parse.User();
    var currentUser= Parse.User.current();
    var currentUserId = currentUser.id;

    if(FileID.innerHTML == "")
        alert("Please Scan the QR Code of the File to submit");
    else if(hashVal == FileID.innerHTML){
        const Status = Parse.Object.extend('Status');
        const query = new Parse.Query(Status);
        query.equalTo('FileID', FileID.innerHTML);
        query.find().then((results)=>{
            var jobType = results[0].get('Action');
            if(jobType == 'reassigned - pending'){
                const Tracking = Parse.Object.extend("Tracking");
                const tracking = new Tracking();
                tracking.set("FileID",FileID.innerHTML);
                tracking.set("AssignedTo",currentUserId);
                tracking.set("Action","reassigned - completed");
                tracking.set("Timestamp", new Date());
                tracking.save().then(
                    (result) => {
                        if(typeof document !=='undefined') 
                        //document.write(`Officers found: ${JSON.stringify(result)}`);
                        console.log('Success', result);
                    },
                    (error) => {
                        if(typeof document !== 'undefined')
                        console.error('Files not saved to Tracking', error);
                    }
                );
                const status = new Status();
                const query = new Parse.Query(Status);
                const query2 = new Parse.Query(Status);
                query.equalTo("AssignedTo",currentUserId);
                query.find().then((result)=>{
                    query2.get(result[0].id).then((object) => {
                        object.set('FileID', FileID.innerHTML);
                        object.set('AssignedTo',currentUserId);
                        object.set('Timestamp',new Date());
                        object.set('Action',"reassigned - completed");
                        object.save().then(
                            (save) => {
                                if(typeof document !== 'undefined')
                                    console.log("Saved to Status", save);
                                    alert("Job Completed");
                                    window.location.href = "dashboard.html";
                                },
                            (error) => {
                                if(typeof document !== 'undefined')
                                    console.log("Not Saved to Status",error);
                            }
                        );
                    });
                });
            }else{
                const Tracking = Parse.Object.extend("Tracking");
                const tracking = new Tracking();
                tracking.set("FileID",FileID.innerHTML);
                tracking.set("AssignedTo",currentUserId);
                tracking.set("Action","completed");
                tracking.set("Timestamp", new Date());
                tracking.save().then(
                    (result) => {
                        if(typeof document !=='undefined') 
                        //document.write(`Officers found: ${JSON.stringify(result)}`);
                        console.log('Success', result);
                    },
                    (error) => {
                        if(typeof document !== 'undefined')
                        console.error('Files not saved to Tracking', error);
                    }
                );
                const status = new Status();
                const query = new Parse.Query(Status);
                const query2 = new Parse.Query(Status);
                query.equalTo("AssignedTo",currentUserId);
                query.find().then((result)=>{
                    query2.get(result[0].id).then((object) => {
                        object.set('FileID', FileID.innerHTML);
                        object.set('AssignedTo',currentUserId);
                        object.set('Timestamp',new Date());
                        object.set('Action',"completed");
                        object.save().then(
                            (save) => {
                                if(typeof document !== 'undefined')
                                    console.log("Saved to Status", save);
                                    alert("Job Completed");
                                    window.location.href = "dashboard.html";
                                },
                            (error) => {
                                if(typeof document !== 'undefined')
                                    console.log("Not Saved to Status",error);
                            }
                        );
                    });
                });
            }
        });
    }else{
        alert("Please Scan the correct file to proceed");
    }

}