function change(){
    console.log("Change Triggered");
    if(this.value == 'automatic'){
        if($("#customHierarchy").css('display') != 'none')
            $("#customHierarchy").css('display','none');
    }else{
        $("#customHierarchy").css('display','');
    }
}
function generateFileNo(){
    var fullDate = new Date();
    var month = (fullDate.getMonth() +1);
    if(month < 9)
        month = "0" + month.toString();
    var year = fullDate.getFullYear().toString();
    var date = fullDate.getDate().toString();
    var fileNo;
    if(localStorage.getItem('fileNo')){
        fileNo =  localStorage.getItem('fileNo');
        fileNoInt =parseInt(fileNo) + 1;
        if(fileNoInt < 9)
            fileNo = "0" + fileNoInt.toString();
        else
            fileNo = fileNoInt.toString();
    }
    else{
        fileNo = "00";
        localStorage.setItem('fileNo',"00");
    }
    var fileString = year + month + date + fileNo;
    document.getElementById("fileID").value = fileString;
    localStorage.setItem('fileNo', fileNo);
        
}
async function assign(flag = 0){
    const User = new Parse.User();
    const query= new Parse.Query(User);
    if(flag == 1)
        query.equalTo("officerClass","1");
    else
        query.equalTo("officerClass","5");
    /*const query1 = new Parse.Query(User);
    query1.get('objectId');
    const composedQuery = Parse.Query.and(query1, query2);
    composedQuery.find().then(posts => {
        if (typeof document !== 'undefined') document.write(`Officers found: ${JSON.stringify(posts)}`);
        console.log(`Officers found: ${JSON.stringify(posts)}`);
      });*/
      await query.find().then((users) => {
            console.log(users);
            var officerId;
            const assign = Math.floor((Math.random() * users.length) + 1);
            console.log("Assign ",assign);
            if(assign != 1)
                officerId=users[assign-1].id;
            else
                officerId = users[0].id;
            console.log(officerId);

            const Tracking = Parse.Object.extend('Tracking');
            const track = new Tracking();
            //store to Tracking DB
            track.set('FileID', document.getElementById("fileID").value);
            track.set('AssignedTo',officerId);
            track.set('Timestamp',new Date());
            track.set('Action',"created");
            
            track.save().then(
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
            const Status = Parse.Object.extend('Status');
            const status = new Status();
            status.set('FileID', document.getElementById("fileID").value);
            status.set('AssignedTo',officerId);
            status.set('Timestamp',new Date());
            status.set('Action',"created");
            status.save().then(
                (save) => {
                    if(typeof document !== 'undefined')
                    console.log("Saved to Status", save);
                    $("#save").addClass("disabled");
                    document.getElementById("save").setAttribute("disabled", true);
                },
                (error) => {
                    if(typeof document !== 'undefined')
                    console.log("Not Saved to Status",error);
                }
            );

      });      
    //   generateFileNo();
}
function dataEntry(){
        const Files = Parse.Object.extend('Files');
        const myNewObject = new Files();
        //stores data to DB
        myNewObject.set('FileID', document.getElementById("fileID").value);
        myNewObject.set('PersonName', document.getElementById("personName").value);
        myNewObject.set('Address', document.getElementById("address").value);
        myNewObject.set('Category', document.getElementById("category").value);
        myNewObject.set('ProblemDescription', document.getElementById("problemDescription").value);
        myNewObject.set('DeliveryDate', new Date(document.getElementById("delivery").value));
        if(document.getElementById("priority1").checked){
            myNewObject.set('Priority', document.getElementById("priority1").value);
        }else{
            myNewObject.set('Priority', document.getElementById("priority2").value);
        }
        if(document.getElementById("assignmentType").value == 'manual'){
            myNewObject.set('AssignmentType', 'manual');
            var list = [];
            if($("#hierarchy1").val() != '')
                list.push($("#hierarchy1").val());
            if($("#hierarchy2").val() != '')
                list.push($("#hierarchy2").val());
            if($("#hierarchy3").val() != '')
                list.push($("#hierarchy3").val());
            if($("#hierarchy4").val() != '')
                list.push($("#hierarchy4").val());
            if($("#hierarchy5").val() != '')
                list.push($("#hierarchy5").val());
            myNewObject.set('CustomHierarchy', list);
        }else{
            myNewObject.set('AssignmentType', 'automatic');
            var list = [];
            myNewObject.set('CustomHierarchy', list);
        }
    //QR Code Generation
      var path=qr();
      $('#qr').prop('src', path);
      
      //save to DB
      myNewObject.save().then(
      (result) => {
          if (typeof document !== 'undefined') 
          console.log('Files created', result);
      },
      (error) => {
          if (typeof document !== 'undefined') document.location.href="entry.html";
          console.error('Error while creating Files: ', error);
      }
      );
      
      if(document.getElementById("assignmentType").value == 'automatic'){
        if(document.getElementById("priority1").checked)
            assign(1);
        else
            assign();   
      }else{

      }
}

//function to return QR Code URL
function qr(){
    var id=document.getElementById("fileID").value;
    return 'https://barcode.tec-it.com/barcode.ashx?data='+id+'&code=QRCode&multiplebarcodes=false&translate-esc=false&unit=Fit&dpi=96&imagetype=Gif&rotation=0&color=%23000000&bgcolor=%23ffffff&qunit=Mm&quiet=0&eclevel=L';
}

//To print the entry page
function printPage(){
    window.print();
}