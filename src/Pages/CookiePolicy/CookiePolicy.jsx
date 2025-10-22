import { Link } from "react-router";
import { MdCookie, MdSettings, MdSecurity, MdInfo } from "react-icons/md";
import { useState } from "react";

const CookiePolicy = () => {
  const [activeCategory, setActiveCategory] = useState("essential");

  const cookieCategories = [
    {
      id: "essential",
      name: "Essential Cookies",
      icon: <MdSecurity className="text-xl" />,
      description: "Required for basic site functionality",
      examples: [
        { name: "session_id", purpose: "Maintains your login session", duration: "Session" },
        { name: "csrf_token", purpose: "Security and form validation", duration: "Session" },
        { name: "cart_id", purpose: "Stores your shopping cart items", duration: "7 days" },
        { name: "user_preferences", purpose: "Remembers your language and currency settings", duration: "1 year" },
      ]
    },
    {
      id: "functional",
      name: "Functional Cookies",
      icon: <MdSettings className="text-xl" />,
      description: "Enhance site functionality and personalization",
      examples: [
        { name: "location_data", purpose: "Remembers your delivery location", duration: "30 days" },
        { name: "wishlist", purpose: "Stores your wishlist items", duration: "90 days" },
        { name: "recently_viewed", purpose: "Tracks recently viewed products", duration: "30 days" },
        { name: "ui_preferences", purpose: "Remembers display settings and preferences", duration: "1 year" },
      ]
    },
    {
      id: "analytics",
      name: "Analytics Cookies",
      icon: <MdInfo className="text-xl" />,
      description: "Help us understand how you use our site",
      examples: [
        { name: "_ga", purpose: "Google Analytics - tracks user behavior", duration: "2 years" },
        { name: "_gid", purpose: "Google Analytics - distinguishes users", duration: "24 hours" },
        { name: "analytics_session", purpose: "Tracks page views and interactions", duration: "30 minutes" },
        { name: "heatmap_data", purpose: "Records click patterns for site improvement", duration: "1 year" },
      ]
    },
    {
      id: "marketing",
      name: "Marketing Cookies",
      icon: <MdCookie className="text-xl" />,
      description: "Used to deliver relevant advertisements",
      examples: [
        { name: "fb_pixel", purpose: "Facebook advertising and retargeting", duration: "90 days" },
        { name: "google_ads", purpose: "Google Ads conversion tracking", duration: "90 days" },
        { name: "user_segment", purpose: "Categorizes users for targeted content", duration: "6 months" },
        { name: "ad_preferences", purpose: "Stores advertising preferences", duration: "1 year" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
        <div className="max-w-[1500px] px-4 py-8 mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <MdCookie className="text-4xl text-primary" />
            <h1 className="text-4xl font-bold text-gray-900">Cookie Policy</h1>
          </div>
          <p className="text-gray-600 max-w-3xl">
            Last Updated: October 23, 2025
          </p>
          <p className="text-gray-600 max-w-3xl mt-2">
            This Cookie Policy explains how ShopSphere uses cookies and similar tracking technologies on our platform.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1500px] px-4 py-8 mx-auto">
        <div className="prose prose-lg max-w-none">
          
          {/* Introduction */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-primary">1.</span> What Are Cookies?
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Cookies are small text files that are placed on your device (computer, smartphone, tablet) when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.
              </p>
              <p>
                Cookies help us understand how you use our platform, remember your preferences, and improve your overall experience. They enable essential features like keeping you logged in and remembering items in your shopping cart.
              </p>
              <div className="bg-blue-50 border-l-4 border-primary p-4 rounded">
                <p className="text-sm font-semibold text-gray-900 mb-2">Important Note:</p>
                <p className="text-sm text-gray-700">
                  Most web browsers automatically accept cookies, but you can modify your browser settings to decline cookies if you prefer. However, this may prevent you from taking full advantage of our platform.
                </p>
              </div>
            </div>
          </section>

          {/* Types of Cookies */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-primary">2.</span> Types of Cookies We Use
            </h2>
            <div className="space-y-6 text-gray-700">
              <p className="mb-6">
                We use different types of cookies to provide, secure, and improve our services. Below is a detailed explanation of each category:
              </p>

              {/* Cookie Category Tabs */}
              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-2 lg:grid-cols-4 bg-base-200">
                  {cookieCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`p-4 text-left transition-all duration-200 border-b-2 ${
                        activeCategory === category.id
                          ? "bg-white border-primary text-primary font-semibold"
                          : "border-transparent hover:bg-base-300"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {category.icon}
                        <span className="text-sm font-medium">{category.name}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{category.description}</p>
                    </button>
                  ))}
                </div>

                {/* Active Category Content */}
                <div className="p-6 bg-white">
                  {cookieCategories.map((category) => (
                    activeCategory === category.id && (
                      <div key={category.id} className="space-y-4">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-3 bg-primary/10 text-primary rounded-full">
                            {category.icon}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
                            <p className="text-sm text-gray-600">{category.description}</p>
                          </div>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-base-200">
                                <th className="text-left p-3 font-semibold text-sm text-gray-900 border">Cookie Name</th>
                                <th className="text-left p-3 font-semibold text-sm text-gray-900 border">Purpose</th>
                                <th className="text-left p-3 font-semibold text-sm text-gray-900 border">Duration</th>
                              </tr>
                            </thead>
                            <tbody>
                              {category.examples.map((cookie, index) => (
                                <tr key={index} className="hover:bg-base-100 transition-colors">
                                  <td className="p-3 text-sm border font-mono text-primary">{cookie.name}</td>
                                  <td className="p-3 text-sm border text-gray-700">{cookie.purpose}</td>
                                  <td className="p-3 text-sm border text-gray-700">{cookie.duration}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* First vs Third Party */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-primary">3.</span> First-Party vs. Third-Party Cookies
            </h2>
            <div className="space-y-6 text-gray-700">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-base-200 p-6 rounded-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">First-Party Cookies</h3>
                  <p className="mb-3">
                    These cookies are set directly by ShopSphere and can only be read by our website.
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-sm">
                    <li>Essential for platform functionality</li>
                    <li>Store your preferences and settings</li>
                    <li>Manage your shopping cart and wishlist</li>
                    <li>Keep you logged into your account</li>
                    <li>Remember your language and currency choices</li>
                  </ul>
                </div>

                <div className="bg-base-200 p-6 rounded-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Third-Party Cookies</h3>
                  <p className="mb-3">
                    These cookies are set by external services we use to enhance our platform.
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-sm">
                    <li>Google Analytics for usage analysis</li>
                    <li>Payment processors for secure transactions</li>
                    <li>Social media platforms for sharing features</li>
                    <li>Advertising networks for targeted ads</li>
                    <li>Customer support chat tools</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Session vs Persistent */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-primary">4.</span> Session vs. Persistent Cookies
            </h2>
            <div className="space-y-6 text-gray-700">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Session Cookies (Temporary)</h3>
                <p className="mb-3">
                  Session cookies are temporary and are deleted when you close your browser. They are essential for:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Maintaining your active session while browsing</li>
                  <li>Keeping items in your cart during your visit</li>
                  <li>Managing security during your session</li>
                  <li>Enabling navigation through multiple pages</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Persistent Cookies (Stored)</h3>
                <p className="mb-3">
                  Persistent cookies remain on your device for a set period or until you delete them. They help us:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Remember you when you return to our platform</li>
                  <li>Keep you logged in across multiple sessions</li>
                  <li>Store your preferences and settings</li>
                  <li>Provide personalized recommendations</li>
                  <li>Track your interactions over time for analytics</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Cookies */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-primary">5.</span> How We Use Cookies
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>ShopSphere uses cookies for the following purposes:</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-base-100 border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">🔐 Authentication & Security</h4>
                  <p className="text-sm">Verify your identity, maintain secure sessions, and protect against fraud and unauthorized access.</p>
                </div>

                <div className="bg-base-100 border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">🛒 Shopping Experience</h4>
                  <p className="text-sm">Remember items in your cart and wishlist, store delivery preferences, and enable quick checkout.</p>
                </div>

                <div className="bg-base-100 border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">⚙️ Platform Functionality</h4>
                  <p className="text-sm">Enable core features, remember your preferences, and provide a personalized browsing experience.</p>
                </div>

                <div className="bg-base-100 border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">📊 Analytics & Performance</h4>
                  <p className="text-sm">Analyze how our platform is used, identify popular products, and improve site performance and user experience.</p>
                </div>

                <div className="bg-base-100 border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">🎯 Personalization</h4>
                  <p className="text-sm">Provide product recommendations, customized content, and relevant offers based on your interests.</p>
                </div>

                <div className="bg-base-100 border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">📢 Advertising</h4>
                  <p className="text-sm">Deliver targeted advertisements, measure ad effectiveness, and show you relevant promotions across the web.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Third-Party Services */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-primary">6.</span> Third-Party Services
            </h2>
            <div className="space-y-6 text-gray-700">
              <p>We work with trusted third-party services that may use cookies on our platform:</p>
              
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-bold text-gray-900 mb-2">Google Analytics</h4>
                  <p className="text-sm mb-2">Helps us understand how visitors use our platform and improve user experience.</p>
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                    Google Privacy Policy →
                  </a>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-bold text-gray-900 mb-2">Facebook Pixel</h4>
                  <p className="text-sm mb-2">Enables us to measure advertising effectiveness and deliver relevant ads on Facebook.</p>
                  <a href="https://www.facebook.com/privacy/explanation" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                    Facebook Privacy Policy →
                  </a>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-bold text-gray-900 mb-2">Google Ads</h4>
                  <p className="text-sm mb-2">Allows us to show targeted advertisements and track conversion from ads.</p>
                  <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                    Google Ads Policy →
                  </a>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-bold text-gray-900 mb-2">Payment Processors</h4>
                  <p className="text-sm mb-2">Services like bKash, Nagad, and SSL Commerz use cookies to process secure payments.</p>
                  <p className="text-sm text-gray-600">Please refer to individual payment processor privacy policies for more information.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Managing Cookies */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-primary">7.</span> Managing Your Cookie Preferences
            </h2>
            <div className="space-y-6 text-gray-700">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Browser Settings</h3>
                <p className="mb-4">
                  You can control and manage cookies through your browser settings. Most browsers allow you to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>View which cookies are stored on your device</li>
                  <li>Delete all cookies or specific cookies</li>
                  <li>Block third-party cookies</li>
                  <li>Block cookies from specific websites</li>
                  <li>Accept cookies only from sites you're currently visiting</li>
                  <li>Set your browser to notify you when a cookie is set</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <p className="text-sm font-semibold text-gray-900 mb-2">⚠️ Impact of Blocking Cookies:</p>
                <p className="text-sm text-gray-700">
                  If you choose to block or delete cookies, some features of ShopSphere may not function properly. You may be unable to add items to your cart, complete purchases, or access your account. Essential cookies cannot be disabled as they are required for the platform to function.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Browser-Specific Instructions</h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Google Chrome:</strong> Settings → Privacy and security → Cookies and other site data
                  </p>
                  <p className="text-sm">
                    <strong>Mozilla Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data
                  </p>
                  <p className="text-sm">
                    <strong>Safari:</strong> Preferences → Privacy → Manage Website Data
                  </p>
                  <p className="text-sm">
                    <strong>Microsoft Edge:</strong> Settings → Cookies and site permissions → Manage and delete cookies
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Opt-Out of Targeted Advertising</h3>
                <p className="mb-3">You can opt out of targeted advertising through:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Your Google Ads settings at <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">adssettings.google.com</a></li>
                  <li>Your Facebook ad preferences in your account settings</li>
                  <li>Industry opt-out tools like <a href="http://optout.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">optout.aboutads.info</a></li>
                  <li>Your device's advertising ID settings (iOS/Android)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Do Not Track */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-primary">8.</span> Do Not Track Signals
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Some browsers have a "Do Not Track" (DNT) feature that signals websites you visit that you do not want your online activities tracked. Currently, there is no universal standard for how DNT signals should be interpreted.
              </p>
              <p>
                ShopSphere does not currently respond to DNT signals. However, you can manage your cookie preferences through your browser settings as described in the previous section.
              </p>
            </div>
          </section>

          {/* Mobile Devices */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-primary">9.</span> Mobile Devices and Apps
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                When you use our mobile app or access our platform through a mobile browser, we may use similar technologies to cookies to collect information and enhance your experience.
              </p>
              <p className="mb-3">You can manage these settings through:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>iOS:</strong> Settings → Privacy → Advertising → Limit Ad Tracking</li>
                <li><strong>Android:</strong> Settings → Google → Ads → Opt out of Ads Personalization</li>
                <li><strong>App Permissions:</strong> Manage location, notification, and data access permissions in your device settings</li>
              </ul>
            </div>
          </section>

          {/* Updates to Policy */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-primary">10.</span> Changes to This Cookie Policy
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                We may update this Cookie Policy from time to time to reflect changes in technology, legislation, our business practices, or for other operational, legal, or regulatory reasons.
              </p>
              <p>
                When we make significant changes, we will notify you by posting a prominent notice on our platform or sending you an email notification. We encourage you to review this policy periodically to stay informed about how we use cookies.
              </p>
              <p>
                The "Last Updated" date at the top of this page indicates when this policy was last revised.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-primary">11.</span> Contact Us
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>If you have any questions about our use of cookies or this Cookie Policy, please contact us:</p>
              <div className="bg-base-200 p-6 rounded-lg mt-4">
                <p className="font-semibold text-gray-900 mb-3">ShopSphere Cookie & Privacy Team</p>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Email:</strong> <a href="mailto:privacy@shopsphere.com" className="text-primary hover:underline">privacy@shopsphere.com</a>
                  </p>
                  <p>
                    <strong>Support:</strong> <a href="mailto:support@shopsphere.com" className="text-primary hover:underline">support@shopsphere.com</a>
                  </p>
                  <p>
                    <strong>Address:</strong> House #123, Road #456, Dhaka 1212, Bangladesh
                  </p>
                  <p>
                    <strong>Phone:</strong> <a href="tel:+8801234567890" className="text-primary hover:underline">+880 1234 567 890</a>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Related Policies */}
          <section className="mb-12 bg-primary/5 border-l-4 border-primary p-6 rounded">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Related Policies</h3>
            <p className="text-gray-700 mb-4">
              For more information about how we protect your privacy and handle your data, please review:
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/privacy-policy" className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-lg border hover:border-primary hover:text-primary transition-colors font-medium">
                Privacy Policy →
              </Link>
              <Link to="/terms-conditions" className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-lg border hover:border-primary hover:text-primary transition-colors font-medium">
                Terms & Conditions →
              </Link>
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

export default CookiePolicy;