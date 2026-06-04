
// 1. Login via UI
Cypress.Commands.add('login', (email, password) => {

    cy.intercept('POST', '**/login').as('loginRequest');

    cy.visit('http://localhost:5173/');

    cy.get('[data-testid="nav-login"]').click();
    cy.get('[data-id="input-email"]').type(email);
    cy.get('[data-id="input-password"]').type(password);
    cy.get('[data-id="btn-login"]').click();

    cy.wait('@loginRequest').then(({ response }) => {
        expect(response.statusCode).to.eq(200);
    });

    cy.url().should('not.include', '/login');
});

// 2. Login via API - FIXED ASYNC MIXING ERROR
Cypress.Commands.add('loginViaApi', (email, password) => {
    return cy.request({
        method: 'POST',
        url: 'http://localhost:3001/api/users/login',
        body: { email, password }
    }).then((res) => {
        expect(res.status).to.eq(200);
        // ذخیره توکن در Alias
        cy.wrap(res.body.access_token).as('authToken');
        // به جای return res، خودِ پاسخ را wrap می‌کنیم تا در صف Cypress قرار بگیرد
        return cy.wrap(res);
    });
});

// 3. Get Products
Cypress.Commands.add('getProducts', (id = null, queryParams = {}) => {

    let url = 'http://localhost:3001/api/products';

    if (id) {
        url = `http://localhost:3001/api/products/prod-${id}`;
    }

    return cy.request({
        method: 'GET',
        url,
        params: queryParams,
        failOnStatusCode: false
    });
});

// 4. Create Product via API
Cypress.Commands.add('createProduct', (productData = {}) => {
    return cy.get('@authToken').then((token) => {
        return cy.request({
            method: 'POST',
            url: 'http://localhost:3001/api/products',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: {
                name: productData.name || 'Default Product',
                description: productData.description || 'Default Desc',
                price: productData.price || 1000,
                stock: productData.stock || 10,
                category: productData.category || 'Hand Tools',
                brand: productData.brand || 'ForgeFlex'
            }
        });
    });
});

// 5. Update Product via API
Cypress.Commands.add('updateProduct', (id, updateData) => {
    return cy.get('@authToken').then((token) => {
        return cy.request({
            method: 'PUT',
            url: `http://localhost:3001/api/products/prod-${id}`,
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: updateData
        });
    });
});

// 6. Delete Product via API
Cypress.Commands.add('deleteProduct', (id) => {
    return cy.get('@authToken').then((token) => {
        return cy.request({
            method: 'DELETE',
            url: `http://localhost:3001/api/products/prod-${id}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    });
});
