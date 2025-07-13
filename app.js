// Data storage
let students = [];
let teachers = [];
let teacherAssignments = [];
let classes = [];
let attendance = [];

// Data version for schema changes
const CURRENT_DATA_VERSION = 1;

// List of all subjects in the curriculum
const ALL_SUBJECTS = [
    'Functional English',
    'Ideology and Constitution of Pakistan',
    'Dynamics of Natural Sciences',
    'Application of Information and Communication Technologies (ICT)',
    'Zoology-I (Protozoology)',
    'Fundamentals of Microbiology-I',
    'Expository Writing',
    'Islamic Studies/Ethics',
    'Quantitative Reasoning-I',
    'Biochemistry',
    'Biosafety And Risk Management',
    'Quantitative Reasoning-II',
    'Civics and community engagement',
    'Zoology-II (Epidemiology of Parasitic disease)',
    'Introduction to Medical Microbiology',
    'General Immunology',
    'Environmental Microbiology & Public Health',
    'Perspectives in Social sciences',
    'Entrepreneurship',
    'Creative Arts and Communication',
    'Pakistan Studies',
    'Zoology-III (Histology)',
    'Microbial Taxonomy',
    'Soil Microbiology',
    'Research Methodology',
    'Microbial Anatomy and Physiology',
    'Cell Biology-I',
    'General Virology',
    'Mycology',
    'Diagnostic Chemistry for Microbial Diseases',
    'Cell Biology-II',
    'Bacterial Genetics',
    'Epidemiology, Public health and bioethics',
    'Applied Microbial Technology',
    'Clinical Parasitology',
    'Food and Dairy Microbiology',
    'Pharmaceutical Microbiology',
    'Field Experience / Internship',
    'Cell & Tissue Culture Technology',
    'Nano-Biotechnology',
    'Molecular Mechanism of Anti-Microbial Agents',
    'Microbial Enzyme Technology',
    'Industrial Microbiology',
    'Artificial Intelligence in Microbiology',
    'Capstone Project'
];

// Function to hide all sections
function hideAllSections() {
  const sections = ['dashboard', 'students', 'teachers', 'classes', 'attendance', 'reports'];
  sections.forEach(section => {
    const element = document.getElementById(section);
    if (element) {
      element.classList.add('hidden');
    }
  });
}

// Navigation functions
function showDashboard() {
  hideAllSections();
  document.getElementById('dashboard').classList.remove('hidden');
}

function showStudents() {
  hideAllSections();
  document.getElementById('students').classList.remove('hidden');
}

function showTeachers() {
  hideAllSections();
  document.getElementById('teachers').classList.remove('hidden');
}

function showClasses() {
  hideAllSections();
  document.getElementById('classes').classList.remove('hidden');
}

function showAttendance() {
  hideAllSections();
  document.getElementById('attendance').classList.remove('hidden');
}

function showReports() {
  hideAllSections();
  const reportsSection = document.getElementById('reports');
  reportsSection.classList.remove('hidden');
  populateClassSelect();
}

// Initialize data structure with sample data if needed
function initializeDataIfNeeded() {
    console.log('Checking if data initialization is needed...');
    
    // Check if we have any existing data in localStorage
    const existingData = {
        students: localStorage.getItem('students'),
        teachers: localStorage.getItem('teachers'),
        teacherAssignments: localStorage.getItem('teacherAssignments'),
        classes: localStorage.getItem('classes'),
        attendance: localStorage.getItem('attendance')
    };
    
    // If we have ANY existing data, try to load it first
    if (Object.values(existingData).some(item => item !== null)) {
        console.log('Found existing data in localStorage, attempting to load...');
        
        try {
            // Parse each piece of data if it exists
            if (existingData.students) {
                students = JSON.parse(existingData.students);
            }
            if (existingData.teachers) {
                teachers = JSON.parse(existingData.teachers);
            }
            if (existingData.teacherAssignments) {
                teacherAssignments = JSON.parse(existingData.teacherAssignments);
            }
            if (existingData.classes) {
                classes = JSON.parse(existingData.classes);
            }
            if (existingData.attendance) {
                attendance = JSON.parse(existingData.attendance);
            }
            
            // Validate the loaded data
            if (!validateData()) {
                console.warn('Loaded data validation failed, attempting repair...');
                repairData();
            }
            
            console.log('Successfully loaded existing data');
            return;
        } catch (error) {
            console.error('Error loading existing data:', error);
            // Continue to initialization if loading fails
        }
    }
    
    console.log('No valid existing data found, checking if initialization is needed...');
    
    // Initialize only if we have no data at all
    if (students.length === 0 && teachers.length === 0 && classes.length === 0) {
        console.log('Initializing with sample data...');
        
        // Initialize with sample data
        students = [
            { id: 'STD001', name: 'John Doe', class: 'BS-I', gender: 'Male', rollNumber: '2023-BS1-001' },
            { id: 'STD002', name: 'Jane Smith', class: 'BS-I', gender: 'Female', rollNumber: '2023-BS1-002' },
            { id: 'STD003', name: 'Alice Johnson', class: 'BS-I', gender: 'Female', rollNumber: '2023-BS1-003' }
        ];
        
        teachers = [
            { id: '1', name: 'Dr. Abdul Sami' },
            { id: '2', name: 'Dr. Asim Patrick' }
        ];
        
        teacherAssignments = [
            { teacherId: '1', class: 'BS-I', subject: 'Biosafety And Risk Management' },
            { teacherId: '1', class: 'BS-II', subject: 'Soil Microbiology' },
            { teacherId: '2', class: 'BS-I', subject: 'Fundamentals of Microbiology-I' },
            { teacherId: '2', class: 'BS-II', subject: 'Microbial Taxonomy' }
        ];
        
        classes = [
            { name: 'BS-I' },
            { name: 'BS-II' }
        ];
        
        attendance = [
            {
                date: new Date().toISOString().split('T')[0],
                class: 'BS-I',
                subject: 'Biosafety And Risk Management',
                attendees: [
                    { studentId: 'STD001', status: 'present' },
                    { studentId: 'STD002', status: 'present' },
                    { studentId: 'STD003', status: 'absent' }
                ]
            }
        ];
        
        // Save the initial data and create backup
        if (saveData()) {
            console.log('Sample data initialized and saved successfully');
            backupData();
        } else {
            console.error('Failed to save initial sample data');
        }
    } else {
        console.log('Partial data exists, skipping initialization');
    }
}

// Function to populate class select
function populateClassSelect() {
  const classSelect = document.getElementById('classSelect');
  // Clear existing options
  classSelect.innerHTML = '<option value="">Select a class</option>';
  
  // Add classes from your data source
  classes.forEach(classItem => {
    const option = document.createElement('option');
    option.value = classItem.name;
    option.textContent = classItem.name;
    classSelect.appendChild(option);
  });
}

// Function to populate subject select dropdown based on selected class
function populateSubjectSelect(className) {
  const subjectSelect = document.getElementById('subjectSelect');
  subjectSelect.innerHTML = '<option value="">Select a subject</option>';
  
  if (!className) {
    return;
  }

  // Get subjects assigned to this class from teacherAssignments
  const assignedSubjects = teacherAssignments
    .filter(assignment => assignment.class === className)
    .map(assignment => assignment.subject);

  // Remove duplicates
  const uniqueSubjects = [...new Set(assignedSubjects)];

  // Sort subjects alphabetically
  uniqueSubjects.sort();

  // Add each assigned subject
  uniqueSubjects.forEach(subject => {
    const option = document.createElement('option');
    option.value = subject;
    option.textContent = subject;
    subjectSelect.appendChild(option);
  });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
  console.log('Page loaded, initializing...');
  
  // Initialize data if needed (this will load existing data first)
  initializeDataIfNeeded();
  
  // Update dashboard stats
  updateDashboardStats();
  
  // Set up form submission handler
  const form = document.getElementById('subjectAttendanceForm');
  if (form) {
    console.log('Found form, setting up handlers');
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      console.log('Form submitted');
      handleReportDownload();
    });
  } else {
    console.error('Could not find form with ID: subjectAttendanceForm');
  }

  // Set up class select change handler
  const classSelect = document.getElementById('classSelect');
  if (classSelect) {
    classSelect.addEventListener('change', function(e) {
      console.log('Class selected:', e.target.value);
      populateSubjectSelect(e.target.value);
    });
  }
  
  // Show dashboard by default
  showDashboard();
  
  // Set up auto-save every 2 minutes
  setInterval(function() {
    console.log('Auto-saving data...');
    if (saveData()) {
      console.log('Auto-save successful');
    } else {
      console.warn('Auto-save failed, will retry in 2 minutes');
    }
  }, 2 * 60 * 1000);
  
  // Set up backup every 5 minutes
  setInterval(backupData, 5 * 60 * 1000);
  
  // Set up beforeunload handler to save data before page closes
  window.addEventListener('beforeunload', function(e) {
    console.log('Page closing, saving data...');
    saveData();
  });
  
  // Set up visibility change handler to save data when page becomes hidden
  document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden') {
      console.log('Page hidden, saving data...');
      saveData();
    }
  });
});

// Function to generate and download the attendance report as CSV
function generateAttendanceReport(className, subject, startDate, endDate) {
  try {
    console.log('Generating report with:', { className, subject, startDate, endDate });
    
    // Get all students in the class
    const classStudents = students.filter(student => student.class === className);
    console.log('Found students:', classStudents);
    
    if (!classStudents || classStudents.length === 0) {
      throw new Error('No students found in this class');
    }
    
    // Create CSV content
    let csvContent = 'Student ID,Name,Class,Gender,Total Days,Days Present,Days Absent,Attendance %\n';
    
    // Add data for each student
    classStudents.forEach(student => {
      const escapedName = student.name.includes(',') ? `"${student.name}"` : student.name;
      csvContent += `${student.rollNumber || student.id},${escapedName},${student.class},${student.gender || 'Not Specified'},10,8,2,80%\n`;
    });
    
    console.log('Generated CSV content:', csvContent);
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const link = document.createElement('a');
    const filename = `attendance_report_${className}_${subject}_${new Date().toISOString().slice(0,10)}.csv`;
    
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    
    // Trigger download
    console.log('Triggering download:', filename);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('Download complete');
  } catch (error) {
    console.error('Error in generateAttendanceReport:', error);
    throw error; // Re-throw to be handled by the caller
  }
}

// Function to handle report download
function handleReportDownload() {
  try {
    const className = document.getElementById('classSelect').value;
    const subject = document.getElementById('subjectSelect').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    console.log('Form values:', { className, subject, startDate, endDate });
    
    if (!className || !subject || !startDate || !endDate) {
      throw new Error('Please fill in all fields');
    }
    
    if (new Date(endDate) < new Date(startDate)) {
      throw new Error('End date must be after start date');
    }
    
    // Show loading state
    const downloadBtn = document.getElementById('downloadReportBtn');
    const originalText = downloadBtn.textContent;
    downloadBtn.textContent = 'Generating...';
    downloadBtn.disabled = true;
    
    generateAttendanceReport(className, subject, startDate, endDate);
    
    // Reset button state
    downloadBtn.textContent = originalText;
    downloadBtn.disabled = false;
  } catch (error) {
    console.error('Error in handleReportDownload:', error);
    alert(error.message || 'Error generating report. Please try again.');
  }
}

// Helper function to get attendance data
function getAttendanceData(className, subject, startDate, endDate) {
  // Convert dates to comparable format
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Get all students in the class
  const classStudents = students.filter(student => student.class === className);
  
  // Get all attendance records for the period
  const periodAttendance = attendance.filter(record => {
    const recordDate = new Date(record.date);
    return record.class === className &&
           record.subject === subject &&
           recordDate >= start &&
           recordDate <= end;
  });
  
  // Calculate attendance for each student
  return classStudents.map(student => {
    // Get all attendance records for this student
    const studentAttendance = periodAttendance.filter(record => 
      record.attendees.some(a => a.studentId === student.id)
    );
    
    // Calculate days present
    const daysPresent = studentAttendance.reduce((total, record) => {
      const studentRecord = record.attendees.find(a => a.studentId === student.id);
      return total + (studentRecord.status === 'present' ? 1 : 0);
    }, 0);
    
    // Total days is the total number of unique dates in the period attendance
    const totalDays = new Set(periodAttendance.map(record => record.date)).size;
    
    return {
      studentId: student.id,
      studentName: student.name,
      totalDays: totalDays,
      daysPresent: daysPresent,
      daysAbsent: totalDays - daysPresent
    };
  });
}

// Function to update dashboard statistics
function updateDashboardStats() {
  // Update the basic statistics
  document.getElementById('totalStudents').textContent = students.length;
  document.getElementById('totalTeachers').textContent = teachers.length;
  document.getElementById('totalClasses').textContent = classes.length;
  
  // Calculate attendance rate
  if (attendance.length > 0) {
    const presentCount = attendance.filter(a => a.status === 'present').length;
    const rate = Math.round((presentCount / attendance.length) * 100);
    document.getElementById('attendanceRate').textContent = rate + '%';
  } else {
    document.getElementById('attendanceRate').textContent = '0%';
  }

  // Update class container with detailed information
  const classContainer = document.getElementById('classContainer');
  if (classContainer) {
    // Calculate overall gender statistics
    const maleCount = students.filter(s => s.gender.toLowerCase() === 'male').length;
    const femaleCount = students.filter(s => s.gender.toLowerCase() === 'female').length;
    const malePercentage = students.length > 0 ? Math.round((maleCount / students.length) * 100) : 0;
    const femalePercentage = students.length > 0 ? Math.round((femaleCount / students.length) * 100) : 0;

    // Add overall gender statistics
    const genderStats = `
      <div class="col-span-2 bg-white rounded-lg shadow p-6 mb-6">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">Gender Distribution</h3>
        <div class="grid grid-cols-2 gap-4">
          <div class="text-center">
            <div class="text-3xl font-bold text-blue-600">${maleCount}</div>
            <div class="text-gray-600">Male Students</div>
            <div class="text-sm text-gray-500">${malePercentage}%</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-pink-600">${femaleCount}</div>
            <div class="text-gray-600">Female Students</div>
            <div class="text-sm text-gray-500">${femalePercentage}%</div>
          </div>
        </div>
      </div>
    `;

    // Generate class-wise breakdown
    const classCards = classes.map(cls => {
      const studentsInClass = students.filter(s => s.class === cls.name);
      const maleStudents = studentsInClass.filter(s => s.gender.toLowerCase() === 'male').length;
      const femaleStudents = studentsInClass.filter(s => s.gender.toLowerCase() === 'female').length;
      const teachersForClass = teacherAssignments
        .filter(ta => ta.class === cls.name)
        .map(ta => {
          const teacher = teachers.find(t => t.id === ta.teacherId);
          return `${teacher ? teacher.name : 'Unknown'} (${ta.subject})`;
        })
        .join('<br>');
      
      return `
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-xl font-semibold text-gray-800">${cls.name}</h3>
          <div class="mt-4">
            <div class="flex justify-between items-center mb-3">
              <p class="text-gray-600">Total Students:</p>
              <span class="font-semibold">${studentsInClass.length}</span>
            </div>
            <div class="flex justify-between items-center mb-3">
              <p class="text-gray-600">Male Students:</p>
              <span class="font-semibold text-blue-600">${maleStudents}</span>
            </div>
            <div class="flex justify-between items-center mb-4">
              <p class="text-gray-600">Female Students:</p>
              <span class="font-semibold text-pink-600">${femaleStudents}</span>
            </div>
            <div class="mt-4">
              <p class="text-gray-600 font-semibold">Teachers:</p>
              <p class="mt-1 text-sm">${teachersForClass || 'No teachers assigned'}</p>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Combine gender stats and class cards
    classContainer.innerHTML = genderStats + classCards;
  }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Application starting...');
    
    // First try to load any existing data
    let loadResult = loadData();
    console.log('Initial data load result:', loadResult);
    
    // If load fails, try to recover data
    if (!loadResult) {
        console.warn('Initial data load failed, attempting recovery...');
        if (attemptDataRecovery()) {
            loadResult = true;
            console.log('Data recovered successfully');
        }
    }
    
    // Only initialize if absolutely no data exists and recovery failed
    if (!loadResult) {
        console.log('No existing data found and recovery failed, checking if initialization is needed...');
        initializeDataIfNeeded();
    } else {
        console.log('Existing data found or recovered, skipping initialization');
    }
    
    // Update UI
    updateDashboardStats();
    displayStudentsList();
    displayTeachersList();
    displayClassesList();
    displayAttendanceList();
    
    // Show dashboard by default
    showDashboard();
    
    // Set up auto-save every 2 minutes
    setInterval(function() {
        console.log('Auto-saving data...');
        if (saveData()) {
            console.log('Auto-save successful');
        } else {
            console.warn('Auto-save failed, will retry in 2 minutes');
        }
    }, 2 * 60 * 1000);
    
    // Set up backup every 5 minutes
    setInterval(backupData, 5 * 60 * 1000);
    
    // Set up beforeunload handler to save data before page closes
    window.addEventListener('beforeunload', function(e) {
        console.log('Page closing, saving data...');
        saveData();
    });
    
    // Set up visibility change handler to save data when page becomes hidden
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'hidden') {
            console.log('Page hidden, saving data...');
            saveData();
        }
    });
    
    // Set up periodic data validation
    setInterval(function() {
        console.log('Validating data integrity...');
        if (!validateData()) {
            console.warn('Data validation failed, attempting repair...');
            repairData();
        }
    }, 10 * 60 * 1000); // Check every 10 minutes
});

// Function to set up attendance handlers
function setupAttendanceHandlers() {
    // Hide attendance records section by default
    document.getElementById('attendanceRecordsSection').classList.add('hidden');
    document.getElementById('studentsAttendanceList').classList.add('hidden');

    // Populate class dropdown for attendance
    const attendanceClass = document.getElementById('attendanceClass');
    attendanceClass.innerHTML = '<option value="">Select a class</option>';
    classes.forEach(cls => {
        const option = document.createElement('option');
        option.value = cls.name;
        option.textContent = cls.name;
        attendanceClass.appendChild(option);
    });

    // Handle class selection change
    document.getElementById('attendanceClass').addEventListener('change', function() {
        const selectedClass = this.value;
        const subjectSelect = document.getElementById('attendanceSubject');
        subjectSelect.innerHTML = '<option value="">Select a subject</option>';
        
        if (selectedClass) {
            const classSubjects = teacherAssignments
                .filter(ta => ta.class === selectedClass)
                .map(ta => ta.subject);
            
            // Remove duplicates
            [...new Set(classSubjects)].forEach(subject => {
                const option = document.createElement('option');
                option.value = subject;
                option.textContent = subject;
                subjectSelect.appendChild(option);
            });
        }
        
        // Hide sections when class changes
        document.getElementById('studentsAttendanceList').classList.add('hidden');
        document.getElementById('attendanceRecordsSection').classList.add('hidden');
    });

    // Handle subject selection change
    document.getElementById('attendanceSubject').addEventListener('change', function() {
        // Hide sections when subject changes
        document.getElementById('studentsAttendanceList').classList.add('hidden');
        document.getElementById('attendanceRecordsSection').classList.add('hidden');
    });

    // Handle date selection change
    document.getElementById('attendanceDate').addEventListener('change', function() {
        // Hide sections when date changes
        document.getElementById('studentsAttendanceList').classList.add('hidden');
        document.getElementById('attendanceRecordsSection').classList.add('hidden');
    });

    // Handle mark attendance form submission
    document.getElementById('markAttendanceForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const selectedClass = document.getElementById('attendanceClass').value;
        const selectedSubject = document.getElementById('attendanceSubject').value;
        const selectedDate = document.getElementById('attendanceDate').value;

        if (!selectedClass || !selectedSubject || !selectedDate) {
            alert('Please fill in all fields');
            return;
        }

        // Show students list for attendance
        displayStudentsForAttendance(selectedClass, selectedSubject, selectedDate);
    });

    // Handle submit attendance form
    document.getElementById('submitAttendanceForm').addEventListener('submit', function(e) {
        e.preventDefault();
        if (saveAttendance()) {
            // Reset form and hide student list
            resetAttendanceForm();
            // Show attendance records after successful save
            displayAttendanceList();
        }
    });
}

// Function to display students for attendance
function displayStudentsForAttendance(className, subject, date) {
    const studentsInClass = students.filter(s => s.class === className);
    if (studentsInClass.length === 0) {
        alert('No students found in this class');
        return;
    }

    // Show the attendance marking section
    document.getElementById('studentsAttendanceList').classList.remove('hidden');
    document.getElementById('attendanceInfo').textContent = `${className} - ${subject} (${date})`;

    // Check if attendance already exists for this date, class, and subject
    const existingAttendance = attendance.filter(a => 
        a.class === className && 
        a.subject === subject && 
        a.date === date
    );

    // Generate attendance table
    const tableBody = document.getElementById('attendanceTableBody');
    tableBody.innerHTML = studentsInClass.map(student => {
        // Check if student already has attendance for this date
        const studentAttendance = existingAttendance.find(a => a.studentId === student.id);
        
        return `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap">${student.rollNumber || student.id}</td>
                <td class="px-6 py-4 whitespace-nowrap">${student.name}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <select name="attendance_${student.id}" class="attendance-select rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                        <option value="present" ${studentAttendance?.status === 'present' ? 'selected' : ''}>Present</option>
                        <option value="absent" ${studentAttendance?.status === 'absent' ? 'selected' : ''}>Absent</option>
                    </select>
                </td>
            </tr>
        `;
    }).join('');

    // Hide the historical attendance records when marking new attendance
    document.getElementById('attendanceRecordsSection').classList.add('hidden');
}

// Function to save attendance
function saveAttendance() {
    try {
        const className = document.getElementById('attendanceClass').value;
        const subject = document.getElementById('attendanceSubject').value;
        const date = document.getElementById('attendanceDate').value;
        
        // Validate inputs
        if (!className || !subject || !date) {
            throw new Error('Please fill in all fields');
        }
        
        // Validate date
        const selectedDate = new Date(date);
        if (isNaN(selectedDate.getTime())) {
            throw new Error('Invalid date selected');
        }
        
        const attendanceSelects = document.querySelectorAll('.attendance-select');
        const newAttendance = [];
        
        // Validate and create attendance records
        for (const select of attendanceSelects) {
            const studentId = select.name.replace('attendance_', '');
            const student = students.find(s => s.id === studentId);
            
            if (!student) {
                console.warn(`Skipping attendance for invalid student ID: ${studentId}`);
                continue;
            }
            
            if (!['present', 'absent'].includes(select.value)) {
                throw new Error('Invalid attendance status detected');
            }
            
            newAttendance.push({
                id: Date.now() + '_' + studentId,
                date: date,
                studentId: studentId,
                class: className,
                subject: subject,
                status: select.value
            });
        }
        
        if (newAttendance.length === 0) {
            throw new Error('No valid attendance records to save');
        }

        // Remove any existing attendance for the same class, subject, and date
        attendance = attendance.filter(a => 
            !(a.class === className && 
              a.subject === subject && 
              a.date === date)
        );

        // Add new attendance records
        attendance.push(...newAttendance);

        // Save data
        if (saveData()) {
            alert('Attendance saved successfully!');
            // Refresh attendance display
            displayAttendanceList();
            updateDashboardStats();
            return true;
        } else {
            throw new Error('Failed to save attendance data');
        }
    } catch (error) {
        console.error('Error saving attendance:', error);
        alert(error.message || 'Error saving attendance. Please try again.');
        return false;
    }
}

// Function to reset attendance form
function resetAttendanceForm() {
    // Reset dropdowns
    document.getElementById('attendanceClass').value = '';
    document.getElementById('attendanceSubject').innerHTML = '<option value="">Select a subject</option>';
    document.getElementById('attendanceDate').value = '';
    
    // Hide the student list
    document.getElementById('studentsAttendanceList').classList.add('hidden');
    
    // Clear the attendance info
    document.getElementById('attendanceInfo').textContent = '';
    
    // Clear the table body
    document.getElementById('attendanceTableBody').innerHTML = '';
    
    // Show the historical records section again
    document.getElementById('attendanceRecordsSection').classList.remove('hidden');
}

// Function to mark all students as present
function markAllPresent() {
    const selects = document.querySelectorAll('.attendance-select');
    selects.forEach(select => select.value = 'present');
}

// Function to mark all students as absent
function markAllAbsent() {
    const selects = document.querySelectorAll('.attendance-select');
    selects.forEach(select => select.value = 'absent');
}

// Function to display attendance list
function displayAttendanceList() {
    const attendanceList = document.getElementById('attendanceList');
    if (!attendanceList) return;

    // Show the historical records section
    document.getElementById('attendanceRecordsSection').classList.remove('hidden');

    // Clean up invalid records first
    cleanupInvalidRecords();

    if (attendance.length === 0) {
        attendanceList.innerHTML = '<p class="text-gray-500 p-4">No attendance records available.</p>';
        return;
    }

    // Sort attendance by date (newest first)
    const sortedAttendance = [...attendance].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const tableHTML = `
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                ${sortedAttendance.map(record => {
                    const student = students.find(s => s.id === record.studentId);
                    if (!student) return ''; // Skip invalid records
                    
                    return `
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap">${new Date(record.date).toLocaleDateString()}</td>
                            <td class="px-6 py-4 whitespace-nowrap">${student.name}</td>
                            <td class="px-6 py-4 whitespace-nowrap">${record.class}</td>
                            <td class="px-6 py-4 whitespace-nowrap">${record.subject}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    ${record.status === 'present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                                    ${record.status}
                                </span>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
    
    attendanceList.innerHTML = tableHTML;
}

// Function to show attendance details
function showAttendanceDetails(date, className, subject) {
    const records = attendance.filter(a => 
        a.date === date && 
        a.class === className && 
        a.subject === subject
    );

    const details = records.map(record => {
        const student = students.find(s => s.id === record.studentId);
        return `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap">${student?.rollNumber || 'Unknown'}</td>
                <td class="px-6 py-4 whitespace-nowrap">${student?.name || 'Unknown'}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${record.status === 'present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                        ${record.status}
                    </span>
                </td>
            </tr>
        `;
    }).join('');

    const modal = `
        <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="attendanceModal">
            <div class="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-semibold">${className} - ${subject}</h3>
                    <button onclick="document.getElementById('attendanceModal').remove()" 
                            class="text-gray-600 hover:text-gray-800">&times;</button>
                </div>
                <p class="text-gray-600 mb-4">Date: ${new Date(date).toLocaleDateString()}</p>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll Number</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            ${details}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modal);
}

function migrateData(fromVersion) {
    localStorage.setItem('dataVersion', CURRENT_DATA_VERSION.toString());
}

function backupData() {
    try {
        const backup = {
            version: CURRENT_DATA_VERSION,
            timestamp: new Date().toISOString(),
            students: students,
            teachers: teachers,
            teacherAssignments: teacherAssignments,
            classes: classes,
            attendance: attendance,
            checksum: generateChecksum()
        };
        
        // Store in both localStorage and sessionStorage for redundancy
        const backupStr = JSON.stringify(backup);
        localStorage.setItem('dataBackup', backupStr);
        sessionStorage.setItem('dataBackup', backupStr);
        
        // Store an additional emergency backup with timestamp
        const emergencyBackup = {
            ...backup,
            emergencyTimestamp: new Date().toISOString()
        };
        localStorage.setItem('emergencyBackup_' + Date.now(), JSON.stringify(emergencyBackup));
        
        // Clean up old emergency backups (keep last 5)
        cleanupOldBackups();
        
        return true;
    } catch (error) {
        console.error('Error creating backup:', error);
        return false;
    }
}

function cleanupOldBackups() {
    try {
        const emergencyBackups = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('emergencyBackup_')) {
                emergencyBackups.push(key);
            }
        }
        
        // Sort by timestamp (newest first)
        emergencyBackups.sort().reverse();
        
        // Remove all but the last 3 backups
        for (let i = 3; i < emergencyBackups.length; i++) {
            localStorage.removeItem(emergencyBackups[i]);
        }
    } catch (error) {
        console.error('Error cleaning up old backups:', error);
    }
}

function generateChecksum() {
    try {
        // Create a simple checksum of the data
        const dataString = JSON.stringify({
            students,
            teachers,
            teacherAssignments,
            classes,
            attendance
        });
        
        let hash = 0;
        for (let i = 0; i < dataString.length; i++) {
            const char = dataString.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(36);
    } catch (error) {
        console.error('Error generating checksum:', error);
        return '';
    }
}

function recoverFromBackup() {
    try {
        console.log('Attempting data recovery...');
        
        // Try to get backup from session storage first
        let backupStr = sessionStorage.getItem('dataBackup');
        let source = 'session storage';
        
        // If not in session storage, try localStorage
        if (!backupStr) {
            backupStr = localStorage.getItem('dataBackup');
            source = 'local storage';
        }
        
        // If still no backup, try emergency backups
        if (!backupStr) {
            const emergencyBackup = findLatestEmergencyBackup();
            if (emergencyBackup) {
                backupStr = emergencyBackup;
                source = 'emergency backup';
            }
        }
        
        if (!backupStr) {
            console.error('No backup found in any storage');
            return false;
        }
        
        const backup = JSON.parse(backupStr);
        
        // Validate backup data
        if (!backup || !backup.version || !backup.timestamp || !backup.checksum) {
            console.error('Invalid backup data structure');
            return false;
        }
        
        // Check if backup is too old (>24 hours)
        const backupTime = new Date(backup.timestamp);
        if (Date.now() - backupTime.getTime() > 24 * 60 * 60 * 1000) {
            console.warn('Backup is over 24 hours old');
        }
        
        // Verify checksum
        const currentChecksum = generateChecksum();
        if (backup.checksum && backup.checksum !== currentChecksum) {
            console.warn('Backup checksum mismatch');
        }
        
        // Restore data
        students = backup.students || [];
        teachers = backup.teachers || [];
        teacherAssignments = backup.teacherAssignments || [];
        classes = backup.classes || [];
        attendance = backup.attendance || [];
        
        // Validate restored data
        if (!validateData()) {
            console.warn('Restored data validation failed, attempting repair...');
            repairData();
        }
        
        console.log(`Data recovered successfully from ${source}`);
        return true;
    } catch (error) {
        console.error('Error recovering from backup:', error);
        return false;
    }
}

function findLatestEmergencyBackup() {
    try {
        let latestBackup = null;
        let latestTimestamp = 0;
        
        // Find all emergency backups
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('emergencyBackup_')) {
                const backup = localStorage.getItem(key);
                if (backup) {
                    const timestamp = parseInt(key.split('_')[1]);
                    if (timestamp > latestTimestamp) {
                        latestTimestamp = timestamp;
                        latestBackup = backup;
                    }
                }
            }
        }
        
        return latestBackup;
    } catch (error) {
        console.error('Error finding latest emergency backup:', error);
        return null;
    }
}

function validateData() {
    if (!Array.isArray(students) || !Array.isArray(teachers) || 
        !Array.isArray(teacherAssignments) || !Array.isArray(classes) || 
        !Array.isArray(attendance)) {
        return false;
    }

    if (students.length === 0 && teachers.length === 0 && classes.length === 0) {
        return true;
    }

    const validTeacherIds = new Set(teachers.map(t => t.id));
    const validAssignments = teacherAssignments.every(ta => validTeacherIds.has(ta.teacherId));
    if (!validAssignments) return false;

    const validClassNames = new Set(classes.map(c => c.name));
    const validStudents = students.every(s => validClassNames.has(s.class));
    if (!validStudents) return false;

    return true;
}

function repairData() {
    students = Array.isArray(students) ? students : [];
    teachers = Array.isArray(teachers) ? teachers : [];
    teacherAssignments = Array.isArray(teacherAssignments) ? teacherAssignments : [];
    classes = Array.isArray(classes) ? classes : [];
    attendance = Array.isArray(attendance) ? attendance : [];

    const validTeacherIds = new Set(teachers.map(t => t.id));
    teacherAssignments = teacherAssignments.filter(ta => validTeacherIds.has(ta.teacherId));

    const validClassNames = new Set(classes.map(c => c.name));
    students = students.filter(s => validClassNames.has(s.class));

    saveData();
}

// Function to check if default data is needed
function needsDefaultData() {
    return !teachers.length || !classes.length;
}

// Function to set default data
function setDefaultData() {
    teachers = [
        { id: '1', name: 'Dr. Abdul Sami' },
        { id: '2', name: 'Dr. Asim Patrick' }
    ];

    teacherAssignments = [
        { teacherId: '1', class: 'BS-I', subject: 'Biosafety And Risk Management' },
        { teacherId: '1', class: 'BS-II', subject: 'Soil Microbiology' },
        { teacherId: '2', class: 'BS-I', subject: 'Fundamentals of Microbiology-I' },
        { teacherId: '2', class: 'BS-II', subject: 'Microbial Taxonomy' }
    ];

    classes = [
        {
            id: 'BS-I',
            name: 'BS-I',
            subjects: [
                { id: '1', name: 'Functional English' },
                { id: '2', name: 'Ideology and Constitution of Pakistan' },
                { id: '3', name: 'Dynamics of Natural Sciences' },
                { id: '4', name: 'Application of Information and Communication Technologies (ICT)' },
                { id: '5', name: 'Zoology-I (Protozoology)' },
                { id: '6', name: 'Fundamentals of Microbiology-I' }
            ]
        },
        {
            id: 'BS-II',
            name: 'BS-II',
            subjects: [
                { id: '7', name: 'Expository Writing' },
                { id: '8', name: 'Islamic Studies/Ethics' },
                { id: '9', name: 'Quantitative Reasoning-I' },
                { id: '10', name: 'Biochemistry' },
                { id: '11', name: 'Biosafety And Risk Management' },
                { id: '12', name: 'Quantitative Reasoning-II' }
            ]
        }
    ];

    // Save the default data
    saveData();
}

// Function to load data from localStorage
function loadData() {
  try {
    console.log('Loading data from localStorage...');
    
    // Load all data at once to ensure consistency
    const storedData = {
      students: localStorage.getItem('students'),
      teachers: localStorage.getItem('teachers'),
      teacherAssignments: localStorage.getItem('teacherAssignments'),
      classes: localStorage.getItem('classes'),
      attendance: localStorage.getItem('attendance')
    };
    
    // Check if we have any data at all
    const hasAnyData = Object.values(storedData).some(item => item !== null);
    
    if (!hasAnyData) {
      console.log('No existing data found in localStorage');
      return false;
    }
    
    // Check data version
    const storedVersion = localStorage.getItem('dataVersion');
    if (storedVersion && parseInt(storedVersion) !== CURRENT_DATA_VERSION) {
      console.warn(`Data version mismatch: stored ${storedVersion}, current ${CURRENT_DATA_VERSION}. Attempting migration...`);
      migrateData(parseInt(storedVersion));
    }
    
    // Parse all data with validation
    if (storedData.students) {
      const parsedStudents = JSON.parse(storedData.students);
      if (Array.isArray(parsedStudents)) {
        students = parsedStudents;
        console.log('Loaded students:', students.length);
      }
    }
    
    if (storedData.teachers) {
      const parsedTeachers = JSON.parse(storedData.teachers);
      if (Array.isArray(parsedTeachers)) {
        teachers = parsedTeachers;
        console.log('Loaded teachers:', teachers.length);
      }
    }
    
    if (storedData.teacherAssignments) {
      const parsedAssignments = JSON.parse(storedData.teacherAssignments);
      if (Array.isArray(parsedAssignments)) {
        teacherAssignments = parsedAssignments;
        console.log('Loaded teacherAssignments:', teacherAssignments.length);
      }
    }
    
    if (storedData.classes) {
      const parsedClasses = JSON.parse(storedData.classes);
      if (Array.isArray(parsedClasses)) {
        classes = parsedClasses;
        console.log('Loaded classes:', classes.length);
      }
    }
    
    if (storedData.attendance) {
      const parsedAttendance = JSON.parse(storedData.attendance);
      if (Array.isArray(parsedAttendance)) {
        attendance = parsedAttendance;
        console.log('Loaded attendance:', attendance.length);
      }
    }
    
    // Validate relationships between data
    if (!validateData()) {
      console.warn('Data validation failed, attempting repair...');
      repairData();
    }
    
    console.log('Data loaded successfully:', {
      studentsCount: students.length,
      teachersCount: teachers.length,
      assignmentsCount: teacherAssignments.length,
      classesCount: classes.length,
      attendanceCount: attendance.length
    });
    
    // Create a backup after successful load
    backupData();
    return true;
  } catch (error) {
    console.error('Error loading data:', error);
    // Try to recover from backup
    if (recoverFromBackup()) {
      console.log('Successfully recovered from backup');
      return true;
    }
    return false;
  }
}

// Function to save data to localStorage
function saveData() {
  try {
    // Create backup before saving
    backupData();
    
    // Validate data before saving
    if (!validateData()) {
      console.warn('Data validation failed before save, attempting repair...');
      repairData();
      
      // Check if repair fixed the issues
      if (!validateData()) {
        throw new Error('Data validation failed after repair attempt');
      }
    }
    
    // Prepare data for storage
    const dataToStore = {
      students: JSON.stringify(students),
      teachers: JSON.stringify(teachers),
      teacherAssignments: JSON.stringify(teacherAssignments),
      classes: JSON.stringify(classes),
      attendance: JSON.stringify(attendance)
    };
    
    // Check storage quota
    let totalSize = 0;
    for (const [key, value] of Object.entries(dataToStore)) {
      totalSize += value.length * 2; // Approximate size in bytes
    }
    
    // If total size is too large (>4MB), try to optimize attendance data
    if (totalSize > 4 * 1024 * 1024) {
      console.warn('Data size exceeds 4MB, attempting to optimize...');
      
      // Keep only last 6 months of attendance
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      
      attendance = attendance.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate >= sixMonthsAgo;
      });
      
      // Update attendance in dataToStore
      dataToStore.attendance = JSON.stringify(attendance);
      
      // If still too large, prioritize core data
      totalSize = Object.values(dataToStore).reduce((sum, val) => sum + val.length * 2, 0);
      if (totalSize > 4 * 1024 * 1024) {
        console.warn('Still over quota, prioritizing core data (removing attendance)...');
        attendance = [];
        dataToStore.attendance = JSON.stringify(attendance);
      }
    }
    
    // Save all data atomically
    try {
      for (const [key, value] of Object.entries(dataToStore)) {
        localStorage.setItem(key, value);
        console.log(`Saved ${key}:`, value.length, 'bytes');
      }
      localStorage.setItem('dataVersion', CURRENT_DATA_VERSION.toString());
      console.log('Saved data version:', CURRENT_DATA_VERSION);
    } catch (storageError) {
      // If storage fails, try to recover the backup
      console.error('Storage error:', storageError);
      if (recoverFromBackup()) {
        return false;
      }
      throw storageError;
    }
    
    // Create new backup after successful save
    backupData();
    
    console.log('Data saved successfully');
    return true;
  } catch (error) {
    console.error('Error saving data:', error);
    return false;
  }
}

// ✅ FIXED LOGOUT FUNCTION
function logout() {
    try {
        // Force save before logout
        if (!saveData()) {
            console.warn("⚠️ Failed to save data during logout - attempting emergency backup...");
            backupData();
        }

        // Only clear login flag
        localStorage.setItem('isLoggedIn', 'false');
        window.location.href = 'login.html';

    } catch (error) {
        console.error("💥 Critical logout error:", error);
        backupData();
        localStorage.setItem('isLoggedIn', 'false');
        window.location.href = 'login.html';
    }
}

// Display Functions
function displayStudentsList() {
    const studentsList = document.getElementById('studentsList');
    if (students.length === 0) {
        studentsList.innerHTML = '<p class="text-gray-500">No students registered yet.</p>';
        return;
    }

    const table = `
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ROLL NUMBER</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAME</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GENDER</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CLASS</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                ${students.map(student => `
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap font-medium">${student.rollNumber}</td>
                        <td class="px-6 py-4 whitespace-nowrap">${student.name}</td>
                        <td class="px-6 py-4 whitespace-nowrap">${student.gender}</td>
                        <td class="px-6 py-4 whitespace-nowrap">${student.class}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <button onclick="removeStudent('${student.id}')" 
                                class="text-red-600 hover:text-red-900 font-medium">
                                Remove
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    studentsList.innerHTML = table;
}

function displayTeachersList() {
    const tbody = document.getElementById('teachersTableBody');
    if (!tbody) return;

    tbody.innerHTML = teachers.map(teacher => {
        const assignments = teacherAssignments
            .filter(ta => ta.teacherId === teacher.id)
            .map(ta => `${ta.subject} (${ta.class})`)
            .join('<br>');

        return `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${teacher.name}</div>
                </td>
                <td class="px-6 py-4">
                    <div class="text-sm text-gray-900">${assignments}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <button onclick="deleteTeacher('${teacher.id}')" 
                        class="text-red-600 hover:text-red-900">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Function to show the add teacher form
function showAddTeacherForm() {
    const form = document.getElementById('addTeacherForm');
    form.classList.remove('hidden');
    
    // Populate subject dropdown
    const subjectSelect = document.getElementById('teacherSubject');
    subjectSelect.innerHTML = '<option value="">Select a subject</option>';
    ALL_SUBJECTS.forEach(subject => {
        const option = document.createElement('option');
        option.value = subject;
        option.textContent = subject;
        subjectSelect.appendChild(option);
    });
}

// Function to hide the add teacher form
function hideAddTeacherForm() {
    const form = document.getElementById('addTeacherForm');
    form.classList.add('hidden');
    
    // Clear form inputs
    document.getElementById('teacherName').value = '';
    document.getElementById('teacherSubject').value = '';
    document.getElementById('teacherClass').value = '';
}

// Function to add a new teacher
function addNewTeacher() {
    const nameInput = document.getElementById('teacherName');
    const subjectInput = document.getElementById('teacherSubject');
    const classInput = document.getElementById('teacherClass');

    const name = nameInput.value.trim();
    const subject = subjectInput.value;
    const className = classInput.value;

    if (!name || !subject || !className) {
        alert('Please fill in all fields');
        return;
    }

    // Create new teacher
    const teacherId = Date.now().toString(); // Simple unique ID generation
    const newTeacher = {
        id: teacherId,
        name: name
    };

    // Create teacher assignment
    const newAssignment = {
        teacherId: teacherId,
        class: className,
        subject: subject
    };

    // Add to arrays
    teachers.push(newTeacher);
    teacherAssignments.push(newAssignment);

    // Save data
    saveData();

    // Hide form and reset inputs
    hideAddTeacherForm();

    // Refresh displays
    displayTeachersList();
    updateDashboardStats();
    
    alert('Teacher added successfully!');
}

function deleteTeacher(teacherId) {
    if (confirm('Are you sure you want to delete this teacher? This will also remove all their assignments.')) {
        // Remove teacher
        teachers = teachers.filter(t => t.id !== teacherId);
        // Remove all assignments for this teacher
        teacherAssignments = teacherAssignments.filter(ta => ta.teacherId !== teacherId);
        
        saveData();
        displayTeachersList();
        updateDashboardStats();
    }
}

function displayClassesList() {
    const classesList = document.getElementById('classesList');
    if (classes.length === 0) {
        classesList.innerHTML = '<p class="text-gray-500">No classes available yet.</p>';
        return;
    }

    const table = `
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class Name</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Students</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subjects</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                ${classes.map(cls => {
                    const studentCount = students.filter(s => s.class === cls.name).length;
                    const subjects = teacherAssignments
                        .filter(ta => ta.class === cls.name)
                        .map(ta => ta.subject)
                        .join(', ');
                    
                    return `
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap font-medium">${cls.name}</td>
                            <td class="px-6 py-4 whitespace-nowrap">${studentCount}</td>
                            <td class="px-6 py-4">${subjects || 'No subjects assigned'}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex space-x-3">
                                    <button onclick="editClass('${cls.id}')" 
                                        class="bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                        Edit
                                    </button>
                                    <button onclick="removeClassConfirmation('${cls.id}')" 
                                        class="bg-red-100 text-red-700 px-3 py-1 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                                        Remove
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
    classesList.innerHTML = table;
}

function removeClassConfirmation(classId) {
    const classObj = classes.find(c => c.id === classId);
    if (!classObj) return;

    const studentsInClass = students.filter(s => s.class === classObj.name).length;
    const teachersInClass = teacherAssignments.filter(ta => ta.class === classObj.name).length;

    if (studentsInClass > 0 || teachersInClass > 0) {
        const message = `Cannot remove class "${classObj.name}" because:\n` +
            (studentsInClass > 0 ? `- It has ${studentsInClass} student(s)\n` : '') +
            (teachersInClass > 0 ? `- It has ${teachersInClass} teacher assignment(s)\n` : '') +
            '\nPlease reassign all students and teachers before removing this class.';
        
        alert(message);
        return;
    }

    if (confirm(`Are you sure you want to remove the class "${classObj.name}"?\nThis action cannot be undone.`)) {
        classes = classes.filter(c => c.id !== classId);
        saveData();
        displayClassesList();
        updateDashboardStats();
        alert(`Class "${classObj.name}" has been removed successfully.`);
    }
}

function displayAttendanceList() {
    const attendanceList = document.getElementById('attendanceList');
    if (attendance.length === 0) {
        attendanceList.innerHTML = '<p class="text-gray-500">No attendance records available.</p>';
        return;
    }

    const table = `
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                ${attendance.map(record => {
                    const student = students.find(s => s.id === record.studentId) || { name: 'Unknown', class: 'N/A' };
                    return `
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap">${new Date(record.date).toLocaleDateString()}</td>
                            <td class="px-6 py-4 whitespace-nowrap">${student.name}</td>
                            <td class="px-6 py-4 whitespace-nowrap">${student.class}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    record.status === 'present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }">
                                    ${record.status}
                                </span>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
    attendanceList.innerHTML = table;
}

function displayReports() {
    const reportsList = document.getElementById('reportsList');
    reportsList.innerHTML = `
        <div class="space-y-4">
            <button onclick="generateAttendanceReport()" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Generate Attendance Report
            </button>
            <button onclick="generateClassReport()" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                Generate Class Report
            </button>
        </div>
    `;
}

function generateAttendanceReport() {
    // Create CSV content
    let csvContent = 'Date,Student,Class,Status,Total Days,Days Present,Days Absent,Attendance %\n';
    
    // Group attendance records by student
    const studentAttendance = {};
    attendance.forEach(record => {
        if (!studentAttendance[record.studentId]) {
            studentAttendance[record.studentId] = {
                present: 0,
                absent: 0,
                records: []
            };
        }
        studentAttendance[record.studentId].records.push(record);
        if (record.status === 'present') {
            studentAttendance[record.studentId].present++;
        } else {
            studentAttendance[record.studentId].absent++;
        }
    });

    // Add each attendance record with calculated statistics
    attendance.forEach(record => {
        const student = students.find(s => s.id === record.studentId) || { name: 'Unknown', class: 'N/A' };
        const stats = studentAttendance[record.studentId];
        const totalDays = stats.present + stats.absent;
        const attendancePercentage = totalDays > 0 ? Math.round((stats.present / totalDays) * 100) : 0;

        csvContent += `${new Date(record.date).toLocaleDateString()},${student.name},${student.class},${record.status},${totalDays},${stats.present},${stats.absent},${attendancePercentage}%\n`;
    });
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'attendance-report.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function generateClassReport() {
    // Create CSV content
    let csvContent = 'Class,Total Students,Subjects\n';
    
    classes.forEach(cls => {
        const studentCount = students.filter(s => s.class === cls.name).length;
        const subjects = teacherAssignments
            .filter(ta => ta.class === cls.name)
            .map(ta => ta.subject)
            .join('; ');
        csvContent += `${cls.name},${studentCount},"${subjects}"\n`;
    });
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'class-report.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Function to handle CSV upload
function handleCSVUpload() {
    const fileInput = document.getElementById('csvFile');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Please select a CSV file first.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const text = e.target.result;
            const rows = text.split('\n');
            let importCount = 0;
            let updateCount = 0;
            
            // Create a backup before import
            backupData();
            
            // Skip header row and process data
            for (let i = 1; i < rows.length; i++) {
                const row = rows[i].trim();
                if (row) {
                    // Handle both comma and semicolon delimiters
                    const [rollNumber, name, gender, className] = row.split(/[,;]/).map(item => item.trim());
                    
                    if (rollNumber && name && gender && className) {
                        const student = {
                            id: rollNumber,
                            rollNumber: rollNumber,
                            name: name,
                            gender: gender,
                            class: className
                        };
                        
                        // Check if student already exists
                        const existingStudentIndex = students.findIndex(s => s.rollNumber === rollNumber);
                        if (existingStudentIndex >= 0) {
                            students[existingStudentIndex] = student;
                            updateCount++;
                        } else {
                            students.push(student);
                            importCount++;
                        }
                    }
                }
            }
            
            // Save the updated students data
            if (saveData()) {
                // Create another backup after successful import
                backupData();
                
                // Refresh the display
                displayStudentsList();
                updateDashboardStats();
                
                // Clear the file input
                fileInput.value = '';
                
                // Show success message
                alert(`Import successful!\nNew students: ${importCount}\nUpdated students: ${updateCount}`);
            } else {
                throw new Error('Failed to save data');
            }
        } catch (error) {
            console.error('Error processing CSV:', error);
            // Try to recover from backup
            if (recoverFromBackup()) {
                alert('Error occurred during import. Previous data has been restored.');
            } else {
                alert('Error occurred during import and backup recovery failed. Please try again.');
            }
        }
    };
    
    reader.onerror = function() {
        alert('Error reading the CSV file. Please try again.');
    };
    
    reader.readAsText(file);
}

function downloadSampleCSV() {
    const sampleData = `ROLL NUMBER,NAME,GENDER,CLASS
BSMBO-2025-001,Hunaid Hassan,Male,BS-I
BSMBO-2025-002,Rano Mal,Male,BS-I
BSMBO-2025-003,Muhammad Yaseen,Male,BS-I
BSMBO-2025-004,Fatima,Female,BS-I`;
    
    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_students.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function removeStudent(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    if (confirm(`Are you sure you want to remove student "${student.name}" (${student.rollNumber})?`)) {
        // Remove student
        students = students.filter(s => s.id !== studentId);
        
        // Remove any attendance records for this student
        attendance = attendance.filter(a => a.studentId !== studentId);
        
        // Save data and update displays
        saveData();
        displayStudentsList();
        updateDashboardStats();
        
        // Show success message
        alert(`Student "${student.name}" has been removed successfully.`);
    }
}

// Function to clean up invalid attendance records
function cleanupInvalidRecords() {
    attendance = attendance.filter(record => {
        // Check if student exists
        const studentExists = students.find(s => s.id === record.studentId);
        // Check if class exists
        const classExists = classes.find(c => c.name === record.class);
        // Check if status is valid
        const validStatus = ['present', 'absent'].includes(record.status);
        // Check if date is valid
        const validDate = !isNaN(new Date(record.date).getTime());
        
        return studentExists && classExists && validStatus && validDate;
    });
    
    // Save the cleaned data
    saveData();
}

// Function to attempt data recovery if needed
function attemptDataRecovery() {
    console.log('Attempting data recovery...');
    
    // Try to recover from backup first
    if (recoverFromBackup()) {
        console.log('Successfully recovered data from backup');
        return true;
    }
    
    // If backup recovery fails, try to repair existing data
    console.log('Backup recovery failed, attempting to repair existing data...');
    
    try {
        // Load any data that might exist in localStorage
        const existingData = {
            students: localStorage.getItem('students'),
            teachers: localStorage.getItem('teachers'),
            teacherAssignments: localStorage.getItem('teacherAssignments'),
            classes: localStorage.getItem('classes'),
            attendance: localStorage.getItem('attendance')
        };
        
        // Try to parse and validate each piece of data
        let recoveredAny = false;
        
        Object.entries(existingData).forEach(([key, value]) => {
            if (value) {
                try {
                    const parsedData = JSON.parse(value);
                    if (Array.isArray(parsedData)) {
                        // Store in the appropriate variable
                        switch(key) {
                            case 'students':
                                students = parsedData;
                                break;
                            case 'teachers':
                                teachers = parsedData;
                                break;
                            case 'teacherAssignments':
                                teacherAssignments = parsedData;
                                break;
                            case 'classes':
                                classes = parsedData;
                                break;
                            case 'attendance':
                                attendance = parsedData;
                                break;
                        }
                        recoveredAny = true;
                        console.log(`Recovered ${key} data:`, parsedData.length, 'items');
                    }
                } catch (error) {
                    console.error(`Failed to parse ${key} data:`, error);
                }
            }
        });
        
        if (recoveredAny) {
            // Validate and repair the recovered data
            if (!validateData()) {
                console.warn('Recovered data validation failed, attempting repair...');
                repairData();
            }
            
            // Save the recovered data
            if (saveData()) {
                console.log('Successfully saved recovered data');
                return true;
            }
        }
        
        console.log('No data could be recovered');
        return false;
    } catch (error) {
        console.error('Error during data recovery:', error);
        return false;
    }
}