import * as helper from './helper.js';

(() => {
    const ELEMENTS = {
        html_text_area: document.getElementById('html-area'),
        show_courses_button: document.getElementById('show-courses'),
        calculate_gpa_button: document.createElement('button'),
        grades_selector_div: document.createElement('div'),
        calculated_gpa_area: document.createElement('p')
    };
    Object.freeze(ELEMENTS);

    const calculate_and_print_gpa = (courses_with_selectors) => {
        const gpa = helper.get_gpa_from_selectors(courses_with_selectors);
        ELEMENTS.calculated_gpa_area.innerHTML = `Your GPA is: ${gpa}`;
    };

    const populate_selectors_div = (grades_selectors_div, courses_with_selectors, _document) => {
        courses_with_selectors.map((course) => {
            const parent_div = _document.createElement('div');
            const selector_div = _document.createElement('div');
            const course_name_div = _document.createElement('div');
            course_name_div.innerHTML = course.name;

            selector_div.appendChild(course.grade_selector);
            parent_div.appendChild(course_name_div);
            parent_div.appendChild(selector_div);

            parent_div.setAttribute('style', helper.COURSE_DIV_STYLE);
            grades_selectors_div.appendChild(parent_div);
        });
    };

    const clear = () => {
        ELEMENTS.grades_selector_div.innerHTML = '';
        ELEMENTS.grades_selector_div.remove();
    }

    ELEMENTS.show_courses_button.addEventListener('click', () => {
        clear();
        const scraping_div = document.createElement('div');
        scraping_div.innerHTML = ELEMENTS.html_text_area.value;
        const courses = helper.get_courses_from_html(scraping_div);
        if (courses.length === 0) {
            return alert('Invalid HTML');
        }
        const courses_with_selectors = helper.create_courses_with_selectors(courses, document);
        populate_selectors_div(ELEMENTS.grades_selector_div, courses_with_selectors, document);
        document.body.appendChild(ELEMENTS.grades_selector_div);

        ELEMENTS.calculate_gpa_button.innerHTML = 'Calculate GPA';
        ELEMENTS.calculate_gpa_button.addEventListener('click', () =>
            calculate_and_print_gpa(courses_with_selectors)
        );
        ELEMENTS.grades_selector_div.appendChild(ELEMENTS.calculate_gpa_button);
        ELEMENTS.grades_selector_div.appendChild(ELEMENTS.calculated_gpa_area);
    });
})();
