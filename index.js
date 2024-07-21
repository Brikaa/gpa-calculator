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
  const CREDIT_HOURS = [0, 1, 2, 3];

  // Pre-populate from localStorage
  const htmlArea = document.getElementById('html-area');
  htmlArea.innerHTML = localStorage.getItem(LOCAL_STORAGE_HTML) || '';

  const calculateAndDisplayGPA = (courses) => {
    // Calculate GPA
    const gradedCourses = courses.filter((course) => course.selectGrade.value != UNGRADED);
    const points = gradedCourses.reduce(
      (prev, course) => prev + parseFloat(course.selectGrade.value) * parseFloat(course.selectHours.value),
      0
    );
    const hours = gradedCourses.reduce((prev, course) => prev + parseFloat(course.selectHours.value), 0);
    const gpa = points / hours;
    console.log({ points, hours, gpa });

    // Display GPA
    const gpaParagraph = document.getElementById('gpa');
    gpaParagraph.innerHTML = `GPA: ${gpa.toFixed(2)}`;
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
      const selectGrade = document.createElement('select');

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
        selectGrade.append(option);
      }

      // Create select for credit hours
      const hours = parseInt(data[3].querySelector('p').innerHTML);
      const selectHours = document.createElement('select');
      CREDIT_HOURS.forEach(hour => {
        const option = document.createElement('option');
        option.innerHTML = hour;
        option.value = hour;
        if (hour === hours) {
          option.selected = true;
        }
        selectHours.append(option);
      });

      // Make GPA update on changing select value
      selectGrade.addEventListener('change', () => calculateAndDisplayGPA(courses));
      selectHours.addEventListener('change', () => calculateAndDisplayGPA(courses));

      courses.push({
        name: data[1].innerHTML,
        selectGrade,
        selectHours
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

      selectorDiv.appendChild(course.selectGrade);
      selectorDiv.appendChild(course.selectHours);
      parentDiv.appendChild(courseNameDiv);
      parentDiv.appendChild(selectorDiv);
      coursesDiv.appendChild(parentDiv);
    });

    calculateAndDisplayGPA(courses);

    localStorage.setItem(LOCAL_STORAGE_HTML, html);
  });
})();
