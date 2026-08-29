// Array to store courses
let courses = [];

// Grade scale mapping
const gradeScale = {
    '4.0': 4.0,
    '3.7': 3.7,
    '3.3': 3.3,
    '3.0': 3.0,
    '2.7': 2.7,
    '2.3': 2.3,
    '2.0': 2.0,
    '1.7': 1.7,
    '1.3': 1.3,
    '1.0': 1.0,
    '0.0': 0.0
};

// DOM Elements
const courseNameInput = document.getElementById('courseName');
const creditHoursInput = document.getElementById('creditHours');
const gradeSelect = document.getElementById('gradeSelect');
const addCourseBtn = document.getElementById('addCourseBtn');
const coursesBody = document.getElementById('coursesBody');
const emptyMessage = document.getElementById('emptyMessage');
const totalCreditsDisplay = document.getElementById('totalCredits');
const totalPointsDisplay = document.getElementById('totalPoints');
const gpaResultDisplay = document.getElementById('gpaResult');
const calculateBtn = document.getElementById('calculateBtn');
const resetBtn = document.getElementById('resetBtn');

// Event Listeners
addCourseBtn.addEventListener('click', addCourse);
calculateBtn.addEventListener('click', calculateGPA);
resetBtn.addEventListener('click', resetAll);

// Allow adding course with Enter key
courseNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addCourse();
});

function addCourse() {
    const courseName = courseNameInput.value.trim();
    const creditHours = parseInt(creditHoursInput.value);
    const grade = parseFloat(gradeSelect.value);

    // Validation
    if (!courseName) {
        alert('الرجاء إدخال اسم المقرر');
        courseNameInput.focus();
        return;
    }

    if (!creditHours || creditHours < 1 || creditHours > 6) {
        alert('الرجاء إدخال عدد ساعات صحيح (1-6)');
        creditHoursInput.focus();
        return;
    }

    if (!gradeSelect.value) {
        alert('الرجاء اختيار التقدير');
        gradeSelect.focus();
        return;
    }

    // Create course object
    const course = {
        id: Date.now(),
        name: courseName,
        credits: creditHours,
        grade: grade,
        points: grade * creditHours
    };

    // Add course to array
    courses.push(course);

    // Clear form
    clearForm();

    // Update display
    displayCourses();
}

function displayCourses() {
    coursesBody.innerHTML = '';

    if (courses.length === 0) {
        emptyMessage.style.display = 'block';
        return;
    }

    emptyMessage.style.display = 'none';

    courses.forEach((course) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${course.name}</td>
            <td>${course.credits}</td>
            <td>${course.grade.toFixed(1)}</td>
            <td>${course.points.toFixed(2)}</td>
            <td>
                <button class="btn btn-danger btn-small" onclick="deleteCourse(${course.id})">حذف</button>
            </td>
        `;
        coursesBody.appendChild(row);
    });
}

function deleteCourse(id) {
    if (confirm('هل أنت متأكد من حذف هذا المقرر؟')) {
        courses = courses.filter(course => course.id !== id);
        displayCourses();
    }
}

function calculateGPA() {
    if (courses.length === 0) {
        alert('الرجاء إضافة مقررات قبل حساب المعدل');
        return;
    }

    // Calculate total points and total credits
    let totalPoints = 0;
    let totalCredits = 0;

    courses.forEach((course) => {
        totalPoints += course.points;
        totalCredits += course.credits;
    });

    // Calculate GPA
    const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;

    // Display results
    totalCreditsDisplay.textContent = totalCredits;
    totalPointsDisplay.textContent = totalPoints.toFixed(2);
    gpaResultDisplay.textContent = gpa.toFixed(2);

    // Add visual feedback
    if (gpa >= 3.5) {
        gpaResultDisplay.style.color = '#27ae60'; // Green for excellent
    } else if (gpa >= 3.0) {
        gpaResultDisplay.style.color = '#3498db'; // Blue for good
    } else if (gpa >= 2.0) {
        gpaResultDisplay.style.color = '#f39c12'; // Orange for average
    } else {
        gpaResultDisplay.style.color = '#e74c3c'; // Red for low
    }
}

function resetAll() {
    if (confirm('هل أنت متأكد من حذف جميع المقررات؟')) {
        courses = [];
        clearForm();
        displayCourses();
        totalCreditsDisplay.textContent = '0';
        totalPointsDisplay.textContent = '0.0';
        gpaResultDisplay.textContent = '0.00';
        gpaResultDisplay.style.color = 'white';
    }
}

function clearForm() {
    courseNameInput.value = '';
    creditHoursInput.value = '';
    gradeSelect.value = '';
    courseNameInput.focus();
}

// Load courses from localStorage on page load
window.addEventListener('load', () => {
    const savedCourses = localStorage.getItem('gpaCalculatorCourses');
    if (savedCourses) {
        courses = JSON.parse(savedCourses);
        displayCourses();
    }
});

// Save courses to localStorage whenever they change
function saveCourses() {
    localStorage.setItem('gpaCalculatorCourses', JSON.stringify(courses));
}

// Save courses after any modification
addCourseBtn.addEventListener('click', () => {
    setTimeout(saveCourses, 100);
});

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-danger') && e.target.classList.contains('btn-small')) {
        setTimeout(saveCourses, 100);
    }
});