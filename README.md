# Carcheck: Revolutionizing the Sri Lankan Automotive Market through a Comprehensive and Transparent Online Vehicle Trading Platform

## [View full thesis report here](https://drive.google.com/file/d/1rKPBHpf-QTOJL44wN93ktj6cltljZkEm/view?usp=sharing) 

## 1 Abstract

The project aimed to address transparency and efficiency issues in the Sri Lankan automotive market through the development of a comprehensive online vehicle trading platform. Leveraging modern web technologies, the platform incorporated features like real-time auctions and accurate price predictions, enhancing the buying and selling process. Frontend development utilized React.js and TypeScript, while the backend was built with Node.js, Express, and TypeScript, with MongoDB serving as the database. A dedicated machine learning server, powered by Python and FastAPI, handled vehicle price predictions using linear regression, scikit-learn, pandas, uvicorn, and pymongo. The platform introduced a robust user verification system for secure transactions and community safety. By enhancing efficiency and transparency, the platform sets a framework for advanced data analytics in automotive market assessments, with implications for predictive analytics research. The report details the development process, technologies used, and evaluates the project's success in meeting its objectives.


## 2.1 Authentication Feature

The system implemented authentication and authorization processes to ensure secure user access. Users, whether individuals or businesses, underwent input validation during signup to safeguard against invalid data, utilizing the Zod library for both client and server-side validation. Additionally, the server conducted checks for identification data conflicts.

Upon signup, users could securely log in using JWT tokens for authentication and authorization. Passwords were encrypted using Bcrypt to enhance security in case of data breaches. Users had the option to choose whether to store their information for faster authentication on personal devices or opt for more secure login on shared devices without storing sensitive data.

User roles, including buyer (business and personal), seller (business and personal), service point, and admin, were established for authorization purposes. Frontend protected routes were implemented to restrict access to relevant user role sections, while server-side role-based authorization was enforced using middleware.

 ![Authentication Feature](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjq5XReVwzELQXXj6kir9aLKoQi3PuuJwrE10ONmSECKKg1AYMVFowwkOYiG08htpcgAp1ObDvHk4nW0HkpLJO6FsxAUiLcMazdvBWeNagQ0s3_-Cpq3-SHPWEorB_vQwFXp_5Ui1ASmsB109UQ1cQ1J1kTadJ0MK1uJGLB-YcURax8DrhTutR3qm-4FDnD/s1887/signup.png) 
 ![Authentication Feature](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhYInBsE-HxPO_A8tcVHACHHYY8lzhvkBTo7O2mEDu6Z8qEfdqlnvPoA1wpzWp36xrnshFvD5pc8xVYpYNC8CPu2UYwMBMAhh08lSXtGhUMH_l157v_pe99GDzeZe8AAWOgnQ2BHBUFf2ihvC9nDHih8NZoubQmOuUa3-FUIs1vQRALSRFl0_kjLsImGkQc/s16000/signin.png) 

## 2.2 Become a Seller Feature

The system prioritizes robust seller verification for community safety, requiring sellers to undergo a multi-step verification process. Initially, users' mobile numbers and emails are validated using OTP, facilitated by Nodemailer and AWS SNS. The server actively checks for conflicts in mobile numbers and emails to prevent duplication.

Upon successful validation, users can select their account type as individual, company, or service provider. Subsequently, users are prompted to provide identity verification information, with additional business-specific details required if opting for a business account. Payment information is then requested, with stringent data validations ensuring accuracy.

After completing these steps, users must upload verification documents to enhance security, with supported formats including images and PDFs. This comprehensive verification process ensures the integrity of seller accounts and enhances community safety within the system.

![Become a Seller Feature](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEif0r76lSmy9T-bwJOp19aqXMTqWMavwcN00qobWeSO5or5iUTwFTPeCv9MMi4igky_ibp4Cy2ahF1N8XNcm4NZEciLS21-hCj3KfAzZpG-5Y0oiY_dY3NblAdGR1nmKhz_z4jAfzELg6HDXwHjLK0riLdT1eLffSNoctYR7XGCFdEDmnYYIdvOqTn0hxHT/s1306/became%20seller.png)

![Become a Seller Feature](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhYInBsE-HxPO_A8tcVHACHHYY8lzhvkBTo7O2mEDu6Z8qEfdqlnvPoA1wpzWp36xrnshFvD5pc8xVYpYNC8CPu2UYwMBMAhh08lSXtGhUMH_l157v_pe99GDzeZe8AAWOgnQ2BHBUFf2ihvC9nDHih8NZoubQmOuUa3-FUIs1vQRALSRFl0_kjLsImGkQc/s16000/signin.png)


## 2.4 Administration Accounts Feature

System administrators have access to a comprehensive table, powered by tanstack/react-table, displaying registration information provided by sellers. They can effortlessly view all details and conveniently download verification documents as needed. Additionally, administrators possess the authority to approve or reject account creation requests directly from the interface.

Facilitating file downloads, the system features a robust downloader component that provides real-time progress updates during the download process. This component's versatility enables seamless integration across various system functionalities, although its implementation presented some initial challenges.

![Administration Accounts Feature](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjBw7kARnZ2qtTCA4sH06_zUzaBDEvPs4FjTPQKlnTte0Qp5_ty4gubjQ8xKuty5d_78oBly2YSn2zS8AvbezRCKFJElCTqmNvvGVadFv38v5XHRI-KoF_1Rwvi3AdGqGszoV3ZgNTbwRAqZI74KAXgCK1236UC2k8OOcXFO-FUoNd2wHGSLXsWyDeS811p/s16000/accounts.png) 

## 2.5 Manage Vehicle Specifications Feature for Admin

Administrators have the capability to oversee and manage various vehicle specifications within the system, including:

- **Categories of Vehicles**: Administrators can define and categorize vehicles based on different classifications such as sedan, SUV, truck, etc.
- **Transmission Types**: The system allows administrators to specify different transmission types available for vehicles, such as automatic, manual, or semi-automatic.
- **Fuel Types**: Administrators can manage the fuel types associated with vehicles, including options like gasoline, diesel, electric, or hybrid.
- **Drive Types**: The system supports the management of drive types for vehicles, such as front-wheel drive (FWD), rear-wheel drive (RWD), or all-wheel drive (AWD).
- **Color Options**: Administrators can define the available color options for vehicles, allowing users to select their preferred color when posting listings or filtering search results.

These specifications play a crucial role in various aspects of the system, including listing postings, search filtering, and price predictions. By effectively managing these options, administrators ensure that users have access to accurate and relevant information when browsing and interacting with vehicle listings on the platform.

![Manage Vehicle Specifications Feature for Admin](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiHer44yzI6JzAyAENgFNMnQF9X0WqPJqQnAxu0t_kNngY45IBvf1d68GVj7QHOS-lc1QRZQRM5E7VC54KUKvClgPlSP7Jb6R8oS5iwfnxvaVmUy424PJFqwxBsPTfqIjFKbTN6g7VOhbTi4Sko_0UyXlFWyIqJ4kz0Y9O20vsjM2cg1OYCH_L3JYzx7YmO/s16000/specifications.png) 

## 2.6 Manage Vehicle Brands Feature for Admin

System administrators can manage vehicle brands across the entire system.

![Manage Vehicle Brands Feature for Admin](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiXguBA9JF9oOjhTWTMh7ujGOfbGgztfCx0qoLpR28JsFROF29N2RFm9Hy7nXOQxBdet1JboCVmPE9rBAkHHmQ5CMa7QQd0tJifrSNvwiB0lYdDXPDW-Y_A3muJBq-pmQGVvrn4xVky-RQhsbInVnKuPtmy1i7TP3tYUFUJxWVik0phXUR8kTPOE8q7UmNd/s16000/brands.png) 

## 2.7 Add Vehicle Models Feature for Admin

Administrators have the ability to manage vehicle models associated with specific brands throughout the system. These models are prominently featured for filtering and listing creation purposes.

During the system's inception, developers utilized a dataset containing popular vehicle models to populate initial entries, streamlining brand management and minimizing the need for manual input of thousands of brands. Care was taken to include brands and categories not yet present in the system, ensuring clarity and preventing confusion.

![Add Vehicle Models Feature for Admin](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgcDTDzB1a7JsnSZSwIWBQca7cw6my4UauhbG8rl1z4S9IxAupKPw0zWY-lRZSoI8WwnNLlCul3l7AAOndCwGCi8slmhjGSbOvL8E-2ozmpF4AoAMFkT1gPi29OOsPYBy3oyvLFuR7YqbdCskt_rSlt309Q9XxmAX0du6y66VsnyBEo3cYCQ3rfvXdQnpgO/s1902/vehicles.png) 

## 2.8 Create a New Listing Feature

Sellers can list their vehicles in the system once their selling accounts are fully verified. Upon initiating a new listing, the system automatically generates a draft, enabling users to input necessary information conveniently. As users enter data, the system continuously saves changes, facilitating easy recovery in case of network errors. This auto-saving functionality is achieved using debounced events from the Lodash library, ensuring efficient network request control.

Additionally, the listing creation feature includes real-time image upload, allowing sellers to upload up to 12 images per listing, with at least one image being mandatory. These images are securely stored on the server using the Multer file uploads library.

To complete a listing, sellers must provide all required information and may optionally include additional details. They can choose the listing format as fixed price or auction, with auctions requiring additional information such as duration, starting bid, and optional reserve price. Sellers can also enable the option to accept offers from buyers, setting minimum offer and auto-accept prices. The location of the vehicle must be provided, facilitated by an easy selection option among cities and divisions of Sri Lanka.

All information undergoes strict validation on both the client and server sides. The developer emphasized meticulous data validation, considering that this data is used for machine learning price prediction. Example validations include ensuring that if the vehicle condition is "brand new," mileage and previous owners must be zero, required information cannot be skipped, and maximum values must be lower than minimum values.

Sellers have the option to defer listing items for the moment or save them for later, providing flexibility in managing their listings.

![Create a New Listing Feature](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiJ3Hde6Pyrs0I1OAK1ltnnAFbTqXNjl9BQfqnuzIm4ZS3RAKc1Zno3x0NxoyR02OvIEiOWFSzqYLgjfWCg6bwb7XfNR9ESAr4_3RHooY21JtLtYNzsBFRtcAZu1OqQu2VkhRVdT-sEiEPfQCnQ4FvIfjeX5eISnysqxb4Yrn8apaGSX60w2jdFIsCKg2j4/s16000/new%20listing%20-1%20.png) 
![Create a New Listing Feature](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhvUOA8BmviJhZt_Ii4uTTH2qBm0fZcUYEs2wtZjDml9m8zWnLUNQFJGlMfGCldPo6G_PiVDsKArVqTMkZxZJPtdbWL-k_tZ50uD8IK7UoVbq0BEx6TBv_5Ok3A1yxqHGC0gW9raWbHmWPHO9pHfkIlIatdqJeqER8YH3NGhWPVJyIvP1vnFxe8YKgEUp-m/s1095/new%20listing%20-2.png) 
![Create a New Listing Feature](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhxCeGd6j_ZOriYh23VcjAFfcGM5QLsHZC59fGHZ6zqJKH567D_AvC6JYfeFjQMZNteq3aBDsfT0UQWoy74E1AcnfWll3lOAMfC0ZZ2kaFYDG8hjQNMNsFirW2L-nGVs77uW1AAjctCClaYsGkm7AjHcxeGiHGTREfFv7w8zrgD4pVrobBynNSpCeECa8RG/s862/new%20listing%20-3.png) 
![Create a New Listing Feature](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhw2GQCxeZk0ypjeHVtiT93ZBGgr3TvG0eF6m4Y1uqo23bz8AsZC_MIdLBAgwoz4s-Nw4_Gh-VLg30hDTU9dizsbNegLYiGhC2CgKfGU5z4OPFf0MAkxBxpebMlg-QjAgNcydCxb3q5PO9swxxkp0RmheKnzxQuqNNtOjTLKUso9LPRSCkgLda5rK36lyE_/s16000/new%20listing%20-4.png) 
![Create a New Listing Feature](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjZsE5jbcJfjSMgm1FHkmVgYiYYnFIUdpq6mj6JGZGuln5XF_7eT0ujmIPn1sVGmXLw2z3fVzT0-4MmNJirD90NZezcZTJr0SFWzsIvB9jFQJ8-Qzp_qrthEuj6Ls_ezO7JBIDfStF1g7YNAJzZYYvdgnmHJ1b1BgItn8mxY6tVQWdml1OSpSc5IQ5Sl2Or/s16000/Screenshot%202024-05-21%20161019.png) 
![Create a New Listing Feature](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgqlUQGBvZU-r4_jvpwRPs_TKpm5sP0m-cero7G6_Ce0V7SlA7UKJR2K-LZze2uO7wPQNQl_wc_TbSFOfvJ7p_mu4gzyZKXHpRUTuJ3BXUw3tBMOQcaS7CmHNgJ0OEXcb9QN0NCPRdpX1FQAjSjDzehf3B_xWZXFCwC0IcmFnBrd5YNc8PrYzflhMtWNWCc/s16000/new%20listing%20-5.png)


## 2.9 Preview of the Listing Feature

During the listing process, users have the capability to view a real-time preview of the provided data. This preview feature allows users to visualize how the final listing will appear to buyers before actually listing the item.

![Preview of the Listing Feature](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjmvu4Nr2YWak84KzDYxI3CRiBmoKBnlaDi-POV7OzJEDcVG81dP5JDacyu-hagsrLAhf4_tTzaSau2fXhmZjeAC1IpVUiWNhCl0UWu89tfzrohqMatt91TPzL_GY0j3jpAmFRE9cJCaX1xGBi3NbW58FYo6HmDUhfrqTL5n4-JzQ06_GYz-FWBxkhH4gCT/s16000/preview.png)


## 2.10 Listing Draft Feature

In the seller's area of the system, there's a dedicated section for managing drafts. Here, sellers can easily resume working on a saved draft or delete it if needed. Additionally, sellers can request an inspection report for a specific draft from this section.

![Preview of the Listing Feature](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiQWz_DRLYZjH_K_AH94ocsFZG7JDQnfaMYJ3ROCEsJN4aGsCq-50CiZ55oJFwkUrxhwTn6ua8iA02S1BR_s1nsxUv906Neygw8M3mn5Ji_db4_hiOFIRRECaym3OnhCAZyj7E791HvVc3mlyx1Zp3t8ORhZVJ4V3W-Z4eYfNliUQyULni91skeXE513igl/s16000/drafts.png)

## 2.11 Active Listings Feature

Under the active listings section, sellers can view a list of published listings along with all the relevant details, including bids for each listing. Sellers have the option to edit specific listings and update their details as needed. When a seller ends a listing, it moves to the unsold listings section.

![Active Listings Feature](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiqbfjiM1B1FvM5GX0fW5H0XMJ5XN9AdoXc2UfehBBL8hVbB05cwJ2kypcktikrKARyO-Mv5wtzLeDP0WiD05X6YJi-SWGLfhPmd8473okUwtAnHXmLlTjvAMTM1QZrbt0SxsAlAEotixP0jQokGRP7cavoAL7zUy5kJUv6vYlxiA2NbmDIv1rx8GIdBX6Y/s16000/Active.png)

## 2.12 Unsold Listings Feature

This section displays listings that have ended either by the seller's action or automatically by the system without any bidding or buying activity. Sellers can relist items from this section to make them live again for another period of time.

![Unsold Listings Feature](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhxDhACHJ8fLVNNlvr-qbTtyGaN29XIs81moTSK9Nof96kNbgypg70l9i4AZQ8W2vTPKppBGdM5TjIw0IdhWeRCX3CTCh-c_oKFrf_AeYypcH7BGIf_i9R6BsCi54JWhOZ52bP8_tAUoRJGDgX1l-4Hi6hMmnZWdm0lCaPYRogv00gU0GoMJRtvG1gMmbCV/s16000/unsold.png)

## 2.13 Auction Running Mechanism

The system boasts robust auction mechanisms, allowing users to set auction durations and starting bids, with the option to include a reserve price. A scheduled background job, initiated upon server startup, continuously monitors auctions, ensuring timely actions after the duration ends.

During its initial run, the job scans the database for ended auctions, updating their state to unsold if no selling or bidding activity is detected. Subsequently, the job dynamically reschedules based on the soonest end date for ongoing auctions, minimizing server load while ensuring timely actions.

Furthermore, the server includes an additional check when fetching listings, updating the status to sold or unsold before transmitting the listing data to clients. This approach guarantees accurate and up-to-date information for users interacting with auction listings.

![Auction Running Mechanism](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjgBU9Ml8XartwoGN9bK4xO4JoKlWEZ7BQGcMaoBF74hcC2cGW-3EO_xeDAP8Z7KhlVI6u6Y3vsbjA9t0KHq0lStavmBw9VZiWc80saZqN8xXQxn3_0owqCU8VMTQ8kz-4zx0e5h5djWP4H1mYVSOHr5D3sUzAytylDlpm0OgODt8iuU9BnBlZM8jO99O1x/s907/listing_sheduler.png)

## 2.14 Fixed Listings Ending Mechanism

In addition to auction listings, fixed listings in the system have a predetermined duration of 30 days from the date of going live. Similar to auction listings, these fixed listings also employ the mechanisms described in the auction running process. This ensures consistent handling of listing durations and timely actions for both auction and fixed listings, enhancing user experience and system reliability.

## 2.15 View Listing Feature

The view listing page offers a user-friendly image viewer for seamless navigation through all listing images. By pre-fetching all images, users experience fast image navigation without the need for server fetches during image transitions. Developer optimizations, such as using `useMemo` in React, reduce unwanted re-renders, ensuring smooth navigation.

Additionally, the page presents comprehensive listing information, including listing format, auction-specific details, pricing, vehicle condition, location, seller information, vehicle specifications, inspection details, and description. Users are provided with options such as Buy It Now, Place Bid, or Make Offer, tailored to the listing format and seller preferences.

Furthermore, if the current listing has ended, the page restricts users from engaging in buying or bidding activities and displays a notification accordingly. For users who have placed bids, the page indicates whether their bid is the winning bid or provides information on the maximum bid for the listing.

![View Listing Feature](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhHcNnlvGPRDSUkMXV_FTR0zPSXaRwFnk84bFu-QbB8fjYsrfvGFvGRNBNde-u_LGgNeGQf_SqWXaEC09Q3gAxZkxrkbFhn3L8hHZPi3TvLKfZHNYFNi7rKhvp2Dl6HBLEvFuSgHXocm4pPrDC5iH06VpxnedhkksoexesUo1JtXkBmUv9bakklSH3w358Q/s1895/view%20listing.png)
![View Listing Feature](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhsKTmKkJHwrAgQsE3VcDdeBANFHLWTr05ibQMDKxcRo0F3NknzEEsEDDCyA3u7d5E7eoBVOVz3Gp5z5ZobijDagdGXgYyolfJbp8Dm05LH1n_Y3WUl0HrMMOAYd3zb1d28w5ov4OwVV_E4JJB33vOSx4TQF8Umd8urYFsVNJXPI01fplRhDgioFAaxxr_P/s16000/view%20listing%202.png)

## 2.16 Place Bids Feature

The Place Bids feature enables users to bid on specific listings, offering recommended bid options for easy bidding or allowing bidders to enter their own bid amount.

Each bid submitted to the server undergoes validation to ensure that it surpasses the current maximum bid, confirms the auction's active state, and prevents listing owners from participating in bidding activities. This validation process helps maintain fairness and transparency in the bidding process, ensuring that bids adhere to established rules and regulations.

![Place Bids Feature](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg7jlTriFdXlMieotflmcNe30pgLCv1WwLJlHrm-1ae5TW-myrXucvMVZUqatBwqRpul_jekLs8H6a_oTm3CfD5ymPYuFzfkApXR4Hyz42qkw2AijydPzBCSJhJtdjyW0qnM1edb7Z-5Z2Z4zTmlG_EtC13ekGhgjqaZ5eBiqmFnKOrwpl2Z_o2F-uEaIjj/s1882/bidding.png)

## 2.17 View Bidding History Feature

The page displays a list of bids received for a specific listing, providing transparency and insight into the bidding activity associated with that listing.

![View Bidding History Feature](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiWOgwwQece9Ev8Y8R0HVmyHtV2RMSS1h8JssaU0OJKa3xNIiP-kgro82GDLv9WVzUaZCyR95rA_cx70il72qIvAakLxx-S4f5Jm7rVG4QoNbMD-z1Nbf8hrs0n_CfKKmCtmjYJiS4M2FJgH8ENa_7krvO3QdJR3hyphenhyphen9iTcbkIlPo_MHwKiNWl1H8g1_Yg3e/s16000/bid%20history.png)

## 2.18 View All Listings Feature

This feature offers a comprehensive listings page that displays all active listings on the system. Users can choose to view listings with fixed prices, auctions, or both formats.

Listings can be sorted by various criteria including best match, ending soonest, newly listed, price lowest first, and price highest first. Users can also apply filters based on price range, year range, mileage range, brand, transmission type, body type, fuel type, and more. All filters are interconnected, ensuring that only valid options remain for filtering purposes. For instance, selecting Toyota will limit the available model options to Toyota models only.

![View All Listings Feature](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg4333GQ2ryaHEb8nBLjNRGCf4d1edalp7SaYMBEmQZY20VC3VrQC08qOkgxmprF6yRpbnmQW052ZUsCh4QwJxxK06XV1oHuWRZ1MTmQhRtPVUhOv0uuu-epSYga114dGXL14PrY4xjzOpRJ5vr0giK0VuSaeBspL2E0v31bopqVvePw2iFqRgiHcOeA7Uw/s1657/filters.png)

## 2.19  Search Listings Feature

The system features a consistent search bar across the website, ensuring easy access to the listing search functionality. This search functionality extends beyond searching for keywords in listing titles, also including descriptions to provide more accurate results. Additionally, the developer implemented a combination of filters and sort options on the server side, enabling users to refine their searches further and access listings that best match their criteria.

## 2.20 Location Filtering Feature

This feature provides a comprehensive list of divisions and cities in Sri Lanka. Users can select a city to view listings specifically within that city. Similarly, users can also filter listings by division. This functionality is handled by the server, ensuring accurate and efficient filtering based on user preferences.

![Search for Listings Feature](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjJKcSbdKTCkLDKNyejilUX83HRtKlO7vXtYU-d5sqMlEpoxQamSEsXsv1n6wduFWC0dlO2lzdI0At01lRQUI4ee1A75YZDCVVA5ZTJ6hcFemWKV8POneJFFT17ymYjx4L-BVsbRFwFp7P2QrmrLjUvWuReXRLZvVW2RejfzDiKdyq9wHiBGajJHPn6-K1C/s16000/location%20filter.png)

## 2.21 notification feature

Notifications have been implemented by the developer to push notifications on events like seller account creation approval of the account.

![Search for Listings Feature](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjJKcSbdKTCkLDKNyejilUX83HRtKlO7vXtYU-d5sqMlEpoxQamSEsXsv1n6wduFWC0dlO2lzdI0At01lRQUI4ee1A75YZDCVVA5ZTJ6hcFemWKV8POneJFFT17ymYjx4L-BVsbRFwFp7P2QrmrLjUvWuReXRLZvVW2RejfzDiKdyq9wHiBGajJHPn6-K1C/s16000/location%20filter.png)

# INTEGRATION OF MACHINE LEARNING:

Advanced machine learning models will be integrated into the platform to enable feature price prediction on vehicles. Developing a linear regression model for vehicle value prediction involves several steps, from data collection and preprocessing to training the model and evaluating its performance.

## 1.1 GATHERING DATA

Based on research, the developer identified key features that significantly influence a vehicle's value in the Sri Lankan market. These features include make, model, manufactured year, registered year, mileage, number of previous owners, exterior color, fuel type, condition, transmission, body type, and engine capacity. 

However, acquiring a dataset aligned with the Sri Lankan market proved challenging, as no existing dataset was available. To address this issue, the developer invested time in conducting market research on popular vehicle trading platforms such as ikman.lk and riyasewana.lk. From these platforms, the developer carefully extracted data to create a dataset suitable for training a price prediction model. This process was time-consuming, but ultimately, the developer obtained over 600 records to initiate the initial training process.

## 1.2 LOAD EXTRACTED DATASET TO THE SYSTEM

In this step, the developer read the extracted dataset from the CSV file and saved this data in the system. To accomplish this task, the developer utilized the Pandas library to read the data from the CSV file and then saved it to the model data collection.

## 1.3 SYNC WITH DATABASE

After loading the initial data, the system interacts with the Mongoose database to collect data from the listings collection posted on the website. This mechanism enables the machine learning model to update based on current market behaviors and collect a larger dataset for accurate price prediction. To achieve this, the machine learning model utilizes the Pymongo library to interact with the Mongoose database.

The data syncing logic implemented in the system keeps track of the IDs of records added to the model from the database. This mechanism simplifies the process of updating model data without overwriting all existing data from the database. Instead, it adds only the new records, ensuring efficient and seamless updates to the dataset.

## 1.4 PRE-PROCESSING DATA

Once the data is collected, the next step is preprocessing, which involves organizing the data in a format suitable for input into a linear regression model. This includes the following steps: 

Drop Null Values and Duplicates: Remove any null values and duplicate entries from the dataset to ensure data cleanliness and accuracy.

Map External Dataset Values: Map values from the external dataset to align with the system's data structure, ensuring consistency and compatibility.

Map Categorical Data: Convert categorical data, such as make, model, fuel type, transmission, body type, and exterior color, into numerical format using techniques like one-hot encoding. This process assigns a binary variable (0 or 1) to each category, enabling the model to interpret categorical data effectively.

Normalize Numerical Values: Normalize numerical variables, such as manufactured year, registered year, mileage, number of previous owners, and engine capacity, using techniques like scikit-learn's min-max scaler. Normalization brings these variables to a comparable scale, improving model efficiency and performance.

Shuffle Dataset: Shuffle the dataset to create more generalized chunks of data for training and testing
the model, enhancing its robustness and effectiveness.

By completing these preprocessing steps, the dataset is optimized and ready for input into the linear
regression model, facilitating accurate and reliable price predictions for vehicle listings.

## 1.5 TRAIN THE MODEL

After preprocessing, the next steps involve:

Splitting the Data: Divide the dataset into training and testing sets to independently validate the model's performance. 

Training the Model: Apply a linear regression algorithm to the training data. This entails fitting the model by estimating coefficients for each feature, minimizing the error between predicted and actual prices. Linear regression is a statistical method that models the relationship between a dependent variable (such as vehicle price) and one or more independent variables (features) using a linear function. For predicting vehicle value, the model interprets input features like make, model, year, mileage, etc., to estimate the vehicle's sale price accurately.

## 1.6 MODEL EVALUATION

The model uses the predict method on the test data to generate predictions for the dependent variable. developer calculates the R-squared value using the r2_score function from the sklearn.metrics module. The R-squared, or coefficient of determination, measures the proportion of the variance in the dependent variable that is predictable from the independent variables. It provides an indication of goodness of fit and the percentage of the response variable variation that is explained by the linear model. 

The formula used is:
![MODEL EVALUATION](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhHLpjhrrXs-fcd0Ums3tg9w37FMZ5HbOjZN3yPqTO7TQOT7MYDWFuXmJ3CiAme4tv0DbKXq6UXJjApHuUTRSHumCscU4iiEiPWYq2BJ8D70iMuw16hy5laYjEjVREH2VdPYrbCM_sfR_6flabM7lpOZvz4aoGp1XsMNgLLwpfrxNKxw4OSMJeA-F2SdgRp/s16000/Screenshot%202024-05-07%20141413.png)
where the Sum of Squared Residuals is the sum of the squares of the model prediction errors, and the Total Sum of Squares is the sum of the squares of the difference between each dependent variable value and the mean of the dependent variable.

## 1.7 SERVER THE MODEL

For the price prediction server developer has chosen Python as the main technology. RESTful api layer has been layer using Fastapi freamwork. This server can serve response of predicted value when input features are provided. This machine learning model is implemented a way that admins of the system can interact with the lifecycle of the model training process through the API endpoints.

## 1.8 INTEGRATION INTO THE APPLICATION

For the price prediction server, the developer chose Python as the primary technology. The RESTful API layer was built using the FastAPI framework.

This server can efficiently serve responses for predicted values when input features are provided. Additionally, the machine learning model was implemented in a manner that allows administrators of the system to interact with the lifecycle of the model training process through API endpoints. This enables administrators to manage model training, evaluation, and updates seamlessly within the system.

![MODEL EVALUATION](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjHrTHnhvG39QhdPWrPY0ANbXCyvzA6o8pNU5N8n1vgvlvTc0FbF23DDvLhUjtJ7u6Ki4S7c-F_JmtDT4Q6_-MJ8QwfhFvrxHcMpUMUMbMVPtnBtGfDG5wu3VKBga3hKqe1AC-RWvKBLPoGxovjxtLe68f1RQkeKOGwH26kZHYo4H79JWK3sTYqJ3IF3dSJ/s1652/system%20settings.png)

# DEPLOYMENT AND MONITORING:
The fully developed platform will be deployed and monitored to ensure smooth operation and
functionality. The deployment will involve setting up the environment on AWS EC2 instances for
different components—Python model, Node.js REST API, and the React client—to ensure continuous
uptime and public accessibility. 



