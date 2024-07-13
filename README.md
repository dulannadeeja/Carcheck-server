# Carcheck: Revolutionizing the Sri Lankan Automotive Market through a Comprehensive and Transparent Online Vehicle Trading Platform

## [View thesis report here](https://drive.google.com/file/d/1rKPBHpf-QTOJL44wN93ktj6cltljZkEm/view?usp=sharing) 

## Abstract

The project aimed to address transparency and efficiency issues in the Sri Lankan automotive market through the development of a comprehensive online vehicle trading platform. Leveraging modern web technologies, the platform incorporated features like real-time auctions and accurate price predictions, enhancing the buying and selling process. Frontend development utilized React.js and TypeScript, while the backend was built with Node.js, Express, and TypeScript, with MongoDB serving as the database. A dedicated machine learning server, powered by Python and FastAPI, handled vehicle price predictions using linear regression, scikit-learn, pandas, uvicorn, and pymongo. The platform introduced a robust user verification system for secure transactions and community safety. By enhancing efficiency and transparency, the platform sets a framework for advanced data analytics in automotive market assessments, with implications for predictive analytics research. The report details the development process, technologies used, and evaluates the project's success in meeting its objectives.


## 3.2 Authentication Feature

The system implemented authentication and authorization processes to ensure secure user access. Users, whether individuals or businesses, underwent input validation during signup to safeguard against invalid data, utilizing the Zod library for both client and server-side validation. Additionally, the server conducted checks for identification data conflicts.

Upon signup, users could securely log in using JWT tokens for authentication and authorization. Passwords were encrypted using Bcrypt to enhance security in case of data breaches. Users had the option to choose whether to store their information for faster authentication on personal devices or opt for more secure login on shared devices without storing sensitive data.

User roles, including buyer (business and personal), seller (business and personal), service point, and admin, were established for authorization purposes. Frontend protected routes were implemented to restrict access to relevant user role sections, while server-side role-based authorization was enforced using middleware.

 ![View thesis report here](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjq5XReVwzELQXXj6kir9aLKoQi3PuuJwrE10ONmSECKKg1AYMVFowwkOYiG08htpcgAp1ObDvHk4nW0HkpLJO6FsxAUiLcMazdvBWeNagQ0s3_-Cpq3-SHPWEorB_vQwFXp_5Ui1ASmsB109UQ1cQ1J1kTadJ0MK1uJGLB-YcURax8DrhTutR3qm-4FDnD/s1887/signup.png) 
 ![View thesis report here](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhYInBsE-HxPO_A8tcVHACHHYY8lzhvkBTo7O2mEDu6Z8qEfdqlnvPoA1wpzWp36xrnshFvD5pc8xVYpYNC8CPu2UYwMBMAhh08lSXtGhUMH_l157v_pe99GDzeZe8AAWOgnQ2BHBUFf2ihvC9nDHih8NZoubQmOuUa3-FUIs1vQRALSRFl0_kjLsImGkQc/s16000/signin.png) 

## 3.3 Become a Seller Feature

The system prioritizes robust seller verification for community safety, requiring sellers to undergo a multi-step verification process. Initially, users' mobile numbers and emails are validated using OTP, facilitated by Nodemailer and AWS SNS. The server actively checks for conflicts in mobile numbers and emails to prevent duplication.

Upon successful validation, users can select their account type as individual, company, or service provider. Subsequently, users are prompted to provide identity verification information, with additional business-specific details required if opting for a business account. Payment information is then requested, with stringent data validations ensuring accuracy.

After completing these steps, users must upload verification documents to enhance security, with supported formats including images and PDFs. This comprehensive verification process ensures the integrity of seller accounts and enhances community safety within the system.

## 3.4 Administration Accounts Feature

System administrators have access to a comprehensive table, powered by tanstack/react-table, displaying registration information provided by sellers. They can effortlessly view all details and conveniently download verification documents as needed. Additionally, administrators possess the authority to approve or reject account creation requests directly from the interface.

Facilitating file downloads, the system features a robust downloader component that provides real-time progress updates during the download process. This component's versatility enables seamless integration across various system functionalities, although its implementation presented some initial challenges.

## 3.5 Manage Vehicle Specifications Feature for Admin

Administrators have the capability to oversee and manage various vehicle specifications within the system, including:

- **Categories of Vehicles**: Administrators can define and categorize vehicles based on different classifications such as sedan, SUV, truck, etc.
- **Transmission Types**: The system allows administrators to specify different transmission types available for vehicles, such as automatic, manual, or semi-automatic.
- **Fuel Types**: Administrators can manage the fuel types associated with vehicles, including options like gasoline, diesel, electric, or hybrid.
- **Drive Types**: The system supports the management of drive types for vehicles, such as front-wheel drive (FWD), rear-wheel drive (RWD), or all-wheel drive (AWD).
- **Color Options**: Administrators can define the available color options for vehicles, allowing users to select their preferred color when posting listings or filtering search results.

These specifications play a crucial role in various aspects of the system, including listing postings, search filtering, and price predictions. By effectively managing these options, administrators ensure that users have access to accurate and relevant information when browsing and interacting with vehicle listings on the platform.

## 3.6 Manage Vehicle Brands Feature for Admin

System administrators can manage vehicle brands across the entire system.

## 3.7 Add Vehicle Models Feature for Admin

Administrators have the ability to manage vehicle models associated with specific brands throughout the system. These models are prominently featured for filtering and listing creation purposes.

During the system's inception, developers utilized a dataset containing popular vehicle models to populate initial entries, streamlining brand management and minimizing the need for manual input of thousands of brands. Care was taken to include brands and categories not yet present in the system, ensuring clarity and preventing confusion.

## 3.8 Create a New Listing Feature

Sellers can list their vehicles in the system once their selling accounts are fully verified. Upon initiating a new listing, the system automatically generates a draft, enabling users to input necessary information conveniently. As users enter data, the system continuously saves changes, facilitating easy recovery in case of network errors. This auto-saving functionality is achieved using debounced events from the Lodash library, ensuring efficient network request control.

Additionally, the listing creation feature includes real-time image upload, allowing sellers to upload up to 12 images per listing, with at least one image being mandatory. These images are securely stored on the server using the Multer file uploads library.

To complete a listing, sellers must provide all required information and may optionally include additional details. They can choose the listing format as fixed price or auction, with auctions requiring additional information such as duration, starting bid, and optional reserve price. Sellers can also enable the option to accept offers from buyers, setting minimum offer and auto-accept prices. The location of the vehicle must be provided, facilitated by an easy selection option among cities and divisions of Sri Lanka.

All information undergoes strict validation on both the client and server sides. The developer emphasized meticulous data validation, considering that this data is used for machine learning price prediction. Example validations include ensuring that if the vehicle condition is "brand new," mileage and previous owners must be zero, required information cannot be skipped, and maximum values must be lower than minimum values.

Sellers have the option to defer listing items for the moment or save them for later, providing flexibility in managing their listings.

## 3.9 Preview of the Listing Feature

During the listing process, users have the capability to view a real-time preview of the provided data. This preview feature allows users to visualize how the final listing will appear to buyers before actually listing the item.

## 3.10 Listing Draft Feature

In the seller's area of the system, there's a dedicated section for managing drafts. Here, sellers can easily resume working on a saved draft or delete it if needed. Additionally, sellers can request an inspection report for a specific draft from this section.

## 3.11 Active Listings Feature

Under the active listings section, sellers can view a list of published listings along with all the relevant details, including bids for each listing. Sellers have the option to edit specific listings and update their details as needed. When a seller ends a listing, it moves to the unsold listings section.

## 3.12 Unsold Listings Feature

This section displays listings that have ended either by the seller's action or automatically by the system without any bidding or buying activity. Sellers can relist items from this section to make them live again for another period of time.

## 3.13 Auction Running Mechanism

The system boasts robust auction mechanisms, allowing users to set auction durations and starting bids, with the option to include a reserve price. A scheduled background job, initiated upon server startup, continuously monitors auctions, ensuring timely actions after the duration ends.

During its initial run, the job scans the database for ended auctions, updating their state to unsold if no selling or bidding activity is detected. Subsequently, the job dynamically reschedules based on the soonest end date for ongoing auctions, minimizing server load while ensuring timely actions.

Furthermore, the server includes an additional check when fetching listings, updating the status to sold or unsold before transmitting the listing data to clients. This approach guarantees accurate and up-to-date information for users interacting with auction listings.

## 3.14 Fixed Listings Ending Mechanism

In addition to auction listings, fixed listings in the system have a predetermined duration of 30 days from the date of going live. Similar to auction listings, these fixed listings also employ the mechanisms described in the auction running process. This ensures consistent handling of listing durations and timely actions for both auction and fixed listings, enhancing user experience and system reliability.

## 3.15 View Listing Feature

The view listing page offers a user-friendly image viewer for seamless navigation through all listing images. By pre-fetching all images, users experience fast image navigation without the need for server fetches during image transitions. Developer optimizations, such as using `useMemo` in React, reduce unwanted re-renders, ensuring smooth navigation.

Additionally, the page presents comprehensive listing information, including listing format, auction-specific details, pricing, vehicle condition, location, seller information, vehicle specifications, inspection details, and description. Users are provided with options such as Buy It Now, Place Bid, or Make Offer, tailored to the listing format and seller preferences.

Furthermore, if the current listing has ended, the page restricts users from engaging in buying or bidding activities and displays a notification accordingly. For users who have placed bids, the page indicates whether their bid is the winning bid or provides information on the maximum bid for the listing.

## 3.16 Place Bids Feature

The Place Bids feature enables users to bid on specific listings, offering recommended bid options for easy bidding or allowing bidders to enter their own bid amount.

Each bid submitted to the server undergoes validation to ensure that it surpasses the current maximum bid, confirms the auction's active state, and prevents listing owners from participating in bidding activities. This validation process helps maintain fairness and transparency in the bidding process, ensuring that bids adhere to established rules and regulations.

## 3.17 View Bidding History Feature

The page displays a list of bids received for a specific listing, providing transparency and insight into the bidding activity associated with that listing.

## 3.18 View All Listings Feature

This feature offers a comprehensive listings page that displays all active listings on the system. Users can choose to view listings with fixed prices, auctions, or both formats.

Listings can be sorted by various criteria including best match, ending soonest, newly listed, price lowest first, and price highest first. Users can also apply filters based on price range, year range, mileage range, brand, transmission type, body type, fuel type, and more. All filters are interconnected, ensuring that only valid options remain for filtering purposes. For instance, selecting Toyota will limit the available model options to Toyota models only.

## 3.19 Favourites List Feature

The system includes a favourites list feature, allowing users to add listings to their favourites for easy access and future reference. This feature enhances user convenience by providing a centralized location for quick access to listings of interest.

## 3.20 Search for Listings Feature

The search feature provides users with a quick and efficient way to find listings of interest. A predictive search component allows users to enter any part of a listing, such as title, description, or category, and receive accurate search results. This component efficiently performs search operations on the client side, significantly reducing server load.

## 3.21 Add New Credit Card Feature

The system enables users to add new credit card information for payments, employing the stripe/stripe-react-sdk for efficient payment processing. The stripe/stripe-react-sdk simplifies the integration of Stripe's payment processing capabilities into the system. When users add their credit card information, the system securely transmits the data to Stripe's servers for processing. The Stripe API handles the secure storage and tokenization of credit card information, ensuring compliance with industry standards and maintaining a high level of security.

By leveraging the stripe/stripe-react-sdk, the system streamlines the process of adding and managing credit card information, providing users with a seamless and secure payment experience. Users can trust that their payment details are handled securely, while developers benefit from the robust features and ease of integration offered by the Stripe SDK.

## 3.22 Payment Feature

The system employs the stripe/stripe-react-sdk for handling payments. For payments, users have the option to pay with credit cards. This integration ensures that all payment processing, including transaction handling and security, is seamlessly managed by the Stripe API. The stripe/stripe-react-sdk enables secure and reliable payment transactions, enhancing user experience and ensuring the integrity of financial data.

By utilizing the stripe/stripe-react-sdk, the system provides users with a convenient and secure payment method for their transactions, while maintaining compliance with industry standards and best practices.

## 3.23 Post Payment Feature

Upon successful payment processing, users have access to their payment history. This feature enables users to view a comprehensive list of their past transactions, providing transparency and accountability.

In addition to payment history, the post-payment feature includes a cancellation option for users who wish to cancel a payment. This functionality allows users to initiate a cancellation request, which is then processed according to the system's cancellation policy. The cancellation feature enhances user control over their financial transactions and provides a streamlined process for addressing payment-related concerns.

Furthermore, users receive email notifications confirming successful payments, cancellations, or refunds. These notifications serve as a means of communication between the system and its users, ensuring that they are informed of any changes or updates related to their payments.

## 3.24 Inspection Reports Feature

The inspection reports feature provides sellers and potential buyers with comprehensive details about the condition and quality of a vehicle. Sellers can initiate an inspection request for their listed vehicle, and a qualified inspector conducts a thorough evaluation of the vehicle's condition.

Once the inspection is completed, the system generates a detailed inspection report, including information on the vehicle's mechanical, electrical, and structural components, as well as any identified issues or areas requiring attention. This report is then made available to potential buyers, offering transparency and helping them make informed purchasing decisions.

To ensure the integrity and reliability of inspection reports, the system maintains a secure and tamper-proof record of each inspection, preventing unauthorized modifications or alterations. This feature enhances trust and confidence among users, fostering a safer and more transparent marketplace for vehicle transactions.

## 3.25 Price Predictions Feature

The price prediction feature employs advanced machine learning algorithms to estimate the market value of vehicles based on various factors such as make, model, year, mileage, condition, and location. By analyzing historical sales data and current market trends, the system provides users with accurate and up-to-date price estimates.

Sellers benefit from this feature by gaining insights into the optimal listing price for their vehicles, helping them attract potential buyers and achieve a fair market value. Buyers, on the other hand, can use the price prediction tool to assess the reasonableness of a listing price, making more informed purchasing decisions.

The machine learning models used for price predictions are continuously updated and refined to reflect the latest market dynamics, ensuring that users receive reliable and relevant pricing information.

## 3.26 Notifications Feature

The system includes a robust notification feature to keep users informed about various events and updates related to their accounts and activities. Notifications are delivered via email and in-app messages, ensuring that users receive timely and relevant information.

Key notifications include:

- **Account Activity**: Users receive notifications for account-related activities such as successful registration, account verification, and password changes.
- **Listing Updates**: Sellers are notified about important listing events, including new bids, offers, and listing status changes.
- **Payment Notifications**: Users receive confirmations for successful payments, refunds, and cancellations.
- **Auction Reminders**: Bidders and sellers are reminded of upcoming auction end times, helping them stay engaged and take timely actions.
- **Inspection Reports**: Sellers and potential buyers receive notifications when an inspection report is completed and available for viewing.
- **Price Alerts**: Users can set price alerts for specific vehicle models, receiving notifications when listings match their desired price range.

The notification feature enhances user engagement and ensures that users are well-informed about their activities and interactions within the system.

## 3.27 Ratings and Reviews Feature

The ratings and reviews feature allows users to provide feedback on their experiences with sellers and buyers. After completing a transaction, users can rate the other party based on various criteria such as communication, transaction smoothness, and vehicle condition accuracy.

Users can also leave detailed reviews, sharing their experiences and insights with the community. These reviews are displayed on seller profiles and listing pages, helping potential buyers and sellers make informed decisions based on the feedback provided by previous users.

To maintain the integrity and authenticity of ratings and reviews, the system employs moderation mechanisms to prevent fraudulent or biased feedback. This feature promotes transparency and accountability within the marketplace, fostering trust and confidence among users.

## 3.28 Reporting Issues Feature

The reporting issues feature allows users to report any problems or concerns related to their transactions or interactions within the system. Users can submit detailed reports describing the issue, including relevant information such as transaction details, user interactions, and supporting evidence.

The system's support team reviews and investigates reported issues, taking appropriate actions to resolve them. This may include mediation between parties, issuing refunds, or implementing corrective measures to address the problem.

By providing a structured process for reporting and resolving issues, the system ensures that user concerns are addressed promptly and fairly, enhancing overall user satisfaction and trust in the platform.

## 3.29 Privacy Policy and Terms of Service

The system includes comprehensive privacy policy and terms of service documents, outlining the rights and responsibilities of users and the platform. These documents provide clear guidelines on data usage, user conduct, and the platform's commitment to protecting user privacy.

Users are required to review and accept the privacy policy and terms of service during the registration process, ensuring that they are aware of the platform's policies and agree to abide by them. This helps establish a transparent and trustworthy relationship between the platform and its users.

## 3.30 Help and Support Feature

The help and support feature provides users with access to a range of resources and assistance options to address their questions and concerns. This feature includes:

- **FAQ Section**: A comprehensive FAQ section addressing common questions and issues related to account management, listing creation, payments, and more.
- **User Guides**: Detailed user guides and tutorials offering step-by-step instructions for various platform features and processes.
- **Support Tickets**: Users can submit support tickets for specific issues or inquiries, receiving assistance from the system's support team.
- **Live Chat**: A live chat option allowing users to communicate with support representatives in real-time for immediate assistance.

The help and support feature ensures that users have access to the information and assistance they need to navigate the platform effectively and resolve any issues they may encounter.

