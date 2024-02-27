(() => {
  const UNGRADED = -1;
  const GRADES = {
    'A+': 4,
    A: 3.7,
    'B+': 3.3,
    B: 3,
    'C+': 2.7,
    C: 2.4,
    'D+': 2.2,
    D: 2,
    F: 0,
    None: UNGRADED
  };
  const LOCAL_STORAGE_HTML = 'html';

  // Pre-populate from localStorage
  const htmlArea = document.getElementById('html-area');
  htmlArea.innerHTML = localStorage.getItem(LOCAL_STORAGE_HTML) || '';

  const calculateAndDisplayGPA = (courses) => {
    // Calculate GPA
    const gradedCourses = courses.filter((course) => course.select.value != UNGRADED);
    const points = gradedCourses.reduce(
      (prev, course) => prev + parseFloat(course.select.value) * course.hours,
      0
    );
    const hours = gradedCourses.reduce((prev, course) => prev + course.hours, 0);
    const gpa = points / hours;
    console.log({ points, hours, gpa });

    // Display GPA
    const gpaParagraph = document.getElementById('gpa');
    gpaParagraph.innerHTML = `GPA: ${gpa}`;
  };

  document.getElementById('show-courses').addEventListener('click', () => {
    // Get HTML rows
    const dummy = document.createElement('div');
    const html = htmlArea.value;
    dummy.innerHTML = html;
    const tableRows = dummy.querySelectorAll('table.table.table-striped.col-md-12 tr');
    if (tableRows.length === 0) {
      alert('Invalid html');
      return;
    }

    // Create courses array from html rows
    const courses = [];
    for (const row of tableRows) {
      // Create select
      const data = row.getElementsByTagName('td');
      if (data.length === 0) continue;
      const grade = data[6].querySelector('p').innerHTML;
      const select = document.createElement('select');

      // Create select options
      let graded = false;
      for (const gradeLetter in GRADES) {
        const option = document.createElement('option');
        option.innerHTML = gradeLetter;
        option.value = GRADES[gradeLetter];
        if (gradeLetter === grade || (gradeLetter === 'None' && !graded)) {
          console.log({ grade });
          option.selected = true;
          graded = true;
        }
        select.append(option);
      }

      // Make GPA update on changing select value
      select.addEventListener('click', () => calculateAndDisplayGPA(courses));

      courses.push({
        name: data[1].innerHTML,
        hours: parseInt(data[3].querySelector('p').innerHTML),
        select
      });
    }

    if (courses.length === 0) {
      alert("You don't have courses");
      return;
    }

    // Set the HTML for the courses using the courses array
    const coursesDiv = document.getElementById('courses');
    coursesDiv.innerHTML = '';
    courses.forEach((course) => {
      const parentDiv = document.createElement('div');
      parentDiv.classList.add('course');
      const selectorDiv = document.createElement('div');
      const courseNameDiv = document.createElement('div');
      courseNameDiv.innerHTML = course.name;

      selectorDiv.appendChild(course.select);
      parentDiv.appendChild(courseNameDiv);
      parentDiv.appendChild(selectorDiv);
      coursesDiv.appendChild(parentDiv);
    });

    calculateAndDisplayGPA(courses);

    localStorage.setItem(LOCAL_STORAGE_HTML, html);
  });
})();
