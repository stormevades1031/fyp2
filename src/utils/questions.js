const questions = [
  // Module M1: Corporate & Technical Security
  {
    id: 101,
    codeId: 'M1_Q1',
    text: "You are at work in a government office. Suddenly, shared files cannot be opened and their names look strange. A message appears asking for payment. What would you most likely do first?",
    category: 'Malware',
    difficulty: 'Medium',
    options: [
      { value: 'restart', text: "Restart the computer and see if it goes back to normal", riskScore: 1, nextCodeId: 'M1_Q2' },
      { value: 'disconnect', text: "Disconnect the computer from the network immediately", riskScore: 0, nextCodeId: 'M1_Q2' },
      { value: 'inform', text: "Ask colleagues if they have the same problem", riskScore: 1, nextCodeId: 'M1_Q2' },
      { value: 'delete_note', text: "Try to delete the message and continue working", riskScore: 1, nextCodeId: 'M1_Q2' }
    ],
    tip: "When something unusual happens to many files at once, think about how computers are connected to each other.",
    tags: {
      occupations: ['IT Professionals', 'Government Employees', 'Banking/Finance Staff'],
      ages: ['ALL'],
      sarawakCase: true,
    },
  },
  {
    id: 102,
    codeId: 'M1_Q2',
    text: "You need to finish a report that contains MyKad numbers, but you want to work on it over the weekend. Which option feels the safest?",
    category: 'Data Handling & Wi-Fi',
    difficulty: 'Hard',
    options: [
      { value: 'usb', text: "Copy the file to your personal USB drive", riskScore: 1, nextCodeId: 'M1_Q3' },
      { value: 'cloud', text: "Upload it to your personal cloud storage", riskScore: 1, nextCodeId: 'M1_Q3' },
      { value: 'official_vpn', text: "Access the file through the official system or approved VPN", riskScore: 0, nextCodeId: 'M1_Q3' },
      { value: 'email_self', text: "Email the file to yourself", riskScore: 1, nextCodeId: 'M1_Q3' }
    ],
    tip: "Personal devices and personal accounts do not follow the same security rules as workplace systems.",
    tags: {
      occupations: ['IT Professionals', 'Government Employees', 'Banking/Finance Staff'],
      ages: ['ALL'],
      sarawakCase: false,
    },
  },
  {
    id: 103,
    codeId: 'M1_Q3',
    text: "You receive an email asking you to urgently approve a large payment. The email claims it is from your Director and sounds serious. What would you do next?",
    category: 'Phishing',
    difficulty: 'Medium',
    options: [
      { value: 'approve', text: "Approve it quickly to avoid problems", riskScore: 1, nextCodeId: 'M1_Q4' },
      { value: 'verify_channel', text: "Contact the Director through a known phone number or office channel", riskScore: 0, nextCodeId: 'M1_Q4' },
      { value: 'reply_docs', text: "Reply to the email asking for more details", riskScore: 1, nextCodeId: 'M1_Q4' },
      { value: 'delay', text: "Wait and see if another email comes", riskScore: 1, nextCodeId: 'M1_Q4' }
    ],
    tip: "Urgency is often used to push people into skipping normal checking steps.",
    tags: {
      occupations: ['IT Professionals', 'Government Employees', 'Banking/Finance Staff'],
      ages: ['ALL'],
      sarawakCase: false,
    },
  },
  {
    id: 104,
    codeId: 'M1_Q4',
    text: "You are working in a cafe and need to access work systems that contain sensitive information. What feels like the safest option?",
    category: 'Data Handling & Wi-Fi',
    difficulty: 'Easy',
    options: [
      { value: 'incognito', text: "Use private browsing mode on the browser", riskScore: 1, nextCodeId: 'M1_Q5' },
      { value: 'no_login', text: "Use the free WiFi provided by the cafe", riskScore: 1, nextCodeId: 'M1_Q5' },
      { value: 'vpn', text: "Use a company approved VPN before accessing work systems", riskScore: 0, nextCodeId: 'M1_Q5' },
      { value: 'ask_staff', text: "Ask the cafe staff if the WiFi is safe", riskScore: 1, nextCodeId: 'M1_Q5' }
    ],
    tip: "Not all internet connections offer the same level of protection for your data.",
    tags: {
      occupations: ['IT Professionals', 'Government Employees', 'Banking/Finance Staff'],
      ages: ['ALL'],
      sarawakCase: true,
    },
  },
  {
    id: 105,
    codeId: 'M1_Q5',
    text: "A technician arrives at your office saying he needs to check the server. He looks professional but you were not informed earlier. What would you do?",
    category: 'Social Engineering',
    difficulty: 'Medium',
    options: [
      { value: 'allow_supervise', text: "Let him in since he looks legitimate", riskScore: 1, nextCodeId: 'M1_Q6' },
      { value: 'deny_verify', text: "Ask him to wait while you verify his visit with management or the vendor", riskScore: 0, nextCodeId: 'M1_Q6' },
      { value: 'sign_log', text: "Allow him in but stay nearby", riskScore: 1, nextCodeId: 'M1_Q6' },
      { value: 'ask_card', text: "Ask him to sign the visitor book and proceed", riskScore: 1, nextCodeId: 'M1_Q6' }
    ],
    tip: "Not every security threat comes through a computer screen.",
    tags: {
      occupations: ['IT Professionals', 'Government Employees', 'Banking/Finance Staff'],
      ages: ['ALL'],
      sarawakCase: false,
    },
  },
  {
    id: 106,
    codeId: 'M1_Q6',
    text: "A vendor sends you an email with a link to download an urgent software update from a file sharing site. What is the safest reaction?",
    category: 'Malware',
    difficulty: 'Hard',
    options: [
      { value: 'install_now', text: "Install it quickly to avoid issues", riskScore: 1, nextCodeId: 'M1_Q7' },
      { value: 'scan_av', text: "Scan it with antivirus software first", riskScore: 1, nextCodeId: 'M1_Q7' },
      { value: 'reject_official', text: "Download updates only from the official vendor website", riskScore: 0, nextCodeId: 'M1_Q7' },
      { value: 'test_personal', text: "Install it on a spare computer", riskScore: 1, nextCodeId: 'M1_Q7' }
    ],
    tip: "The place where software comes from matters as much as the software itself.",
    tags: {
      occupations: ['IT Professionals', 'Government Employees', 'Banking/Finance Staff'],
      ages: ['ALL'],
      sarawakCase: false,
    },
  },
  {
    id: 107,
    codeId: 'M1_Q7',
    text: "You manage an admin account that controls important systems. Which choice sounds the most responsible?",
    category: 'Passwords & 2FA',
    difficulty: 'Medium',
    options: [
      { value: 'share_trusted', text: "Use an easy password so it is not forgotten", riskScore: 1, nextCodeId: 'M1_Q8' },
      { value: 'passphrase_mfa', text: "Use a long passphrase and an extra verification step", riskScore: 0, nextCodeId: 'M1_Q8' },
      { value: 'monthly_change', text: "Write the password down and store it safely", riskScore: 1, nextCodeId: 'M1_Q8' },
      { value: 'offline_store', text: "Reuse the same password as your email", riskScore: 1, nextCodeId: 'M1_Q8' }
    ],
    tip: "Some accounts are more powerful than others and deserve extra protection.",
    tags: {
      occupations: ['IT Professionals', 'Government Employees', 'Banking/Finance Staff'],
      ages: ['ALL'],
      sarawakCase: false,
    },
  },
  {
    id: 108,
    codeId: 'M1_Q8',
    text: "A colleague who just resigned is printing a large number of confidential documents. What would you do?",
    category: 'Social Engineering',
    difficulty: 'Medium',
    options: [
      { value: 'ignore', text: "Ignore it since they are leaving anyway", riskScore: 1, nextCodeId: 'M2_Q9' },
      { value: 'assist', text: "Report the situation to HR or security", riskScore: 0, nextCodeId: 'M2_Q9' },
      { value: 'report', text: "Ask them casually what the documents are for", riskScore: 1, nextCodeId: 'M2_Q9' },
      { value: 'ask', text: "Help them carry the documents", riskScore: 1, nextCodeId: 'M2_Q9' }
    ],
    tip: "Changes in staff status can sometimes increase security risks.",
    tags: {
      occupations: ['IT Professionals', 'Government Employees', 'Banking/Finance Staff'],
      ages: ['ALL'],
      sarawakCase: false,
    },
  },
  // Module M2: Financial & Investment Fraud
  {
    id: 109,
    codeId: 'M2_Q9',
    text: "You see an advertisement on social media saying an investment can give very high returns every week with almost no risk. What would you most likely do?",
    category: 'Scams',
    difficulty: 'Medium',
    options: [
      { value: 'invest_test', text: "Try investing a small amount first", riskScore: 1, nextCodeId: 'M2_Q10' },
      { value: 'ask_friends', text: "Ask the person promoting it for more details", riskScore: 1, nextCodeId: 'M2_Q10' },
      { value: 'avoid_ponzi', text: "Avoid it because it sounds unrealistic", riskScore: 0, nextCodeId: 'M2_Q10' },
      { value: 'contact_agent', text: "Share it with friends to ask their opinion", riskScore: 1, nextCodeId: 'M2_Q10' }
    ],
    tip: "When money grows very fast with little effort, it is worth slowing down and asking how it really works.",
    tags: {
      occupations: ['Working Adults', 'Retirees', 'High Income', 'Banking/Finance Staff'],
      ages: ['35-44', '45-54', '55-64', '65+'],
      sarawakCase: true,
    },
  },
  {
    id: 110,
    codeId: 'M2_Q10',
    text: "You are added to a messaging group where people share screenshots of profits. The admin asks everyone to install a trading app using a download link. What would you do?",
    category: 'Malware',
    difficulty: 'Medium',
    options: [
      { value: 'install_spare', text: "Install it on an old or unused phone", riskScore: 1, nextCodeId: 'M2_Q11' },
      { value: 'no_sideload', text: "Avoid installing apps from unknown links", riskScore: 0, nextCodeId: 'M2_Q11' },
      { value: 'ask_members', text: "Ask others in the group if it is safe", riskScore: 1, nextCodeId: 'M2_Q11' },
      { value: 'disable_security', text: "Install it to see how the app works", riskScore: 1, nextCodeId: 'M2_Q11' }
    ],
    tip: "Where an app comes from can tell you a lot about whether it should be trusted.",
    tags: {
      occupations: ['Working Adults', 'Retirees', 'High Income'],
      ages: ['35-44', '45-54', '55-64', '65+'],
      sarawakCase: false,
    },
  },
  {
    id: 111,
    codeId: 'M2_Q11',
    text: "Someone invites you to invest and says the opportunity is popular and approved in Malaysia. What would you check first?",
    category: 'Scams',
    difficulty: 'Hard',
    options: [
      { value: 'visit_office', text: "Their office address", riskScore: 1, nextCodeId: 'M2_Q12' },
      { value: 'review_social', text: "Their social media activity", riskScore: 1, nextCodeId: 'M2_Q12' },
      { value: 'check_bnm_sc', text: "Official regulator warning lists", riskScore: 0, nextCodeId: 'M2_Q12' },
      { value: 'ask_license', text: "How confident the introducer sounds", riskScore: 1, nextCodeId: 'M2_Q12' }
    ],
    tip: "Not every business that looks professional is allowed to operate legally.",
    tags: {
      occupations: ['Working Adults', 'Retirees', 'High Income'],
      ages: ['35-44', '45-54', '55-64', '65+'],
      sarawakCase: true,
    },
  },
  {
    id: 112,
    codeId: 'M2_Q12',
    text: "You have been chatting online with someone for some time. Later, they suggest investing together in a platform they trust. What feels like the safest response?",
    category: 'Scams',
    difficulty: 'Hard',
    options: [
      { value: 'invest_small', text: "Invest a small amount to test", riskScore: 1, nextCodeId: 'M2_Q13' },
      { value: 'ask_withdraw', text: "Ask them to show proof of profit", riskScore: 1, nextCodeId: 'M2_Q13' },
      { value: 'stop_pig', text: "Stop discussing money with them", riskScore: 0, nextCodeId: 'M2_Q13' },
      { value: 'video_call', text: "Continue chatting and see how it goes", riskScore: 1, nextCodeId: 'M2_Q13' }
    ],
    tip: "Scammers often focus on building trust before talking about money.",
    tags: {
      occupations: ['Working Adults', 'Retirees', 'High Income'],
      ages: ['35-44', '45-54', '55-64', '65+'],
      sarawakCase: false,
    },
  },
  {
    id: 113,
    codeId: 'M2_Q13',
    text: "You apply for a loan online. You are told it is approved, but you must pay a fee before receiving the money. What would you do?",
    category: 'Scams',
    difficulty: 'Medium',
    options: [
      { value: 'pay_fee', text: "Pay the fee so the loan can be released", riskScore: 1, nextCodeId: 'M2_Q14' },
      { value: 'negotiate', text: "Ask if the fee can be paid later", riskScore: 1, nextCodeId: 'M2_Q14' },
      { value: 'reject_loan', text: "Walk away from the offer", riskScore: 0, nextCodeId: 'M2_Q14' },
      { value: 'ask_receipt', text: "Ask for a written agreement", riskScore: 1, nextCodeId: 'M2_Q14' }
    ],
    tip: "Think about how legitimate lenders usually handle their fees.",
    tags: {
      occupations: ['Working Adults', 'Retirees', 'Low Income'], // Added Low Income as they are also targets
      ages: ['18-24', '25-34', '35-44', '45-54'],
      sarawakCase: false,
    },
  },
  {
    id: 114,
    codeId: 'M2_Q14',
    text: "Someone offers you money each month just to let them use your bank account for transactions. What would you decide?",
    category: 'Scams',
    difficulty: 'Medium',
    options: [
      { value: 'accept_passive', text: "Accept since it sounds easy", riskScore: 1, nextCodeId: 'M2_Q15' },
      { value: 'refuse_mule', text: "Accept but limit how much they use it", riskScore: 1, nextCodeId: 'M2_Q15' },
      { value: 'accept_limit', text: "Refuse the offer", riskScore: 0, nextCodeId: 'M2_Q15' },
      { value: 'give_no_card', text: "Ask what the transactions are for", riskScore: 1, nextCodeId: 'M2_Q15' }
    ],
    tip: "Your bank account is closely tied to your identity and responsibility.",
    tags: {
      occupations: ['Students', 'Working Adults', 'Unemployed'],
      ages: ['18-24', '25-34', '35-44'],
      sarawakCase: false,
    },
  },
  {
    id: 115,
    codeId: 'M2_Q15',
    text: "You receive a call offering a special financial product. The caller asks for your online banking login details. What would you do?",
    category: 'Phishing',
    difficulty: 'Easy',
    options: [
      { value: 'provide_details', text: "Give the details to complete the process", riskScore: 1, nextCodeId: 'M2_Q16' },
      { value: 'hang_up_bank', text: "Ask for the caller staff information", riskScore: 1, nextCodeId: 'M2_Q16' },
      { value: 'ask_id', text: "End the call and not share any login details", riskScore: 0, nextCodeId: 'M2_Q16' },
      { value: 'visit_later', text: "Visit the bank later to ask", riskScore: 1, nextCodeId: 'M2_Q16' }
    ],
    tip: "Sensitive information is rarely needed over a phone call.",
    tags: {
      occupations: ['Working Adults', 'Retirees', 'High Income'],
      ages: ['45-54', '55-64', '65+'],
      sarawakCase: false,
    },
  },
  {
    id: 116,
    codeId: 'M2_Q16',
    text: "After losing money to a scam, someone contacts you claiming they can recover it for a fee. What would you do?",
    category: 'Scams',
    difficulty: 'Medium',
    options: [
      { value: 'pay_fee_recover', text: "Pay the fee and hope it works", riskScore: 1, nextCodeId: 'M3_Q17' },
      { value: 'ignore_recovery', text: "Ignore the offer", riskScore: 0, nextCodeId: 'M3_Q17' },
      { value: 'proof_past', text: "Ask them how they do it", riskScore: 1, nextCodeId: 'M3_Q17' },
      { value: 'share_details', text: "Share your situation with them", riskScore: 1, nextCodeId: 'M3_Q17' }
    ],
    tip: "People who know you are already stressed may try to take advantage of that situation.",
    tags: {
      occupations: ['All Scam Victims'],
      ages: ['ALL'],
      sarawakCase: false,
    },
  },
  // Module M3: Impersonation & Legal Threats (Macau Scam)
  {
    id: 117,
    codeId: 'M3_Q17',
    text: "You receive a call with a recorded message saying it is from a government agency and that you have an urgent issue. It asks you to press a number to continue. What would you do?",
    category: 'Scams',
    difficulty: 'Easy',
    options: [
      { value: 'press_1', text: "Press the number to find out more", riskScore: 1, nextCodeId: 'M3_Q18' },
      { value: 'hang_up_lhdn', text: "Hang up and check official contact channels later", riskScore: 0, nextCodeId: 'M3_Q18' },
      { value: 'call_back_same', text: "Call the number back immediately", riskScore: 1, nextCodeId: 'M3_Q18' },
      { value: 'provide_details_lhdn', text: "Wait on the line", riskScore: 1, nextCodeId: 'M3_Q18' }
    ],
    tip: "Government matters usually leave a clear trail that can be checked calmly.",
    tags: {
      occupations: ['General Public', 'Government Retirees', 'Seniors'],
      ages: ['45-54', '55-64', '65+'],
      sarawakCase: false,
    },
  },
  {
    id: 118,
    codeId: 'M3_Q18',
    text: "A caller claims to be a police officer and says your identity was used in a crime in another state. He asks you to cooperate immediately. What is your next step?",
    category: 'Scams',
    difficulty: 'Hard',
    options: [
      { value: 'transfer_audit', text: "Follow instructions to prove innocence", riskScore: 1, nextCodeId: 'M3_Q19' },
      { value: 'hang_up_police', text: "End the call and verify through official police channels", riskScore: 0, nextCodeId: 'M3_Q19' },
      { value: 'ask_badge', text: "Ask how serious the crime is", riskScore: 1, nextCodeId: 'M3_Q19' },
      { value: 'explain_self', text: "Stay on the line and explain everything", riskScore: 1, nextCodeId: 'M3_Q19' }
    ],
    tip: "Serious investigations are handled in controlled and traceable ways.",
    tags: {
      occupations: ['General Public', 'Government Retirees', 'Seniors'],
      ages: ['55-64', '65+'],
      sarawakCase: false,
    },
  },
  {
    id: 119,
    codeId: 'M3_Q19',
    text: "You receive a message showing an arrest notice with your name and official looking logos. What would you most likely do?",
    category: 'Scams',
    difficulty: 'Medium',
    options: [
      { value: 'panic_contact', text: "Call the number in the message", riskScore: 1, nextCodeId: 'M3_Q20' },
      { value: 'ignore_warrant', text: "Ignore it and verify through official offices", riskScore: 0, nextCodeId: 'M3_Q20' },
      { value: 'forward_friends', text: "Share it with family members", riskScore: 1, nextCodeId: 'M3_Q20' },
      { value: 'pay_lawyer', text: "Reply to ask if it is real", riskScore: 1, nextCodeId: 'M3_Q20' }
    ],
    tip: "The way information is delivered often matters as much as the information itself.",
    tags: {
      occupations: ['General Public'],
      ages: ['ALL'],
      sarawakCase: false,
    },
  },
  {
    id: 120,
    codeId: 'M3_Q20',
    text: "Someone says they are from the court and asks for your MyKad number to check a case linked to your name. What would you do?",
    category: 'Social Engineering',
    difficulty: 'Medium',
    options: [
      { value: 'give_partial', text: "Give the number to avoid problems", riskScore: 1, nextCodeId: 'M3_Q21' },
      { value: 'refuse_verify', text: "Refuse and verify directly with the court", riskScore: 0, nextCodeId: 'M3_Q21' },
      { value: 'ask_hearing', text: "Ask them to explain the case", riskScore: 1, nextCodeId: 'M3_Q21' },
      { value: 'explain_unaware', text: "Tell them you are busy", riskScore: 1, nextCodeId: 'M3_Q21' }
    ],
    tip: "Once personal details are shared, they cannot be taken back.",
    tags: {
      occupations: ['General Public', 'Seniors'],
      ages: ['45-54', '55-64', '65+'],
      sarawakCase: false,
    },
  },
  {
    id: 121,
    codeId: 'M3_Q21',
    text: "You receive a call from someone claiming to be a close family member, sounding panicked and asking for urgent help. What should you do first?",
    category: 'Scams',
    difficulty: 'Hard',
    options: [
      { value: 'transfer_urgent', text: "Send money immediately", riskScore: 1, nextCodeId: 'M3_Q22' },
      { value: 'hang_verify_child', text: "Stay calm and verify through another trusted contact method", riskScore: 0, nextCodeId: 'M3_Q22' },
      { value: 'ask_amount', text: "Ask where they are", riskScore: 1, nextCodeId: 'M3_Q22' },
      { value: 'call_back_scam', text: "Keep them talking", riskScore: 1, nextCodeId: 'M3_Q22' }
    ],
    tip: "Strong emotions can make it hard to think clearly.",
    tags: {
      occupations: ['Parents', 'Seniors', 'General Public'],
      ages: ['45-54', '55-64', '65+'],
      sarawakCase: false,
    },
  },
  {
    id: 122,
    codeId: 'M3_Q22',
    text: "You receive a message saying your parcel cannot be delivered unless you pay a small fee through a link. What would you do?",
    category: 'Phishing',
    difficulty: 'Easy',
    options: [
      { value: 'click_pay', text: "Pay the fee since it is a small amount", riskScore: 1, nextCodeId: 'M3_Q23' },
      { value: 'check_official_app', text: "Ignore it and check through official delivery platforms", riskScore: 0, nextCodeId: 'M3_Q23' },
      { value: 'reply_sms', text: "Reply to the message", riskScore: 1, nextCodeId: 'M3_Q23' },
      { value: 'call_sms_number', text: "Call the number provided", riskScore: 1, nextCodeId: 'M3_Q23' }
    ],
    tip: "Small amounts are often used to lower suspicion.",
    tags: {
      occupations: ['Online Shoppers', 'General Public'],
      ages: ['18-24', '25-34', '35-44'],
      sarawakCase: false,
    },
  },
  {
    id: 123,
    codeId: 'M3_Q23',
    text: "Someone comes to your house claiming they can help resolve a legal or financial issue quickly for a fee. What would you do?",
    category: 'Scams',
    difficulty: 'Medium',
    options: [
      { value: 'agree_help', text: "Let them explain everything", riskScore: 1, nextCodeId: 'M3_Q24' },
      { value: 'reject_official_counter', text: "Decline and verify through official offices", riskScore: 0, nextCodeId: 'M3_Q24' },
      { value: 'give_ic_copy', text: "Give them copies of your documents", riskScore: 1, nextCodeId: 'M3_Q24' },
      { value: 'ask_docs', text: "Ask neighbours if they have seen them before", riskScore: 1, nextCodeId: 'M3_Q24' }
    ],
    tip: "Legitimate services rarely need to visit homes without prior notice.",
    tags: {
      occupations: ['Retirees', 'Seniors', 'Government Retirees'],
      ages: ['55-64', '65+'],
      sarawakCase: false,
    },
  },
  {
    id: 124,
    codeId: 'M3_Q24',
    text: "A friend messages you asking for a one time password sent to your phone, saying it was sent by mistake. What would you do?",
    category: 'Social Engineering',
    difficulty: 'Easy',
    options: [
      { value: 'send_otp', text: "Send it since you trust them", riskScore: 1, nextCodeId: 'M4_Q25' },
      { value: 'call_friend', text: "Call your friend to confirm the request", riskScore: 0, nextCodeId: 'M4_Q25' },
      { value: 'ignore_msg', text: "Ignore the message", riskScore: 1, nextCodeId: 'M4_Q25' },
      { value: 'ask_why', text: "Ask why they need it", riskScore: 1, nextCodeId: 'M4_Q25' }
    ],
    tip: "Access to accounts often depends on a single piece of information.",
    tags: {
      occupations: ['General Public'],
      ages: ['ALL'],
      sarawakCase: false,
    },
  },
  // Module M4: Employment & Student Risks
  {
    id: 125,
    codeId: 'M4_Q25',
    text: "You are invited to participate in an online job that promises daily income through simple digital tasks. After completing several tasks, you are informed that a payment is required to access higher earning opportunities. What is the most appropriate action?",
    category: 'Scams',
    difficulty: 'Easy',
    options: [
      { value: 'pay_premium', text: "Make the payment to increase earning potential", riskScore: 1, nextCodeId: 'M4_Q26' },
      { value: 'stop_task', text: "Discontinue participation and exit the scheme", riskScore: 0, nextCodeId: 'M4_Q26' },
      { value: 'negotiate_premium', text: "Request clarification on why payment is required", riskScore: 1, nextCodeId: 'M4_Q26' },
      { value: 'ask_withdraw_premium', text: "Ask when accumulated earnings can be withdrawn", riskScore: 1, nextCodeId: 'M4_Q26' }
    ],
    tip: "In legitimate employment arrangements, earnings are linked to completed work, not entry payments.",
    tags: {
      occupations: ['Students', 'Unemployed', 'Fresh Graduates'],
      ages: ['18-24', '25-34'],
      sarawakCase: false,
    },
  },
  {
    id: 126,
    codeId: 'M4_Q26',
    text: "An agent offers you an overseas customer service position with a high salary, no experience requirement, and travel expenses covered. What is the safest course of action?",
    category: 'Scams',
    difficulty: 'Hard',
    options: [
      { value: 'accept_offer', text: "Accept the offer immediately to secure the position", riskScore: 1, nextCodeId: 'M4_Q27' },
      { value: 'verify_embassy', text: "Verify the offer through official government or diplomatic channels", riskScore: 0, nextCodeId: 'M4_Q27' },
      { value: 'ask_accommodation', text: "Request details about accommodation and working conditions", riskScore: 1, nextCodeId: 'M4_Q27' },
      { value: 'bring_friend', text: "Ask if friends can apply together", riskScore: 1, nextCodeId: 'M4_Q27' }
    ],
    tip: "Employment opportunities involving international travel should always have verifiable and traceable processes.",
    tags: {
      occupations: ['Students', 'Unemployed', 'Fresh Graduates'],
      ages: ['18-24', '25-34'],
      sarawakCase: true,
    },
  },
  {
    id: 127,
    codeId: 'M4_Q27',
    text: "You identify a rental unit near your institution at a significantly lower price than market rate. The owner claims to be overseas and requests a deposit before viewing. What should you do?",
    category: 'Scams',
    difficulty: 'Medium',
    options: [
      { value: 'transfer_deposit', text: "Transfer the deposit to secure the unit", riskScore: 1, nextCodeId: 'M4_Q28' },
      { value: 'refuse_viewing', text: "Decline and seek alternative accommodation", riskScore: 0, nextCodeId: 'M4_Q28' },
      { value: 'pay_half', text: "Offer a partial deposit", riskScore: 1, nextCodeId: 'M4_Q28' },
      { value: 'ask_video', text: "Request additional photos or videos", riskScore: 1, nextCodeId: 'M4_Q28' }
    ],
    tip: "Financial commitments related to housing should only be made after sufficient verification.",
    tags: {
      occupations: ['Students'],
      ages: ['18-24'],
      sarawakCase: false,
    },
  },
  {
    id: 128,
    codeId: 'M4_Q28',
    text: "You receive an email claiming your education loan status requires urgent action and provides a link for login. What is the correct response?",
    category: 'Phishing',
    difficulty: 'Medium',
    options: [
      { value: 'click_login', text: "Access the link and log in immediately", riskScore: 1, nextCodeId: 'M4_Q29' },
      { value: 'check_url_gov', text: "Verify the notification through official channels", riskScore: 0, nextCodeId: 'M4_Q29' },
      { value: 'reply_email', text: "Reply to the email requesting clarification", riskScore: 1, nextCodeId: 'M4_Q29' },
      { value: 'forward_classmates', text: "Forward the email to peers for confirmation", riskScore: 1, nextCodeId: 'M4_Q29' }
    ],
    tip: "Official organisations maintain consistent communication methods and domains.",
    tags: {
      occupations: ['Students', 'Fresh Graduates'],
      ages: ['18-24', '25-34'],
      sarawakCase: false,
    },
  },
  {
    id: 129,
    codeId: 'M4_Q29',
    text: "After purchasing a pre owned smartphone, you intend to begin using it for personal activities. What should be done first?",
    category: 'Malware',
    difficulty: 'Medium',
    options: [
      { value: 'use_immediately', text: "Insert a SIM card and begin use", riskScore: 1, nextCodeId: 'M4_Q30' },
      { value: 'factory_reset', text: "Perform a complete factory reset", riskScore: 0, nextCodeId: 'M4_Q30' },
      { value: 'change_lock', text: "Change the lock screen and password", riskScore: 1, nextCodeId: 'M4_Q30' },
      { value: 'remove_apps', text: "Remove unfamiliar applications", riskScore: 1, nextCodeId: 'M4_Q30' }
    ],
    tip: "Previously used devices may still retain configurations or software from earlier owners.",
    tags: {
      occupations: ['Students', 'Unemployed'],
      ages: ['ALL'],
      sarawakCase: false,
    },
  },
  {
    id: 130,
    codeId: 'M4_Q30',
    text: "You are informed that you have been selected for a guaranteed scholarship, subject to a processing payment. What is the most appropriate response?",
    category: 'Scams',
    difficulty: 'Easy',
    options: [
      { value: 'pay_fee_scholarship', text: "Make the payment to secure the scholarship", riskScore: 1, nextCodeId: 'M4_Q31' },
      { value: 'ignore_scholarship', text: "Decline the offer", riskScore: 0, nextCodeId: 'M4_Q31' },
      { value: 'ask_letter', text: "Request formal confirmation documents", riskScore: 1, nextCodeId: 'M4_Q31' },
      { value: 'ask_seniors', text: "Seek advice from seniors", riskScore: 1, nextCodeId: 'M4_Q31' }
    ],
    tip: "Consider the standard procedures followed by recognised funding bodies.",
    tags: {
      occupations: ['Students'],
      ages: ['18-24'],
      sarawakCase: false,
    },
  },
  {
    id: 131,
    codeId: 'M4_Q31',
    text: "An online job application requests a full copy of your identification document and bank account details during registration. What is the safest decision?",
    category: 'Data Handling & Wi-Fi',
    difficulty: 'Medium',
    options: [
      { value: 'provide_details_job', text: "Submit the requested information", riskScore: 1, nextCodeId: 'M4_Q32' },
      { value: 'refuse_identity', text: "Decline and discontinue the application", riskScore: 0, nextCodeId: 'M4_Q32' },
      { value: 'send_blurred', text: "Provide partial or obscured documents", riskScore: 1, nextCodeId: 'M4_Q32' },
      { value: 'ask_contract', text: "Ask for confirmation of employment terms", riskScore: 1, nextCodeId: 'M4_Q32' }
    ],
    tip: "Personal data, once shared, may be reused beyond its original purpose.",
    tags: {
      occupations: ['Students', 'Unemployed', 'Fresh Graduates'],
      ages: ['18-24', '25-34'],
      sarawakCase: false,
    },
  },
  {
    id: 132,
    codeId: 'M4_Q32',
    text: "You are invited to join a business model that requires an upfront payment and generates income mainly through recruiting new participants. What is the correct assessment?",
    category: 'Scams',
    difficulty: 'Easy',
    options: [
      { value: 'join_early', text: "Join early to maximise potential returns", riskScore: 1, nextCodeId: 'M5_Q33' },
      { value: 'reject_pyramid', text: "Decide not to participate", riskScore: 0, nextCodeId: 'M5_Q33' },
      { value: 'ask_products', text: "Request a detailed explanation of earnings", riskScore: 1, nextCodeId: 'M5_Q33' },
      { value: 'try_month', text: "Participate on a trial basis", riskScore: 1, nextCodeId: 'M5_Q33' }
    ],
    tip: "Understanding the primary source of income is critical when evaluating business models.",
    tags: {
      occupations: ['Students', 'Unemployed'],
      ages: ['18-24', '25-34'],
      sarawakCase: false,
    },
  },
  // Module M5: Lifestyle, Shopping & Social Media
  {
    id: 133,
    codeId: 'M5_Q33',
    text: "You encounter an online seller on a social media platform offering a latest model smartphone at a price significantly lower than the current market value. What is the most accurate assessment of this situation?",
    category: 'Scams',
    difficulty: 'Easy',
    options: [
      { value: 'buy_quickly', text: "Proceed with the purchase before the item sells out", riskScore: 1, nextCodeId: 'M5_Q34' },
      { value: 'scam_price', text: "Conclude that the offer is likely fraudulent due to unrealistic pricing", riskScore: 0, nextCodeId: 'M5_Q34' },
      { value: 'ask_photos', text: "Request additional product photos from the seller", riskScore: 1, nextCodeId: 'M5_Q34' },
      { value: 'check_followers', text: "Evaluate the seller follower count and engagement", riskScore: 1, nextCodeId: 'M5_Q34' }
    ],
    tip: "Pricing that deviates greatly from market norms often indicates hidden risks.",
    tags: {
      occupations: ['General Consumers', 'Youth', 'Females'],
      ages: ['18-24', '25-34'],
      sarawakCase: false,
    },
  },
  {
    id: 134,
    codeId: 'M5_Q34',
    text: "You receive a notification that someone attempted to log in to your social media account from an unfamiliar location. What should you do first?",
    category: 'Passwords & 2FA',
    difficulty: 'Medium',
    options: [
      { value: 'ignore_alert', text: "Ignore the alert since no harm occurred", riskScore: 1, nextCodeId: 'M5_Q35' },
      { value: 'change_password', text: "Change your password and review account security settings", riskScore: 0, nextCodeId: 'M5_Q35' },
      { value: 'post_online', text: "Post online to ask if others experienced the same issue", riskScore: 1, nextCodeId: 'M5_Q35' },
      { value: 'wait_alert', text: "Wait to see if another alert appears", riskScore: 1, nextCodeId: 'M5_Q35' }
    ],
    tip: "Unusual access attempts may indicate early signs of account compromise.",
    tags: {
      occupations: ['Youth', 'Females', 'General Consumers'],
      ages: ['18-24', '25-34'],
      sarawakCase: false,
    },
  },
  {
    id: 135,
    codeId: 'M5_Q35',
    text: "An individual you interacted with online threatens to release private content unless payment is made. What is the most appropriate action?",
    category: 'Scams',
    difficulty: 'Hard',
    options: [
      { value: 'pay_sextortion', text: "Make the payment to prevent escalation", riskScore: 1, nextCodeId: 'M5_Q36' },
      { value: 'block_report', text: "Secure your accounts, block contact, and report the incident", riskScore: 0, nextCodeId: 'M5_Q36' },
      { value: 'negotiate_less', text: "Attempt to negotiate a lower payment", riskScore: 1, nextCodeId: 'M5_Q36' },
      { value: 'delete_social', text: "Remove all social media accounts", riskScore: 1, nextCodeId: 'M5_Q36' }
    ],
    tip: "Responding emotionally to threats can increase vulnerability.",
    tags: {
      occupations: ['Youth', 'Females'],
      ages: ['18-24', '25-34'],
      sarawakCase: false,
    },
  },
  {
    id: 136,
    codeId: 'M5_Q36',
    text: "You are tagged in a post claiming that you have won a shopping voucher. The provided link requests you to log in using your social media account credentials. What should you do?",
    category: 'Phishing',
    difficulty: 'Easy',
    options: [
      { value: 'login_claim', text: "Log in to claim the reward", riskScore: 1, nextCodeId: 'M5_Q37' },
      { value: 'exit_phishing', text: "Exit the page without providing any login information", riskScore: 0, nextCodeId: 'M5_Q37' },
      { value: 'fake_password', text: "Enter an incorrect password to test the site", riskScore: 1, nextCodeId: 'M5_Q37' },
      { value: 'share_friends', text: "Share the post with others", riskScore: 1, nextCodeId: 'M5_Q37' }
    ],
    tip: "Legitimate promotions do not require account passwords to distribute rewards.",
    tags: {
      occupations: ['Youth', 'Females', 'General Consumers'],
      ages: ['18-24', '25-34'],
      sarawakCase: false,
    },
  },
  {
    id: 137,
    codeId: 'M5_Q37',
    text: "A mobile application requests access to your contacts, photos, and location, even though these features are not clearly related to its function. What is the most appropriate action?",
    category: 'Data Handling & Wi-Fi',
    difficulty: 'Medium',
    options: [
      { value: 'grant_all', text: "Grant access so the app works smoothly", riskScore: 1, nextCodeId: 'M5_Q38' },
      { value: 'limit_permissions', text: "Review and limit permissions or avoid installing the app", riskScore: 0, nextCodeId: 'M5_Q38' },
      { value: 'adjust_later', text: "Install the app and adjust permissions later", riskScore: 1, nextCodeId: 'M5_Q38' },
      { value: 'ask_others', text: "Ask other users if they allowed the access", riskScore: 1, nextCodeId: 'M5_Q38' }
    ],
    tip: "Permissions should match the purpose of the application.",
    tags: {
      occupations: ['General Consumers', 'Students'],
      ages: ['ALL'],
      sarawakCase: false,
    },
  },
  {
    id: 138,
    codeId: 'M5_Q38',
    text: "After selling an item online, the buyer sends a screenshot claiming that payment has been completed. Your bank balance does not reflect the transaction. What should you do?",
    category: 'Scams',
    difficulty: 'Medium',
    options: [
      { value: 'ship_item', text: "Proceed to ship the item", riskScore: 1, nextCodeId: 'M5_Q39' },
      { value: 'verify_bank_app', text: "Verify the transaction directly through official banking channels", riskScore: 0, nextCodeId: 'M5_Q39' },
      { value: 'trust_buyer', text: "Accept the screenshot as proof of payment", riskScore: 1, nextCodeId: 'M5_Q39' },
      { value: 'ask_screenshot', text: "Request an additional screenshot", riskScore: 1, nextCodeId: 'M5_Q39' }
    ],
    tip: "Visual proof alone may not accurately reflect financial transactions.",
    tags: {
      occupations: ['Online Sellers', 'General Consumers'],
      ages: ['ALL'],
      sarawakCase: false,
    },
  },
  {
    id: 139,
    codeId: 'M5_Q39',
    text: "You are concerned about unauthorized webcam access on your laptop. What is the MOST effective protection?",
    category: 'Malware',
    difficulty: 'Easy',
    options: [
      { value: 'turn_off_monitor', text: "Turn off the monitor", riskScore: 1, nextCodeId: 'M5_Q40' },
      { value: 'webcam_cover', text: "Use a physical webcam cover when not in use", riskScore: 0, nextCodeId: 'M5_Q40' },
      { value: 'ignore_webcam', text: "Ignore the risk", riskScore: 1, nextCodeId: 'M5_Q40' },
      { value: 'uninstall_driver', text: "Uninstall camera drivers", riskScore: 1, nextCodeId: 'M5_Q40' }
    ],
    tip: "Physical safeguards can complement digital security controls.",
    tags: {
      occupations: ['General Consumers', 'Students', 'Females'],
      ages: ['ALL'],
      sarawakCase: false,
    },
  },
  {
    id: 140,
    codeId: 'M5_Q40',
    text: "You use the same password for several online accounts for convenience. What is the most responsible decision?",
    category: 'Passwords & 2FA',
    difficulty: 'Medium',
    options: [
      { value: 'continue_same', text: "Continue using the same password to avoid forgetting", riskScore: 1, nextCodeId: 'M6_Q41' },
      { value: 'change_gradually', text: "Change passwords gradually for important accounts", riskScore: 0, nextCodeId: 'M6_Q41' },
      { value: 'write_store', text: "Write the password down and store it securely", riskScore: 1, nextCodeId: 'M6_Q41' },
      { value: 'share_trusted', text: "Share the password with a trusted person", riskScore: 1, nextCodeId: 'M6_Q41' }
    ],
    tip: "One compromised account can affect others if protections are reused.",
    tags: {
      occupations: ['General Consumers'],
      ages: ['18-24', '25-34'],
      sarawakCase: false,
    },
  },
  // Module M6: Digital Banking & General Safety
  {
    id: 141,
    codeId: 'M6_Q41',
    text: "You notice a small, unexpected RM20 debit from your S-Pay Global account, which you did not authorize. What is the most appropriate first step?",
    category: 'Scams',
    difficulty: 'Medium',
    options: [
      { value: 'assume_error', text: "Assume it is a system error and take no immediate action", riskScore: 1, nextCodeId: 'M6_Q42' },
      { value: 'review_contact_update', text: "Review your account activity and contact customer support while updating your account credentials", riskScore: 0, nextCodeId: 'M6_Q42' },
      { value: 'uninstall_monitor', text: "Uninstall the app and monitor your bank statements over the next few days", riskScore: 1, nextCodeId: 'M6_Q42' },
      { value: 'wait_see', text: "Wait to see if further transactions appear before taking any action", riskScore: 1, nextCodeId: 'M6_Q42' }
    ],
    tip: "Even minor unusual transactions can signal unauthorized access. Think about steps that protect your account immediately.",
    tags: {
      occupations: ['Retail', 'Operational', 'Rural/General Public'],
      ages: ['ALL'],
      sarawakCase: true,
    },
  },
  {
    id: 142,
    codeId: 'M6_Q42',
    text: "At a café, you scan a QR code expecting to see the menu, but your device prompts to download an unknown application. What should you do?",
    category: 'Malware',
    difficulty: 'Medium',
    options: [
      { value: 'proceed_download', text: "Proceed with the download to identify its content", riskScore: 1, nextCodeId: 'M6_Q43' },
      { value: 'cancel_download', text: "Cancel the download to avoid installing applications from unverified sources", riskScore: 0, nextCodeId: 'M6_Q43' },
      { value: 'open_downloaded', text: "Open the downloaded file cautiously to inspect the contents", riskScore: 1, nextCodeId: 'M6_Q43' },
      { value: 'ask_waiter', text: "Ask a staff member whether the download is necessary", riskScore: 1, nextCodeId: 'M6_Q43' }
    ],
    tip: "Unexpected downloads may indicate security risks. Consider whether the action matches the intended outcome of scanning a QR code.",
    tags: {
      occupations: ['General Public'],
      ages: ['ALL'],
      sarawakCase: false,
    },
  },
  {
    id: 143,
    codeId: 'M6_Q43',
    text: "A person claiming to be from your bank calls and requests the TAC sent to your phone to cancel a recent transaction. How should you respond?",
    category: 'Phishing',
    difficulty: 'Easy',
    options: [
      { value: 'share_code', text: "Share the code to complete the transaction quickly", riskScore: 1, nextCodeId: 'M6_Q44' },
      { value: 'decline_code', text: "Decline to provide the code", riskScore: 0, nextCodeId: 'M6_Q44' },
      { value: 'read_code', text: "Read the code carefully to verify the caller’s intentions", riskScore: 1, nextCodeId: 'M6_Q44' },
      { value: 'ask_id', text: "Ask the caller to provide official identification before proceeding", riskScore: 1, nextCodeId: 'M6_Q44' }
    ],
    tip: "Question requests for sensitive information that deviate from standard security procedures.",
    tags: {
      occupations: ['General Public', 'Seniors'],
      ages: ['45-54', '55-64', '65+'],
      sarawakCase: false,
    },
  },
  {
    id: 144,
    codeId: 'M6_Q44',
    text: "You receive a screenshot from someone claiming they accidentally transferred RM100 to your e-wallet and ask you to return the amount. What is the most cautious action?",
    category: 'Scams',
    difficulty: 'Medium',
    options: [
      { value: 'refund_immediately', text: "Refund the money immediately", riskScore: 1, nextCodeId: 'M6_Q45' },
      { value: 'verify_balance', text: "Verify your actual account balance before taking any steps", riskScore: 0, nextCodeId: 'M6_Q45' },
      { value: 'block_sender', text: "Block the sender without verifying the claim", riskScore: 1, nextCodeId: 'M6_Q45' },
      { value: 'leave_funds', text: "Leave the funds untouched without checking your account", riskScore: 1, nextCodeId: 'M6_Q45' }
    ],
    tip: "Visual evidence such as screenshots can be manipulated. Consider how to confirm the information reliably.",
    tags: {
      occupations: ['General Public'],
      ages: ['ALL'],
      sarawakCase: false,
    },
  },
  {
    id: 145,
    codeId: 'M6_Q45',
    text: "You need to charge your phone in a public location. Which option reduces the risk of data exposure?",
    category: 'Malware',
    difficulty: 'Medium',
    options: [
      { value: 'plug_direct', text: "Connect your device directly to the public charger", riskScore: 1, nextCodeId: 'M6_Q46' },
      { value: 'use_adapter', text: "Use your personal charger", riskScore: 0, nextCodeId: 'M6_Q46' },
      { value: 'turn_off', text: "Switch off the phone before using the public charger", riskScore: 1, nextCodeId: 'M6_Q46' },
      { value: 'avoid_charge', text: "Avoid charging in public completely", riskScore: 1, nextCodeId: 'M6_Q46' }
    ],
    tip: "Public charging points may carry hidden data risks. Think about ways to maintain security while charging.",
    tags: {
      occupations: ['Travelers', 'General Public'],
      ages: ['ALL'],
      sarawakCase: false,
    },
  },
  {
    id: 146,
    codeId: 'M6_Q46',
    text: "You realize that a recent transfer was made to a potential scammer. Which is the most appropriate contact to report this situation immediately?",
    category: 'Scams',
    difficulty: 'Easy',
    options: [
      { value: 'call_999', text: "Dial 999, the emergency hotline", riskScore: 1, nextCodeId: 'M6_Q47' },
      { value: 'call_997', text: "Contact 997, for specialized assistance", riskScore: 0, nextCodeId: 'M6_Q47' },
      { value: 'call_112', text: "Call 112 for international emergencies", riskScore: 1, nextCodeId: 'M6_Q47' },
      { value: 'call_bank', text: "Notify your bank branch hotline first", riskScore: 1, nextCodeId: 'M6_Q47' }
    ],
    tip: "Consider which authorities are best equipped to handle financial fraud rather than general emergencies.",
    tags: {
      occupations: ['General Public'],
      ages: ['ALL'],
      sarawakCase: true,
    },
  },
  {
    id: 147,
    codeId: 'M6_Q47',
    text: "You plan to access your online banking account using public Wi-Fi at an airport or café. Which approach is safest?",
    category: 'Data Handling & Wi-Fi',
    difficulty: 'Medium',
    options: [
      { value: 'yes_quick', text: "Use the Wi-Fi network if the session is brief", riskScore: 1, nextCodeId: 'M6_Q48' },
      { value: 'no_mobile_data', text: "Prefer using mobile data", riskScore: 0, nextCodeId: 'M6_Q48' },
      { value: 'yes_incognito', text: "Enable private browsing mode while using public Wi-Fi", riskScore: 1, nextCodeId: 'M6_Q48' },
      { value: 'yes_password', text: "Connect only if the network is password-protected", riskScore: 1, nextCodeId: 'M6_Q48' }
    ],
    tip: "Public networks may not be secure. Think about the level of protection needed for sensitive transactions.",
    tags: {
      occupations: ['Travelers', 'General Public'],
      ages: ['ALL'],
      sarawakCase: false,
    },
  },
  {
    id: 148,
    codeId: 'M6_Q48',
    text: "You receive an SMS stating: “You have an outstanding summon. Click here to view details.” How should you handle it?",
    category: 'Phishing',
    difficulty: 'Easy',
    options: [
      { value: 'click_summon', text: "Click the link to verify the summon", riskScore: 1, nextCodeId: 'M6_Q49' },
      { value: 'ignore_mobile_sms', text: "Ignore the message", riskScore: 0, nextCodeId: 'M6_Q49' },
      { value: 'reply_summon', text: "Reply to request more information", riskScore: 1, nextCodeId: 'M6_Q49' },
      { value: 'call_summon', text: "Call the number listed in the message", riskScore: 1, nextCodeId: 'M6_Q49' }
    ],
    tip: "Evaluate whether the source and format of the communication align with official procedures.",
    tags: {
      occupations: ['General Public'],
      ages: ['ALL'],
      sarawakCase: false,
    },
  },
  {
    id: 149,
    codeId: 'M6_Q49',
    text: "Your mobile signal suddenly drops, and you receive an email claiming your SIM card has been replaced without your request. What should you do first?",
    category: 'Scams',
    difficulty: 'Hard',
    options: [
      { value: 'restart_phone', text: "Restart your phone", riskScore: 1, nextCodeId: 'M6_Q50' },
      { value: 'contact_telco_bank', text: "Contact your mobile provider and bank immediately to secure accounts and verify any transactions", riskScore: 0, nextCodeId: 'M6_Q50' },
      { value: 'wait_signal', text: "Wait until the signal returns and monitor your messages", riskScore: 1, nextCodeId: 'M6_Q50' },
      { value: 'buy_new_phone', text: "Purchase a new device to replace the potentially compromised one", riskScore: 1, nextCodeId: 'M6_Q50' }
    ],
    tip: "Consider what actions allow you to check for issues without assuming everything is fine.",
    tags: {
      occupations: ['General Public'],
      ages: ['ALL'],
      sarawakCase: false,
    },
  },
  {
    id: 150,
    codeId: 'M6_Q50',
    text: "A fellow gamer offers free in-game currency if you log in to a specific website. What is the safest response?",
    category: 'Phishing',
    difficulty: 'Easy',
    options: [
      { value: 'login_game', text: "Log in quickly", riskScore: 1, nextCodeId: 'M6_Q51' },
      { value: 'refuse_game_phish', text: "Avoid logging in", riskScore: 0, nextCodeId: 'M6_Q51' },
      { value: 'share_friends_game', text: "Share the link with friends to confirm its legitimacy", riskScore: 1, nextCodeId: 'M6_Q51' },
      { value: 'secondary_account', text: "Test the link using a secondary or less important account", riskScore: 1, nextCodeId: 'M6_Q51' }
    ],
    tip: "Think about why some offers seem “too good to be true.”",
    tags: {
      occupations: ['Youth', 'Students'],
      ages: ['Under 18', '18-24'],
      sarawakCase: false,
    },
  },
  {
    id: 151,
    codeId: 'M6_Q51',
    text: "After using a paid service to complete an assignment, you receive a threat demanding additional payment or they will report you. How should you respond?",
    category: 'Scams',
    difficulty: 'Medium',
    options: [
      { value: 'pay_blackmail', text: "Pay them", riskScore: 1, nextCodeId: 'M6_Q52' },
      { value: 'report_blackmail', text: "Consider reporting the incident to the proper authorities", riskScore: 0, nextCodeId: 'M6_Q52' },
      { value: 'negotiate_blackmail', text: "Negotiate", riskScore: 1, nextCodeId: 'M6_Q52' },
      { value: 'ignore_blackmail', text: "Ignore completely", riskScore: 1, nextCodeId: 'M6_Q52' }
    ],
    tip: "Reflect on the broader implications of how such situations could escalate.",
    tags: {
      occupations: ['Students'],
      ages: ['18-24'],
      sarawakCase: false,
    },
  },
  {
    id: 152,
    codeId: 'M6_Q52',
    text: "Your computer shows a pop-up warning: “Your device is infected. Call Microsoft Support immediately.” What is the safest action?",
    category: 'Scams',
    difficulty: 'Easy',
    options: [
      { value: 'call_microsoft', text: "Call the number", riskScore: 1, nextCodeId: 'M6_Q53' },
      { value: 'close_browser', text: "Close the browser and ignore the warning", riskScore: 0, nextCodeId: 'M6_Q53' },
      { value: 'pay_antivirus', text: "Pay for the suggested antivirus solution", riskScore: 1, nextCodeId: 'M6_Q53' },
      { value: 'restart_computer', text: "Restart the computer and hope the warning disappears", riskScore: 1, nextCodeId: 'M6_Q53' }
    ],
    tip: "Pop-ups pressuring immediate action often indicate scams. Think about whether the message is consistent with legitimate support practices.",
    tags: {
      occupations: ['General Public', 'Seniors'],
      ages: ['55-64', '65+'],
      sarawakCase: false,
    },
  },
  {
    id: 153,
    codeId: 'M6_Q53',
    text: "You receive a message stating that your Touch ’n Go account has been suspended and asks you to click a link. How should you handle this?",
    category: 'Phishing',
    difficulty: 'Easy',
    options: [
      { value: 'click_tng', text: "Click the link", riskScore: 1, nextCodeId: 'M6_Q54' },
      { value: 'check_app_tng', text: "Open the official app to check the account", riskScore: 0, nextCodeId: 'M6_Q54' },
      { value: 'reply_tng', text: "Reply to the SMS to request clarification", riskScore: 1, nextCodeId: 'M6_Q54' },
      { value: 'share_tng', text: "Forward the message to friends for advice", riskScore: 1, nextCodeId: 'M6_Q54' }
    ],
    tip: "Consider how official communications usually reach users.",
    tags: {
      occupations: ['General Public'],
      ages: ['ALL'],
      sarawakCase: false,
    },
  },
  {
    id: 154,
    codeId: 'M6_Q54',
    text: "After logging into your email on a hotel business center computer, what steps should you take before leaving?",
    category: 'Data Handling & Wi-Fi',
    difficulty: 'Easy',
    options: [
      { value: 'close_browser_hotel', text: "Simply close the browser", riskScore: 1, nextCodeId: 'M6_Q55' },
      { value: 'logout_clear', text: "Log out fully and clear the browser history and cache", riskScore: 0, nextCodeId: 'M6_Q55' },
      { value: 'turn_off_monitor', text: "Turn off the monitor", riskScore: 1, nextCodeId: 'M6_Q55' },
      { value: 'leave_immediately', text: "Leave immediately", riskScore: 1, nextCodeId: 'M6_Q55' }
    ],
    tip: "Public computers can store session data. Think about what information might remain accessible after you finish.",
    tags: {
      occupations: ['Travelers', 'Business'],
      ages: ['ALL'],
      sarawakCase: false,
    },
  },
  {
    id: 155,
    codeId: 'M6_Q55',
    text: "You receive a message: “Hi, is this Mr. Chan? Wrong number, but you seem nice.” What is the safest response?",
    category: 'Scams',
    difficulty: 'Medium',
    options: [
      { value: 'continue_chat', text: "Continue chatting to be polite", riskScore: 1, nextCodeId: 'M6_Q56' },
      { value: 'block_pig', text: "Block the sender", riskScore: 0, nextCodeId: 'M6_Q56' },
      { value: 'ask_who', text: "Ask the sender to clarify their identity", riskScore: 1, nextCodeId: 'M6_Q56' },
      { value: 'send_photo', text: "Share personal details to establish trust", riskScore: 1, nextCodeId: 'M6_Q56' }
    ],
    tip: "Unsolicited friendly messages can be used to build rapport before exploiting victims. Consider the potential risk.",
    tags: {
      occupations: ['General Public'],
      ages: ['ALL'],
      sarawakCase: false,
    },
  },
  {
    id: 156,
    codeId: 'M6_Q56',
    text: "A Word document asks you to “Enable Content” to view an invoice. How should you respond?",
    category: 'Malware',
    difficulty: 'Medium',
    options: [
      { value: 'enable_macros', text: "Enable macros", riskScore: 1, nextCodeId: 'M6_Q57' },
      { value: 'no_macros', text: "Do not enable macros", riskScore: 0, nextCodeId: 'M6_Q57' },
      { value: 'print_doc', text: "Print the document", riskScore: 1, nextCodeId: 'M6_Q57' },
      { value: 'convert_pdf', text: "Convert to PDF", riskScore: 1, nextCodeId: 'M6_Q57' }
    ],
    tip: "Think about what the document is asking you to do and whether it is typical.",
    tags: {
      occupations: ['Office Workers', 'Students'],
      ages: ['ALL'],
      sarawakCase: false,
    },
  },
  {
    id: 157,
    codeId: 'M6_Q57',
    text: "Someone stands unusually close while you are entering your ATM PIN. What is the safest action?",
    category: 'Data Handling & Wi-Fi',
    difficulty: 'Easy',
    options: [
      { value: 'continue_atm', text: "Enter the PIN quickly without shielding", riskScore: 1, nextCodeId: 'M6_Q58' },
      { value: 'cover_keypad', text: "Cover the keypad with your hand while typing", riskScore: 0, nextCodeId: 'M6_Q58' },
      { value: 'ask_move', text: "Ask the person to move back before entering the PIN", riskScore: 1, nextCodeId: 'M6_Q58' },
      { value: 'simple_pin', text: "Change to a simpler PIN to avoid mistakes", riskScore: 1, nextCodeId: 'M6_Q58' }
    ],
    tip: "Physical security is as important as digital security. Protect your input from observation.",
    tags: {
      occupations: ['General Public'],
      ages: ['ALL'],
      sarawakCase: false,
    },
  },
  {
    id: 158,
    codeId: 'M6_Q58',
    text: "You encounter a social media post requesting donations for flood relief, directing contributions to a personal bank account. What should you do?",
    category: 'Scams',
    difficulty: 'Medium',
    options: [
      { value: 'donate_now', text: "Donate immediately", riskScore: 1, nextCodeId: 'M6_Q59' },
      { value: 'verify_ngo', text: "Verify the legitimacy of the request", riskScore: 0, nextCodeId: 'M6_Q59' },
      { value: 'share_post', text: "Share the post", riskScore: 1, nextCodeId: 'M6_Q59' },
      { value: 'donate_crypto', text: "Donate cryptocurrency", riskScore: 1, nextCodeId: 'M6_Q59' }
    ],
    tip: "Think about ways to ensure a charitable request is genuine.",
    tags: {
      occupations: ['General Public'],
      ages: ['ALL'],
      sarawakCase: false,
    },
  },
  {
    id: 159,
    codeId: 'M6_Q59',
    text: "A website prompts you to install a “coupon finder” browser extension. What should you consider before installing?",
    category: 'Malware',
    difficulty: 'Medium',
    options: [
      { value: 'no_risk', text: "No risk", riskScore: 1, nextCodeId: 'M6_Q60' },
      { value: 'read_data', text: "Extensions may access all browsing data", riskScore: 0, nextCodeId: 'M6_Q60' },
      { value: 'slow_browser', text: "Only slows down browser", riskScore: 1, nextCodeId: 'M6_Q60' },
      { value: 'safe_popular', text: "Safe if popular", riskScore: 1, nextCodeId: 'M6_Q60' }
    ],
    tip: "Reflect on how additional software interacts with your information.",
    tags: {
      occupations: ['Online Shoppers'],
      ages: ['ALL'],
      sarawakCase: false,
    },
  },
  {
    id: 160,
    codeId: 'M6_Q60',
    text: "An app requests a clear selfie to provide AI face-swap features. What is the safest approach?",
    category: 'Data Handling & Wi-Fi',
    difficulty: 'Medium',
    options: [
      { value: 'upload_selfie', text: "Upload the selfie", riskScore: 1, nextCodeId: 'END_ALGO' },
      { value: 'review_policy', text: "Review the privacy policy carefully", riskScore: 0, nextCodeId: 'END_ALGO' },
      { value: 'use_friend', text: "Use a friend’s photo", riskScore: 1, nextCodeId: 'END_ALGO' },
      { value: 'ignore_policy', text: "Ignore the privacy terms and proceed", riskScore: 1, nextCodeId: 'END_ALGO' }
    ],
    tip: "Biometric data is highly sensitive. Consider the potential consequences of sharing personal data.",
    tags: {
      occupations: ['Youth', 'General Public'],
      ages: ['18-24', '25-34'],
      sarawakCase: false,
    },
  }
];

module.exports = questions;
