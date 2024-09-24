$(document).ready(function() {
	$('#change-username-form').on('submit', function(e) {
		e.preventDefault();
		var form = $(this);
		$.ajax({
			type: 'POST',
			url: "/profiles/modif_username/",
			data: form.serialize(),
			success: function(response) {
				if (response.success) {
					$('#changeUsernameModal').modal('hide');
                    reloadUserInfo();
				} else {
					var errors = response.errors;
					var errorHtml = '<ul>';
					for (var field in errors) {
						for (var error of errors[field]) {
							errorHtml += '<div class="alert alert-danger">' + error + '</div>';
						}
					}
					errorHtml += '</ul>';
					$('#form-errors').html(errorHtml);
				}
			}
		});
	});

	$('#change-avatar-form').on('submit', function(e) {
		e.preventDefault();
		var form = $(this);
		var formData = new FormData(form[0]);
		$.ajax({
			type: 'POST',
			url: "/profiles/modif_picture/",
			data: formData,
			processData: false,
			contentType: false,
			success: function(response) {
				if (response.success) {
					$('#changeAvatarModal').modal('hide');
                    reloadUserInfo();
				} else {
					var errors = JSON.parse(response.errors);
					var errorHtml = '<ul>';
					for (var field in errors) {
						for (var error of errors[field]) {
							errorHtml += '<div class="alert alert-danger">' + error + '</div>';
						}
					}
					errorHtml += '</ul>';
					$('#form-errors').html(errorHtml);
				}
			},
			error: function(xhr, status, error) {
				console.error('AJAX Error:', status, error);
			}
		});
	});
});

function loadProfile() {
	fetch("/profiles/profile/", {
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
		} else {
			console.error('No HTML returned');
		}
	})
	.catch(error => console.error('Error:', error));
}

function reloadUserInfo() {
    $.ajax({
        type: 'GET',
        url: "/profiles/userinfo/?fromJS=true",
        success: function(response) {
            document.querySelectorAll('.user-infos').forEach(function (element) {
                var section = element.getAttribute('data-user-section');

                var textElement = element.querySelector('.neon-text');
                if (textElement) {
                    textElement.textContent = response.username;
                }

                var imgElement = element.querySelector('img');
                if (imgElement) {
                    if (section === 'profile') {
                        imgElement.src = response.profileImgUrl || '/media/images/default.png';
                        imgElement.width = 90;
                        imgElement.height = 90;
                    } else if (section === 'friends') {
                        imgElement.src = response.profileImgUrl || '/media/images/default.png';
                        imgElement.width = 150;
                        imgElement.height = 150;
                    } else {
                        imgElement.src = response.profileImgUrl || '/media/images/default.png';
                        imgElement.width = 70;
                        imgElement.height = 70;
                    }
                }
            });
        },
        error: function(xhr, status, error) {
            console.error('Error reloading user info:', error);
        }
    });
}


// This function retrieves the value of a specific cookie stored in the browser.
function getCookie(name) {
    let cookieValue = null;

    // Check if the document has cookies and if they are not empty.
    if (document.cookie && document.cookie !== '') {
        // Split the cookies string into individual cookies.
        const cookies = document.cookie.split(';');

        // Loop through each cookie.
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                // Decode and store the cookie's value.
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken');

// Set up AJAX requests to include the CSRF token in the request headers.
// Ensure that the request is from the user that is currently logged in.
$.ajaxSetup({
    // This function is called before every AJAX request is sent.
    beforeSend: function(xhr, settings) {
        if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
            // Add the CSRF token to the request header
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});


