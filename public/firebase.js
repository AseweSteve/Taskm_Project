
const firebaseConfig = {
    apiKey: "AIzaSyB3lObD9E_ahZFYq1doYLg5gSP7mrdsFbw",
    authDomain: "asewetaskmproject.firebaseapp.com",
    projectId: "asewetaskmproject",
    storageBucket: "asewetaskmproject.appspot.com",
    messagingSenderId: "538569922554",
    appId: "1:538569922554:web:96cd3dbad4633d99a23643",
    measurementId: "G-KJ1XJJ1FR8"
  };
  
firebaseConfig.initializeApp(firebaseConfig)

// Listening to load event on window
// Reading the number of tasks stored in the database
var totalItems;
var maxCode;
var code;
window.addEventListener("load",function(){
    console.log("Complete Window LOADED");
    firebase.database().ref('TotalTasks').on('value', function(snapshot){
        totalItems = snapshot.val().totalItems;
        maxCode = snapshot.val().maxCode;
        console.log("The total Items are : " + totalItems);
        if(totalItems > 0 && document.getElementById("info") != null){
            document.getElementById("info").remove();
        }
        if(totalItems === 0){
            firebase.database().ref('TotalTasks').update({
                maxCode : 0
            })
        }
    });
    
})

// Function to change the status of a task -> whether the task is pending or complete
// Features :- 
// change the color from gray to green and vice versa for tick mark on the extreme right side
// change the color and disabled attribute for edit button
// show or hide the innerHTML of element with status id


function changeStatus(code){
    var status;
    firebase.database().ref('TaskList/'+code).on('value', function(snapshot){
        status = snapshot.val().status;
    });

    if(status === "pending")
    {
        firebase.database().ref('TaskList/'+code).update({
            status : "completed"
        })
        document.getElementById(code).querySelector("#done").style.color = "#00b200";
        document.getElementById(code).querySelector("#editbtn").disabled = true;
        document.getElementById(code).querySelector("#editbtn").style.backgroundColor = "rgba(116, 116, 116, 0.671)";
        document.getElementById(code).querySelector("#status").innerHTML = `
            <i class="far fa-check-circle"></i> Completed
            `;
    }
    else
    {
        firebase.database().ref('TaskList/'+code).update({
            status : "pending"
        })
        document.getElementById(code).querySelector("#done").style.color = "gray";
        document.getElementById(code).querySelector("#editbtn").disabled = false;
        if (document.getElementById(code).querySelector("#editbtn").style.removeProperty) {
            document.getElementById(code).querySelector("#editbtn").style.removeProperty('background-color');
        } else {
            document.getElementById(code).querySelector("#editbtn").style.removeAttribute('background-color');
        }
        document.getElementById(code).querySelector("#status").innerHTML = "";
    }
    
}
// Reads the data from the form -> updates it in the database -> clears the fields, deletes update and cancel btns and adds the add btn
// -> display the updated info in the tasks bar
function updateData(c){
    var updatedTask = document.getElementById("task").value;
    var updatedDesc = document.getElementById("desc").value;
    firebase.database().ref('TaskList/'+c).update({
        task : updatedTask,
        desc : updatedDesc
    });

    // Clearing fields and removing buttons update and cancel and replacing Add btn
    document.getElementById("task").value = "";
    document.getElementById("desc").value = "";
    document.getElementById("updateTask").remove();
    document.getElementById("cancelTask").remove();
    document.getElementById("form-btns").innerHTML = `
    <button type="submit" class="button add" id = "addTask" >󠀫󠀫<i class="fas fa-plus"></i> ADD TASK</button>
    `

    // Updating the task in the side bar
    document.getElementById(c).querySelector(".data").querySelector(".Task").innerHTML = updatedTask;
    document.getElementById(c).querySelector(".data").querySelector(".desc").innerHTML = updatedDesc;
}

// Reading the data from the database
var data;
firebase.database().ref('TaskList').on('value', function(snapshot){
    data = snapshot.val();
    console.log("This is data speaking from open");
    console.log(data);
});