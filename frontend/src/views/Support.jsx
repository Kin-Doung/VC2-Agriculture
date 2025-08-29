import { useState } from 'react';
import PropTypes from 'prop-types';

const Support = ({ language }) => {
  const [showMore, setShowMore] = useState({
    gettingStarted: false,
    helpAndTroubleshooting: false,
    farmManagementTools: false,
    communityAndFeedback: false,
  });

  const toggleShowMore = (section) => {
    setShowMore((prev) => ({ ...prev, [section]: !prev[section] }));
  };

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
      helpAndTroubleshooting: {
        title: "Help and Troubleshooting",
        description: "Find quick answers to common questions and solutions to technical issues with Farm Manager. Explore our FAQs and troubleshooting tips to enhance your experience and resolve problems efficiently.",
        content: [
          {
            subtitle: "Frequently Asked Questions (FAQs)",
            description: "Get answers to common questions about Farm Manager’s features and functionality.",
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
          {
            subtitle: "Troubleshooting Common Issues",
            description: "Encountering technical issues? Our troubleshooting guide offers quick solutions to common problems.",
            items: [
              "App not syncing? Ensure a stable internet connection and update to the latest app version in your app store.",
              "Data not displaying correctly? Clear the app cache from the settings menu and refresh the dashboard.",
              "Login issues? Use the 'Forgot Password' link on the login page or contact support for account recovery.",
            ],
          },
        ],
      },
      farmManagementTools: {
        title: "Farm Management Tools",
        description: "Leverage Farm Manager’s powerful tools to sell your farm products, track crops with precision, and stay on top of fertilization schedules. These features help you optimize yields, manage sales, and ensure sustainable growth.",
        content: [
          {
            subtitle: "Selling Your Farm Products",
            description: "Effortlessly manage and sell your farm products with Farm Manager’s intuitive tools. Create professional listings, track sales, and connect with local markets or online platforms to grow your business.",
            paragraph: "To add a product, go to the 'Products' section, click 'Add New Product,' and enter details like name, price, quantity, and high-resolution images. Use the 'Analytics' tab to analyze market trends and set competitive prices. To sell, navigate to 'Sales,' select the product, input buyer details, and record the transaction. Integrate with payment gateways or export sales data for accounting purposes.",
          },
          {
            subtitle: "Precision Crop Tracking",
            description: "Monitor your crops with precision using Farm Manager’s advanced tools. Track growth stages, integrate weather data, and analyze performance to optimize yields and reduce risks.",
            paragraph: "In the 'Crops' tab, add a new crop with details like planting date, crop type, and field area. Update growth stages, log pest or disease issues, and set harvest dates. Use the 'Weather' tab to integrate forecasts for irrigation or pest control planning. Visualize crop performance with charts in the 'Analytics' section to make informed decisions.",
          },
          {
            subtitle: "Smart Fertilizer Reminders",
            description: "Stay on top of fertilization schedules with customizable reminders tailored to each crop. Ensure optimal growth and soil health with timely alerts.",
            paragraph: "In the 'Reminders' section, select 'Fertilizer,' choose a crop, and set the date, fertilizer type, and application method. Enable push notifications or email alerts for timely reminders. Review application history in the 'Logs' tab to track soil health and improve yields over time.",
          },
        ],
      },
      contact: {
        title: "Contact Our Support Team",
        description: "Our friendly support team is here to assist with any questions or technical issues. Call us or join our Telegram group for real-time help from our team and farming community.",
        details: [
          "Email: support@farmmanager.com",
          "Phone: +855 97 996 4862 (Monday to Friday, 9 AM to 5 PM)",
          {
            text: "Join Our Telegram Help Group",
            link: "https://t.me/sok_leap_SL",
          },
        ],
      },
      communityAndFeedback: {
        title: "Community and Feedback",
        description: "Join our vibrant Farm Manager Community Forum to connect with farmers worldwide and share your feedback to help us improve the platform. Engage in discussions, exchange tips, and contribute to our growth.",
        content: [
          {
            subtitle: "Join Our Community Forum",
            description: "Connect with farmers worldwide in the Farm Manager Community Forum. Share tips, discuss sustainable practices, and learn from experienced users to grow your farm smarter.",
            paragraph: "Our community forum is a vibrant space to exchange ideas, ask questions, and collaborate with other farmers. Join discussions on crop management, sustainable practices, and the latest agricultural trends to enhance your farming journey.",
          },
          {
            subtitle: "Share Your Feedback",
            description: "Your feedback drives Farm Manager’s growth! Share suggestions, feature requests, or report issues to help us improve your experience and support your farming goals.",
            paragraph: "We value your input to make Farm Manager better. Whether it’s a new feature idea, a bug report, or a suggestion for improving usability, your feedback helps us prioritize updates and enhance the platform for all users.",
          },
        ],
      },
      footer: "Thank you for choosing Farm Manager to empower your agricultural journey. We’re committed to helping you grow smarter, stronger, and more sustainably!",
      showMore: "Show More",
      showLess: "Show Less",
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
      helpAndTroubleshooting: {
        title: "ជំនួយ និងការដោះស្រាយបញ្ហា",
        description: "ស្វែងរកចម្លើយរហ័សសម្រាប់សំណួរទូទៅ និងដំណោះស្រាយសម្រាប់បញ្ហាបច្ចេកទេសជាមួយ Farm Manager។ ស្វែងយល់ពីសំណួរដែលសួរញឹកញាប់ និងគន្លឹះដោះស្រាយបញ្ហាដើម្បីបង្កើនបទពិសោធន៍ និងដោះស្រាយបញ្ហាបានយ៉ាងឆាប់រហ័ស។",
        content: [
          {
            subtitle: "សំណួរដែលសួរញឹកញាប់",
            description: "ទទួលបានចម្លើយចំពោះសំណួរទូទៅអំពីមុខងារនិងប្រតិបត្តិការនៃ Farm Manager។",
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
          {
            subtitle: "ការដោះស្រាយបញ្ហាទូទៅ",
            description: "ជួបបញ្ហាបច្ចេកទេស? ការណែនាំរបស់យើងផ្តល់នូវដំណោះស្រាយរហ័សសម្រាប់បញ្ហាទូទៅ។",
            items: [
              "កម្មវិធីមិនធ្វើសមកាលកម្ម? ពិនិត្យអ៊ីនធឺណិត និងធ្វើបច្ចុប្បន្នភាពកម្មវិធី។",
              "ទិន្នន័យបង្ហាញមិនត្រឹមត្រូវ? សម្អាតឃ្លាំងសម្ងាត់នៅក្នុងការកំណត់។",
              "បញ្ហាចូលប្រើ? ប្រើ 'ភ្លេចលេខសម្ងាត់' ឬទាក់ទងជំនួយ។",
            ],
          },
        ],
      },
      farmManagementTools: {
        title: "ឧបករណ៍គ្រប់គ្រងកសិដ្ឋាន",
        description: "ប្រើប្រាស់ឧបករណ៍ដ៏មានអានុភាពរបស់ Farm Manager ដើម្បីលក់ផលិតផលកសិដ្ឋាន តាមដានដំណាំប្រកបដោយភាពជាក់លាក់ និងរក្សាកាលវិភាគជី។ មុខងារទាំងនេះជួយអ្នកបង្កើនទិន្នផល គ្រប់គ្រងការលក់ និងធានាការរីកចម្រើនប្រកបដោយនិរន្តរភាព�।",
        content: [
          {
            subtitle: "ការលក់ផលិតផលកសិដ្ឋាន",
            description: "គ្រប់គ្រង និងលក់ផលិតផលកសិដ្ឋានបានយ៉ាងងាយស្រួលជាមួយឧបករណ៍វិចារណញាណ។ បង្កើតបញ្ជីផលិតផល និងភ្ជាប់ជាមួយទីផ្សារក្នុងស្រុក ឬវេទិកាអនឡាញ។",
            paragraph: "នៅផ្នែក 'ផលិតផល' ចុច 'បន្ថែមផលិតផលថ្មី' ហើយបញ្ចូលព័ត៌មានដូចជាឈ្មោះ តម្លៃ បរិមាណ និងរូបភាពគុណភាពខ្ពស់។ ប្រើផ្ទាំង 'វិភាគ' ដើម្បីកំណត់តម្លៃប្រកួតប្រជែង។ ដើម្បីលក់ ចូលទៅ 'ការលក់' ជ្រើសរើសផលិតផល បញ្ចូលព័ត៌មានអ្នកទិញ និងកត់ត្រាប្រតិបត្តិការ។",
          },
          {
            subtitle: "ការតាមដានដំណាំប្រកបដោយភាពជាក់លាក់",
            description: "តាមដានដំណាំរបស់អ្នកជាមួយឧបករណ៍កម្រិតខ្ពស់។ កត់ត្រាដំណាក់កាលលូតលាស់ និងបញ្ចូលទិន្នន័យអាកាសធាតុដើម្បីបង្កើនទិន្នផល។",
            paragraph: "នៅផ្ទាំង 'ដំណាំ' បន្ថែមដំណាំថ្មីជាមួយកាលបរិច្ឆេទដាំ ប្រភេទ និងផ្ទៃដី។ ធ្វើបច្ចុប្បន្នភាពដំណាក់កាលលូតលាស់ កត់ត្រាសត្វល្អិត ឬជំងឺ និងកំណត់កាលបរិច្ឆេទប្រមូលផល។ ប្រើផ្ទាំង 'អាកាសធាតុ' សម្រាប់ផែនការស្រោចស្រព និងមើលការអនុវត្តដំណាំនៅ 'វិភាគ'។",
          },
          {
            subtitle: "ការរំលឹកជីឆ្លាតវៃ",
            description: "រក្សាកាលវិភាគជីជាមួយការជូនដំណឹងដែលអាចកំណត់បានសម្រាប់ដំណាំនីមួយៗ ដើម្បីធានាការលូតលាស់ល្អបំផុត។",
            paragraph: "នៅផ្នែក 'ការរំលឹក' ជ្រើស 'ជី' កំណត់ដំណាំ កាលបរិច្ឆេទ ប្រភេទជី និងវិធីប្រើប្រាស់។ បើកការជូនដំណឹងតាមទូរស័ព្ទ ឬអ៊ីមែល។ ពិនិត្យប្រវត្តិការប្រើប្រាស់នៅ 'កំណត់ហេតុ'។",
          },
        ],
      },
      contact: {
        title: "ទាក់ទងក្រុមជំនួយរបស់យើង",
        description: "ក្រុមជំនួយរបស់យើងត្រៀមជួយអ្នកជាមួយសំណួរ ឬបញ្ហាបច្ចេកទេស។ ទូរស័ព្ទ ឬចូលរួមក្រុមតេឡេក្រាមសម្រាប់ជំនួយរហ័ស។",
        details: [
          "អ៊ីមែល: support@farmmanager.com",
          "ទូរស័ព្ទ: +855 97 996 4862 (ច័ន្ទ–សុក្រ, ៩ ព្រឹក–៥ ល្ងាច)",
          {
            text: "ចូលរួមក្រុមជំនួយតេឡេក្រាម",
            link: "https://t.me/sok_leap_SL",
          },
        ],
      },
      communityAndFeedback: {
        title: "សហគមន៍ និងមតិយោបល់",
        description: "ចូលរួមជាមួយវេទិកាសហគមន៍ Farm Manager ដ៏រស់រវើកដើម្បីភ្ជាប់ទំនាក់ទំនងជាមួយកសិករទូទាំងពិភពលោក និងចែករំលែកមតិយោបល់របស់អ្នកដើម្បីជួយយើងកែលម្អវេទិកា។ ចូលរួមក្នុងការពិភាក្សា ផ្លាស់ប្តូរគន្លឹះ និងរួមចំណែកដល់ការរីកចម្រើនរបស់យើង។",
        content: [
          {
            subtitle: "ចូលរួមវេទិកាសហគមន៍",
            description: "ភ្ជាប់ជាមួយកសិករទូទាំងពិភពលោកនៅក្នុងវេទិកាសហគមន៍ Farm Manager�। ចែករំលែកគន្លឹះ ពិភាក្សាការអនុវត្តប្រកបដោយនិរន្តរភាព និងរៀនពីអ្នកប្រើប្រាស់ដែលមានបទពិសោធន៍។",
            paragraph: "វេទិកាសហគមន៍របស់យើងជាកន្លែងសម្រាប់ផ្លាស់ប្តូរគំនិត សួរសំណួរ និងសហការជាមួយកសិករដទៃទៀត។ ចូលរួមការពិភាក្សាលើការគ្រប់គ្រងដំណាំ ការអនុវត្តប្រកបដោយនិរន្តរភាព និងនិន្នាការកសិកម្មចុងក្រោយ។",
          },
          {
            subtitle: "ផ្តល់មតិយោបល់",
            description: "មតិរបស់អ្នកជួយឱ្យ Farm Manager រីកចម្រើន! ចែករំលែកយោបល់ សំណើមុខងារ ឬរាយការណ៍បញ្ហាដើម្បីកែលម្អបទពិសោធន៍របស់អ្នក។",
            paragraph: "យើងឱ្យតម្លៃលើមតិរបស់អ្នកដើម្បីធ្វើឱ្យ Farm Manager កាន់តែប្រសើរ។ មិនថាជាគំនិតថ្មី ការរាយការណ៍កំហុស ឬការផ្តល់យោបល់សម្រាប់ការកែលម្អទេ មតិរបស់អ្នកជួយយើងផ្តល់អាទិភាពដល់ការអាប់ដេត។",
          },
        ],
      },
      footer: "សូមអរគុណសម្រាប់ការជ្រើសរើស Farm Manager ដើម្បីផ្តល់អំណាចដល់ដំណើរកសិកម្មរបស់អ្នក។ យើងប្តេជ្ញាជួយអ្នករីកចម្រើនប្រកបដោយភាពឆ្លាតវៃ ខ្លាំងក្លា និងនិរន្តរភាព!",
      showMore: "បង្ហាញបន្ថែម",
      showLess: "បង្ហាញតិច",
    },
  };

  if (!['en', 'kh'].includes(language)) {
    console.warn(`Invalid language prop: ${language}. Falling back to English.`);
  }

  const data = content[language] || content.en;

  if (!data || !data.title) {
    console.error('Content data is invalid or missing title:', data);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="p-6 bg-red-50 text-red-600 rounded-lg shadow-md text-sm">
          Error: Unable to load support content. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-2xl font-bold text-green-800 sm:text-3xl bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
            {data.title}
          </h1>
          <p className="mt-4 text-sm text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {data.welcome}
          </p>
        </header>

        {/* Main Content */}
        <main className="space-y-8">
          {/* Getting Started */}
          <section className="bg-white rounded-xl p-6 sm:p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
            <h2 className="text-xl font-semibold text-green-700 mb-4">
              {data.gettingStarted.title}
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              {data.gettingStarted.description}
            </p>
            {showMore.gettingStarted ? (
              <ul className="list-disc list-inside text-sm text-gray-600 mb-6 space-y-2">
                {data.gettingStarted.list.map((item, index) => (
                  <li key={index} className="leading-relaxed">{item}</li>
                ))}
              </ul>
            ) : (
              <ul className="list-disc list-inside text-sm text-gray-600 mb-6 space-y-2">
                <li className="leading-relaxed">{data.gettingStarted.list[0]}</li>
              </ul>
            )}
            <button
              onClick={() => toggleShowMore('gettingStarted')}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors text-sm"
              aria-expanded={showMore.gettingStarted}
            >
              {showMore.gettingStarted ? data.showLess : data.showMore}
              <svg
                className={`ml-2 h-4 w-4 transform ${showMore.gettingStarted ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </section>

          {/* Farm Management Tools */}
          <section className="bg-white rounded-xl p-6 sm:p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
            <h2 className="text-xl font-semibold text-green-700 mb-4">
              {data.farmManagementTools.title}
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              {data.farmManagementTools.description}
            </p>
            {showMore.farmManagementTools && (
              <div className="space-y-6">
                {data.farmManagementTools.content.map((item, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-semibold text-green-600 mb-2">
                      {item.subtitle}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {item.description}
                    </p>
                    <p className="text-sm text-gray-600">
                      {item.paragraph}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => toggleShowMore('farmManagementTools')}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors mt-4 text-sm"
              aria-expanded={showMore.farmManagementTools}
            >
              {showMore.farmManagementTools ? data.showLess : data.showMore}
              <svg
                className={`ml-2 h-4 w-4 transform ${showMore.farmManagementTools ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </section>

          {/* Help and Troubleshooting */}
          <section className="bg-white rounded-xl p-6 sm:p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
            <h2 className="text-xl font-semibold text-green-700 mb-4">
              {data.helpAndTroubleshooting.title}
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              {data.helpAndTroubleshooting.description}
            </p>
            {showMore.helpAndTroubleshooting && (
              <div className="space-y-6">
                {data.helpAndTroubleshooting.content.map((section, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-semibold text-green-600 mb-2">
                      {section.subtitle}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {section.description}
                    </p>
                    <div className="space-y-4">
                      {section.items.map((item, idx) => (
                        <div key={idx}>
                          {section.subtitle === "Frequently Asked Questions (FAQs)" ||
                          section.subtitle === "សំណួរដែលសួរញឹកញាប់" ? (
                            <>
                              <p className="font-semibold text-gray-700 text-sm">
                                {item.question}
                              </p>
                              <p className="text-sm text-gray-600">
                                {item.answer}
                              </p>
                            </>
                          ) : (
                            <li className="list-disc list-inside text-sm text-gray-600">
                              {item}
                            </li>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => toggleShowMore('helpAndTroubleshooting')}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors mt-4 text-sm"
              aria-expanded={showMore.helpAndTroubleshooting}
            >
              {showMore.helpAndTroubleshooting ? data.showLess : data.showMore}
              <svg
                className={`ml-2 h-4 w-4 transform ${showMore.helpAndTroubleshooting ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </section>

          {/* Contact Support */}
          <section className="bg-white rounded-xl p-6 sm:p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
            <h2 className="text-xl font-semibold text-green-700 mb-4">
              {data.contact.title}
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              {data.contact.description}
            </p>
            <div className="space-y-2">
              {data.contact.details.map((item, index) => (
                <p key={index} className="text-sm text-gray-600">
                  {typeof item === 'string' ? (
                    item
                  ) : (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      aria-label={item.text}
                    >
                      {item.text}
                    </a>
                  )}
                </p>
              ))}
            </div>
          </section>

          {/* Community and Feedback */}
          <section className="bg-white rounded-xl p-6 sm:p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
            <h2 className="text-xl font-semibold text-green-700 mb-4">
              {data.communityAndFeedback.title}
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              {data.communityAndFeedback.description}
            </p>
            {showMore.communityAndFeedback && (
              <div className="space-y-6">
                {data.communityAndFeedback.content.map((item, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-semibold text-green-600 mb-2">
                      {item.subtitle}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {item.description}
                    </p>
                    <p className="text-sm text-gray-600">
                      {item.paragraph}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => toggleShowMore('communityAndFeedback')}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors mt-4 text-sm"
              aria-expanded={showMore.communityAndFeedback}
            >
              {showMore.communityAndFeedback ? data.showLess : data.showMore}
              <svg
                className={`ml-2 h-4 w-4 transform ${showMore.communityAndFeedback ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </section>
        </main>

        {/* Footer */}
        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>{data.footer}</p>
        </footer>
      </div>
    </div>
  );
};

Support.propTypes = {
  language: PropTypes.oneOf(['en', 'kh']),
};

Support.defaultProps = {
  language: 'en',
};

export default Support;