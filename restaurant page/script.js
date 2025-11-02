const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('nav ul');


navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('is-active');
    navMenu.classList.toggle('active');
});


const tabButtons = document.querySelectorAll('.menu-tabs button');
const tabContents = document.querySelectorAll('.menu-tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        button.classList.add('active');

        const targetTab = button.dataset.tab;
        const targetContent = document.getElementById(targetTab);

        if (targetContent){
            targetContent.classList.add('active');
        }
    })
})


const sections = document.querySelectorAll('.hidden-section');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show-section');
        }
    });
}, {
    threshold: 0.15 // Trigger when 15% of the section is visible
});

sections.forEach(section => {
    observer.observe(section);
});


// --- 4. Testimonial Carousel ---

// Select all the necessary elements
const track = document.querySelector('.testimonial-track');
const slides = Array.from(track.children);
const nextButton = document.querySelector('.next-btn');
const prevButton = document.querySelector('.prev-btn');

// We need to know the width of a single slide
// We use getBoundingClientRect() for a precise width
const slideWidth = slides[0].getBoundingClientRect().width;

// State variable to keep track of our position
let currentIndex = 0;

// 1. Function to move the track
const moveToSlide = (targetIndex) => {
    // Calculate the new transform position
    const amountToMove = targetIndex * slideWidth;
    track.style.transform = 'translateX(-' + amountToMove + 'px)';
    
    // Update the current index
    currentIndex = targetIndex;
}

// 2. Event listener for the NEXT button
nextButton.addEventListener('click', e => {
    let nextIndex = currentIndex + 1;
    
    // Loop back to the beginning if at the end
    if (nextIndex > slides.length - 1) {
        nextIndex = 0; 
    }
    
    moveToSlide(nextIndex);
});

// 3. Event listener for the PREV button
prevButton.addEventListener('click', e => {
    let prevIndex = currentIndex - 1;
    
    // Loop to the end if at the beginning
    if (prevIndex < 0) {
        prevIndex = slides.length - 1;
    }
    
    moveToSlide(prevIndex);
});

// 4. (Optional but good) Recalculate on window resize
// This ensures it doesn't break if the user resizes their browser
window.addEventListener('resize', () => {
    // Get the new width
    const newSlideWidth = slides[0].getBoundingClientRect().width;
    // Move the track to the correct position based on the new width
    const amountToMove = currentIndex * newSlideWidth;
    track.style.transition = 'none'; // Temporarily disable transition
    track.style.transform = 'translateX(-' + amountToMove + 'px)';
    
    // Re-enable transition after a tiny delay
    setTimeout(() => {
        track.style.transition = 'transform 0.5s ease-in-out';
    }, 10);
});