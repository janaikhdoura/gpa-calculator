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

// CGPA Elements
const prevGPAInput = document.getElementById('prevGPA');
const prevCreditsInput = document.getElementById('prevCredits');
const currentGPAInput = document.getElementById('currentGPA');
const currentCreditsInput = document.getElementById('currentCredits');
const calculateCGPABtn = document.getElementById('calculateCGPABtn');
const resetCGPABtn = document.getElementById('resetCGPABtn');
const totalAllCreditsDisplay = document.getElementById('totalAllCredits');
const totalAllPointsDisplay = document.getElementById('totalAllPoints');
const cgpaResultDisplay = document.getElementById('cgpaResult');

// Tab Elements
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Store courses
let courses = [];

// ============================================
// TAB SWITCHING FUNCTIONALITY
// ============================================

tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const tabName = this.getAttribute('data-tab');
        
        // Remove active class from all tabs and buttons
        tabContents.forEach(content => {
            content.classList.remove('active');
        });
        
        tabBtns.forEach(b => {
            b.classList.remove('active');
        });
        
        // Add active class to clicked button and corresponding tab
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

courseNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addCourse();
});

function addCourse() {
    const courseName = courseNameInput.value.trim();
    const creditHours = parseInt(creditHoursInput.value);
    const grade = parseFloat(gradeSelect.value);

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

    const course = {
        id: Date.now(),
        name: courseName,
        credits: creditHours,
        grade: grade,
        points: grade * creditHours
    };

    courses.push(course);
    clearForm();
    displayCourses();
    saveCourses();
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
        saveCourses();
    }
}

function calculateGPA() {
    if (courses.length === 0) {
        alert('الرجاء إضافة مقررات قبل حساب المعدل');
        return;
    }

    let totalPoints = 0;
    let totalCredits = 0;

    courses.forEach((course) => {
        totalPoints += course.points;
        totalCredits += course.credits;
    });

    const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;

    totalCreditsDisplay.textContent = totalCredits;
    totalPointsDisplay.textContent = totalPoints.toFixed(2);
    gpaResultDisplay.textContent = gpa.toFixed(2);

    if (gpa >= 3.5) {
        gpaResultDisplay.style.color = '#27ae60';
    } else if (gpa >= 3.0) {
        gpaResultDisplay.style.color = '#3498db';
    } else if (gpa >= 2.0) {
        gpaResultDisplay.style.color = '#f39c12';
    } else {
        gpaResultDisplay.style.color = '#e74c3c';
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
        saveCourses();
    }
}

function clearForm() {
    courseNameInput.value = '';
    creditHoursInput.value = '';
    gradeSelect.value = '';
    courseNameInput.focus();
}

// ============================================
// CUMULATIVE GPA CALCULATOR
// ============================================

calculateCGPABtn.addEventListener('click', calculateCGPA);
resetCGPABtn.addEventListener('click', resetCGPA);

function calculateCGPA() {
    const prevGPA = parseFloat(prevGPAInput.value);
    const prevCredits = parseFloat(prevCreditsInput.value);
    const currentGPA = parseFloat(currentGPAInput.value);
    const currentCredits = parseFloat(currentCreditsInput.value);

    // Validation
    if (isNaN(prevGPA) || prevGPA < 0 || prevGPA > 4) {
        alert('الرجاء إدخال معدل تراكمي سابق صحيح (0-4)');
        prevGPAInput.focus();
        return;
    }

    if (isNaN(prevCredits) || prevCredits < 0) {
        alert('الرجاء إدخال عدد ساعات سابقة صحيح');
        prevCreditsInput.focus();
        return;
    }

    if (isNaN(currentGPA) || currentGPA < 0 || currentGPA > 4) {
        alert('الرجاء إدخال معدل فصل حالي صحيح (0-4)');
        currentGPAInput.focus();
        return;
    }

    if (isNaN(currentCredits) || currentCredits < 0) {
        alert('الرجاء إدخال عدد ساعات فصل حالية صحيحة');
        currentCreditsInput.focus();
        return;
    }

    if (prevCredits === 0 && currentCredits === 0) {
        alert('الرجاء إدخال عدد ساعات معتمدة');
        return;
    }

    // Calculate CGPA using the correct formula:
    // New CGPA = ((Previous cumulative GPA × Previous completed credit hours) + (Current semester GPA × Current semester credit hours)) ÷ (Previous completed credit hours + Current semester credit hours)
    const totalCredits = prevCredits + currentCredits;
    const totalPoints = (prevGPA * prevCredits) + (currentGPA * currentCredits);
    const newCGPA = totalCredits > 0 ? totalPoints / totalCredits : 0;

    // Display results rounded to 2 decimal places
    totalAllCreditsDisplay.textContent = totalCredits.toFixed(0);
    totalAllPointsDisplay.textContent = totalPoints.toFixed(2);
    cgpaResultDisplay.textContent = newCGPA.toFixed(2);

    // Color coding
    if (newCGPA >= 3.5) {
        cgpaResultDisplay.style.color = '#27ae60';
    } else if (newCGPA >= 3.0) {
        cgpaResultDisplay.style.color = '#3498db';
    } else if (newCGPA >= 2.0) {
        cgpaResultDisplay.style.color = '#f39c12';
    } else {
        cgpaResultDisplay.style.color = '#e74c3c';
    }

    saveCGPA();
}

function resetCGPA() {
    if (confirm('هل أنت متأكد من إعادة تعيين؟')) {
        prevGPAInput.value = '';
        prevCreditsInput.value = '';
        currentGPAInput.value = '';
        currentCreditsInput.value = '';
        totalAllCreditsDisplay.textContent = '0';
        totalAllPointsDisplay.textContent = '0.0';
        cgpaResultDisplay.textContent = '0.00';
        cgpaResultDisplay.style.color = 'white';
        prevGPAInput.focus();
        localStorage.removeItem('gpaCalculatorCGPA');
    }
}

// ============================================
// LOCAL STORAGE
// ============================================

function saveCourses() {
    localStorage.setItem('gpaCalculatorCourses', JSON.stringify(courses));
}

function saveCGPA() {
    const cgpaData = {
        prevGPA: prevGPAInput.value,
        prevCredits: prevCreditsInput.value,
        currentGPA: currentGPAInput.value,
        currentCredits: currentCreditsInput.value,
        totalCredits: totalAllCreditsDisplay.textContent,
        totalPoints: totalAllPointsDisplay.textContent,
        newCGPA: cgpaResultDisplay.textContent
    };
    localStorage.setItem('gpaCalculatorCGPA', JSON.stringify(cgpaData));
}

function loadSavedData() {
    // Load semester GPA courses
    const savedCourses = localStorage.getItem('gpaCalculatorCourses');
    if (savedCourses) {
        courses = JSON.parse(savedCourses);
        displayCourses();
    }

    // Load CGPA data
    const savedCGPA = localStorage.getItem('gpaCalculatorCGPA');
    if (savedCGPA) {
        const cgpaData = JSON.parse(savedCGPA);
        prevGPAInput.value = cgpaData.prevGPA || '';
        prevCreditsInput.value = cgpaData.prevCredits || '';
        currentGPAInput.value = cgpaData.currentGPA || '';
        currentCreditsInput.value = cgpaData.currentCredits || '';
        totalAllCreditsDisplay.textContent = cgpaData.totalCredits || '0';
        totalAllPointsDisplay.textContent = cgpaData.totalPoints || '0.0';
        cgpaResultDisplay.textContent = cgpaData.newCGPA || '0.00';
    }
}

// Load saved data when page loads
window.addEventListener('load', loadSavedData);
