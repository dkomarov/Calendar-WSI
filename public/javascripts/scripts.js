window.addEventListener('DOMContentLoaded', function () {
  document.getElementById('form-btn').addEventListener('click', function () {
    if (formValidation() == true) {
      document.forms['formVal'].submit();
    }
  });
});

//validates the appointment form before proccessing further
function formValidation() {

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

  if (summary.value == "") {
    summary.focus();
    document.getElementById('error').style.display = 'block';
    error.innerHTML = "Summary can't be empty."
    return false;
  }
  if (location.value == "") {
    location.focus();
    document.getElementById('error').style.display = 'block';
    error.innerHTML = "Location can't be empty."
    return false;
  }
  if (description.value == "") {
    description.focus();
    document.getElementById('error').style.display = 'block';
    error.innerHTML = "Description can't be empty."
    return false;
  }
  if (startDate.value == "") {
    startDate.focus();
    document.getElementById('error').style.display = 'block';
    error.innerHTML = "Enter valid Date mm/dd/YYYY"
    return false;
  }
  if (startTime.value == "") {
    startTime.focus();
    document.getElementById('error').style.display = 'block';
    error.innerHTML = "Enter valid time HH:mm"
    return false;
  }
  if (endDate.value == "") {
    endDate.focus();
    document.getElementById('error').style.display = 'block';
    error.innerHTML = "Enter valid Date mm/dd/YYYY"
    return false;
  }
  if (endTime.value == "") {
    endTime.focus();
    document.getElementById('error').style.display = 'block';
    error.innerHTML = "Enter valid time HH:mm"
    return false;
  }
  if (recurrence.value == "" || recurrence.value <= 0) {
    recurrence.focus();
    document.getElementById('error').style.display = 'block';
    error.innerHTML = "Recurrence can't be empty or less than zero"
    return false;
  }
  if (attendees.value == "") {
    attendees.focus();
    document.getElementById('error').style.display = 'block';
    error.innerHTML = "Attendees can't be empty."
    return false;
  }
  if (reminders.value == "") {
    reminders.focus();
    document.getElementById('error').style.display = 'block';
    error.innerHTML = "Reminders can't be empty."
    return false;
  }
  return true;
}

async function del(eventID, eventSummary) {
  await delData(eventID, eventSummary);
  //.then(window.location.href='/appointment/view-appointment');
  window.location = "/appointment/view-appointment";
  //window.location.href = "/appointment/view-appointment";
}

function delData(eventID, eventSummary) {
  if (confirm("Confirm do you want to delete " + eventSummary + " event?")) {
    $.ajax({
      url: 'http://localhost:3000/appointment/view-appointment',
      data: { de: eventID },
      type: "DELETE",
      success: function (res) {
        window.location.href='/menu'
       // window.location.href='/appointment/view-appointment'
      //  res.redirect('/appointment/view-appointment');
      }
    });
  }
}

// function update(event) {
//   $.ajax({url: 'http://localhost:3000/appointment/view-appointment',
//     data: {ue:event},
//     type: "POST",
//     success:function(res){
//   }}).then(() => location.reload());
// }
