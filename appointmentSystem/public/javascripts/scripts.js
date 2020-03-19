//validates the appointment form before proccessing further

function formValidation(){

  var error = document.getElementById('error');
  if(document.getElementById('summary').value == ""){
    document.getElementById('summary').focus();
    error.style.display = "block";
    error.innerHTML = "Summary can't be empty."
    return false;
  }
  if(document.getElementById('location').value == ""){
    document.getElementById('location').focus();
    error.style.display = "block";
    error.innerHTML = "Location can't be empty."
    return false;
  }
  if(document.getElementById('description').value == ""){
    document.getElementById('description').focus();
    error.style.display = "block";
    error.innerHTML = "Description can't be empty."
    return false;
  }
  if(document.getElementById('startDate').value == ""){
    document.getElementById('startDate').focus();
    error.style.display = "block";
    error.innerHTML = "Enter valid Date mm/dd/YYYY"
    return false;
  }
  if(document.getElementById('startTime').value == ""){
    document.getElementById('startTime').focus();
    error.style.display = "block";
    error.innerHTML = "Enter valid time HH:mm:ss"
    return false;
  }
  if(document.getElementById('endDate').value == ""){
    document.getElementById('endDate').focus();
    error.style.display = "block";
    error.innerHTML = "Enter valid Date mm/dd/YYYY"
    return false;
  }
  if(document.getElementById('endTime').value == ""){
    document.getElementById('endTime').focus();
    error.style.display = "block";
    error.innerHTML = "Enter valid time HH:mm:ss"
    return false;
  }
  if(document.getElementById('recurrence').value == "" || document.getElementById('recurrence') <= 0){
    document.getElementById('recurrence').focus();
    error.style.display = "block";
    error.innerHTML = "Recurrence can't be empty."
    return false;
  }
  if(document.getElementById('attendees').value == ""){
    document.getElementById('attendees').focus();
    error.style.display = "block";
    error.innerHTML = "Attendees can't be empty."
    return false;
  }
  if(document.getElementById('reminders').value == ""){
    document.getElementById('reminders').focus();
    error.style.display = "block";
    error.innerHTML = "Reminders can't be empty."
    return false;
  }
  return true;
}

function del(eventID,eventSummary){
  if(confirm("Confirm do you want to delete "+ eventSummary +" event?")){
    $.ajax({url: 'http://localhost:3000/appointment/view-appointment', 
    data: {de:eventID},
    type: "POST",
    success:function(res){
    }});
  }

}
