function toggleSidebar() {
	$('#sidebar').toggleClass('show');
    loadProfile();
}

function toggleLoginForm() {
	$('#sidebar').toggleClass('show');
    loadSidebar();
}
function hideLoginForm() {
	$('#sidebar').removeClass('show');
}

// selects the form located in the element with the 'sidebar' ID.
function handleFormSubmit(event) {
	event.preventDefault();

	const form = event.target; // represents the form that triggered the event.
	const formData = new FormData(form); // Extract the datas of the form to FormData object.

	// console.log(formData) // inspect data sent to the server.

	/*
		fetch is a JavaScript function used to make asynchronous HTTP requests (like AJAX).
		'form.action' corresponds to the URL where the data is to be sent.
		'POST' is typical for sending data to the server.
		'body: formData' sends the form data to server
	*/
	fetch(form.action, {
		method: 'POST',
		body: formData,
		headers: {
			'X-Requested-With': 'XMLHttpRequest',
			'X-CSRFToken': getCookie('csrftoken')
		}
	})
	.then(response => response.json()) //conversion of the response to JSON

	// data represents the JSON object returned by the server.
	.then(data => {
		//console.log(data) // see the structure of the data returned by the server.
		const messagesDiv = document.getElementById('error_messages');
		messagesDiv.innerHTML = '';

		if (data.success) {
            updateCSRFToken(data.csrf_token);

			// Close the sidebar
			hideLoginForm();

			// Update interface. The contents of #header-links and #sidebar are updated with the HTML returned by the server.
			document.getElementById('header-links').innerHTML = data.header_html;
			document.getElementById('sidebar').innerHTML = data.sidebar_html;
			document.getElementById('main-content').innerHTML = `<form method="get"><button id="play-button-active" type="button" onclick="changePage('/play/')">PLAY</button></form>`;

			const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
			const languageSelector = document.getElementById('language');
			if (languageSelector) {
				languageSelector.value = savedLanguage;
			}
			changeLanguage(savedLanguage);

			attachEventListeners();
        } else {
			messagesDiv.innerHTML = `<div class="alert alert-danger">${data.message}</div>`;
		}
	})
	.catch(error => console.error('Error:', error));
}

function loadSidebar() {
    fetch("/sidebar/", {
        method: 'GET',
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.html) {
            document.getElementById('sidebar').innerHTML = data.html;
			const lang = document.getElementById('language').value;
    		changeLanguage(lang);
            attachEventListeners();
        } else {
            console.error('No HTML returned');
        }
    })
    .catch(error => console.error('Error:', error));
}

function logoutUser() {
    fetch('/profiles/logout/', {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRFToken': getCookie('csrftoken')
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('header-links').innerHTML = data.header_html;
            document.getElementById('sidebar').innerHTML = data.sidebar_html;
            document.getElementById('main-content').innerHTML = `<input id="play-button" type="button" value="PLAY" onclick="toggleLoginForm()">`;

            hideLoginForm();

			const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
			const languageSelector = document.getElementById('language');
			if (languageSelector) {
				languageSelector.value = savedLanguage;
			}
			changeLanguage(savedLanguage);

            attachEventListeners();
        }
    })
    .catch(error => console.error('Error:', error));
}

function attachEventListeners() {
    const form = document.querySelector('#sidebar form');
    if (form) {
        // Removes any existing 'submit' event listener from the form to prevent duplicates.
        form.removeEventListener('submit', handleFormSubmit);
        // Attaches the 'submit' event listener to handle form submissions.
        form.addEventListener('submit', handleFormSubmit);
    }

    const userInfoElement = document.querySelector('#user-info');
    if (userInfoElement) {
        userInfoElement.removeEventListener('click', toggleSidebar);
        userInfoElement.addEventListener('click', toggleSidebar);
    }
}

function updateCSRFToken(newToken) {
    document.querySelectorAll('input[name="csrfmiddlewaretoken"]').forEach(function(input) {
        // Updates the value of each CSRF token in the form inputs.
        input.value = newToken;
    });

    // Updates the global CSRF token value, stored for later use in AJAX requests.
    window.CSRF_TOKEN = newToken;
}

// Initial call to attach event listeners
attachEventListeners();
