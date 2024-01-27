import AppLayout from "@layouts/AppLayout";
import { NextSeo } from "next-seo";
import React from "react";
import { Element } from "react-scroll";
import GridLayout from "src/containers/GridLayout";

function SellerFAQs() {
  const tabs = [
    "Introduction",
    "Registration and Account Management",
    "Browsing and Product Discovery",
    "Placing Orders",
    "Payment and Checkout",
    "Order Tracking and Status Updates",
    "Returns and Refunds",
    "Customer Support",
    "Security and Privacy",
    "Feedback and Reviews",
    "Conclusion",
  ];

  const faqs = [
    {
      heading: "Introduction",
      paragraph: `Welcome to Niteon, the AI-powered business-to-business marketplace connecting emerging African businesses to the globalized world economy. As a valued user of our platform, it is essential to understand how to navigate and effectively order products from our platform. This page will provide you with step-by-step guidelines to ensure a smooth and satisfying shopping experience.
      `,
    },
    {
      heading: "Registration and Account Management",
      paragraph: `- Create an Account: To start using Niteon, you must create an account. Provide accurate information, including your business details, to complete the registration process.
    - Profile Management: Keep your profile updated with accurate contact information details.
    - Security: Ensure your login credentials are secure and not shared with others.
    `,
    },
    {
      heading: "Browsing and Product Discovery",
      paragraph: `- Categories: Explore our platform by browsing through various product categories.
    - Search Functionality: Utilize the search bar to find specific products or suppliers.
    - Filtering and Sorting: Narrow down your search results using filters, and sort products based on your preferences i.e Applying filters based on price, category, color and brand.
    - Advance search: Using advanced search features to visualize products in your own space for a more personalized shopping experience. 
    - Product Descriptions: Read product details, specifications, and reviews to make informed decisions. 
    `,
    },
    {
      heading: "Placing Orders",
      paragraph: `- Adding to Cart: Add products to your cart for future reference or purchase.
    - Quantity Selection: Specify the quantity of each product you wish to order.
    - Proceed to Checkout: Review your cart, confirm the quantities, and proceed to the checkout page.
    - Shipping Address: Provide accurate shipping information, including the destination address.
    - Payment Information: Select your preferred payment method and provide the necessary details.
    `,
    },
    {
      heading: "Payment and Checkout",
      paragraph: `- Payment Methods: Niteon accepts various payment methods. Choose the one that suits you best.
    - Secure Transactions: Our platform uses encryption to protect your payment information.
    - Review Order: Double-check your order details before confirming the payment.
    - Order Confirmation: You will receive an order confirmation email once your payment is successful.
    - Choose your preferred payment method.
    `,
    },
    {
      heading: "Order Tracking and Status Updates",
      paragraph: `- Order History: Access your order history to track your previous and current orders, including details of past transactions. 
    - Real-time Updates: Receive order status updates through email or by logging into your Niteon account.
    - Contacting Sellers: Use our messaging system to communicate with sellers and inquire about your order's status.
    - Shipping: Manage shipping and delivery preferences.
    `,
    },
    {
      heading: "Returns and Refunds",
      paragraph: `- Return Policy: Familiarize yourself with our return policy to understand the conditions for returns and refunds. 
    - Request a Return: If needed, initiate a return request through your account. 
    - Return Process: Follow the instructions provided for the return process.
    - Refund: Once the return is processed, your refund will be issued.
    `,
    },
    {
      heading: "Customer Support",
      paragraph: `- Contact Support: For any questions or issues, contact our customer support team through the provided channels: care@niteon.co
    - FAQs: Check our Frequently Asked Questions section for quick answers to common queries.
    - Live Chat: Use our live chat feature for real-time assistance.
    `,
    },
    {
      heading: "Security and Privacy",
      paragraph: `- Data Security: Niteon is committed to safeguarding your personal and business data. Review our Privacy Policy for details.
    - Phishing Awareness: Be cautious of phishing attempts and never share your login or payment information with suspicious sources.
    - Password Security: Ensure your password is strong and unique. Do not share your login information with anyone. Niteon will never ask for your password via email or messages. 
    `,
    },
    {
      heading: "Feedback and Reviews",
      paragraph: `- Product Reviews: After receiving your order, provide honest feedback on the product and seller.
    - Seller Ratings: Rate your experience with the seller to help others make informed decisions.
    `,
    },
    {
      heading: "Conclusion",
      paragraph: `Niteon is dedicated to providing a seamless and secure marketplace platform for all your product needs. These guidelines should help you make the most of your Niteon experience. If you have any further questions or concerns, please do not hesitate to contact our customer support team for assistance. Thank you for choosing Niteon, and we look forward to serving you.`,
    },
  ];
  return (
    <>
      <NextSeo title="FAQs for Buyers" />
      <AppLayout>
        <GridLayout heading="FAQs for Buyer" tabs={tabs}>
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
