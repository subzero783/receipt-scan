const siteData = [
  {
    "site_name": "Receipt Scan",
    "site_url": "https://www.receiptscan.org",
    "site_logo": "/assets/images/Receipt_Scan_logo_01.png",
  },
  {
    "social_media": [
      {
        "name": "facebook",
        "link": "/"
      },
      {
        "name": "instagram",
        "link": "/"
      },
      {
        "name": "linkedin",
        "link": "/"
      },
      {
        "name": "tiktok",
        "link": "/"
      }
    ]
  },
  {
    "contact_info": {
      "email": process.env.CONTACT_EMAIL || "contact@receiptscan.org"
    }
  },
  {
    "home_page": {
      "meta_data": {
        "title": "Best AI Receipt Scanner App & Expense Tracker",
        "description": "Ditch the shoebox. Receipt Scan automatically captures, categorizes, and tracks your business and personal expenses using advanced AI. Start your free trial!"
      },
      "hero_section": {
        "title": "Say goodbye to your messy receipt shoebox",
        "subtitle": "Automatically capture and categorize business and personal expenses with AI-powered technology. Transform receipt management from a headache to a one-click solution.",
        "background_image": "/images/hero/Workspace_with_financial_charts_on_tablet_2.jpeg",
        "buttons": [
          {
            "text": "Start Free",
            "link": "/signup"
          },
          {
            "text": "Learn More",
            "link": "/about"
          }
        ]
      },
      "how_it_works": {
        "small_title": "Simple",
        "title": "How it works",
        "subtitle": "Manage expenses with just three easy steps.",
        "boxes": [
          {
            "id": "1",
            "small_title": "Snap",
            "title": "Capture receipts",
            "text": "Quickly photograph, upload or email your receipts.",
            "image": "/how-it-works/capture-receipts.png",
            "link": {
              "url": "/signup",
              "text": "Get started"
            }
          },
          {
            "id": "2",
            "small_title": "AI tag",
            "title": "Smart categorization",
            "text": "Our AI instantly extracts and categorizes expense details.",
            "image": "/how-it-works/smart-categorization.png",
            "link": {
              "url": "/signup",
              "text": "Get started"
            }
          },
          {
            "id": "3",
            "small_title": "Export & Email",
            "title": "Seamless tax preparation",
            "text": "Generate spreadsheet files, export receipt images, and get organized for 1099s or personal itemized deductions in seconds.",
            "image": "/how-it-works/seamless-tax-preparation.png",
            "link": {
              "url": "/signup",
              "text": "Get started"
            }
          }
        ]
      },
      "features": {
        "small_title": "Features",
        "title": "Powerful expense tracking",
        "subtitle": "Designed to simplify financial management for freelancers and small business owners",
        "boxes": [
          {
            "id": "1",
            "title": "Mobile receipt capture",
            "text": "Snap photos of receipts anytime, anywhere",
            "image": "/features/Hand_holding_smartphone_photographing_receipt.jpeg",
            "link": {
              "url": "/",
              "text": "Learn More"
            }
          },
          {
            "id": "2",
            "title": "AI categorization",
            "text": "Intelligent expense classification and tagging",
            "image": "/features/Expense_processing_system_infographic.jpeg",
            "link": {
              "url": "/",
              "text": "Learn More"
            }
          },
          {
            "id": "3",
            "title": "CSV/Excel export",
            "text": "Export your expense data for tax season",
            "image": "/features/Tablet_screen_displays_spreadsheet.jpeg",
            "link": {
              "url": "/",
              "text": "Learn More"
            }
          },
          {
            "id": "4",
            "title": "Email receipts into account",
            "text": "Email receipts to your account and get them imported automatically",
            "image": "/features/Email_inbox_data_visualization.jpeg",
            "link": {
              "url": "/",
              "text": "Learn More"
            }
          },
          {
            "id": "5",
            "title": "Generate invoices",
            "text": "Create professional invoices from your receipts in PDF format",
            "image": "/features/Receipts_to_digital_invoice.jpeg",
            "link": {
              "url": "/",
              "text": "Learn More"
            }
          }, {
            "id": "6",
            "title": "Export and email receipt images and spreadsheets",
            "text": "Images and spreadsheets of receipts can be exported and emailed",
            "image": "/features/Digital_folder_with_receipt_icons.jpeg",
            "link": {
              "url": "/",
              "text": "Learn More"
            }
          }
        ]
      },
      "testimonials": {
        "title": "What our users say",
        "subtitle": "Real experiences from freelancers who transformed their expense tracking",
        "boxes": [
          {
            "star_rating": 5,
            "text": "This app has saved me hours of tedious receipt management. Totally game-changing!",
            "author": "Sarah Martinez",
            "occupation": "Freelance Graphic Designer",
            "image": "/testimonials_users/sarah-martinez.png"
          },
          {
            "star_rating": 5,
            "text": "I can't believe how easy it is to track my business expenses now. Highly recommended!",
            "author": "Michael Chen",
            "occupation": "Independent consultant",
            "image": "/testimonials_users/michael-chen.png"
          },
          {
            "star_rating": 5,
            "text": "Finally, a tool that understands the chaos of freelance financial tracking.",
            "author": "Emma Rodriguez",
            "occupation": "Web developer",
            "image": "/testimonials_users/emma-rodriguez.png"
          }
        ]
      }
    }
  },
  {
    "top_menu": [
      {
        "name": "Home",
        "link": "/"
      },
      {
        "name": "About",
        "link": "/about",
        "guest_only": true
      },
      {
        "name": "Upload",
        "link": "/upload",
        "auth_required": true
      },
      {
        "name": "Dashboard",
        "link": "/dashboard",
        "auth_required": true
      },
      {
        "name": "Blog",
        "link": "/blog"
      },
      {
        "name": "Features",
        "link": "/features",
        "guest_only": true
      },
      {
        "name": "Pricing",
        "link": "/pricing",
        "guest_only": false
      },
      {
        "name": "Contact",
        "link": "/contact",
        "guest_only": false
      }
    ]
  },
  {
    "footer_menu": [
      {
        "menu_name": "Product",
        "menu_items": [
          {
            "name": "Blog",
            "link": "/blog",
            "guest_only": false
          },
          {
            "name": "Features",
            "link": "/features",
            "guest_only": true
          },
          {
            "name": "Pricing",
            "link": "/pricing",
            "guest_only": false
          },
          {
            "name": "Upload",
            "link": "/upload",
            "auth_required": true
          },
          {
            "name": "Dashboard",
            "link": "/dashboard",
            "auth_required": true
          }
        ]
      },
      {
        "menu_name": "Company",
        "menu_items": [
          {
            "name": "About Us",
            "link": "/about",
            "guest_only": true
          },
          {
            "name": "Contact",
            "link": "/contact",
            "guest_only": false
          }
        ]
      },
      {
        "menu_name": "Legal",
        "menu_items": [
          {
            "name": "Privacy Policy",
            "link": "/privacy"
          },
          {
            "name": "Terms of Service",
            "link": "/terms"
          }
        ]
      }
    ]
  },
  {
    "pricing_page": {
      "meta_data": {
        "title": "Pricing Plans | AI Expense Tracking for Everyone",
        "description": "View straightforward pricing plans for Receipt Scan. Start with a 14-day free trial and choose the right AI expense tracking tier for your business or home."
      },
      "hero_section": {
        "small_title": "Simple",
        "title": "Pricing that works for you",
        "subtitle": "Transparent pricing designed for freelancers to manage expenses effortlessly",
        "buttons": [
          {
            "text": "Start Free",
            "link": "/signup",
            "guest_only": true
          }
        ]
      },
      "pricing_plans": {
        "small_title": "Plans",
        "title": "Pricing plans",
        "subtitle": "Choose the perfect plan for your business or household expense tracking.",
        "plans": [
          {
            "small_title": "Free Trial",
            "monthly_price": "0",
            "discount_text": "For 14 Days",
            "includes": [
              "10 Free receipt photo uploads",
              "Advanced AI categorization",
              "Download 2 CSV exports per month",
              "Download 2 Zip folders per month containing receipts",
              "Download 2 Invoice per month",
              "Send 1 email per month containing CSV/ZIP files",
              "Monthly expense summary"
            ],
            "paid": true,
            "button": {
              "text": "Start Free",
              "link": "/signup"
            }
          },
          {
            "small_title": "Pro plan",
            "monthly_price": "20",
            "discount_text": "",
            "includes": [
              "Unlimited receipt photo uploads",
              "Advanced AI categorization",
              "Download unlimited CSV exports",
              "Download unlimited Zip folders containing receipts",
              "Download unlimited Invoice per month",
              "Send unlimited emails per month containing CSV/ZIP files",
              "Priority customer support"
            ],
            "paid": true,
            "button": {
              "text": "Upgrade to Pro",
              "link": "#"
            }
          }
        ]
      },
      "cta": {
        "title": "Need more information?",
        "subtitle": "Our support team is ready to help you choose the right plan",
        "button": {
          "text": "Contact",
          "link": "/"
        }
      }
    }
  },
  {
    "signin_page": {
      "meta_data": {
        "title": "Sign In to Your Account",
        "description": "Log in to your Receipt Scan account to access your automated expense reports, manage digital receipts, and effortlessly prepare for tax season."
      },
      "hero_section": {
        "title": "Sign in to your account",
        "subtitle": "Access your expense tracking and manage your business finances with ease",
        "legal_disclaimer": "By signing in, you agree to our terms of service and privacy policy"
      },
      "cta": {
        "title": "New to our platform?",
        "subtitle": "Create an account to start tracking your business expenses effortlessly",
        "buttons": [
          {
            "text": "Sign Up",
            "link": "/signup"
          },
          {
            "text": "Learn more",
            "link": "/about"
          }
        ]
      }
    }
  },
  {
    "signup_page": {
      "meta_data": {
        "title": "Create an Account",
        "description": "Sign up for Receipt Scan to instantly digitize your receipts. Join thousands of freelancers and individuals saving time with AI-powered bookkeeping."
      },
      "registration": {
        "title": "Create your free account",
        "subtitle": "Get started in minutes and transform how you manage business expenses",
        "legal_disclaimer": "By clicking Sign Up you're confirming that you agree with our Terms and Conditions."
      }
    }
  },
  {
    "faqs": {
      "title": "FAQs",
      "subtitle": "Common questions about our pricing and features",
      "questions": [
        {
          "question": "Is there a free option?",
          "answer": "Yes, we offer a completely free plan with basic receipt tracking and AI categorization. It's perfect for freelancers just getting started."
        },
        {
          "question": "Can I change plans?",
          "answer": "Absolutely. You can upgrade or downgrade your plan at any time with no additional fees or complicated processes."
        },
        {
          "question": "Are there any contracts?",
          "answer": "No long-term contracts. Our monthly and yearly plans are flexible, allowing you to cancel anytime without penalties."
        },
        {
          "question": "How secure is my data?",
          "answer": "We use bank-level encryption and secure cloud storage to protect your financial information. Your data privacy is our top priority."
        }
      ]
    }
  },
  {
    "upload_page": {
      "hero_section": {
        "small_title": "Snap",
        "title": "Upload receipt",
        "subtitle": "Quickly capture and process your business expenses with our AI-powered receipt management tool",
        "buttons": [
          {
            "text": "Upload",
            "link": "#upload"
          },
          {
            "text": "Dashboard",
            "link": "/dashboard"
          }
        ]
      },
      "drag_and_drop_area": {
        "top_text": {
          "small_title": "Easy",
          "title": "Drag and drop your receipt",
          "subtitle": "Simplify your expense tracking with our intuitive upload interface"
        },
        "recent_scans": {
          "small_title": "Review Scans",
          "title": "Check Extracted Data",
          "subtitle": "Review your recently uploaded receipts and their extracted details"
        }
      },
      "how_it_works": {
        "small_title": "Workflow",
        "title": "How Receipt AI Works",
        "subtitle": "Turn physical receipts into digital data in three simple steps.",
        "steps": [
          {
            "id": "1",
            "icon": "cloud-upload",
            "title": "Upload & Digitize",
            "text": "Securely drag and drop your receipt images. We support bulk uploads and all standard formats."
          },
          {
            "id": "2",
            "icon": "robot",
            "title": "Smart Extraction",
            "text": "Our AI engine instantly extracts key data—including Merchant, Date, and Totals—eliminating manual data entry."
          },
          {
            "id": "3",
            "icon": "check-circle",
            "title": "Auto-Categorize & Store",
            "text": "Data is automatically tagged with expense categories and securely archived, ready for search or one-click export."
          }
        ]
      }
    }
  },
  {
    "blog_index": {
      "meta_data": {
        "title": "Receipt Scan Blog | Expense Management & Tax Tips",
        "description": "Explore the Receipt Scan blog for expert insights on freelance tax deductions, expense management trends, and how to organize your finances with AI."
      },
      "hero_section": {
        "small_title": "Blog",
        "title": "Insights and Tips",
        "subtitle": "Explore the latest trends in expense management."
      }
    }
  },
  {
    "about_page": {
      "meta_data": {
        "title": "About Us | The Story Behind Receipt Scan",
        "description": "Learn how Receipt Scan was built by a developer to solve the headache of manual data entry. We value simplicity, data privacy, and user-obsessed design."
      },
      "hero_section": {
        "background_image": "/images/features/Artisan_working_on_physical_project.jpeg",
        "small_title": "Our Mission",
        "title": "Empowering freelancers, creators, and individuals to focus on what matters, not paperwork.",
        "subtitle": "We believe that managing expenses shouldn't cost you your sanity. Receipt Scan was built to help creators, builders, and hustlers reclaim their time from the chaos of receipts.",
        "buttons": [
          {
            "text": "Start",
            "link": "/signup"
          },
          {
            "text": "Learn More",
            "link": "/features"
          }
        ]
      },
      "story_section": {
        "small_title": "Our Origin",
        "title": "It started with a need for better automation",
        "paragraphs": [
          "After years spent engineering high-traffic e-commerce platforms and complex digital systems for various agencies, our founder, Gustavo, recognized a frustrating gap. While he was building seamless, automated digital experiences for clients, managing his own freelance project expenses and tax receipts remained a manual, time-consuming chore.",
          "With an extensive background architecting modern frontend applications and complex API integrations, Gustavo decided to build his own solution. The goal was to create a modern platform that didn't just store files, but utilized AI-driven categorization logic to instantly process and organize receipts the moment they were received.",
          "Today, Receipt Scan leverages advanced technologies to fully automate financial workflows. It empowers freelancers and professionals with a mobile-first, high-utility tool designed to eliminate manual data entry so they can get back to building their business."
        ],
        "image": "/images/features/Hand_holding_receipt_in_front_of_monitor.jpeg",
        "image_alt": "Hand holding receipt in front of monitor",
        "buttons": [
          {
            "text": "Start",
            "link": "/signup"
          },
          {
            "text": "Learn More",
            "link": "/features"
          }
        ]
      },
      "core_values": {
        "small_title": "Our Philosophy",
        "title": "Values we build by",
        "subtitle": "We are guided by a few simple principles that keep us focused on what matters: your time and your peace of mind.",
        "image": "/images/features/Notebook_coffee_cup_and_plant.jpeg",
        "image_alt": "Notebook coffee cup and plant",
        "values": [
          {
            "title": "Simplicity First",
            "description": "If it requires a tutorial, we failed. We build tools that feel invisible so you can focus on your craft.",
            "icon": "sparkles"
          },
          {
            "title": "Data Privacy",
            "description": "Your financial data is yours. We encrypt everything and will never sell your purchase history to advertisers.",
            "icon": "shield"
          },
          {
            "title": "User Obsessed",
            "description": "We don't build for 'enterprises.' We build for the freelancer, the creator, and the one-person shop.",
            "icon": "heart"
          }
        ],
        "buttons": [
          {
            "text": "Start",
            "link": "/signup"
          },
          {
            "text": "Learn More",
            "link": "/features"
          }
        ]
      },
      "cta": {
        "title": "Ready to ditch the receipt chaos",
        "subtitle": "Join thousands of freelancers and agencies saving hours every month.",
        "buttons": [
          {
            "text": "Start",
            "link": "/signup"
          },
          {
            "text": "Learn More",
            "link": "/features"
          }
        ]
      }
    }
  },
  {
    "dashboard_page": {
      "hero_section": {
        "title": "Receipts Dashboard"
      },
      "expense_breakdown_section": {
        "small_title": "Insights",
        "title": "Expense Breakdown",
        "subtitle": "Track spending across key business categories"
      },
      "recent_transactions_section": {
        "small_title": "Recent",
        "title": "Recent Transactions",
        "subtitle": "View and manage all your business expenses in one convenient location. Stay organized and track your spending effortlessly."
      },
      "ai_insights_section": {
        "small_title": "AI Insights",
        "title": "Smart Financial Analysis",
        "subtitle": "Let AI analyze your spending patterns and provide valuable insights."
      }
    }
  },
  {
    "forgot_password_page": {
      "hero_section": {
        "title": "Reset Your Password",
        "success_message": "Check your email! We sent you a link to reset your password."
      }
    }
  },
  {
    "settings_page": {
      "hero_section": {
        "small_title": "Manage",
        "title": "Account Settings",
        "subtitle": "Control your profile, security, and subscription settings with easy-to-use account management tools."
      },
      "manage_subscription": {
        "small_title": "Billing",
        "title": "Manage Subscription",
        "subtitle": "Manage your subscription and billing information here."
      }
    }
  },
  {
    "features_page": {
      "meta_data": {
        "title": "Features | AI Receipt OCR & Automated Tax Prep",
        "description": "Explore Receipt Scan's powerful features: AI categorization, mobile capture, seamless tax prep, and CSV/Excel exports for freelancers and individuals."
      },
      "hero_section": {
        "title": "Everything you need to automate your expense tracking",
        "subtitle": "From AI-powered data extraction to smart financial insights, discover how our platform turns your messy shoebox of receipts into actionable financial data.",
        "background_image": "/images/hero/hero-image.png",
        "buttons": [
          {
            "text": "Start for Free",
            "link": "/signup"
          },
          {
            "text": "See Pricing",
            "link": "/pricing"
          }
        ],
      },
      "receipts_managed_taxes_conquered": {
        "small_title": "Effortless",
        "title": "Receipts managed, taxes conquered",
        "text": "Stop wrestling with paper trails and spreadsheets. Receipt Scan turns chaos into clarity with AI that reads, sorts, and exports your expenses in seconds.",
        "button": {
          "text": "Start for Free",
          "link": "/signup"
        }
      },
      "tools": {
        "small_title": "Core",
        "title": "Three ways Receipt Scan saves your time",
        "subtitle": "From the moment you upload a receipt to the moment your accountant receives clean data, everything happens automatically.",
        "buttons": [
          {
            "text": "Start for Free",
            "link": "/signup"
          },
          {
            "text": "See Pricing",
            "link": "/pricing"
          }
        ],
        "tools": [
          {
            "small_title": "Extraction",
            "title": "Instant data extraction",
            "text": "Advanced OCR reads receipts in seconds, no matter the format.",
            "image": "/images/features_page/Paper_receipt_passing_scanner.jpeg",
            "image_alt": "Paper receipt passing scanner"
          },
          {
            "small_title": "Export",
            "title": "CSV and ZIP exports",
            "text": "Download your extracted data as a CSV for Excel, or export all your receipt images in a single ZIP file for tax season.",
            "image": "/images/features_page/Digital_folder_morphing_into_zip_folder.jpeg",
            "image_alt": "Digital folder morphing into zip folder"
          },
          {
            "small_title": "Email",
            "title": "Email Receipts to Anyone",
            "text": "Send your receipts to anyone, anywhere, and with the attached receipt images and CSV file, they can easily import your receipts into their accounting software.",
            "image": "/images/features_page/Paper_airplane_flying_out_over_envelope.jpeg",
            "image_alt": "Paper airplane flying out over envelope"
          }
        ]
      },
      "extraction_description_section": {
        "small_title": "01 Capture Receipts",
        "title": "Snap a photo, upload a batch, or forward an email",
        "subtitle": "Receipt Scan accepts receipts however you want to send them. Phone photos or emails forwarded to your unique inbound address all work instantly.",
        "image": "/images/features_page/Data_inputs_feeding_cloud_database.jpeg",
        "image_alt": "Data inputs feeding cloud database",
        "buttons": [
          {
            "text": "Start for Free",
            "link": "/signup"
          },
          {
            "text": "See Pricing",
            "link": "/pricing"
          }
        ]
      },
      "categorize_expenses": {
        "small_title": "02 Categorize Expenses",
        "title": "AI learns your spending patterns and sorts automatically",
        "subtitle": "Our system reads more than just numbers. It understands your business and categorizes each expense into the right bucket. Whether classifying a client dinner or your family's weekly groceries, our AI learns your custom categories.",
        "image": "/images/features_page/Receipts_processed_by_AI.jpeg",
        "image_alt": "Receipts processed by AI",
        "buttons": [
          {
            "text": "Start for Free",
            "link": "/signup"
          },
          {
            "text": "See Pricing",
            "link": "/pricing"
          }
        ]
      },
      "export_and_invoice": {
        "small_title": "03 Export and Invoice",
        "title": "Send clean data to your accountant or create invoices",
        "subtitle": "Pull your categorized expenses into CSV, Excel, or PDF invoices. Everything is formatted and ready to use in your accounting software or send directly to clients.",
        "image": "/images/features_page/Digital_dashboard_with_CSV_ZIP_PDF_INVOICE.jpeg",
        "image_alt": "Digital dashboard with CSV ZIP PDF Invoice",
        "buttons": [
          {
            "text": "Start for Free",
            "link": "/signup"
          },
          {
            "text": "See Pricing",
            "link": "/pricing"
          }
        ]
      },
      "capture_data_instantly": {
        "small_title": "Capture",
        "title": "Capture data instantly, no matter where it is",
        "subtitle": "Stop hoarding paper and digging through inboxes. Our advanced OCR technology accurately extracts vendor names, dates, amounts, and taxes from any receipt. Whether you snap a photo on your phone, upload a bulk batch of photos, or forward an email directly to your custom inbound address, Receipt Scan processes it in seconds.",
        "image": "/images/features_page/Smartphone_capturing_receipt.jpeg",
        "image_alt": "Illustration of a smartphone scanning a receipt, alongside PDF and email icons, smoothly transferring data into a central cloud database.",
        "buttons": [
          {
            "text": "Start for Free",
            "link": "/signup"
          },
          {
            "text": "See Pricing",
            "link": "/pricing"
          }
        ]
      },
      "let_ai_do_the_sorting": {
        "small_title": "Organize",
        "title": "Let AI do the sorting for you",
        "subtitle": "Say goodbye to manual data entry. Our proprietary AI doesn't just read your receipts; it understands them. It automatically learns your spending habits and categorizes expenses so your records are always tax-ready. Need custom rules? You can easily train the AI to fit your specific accounting workflow.",
        "image": "/images/features_page/Paper_receipts_processed_by_AI.jpeg",
        "image_alt": "Illustration showing a messy pile of paper receipts passing through an AI processor and emerging as neatly organized, color-coded digital folders.",
        "buttons": [
          {
            "text": "Start for Free",
            "link": "/signup"
          },
          {
            "text": "See Pricing",
            "link": "/pricing"
          }
        ]
      },
      "turn_expenses_into_billable_invoices": {
        "small_title": "Invoice",
        "title": "Turn expenses into billable invoices in seconds",
        "subtitle": "Stop duplicating work. Select any combination of categorized receipts and instantly generate a professional, formatted PDF invoice. Perfect for freelancers passing material costs to clients. Customize the invoice with your logo, add custom tax rates, and download it instantly—ready to send.",
        "image": "/images/features_page/one_click_invoice.jpeg",
        "image_alt": "Dashboard UI illustration demonstrating a list of categorized expenses automatically generating a completed professional PDF invoice.",
        "buttons": [
          {
            "text": "Start for Free",
            "link": "/signup"
          },
          {
            "text": "See Pricing",
            "link": "/pricing"
          }
        ]
      },
      "your_data": {
        "small_title": "Export",
        "title": "Your data, ready for your accountant",
        "subtitle": "Getting your data out of Receipt Scan is as easy as getting it in. Export your categorized expenses as a clean CSV or Excel spreadsheet, perfectly formatted for your accounting software. Need the original files for an audit? Download a ZIP file containing the pristine, original images of every receipt.",
        "image": "/images/features_page/accountant_data_export.jpeg",
        "image_alt": "3D illustration of a glowing CSV spreadsheet and a ZIP archive resting on a modern desk, representing clean and easily exportable financial data.",
        "buttons": [
          {
            "text": "Start for Free",
            "link": "/signup"
          },
          {
            "text": "See Pricing",
            "link": "/pricing"
          }
        ]
      },
      "forward_emails": {
        "small_title": "Export",
        "title": "Forward emails, forget the rest",
        "subtitle": "Every account comes with a unique, secure inbound email address. When you receive an Uber receipt or a software subscription invoice, simply forward it to your Receipt Scan address. Our system automatically parses the email, extracts the receipt attachment, and categorizes the expense before you even log in.",
        "image": "/images/features_page/email_forwarding_automation.jpeg",
        "image_alt": "Illustration showing a digital email receipt being automatically routed from an inbox interface directly into a secure database lockbox.",
        "buttons": [
          {
            "text": "Start for Free",
            "link": "/signup"
          },
          {
            "text": "See Pricing",
            "link": "/pricing"
          }
        ]
      },
      "cta": {
        "title": "Reclaim your time",
        "subtitle": "Stop wrestling with receipts. Start building your business instead.",
        "buttons": [
          {
            "text": "Start",
            "link": "/signup"
          }
        ]
      }
    }
  },
  {
    "terms_page": {
      "hero_section": {
        "title": "Terms of Service",
        "subtitle": "Last updated: March 10, 2026"
      }
    }
  },
  {
    "privacy_policy_page": {
      "hero_section": {
        "title": "Privacy Policy",
        "subtitle": "Last updated: March 10, 2026"
      }
    }
  },
  {
    "contact_page": {
      "meta_data": {
        "title": "Contact Receipt Scan | AI Expense Tracker Support",
        "description": "Have questions about Receipt Scan? Contact our support team for help with your AI receipt scanner, billing inquiries, or general feedback. We are here to help!"
      },
      "hero_section": {
        "title": "Contact Us",
        "subtitle": "We'd love to hear from you. Whether you have a question, need support, or want to share feedback, we're here to help."
      }
    }
  }
];
export default siteData;