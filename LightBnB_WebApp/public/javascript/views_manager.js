$(() => {

  const $main = $('#main-content');

  window.views_manager = {};

  // add this optional field to send over the id field to add a new reservation!
  window.views_manager.show = function(item, data = '') {
    $newPropertyForm.detach();
    $propertyListings.detach();
    $searchPropertyForm.detach();
    $logInForm.detach();
    $signUpForm.detach();
    $newReservationForm.detach();
    $updateReservationForm.detach();
    $('#reservation-details').detach();
    $newReviewForm.detach();
    $('#review-details').detach();
    $('#new-review-form').detach();

    let datatag = "";
    switch (item) {
      case 'listings':
        // $()
        $propertyListings.appendTo($main);
        break;

      case 'newProperty':
        $newPropertyForm.appendTo($main);
        break;

      case 'searchProperty':
        $searchPropertyForm.appendTo($main);
        break;

      case 'logIn':
        $logInForm.appendTo($main);
        break;

      case 'signUp':
        $signUpForm.appendTo($main);
        break;

      case 'newReservation':
        dataTag = `<h4>${data}</h4>`;
        $newReservationForm.appendTo($main);
        $("#datatag").empty(); 
        $(dataTag).appendTo("#datatag");
        break;

      case 'updateReservation':
        // since we're getting more information here, we caninclude this in an extended data tag:
        dataTag = `
          <span id="datatag-reservation-id">${data.id}</span>
          <span id="datatag-start-date">${data.start_date}</span>
          <span id="datatag-end-date">${data.end_date}</span>
          <span id="datatag-property-id">${data.property_id}</span>
        `
        const reservationDetails = `
          <div id="reservation-details">
            <h3>Reservation Details</h3>
            <h4>Start date: ${moment(data.start_date).format("MMMMDD, YYYY")}</h4>
            <h4>End date: ${moment(data.end_date).format("MMMM DD,YYYY")}</h4>
          </div>
        `
        // if there's an error message we want to display that aswell:
        const errorMessage = data.error_message ? `<h4>${dataerror_message}</h4>` : ``;
        $(reservationDetails).appendTo($main);
        $updateReservationForm.appendTo($main);
        $("#datatag").empty();
        $(dataTag).appendTo("#datatag");
        $(errorMessage).appendTo('#error-message');
        break;
        
      case 'showReviews':
        getReviewsByProperty(data)
        .then(reviews => propertyReviews.addReviews(reviews))
        $propertyReviews.appendTo($main);
        break;
        
      case 'newReview':
        dataTag = `<h4>${data.id}</h4>`;
        $newReviewForm.appendTo($main);
        $("#datatag").empty(); 
        $(dataTag).appendTo("#datatag");
        break;

      case 'error': {
        const $error = $(`<p>${arguments[1]}</p>`);
        $error.appendTo('body');
        setTimeout(() => {
          $error.remove();
          views_manager.show('listings');
        }, 2000);

        break;
      }
    }
  }
});