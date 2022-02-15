import * as helper from './helper.js';

(() => {
    const elements = {
        html_text_area: document.getElementById('html-area'),
        show_courses_button: document.getElementById('show-courses')
    };
    Object.freeze(elements);

    elements.show_courses_button.addEventListener('click', () => {
        const scraping_div = document.createElement('div');
        scraping_div.innerHTML = elements.html_text_area.value;
        const courses = helper.get_courses_from_html(scraping_div);
        if (courses.length === 0) {
            return alert('Invalid HTML');
        }
        const courses_with_selectors = helper.create_courses_with_selectors(courses, document);
        const grades_selector_div = helper.create_selectors_div(courses_with_selectors, document);
        document.body.appendChild(grades_selector_div);
    });
})();
