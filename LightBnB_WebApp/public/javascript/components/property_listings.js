/* eslint-disable camelcase */
/* eslint-disable indent */
/* eslint-disable func-style */
/*eslint-env jquery*/
/* global window */
/* global propertyListing */
/* global views_manager */
/* global getMyDetails */
/* global getAllListings */
/* global propertyListings */
/* global submitReservation */
/* global getAllReservations */

$(() => {

  const $propertyListings = $(`
  <section class="property-listings" id="property-listings">
      <p>Loading...</p>
    </section>
  `);
  window.$propertyListings = $propertyListings;

  window.propertyListings = {};

  function addListing(listing) {
    $propertyListings.append(listing);
  }
  function clearListings() {
    $propertyListings.empty();
  }
  window.propertyListings.clearListings = clearListings;

  function addProperties(properties, isReservation = false, makeReservation = false) {
    clearListings();
    for (const propertyId in properties) {
      const property = properties[propertyId];
      const listing = propertyListing.createListing(property, isReservation, makeReservation);
      addListing(listing);

      const $reserveButton = $($propertyListings).children().last('article').find('.reserve-button');
      $reserveButton.on('click', function() {

        getMyDetails()
        .then(function(json) {
          if (json.user) {
            const data = `propertyId=${property.id}`;
            getAllListings(data).then(function(json) {
              propertyListings.addProperties(json.properties, false, true);
              views_manager.show('listings');
            });
          } else {
            views_manager.show('logIn');
          }
        });

      });

      const $reservationForm = $($propertyListings).children().last('article').find('form');

      $reservationForm.on('submit', function(event) {
        event.preventDefault();

        let formData = $(this).serialize();

        formData += `&property_id=${property.id}`;
  
        submitReservation(formData)
          .then(() => {
            propertyListings.clearListings();
            getAllReservations()
              .then(function(json) {
                propertyListings.addProperties(json.reservations, true);
                views_manager.show('listings');
              })
              .catch(error => console.error(error));
          });

      });

      $('#reserve-property-form__cancel').on('click', function() {
        propertyListings.clearListings();
        getAllListings()
          .then(function(json) {
            propertyListings.addProperties(json.properties);
            views_manager.show('listings');
        });
      });
    }
  }
  window.propertyListings.addProperties = addProperties;

});