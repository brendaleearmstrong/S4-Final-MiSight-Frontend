MiSight Data Intelligence Platform - Project Status Report
Student: Brenda Armstrong, SD10
December 2024
Project Resources

Project Management: MiSight Kanban Board
Frontend Deployment: https://d2jkb95pf7bi24.cloudfront.net/
Frontend Repository: https://github.com/brendaleearmstrong/S4-Final-MiSight-Frontend
Backend Repository: https://github.com/brendaleearmstrong/S4-Final-BackEnd
Database Endpoint: misight-db.cfmiw488ur7i.us-east-1.rds.amazonaws.com

Project Overview
MiSight is a Mining Data Management System designed to track minerals, manage mine projects, and ensure compliance with environmental and safety standards. The project aimed to transform an existing backend API into a full-stack deployed application using React frontend and containerized Spring Boot backend.
Deployment Status
Successfully Completed Components

Frontend Deployment

Successfully deployed to AWS S3
Accessible via CloudFront distribution: https://d2jkb95pf7bi24.cloudfront.net/
GitHub Repository: https://github.com/brendaleearmstrong/S4-Final-MiSight-Frontend


Database Deployment and Development

AWS RDS PostgreSQL successfully deployed and configured
Endpoint established: misight-db.cfmiw488ur7i.us-east-1.rds.amazonaws.com
Implemented comprehensive schema design including:

User management and authentication tables
Mine site data structures
Environmental monitoring tables
Safety reporting system
Compliance tracking


Successfully integrated with Spring Boot backend locally
Established secure database connections with proper credentials
Implemented database migrations and version control
Created necessary indexes for optimal query performance


Backend Components

Spring Boot application successfully containerized (Docker)
Container ID: a0c5878b563e2a9748b710eff33132b4feec0da081905d22ea1e138f70fba855
Deployment encountered issues requiring rebuild
GitHub Repository: https://github.com/brendaleearmstrong/S4-Final-BackEnd


Dashboard Implementation

Admin Dashboard: Fully functional with API backend in local environment
Mine Admin Dashboard: Fully developed UI with comprehensive features, pending final API integration
User Dashboard: Complete interface with mock data, awaiting API connection



Implementation Details
Completed Features

AWS RDS PostgreSQL infrastructure:

Fully configured production database environment
Implemented backup and recovery procedures
Established secure network access rules
Created necessary database roles and permissions


Frontend React application deployment
Docker containerization of backend
Basic authentication system
Admin dashboard core functionality
Mine Admin Dashboard UI and features
User Dashboard interface and mock data implementation

Pending Items

Complete backend deployment
Final API integration for Mine Admin and User Dashboards
Documentation finalization

Next Steps
I plan to continue working on the project over the next month to:

Resolve backend deployment issues
Complete API integrations
Finalize documentation

Project Management

Project progress tracked via GitHub Kanban board: https://github.com/users/brendaleearmstrong/projects/16
Regular commits maintained throughout development
Infrastructure and core features prioritized as planned

Technical Challenges & Learning Outcomes

Successfully implemented AWS services (S3, RDS, CloudFront)
Gained valuable experience with Java and Spring Boot
Learned Docker containerization
Developed skills in full-stack application deployment
Mastered PostgreSQL database administration and AWS RDS configuration
Implemented secure database practices and performance optimization

Conclusion
While the project's ambitious scope presented challenges within the 2.5-week timeframe, significant progress was made in creating a functional foundation. The successful deployment and configuration of the AWS RDS PostgreSQL database demonstrates strong database administration skills, while the frontend implementation shows proficiency in modern web development practices. The experience provided valuable insights into full-stack development and DevOps practices.Version 4 of 4
