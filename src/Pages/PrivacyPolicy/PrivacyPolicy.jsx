import { Link } from "react-router";
import { MdShield, MdPerson, MdEmail } from "react-icons/md";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
        <div className="max-w-[1500px] mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-4">
            <MdShield className="text-4xl text-primary" />
            <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
          </div>
          <p className="text-gray-600 max-w-3xl">
            Last Updated: October 23, 2025
          </p>
          <p className="text-gray-600 max-w-3xl mt-2">
            Your privacy is important to us. This Privacy Policy explains how ShopSphere collects, uses, discloses, and safeguards your information.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1500px] mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          
          {/* Section 1 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-primary">1.</span> Information We Collect
            </h2>
            <div className="space-y-6 text-gray-700">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">1.1 Personal Information</h3>
                <p className="mb-3">We collect information that you provide directly to us, including:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Name, email address, phone number, and postal address</li>
                  <li>Account credentials (email and password)</li>
                  <li>Payment information (credit/debit card details, mobile banking information)</li>
                  <li>Profile information (profile picture, preferences, wishlist)</li>
                  <li>Business information for sellers (business name, tax ID, bank account details)</li>
                  <li>Delivery information for riders (vehicle details, driving license)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">1.2 Automatically Collected Information</h3>
                <p className="mb-3">When you use our platform, we automatically collect:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Device information (IP address, browser type, operating system)</li>
                  <li>Usage data (pages viewed, time spent, click patterns)</li>
                  <li>Location data (with your permission)</li>
                  <li>Cookies and similar tracking technologies</li>
                  <li>Transaction history and purchase behavior</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">1.3 Information from Third Parties</h3>
                <p>We may receive information from payment processors, delivery partners, social media platforms (if you connect your account), and fraud prevention services.</p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-primary">2.</span> How We Use Your Information
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>We use the collected information for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Service Delivery:</strong> To process orders, facilitate payments, and coordinate deliveries</li>
                <li><strong>Account Management:</strong> To create and manage your account, verify identity, and provide customer support</li>
                <li><strong>Platform Improvement:</strong> To analyze usage patterns, improve our services, and develop new features</li>
                <li><strong>Communication:</strong> To send order confirmations, shipping updates, promotional offers, and important notices</li>
                <li><strong>Security:</strong> To detect and prevent fraud, unauthorized access, and other illegal activities</li>
                <li><strong>Personalization:</strong> To provide personalized recommendations and content based on your preferences</li>
                <li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and legal processes</li>
                <li><strong>Marketing:</strong> To send promotional materials and advertisements (with your consent)</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-primary">3.</span> Information Sharing and Disclosure
            </h2>
            <div className="space-y-6 text-gray-700">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 With Your Consent</h3>
                <p>We may share your information with third parties when you give us explicit consent to do so.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2 Service Providers</h3>
                <p className="mb-3">We share information with trusted service providers who assist us in:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Payment processing (bKash, Nagad, SSL Commerz, banks)</li>
                  <li>Delivery services (courier partners and riders)</li>
                  <li>Cloud hosting and data storage</li>
                  <li>Email and SMS communication services</li>
                  <li>Analytics and marketing platforms</li>
                  <li>Customer support tools</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">3.3 Sellers and Buyers</h3>
                <p>We share necessary information between buyers, sellers, and riders to facilitate transactions, including names, contact details, and delivery addresses.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">3.4 Legal Requirements</h3>
                <p>We may disclose your information if required by law, court order, or government authority, or to protect our rights, property, or safety.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">3.5 Business Transfers</h3>
                <p>In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.</p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-primary">4.</span> Data Security
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>We implement robust security measures to protect your information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>SSL/TLS encryption for data transmission</li>
                <li>Encrypted storage of sensitive information</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Employee training on data protection</li>
                <li>Secure payment gateways compliant with PCI DSS standards</li>
              </ul>
              <p className="mt-4">However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.</p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-primary">5.</span> Your Rights and Choices
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>You have the following rights regarding your personal information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal obligations)</li>
                <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications at any time</li>
                <li><strong>Data Portability:</strong> Request your data in a structured, machine-readable format</li>
                <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
                <li><strong>Object:</strong> Object to processing based on legitimate interests</li>
              </ul>
              <p className="mt-4">To exercise these rights, please contact us at <a href="mailto:privacy@shopsphere.com" className="text-primary hover:underline">privacy@shopsphere.com</a></p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-primary">6.</span> Cookies and Tracking Technologies
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>We use cookies and similar technologies to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Remember your preferences and settings</li>
                <li>Authenticate your account and maintain sessions</li>
                <li>Analyze site traffic and user behavior</li>
                <li>Deliver personalized content and advertisements</li>
                <li>Improve platform performance and functionality</li>
              </ul>
              <p className="mt-4">You can control cookie preferences through your browser settings. However, disabling cookies may limit some features of our platform.</p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-primary">7.</span> Data Retention
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>We retain your personal information for as long as necessary to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide our services and fulfill transactions</li>
                <li>Comply with legal and regulatory requirements</li>
                <li>Resolve disputes and enforce our agreements</li>
                <li>Maintain business records and analytics</li>
              </ul>
              <p className="mt-4">When information is no longer needed, we securely delete or anonymize it. Account information is typically retained for 7 years after account closure as per Bangladesh legal requirements.</p>
            </div>
          </section>

          {/* Section 8 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-primary">8.</span> Children's Privacy
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>Our platform is not intended for children under 18 years of age. We do not knowingly collect personal information from children. If we become aware that we have collected information from a child without parental consent, we will take steps to delete that information promptly.</p>
              <p>Parents or guardians who believe their child has provided us with personal information should contact us immediately.</p>
            </div>
          </section>

          {/* Section 9 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-primary">9.</span> Third-Party Links
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>Our platform may contain links to third-party websites, plugins, and applications. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies before providing any personal information.</p>
            </div>
          </section>

          {/* Section 10 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-primary">10.</span> International Data Transfers
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>Your information may be transferred to and processed in countries other than Bangladesh. We ensure that such transfers comply with applicable data protection laws and that adequate safeguards are in place to protect your information.</p>
            </div>
          </section>

          {/* Section 11 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-primary">11.</span> Changes to This Privacy Policy
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of significant changes by:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Posting the updated policy on our platform</li>
                <li>Sending an email notification to registered users</li>
                <li>Displaying a prominent notice on our website</li>
              </ul>
              <p className="mt-4">Your continued use of our platform after changes become effective constitutes acceptance of the updated Privacy Policy.</p>
            </div>
          </section>

          {/* Section 12 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-primary">12.</span> Contact Us
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</p>
              <div className="bg-base-200 p-6 rounded-lg mt-4">
                <p className="font-semibold text-gray-900 mb-3">ShopSphere Privacy Team</p>
                <div className="space-y-2">
                  <p className="flex items-center gap-2">
                    <MdEmail className="text-primary" />
                    Email: <a href="mailto:privacy@shopsphere.com" className="text-primary hover:underline">privacy@shopsphere.com</a>
                  </p>
                  <p className="flex items-center gap-2">
                    <MdPerson className="text-primary" />
                    Address: House #123, Road #456, Dhaka 1212, Bangladesh
                  </p>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Back to Home */}
        <div className="mt-12 pt-8 border-t">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-primary hover:underline font-semibold"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;