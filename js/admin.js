document.addEventListener('DOMContentLoaded', () => {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const leftPanel = document.getElementById('left-panel');
    const navLinks = document.querySelectorAll('.left-panel nav ul li a');
    const contentSections = document.querySelectorAll('.content-section');

    // Function to show a specific section and hide others
    const showSection = (sectionId) => {
        contentSections.forEach(section => {
            if (section.id === sectionId) {
                section.classList.add('active-section');
                // Special handling for inventory management sub-sections
                if (sectionId === 'inventory-management-section') {
                    document.getElementById('supplier-management-section').style.display = 'none';
                    document.getElementById('purchase-history-section').style.display = 'none';
                }
            } else {
                section.classList.remove('active-section');
            }
        });
    };

    // Initial active section (Dashboard)
    showSection('dashboard-section');

    // Hamburger menu toggle for mobile
    hamburgerMenu.addEventListener('click', () => {
        leftPanel.classList.toggle('open');
        hamburgerMenu.classList.toggle('open');
    });

    // Navigation links click handler
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1); // Remove '#'
            showSection(targetId);

            // Remove active class from all links
            navLinks.forEach(nav => nav.classList.remove('active-nav-item'));
            // Add active class to the clicked link
            link.classList.add('active-nav-item');

            // Close sidebar on mobile after clicking a link
            if (window.innerWidth <= 768) {
                leftPanel.classList.remove('open');
                hamburgerMenu.classList.remove('open');
            }
        });
    });

    // Dashboard Card Number Animation
    const animateNumbers = () => {
        document.querySelectorAll('.card-number').forEach(span => {
            const target = parseInt(span.dataset.target);
            let current = 0;
            const increment = target / 100; // Adjust speed

            const updateNumber = () => {
                if (current < target) {
                    current += increment;
                    span.textContent = Math.floor(current);
                    requestAnimationFrame(updateNumber);
                } else {
                    span.textContent = target;
                }
            };
            updateNumber();
        });
    };
    animateNumbers();

    // Circular Progress Bar Animation
    document.querySelectorAll('.progress-circle').forEach(circleWrapper => {
        const progressText = circleWrapper.querySelector('.progress-text');
        const circle = circleWrapper.querySelector('.progress-ring-circle');
        const radius = circle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;

        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = circumference;

        const setProgress = (percent) => {
            const offset = circumference - (percent / 100) * circumference;
            circle.style.strokeDashoffset = offset;
            progressText.textContent = `${percent}%`;
        };

        setProgress(parseInt(circleWrapper.dataset.progress));
    });

// ---------------------------charts ------------------------------

  const salesPieChartCtx = document.getElementById('salesPieChart').getContext('2d');

  // Example monthly data (dine-in, delivery, takeaway)
  const salesDataByMonth = [
    [300, 150, 100],  // Jan
    [250, 200, 120],  // Feb
    [400, 180, 90],   // Mar
    [320, 210, 110],  // Apr
    [280, 190, 150],  // May
    [350, 220, 180],  // Jun
    [370, 250, 200],  // Jul
    [390, 230, 160],  // Aug
    [410, 260, 140],  // Sep
    [450, 280, 170],  // Oct
    [480, 300, 200],  // Nov
    [500, 320, 220]   // Dec
  ];

  const salesPieChart = new Chart(salesPieChartCtx, {
    type: 'pie',
    data: {
      labels: ['Dine-in', 'Delivery', 'Takeaway'],
      datasets: [{
        data: salesDataByMonth[0], // default January
        backgroundColor: ['#12c0c0', '#f0ad4e', '#5bc0de'],
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#e0e0e0' } }
      }
    }
  });

  // Update pie chart when month changes
  document.getElementById('month-filter-sales').addEventListener('change', function() {
    const selectedMonth = this.value;

    if (selectedMonth === "all") {
      // sum all months into one dataset
      const allData = [0, 0, 0];
      salesDataByMonth.forEach(arr => {
        allData[0] += arr[0];
        allData[1] += arr[1];
        allData[2] += arr[2];
      });
      salesPieChart.data.datasets[0].data = allData;
    } else {
      const monthIndex = parseInt(selectedMonth);
      salesPieChart.data.datasets[0].data = salesDataByMonth[monthIndex];
    }

    salesPieChart.update();
  });


  // ===== Orders Bar Chart =====
  const ordersBarChartCtx = document.getElementById('ordersBarChart').getContext('2d');

  const monthLabels = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  // Example dataset for all months
  const fullOrdersData = [120, 190, 130, 150, 200, 180, 210, 170, 140, 220, 250, 300];

  const ordersBarChart = new Chart(ordersBarChartCtx, {
    type: 'bar',
    data: {
      labels: monthLabels,
      datasets: [{
        label: 'Orders',
        data: fullOrdersData,
        backgroundColor: '#12c0c0',
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#e0e0e0' } }
      },
      scales: {
        x: {
          ticks: { color: '#e0e0e0' },
          grid: { color: 'rgba(224, 224, 224, 0.1)' }
        },
        y: {
          ticks: { color: '#e0e0e0' },
          grid: { color: 'rgba(224, 224, 224, 0.1)' }
        }
      }
    }
  });

  // Update bar chart when month changes
  document.getElementById('month-filter-orders').addEventListener('change', function() {
    const selectedMonth = this.value;

    if (selectedMonth === "all") {
      ordersBarChart.data.labels = monthLabels;
      ordersBarChart.data.datasets[0].data = fullOrdersData;
    } else {
      const monthIndex = parseInt(selectedMonth);
      ordersBarChart.data.labels = [monthLabels[monthIndex]];
      ordersBarChart.data.datasets[0].data = [fullOrdersData[monthIndex]];
    }

    ordersBarChart.update();
  });

// ---------------------------charts ------------------------------

// ---------------------------Slider ------------------------------
  const sliderContainer = document.querySelector('.slider-container');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');

  // Pixels to move per slide
  const scrollAmount = 250;

  // Manual navigation
  nextBtn.addEventListener('click', slideNext);
  prevBtn.addEventListener('click', slidePrev);

  function slideNext() {
    if (sliderContainer.scrollLeft + sliderContainer.offsetWidth >= sliderContainer.scrollWidth) {
      // If at the end → go back to start
      sliderContainer.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      sliderContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  function slidePrev() {
    if (sliderContainer.scrollLeft === 0) {
      // If at the start → go to end
      sliderContainer.scrollTo({ left: sliderContainer.scrollWidth, behavior: 'smooth' });
    } else {
      sliderContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  }

  // --- Auto Slide ---
  let autoSlide = setInterval(slideNext, 3000); // every 3s

  // Pause on hover
  sliderContainer.addEventListener('mouseenter', () => clearInterval(autoSlide));
  sliderContainer.addEventListener('mouseleave', () => autoSlide = setInterval(slideNext, 3000));
// ---------------------------Slider ------------------------------
    // Custom Alert
    const showAlert = (message, type = 'info') => {
        console.log('showAlert called');
        const alertContainer = document.getElementById('alert-container');
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;
        alertContainer.appendChild(alert);
        setTimeout(() => {
            alert.remove();
        }, 3000);
    };

    // Custom Confirm
    const showCustomConfirm = (message, title) => {
        console.log('showCustomConfirm called');
        return new Promise((resolve) => {
            const customModal = document.getElementById('customModal');
            const customModalTitle = document.getElementById('customModalTitle');
            const customModalMessage = document.getElementById('customModalMessage');
            const customModalConfirmBtn = document.getElementById('customModalConfirmBtn');
            const customModalCancelBtn = document.getElementById('customModalCancelBtn');
            const customModalOkBtn = document.getElementById('customModalOkBtn');
            const customModalCloseBtn = document.getElementById('customModalCloseBtn');

            customModalTitle.textContent = title;
            customModalMessage.textContent = message;

            customModal.style.display = 'block';

            customModalConfirmBtn.onclick = () => {
                customModal.style.display = 'none';
                resolve(true);
            };

            customModalCancelBtn.onclick = () => {
                customModal.style.display = 'none';
                resolve(false);
            };

            customModalOkBtn.onclick = () => {
                customModal.style.display = 'none';
                resolve(true);
            };

            customModalCloseBtn.onclick = () => {
                customModal.style.display = 'none';
                resolve(false);
            };
        });
    };

    // User Management Modals and Functionality
    const userModal = document.getElementById('userModal');
    const activityModal = document.getElementById('activityModal');
    const addUserBtn = document.getElementById('addUserBtn');
    const closeBtns = document.querySelectorAll('.close-btn');
    const userForm = document.getElementById('userForm');
    const modalTitle = document.getElementById('modalTitle');
    const userIdField = document.getElementById('userId');
    const userNameField = document.getElementById('userName');
    const userEmailField = document.getElementById('userEmail');
    const userRoleField = document.getElementById('userRole');
    const userTableBody = document.querySelector('#userTable tbody');
    const userSearchInput = document.getElementById('userSearch');
    const userActivityContent = document.getElementById('userActivityContent');

    let users = [
        { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'customer' },
        { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'staff' },
        { id: 3, name: 'Admin User', email: 'admin@example.com', role: 'admin' }
    ];

    // Function to render users in the table
    const renderUsers = (filter = '') => {
        userTableBody.innerHTML = '';
        const filteredUsers = users.filter(user =>
            user.name.toLowerCase().includes(filter.toLowerCase()) ||
            user.email.toLowerCase().includes(filter.toLowerCase()) ||
            user.role.toLowerCase().includes(filter.toLowerCase())
        );

        filteredUsers.forEach(user => {
            const row = userTableBody.insertRow();
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td class="action-buttons">
                    <button class="btn-edit" data-id="${user.id}">Edit</button>
                    <button class="btn-delete" data-id="${user.id}">Delete</button>
                    <button class="btn-reset-password" data-id="${user.id}">Reset Password</button>
                    <button class="btn-assign-role" data-id="${user.id}">Assign Role</button>
                    <button class="btn-view-activity" data-id="${user.id}">View Activity</button>
                </td>
            `;
        });

        // Add event listeners to the buttons
        document.querySelectorAll('.btn-edit').forEach(button => {
            button.addEventListener('click', (e) => {
                const userId = e.target.closest('button').dataset.id;
                const user = users.find(u => u.id == userId);
                if (!user) return;

                modalTitle.textContent = 'Edit User';
                userIdField.value = user.id;
                userNameField.value = user.name;
                userEmailField.value = user.email;
                userRoleField.value = user.role;
                userModal.style.display = 'block';
            });
        });

        document.querySelectorAll('.btn-delete').forEach(button => {
            button.addEventListener('click', (e) => {
                const userId = e.target.closest('button').dataset.id;
                const user = users.find(u => u.id == userId);
                if (!user) return;

                showCustomConfirm(`Are you sure you want to delete user ${user.name}?`, 'Delete User').then((confirmed) => {
                    if (confirmed) {
                        users = users.filter(u => u.id != userId);
                        renderUsers();
                        showAlert(`User ${user.name} deleted successfully!`, 'success');
                    }
                });
            });
        });

        document.querySelectorAll('.btn-reset-password').forEach(button => {
            button.addEventListener('click', (e) => {
                const userId = e.target.closest('button').dataset.id;
                const user = users.find(u => u.id == userId);
                if (!user) return;

                showAlert(`Reset password for user: ${user.name}`, 'info');
                // In a real application, you would send a request to the server to reset the password
            });
        });

        document.querySelectorAll('.btn-assign-role').forEach(button => {
            button.addEventListener('click', (e) => {
                const userId = e.target.closest('button').dataset.id;
                const user = users.find(u => u.id == userId);
                if (!user) return;

                const newRole = prompt(`Assign new role for ${user.name} (customer, staff, admin):`, user.role);
                if (newRole && ['customer', 'staff', 'admin'].includes(newRole.toLowerCase())) {
                    user.role = newRole.toLowerCase();
                    renderUsers();
                    showAlert(`Role for ${user.name} updated to ${newRole}.`, 'success');
                } else if (newRole) {
                    showAlert('Invalid role. Please choose from customer, staff, or admin.', 'warning');
                }
            });
        });

        document.querySelectorAll('.btn-view-activity').forEach(button => {
            button.addEventListener('click', (e) => {
                const userId = e.target.closest('button').dataset.id;
                const user = users.find(u => u.id == userId);
                if (!user) return;

                const userActivityContent = document.getElementById('userActivityContent');
                userActivityContent.innerHTML = `<h3>Activity for ${user.name}</h3><p>No activity to show.</p>`;
                activityModal.style.display = 'block';
            });
        });
    };

    // Initial render
    renderUsers();

    // Open Add User Modal
    addUserBtn.addEventListener('click', () => {
        modalTitle.textContent = 'Add User';
        userForm.reset();
        userIdField.value = '';
        userModal.style.display = 'block';
    });

    // Close Modals
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            userModal.style.display = 'none';
            activityModal.style.display = 'none';
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target == userModal) {
            userModal.style.display = 'none';
        }
        if (event.target == activityModal) {
            activityModal.style.display = 'none';
        }
    });

    // Handle Add/Edit User Form Submission
    userForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = userIdField.value;
        const name = userNameField.value;
        const email = userEmailField.value;
        const role = userRoleField.value;

        if (id) {
            // Edit existing user
            const userIndex = users.findIndex(user => user.id == id);
            if (userIndex > -1) {
                users[userIndex] = { id: parseInt(id), name, email, role };
            }
        } else {
            // Add new user
            const newId = users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1;
            users.push({ id: newId, name, email, role });
        }
        renderUsers();
        userModal.style.display = 'none';
    });

    // Handle User Table Actions (Edit, Delete, Reset Password, Assign Role, View Activity)
    userTableBody.addEventListener('click', (e) => {
        const target = e.target;
        const button = target.closest('button');
        if (!button) return;

        const userId = button.dataset.id;
        const user = users.find(u => u.id == userId);

        if (!user) return;

        if (button.classList.contains('btn-edit')) {
            modalTitle.textContent = 'Edit User';
            userIdField.value = user.id;
            userNameField.value = user.name;
            userEmailField.value = user.email;
            userRoleField.value = user.role;
            userModal.style.display = 'block';
        } else if (button.classList.contains('btn-delete')) {
            showCustomConfirm(`Are you sure you want to delete user ${user.name}?`, 'Delete User').then((confirmed) => {
                if (confirmed) {
                    users = users.filter(u => u.id != userId);
                    renderUsers();
                    showAlert(`User ${user.name} deleted successfully!`, 'success');
                }
            });
        } else if (button.classList.contains('btn-reset-password')) {
            showAlert(`Reset password for user: ${user.name}`, 'info');
            // In a real application, you would send a request to the server to reset the password
        } else if (button.classList.contains('btn-assign-role')) {
            const newRole = prompt(`Assign new role for ${user.name} (customer, staff, admin):`, user.role);
            if (newRole && ['customer', 'staff', 'admin'].includes(newRole.toLowerCase())) {
                user.role = newRole.toLowerCase();
                renderUsers();
                showAlert(`Role for ${user.name} updated to ${newRole}.`, 'success');
            } else if (newRole) {
                showAlert('Invalid role. Please choose from customer, staff, or admin.', 'warning');
            }
        } else if (button.classList.contains('btn-view-activity')) {
            const userActivityContent = document.getElementById('userActivityContent');
            userActivityContent.innerHTML = `<h3>Activity for ${user.name}</h3><p>No activity to show.</p>`;
            activityModal.style.display = 'block';
        }
    });

    // User Search Functionality
    userSearchInput.addEventListener('keyup', (e) => {
        renderUsers(e.target.value);
    });

    // Menu Management Functionality
    const addDishBtn = document.getElementById('addDishBtn');
    const manageCategoriesBtn = document.getElementById('manageCategoriesBtn');
    const manageOffersBtn = document.getElementById('manageOffersBtn');
    const dishSearchInput = document.getElementById('dishSearch');

    const dishModal = document.getElementById('dishModal');
    const dishModalTitle = document.getElementById('dishModalTitle');
    const dishForm = document.getElementById('dishForm');
    const dishIdField = document.getElementById('dishId');
    const dishImageField = document.getElementById('dishImage');
    const dishNameField = document.getElementById('dishName');
    const dishDescriptionField = document.getElementById('dishDescription');
    const dishIngredientsField = document.getElementById('dishIngredients');
    const dishPriceField = document.getElementById('dishPrice');
    const dishCategoryField = document.getElementById('dishCategory');
    const menuTableBody = document.querySelector('#menuTable tbody');

    const categoryModal = document.getElementById('categoryModal');
    const categoryList = document.getElementById('categoryList');
    const newCategoryNameInput = document.getElementById('newCategoryName');
    const addCategoryBtn = document.getElementById('addCategoryBtn');

    const offerModal = document.getElementById('offerModal');
    const offerList = document.getElementById('offerList');
    const newOfferTextInput = document.getElementById('newOfferText');
    const addOfferBtn = document.getElementById('addOfferBtn');

    let dishes = [
        {
            id: 1,
            image: 'assets/images/Spicy Paneer Pizza.jpg',
            name: 'Spicy Paneer Pizza',
            description: 'Spicy paneer, onion, capsicum, and cheese.',
            category: 'Pizza',
            price: 12.99,
            status: 'active'
        },
        {
            id: 2,
            image: 'assets/images/Chicken Burger.jpg',
            name: 'Chicken Burger',
            description: 'Grilled chicken patty, lettuce, tomato, and special sauce.',
            category: 'Burger',
            price: 8.50,
            status: 'active'
        },
        {
            id: 3,
            image: 'assets/images/Chocolate.jpg',
            name: 'Chocolate Milkshake',
            description: 'Rich chocolate ice cream blended with milk.',
            category: 'Drinks',
            price: 4.00,
            status: 'inactive'
        }
    ];

    let categories = ['Pizza', 'Burger', 'Drinks', 'Desserts', 'Biryani', 'Soup', 'Tea'];
    let offers = ['20% off on all Pizzas!', 'Free Coke with any Burger!'];

    const renderDishes = (filter = '') => {
        menuTableBody.innerHTML = '';
        const filteredDishes = dishes.filter(dish =>
            dish.name.toLowerCase().includes(filter.toLowerCase()) ||
            dish.description.toLowerCase().includes(filter.toLowerCase()) ||
            dish.category.toLowerCase().includes(filter.toLowerCase())
        );

        filteredDishes.forEach(dish => {
            const row = menuTableBody.insertRow();
            row.innerHTML = `
                <td>${dish.id}</td>
                <td><img src="${dish.image}" alt="${dish.name}" class="menu-item-img"></td>
                <td>${dish.name}</td>
                <td>${dish.description}</td>
                <td>${dish.category}</td>
                <td>${dish.price.toFixed(2)}</td>
                <td class="status-${dish.status}">${dish.status === 'active' ? 'Active' : 'Inactive'}</td>
                <td class="action-buttons">
                    <button class="btn-edit-dish" data-id="${dish.id}">Edit</button>
                    <button class="btn-toggle-status" data-id="${dish.id}">${dish.status === 'active' ? 'Disable' : 'Enable'}</button>
                    <button class="btn-delete-dish" data-id="${dish.id}">Delete</button>
                </td>
            `;
        });
    };

    const renderCategories = () => {
        categoryList.innerHTML = '';
        categories.forEach(category => {
            const div = document.createElement('div');
            div.classList.add('category-item');
            div.innerHTML = `
                <span>${category}</span>
                <button class="btn-delete-category" data-category="${category}">Delete</button>
            `;
            categoryList.appendChild(div);
        });
    };

    const renderOffers = () => {
        offerList.innerHTML = '';
        offers.forEach(offer => {
            const div = document.createElement('div');
            div.classList.add('offer-item');
            div.innerHTML = `
                <span>${offer}</span>
                <button class="btn-delete-offer" data-offer="${offer}">Delete</button>
            `;
            offerList.appendChild(div);
        });
    };

    // Initial render of dishes, categories, and offers
    renderDishes();
    renderCategories();
    renderOffers();

    // Open Add Dish Modal
    addDishBtn.addEventListener('click', () => {
        dishModalTitle.textContent = 'Add New Dish';
        dishForm.reset();
        dishIdField.value = '';
        dishModal.style.display = 'block';
    });

    // Open Manage Categories Modal
    manageCategoriesBtn.addEventListener('click', () => {
        categoryModal.style.display = 'block';
    });

    // Open Manage Offers Modal
    manageOffersBtn.addEventListener('click', () => {
        offerModal.style.display = 'block';
    });

    // Close Modals (reusing existing closeBtns for dishModal, categoryModal, offerModal)
    document.querySelectorAll('.modal .close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').style.display = 'none';
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target == dishModal) {
            dishModal.style.display = 'none';
        }
        if (event.target == categoryModal) {
            categoryModal.style.display = 'none';
        }
        if (event.target == offerModal) {
            offerModal.style.display = 'none';
        }
    });

    // Handle Add/Edit Dish Form Submission
    dishForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = dishIdField.value;
        const image = dishImageField.value;
        const name = dishNameField.value;
        const description = dishDescriptionField.value;
        const ingredients = dishIngredientsField.value; // Not directly used in display, but good to capture
        const price = parseFloat(dishPriceField.value);
        const category = dishCategoryField.value;

        if (id) {
            // Edit existing dish
            const dishIndex = dishes.findIndex(d => d.id === id);
            if (dishIndex > -1) {
                dishes[dishIndex] = { ...dishes[dishIndex], image, name, description, category, price };
            }
        } else {
            // Add new dish
            const newId = dishes.length > 0 ? Math.max(...dishes.map(d => d.id)) + 1 : 1;
            dishes.push({ id: newId, image, name, description, category, price, status: 'active' });
        }
        renderDishes();
        dishModal.style.display = 'none';
    });

    // Handle Menu Table Actions (Edit, Toggle Status, Delete)
    menuTableBody.addEventListener('click', (e) => {
        const target = e.target;
        const dishId = parseInt(target.dataset.id);
        const dish = dishes.find(d => d.id === dishId);

        if (!dish) return;

        if (target.classList.contains('btn-edit-dish')) {
            dishModalTitle.textContent = 'Edit Dish';
            dishIdField.value = dish.id;
            dishImageField.value = dish.image;
            dishNameField.value = dish.name;
            dishDescriptionField.value = dish.description;
            // dishIngredientsField.value = dish.ingredients; // Assuming ingredients are part of description for now
            dishPriceField.value = dish.price;
            dishCategoryField.value = dish.category;
            dishModal.style.display = 'block';
        } else if (target.classList.contains('btn-toggle-status')) {
            dish.status = dish.status === 'active' ? 'inactive' : 'active';
            showAlert(`${dish.name} is now ${dish.status}.`, 'info');
            renderDishes();
        }
    });

    // Dish Search Functionality
    dishSearchInput.addEventListener('keyup', (e) => {
        renderDishes(e.target.value);
    });

    // Handle Add Category
    addCategoryBtn.addEventListener('click', () => {
        const newCategory = newCategoryNameInput.value.trim();
        if (newCategory && !categories.includes(newCategory)) {
            categories.push(newCategory);
            newCategoryNameInput.value = '';
            renderCategories();
            showAlert(`Category "${newCategory}" added successfully!`, 'success');
        } else if (newCategory) {
            showAlert('Category already exists!', 'warning');
        }
    });

    // Handle Delete Category
    categoryList.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('btn-delete-category')) {
            const categoryToDelete = target.dataset.category;
            showCustomConfirm(`Are you sure you want to delete category "${categoryToDelete}"?`, 'Delete Category').then((confirmed) => {
                if (confirmed) {
                    categories = categories.filter(cat => cat !== categoryToDelete);
                    renderCategories();
                    showAlert(`Category "${categoryToDelete}" deleted successfully!`, 'success');
                }
            });
        }
    });

    // Handle Add Offer
    addOfferBtn.addEventListener('click', () => {
        const newOffer = newOfferTextInput.value.trim();
        if (newOffer && !offers.includes(newOffer)) {
            offers.push(newOffer);
            newOfferTextInput.value = '';
            renderOffers();
            showAlert(`Offer "${newOffer}" added successfully!`, 'success');
        } else if (newOffer) {
            showAlert('Offer already exists!', 'warning');
        }
    });

    // Handle Delete Offer
    offerList.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('btn-delete-offer')) {
            const offerToDelete = target.dataset.offer;
            showCustomConfirm(`Are you sure you want to delete offer "${offerToDelete}"?`, 'Delete Offer').then((confirmed) => {
                if (confirmed) {
                    offers = offers.filter(off => off !== offerToDelete);
                    renderOffers();
                    showAlert(`Offer "${offerToDelete}" deleted successfully!`, 'success');
                }
            });
        }
    });

    // Order Management Functionality
    const orderStatusFilter = document.getElementById('orderStatusFilter');
    const orderTableBody = document.querySelector('#orderTable tbody');

    let orders = [
        {
            id: '001',
            customer: 'John Doe',
            items: 'Burger, Fries',
            total: '$15.00',
            status: 'pending',
            assignedStaff: ''
        },
        {
            id: '002',
            customer: 'Jane Smith',
            items: 'Pizza, Coke',
            total: '$25.50',
            status: 'in-progress',
            assignedStaff: 'staff1'
        },
        {
            id: '003',
            customer: 'Peter Jones',
            items: 'Momos, Tea',
            total: '$10.00',
            status: 'complete',
            assignedStaff: 'staff2'
        },
        {
            id: '004',
            customer: 'Alice Brown',
            items: 'Salad, Water',
            total: '$12.00',
            status: 'cancelled',
            assignedStaff: ''
        }
    ];

    const renderOrders = (filterStatus = 'all') => {
        orderTableBody.innerHTML = '';
        const filteredOrders = orders.filter(order => {
            if (filterStatus === 'all') {
                return true;
            }
            return order.status === filterStatus;
        });

        filteredOrders.forEach(order => {
            const row = orderTableBody.insertRow();
            row.innerHTML = `
                <td>#${order.id}</td>
                <td>${order.customer}</td>
                <td>${order.items}</td>
                <td>${order.total}</td>
                <td>
                    <select class="order-status-select" data-order-id="${order.id}">
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                        <option value="preparing" ${order.status === 'preparing' ? 'selected' : ''}>Preparing</option>
                        <option value="out-for-delivery" ${order.status === 'out-for-delivery' ? 'selected' : ''}>Out for Delivery</option>
                        <option value="complete" ${order.status === 'complete' ? 'selected' : ''}>Complete</option>
                        <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </td>
                <td>
                    <select class="delivery-staff-select" data-order-id="${order.id}">
                        <option value="" ${order.assignedStaff === '' ? 'selected' : ''}>Unassigned</option>
                        <option value="staff1" ${order.assignedStaff === 'staff1' ? 'selected' : ''}>Delivery Staff 1</option>
                        <option value="staff2" ${order.assignedStaff === 'staff2' ? 'selected' : ''}>Delivery Staff 2</option>
                    </select>
                </td>
                <td>
                    <button class="btn-print-invoice" data-order-id="${order.id}">Print/Download</button>
                    <button class="btn-refund-cancel" data-order-id="${order.id}">Refund/Cancel</button>
                </td>
            `;
        });
    };

    // Initial render of orders
    renderOrders();

    // Event listener for order status filter
    orderStatusFilter.addEventListener('change', (e) => {
        renderOrders(e.target.value);
    });

    // Event listener for order table actions (status update, staff assignment, print, refund)
    orderTableBody.addEventListener('change', (e) => {
        const target = e.target;
        const orderId = target.dataset.orderId;
        const order = orders.find(o => o.id === orderId);

        if (!order) return;

        if (target.classList.contains('order-status-select')) {
            order.status = target.value;
            showAlert(`Order #${order.id} status updated to: ${order.status}`, 'success');
            // In a real application, you would send this update to the server
        } else if (target.classList.contains('delivery-staff-select')) {
            order.assignedStaff = target.value;
            showAlert(`Order #${order.id} assigned to: ${target.options[target.selectedIndex].text}`, 'success');
            // In a real application, you would send this update to the server
        }
    });

    orderTableBody.addEventListener('click', (e) => {
        const target = e.target;
        const orderId = target.dataset.orderId;
        const order = orders.find(o => o.id === orderId);

        if (!order) return;

        if (target.classList.contains('btn-print-invoice')) {
            showAlert(`Printing/Downloading invoice for Order #${order.id}`, 'info');
            // In a real application, you would generate and provide the invoice
        } else if (target.classList.contains('btn-refund-cancel')) {
            showCustomConfirm(`Are you sure you want to refund/cancel Order #${order.id}?`, 'Refund/Cancel Order').then((confirmed) => {
                if (confirmed) {
                    order.status = 'cancelled'; // Mark as cancelled
                    showAlert(`Order #${order.id} has been cancelled/refunded.`, 'success');
                    renderOrders(orderStatusFilter.value); // Re-render to reflect cancellation
                    // In a real application, you would process the refund/cancellation on the server
                }
            });
        }
    });

    // Reservation Management Functionality
    const addReservationBtn = document.getElementById('addReservationBtn');
    const manageCapacityBtn = document.getElementById('manageCapacityBtn');
    const reservationSearchInput = document.getElementById('reservationSearch');

    const reservationTableBody = document.querySelector('#reservationTable tbody');

    const reservationModal = document.getElementById('reservationModal');
    const reservationModalTitle = document.getElementById('reservationModalTitle');
    const reservationForm = document.getElementById('reservationForm');
    const resvIdField = document.getElementById('reservationId');
    const resvNameField = document.getElementById('resvName');
    const resvDateField = document.getElementById('resvDate');
    const resvTimeField = document.getElementById('resvTime');
    const resvGuestsField = document.getElementById('resvGuests');
    const resvTableField = document.getElementById('resvTable');
    const resvNotesField = document.getElementById('resvNotes');

    const acceptRejectModal = document.getElementById('acceptRejectModal');
    const arResvIdSpan = document.getElementById('arResvId');
    const arResvNameSpan = document.getElementById('arResvName');
    const arResvDateSpan = document.getElementById('arResvDate');
    const arResvTimeSpan = document.getElementById('arResvTime');
    const arResvGuestsSpan = document.getElementById('arResvGuests');
    const arResvNotesSpan = document.getElementById('arResvNotes');
    const acceptResvBtn = document.getElementById('acceptResvBtn');
    const rejectResvBtn = document.getElementById('rejectResvBtn');

    const assignTableModal = document.getElementById('assignTableModal');
    const atResvIdSpan = document.getElementById('atResvId');
    const atResvNameSpan = document.getElementById('atResvName');
    const assignTableField = document.getElementById('assignTable');
    const assignTimeField = document.getElementById('assignTime');
    const saveAssignmentBtn = document.getElementById('saveAssignmentBtn');

    const totalTablesInput = document.getElementById('totalTables');
    const availableSeatsInput = document.getElementById('availableSeats');
    const updateCapacityBtn = document.getElementById('updateCapacityBtn');
    const currentCapacitySpan = document.getElementById('currentCapacity');
    const currentSeatsSpan = document.getElementById('currentSeats');

    let reservations = [
        { id: 'R001', name: 'John Doe', date: '2025-08-20', time: '18:00', guests: 4, table: 'Table 5', status: 'confirmed', notes: 'Birthday celebration' },
        { id: 'R002', name: 'Jane Smith', date: '2025-08-21', time: '19:30', guests: 2, table: 'Unassigned', status: 'pending', notes: 'Anniversary dinner' },
        { id: 'R003', name: 'Peter Jones', date: '2025-08-22', time: '13:00', guests: 6, table: 'Table 10', status: 'rejected', notes: 'None' }
    ];

    let seatingCapacity = {
        totalTables: parseInt(totalTablesInput.value),
        availableSeats: parseInt(availableSeatsInput.value)
    };

    const updateSeatingCapacityDisplay = () => {
        currentCapacitySpan.textContent = seatingCapacity.totalTables;
        currentSeatsSpan.textContent = seatingCapacity.availableSeats;
    };

    const renderReservations = (filter = '') => {
        reservationTableBody.innerHTML = '';
        const filteredReservations = reservations.filter(resv =>
            resv.name.toLowerCase().includes(filter.toLowerCase()) ||
            resv.date.includes(filter) ||
            resv.status.toLowerCase().includes(filter.toLowerCase()) ||
            resv.notes.toLowerCase().includes(filter.toLowerCase())
        );

        filteredReservations.forEach(resv => {
            const row = reservationTableBody.insertRow();
            row.innerHTML = `
                <td>${resv.id}</td>
                <td>${resv.name}</td>
                <td>${resv.date}</td>
                <td>${resv.time}</td>
                <td>${resv.guests}</td>
                <td>${resv.table}</td>
                <td><span class="status-${resv.status}">${resv.status.charAt(0).toUpperCase() + resv.status.slice(1)}</span></td>
                <td>${resv.notes}</td>
                <td class="action-buttons">
                    <button class="btn-accept-reservation" data-id="${resv.id}">Accept</button>
                    <button class="btn-reject-reservation" data-id="${resv.id}">Reject</button>
                    <button class="btn-assign-table" data-id="${resv.id}">Assign Table</button>
                </td>
            `;
        });
    };

    // Initial render
    renderReservations();
    updateSeatingCapacityDisplay();

    // Open Add Reservation Modal
    addReservationBtn.addEventListener('click', () => {
        reservationModalTitle.textContent = 'Add New Reservation';
        reservationForm.reset();
        resvIdField.value = '';
        reservationModal.style.display = 'block';
    });

    // Handle Add/Edit Reservation Form Submission
    reservationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = resvIdField.value;
        const name = resvNameField.value;
        const date = resvDateField.value;
        const time = resvTimeField.value;
        const guests = parseInt(resvGuestsField.value);
        const table = resvTableField.value || 'Unassigned';
        const notes = resvNotesField.value;

        if (id) {
            // Edit existing reservation
            const resvIndex = reservations.findIndex(r => r.id === id);
            if (resvIndex > -1) {
                reservations[resvIndex] = { ...reservations[resvIndex], name, date, time, guests, table, notes };
            }
        } else {
            // Add new reservation
            const newId = 'R' + (reservations.length > 0 ? Math.max(...reservations.map(r => parseInt(r.id.substring(1)))) + 1 : 1).toString().padStart(3, '0');
            reservations.push({ id: newId, name, date, time, guests, table, status: 'pending', notes });
        }
        renderReservations();
        reservationModal.style.display = 'none';
    });

    // Handle Reservation Table Actions (Accept, Reject, Assign Table)
    reservationTableBody.addEventListener('click', (e) => {
        const target = e.target;
        const resvId = target.dataset.id;
        const reservation = reservations.find(r => r.id === resvId);

        if (!reservation) return;

        if (target.classList.contains('btn-accept-reservation')) {
            arResvIdSpan.textContent = reservation.id;
            arResvNameSpan.textContent = reservation.name;
            arResvDateSpan.textContent = reservation.date;
            arResvTimeSpan.textContent = reservation.time;
            arResvGuestsSpan.textContent = reservation.guests;
            arResvNotesSpan.textContent = reservation.notes;
            acceptRejectModal.style.display = 'block';

            acceptResvBtn.onclick = () => {
                reservation.status = 'confirmed';
                showAlert(`Reservation ${reservation.id} accepted.`, 'success');
                renderReservations();
                acceptRejectModal.style.display = 'none';
            };

            rejectResvBtn.onclick = () => {
                reservation.status = 'rejected';
                showAlert(`Reservation ${reservation.id} rejected.`, 'error');
                renderReservations();
                acceptRejectModal.style.display = 'none';
            };

        } else if (target.classList.contains('btn-reject-reservation')) {
            arResvIdSpan.textContent = reservation.id;
            arResvNameSpan.textContent = reservation.name;
            arResvDateSpan.textContent = reservation.date;
            arResvTimeSpan.textContent = reservation.time;
            arResvGuestsSpan.textContent = reservation.guests;
            arResvNotesSpan.textContent = reservation.notes;
            acceptRejectModal.style.display = 'block';

            acceptResvBtn.onclick = () => {
                reservation.status = 'confirmed';
                showAlert(`Reservation ${reservation.id} accepted.`, 'success');
                renderReservations();
                acceptRejectModal.style.display = 'none';
            };

            rejectResvBtn.onclick = () => {
                reservation.status = 'rejected';
                showAlert(`Reservation ${reservation.id} rejected.`, 'error');
                renderReservations();
                acceptRejectModal.style.display = 'none';
            };

        } else if (target.classList.contains('btn-assign-table')) {
            atResvIdSpan.textContent = reservation.id;
            atResvNameSpan.textContent = reservation.name;
            assignTableField.value = reservation.table === 'Unassigned' ? '' : reservation.table;
            assignTimeField.value = reservation.time;
            assignTableModal.style.display = 'block';

            saveAssignmentBtn.onclick = () => {
                reservation.table = assignTableField.value || 'Unassigned';
                reservation.time = assignTimeField.value;
                showAlert(`Table ${reservation.table} assigned to Reservation ${reservation.id} at ${reservation.time}.`, 'success');
                renderReservations();
                assignTableModal.style.display = 'none';
            };
        }
    });

    // Close Modals (reusing existing closeBtns for reservationModal, acceptRejectModal, assignTableModal)
    document.querySelectorAll('.modal .close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').style.display = 'none';
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target == reservationModal) {
            reservationModal.style.display = 'none';
        }
        if (event.target == acceptRejectModal) {
            acceptRejectModal.style.display = 'none';
        }
        if (event.target == assignTableModal) {
            assignTableModal.style.display = 'none';
        }
    });

    // Seating Capacity Management
    updateCapacityBtn.addEventListener('click', () => {
        seatingCapacity.totalTables = parseInt(totalTablesInput.value);
        seatingCapacity.availableSeats = parseInt(availableSeatsInput.value);
        updateSeatingCapacityDisplay();
        showAlert('Seating capacity updated!', 'success');
    });

    // Reservation Search Functionality
    reservationSearchInput.addEventListener('keyup', (e) => {
        renderReservations(e.target.value);
    });

    // Inventory Management Functionality
    const inventoryTableBody = document.querySelector('#inventoryTable tbody');
    const addInventoryItemBtn = document.getElementById('addInventoryItemBtn');
    const inventoryItemModal = document.getElementById('inventoryItemModal');
    const inventoryItemModalTitle = document.getElementById('inventoryItemModalTitle');
    const inventoryItemForm = document.getElementById('inventoryItemForm');
    const inventoryItemIdField = document.getElementById('inventoryItemId');
    const itemNameField = document.getElementById('itemName');
    const currentStockField = document.getElementById('currentStock');
    const unitField = document.getElementById('unit');
    const minStockField = document.getElementById('minStock');
    const supplierField = document.getElementById('supplier');

    const lowStockAlertsDiv = document.getElementById('lowStockAlerts');
    const lowStockThresholdInput = document.getElementById('lowStockThreshold');
    const updateThresholdBtn = document.getElementById('updateThresholdBtn');

    const updateStockModal = document.getElementById('updateStockModal');
    const updateStockItemNameSpan = document.getElementById('updateStockItemName');
    const updateStockItemIdField = document.getElementById('updateStockItemId');
    const stockChangeField = document.getElementById('stockChange');
    const saveStockUpdateBtn = document.getElementById('saveStockUpdateBtn');

    const supplierManagementSection = document.getElementById('supplier-management-section');
    const addSupplierBtn = document.getElementById('addSupplierBtn');
    const supplierModal = document.getElementById('supplierModal');
    const supplierModalTitle = document.getElementById('supplierModalTitle');
    const supplierForm = document.getElementById('supplierForm');
    const supplierIdField = document.getElementById('supplierId');
    const supplierNameField = document.getElementById('supplierName');
    const contactPersonField = document.getElementById('contactPerson');
    const supplierPhoneField = document.getElementById('supplierPhone');
    const supplierEmailField = document.getElementById('supplierEmail');
    const supplierTableBody = document.querySelector('#supplierTable tbody');
    const supplierSearchInput = document.getElementById('supplierSearch');

    const purchaseHistorySection = document.getElementById('purchase-history-section');
    const purchaseHistoryTableBody = document.querySelector('#purchaseHistoryTable tbody');
    const purchaseHistorySearchInput = document.getElementById('purchaseHistorySearch');

    const manageSuppliersBtn = document.getElementById('manageSuppliersBtn');
    const viewPurchaseHistoryBtn = document.getElementById('viewPurchaseHistoryBtn');

    let inventoryItems = [
        { id: 'INV001', name: 'Tomatoes', currentStock: 20, unit: 'kg', minStock: 10, supplier: 'Veggie Supplier A', lastUpdated: '2025-08-18' },
        { id: 'INV002', name: 'Cheese', currentStock: 5, unit: 'kg', minStock: 8, supplier: 'Dairy Delights', lastUpdated: '2025-08-17' },
        { id: 'INV003', name: 'Flour', currentStock: 50, unit: 'kg', minStock: 20, supplier: 'Grain Co.', lastUpdated: '2025-08-16' }
    ];

    let suppliers = [
        { id: 'SUP001', name: 'Veggie Supplier A', contactPerson: 'Alice Green', phone: '123-456-7890', email: 'alice@veggie.com' },
        { id: 'SUP002', name: 'Dairy Delights', contactPerson: 'Bob Milk', phone: '987-654-3210', email: 'bob@dairy.com' },
        { id: 'SUP003', name: 'Grain Co.', contactPerson: 'Charlie Wheat', phone: '555-123-4567', email: 'charlie@grainco.com' }
    ];

    let purchaseHistory = [
        { id: 'PO001', date: '2025-08-15', item: 'Tomatoes', quantity: 15, unitCost: 1.50, totalCost: 22.50, supplier: 'Veggie Supplier A' },
        { id: 'PO002', date: '2025-08-10', item: 'Cheese', quantity: 10, unitCost: 5.00, totalCost: 50.00, supplier: 'Dairy Delights' },
        { id: 'PO003', date: '2025-08-05', item: 'Flour', quantity: 30, unitCost: 0.80, totalCost: 24.00, supplier: 'Grain Co.' }
    ];

    const renderInventoryItems = (filter = '') => {
        inventoryTableBody.innerHTML = '';
        const filteredItems = inventoryItems.filter(item =>
            item.name.toLowerCase().includes(filter.toLowerCase()) ||
            item.supplier.toLowerCase().includes(filter.toLowerCase()) ||
            item.id.toLowerCase().includes(filter.toLowerCase())
        );

        filteredItems.forEach(item => {
            const statusClass = item.currentStock <= item.minStock ? 'status-low' : 'status-ok';
            const statusText = item.currentStock <= item.minStock ? 'Low' : 'OK';
            const row = inventoryTableBody.insertRow();
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.currentStock}</td>
                <td>${item.unit}</td>
                <td>${item.minStock}</td>
                <td><span class="${statusClass}">${statusText}</span></td>
                <td>${item.supplier}</td>
                <td>${item.lastUpdated}</td>
                <td class="action-buttons">
                    <button class="btn-edit-item" data-id="${item.id}">Edit</button>
                    <button class="btn-update-stock" data-id="${item.id}">Update Stock</button>
                </td>
            `;
        });
        checkLowStockAlerts();
    };

    const checkLowStockAlerts = () => {
        lowStockAlertsDiv.innerHTML = '';
        const lowStockItems = inventoryItems.filter(item => item.currentStock <= item.minStock);
        if (lowStockItems.length === 0) {
            lowStockAlertsDiv.innerHTML = '<p>No low stock items currently.</p>';
        } else {
            const ul = document.createElement('ul');
            lowStockItems.forEach(item => {
                const li = document.createElement('li');
                li.textContent = `${item.name} is low in stock! Current: ${item.currentStock} ${item.unit}, Min: ${item.minStock} ${item.unit}.`;
                ul.appendChild(li);
            });
            lowStockAlertsDiv.appendChild(ul);
        }
    };

    const renderSuppliers = (filter = '') => {
        supplierTableBody.innerHTML = '';
        const filteredSuppliers = suppliers.filter(supplier =>
            supplier.name.toLowerCase().includes(filter.toLowerCase()) ||
            supplier.contactPerson.toLowerCase().includes(filter.toLowerCase()) ||
            supplier.email.toLowerCase().includes(filter.toLowerCase())
        );

        filteredSuppliers.forEach(supplier => {
            const row = supplierTableBody.insertRow();
            row.innerHTML = `
                <td>${supplier.id}</td>
                <td>${supplier.name}</td>
                <td>${supplier.contactPerson}</td>
                <td>${supplier.phone}</td>
                <td>${supplier.email}</td>
                <td class="action-buttons">
                    <button class="btn-edit-supplier" data-id="${supplier.id}">Edit</button>
                    <button class="btn-delete-supplier" data-id="${supplier.id}">Delete</button>
                </td>
            `;
        });
    };

    const renderPurchaseHistory = (filter = '') => {
        purchaseHistoryTableBody.innerHTML = '';
        const filteredHistory = purchaseHistory.filter(record =>
            record.item.toLowerCase().includes(filter.toLowerCase()) ||
            record.supplier.toLowerCase().includes(filter.toLowerCase()) ||
            record.id.toLowerCase().includes(filter.toLowerCase())
        );

        filteredHistory.forEach(record => {
            const row = purchaseHistoryTableBody.insertRow();
            row.innerHTML = `
                <td>${record.id}</td>
                <td>${record.date}</td>
                <td>${record.item}</td>
                <td>${record.quantity}</td>
                <td>$${record.unitCost.toFixed(2)}</td>
                <td>$${record.totalCost.toFixed(2)}</td>
                <td>${record.supplier}</td>
            `;
        });
    };

    // Initial renders for inventory, suppliers, and purchase history
    renderInventoryItems();
    renderSuppliers();
    renderPurchaseHistory();

    manageSuppliersBtn.addEventListener('click', () => {
        supplierManagementSection.style.display = 'block';
        purchaseHistorySection.style.display = 'none';
    });

    viewPurchaseHistoryBtn.addEventListener('click', () => {
        purchaseHistorySection.style.display = 'block';
        supplierManagementSection.style.display = 'none';
    });

    // Event Listeners for Inventory Management
    addInventoryItemBtn.addEventListener('click', () => {
        inventoryItemModalTitle.textContent = 'Add New Inventory Item';
        inventoryItemForm.reset();
        inventoryItemIdField.value = '';
        inventoryItemModal.style.display = 'block';
    });

    inventoryItemForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = inventoryItemIdField.value;
        const name = itemNameField.value;
        const currentStock = parseInt(currentStockField.value);
        const unit = unitField.value;
        const minStock = parseInt(minStockField.value);
        const supplier = supplierField.value;
        const lastUpdated = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

        if (id) {
            const itemIndex = inventoryItems.findIndex(item => item.id === id);
            if (itemIndex > -1) {
                inventoryItems[itemIndex] = { ...inventoryItems[itemIndex], name, currentStock, unit, minStock, supplier, lastUpdated };
            }
        } else {
            const newId = 'INV' + (inventoryItems.length > 0 ? Math.max(...inventoryItems.map(item => parseInt(item.id.substring(3)))) + 1 : 1).toString().padStart(3, '0');
            inventoryItems.push({ id: newId, name, currentStock, unit, minStock, supplier, lastUpdated });
        }
        renderInventoryItems();
        inventoryItemModal.style.display = 'none';
    });

    inventoryTableBody.addEventListener('click', (e) => {
        const target = e.target;
        const itemId = target.dataset.id;
        const item = inventoryItems.find(i => i.id === itemId);

        if (!item) return;

        if (target.classList.contains('btn-edit-item')) {
            inventoryItemModalTitle.textContent = 'Edit Inventory Item';
            inventoryItemIdField.value = item.id;
            itemNameField.value = item.name;
            currentStockField.value = item.currentStock;
            unitField.value = item.unit;
            minStockField.value = item.minStock;
            supplierField.value = item.supplier;
            inventoryItemModal.style.display = 'block';
        } else if (target.classList.contains('btn-update-stock')) {
            updateStockItemNameSpan.textContent = item.name;
            updateStockItemIdField.value = item.id;
            stockChangeField.value = ''; // Clear previous value
            updateStockModal.style.display = 'block';
        }
    });

    updateStockForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const itemId = updateStockItemIdField.value;
        const change = parseInt(stockChangeField.value);
        const itemIndex = inventoryItems.findIndex(item => item.id === itemId);

        if (itemIndex > -1 && !isNaN(change)) {
            inventoryItems[itemIndex].currentStock += change;
            inventoryItems[itemIndex].lastUpdated = new Date().toISOString().slice(0, 10);
            renderInventoryItems();
            updateStockModal.style.display = 'none';
            showAlert(`Stock for ${inventoryItems[itemIndex].name} updated successfully!`, 'success');
        } else {
            showAlert('Please enter a valid number for stock change.', 'warning');
        }
    });

    saveStockUpdateBtn.addEventListener('click', () => {
        const itemId = updateStockItemIdField.value;
        const change = parseInt(stockChangeField.value);
        const itemIndex = inventoryItems.findIndex(item => item.id === itemId);

        if (itemIndex > -1 && !isNaN(change)) {
            inventoryItems[itemIndex].currentStock += change;
            inventoryItems[itemIndex].lastUpdated = new Date().toISOString().slice(0, 10);
            renderInventoryItems();
            updateStockModal.style.display = 'none';
            showAlert(`Stock for ${inventoryItems[itemIndex].name} updated successfully!`, 'success');
        } else {
            showAlert('Please enter a valid number for stock change.', 'warning');
        }
    });

    updateThresholdBtn.addEventListener('click', () => {
        checkLowStockAlerts();
        showAlert('Low stock threshold updated and alerts refreshed.', 'success');
    });

    // Event Listeners for Supplier Management
    addSupplierBtn.addEventListener('click', () => {
        supplierModalTitle.textContent = 'Add New Supplier';
        supplierForm.reset();
        supplierIdField.value = '';
        supplierModal.style.display = 'block';
    });

    supplierForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = supplierIdField.value;
        const name = supplierNameField.value;
        const contactPerson = contactPersonField.value;
        const phone = supplierPhoneField.value;
        const email = supplierEmailField.value;

        if (id) {
            const supplierIndex = suppliers.findIndex(s => s.id === id);
            if (supplierIndex > -1) {
                suppliers[supplierIndex] = { ...suppliers[supplierIndex], name, contactPerson, phone, email };
            }
        } else {
            const newId = 'SUP' + (suppliers.length > 0 ? Math.max(...suppliers.map(s => parseInt(s.id.substring(3)))) + 1 : 1).toString().padStart(3, '0');
            suppliers.push({ id: newId, name, contactPerson, phone, email });
        }
        renderSuppliers();
        supplierModal.style.display = 'none';
    });

    supplierTableBody.addEventListener('click', (e) => {
        const target = e.target;
        const supplierId = target.dataset.id;
        const supplier = suppliers.find(s => s.id === supplierId);

        if (!supplier) return;

        if (target.classList.contains('btn-edit-supplier')) {
            supplierModalTitle.textContent = 'Edit Supplier';
            supplierIdField.value = supplier.id;
            supplierNameField.value = supplier.name;
            contactPersonField.value = supplier.contactPerson;
            supplierPhoneField.value = supplier.phone;
            supplierEmailField.value = supplier.email;
            supplierModal.style.display = 'block';
        } else if (target.classList.contains('btn-delete-supplier')) {
            showCustomConfirm(`Are you sure you want to delete supplier ${supplier.name}?`, 'Delete Supplier').then((confirmed) => {
                if (confirmed) {
                    suppliers = suppliers.filter(s => s.id !== supplierId);
                    renderSuppliers();
                    showAlert(`Supplier ${supplier.name} deleted successfully!`, 'success');
                }
            });
        }
    });

    supplierSearchInput.addEventListener('keyup', (e) => {
        renderSuppliers(e.target.value);
    });

    // Event Listener for Purchase History Search
    purchaseHistorySearchInput.addEventListener('keyup', (e) => {
        renderPurchaseHistory(e.target.value);
    });

    // Close Modals (reusing existing closeBtns for inventoryItemModal, updateStockModal, supplierModal)
    document.querySelectorAll('.modal .close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').style.display = 'none';
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target == inventoryItemModal) {
            inventoryItemModal.style.display = 'none';
        }
        if (event.target == updateStockModal) {
            updateStockModal.style.display = 'none';
        }
        if (event.target == supplierModal) {
            supplierModal.style.display = 'none';
        }
    });

    // Event Listeners for Supplier Management
    supplierTableBody.addEventListener('click', (e) => {
        const target = e.target;
        const supplierId = target.dataset.id;
        const supplier = suppliers.find(s => s.id === supplierId);

        if (!supplier) return;

        if (target.classList.contains('btn-edit-supplier')) {
            supplierModalTitle.textContent = 'Edit Supplier';
            supplierIdField.value = supplier.id;
            supplierNameField.value = supplier.name;
            contactPersonField.value = supplier.contactPerson;
            supplierPhoneField.value = supplier.phone;
            supplierEmailField.value = supplier.email;
            supplierModal.style.display = 'block';
        } else if (target.classList.contains('btn-delete-supplier')) {
            showCustomConfirm(`Are you sure you want to delete supplier ${supplier.name}?`, 'Delete Supplier').then((confirmed) => {
                if (confirmed) {
                    suppliers = suppliers.filter(s => s.id !== supplierId);
                    renderSuppliers();
                    showAlert(`Supplier ${supplier.name} deleted successfully!`, 'success');
                }
            });
        }
    });

    // Staff Management Functionality
    const addStaffBtn = document.getElementById('addStaffBtn');
    const staffSearchInput = document.getElementById('staffSearch');
    const staffTableBody = document.querySelector('#staffTable tbody');

    const staffModal = document.getElementById('staffModal');
    const staffModalTitle = document.getElementById('staffModalTitle');
    const staffForm = document.getElementById('staffForm');
    const staffIdField = document.getElementById('staffId');
    const staffNameField = document.getElementById('staffName');
    const staffRoleField = document.getElementById('staffRole');
    const staffShiftField = document.getElementById('staffShift');
    const staffScheduleField = document.getElementById('staffSchedule');

    const assignShiftModal = document.getElementById('assignShiftModal');
    const assignShiftStaffNameSpan = document.getElementById('assignShiftStaffName');
    const assignShiftStaffIdField = document.getElementById('assignShiftStaffId');
    const newStaffShiftField = document.getElementById('newStaffShift');
    const newStaffScheduleField = document.getElementById('newStaffSchedule');
    const saveShiftAssignmentBtn = document.getElementById('saveShiftAssignmentBtn');

    const performanceModal = document.getElementById('performanceModal');
    const performanceStaffNameSpan = document.getElementById('performanceStaffName');
    const performanceOrdersHandledSpan = document.getElementById('performanceOrdersHandled');
    const performanceReviewsSpan = document.getElementById('performanceReviews');

    let staff = [
        { id: 1, name: 'Alex Chef', role: 'chef', shift: 'Morning', schedule: '8 AM - 4 PM', ordersHandled: 150, reviews: '⭐⭐⭐⭐' },
        { id: 2, name: 'Sara Waiter', role: 'waiter', shift: 'Evening', schedule: '4 PM - 12 AM', ordersHandled: 200, reviews: '⭐⭐⭐⭐⭐' },
        { id: 3, name: 'Mike Delivery', role: 'delivery', shift: 'Day', schedule: '9 AM - 5 PM', ordersHandled: 120, reviews: '⭐⭐⭐' },
        { id: 4, name: 'Emily Manager', role: 'manager', shift: 'Full-time', schedule: 'Mon-Fri', ordersHandled: 50, reviews: '⭐⭐⭐⭐⭐' }
    ];

    const renderStaff = (filter = '') => {
        staffTableBody.innerHTML = '';
        const filteredStaff = staff.filter(member =>
            member.name.toLowerCase().includes(filter.toLowerCase()) ||
            member.role.toLowerCase().includes(filter.toLowerCase()) ||
            member.shift.toLowerCase().includes(filter.toLowerCase())
        );

        filteredStaff.forEach(member => {
            const row = staffTableBody.insertRow();
            row.innerHTML = `
                <td>${member.id}</td>
                <td>${member.name}</td>
                <td>${member.role}</td>
                <td>${member.shift}</td>
                <td>${member.schedule}</td>
                <td>${member.ordersHandled}</td>
                <td>${member.reviews}</td>
                <td class="action-buttons">
                    <button class="btn-edit" data-id="${member.id}">Edit</button>
                    <button class="btn-delete" data-id="${member.id}">Delete</button>
                    <button class="btn-assign-shift" data-id="${member.id}">Assign Shift</button>
                    <button class="btn-view-performance" data-id="${member.id}">View Performance</button>
                </td>
            `;
        });
    };

    // Initial render of staff
    renderStaff();

    // Open Add Staff Modal
    addStaffBtn.addEventListener('click', () => {
        staffModalTitle.textContent = 'Add Staff';
        staffForm.reset();
        staffIdField.value = '';
        staffModal.style.display = 'block';
    });

    // Handle Add/Edit Staff Form Submission
    staffForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = staffIdField.value;
        const name = staffNameField.value;
        const role = staffRoleField.value;
        const shift = staffShiftField.value;
        const schedule = staffScheduleField.value;

        if (id) {
            // Edit existing staff
            const staffIndex = staff.findIndex(member => member.id == id);
            if (staffIndex > -1) {
                staff[staffIndex] = { ...staff[staffIndex], name, role, shift, schedule };
            }
        } else {
            // Add new staff
            const newId = staff.length > 0 ? Math.max(...staff.map(member => member.id)) + 1 : 1;
            staff.push({ id: newId, name, role, shift, schedule, ordersHandled: 0, reviews: '' });
        }
        renderStaff();
        staffModal.style.display = 'none';
    });

    // Handle Staff Table Actions (Edit, Delete, Assign Shift, View Performance)
    staffTableBody.addEventListener('click', (e) => {
        const target = e.target;
        const staffId = target.dataset.id;
        const member = staff.find(m => m.id == staffId);

        if (!member) return;

        if (target.classList.contains('btn-edit')) {
            staffModalTitle.textContent = 'Edit Staff';
            staffIdField.value = member.id;
            staffNameField.value = member.name;
            staffRoleField.value = member.role;
            staffShiftField.value = member.shift;
            staffScheduleField.value = member.schedule;
            staffModal.style.display = 'block';
        } else if (target.classList.contains('btn-delete')) {
            showCustomConfirm(`Are you sure you want to delete staff member ${member.name}?`, 'Delete Staff').then((confirmed) => {
                if (confirmed) {
                    staff = staff.filter(m => m.id != staffId);
                    renderStaff();
                    showAlert(`Staff member ${member.name} deleted successfully!`, 'success');
                }
            });
        } else if (target.classList.contains('btn-assign-shift')) {
            assignShiftStaffNameSpan.textContent = member.name;
            assignShiftStaffIdField.value = member.id;
            newStaffShiftField.value = member.shift;
            newStaffScheduleField.value = member.schedule;
            assignShiftModal.style.display = 'block';

            saveShiftAssignmentBtn.onclick = () => {
                member.shift = newStaffShiftField.value;
                member.schedule = newStaffScheduleField.value;
                showAlert(`Shift for ${member.name} updated.`, 'success');
                renderStaff();
                assignShiftModal.style.display = 'none';
            };
        } else if (target.classList.contains('btn-view-performance')) {
            performanceStaffNameSpan.textContent = member.name;
            performanceOrdersHandledSpan.textContent = member.ordersHandled;
            performanceReviewsSpan.textContent = member.reviews;
            performanceModal.style.display = 'block';
        }
    });

    // Staff Search Functionality
    staffSearchInput.addEventListener('keyup', (e) => {
        renderStaff(e.target.value);
    });

    // Close Staff Modals (reusing existing closeBtns)
    document.querySelectorAll('.modal .close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').style.display = 'none';
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target == staffModal) {
            staffModal.style.display = 'none';
        }
        if (event.target == assignShiftModal) {
            assignShiftModal.style.display = 'none';
        }
        if (event.target == performanceModal) {
            performanceModal.style.display = 'none';
        }
    });

    // Payment History Tabs Functionality
    const paymentHistoryTabs = document.querySelectorAll('.payment-history-tabs .tab-button');
    const paymentHistoryContent = document.getElementById('payment-history-content');

    const updatePaymentHistory = (type) => {
        let historyData = [];
        // Dummy data based on type
        switch (type) {
            case 'cash':
                historyData = [
                    { date: '2025-08-18', id: 'TXN001', amount: '$25.00', type: 'Cash', status: 'Completed' },
                    { date: '2025-08-17', id: 'TXN006', amount: '$15.00', type: 'Cash', status: 'Completed' },
                ];
                break;
            case 'card':
                historyData = [
                    { date: '2025-08-17', id: 'TXN002', amount: '$50.00', type: 'Card', status: 'Completed' },
                    { date: '2025-08-16', id: 'TXN007', amount: '$30.00', type: 'Card', status: 'Completed' },
                ];
                break;
            case 'online':
                historyData = [
                    { date: '2025-08-16', id: 'TXN003', amount: '$15.00', type: 'Online', status: 'Completed' },
                    { date: '2025-08-15', id: 'TXN008', amount: '$45.00', type: 'Online', status: 'Pending' },
                ];
                break;
            case 'paypal':
                historyData = [
                    { date: '2025-08-15', id: 'TXN009', amount: '$20.00', type: 'PayPal', status: 'Completed' },
                    { date: '2025-08-14', id: 'TXN010', amount: '$10.00', type: 'PayPal', status: 'Completed' },
                ];
                break;
            default:
                historyData = [];
        }

        let tableHtml = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Transaction ID</th>
                        <th>Amount</th>
                        <th>Type</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
        `;
        if (historyData.length > 0) {
            historyData.forEach(item => {
                tableHtml += `
                    <tr>
                        <td>${item.date}</td>
                        <td>${item.id}</td>
                        <td>${item.amount}</td>
                        <td>${item.type}</td>
                        <td>${item.status}</td>
                    </tr>
                `;
            });
        } else {
            tableHtml += `<tr><td colspan="5">No ${type} payment history found.</td></tr>`;
        }
        tableHtml += `
                </tbody>
            </table>
        `;
        paymentHistoryContent.innerHTML = tableHtml;
    };

    paymentHistoryTabs.forEach(button => {
        button.addEventListener('click', () => {
            paymentHistoryTabs.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const type = button.dataset.type;
            updatePaymentHistory(type);
        });
    });

    // Initialize with cash history
    updatePaymentHistory('cash');

    // Revenue Report Controls Functionality
    const reportPeriodSelect = document.getElementById('report-period');
    const reportDateDailyInput = document.getElementById('report-date-daily');
    const reportDateMonthlyInput = document.getElementById('report-date-monthly');
    const generateReportBtn = document.getElementById('generate-report-btn');
    const revenueReportContent = document.getElementById('revenue-report-content');

    reportPeriodSelect.addEventListener('change', () => {
        if (reportPeriodSelect.value === 'daily') {
            reportDateDailyInput.style.display = 'block';
            reportDateMonthlyInput.style.display = 'none';
        } else {
            reportDateDailyInput.style.display = 'none';
            reportDateMonthlyInput.style.display = 'block';
        }
    });

    generateReportBtn.addEventListener('click', () => {
        const period = reportPeriodSelect.value;
        let reportDate;
        if (period === 'daily') {
            reportDate = reportDateDailyInput.value;
        } else {
            reportDate = reportDateMonthlyInput.value;
        }

        // Dummy data for report
        const totalRevenue = (Math.random() * 5000 + 1000).toFixed(2);
        const cashSales = (totalRevenue * 0.3).toFixed(2);
        const cardSales = (totalRevenue * 0.4).toFixed(2);
        const onlineSales = (totalRevenue * 0.2).toFixed(2);
        const paypalSales = (totalRevenue * 0.1).toFixed(2);

        revenueReportContent.innerHTML = `
            <p>Revenue Report for ${reportDate} (${period}):</p>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Date/Period</th>
                        <th>Total Revenue</th>
                        <th>Cash Sales</th>
                        <th>Card Sales</th>
                        <th>Online Sales</th>
                        <th>PayPal Sales</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${reportDate}</td>
                        <td>$${totalRevenue}</td>
                        <td>$${cashSales}</td>
                        <td>$${cardSales}</td>
                        <td>$${onlineSales}</td>
                        <td>$${paypalSales}</td>
                    </tr>
                </tbody>
            </table>
        `;
    });

    // Refunds & Disputes and Tax Reports & Invoices (Placeholder for now)
    const addDisputeBtn = document.getElementById('add-dispute-btn');
    const generateTaxReportBtn = document.getElementById('generate-tax-report-btn');
    const generateInvoiceBtn = document.getElementById('generate-invoice-btn');

    addDisputeBtn.addEventListener('click', () => {
        showAlert('Add New Dispute functionality (to be implemented)', 'info');
    });

    generateTaxReportBtn.addEventListener('click', () => {
        const year = document.getElementById('tax-invoice-year').value;
        showAlert(`Generating Tax Report for year ${year} (to be implemented)`, 'info');
    });

    generateInvoiceBtn.addEventListener('click', () => {
        showAlert('Generating New Invoice functionality (to be implemented)', 'info');
    });

    // Marketing & Promotions Functionality
    // Discounts & Coupons
    const addDiscountBtn = document.getElementById('add-discount-btn');
    const discountSearchInput = document.getElementById('discount-search');
    const discountTableBody = document.querySelector('#marketing-promotions-section .section-card:nth-of-type(1) .data-table tbody');

    const discountModal = document.getElementById('discountModal');
    const discountModalTitle = document.getElementById('discountModalTitle');
    const discountForm = document.getElementById('discountForm');
    const discountIdField = document.getElementById('discountId');
    const discountCodeField = document.getElementById('discountCode');
    const discountTypeField = document.getElementById('discountType');
    const discountValueField = document.getElementById('discountValue');
    const discountExpiresField = document.getElementById('discountExpires');
    const discountStatusField = document.getElementById('discountStatus');

    let discounts = [
        { id: 1, code: 'SAVE10', type: 'percentage', value: '10%', expires: '2025-12-31', status: 'Active' },
        { id: 2, code: 'FREEDELIVERY', type: 'free_delivery', value: 'N/A', expires: '2025-10-31', status: 'Active' },
        { id: 3, code: 'SUMMER20', type: 'percentage', value: '20%', expires: '2025-09-15', status: 'Expired' }
    ];

    const renderDiscounts = (filter = '') => {
        discountTableBody.innerHTML = '';
        const filteredDiscounts = discounts.filter(discount =>
            discount.code.toLowerCase().includes(filter.toLowerCase()) ||
            discount.type.toLowerCase().includes(filter.toLowerCase()) ||
            discount.status.toLowerCase().includes(filter.toLowerCase())
        );

        filteredDiscounts.forEach(discount => {
            const row = discountTableBody.insertRow();
            row.innerHTML = `
                <td>${discount.code}</td>
                <td>${discount.type}</td>
                <td>${discount.value}</td>
                <td>${discount.expires}</td>
                <td>${discount.status}</td>
                <td>
                    <button class="btn-action edit-discount" data-id="${discount.id}"><i class="fas fa-edit"></i> Edit</button>
                    <button class="btn-action delete-discount" data-id="${discount.id}"><i class="fas fa-trash-alt"></i> Delete</button>
                </td>
            `;
        });
    };

    renderDiscounts();

    addDiscountBtn.addEventListener('click', () => {
        discountModalTitle.textContent = 'Add New Discount';
        discountForm.reset();
        discountIdField.value = '';
        discountModal.style.display = 'block';
    });

    discountForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = discountIdField.value;
        const code = discountCodeField.value;
        const type = discountTypeField.value;
        const value = discountValueField.value;
        const expires = discountExpiresField.value;
        const status = discountStatusField.value;

        if (id) {
            const discountIndex = discounts.findIndex(d => d.id == id);
            if (discountIndex > -1) {
                discounts[discountIndex] = { ...discounts[discountIndex], code, type, value, expires, status };
            }
        } else {
            const newId = discounts.length > 0 ? Math.max(...discounts.map(d => d.id)) + 1 : 1;
            discounts.push({ id: newId, code, type, value, expires, status });
        }
        renderDiscounts();
        discountModal.style.display = 'none';
        showAlert(`Discount ${code} saved successfully!`, 'success');
    });

    discountSearchInput.addEventListener('keyup', (e) => {
        renderDiscounts(e.target.value);
    });

    discountTableBody.addEventListener('click', (e) => {
        const target = e.target;
        const discountId = target.dataset.id;
        const discount = discounts.find(d => d.id == discountId);

        if (!discount) return;

        if (target.classList.contains('edit-discount')) {
            discountModalTitle.textContent = 'Edit Discount';
            discountIdField.value = discount.id;
            discountCodeField.value = discount.code;
            discountTypeField.value = discount.type;
            discountValueField.value = discount.value;
            discountExpiresField.value = discount.expires;
            discountStatusField.value = discount.status;
            discountModal.style.display = 'block';
        } else if (target.classList.contains('delete-discount')) {
            showCustomConfirm(`Are you sure you want to delete discount code: ${discount.code}?`, 'Delete Discount').then((confirmed) => {
                if (confirmed) {
                    discounts = discounts.filter(d => d.id !== discount.id);
                    renderDiscounts();
                    showAlert(`Discount code ${discount.code} deleted.`, 'success');
                }
            });
        }
    });

    // Happy Hours & Special Deals
    const addDealBtn = document.getElementById('add-deal-btn');
    const dealsTableBody = document.querySelector('#marketing-promotions-section .section-card:nth-of-type(2) .data-table tbody');

    const dealModal = document.getElementById('dealModal');
    const dealModalTitle = document.getElementById('dealModalTitle');
    const dealForm = document.getElementById('dealForm');
    const dealIdField = document.getElementById('dealId');
    const dealNameField = document.getElementById('dealName');
    const dealDescriptionField = document.getElementById('dealDescription');
    const dealPeriodField = document.getElementById('dealPeriod');
    const dealStatusField = document.getElementById('dealStatus');

    let deals = [
        { id: 1, name: 'Lunch Combo', description: 'Burger + Fries + Drink for $10', period: 'Mon-Fri, 12 PM - 3 PM', status: 'Active' },
        { id: 2, name: 'Happy Hour Pizza', description: '50% off all pizzas', period: 'Daily, 5 PM - 7 PM', status: 'Active' }
    ];

    const renderDeals = () => {
        dealsTableBody.innerHTML = '';
        deals.forEach(deal => {
            const row = dealsTableBody.insertRow();
            row.innerHTML = `
                <td>${deal.name}</td>
                <td>${deal.description}</td>
                <td>${deal.period}</td>
                <td>${deal.status}</td>
                <td>
                    <button class="btn-action edit-deal" data-id="${deal.id}"><i class="fas fa-edit"></i> Edit</button>
                    <button class="btn-action delete-deal" data-id="${deal.id}"><i class="fas fa-trash-alt"></i> Delete</button>
                </td>
            `;
        });
    };

    renderDeals();

    addDealBtn.addEventListener('click', () => {
        dealModalTitle.textContent = 'Add New Deal';
        dealForm.reset();
        dealIdField.value = '';
        dealModal.style.display = 'block';
    });

    dealForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = dealIdField.value;
        const name = dealNameField.value;
        const description = dealDescriptionField.value;
        const period = dealPeriodField.value;
        const status = dealStatusField.value;

        if (id) {
            const dealIndex = deals.findIndex(d => d.id == id);
            if (dealIndex > -1) {
                deals[dealIndex] = { ...deals[dealIndex], name, description, period, status };
            }
        } else {
            const newId = deals.length > 0 ? Math.max(...deals.map(d => d.id)) + 1 : 1;
            deals.push({ id: newId, name, description, period, status });
        }
        renderDeals();
        dealModal.style.display = 'none';
        showAlert(`Deal ${name} saved successfully!`, 'success');
    });

    dealsTableBody.addEventListener('click', (e) => {
        const target = e.target;
        const dealId = target.dataset.id;
        const deal = deals.find(d => d.id == dealId);

        if (!deal) return;

        if (target.classList.contains('edit-deal')) {
            dealModalTitle.textContent = 'Edit Deal';
            dealIdField.value = deal.id;
            dealNameField.value = deal.name;
            dealDescriptionField.value = deal.description;
            dealPeriodField.value = deal.period;
            dealStatusField.value = deal.status;
            dealModal.style.display = 'block';
        } else if (target.classList.contains('delete-deal')) {
            showCustomConfirm(`Are you sure you want to delete deal: ${deal.name}?`, 'Delete Deal').then((confirmed) => {
                if (confirmed) {
                    deals = deals.filter(d => d.id !== deal.id);
                    renderDeals();
                    showAlert(`Deal ${deal.name} deleted.`, 'success');
                }
            });
        }
    });

    // Email/SMS Campaigns & Push Notifications
    const createCampaignBtn = document.getElementById('create-campaign-btn');
    const sendNotificationBtn = document.getElementById('send-notification-btn');
    const campaignsTableBody = document.querySelector('#marketing-promotions-section .section-card:nth-of-type(3) .data-table tbody');

    const campaignModal = document.getElementById('campaignModal');
    const campaignModalTitle = document.getElementById('campaignModalTitle');
    const campaignForm = document.getElementById('campaignForm');
    const campaignIdField = document.getElementById('campaignId');
    const campaignNameField = document.getElementById('campaignName');
    const campaignTypeField = document.getElementById('campaignType');
    const campaignContentField = document.getElementById('campaignContent');

    const pushNotificationModal = document.getElementById('pushNotificationModal');
    const pushNotificationForm = document.getElementById('pushNotificationForm');
    const notificationTitleField = document.getElementById('notificationTitle');
    const notificationMessageField = document.getElementById('notificationMessage');

    let campaigns = [
        { id: 1, name: 'Summer Sale', type: 'Email', dateSent: '2025-07-01', status: 'Sent' },
        { id: 2, name: 'New Menu Launch', type: 'SMS', dateSent: '2025-08-10', status: 'Sent' }
    ];

    const renderCampaigns = () => {
        campaignsTableBody.innerHTML = '';
        campaigns.forEach(campaign => {
            const row = campaignsTableBody.insertRow();
            row.innerHTML = `
                <td>${campaign.name}</td>
                <td>${campaign.type}</td>
                <td>${campaign.dateSent}</td>
                <td>${campaign.status}</td>
                <td><button class="btn-action view-report" data-id="${campaign.id}"><i class="fas fa-chart-bar"></i> View Report</button></td>
            `;
        });
    };

    renderCampaigns();

    createCampaignBtn.addEventListener('click', () => {
        campaignModalTitle.textContent = 'Create New Campaign';
        campaignForm.reset();
        campaignIdField.value = '';
        campaignModal.style.display = 'block';
    });

    campaignForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = campaignIdField.value;
        const name = campaignNameField.value;
        const type = campaignTypeField.value;
        const content = campaignContentField.value;
        const dateSent = new Date().toISOString().slice(0, 10); // Current date
        const status = 'Sent'; // Assuming it's sent upon creation

        if (id) {
            const campaignIndex = campaigns.findIndex(c => c.id == id);
            if (campaignIndex > -1) {
                campaigns[campaignIndex] = { ...campaigns[campaignIndex], name, type, dateSent, status };
            }
        } else {
            const newId = campaigns.length > 0 ? Math.max(...campaigns.map(c => c.id)) + 1 : 1;
            campaigns.push({ id: newId, name, type, dateSent, status });
        }
        renderCampaigns();
        campaignModal.style.display = 'none';
        showAlert(`Campaign "${name}" created and sent!`, 'success');
    });

    sendNotificationBtn.addEventListener('click', () => {
        pushNotificationForm.reset();
        pushNotificationModal.style.display = 'block';
    });

    pushNotificationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = notificationTitleField.value;
        const message = notificationMessageField.value;
        showAlert(`Push Notification Sent! Title: ${title}, Message: ${message}`, 'success');
        pushNotificationModal.style.display = 'none';
    });

    campaignsTableBody.addEventListener('click', (e) => {
        const target = e.target;
        const campaignId = target.dataset.id;
        const campaign = campaigns.find(c => c.id == campaignId);

        if (!campaign) return;

        if (target.classList.contains('view-report')) {
            showAlert(`Viewing report for campaign: ${campaign.name} (to be implemented)`, 'info');
        }
    });

    // Close all new modals
    document.querySelectorAll('#marketing-promotions-section .modal .close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').style.display = 'none';
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target == discountModal) {
            discountModal.style.display = 'none';
        }
        if (event.target == dealModal) {
            dealModal.style.display = 'none';
        }
        if (event.target == campaignModal) {
            campaignModal.style.display = 'none';
        }
        if (event.target == pushNotificationModal) {
            pushNotificationModal.style.display = 'none';
        }
    });
});