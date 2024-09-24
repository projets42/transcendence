window.onload = function() {
    const canvas = document.getElementById('particlesCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray = [];
    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 1 + 1;
            this.speedX = Math.random() * 1 - 1;
            this.speedY = Math.random() * 1 - 1;
            this.color = 'rgba(255, 236, 0, 1)';
            this.opacity = 1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.size > 0.2) this.size -= 0.1;
            this.opacity -= 0.01;
        }
        draw() {
            ctx.fillStyle = this.color.replace('1', this.opacity.toFixed(2));
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
    }

    function handleParticles() {
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();

            // Eliminate particles that have become too small or transparent
            if (particlesArray[i].size <= 0.2 || particlesArray[i].opacity <= 0) {
                particlesArray.splice(i, 1);
                i--;
            }
        }
    }

    const playButton = document.getElementById('play-button-active');
    let sparklesInterval;

    if (playButton) {
        playButton.addEventListener('mouseover', () => {
            sparklesInterval = setInterval(generateSparkles, 50);
        });

        playButton.addEventListener('mouseout', () => {
            clearInterval(sparklesInterval);
        });
    }

    function generateSparkles() {
        const rect = playButton.getBoundingClientRect();
        for (let i = 0; i < 5; i++) {
            const x = rect.left + Math.random() * rect.width;
            const y = rect.top + Math.random() * rect.height;
            particlesArray.push(new Particle(x, y));
        }
    }

    const cursor = document.querySelector('.cursor');
    let timer;

    function moveCursor(e) {
        cursor.classList.add('is-moving');
        cursor.style.left = `${e.pageX}px`;
        cursor.style.top = `${e.pageY}px`;

        // Check if cursor is on interactive element
        if (e.target.matches('button, input, a')) {
            cursor.classList.add('shrink');
        } else {
            cursor.classList.remove('shrink');
        }

        clearTimeout(timer);

        timer = setTimeout(function() {
            cursor.classList.remove('is-moving');
        }, 300);
    }

    document.addEventListener('mousemove', moveCursor);

    // Draw cursor and particles
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        handleParticles();
        requestAnimationFrame(draw);
    }

    draw();
}

function toggleSignupModal() {
    $('#signupModal').modal('toggle');
	const lang = document.getElementById('language').value;
	changeLanguage(lang);
}

$(document).ready(function () {
    $('.close').click(function () {
        $('#signupModal').modal('hide');
    });

    // Closes the modal when clicking outside of it
    $(window).click(function (event) {
        if ($(event.target).hasClass('modal')) {
            $('#signupModal').modal('hide');
        }
    });
});
