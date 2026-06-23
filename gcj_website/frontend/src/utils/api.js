import axios from 'axios';

// Get API base URL from environment variables, fallback to local development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});

// Rich Mock Seed Data for GCJ (Government College Jhang)
export const mockDepartments = [
  {
    id: 1,
    name: "Computer Science & IT",
    description: "The Department of Computer Science & Information Technology has been a pioneer in tech education in the Jhang region since its establishment. We offer state-of-the-art computer labs equipped with high-speed internet, smartboards, and modern software packages. Our curriculum is tailored to industry needs, covering software engineering, databases, networking, artificial intelligence, and mobile development.",
    hod: 101,
    hod_details: { id: 101, name: "Dr. Sajid Mahmood", designation: "Professor & HOD", qualification: "Ph.D. in Computer Science (UET)", email: "sajid.mahmood@gcj.edu.pk" },
    total_seats: 120,
    image_url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=85",
    created_at: "2026-06-13T00:00:00Z",
    updated_at: "2026-06-13T00:00:00Z"
  },
  {
    id: 2,
    name: "Chemistry",
    description: "The Department of Chemistry provides deep theoretical knowledge and hands-on laboratory experience. Our laboratory facilities are equipped for research in organic, inorganic, analytical, and physical chemistry. The faculty is actively engaged in environmental chemistry, industrial catalysis, and nanotechnology research.",
    hod: 102,
    hod_details: { id: 102, name: "Prof. Muhammad Akram", designation: "Professor & HOD", qualification: "M.Phil in Organic Chemistry (QAU)", email: "m.akram@gcj.edu.pk" },
    total_seats: 80,
    image_url: "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?auto=format&fit=crop&w=800&q=85",
    created_at: "2026-06-13T00:00:00Z",
    updated_at: "2026-06-13T00:00:00Z"
  },
  {
    id: 3,
    name: "Physics",
    description: "Exploring the fundamental laws of nature, the Department of Physics offers programs covering classical mechanics, quantum physics, thermodynamics, electromagnetism, and electronics. Our practical labs are equipped for optical experiments, electronics testing, and solid-state research, encouraging critical thinking and inquiry.",
    hod: 103,
    hod_details: { id: 103, name: "Dr. Yasmin Ara", designation: "Associate Professor & HOD", qualification: "Ph.D. in Condensed Matter Physics (PU)", email: "yasmin.ara@gcj.edu.pk" },
    total_seats: 75,
    image_url: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=85",
    created_at: "2026-06-13T00:00:00Z",
    updated_at: "2026-06-13T00:00:00Z"
  },
  {
    id: 4,
    name: "English Literature",
    description: "Dedicated to the exploration of language, prose, classical poetry, drama, and contemporary literature. The department aims to refine communication skills, critical analysis, and creative writing. We host regular dramatic club events, debate championships, and literary circles to cultivate self-expression.",
    hod: 104,
    hod_details: { id: 104, name: "Prof. Tariq Javed", designation: "Professor & HOD", qualification: "M.A. English Literature (PU)", email: "tariq.javed@gcj.edu.pk" },
    total_seats: 90,
    image_url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=85",
    created_at: "2026-06-13T00:00:00Z",
    updated_at: "2026-06-13T00:00:00Z"
  },
  {
    id: 5,
    name: "Mathematics",
    description: "The Department of Mathematics provides core quantitative training. We study pure mathematics, applied statistics, calculus, algebra, and numerical analysis. The course is vital for students pursuing data analysis, physical sciences, engineering, and banking roles.",
    hod: 105,
    hod_details: { id: 105, name: "Prof. Shaban Ali", designation: "Professor & HOD", qualification: "M.Phil in Mathematics (GCUF)", email: "shaban.ali@gcj.edu.pk" },
    total_seats: 80,
    image_url: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=85",
    created_at: "2026-06-13T00:00:00Z",
    updated_at: "2026-06-13T00:00:00Z"
  },
  {
    id: 6,
    name: "Commerce & Business Administration",
    description: "Preparing future leaders in business, economics, accounting, and human resource management. Our business programs bridge academic rigor with commercial applications, providing students with financial literacy, analytical capabilities, and startup entrepreneurship strategies.",
    hod: 106,
    hod_details: { id: 106, name: "Dr. Muhammad Rizwan", designation: "Associate Professor & HOD", qualification: "Ph.D. in Finance (LUMS)", email: "m.rizwan@gcj.edu.pk" },
    total_seats: 100,
    image_url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=85",
    created_at: "2026-06-13T00:00:00Z",
    updated_at: "2026-06-13T00:00:00Z"
  }
];

export const mockTeachers = [
  { id: 1, designation: "Professor", department: 1, user_details: { name: "Dr. Sajid Mahmood", email: "sajid.mahmood@gcj.edu.pk" }, qualification: "Ph.D. in Computer Science (UET)", joining_date: "2012-09-15" },
  { id: 2, designation: "Professor", department: 2, user_details: { name: "Prof. Muhammad Akram", email: "m.akram@gcj.edu.pk" }, qualification: "M.Phil in Organic Chemistry (QAU)", joining_date: "2008-11-20" },
  { id: 3, designation: "Associate Professor", department: 3, user_details: { name: "Dr. Yasmin Ara", email: "yasmin.ara@gcj.edu.pk" }, qualification: "Ph.D. in Condensed Matter Physics (PU)", joining_date: "2015-03-10" },
  { id: 4, designation: "Professor", department: 4, user_details: { name: "Prof. Tariq Javed", email: "tariq.javed@gcj.edu.pk" }, qualification: "M.A. English Literature (PU)", joining_date: "2010-02-05" },
  { id: 5, designation: "Professor", department: 5, user_details: { name: "Prof. Shaban Ali", email: "shaban.ali@gcj.edu.pk" }, qualification: "M.Phil in Mathematics (GCUF)", joining_date: "2011-10-01" },
  { id: 6, designation: "Associate Professor", department: 6, user_details: { name: "Dr. Muhammad Rizwan", email: "m.rizwan@gcj.edu.pk" }, qualification: "Ph.D. in Finance (LUMS)", joining_date: "2016-08-12" },
  { id: 7, designation: "Assistant Professor", department: 1, user_details: { name: "Dr. Asif Raza", email: "asif.raza@gcj.edu.pk" }, qualification: "Ph.D. in Artificial Intelligence (FAST)", joining_date: "2019-01-20" },
  { id: 8, designation: "Lecturer", department: 1, user_details: { name: "Ms. Amina Batool", email: "amina.batool@gcj.edu.pk" }, qualification: "MS Computer Science (FAST-NUCES)", joining_date: "2021-10-05" },
  { id: 9, designation: "Assistant Professor", department: 2, user_details: { name: "Dr. Farooq Khan", email: "farooq.khan@gcj.edu.pk" }, qualification: "Ph.D. in Analytical Chemistry (Heidelberg)", joining_date: "2018-05-14" },
  { id: 10, designation: "Lecturer", department: 3, user_details: { name: "Mr. Zafar Iqbal", email: "zafar.iqbal@gcj.edu.pk" }, qualification: "MS Physics (GCU Lahore)", joining_date: "2022-09-01" },
  { id: 11, designation: "Assistant Professor", department: 4, user_details: { name: "Dr. Sadia Rehman", email: "sadia.rehman@gcj.edu.pk" }, qualification: "Ph.D. in English Linguistics (NUML)", joining_date: "2017-04-18" },
  { id: 12, designation: "Lecturer", department: 5, user_details: { name: "Ms. Hina Jamil", email: "hina.jamil@gcj.edu.pk" }, qualification: "M.Phil in Mathematics (UAF)", joining_date: "2023-02-15" }
];

export const mockCourses = [
  { id: 1, department: 1, name: "BS Computer Science (BS CS)", code: "BS-CS", credit_hours: 130, semester: 8, duration: "4 Years", fee: "35,000 PKR / Semester", eligibility: "At least 50% marks in Intermediate (F.Sc / ICS / DAE) with Mathematics." },
  { id: 2, department: 1, name: "BS Information Technology (BS IT)", code: "BS-IT", credit_hours: 132, semester: 8, duration: "4 Years", fee: "32,000 PKR / Semester", eligibility: "At least 50% marks in Intermediate (ICS / F.Sc / I.Com) with Math or equivalent." },
  { id: 3, department: 2, name: "BS Chemistry", code: "BS-CHEM", credit_hours: 136, semester: 8, duration: "4 Years", fee: "28,000 PKR / Semester", eligibility: "At least 45% marks in Intermediate Pre-Medical / Pre-Engineering with Chemistry." },
  { id: 4, department: 3, name: "BS Physics", code: "BS-PHYS", credit_hours: 132, semester: 8, duration: "4 Years", fee: "28,000 PKR / Semester", eligibility: "At least 45% marks in F.Sc Pre-Engineering / ICS with Physics." },
  { id: 5, department: 4, name: "BS English (Linguistics & Literature)", code: "BS-ENGL", credit_hours: 128, semester: 8, duration: "4 Years", fee: "25,000 PKR / Semester", eligibility: "At least 45% marks in Intermediate (FA / F.Sc / ICS / I.Com)." },
  { id: 6, department: 5, name: "BS Mathematics", code: "BS-MATH", credit_hours: 134, semester: 8, duration: "4 Years", fee: "26,000 PKR / Semester", eligibility: "At least 45% marks in F.Sc / ICS with Mathematics (200 marks)." },
  { id: 7, department: 6, name: "Bachelor of Business Administration (BBA Hons)", code: "BBA", credit_hours: 130, semester: 8, duration: "4 Years", fee: "34,000 PKR / Semester", eligibility: "At least 45% marks in Intermediate (any stream)." },
  { id: 8, department: 1, name: "ICS (Physics, Math, Computer)", code: "ICS-PMC", credit_hours: 40, semester: 2, duration: "2 Years", fee: "8,000 PKR / Year", eligibility: "At least 45% marks in Matriculation with Science subjects." },
  { id: 9, department: 2, name: "F.Sc Pre-Medical", code: "FSC-MED", credit_hours: 45, semester: 2, duration: "2 Years", fee: "7,500 PKR / Year", eligibility: "At least 50% marks in Matriculation with Biology & Chemistry." },
  { id: 10, department: 3, name: "F.Sc Pre-Engineering", code: "FSC-ENG", credit_hours: 45, semester: 2, duration: "2 Years", fee: "7,500 PKR / Year", eligibility: "At least 50% marks in Matriculation with Mathematics & Physics." }
];

export const mockNewsEvents = [
  {
    id: 1,
    title: "GCJ Fall Admissions 2026 Open for BS Programs",
    body: "Government College Jhang has officially announced admission applications open for all BS 4-Year Undergraduate Programs. Programs include BS Computer Science, BS IT, BS Chemistry, BS Physics, BS English, and BBA. Online applications can be submitted through our secure Admission Portal. Merit lists will be generated in August using student credentials. Scholarships and fee concessions are available for outstanding students.",
    event_date: "2026-08-15T00:00:00Z",
    image_url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80",
    created_at: "2026-06-12T10:00:00Z",
    updated_at: "2026-06-12T10:00:00Z"
  },
  {
    id: 2,
    title: "Annual Sports Gala & Track Registrations Open",
    body: "Government College Jhang holds its historical Centenary Sports Gala this winter. Registrations for standard sports events—including Cricket, Football, Volleyball, Badminton, and 100m/400m Track Races—are open to all enrolled students. The sports department is finalizing grounds and inviting national sports referees. Trophies and cash prizes will be awarded by the chief guest.",
    event_date: "2026-10-15T00:00:00Z",
    image_url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80",
    created_at: "2026-06-10T08:30:00Z",
    updated_at: "2026-06-10T08:30:00Z"
  },
  {
    id: 3,
    title: "GCJ Centenary Convocation Ceremony",
    body: "The administration of Government College Jhang is proud to announce the Centenary Convocation Ceremony celebrating 100 years of academic distinction (Est. 1926). Degrees and gold medals will be awarded to graduates of BS programs (sessions 2021-25) and MA/M.Sc programs. Prominent alumni, scholars, and provincial education ministers will grace the ceremony. Register at the controller office before September 20th.",
    event_date: "2026-11-05T09:00:00Z",
    image_url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80",
    created_at: "2026-06-08T09:00:00Z",
    updated_at: "2026-06-08T09:00:00Z"
  },
  {
    id: 4,
    title: "Inauguration of Advanced Artificial Intelligence & Robotics Lab",
    body: "A monumental milestone achieved by the Department of Computer Science. A high-spec Artificial Intelligence and Robotics lab has been inaugurated by the Vice Chancellor. The lab is equipped with modern GPU workstation towers, drone devkits, Arduino microcontrollers, and VR headsets. Students can now engage in cutting-edge projects focusing on Deep Learning, Computer Vision, and Autonomous Control Systems.",
    event_date: "2026-06-25T11:00:00Z",
    image_url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
    created_at: "2026-06-05T08:00:00Z",
    updated_at: "2026-06-05T08:00:00Z"
  },
  {
    id: 5,
    title: "GCJ Literary Circle - Inter-College Debate Competition",
    body: "The GCJ Debating Society announces the annual Inter-College Debate and Poetry declamation competition. Representatives from over 30 public and private universities across Punjab will compete. Topics include tech progress, socio-economics, and classical Urdu literature. Registration details have been dispatched to college portals. High-profile litterateurs will serve as judges.",
    event_date: "2026-07-20T10:00:00Z",
    image_url: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80",
    created_at: "2026-06-01T14:20:00Z",
    updated_at: "2026-06-01T14:20:00Z"
  }
];

export const mockGallery = [
  { id: 1, category: "CAMPUS", caption: "The Historical Main Clocktower Building - Est. 1926", image_url: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=85" },
  { id: 2, category: "LABS", caption: "Students working on deep learning models in the AI & Computing Lab", image_url: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=800&q=85" },
  { id: 3, category: "ACADEMICS", caption: "Chemistry students conducting organic synthesis experiments", image_url: "https://images.unsplash.com/photo-1607962837359-5e7e89f866ad?auto=format&fit=crop&w=800&q=85" },
  { id: 4, category: "SPORTS", caption: "GCJ Cricket Team celebrating victory at the District Championship", image_url: "https://images.unsplash.com/photo-1540747737956-3787293e58cd?auto=format&fit=crop&w=800&q=85" },
  { id: 5, category: "EVENTS", caption: "Distinguished guests and graduates at the Convocation Ceremony", image_url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=85" },
  { id: 6, category: "CAMPUS", caption: "Central Lawn and Botanical Garden during Spring Blossom", image_url: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=800&q=85" },
  { id: 7, category: "LABS", caption: "Physics students testing semiconductor circuits", image_url: "https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?auto=format&fit=crop&w=800&q=85" },
  { id: 8, category: "SPORTS", caption: "Annual Football Match on the College Main Ground", image_url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=85" }
];

export const mockNotices = [
  { id: 1, title: "Summer Vacations Announcement 2026", content: "The college will observe summer vacations from June 15 to August 14, 2026. Academic departments will remain partially open for administrative tasks and admission procedures. Standard classes will resume on August 17, 2026.", target_role: "All", created_at: "2026-06-08" },
  { id: 2, title: "Laptops Distribution Phase 5 Registration", content: "Students enrolled in BS Computer Science, BS IT, and BS Chemistry (semester 3, 5, 7) with a CGPA above 3.5 are directed to submit their documents at the HOD office before June 25th for PM Laptop Scheme inclusion.", target_role: "Student", created_at: "2026-06-06" },
  { id: 3, title: "Submission of Examination Fee - Semester Spring 2026", content: "All BS program students must submit their exam fee challans to their respective department clerks by June 22, 2026. Late submissions will attract a surcharge penalty of 1,000 PKR.", target_role: "Student", created_at: "2026-06-05" }
];

// Helper to simulate network latency
const sleep = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

// Core API Wrapper
export const api = {
  // 1. Departments API
  getDepartments: async () => {
    try {
      const response = await apiClient.get('/portal/departments/');
      return response.data;
    } catch (error) {
      console.warn("API Error (getDepartments), using mock fallback:", error.message);
      await sleep();
      return mockDepartments;
    }
  },

  getDepartment: async (id) => {
    try {
      const response = await apiClient.get(`/portal/departments/${id}/`);
      return response.data;
    } catch (error) {
      console.warn(`API Error (getDepartment ${id}), using mock fallback:`, error.message);
      await sleep();
      return mockDepartments.find(d => d.id === parseInt(id)) || mockDepartments[0];
    }
  },

  // 2. Teachers / Faculty API
  getTeachers: async (deptId = null) => {
    try {
      const url = deptId ? `/portal/teachers/?department_id=${deptId}` : '/portal/teachers/';
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.warn("API Error (getTeachers), using mock fallback:", error.message);
      await sleep();
      if (deptId) {
        return mockTeachers.filter(t => t.department === parseInt(deptId));
      }
      return mockTeachers;
    }
  },

  // 3. Courses API
  getCourses: async (deptId = null) => {
    try {
      const url = deptId ? `/portal/courses/?department_id=${deptId}` : '/portal/courses/';
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.warn("API Error (getCourses), using mock fallback:", error.message);
      await sleep();
      if (deptId) {
        return mockCourses.filter(c => c.department === parseInt(deptId));
      }
      return mockCourses;
    }
  },

  // 4. News & Events API
  getNewsEvents: async () => {
    try {
      const response = await apiClient.get('/portal/news-events/');
      return response.data;
    } catch (error) {
      console.warn("API Error (getNewsEvents), using mock fallback:", error.message);
      await sleep();
      return mockNewsEvents;
    }
  },

  // 5. Notices API
  getNotices: async (targetRole = null) => {
    try {
      const url = targetRole ? `/portal/notices/?target_role=${targetRole}` : '/portal/notices/';
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.warn("API Error (getNotices), using mock fallback:", error.message);
      await sleep();
      if (targetRole) {
        return mockNotices.filter(n => n.target_role === targetRole || n.target_role === 'All');
      }
      return mockNotices;
    }
  },

  // 6. Gallery API
  getGallery: async (category = null) => {
    try {
      const url = category ? `/portal/gallery/?category=${category}` : '/portal/gallery/';
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.warn("API Error (getGallery), using mock fallback:", error.message);
      await sleep();
      if (category) {
        return mockGallery.filter(g => g.category === category);
      }
      return mockGallery;
    }
  },

  // 7. Admissions POST API
  submitAdmission: async (formData) => {
    try {
      // Endpoint allows POST for anyone
      const response = await apiClient.post('/portal/admissions/', formData);
      return { success: true, data: response.data };
    } catch (error) {
      console.warn("API Error (submitAdmission), using mock fallback:", error.message);
      await sleep(1000);
      // Simulate validation / response mapping
      return {
        success: true,
        data: {
          id: Math.floor(Math.random() * 9000 + 1000),
          student: {
            roll_no: `GCJ-${formData.student_roll_no || Math.floor(Math.random() * 80000 + 10000)}`,
            user_details: { name: formData.student_name, email: formData.student_email }
          },
          department: formData.department,
          status: 'Applied',
          applied_date: new Date().toISOString().split('T')[0],
          merit_score: formData.merit_score || 85.50,
          ai_recommendation: "Highly recommended based on outstanding pre-academic track record."
        }
      };
    }
  },

  // 8. Advisor / Chatbot Query API
  askAdvisor: async (queryText) => {
    try {
      const response = await apiClient.post('/advisor/query/', { query: queryText });
      return response.data;
    } catch (error) {
      console.warn("API Error (askAdvisor), using mock fallback:", error.message);
      await sleep(1000);
      
      const query = queryText.toLowerCase();
      let reply = "Government College Jhang, established in 1926, is dedicated to cultivating knowledge and leadership. How can I assist you with admissions, course requirements, faculty directory, or general inquiries?";
      
      if (query.includes('admission') || query.includes('apply') || query.includes('enroll')) {
        reply = "Admissions for BS Programs (CS, IT, Chemistry, Physics, English, Mathematics, Commerce, BBA) open in August 2026. You can submit your documents online via the Admissions page on our portal. Intermediate classes (ICS, F.Sc Pre-Med/Pre-Eng) are also open after matriculation board results are declared.";
      } else if (query.includes('eligibility') || query.includes('criteria') || query.includes('requirement')) {
        reply = "Eligibility requirements for BS Computer Science and BS IT: Minimum 50% in ICS or F.Sc with Mathematics. For BS Chemistry and BS Physics: Minimum 45% in F.Sc Pre-Med or Pre-Eng with corresponding subjects. Intermediate programs require at least 45% in Matriculation with Science.";
      } else if (query.includes('fee') || query.includes('tuition') || query.includes('cost')) {
        reply = "BS semester tuition fees range from 25,000 PKR to 35,000 PKR depending on the program (BS CS and IT are approximately 32,000 - 35,000 PKR). Intermediate annual fees are highly subsidized, costing around 7,500 PKR to 8,000 PKR per year.";
      } else if (query.includes('course') || query.includes('program') || query.includes('bs') || query.includes('intermediate')) {
        reply = "We offer 4-year BS (Hons) programs in Computer Science, Information Technology, Chemistry, Physics, English Literature, Mathematics, and BBA. We also offer 2-year Intermediate programs: F.Sc Pre-Medical, F.Sc Pre-Engineering, and ICS (Physics/Math/Computer). Check out our Departments page for full syllabus info.";
      } else if (query.includes('faculty') || query.includes('teacher') || query.includes('professor') || query.includes('hod')) {
        reply = "Our faculty includes highly qualified lecturers, assistant professors, and professors holding PhDs and M.Phils from renowned domestic and foreign universities. Key HODs are: Dr. Sajid Mahmood (Computer Science), Prof. Muhammad Akram (Chemistry), Dr. Yasmin Ara (Physics), and Prof. Tariq Javed (English). Please see our Faculty page for the directory.";
      } else if (query.includes('contact') || query.includes('address') || query.includes('phone') || query.includes('email')) {
        reply = "You can contact GCJ Admin at +92 (47) 9200123 or email info@gcj.edu.pk. The physical campus is located on Gojra Road, Jhang, Punjab, Pakistan. Our admissions office is open Monday to Friday from 8:00 AM to 2:00 PM.";
      } else if (query.includes('merit') || query.includes('calculator') || query.includes('score')) {
        reply = "Merit scores for BS programs are calculated using a weighted combination: 30% Matric marks weight + 70% Intermediate marks weight. You can calculate your exact merit percentage dynamically on our Admissions page using the Merit Calculator widget.";
      } else if (query.includes('history') || query.includes('established') || query.includes('year') || query.includes('centenary')) {
        reply = "Government College Jhang was established in 1926 as an intermediate college and later upgraded to a degree awarding institution. We are celebrating 100 years of academic prestige, shaping the intellectual landscape of Central Punjab.";
      }

      return {
        query: queryText,
        response: reply
      };
    }
  }
};
