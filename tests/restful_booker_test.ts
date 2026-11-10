import assert from 'assert';

Feature('Booking Life Cycle');

Scenario('Create a new booking, update and delete', async ({ I }) => {
    // Auth
    const authResponse = await I.sendPostRequest('/auth', {
        username: 'admin',
        password: 'password123'
    });

    I.seeResponseCodeIsSuccessful();
    const token = authResponse.data.token;
    const authHeaders = { Cookie: `token=${token}` };

    const response = await I.sendPostRequest('/booking', {
        firstname: 'John',
        lastname: 'Doe',
        totalprice: 110,
        depositpaid: true,
        bookingdates: {
            checkin: '2026-11-09',
            checkout: '2026-11-11'
        },
        additionalneeds: 'Breakfast'
    });

    I.seeResponseCodeIsSuccessful();

    I.seeResponseContainsKeys(['bookingid', 'booking']);

    const bookingId = response.data.bookingid;
    console.log('Booking ID:', bookingId);

    // Send a GET request to retrieve the booking details
    const getBookingResponse = await I.sendGetRequest(`/booking/${bookingId}`);
    I.seeResponseCodeIsSuccessful();
    I.seeResponseContainsKeys(['firstname', 'lastname', 'totalprice', 'depositpaid', 'bookingdates', 'additionalneeds']);

    // Validate response data matches with created Booking data
    assert.equal(getBookingResponse.data.firstname, 'John', 'First name should be John');
    assert.equal(getBookingResponse.data.lastname, 'Doe', 'Last name should be Doe');
    assert.equal(getBookingResponse.data.totalprice, 110, 'Total price should be 110');
    assert.equal(getBookingResponse.data.depositpaid, true, 'Deposit paid should be true');

    // Send PUT request to update the booking
    const updateResponse = await I.sendPutRequest(`/booking/${bookingId}`, {
        firstname: 'Jane',
        lastname: 'Smith',
        totalprice: 150,
        depositpaid: false,
        bookingdates: {
            checkin: '2026-11-10',
            checkout: '2026-11-12'
        },
        additionalneeds: 'Lunch'
    }, authHeaders);
    I.seeResponseCodeIs(200);

    // Get Booking after update
    const getUpdatedBookingResponse = await I.sendGetRequest(`/booking/${bookingId}`);
    I.seeResponseCodeIsSuccessful();

    // Validate updated response data matches with updated Booking data
    assert.equal(getUpdatedBookingResponse.data.firstname, 'Jane', 'First name should be updated to Jane');
    assert.equal(getUpdatedBookingResponse.data.lastname, 'Smith', 'Last name should be updated to Smith');
    assert.equal(getUpdatedBookingResponse.data.totalprice, 150, 'Total price should be updated to 150');
    assert.equal(getUpdatedBookingResponse.data.depositpaid, false, 'Deposit paid should be updated to false');

    // Send DELETE request to delete the booking
    await I.sendDeleteRequest(`/booking/${bookingId}`, authHeaders);
    I.seeResponseCodeIsSuccessful();

    await I.sendGetRequest(`/booking/${bookingId}`);

    // Validate that the booking has been successfully deleted
    I.seeResponseCodeIs(404);
});
