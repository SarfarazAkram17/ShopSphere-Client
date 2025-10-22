import { Link } from "react-router";
import { MdGavel, MdShoppingCart, MdStore, MdLocalShipping } from "react-icons/md";

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
        <div className="max-w-[1500px] mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-4">
            <MdGavel className="text-4xl text-primary" />
            <h1 className="text-4xl font-bold text-gray-900">Terms & Conditions</h1>
          </div>
          <p className="text-gray-600 max-w-3xl">
            Last Updated: October 23, 2025
          </p>
          <p className="text-gray-600 max-w-3xl mt-2">
            Please read these Terms and Conditions carefully before using ShopSphere. By accessing or using our platform, you agree to be bound by these terms.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1500px] mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          
          {/* Section 1 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-primary">1.</span> Acceptance of Terms
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>By accessing or using ShopSphere ("Platform," "Service," "we," "us," or "our"), you agree to comply with and be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our Platform.</p>
              <p>These terms apply to all users, including customers, sellers, riders, and visitors. Additional terms may apply to specific services, which will be presented to you at the time of use.</p>
              <p>We reserve the right to modify these terms at any time. Your continued use of the Platform after changes constitutes acceptance of the modified terms.</p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-primary">2.</span> Eligibility and Account Registration
            </h2>
            <div className="space-y-6 text-gray-700">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 Age Requirement</h3>
                <p>You must be at least 18 years old to use our Platform. By registering an account, you represent and warrant that you are of legal age to form a binding contract.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 Account Creation</h3>
                <p className="mb-3">When creating an account, you agree to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and promptly update your account information</li>
                  <li>Keep your password secure and confidential</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized access</li>
                  <li>Not create multiple accounts or transfer your account to others</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">2.3 Account Types</h3>
                <p className="mb-3">ShopSphere offers three types of accounts:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Customer Account:</strong> For purchasing products</li>
                  <li><strong>Seller Account:</strong> For listing and selling products (requires verification and approval)</li>
                  <li><strong>Rider Account:</strong> For providing delivery services (requires verification and approval)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">2.4 Account Suspension and Termination</h3>
                <p>We reserve the right to suspend or terminate your account if you violate these terms, engage in fraudulent activity, or for any other reason we deem necessary to protect our Platform and users.</p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MdShoppingCart className="text-primary" />
              <span className="text-primary">3.</span> Customer Terms
            </h2>
            <div className="space-y-6 text-gray-700">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 Purchasing Products</h3>
                <p>When you place an order, you are making an offer to purchase products. All orders are subject to acceptance by the seller. We reserve the right to refuse or cancel any order for any reason.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2 Pricing and Payment</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>All prices are displayed in Bangladeshi Taka (BDT)</li>
                  <li>Prices are set by individual sellers and may change without notice</li>
                  <li>You agree to pay the total amount including product price, delivery charges, and applicable taxes</li>
                  <li>Payment must be made through approved payment methods</li>
                  <li>We are not responsible for additional charges from payment processors or banks</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">3.3 Order Cancellation</h3>
                <p>You may cancel orders before they are shipped, subject to the seller's cancellation policy. Refunds will be processed according to our refund policy.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">3.4 Returns and Refunds</h3>
                <p className="mb-3">Return and refund policies are determined by individual sellers, but must meet our minimum standards:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Defective or damaged products must be accepted for return</li>
                  <li>Wrong items shipped must be replaced or refunded</li>
                  <li>Returns must be initiated within 7 days of delivery</li>
                  <li>Products must be in original condition with tags/packaging</li>
                  <li>Refunds will be processed within 7-14 business days</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">3.5 Product Reviews</h3>
                <p>You may leave reviews for purchased products. Reviews must be honest, relevant, and not contain offensive, defamatory, or promotional content. We reserve the right to remove reviews that violate our guidelines.</p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MdStore className="text-primary" />
              <span className="text-primary">4.</span> Seller Terms
            </h2>
            <div className="space-y-6 text-gray-700">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">4.1 Seller Obligations</h3>
                <p className="mb-3">As a seller, you agree to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate product descriptions, images, and pricing</li>
                  <li>Only list products you are legally authorized to sell</li>
                  <li>Ensure products meet quality and safety standards</li>
                  <li>Process orders promptly and ship within promised timeframes</li>
                  <li>Respond to customer inquiries within 24 hours</li>
                  <li>Honor your stated return and refund policies</li>
                  <li>Maintain adequate inventory levels</li>
                  <li>Comply with all applicable laws and regulations</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">4.2 Prohibited Products</h3>
                <p className="mb-3">You may not list or sell:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Counterfeit, replica, or unauthorized products</li>
                  <li>Illegal drugs, weapons, or hazardous materials</li>
                  <li>Stolen goods or products violating intellectual property rights</li>
                  <li>Adult content, tobacco, or alcohol (without proper licensing)</li>
                  <li>Expired food, medications, or cosmetics</li>
                  <li>Products that violate any laws of Bangladesh</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">4.3 Fees and Commissions</h3>
                <p>ShopSphere charges a commission on each sale. The commission structure will be provided during seller registration. Fees are subject to change with 30 days notice. Payment to sellers will be processed according to our payment schedule, typically within 7-14 days after delivery confirmation.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">4.4 Performance Standards</h3>
                <p className="mb-3">Sellers must maintain:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Minimum order fulfillment rate of 95%</li>
                  <li>Maximum cancellation rate of 5%</li>
                  <li>Minimum customer satisfaction rating of 4.0/5.0</li>
                  <li>Response time under 24 hours</li>
                </ul>
                <p className="mt-3">Failure to meet these standards may result in account suspension or termination.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">4.5 Taxes</h3>
                <p>Sellers are responsible for all applicable taxes, including VAT, income tax, and business taxes. We may collect and remit taxes on your behalf where required by law.</p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MdLocalShipping className="text-primary" />
              <span className="text-primary">5.</span> Rider Terms
            </h2>
            <div className="space-y-6 text-gray-700">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">5.1 Rider Requirements</h3>
                <p className="mb-3">To become a rider, you must:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Be at least 18 years old</li>
                  <li>Possess a valid driving license</li>
                  <li>Have a reliable vehicle (bicycle, motorcycle, or car)</li>
                  <li>Maintain valid vehicle registration and insurance</li>
                  <li>Pass background verification checks</li>
                  <li>Have a smartphone with GPS capabilities</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">5.2 Rider Responsibilities</h3>
                <p className="mb-3">As a rider, you agree to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Accept and complete delivery assignments promptly</li>
                  <li>Handle packages with care and ensure safe delivery</li>
                  <li>Maintain professional conduct with customers and sellers</li>
                  <li>Follow all traffic laws and safety regulations</li>
                  <li>Keep your vehicle in good working condition</li>
                  <li>Update delivery status in real-time</li>
                  <li>Verify recipient identity before handover</li>
                  <li>Report any issues or incidents immediately</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">5.3 Payment and Earnings</h3>
                <p>Riders earn fees per delivery based on distance, package size, and other factors. Payment will be processed weekly or bi-weekly. Tips from customers belong to the rider.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">5.4 Independent Contractor Status</h3>
                <p>Riders are independent contractors, not employees of ShopSphere. You are responsible for your own taxes, insurance, and expenses. ShopSphere does not provide employment benefits.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">5.5 Performance Standards</h3>
                <p className="mb-3">Riders must maintain:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Minimum acceptance rate of 80%</li>
                  <li>Minimum completion rate of 95%</li>
                  <li>Average customer rating of 4.5/5.0 or higher</li>
                  <li>On-time delivery rate of 90% or higher</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-primary">6.</span> Intellectual Property
            </h2>
            <div className="space-y-6 text-gray-700">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">6.1 Platform Content</h3>
                <p>All content on ShopSphere, including text, graphics, logos, images, software, and design, is owned by ShopSphere or our licensors and protected by intellectual property laws. You may not copy, reproduce, distribute, or create derivative works without our written permission.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">6.2 User Content</h3>
                <p>By posting content (product listings, reviews, photos, etc.), you grant ShopSphere a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display that content. You retain ownership of your content but are responsible for ensuring you have the right to post it.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">6.3 Trademark</h3>
                <p>ShopSphere, our logo, and other marks are trademarks of ShopSphere. You may not use our trademarks without prior written consent.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">6.4 Copyright Infringement</h3>
                <p>If you believe your intellectual property rights have been violated, please contact us at <a href="mailto:legal@shopsphere.com" className="text-primary hover:underline">legal@shopsphere.com</a> with detailed information about the alleged infringement.</p>
              </div>
            </div>
          </section>

          {/* Section 7 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-primary">7.</span> Prohibited Conduct
            </h2>
            <div className="space-y-4 text-gray-700">
              <p className="mb-3">You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights of others</li>
                <li>Post false, misleading, or deceptive content</li>
                <li>Engage in fraudulent activities or scams</li>
                <li>Harass, threaten, or abuse other users</li>
                <li>Manipulate reviews or ratings</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Use automated systems (bots, scrapers) without permission</li>
                <li>Interfere with the proper functioning of the Platform</li>
                <li>Collect user information without consent</li>
                <li>Spam or send unsolicited communications</li>
                <li>Impersonate others or misrepresent your affiliation</li>
                <li>Circumvent security measures or exploit vulnerabilities</li>
              </ul>
            </div>
          </section>

          {/* Section 8 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-primary">8.</span> Disclaimers and Limitation of Liability
            </h2>
            <div className="space-y-6 text-gray-700">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">8.1 Platform "As Is"</h3>
                <p>ShopSphere is provided "as is" and "as available" without warranties of any kind, express or implied. We do not warrant that the Platform will be uninterrupted, error-free, or secure.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">8.2 Third-Party Transactions</h3>
                <p>ShopSphere is a marketplace platform connecting buyers, sellers, and riders. We are not a party to transactions between users and are not responsible for the quality, safety, legality, or accuracy of products listed. Disputes should be resolved directly between the parties involved.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">8.3 Limitation of Liability</h3>
                <p>To the fullest extent permitted by law, ShopSphere and its officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising from your use of the Platform.</p>
                <p className="mt-3">Our total liability to you for any claim arising from these terms or your use of the Platform shall not exceed the amount you paid to us in the 12 months preceding the claim, or BDT 10,000, whichever is less.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">8.4 User Disputes</h3>
                <p>You are solely responsible for your interactions with other users. We reserve the right, but have no obligation, to monitor or mediate disputes between users.</p>
              </div>
            </div>
          </section>

          {/* Section 9 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-primary">9.</span> Indemnification
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>You agree to indemnify, defend, and hold harmless ShopSphere and its affiliates, officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses (including legal fees) arising from:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your violation of these Terms and Conditions</li>
                <li>Your violation of any law or rights of a third party</li>
                <li>Your use of the Platform</li>
                <li>Content you post on the Platform</li>
                <li>Products you sell or deliver through the Platform</li>
              </ul>
            </div>
          </section>

          {/* Section 10 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-primary">10.</span> Dispute Resolution
            </h2>
            <div className="space-y-6 text-gray-700">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">10.1 Governing Law</h3>
                <p>These Terms and Conditions shall be governed by and construed in accordance with the laws of Bangladesh.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">10.2 Dispute Resolution Process</h3>
                <p className="mb-3">In the event of a dispute:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Step 1:</strong> Contact our customer support to attempt informal resolution</li>
                  <li><strong>Step 2:</strong> If unresolved, engage in good-faith mediation</li>
                  <li><strong>Step 3:</strong> If mediation fails, disputes shall be resolved through arbitration in Dhaka, Bangladesh</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">10.3 Jurisdiction</h3>
                <p>For any disputes not subject to arbitration, you agree to submit to the exclusive jurisdiction of the courts located in Dhaka, Bangladesh.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">10.4 Class Action Waiver</h3>
                <p>You agree to resolve disputes with us on an individual basis and waive any right to participate in class action lawsuits or class-wide arbitration.</p>
              </div>
            </div>
          </section>

          {/* Section 11 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-primary">11.</span> Privacy and Data Protection
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>Your use of ShopSphere is subject to our Privacy Policy, which describes how we collect, use, and protect your personal information. By using our Platform, you consent to our data practices as described in the Privacy Policy.</p>
              <p>You can review our full Privacy Policy at <Link to="/privacy-policy" className="text-primary hover:underline">/privacy-policy</Link>.</p>
            </div>
          </section>

          {/* Section 12 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-primary">12.</span> Modifications to Terms
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>We reserve the right to modify these Terms and Conditions at any time. When we make changes, we will:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Update the "Last Updated" date at the top of this page</li>
                <li>Notify registered users via email</li>
                <li>Display a prominent notice on our Platform</li>
              </ul>
              <p className="mt-4">Your continued use of the Platform after modifications become effective constitutes acceptance of the updated terms. If you do not agree to the modified terms, you must stop using the Platform.</p>
            </div>
          </section>

          {/* Section 13 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-primary">13.</span> Termination
            </h2>
            <div className="space-y-6 text-gray-700">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">13.1 Termination by You</h3>
                <p>You may terminate your account at any time by contacting customer support or through your account settings. Upon termination, you remain liable for all outstanding obligations.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">13.2 Termination by Us</h3>
                <p>We may suspend or terminate your account immediately, without notice, if:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You violate these Terms and Conditions</li>
                  <li>You engage in fraudulent or illegal activities</li>
                  <li>Your account remains inactive for an extended period</li>
                  <li>We are required to do so by law</li>
                  <li>Continuing your access poses risks to other users or the Platform</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">13.3 Effect of Termination</h3>
                <p>Upon termination, your right to use the Platform will immediately cease. We may delete your data and content, though some information may be retained as required by law or for legitimate business purposes.</p>
              </div>
            </div>
          </section>

          {/* Section 14 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-primary">14.</span> General Provisions
            </h2>
            <div className="space-y-6 text-gray-700">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">14.1 Entire Agreement</h3>
                <p>These Terms and Conditions, together with our Privacy Policy and any additional terms you agree to, constitute the entire agreement between you and ShopSphere.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">14.2 Severability</h3>
                <p>If any provision of these terms is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">14.3 Waiver</h3>
                <p>Our failure to enforce any right or provision of these terms shall not constitute a waiver of such right or provision.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">14.4 Assignment</h3>
                <p>You may not assign or transfer these terms or your account without our prior written consent. We may assign our rights and obligations without restriction.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">14.5 Force Majeure</h3>
                <p>We shall not be liable for any failure or delay in performance due to circumstances beyond our reasonable control, including natural disasters, war, terrorism, labor disputes, or government actions.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">14.6 Language</h3>
                <p>These Terms and Conditions are written in English. Any translations are provided for convenience only. In case of conflict, the English version shall prevail.</p>
              </div>
            </div>
          </section>

          {/* Section 15 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-primary">15.</span> Contact Information
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>If you have any questions about these Terms and Conditions, please contact us:</p>
              <div className="bg-base-200 p-6 rounded-lg mt-4">
                <p className="font-semibold text-gray-900 mb-3">ShopSphere Legal Department</p>
                <div className="space-y-2">
                  <p><strong>Email:</strong> <a href="mailto:legal@shopsphere.com" className="text-primary hover:underline">legal@shopsphere.com</a></p>
                  <p><strong>Customer Support:</strong> <a href="mailto:support@shopsphere.com" className="text-primary hover:underline">support@shopsphere.com</a></p>
                  <p><strong>Phone:</strong> <a href="tel:+8801234567890" className="text-primary hover:underline">+880 1234 567 890</a></p>
                  <p><strong>Address:</strong> House #123, Road #456, Dhaka 1212, Bangladesh</p>
                </div>
              </div>
            </div>
          </section>

          {/* Acknowledgment */}
          <section className="mb-12 bg-primary/5 border-l-4 border-primary p-6 rounded">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Acknowledgment</h3>
            <p className="text-gray-700">
              By using ShopSphere, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please discontinue use of our Platform immediately.
            </p>
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

export default TermsConditions;