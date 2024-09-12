overloadSubmit();

function loadGames()
{
    // bomberman
    if (document.getElementById("game"))
    {
        gameInit();
    }

    // pong
    if (document.getElementById("gameBoard"))
    {
        gameInitPong();
    }
}

function overloadSubmit()
{
    forms = document.querySelectorAll("#content form");
    for (let i = 0; i < forms.length; i++)
    {
        forms[i].addEventListener('submit', function(event) {
            event.preventDefault();
            const form = event.target; // represents the form that triggered the event.
            const formData = new FormData(form); // Extract the datas of the form to FormData object.
            changePage(form.action, formData);
        });
    }
}

function changePage(page, formData=null, byArrow=false)
{
    fetch(page, {
        method: 'POST',
        body: formData,
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRFToken': getCookie('csrftoken')
        }
    })
    .then(response => response.json()) //conversion of the response to JSON

    .then(data => { // data represents the JSON object returned by the server
        const messagesDiv = document.getElementById('error_messages');
        if (messagesDiv)
            messagesDiv.innerHTML = '';

        if (data.success)
        {
            document.getElementById('content').innerHTML = data.html_data;
            if (!byArrow)
            {
                if (window.location.pathname !== page)
                {
                    if (!history.state || !(page.endsWith(history.state.section) && history.state.section != "/"))
                        history.pushState({ section: page }, "", page);
                }
            }
            if (document.getElementById("playersList"))
                initPlayerInput();
        }
        else if (messagesDiv)
        {
            messagesDiv.innerHTML = `<div class="alert alert-danger">${data.message}</div>`;
        }
        overloadSubmit();
        loadGames();
        initValues();
    })
    .catch(error => console.error('Error:', error));
}

window.onpopstate = function (event)
{
    if (event.state)
        changePage(event.state.section, null, true);
}

history.pushState({section: window.location.pathname}, "", window.location.pathname);

let interval = window.setInterval(ping, 20000);

// function ping()
// {
//     fetch(window.location.pathname, {
//         method: 'PUT',
//         headers: {
//             'X-Requested-With': 'XMLHttpRequest',
//             'X-CSRFToken': getCookie('csrftoken')
//         }
//     })
// }

async function ping() {
    try {
        const response = await fetch(window.location.pathname, {
            method: 'PUT',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': getCookie('csrftoken')
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error occurred:', error.message);
        // Handle different types of errors
        if (error instanceof Error) {
            // Network error or server error
            showErrorMessage('An error occurred. Please try again.');
        } else if (error.message === 'HTTP error! status: 500') {
            // Specific handling for 500 error
            showErrorMessage('Server error occurred. Please contact support.');
        }
        return null;
    }
}
