/* eslint-disable indent */
/* eslint-disable func-style */
/*eslint-env jquery*/
/* global window */
/* global moment */

$(() => {
  window.propertyListing = {};
  
  function createListing(property, isReservation, makeReservation) {
    return `
    <article class="property-listing">
        <section class="property-listing__preview-image">
          <img src="${property.thumbnail_photo_url}" alt="house">
        </section>
        <section class="property-listing__details">
          <h3 class="property-listing__title">${property.title}</h3>
          <ul class="property-listing__details">
            <li>number_of_bedrooms: ${property.number_of_bedrooms}</li>
            <li>number_of_bathrooms: ${property.number_of_bathrooms}</li>
            <li>parking_spaces: ${property.parking_spaces}</li>
          </ul>
          ${makeReservation ?
            `
              <form action="/api/reservations" method="post" id="new-reservation-form" class="new-reservation-form">
                <div class="new-reservation-form__field-wrapper">
                  <label for="new-reservation-form__start_date">Start Date</label>
                  <input type="date" name="start_date" id="new-reservation-form__start_date" required>
                </div>

                <div class="new-reservation-form__field-wrapper">
                  <label for="new-reservation-form__end_date">End Date</label>
                  <input type="date" name="end_date" id="new-reservation-form__end_date" required>
                </div>

                <hr>

                <div class="new-reservation-form__field-wrapper">
                    <button>Reserve</button>
                    <a id="reserve-property-form__cancel" href="#">Cancel</a>
                </div>

                <hr>
                  
              </form>
            `
            :
            `
            ${isReservation ?
            `<p>${moment(property.start_date).format('ll')} - ${moment(property.end_date).format('ll')}</p>`
            :
            `
            <div>
              <button class='reserve-button'>Reserve Now</button>
            </div>
            `}
            `
          }

          
          <footer class="property-listing__footer">
            <div class="property-listing__rating">${Math.round(property.average_rating * 100) / 100}/5 stars</div>
            <div class="property-listing__price">$${property.cost_per_night / 100.0}/night</div>
          </footer>
        </section>
      </article>
    `;
  }

  window.propertyListing.createListing = createListing;


});