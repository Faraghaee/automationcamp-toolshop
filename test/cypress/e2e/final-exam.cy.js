describe('Final exam  ', () => {
    it('tamrin1', () => {
        cy.visit('http://localhost:5173/');
        cy.get('[data-testid="nav-login"]').click();

        //login
        cy.get("input[data-id=input-email]").type("customer2@automationcamp.org");
        cy.get("input[data-id=input-password]").type("welcome01");
        cy.get('button[data-id=btn-login]').click();
        cy.url().should('not.include', '/login');

    })

    it('tamrin2', () => {
        cy.visit('http://localhost:5173/auth/login');
        cy.intercept('POST', '/api/users/login').as('loginRequest');

        //login
        cy.get("input[data-id=input-email]").type("customer@automationcamp.org");
        cy.get("input[data-id=input-password]").type("1234");
        cy.wait(200);
        cy.get('button[data-id=btn-login]').click();

        cy.wait('@loginRequest').then((interception) => {
            expect(interception.response.statusCode).to.eq(423);
            cy.contains('Account is locked due to too many failed login attempts.').should('be.visible');


        });
    })

    it('tamrin3', () => {
        cy.visit('http://localhost:5173/auth/register');
        //register
        //login
        cy.get("input[data-id=input-first-name]").type("Farzaneh");
        cy.get("input[data-id=input-last-name]").type("Aghaee");
        cy.get("input[data-id=input-email]").type("aghaee.f@tiddev.com");
        cy.get("input[data-id=input-password]").type("12345678");
        cy.get("input[data-id=input-password-confirm]").type("12345678");
        cy.get("input[data-id=input-phone]").type("09384973211");
        cy.get("input[data-id=input-dob]").type("1991-06-25");

        cy.get('[data-testid="register-submit"]').click();

        cy.get('[data-testid="street"]').type("Hengam");
        cy.get('[data-testid="city"]').type("Tehran");
        cy.get('[data-testid="state"]').type("57");
        cy.get('[data-testid="country"]').type("Iran");
        cy.get('[data-testid="update-profile"]').click();


    })

    it('tamrin4', () => {

        cy.visit('http://localhost:5173/');

        cy.get('[data-id=product-card]')
            .should('be.visible')
            .and('have.length.at.least', 9);

        cy.get('[data-id=product-card]').each(($card) => {
            // چک کردن وجود نام محصول در داخل هر کارت
            cy.wrap($card).find('[data-id=product-name]').should('not.be.empty');

            // چک کردن وجود قیمت محصول در داخل هر کارت
            cy.wrap($card).find('[data-id=product-price]').should('not.be.empty');
        });
    });

    it('tamrin5', () => {
        cy.visit("http://localhost:5173/")
        //جستجو
        cy.get('[data-id="search-input"]').type('hammer')
        cy.get('[data-testid="product-card"]').should('contain.text', 'Hammer');
        // برروی ذره بین کلیک میکند
        cy.get('[data-id="search-btn"]').click();
        cy.scrollTo(0, 400);
    })

    it('tamrin6', () => {

        cy.viewport(1280, 800);
        cy.visit('http://localhost:5173/');

        cy.get('[data-testid="category-power-tools"]')
            .should('be.visible')
            .click();

        cy.url().should('include', '?category_id=cat-6');

        cy.get('[data-testid="product-card"]').should('exist'); // حداقل یک محصول باید نمایش داده شود

    });

    it('tamrin7', () => {

        cy.visit('http://localhost:5173/');

        cy.get('[data-testid="sort-select"]')
            .select('Price Low-High');

        cy.get('[data-testid="product-price"]', { timeout: 10000 })
            .should('have.length.greaterThan', 0)
            .then(($prices) => {

                const prices = [...$prices].map(el =>
                    Number(el.innerText.replace(/[^0-9.]/g, ''))
                );

                for (let i = 1; i < prices.length; i++) {
                    expect(prices[i]).to.be.at.least(prices[i - 1]);
                }

            });

    });

    it('tamrin8', () => {

        cy.visit('http://localhost:5173/');

        // کلیک بر روی محصول
        cy.contains('Claw Hammer 16oz').click();
        // اضافه کردن به سبد خرید
        cy.contains('Add to Cart').click();

        //بررسی اضافه شدن عدد به ایکون سبدخرید
        cy.get('[data-testid="nav-cart"] > .absolute')
            .should('be.visible')
            .and('contain.text', '1');

        cy.contains(/added to cart|success/i).should('be.visible');
    });

    it('tamrin9', () => {

        cy.visit('http://localhost:5173/');
        cy.contains('Claw Hammer 16oz').click();
        cy.contains('Add to Cart').click();
        cy.visit('http://localhost:5173/checkout');

        cy.get('[data-id=cart-item]')
            .should('have.length.at.least', 1);

        //  گرفتن قیمت یک چکش
        cy.get('[data-testid="cart-item"] > .font-semibold').invoke('text').then((priceText) => {
            // حذف کاراکترهای اضافی و تبدیل به عدد
            const unitPrice = parseFloat(priceText.replace(/[^0-9.]/g, ''));

            //  افزایش تعداد به 3
            cy.get('[data-testid="cart-qty-increase"]').click().click();
            cy.get('[data-testid="cart-quantity"]').should('have.text', '3');

            //  چک کردن قیمت 3 چکش
            const expectedTotal = unitPrice * 3;

            cy.get('.border-t .text-primary-600')
                .invoke('text')
                .then((totalText) => {
                    const actualTotal = parseFloat(totalText.replace(/[^0-9.]/g, ''));

                    // مقایسه جمع کل با قیمت 3 چکش
                    expect(actualTotal).to.eq(expectedTotal);
                });
        });
    });

    it('tamrin10', () => {

        cy.visit('http://localhost:5173/');

        cy.contains('Claw Hammer 16oz').click();
        cy.contains('Add to Cart').click();

        cy.visit('http://localhost:5173/checkout');

        cy.get('[data-testid="cart-remove"]')
            .first()
            .click();

        // بررسی خالی شدن 
        cy.contains(/cart is empty|no items/i)
            .should('be.visible');
    });

    it('tamrin11', () => {

        cy.login("customer2@automationcamp.org", "welcome01");

        cy.visit('http://localhost:5173/product/prod-9');
        cy.get('[data-id="btn-toggle-favorite"]').click();
        cy.contains("Favorites").click();
        cy.get('[data-testid="favorite-item"]').should('contain', 'Adjustable Wrench 10"');

    });

    it('tamrin12', () => {
        
        cy.visit('http://localhost:5173/contact');

        // پر کردن فرم
        cy.get('[data-testid="contact-name"]').type('Farzaneh aghaee');
        cy.get('[data-testid="contact-email"]').type('aghaee.f@tiddev.com');
        cy.get('[data-testid="contact-subject"]').type('Support');
        cy.get('[data-testid="contact-message"]').type('This is a test message that exceeds fifty characters to ensure validation passes.');

        cy.get('[data-testid="contact-submit"]').click();

        // تایید موفقیت
        cy.get('.card > .text-lg')
            .should('be.visible')
            .and('contain', 'Message Sent!');
    });

    it('tamrin13', () => {
      
        cy.login('customer2@automationcamp.org', 'welcome01');
        cy.visit('http://localhost:5173/account/profile');

        // لیست فیلدهایی که باید چک شوند
        const profileFields = ['first-name', 'email', 'phone', 'dob', 'street', 'house-number', 'city', 'state', 'country', 'postal-code'];
        profileFields.forEach((field) => {
            cy.get(`[data-testid="${field}"]`).should('be.visible');
        });


    });

    it('tamrin14', () => {
        
        cy.login('admin@automationcamp.org', 'welcome01');

        cy.visit('http://localhost:5173/admin/brands');

        cy.contains('Add Brand').click();

        cy.get('[data-testid="brand-name"]').type('Test Brand');
        cy.get('[data-testid="brand-slug"]').type('test brand');
        cy.get('[data-testid="submit-brand"]').click();

        cy.contains('Test Brand').should('be.visible');

    });

    it('tamrin15', () => {
       
        const product = {
            name: 'Test Product',
            description: 'This is a test product created by Cypress.',
            price: '150000',
            stock: '25',
            category: 'Hand Tools',
            brand: 'ForgeFlex',
        };

        cy.login('admin@automationcamp.org', 'welcome01');

        cy.visit('http://localhost:5173/admin/products');
        cy.contains('Add Product').click();

        cy.get('[data-testid="product-name"]').type(product.name);
        cy.get('[data-testid="product-description"]').type(product.description);
        cy.get('[data-testid="product-price"]').clear().type(product.price);
        cy.get('[data-testid="product-stock"]').clear().type(product.stock);
        cy.get('[data-testid="product-category"]').select(product.category);
        cy.get('[data-testid="product-brand"]').select(product.brand);

        cy.get('[data-id="btn-submit-product"]').click();

        cy.get('[data-id="product-name"]').should('be.visible');

        const findProductInPages = (productName) => {
            cy.get('body').then(($body) => {

                if ($body.text().includes(productName)) {
                    cy.contains('[data-id="product-name"]', productName).should('be.visible');
                    return;
                }

                const nextPageButton = cy.get('[data-id="btn-next-page"]');
                nextPageButton.should('not.be.disabled');
                nextPageButton.click();
                cy.wait(1000);

                findProductInPages(productName);
            });
        };

        findProductInPages(product.name);
    });

    it('tamrin16', () => {
       
        cy.login('admin@automationcamp.org', 'welcome01');

        cy.visit('http://localhost:5173/admin/orders');

        cy.get(':nth-child(1) > :nth-child(7) > [data-testid="view-order"]').click();

        cy.get('[data-testid="status-select"]').select('SHIPPED');
        cy.get('[data-testid="update-status"]').click();

        cy.get('.btn-secondary').click();

        cy.get('[data-id="order-status"]').first().should('have.text', 'SHIPPED');

    });

    it('tamrin17', () => {
        
        cy.login('admin@automationcamp.org', 'welcome01');

        cy.visit('http://localhost:5173/admin/users');

        cy.contains('customer3@automationcamp.org').parents('[data-testid="user-row"]').within(() => {
            cy.contains('Edit').click();
        });

        cy.get('[data-testid="enabled"]').then(($checkbox) => {
            if ($checkbox.is(':checked')) {
                cy.wrap($checkbox).uncheck();
            }
        });

        cy.get('[data-testid="submit-user"]').click();

        cy.contains('customer3@automationcamp.org').parents('[data-testid="user-row"]').within(() => {
            cy.get('[data-id="btn-toggle-user-status"]').should('have.text', 'Disabled');
        });

        cy.clearCookies();
        cy.clearLocalStorage();

        cy.visit('http://localhost:5173/');
        cy.get('[data-testid="nav-login"]').click();
        cy.get('input[data-id="input-email"]').type('customer3@automationcamp.org');
        cy.get('input[data-id="input-password"]').type('pass123');
        cy.get('button[data-id="btn-login"]').click();

        cy.contains(/disabled|inactive|not allowed|blocked/i).should('be.visible');
    });

    it('tamrin18', () => {
        
        cy.getProducts(null).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.be.an('array');

            res.body.data.forEach((product) => {
                expect(product).to.have.property('id');
                expect(product).to.have.property('name');
                expect(product).to.have.property('price');
            });
        });
    });

    it('tamrin19', () => {
        cy.loginViaApi('admin@automationcamp.org', 'welcome01');
       
        cy.get('@authToken').then((token) => {
            expect(token, 'Admin token should not be null').to.be.a('string').and.not.be.null;

            // اضافه کردن محصول
            cy.createProduct().then((res) => {
                expect(res.status).to.eq(201);
            });
        });
        cy.log('Farzaneh product add list products.');
        
    });

    it('tamrin20', () => {
        cy.loginViaApi('admin@automationcamp.org', 'welcome01');
       
        const updateData = { name: 'Updated Farzaneh Aghaee Product ', price: 200 };

        // با محصول id: prod-2
        cy.updateProduct(3, updateData).then((res) => {
            expect(res.status).to.eq(200);
        });

        // چک کردن محصول آپدیت شده
        cy.getProducts(3, updateData).then((res) => {
            expect(res.body.name).to.eq(updateData.name);
            expect(res.body.price).to.eq(updateData.price);
        });
    });

    it('tamrin21', () => {
        cy.loginViaApi('admin@automationcamp.org', 'welcome01');
       
        cy.get('@authToken').then((token) => {

            cy.deleteProduct(1).then((res) => {
                expect(res.status).to.be.oneOf([200, 204]);
            });

            // چک کردن محصول حذف شده
            cy.getProducts(1).then((res) => {
                expect(res.status).to.eq(404);
                expect(res.body.message).to.eq('Product not found');
            });
        });
    });

    it('tamrin22', () => {
       
        cy.loginViaApi('customer@automationcamp.org', 'welcome01').then((res) => {

            // بررسی تایید  
            expect(res.status).to.eq(200);
            expect(res.body).to.have.property('access_token');
            expect(res.body.user).to.have.property('id');
            expect(res.body.user).to.have.property('email', 'customer@automationcamp.org');
            expect(res.body.user).to.have.property('role');
        });
    });

    it('tamrin23', () => {
        cy.loginViaApi('admin@automationcamp.org', 'welcome01');
        
        const newBrand = { name: 'New Tech Brand1' };

        cy.get('@authToken').then((token) => {
            cy.request({
                method: 'POST',
                url: 'http://localhost:3001/api/brands',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: newBrand
            }).then((res) => {
                cy.log(JSON.stringify(res.body));
                // مرحله ۳: بررسی پاسخ (Status 201)
                expect(res.status).to.eq(201);
                expect(res.body).to.have.property('id');
                expect(res.body.name).to.eq(newBrand.name);
            });
        });
    });

    it('tamrin24', () => {
     
        const productId = 'prod-20'; 
        const quantity = 2;

        cy.request({
            method: 'POST',
            url: 'http://localhost:3001/api/carts',
            body: {} 
        }).then((cartRes) => {
            expect(cartRes.status).to.be.oneOf([200, 201]);
            const cartId = cartRes.body.id; 

            cy.request({
                method: 'POST',
                url: `http://localhost:3001/api/carts/${cartId}`,
                body: {
                    product_id: productId,
                    quantity: quantity
                }
            }).then((addRes) => {
                expect(addRes.status).to.be.oneOf([200, 201]);

                cy.request('GET', `http://localhost:3001/api/carts/${cartId}`).then((getRes) => {
                    expect(getRes.status).to.eq(200);

                    const cartItems = getRes.body.items;
                    const foundItem = cartItems.find(item => item.product_id === productId);

                    expect(foundItem).to.exist;
                    expect(foundItem.quantity).to.eq(quantity);
                });
            });
        });
    });

    it('tamrin25', () => {

        let cartId;
        let productId;

        cy.loginViaApi('customer3@automationcamp.org', 'pass123');

        cy.get('@authToken').then((token) => {

            cy.request({
                method: 'GET',
                url: 'http://localhost:3001/api/products'
            }).then((productsRes) => {

                expect(productsRes.status).to.eq(200);
                productId = productsRes.body.data[0].id;

                return cy.request({
                    method: 'POST',
                    url: 'http://localhost:3001/api/carts'
                });

            }).then((cartRes) => {

                expect(cartRes.status).to.eq(201);
                cartId = cartRes.body.id;

                return cy.request({
                    method: 'POST',
                    url: `http://localhost:3001/api/carts/${cartId}`,
                    body: {
                        product_id: productId,
                        quantity: 1
                    }
                });

            }).then(() => {

                return cy.request({
                    method: 'POST',
                    url: 'http://localhost:3001/api/invoices',
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: {
                        cart_id: cartId,
                        billing_address: "vila",
                        billing_first_name: "Farzaneh",
                        billing_last_name: "Aghaee",
                        billing_city: "Tehran",
                        billing_postal_code: "1234567890",
                        payment_details: {
                            method: "online",
                            card_last4: "10000"
                        }
                    }
                });

            }).then((invoiceRes) => {

                expect(invoiceRes.status).to.eq(201);
                expect(invoiceRes.body).to.have.property('id');
                expect(invoiceRes.body.status)
                    .to.eq('AWAITING_FULFILLMENT');

            });

        });

    });

    it('tamrin26', () => {

        let productId;

        cy.loginViaApi('customer3@automationcamp.org', 'pass123');

        cy.get('@authToken').then((token) => {

            cy.request({
                method: 'GET',
                url: 'http://localhost:3001/api/products'
            }).then((productsRes) => {

                expect(productsRes.status).to.eq(200);
                productId = productsRes.body.data[0].id;

                return cy.request({
                    method: 'GET',
                    url: 'http://localhost:3001/api/favorites',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

            }).then((listRes) => {

                const existing = listRes.body.find(
                    item => item.product_id === productId
                );

                if (existing) {
                    return cy.request({
                        method: 'DELETE',
                        url: `http://localhost:3001/api/favorites/${existing.id}`,
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                }

            }).then(() => {

                return cy.request({
                    method: 'POST',
                    url: 'http://localhost:3001/api/favorites',
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: {
                        product_id: productId
                    }
                });

            }).then((favRes) => {

                expect(favRes.status).to.be.oneOf([200, 201]);

                return cy.request({
                    method: 'GET',
                    url: 'http://localhost:3001/api/favorites',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

            }).then((listRes) => {

                const found = listRes.body.find(
                    item => item.product_id === productId
                );

                expect(listRes.status).to.eq(200);
                expect(found, 'Product should be in favorites').to.exist;

            });

        });

    });

    it('tamrin27', () => {

        cy.request({
            method: 'GET',
            url: 'http://localhost:3001/api/users/me',
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(401);
        });
    });
})


