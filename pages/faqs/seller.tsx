import AppLayout from "@layouts/AppLayout";
import { NextSeo } from "next-seo";
import React from "react";
import { Element } from "react-scroll";
import GridLayout from "src/containers/GridLayout";

function SellerFAQs() {
  const tabs = [
    "Bank Verification Number Policy (BVN)",
    "Commissions",
    "Product Creation Guidelines",
    "Value Added Services (VAS)",
    "Vendor Self Drop Off Process",
    "Fulfillment Method Guidelines",
    "Return Guidelines",
    "Promo Type",
    "Promotion Guidelines",
    "Payment Terms, Conditions, and Payment Schedule",
    "Sales and Order Regulation",
    "Guideline Changes Communication",
  ];

  const faqs = [
    {
      heading: "Bank Verification Number Policy (BVN)",
      paragraph: `- Objective: BVN verification mandatory for all vendors to enhance security and trust in financial transactions. 
      - Verification Process: Our process is quite simple, we validate vendor’s BVN through the National Identity Management Commission. 
      - Action Required: Vendors should update their BVN in the seller profile settings under "Bank Account." 
      - Data Protection: We ensure strict data protection and compliance with data privacy regulatory bodies when handling your BVN information. 
      - Suspension Policy: There would be a temporary suspension for vendors who fail to provide or maintain a valid BVN. 
      - Audit and Compliance: We would regularly audit and assess BVN compliance to maintain data accuracy.`,
    },
    {
      heading: "Commissions",
      paragraph: `- Objective: Established a transparent commission structure based on product categories. 
    - Action Required: Vendors are to review the commission structure in "Your Profile" under "Commissions" in Seller Center. 
    - Payment Schedule: Disbursement into vendor wallets takes place after buyers have successfully received the product at their end and confirm its quality. Details of this can be found on Settings >> Your Profile >> Commissions >> Payment Schedule 
    - Dispute Resolution: There is a dispute resolution mechanism in place for commission-related issues, allowing vendors to appeal or request reviews. 
    - Performance Metrics: There are well defined key performance metrics that influence commission rates and encourage vendors to excel as well. Details of this can be found on Settings >> Your Profile >> Commissions >> Performance Metrics 
    `,
    },
    {
      heading: "Product Creation Guidelines",
      paragraph: `- Objective: Ensure compliance with Niteon’s expectations for product listings and content.
    - Vendors are responsible for creating compliant product listings.
    - Adhere to image guidelines and utilize the resizing tool for images. 
    - Image count requirements: Vendors have the option of uploading up to 10 images for each product and a minimum of 4 images. Watermarked images are not allowed. 
    - Image size: Maximum file size is 1MB to be uploaded in JPEG, PNG and GIF formats. Only clean images that perfectly showcase the product will be accepted. 
    - Image dimensions: 680x680 pixels is our standard and acceptable image size. If your image is between 1000 x 1000 and 2000 x 2000 pixels. We implore you to use the crop tool of your phone gallery to re-size, rotate and crop your images. To access this tool just click on the pencil button on the top left corner of each image you upload (illustrated below).
    - Image Usage: First image to be uploaded will be the main image of your product on our platform. So the image should be the front view of the product. 
    - Content Ownership: Vendors are to be the sole owner of their product content, images, and descriptions, and not third parties. 
    - Compliance Check: We would continue to regularly check to ensure that listed products meet the guidelines.
    - Product Removal: Any product that doesn’t meet our stated guidelines will be delisted for non-compliant and categorized under prohibited products. 
    `,
    },
    {
      heading: "Value Added Services (VAS)",
      paragraph: `- Objective: Offer premium services like Niteon Express to boost sales and facilitate order fulfillment. 
    - Action Required: Explore and opt for value-added services, including Niteon Express. 
    - Niteon ranking analytics: This is a premium service that will grow your sales by making pop up first anytime a product in its category is searched. 
    - Niteon house: This will store, pack and ship your items directly to your customers at a pocket friendly fee. 
    - Niteon Bank: This provides vendors with loans to meet production and product supply targets at 5% interest. 
    `,
    },
    {
      heading: "Vendor Self Drop Off Process",
      paragraph: `- Objective: Streamline and expedite package drop-off for vendors. 
    - Documentation: Vendors are to provide necessary documentation during drop-off, including invoices and packing slips. 
    - Quality Assessment: Product must have a quality score of 100%; hence quality checks will be conducted on product during the drop-off process to ensure the condition of products. 
    - Qualification: Vendors must be processing a minimum of 10 items monthly. 
    - Designated Location: We currently have 1 location for product drop off which is situated at… 
    - Confirmation Receipt: We issue confirmation receipts to vendors upon successful drop-off, serving as proof of delivery. 
    - Appointment System: We have an appointment system in place to manage vendor drop-offs efficiently. Lodge in your drop-offs day and time here. 
    - Feedback Channel: There is a feedback channel for vendors to report any issues during the drop-off process which can be done here. 
    `,
    },
    {
      heading: "Fulfillment Method Guidelines",
      paragraph: `- Process Time: Orders must be processed within 24 hours of receiving them, excluding weekends and holidays. Please ensure all orders are reviewed, packed, and prepared for shipping within this timeframe.
    - Out of Stock / unavailability: If a vendor runs out of stock for a product, they can cancel the order and provide a clear explanation. In case a product is damaged or unavailable, vendors must cancel the order and communicate this to the customer.
    - Pricing Errors: If a pricing error occurs, the vendor should cancel the order and inform the customer.
    - Cancelation: Vendors should strive to fulfill all confirmed orders promptly. If a vendor needs to cancel an order due to unforeseen circumstances, they must provide a valid reason. 
    - Penalties for Frequent Cancellations: Excessive order cancellations without valid reasons may result in penalties such as reduced visibility in search results or temporary suspension of the vendor's account. Vendors should maintain a low cancellation rate to enhance their credibility.
    - Stock Management: Vendors must regularly update their stock availability on our platform to minimize the risk of selling products that are out of stock. 
    - Appeals: If a vendor believes a cancellation decision was unfair, they may appeal by contacting our vendor support team. 
    - Customer Communication (Proactive Updates): In case of any delays, issues, or changes to the order status, vendors must proactively communicate with the us. So that we can keep the customers informed to foster trust and help manage expectations. 
    - Shipping Partners: To make order processing easier, we’ve partnered with some notable logistics companies such as DHL, American Express and FedEx.`,
    },
    {
      heading: "Return Guidelines",
      paragraph: `- Acceptance of Returns: Vendors are expected to accept returns for products that meet our return eligibility criteria. Returns should be initiated by customers within 24 hours of receiving the product. Products eligible for return include those damaged during shipping, defective, or not as described.
    - Return Shipping Costs: If the return is due to a vendor error (e.g., wrong item shipped), the vendor would bear the return shipping costs. If the return is due to customer preference (e.g., no longer wanted), the customer may be responsible for return shipping costs.
    - Return Inspection and Approval: Upon receiving a returned product, vendors should inspect it within 48 hours of receipt. If the product meets the eligibility criteria, vendors should approve the return. If the product does not meet the eligibility criteria, vendors should provide a clear explanation to the customer. 
    - Refunds and Replacements: Once a return is approved, vendors should process refunds or replacements in a timely manner, typically within 48 hours. 
    - Record Keeping: Vendors are responsible for maintaining accurate records of all returns, including return requests, approvals, and refunds. 
    - Penalties for Non-Compliance: Failure to comply with these return guidelines may result in penalties, including temporary suspension or termination of your vendor account. 
    - Customer Feedback: Embrace feedback from customers to improve product quality and reduce returns. Make necessary adjustments based on customer reviews and return reasons.
    `,
    },
    {
      heading: "Promo Type",
      paragraph: `- Objective: Enable vendors to participate in promotional campaigns. 
      - .Discounts and Sales: Vendors can offer discounts or run sales on products. Clearly mention the discounted prices and duration of the sale. 
      - Free Shipping: Offer free shipping for a limited time or on specific products to attract more buyers.
      - Promo Codes: Vendors can generate unique promo codes to provide special discounts to your customers.
      - Flash Sales: Organize time-limited flash sales to create a sense of urgency among shoppers.
      - Holiday and Seasonal Promotions: Plan promotions around holidays and seasons to align with customer shopping trends.
      - Bundle Deals: Create bundle offers to encourage customers to purchase multiple items from your store.
      - Submission: Submit a promotion request via email which include details such as the promotion type, duration, and the products you want to promote. Provide any promotional content (images, descriptions, etc.) by the specified deadline.
      - Approval: Our team will review your request and notify you of the approval status. We reserve the right to reject requests that do not align with our brand or guidelines.`,
    },
    {
      heading: "Promotion Guidelines",
      paragraph: `- Promotion Transparency: Ensure that the original prices and the discounted prices are clearly displayed for customers to see. Clearly communicate the terms and conditions of your promotions, such as minimum purchase requirements or usage limitations on promo codes.
    - Inventory Management: Monitor your inventory levels closely to avoid overselling during promotions. Update stock availability in real-time.
    - Timely Delivery: Attend orders promptly to maintain customer satisfaction. Delays in shipping can result in negative feedback.
    - Customer Communication: Respond to customer inquiries and concerns promptly and professionally.
    - Adherence to Terms: Ensure that your promotional activities comply with our platform's policies and relevant laws and regulations.
    - Customer Reviews: Encourage satisfied customers to leave positive reviews, which can boost your visibility.
    `,
    },
    {
      heading: "Payment Terms, Conditions, and Payment Schedule",
      paragraph: `- Payment Schedule: Vendors will receive payments for items set to be delivered within 7 days after the payout day when buyers have received the product. Vendors will receive payments for items delivered within eight 8 days after the end of their respective payment cycle.
      - New Vendors and Not Eligible Vendors: New vendors and those who do not meet our eligibility criteria will receive payments for items scheduled for delivery within 12 days. 
      - Payout Day Allocation: Each vendor registered with our platform will be assigned a specific business day of the week, from Monday to Friday, for payment processing. 
      - Payment Calculation: For example, if a vendor's designated payout day is Friday, payments will be processed for items scheduled for delivery during the following timeframes. 
      - 7 Days Payment Schedule: Payment made on September 24th, will cover all items scheduled for delivery between September 17th and  23rd. 
      - Payment Method: Payments will be disbursed through the payment method specified in your vendor profile.
      - Payment Transparency: Vendors can access detailed payment information, including order numbers and amounts, in their vendor dashboard for transparency. 
      - Payment Discrepancies: In the event that you identify any discrepancies in your payments, please promptly contact our dedicated Vendor Support Team within 7 business days from the date of payment. 
      - Changes to Payment Schedule: Our organization reserves the right to make adjustments to the payment schedule, and any such changes will be communicated to vendors well in advance. 
      - Compliance and Partnership: Vendors are essential partners in our business ecosystem. Compliance with this Sales and Order Regulation is crucial to maintaining a strong and mutually beneficial partnership with our ecommerce startup. 
      - Questions and Support: Should you have any inquiries or require assistance, our Vendor Support Team is readily available to provide prompt assistance. Please do not hesitate to reach out.  
      `,
    },
    {
      heading: "Sales and Order Regulation",
      paragraph: `- Authenticity Standard: All products listed on our platform must be genuine and authentic. Niteon maintains a strict policy against counterfeit, illegally replicated, reproduced, or manufactured products. 
    - Penalties for Counterfeit Products: First Occurrence, If a listed replica or fake product is detected for the first time, the vendor will face a fine of 50,000 Naira. Second Occurrence, in the event of a second occurrence involving a listed replica or fake product, the vendor will be delisted and indefinitely barred from our platform. 
    - Investigations: Niteon reserves the right to investigate any violations of these regulations and take appropriate actions as necessary, including account suspension or termination. 
    `,
    },
    {
      heading: "Guideline Changes Communication",
      paragraph: `- Changes Notification: All changes to these guidelines will be communicated in writing with a minimum notice period of 30 days. 
    - Communication Method: Major guideline changes impacting the vendor operating model will be communicated via Email, SMS, or Announcements on the Seller Center.
    - Vendor Responsibility: Vendors must maintain up-to-date registered email and telephone numbers in Seller Center for timely communication. 
    `,
    },
  ];
  return (
    <>
      <NextSeo title="FAQs for Sellers" />
      <AppLayout>
        <GridLayout heading="FAQs for Seller" tabs={tabs}>
          {faqs.map((faq, index) => (
            <section>
              <Element className={"block"} name={`${index}`}>
                <h2 className="font-roboto mb-[1.25rem] font-semibold text-t18 lg:text-t24 text-black first-letter:capitalize">
                  {faq.heading}
                </h2>

                <p className="text-t14 lg:text-[1rem] whitespace-pre-line font-product_sans text-black/80 leading-[1.5rem]">
                  {faq.paragraph}
                </p>
              </Element>
            </section>
          ))}
        </GridLayout>
      </AppLayout>
    </>
  );
}

export default SellerFAQs;
