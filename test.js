document.addEventListener('DOMContentLoaded', function () {
    const burgerMenu = document.getElementById('burger-menu');
    const menuItems = document.getElementById('menu-items');

    burgerMenu.addEventListener('click', function () {
        menuItems.classList.toggle('active');
    });
});

// Targeting the parent element
const blogContainer = document.querySelector('.blog__container');
const blogModal = document.querySelector(".blog__modal__body");

// Global store
let globalStore = [];

// Function to create a new card
const newCard = ({
    id,
    imageUrl,
    blogTitle,
    blogLocation,
    blogCity,
    blogMessage
}) => `
<div class="col-lg-4 col-md-6" id=${id}>
    <div class="card m-2">
        <div class="card-header d-flex justify-content-end gap-2">
            <button type="button" class="btn btn-outline-success" id="${id}" onclick="editCard.apply(this, arguments)"><i class="fas fa-pencil-alt" id="${id}" onclick="editCard.apply(this, arguments)"></i></button>
            <button type="button" class="btn btn-outline-danger" id="${id}" onclick="deleteCard.apply(this, arguments)"><i class="fas fa-trash-alt" id="${id}" onclick="deleteCard.apply(this, arguments)"></i></button>
        </div>
        <img src=${imageUrl} class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title">${blogTitle}</h5>
            <p class="card-text">${blogMessage}</p>
            <span class="badge bg-primary">${blogLocation}</span>
            <span class="badge bg-secondary">${blogCity}</span>
        </div>
        <div class="card-footer text-muted">
            <button type="button" id="${id}" class="btn btn-outline-primary float-end" data-bs-toggle="modal" data-bs-target="#showblog" onclick="openBlog.apply(this, arguments)">Open Blog</button>
        </div>
    </div>
</div>`;

// Function to load data
const loadData = () => {
    const getInitialData = localStorage.blog;
    if (!getInitialData) return;

    const { cards } = JSON.parse(getInitialData);

    cards.map((blogObject) => {
        const createNewBlog = newCard(blogObject);
        blogContainer.insertAdjacentHTML("beforeend", createNewBlog);
        globalStore.push(blogObject);
    });
};

const updateLocalStorage = () => {
    localStorage.setItem("blog", JSON.stringify({ cards: globalStore }));
}

// Function to save changes
const saveChanges = () => {
    const imageInput = document.getElementById('imagefile').files[0];
    const reader = new FileReader();

    reader.onload = () => {
        const blogData = {
            id: `${Date.now()}`,
            imageUrl: reader.result,
            blogTitle: document.getElementById('title').value,
            blogLocation: document.getElementById('location').value,
            blogCity: document.getElementById('city').value,
            blogMessage: document.getElementById('message').value
        };

        const createNewBlog = newCard(blogData);
        blogContainer.insertAdjacentHTML("beforeend", createNewBlog);

        globalStore.push(blogData);
        updateLocalStorage();
    };

    if (imageInput) {
        reader.readAsDataURL(imageInput);
    } else {
        alert('Please upload an image.');
    }
};

// Function to delete a card
const deleteCard = (event) => {
    event = window.event;
    const targetID = event.target.id;
    const tagname = event.target.tagName;

    globalStore = globalStore.filter((blogObject) => blogObject.id !== targetID);
    updateLocalStorage();

    if (tagname === "BUTTON") {
        return blogContainer.removeChild(event.target.parentNode.parentNode.parentNode);
    }

    return blogContainer.removeChild(event.target.parentNode.parentNode.parentNode.parentNode);
};

// Function to edit a card
const editCard = (event) => {
    event = window.event;
    const targetID = event.target.id;
    const tagname = event.target.tagName;

    let parentElement;
    if (tagname === "BUTTON") {
        parentElement = event.target.parentNode.parentNode;
    } else {
        parentElement = event.target.parentNode.parentNode.parentNode;
    }

    let blogTitle = parentElement.childNodes[5].childNodes[1];
    let blogMessage = parentElement.childNodes[5].childNodes[3];
    let blogLocation = parentElement.childNodes[5].childNodes[5];
    let blogCity = parentElement.childNodes[5].childNodes[7];
    let submitBtn = parentElement.childNodes[7].childNodes[1];

    blogTitle.setAttribute("contenteditable", "true");
    blogMessage.setAttribute("contenteditable", "true");
    blogLocation.setAttribute("contenteditable", "true");
    blogCity.setAttribute("contenteditable", "true");
    submitBtn.setAttribute("onclick", "saveEditChanges.apply(this, arguments)");
    submitBtn.innerHTML = "Save Changes";

    submitBtn.removeAttribute("data-bs-toggle");
    submitBtn.removeAttribute("data-bs-target");
}

const saveEditChanges = (event) => {
    event = window.event;
    const targetID = event.target.id;
    const tagname = event.target.tagName;

    let parentElement;
    if (tagname === "BUTTON") {
        parentElement = event.target.parentNode.parentNode;
    } else {
        parentElement = event.target.parentNode.parentNode.parentNode;
    }

    let blogTitle = parentElement.childNodes[5].childNodes[1];
    let blogMessage = parentElement.childNodes[5].childNodes[3];
    let blogLocation = parentElement.childNodes[5].childNodes[5];
    let blogCity = parentElement.childNodes[5].childNodes[7];
    let submitBtn = parentElement.childNodes[7].childNodes[1];

    const updatedData = {
        blogTitle: blogTitle.innerHTML,
        blogMessage: blogMessage.innerHTML,
        blogLocation: blogLocation.innerHTML,
        blogCity: blogCity.innerHTML
    }

    globalStore = globalStore.map((blog) => {
        if (blog.id === targetID) {
            return {
                id: blog.id,
                imageUrl: blog.imageUrl,
                blogTitle: updatedData.blogTitle,
                blogLocation: updatedData.blogLocation,
                blogCity: updatedData.blogCity,
                blogMessage: updatedData.blogMessage,
            };
        }
        return blog;
    });

    updateLocalStorage();

    blogTitle.setAttribute("contenteditable", "false");
    blogMessage.setAttribute("contenteditable", "false");
    blogLocation.setAttribute("contenteditable", "false");
    blogCity.setAttribute("contenteditable", "false");

    submitBtn.setAttribute("onclick", "openBlog.apply(this, arguments)");
    submitBtn.setAttribute("data-bs-toggle", "modal");
    submitBtn.setAttribute("data-bs-target", "#showblog");
    submitBtn.innerHTML = "Open Blog";
}

const htmlModalContent = ({
    id,
    blogTitle,
    blogMessage,
    imageUrl,
    blogLocation,
    blogCity
}) => {
    const date = new Date(parseInt(id));
    return `
    <div id=${id}>
        <img src=${imageUrl} alt="bg image" class="img-fluid place__holder__image mb-3 p-4">
        <div class="text-sm text-muted">Created on ${date.toDateString()}</div>
        <h2 class="my-5 mt-5" style="display:inline;">${blogTitle}</h2>
        <span class="badge bg-primary">${blogLocation}</span>
        <span class="badge bg-secondary">${blogCity}</span>
        <p class="lead mt-2">${blogMessage}</p>
    </div>`;
};

const openBlog = (event) => {
    event = window.event;
    const targetID = event.target.id;

    const getBlog = globalStore.filter(({ id }) => id === targetID);
    blogModal.innerHTML = htmlModalContent(getBlog[0]);
};

// Function to get location
const getLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
};

const showPosition = (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    document.getElementById('location').value = `Latitude: ${lat}, Longitude: ${lon}`;
};

const showError = (error) => {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
};