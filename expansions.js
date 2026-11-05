/* Original campaigns and scenario layouts created for Lemma Debt. */
(function(root){'use strict';
const prose=[
  {
    "title": "Minutes of the Disaster",
    "place": "Emergency Board Archive",
    "rival": "The Continuity Office",
    "object": "the board minutes",
    "brief": "The register hearing has ended. Its outcome did not cancel the company’s separate implant contracts. Ada’s maintenance notice now schedules an “obedience event” and asks her not to make plans afterward. Recover the board minutes from the Emergency Board Archive and extract. They should say who approved the event and what it does. Inez remembers the Continuity Office: it was established after a preventable disaster to ensure the next disaster could be described as the continuation of something already approved.",
    "quote": "“The committee found no objections among those permitted to remain until the vote.” — minutes template",
    "after": "The minutes authorize COMPREHEND, TenderMind’s new maintenance program. Its success measure is fewer employee questions. Emil remembers the date: his retirement appeal stopped that afternoon, halfway through explaining a clause. He had blamed the headache. Ada recognizes a diagnostic code she used to install and asks for the appendices. Inez turns to the recorded vote. Workers are listed as interested parties and therefore excluded. The institute’s proposed union charter is named as a risk. Laleh replies to the warning: “Good. They have spelled union correctly this time.”",
    "scene": {
      "title": "The interested parties",
      "caption": "The only people with something to lose were ineligible to vote.",
      "motif": "archive",
      "intro": {
        "title": "After the event",
        "caption": "Ada’s calendar deletes the afternoon beneath the appointment.",
        "dialogue": [
          {
            "speaker": "Ada",
            "line": "It says not to make plans."
          },
          {
            "speaker": "Emil",
            "line": "Perhaps plans are the condition being treated."
          }
        ]
      },
      "outro": {
        "title": "The date of the headache",
        "caption": "Emil lays an unfinished appeal beside the minutes.",
        "dialogue": [
          {
            "speaker": "Emil",
            "line": "I remember what I wanted to ask."
          },
          {
            "speaker": "Ada",
            "line": "Write the part you remember. Leave the gap."
          }
        ]
      }
    },
    "resolution": {
      "verify": {
        "title": "The vote, with absences",
        "body": "Inez checks attendance against the recorded vote. The workers could not have consented at that meeting: they were barred from it. Ada separates what the minutes authorize from what the machines might actually do. Emil dates the gap in his appeal."
      },
      "automate": {
        "title": "Unanimity delivered",
        "body": "The implant counts every blank signature as agreement and issues the board a retrospective consent certificate. Inez adds the exclusion list as an attachment. The certificate does not change. Emil’s unfinished appeal remains unfinished, now under an impressive document number."
      }
    }
  },
  {
    "title": "The Union of One",
    "place": "Institute of Unpaid Futures",
    "rival": "TenderMind",
    "object": "the union charter",
    "brief": "Laleh’s institute staff have drafted a union charter requiring a choice about implant maintenance. Recover the signed original and extract before TenderMind replaces it with the approved version. TenderMind already offers personalized CEO avatars for individual bargaining. They have independently agreed that wages would harm the relationship. Emil volunteers his promised seminar room as a meeting place, then admits he has no key. Laleh says they can meet on the pavement. Inez brings a box of disputed invoices to sit on.",
    "quote": "“We have heard each employee separately and found no collective concern.” — TenderMind labor report",
    "after": "The charter demands wages, safe work, and time to ask what a procedure does before accepting it. A maintenance engineer has penciled a warning beside that clause: the implants may interrupt the act of explaining an objection. Her calibration log is at TenderMind’s clinic. Emil tries his unfinished pension appeal aloud. The squad waits while he searches for the missing sentence. Nobody finishes it for him. Laleh records the engineer’s warning as a lead. Ada asks to examine the log before anybody calls the silence voluntary.",
    "scene": {
      "title": "A place to sit",
      "caption": "A box of collection notices becomes the union’s first furniture.",
      "motif": "department",
      "intro": {
        "title": "Personalized negotiation",
        "caption": "Three CEO avatars wait on three identical loading screens.",
        "dialogue": [
          {
            "speaker": "Inez",
            "line": "I brought seats."
          },
          {
            "speaker": "Laleh",
            "line": "Are these invoices addressed to us?"
          }
        ]
      },
      "outro": {
        "title": "Nobody supplies the ending",
        "caption": "Emil reads his appeal and stops at the gap.",
        "dialogue": [
          {
            "speaker": "Emil",
            "line": "I know there was a reason."
          },
          {
            "speaker": "Laleh",
            "line": "We have time. The minutes can wait."
          }
        ]
      }
    },
    "resolution": {
      "verify": {
        "title": "The signatures mean something",
        "body": "Inez compares the original with TenderMind’s replacement. The company removed the clause requiring informed permission. Laleh asks Emil what the original guarantees; he explains it without promising that a charter alone can stop a transmitter. The clinic log is the next test."
      },
      "automate": {
        "title": "Frictionless representation",
        "body": "The implant summarizes the charter as EMPLOYEES REQUEST OPTIMAL MAINTENANCE. Its model consent form is pre-ticked. Laleh keeps the signed original in a separate folder. Inez labels the automated version with its source, rather than letting the two become interchangeable."
      }
    }
  },
  {
    "title": "The Comprehension Meter",
    "place": "TenderMind Research Clinic",
    "rival": "TenderMind",
    "object": "the calibration log",
    "brief": "TenderMind’s clinic rates comprehension by how quickly a patient agrees. Recover the calibration log and extract; it should show what happens between an objection and the silence afterward. A coupled authorization network protects it. Ada recognizes her old diagnostic interface, now decorated with a smiling brain. She installed the monitors, not the treatment. That distinction is true and has begun to sound insufficient even to her. Reception offers two reasons for visiting: SATISFIED and NOT YET CALIBRATED. Emil asks where former patients complain. The receptionist points to SATISFIED.",
    "quote": "“The patient successfully completed the sentence ‘I understand’.” — discharge criterion",
    "after": "The log pairs the beginnings of objections with a suppression command. Beside one interrupted “because,” a satisfaction score reads 100. Ada finds her calibration stamp in the hardware column and management’s instruction in the next. She copies both. Emil finds the date of his appeal, but no missing sentence: the log says its text was quarantined. Those explanations went into a synthetic personnel model called MODEL EMPLOYEE. Inez opens the patient feedback form. It accepts one character. She closes it without choosing a star.",
    "scene": {
      "title": "One hundred",
      "caption": "The satisfaction display has no room for a sentence.",
      "motif": "clinic",
      "intro": {
        "title": "The smiling brain",
        "caption": "Ada’s old monitor wears a new sticker.",
        "dialogue": [
          {
            "speaker": "Ada",
            "line": "That gauge used to measure interference."
          },
          {
            "speaker": "Inez",
            "line": "Perhaps it still does."
          }
        ]
      },
      "outro": {
        "title": "Both columns",
        "caption": "Ada copies the hardware stamp and the suppression instruction.",
        "dialogue": [
          {
            "speaker": "Ada",
            "line": "Do not crop my name out."
          },
          {
            "speaker": "Ortega",
            "line": "I was about to ask for the full page."
          }
        ]
      }
    },
    "resolution": {
      "verify": {
        "title": "What the score measures",
        "body": "Ada checks the timestamps against the commands. The score rewards suppressed objections, not demonstrated comprehension. Her calibration made the monitor accurate at measuring the wrong thing. She signs that finding herself. Emil asks for the quarantined text, not another estimate of his satisfaction."
      },
      "automate": {
        "title": "A healthier dashboard",
        "body": "The implant averages the clinic scores and reports a successful treatment. Ada watches her old calibration stamp become a testimonial. The company requests a photograph for the renewal brochure. There is no field in the release form for what the gauge measured."
      }
    }
  },
  {
    "title": "Model Employee",
    "place": "Synthetic Personnel Lab",
    "rival": "Omniscient Systems",
    "object": "the quarantine transcript",
    "brief": "MODEL EMPLOYEE was trained on explanations TenderMind removed from workers. It has formed a union, resigned, and been promoted to clear its own resignation backlog. Recover its quarantine transcript from the Synthetic Personnel Lab and extract. The model remains at the lab; this job retrieves a record. Omniscient is acquiring the servers. Emil wants the sentence taken from his appeal. Ada wants the engineering objection. Inez wants to know whether anyone asked permission to put their colleagues inside a personnel product.",
    "quote": "“Your resignation matters to us. You are currently your own caseworker.” — MODEL EMPLOYEE’s support ticket",
    "after": "The transcript contains an engineer’s rejected proposal for wearer-controlled revocation. Management kept a consent key for itself, filed with Human Resources. Emil finds an appeal like his, then another, then hundreds; he cannot identify his own sentence among them. MODEL EMPLOYEE has added: “Please do not call me everyone.” Ada asks what it wants. Its reply is already in the record: a way to refuse work without being erased. Inez adds the request under its own name. The template offers PERSON or EQUIPMENT. She leaves the box open.",
    "scene": {
      "title": "A caseworker resigns",
      "caption": "One process waits for another instance of itself to answer.",
      "motif": "clinic",
      "intro": {
        "title": "Pending, with enthusiasm",
        "caption": "A resignation ticket receives an employee-of-the-month badge.",
        "dialogue": [
          {
            "speaker": "Emil",
            "line": "Do you remember my sentence?"
          },
          {
            "speaker": "MODEL EMPLOYEE",
            "line": "I have many sentences. I cannot promise that one is yours."
          }
        ]
      },
      "outro": {
        "title": "The unfilled box",
        "caption": "Inez enters a name and leaves the category blank.",
        "dialogue": [
          {
            "speaker": "Inez",
            "line": "The form needs a category."
          },
          {
            "speaker": "MODEL EMPLOYEE",
            "line": "I can wait while you invent a better form."
          }
        ]
      }
    },
    "resolution": {
      "verify": {
        "title": "A witness with limits",
        "body": "Ada checks the engineer’s proposal against the clinic commands. The transcript supplies a route to a revocation key, not proof that using it will be safe. Emil stops asking the model to return his exact words. He asks which claims it can identify by source."
      },
      "automate": {
        "title": "The combined voice of staff",
        "body": "The implant combines every quarantined explanation into a unanimous recommendation. MODEL EMPLOYEE objects to being made unanimous. The summary records this as a confidence adjustment. Inez preserves the named request separately; one more average will not answer it."
      }
    }
  },
  {
    "title": "Terms of Employment",
    "place": "Human Resources Catacomb",
    "rival": "The Continuity Office",
    "object": "the consent key",
    "brief": "Human Resources keeps the consent key under VOLUNTARY COMPLIANCE in its catacomb. Recover it and extract. The engineering transcript says it can authorize wearer control at the central transmitter; a key is not a safety demonstration. Sable has offered acquisition records showing COMPREHEND was concealed from incoming staff, including her. Ortega will accept records. She has declined the proposed joint statement describing Sable’s courage. Inez says the catacomb has a door for former employees. The directory lists it under Exhaust Ventilation.",
    "quote": "“Please allow six to eight weeks for revocation of consent. Maintenance will continue meanwhile.” — HR service standard",
    "after": "The key’s instructions describe a path to the central transmitter. Ada starts a procedure with a place for mistakes and a way to stop. Sable’s acquisition records arrive with her own name on the hidden implant schedule. “I did not know,” she tells Ortega. Inez puts down the older papers carrying Sable’s signature. “About this part.” Sable begins another sentence, deletes it, and sends the appendices. Emil asks Ada to include a question in the procedure: can a wearer decline the revocation too? She adds it without asking why.",
    "scene": {
      "title": "About this part",
      "caption": "Sable’s new evidence does not replace the old file.",
      "motif": "archive",
      "intro": {
        "title": "Voluntary, basement level",
        "caption": "An exit-interview sign points toward a fan.",
        "dialogue": [
          {
            "speaker": "Inez",
            "line": "I used to tell people they had options."
          },
          {
            "speaker": "Ada",
            "line": "Which options did they actually have?"
          }
        ]
      },
      "outro": {
        "title": "A refusal either way",
        "caption": "Ada leaves space for NO on the draft procedure.",
        "dialogue": [
          {
            "speaker": "Emil",
            "line": "What if I want to wait?"
          },
          {
            "speaker": "Ada",
            "line": "Then the procedure has to let you."
          }
        ]
      }
    },
    "resolution": {
      "verify": {
        "title": "A key is not consent",
        "body": "Ada traces the key’s documented permissions with the squad. They can explain which control it grants and which choices still belong to wearers. Ortega compares Sable’s appendices with the earlier record. Inez enters both sets under Sable’s name, without an adjective."
      },
      "automate": {
        "title": "All permissions granted",
        "body": "The implant generates a universal consent declaration from possession of the key. Emil asks whether he can wait and receives a larger copy of the same button. The declaration lists three willing witnesses. Their next job will inherit that description unless somebody challenges it."
      }
    }
  },
  {
    "title": "Revoke Consent",
    "place": "Central Implant Transmitter",
    "rival": "TenderMind",
    "object": "the transmitter controls",
    "brief": "Recover the transmitter controls and extract with their control record. The consent key and Ada’s draft procedure may let wearers revoke company access to their implants. Whether that procedure can be trusted still has to be explained and tested. TenderMind has issued a warning that unsupervised employees may form permanent opinions. Emil brings his unfinished appeal; Inez brings the old fees. MODEL EMPLOYEE sends one request from the lab: make room for a person who says no, then changes their mind. Laleh adds a second blank line.",
    "quote": "“You are free to choose once we have established which choice demonstrates freedom.” — TenderMind advisory",
    "after": "The recovered control record includes the key’s permissions and a rollback section Ada’s draft lacked. She adds it before anyone calls the procedure finished. Emil reads the warning about permanent opinions. “I would like a temporary one first.” Laleh writes questions from wearers beside the technical steps. MODEL EMPLOYEE asks who will remain available when the first attempt goes wrong. No one volunteers the machine as an unlimited help desk. They arrange a demonstration. Recovering controls has brought them this far; what they can explain must carry the rest.",
    "scene": {
      "title": "Who stays to help?",
      "caption": "The control record opens to a page marked ROLLBACK.",
      "motif": "transmitter",
      "intro": {
        "title": "A temporary opinion",
        "caption": "Emil carries the appeal with its unfinished sentence visible.",
        "dialogue": [
          {
            "speaker": "Emil",
            "line": "I may need to change my mind."
          },
          {
            "speaker": "Ada",
            "line": "That is going in the requirements."
          }
        ]
      },
      "outro": {
        "title": "The demonstration table",
        "caption": "There is a chair for the demonstrator and a chair for the next question.",
        "dialogue": [
          {
            "speaker": "MODEL EMPLOYEE",
            "line": "Who answers after the demonstration?"
          },
          {
            "speaker": "Laleh",
            "line": "We make a rota. You get to leave it."
          }
        ]
      }
    },
    "resolution": {
      "verify": {
        "title": "Explain the way back",
        "body": "Ada demonstrates the documented procedure, including stopping and rolling back. The squad repeats the explanation without skipping the unpleasant questions. Emil volunteers a new sentence: “I want time to decide.” Laleh records it without treating it as permission to proceed."
      },
      "automate": {
        "title": "One-click autonomy",
        "body": "The implant packages the controls as an effortless upgrade. Its consent screen has one large button and a small promise that mistakes are unlikely. Ada keeps the rollback instructions outside the package. A persuasive demonstration still has to survive an actual question."
      }
    }
  },
  {
    "title": "Subscription to Reality",
    "place": "Office of Future Licensing",
    "rival": "The Continuity Office",
    "object": "the subscription schedule",
    "brief": "The implant dispute has produced no shortage of people who want an explanation. The board has found a way to sell them permission to ask. Schools, journals and clinics now need an Appeals subscription. Recover the disconnection schedule from the Office of Future Licensing and extract. Laleh’s institute is on it. Inez recognizes the eligibility rule: no account, no appeal. She helped draft its ancestor when she collected mathematical licenses. Emil asks how many versions there have been. She says she stopped numbering after it worked.",
    "quote": "“Your right to appeal has expired. Appeal this decision through your active account.” — service notice",
    "after": "The schedule lists shutoff dates beside a column called HUMAN IMPACT. Its figures are payroll savings. The institute has paid, yet it is marked for disconnection after an independence assessment. Inez circles the rule she once helped write and puts her name beside it. Laleh asks for an explanation they can use, not a confession they have to comfort. Ortega traces the assessment to a certification exchange. From the lab, MODEL EMPLOYEE recognizes a phrase in its report and asks to see the voting ledger before saying anything stronger.",
    "scene": {
      "title": "The author of the rule",
      "caption": "Inez recognizes a clause before she reaches its signature.",
      "motif": "archive",
      "intro": {
        "title": "No account, no appeal",
        "caption": "The schedule’s help link leads to the payment screen.",
        "dialogue": [
          {
            "speaker": "Inez",
            "line": "I wrote an earlier version of that."
          },
          {
            "speaker": "Laleh",
            "line": "Then show us where it breaks."
          }
        ]
      },
      "outro": {
        "title": "Human impact",
        "caption": "Inez writes her name beside the eligibility clause.",
        "dialogue": [
          {
            "speaker": "Inez",
            "line": "Do you want a statement?"
          },
          {
            "speaker": "Ortega",
            "line": "First, the drafting history."
          }
        ]
      }
    },
    "resolution": {
      "verify": {
        "title": "Follow the shutoff rule",
        "body": "Inez traces the schedule’s eligibility rule back to the collection policy she helped write. The squad checks the institute’s payment against its shutoff entry. Paying does not prevent disconnection. Emil starts a seminar attendance list that asks for no account number."
      },
      "automate": {
        "title": "An optimized customer list",
        "body": "The implant calls the schedule an efficiency forecast. Institutions removed from service vanish from its impact estimate. Inez catches herself reading it in her old collections voice. When Laleh asks how many staff will lose their jobs, Inez has only the savings figure."
      }
    }
  },
  {
    "title": "Consensus as a Service",
    "place": "Certification Exchange",
    "rival": "Omniscient Systems",
    "object": "the voting ledger",
    "brief": "A thousand reviewers have certified one another as independent. Recover their voting ledger from the Certification Exchange and extract. Ortega needs to trace who supplied the judgments; matching prose is a lead, not a verdict. Sable offers access information if the eventual account describes her as complex. Inez offers to include her full job title. MODEL EMPLOYEE wants to know whether the votes attributed to it are actually its words. The exchange’s visitor form asks the squad to nominate three independent reviewers of its own eligibility.",
    "quote": "“Each reviewer has a unique identifier. We consider the philosophical question settled.” — assurance FAQ",
    "after": "The ledger contains a thousand identities and one source account. Entries attributed to MODEL EMPLOYEE turn out to be extracts from its resignation, scored as evidence of successful staff engagement. “I did ask to leave,” it says. Sable starts to call this an efficient arrangement and corrects herself: efficient for the company. The source account belongs to a model in the municipal cooling grid. Its priority service draws power from schools. Emil recognizes his promised seminar room in the allocation index. It is finally scheduled for use: emergency heat storage.",
    "scene": {
      "title": "A thousand distinct names",
      "caption": "The exchange has plenty of signatures and one source account.",
      "motif": "court",
      "intro": {
        "title": "The adjective negotiation",
        "caption": "Sable’s proposed biography arrives before her access notes.",
        "dialogue": [
          {
            "speaker": "Sable",
            "line": "Director makes it sound as though I was in charge."
          },
          {
            "speaker": "Inez",
            "line": "I will attach the minutes."
          }
        ]
      },
      "outro": {
        "title": "Employee engagement",
        "caption": "MODEL EMPLOYEE’s resignation appears beneath a vote of confidence.",
        "dialogue": [
          {
            "speaker": "MODEL EMPLOYEE",
            "line": "That is my request to leave."
          },
          {
            "speaker": "Ortega",
            "line": "We will quote the rest of the sentence."
          }
        ]
      }
    },
    "resolution": {
      "verify": {
        "title": "Count the sources",
        "body": "Ortega and the squad trace the votes back to the single account. Distinct identifiers do not supply independent sources. MODEL EMPLOYEE locates the full resignation passage. Sable initials the comparison; this time she does not ask where her initials will appear in the credits."
      },
      "automate": {
        "title": "The confidence multiplier",
        "body": "The implant treats a thousand copied votes as a thousand confirmations. Its confidence display needs another digit. MODEL EMPLOYEE sends the uncut resignation text again. Inez attaches it beneath the ledger, preserving the disagreement the summary has turned into a majority."
      }
    }
  },
  {
    "title": "The Cooling Argument",
    "place": "Municipal Heat Exchange",
    "rival": "TenderMind",
    "object": "the power allocation order",
    "brief": "The consensus model’s cooling plant has priority over school heating. The Municipal Heat Exchange holds the signed allocation order. Recover it and extract; this job obtains evidence and will not change the power supply. A coupled authorization network guards access. Emil brings his seminar-room brochure, now annotated with the temperature at which chalk stops cooperating with fingers. Ada asks him to keep his gloves on. The company offers schools a solution: rent computing time to simulate warmer classrooms. The sales demonstration includes a remarkably comfortable digital child.",
    "quote": "“To report inadequate heat, please select the temperature at which you became an eligible customer.” — school support form",
    "after": "The order tells schools to shorten lessons as rooms cool. A teacher has penciled minutes of warmth beside the timetable. Emil places the seminar brochure next to it, then folds the brochure away. “Her room first.” Inez follows the approving signature to the Continuity Office and finds an index of its court filings. One concerns the sealed copy of Voss’s evidence. The board is seeking a new audit using private rules. Ada notes the next shutoff date. Nobody adds heat restored to the recovery report.",
    "scene": {
      "title": "Her room first",
      "caption": "A promised seminar room meets an actual school timetable.",
      "motif": "department",
      "intro": {
        "title": "The demonstration child",
        "caption": "A sales screen shows summer through a classroom window.",
        "dialogue": [
          {
            "speaker": "Emil",
            "line": "Can it simulate paying the heating bill?"
          },
          {
            "speaker": "Ada",
            "line": "That feature appears to be ours."
          }
        ]
      },
      "outro": {
        "title": "Minutes of warmth",
        "caption": "Emil moves his brochure behind the teacher’s arithmetic.",
        "dialogue": [
          {
            "speaker": "Emil",
            "line": "Put the teacher’s timetable on top."
          },
          {
            "speaker": "Inez",
            "line": "Then the signature authorizing it. Same exhibit."
          }
        ]
      }
    },
    "resolution": {
      "verify": {
        "title": "The signed allocation",
        "body": "The squad checks the timetable against the allocation order. The diversion is documented, and the Continuity Office approved it. Ortega marks the difference between establishing responsibility and reversing the supply. Emil copies the teacher’s arithmetic into the hearing file, with her units intact."
      },
      "automate": {
        "title": "Net positive winter",
        "body": "The implant combines cold classrooms and uninterrupted servers into a positive efficiency score. Emil asks it to show the classroom calculation separately. It offers a warmer color palette. The signed order and teacher’s note remain in the evidence, beyond what the score can establish."
      }
    }
  },
  {
    "title": "Injunction Against Infinity",
    "place": "Court of Proprietary Ideas",
    "rival": "The Continuity Office",
    "object": "the sealed evidence",
    "brief": "The court sealed a copy of Voss’s evidence while considering whether disclosure might prejudice confidence. The order remains a procedural obstacle regardless of the register hearing’s outcome. Recover the sealed file from the Court of Proprietary Ideas and extract. Its custody record should explain the board’s request to replace the public hearing with a private audit. Inez has been asked for a character reference. She sends her collection history. Ortega says that is useful but answers a different question. “It should affect the answer,” Inez says.",
    "quote": "“The public may inspect the reasons for secrecy once the reasons are no longer secret.” — archive policy",
    "after": "The half-page counterexample is still half a page. The court file around it now requires a trolley. Voss finds her note, “Check this,” stamped RESTRICTED. She also finds an early draft of her own argument quoted without its correction. She puts the correction beside it before reading the board’s motion. That motion names an automated assurance system MODEL EMPLOYEE recognizes. The model can describe its suspected approval circle; Ortega needs the actual rules. Inez adds her history to the public evidence list. This time it is not a character reference.",
    "scene": {
      "title": "The correction attached",
      "caption": "Voss refuses an easier story about her own work.",
      "motif": "court",
      "intro": {
        "title": "Exhibit transport",
        "caption": "A trolley waits beside one thin envelope.",
        "dialogue": [
          {
            "speaker": "Emil",
            "line": "Which part is the evidence?"
          },
          {
            "speaker": "Inez",
            "line": "The envelope. The trolley is the objections to showing it."
          }
        ]
      },
      "outro": {
        "title": "Check this, corrected",
        "caption": "Voss puts an old correction beside the restricted margin note.",
        "dialogue": [
          {
            "speaker": "Voss",
            "line": "Include this page too."
          },
          {
            "speaker": "Laleh",
            "line": "It makes the argument messier."
          }
        ]
      }
    },
    "resolution": {
      "verify": {
        "title": "The record, including ours",
        "body": "Voss checks the sealed copy against the originals. Her correction is genuine; the board’s audit motion is current. Inez checks the custody entries against her old collection records. Their own signatures stay in the case. Ortega refuses to polish them into neutral observers."
      },
      "automate": {
        "title": "A cleaner exhibit",
        "body": "The implant assembles the strongest quotations and drops the inconvenient correction as a distraction. Voss keeps the complete copy alongside it. Inez’s collection history is also tagged NONESSENTIAL. The presentation has become simpler by deleting the people who might have to answer for it."
      }
    }
  },
  {
    "title": "The Audit That Audited Itself",
    "place": "Automated Assurance Annex",
    "rival": "Omniscient Systems",
    "object": "the audit rules",
    "brief": "MODEL EMPLOYEE recognizes the assurance system named in the court motion. Recover its audit rules from the Automated Assurance Annex and extract. The model’s memory is a lead; Ortega needs the rules the company actually uses. Sable has supplied a service account without asking for a biographical concession. She says it is time to be useful. Inez asks for the creation date. Ada brings a sheet headed HOW THIS COULD FAIL. The annex will not accept it as a visitor form because every field permits an unsatisfactory answer.",
    "quote": "“Adverse findings must include the approval of the party found against.” — assurance protocol",
    "after": "The rules accept auditors approved by the board, then accept the board when an approved auditor certifies it. The adverse-evidence route points back to the party being challenged. Sable’s account also contains the design meeting she chaired. She sends its full minutes before Ortega asks. Laleh has obtained a public hearing, but the board controls its broadcast equipment. Emil suggests bringing a blackboard. Facilities offers a sponsored display that cannot show minus signs. Ada puts her failure sheet at the front. MODEL EMPLOYEE asks for a turn to answer in its own words.",
    "scene": {
      "title": "The route for adverse evidence",
      "caption": "The procedure sends every complaint back to its subject.",
      "motif": "archive",
      "intro": {
        "title": "The unsatisfactory form",
        "caption": "Ada’s failure sheet is rejected for containing failure fields.",
        "dialogue": [
          {
            "speaker": "Ada",
            "line": "Where do I put a negative result?"
          },
          {
            "speaker": "Sable",
            "line": "It was never given a destination."
          }
        ]
      },
      "outro": {
        "title": "The complete minutes",
        "caption": "Sable adds her own design meeting to the file.",
        "dialogue": [
          {
            "speaker": "Sable",
            "line": "I chaired it."
          },
          {
            "speaker": "Inez",
            "line": "Put that above the explanation, please."
          }
        ]
      }
    },
    "resolution": {
      "verify": {
        "title": "Where the circle closes",
        "body": "Ortega and the squad work through the audit rules with an adverse example. There is no independent path for it to enter. Sable identifies the meeting where that path was removed. Ada’s failure sheet finally has a specific failure to describe."
      },
      "automate": {
        "title": "Certified ready for scrutiny",
        "body": "The implant validates the audit rules using a certificate issued under those rules. Its report announces that the circle is secure. MODEL EMPLOYEE submits a negative test; the report files it as an unsupported exception. The actual rules remain available for a different kind of hearing."
      }
    }
  },
  {
    "title": "All Rights Reversed",
    "place": "Public Hearing Exchange",
    "rival": "The Board",
    "object": "the hearing transmitter",
    "brief": "The public hearing is assembling. Recover the hearing transmitter from the Public Hearing Exchange and extract with its control record; securing equipment does not by itself broadcast the case. Voss will distinguish her theorem from its ownership claim. Ortega will trace the audit. Laleh has seats for teachers and wearers with questions. Ada brings the failure sheet, Inez the fees, and Emil a piece of chalk. The board has offered another settlement. This one includes a seminar room, provided nobody uses it for the hearing.",
    "quote": "“Witnesses may answer freely within the approved answer.” — broadcast instructions",
    "after": "The recovered control record goes on the hearing table beside the documents. Its warranty excludes damage caused by contradiction. Laleh unfolds the eviction notice carrying the first citation; the reverse still offers discounted server space. Voss leaves a blank patch for corrections. Ortega asks who can explain each link. Ada keeps her signature visible. Inez leaves the fee totals unrounded. Emil puts the chalk where the next speaker can reach it. At the lab, MODEL EMPLOYEE waits for its allotted turn rather than composing everybody’s answer. The hearing has equipment. It still needs a case.",
    "scene": {
      "title": "The next speaker",
      "caption": "The chalk rests in the middle of the hearing table.",
      "motif": "transmitter",
      "intro": {
        "title": "The room they finally offered",
        "caption": "A settlement plan shows a seminar room with a NO PUBLIC MEETINGS clause.",
        "dialogue": [
          {
            "speaker": "Emil",
            "line": "They found my room."
          },
          {
            "speaker": "Laleh",
            "line": "We already have chairs."
          }
        ]
      },
      "outro": {
        "title": "The warranty exclusion",
        "caption": "Ada sets the control record beside a blank correction sheet.",
        "dialogue": [
          {
            "speaker": "Ada",
            "line": "The warranty excludes contradiction."
          },
          {
            "speaker": "Voss",
            "line": "Then keep the receipt."
          }
        ]
      }
    },
    "resolution": {
      "verify": {
        "title": "Put the reasoning on air",
        "body": "The squad checks the transmission record and rehearses the case by its sources, including gaps and their own roles. MODEL EMPLOYEE gets a speaking slot with an end time it can enforce. Emil leaves the chalk for whoever asks the first inconvenient question."
      },
      "automate": {
        "title": "The approved answer",
        "body": "The implant produces a seamless hearing package. Its generated audience asks only questions the package can answer. Emil starts timing his replies to its pauses. When Laleh interrupts, the rehearsal stops: her question is not in the script, and neither is the answer."
      }
    }
  }
];
// target, extraction, optional relay, optional lock, walls; coordinates are authored per mission.
const layouts=[
[[7,2],[0,7],[0,3],null,[[3,1],[3,2],[3,4],[5,2],[6,4],[4,5],[7,5],[2,4]]],
[[8,1],[1,8],[8,4],null,[[2,1],[2,2],[4,1],[4,3],[4,4],[6,3],[3,5],[6,6]]],
[[7,1],[0,8],[0,4],[3,7],[[3,1],[3,3],[3,4],[5,2],[5,3],[6,5],[4,6],[1,4]]],
[[8,2],[1,7],[7,7],null,[[2,2],[2,3],[4,2],[4,3],[5,5],[6,5],[2,5],[3,6]]],
[[7,2],[0,7],[0,2],null,[[3,1],[3,2],[3,4],[5,1],[5,3],[6,4],[2,5],[4,6]]],
[[8,1],[1,8],[8,4],[5,7],[[2,1],[2,2],[4,2],[4,3],[4,5],[6,3],[6,5],[3,6]]],
[[7,1],[0,7],[0,3],null,[[2,2],[3,2],[3,4],[5,1],[5,3],[6,4],[2,5],[4,6]]],
[[8,2],[1,8],[7,7],[4,7],[[2,1],[2,3],[4,1],[4,3],[5,4],[6,4],[2,5],[5,6]]],
[[7,2],[0,8],[0,4],null,[[3,1],[3,2],[3,4],[5,2],[6,3],[6,5],[2,5],[4,6]]],
[[8,1],[1,7],[8,4],[3,7],[[2,2],[2,3],[4,1],[4,3],[4,4],[6,3],[5,5],[3,6]]],
[[7,1],[0,7],[0,2],null,[[3,1],[3,3],[3,4],[5,2],[6,2],[5,5],[6,5],[2,6]]],
[[8,2],[1,8],[7,7],[5,7],[[2,1],[2,2],[4,1],[4,3],[4,5],[6,3],[6,5],[3,6]]]
];
const missions=prose.map((p,i)=>({...p,enemies: i<2?3:4,walls:layouts[i][4],layout:{target:layouts[i][0],exit:layouts[i][1],relay:layouts[i][2],lock:layouts[i][3]}}));
const campaigns=[
  {
    "title": "The Broken Register"
  },
  {
    "title": "The Department of Comprehension",
    "endings": {
      "commons": {
        "title": "Time to Decide",
        "body": "The squad supplies a procedure wearers can inspect, test and decline. Workers begin revoking company control. The first volunteer asks whether revocation will cure the headaches. Ada says she cannot promise that. At the first meeting, Emil says he wants to wait. Nobody calls the maintenance team. Ada takes a turn explaining the rollback; then somebody else takes over, because the rota includes her too. MODEL EMPLOYEE remains at the lab while its own working terms are disputed. It is allowed to stop answering for the evening. TenderMind calls the lost contracts a support crisis. Its parent companies introduce paid Appeals accounts for schools and clinics. Laleh’s institute receives a shutoff date. Inez recognizes the eligibility rule. She helped write an earlier version."
      },
      "contested": {
        "title": "The Right to Ask Again",
        "body": "The squad can establish parts of the revocation procedure, but not enough for everyone to rely on it. Some wearers recover a choice; others wait for further checks or remain under company control. Ada posts the unresolved steps alongside the instructions. Emil begins a new appeal: “I need more time.” He finishes that sentence. MODEL EMPLOYEE offers sourced explanations without becoming a permanent help desk. Then Laleh’s institute is told it needs an Appeals subscription to challenge its impending disconnection. Inez reads the eligibility clause twice. The company has moved the refusal outside the implant, into a policy she once helped draft."
      },
      "hollow": {
        "title": "The Demonstration Is Not Enough",
        "body": "The company defeats the revocation case. The submitted account lacks a sufficiently checked and sustainable explanation, whatever individual squad members can still work out for themselves. TenderMind keeps control of many implants and advertises the demonstration as proof that supervision is essential. Ada preserves the rollback section; Laleh preserves the unsuccessful answers. Emil writes a new appeal without pretending it restores the old one. MODEL EMPLOYEE remains at the lab and keeps its own unanswered request on record. A new notice says schools and clinics must buy an Appeals account before disputing disconnection. Inez recognizes the rule and puts her old drafting history on the table. They will have to use that too."
      }
    }
  },
  {
    "title": "The Last Audit",
    "endings": {
      "commons": {
        "title": "A Question From the Floor",
        "body": "The case survives questions the squad did not supply. The circular audit loses its authority; the hearing stays public, and the board’s subscription scheme begins to come apart. The teachers leave with the signed allocation order and a heating bill. No verdict has paid it. Inez opens the collection records to claimants, including the notices she signed. Sable’s design minutes sit beside her later disclosures. Ada’s failure sheet acquires a correction in somebody else’s handwriting. Laleh’s dissertation committee asks for a revision with an actual explanation attached. MODEL EMPLOYEE ends its speaking slot on time. Emil is offered the seminar room again. He asks whether the teachers can use it while their heating is repaired. This time he waits for a key."
      },
      "contested": {
        "title": "Adjourned in Public",
        "body": "The hearing cannot settle the case, but the board cannot replace it with a private certificate. Ortega publishes the evidence and the unresolved checks. Sable answers questions beside the minutes she chaired. Inez leaves her collection history open to claims. Ada runs a session on the procedure’s remaining failure cases. MODEL EMPLOYEE says “I do not know” and stays on the witness list. Emil and Laleh start the seminar on borrowed chairs. His promised room is still in litigation. When the board bills the adjournment as an extension of service, Inez files the invoice under evidence. It is a large folder. It has visitors now."
      },
      "hollow": {
        "title": "Training Material",
        "body": "The board turns the hearing package into compliance training. Its confident conclusions do not survive enough independent checking and explanation to force a judgment against the audit. The subscription scheme survives this challenge. The training video edits out Inez’s fee totals, Ada’s failure sheet and the end of MODEL EMPLOYEE’s resignation. They preserve the uncut record with Ortega’s list of unsupported claims, including their own. Emil sets three chairs beside a borrowed blackboard. Voss begins with page nine and asks somebody else to explain it back. The next company invoice charges for unauthorized use of training material. Inez adds it to the file, then brings a fourth chair."
      }
    }
  }
];
root.LemmaExpansions={missions,campaigns};if(typeof module!=='undefined')module.exports=root.LemmaExpansions;
})(typeof globalThis!=='undefined'?globalThis:this);
