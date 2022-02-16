export const COURSE_DIV_STYLE = `
    margin: 1.5rem 0;
`;
export const STORED_HTML_NAME = 'courses_html'
const FIRST_COURSE_INDEX = 1;
const COURSE_NAME_INDEX = 1;
const COURSE_HOURS_PARAGRAPH_INDEX = 3;
const COURSE_GRADE_PARAGRAPH_INDEX = 6;
const INITIAL_POINTS = 0;
const INITIAL_HOURS = 0;
const GRADE_LETTERS = ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F'];
const GRADE_POINTS = [4, 3.7, 3.3, 3, 2.7, 2.4, 2.2, 2, 0];
Object.freeze(GRADE_LETTERS);
Object.freeze(GRADE_POINTS);

const get_courses_from_table_rows = (table_rows) => {
    const courses = [];
    const final_course_index = table_rows.length;
    for (let i = FIRST_COURSE_INDEX; i < final_course_index; ++i) {
        const row = table_rows[i];
        const row_cells = row.querySelectorAll('td');
        if (row_cells.length === 0) {
            continue;
        }
        const course_name = row_cells[COURSE_NAME_INDEX].innerHTML;
        const course_hours = parseInt(
            row_cells[COURSE_HOURS_PARAGRAPH_INDEX].querySelector('p').innerHTML
        );
        const course_grade = row_cells[COURSE_GRADE_PARAGRAPH_INDEX].querySelector('p').innerHTML;
        courses.push({
            name: course_name,
            hours: course_hours,
            grade: GRADE_LETTERS.includes(course_grade) ? course_grade : 'G'
        });
    }
    return courses;
};

export const get_courses_from_html = (scraping_div) => {
    const table = scraping_div.querySelector('table.table.table-striped.col-md-12');
    if (!table) {
        return [];
    }

    const table_rows = table.querySelectorAll('tr');
    if (!table_rows) {
        return [];
    }

    const courses_map = get_courses_from_table_rows(table_rows);
    return courses_map;
};

const create_grades_selector = (course, _document) => {
    const selector = _document.createElement('select');
    GRADE_LETTERS.map((grade_letter) => {
        const option = _document.createElement('option');
        option.innerHTML = grade_letter;
        selector.appendChild(option);
    });
    const grades_letter_index = GRADE_LETTERS.indexOf(course.grade);
    const selected_index = grades_letter_index === -1 ? 0 : grades_letter_index;
    selector.selectedIndex = selected_index;
    return selector;
};

export const create_courses_with_selectors = (courses, _document) => {
    return courses.map((course) => {
        return {
            name: course.name,
            grade: course.grade,
            hours: course.hours,
            grade_selector: create_grades_selector(course, _document)
        };
    });
};

export const get_gpa_from_selectors = (courses_with_selectors) => {
    const points = courses_with_selectors.reduce((previous_points, current_course) => {
        return (
            previous_points +
            GRADE_POINTS[current_course.grade_selector.selectedIndex] * current_course.hours
        );
    }, INITIAL_POINTS);
    const hours = courses_with_selectors.reduce(
        (previous_hours, current_course) => previous_hours + current_course.hours,
        INITIAL_HOURS
    );
    console.log(points, hours);
    return points / hours;
};
