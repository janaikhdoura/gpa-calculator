// ============================================
// GPA CALCULATOR - 2026
// نظام التقديرات:
// AA = 4.00 | A = 3.50 | BB = 3.00 | B = 2.50
// CC = 2.00 | C = 1.50 | DD = 1.00 | D = 0.50 | F = 0.00
// ============================================


// ============================================
// INITIALIZE ALL DOM ELEMENTS
// ============================================

// Semester GPA Elements
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


// ============================================
// CUMULATIVE GPA ELEMENTS
// ============================================

const prevGPAInput = document.getElementById('prevGPA');
const prevCreditsInput = document.getElementById('prevCredits');

const currentGPAInput = document.getElementById('currentGPA');
const currentCreditsInput = document.getElementById('currentCredits');

const calculateCGPABtn = document.getElementById('calculateCGPABtn');
const resetCGPABtn = document.getElementById('resetCGPABtn');

const totalAllCreditsDisplay = document.getElementById('totalAllCredits');
const totalAllPointsDisplay = document.getElementById('totalAllPoints');
const cgpaResultDisplay = document.getElementById('cgpaResult');


// ============================================
// TAB ELEMENTS
// ============================================

const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');


// ============================================
// STORE COURSES
// ============================================

let courses = [];


// ============================================
// GRADE SCALE
// ============================================

const GRADE_POINTS = {
    "AA": 4.0,
    "A": 3.5,
    "BB": 3.0,
    "B": 2.5,
    "CC": 2.0,
    "C": 1.5,
    "DD": 1.0,
    "D": 0.5,
    "F": 0.0
};


// ============================================
// TAB SWITCHING
// ============================================

tabBtns.forEach(btn => {
    btn.addEventListener('click', function () {

        const tabName = this.getAttribute('data-tab');

        tabContents.forEach(content => {
            content.classList.remove('active');
        });

        tabBtns.forEach(button => {
            button.classList.remove('active');
        });

        this.classList.add('active');

        const activeTab = document.getElementById(tabName);

        if (activeTab) {
            activeTab.classList.add('active');
        }
    });
});


// ============================================
// SEMESTER GPA CALCULATOR
// ============================================

addCourseBtn.addEventListener('click', addCourse);
calculateBtn.addEventListener('click', calculateGPA);
resetBtn.addEventListener('click', resetAll);


// Allow Enter to add course
courseNameInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addCourse();
    }
});


// ============================================
// ADD COURSE
// ============================================

function addCourse() {

    const courseName = courseNameInput.value.trim();
    const creditHours = parseFloat(creditHoursInput.value);

    // Get the selected grade
    const selectedOption = gradeSelect.options[gradeSelect.selectedIndex];

    if (!courseName) {
        alert('الرجاء إدخال اسم المقرر');
        courseNameInput.focus();
        return;
    }

    if (
        isNaN(creditHours) ||
        creditHours < 1 ||
        creditHours > 6
    ) {
        alert('الرجاء إدخال عدد ساعات صحيح (1-6)');
        creditHoursInput.focus();
        return;
    }

    if (!gradeSelect.value || !selectedOption) {
        alert('الرجاء اختيار التقدير');
        gradeSelect.focus();
        return;
    }


    // Get grade name from the option text
    // Example: "AA (4.0)" -> "AA"
    const gradeText = selectedOption.textContent
        .trim()
        .split(' ')[0]
        .toUpperCase();

    // Get points from our official grade scale
    const gradePoints = GRADE_POINTS[gradeText];


    if (gradePoints === undefined) {
        alert('التقدير غير معروف');
        return;
    }


    // Calculate course points
    const points = gradePoints * creditHours;


    const course = {
        id: Date.now() + Math.random(),
        name: courseName,
        credits: creditHours,
        gradeName: gradeText,
        grade: gradePoints,
        points: points
    };


    courses.push(course);

    clearForm();
    displayCourses();
    saveCourses();
}


// ============================================
// DISPLAY COURSES
// ============================================

function displayCourses() {

    coursesBody.innerHTML = '';

    if (courses.length === 0) {
        emptyMessage.style.display = 'block';
        return;
    }

    emptyMessage.style.display = 'none';


    courses.forEach(function (course) {

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${escapeHTML(course.name)}</td>
            <td>${course.credits}</td>
            <td>${course.gradeName || getGradeName(course.grade)}</td>
            <td>${course.points.toFixed(2)}</td>
            <td>
                <button
                    class="btn btn-danger btn-small"
                    onclick="deleteCourse(${course.id})">
                    حذف
                </button>
            </td>
        `;

        coursesBody.appendChild(row);
    });
}


// ============================================
// DELETE COURSE
// ============================================

function deleteCourse(id) {

    if (confirm('هل أنت متأكد من حذف هذا المقرر؟')) {

        courses = courses.filter(function (course) {
            return course.id !== id;
        });

        displayCourses();
        saveCourses();

        // Recalculate automatically after deleting
        if (courses.length > 0) {
            calculateGPA();
        } else {
            totalCreditsDisplay.textContent = '0';
            totalPointsDisplay.textContent = '0.00';
            gpaResultDisplay.textContent = '0.00';
        }
    }
}


// ============================================
// CALCULATE SEMESTER GPA
// ============================================
//
// المعادلة الرسمية:
//
// GPA = مجموع النقاط المكتسبة
//       ------------------------
//       مجموع وحدات الفصل
//
// مجموع الوحدات يشمل:
// الوحدات الناجحة + وحدات الرسوب F
//
// مثال:
// مادة 3 وحدات بدرجة B = 2.5
// النقاط = 3 × 2.5 = 7.5
//
// F = 0 نقاط، لكن وحداتها تدخل في المقام.
// ============================================

function calculateGPA() {

    if (courses.length === 0) {
        alert('الرجاء إضافة مقررات قبل حساب المعدل');
        return;
    }


    let totalPoints = 0;
    let totalCredits = 0;


    courses.forEach(function (course) {

        // Recalculate from grade × credits
        const coursePoints = course.grade * course.credits;

        totalPoints += coursePoints;

        // IMPORTANT:
        // All course credits count,
        // including F / failed courses.
        totalCredits += course.credits;
    });


    // Official semester GPA formula
    const gpa = totalCredits > 0
        ? totalPoints / totalCredits
        : 0;


    // Display results
    totalCreditsDisplay.textContent = formatNumber(totalCredits);
    totalPointsDisplay.textContent = totalPoints.toFixed(2);
    gpaResultDisplay.textContent = gpa.toFixed(2);


    setResultColor(gpaResultDisplay, gpa);

    saveCourses();
}


// ============================================
// RESET SEMESTER
// ============================================

function resetAll() {

    if (confirm('هل أنت متأكد من حذف جميع المقررات؟')) {

        courses = [];

        clearForm();
        displayCourses();

        totalCreditsDisplay.textContent = '0';
        totalPointsDisplay.textContent = '0.00';
        gpaResultDisplay.textContent = '0.00';

        gpaResultDisplay.style.color = 'white';

        saveCourses();
    }
}


// ============================================
// CLEAR FORM
// ============================================

function clearForm() {

    courseNameInput.value = '';
    creditHoursInput.value = '';
    gradeSelect.value = '';

    courseNameInput.focus();
}


// ============================================
// CUMULATIVE GPA CALCULATOR
// ============================================
//
// المعادلة الرسمية:
//
// CGPA = مجموع النقاط المكتسبة في كل الفصول
//        -----------------------------------
//        مجموع الوحدات المحتسبة في كل الفصول
//
// والوحدات المحتسبة تشمل:
// الوحدات الناجحة + وحدات مقررات الرسوب.
//
// إذا كان المعدل السابق محسوبًا على نفس النظام:
//
// النقاط السابقة = المعدل السابق × الوحدات السابقة
//
// النقاط الحالية = معدل الفصل × وحدات الفصل
//
// ثم:
//
// CGPA = (النقاط السابقة + النقاط الحالية)
//        ---------------------------------
//        (الوحدات السابقة + الوحدات الحالية)
// ============================================

calculateCGPABtn.addEventListener('click', calculateCGPA);
resetCGPABtn.addEventListener('click', resetCGPA);


function calculateCGPA() {

    const prevGPA = parseFloat(prevGPAInput.value);
    const prevCredits = parseFloat(prevCreditsInput.value);

    const currentGPA = parseFloat(currentGPAInput.value);
    const currentCredits = parseFloat(currentCreditsInput.value);


    // ========================================
    // VALIDATION
    // ========================================

    if (
        isNaN(prevGPA) ||
        prevGPA < 0 ||
        prevGPA > 4
    ) {
        alert('الرجاء إدخال المعدل التراكمي السابق بشكل صحيح (0-4)');
        prevGPAInput.focus();
        return;
    }


    if (
        isNaN(prevCredits) ||
        prevCredits < 0
    ) {
        alert('الرجاء إدخال إجمالي الوحدات السابقة بشكل صحيح');
        prevCreditsInput.focus();
        return;
    }


    if (
        isNaN(currentGPA) ||
        currentGPA < 0 ||
        currentGPA > 4
    ) {
        alert('الرجاء إدخال معدل الفصل الحالي بشكل صحيح (0-4)');
        currentGPAInput.focus();
        return;
    }


    if (
        isNaN(currentCredits) ||
        currentCredits < 0
    ) {
        alert('الرجاء إدخال إجمالي وحدات الفصل الحالي بشكل صحيح');
        currentCreditsInput.focus();
        return;
    }


    if (
        prevCredits === 0 &&
        currentCredits === 0
    ) {
        alert('الرجاء إدخال عدد الوحدات المحتسبة');
        return;
    }


    // ========================================
    // CALCULATE PREVIOUS POINTS
    // ========================================

    const previousPoints = prevGPA * prevCredits;


    // ========================================
    // CALCULATE CURRENT POINTS
    // ========================================

    const currentPoints = currentGPA * currentCredits;


    // ========================================
    // TOTAL
    // ========================================

    const totalCredits = prevCredits + currentCredits;

    const totalPoints = previousPoints + currentPoints;


    // ========================================
    // FINAL CGPA
    // ========================================

    const newCGPA = totalCredits > 0
        ? totalPoints / totalCredits
        : 0;


    // ========================================
    // DISPLAY
    // ========================================

    totalAllCreditsDisplay.textContent =
        formatNumber(totalCredits);

    totalAllPointsDisplay.textContent =
        totalPoints.toFixed(2);

    cgpaResultDisplay.textContent =
        newCGPA.toFixed(2);


    setResultColor(cgpaResultDisplay, newCGPA);


    // Save
    saveCGPA();
}


// ============================================
// RESET CGPA
// ============================================

function resetCGPA() {

    if (confirm('هل أنت متأكد من إعادة تعيين بيانات المعدل التراكمي؟')) {

        prevGPAInput.value = '';
        prevCreditsInput.value = '';

        currentGPAInput.value = '';
        currentCreditsInput.value = '';

        totalAllCreditsDisplay.textContent = '0';
        totalAllPointsDisplay.textContent = '0.00';
        cgpaResultDisplay.textContent = '0.00';

        cgpaResultDisplay.style.color = 'white';

        prevGPAInput.focus();

        localStorage.removeItem('gpaCalculatorCGPA');
    }
}


// ============================================
// HELPER: GET GRADE NAME
// ============================================

function getGradeName(points) {

    for (const gradeName in GRADE_POINTS) {

        if (GRADE_POINTS[gradeName] === Number(points)) {
            return gradeName;
        }
    }

    return '';
}


// ============================================
// HELPER: FORMAT NUMBERS
// ============================================

function formatNumber(number) {

    if (Number.isInteger(number)) {
        return number.toString();
    }

    return number.toFixed(2);
}


// ============================================
// HELPER: RESULT COLOR
// ============================================

function setResultColor(element, value) {

    if (value >= 3.5) {

        element.style.color = '#27ae60';

    } else if (value >= 3.0) {

        element.style.color = '#3498db';

    } else if (value >= 2.0) {

        element.style.color = '#f39c12';

    } else {

        element.style.color = '#e74c3c';
    }
}


// ============================================
// HELPER: ESCAPE HTML
// ============================================

function escapeHTML(text) {

    const div = document.createElement('div');

    div.textContent = text;

    return div.innerHTML;
}


// ============================================
// LOCAL STORAGE - COURSES
// ============================================

function saveCourses() {

    localStorage.setItem(
        'gpaCalculatorCourses',
        JSON.stringify(courses)
    );
}


// ============================================
// LOCAL STORAGE - CGPA
// ============================================

function saveCGPA() {

    const cgpaData = {

        prevGPA: prevGPAInput.value,

        prevCredits: prevCreditsInput.value,

        currentGPA: currentGPAInput.value,

        currentCredits: currentCreditsInput.value,

        totalCredits:
            totalAllCreditsDisplay.textContent,

        totalPoints:
            totalAllPointsDisplay.textContent,

        newCGPA:
            cgpaResultDisplay.textContent
    };


    localStorage.setItem(
        'gpaCalculatorCGPA',
        JSON.stringify(cgpaData)
    );
}


// ============================================
// LOAD SAVED DATA
// ============================================

function loadSavedData() {


    // ========================================
    // LOAD COURSES
    // ========================================

    const savedCourses =
        localStorage.getItem('gpaCalculatorCourses');


    if (savedCourses) {

        try {

            courses = JSON.parse(savedCourses);


            // Compatibility with old saved data
            courses = courses.map(function (course) {

                const grade = Number(course.grade);

                return {
                    id: course.id || Date.now() + Math.random(),

                    name: course.name || '',

                    credits: Number(course.credits) || 0,

                    grade: grade,

                    gradeName:
                        course.gradeName ||
                        getGradeName(grade),

                    points:
                        grade * (Number(course.credits) || 0)
                };
            });


            displayCourses();

        } catch (error) {

            courses = [];

            localStorage.removeItem(
                'gpaCalculatorCourses'
            );
        }
    }


    // ========================================
    // LOAD CGPA
    // ========================================

    const savedCGPA =
        localStorage.getItem('gpaCalculatorCGPA');


    if (savedCGPA) {

        try {

            const cgpaData = JSON.parse(savedCGPA);


            prevGPAInput.value =
                cgpaData.prevGPA || '';

            prevCreditsInput.value =
                cgpaData.prevCredits || '';

            currentGPAInput.value =
                cgpaData.currentGPA || '';

            currentCreditsInput.value =
                cgpaData.currentCredits || '';


            totalAllCreditsDisplay.textContent =
                cgpaData.totalCredits || '0';

            totalAllPointsDisplay.textContent =
                cgpaData.totalPoints || '0.00';

            cgpaResultDisplay.textContent =
                cgpaData.newCGPA || '0.00';

        } catch (error) {

            localStorage.removeItem(
                'gpaCalculatorCGPA'
            );
        }
    }
}


// ============================================
// LOAD DATA WHEN PAGE OPENS
// ============================================

window.addEventListener(
    'load',
    loadSavedData
);
