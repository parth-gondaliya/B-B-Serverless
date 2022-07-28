# B-B-Serverless
This is a cloud-based hotel reservation system, where customers are allowed to register and book available rooms, and opt for services, such as Food. The Hotel Management component of the application allow registrations, and create invoices considering the stay, food ordered etc. A virtual assistance provides two different types of services, such as basic website navigation, and room availability check by guest users, and managing booking, ordering food by authorized hotel customers. There is an additional service, which is tour operator, and the service will be activated only if a tour is requested. The tour related operations are not part of the application, but is a component, which needs some integration with the actual application. Fig 1 shows an overview of the application.

#Gitlab Link: https://git.cs.dal.ca/tasnim/csci5410_group08
#Live App Link: https://main.dxqo713wze6le.amplifyapp.com/login

#1. Project Overview
Serverless B&B is a cloud-based hotel reservation system. As a provider of serverless solutions,
we use multi-Cloud deployment and backend-as-a-Service (BaaS) to reduce application
development efforts and operational costs. This strategy was proposed to address a problem with
a server-hosted solution: we must manually manage and configure the backend service, which is
impractical due to resource constraints. The application will be accessible to two types of users:
guest users and authorized users. Authorized users will access more services, whereas guest users
will only access a limited number of services. Customers will be able to sign up and sign in within
the app. Customers can reserve hotel rooms and place food orders through the kitchen services.
The hotel administration will generate the invoice based on the length of stay and the amount of
food consumed. Virtual assistance will be provided to the user for tasks such as basic site
navigation and managing reservations and food orders. Customers can also use an additional tour
operator service, which allows them to request trips and advise them based on the frequency of
their stay and activities [1].
We will use Amazon Web Services (AWS) and Google Cloud Platform (GCP) as cloud providers
for our multi-cloud deployment architecture. We have decided to build our frontend with the
React.js framework to ease and reduce development efforts, and most of our team is familiar with
the library. And for the serverless backend, we will use Node.js to create lambdas for various
microservices.

#2.1 User Management
This module primarily manages new user registration for the application and logging in to current
users. Following the registration, the user will be given a customer number that is officially
allocated dynamically based on the accommodation reservation.
This module will make it simpler to store and securely preserve user data. The user must register
by providing their first name, last name, valid email address, a password, security answer to the
question and a cipher key. Only once all the details have been filled with valid input will the user
be allowed to register. Upon successful registration, the user details are first stored in Cognito,
where the users are auto confirmed through lambda triggers. The security question and answer are
stored in Firestore with the user id. The user details are also stored in DynamoDB with the cipher
key that the user entered during signup and their corresponding user id [2].

#2.2 Authentication
This module focuses on the authentication of the user. The module uses three factor authentications
to get the user logged in.

##1. For the first step, the user is requested to provide email and password. This step uses AWS
Cognito to authenticate the user. We use the user identity pool that we have created and
send request using the Cognito Library for react. Once the user is authentication and the
front-end receives the confirmation, we move to the next page.

##2. For the second step, the user gets the Question challenge. The answer is stored in Firebase
Firestore with the Cognito generated user id as the document key. Once the user submits
the answer, Cloud function is called which uses Firestore library to connect and verify the
answer. If the answer does not match, the user is sent back to the login screen, otherwise
the user proceeds with the Caesar Cipher Challenge.

##3. In the final challenge, the user is presented with a randomly generated text and asked to
convert it into a Caesar cipher encoded text using the offset number the user provided while
registering. Once the user submits the answer, a cloud function is called which receives the
offset number, the randomly generated text and the user’s encoded answer. Using the offset
received from the DynamoDB, the cipher function then encodes the text and equates with
the answer provided by the user. If the answer does not match, the user is sent back to the
login screen, otherwise the user is successfully authenticated with the three-step
verification process and the system proceeds to the home page.

#2.3 Online Support
For the online support module, we will use the service in the AWS called Lex. Using that service,
the user can be guided in various ways. Users can find the available rooms in the hotel, book the
various type of rooms, order food items, and ask for services from the hotel staff as well. This
service is for all types of users. Whether the user is logged in or not, the user can access this service
for any duration and get started using the application. We have an option for the user like all the
services are not available for all types of users, so to access some specific services (ordering the
food, services, etc.) user should be logged in, so if the user is not logged in then in the chat box, it
will ask the user to log in for the further process.
There are many predefined questions which ask by customers to manage so to save time, and we
will also implement the FAQs section in the chat box. So, the user can ask any general question,
and using the question bank we will set in the Lex, those questions will be answered as well.
We'll also include the virtual navigation for the website and geo-location services which may be
asked by customers. We will also connect the database to store the application data, which the user
will select for analyzing purposes. The Lex services will also connect with the lambda function for
processing the services that will ask by customers while using the services. Using those services,
we can also manipulate and store the data for future purposes. For example, if user want to access
the main services which are provided by the application using the bot or the voice command then
they can use it directly in the application. All the details will be described as below:

##1. Kitchen service
- Using the kitchen services, user can ask the menu from the lex bot and can order food
number of people using simple and attractive UI of bot in the application. We have created
the user identity pool in the Cognito for grating the permission from the amazon account
for adding it to the react side application. To access the kitchen services, we have created
the lambda function which can be accesses using the API gateway and using that API
gateway, our lex will integrate to complete the whole requirement for the use for the kitchen
service in lex.

- We have created the kitchen services using the lambda function and set the API gateway
which will be used in lex services for the fulfillment of intent. We created the intent in the
bot to identify the flow of demand from the user in bot. In the lambda of kitchen services,
it accepts the entire object of order detail like how many items are available in the order,
how many items, total price of each item, username, user id, email address and many other
details which is required for the generating the invoice for the user. Once all the details are
readily available then from the intent lambda function will be invoked with all the required
details and then from that lambda function, we have generated the invoice with all the
information and store it in the S3 bucket for the user and hotel management. We have also
added the data into the DynamoDB for the analysis purpose using some other services.
After completing that process, we have sent the conformation message to the user back to
the lex and close the conversation about the lex using lex response from the lambda.

##2. Searching and booking the rooms
- Using these services, user can find and book the rooms available in the hotel management
using lex and UI as well because we have developed the lambda function accordingly in a
such way that there would be not an option for the dependences for the completing the
request about searching and booking the rooms. We have mainly identified 2 services
named as searching a room where user can find the availability of AC and NON-AC rooms
from the management.
For searching the rooms, we have created the intent and slots which will ask user about the
date and type of rooms and then from the lex that request with all required data will be
referred to the API gate way for searching the rooms in the lambda function and send the
data from the DynamoDB to the user in lex and UI as available rooms.
For booking rooms, we have created the intent and slots which will ask about date and type
room that user want to book if that is available, so once intent has all the required data and
it will call the lambda function using API gateway with date and type of room and then
using that function room will be booked and inform the user.

##3. Tour
- Using this service, user can get the suggestion of trip with the destination city and date that
will be selected by user while asking for the suggestion from the user.
- We have called the lambda function and from that lambda function, we have called the API
for the tour recommendation that is connected to ML module and get back to the user with
all type of required details that will displayed by the lex.
We have integrated the lex in the personal AWS account and from the lambda function of personal
account, I have called the lambda function in the academy account to fulfill the services of kitchen
and room booking module. We have used the service of communicate to integrate the lex with the
react module.

#2.4 Message Passing
- Authorized customers should be able to communicate with Hotel Management and Tour operators.
Pub/Sub is a publish/subscribe service that allows sending and receiving messages between
independent applications [3]. It is based on the publisher/subscriber model, wherein the publisher
creates and publishes messages to a messaging service on a specified topic (named resource) [3].
These messages are stored in message storage until acknowledged by all the subscribers who
receive them on a specified subscription related to that topic. Once a subscriber receives the
message, it is removed from the subscription backlog [3].
For the project, the main publishers are, “Hotel Management Services”, “Tour Operator”, and
“Kitchen”. At the same time, the authorized customers act as subscribers as well as the “Hotel
Management Services”, which will follow the Many-to-One model [4] of the pub/sub service.
The prerequisite is that the users must first register to use both services. Here, the messages will
be stored in the AWS DynamoDB database. For example, when an authorized user books a hotel
room, a confirmation mail will be sent to the user as the user has subscribed to that service and has
the booking details. Also, when a user orders food from the hotel kitchen, an invoice bill will be generated and sent to hotel management. Similarly, while looking for a tour service, the user will
need to provide the required details, and a booking confirmation mail will again be sent, including
the required details. As it is clear from the architecture, all these services will communicate using
an API Gateway. Also, AWS Lambda functions will be used to send the data from one platform
to another platform such as Google Cloud Platform and specifically to the Google Cloud
Function.Figure 2 depicts the flow chart diagram for the Google Pub-Sub service. The flow of the service
along with the support services, starts from the front-end library React, and the data gets stored in
the back-end database called DynamoDB. Here, a trigger is set using the AWS Lambda service,
which fetches the data from the database, and passes it to the 1 st Google Cloud Function, created
on the GCP platform. This function is of “HTTP Trigger” type, which receives the data, and a
publisher is defined for the created topic of Google Pub/Sub service, along with its subscription of
the type “PULL”. Once, the message is ready, it is encoded and sent to another Google Cloud
Function, wherein it gets decoded and acts as subscriber to receive the message. From there, the
message is sent in the form of email to the subscribers (in this case customers and hotel
management services). Also, the updated data is stored in the DynamoDB database for further
processing. Hence, in this way the Pub/Sub acts as a middleware for message passing between
various services in the application.

#2.6 Machine Learning
This module mainly focuses on recommending a tour package based on historical data and
providing scores based on sentiment analysis of customer feedback. We are using the GCP Vertex
AI – Auto ML service, which can predict a wide array of recommendations based upon a trained
model for proposing tour packages. We are analyzing a historical booking dataset with over 2,000
records of previously booked tours distinguished by 80% training dataset, 10% validation dataset
& 10% test dataset having multiple features and duration of stay as a target feature. We are using
a Tabular and Classification type problem to predict a target column value. We are then creating a
model which we will expose using Vertex AI endpoints and access this endpoint using the cloud
function [5].
We are also using the GCP Cloud Natural Language API to do Sentiment Analysis which inspects
the given text and identifies the prevailing emotional opinion within the text, primarily to
determine a writer's attitude as positive, negative, or neutral based on sentiment score [6]. We are
getting sentiment scores using the cloud function triggered from feedback document creation in
GCP Cloud Firestore [7]. Polarity is calculated based upon sentiment score received from GCP
Cloud Natural Language API and we are then appending the sentiment score and polarity value to
the same document in Cloud Firestore. This is also being sent to Hotel Management to improve
the service. We are using GCP Cloud Functions, GCP Vertex AI, GCP Cloud Natural Language
API, GCP Cloud Firestore in this module.

#2.7 Web Application Building and Hosting
We will use React as the development library to create a front-end application. The frontend
application will be hosted on Amazon Amplify. The application's backend is built with API
Gateway, GCP Cloud Functions, AWS Lambda Functions, GCP Firestore, and Dynamo DB.

#2.8 Testing, Report Generation and Visualization
##2.8.1. Testing
After generating the application in serverless architecture, we will test each module using dummy
data and tools available for that service. For example, in the AWS lambda function, there is a
section using which we test the function after setting up the required data for the function.
##2.8.2 Report
Many data will be stored in the database for analysis purposes. For example, how many times the
user logged in, how many accounts were created, and many others. To keep it simple to understand,
we will generate the report from the data from the database and store it into the cloud storage
bucket. For generating the report, we will use the Google Studio by connecting it with cloud
storage [18].
##2.8.3 Visualization
There are a lot of data available in the application like who orders what type of food in what
frequency, total income, and loss at a particular time, booking details, and so much other
information which is essential to notice for the customer side and developer side as well. So, we
will use the Data Studio service (google is a service provider). We will extract the data from the
database and then create graphical data using the tool.
We are using this module to provide the meaningful insight about our application. Later in this
paper, a more thorough description of this module is presented

