export interface JobListing {
  id: string;
  title: string;
  industry: "data-center" | "it" | "warehouse" | "healthcare" | "cleaning";
  industryLabel: string;
  location: string;
  type: string;
  experience: string;
  salaryRange: string;
  schedule: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
}

export const ALL_JOB_LISTINGS: JobListing[] = [
  {
    id: "dc-01",
    title: "Data Center Operations Technician",
    industry: "data-center",
    industryLabel: "Data Center Operations",
    location: "Westerville / Columbus, OH",
    type: "Direct-Hire • Full-Time",
    experience: "2–4 Years Experience",
    salaryRange: "$28.00 – $36.00 / hr ($58,000 – $75,000 / yr)",
    schedule: "Full-Time • 40 hrs/wk • 12-hr Rotating Shift",
    description:
      "Support mission-critical enterprise server infrastructure, power distributions, server rack installations, and preventative facility maintenance in a state-of-the-art data center facility.",
    responsibilities: [
      "Deploy, mount, cable, and test enterprise server racks, PDUs, and patch panels.",
      "Execute hardware diagnostics, component replacements (RAM, drives, CPU, motherboards), and server decommissioning.",
      "Monitor environmental conditions, airflow management, and power distribution thresholds.",
      "Collaborate with facilities teams on scheduled UPS, generator, and HVAC maintenance cycles.",
      "Maintain strict security protocols, asset tagging, and detailed incident ticket documentation.",
    ],
    requirements: [
      "2+ years of hands-on experience in server hardware, network cabling, or data center environments.",
      "Familiarity with copper/fiber optic cabling (Cat6, Single-mode/Multi-mode) and testing tools.",
      "Basic understanding of Linux/Windows OS commands and BIOS/iDRAC/iLO interfaces.",
      "CompTIA Server+, Network+, or equivalent certifications preferred.",
      "Ability to lift up to 50 lbs and work a rotating 12-hour shift schedule.",
    ],
    benefits: [
      "Direct-hire placement directly onto the employer's permanent payroll from Day 1.",
      "Comprehensive medical, dental, and vision insurance package.",
      "401(k) retirement plan with employer matching.",
      "100% Free candidate placement — zero agency deductions or candidate fees.",
    ],
  },
  {
    id: "dc-02",
    title: "Critical Facility Engineer",
    industry: "data-center",
    industryLabel: "Data Center Operations",
    location: "Columbus Metro, OH",
    type: "Direct-Hire • Full-Time",
    experience: "3+ Years Experience",
    salaryRange: "$38.00 – $48.00 / hr ($79,000 – $100,000 / yr)",
    schedule: "Full-Time • 40 hrs/wk • Day / On-Call Rotation",
    description:
      "Maintain continuous 100% uptime for enterprise data center electrical switchgear, uninterruptible power supply (UPS) systems, diesel backup generators, and chilled-water cooling systems.",
    responsibilities: [
      "Operate, inspect, and troubleshoot electrical distribution switchgear, transformers, and UPS backup systems.",
      "Supervise chilled water loops, CRAC/CRAH units, condensers, and facility BMS automation controls.",
      "Perform preventative maintenance and coordinated vendor testing on emergency diesel generator plants.",
      "Lead emergency response protocol during electrical or mechanical anomalies to maintain zero downtime.",
      "Ensure facility compliance with OSHA, NFPA 70E, and local environmental standards.",
    ],
    requirements: [
      "3+ years of experience in critical facilities operations (data centers, hospitals, power facilities).",
      "Journeyman electrical license, stationary engineer certification, or HVAC/EPA Universal license preferred.",
      "Strong knowledge of Building Management Systems (BMS) and SCADA systems.",
      "Demonstrated ability to follow Standard Operating Procedures (SOPs) and Emergency Operating Procedures (EOPs).",
      "Valid driver's license and clean background check.",
    ],
    benefits: [
      "Direct-hire placement with premier enterprise data center operator.",
      "Full employer healthcare coverage with low employee deductibles.",
      "Generous paid time off (PTO) and paid company holidays.",
      "Tuition and technical certification reimbursement allowances.",
    ],
  },
  {
    id: "it-01",
    title: "Systems Support Specialist",
    industry: "it",
    industryLabel: "Information Technology",
    location: "Westerville, OH (Hybrid)",
    type: "Direct-Hire • Full-Time",
    experience: "1–3 Years Experience",
    salaryRange: "$24.00 – $30.00 / hr ($50,000 – $62,000 / yr)",
    schedule: "Full-Time • Monday – Friday • 8:00 AM – 5:00 PM",
    description:
      "Provide tier-2 corporate desktop support, user account provisioning, hardware deployments, and network connectivity troubleshooting for local and remote enterprise staff.",
    responsibilities: [
      "Diagnose and resolve hardware, software, and peripheral tickets via Jira/ServiceNow.",
      "Configure and deploy laptop and desktop workstations using modern MDM systems (Intune, Jamf).",
      "Manage user accounts, security groups, and access permissions in Active Directory and Microsoft Entra ID.",
      "Troubleshoot VPN, Wi-Fi, audio/video conferencing setups, and local printer integrations.",
      "Maintain hardware inventory logs and execute prompt onboarding/offboarding workflows.",
    ],
    requirements: [
      "1–3 years of experience in desktop support, helpdesk, or corporate IT technician roles.",
      "Proficiency with Windows 11, macOS, Microsoft 365 administration, and Active Directory.",
      "Excellent verbal and written communication skills with strong end-user empathy.",
      "CompTIA A+, Network+, or Microsoft MD-102 certification is a strong plus.",
      "Hybrid flexibility: 3 days on-site in Westerville, 2 days remote.",
    ],
    benefits: [
      "Direct-hire placement with stable corporate enterprise.",
      "Hybrid work schedule and modern tech stack equipment provided.",
      "Comprehensive medical, dental, vision, and disability insurance.",
      "Annual performance bonus and professional development budget.",
    ],
  },
  {
    id: "it-02",
    title: "Network Infrastructure Technician",
    industry: "it",
    industryLabel: "Information Technology",
    location: "Columbus, OH",
    type: "Direct-Hire • Full-Time",
    experience: "2–5 Years Experience",
    salaryRange: "$30.00 – $38.00 / hr ($62,000 – $79,000 / yr)",
    schedule: "Full-Time • Monday – Friday • Flexible hours",
    description:
      "Assist in routing, switching, wireless AP deployments, and corporate network reliability across multi-site enterprise environments and corporate branch offices.",
    responsibilities: [
      "Install and configure Cisco / Aruba switches, routers, firewalls, and wireless access points.",
      "Assist with VLAN configuration, IP subnetting, QoS policies, and port security management.",
      "Utilize network diagnostic analyzers (Wireshark, ping/traceroute, cable certifiers) to isolate bottlenecks.",
      "Collaborate with senior network engineers on site expansions, WAN migrations, and firewall rule updates.",
      "Document network topologies, rack elevations, and physical port patching layouts.",
    ],
    requirements: [
      "2+ years in network administration, infrastructure field support, or NOC operations.",
      "Working knowledge of TCP/IP, DNS, DHCP, BGP, OSPF, and IEEE 802.11 standards.",
      "Cisco CCNA, Aruba ACMA, or Network+ certification preferred.",
      "Hands-on cabling experience with patch panel termination and structured cable standards.",
      "Willingness to travel locally between Columbus metropolitan office sites as needed.",
    ],
    benefits: [
      "Permanent direct-hire position with progressive career advancement.",
      "Competitive compensation package with annual review.",
      "Company mileage reimbursement and mobile phone stipend.",
      "Employer-funded certification exams and continuing education.",
    ],
  },
  {
    id: "wh-01",
    title: "Inventory & Fulfillment Specialist",
    industry: "warehouse",
    industryLabel: "Warehouse & Logistics",
    location: "Westerville / Central Ohio",
    type: "Direct-Hire • Full-Time",
    experience: "1+ Years Experience",
    salaryRange: "$19.00 – $23.00 / hr ($39,500 – $48,000 / yr)",
    schedule: "Full-Time • 40 hrs/wk • 1st or 2nd Shift Available",
    description:
      "Coordinate cycle counts, inbound shipments, RF scanner-based picking, and inventory verification in high-throughput fulfillment and logistics distribution centers.",
    responsibilities: [
      "Perform daily cycle counts and stock audits using handheld RF scanners and WMS software.",
      "Receive, verify, and inspect inbound freight shipments against supplier packing manifests.",
      "Operate walkie stackers, electric pallet jacks, or order pickers safely within designated aisles.",
      "Investigate inventory discrepancies and coordinate stock relocations with dock supervisors.",
      "Stage outgoing pallet loads and ensure wrap, strap, and labeling standards are strictly met.",
    ],
    requirements: [
      "1+ years of warehouse inventory, order picking, or shipping/receiving experience.",
      "Experience with Warehouse Management Systems (SAP, Manhattan, Oracle, or proprietary WMS).",
      "Certified or experienced in operating powered industrial equipment (pallet jacks/reach trucks).",
      "High attention to detail, numerical accuracy, and physical stamina (ability to lift up to 50 lbs).",
      "Strong attendance record and team-oriented approach.",
    ],
    benefits: [
      "Direct-hire placement — permanent company employee from Day 1.",
      "Shift differential pay for second and weekend shifts.",
      "Health, dental, and life insurance after 30 days of employment.",
      "Paid sick days, vacation time, and safety equipment allowance.",
    ],
  },
  {
    id: "wh-02",
    title: "Warehouse Operations Team Lead",
    industry: "warehouse",
    industryLabel: "Warehouse & Logistics",
    location: "Columbus, OH",
    type: "Direct-Hire • Full-Time",
    experience: "3+ Years Experience",
    salaryRange: "$25.00 – $31.00 / hr ($52,000 – $64,500 / yr)",
    schedule: "Full-Time • 40 hrs/wk • Monday – Friday",
    description:
      "Oversee dock schedules, staging efficiency, staff allocation, and compliance with OSHA distribution center standards for a regional distribution facility.",
    responsibilities: [
      "Lead a team of 12–18 warehouse associates across picking, packing, and outbound shipping departments.",
      "Manage daily dock schedules, trailer appointments, and carrier load balance.",
      "Conduct shift kickoff safety huddles and enforce forklift safety regulations and PPE requirements.",
      "Monitor real-time fulfillment KPIs (picks per hour, dock turnaround, order accuracy).",
      "Train new hires on standard work instructions, scanner procedures, and quality expectations.",
    ],
    requirements: [
      "3+ years in warehouse operations with at least 1 year in a supervisory or team lead capacity.",
      "Certified forklift trainer or experienced operator on sit-down and stand-up lifts.",
      "Demonstrated ability to resolve operational roadblocks and motivate warehouse floor staff.",
      "Proficient computer skills in Microsoft Office and WMS inventory reporting.",
      "Bilingual capabilities (English/Spanish) are a plus.",
    ],
    benefits: [
      "Direct-hire supervisory position with clear promotional trajectory.",
      "Comprehensive medical, dental, and vision insurance package.",
      "Quarterly operational bonus eligibility.",
      "Company 401(k) with immediate employer match vesting.",
    ],
  },
  {
    id: "hc-01",
    title: "Healthcare Patient Care Coordinator",
    industry: "healthcare",
    industryLabel: "Healthcare Services",
    location: "Central Ohio Medical Centers",
    type: "Direct-Hire • Full-Time",
    experience: "1–3 Years Experience",
    salaryRange: "$21.00 – $26.00 / hr ($44,000 – $54,000 / yr)",
    schedule: "Full-Time • Monday – Friday • 8:30 AM – 5:00 PM",
    description:
      "Facilitate clinic check-in, patient record coordination, insurance pre-authorization, and compassionate front-desk communication in a multi-specialty outpatient clinic.",
    responsibilities: [
      "Welcome arriving patients, verify demographic information, and coordinate digital intake paperwork.",
      "Process insurance eligibility checks, copays, pre-authorizations, and referral submissions in Epic EHR.",
      "Schedule patient diagnostic consultations, lab appointments, and specialized follow-up visits.",
      "Handle high-volume phone inquiries with empathy, confidentiality, and professional clarity.",
      "Comply strictly with HIPAA privacy regulations and medical center patient rights policies.",
    ],
    requirements: [
      "1–3 years of medical office, patient registration, or healthcare administrative experience.",
      "Familiarity with medical terminology and Electronic Health Record platforms (Epic, Cerner, Athena).",
      "Understanding of major insurance carriers (Medicare, Medicaid, commercial PPO/HMO).",
      "Warm interpersonal manner with exceptional organizational and multi-tasking skills.",
      "High school diploma required; Medical Assistant or administrative healthcare diploma preferred.",
    ],
    benefits: [
      "Permanent direct-hire position with a reputable medical network.",
      "Top-tier hospital system health benefits and prescription plan.",
      "Generous paid time off, paid sick leave, and paid holiday schedule.",
      "Retirement plan with generous employer contribution.",
    ],
  },
  {
    id: "hc-02",
    title: "Clinical Facility Support Specialist",
    industry: "healthcare",
    industryLabel: "Healthcare Services",
    location: "Columbus, OH",
    type: "Direct-Hire • Full-Time",
    experience: "1+ Years Experience",
    salaryRange: "$18.50 – $22.50 / hr ($38,500 – $46,800 / yr)",
    schedule: "Full-Time • 40 hrs/wk • Day / Evening Shifts",
    description:
      "Support hospital department inventory restocking, supply chain distribution, sterile supply transport, and non-clinical patient transport coordination within hospital campuses.",
    responsibilities: [
      "Deliver surgical instruments, sterile supply carts, and medical equipment to operating rooms and nursing floors.",
      "Restock departmental clean supply rooms, medication prep closets, and patient care stations.",
      "Assist with non-clinical wheelchair and stretcher patient escorts for radiology or discharge.",
      "Maintain clean and sanitized transport equipment in accordance with infection prevention standards.",
      "Track inventory par levels using automated hospital supply dispensers (Pyxis / Omnicell).",
    ],
    requirements: [
      "1+ years in healthcare support, hospital distribution, or cleanroom environment.",
      "Current BLS/CPR certification or willingness to obtain upon hire.",
      "Up-to-date immunizations (TB, Hep B, Flu, COVID-19 as required by hospital compliance).",
      "Reliable, compassionate demeanor and comfortable walking on hospital grounds throughout shift.",
      "Clean background check and drug screen.",
    ],
    benefits: [
      "Direct-hire placement with healthcare benefits from Day 1.",
      "Shift differential incentives for evening and weekend rotations.",
      "Tuition assistance for healthcare certifications (CNA, Phlebotomy, MA).",
      "Free on-site parking and hospital cafeteria discounts.",
    ],
  },
  {
    id: "cl-01",
    title: "Commercial Facility Hygiene Lead",
    industry: "cleaning",
    industryLabel: "Cleaning Services",
    location: "Westerville / Corporate Campuses",
    type: "Direct-Hire • Full-Time",
    experience: "2+ Years Experience",
    salaryRange: "$20.00 – $25.00 / hr ($41,600 – $52,000 / yr)",
    schedule: "Full-Time • Monday – Friday • Evening Shift (4 PM – 12:30 AM)",
    description:
      "Ensure corporate office towers, cleanrooms, and commercial suites uphold high-standard sanitation, sterilization, and appearance through team leadership and quality assurance.",
    responsibilities: [
      "Supervise daily sanitation operations for 80,000+ sq ft of corporate office and technology campus space.",
      "Inspect executive conference rooms, break areas, restrooms, and server room anterooms against hygiene audits.",
      "Train janitorial associates on chemical dilution, OSHA SDS sheets, and proper microfiber color-coding.",
      "Oversee inventory of cleaning supplies, commercial floor care machinery, and consumables.",
      "Communicate with property managers on specialized deep-cleaning or seasonal event setups.",
    ],
    requirements: [
      "2+ years of commercial cleaning, janitorial leadership, or hotel housekeeping supervision.",
      "Knowledge of commercial cleaning chemicals, Green Seal standards, and OSHA HazCom regulations.",
      "Experience with floor buffers, auto-scrubbers, and carpet extraction equipment.",
      "Dependable work ethic, attention to detail, and punctuality.",
      "Ability to walk, stand, and lift up to 40 lbs throughout shift.",
    ],
    benefits: [
      "Permanent direct-hire position with consistent year-round hours.",
      "Comprehensive healthcare and dental insurance options.",
      "Paid holidays, vacation days, and uniform/shoe stipend.",
      "Overtime opportunities available at time-and-a-half.",
    ],
  },
  {
    id: "cl-02",
    title: "Industrial Facility Maintenance Associate",
    industry: "cleaning",
    industryLabel: "Cleaning Services",
    location: "Columbus Industrial Parks",
    type: "Direct-Hire • Full-Time",
    experience: "1+ Years Experience",
    salaryRange: "$18.00 – $22.00 / hr ($37,500 – $45,800 / yr)",
    schedule: "Full-Time • 40 hrs/wk • 1st or 2nd Shift",
    description:
      "Perform scheduled deep-cleaning, floor care, waste management, compactor operations, and environmental compliance for major manufacturing and logistics facilities.",
    responsibilities: [
      "Operate ride-on floor scrubbers, pressure washers, and industrial vacuums across warehouse concrete floors.",
      "Empty bulk trash hoppers, operate cardboard compactors, and sort recyclable materials.",
      "Disinfect high-traffic employee locker rooms, cafeterias, and shipping office hubs.",
      "Manage spill response cleanups following facility safety protocols.",
      "Perform basic facility maintenance inspections and report safety hazards to maintenance lead.",
    ],
    requirements: [
      "1+ years in industrial sanitation, warehouse custodial, or facility maintenance.",
      "Experience operating commercial floor scrubbers or willingness to be certified.",
      "Commitment to workplace safety, slip-prevention, and PPE compliance.",
      "Dependable attendance and ability to lift up to 50 lbs.",
      "Valid state ID and reliable transportation.",
    ],
    benefits: [
      "Direct-hire placement on permanent employer payroll.",
      "Competitive hourly wage with weekly direct deposit.",
      "Full health, vision, and life insurance benefits package.",
      "Zero fees or payroll deductions for candidate placement.",
    ],
  },
];

export function getAllJobs(): JobListing[] {
  return ALL_JOB_LISTINGS;
}

export function getJobById(id: string): JobListing | undefined {
  return ALL_JOB_LISTINGS.find((job) => job.id.toLowerCase() === id.toLowerCase());
}

export function getJobsByIndustry(industry: string): JobListing[] {
  if (industry === "all") return ALL_JOB_LISTINGS;
  return ALL_JOB_LISTINGS.filter((job) => job.industry === industry);
}

