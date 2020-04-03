/* eslint-disable camelcase */
/* eslint-disable indent */
/* eslint-disable func-style */
/*eslint-env jquery*/
/* global window */
/* global propertyListing */
/* global views_manager */

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

  function addProperties(properties, isReservation = false) {
    clearListings();
    for (const propertyId in properties) {
      const property = properties[propertyId];
      const listing = propertyListing.createListing(property, isReservation);
      addListing(listing);
      console.log(listing);
      const $button = $($propertyListings).children().last('article').find('.reserve-button');
      console.log($button);
      $($button).on('click', function() {
        console.log('click'); // Is this attaching hanglers properly?
        views_manager.show('makeReservation');
        return false;
      });
    }
  }
  window.propertyListings.addProperties = addProperties;

});