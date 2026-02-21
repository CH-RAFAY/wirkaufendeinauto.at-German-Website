# Vehicle Review System

A production-ready vehicle review platform designed to collect structured vehicle data, generate professional evaluation reports, and deliver them instantly using a serverless email pipeline.

---

## Overview

This system enables users to submit detailed vehicle information through an intelligent dynamic form. The submitted data is transformed into a structured HTML report and delivered directly to a centralized inbox using EmailJS — without requiring a backend server.

The architecture prioritizes flexibility, reliability, and efficient lead management.

---

## Key Features

- Dynamic vehicle configuration handling  
- Hybrid structured + free-text input support  
- Automated HTML email report generation  
- Serverless email delivery via EmailJS  
- Organized inbox management for faster lead response  

---

## Dynamic Options Handling

To support the wide range of vehicle configurations, the form implements an intelligent **"Other" option handler**.

While dropdown menus provide standardized options for:
- Make  
- Model  
- Trim  
- Features  

Users can select **"Other"** to dynamically reveal a free-text input field.

### Benefits

- Maintains structured data integrity  
- Captures rare or custom vehicle specifications  
- Prevents data loss  
- Improves flexibility without sacrificing usability  

This hybrid approach balances speed and precision in data collection.

---

## Email Template System

The email template serves as the system’s presentation layer.

It converts structured JSON form data into a clean, categorized HTML report optimized for dealer evaluation.

### Report Sections

- Vehicle Details  
- Condition Report  
- Ownership History  
- Additional Notes  

The structured layout allows evaluators to assess vehicle value quickly and efficiently.

---

## EmailJS Integration (Serverless Architecture)

The system uses **EmailJS** to send form submissions directly from the frontend to the email service.

### Technical Implementation

- Secure Public Key configuration  
- Service ID integration  
- Client-side JSON payload transmission  
- Structured template variable mapping  

### Advantages

- No backend server required  
- Reduced hosting complexity  
- Real-time success/error feedback  
- High availability  

This architecture simplifies deployment while maintaining reliable communication.

---

## Inbox Management Strategy

All incoming vehicle submissions are automatically organized using dynamic subject lines.

Example:
