/* eslint-disable camelcase */
/* eslint-disable indent */
/* eslint-disable func-style */
/*eslint-env jquery*/
/* global window */
/* global propertyListings */
/* global views_manager */
/* global getAllReservations */

$(() => {

  const $reserveForm = $(`
    <form action="/api/reservations" method="post" id="new-reservation-form" class="new-reservation-form">
      <div class="new-reservation-form__field-wrapper">
        <label for="new-reservation-form__title">Title</label>
        <input type="text" name="title" placeholder="Title" id="new-reservation-form__title">
      </div>

      <div class="new-reservation-form__field-wrapper">
        <label for="new-reservation-form__cost">Cost Per Night</label>
        <input placeholder="Cost Per Night" type="number" name="cost_per_night" id="new-property-form__cost">
      </div>

      <hr>

      <div class="new-reservation-form__field-wrapper">
          <button>Reserve</button>
          <a id="reservation-form__cancel" href="#">Cancel</a>
      </div>
        
    </form>
  `);
  window.$reserveForm = $reserveForm;

  $reserveForm.on('submit', function (event) {
    event.preventDefault();
  
    views_manager.show('none');
  
    const data = $(this).serialize();
    submitProperty(data)  
    .then(() => {
      getAllReservations()
      .then(function(json) {
        propertyListings.addProperties(json.reservations, true);
        views_manager.show('listings');
      })
      .catch(error => console.error(error));
    })
    .catch((error) => {
      console.error(error);
      views_manager.show('listings');
    });
  });
  
  $('body').on('click', '#property-form__cancel', function() {
    views_manager.show('listings');
    return false;
  });

});



