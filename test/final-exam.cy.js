describe('Final exam  ', () => {
    it('tamrin1', () => {
        cy.visit('http://localhost:5173/');
        cy.wait(200);
        cy.get('[data-testid="nav-login"]').click();

        //login
        cy.get("input[data-id=input-email]").type("customer2@automationcamp.org");
        cy.get("input[data-id=input-password]").type("welcome01");
        cy.wait(200);
        cy.get('button[data-id=btn-login]').click();

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
            // cy.contains('Invalid email or password').should('be.visible');

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
        // بعد از پر کردن فیلد ها و زدن دکمه سابمیت
        cy.wait(200);
        cy.get('[data-testid="register-submit"]').click();
        // ورود به صفحه بعد و وارد کردن اطلاعات تکمیلی
        cy.wait(300);
        cy.get('[data-testid="street"]').type("Hengam");
        cy.get('[data-testid="city"]').type("Tehran");
        cy.get('[data-testid="state"]').type("57");
        cy.get('[data-testid="country"]').type("Iran");
        cy.get('[data-testid="update-profile"]').click();


    })

    it('tamrin4', () => {

        //4.should display at least 9 products with name and price
        // 1. Navigate to home page
        cy.visit('http://localhost:5173/');

        // 2. Verify product grid is visible and has at least 9 items
        // فرض می‌کنیم هر محصول یک المنت با data-id="product-card" است
        cy.get('[data-id=product-card]')
            .should('be.visible')
            .and('have.length.at.least', 9);

        // 3. Verify each product has a name and price
        cy.get('[data-id=product-card]').each(($card) => {
            // چک کردن وجود نام محصول در داخل هر کارت
            cy.wrap($card).find('[data-id=product-name]').should('not.be.empty');

            // چک کردن وجود قیمت محصول در داخل هر کارت
            cy.wrap($card).find('[data-id=product-price]').should('not.be.empty');
        });
    });

    it('tamrin5', () => {
        cy.visit("http://localhost:5173/")
        cy.wait(1500);
        //جستجو
        cy.get('[data-id="search-input"]').type('hammer')
        cy.wait(800);
        // برروی ذره بین کلیک میکند
        cy.get('[data-id="search-btn"]').click();
        cy.wait(1000);
        cy.scrollTo(0, 400);
    })

    it('tamrin6', () => {
        //Scenario 6: Filter products by category (Power Tools)
        cy.viewport(1280, 800);
        cy.visit('http://localhost:5173/');

        cy.get('[data-testid="category-power-tools"]')
            .should('be.visible')
            .click();

        cy.url().should('include', '?category_id=cat-6');

        cy.get('[data-testid="product-card"]').should('exist'); // حداقل یک محصول باید نمایش داده شود

        // ایمیل زده شده  چک بشه
    });

    it('tamrin7', () => {
        cy.visit("http://localhost:5173/")
        cy.scrollTo(0, 20);
        // انتخاب محصول با قیمت از کم به زیاد
        cy.get('[data-testid="sort-select"]').select('price-asc');
    })

    it('tamrin8', () => {
        //should add one product to cart and update badge
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
        // should calculate total price correctly when quantity is 3
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
        //should remove the only product and show empty cart
        cy.visit('http://localhost:5173/');
        cy.contains('Claw Hammer 16oz').click();
        cy.contains('Add to Cart').click();

        cy.visit('http://localhost:5173/');
        cy.contains('Adjustable Wrench 10"').click();
        cy.contains('Add to Cart').click();

        cy.visit('http://localhost:5173/checkout');

        // ذخیره تعداد badge قبل از حذف
        cy.get('[data-testid="nav-cart"] > .absolute')
            .invoke('text')
            .then((badgeText) => {
                const initialCount = parseInt(badgeText);

                cy.get('[data-testid=cart-remove]').click();

                if (initialCount === 1) {
                    // اگر فقط یک محصول بود → سبد خالی می‌شود
                    cy.get('[data-testid="cart-badge"]').should('not.exist');
                    cy.contains(/cart is empty|no items/i).should('be.visible');
                } else {
                    // اگر بیش از یک محصول بود → badge کاهش می‌یابد
                    cy.get('[data-testid="cart-badge"]')
                        .should('have.text', String(initialCount - 1));
                }


                // ایمیل زده شده 
            });
    });

    it('tamrin11', () => {

        //should allow logged-in user to add product to favorites
        cy.login("customer2@automationcamp.org", "welcome01");

        cy.visit('http://localhost:5173/product/prod-9');
        cy.get('[data-id="btn-toggle-favorite"]').click();

        cy.contains("Favorites").click();
        cy.get('[data-testid="favorite-item"]').should('contain', 'Adjustable Wrench 10"');
    });

    it('tamrin12', () => {
        //should allow guest to submit contact form successfully
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
        //should display correct user profile details
        cy.login('customer2@automationcamp.org', 'welcome01');

        cy.visit('http://localhost:5173/account/profile');

        // لیست فیلدهایی که باید چک شوند
        const profileFields = ['first-name', 'email', 'phone', 'dob', 'street', 'house-number', 'city', 'state', 'country', 'postal-code'];
        profileFields.forEach((field) => {
            cy.get(`[data-testid="${field}"]`).should('be.visible');
        });
    });

    it('tamrin14', () => {
        //should allow admin to add a brand
        cy.login('admin@automationcamp.org', 'welcome01');

        cy.visit('http://localhost:5173/admin/brands');

        cy.contains('Add Brand').click();

        cy.get('[data-testid="brand-name"]').type('Test Brand');
        cy.get('[data-testid="brand-slug"]').type('test brand');
        cy.get('[data-testid="submit-brand"]').click();

        cy.contains('Test Brand').should('be.visible');

    });

    it('tamrin15', () => {
        //Add new product
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

        // تابعی برای جستجوی محصول در صفحات مختلف
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

                // بصورت بازگشتی جستجو می‌کنیم
                findProductInPages(productName);
            });
        };

        findProductInPages(product.name);
    });

    it('tamrin16', () => {
        //should update order status to SHIPPED
        cy.login('admin@automationcamp.org', 'welcome01');

        cy.visit('http://localhost:5173/admin/orders');

        cy.get(':nth-child(1) > :nth-child(7) > [data-testid="view-order"]').click();

        cy.get('[data-testid="status-select"]').select('SHIPPED');
        cy.get('[data-testid="update-status"]').click();

        cy.get('.btn-secondary').click();

        cy.get('[data-id="order-status"]').first().should('have.text', 'SHIPPED');

    });

    it('tamrin17', () => {
        //should disable a user and prevent login
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

    before(() => {
        cy.loginViaApi('admin@automationcamp.org', 'welcome01');
    });

    it('tamrin18', () => {
        //should get all products and verify structure
        cy.getProducts(null).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.be.an('array');

            // این خط JSON کامل را در پنل تست Cypress نمایش می‌دهد
            cy.log('Products Response:', JSON.stringify(res.body, null, 2));// باید حذف بشه

            res.body.data.forEach((product) => {
                expect(product).to.have.property('id');
                expect(product).to.have.property('name');
                expect(product).to.have.property('price');
            });
        });
    });

    it('tamrin19', () => {
        // Create a product
        cy.get('@adminToken').then((token) => {
            expect(token, 'Admin token should not be null').to.be.a('string').and.not.be.null;

            // اضافه کردن محصول
            cy.createProduct().then((res) => {
                expect(res.status).to.eq(201);
            });
        });
        cy.log('Farzaneh product add list products.');
    });

    it('tamrin20', () => {
        //Update product
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
        //delete a product
        cy.get('@adminToken').then((token) => {

            cy.deleteProduct(12).then((res) => {
                expect(res.status).to.be.oneOf([200, 204]);
            });

            // چک کردن محصول حذف شده
            cy.getProducts(12).then((res) => {
                expect(res.status).to.eq(404);
                expect(res.body.message).to.eq('Product not found');
            });
        });
    });

    it('tamrin22', () => {
        //user login
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
        //should create a new brand successfully
        const newBrand = { name: 'New Tech Brand' };

        cy.get('@adminToken').then((token) => {

            cy.request({
                method: 'POST',
                url: 'http://localhost:3001/api/brands',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: newBrand
            }).then((res) => {
                // مرحله ۳: بررسی پاسخ (Status 201)
                expect(res.status).to.eq(201);
                expect(res.body).to.have.property('id');
                expect(res.body.name).to.eq(newBrand.name);
            });
        });
    });

    it('tamrin24', () => {
        //should create a cart and add a product to it
        const productId = 'prod-20'; // محصولی که می‌خواهیم اضافه کنیم
        const quantity = 2;

        // مرحله ۱: ایجاد سبد خرید جدید
        cy.request({
            method: 'POST',
            url: 'http://localhost:3001/api/carts',
            body: {} // معمولاً بدنه خالی یا با اطلاعات کاربر است
        }).then((cartRes) => {
            expect(cartRes.status).to.be.oneOf([200, 201]);
            const cartId = cartRes.body.id; // گرفتن ID سبد خرید ساخته شده

            // مرحله ۲: افزودن محصول به سبد خرید با استفاده از ID ساخته شده
            cy.request({
                method: 'POST',
                url: `http://localhost:3001/api/carts/${cartId}`,
                body: {
                    product_id: productId,
                    quantity: quantity
                }
            }).then((addRes) => {
                expect(addRes.status).to.be.oneOf([200, 201]);

                // مرحله ۳: دریافت سبد خرید و تایید وجود محصول
                cy.request('GET', `http://localhost:3001/api/carts/${cartId}`).then((getRes) => {
                    expect(getRes.status).to.eq(200);

                    // بررسی اینکه محصول در لیست items سبد خرید هست یا خیر
                    const cartItems = getRes.body.items;
                    const foundItem = cartItems.find(item => item.product_id === productId);

                    expect(foundItem).to.exist;
                    expect(foundItem.quantity).to.eq(quantity);
                });
            });
        });
    });

    it('tamrin25', () => {
        //should create an invoice for an authenticated customer
        let token;
        let cartId;
        let productId;

        // 1) Login as customer

        //cy.loginViaApi('customer3@automationcamp.org', 'pass123');

        cy.request({
            method: 'POST',
            url: 'http://localhost:3001/api/users/login',
            body: {
                email: 'customer3@automationcamp.org',
                password: 'pass123'
            }
        }).then((loginRes) => {
            expect(loginRes.status).to.eq(200);
            token = loginRes.body.access_token;

            // 2) Get a valid product
            return cy.request({
                method: 'GET',
                url: 'http://localhost:3001/api/products'
            });
        }).then((productsRes) => {
            expect(productsRes.status).to.eq(200);
            productId = productsRes.body.data[0].id;

            // 3) Create cart
            return cy.request({
                method: 'POST',
                url: 'http://localhost:3001/api/carts',
            });
        }).then((cartRes) => {
            expect(cartRes.status).to.eq(201);
            cartId = cartRes.body.id;

            // 4) Add item to cart
            return cy.request({
                method: 'POST',
                url: `http://localhost:3001/api/carts/${cartId}`,
                body: {
                    product_id: productId,
                    quantity: 1
                }
            });
        }).then(() => {

            // 5) Place order
            return cy.request({
                method: 'POST',
                url: 'http://localhost:3001/api/invoices',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: {
                    cart_id: "7481dc08-0eee-4a73-acf7-2c1d09524e29",
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
            cy.log(invoiceRes.body.id);
            expect(invoiceRes.body).to.have.property('status', 'AWAITING_FULFILLMENT');

        });
    });

    it('tamrin26', () => {
        //should add a product to favorites and verify it
        let token;
        let productId;

        // 1) Login
        cy.request({
            method: 'POST',
            url: 'http://localhost:3001/api/users/login',
            body: {
                email: 'customer3@automationcamp.org',
                password: 'pass123'
            }
        }).then((loginRes) => {
            expect(loginRes.status).to.eq(200);
            token = loginRes.body.access_token;

            // 2) Get a product
            return cy.request('http://localhost:3001/api/products');
        }).then((productsRes) => {
            expect(productsRes.status).to.eq(200);
            productId = productsRes.body.data[0].id;

            // --- پیش‌نیاز: پاکسازی ---
            // ابتدا لیست علاقه‌مندی‌ها را می‌گیریم تا ببینیم آیا محصول وجود دارد یا خیر
            return cy.request({
                method: 'GET',
                url: 'http://localhost:3001/api/favorites',
                headers: { Authorization: `Bearer ${token}` }
            });
        }).then((listRes) => {
            const existing = listRes.body.find(item => item.product_id === productId);

            // اگر وجود داشت، حذفش کن تا تست تکراری نشود (409 نگیریم)
            if (existing) {
                return cy.request({
                    method: 'DELETE',
                    url: `http://localhost:3001/api/favorites/${existing.id}`,
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
        }).then(() => {
            // 3) Add to favorites 
            return cy.request({
                method: 'POST',
                url: 'http://localhost:3001/api/favorites',
                headers: { Authorization: `Bearer ${token}` },
                body: { product_id: productId }
            });
        }).then((favRes) => {
            // بررسی موفقیت‌آمیز بودن عملیات (200 یا 201)
            expect(favRes.status).to.be.oneOf([200, 201]);

            // 4) Verify favorites
            return cy.request({
                method: 'GET',
                url: 'http://localhost:3001/api/favorites',
                headers: { Authorization: `Bearer ${token}` }
            });
        }).then((listRes) => {
            expect(listRes.status).to.eq(200);
            // بررسی اینکه آیا محصول در لیست وجود دارد
            const found = listRes.body.find(item => item.product_id === productId);
            expect(found, 'Product should be in favorites list').to.exist;
        });
    });

    it('tamrin27', () => {
        //returns unauthorized when no token is provided
        cy.request({
            method: 'GET',
            url: 'http://localhost:3001/api/users/me',
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(401);
        });
    });
})


