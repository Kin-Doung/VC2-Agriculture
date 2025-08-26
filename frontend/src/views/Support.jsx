import { useState } from 'react';

const Support = ({ language }) => {
  // State for contact form
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error on input change
  };

  // Handle form submission with mock API call
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      // Mock API call (replace with actual endpoint)
      const response = await fetch('https://api.farmmanager.com/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Submission failed');
      alert(language === 'kh' ? 'សារត្រូវបានផ្ញើដោយជោគជ័យ!' : 'Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setError(language === 'kh' ? 'មានបញ្ហាក្នុងការផ្ញើសារ។ សូមព្យាយាមម្តងទៀត!' : 'Error sending message. Please try again!');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Content object for bilingual support
  const content = {
    en: {
      title: "Farm Manager Help & Support Center",
      welcome: "Welcome to the Farm Manager Help & Support Center, your dedicated resource for mastering our platform. Whether you're a new farmer setting up your account or an experienced user optimizing operations, our detailed guides, video tutorials, and responsive support team are here to ensure your success in sustainable agriculture.",
      gettingStarted: {
        title: "Getting Started with Farm Manager",
        description: "New to Farm Manager? Our comprehensive guide helps you set up your farm, track resources, and boost productivity. Follow our step-by-step instructions, watch our beginner-friendly video tutorials, or download the user guide to start managing your farm efficiently.",
        list: [
          "Create a farm profile with details like location, size, soil type, and crop varieties for tailored insights.",
          "Track crops, livestock, and equipment with real-time updates and mobile notifications for seamless management.",
          "Generate insightful reports to monitor yields, expenses, and seasonal trends for data-driven decisions.",
          "Assign and track tasks to streamline team workflows and ensure timely operations.",
        ],
      },
      faq: {
        title: "Frequently Asked Questions (FAQs)",
        description: "Find quick answers to common questions about Farm Manager’s features and functionality. Explore our knowledge base for in-depth guides, troubleshooting tips, and video walkthroughs to enhance your experience.",
        items: [
          {
            question: "How do I add a new crop or livestock entry?",
            answer: "Navigate to the 'Inventory' section, click 'Add New,' and input details such as crop type, planting date, or livestock health records. Use the 'Notes' feature to log observations like soil conditions or animal behavior for better tracking.",
          },
          {
            question: "Can I use Farm Manager offline?",
            answer: "Yes, features like data entry, task management, and viewing saved records work offline. Sync your data when you reconnect to the internet to update records across all devices seamlessly.",
          },
          {
            question: "How do I generate a financial report?",
            answer: "Go to the 'Reports' tab, select 'Financial Overview,' and choose a date range and metrics like revenue or expenses. Export your report as a PDF or CSV for accounting or sharing with stakeholders.",
          },
        ],
      },
      selling: {
        title: "Selling Your Farm Products",
        description: "Effortlessly manage and sell your farm products with Farm Manager’s intuitive tools. Create professional listings, track sales, and connect with local markets or online platforms to grow your business.",
        paragraph: "To add a product, go to the 'Products' section, click 'Add New Product,' and enter details like name, price, quantity, and high-resolution images. Use the 'Analytics' tab to analyze market trends and set competitive prices. To sell, navigate to 'Sales,' select the product, input buyer details, and record the transaction. Integrate with payment gateways or export sales data for accounting purposes.",
      },
      cropTracking: {
        title: "Precision Crop Tracking",
        description: "Monitor your crops with precision using Farm Manager’s advanced tools. Track growth stages, integrate weather data, and analyze performance to optimize yields and reduce risks.",
        paragraph: "In the 'Crops' tab, add a new crop with details like planting date, crop type, and field area. Update growth stages, log pest or disease issues, and set harvest dates. Use the 'Weather' tab to integrate forecasts for irrigation or pest control planning. Visualize crop performance with charts in the 'Analytics' section to make informed decisions.",
      },
      fertilizerReminder: {
        title: "Smart Fertilizer Reminders",
        description: "Stay on top of fertilization schedules with customizable reminders tailored to each crop. Ensure optimal growth and soil health with timely alerts.",
        paragraph: "In the 'Reminders' section, select 'Fertilizer,' choose a crop, and set the date, fertilizer type, and application method. Enable push notifications or email alerts for timely reminders. Review application history in the 'Logs' tab to track soil health and improve yields over time.",
      },
      troubleshooting: {
        title: "Troubleshooting Common Issues",
        description: "Encountering technical issues? Our troubleshooting guide offers quick solutions to common problems. Reach out to our support team for personalized assistance if needed.",
        items: [
          "App not syncing? Ensure a stable internet connection and update to the latest app version in your app store.",
          "Data not displaying correctly? Clear the app cache from the settings menu and refresh the dashboard.",
          "Login issues? Use the 'Forgot Password' link on the login page or contact support for account recovery.",
        ],
      },
      contact: {
        title: "Contact Our Support Team",
        description: "Our friendly support team is here to assist with any questions or technical issues. Use the form below, call us, or join our Telegram group for real-time help from our team and farming community.",
        email: "Email: support@farmmanager.com",
        phone: "Phone: +855 97 996 4862 (Monday to Friday, 9 AM to 5 PM)",
        telegram: "Join Our Telegram Help Group",
        telegramLink: "https://t.me/sok_leap_SL",
      },
      community: {
        title: "Join Our Community Forum",
        description: "Connect with farmers worldwide in the Farm Manager Community Forum. Share tips, discuss sustainable practices, and learn from experienced users to grow your farm smarter.",
      },
      feedback: {
        title: "Share Your Feedback",
        description: "Your feedback drives Farm Manager’s growth! Share suggestions, feature requests, or report issues to help us improve your experience and support your farming goals.",
      },
      footer: "Thank you for choosing Farm Manager to empower your agricultural journey. We’re committed to helping you grow smarter, stronger, and more sustainably!",
    },
    kh: {
      title: "មជ្ឈមណ្ឌលជំនួយ និងការគាំទ្ររបស់ Farm Manager",
      welcome: "សូមស្វាគមន៍មកកាន់មជ្ឈមណ្ឌលជំនួយ និងការគាំទ្ររបស់ Farm Manager ដែលជាប្រភពសំខាន់សម្រាប់ការប្រើប្រាស់វេទិការបស់យើង។ មិនថាអ្នកជាកសិករថ្មីដែលកំពុងដំឡើងគណនី ឬអ្នកប្រើប្រាស់ដែលមានបទពិសោធន៍ទេ ការណែនាំលម្អិត វីដេអូអប់រំ និងក្រុមជំនួយរបស់យើងនឹងជួយអ្នកឱ្យទទួលបានជោគជ័យក្នុងការគ្រប់គ្រងកសិកម្មប្រកបដោយនិរន្តរភាព។",
      gettingStarted: {
        title: "ចាប់ផ្តើមជាមួយ Farm Manager",
        description: "ថ្មីសម្រាប់ Farm Manager? ការណែនាំជាជំហានៗរបស់យើងនឹងជួយអ្នកដំឡើងកសិដ្ឋាន តាមដានធនធាន និងបង្កើនផលិតភាព។ មើលវីដេអូអប់រំសម្រាប់អ្នកចាប់ផ្តើម ឬទាញយកការណែនាំអ្នកប្រើប្រាស់។",
        list: [
          "បង្កើតទម្រង់កសិដ្ឋានជាមួយព័ត៌មានលម្អិតដូចជាទីតាំង ទំហំ ប្រភេទដី និងប្រភេទដំណាំ។",
          "តាមដានដំណាំ សត្វចិញ្ចឹម និងឧបករណ៍ជាមួយការធ្វើបច្ចុប្បន្នភាព និងការជូនដំណឹងតាមទូរស័ព្ទ។",
          "បង្កើតរបាយការណ៍ដ៏មានអត្ថន័យសម្រាប់ទិន្នផល ចំណាយ និងនិន្នាការតាមរដូវ។",
          "កំណត់ និងតាមដានកិច្ចការដើម្បីសម្រួលលំហូរការងារក្រុម។",
        ],
      },
      faq: {
        title: "សំណួរដែលសួរញឹកញាប់",
        description: "ស្វែងរកចម្លើយរហ័សសម្រាប់សំណួរទូទៅអំពីមុខងាររបស់ Farm Manager។ ស្វែងយល់ពីមូលដ្ឋានចំណេះដឹងរបស់យើងសម្រាប់ការណែនាំលម្អិត និងវីដេអូណែនាំ។",
        items: [
          {
            question: "តើខ្ញុំបន្ថែមដំណាំ ឬសត្វចិញ្ចឹមថ្មីដោយរបៀបណា?",
            answer: "ចូលទៅផ្នែក 'ស្តុក' ចុច 'បន្ថែមថ្មី' ហើយបញ្ចូលព័ត៌មានដូចជាប្រភេទដំណាំ កាលបរិច្ឆេទដាំ ឬកំណត់ត្រាសុខភាពសត្វ។ ប្រើមុខងារ 'កំណត់ចំណាំ' ដើម្បីកត់ត្រាការសង្កេត។",
          },
          {
            question: "តើ Farm Manager អាចប្រើដោយគ្មានអ៊ីនធឺណិតបានទេ?",
            answer: "បាទ មុខងារដូចជាការបញ្ចូលទិន្នន័យ និងការគ្រប់គ្រងកិច្ចការដំណើរការដោយគ្មានអ៊ីនធឺណិត។ ធ្វើសមកាលកម្មទិន្នន័យនៅពេលភ្ជាប់អ៊ីនធឺណិត។",
          },
          {
            question: "តើខ្ញុំបង្កើតរបាយការណ៍ហិរញ្ញវត្ថុដោយរបៀបណា?",
            answer: "ចូលទៅផ្ទាំង 'របាយការណ៍' ជ្រើស 'ទិដ្ឋភាពហិរញ្ញវត្ថុ' កំណត់ជួរកាលបរិច្ឆេទ និងនាំចេញជា PDF ឬ CSV។",
          },
        ],
      },
      selling: {
        title: "ការលក់ផលិតផលកសិដ្ឋាន",
        description: "គ្រប់គ្រង និងលក់ផលិតផលកសិដ្ឋានបានយ៉ាងងាយស្រួលជាមួយឧបករណ៍វិចារណញាណ។ បង្កើតបញ្ជីផលិតផល និងភ្ជាប់ជាមួយទីផ្សារក្នុងស្រុក ឬវេទិកាអនឡាញ។",
        paragraph: "នៅផ្នែក 'ផលិតផល' ចុច 'បន្ថែមផលិតផលថ្មី' ហើយបញ្ចូលព័ត៌មានដូចជាឈ្មោះ តម្លៃ បរិមាណ និងរូបភាពគុណភាពខ្ពស់។ ប្រើផ្ទាំង 'វិភាគ' ដើម្បីកំណត់តម្លៃប្រកួតប្រជែង។ ដើម្បីលក់ ចូលទៅ 'ការលក់' ជ្រើសរើសផលិតផល បញ្ចូលព័ត៌មានអ្នកទិញ និងកត់ត្រាប្រតិបត្តិការ។",
      },
      cropTracking: {
        title: "ការតាមដានដំណាំប្រកបដោយភាពជាក់លាក់",
        description: "តាមដានដំណាំរបស់អ្នកជាមួយឧបករណ៍កម្រិតខ្ពស់។ កត់ត្រាដំណាក់កាលលូតលាស់ និងបញ្ចូលទិន្នន័យអាកាសធាតុដើម្បីបង្កើនទិន្នផល។",
        paragraph: "នៅផ្ទាំង 'ដំណាំ' បន្ថែមដំណាំថ្មីជាមួយកាលបរិច្ឆេទដាំ ប្រភេទ និងផ្ទៃដី។ ធ្វើបច្ចុប្បន្នភាពដំណាក់កាលលូតលាស់ កត់ត្រាសត្វល្អិត ឬជំងឺ និងកំណត់កាលបរិច្ឆេទប្រមូលផល។ ប្រើផ្ទាំង 'អាកាសធាតុ' សម្រាប់ផែនការស្រោចស្រព និងមើលការអនុវត្តដំណាំនៅ 'វិភាគ'។",
      },
      fertilizerReminder: {
        title: "ការរំលឹកជីឆ្លាតវៃ",
        description: "រក្សាកាលវិភាគជីជាមួយការជូនដំណឹងដែលអាចកំណត់បានសម្រាប់ដំណាំនីមួយៗ ដើម្បីធានាការលូតលាស់ល្អបំផុត។",
        paragraph: "នៅផ្នែក 'ការរំលឹក' ជ្រើស 'ជី' កំណត់ដំណាំ កាលបរិច្ឆេទ ប្រភេទជី និងវិធីប្រើប្រាស់។ បើកការជូនដំណឹងតាមទូរស័ព្ទ ឬអ៊ីមែល។ ពិនិត្យប្រវត្តិការប្រើប្រាស់នៅ 'កំណត់ហេតុ'។",
      },
      troubleshooting: {
        title: "ការដោះស្រាយបញ្ហា",
        description: "ជួបបញ្ហាបច្ចេកទេស? ការណែនាំរបស់យើងផ្តល់នូវដំណោះស្រាយរហ័ស។ ទាក់ទងក្រុមជំនួយសម្រាប់ជំនួយផ្ទាល់ខ្លួន។",
        items: [
          "កម្មវិធីមិនធ្វើសមកាលកម្ម? ពិនិត្យអ៊ីនធឺណិត និងធ្វើបច្ចុប្បន្នភាពកម្មវិធី។",
          "ទិន្នន័យបង្ហាញមិនត្រឹមត្រូវ? សម្អាតឃ្លាំងសម្ងាត់នៅក្នុងការកំណត់។",
          "បញ្ហាចូលប្រើ? ប្រើ 'ភ្លេចលេខសម្ងាត់' ឬទាក់ទងជំនួយ។",
        ],
      },
      contact: {
        title: "ទាក់ទងក្រុមជំនួយរបស់យើង",
        description: "ក្រុមជំនួយរបស់យើងត្រៀមជួយអ្នកជាមួយសំណួរ ឬបញ្ហាបច្ចេកទេស។ ប្រើទម្រង់ខាងក្រោម ទូរស័ព្ទ ឬចូលរួមក្រុមតេឡេក្រាមសម្រាប់ជំនួយរហ័ស។",
        email: "អ៊ីមែល: support@farmmanager.com",
        phone: "ទូរស័ព្ទ: +855 97 996 4862 (ច័ន្ទ–សុក្រ, ៩ ព្រឹក–៥ ល្ងាច)",
        telegram: "ចូលរួមក្រុមជំនួយតេឡេក្រាម",
        telegramLink: "https://t.me/sok_leap_SL",
      },
      community: {
        title: "ចូលរួមវេទិកាសហគមន៍",
        description: "ភ្ជាប់ជាមួយកសិករទូទាំងពិភពលោកនៅក្នុងវេទិកាសហគមន៍ Farm Manager។ ចែករំលែកគន្លឹះ ពិភាក្សាការអនុវត្តប្រកបដោយនិរន្តរភាព និងរៀនពីអ្នកប្រើប្រាស់ដែលមានបទពិសោធន៍។",
      },
      feedback: {
        title: "ផ្តល់មតិយោបល់",
        description: "មតិរបស់អ្នកជួយឱ្យ Farm Manager រីកចម្រើន! ចែករំលែកយោបល់ សំណើមុខងារ ឬរាយការណ៍បញ្ហាដើម្បីកែលម្អបទពិសោធន៍របស់អ្នក។",
      },
      footer: "សូមអរគុណសម្រាប់ការជ្រើសរើស Farm Manager។ យើងប្តេជ្ញាជួយអ្នករីកចម្រើនប្រកបដោយភាពឆ្លាតវៃ និងនិរន្តរភាព!",
    },
  };

  const data = content[language] || content.en; // Fallback to English

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-green-800 mb-6">{data.title}</h1>
      <p className="text-gray-600 mb-8 leading-relaxed">{data.welcome}</p>

      {/* Getting Started */}
      <section className="bg-white rounded-lg p-6 mb-6 shadow-lg">
        <h2 className="text-2xl font-semibold text-green-700 mb-4">{data.gettingStarted.title}</h2>
        <p className="text-gray-600 mb-4">{data.gettingStarted.description}</p>
        <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
          {data.gettingStarted.list.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>

      {/* Selling Products */}
      <section className="bg-white rounded-lg p-6 mb-6 shadow-lg">
        <h2 className="text-2xl font-semibold text-green-700 mb-4">{data.selling.title}</h2>
        <p className="text-gray-600 mb-4">{data.selling.description}</p>
        <p className="text-gray-600">{data.selling.paragraph}</p>
      </section>

      {/* Crop Tracking */}
      <section className="bg-white rounded-lg p-6 mb-6 shadow-lg">
        <h2 className="text-2xl font-semibold text-green-700 mb-4">{data.cropTracking.title}</h2>
        <p className="text-gray-600 mb-4">{data.cropTracking.description}</p>
        <p className="text-gray-600">{data.cropTracking.paragraph}</p>
      </section>

      {/* Fertilizer Reminder */}
      <section className="bg-white rounded-lg p-6 mb-6 shadow-lg">
        <h2 className="text-2xl font-semibold text-green-700 mb-4">{data.fertilizerReminder.title}</h2>
        <p className="text-gray-600 mb-4">{data.fertilizerReminder.description}</p>
        <p className="text-gray-600">{data.fertilizerReminder.paragraph}</p>
      </section>

      {/* FAQs */}
      <section className="bg-white rounded-lg p-6 mb-6 shadow-lg">
        <h2 className="text-2xl font-semibold text-green-700 mb-4">{data.faq.title}</h2>
        <p className="text-gray-600 mb-4">{data.faq.description}</p>
        {data.faq.items.map((faq, index) => (
          <div key={index} className="mb-4">
            <p className="font-semibold text-gray-700">{faq.question}</p>
            <p className="text-gray-600">{faq.answer}</p>
          </div>
        ))}
      </section>

      {/* Troubleshooting */}
      <section className="bg-white rounded-lg p-6 mb-6 shadow-lg">
        <h2 className="text-2xl font-semibold text-green-700 mb-4">{data.troubleshooting.title}</h2>
        <p className="text-gray-600 mb-4">{data.troubleshooting.description}</p>
        <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
          {data.troubleshooting.items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>

      {/* Contact Support */}
      <section className="bg-white rounded-lg p-6 mb-6 shadow-lg">
        <h2 className="text-2xl font-semibold text-green-700 mb-4">{data.contact.title}</h2>
        <p className="text-gray-600 mb-4">{data.contact.description}</p>
        <div className="text-gray-600 mb-6 space-y-2">
          <p>{data.contact.email}</p>
          <p>{data.contact.phone}</p>
          <p>
            <a
              href={data.contact.telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:underline"
              aria-label={data.contact.telegram}
            >
              {data.contact.telegram}
            </a>
          </p>
        </div>
      </section>

      {/* Community Forum */}
      <section className="bg-white rounded-lg p-6 mb-6 shadow-lg">
        <h2 className="text-2xl font-semibold text-green-700 mb-4">{data.community.title}</h2>
        <p className="text-gray-600 mb-4">{data.community.description}</p>
      </section>

      {/* Feedback */}
      <section className="bg-white rounded-lg p-6 mb-6 shadow-lg">
        <h2 className="text-2xl font-semibold text-green-700 mb-4">{data.feedback.title}</h2>
        <p className="text-gray-600 mb-4">{data.feedback.description}</p>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-500 mt-8">
        <p>{data.footer}</p>
      </footer>
    </div>
  );
};

export default Support;