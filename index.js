import * as helper from './helper.js';

(() => {
    const ELEMENTS = {
        html_text_area: document.getElementById('html-area'),
        show_courses_button: document.getElementById('show-courses'),
        grades_selector_div: document.createElement('div')
    };
    Object.freeze(ELEMENTS);

    ELEMENTS.html_text_area.value = localStorage.getItem(helper.STORED_HTML_NAME) || '';

    const calculate_and_print_gpa = (courses_with_selectors, gpa_paragraph) => {
        const gpa = helper.get_gpa_from_selectors(courses_with_selectors);
        gpa_paragraph.innerHTML = `Your GPA is: ${gpa}`;
    };

    const add_selectors_to_div = (grades_selectors_div, courses_with_selectors) => {
        courses_with_selectors.map((course) => {
            const parent_div = document.createElement('div');
            const selector_div = document.createElement('div');
            const course_name_div = document.createElement('div');
            course_name_div.innerHTML = course.name;

            selector_div.appendChild(course.grade_selector);
            parent_div.appendChild(course_name_div);
            parent_div.appendChild(selector_div);

            parent_div.setAttribute('style', helper.COURSE_DIV_STYLE);
            grades_selectors_div.appendChild(parent_div);
        });
    };

    const make_selectors_responsive = (courses_with_selectors, gpa_paragraph) => {
        courses_with_selectors.map((course) => {
            course.grade_selector.addEventListener('change', () =>
                calculate_and_print_gpa(courses_with_selectors, gpa_paragraph)
            );
        });
    };

    const clear = () => {
        ELEMENTS.grades_selector_div.innerHTML = '';
        ELEMENTS.grades_selector_div.remove();
    };

    ELEMENTS.show_courses_button.addEventListener('click', () => {
        clear();
        const scraping_div = document.createElement('div');
        scraping_div.innerHTML = ELEMENTS.html_text_area.value;
        const courses = helper.get_courses_from_html(scraping_div);
        if (courses.length === 0) {
            return alert('Invalid HTML');
        }

        const courses_with_selectors = helper.create_courses_with_selectors(courses, document);
        add_selectors_to_div(ELEMENTS.grades_selector_div, courses_with_selectors);
        const gpa_paragraph = document.createElement('p');
        ELEMENTS.grades_selector_div.appendChild(gpa_paragraph);

        make_selectors_responsive(courses_with_selectors, gpa_paragraph);

        calculate_and_print_gpa(courses_with_selectors, gpa_paragraph);
        localStorage.setItem(helper.STORED_HTML_NAME, ELEMENTS.html_text_area.value);

        document.body.appendChild(ELEMENTS.grades_selector_div);
    });
})();
