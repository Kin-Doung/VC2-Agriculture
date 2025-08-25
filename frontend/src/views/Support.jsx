import { useState } from 'react';

const Support = ({ language }) => {
  // State for contact form
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission (placeholder - replace with actual API call)
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert(language === 'kh' ? 'សារត្រូវបានផ្ញើដោយជោគជ័យ!' : 'Message sent successfully!');
    setFormData({ name: '', email: '', message: '' });
  };

  // Content object for bilingual support
  const content = {
    en: {
      title: "Help & Support",
      welcome: "Welcome to the Help & Support page for Farm Manager, your trusted solution for streamlined agricultural management. We're here to assist you with any questions or issues you may encounter while using our platform.",
      gettingStarted: {
        title: "Getting Started",
        description: "New to Farm Manager? Explore our comprehensive User Guide to learn how to:",
        list: [
          "Set up your farm profile",
          "Track crops, livestock, and equipment",
          "Generate reports for productivity and yield",
          "Manage tasks and schedules for your team",
        ],
        link: "Download the User Guide",
      },
      faq: {
        title: "Frequently Asked Questions (FAQs)",
        description: "Find answers to common questions about Farm Manager:",
        items: [
          {
            question: "How do I add a new crop or livestock entry?",
            answer: 'Navigate to the "Inventory" section, select "Add New," and follow the prompts to input details like crop type, planting date, or livestock health records.',
          },
          {
            question: "Can I access Farm Manager offline?",
            answer: "Certain features, like data entry, are available offline. Sync your data when you reconnect to the internet to ensure all records are updated.",
          },
          {
            question: "How do I generate a financial report?",
            answer: 'Go to the "Reports" tab, select "Financial Overview," and customize the date range and parameters to generate your report.',
          },
        ],
        link: "View Full FAQ",
      },
      selling: {
        title: "Selling Products",
        description: "How to add and sell products.",
        paragraph: "To add a product, navigate to the \"Products\" section, click \"Add New Product\", enter details like name, price, quantity, and save. To sell, go to \"Sales\", select the product, enter buyer details, and record the sale.",
      },
      cropTracking: {
        title: "Crop Tracking",
        description: "How to track your crops.",
        paragraph: "To track crops, go to \"Crops\" tab, add new crop with planting date, type, and area. Update status with growth stages, pests, and harvest date.",
      },
      fertilizerReminder: {
        title: "Fertilizer Reminder",
        description: "How to set reminders for fertilizer.",
        paragraph: "In \"Reminders\" section, select \"Fertilizer\", choose crop, set date and type of fertilizer, and enable notifications. The app will remind you when it's time.",
      },
      troubleshooting: {
        title: "Troubleshooting",
        description: "Encountering an issue? Try these quick fixes:",
        items: [
          'App not syncing? Ensure you have a stable internet connection and check for updates in your app store.',
          'Data not displaying correctly? Clear the app cache from the settings menu and refresh the dashboard.',
          'Login issues? Reset your password using the "Forgot Password" link on the login page.',
        ],
        link: "Troubleshooting Guide",
      },
      contact: {
        title: "Contact Support",
        description: "Our support team is available to help with any questions or technical issues. Use the form below to send a message:",
        form: {
          name: "Name",
          email: "Email",
          message: "Message",
          submit: "Send Message",
        },
      },
      community: {
        title: "Community Forum",
        description: "Join our Farm Manager Community Forum to connect with other farmers, share tips, and discuss best practices.",
        link: "Visit the Community Forum",
      },
      feedback: {
        title: "Feedback",
        description: "We value your input! Share your suggestions or feature requests to help us improve Farm Manager.",
        link: "Submit Feedback",
      },
      footer: "Thank you for choosing Farm Manager to support your agricultural journey. We're committed to helping you succeed!",
    },
    kh: {
      title: "ជំនួយ និងការគាំទ្រ",
      welcome: "សូមស្វាគមន៍មកកាន់ទំព័រជំនួយ និងការគាំទ្រសម្រាប់ Farm Manager ដែលជាដំណោះស្រាយដ៏គួរឱ្យទុកចិត្តសម្រាប់ការគ្រប់គ្រងកសិកម្ម។ យើងនៅទីនេះដើម្បីជួយអ្នកជាមួយនឹងសំណួរ ឬបញ្ហាដែលអ្នកជួបប្រទះនៅពេលប្រើប្រាស់វេទិការបស់យើង។",
      gettingStarted: {
        title: "ចាប់ផ្តើម",
        description: "ថ្មីសម្រាប់ Farm Manager? ស្វែងយល់ពីការណែនាំអ្នកប្រើប្រាស់របស់យើងដើម្បីរៀនពីរបៀប:",
        list: [
          "បង្កើតទម្រង់កសិដ្ឋានរបស់អ្នក",
          "តាមដានដំណាំ សត្វចិញ្ចឹម និងឧបករណ៍",
          "បង្កើតរបាយការណ៍សម្រាប់ផលិតភាព និងទិន្នផល",
          "គ្រប់គ្រងកិច្ចការ និងកាលវិភាគសម្រាប់ក្រុមរបស់អ្នក",
        ],
        link: "ទាញយកការណែនាំអ្នកប្រើប្រាស់",
      },
      faq: {
        title: "សំណួរដែលសួរញឹកញាប់",
        description: "ស្វែងរកចម្លើយចំពោះសំណួរទូទៅអំពី Farm Manager:",
        items: [
          {
            question: "តើខ្ញុំបន្ថែមដំណាំ ឬសត្វចិញ្ចឹមថ្មីដោយរបៀបណា?",
            answer: 'ចូលទៅកាន់ផ្នែក "ស្តុក" ជ្រើសរើស "បន្ថែមថ្មី" ហើយធ្វើតាមការណែនាំដើម្បីបញ្ចូលព័ត៌មានលម្អិតដូចជាប្រភេទដំណាំ កាលបរិច្ឆេទដាំ ឬកំណត់ត្រាសុខភាពសត្វ។',
          },
          {
            question: "តើខ្ញុំអាចប្រើ Farm Manager ដោយគ្មានអ៊ីនធឺណិតបានទេ?",
            answer: "មុខងារមួយចំនួនដូចជាការបញ្ចូលទិន្នន័យអាចប្រើបានដោយគ្មានអ៊ីនធឺណិត។ ធ្វើសមកាលកម្មទិន្នន័យរបស់អ្នកនៅពេលភ្ជាប់អ៊ីនធឺណិតឡើងវិញ។",
          },
          {
            question: "តើខ្ញុំបង្កើតរបាយការណ៍ហិរញ្ញវត្ថុដោយរបៀបណា?",
            answer: 'ចូលទៅកាន់ផ្ទាំង "របាយការណ៍" ជ្រើសរើស "ទិដ្ឋភាពហិរញ្ញវត្ថុ" ហើយកំណត់ជួរកាលបរិច្ឆេទ។',
          },
        ],
        link: "មើលសំណួរទាំងអស់",
      },
      selling: {
        title: "ការលក់ផលិតផល",
        description: "របៀបបន្ថែមនិងលក់ផលិតផល។",
        paragraph: "ដើម្បីបន្ថែមផលិតផល សូមចូលទៅកាន់ផ្នែក \"ផលិតផល\" ចុច \"បន្ថែមផលិតផលថ្មី\" បញ្ចូលព័ត៌មានដូចជាឈ្មោះ តម្លៃ បរិមាណ និងរក្សាទុក។ ដើម្បីលក់ ចូលទៅ \"ការលក់\" ជ្រើសរើសផលិតផល បញ្ចូលព័ត៌មានអ្នកទិញ និងកត់ត្រាការលក់។",
      },
      cropTracking: {
        title: "ការតាមដានដំណាំ",
        description: "របៀបតាមដានដំណាំរបស់អ្នក។",
        paragraph: "ដើម្បីតាមដានដំណាំ ចូលទៅផ្ទាំង \"ដំណាំ\" បន្ថែមដំណាំថ្មីជាមួយកាលបរិច្ឆេទដាំ ប្រភេទ និងផ្ទៃដី។ ធ្វើបច្ចុប្បន្នភាពស្ថានភាពជាមួយដំណាក់កាលកំណើន សត្វល្អិត និងកាលបរិច្ឆេទប្រមូលផល។",
      },
      fertilizerReminder: {
        title: "ការរំលឹកជី",
        description: "របៀបកំណត់ការរំលឹកសម្រាប់ជី។",
        paragraph: "នៅក្នុងផ្នែក \"ការរំលឹក\" ជ្រើសរើស \"ជី\" ជ្រើសរើសដំណាំ កំណត់កាលបរិច្ឆេទនិងប្រភេទជី និងបើកការជូនដំណឹង។ កម្មវិធីនឹងរំលឹកអ្នកនៅពេលដល់ពេល។",
      },
      troubleshooting: {
        title: "ការដោះស្រាយបញ្ហា",
        description: "ជួបបញ្ហា? សាកល្បងដំណោះស្រាយរហ័សទាំងនេះ:",
        items: [
          'កម្មវិធីមិនធ្វើសមកាលកម្ម? ត្រូវប្រាកដថាអ្នកមានអ៊ីនធឺណិតស្ថិរភាព និងពិនិត្យមើលធ្វើបច្ចុប្បន្នភាព។',
          'ទិន្នន័យមិនបង្ហាញត្រឹមត្រូវ? សម្អាតឃ្លាំងសម្ងាត់កម្មវិធីពីម៉ឺនុយការកំណត់។',
          'បញ្ហាការចូលប្រើ? កំណត់លេខសម្ងាត់ឡើងវិញដោយប្រើតំណ "ភ្លេចលេខសម្ងាត់"។',
        ],
        link: "ការណែនាំការដោះស្រាយបញ្ហា",
      },
      contact: {
        title: "ទំនាក់ទំនងជំនួយ",
        description: "ក្រុមជំនួយរបស់យើងត្រៀមជួយអ្នកជាមួយសំណួរ ឬបញ្ហាបច្ចេកទេស។ ប្រើទម្រង់ខាងក្រោមដើម្បីផ្ញើសារ:",
        form: {
          name: "ឈ្មោះ",
          email: "អ៊ីមែល",
          message: "សារ",
          submit: "ផ្ញើសារ",
        },
      },
      community: {
        title: "វេទិកាសហគមន៍",
        description: "ចូលរួមជាមួយវេទិកាសហគមន៍ Farm Manager ដើម្បីភ្ជាប់ជាមួយកសិករផ្សេងទៀត និងចែករំលែកគន្លឹះ។",
        link: "ទស្សនាវេទិកាសហគមន៍",
      },
      feedback: {
        title: "មតិយោបល់",
        description: "យើងឱ្យតម្លៃលើមតិរបស់អ្នក! ចែករំលែកយោបល់ ឬសំណើមុខងារដើម្បីជួយកែលម្អ Farm Manager។",
        link: "ដាក់ស្នើមតិយោបល់",
      },
      footer: "សូមអរគុណសម្រាប់ការជ្រើសរើស Farm Manager ដើម្បីគាំទ្រដំណើរកសិកម្មរបស់អ្នក។ យើងប្តេជ្ញាជួយអ្នកឱ្យជោគជ័យ!",
    },
  };

  const data = content[language] || content.en; // Fallback to English

  
};

export default Support;