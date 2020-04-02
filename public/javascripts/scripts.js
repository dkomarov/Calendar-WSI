//validates the appointment form before proccessing further

var submit = document.querySelector('input[name="Submit"]');
submit.addEventListener("click", formValidation());

function formValidation(){

  var error = document.getElementById('error');
  var summary = document.getElementById('summary');
  var location = document.getElementById('location');
  var description = document.getElementById('description');
  var startDate = document.getElementById('startDate');
  var endDate = document.getElementById('endDate');
  var startTime = document.getElementById('startTime');
  var endTime = document.getElementById('endTime');
  var recurrence = document.getElementById('recurrence');
  var attendees = document.getElementById('attendees');
  var reminders = document.getElementById('reminders');

  if(summary.value == ""){
    summary.focus();
    error.innerHTML = "Summary can't be empty."
    return false;
  }
  if(location.value == ""){
    location.focus();
    error.innerHTML = "Location can't be empty."
    return false;
  }
  if(description.value == ""){
    description.focus();
    error.innerHTML = "Description can't be empty."
    return false;
  }
  if(startDate.value == ""){
    startDate.focus();
    error.innerHTML = "Enter valid Date mm/dd/YYYY"
    return false;
  }
  if(startTime.value == ""){
    startTime.focus();
    error.innerHTML = "Enter valid time HH:mm"
    return false;
  }
  if(endDate.value == ""){
    endDate.focus();
    error.innerHTML = "Enter valid Date mm/dd/YYYY"
    return false;
  }
  if(endTime.value == ""){
    endTime.focus();
    error.innerHTML = "Enter valid time HH:mm"
    return false;
  }
  if(recurrence.value == "" || recurrence.value <= 0){
    recurrence.focus();
    error.innerHTML = "Recurrence can't be empty or less than zero"
    return false;
  }
  if(attendees.value == ""){
    attendees.focus();
    error.innerHTML = "Attendees can't be empty."
    return false;
  }
  if(reminders.value == ""){
    reminders.focus();
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
