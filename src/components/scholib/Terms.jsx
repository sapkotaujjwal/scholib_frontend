import React, { useState, useEffect } from "react";
import "./terms.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

const policyContent = [
  {
    title: "Introduction",
    content: [
      {
        title: "1.1 General Introduction",
        content:
          "Welcome to Scholib, a comprehensive school management platform designed to empower educational institutions in optimizing their administrative, academic, and communication processes. Our goal is to provide a seamless experience for both educators and learners by offering innovative solutions tailored to meet the unique needs of schools. By accessing and utilizing our platform, you acknowledge and agree to adhere to the terms and conditions outlined in this document, which are essential for maintaining a productive and respectful community.",
      },
      {
        title: "1.2 Purpose of Policies",
        content:
          "The policies outlined herein are established to ensure that all users of Scholib understand their rights and responsibilities while using the platform. These guidelines serve to foster a safe and effective educational environment by clarifying acceptable behaviors and practices. Additionally, these policies help protect the integrity of our platform and the data it manages, thereby enhancing the overall user experience. We encourage all users to familiarize themselves with these terms and to reach out with any questions or concerns regarding the policies in place.",
      },
    ],
  },
  {
    title: "General Terms of Service",
    content: [
      {
        title: "2.1 Acceptance of Terms",
        content:
          "By accessing, browsing, or using Scholib, you agree to comply with these Terms of Service, which govern your use of our platform. If you do not agree with any part of these terms, we kindly request that you refrain from using Scholib. Your continued use of the platform indicates your acceptance of these terms and any future modifications, so we encourage you to review them periodically.",
      },
      {
        title: "2.2 Modifications",
        content:
          "Scholib reserves the right to amend or update these policies at any time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify users of significant changes through appropriate communication channels. Your ongoing use of the platform following such changes constitutes your acceptance of the new terms. It is your responsibility to stay informed of any modifications.",
      },
    ],
  },
  {
    title: "User Conduct Policy",
    content: [
      {
        title: "3.1 Acceptable Use",
        content:
          "Users are expected to utilize Scholib for legitimate educational and administrative purposes. Engaging in activities that may harm the platform, disrupt services, or infringe on the rights of others is strictly prohibited. This includes, but is not limited to, the dissemination of harmful, threatening, or defamatory content. Compliance with all applicable laws and regulations is essential.",
      },
      {
        title: "3.2 User Responsibilities",
        content:
          "Each user bears the responsibility of safeguarding their account credentials and must promptly notify Scholib of any unauthorized access or security breaches. Users are also expected to uphold a standard of conduct that fosters a respectful and collaborative environment within the platform. Failure to comply with these responsibilities may result in account suspension or termination.",
      },
    ],
  },
  {
    title: "Data Collection and Privacy Policy",
    content: [
      {
        title: "4.1 Data Collection",
        content:
          "Scholib collects and processes personal information essential for the efficient management of schools. This may include user profiles, academic records, attendance logs, and communication histories. Our data collection practices are designed to support the functionality of the platform while respecting user privacy.",
      },
      {
        title: "4.2 Data Use",
        content:
          "The data collected is utilized to facilitate effective management of student and educator information, enhance communication, and analyze performance metrics to improve the overall user experience. Scholib may also employ data for research and development purposes, ensuring that all user data is handled in compliance with applicable privacy laws.",
      },
      {
        title: "4.3 Data Retention",
        content:
          "Scholib retains user data for as long as necessary to fulfill the purposes outlined in this policy, including compliance with legal obligations. Users have the right to request the deletion of their data, subject to certain exceptions that may be necessary to retain for legal or operational purposes.",
      },
    ],
  },
  {
    title: "Content and Intellectual Property Policy",
    content: [
      {
        title: "5.1 Ownership of Content",
        content:
          "All content, including but not limited to text, graphics, logos, and software, featured on Scholib is either owned by Scholib or licensed for use by Scholib. Unauthorized use, reproduction, or distribution of any content is strictly prohibited and may result in legal action.",
      },
      {
        title: "5.2 User-Generated Content",
        content:
          "Users retain ownership of any content they upload to the platform. However, by uploading content, users grant Scholib a non-exclusive, royalty-free, worldwide license to use, reproduce, modify, and display such content within the platform. Users are responsible for ensuring they have the necessary rights to any content they upload.",
      },
    ],
  },
  {
    title: "Security and Confidentiality Policy",
    content: [
      {
        title: "6.1 User Responsibility",
        content:
          "Users are responsible for implementing appropriate measures to secure their accounts, including creating strong passwords and ensuring the confidentiality of their login information. Users should avoid sharing their credentials with others and should be vigilant about unauthorized access.",
      },
      {
        title: "6.2 System Security",
        content:
          "Scholib employs a variety of security measures, including encryption, firewalls, and intrusion detection systems, to protect sensitive data from unauthorized access and ensure the integrity of our platform. However, no security system is entirely foolproof, and users are encouraged to report any security concerns promptly.",
      },
    ],
  },
  {
    title: "Payment and Billing Policy",
    content: [
      {
        title: "7.1 Payment Terms",
        content:
          "Scholib operates on a subscription-based pricing model for educational institutions. Payment is due on the date specified in the subscription agreement, and users are responsible for ensuring timely payment to avoid service interruptions. Invoices will be provided via email.",
      },
      {
        title: "7.2 Refunds",
        content:
          "Refunds for subscription fees are generally not provided, except in exceptional circumstances that warrant a refund. Any requests for refunds will be reviewed on a case-by-case basis, and users must provide adequate justification for the request.",
      },
    ],
  },
  {
    title: "User Support and Service Level Policy",
    content: [
      {
        title: "8.1 Support Availability",
        content:
          "Scholib offers user support through various channels, including email, live chat, and an online help center. Our support team is dedicated to assisting users with inquiries, troubleshooting issues, and providing guidance on platform features and functionalities.",
      },
      {
        title: "8.2 Response Times",
        content:
          "We aim to respond to all support queries within 24 hours during business days. While we strive to resolve issues promptly, the time required for resolution may vary based on the complexity of the issue. Users will be kept informed of the status of their inquiries.",
      },
    ],
  },
  {
    title: "Compliance and Legal Policy",
    content: [
      {
        title: "9.1 Legal Compliance",
        content:
          "Scholib is committed to complying with applicable data protection laws and educational regulations. We ensure that our practices align with legal requirements to safeguard user information and maintain transparency in our operations.",
      },
      {
        title: "9.2 Dispute Resolution",
        content:
          "In the event of disputes arising from the use of Scholib, we encourage users to contact us directly to seek resolution. Our team will make every effort to address concerns and facilitate a satisfactory outcome for both parties.",
      },
    ],
  },
  {
    title: "Termination and Suspension Policy",
    content: [
      {
        title: "10.1 Termination by Users",
        content:
          "Users have the right to terminate their accounts at any time by contacting Scholib support. Upon termination, all user data will be handled according to our data retention policy, and access to the platform will be revoked.",
      },
      {
        title: "10.2 Termination by Scholib",
        content:
          "Scholib reserves the right to suspend or terminate user accounts for violations of our policies or terms of service. In such cases, users will be notified of the reasons for termination and any applicable recourse.",
      },
    ],
  },
  {
    title: "Miscellaneous",
    content: [
      {
        title: "11.1 Third-Party Services",
        content:
          "Scholib may integrate with third-party services to enhance functionality. However, we are not responsible for the policies or practices of these third parties, and we encourage users to review their privacy and security practices.",
      },
      {
        title: "11.2 Governing Law",
        content:
          "These policies shall be governed by and construed in accordance with the laws of the jurisdiction in which Scholib is headquartered. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts located in that jurisdiction.",
      },
    ],
  },
];

const Terms = () => {
  const [title, setTitle] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [currentPolicy, setCurrentPolicy] = useState(0); // State to track current policy

  useEffect(() => {
    // Set the initial window width when the component mounts
    setWindowWidth(window.innerWidth);

    // Add event listener for window resize
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function handleToggle() {
    setTitle(!title);
  }

  function handlePolicyClick(index) {
    setCurrentPolicy(index); // Set the clicked policy index
    handleToggle();
  }

  return (
    <div className="terms93637v">
      <div className="main">
        <div className="menu" onClick={handleToggle}>
          <FontAwesomeIcon icon={faBars} className="mb-0" />
        </div>

        {(!title || windowWidth >= 1100) && (
          <div
            className="title custom-scrollbar"
            style={{ marginRight: "3.6vw" }}
          >
            <ol>
              {policyContent.map((policy, index) => (
                <li
                  key={index}
                  className={currentPolicy === index ? "active" : ""}
                  onClick={() => handlePolicyClick(index)}
                >
                  {policy.title}
                </li>
              ))}
            </ol>
          </div>
        )}

        {(title || windowWidth >= 1100) && (
          <div className="content custom-scrollbar">
            <p className="h5 w500 mb-3">{policyContent[currentPolicy].title}</p>
            {policyContent[currentPolicy].content.map(
              (section, sectionIndex) => (
                <dl key={sectionIndex}>
                  <dt>{section.title}</dt>
                  <dd>{section.content}</dd>
                </dl>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Terms;
